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
const { editPlannerCell, emptyPlanner, loadPlanner, savePlanner } = require("../lib/planner-storage.ts");

const multi = "meness-seja:planner-plans";
const legacy = "meness-seja:planner";

function browser(t, entries = []) {
  const values = new Map(entries);
  const storage = {
    writes: 0,
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { this.writes++; values.set(key, value); },
  };
  global.window = { localStorage: storage };
  t.after(() => { delete global.window; });
  return { storage, values };
}

test("viewing a new or legacy planner writes nothing; migration retains the original layout", (t) => {
  const { storage, values } = browser(t);
  assert.deepEqual(loadPlanner().state, emptyPlanner());
  assert.equal(values.size, 0);
  const original = '{"0":"tomati","95":"agraks-augs"}';
  values.set(legacy, original);
  const loaded = loadPlanner();
  assert.equal(loaded.issue, null);
  assert.deepEqual(loaded.state, emptyPlanner(JSON.parse(original)));
  assert.equal(storage.writes, 0);
  loaded.state.plans[0].placements[2] = "salati";
  assert.equal(savePlanner(loaded.baseline, loaded.state).ok, true);
  assert.equal(values.get(legacy), original);
  assert.deepEqual(loadPlanner().state, loaded.state);
});

test("multi-plan selection survives load and stale or missing selected IDs fall back to the first plan", (t) => {
  const { storage, values } = browser(t, [[legacy, "broken old data"]]);
  const plans = [{ id: "a", name: "Dilles", placements: {} }, { id: "b", name: "Loki", placements: { 11: "sipoli" } }];
  for (const [id, expected] of [["b", "b"], ["old-id", "a"], [undefined, "a"]]) {
    values.set(multi, JSON.stringify({ plans, activeId: id }));
    const loaded = loadPlanner();
    assert.deepEqual(loaded.state, { plans, activeId: expected });
    assert.equal(loaded.issue, null);
  }
  assert.equal(storage.writes, 0);
});

test("malformed JSON, plans, or cells remain intact even on explicit save", (t) => {
  const { storage, values } = browser(t);
  const plan = emptyPlanner().plans[0];
  for (const raw of ["", "{", "null", "[]", '{"plans":[]}', '{"plans":[null]}',
    JSON.stringify({ plans: [plan, plan] }),
    ...[[], null, { 96: "tomati" }, { 0: {} }, { "-1": "tomati" }, { "01": "tomati" }].map(
      (placements) => JSON.stringify({ plans: [{ ...plan, placements }] }),
    ),
  ]) {
    values.set(multi, raw);
    const loaded = loadPlanner();
    assert.equal(loaded.issue, "invalid", raw);
    assert.deepEqual(savePlanner(loaded.baseline, emptyPlanner({ 1: "salati" })), { ok: false, issue: "invalid" });
    assert.equal(values.get(multi), raw);
  }
  values.delete(multi);
  values.set(legacy, "null");
  assert.equal(loadPlanner().issue, "invalid");
  assert.equal(savePlanner(null, emptyPlanner()).issue, "invalid");
  assert.equal(storage.writes, 0);
});

test("blocked reads keep the planner usable and retries save edits only when old data is safe", (t) => {
  const { storage, values } = browser(t);
  Object.defineProperty(global.window, "localStorage", { configurable: true, get() { throw new Error("denied"); } });
  const blocked = loadPlanner();
  assert.equal(blocked.issue, "unavailable");
  const edits = emptyPlanner({ 2: "tomati" });
  assert.equal(savePlanner(blocked.baseline, edits).issue, "unavailable");
  Object.defineProperty(global.window, "localStorage", { configurable: true, value: storage });
  values.set(legacy, '{"0":"burkani"}');
  assert.equal(savePlanner(blocked.baseline, edits).issue, "conflict");
  assert.equal(values.has(multi), false);
  values.delete(legacy);
  assert.equal(savePlanner(blocked.baseline, edits).ok, true);
  assert.deepEqual(loadPlanner().state, edits);
});

test("a denied legacy read is distinguishable from a new planner", (t) => {
  const { storage } = browser(t);
  storage.getItem = (key) => { if (key === legacy) throw new Error("denied"); return null; };
  const loaded = loadPlanner();
  assert.equal(loaded.issue, "unavailable");
  assert.equal(savePlanner(loaded.baseline, emptyPlanner()).issue, "unavailable");
  assert.equal(storage.writes, 0);
});

test("quota failure leaves the old snapshot available and retry persists all pending changes", (t) => {
  const original = JSON.stringify(emptyPlanner({ 0: "tomati" }));
  const { storage, values } = browser(t, [[multi, original]]);
  const loaded = loadPlanner();
  const setter = storage.setItem;
  storage.setItem = () => { throw new Error("quota"); };
  loaded.state.plans[0].placements[4] = "burkani";
  assert.equal(savePlanner(loaded.baseline, loaded.state).issue, "write");
  assert.equal(values.get(multi), original);
  loaded.state.plans[0].placements[5] = "salati";
  storage.setItem = setter;
  const saved = savePlanner(loaded.baseline, loaded.state);
  assert.equal(saved.ok, true);
  assert.deepEqual(loadPlanner().state, loaded.state);
  assert.equal(savePlanner(saved.baseline, loaded.state).ok, true);
  assert.equal(storage.writes, 1);
});

test("a later edit cannot overwrite another tab's saved changes or resurrect its removed plan", (t) => {
  const { values } = browser(t);
  const first = loadPlanner();
  const second = loadPlanner();
  const edited = emptyPlanner({ 11: "salati" });
  const saved = savePlanner(first.baseline, edited);
  assert.equal(saved.ok, true);
  assert.equal(savePlanner(second.baseline, emptyPlanner({ 12: "tomati" })).issue, "conflict");
  assert.deepEqual(loadPlanner().state, edited);
  values.delete(multi);
  assert.equal(savePlanner(saved.baseline, edited).issue, "conflict");
  assert.equal(values.has(multi), false);
});

test("choosing a crop or an occupied cell preserves the plan until a free cell or the eraser is used", () => {
  const original = Object.freeze({ 0: "burkani", 23: "unknown-legacy-crop" });
  for (const [cell, selected, erase] of [[0, null, false], [0, "rudzupukes", false],
    [23, "rudzupukes", false], [1, null, false], [1, null, true]]) {
    assert.equal(editPlannerCell(original, cell, selected, erase), original);
  }
  const withFlower = editPlannerCell(original, 1, "rudzupukes", false);
  assert.deepEqual(withFlower, { ...original, 1: "rudzupukes" });
  assert.equal(editPlannerCell(withFlower, 1, "rudzupukes", false), withFlower);
  assert.deepEqual(editPlannerCell(withFlower, 1, null, true), original);
});
