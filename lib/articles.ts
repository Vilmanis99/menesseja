import fs from "node:fs";
import path from "node:path";

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
}

export interface Article {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  readMinutes: number;
  body: ArticleSection[];
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
