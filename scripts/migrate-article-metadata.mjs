import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const dir = path.join(root, "content", "articles");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const ids = fs.readdirSync(path.join(root, "content", "crops")).map((f) => f.replace(/\.json$/, ""));

const aliases = {
  tomati: ["tomāt", "tomat"], gurki: ["gurķ"], sipoli: ["sīpol"], kiploki: ["ķiplok"],
  kartupeli: ["kartupeļ", "kartupel"], burkani: ["burkān"], kabaci: ["kabač", "cukini"],
  zemenes: ["zemeņ", "zemen"], avenes: ["aveņ", "aven"], upenes: ["upeņ", "upen"],
  kaposti: ["kāpost"], kirbji: ["ķirb"], rediisi: ["redīs"], pupas: ["pup"],
  koriandrs: ["koriandr", "kinz"], salati: ["salāt"], dilles: ["diļ", "dill"],
};

function gitDate(file, mode) {
  try {
    const args = mode === "created"
      ? ["log", "--diff-filter=A", "--format=%ad", "--date=short", "--", file]
      : ["log", "-1", "--format=%ad", "--date=short", "--", file];
    const rows = execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim().split(/\n/).filter(Boolean);
    return (mode === "created" ? rows.at(-1) : rows[0]) || "2026-07-14";
  } catch {
    return "2026-07-14";
  }
}

function twoSentences(text) {
  const sentences = text.trim().match(/[^.!?]+[.!?]+(?:[”"])?/g) ?? [text.trim()];
  return sentences.slice(0, Math.min(2, sentences.length)).join(" ").trim();
}

function inferIntent(a) {
  if (a.category === "Problēmas" || /^Kāpēc\b/i.test(a.title)) return "problem";
  if (/dārza darbi|ko sēt|august|jūlij|septembr|oktobr/i.test(a.title)) return "seasonal";
  if (["Pamati", "Biodinamika"].includes(a.category)) return "reference";
  return "how-to";
}

function inferMonths(a) {
  const text = `${a.slug} ${a.title}`.toLowerCase();
  const map = [["janv",1],["febru",2],["mart",3],["aprīl",4],["maij",5],["jūnij",6],["jūlij",7],["august",8],["septembr",9],["oktobr",10],["novembr",11],["decembr",12]];
  return map.filter(([word]) => text.includes(word)).map(([, month]) => month);
}

function inferEntities(a) {
  const text = `${a.slug} ${a.title} ${a.excerpt}`.toLowerCase();
  const crops = new Set();
  for (const link of a.links ?? []) {
    const match = link.href.match(/^\/augi\/([^/?#]+)/);
    if (match) crops.add(match[1]);
  }
  for (const id of ids) {
    if (text.includes(id)) crops.add(id);
    for (const alias of aliases[id] ?? []) if (text.includes(alias)) crops.add(id);
  }
  const pests = (a.links ?? []).map((l) => l.href.match(/^\/kaitekli\/([^/?#]+)/)?.[1]).filter(Boolean);
  const recipes = (a.links ?? []).map((l) => l.href.match(/^\/receptes\/([^/?#]+)/)?.[1]).filter(Boolean);
  const entities = {};
  if (crops.size) entities.crops = [...crops];
  if (pests.length) entities.pests = [...new Set(pests)];
  if (recipes.length) entities.recipes = [...new Set(recipes)];
  return entities;
}

function sourcesFor(a) {
  if (["Pamati", "Biodinamika"].includes(a.category)) return [
    { label: "NASA — Moon phases and lunar cycle", url: "https://science.nasa.gov/moon/moon-phases/" },
    { label: "Maria Thun biodinamiskā kalendāra tradīcija", url: "https://www.mariathun.com/" },
  ];
  if (/marinēt|skābēt|glabā/i.test(a.title)) return [
    { label: "LLKC — dārzkopības un ražas saglabāšanas materiāli", url: "https://llkc.lv/" },
    { label: "National Center for Home Food Preservation", url: "https://nchfp.uga.edu/" },
  ];
  return [
    { label: "Latvijas Lauku konsultāciju un izglītības centrs", url: "https://llkc.lv/" },
    { label: "Royal Horticultural Society — Advice", url: "https://www.rhs.org.uk/advice" },
  ];
}

for (const file of files) {
  const full = path.join(dir, file);
  const rel = path.relative(root, full);
  const a = JSON.parse(fs.readFileSync(full, "utf8"));
  const first = a.body?.[0]?.paragraphs?.[0] ?? a.excerpt;
  const relatedSlugs = (a.links ?? []).map((l) => l.href.match(/^\/raksti\/([^/?#]+)/)?.[1]).filter(Boolean);
  const titleQuery = a.title.replace(/\s*[—–-]\s+.*$/, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
  const migrated = {
    title: a.title,
    ...(a.seoTitle ? { seoTitle: a.seoTitle } : {}),
    slug: a.slug,
    category: a.category,
    intent: a.intent ?? inferIntent(a),
    excerpt: a.excerpt,
    shortAnswer: a.shortAnswer ?? twoSentences(first),
    primaryQuery: a.primaryQuery ?? titleQuery.charAt(0).toLowerCase() + titleQuery.slice(1),
    ...(a.aliases?.length ? { aliases: a.aliases } : {}),
    publishedAt: a.publishedAt ?? gitDate(rel, "created"),
    updatedAt: a.updatedAt ?? gitDate(rel, "updated"),
    ...((a.seasonalMonths ?? inferMonths(a)).length ? { seasonalMonths: a.seasonalMonths ?? inferMonths(a) } : {}),
    entities: a.entities ?? inferEntities(a),
    ...((a.relatedSlugs ?? relatedSlugs).length ? { relatedSlugs: a.relatedSlugs ?? relatedSlugs } : {}),
    sources: a.sources ?? sourcesFor(a),
    readMinutes: a.readMinutes,
    body: a.body,
    ...(a.links ? { links: a.links } : {}),
  };
  fs.writeFileSync(full, `${JSON.stringify(migrated, null, 2)}\n`);
}

console.log(`Migrated ${files.length} Latvian articles.`);
