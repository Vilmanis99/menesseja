import { ARTICLE_QUERY_LIMIT } from "@/lib/article-search";

export function PortalSearchForm({ query = "" }: { query?: string }) {
  return (
    <form action="/meklet" method="get" role="search" aria-label="Meklēt visā portālā" className="mb-lg max-w-2xl">
      <label htmlFor="portal-query" className="mb-2 block text-title-md text-on-surface">Meklēt visā portālā</label>
      <div className="flex gap-2">
        <input type="search" id="portal-query" name="q" defaultValue={query} maxLength={ARTICLE_QUERY_LIMIT}
          placeholder="Augs, jautājums vai mēnesis"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-outline-variant/40 bg-surface-container px-3 text-body-md text-on-surface" />
        <button type="submit" className="min-h-11 rounded-lg bg-primary px-4 text-label-md font-semibold text-on-primary hover:brightness-110">Meklēt</button>
      </div>
    </form>
  );
}
