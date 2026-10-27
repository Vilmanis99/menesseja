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
const images = JSON.parse(fs.readFileSync(path.join(root, "content", "images.json"), "utf8"));
const problemImages = JSON.parse(fs.readFileSync(path.join(root, "content", "problem-images.json"), "utf8"));

for (const [id, image] of Object.entries(images)) {
  const file = typeof image.src === "string" && /^\/images\/[a-z0-9/._-]+$/.test(image.src) && !image.src.includes("..")
    ? path.join(root, "public", image.src)
    : null;
  if (!file || !fs.existsSync(file)) errors.push(`attēls ${id}: nav lokālā faila`);
  if (![image.width, image.height].every((n) => Number.isInteger(n) && n > 0)) errors.push(`attēls ${id}: nederīgs izmērs`);
  for (const key of ["alt", "author", "sourceName", "license"]) {
    if (typeof image[key] !== "string" || !image[key].trim()) errors.push(`attēls ${id}: trūkst ${key}`);
  }
  for (const key of ["sourceUrl", "originalUrl", "licenseUrl"]) {
    if (typeof image[key] !== "string" || !/^https:\/\//.test(image[key])) errors.push(`attēls ${id}: nederīgs ${key}`);
  }
  if (!validDate(image.reviewedAt)) errors.push(`attēls ${id}: trūkst pārbaudes datuma`);
}

function validateImageUse(image, location) {
  if (image === undefined) return;
  if (!image || typeof image.id !== "string" || !Object.hasOwn(images, image.id)) errors.push(`${location}: nezināms attēls`);
  if (typeof image?.caption !== "string" || image.caption.trim().length < 20) errors.push(`${location}: attēlam vajag paskaidrojumu`);
}

for (const group of ["crops", "flowers"]) {
  for (const slug of loadDir(group)) {
    const entry = JSON.parse(fs.readFileSync(path.join(root, "content", group, `${slug}.json`), "utf8"));
    validateImageUse(entry.image, `${group}/${slug}`);
    validateImageUse(entry.winterImage, `${group}/${slug}: pārziemošana`);
    for (const section of entry.sections ?? []) validateImageUse(section.image, `${group}/${slug}: ${section.heading}`);
  }
}
const queries = new Map();
const required = ["title", "slug", "category", "intent", "excerpt", "shortAnswer", "primaryQuery", "publishedAt", "updatedAt", "sources", "body"];
const intents = new Set(["problem", "how-to", "seasonal", "reference"]);
const routeRoots = new Set(["", "augi", "pukes", "kaitekli", "receptes", "raksti", "topi", "kalendars", "ko-set", "planotajs", "kopiena", "iesutit", "macies", "par", "privatums", "regioni", "celvedis", "meness"]);

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function resolves(href) {
  if (/^(https?:|mailto:|#)/.test(href)) return true;
  const clean = href.split(/[?#]/)[0].replace(/^\//, "");
  const [rootName, slug, detail] = clean.split("/");
  if (!routeRoots.has(rootName)) return false;
  if (!slug) return true;
  if (rootName === "raksti") return articles.has(slug);
  if (rootName === "augi") return crops.has(slug) || flowers.has(slug);
  if (rootName === "pukes" && slug === "kas-zied") return ["pavasari", "vasara", "rudeni"].includes(detail);
  if (rootName === "pukes") return flowers.has(slug);
  if (rootName === "kaitekli") return pests.has(slug);
  if (rootName === "receptes") return recipes.has(slug);
  if (rootName === "topi") return tops.has(slug);
  return true;
}

const calendar = JSON.parse(fs.readFileSync(path.join(root, "content", "calendar-guides.json"), "utf8"));
let flowersWithSources = 0;
const flowerTypes = new Set(["daudzgadiga", "sipolpuke", "viengadiga", "divgadiga", "krums"]);
const flowerSourceSections = new Set(["intro", "planting", "care", "winter", "problems", "comparison"]);
for (const slug of flowers) {
  const flower = JSON.parse(fs.readFileSync(path.join(root, "content", "flowers", `${slug}.json`), "utf8"));
  const location = `pukes/${slug}`;
  if (flower.slug !== slug) errors.push(`${location}: slug nesakrīt ar faila nosaukumu`);
  for (const field of ["name", "tagline", "bloom", "height", "sun", "plantWhen"]) {
    if (typeof flower[field] !== "string" || !flower[field].trim()) errors.push(`${location}: trūkst ${field}`);
  }
  if (!flowerTypes.has(flower.type)) errors.push(`${location}: nederīga audzēšanas grupa`);
  if (flower.updatedAt !== undefined && !validDate(flower.updatedAt)) errors.push(`${location}: nederīgs atjaunošanas datums`);
  if (!Array.isArray(flower.bloomMonths) || !flower.bloomMonths.length || flower.bloomMonths.some((month) => !Number.isInteger(month) || month < 1 || month > 12) || new Set(flower.bloomMonths).size !== flower.bloomMonths.length) errors.push(`${location}: nederīgi ziedēšanas mēneši`);
  for (const field of ["intro", "planting", "care"]) {
    if (!Array.isArray(flower[field]) || !flower[field].length || flower[field].some((value) => typeof value !== "string" || !value.trim())) errors.push(`${location}: nepilnīgs ${field}`);
  }
  if (flower.sources?.length) {
    flowersWithSources++;
    if (!Array.isArray(flower.sources) || flower.sources.some((source) => !source.label || !/^https:\/\//.test(source.url)) || new Set(flower.sources.map((source) => source.url)).size !== flower.sources.length) errors.push(`${location}: nederīgi vai atkārtoti avoti`);
    if (!validDate(flower.updatedAt)) errors.push(`${location}: pārskatītam saturam vajag datumu`);
    for (const field of ["shortAnswer", "lifeCycle"]) if (typeof flower[field] !== "string" || !flower[field].trim()) errors.push(`${location}: pārskatītam saturam trūkst ${field}`);
    for (const section of ["intro", "planting", "care", ...(flower.winter ? ["winter"] : []), ...(flower.problems?.length ? ["problems"] : []), ...(flower.comparison ? ["comparison"] : [])]) {
      if (!flower.sectionSources?.[section]?.length) errors.push(`${location}: sadaļai ${section} trūkst avotu`);
    }
  } else warnings.push(`${location}: vēl vajadzīga padziļināta avotu pārbaude`);
  for (const [section, urls] of Object.entries(flower.sectionSources ?? {})) {
    if (!flowerSourceSections.has(section) || !Array.isArray(urls) || !urls.length || new Set(urls).size !== urls.length || urls.some((url) => !flower.sources?.some((source) => source.url === url))) errors.push(`${location}: ${section} atsaucēm jābūt unikālām saitēm no ceļveža avotu saraksta`);
  }
  if (flower.comparison && (!flower.comparison.heading || !Array.isArray(flower.comparison.items) || flower.comparison.items.length < 2 || flower.comparison.items.some((item) => !item.name || !item.description))) errors.push(`${location}: nepilnīgs augu salīdzinājums`);
  if (flower.faq?.some((item) => !item.q || !item.a)) errors.push(`${location}: nepilnīgs jautājums vai atbilde`);
  if (flower.winterTable) {
    const { headers, rows } = flower.winterTable;
    if (!flower.winter?.trim() || !Array.isArray(headers) || headers.length < 2 || headers.some((cell) => typeof cell !== "string" || !cell.trim()) || !Array.isArray(rows) || !rows.length || rows.some((row) => !Array.isArray(row) || row.length !== headers.length || row.some((cell) => typeof cell !== "string" || !cell.trim()))) errors.push(`${location}: nederīga pārziemošanas tabula`);
  }
  for (const link of flower.links ?? []) if (!link.label || !resolves(link.href)) errors.push(`${location}: neatrisināta saite ${link.href}`);
  for (const related of flower.related ?? []) if (!flowers.has(related) || related === slug) errors.push(`${location}: nederīgs saistītais ceļvedis ${related}`);
}

for (const [slug, image] of Object.entries(problemImages)) {
  if (!pests.has(slug)) errors.push(`kaitēkļu foto: nezināms ceļvedis ${slug}`);
  validateImageUse(image, `kaitekli/${slug}`);
}
for (const slug of pests) {
  const problem = JSON.parse(fs.readFileSync(path.join(root, "content", "kaitekli", `${slug}.json`), "utf8"));
  if (problem.slug !== slug || !problem.name || !problem.tagline) errors.push(`kaitekli/${slug}: nepilnīgs nosaukums vai apraksts`);
  if (!["kaiteklis", "slimiba"].includes(problem.type)) errors.push(`kaitekli/${slug}: nederīgs veids`);
  for (const field of ["affects", "signs", "intro", "control", "prevention"]) {
    if (!Array.isArray(problem[field]) || !problem[field].length || problem[field].some((value) => typeof value !== "string" || !value.trim())) errors.push(`kaitekli/${slug}: nepilnīgs ${field}`);
  }
  if (problem.sources?.length) {
    if (problem.sources.some((source) => !source.label || !/^https:\/\//.test(source.url))) errors.push(`kaitekli/${slug}: nederīgs avots`);
    if (!validDate(problem.updatedAt)) errors.push(`kaitekli/${slug}: pārbaudītam saturam vajag datumu`);
  } else warnings.push(`kaitekli/${slug}: vēl vajadzīga avotu pārbaude`);
  for (const recipe of problem.recipeSlugs ?? []) if (!recipes.has(recipe)) errors.push(`kaitekli/${slug}: nezināma recepte ${recipe}`);
  for (const link of [...(problem.relatedLinks ?? []), ...(problem.compare?.items ?? [])]) {
    if (link.href && !resolves(link.href)) errors.push(`kaitekli/${slug}: neatrisināta saite ${link.href}`);
  }
  if (problem.image && (!/^\/(?:images|kaitekli)\/[a-z0-9/._-]+$/.test(problem.image.src) || problem.image.src.includes("..") || !fs.existsSync(path.join(root, "public", problem.image.src)))) errors.push(`kaitekli/${slug}: nav agrāk pievienotā foto faila`);
}

if (!validDate(calendar.updatedAt)) errors.push("Kalendāriem vajag atjaunošanas datumu");
if (Object.keys(calendar.months).length !== 12) errors.push("Vajag tieši 12 mēnešu ceļvežus");
for (const [id, source] of Object.entries(calendar.sources)) {
  if (!source.label || !/^https:\/\//.test(source.url)) errors.push(`kalendāra avots ${id}: nederīga atsauce`);
}
const calendarTitles = new Set();
for (let month = 1; month <= 12; month++) {
  const guide = calendar.months[String(month)];
  if (!guide) { errors.push(`kalendārs ${month}: trūkst mēneša`); continue; }
  if (!guide.title || calendarTitles.has(guide.title)) errors.push(`kalendārs ${month}: vajag atšķirīgu virsrakstu`);
  calendarTitles.add(guide.title);
  if (!guide.description || guide.description.length > 200) errors.push(`kalendārs ${month}: nederīgs apraksts`);
  validateImageUse(guide.image, `kalendārs ${month}`);
  if (!Array.isArray(guide.sections) || guide.sections.length < 5) errors.push(`kalendārs ${month}: nepilnīgs darbu skaidrojums`);
  const taskIds = new Set();
  for (const section of guide.sections ?? []) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || taskIds.has(section.id)) errors.push(`kalendārs ${month}: nederīgs vai dublēts darba enkurs`);
    taskIds.add(section.id);
    if (!section.area || !section.when || !section.avoid) errors.push(`kalendārs ${month}: darbam vajag jomu, laiku un kļūdas skaidrojumu`);
    if (!Array.isArray(section.steps) || section.steps.length < 3 || section.steps.some((s) => typeof s !== "string" || s.trim().length < 20)) errors.push(`kalendārs ${month}: darbam vajag izpildāmus soļus`);
    if (!section.sourceIds?.length || section.sourceIds.some((id) => !Object.hasOwn(calendar.sources, id) || !guide.sourceIds?.includes(id))) errors.push(`kalendārs ${month}: darbam trūkst avota`);
    if (!section.heading || !section.paragraphs?.length || section.paragraphs.some((p) => !p.trim())) errors.push(`kalendārs ${month}: tukša sadaļa`);
    if (!section.link?.label || !section.link?.href || !resolves(section.link.href)) errors.push(`kalendārs ${month}: neatrisināta ceļveža saite`);
  }
  if (!Array.isArray(guide.timeline) || guide.timeline.length !== 3 || guide.timeline.some((stage) => !stage.period || !stage.focus || !stage.sectionIds?.length || stage.sectionIds.some((id) => !taskIds.has(id)))) errors.push(`kalendārs ${month}: nepilnīga darbu secība vai neatrisināts enkurs`);
  if (new Set(guide.timeline?.flatMap((stage) => stage.sectionIds) ?? []).size !== taskIds.size) errors.push(`kalendārs ${month}: darbu secībā trūkst kāda uzdevuma`);
  if (guide.faq?.length < 2 || guide.faq?.some((f) => !f.q || !f.a)) errors.push(`kalendārs ${month}: nepilnīgi jautājumi`);
  if (!guide.sourceIds?.length || guide.sourceIds.some((id) => !Object.hasOwn(calendar.sources, id))) errors.push(`kalendārs ${month}: nepilnīgi avoti`);
}

for (const file of [...articles].sort()) {
  const a = JSON.parse(fs.readFileSync(path.join(articleDir, `${file}.json`), "utf8"));
  for (const key of required) if (a[key] === undefined || a[key] === "") errors.push(`${file}: trūkst ${key}`);
  if (a.slug !== file) errors.push(`${file}: slug nesakrīt ar faila nosaukumu`);
  if (!intents.has(a.intent)) errors.push(`${file}: nederīgs intent`);
  if (!validDate(a.publishedAt) || !validDate(a.updatedAt)) errors.push(`${file}: nederīgs datums`);
  if (a.showGardenAction !== undefined && typeof a.showGardenAction !== "boolean") errors.push(`${file}: showGardenAction jābūt boolean`);
  if (a.seasonalMonths !== undefined && (
    !Array.isArray(a.seasonalMonths) || !a.seasonalMonths.length ||
    a.seasonalMonths.some((month) => !Number.isInteger(month) || month < 1 || month > 12) ||
    new Set(a.seasonalMonths).size !== a.seasonalMonths.length
  )) errors.push(`${file}: seasonalMonths jābūt unikāliem mēnešiem no 1 līdz 12`);
  if (a.excerpt?.length < 80 || a.excerpt?.length > 230) errors.push(`${file}: excerpt jābūt 80–230 zīmēm`);
  if (a.shortAnswer?.length < 90 || a.shortAnswer?.length > 520) errors.push(`${file}: īsā atbilde jābūt 90–520 zīmēm`);
  if (!Array.isArray(a.sources) || a.sources.length < 2 || a.sources.some((s) => !s.label || !/^https:\/\//.test(s.url))) errors.push(`${file}: vajag vismaz 2 pilnus HTTPS avotus`);
  if (!Array.isArray(a.body) || !a.body.length || a.body.some((s) => !Array.isArray(s.paragraphs) || !s.paragraphs.length)) errors.push(`${file}: nederīga body struktūra`);
  for (const [index, section] of (a.body ?? []).entries()) {
    validateImageUse(section.image, `${file}: ${index + 1}. sadaļa`);
    if (section.images !== undefined) {
      if (!Array.isArray(section.images) || section.images.length < 2 || section.images.length > 3) errors.push(`${file}: foto salīdzinājumam vajag 2–3 attēlus`);
      else for (const image of section.images) validateImageUse(image, `${file}: ${index + 1}. sadaļas foto salīdzinājums`);
    }
    if (section.diagram !== undefined && !["hydrangea-pruning", "greenhouse-winter"].includes(section.diagram)) errors.push(`${file}: nezināma shēma`);
    if (section.anchorAliases && (
      !Array.isArray(section.anchorAliases) || !section.anchorAliases.length ||
      new Set(section.anchorAliases).size !== section.anchorAliases.length ||
      section.anchorAliases.some((id) => typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
    )) errors.push(`${file}: nederīgi iepriekšējo sadaļu enkuri (${index + 1}. sadaļa)`);
    if (section.sourceUrls && (
      !Array.isArray(section.sourceUrls) || !section.sourceUrls.length ||
      new Set(section.sourceUrls).size !== section.sourceUrls.length ||
      section.sourceUrls.some((url) => !a.sources?.some((source) => source.url === url))
    )) errors.push(`${file}: sadaļas avotiem jābūt unikālām saitēm no raksta avotu saraksta (${index + 1}. sadaļa)`);
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
console.log(`Saturs derīgs: ${articles.size} raksti, ${flowers.size} puķu ceļveži (${flowersWithSources} ar sadaļu avotiem), ${pests.size} kaitēkļu/slimību ceļveži, 12 mēnešu ceļveži, ${Object.keys(images).length} attēli ar avotiem, ${warnings.length} plānoti satura uzlabojumi.`);
