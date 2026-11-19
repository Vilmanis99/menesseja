const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const cli = path.resolve(__dirname, "../scripts/check-seasonal-seo.mjs");
const site = "https://www.menesseja.lv";
const season = [
  "/kalendars/2026/decembris", "/ko-set/decembris", "/kalendars/2026",
  "/kalendars/2027/janvaris", "/ko-set/janvaris", "/kalendars/2027",
  "/kalendars/2027/februaris", "/ko-set/februaris",
];

// Loaded before the real CLI, even when argument validation exits immediately.
function installFixture() {
  const { site, entries, inspections } = JSON.parse(process.env.SEO_FIXTURE);
  const instant = "2026-11-18T12:00:00Z";
  globalThis.Date = class extends Date {
    constructor(...args) { super(...(args.length ? args : [instant])); }
  };
  let index = 0;
  globalThis.fetch = async (url, options) => {
    console.log("FETCH " + url);
    if (url === site + "/robots.txt") return new Response("User-agent: *\nAllow: /");
    if (url === site + "/sitemap.xml") {
      return new Response("<urlset>" + entries.map(x => "<url><loc>" + x + "</loc></url>").join("") + "</urlset>");
    }
    if (url === "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect") {
      const { inspectionUrl } = JSON.parse(options.body);
      console.log("INSPECT " + inspectionUrl);
      const canonical = inspectionUrl === site + "/" ? site : inspectionUrl;
      const data = inspections[index++] ?? { verdict: "PASS", googleCanonical: canonical };
      if (typeof data === "number") return new Response(null, { status: data });
      return Response.json({ inspectionResult: { indexStatusResult: data } });
    }
    if (new URL(url).origin !== site) throw new Error("Unexpected request: " + url);
    const canonical = url === site + "/" ? site : url;
    return new Response('<link rel="canonical" href="' + canonical + '">');
  };
}

function run(args = [], { entries = season.map(page => site + page), inspections = [], token = "" } = {}) {
  const preload = "data:text/javascript," + encodeURIComponent("(" + installFixture.toString() + ")()");
  const result = spawnSync(process.execPath, ["--import", preload, cli, ...args], {
    encoding: "utf8",
    timeout: 10000,
    env: { SEO_FIXTURE: JSON.stringify({ site, entries, inspections }), GSC_ACCESS_TOKEN: token },
  });
  if (result.error) throw result.error;
  const lines = result.stdout.split("\n");
  const requests = lines.filter(x => x.startsWith("FETCH ")).map(x => x.slice(6));
  const inspected = lines.filter(x => x.startsWith("INSPECT ")).map(x => x.slice(8));
  return { code: result.status, output: result.stdout + result.stderr, requests, inspected };
}

test("default CLI checks the next three months across New Year without Google credentials", () => {
  const audit = run();
  assert.equal(audit.code, 0, audit.output);
  assert.deepEqual(audit.requests, ["/sitemap.xml", "/robots.txt", ...season].map(page => site + page));
  assert.deepEqual(audit.inspected, []);
  assert.match(audit.output, /Publiskās pārbaudes izturēja 8 no 8/);
  assert.match(audit.output, /Google indeksa rezultāti saņemti 0 no 8/);
});

test("the sitemap and repeated includes share a single set, including the equivalent root URLs", () => {
  const article = "/raksti/amarillis-pec-ziedesanas";
  const entries = [...season.map(page => site + page), site, site + "/", site + article];
  const audit = run(["--from", "2026-12", "--sitemap", "--include", article, "--include", article, "--include", season[0]], { entries, token: "fixture" });
  assert.equal(audit.code, 0, audit.output);
  const expected = [...season, "/", article].map(page => site + page).sort();
  assert.deepEqual(audit.inspected.sort(), expected);
  assert.deepEqual(audit.requests.filter(url => url.startsWith(site) && !url.endsWith(".xml") && !url.endsWith(".txt")).sort(), expected);
  assert.match(audit.output, /Google indeksa rezultāti saņemti 10 no 10/);
});

function referenceFile(t, urls) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "menesseja-sitemap-test-"));
  t.after(() => fs.rmSync(directory, { recursive: true }));
  const file = path.join(directory, "sitemap.xml");
  fs.writeFileSync(file, "<urlset>" + urls.map(url => `<url><loc>${url}</loc></url>`).join("") + "</urlset>");
  return file;
}

test("a smaller public sitemap can pass all page checks while missing URLs from the deployed build", t => {
  const entries = season.map(page => site + page);
  const topSlugs = ["enai", "siltumnicai", "balkonam-konteineriem", "ziemas-glabasanai", "bernu-darzs", "atrakie-augi", "vieglakie-augi-iesacejam"];
  const missing = topSlugs.map(slug => site + "/topi/" + slug);
  const file = referenceFile(t, [...entries, ...missing]);
  const ordinary = run(["--sitemap"], { entries });
  assert.equal(ordinary.code, 0, ordinary.output);
  const compared = run(["--sitemap", "--expect-sitemap", file], { entries });
  assert.equal(compared.code, 1, compared.output);
  assert.match(compared.output, /Trūkst 7, neparedzētas 0/);
  for (const url of missing) assert.ok(compared.output.includes("Publiskajā vietnes kartē trūkst " + url));
  assert.match(compared.output, /Publiskās pārbaudes izturēja 8 no 8/);
});

test("reference comparison normalizes equivalent root URLs and never expands the requested inspection scope", t => {
  const pages = season.map(page => site + page);
  const file = referenceFile(t, [site + "/", ...pages].reverse());
  const entries = [site, ...pages];
  const match = run(["--expect-sitemap", file], { entries, token: "fixture" });
  assert.equal(match.code, 0, match.output);
  assert.match(match.output, /Trūkst 0, neparedzētas 0/);
  assert.deepEqual(match.inspected, pages);
  const wrong = site + "/alternativa";
  const different = run(["--expect-sitemap", file], { entries: [...pages, wrong], token: "fixture" });
  assert.equal(different.code, 1, different.output);
  assert.match(different.output, /Trūkst 1, neparedzētas 1/);
  assert.ok(different.output.includes("Publiskajā vietnes kartē trūkst " + site + "/"));
  assert.ok(different.output.includes("Neparedzēta adrese publiskajā vietnes kartē " + wrong));
  assert.deepEqual(different.inspected, pages);
  assert.ok(!different.requests.includes(wrong));
});

test("an unusable reference fails before any network calls", t => {
  for (const urls of [[], [site + "/", "https://example.test/foreign"]]) {
    const audit = run(["--expect-sitemap", referenceFile(t, urls)], { token: "fixture" });
    assert.equal(audit.code, 1, audit.output);
    assert.match(audit.output, /būves XML/);
    assert.deepEqual(audit.requests, []);
  }
});

test("foreign sitemap entries are reported and never fetched or submitted to Google", () => {
  const foreign = ["https://example.test/kalendars", site + ".example.test/page"];
  const audit = run(["--sitemap"], { entries: [...season.map(p => site + p), ...foreign], token: "fixture" });
  assert.equal(audit.code, 1, audit.output);
  assert.match(audit.output, /Vietnes kartē atrasta adrese ārpus/);
  assert.deepEqual(audit.inspected, season.map(p => site + p));
  for (const url of foreign) assert.ok(!audit.requests.includes(url));
});

test("invalid includes fail before fetching any resource", () => {
  for (const value of ["https://example.test/x", "//example.test/x", "/raksti/../", "/raksti?a=1", "/raksti#x"]) {
    const audit = run(["--sitemap", "--include", "/", "--include", value], { token: "fixture" });
    assert.equal(audit.code, 1, audit.output);
    assert.match(audit.output, /--include jānorāda/);
    assert.deepEqual(audit.requests, []);
  }
});

test("a Google PASS with a different canonical still fails the audit", () => {
  const canonical = site + "/cita-lapa";
  const audit = run([], { inspections: [{ verdict: "PASS", googleCanonical: canonical }], token: "fixture" });
  assert.equal(audit.code, 1, audit.output);
  assert.ok(audit.output.includes("Google canonical: " + canonical));
  assert.match(audit.output, /Google izvēlējās citu kanonisko adresi \(PASS\)/);
  assert.match(audit.output, /Publiskās pārbaudes izturēja 8 no 8/);
  assert.equal(audit.inspected.length, 8);
});

test("verdicts and API failures stay distinct, and a quota error stops subsequent inspections", () => {
  const inspections = [{ verdict: "PASS" }, { verdict: "NEUTRAL" }, { verdict: "FAIL" }, 503, 429];
  const audit = run([], { inspections, token: "fixture" });
  assert.equal(audit.code, 1, audit.output);
  assert.deepEqual(audit.inspected, season.slice(0, 5).map(page => site + page));
  for (const verdict of ["PASS", "NEUTRAL", "FAIL"]) assert.ok(audit.output.includes("(" + verdict + ")"));
  for (const status of [503, 429]) assert.ok(audit.output.includes("URL Inspection HTTP " + status));
  assert.match(audit.output, /Publiskās pārbaudes izturēja 8 no 8/);
  assert.match(audit.output, /Google indeksa rezultāti saņemti 3 no 8/);
  assert.match(audit.output, /Google norādīja PASS 1 adresēm/);
});
