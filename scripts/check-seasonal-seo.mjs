import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";

const { values } = parseArgs({ options: {
  from: { type: "string" },
  sitemap: { type: "boolean" },
  "expect-sitemap": { type: "string" },
  include: { type: "string", multiple: true },
  help: { type: "boolean" },
} });
if (values.help) {
  console.log([
    "npm run seo:season -- [--from YYYY-MM] [--sitemap] [--expect-sitemap fails] [--include /raksti/...]",
    "Pārbauda trīs mēnešus, sākot ar norādīto vai nākamo mēnesi pēc Latvijas laika.",
    "--sitemap papildus pārbauda visas publiskajā vietnes kartē uzskaitītās lapas.",
    "--expect-sitemap salīdzina publiskās kartes adreses ar norādītā produkcijas laidiena vietnes kartes XML failu.",
    "--include pievieno konkrētu menesseja.lv lapu. Šo opciju var atkārtot.",
    "Google indeksa statusa nolasīšanai izmanto GSC_ACCESS_TOKEN ar webmasters.readonly piekļuvi.",
    "GSC_SITE_URL var norādīt citu šī domēna Search Console īpašumu.",
  ].join("\n"));
  process.exit(0);
}
const origin = "https://www.menesseja.lv";
const property = process.env.GSC_SITE_URL || "sc-domain:menesseja.lv";
const token = process.env.GSC_ACCESS_TOKEN;
const now = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "Europe/Riga" }).formatToParts(new Date());
const current = (key) => Number(now.find((part) => part.type === key).value);
if (values.from !== undefined && !/^\d{4}-(0[1-9]|1[0-2])$/.test(values.from)) throw new Error("--from formāts ir YYYY-MM.");
const [year, month] = values.from ? values.from.split("-").map(Number) : [current("year"), current("month") + 1];
const monthName = new Intl.DateTimeFormat("lv-LV", { month: "long", timeZone: "UTC" });
const paths = new Set();
for (let offset = 0; offset < 3; offset++) {
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  const slug = monthName.format(date).normalize("NFD").replace(/\p{M}/gu, "");
  paths.add(`/kalendars/${date.getUTCFullYear()}/${slug}`);
  paths.add(`/ko-set/${slug}`);
  paths.add(`/kalendars/${date.getUTCFullYear()}`);
}

function isPagePath(path) {
  return path.startsWith("/") && !path.startsWith("//") && !/[?#\\]/.test(path)
    && new URL(path, origin).pathname === path;
}
for (const path of values.include ?? []) {
  if (!isPagePath(path)) throw new Error("--include jānorāda menesseja.lv lapas ceļš, piemēram, /raksti/amarillis-pec-ziedesanas.");
  paths.add(path);
}

function request(url, options = {}) {
  return fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20000), ...options });
}

function parseSitemapUrls(xml, reference = false) {
  const source = reference ? "Norādītais būves XML" : "sitemap.xml";
  const markup = xml.replace(/<!--[\s\S]*?-->/g, "");
  if (!/<urlset\b[^>]*(?:\/>|>[\s\S]*<\/urlset\s*>)/.test(markup)) throw new Error(`${source} nesatur pilnu URL sarakstu.`);
  const entries = new Set();
  for (const [, raw] of markup.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
    const path = raw === origin ? "/" : raw.slice(origin.length);
    if (!raw.startsWith(origin) || !isPagePath(path)) {
      if (reference) throw new Error("Norādītajā būves XML atrasta adrese ārpus menesseja.lv lapu saraksta.");
      console.error("Vietnes kartē atrasta adrese ārpus menesseja.lv lapu saraksta.");
      process.exitCode = 1;
      continue;
    }
    entries.add(origin + path);
  }
  if (reference && !entries.size) throw new Error("Norādītajā būves XML nav pārbaudāmu lapu.");
  return entries;
}

async function sitemapUrls() {
  const response = await request(origin + "/sitemap.xml");
  if (response.status !== 200) throw new Error(`sitemap.xml HTTP ${response.status}`);
  const entries = parseSitemapUrls(await response.text());
  if (!entries.size) unavailable(new Error("Vietnes kartē nav pārbaudāmu lapu."));
  return entries;
}

function compareSitemaps(actual, expected) {
  const missing = [...expected].filter(url => !actual.has(url)).sort();
  const unexpected = [...actual].filter(url => !expected.has(url)).sort();
  console.log(`Vietnes kartē ir ${actual.size} adreses, būves XML ir ${expected.size}. Trūkst ${missing.length}, neparedzētas ${unexpected.length}.`);
  for (const url of missing) console.error(`Publiskajā vietnes kartē trūkst ${url}`);
  for (const url of unexpected) console.error(`Neparedzēta adrese publiskajā vietnes kartē ${url}`);
  if (missing.length || unexpected.length) process.exitCode = 1;
}

async function googlebotRules() {
  const response = await request(origin + "/robots.txt");
  if (response.status !== 200) throw new Error(`robots.txt HTTP ${response.status}`);
  const text = await response.text();
  if (/^\s*</.test(text)) throw new Error("robots.txt vietā saņemts HTML vai XML.");
  const groups = [];
  let group;
  for (const line of text.split(/\r\n|\r|\n/)) {
    const match = line.split("#", 1)[0].trim().match(/^(user-agent|allow|disallow)\s*:\s*(.*?)\s*$/i);
    if (!match) continue;
    const field = match[1].toLowerCase();
    const value = match[2];
    if (field === "user-agent") {
      if (!group || group.rules.length) {
        group = { agents: [], rules: [] };
        groups.push(group);
      }
      group.agents.push(value === "*" ? "*" : value.toLowerCase().split(/[/\s*]/, 1)[0]);
    } else if (group) {
      group.rules.push({ field, path: value });
    }
  }
  const agent = groups.some((item) => item.agents.includes("googlebot")) ? "googlebot" : "*";
  return groups.filter((item) => item.agents.includes(agent)).flatMap((item) => item.rules)
    .filter((rule) => rule.path.startsWith("/"))
    .sort((a, b) => b.path.length - a.path.length || a.field.localeCompare(b.field));
}

// The scheduled URL paths are ASCII. A final $ anchors the rule, and * spans slashes.
function matchesRobotPath(path, pattern) {
  const end = pattern.endsWith("$");
  const parts = (end ? pattern.slice(0, -1) : pattern).split("*");
  const prefix = parts.shift();
  if (!path.startsWith(prefix)) return false;
  if (!parts.length) return !end || path === prefix;
  const suffix = end ? parts.pop() : "";
  if (!path.endsWith(suffix) || prefix.length + suffix.length > path.length) return false;
  let rest = path.slice(prefix.length, path.length - suffix.length);
  for (const part of parts) {
    const index = rest.indexOf(part);
    if (index < 0) return false;
    rest = rest.slice(index + part.length);
  }
  return true;
}

function pageSignals(html, url, header) {
  const canonical = [];
  const directives = [];
  // Read the site's server-rendered link and meta elements, skipping JS payloads.
  const markup = html.replace(/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  for (const [tag] of markup.matchAll(/<(?:meta|link)\b[^>]*>/gi)) {
    const attrs = {};
    for (const [, key, double, single, plain] of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      attrs[key.toLowerCase()] = double ?? single ?? plain;
    }
    if (attrs.rel?.toLowerCase().split(/\s+/).includes("canonical") && attrs.href) canonical.push(new URL(attrs.href, url).href);
    if (["robots", "googlebot"].includes(attrs.name?.toLowerCase())) directives.push(attrs.content || "");
  }
  // An agent prefix scopes subsequent directives in the same header value.
  let agent = "";
  for (let entry of (header || "").toLowerCase().split(",")) {
    const scoped = entry.trim().match(/^([\w*-]+):\s*(.*)$/);
    if (scoped) { agent = scoped[1]; entry = scoped[2]; }
    if (!agent || agent === "googlebot" || agent === "*") directives.push(entry);
  }
  const findings = [];
  if (canonical.length !== 1 || canonical[0] !== url) findings.push(`canonical: ${canonical.join(", ") || "nav"}`);
  if (directives.some((value) => /(?:^|[\s,])(noindex|none)(?:[\s,]|$)/i.test(value))) findings.push("noindex");
  return findings;
}

async function inspectGoogle(url) {
  const response = await request("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: property, languageCode: "lv" }),
  });
  if (!response.ok) {
    const error = new Error(`URL Inspection HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const result = (await response.json()).inspectionResult?.indexStatusResult;
  if (!result?.verdict) throw new Error("Google atbildē nav indeksa pārbaudes rezultāta.");
  const verdict = result.verdict;
  const canonicalMatches = !result.googleCanonical || new URL(result.googleCanonical).href === url;
  const label = { PASS: canonicalMatches ? "indeksēts" : "Google izvēlējās citu kanonisko adresi", NEUTRAL: "izslēgts", FAIL: "Google konstatēja kļūdu" }[verdict] || "nav apstiprināts";
  const details = [
    `Google: ${label} (${verdict})`,
    result?.coverageState ?? "iemesls nav norādīts",
    `pēdējā pārmeklēšana: ${result?.lastCrawlTime ?? "nav datu"}`,
    `Google canonical: ${result?.googleCanonical ?? "nav datu"}`,
  ];
  console.log("  " + details.join(" · "));
  if (verdict !== "PASS" || !canonicalMatches) process.exitCode = 1;
  return verdict;
}

function unavailable(error) {
  console.error(`Pārbaudes resurss nav pieejams: ${error.message}`);
  process.exitCode = 1;
}
const referenceFile = values["expect-sitemap"];
const expected = referenceFile === undefined ? null : parseSitemapUrls(await readFile(referenceFile, "utf8"), true);
const [sitemap, robots] = await Promise.all([sitemapUrls().catch(unavailable), googlebotRules().catch(unavailable)]);
if (expected && sitemap) compareSitemaps(sitemap, expected);
if (values.sitemap && sitemap) {
  for (const url of sitemap) paths.add(new URL(url).pathname);
}
let publicPass = 0;
let googleRead = 0;
let googlePass = 0;
let inspect = Boolean(token);
if (!token) console.log("Google indekss nav pārbaudīts. GSC_ACCESS_TOKEN nav pieejams.");
console.log("Publiski pārbaudām HTTP 200, vietnes karti, Googlebot piekļuvi, kanonisko adresi un noindex.");
for (const path of paths) {
  const url = origin + path;
  const findings = [];
  if (sitemap && !sitemap.has(url)) findings.push("adreses nav vietnes kartē");
  if (!sitemap) findings.push("vietnes karte nav pārbaudīta");
  if (!robots) findings.push("robots.txt nav pārbaudīts");
  const rule = robots?.find((item) => matchesRobotPath(path, item.path));
  if (rule?.field === "disallow") findings.push(`Googlebot bloķē robots.txt noteikums Disallow: ${rule.path}`);
  try {
    const response = await request(url);
    if (response.status !== 200) findings.push(`HTTP ${response.status}`);
    else findings.push(...pageSignals(await response.text(), url, response.headers.get("x-robots-tag")));
  } catch (error) {
    findings.push(`lapu neizdevās pārbaudīt: ${error.message}`);
  }
  console.log(`${path} — ${findings.length ? findings.join("; ") : "publiskās pārbaudes izturētas"}`);
  if (findings.length) process.exitCode = 1;
  else publicPass++;
  if (inspect) {
    try {
      const verdict = await inspectGoogle(url);
      googleRead++;
      if (verdict === "PASS") googlePass++;
    } catch (error) {
      console.error(`  Google statuss nav pārbaudīts: ${error.message}`);
      if ([401, 429].includes(error.status)) {
        inspect = false;
        console.error("Tālāk turpinās publiskās pārbaudes. Google pieprasījumiem jāpārbauda piekļuve vai kvota.");
      }
      process.exitCode = 1;
    }
  }
}
console.log(`Publiskās pārbaudes izturēja ${publicPass} no ${paths.size} adresēm.`);
console.log(`Google indeksa rezultāti saņemti ${googleRead} no ${paths.size} adresēm.`);
if (googleRead) console.log(`Google norādīja PASS ${googlePass} adresēm.`);
