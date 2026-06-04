import fs from "node:fs";
import path from "node:path";

export interface TopItem {
  rank: number;
  cropId: string;
  name: string;
  blurb: string;
}

export interface TopList {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  intro: string[];
  items: TopItem[];
  outro: string;
}

const DIR = path.join(process.cwd(), "content", "tops");

function read(file: string): TopList | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, file), "utf-8")) as TopList;
  } catch {
    return null;
  }
}

export function topSlugs(): string[] {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export function getAllTopLists(): TopList[] {
  return topSlugs()
    .map((s) => read(`${s}.json`))
    .filter((t): t is TopList => t !== null);
}

export function getTopList(slug: string): TopList | null {
  return read(`${slug}.json`);
}
