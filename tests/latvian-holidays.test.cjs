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
const { latvianHolidaysForMonth: holidays, holidayNameForDay } = require("../lib/latvian-holidays.ts");

test("winter calendars name four Christmas and year-end dates and the following New Year's Day", () => {
  for (const year of [2025, 2026, 2027, 2028]) {
    assert.deepEqual(holidays(year, 12), [
      { day: 24, name: "Ziemassvētku vakars", kind: "holiday" },
      { day: 25, name: "Pirmie Ziemassvētki", kind: "holiday" },
      { day: 26, name: "Otrie Ziemassvētki", kind: "holiday" },
      { day: 31, name: "Vecgada diena", kind: "holiday" },
    ]);
    assert.deepEqual(holidays(year + 1, 1), [{ day: 1, name: "Jaungada diena", kind: "holiday" }]);
    assert.deepEqual(holidays(year, 2), []);
  }
});

test("movable holidays use the Gregorian Easter dates across month boundaries", () => {
  // Independent dates: https://www.census.gov/data/software/x13as/genhol/easter-dates.html
  const reference = [
    [2025, 4, [18, 20, 21], 6, 8], [2026, 4, [3, 5, 6], 5, 24],
    [2027, 3, [26, 28, 29], 5, 16], [2028, 4, [14, 16, 17], 6, 4],
  ];
  for (const [year, month, dates, pentecostMonth, pentecostDay] of reference) {
    assert.deepEqual(holidays(year, month).map(({ day, name }) => [day, name]), [
      [dates[0], "Lielā Piektdiena"], [dates[1], "Pirmās Lieldienas"], [dates[2], "Otrās Lieldienas"],
    ]);
    assert.equal(holidays(year, pentecostMonth).find(({ name }) => name === "Vasarsvētki").day, pentecostDay);
  }
  assert.equal(holidays(2032, 3).find(({ name }) => name === "Pirmās Lieldienas").day, 28);
  assert.equal(holidays(2086, 3).find(({ name }) => name === "Lielā Piektdiena").day, 29);
  assert.equal(holidays(2086, 4).find(({ name }) => name === "Otrās Lieldienas").day, 1);
});

test("the full year's holidays include Mothers' Day, and both occasions survive a coincident Sunday", () => {
  const all = Array.from({ length: 12 }, (_, index) => holidays(2027, index + 1));
  assert.deepEqual(all.map((month) => month.map(({ day }) => day)), [
    [1], [], [26, 28, 29], [], [1, 4, 9, 16], [23, 24], [], [], [], [], [18], [24, 25, 26, 31],
  ]);
  assert.equal(all.flat().every(({ kind }) => kind === "holiday"), true);
  assert.equal(holidayNameForDay(holidays(2035, 5), 13), "Mātes diena · Vasarsvētki");
  assert.equal(holidayNameForDay(holidays(2026, 12), 27), "");
  assert.deepEqual(holidays(2024, 12), []);
});

test("only eligible weekend holidays produce another day off, including the scheduled 2028 festival", () => {
  assert.deepEqual(holidays(2025, 5).filter(({ kind }) => kind === "day-off"), [
    { day: 5, name: "Brīvdiena par 4. maiju", kind: "day-off" },
  ]);
  assert.deepEqual(holidays(2028, 11).filter(({ kind }) => kind === "day-off"), [
    { day: 20, name: "Brīvdiena par 18. novembri", kind: "day-off" },
  ]);
  assert.deepEqual(holidays(2028, 7), [
    { day: 9, name: "Vispārējo latviešu Dziesmu un deju svētku noslēguma diena", kind: "holiday" },
    { day: 10, name: "Brīvdiena pēc Dziesmu un deju svētkiem", kind: "day-off" },
  ]);
  for (const year of [2025, 2026, 2027, 2029]) assert.deepEqual(holidays(year, 7), []);
  assert.deepEqual(holidays(2026, 6).map(({ day }) => day), [23, 24]);
});
