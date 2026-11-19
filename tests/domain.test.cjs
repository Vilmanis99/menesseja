const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Use the existing compiler for these pure domain modules; no extra test runtime.
require.extensions[".ts"] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  });
  module._compile(result.outputText, filename);
};
const { latviaDateParts, latviaDateKey } = require("../lib/day-anchor.ts");
const { exampleTransplantDate, seedlingSowingWindow, seedlingPlanHash, readSeedlingPlanHash } = require("../lib/seedling-sowing.ts");
const { gardenWeek } = require("../lib/garden-week.ts");
const { soilReadiness, soilTemperatureFact } = require("../lib/sowing-thresholds.ts");
const { cropById, gardenStartActions, gardenHarvestWindow, harvestEstimate, isGardenDate, plantDateError, plantStatus } = require("../lib/garden.ts");
const { nextSowing } = require("../lib/succession.ts");
const { buildReminders } = require("../lib/reminders.ts");
const { normalizeWeather } = require("../lib/weather.ts");
const { calendarYears, calendarYearFromSlug } = require("../lib/seo.ts");
const { dailyPhaseName, lunarAgeAt, moonForDate, moonIntervalsForMonth, moonPhasesForMonth, nextPrincipalPhases, principalPhasesOnDate } = require("../lib/moon.ts");
const { rigaMoonDayAt } = require("../lib/traditional-moon-day.ts");
const { moonHorizonForDay } = require("../lib/moon-horizon.ts");
const { seasonalLinks, seasonForMonth, monthCalendarHref } = require("../lib/seasonal.ts");
const { track, ANALYTICS_CONSENT_KEY } = require("../lib/analytics.ts");
const { subscribeToNewsletter } = require("../lib/brevo.ts");
const { sowingDay } = require("../lib/biodynamic.ts");
const { adjacentMonth } = require("../lib/seasonal.ts");
const { monthPlan } = require("../lib/month-plan.ts");
const { EMPTY_ARTICLE_FILTERS, matchesArticle, readArticleFilters, articleSearchParams } = require("../lib/article-search.ts");
const { EMPTY_PROBLEM_FILTERS, matchesProblem, readProblemFilters, problemSearchParams, problemSearchText } = require("../lib/problem-search.ts");
const { flowerDirectoryEntries, matchesFlower, readFlowerMonth, readFlowerQuery, flowerSearchParams } = require("../lib/flower-directory.ts");
const { EXTRA_FLOWER_NAMES, FOLK_NAMES } = require("../lib/flower-names.ts");
const { CROPS, cropActivityMeta } = require("../lib/planting-crops.ts");
const { defaultSowingFilters, guideActivities, matchesSowingCrop, readSowingPeriod, setSowingPeriod, sowingGuideHref } = require("../lib/sowing-guide-filter.ts");

test("monthly guide links preserve their time of year and activity independent of the visiting date", () => {
  const november = new Date("2026-11-18T12:00:00Z");
  for (let month = 0; month <= 12; month++) {
    for (const activity of ["sowing", "harvest", "flowering", "all"]) {
      const params = new URL(sowingGuideHref(month, activity), "https://www.menesseja.lv").searchParams;
      assert.deepEqual(readSowingPeriod(params, november), { month, activity });
    }
  }
  const params = new URLSearchParams("menesis=unknown&darbiba=unknown&utm_source=guide");
  assert.deepEqual(readSowingPeriod(params, november), { month: 11, activity: "sowing" });
  setSowingPeriod(params);
  assert.equal(params.toString(), "utm_source=guide");
});

test("crop soil advice distinguishes direct sowing from transplanting and preserves exact boundaries", () => {
  const cropFact = (id) => soilTemperatureFact(CROPS.find((crop) => crop.id === id));
  assert.equal(cropFact("gurki").activity, "sowOutdoors");
  assert.equal(soilReadiness("gurki", 15).ready, false);
  assert.equal(soilReadiness("gurki", 15.1).ready, true);
  assert.equal(cropFact("paprika").activity, "transplant");
  assert.equal(cropFact("paprika").greenhouse, true);
  assert.equal(soilReadiness("paprika", 15).ready, true);
  assert.equal(soilReadiness("tomati", 13.9).ready, false);
  assert.equal(soilReadiness("tomati", 14).ready, true);
  assert.equal(cropFact("selerijas"), undefined);
});

test("soil temperature uses only the modeled reading for the current hour", () => {
  const forecast = {
    current: { time: "2027-05-15T10:15", temperature_2m: 22, weather_code: 2 },
    hourly: { time: ["2027-05-15T09:00", "2027-05-15T10:00"], temperature_2m: [21, 22] },
    daily: { time: ["2027-05-15"], temperature_2m_min: [8], temperature_2m_max: [24], weather_code: [2] },
  };
  const withSoil = (soil) => ({ ...forecast, hourly: { ...forecast.hourly, soil_temperature_6cm: soil } });
  for (const soil of [undefined, null, [], [16], [16, null], [16, NaN], [16, Infinity]]) {
    const weather = normalizeWeather(withSoil(soil));
    assert.equal(weather.soilC, null);
    assert.equal(weather.airC, 22);
    assert.equal(weather.daily[0].max, 24);
  }
  for (const [soil, expected] of [[0, 0], [-2.26, -2.3], [12.34, 12.3]]) {
    assert.equal(normalizeWeather(withSoil([16, soil])).soilC, expected);
  }
  const later = { ...forecast.current, time: "2027-05-15T11:15" };
  assert.equal(normalizeWeather({ ...withSoil([16, 12]), current: later }).soilC, null);
});

test("frost guidance uses available hourly air readings within the 18-hour forecast", () => {
  const time = Array.from({ length: 21 }, (_, hour) => `2027-05-15T${String(hour).padStart(2, "0")}:00`);
  const forecast = {
    current: { time: "2027-05-15T02:15", temperature_2m: 0, weather_code: 0 },
    hourly: { time },
    daily: { time: ["2027-05-15"], temperature_2m_min: [-4], temperature_2m_max: [15], weather_code: [0] },
  };
  const withAir = (temps) => ({ ...forecast, hourly: { time, temperature_2m: temps } });
  for (const temps of [undefined, null, [], [-2, -3], Array(21).fill(null), Array(21).fill(NaN)]) {
    assert.equal(normalizeWeather(withAir(temps)).minTonightC, null);
  }
  for (const expected of [9.5, 0, -0.4]) {
    const temps = Array(21).fill(null);
    temps[1] = -5; // already passed
    temps[19] = expected; // last hour in the forecast interval
    temps[20] = -7; // after the interval
    assert.equal(normalizeWeather(withAir(temps)).minTonightC, expected);
  }
  const later = { ...forecast.current, time: "2027-05-16T02:15" };
  assert.equal(normalizeWeather({ ...withAir(Array(21).fill(-4)), current: later }).minTonightC, null);
});

test("seedling dates reflect both range endpoints, counting germination only for ages from emergence", () => {
  const weeks = { min: "6", max: "8" };
  const fromSowing = seedlingSowingWindow("2027-06-01", weeks);
  const fromEmergence = seedlingSowingWindow("2027-06-01", weeks, { min: "5", max: "10" });
  assert.deepEqual(fromSowing, { earliest: new Date("2027-04-06"), latest: new Date("2027-04-20") });
  assert.deepEqual(fromEmergence, { earliest: new Date("2027-03-27"), latest: new Date("2027-04-15") });
  const oneWeek = { min: "1", max: "1" };
  for (const [transplant, sowing] of [["2028-02-29", "2028-02-22"], ["2027-01-01", "2026-12-25"], ["2027-03-29", "2027-03-22"]]) {
    assert.deepEqual(seedlingSowingWindow(transplant, oneWeek), { earliest: new Date(sowing), latest: new Date(sowing) });
  }
});

test("seedling calculator rejects impossible dates and incomplete or inverted durations", () => {
  const weeks = { min: "1", max: "2" };
  for (const date of ["", "0000-06-01", "0001-01-01", "2027-02-29", "2027-04-31", "2026-13-01", "2027-6-01", "2027-06-01T23:00:00Z"]) {
    assert.ok(seedlingSowingWindow(date, weeks).error, date);
  }
  for (const value of ["", "0", "1.5", "-2", "1e1", "53"]) {
    assert.ok(seedlingSowingWindow("2027-06-01", { min: value, max: value }).error, value);
  }
  assert.ok(seedlingSowingWindow("2027-06-01", { min: "8", max: "6" }).error);
  assert.ok(seedlingSowingWindow("2027-06-01", weeks, { min: "9", max: "4" }).error);
  assert.ok(seedlingSowingWindow("2027-06-01", weeks, { min: "", max: "10" }).error);
  assert.ok(seedlingSowingWindow("2027-06-01", weeks, { min: "1", max: "366" }).error);
});

test("the next example June date uses Riga's day across winter and the start of June", () => {
  for (const instant of ["2026-11-18T10:00:00Z", "2026-12-31T22:30:00Z", "2027-06-01T20:59:59Z"]) {
    assert.equal(exampleTransplantDate(new Date(instant)), "2027-06-01");
  }
  assert.equal(exampleTransplantDate(new Date("2027-06-01T21:00:00Z")), "2028-06-01");
});

test("October sowing excludes carrots and beets while their harvest stays discoverable", () => {
  const filters = defaultSowingFilters(new Date("2026-10-27T12:00:00Z"));
  assert.equal(filters.month, 10);
  assert.equal(filters.activity, "sowing");
  const sowing = CROPS.filter((crop) => matchesSowingCrop(crop, filters)).map((crop) => crop.id);
  for (const id of ["burkani", "bietes", "tomati", "kirbji", "krizantemas"]) assert.ok(!sowing.includes(id), id);
  for (const id of ["kiploki", "tulpes"]) assert.ok(sowing.includes(id), id);
  const harvest = CROPS.filter((crop) => matchesSowingCrop(crop, { ...filters, activity: "harvest" }));
  for (const id of ["burkani", "bietes"]) assert.ok(harvest.some((crop) => crop.id === id), id);
  assert.ok(harvest.every((crop) => crop.category !== "pukes"));
  assert.deepEqual(guideActivities(CROPS.find((crop) => crop.id === "krizantemas"), 10, "flowering"), ["harvest"]);
});

test("weekly garden tasks merge overlapping periods and roll over at Riga Monday midnight", () => {
  const sunday = gardenWeek(new Date("2026-11-22T21:59:59Z"));
  assert.equal(latviaDateKey(sunday.start), "2026-11-16");
  assert.equal(latviaDateKey(sunday.end), "2026-11-22");
  const overlapping = sunday.tasks.filter((task) => task.section.id === "razas-glabasana");
  assert.equal(overlapping.length, 1);
  assert.equal(latviaDateKey(overlapping[0].start), "2026-11-16");
  assert.equal(latviaDateKey(overlapping[0].end), "2026-11-22");
  const monday = gardenWeek(new Date("2026-11-22T22:00:00Z"));
  assert.equal(latviaDateKey(monday.start), "2026-11-23");
  assert.equal(latviaDateKey(monday.end), "2026-11-29");
});

test("a New Year garden week draws tasks from each dated month and its actual days", () => {
  const plan = gardenWeek(new Date("2027-01-01T12:00:00Z"));
  assert.equal(latviaDateKey(plan.start), "2026-12-28");
  assert.equal(latviaDateKey(plan.end), "2027-01-03");
  assert.deepEqual([...new Set(plan.tasks.map((task) => `${task.year}-${task.month}`))], ["2026-12", "2027-1"]);
  for (const task of plan.tasks) {
    assert.equal(latviaDateKey(task.start), task.month === 12 ? "2026-12-28" : "2027-01-01");
    assert.equal(latviaDateKey(task.end), task.month === 12 ? "2026-12-31" : "2027-01-03");
  }
});

test("root-crop sowing and harvest remain distinct through all twelve months", () => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  for (const [id, sow, harvest] of [["burkani", [4, 5, 6], [7, 8, 9, 10]], ["bietes", [5, 6], [8, 9, 10]]]) {
    const crop = CROPS.find((item) => item.id === id);
    assert.deepEqual(months.filter((month) => guideActivities(crop, month, "sowing").length), sow);
    assert.deepEqual(months.filter((month) => guideActivities(crop, month, "harvest").length), harvest);
  }
  const tomato = CROPS.find((crop) => crop.id === "tomati");
  assert.deepEqual(guideActivities(tomato, 3, "sowing"), ["sowIndoors"]);
  assert.deepEqual(guideActivities(tomato, 6, "sowing"), ["transplant"]);
  for (const month of [1, 12]) assert.ok(CROPS.every((crop) => guideActivities(crop, month, "sowing").length === 0));
});

test("annual planning, categories and Latvian search do not bypass the selected season", () => {
  const filters = { month: 10, activity: "sowing", category: "all", query: "BURKANI" };
  const carrot = CROPS.find((crop) => crop.id === "burkani");
  assert.equal(matchesSowingCrop(carrot, filters), false);
  assert.equal(matchesSowingCrop(carrot, { ...filters, month: 0 }), true);
  assert.equal(matchesSowingCrop(carrot, { ...filters, month: 0, category: "pukes" }), false);
  const geranium = CROPS.find((crop) => crop.id === "pelargonijas");
  assert.equal(matchesSowingCrop(geranium, { ...filters, month: 0, query: "geranijas" }), true);
  assert.deepEqual(guideActivities(carrot, 13, "all"), []);
  assert.deepEqual(guideActivities(carrot, -1, "all"), []);
});

test("bulbs, tubers and winter garlic are labeled as planting rather than sowing", () => {
  for (const id of ["kiploki", "kartupeli", "topinamburs", "sipoli", "peonijas", "tulpes", "narcises", "ranunkuli", "dalijas", "gladiolas", "lilijas", "krokusi", "hiacintes"]) {
    assert.equal(cropActivityMeta(CROPS.find((crop) => crop.id === id), "sowOutdoors").label, "Stādīt laukā", id);
  }
  assert.equal(cropActivityMeta(CROPS.find((crop) => crop.id === "burkani"), "sowOutdoors").label, "Sēt laukā");
  const garlic = CROPS.find((crop) => crop.id === "kiploki");
  assert.equal(garlic.name, "Ziemas ķiploki");
  assert.match(garlic.note, /Vasaras ķiplokus stāda agrā pavasarī/);
  assert.deepEqual(guideActivities(garlic, 4, "sowing"), []);
  assert.equal(cropActivityMeta(CROPS.find((crop) => crop.id === "tulpes"), "harvest").label, "Ziedēšana");
});

test("the guide defaults to the Riga month at month and year boundaries", () => {
  assert.equal(defaultSowingFilters(new Date("2026-09-30T21:30:00Z")).month, 10);
  assert.equal(defaultSowingFilters(new Date("2026-10-31T22:30:00Z")).month, 11);
  assert.equal(defaultSowingFilters(new Date("2026-12-31T22:30:00Z")).month, 1);
});

test("flower names resolve folk and botanical searches without counting topic pages as plants", () => {
  const flowers = fs.readdirSync(path.join(__dirname, "../content/flowers")).map((file) => JSON.parse(fs.readFileSync(path.join(__dirname, "../content/flowers", file), "utf8")));
  const entries = flowerDirectoryEntries(flowers);
  assert.equal(entries.length, flowers.length - 1 + EXTRA_FLOWER_NAMES.length);
  assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length);
  assert.equal(entries.some((entry) => entry.name === "Balkona puķes"), false);
  for (const [query, name] of [["PUJENES", "Peonijas"], ["jurgines", "Dālijas"], ["Paeonia", "Peonijas"], ["kreimenes", "Maijpuķītes (kreimenes)"], ["Hylotelephium", "Čīkstenes"], ["leduspukes", "Leduspuķes (ilgziedu begonijas)"]]) {
    assert.ok(entries.filter((entry) => matchesFlower(entry, query)).some((entry) => entry.name === name), query);
  }
  for (const alias of FOLK_NAMES) assert.ok(entries.some((entry) => matchesFlower(entry, alias.folk)), alias.folk);
  const indoor = entries.filter((entry) => matchesFlower(entry, "istabas pukes nosaukumi"));
  assert.deepEqual(indoor.map((entry) => entry.name), ["Amarillis", "Ziemassvētku kaktuss", "Ziemassvētku zvaigzne"]);
  assert.deepEqual(entries.filter((entry) => matchesFlower(entry, "telpaugi")), indoor);
  const images = JSON.parse(fs.readFileSync(path.join(__dirname, "../content/images.json"), "utf8"));
  for (const [index, query] of ["hipeastrs", "slumbergera", "puansetija"].entries()) {
    const entry = indoor[index];
    assert.ok(matchesFlower(entry, query) && matchesFlower(entry, entry.latin));
    const slug = entry.href.replace(/^\/raksti\//, "");
    const article = JSON.parse(fs.readFileSync(path.join(__dirname, "../content/articles", slug + ".json"), "utf8"));
    assert.ok(images[entry.image.id].license && article.body.some((section) =>
      section.image?.id === entry.image.id || section.images?.some((image) => image.id === entry.image.id)));
  }
  assert.equal(entries.filter((entry) => matchesFlower(entry, "pujenes neeksistējošs")).length, 0);
  const ledus = entries.find((entry) => entry.name.startsWith("Leduspuķes"));
  assert.equal(ledus.href, "/pukes/begonijas");
  assert.match(ledus.latin, /^Begonia /);
  assert.ok(entries.findIndex((entry) => entry.name === "Čīkstenes") < entries.findIndex((entry) => entry.name === "Dālijas"));
  const search = flowerSearchParams("  pujenes  ", "?utm_source=test&q=vecs");
  assert.equal(readFlowerQuery(search), "pujenes");
  assert.equal(flowerSearchParams("", search), "utm_source=test");
  assert.equal(readFlowerQuery("?q=" + "a".repeat(200)).length, 120);
});

test("flower bloom months combine with names and keep unrelated URL parameters", () => {
  const guides = ["sniegpulkstenites", "maijpukites"].map((slug) =>
    JSON.parse(fs.readFileSync(path.join(__dirname, "../content/flowers", slug + ".json"), "utf8")));
  const entries = flowerDirectoryEntries(guides);
  const snowdrop = entries.find((entry) => entry.id === "sniegpulkstenites");
  const lily = entries.find((entry) => entry.id === "maijpukites");
  const noGuide = entries.find((entry) => entry.name === "Alises");
  assert.ok(matchesFlower(snowdrop, "sniegbalta", 3));
  assert.ok(matchesFlower(lily, "kreimenes", 5));
  assert.ok(!matchesFlower(lily, "kreimenes", 2));
  assert.ok(matchesFlower(noGuide, "Lobularia") && !matchesFlower(noGuide, "Lobularia", 5));
  const url = flowerSearchParams("kreimenes", "?utm_source=kalendars", 5);
  assert.equal(readFlowerMonth(url), 5);
  assert.equal(readFlowerQuery(url), "kreimenes");
  assert.equal(readFlowerMonth(flowerSearchParams("Convallaria", url)), 5);
  assert.equal(flowerSearchParams("", url, 0), "utm_source=kalendars");
  assert.equal(readFlowerMonth("menesis=invalid"), 0);
});

test("pest search combines Latvian names, host plants and type filters with restorable URLs", () => {
  const problem = JSON.parse(fs.readFileSync(path.join(__dirname, "../content/kaitekli/tiklerces.json"), "utf8"));
  const item = { type: problem.type, searchText: [problem.name, problem.latin, ...problem.affects, ...problem.signs].join(" ") };
  assert.ok(matchesProblem(item, { query: "TIKLERCES", type: "kaiteklis" }));
  assert.ok(matchesProblem(item, { query: problem.affects[0], type: "visi" }));
  assert.equal(matchesProblem(item, { query: "tīklērces", type: "slimiba" }), false);
  assert.equal(matchesProblem(item, { query: "tīklērces neeksistējošs", type: "visi" }), false);
  const filters = { query: "balts aplikums", type: "slimiba" };
  const search = problemSearchParams(filters, "?utm_source=test&veids=visi&q=vecs");
  assert.deepEqual(readProblemFilters(search), filters);
  assert.equal(problemSearchParams(EMPTY_PROBLEM_FILTERS, search), "utm_source=test");
  assert.deepEqual(readProblemFilters("?veids=nezināms"), EMPTY_PROBLEM_FILTERS);
  assert.equal(readProblemFilters("?q=" + "a".repeat(200)).query.length, 120);
  for (const [query, slug] of [["balts aplikums", "miltrasa"], ["tīkls", "tiklerces"], ["lipigas lapas", "laputis"], ["lipigas lapas", "baltblusina"]]) {
    const guide = JSON.parse(fs.readFileSync(path.join(__dirname, `../content/kaitekli/${slug}.json`), "utf8"));
    assert.ok(matchesProblem({ type: guide.type, searchText: problemSearchText(guide) }, { ...EMPTY_PROBLEM_FILTERS, query }), `${query} should find ${slug}`);
  }
});

test("article search finds Latvian keyboard variants, reordered words and editorial aliases", () => {
  const dahlia = JSON.parse(fs.readFileSync(path.join(__dirname, "../content/articles/ka-glabat-dalijas-ziema.json"), "utf8"));
  const searchable = { ...dahlia, searchTerms: [dahlia.primaryQuery, ...(dahlia.aliases ?? [])] };
  for (const query of ["DĀLIJU GLABĀŠANA", "daliju glabasana", "glabasana, daliju", "  dāliju   pārziemināšana  "]) {
    assert.ok(matchesArticle(searchable, { ...EMPTY_ARTICLE_FILTERS, query }), query);
  }
  assert.equal(matchesArticle(searchable, { ...EMPTY_ARTICLE_FILTERS, query: "dāliju tomāti" }), false);
  assert.equal(matchesArticle(searchable, { ...EMPTY_ARTICLE_FILTERS, category: "Problēmas" }), false);
  const seasonal = { ...searchable, seasonalMonths: [10, 11] };
  assert.ok(matchesArticle(seasonal, { ...EMPTY_ARTICLE_FILTERS, month: 11 }));
  assert.equal(matchesArticle(seasonal, { ...EMPTY_ARTICLE_FILTERS, month: 4 }), false);
});

test("article filter URLs survive navigation, reject invalid filters and preserve campaign tags", () => {
  const filters = { query: "dāliju glabāšana", category: "Praktiski", month: 11 };
  const categories = ["Visi", "Praktiski", "Problēmas"];
  const search = articleSearchParams(filters, "?utm_source=test&menesis=marts&q=vecs&kategorija=Pamati");
  assert.deepEqual(readArticleFilters(search, categories), filters);
  assert.equal(new URLSearchParams(search).get("utm_source"), "test");
  assert.equal(articleSearchParams(EMPTY_ARTICLE_FILTERS, search), "utm_source=test");
  assert.deepEqual(readArticleFilters("?menesis=13&kategorija=nav", categories), EMPTY_ARTICLE_FILTERS);
  assert.equal(readArticleFilters("?q=" + "a".repeat(200), categories).query.length, 120);
  for (let month = 1; month <= 12; month++) {
    const next = { ...EMPTY_ARTICLE_FILTERS, month };
    assert.deepEqual(readArticleFilters(articleSearchParams(next), categories), next);
  }
});

test("daily advice respects the season even on a fruit day and across Riga New Year", () => {
  const october = sowingDay(new Date("2026-10-26T10:00:00Z"));
  assert.equal(october.part, "augli");
  assert.match(october.advice, /ķiplokus un tulpes/);
  assert.doesNotMatch(october.advice, /tomāti|pupas|ķirbji/);
  assert.match(sowingDay(new Date("2026-11-10T10:00:00Z")).advice, /glabāto ražu/);
  assert.match(sowingDay(new Date("2026-12-31T22:30:00Z")).advice, /dīgtspēju/);
  assert.equal(adjacentMonth(2026, 12, 1).href, "/kalendars/2027/janvaris");
  assert.equal(adjacentMonth(2027, 1, -1).href, "/kalendars/2026/decembris");
  const snapshot = new Date("2026-11-18T10:00:00Z");
  assert.deepEqual(adjacentMonth(2027, 12, 1, snapshot), { year: 2028, month: 1, href: "/ko-set/janvaris", isCalendar: false });
  assert.equal(adjacentMonth(2025, 1, -1, snapshot).isCalendar, false);
  assert.equal(adjacentMonth(2026, 12, 1, snapshot).isCalendar, true);
  assert.equal(adjacentMonth(2027, 12, 1, new Date("2027-01-01T10:00:00Z")).isCalendar, true);
  for (let month = 1; month <= 12; month++) {
    assert.ok(monthPlan(month).prepare && monthPlan(month).supplies);
  }
  assert.throws(() => monthPlan(13), RangeError);
});

// Independent USNO UTC fixtures, including DST and near-midnight events.
// https://aa.usno.navy.mil/calculated/moon/phases?year=2026
// https://aa.usno.navy.mil/calculated/moon/phases?year=2027
const USNO = [
  [0, "2026-01-18T19:52:00Z"], [1, "2026-01-26T04:47:00Z"],
  [2, "2026-02-01T22:09:00Z"], [0, "2026-03-19T01:23:00Z"],
  [1, "2026-03-25T19:18:00Z"], [2, "2026-04-02T02:12:00Z"],
  [2, "2026-05-01T17:23:00Z"], [2, "2026-05-31T08:45:00Z"],
  [2, "2026-06-29T23:56:00Z"], [3, "2026-07-07T19:29:00Z"],
  [0, "2026-08-12T17:37:00Z"], [2, "2026-09-26T16:49:00Z"],
  [0, "2026-10-10T15:50:00Z"], [1, "2026-10-18T16:12:00Z"],
  [2, "2026-10-26T04:12:00Z"], [3, "2026-11-01T20:28:00Z"],
  [0, "2026-12-09T00:52:00Z"], [3, "2026-12-30T18:59:00Z"],
  [0, "2027-01-07T20:24:00Z"], [2, "2027-02-20T23:23:00Z"],
  [3, "2027-03-30T00:54:00Z"], [0, "2027-04-06T23:51:00Z"],
  [2, "2027-04-20T22:27:00Z"], [0, "2027-08-31T17:41:00Z"],
  [0, "2027-09-30T02:36:00Z"], [2, "2027-09-15T23:03:00Z"],
  [0, "2027-12-27T20:12:00Z"],
];

test("principal phase instants agree with 27 independent USNO fixtures within two minutes", () => {
  for (const [quarter, iso] of USNO) {
    const expected = new Date(iso);
    const { year, month } = latviaDateParts(expected);
    const phase = moonPhasesForMonth(year, month).find((p) => p.frac === quarter / 4 && Math.abs(p.date - expected) < 120_000);
    assert.ok(phase, `Missing or inaccurate phase ${quarter}: ${iso}`);
    assert.equal(latviaDateKey(phase.date), latviaDateKey(expected), iso);
  }
});

test("lunar intervals preserve the same year-crossing event instants on December and January calendars", () => {
  const decemberPhases = moonPhasesForMonth(2026, 12);
  const december = moonIntervalsForMonth(2026, 12, decemberPhases);
  const january = moonIntervalsForMonth(2027, 1);
  const shared = december.at(-1);
  assert.deepEqual(shared, january[0]);
  assert.equal(shared.waxing, false);
  assert.equal(shared.start, decemberPhases.find((phase) => phase.frac === 0.5).date);
  assert.deepEqual(shared.end, moonPhasesForMonth(2027, 1).find((phase) => phase.frac === 0).date);
  assert.ok(Math.abs(shared.start - Date.parse("2026-12-24T01:28:00Z")) < 120_000);
  assert.ok(Math.abs(shared.end - Date.parse("2027-01-07T20:24:00Z")) < 120_000);
});

test("lunar intervals follow USNO turns on both sides of the Riga clock change", () => {
  for (const [month, before, after] of [
    [3, "2026-03-19T01:23:00Z", "2026-04-02T02:12:00Z"],
    [10, "2026-10-10T15:50:00Z", "2026-10-26T04:12:00Z"],
  ]) {
    const waxing = moonIntervalsForMonth(2026, month).find((period) =>
      period.waxing && Math.abs(period.start - Date.parse(before)) < 120_000);
    assert.ok(waxing);
    assert.ok(Math.abs(waxing.end - Date.parse(after)) < 120_000);
  }
});

test("lunar intervals support two full moons, a February with no new moon and all archive months", () => {
  assert.deepEqual(moonIntervalsForMonth(2026, 5).map((period) => period.waxing), [true, false, true, false]);
  const february = moonIntervalsForMonth(2033, 2);
  assert.equal(february.length, 2);
  assert.deepEqual(february.map((period) => [latviaDateKey(period.start), latviaDateKey(period.end)]), [
    ["2033-01-31", "2033-02-14"], ["2033-02-14", "2033-03-01"],
  ]);
  for (const year of [2025, 2026, 2027]) for (let month = 1; month <= 12; month++) {
    const phases = moonPhasesForMonth(year, month);
    const periods = moonIntervalsForMonth(year, month, phases);
    assert.deepEqual(periods.slice(1).map((period) => period.start), phases.filter((phase) => phase.frac === 0 || phase.frac === 0.5).map((phase) => phase.date));
    for (let i = 1; i < periods.length; i++) {
      assert.deepEqual(periods[i].start, periods[i - 1].end);
      assert.notEqual(periods[i].waxing, periods[i - 1].waxing);
    }
  }
});

test("lunar intervals exclude a period ending exactly at Riga midnight and include a one-millisecond overlap", () => {
  for (const [month, midnight] of [[12, "2026-11-30T22:00:00Z"], [7, "2026-06-30T21:00:00Z"]]) {
    const phases = moonPhasesForMonth(2026, month);
    const index = phases.findIndex((phase) => phase.frac === 0 || phase.frac === 0.5);
    const boundary = new Date(midnight);
    phases[index] = { ...phases[index], date: boundary };
    const at = moonIntervalsForMonth(2026, month, phases);
    assert.deepEqual(at[0].start, boundary);
    phases[index] = { ...phases[index], date: new Date(boundary.getTime() + 1) };
    const after = moonIntervalsForMonth(2026, month, phases);
    assert.equal(after.length, at.length + 1);
    assert.deepEqual(after[0].end, phases[index].date);
  }
});

test("lunar age matches USNO new moons and counts complete elapsed hours across the year boundary", () => {
  // US Naval Observatory phase tables give conjunction times in UTC, rounded to the minute.
  const cases = [
    ["2026-11-18T10:00:00Z", "2026-11-09T07:02:00Z", 9, 2],
    ["2026-12-24T10:00:00Z", "2026-12-09T00:52:00Z", 15, 9],
    ["2027-01-01T10:00:00Z", "2026-12-09T00:52:00Z", 23, 9],
    ["2027-01-08T00:30:00Z", "2027-01-07T20:24:00Z", 0, 4],
  ];
  for (const [instant, expectedNewMoon, days, hours] of cases) {
    const age = lunarAgeAt(new Date(instant));
    assert.ok(Math.abs(age.newMoon.getTime() - Date.parse(expectedNewMoon)) < 120_000, instant);
    assert.deepEqual([age.days, age.hours], [days, hours], instant);
  }
});

test("lunar age resets at the calendar's exact conjunction and counts full hours from that instant", () => {
  for (const [year, month] of [[2026, 11], [2026, 12], [2027, 1]]) {
    const event = moonPhasesForMonth(year, month).find((phase) => phase.frac === 0).date;
    const before = lunarAgeAt(new Date(event.getTime() - 1));
    assert.ok(before.newMoon < event && before.days >= 29);
    for (const [delta, days, hours] of [[0, 0, 0], [1, 0, 0], [3_599_999, 0, 0], [3_600_000, 0, 1], [86_400_000, 1, 0]]) {
      const age = lunarAgeAt(new Date(event.getTime() + delta));
      assert.deepEqual(age, { newMoon: event, days, hours });
    }
  }
});

test("lunar age crosses Riga midnight, daylight saving transitions and a February without a new moon", () => {
  const beforeMidnight = lunarAgeAt(new Date("2026-11-08T21:59:59.999Z"));
  const afterMidnight = lunarAgeAt(new Date("2026-11-08T22:00:00.000Z"));
  assert.deepEqual(afterMidnight, beforeMidnight);
  for (const start of ["2026-03-28T12:00:00Z", "2026-10-24T12:00:00Z"]) {
    const before = lunarAgeAt(new Date(start));
    const after = lunarAgeAt(new Date(Date.parse(start) + 86_400_000));
    assert.deepEqual(after, { ...before, days: before.days + 1 });
  }
  // Riga has two January conjunctions in 2033 and none during February.
  const january = moonPhasesForMonth(2033, 1).filter((phase) => phase.frac === 0);
  assert.equal(january.length, 2);
  assert.deepEqual(lunarAgeAt(new Date("2033-02-28T22:00:00Z")).newMoon, january[1].date);
});

test("Riga lunar day resets at conjunction and changes at the same instant as the moonrise table", () => {
  const december = moonPhasesForMonth(2026, 12).find((phase) => phase.frac === 0).date;
  const november = lunarAgeAt(new Date(december.getTime() - 1)).newMoon;
  assert.ok(rigaMoonDayAt(new Date(december.getTime() - 1), november) >= 29);
  assert.equal(rigaMoonDayAt(december, december), 1);
  const firstRise = moonHorizonForDay("2026-12-09", 56.95, 24.11).rises[0];
  assert.equal(rigaMoonDayAt(new Date(firstRise.getTime() - 1), december), 1);
  assert.equal(rigaMoonDayAt(firstRise, december), 2);
  assert.equal(rigaMoonDayAt(new Date(firstRise.getTime() + 1), december), 2);
  const novemberRise = moonHorizonForDay("2026-11-18", 56.95, 24.11).rises[0];
  assert.equal(rigaMoonDayAt(new Date(novemberRise.getTime() - 1), november), 9);
  assert.equal(rigaMoonDayAt(novemberRise, november), 10);
});

test("Riga lunar day counts only rises after conjunction and spans civil days without a rise", () => {
  const january = moonPhasesForMonth(2027, 1).find((phase) => phase.frac === 0).date;
  const rise = moonHorizonForDay("2027-01-07", 56.95, 24.11).rises[0];
  assert.ok(rise < january);
  assert.equal(rigaMoonDayAt(new Date("2027-01-07T23:30:00Z"), january), 1);
  const start = new Date("2026-11-02T22:00:00.000Z");
  const end = new Date("2026-11-03T21:59:59.999Z");
  const october = lunarAgeAt(start).newMoon;
  assert.deepEqual(moonHorizonForDay("2026-11-03", 56.95, 24.11).rises, []);
  assert.equal(rigaMoonDayAt(start, october), rigaMoonDayAt(end, october));
});

test("Riga lunar day follows the rise on both daylight saving transition dates", () => {
  for (const key of ["2026-10-25", "2027-03-28"]) {
    const rise = moonHorizonForDay(key, 56.95, 24.11).rises[0];
    const newMoon = lunarAgeAt(rise).newMoon;
    const before = rigaMoonDayAt(new Date(rise.getTime() - 1), newMoon);
    assert.equal(rigaMoonDayAt(rise, newMoon), before + 1);
    assert.equal(rigaMoonDayAt(new Date(rise.getTime() + 1), newMoon), before + 1);
  }
});

test("a month includes both full moons and events on the correct Riga date", () => {
  assert.deepEqual(moonPhasesForMonth(2026, 5).filter((p) => p.frac === 0.5).map((p) => latviaDateParts(p.date).day), [1, 31]);
  assert.equal(latviaDateParts(moonPhasesForMonth(2026, 10).find((p) => p.frac === 0).date).day, 10);
  assert.equal(latviaDateParts(moonPhasesForMonth(2026, 6).find((p) => p.frac === 0.5).date).day, 30);
  assert.equal(latviaDateParts(moonPhasesForMonth(2027, 2).find((p) => p.frac === 0.5).date).day, 21);
});

test("all supported months contain ordered, unique events belonging to that Latvian month", () => {
  for (const year of [2025, 2026, 2027]) for (let month = 1; month <= 12; month++) {
    const phases = moonPhasesForMonth(year, month);
    assert.ok(phases.length >= 3 && phases.length <= 5);
    phases.forEach((p, i) => {
      assert.equal(latviaDateParts(p.date).month, month);
      assert.equal(latviaDateParts(p.date).year, year);
      if (i) assert.ok(p.date > phases[i - 1].date);
    });
  }
});

test("daily phase is consistent within a Riga day and next events start after the requested instant", () => {
  assert.deepEqual(moonForDate(new Date("2026-10-05T22:30:00Z")), moonForDate(new Date("2026-10-06T18:00:00Z")));
  const from = new Date("2026-10-10T16:00:00Z");
  assert.equal(nextPrincipalPhases(from)[0].name, "Pirmais ceturksnis");
  assert.ok(nextPrincipalPhases(from).every((p) => p.date > from));
});

test("today's full moon remains visible before and after its instant, but not on adjacent Riga days", () => {
  for (const iso of ["2026-10-25T22:30:00Z", "2026-10-26T20:00:00Z"]) {
    const full = principalPhasesOnDate(new Date(iso)).find((p) => p.frac === 0.5);
    assert.ok(full, iso);
    assert.ok(Math.abs(full.date - new Date("2026-10-26T04:12:00Z")) < 120_000);
  }
  assert.equal(principalPhasesOnDate(new Date("2026-10-26T22:30:00Z")).length, 0);
  assert.ok(principalPhasesOnDate(new Date("2027-02-20T23:30:00Z")).some((p) => p.frac === 0.5));
});

test("exact phase names appear only on their astronomical Riga dates", () => {
  const phases = moonPhasesForMonth(2026, 11);
  const eventDates = new Map(phases.map((event) => [latviaDateKey(event.date), event.name]));
  const principalNames = new Set(eventDates.values());
  for (let day = 1; day <= 30; day++) {
    const date = new Date(Date.UTC(2026, 10, day, 10));
    const expected = eventDates.get(latviaDateKey(date));
    const label = dailyPhaseName(moonForDate(date), principalPhasesOnDate(date)[0]);
    if (expected) assert.equal(label, expected);
    else assert.ok(!principalNames.has(label), `${latviaDateKey(date)}: ${label}`);
  }
  const labelAt = (iso) => {
    const date = new Date(iso);
    return dailyPhaseName(moonForDate(date), principalPhasesOnDate(date)[0]);
  };
  assert.equal(labelAt("2026-10-25T10:00:00Z"), "Gandrīz pilns mēness");
  assert.equal(labelAt("2026-12-23T10:00:00Z"), "Gandrīz pilns mēness");
  assert.notEqual(labelAt("2026-11-23T21:59:00Z"), "Pilns mēness");
  assert.equal(labelAt("2026-11-23T22:01:00Z"), "Pilns mēness");
  assert.equal(labelAt("2026-11-24T21:59:00Z"), "Pilns mēness");
  assert.notEqual(labelAt("2026-11-24T22:01:00Z"), "Pilns mēness");
});

test("Riga month/year and calendar links roll over independently of server timezone", () => {
  const newYear = new Date("2026-12-31T22:30:00Z");
  assert.equal(latviaDateKey(newYear), "2027-01-01");
  assert.equal(monthCalendarHref(4, newYear), "/kalendars/2027/aprilis");
  assert.equal(monthCalendarHref(4, new Date("2028-01-01T10:00:00Z")), "/kalendars/2028/aprilis");
});

test("spring and summer remain discoverable and every curated destination exists", () => {
  assert.equal(seasonForMonth(3), "pavasaris");
  assert.equal(seasonForMonth(7), "vasara");
  assert.equal(seasonForMonth(10), "rudens");
  assert.equal(seasonForMonth(1), "ziema");
  assert.ok(seasonalLinks(3).some((l) => l.href === "/pukes/kas-zied/pavasari"));
  assert.ok(seasonalLinks(7).some((l) => l.href === "/pukes/kas-zied/vasara"));
  assert.ok(seasonalLinks(10).some((l) => l.href === "/pukes/kas-zied/rudeni"));
  for (let month = 1; month <= 12; month++) for (const link of seasonalLinks(month)) {
    if (link.href.startsWith("/raksti/")) {
      assert.ok(fs.existsSync(path.join(__dirname, "..", "content", "articles", `${link.href.slice(8)}.json`)), link.href);
    } else if (/^\/pukes\/[^/#]+(?:#parziemosana)?$/.test(link.href)) {
      const [slug, anchor] = link.href.slice(7).split("#");
      const flowerFile = path.join(__dirname, "..", "content", "flowers", `${slug}.json`);
      assert.ok(fs.existsSync(flowerFile), link.href);
      if (anchor) assert.ok(JSON.parse(fs.readFileSync(flowerFile, "utf8")).winter?.trim(), link.href);
    } else {
      assert.ok(["/pukes/kas-zied/pavasari", "/pukes/kas-zied/vasara", "/pukes/kas-zied/rudeni"].includes(link.href), link.href);
    }
  }
});

test("analytics respects consent and queues Google's arguments objects with seasonal context", () => {
  const previousWindow = global.window;
  let consent = "denied";
  global.window = {
    localStorage: { getItem: (key) => key === ANALYTICS_CONSENT_KEY ? consent : null },
    location: { pathname: "/ko-set/marts" },
  };
  try {
    track("garden_activated", { crop_id: "burkani" });
    assert.equal(window.dataLayer, undefined);
    consent = "granted";
    track("garden_activated", { crop_id: "burkani" });
    const queued = window.dataLayer[0];
    assert.equal(Object.prototype.toString.call(queued), "[object Arguments]");
    assert.equal(queued[0], "event");
    assert.equal(queued[1], "garden_activated");
    assert.equal(queued[2].crop_id, "burkani");
    assert.equal(queued[2].page_path, "/ko-set/marts");
    assert.equal(queued[2].garden_month, latviaDateParts().month);
    assert.equal(queued[2].garden_season, seasonForMonth(latviaDateParts().month));
    window.localStorage.getItem = () => { throw new Error("blocked storage"); };
    track("garden_return");
    assert.equal(window.dataLayer.length, 1);
  } finally { global.window = previousWindow; }
});

test("Brevo bad requests are errors, not proof of an already-confirmed contact", async () => {
  const previousFetch = global.fetch;
  const previousKey = process.env.BREVO_API_KEY;
  const previousTemplate = process.env.BREVO_DOI_TEMPLATE_ID;
  process.env.BREVO_API_KEY = "test-key";
  process.env.BREVO_DOI_TEMPLATE_ID = "1";
  try {
    global.fetch = async () => new Response(JSON.stringify({ code: "invalid_parameter" }), { status: 400 });
    assert.equal(await subscribeToNewsletter("test@example.com"), "error");
    global.fetch = async () => new Response("{}", { status: 201 });
    assert.equal(await subscribeToNewsletter("test@example.com"), "pending-confirmation");
    global.fetch = async () => { throw new Error("network failure"); };
    assert.equal(await subscribeToNewsletter("test@example.com"), "error");
  } finally {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.BREVO_API_KEY; else process.env.BREVO_API_KEY = previousKey;
    if (previousTemplate === undefined) delete process.env.BREVO_DOI_TEMPLATE_ID; else process.env.BREVO_DOI_TEMPLATE_ID = previousTemplate;
  }
});

test("evergreen month links choose the next occurrence within the published calendar", () => {
  const november = new Date("2026-11-18T10:00:00Z");
  assert.equal(monthCalendarHref(1, november), "/kalendars/2027/janvaris");
  assert.equal(monthCalendarHref(11, november), "/kalendars/2026/novembris");
  assert.equal(monthCalendarHref(12, november), "/kalendars/2026/decembris");
  assert.equal(monthCalendarHref(10, new Date("2026-10-31T21:59:00Z")), "/kalendars/2026/oktobris");
  assert.equal(monthCalendarHref(10, new Date("2026-10-31T22:00:00Z")), "/kalendars/2027/oktobris");
  assert.equal(monthCalendarHref(1, new Date("2027-12-01T10:00:00Z")), "/kalendars/2028/janvaris");
});

test("the calendar keeps archives and opens the next planning year at Riga New Year", () => {
  const before = new Date("2026-12-31T21:59:59Z");
  const after = new Date("2026-12-31T22:00:00Z");
  assert.deepEqual(calendarYears(before), [2025, 2026, 2027]);
  assert.deepEqual(calendarYears(after), [2025, 2026, 2027, 2028]);
  assert.equal(calendarYearFromSlug("2028", before), null);
  assert.equal(calendarYearFromSlug("2028", after), 2028);
  assert.equal(calendarYearFromSlug("2025", after), 2025);
  for (const slug of ["2024", "2029", "02026", "2026.0", "2.026e3", "foo"]) {
    assert.equal(calendarYearFromSlug(slug, after), null);
  }
  const snapshot = new Date("2027-11-18T10:00:00Z");
  assert.deepEqual([1, 2, 3].map((offset) => adjacentMonth(2027, 11, offset, snapshot).href), [
    "/kalendars/2027/decembris", "/kalendars/2028/janvaris", "/kalendars/2028/februaris",
  ]);
});

test("a harvest interval starts at the documented event and includes both endpoints", () => {
  const now = new Date("2026-08-01T12:00:00Z");
  const tomato = { id: "tomato", cropId: "tomati", area: "Siltumnīca", sownOn: "2026-03-25" };
  assert.equal(gardenHarvestWindow(tomato, now), null);
  const planted = { ...tomato, plantedOn: "2026-06-01" };
  const dates = (plant) => {
    const { earliest, latest } = gardenHarvestWindow(plant, now);
    return [earliest, latest].map((day) => day.toISOString().slice(0, 10));
  };
  assert.deepEqual(dates(planted), ["2026-08-05", "2026-08-30"]);
  assert.deepEqual(dates({ ...planted, cropId: "paprika" }), ["2026-08-10", "2026-08-20"]);
  const radish = { id: "radish", cropId: "rediisi", area: "Dobe", sownOn: "2026-04-01" };
  assert.deepEqual(dates(radish), ["2026-04-26", "2026-05-06"]);
  assert.ok(plantStatus(radish, new Date("2026-04-25T20:50:00Z")).progress < 100);
  assert.equal(plantStatus(radish, new Date("2026-04-25T21:10:00Z")).progress, 100);
  assert.equal(plantStatus(radish, new Date("2026-05-07T11:00:00Z")).progress, null);
});

test("unknown, invalid and future dates cannot become personalized forecasts or succession dates", () => {
  const now = new Date("2026-05-15T10:00:00Z");
  const tomato = { id: "old", area: "Dobe", cropId: "tomati", sownAt: "2020-01-01" };
  for (const data of [{}, { plantedOn: null }, { plantedOn: "2026-02-31" }, { plantedOn: "2026-08-10" }]) {
    assert.equal(gardenHarvestWindow({ ...tomato, ...data }, now), null);
    assert.equal(plantStatus({ ...tomato, ...data }, now).progress, null);
    assert.match(harvestEstimate({ ...tomato, ...data }, now), /jūlijs–septembris/);
  }
  assert.ok(plantDateError({ sownOn: "2026-05-10" }, "planted", "2026-05-01", "2026-05-15"));
  assert.ok(plantDateError({ plantedOn: "2026-05-10" }, "sown", "2026-05-11", "2026-05-15"));
  assert.equal(plantDateError({ plantedOn: "2026-05-10" }, "sown", "2026-05-10", "2026-05-15"), null);
  assert.equal(isGardenDate("2024-02-29", "2026-05-15"), true);
  assert.equal(isGardenDate("2026-02-29", "2026-05-15"), false);
  const radish = { ...tomato, cropId: "rediisi" };
  assert.equal(nextSowing(radish, now), null);
  assert.equal(nextSowing({ ...radish, plantedOn: "2026-05-01" }, now), null);
  assert.equal(nextSowing({ ...radish, sownOn: "2026-05-01" }, now).date.toISOString().slice(0, 10), "2026-05-15");
  assert.equal(gardenHarvestWindow({ ...radish, cropId: "gurki", sownOn: "2026-04-05" }, now), null);
});

test("personal reminders depend on the recorded event, not a fixed percentage or the old creation date", () => {
  const tomato = { id: "t", area: "Dobe", cropId: "tomati", sownOn: "2026-03-15" };
  const reminders = (plant, day) => buildReminders({
    plants: [plant], region: { lastFrostDate: { month: 5, day: 15 }, name: "Pierīga", lastFrost: "15. maijs" },
    weather: null, date: new Date(day + "T10:00:00Z"),
  }).map((entry) => entry.id);
  assert.ok(reminders(tomato, "2026-06-05").includes("transplant-t"));
  assert.ok(!reminders({ ...tomato, cropId: "gurki" }, "2026-06-05").includes("transplant-t"));
  assert.ok(!reminders({ ...tomato, plantedOn: "2026-06-01" }, "2026-06-05").includes("transplant-t"));
  assert.ok(!reminders({ ...tomato, plantedOn: "2026-06-01" }, "2026-07-30").includes("harvest-t"));
  assert.ok(reminders({ ...tomato, plantedOn: "2026-06-01" }, "2026-08-15").includes("harvest-t"));
  assert.ok(!reminders({ ...tomato, plantedOn: "2026-06-01" }, "2026-09-15").includes("harvest-t"));
  const legacy = { ...tomato, sownOn: null, sownAt: "2020-01-01" };
  assert.ok(!reminders(legacy, "2026-08-15").includes("harvest-t"));
  assert.deepEqual(gardenStartActions(cropById("tomati")), ["sown", "planted"]);
  assert.deepEqual(gardenStartActions(cropById("rediisi")), ["sown"]);
  assert.deepEqual(gardenStartActions(cropById("kiploki")), ["planted"]);
});

test("saved sowing plans round trip names, dates and the selected counting method", () => {
  const plan = {
    transplant: "2027-05-15", weeks: { min: "10", max: "12" }, fromEmergence: true,
    days: { min: "5", max: "9" }, name: "Selerijas & paprika + Šķirne #1",
  };
  const hash = seedlingPlanHash(plan);
  assert.ok(hash.startsWith("#sejas-kalkulators?"));
  assert.deepEqual(readSeedlingPlanHash(hash), plan);
  const fromSowing = { ...plan, fromEmergence: false };
  const directHash = seedlingPlanHash(fromSowing);
  assert.ok(!directHash.includes("digsana"));
  assert.deepEqual(readSeedlingPlanHash(directHash), { ...fromSowing, days: { min: "", max: "" } });
  assert.equal(readSeedlingPlanHash(seedlingPlanHash({ ...plan, name: "Ņ".repeat(80) })).name.length, 80);
});

test("incomplete, duplicate or impossible saved settings cannot restore unintended sowing dates", () => {
  for (const hash of [
    "#sejas-kalkulators", "#cita-sadala?datums=2027-02-01&nedelas=4-6",
    "#sejas-kalkulators?datums=2027-02-29&nedelas=4-6",
    "#sejas-kalkulators?datums=2027-05-15&nedelas=8-4",
    "#sejas-kalkulators?datums=2027-05-15&nedelas=4-6&digsana=",
    "#sejas-kalkulators?datums=2027-05-15&nedelas=4-6&digsana=1-366",
    "#sejas-kalkulators?datums=2027-05-15&nedelas=4-6&nedelas=8-9",
    "#sejas-kalkulators?datums=0001-01-01&nedelas=1-2",
  ]) assert.equal(readSeedlingPlanHash(hash), null, hash);
});

test("winter calendar shortcuts open a unique heading or preserved anchor in the linked article", () => {
  const { calendarGuide } = require("../lib/calendar-guides.ts");
  const { getArticle, headingSlug } = require("../lib/articles.ts");
  for (const month of [1, 12]) {
    const links = calendarGuide(month).shortcuts ?? [];
    assert.ok(links.length > 0);
    for (const { href } of links) {
      const url = new URL(href, "https://www.menesseja.lv");
      if (!url.pathname.startsWith("/raksti/") || !url.hash) continue;
      const article = getArticle(url.pathname.slice("/raksti/".length));
      assert.ok(article, href);
      const ids = article.body.flatMap((section) => [
        ...(section.heading ? [headingSlug(section.heading)] : []),
        ...(section.anchorAliases ?? []),
      ]);
      assert.equal(ids.filter((id) => id === url.hash.slice(1)).length, 1, href);
    }
  }
});

test("harvest comparison keeps individual plantings, years and units separate", () => {
  const { harvestSeasons, harvestQuantities } = require("../lib/harvest-summary.ts");
  const { plantDisplayName } = require("../lib/plant-display-name.ts");
  const harvest = (date, amount, unit) => ({ id: date, type: "raza", date, amount, unit });
  const base = { cropId: "tomati", area: "Siltumnīca" };
  const summer = harvestSeasons([
    { ...base, id: "a", cultivar: "Marmande", log: [
      harvest("2026-08-28", 0.75, "kg"), harvest("2026-08-05"), harvest("2026-08-08", 0.5, "kg"),
      harvest("2026-08-29", 9), harvest("2025-08-11", 12, "gab"), harvest("2027-01-01", 50, "kg"),
    ] },
    { ...base, id: "b", cultivar: "Vērša sirds", log: [
      harvest("2026-08-06", 7, "gab"), harvest("2026-02-30", 10, "gab"),
      { ...harvest("2026-06-15", 4, "kg"), type: "laistits" },
    ] },
  ], "2026-11-19");
  assert.deepEqual(summer.map((season) => season.year), ["2026", "2025"]);
  assert.equal(harvestQuantities(summer[0].amounts), "1,25 kg · 7 gab.");
  assert.deepEqual(summer[0].rows.map((r) => [plantDisplayName(r.plant), r.firstDate, r.unlabelled]), [
    ["Tomāti · Marmande", "2026-08-05", true], ["Tomāti · Vērša sirds", "2026-08-06", false],
  ]);
  assert.equal(harvestQuantities(summer[1].amounts), "12 gab.");
  assert.equal(plantDisplayName(base), "Tomāti");
});
