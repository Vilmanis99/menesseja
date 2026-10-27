import { normalizeArticleQuery } from "./article-search";

export interface ProblemFilters {
  query: string;
  type: "visi" | "kaiteklis" | "slimiba";
}

export const EMPTY_PROBLEM_FILTERS: ProblemFilters = { query: "", type: "visi" };

// Reader wording can differ from the inflected or specialist wording in a guide.
// These terms aid discovery; a match is not a diagnosis.
const SEARCH_TERMS: Record<string, string[]> = {
  laputis: ["lipīgas lapas", "lipīga lapa", "lapas čokurojas"],
  baltblusina: ["lipīgas lapas", "lipīga lapa", "balti kukaiņi"],
  tiklerces: ["tīkls", "smalks tīkls", "zirnekļa tīkls"],
  miltrasa: ["balts aplikums", "balts pārklājums", "miltaini plankumi"],
  "lakstu-puve": ["brūni plankumi", "tomātu puve", "kartupeļu puve"],
};

export function problemSearchText(problem: { slug: string; name: string; latin?: string; tagline: string; shortAnswer?: string; affects: string[]; signs: string[] }): string {
  return [problem.name, problem.latin, problem.tagline, problem.shortAnswer, ...problem.affects, ...problem.signs, ...(SEARCH_TERMS[problem.slug] ?? [])].filter(Boolean).join(" ");
}

export function readProblemFilters(search: string): ProblemFilters {
  const params = new URLSearchParams(search);
  const type = params.get("veids");
  return { query: (params.get("q") ?? "").slice(0, 120), type: type === "kaiteklis" || type === "slimiba" ? type : "visi" };
}

export function problemSearchParams(filters: ProblemFilters, search = ""): string {
  const params = new URLSearchParams(search);
  params.delete("q");
  params.delete("veids");
  const query = filters.query.trim().slice(0, 120);
  if (query) params.set("q", query);
  if (filters.type !== "visi") params.set("veids", filters.type);
  return params.toString();
}

export function matchesProblem(problem: { type: string; searchText: string }, filters: ProblemFilters): boolean {
  if (filters.type !== "visi" && filters.type !== problem.type) return false;
  const tokens = normalizeArticleQuery(filters.query).split(" ").filter(Boolean);
  const text = normalizeArticleQuery(problem.searchText);
  return tokens.every((token) => text.includes(token));
}
