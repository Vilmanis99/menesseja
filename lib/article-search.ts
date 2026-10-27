import { MONTH_SLUGS } from "./seo";

export interface ArticleFilters {
  query: string;
  category: string;
  month: number;
}

export const EMPTY_ARTICLE_FILTERS: ArticleFilters = { query: "", category: "Visi", month: 0 };
export const ARTICLE_QUERY_LIMIT = 120;

export interface SearchableArticle {
  title: string;
  excerpt: string;
  category: string;
  searchTerms?: string[];
  seasonalMonths?: number[];
}

/** Latvian keyboard variants and word order should not hide a relevant article. */
export function normalizeArticleQuery(value: string): string {
  return value.toLocaleLowerCase("lv").normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function matchesArticle(article: SearchableArticle, filters: ArticleFilters): boolean {
  if (filters.category !== "Visi" && article.category !== filters.category) return false;
  if (filters.month !== 0 && !article.seasonalMonths?.includes(filters.month)) return false;
  const terms = normalizeArticleQuery(filters.query).split(" ").filter(Boolean);
  const text = normalizeArticleQuery([article.title, article.excerpt, article.category, ...(article.searchTerms ?? [])].join(" "));
  return terms.every((term) => text.includes(term));
}

export function readArticleFilters(search: string, categories: string[]): ArticleFilters {
  const params = new URLSearchParams(search);
  const category = params.get("kategorija") ?? "Visi";
  return {
    query: (params.get("q") ?? "").slice(0, ARTICLE_QUERY_LIMIT),
    category: categories.includes(category) ? category : "Visi",
    month: MONTH_SLUGS.findIndex((slug) => slug === params.get("menesis")) + 1,
  };
}

/** Preserve unrelated query parameters, including incoming campaign tags. */
export function articleSearchParams(filters: ArticleFilters, search = ""): string {
  const params = new URLSearchParams(search);
  params.delete("q");
  params.delete("kategorija");
  params.delete("menesis");
  const query = filters.query.trim().slice(0, ARTICLE_QUERY_LIMIT);
  if (query) params.set("q", query);
  if (filters.category !== "Visi") params.set("kategorija", filters.category);
  if (Number.isInteger(filters.month) && filters.month >= 1 && filters.month <= 12) params.set("menesis", MONTH_SLUGS[filters.month - 1]);
  return params.toString();
}
