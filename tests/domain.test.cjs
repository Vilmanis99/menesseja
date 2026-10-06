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
const { moonForDate, moonPhasesForMonth, nextPrincipalPhases } = require("../lib/moon.ts");
const { seasonalLinks, seasonForMonth, monthCalendarHref } = require("../lib/seasonal.ts");
const { track, ANALYTICS_CONSENT_KEY } = require("../lib/analytics.ts");
const { subscribeToNewsletter } = require("../lib/brevo.ts");

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
