const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Use the existing compiler for these pure domain modules; no extra test runtime.
require.extensions[".ts"] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(result.outputText, filename);
};
const { latviaDateParts, latviaDateKey } = require("../lib/day-anchor.ts");
const { moonForDate, moonPhasesForMonth, nextPrincipalPhases, principalPhasesOnDate } = require("../lib/moon.ts");
const { seasonalLinks, seasonForMonth, monthCalendarHref } = require("../lib/seasonal.ts");
const { track, ANALYTICS_CONSENT_KEY } = require("../lib/analytics.ts");
const { subscribeToNewsletter } = require("../lib/brevo.ts");
const { sowingDay } = require("../lib/biodynamic.ts");
const { adjacentMonth } = require("../lib/seasonal.ts");
const { monthPlan } = require("../lib/month-plan.ts");
const { EMPTY_ARTICLE_FILTERS, matchesArticle, readArticleFilters, articleSearchParams } = require("../lib/article-search.ts");
const { EMPTY_PROBLEM_FILTERS, matchesProblem, readProblemFilters, problemSearchParams, problemSearchText } = require("../lib/problem-search.ts");
const { flowerDirectoryEntries, matchesFlower, readFlowerQuery, flowerSearchParams } = require("../lib/flower-directory.ts");
const { EXTRA_FLOWER_NAMES, FOLK_NAMES } = require("../lib/flower-names.ts");
const { CROPS, cropActivityMeta } = require("../lib/planting-crops.ts");
const { defaultSowingFilters, guideActivities, matchesSowingCrop } = require("../lib/sowing-guide-filter.ts");

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
  assert.equal(adjacentMonth(2027, 12, 1).href, "/ko-set/janvaris");
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

test("Riga month/year and calendar links roll over independently of server timezone", () => {
  const newYear = new Date("2026-12-31T22:30:00Z");
  assert.equal(latviaDateKey(newYear), "2027-01-01");
  assert.equal(monthCalendarHref(4, newYear), "/kalendars/2027/aprilis");
  assert.equal(monthCalendarHref(4, new Date("2028-01-01T10:00:00Z")), "/kalendars");
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
