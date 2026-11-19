const { test } = require("node:test");
const assert = require("node:assert/strict");

const page = "/kalendars/2026/decembris";
const range = { page, from: "2026-08-17", to: "2026-11-16" };

test("Search Analytics uses the same exact page filter for totals and up to 100 final web queries", async () => {
  const { pageQueryReport } = await import("../scripts/seo-queries.mjs");
  const calls = [];
  const total = { clicks: 5, impressions: 150, ctr: 5 / 150, position: 2.75 };
  const report = await pageQueryReport(range, { token: "test-only", property: "sc-domain:menesseja.lv",
    fetcher: async (endpoint, options) => {
      assert.equal(endpoint, "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Amenesseja.lv/searchAnalytics/query");
      assert.equal(options.method, "POST");
      assert.equal(options.headers.Authorization, "Bearer test-only");
      const body = JSON.parse(options.body);
      assert.deepEqual(body.dimensionFilterGroups, [{ groupType: "and", filters: [
        { dimension: "page", operator: "equals", expression: "https://www.menesseja.lv" + page },
      ] }]);
      assert.deepEqual([body.type, body.dataState, body.aggregationType, body.startDate, body.endDate],
        ["web", "final", "byPage", range.from, range.to]);
      calls.push([body.dimensions, body.rowLimit]);
      return Response.json({ rows: body.dimensions.length ? [{ ...total, keys: ["ziemas kalendārs"], clicks: 1, impressions: 25, ctr: 0.04 }] : [total] });
    } });
  assert.deepEqual(calls, [[[], 1], [["query"], 100]]);
  assert.match(report, /Kopā\t5\t150/);
  assert.match(report, /ziemas kalendārs\t1\t25/);
  assert.match(report, /anonimizē/);
  assert.doesNotMatch(report, /test-only/);
});

test("invalid page or dates and missing credentials perform no request; permission errors and unavailable data differ", async () => {
  const { pageQueryReport } = await import("../scripts/seo-queries.mjs");
  const unused = async () => { assert.fail("validation must precede network requests"); };
  await assert.rejects(pageQueryReport(range, { token: "", fetcher: unused }), /GSC_ACCESS_TOKEN/);
  for (const invalid of [{ page: "//other.example/" }, { page: "/calendar?test=1" },
    { from: "2026-02-30" }, { to: "2026-07-12" }]) {
    await assert.rejects(pageQueryReport({ ...range, ...invalid }, { token: "test-only", fetcher: unused }), /(?:--page|--from)/);
  }
  await assert.rejects(pageQueryReport(range, { token: "test-only", fetcher: async () => new Response(null, { status: 403 }) }), /HTTP 403/);
  const empty = await pageQueryReport(range, { token: "test-only", fetcher: async () => Response.json({ responseAggregationType: "byPage" }) });
  assert.match(empty, /neatgrieza kopsummas rindu/);
  assert.doesNotMatch(empty, /Kopā\t0/);
});
