import fs from "node:fs";
import path from "node:path";

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
  items?: string[];
  listStyle?: "bulleted" | "numbered" | "check";
  table?: {
    headers: string[];
    rows: string[][];
  };
}

/** A curated out-link to a crop / flower / pest / recipe / other article page. */
export interface ArticleLink {
  label: string;
  href: string;
}

export interface ArticleSource {
  label: string;
  url: string;
}

export type ArticleIntent = "problem" | "how-to" | "seasonal" | "reference";

export interface ArticleEntities {
  crops?: string[];
  pests?: string[];
  recipes?: string[];
}

export interface Article {
  title: string;
  seoTitle?: string;
  slug: string;
  category: string;
  intent: ArticleIntent;
  excerpt: string;
  shortAnswer: string;
  primaryQuery: string;
  aliases?: string[];
  publishedAt: string;
  updatedAt: string;
  seasonalMonths?: number[];
  entities?: ArticleEntities;
  relatedSlugs?: string[];
  sources: ArticleSource[];
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

function overlap(a: string[] | undefined, b: string[] | undefined): number {
  if (!a?.length || !b?.length) return 0;
  const right = new Set(b);
  return a.reduce((n, value) => n + Number(right.has(value)), 0);
}

/** Deterministic related-content ranking: editorial choices first, then shared
 * entities/intent/season. Generic same-category content is only a fallback. */
export function getRelatedArticles(article: Article, limit = 4): Article[] {
  const all = getAllArticles().filter((candidate) => candidate.slug !== article.slug);
  const explicit = new Map((article.relatedSlugs ?? []).map((slug, index) => [slug, index]));
  return all
    .map((candidate) => {
      const explicitIndex = explicit.get(candidate.slug);
      const entityScore =
        overlap(article.entities?.crops, candidate.entities?.crops) * 12 +
        overlap(article.entities?.pests, candidate.entities?.pests) * 10 +
        overlap(article.entities?.recipes, candidate.entities?.recipes) * 8;
      const seasonScore = overlap(
        article.seasonalMonths?.map(String),
        candidate.seasonalMonths?.map(String),
      );
      const score =
        (explicitIndex === undefined ? 0 : 100 - explicitIndex) +
        entityScore +
        Number(article.intent === candidate.intent) * 3 +
        seasonScore * 2 +
        Number(article.category === candidate.category);
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title, "lv"))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
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
