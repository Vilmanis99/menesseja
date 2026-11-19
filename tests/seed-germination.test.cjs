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
const { parseSample, samplePercentage, saveSeedTest, readSeedTests, batchHash, batchIdFromHash } = require("../lib/seed-germination.ts");

const pending = { name: " Nantes ", tested: "15", sprouted: "" };
function browser(t) {
  const data = new Map();
  global.window = { localStorage: {
    get length() { return data.size; },
    key: (index) => [...data.keys()][index] ?? null,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  } };
  t.after(() => { delete global.window; });
  return data;
}

test("a pending count differs from zero, and scores cannot exceed the tested sample", () => {
  assert.deepEqual(parseSample(pending), { name: "Nantes", tested: 15, sprouted: null });
  assert.equal(parseSample({ ...pending, sprouted: "0" }).sprouted, 0);
  for (const invalid of [{ name: " " }, { tested: "0" }, { tested: "1e3" }, { tested: "9007199254740992" }, { sprouted: "2.5" }, { sprouted: "-1" }, { sprouted: "16" }]) {
    assert.ok(parseSample({ ...pending, ...invalid }).error);
  }
  assert.equal(samplePercentage(12, 9), "75 %");
  assert.equal(samplePercentage(32, 1), "≈ 3,13 %");
  assert.match(samplePercentage(3, 1), /^≈ 33,33\s%$/);
  assert.equal(samplePercentage(15, 0), "0 %");
  assert.equal(samplePercentage(15, 15), "100 %");
});

test("identical names remain separate, links select the original batch and stale edits cannot overwrite it", (t) => {
  browser(t);
  const first = saveSeedTest(pending, null);
  const second = saveSeedTest({ ...pending, tested: "20" }, null);
  assert.notEqual(first.batch.id, second.batch.id);
  const id = batchIdFromHash(batchHash(first.batch.id));
  assert.equal(id, first.batch.id);
  for (const hash of ["#else", batchHash("bogus"), batchHash(first.batch.id) + "&x=anything"]) assert.equal(batchIdFromHash(hash), null);
  const reopened = readSeedTests().entries.find((entry) => entry.batch.id === id);
  const finished = saveSeedTest({ ...pending, sprouted: "9" }, reopened);
  assert.equal(finished.batch.startedAt, first.batch.startedAt);
  assert.equal(saveSeedTest({ ...pending, sprouted: "12" }, first).error.includes("mainījies"), true);
  assert.deepEqual(readSeedTests().entries.find((entry) => entry.batch.id === second.batch.id), second);
  assert.equal(readSeedTests().entries.find((entry) => entry.batch.id === id).batch.sprouted, 9);
});

test("broken, unavailable and full browser storage retain prior records and report the failure", (t) => {
  const data = browser(t);
  const original = saveSeedTest(pending, null);
  const key = [...data.keys()][0];
  data.set(key, "{");
  assert.ok(readSeedTests().warning);
  assert.ok(saveSeedTest(pending, original).error);
  assert.equal(data.get(key), "{");
  window.localStorage.setItem = () => { throw new Error("full"); };
  assert.ok(saveSeedTest(pending, null).error);
  Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
  assert.ok(readSeedTests().warning);
  assert.ok(saveSeedTest(pending, null).error);
  assert.equal(samplePercentage(4, 3), "75 %");
});
