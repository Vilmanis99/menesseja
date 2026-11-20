const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const project = path.resolve(__dirname, "..");
require.extensions[".ts"] = (module, filename) => {
  const originalRequire = module.require.bind(module);
  module.require = (id) => originalRequire(id.startsWith("@/") ? path.join(project, id.slice(2)) : id);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  });
  module._compile(outputText, filename);
};
const { portalQuery, searchPortal } = require("../lib/portal-search.ts");
const asOf = new Date("2026-11-19T12:00:00Z");
const search = (query, date = asOf) => searchPortal(query, date).map((result) => result.href);

test("server catalogue ranks specific reader questions ahead of broader matches", () => {
  for (const [query, expected] of [
    ["kāpēc nezied hortenzija", "/raksti/kapec-hortenzijas-nezied"],
    ["Puķu nosaukumi", "/pukes"],
    ["istabas pukes nosaukumi", "/pukes#ziemas-telpaugi"],
    ["alpu vijolītes", "/raksti/ciklamena-podina"],
    ["rozes vāzē", "/pukes/rozes#rozes-vaze"],
    ["rozu puskis", "/pukes/rozes#rozes-vaze"],
    ["rozes", "/pukes/rozes"],
    ["Primula veris", "/pukes/primulas"],
    ["  SKABETI  KAPOSTI  ", "/raksti/skabeti-kaposti"],
    ["mēness fāze šodien", "/meness"],
    ["janvāris 2027", "/kalendars/2027/janvaris"],
    ["tripši", "/kaitekli/tripsi"],
    ["pujenes", "/pukes/peonijas"],
    ["Thysanoptera", "/kaitekli/tripsi"],
    ["sējas kalkulators", "/raksti/kad-set-destus-rekini-atpakal#sejas-kalkulators"],
    ["sēklu pārbaude", "/raksti/ka-glabat-seklas-un-parbaudit-digtspeju#mana-seklu-digtspejas-parbaude"],
  ]) assert.equal(search(query)[0], expected, query);
});

test("each canonical destination appears once even when named by multiple collections or tools", () => {
  for (const q of ["narcises", "sēklu", "dārza", "pujenes"]) {
    const urls = search(q);
    const bases = urls.map((url) => url.split("#")[0]);
    assert.equal(bases.length, new Set(bases).size);
  }
  assert.equal(search("narcises")[0], "/pukes/narcises");
  assert.ok(!search("narcises").includes("/augi/narcises"));
});

test("only published calendar years are offered; unsupported and empty searches stay empty", () => {
  assert.deepEqual(search("janvāris 2028"), []);
  assert.equal(search("janvāris 2028", new Date("2027-01-01T00:00:00Z"))[0], "/kalendars/2028/janvaris");
  for (const q of ["", "  ", "!!!", "xzqqvvr"]) assert.deepEqual(search(q), []);
  assert.equal(portalQuery(["  tripši ", "ignored"]), "tripši");
  assert.equal(portalQuery(undefined), "");
  assert.equal(portalQuery("ž".repeat(130)).length, 120);
});
