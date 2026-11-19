import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

const origin = "https://www.menesseja.lv";
const queryLimit = 100;
const example = "npm run seo:queries -- --page /kalendars/2026/decembris --from 2026-08-17 --to 2026-11-16";
const format = new Intl.NumberFormat("lv-LV", { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat("lv-LV", { style: "percent", maximumFractionDigits: 2 });

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// https://developers.google.com/webmaster-tools/v1/searchanalytics/query
export async function pageQueryReport({ page, from, to }, {
  token = process.env.GSC_ACCESS_TOKEN,
  property = process.env.GSC_SITE_URL || "sc-domain:menesseja.lv",
  fetcher = fetch,
} = {}) {
  if (!validDate(from) || !validDate(to) || from > to) {
    throw new Error("Norādi derīgu intervālu ar --from un --to formātā YYYY-MM-DD.");
  }
  if (typeof page !== "string" || !page.startsWith("/") || page.startsWith("//") || /[?#\\]/.test(page)
    || new URL(page, origin).pathname !== page) {
    throw new Error("Ar --page norādi precīzu menesseja.lv ceļu, piemēram, /kalendars/2026/decembris.");
  }
  if (!token?.trim()) throw new Error("GSC_ACCESS_TOKEN nav pieejams. Lapas vaicājumu dati nav nolasīti.");
  const url = origin + page;
  const endpoint = "https://www.googleapis.com/webmasters/v3/sites/" + encodeURIComponent(property) + "/searchAnalytics/query";
  const filter = { dimension: "page", operator: "equals", expression: url };
  const common = { startDate: from, endDate: to, type: "web", dataState: "final", aggregationType: "byPage",
    dimensionFilterGroups: [{ groupType: "and", filters: [filter] }] };

  async function read(dimensions, rowLimit) {
    const response = await fetcher(endpoint, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(20000),
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ ...common, dimensions, rowLimit }),
    });
    if (!response.ok) {
      const detail = response.status === 401 || response.status === 403
        ? " Pārbaudi lasīšanas piekļuvi īpašumam un piekļuves marķiera derīgumu." : "";
      throw new Error("Google Search Analytics HTTP " + response.status + "." + detail);
    }
    const data = await response.json();
    if (data.rows === undefined) return [];
    if (!Array.isArray(data.rows) || data.rows.some((row) => !row
      || ![row.clicks, row.impressions, row.ctr, row.position].every(Number.isFinite)
      || (dimensions.length && typeof row.keys?.[0] !== "string"))) {
      throw new Error("Google Search Analytics atbildē nav gaidīto rādītāju.");
    }
    return data.rows;
  }

  const [total] = await read([], 1);
  const queries = await read(["query"], queryLimit);
  const metrics = (row) => [row.clicks, row.impressions, percent.format(row.ctr), format.format(row.position)].join("\t");
  const header = "Klikšķi\tRādījumi\tKlikšķu īpatsvars\tVidējā pozīcija";
  const report = [
    url + " | " + from + " – " + to + " | Google tīmekļa meklēšana | galīgie dati",
    "Lapa\t" + header,
    total ? "Kopā\t" + metrics(total) : "Google šai lapai un periodam neatgrieza kopsummas rindu.",
    "", "Vaicājums\t" + header,
  ];
  for (const row of queries.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions || a.keys[0].localeCompare(b.keys[0], "lv"))) {
    const query = row.keys[0].replace(/[\x00-\x1F\x7F]/g, " ");
    report.push(query + "\t" + metrics(row));
  }
  const clicks = queries.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = queries.reduce((sum, row) => sum + row.impressions, 0);
  report.push("", "Parādīti " + queries.length + " vaicājumi (limits " + queryLimit + "), kopā " + clicks + " klikšķi un " + impressions + " rādījumi.",
    "Google anonimizē daļu vaicājumu un atgriež nozīmīgākās rindas. Redzamo vaicājumu summa var būt mazāka par lapas kopsummu.");
  return report.join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { values } = parseArgs({ options: { page: { type: "string" }, from: { type: "string" },
      to: { type: "string" }, help: { type: "boolean" } } });
    if (values.help) {
      console.log(example + "\nIzmanto GSC_ACCESS_TOKEN ar webmasters.readonly piekļuvi. GSC_SITE_URL var norādīt citu šī domēna īpašumu.");
    } else {
      console.log(await pageQueryReport(values));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
