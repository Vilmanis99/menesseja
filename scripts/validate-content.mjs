import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const articleDir = path.join(root, "content", "articles");
const loadDir = (name) => new Set(fs.readdirSync(path.join(root, "content", name)).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")));
const articles = loadDir("articles");
const crops = loadDir("crops");
const flowers = loadDir("flowers");
const pests = loadDir("kaitekli");
const recipes = loadDir("recipes");
const tops = loadDir("tops");
const errors = [];
const warnings = [];
const queries = new Map();
const required = ["title", "slug", "category", "intent", "excerpt", "shortAnswer", "primaryQuery", "publishedAt", "updatedAt", "sources", "body"];
const intents = new Set(["problem", "how-to", "seasonal", "reference"]);
const routeRoots = new Set(["", "augi", "pukes", "kaitekli", "receptes", "raksti", "topi", "kalendars", "ko-set", "planotajs", "kopiena", "iesutit", "macies", "par", "privatums", "regioni", "celvedis", "meness"]);

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function resolves(href) {
  if (/^(https?:|mailto:|#)/.test(href)) return true;
  const clean = href.split(/[?#]/)[0].replace(/^\//, "");
  const [rootName, slug] = clean.split("/");
  if (!routeRoots.has(rootName)) return false;
  if (!slug) return true;
  if (rootName === "raksti") return articles.has(slug);
  if (rootName === "augi") return crops.has(slug) || flowers.has(slug);
  if (rootName === "pukes") return flowers.has(slug);
  if (rootName === "kaitekli") return pests.has(slug);
  if (rootName === "receptes") return recipes.has(slug);
  if (rootName === "topi") return tops.has(slug);
  return true;
}

for (const file of [...articles].sort()) {
  const a = JSON.parse(fs.readFileSync(path.join(articleDir, `${file}.json`), "utf8"));
  for (const key of required) if (a[key] === undefined || a[key] === "") errors.push(`${file}: trūkst ${key}`);
  if (a.slug !== file) errors.push(`${file}: slug nesakrīt ar faila nosaukumu`);
  if (!intents.has(a.intent)) errors.push(`${file}: nederīgs intent`);
  if (!validDate(a.publishedAt) || !validDate(a.updatedAt)) errors.push(`${file}: nederīgs datums`);
  if (a.excerpt?.length < 80 || a.excerpt?.length > 230) errors.push(`${file}: excerpt jābūt 80–230 zīmēm`);
  if (a.shortAnswer?.length < 90 || a.shortAnswer?.length > 520) errors.push(`${file}: īsā atbilde jābūt 90–520 zīmēm`);
  if (!Array.isArray(a.sources) || a.sources.length < 2 || a.sources.some((s) => !s.label || !/^https:\/\//.test(s.url))) errors.push(`${file}: vajag vismaz 2 pilnus HTTPS avotus`);
  if (!Array.isArray(a.body) || !a.body.length || a.body.some((s) => !Array.isArray(s.paragraphs) || !s.paragraphs.length)) errors.push(`${file}: nederīga body struktūra`);
  for (const [index, section] of (a.body ?? []).entries()) {
    if (section.items && (!Array.isArray(section.items) || !section.items.length || section.items.some((item) => typeof item !== "string" || item.length < 12))) errors.push(`${file}: nederīgs saraksts ${index + 1}. sadaļā`);
    if (section.listStyle && !["bulleted", "numbered", "check"].includes(section.listStyle)) errors.push(`${file}: nederīgs listStyle ${index + 1}. sadaļā`);
    if (section.table) {
      const width = section.table.headers?.length ?? 0;
      if (width < 2 || !Array.isArray(section.table.rows) || !section.table.rows.length || section.table.rows.some((row) => !Array.isArray(row) || row.length !== width)) errors.push(`${file}: nederīga tabula ${index + 1}. sadaļā`);
    }
  }
  const hasFaq = a.body?.some((s) => /jautājumi/i.test(s.heading ?? ""));
  if (!hasFaq) warnings.push(`${file}: vēl nav FAQ sadaļas`);
  if (queries.has(a.primaryQuery)) errors.push(`${file}: primaryQuery dublējas ar ${queries.get(a.primaryQuery)}`);
  queries.set(a.primaryQuery, file);
  for (const link of a.links ?? []) if (!resolves(link.href)) errors.push(`${file}: neatrisināta saite ${link.href}`);
  for (const slug of a.relatedSlugs ?? []) if (!articles.has(slug)) errors.push(`${file}: relatedSlugs nav ${slug}`);
  for (const id of a.entities?.crops ?? []) if (!crops.has(id) && !flowers.has(id)) errors.push(`${file}: nezināms augs ${id}`);
  for (const id of a.entities?.pests ?? []) if (!pests.has(id)) errors.push(`${file}: nezināms kaitēklis ${id}`);
  for (const id of a.entities?.recipes ?? []) if (!recipes.has(id)) errors.push(`${file}: nezināma recepte ${id}`);
}

if (warnings.length) console.warn(`Satura brīdinājumi (${warnings.length}):\n- ${warnings.join("\n- ")}`);
if (errors.length) {
  console.error(`Satura kļūdas (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Saturs derīgs: ${articles.size} raksti, ${warnings.length} plānoti FAQ uzlabojumi.`);
