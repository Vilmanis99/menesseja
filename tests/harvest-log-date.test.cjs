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

const { harvestAmountError, harvestDateError, plantDateError } = require("../lib/garden.ts");
const { latviaDateKey } = require("../lib/day-anchor.ts");

test("historical harvests respect the actual sowing day and the current day in Riga", () => {
  const today = latviaDateKey(new Date("2026-03-01T22:30:00Z"));
  assert.equal(today, "2026-03-02");
  assert.equal(harvestDateError({}, today, today), null);
  assert.equal(harvestDateError({}, "2024-02-29", today), null);
  for (const invalid of ["", "2025-02-29", "2026-03-03", "2025-13-01"]) {
    assert.ok(harvestDateError({}, invalid, today));
  }
  const plant = { sownOn: "2025-05-01", plantedOn: "2026-02-20" };
  assert.ok(harvestDateError(plant, "2025-04-30", today));
  assert.equal(harvestDateError(plant, "2025-05-01", today), null);
  assert.equal(harvestDateError(plant, "2025-09-12", today), null);
  assert.equal(harvestDateError({ sownAt: "2026-03-01" }, "2025-09-12", today), null);
});

test("editing a sowing date respects past harvests while a moved plant retains its earlier harvest", () => {
  const plant = { log: [
    { type: "piezime", date: "2025-01-10" },
    { type: "raza", date: "not a date" },
    { type: "raza", date: "2025-09-12" },
    { type: "raza", date: "2025-08-01" },
  ] };
  assert.equal(plantDateError(plant, "sown", "2025-08-01", "2026-03-02"), null);
  assert.ok(plantDateError(plant, "sown", "2025-08-02", "2026-03-02"));
  assert.equal(plantDateError(plant, "planted", "2026-02-20", "2026-03-02"), null);
});

test("an optional harvest amount supports positive weights or whole counts", () => {
  for (const unit of ["kg", "gab"]) {
    assert.equal(harvestAmountError("", unit), null);
    assert.equal(harvestAmountError("2", unit), null);
    for (const amount of ["0", "-2", "abc", "Infinity"]) assert.ok(harvestAmountError(amount, unit));
  }
  assert.equal(harvestAmountError("0.25", "kg"), null);
  assert.ok(harvestAmountError("0.25", "gab"));
  assert.ok(harvestAmountError("9007199254740992", "gab"));
});
