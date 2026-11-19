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
const { seedlingCalendarFile } = require("../lib/seedling-calendar.ts");
const { seedlingSowingWindow } = require("../lib/seedling-sowing.ts");

const planUrl = "https://www.menesseja.lv/raksti/kad-set-destus-rekini-atpakal#sejas-kalkulators";
const plan = { ...seedlingSowingWindow("2027-06-01", { min: "8", max: "10" }), transplant: "2027-06-01", name: "Paprika", planUrl };
const now = new Date("2026-12-18T22:03:09.234Z");

function properties(file) {
  return file.replace(/\r\n /g, "").trimEnd().split("\r\n");
}

test("the calendar file carries the calculated inclusive interval as one transparent all-day event", () => {
  const file = seedlingCalendarFile(plan, now);
  const values = properties(file);
  assert.equal(values.filter((line) => line === "BEGIN:VEVENT").length, 1);
  for (const line of ["DTSTART;VALUE=DATE:20270323", "DTEND;VALUE=DATE:20270407", "DTSTAMP:20261218T220309Z",
    "TRANSP:TRANSPARENT", "SUMMARY:Plānotā sēja — Paprika", "URL:" + planUrl]) assert.ok(values.includes(line), line);
  const description = values.find((line) => line.startsWith("DESCRIPTION:"));
  assert.ok(description.includes("2027. gada 1. jūnijs") && description.includes(planUrl));
  assert.ok(file.endsWith("END:VCALENDAR\r\n"));
  assert.doesNotMatch(file.replaceAll("\r\n", ""), /[\r\n]/);
});

test("one-day sowing windows retain the final date across leap days and year boundaries", () => {
  for (const [transplant, sow, end] of [["2028-03-07", "20280229", "20280301"], ["2027-01-07", "20261231", "20270101"]]) {
    const window = seedlingSowingWindow(transplant, { min: "1", max: "1" });
    const values = properties(seedlingCalendarFile({ ...plan, ...window, transplant, name: "" }, now));
    assert.ok(values.includes("DTSTART;VALUE=DATE:" + sow));
    assert.ok(values.includes("DTEND;VALUE=DATE:" + end));
    assert.ok(values.includes("SUMMARY:Plānotā dēstu sēja"));
  }
  const emergence = seedlingSowingWindow("2027-06-01", { min: "8", max: "10" }, { min: "5", max: "10" });
  const values = properties(seedlingCalendarFile({ ...plan, ...emergence }, now));
  assert.ok(values.includes("DTSTART;VALUE=DATE:20270313"));
  assert.ok(values.includes("DTEND;VALUE=DATE:20270402"));
});

test("calendar text escapes user input, folds Unicode on byte boundaries and keeps a stable event identity", () => {
  const name = "Āboliņš 🌱".repeat(12) + ", šķirne; A\\B\r\nEND:VEVENT";
  const url = "https://www.menesseja.lv/raksti/kad-set-destus-rekini-atpakal?nedelas=8,10;12#sejas-kalkulators";
  const file = seedlingCalendarFile({ ...plan, name, planUrl: url }, now);
  for (const line of file.split("\r\n")) assert.ok(Buffer.byteLength(line, "utf8") <= 75, line);
  const values = properties(file);
  assert.ok(values.includes("SUMMARY:Plānotā sēja — " + "Āboliņš 🌱".repeat(12) + "\\, šķirne\\; A\\\\B\\nEND:VEVENT"));
  assert.equal(values.filter((line) => line === "END:VEVENT").length, 1);
  assert.ok(values.includes("URL:" + url));
  assert.ok(values.find((line) => line.startsWith("DESCRIPTION:")).includes("8\\,10\\;12"));
  const uid = (input, date) => properties(seedlingCalendarFile(input, date)).find((line) => line.startsWith("UID:"));
  assert.equal(uid(plan, now), uid(plan, new Date("2026-12-19T22:00:00Z")));
  assert.notEqual(uid(plan, now), uid({ ...plan, name: "Īrisi" }, now));
  assert.throws(() => seedlingCalendarFile({ ...plan, planUrl: "https://example.com/" }, now), /menesseja.lv/);
});
