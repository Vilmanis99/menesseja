import fs from "node:fs";
import path from "node:path";

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

/** A curated out-link to a crop / flower / pest / recipe / other article page. */
export interface ArticleLink {
  label: string;
  href: string;
}

export interface Article {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  readMinutes: number;
  body: ArticleSection[];
  /** Optional related pages elsewhere on the site (cluster interlinking). */
  links?: ArticleLink[];
}

const DIR = path.join(process.cwd(), "content", "articles");

function read(file: string): Article | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, file), "utf-8")) as Article;
  } catch {
    return null;
  }
}

export function articleSlugs(): string[] {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export function getAllArticles(): Article[] {
  return articleSlugs()
    .map((s) => read(`${s}.json`))
    .filter((a): a is Article => a !== null);
}

export function getArticle(slug: string): Article | null {
  return read(`${slug}.json`);
}

const LV_DIACRITICS: Record<string, string> = {
  ā: "a", č: "c", ē: "e", ģ: "g", ī: "i", ķ: "k", ļ: "l", ņ: "n", š: "s", ū: "u", ž: "z", ō: "o",
};

/** Slugify a heading into a stable anchor id (Latvian diacritics → ASCII). */
export function headingSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[āčēģīķļņšūžō]/g, (c) => LV_DIACRITICS[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extract Q&A pairs from an article's "biežākie jautājumi" section, if present.
 * Each paragraph is written as "Jautājums? Atbilde." — split on the first "?".
 * Used to emit FAQPage JSON-LD (Google rich results + AI-engine extraction).
 */
export function articleFaq(a: Article): { q: string; a: string }[] {
  const section = a.body.find((s) => s.heading && /jautājumi/i.test(s.heading));
  if (!section) return [];
  const out: { q: string; a: string }[] = [];
  for (const para of section.paragraphs) {
    const i = para.indexOf("?");
    if (i === -1) continue;
    const q = para.slice(0, i + 1).trim();
    const ans = para.slice(i + 1).trim();
    if (q && ans) out.push({ q, a: ans });
  }
  return out;
}
