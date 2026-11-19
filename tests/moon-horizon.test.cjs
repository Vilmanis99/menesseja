const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};
const { moonHorizonForDay, formatHorizonTime } = require("../lib/moon-horizon.ts");
const { latviaDateKey } = require("../lib/day-anchor.ts");
const { winterDaylight, winterDaylightDates } = require("../lib/winter-daylight.ts");

test("winter daylight matches USNO Sun crossings and the local solstice date", () => {
  // Local winter times from https://aa.usno.navy.mil/api/rstt/oneday (tz=2).
  for (const [year, month, day, city, rise, set] of [
    [2026, 12, 21, "pieriga", "09:00", "15:43"],
    [2026, 12, 21, "latgale", "08:43", "15:41"],
    [2027, 1, 31, "pieriga", "08:25", "16:50"],
    [2027, 1, 31, "latgale", "08:11", "16:45"],
  ]) {
    const result = winterDaylight(year, month, day, city);
    const date = latviaDateKey(result.rise);
    assert.equal(date, `${year}-${String(month).padStart(2, "0")}-${day}`);
    for (const [actual, expected] of [[result.rise, rise], [result.set, set]]) {
      assert.ok(Math.abs(actual - Date.parse(`${date}T${expected}:00+02:00`)) < 60_000, `${city} ${date} ${expected}`);
    }
  }
  // https://aa.usno.navy.mil/api/seasons?year=2027&tz=2 (Dec 22, 04:42).
  assert.deepEqual(winterDaylightDates(2026, 12), [1, 21, 31]);
  assert.deepEqual(winterDaylightDates(2027, 12), [1, 22, 31]);
});

// Reference UTC minutes from the US Naval Observatory daily upper-limb events.
// https://aa.usno.navy.mil/api/rstt/oneday?date=2026-11-18&coords=56.95,24.11&tz=0
function checkDay(dateKey, lat, lon, rise, set) {
  const { rises, sets } = moonHorizonForDay(dateKey, lat, lon);
  for (const [events, expected] of [[rises, rise], [sets, set]]) {
    assert.equal(events.length, expected ? 1 : 0, dateKey);
    if (expected) {
      assert.equal(latviaDateKey(events[0]), dateKey);
      assert.ok(Math.abs(events[0] - new Date(expected)) <= 60_000, `${dateKey} ${expected}`);
    }
  }
}

test("winter observations retain missing events and include events on the previous UTC date", () => {
  checkDay("2026-11-03", 56.95, 24.11, null, "2026-11-03T12:52Z");
  checkDay("2026-11-18", 56.95, 24.11, "2026-11-18T11:58Z", null);
  checkDay("2026-11-19", 56.95, 24.11, "2026-11-19T12:03Z", "2026-11-18T22:55Z");
  checkDay("2026-12-24", 56.97, 21.97, "2026-12-24T13:47Z", "2026-12-24T08:13Z");
  checkDay("2026-12-24", 55.87, 26.52, "2026-12-24T13:39Z", "2026-12-24T07:43Z");
  checkDay("2027-01-01", 56.95, 24.11, "2027-01-01T00:38Z", "2027-01-01T09:39Z");
});

test("summer time and 23- and 25-hour Riga dates agree with the observatory", () => {
  checkDay("2026-07-10", 56.95, 24.11, "2026-07-09T21:32Z", "2026-07-10T15:29Z");
  checkDay("2026-10-25", 56.95, 24.11, "2026-10-25T14:07Z", "2026-10-25T04:20Z");
  checkDay("2027-03-28", 56.95, 24.11, "2027-03-28T00:24Z", "2027-03-28T05:33Z");
  const { rises, sets } = moonHorizonForDay("2027-03-28", 56.95, 24.11);
  assert.deepEqual([...rises, ...sets].map(formatHorizonTime), ["02:24", "08:33"]);
});

test("a long civil day can retain two rises for the same observer", () => {
  // This longitude puts two rises inside the 25-hour Riga reporting interval.
  const events = moonHorizonForDay("2025-10-26", 57, -125).rises;
  assert.deepEqual(events.map(latviaDateKey), ["2025-10-26", "2025-10-26"]);
  assert.ok(events[1] - events[0] > 24 * 3_600_000);
});

test("rounded times preserve the date and distinguish both copies of the autumn hour", () => {
  const clock = (iso) => formatHorizonTime(new Date(iso));
  assert.equal(clock("2026-11-18T11:57:35Z"), "13:58");
  assert.equal(clock("2026-12-31T21:59:55Z"), "23:59");
  assert.equal(clock("2026-12-31T22:00:01Z"), "00:00");
  assert.equal(clock("2026-10-25T00:30:00Z"), "03:30 (UTC+3)");
  assert.equal(clock("2026-10-25T01:30:00Z"), "03:30 (UTC+2)");
  assert.equal(clock("2026-10-25T00:59:40Z"), "03:59 (UTC+3)");
  assert.equal(clock("2027-03-28T00:59:40Z"), "02:59");
});

test("invalid coordinates and dates are rejected", () => {
  for (const date of ["2026-02-29", "2026-13-01", "2026-1-01", ""]) {
    assert.throws(() => moonHorizonForDay(date, 56.95, 24.11), RangeError);
  }
  for (const [lat, lon] of [[NaN, 24], [91, 24], [57, Infinity], [57, -181]]) {
    assert.throws(() => moonHorizonForDay("2026-12-01", lat, lon), RangeError);
  }
});
