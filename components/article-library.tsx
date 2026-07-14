"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { clsx } from "@/lib/clsx";

export interface ArticleTeaser {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  intent: "problem" | "how-to" | "seasonal" | "reference";
  readMinutes: number;
  updatedAt: string;
}

const INTENT_LABEL: Record<ArticleTeaser["intent"], string> = {
  problem: "Problēmas risinājums",
  "how-to": "Pamācība",
  seasonal: "Sezonāls",
  reference: "Uzziņai",
};

function Meta({ article }: { article: ArticleTeaser }) {
  return (
    <p className="mt-sm flex flex-wrap items-center gap-x-3 gap-y-1 text-label-sm text-tertiary">
      <span className="inline-flex items-center gap-1"><Icon name="schedule" size="14px" /> {article.readMinutes} min</span>
      <span>{INTENT_LABEL[article.intent]}</span>
    </p>
  );
}

function FeaturedCard({ article, primary = false }: { article: ArticleTeaser; primary?: boolean }) {
  return (
    <Link href={`/raksti/${article.slug}`} className={clsx("group block", primary && "md:row-span-2")}>
      <Card
        tone={primary ? "highest" : "high"}
        elevated
        accent={primary ? "primary" : undefined}
        className={clsx(
          "flex h-full flex-col p-md transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-surface-container-highest",
          primary && "featured-article-card min-h-64 justify-end md:min-h-full",
        )}
      >
        <p className="mb-2 text-label-sm uppercase tracking-[0.16em] text-primary">{article.category}</p>
        <h2 className={clsx("text-on-surface", primary ? "text-headline-md md:text-headline-lg" : "text-xl font-semibold")}>{article.title}</h2>
        <p className="mt-2 line-clamp-3 text-body-md leading-relaxed text-on-surface-variant">{article.excerpt}</p>
        <Meta article={article} />
      </Card>
    </Link>
  );
}

function ArticleCard({ article }: { article: ArticleTeaser }) {
  return (
    <Link href={`/raksti/${article.slug}`} className="group block h-full">
      <Card tone="high" className="flex h-full flex-col p-md transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-surface-container-highest">
        <p className="text-label-sm uppercase tracking-[0.14em] text-tertiary">{article.category}</p>
        <h2 className="mt-1 text-xl font-semibold leading-snug text-on-surface">{article.title}</h2>
        <p className="mt-2 line-clamp-3 flex-1 text-body-md leading-relaxed text-on-surface-variant">{article.excerpt}</p>
        <Meta article={article} />
      </Card>
    </Link>
  );
}

export function ArticleLibrary({ articles, featuredSlugs, monthLabel }: { articles: ArticleTeaser[]; featuredSlugs: string[]; monthLabel: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Visi");
  const categories = useMemo(() => ["Visi", ...Array.from(new Set(articles.map((article) => article.category))).sort((a, b) => a.localeCompare(b, "lv"))], [articles]);
  const featured = featuredSlugs.map((slug) => articles.find((article) => article.slug === slug)).filter((article): article is ArticleTeaser => Boolean(article));
  const normalizedQuery = query.trim().toLocaleLowerCase("lv");
  const isFiltering = Boolean(normalizedQuery) || category !== "Visi";
  const visible = articles.filter((article) => {
    if (!isFiltering && featuredSlugs.includes(article.slug)) return false;
    const matchesCategory = category === "Visi" || article.category === category;
    const haystack = `${article.title} ${article.excerpt} ${article.category}`.toLocaleLowerCase("lv");
    return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
  });

  return (
    <>
      {!isFiltering && featured.length > 0 && (
        <section className="mb-lg" aria-labelledby="seasonal-heading">
          <div className="mb-sm flex items-end justify-between gap-md">
            <div>
              <p className="text-label-sm uppercase tracking-[0.18em] text-tertiary">Šobrīd dārzā</p>
              <h2 id="seasonal-heading" className="text-headline-md text-on-surface">{monthLabel} aktuāli</h2>
            </div>
            <Icon name="wb_twilight" size="28px" className="text-secondary" />
          </div>
          <div className="grid gap-md md:grid-cols-2 md:grid-rows-2">
            {featured.map((article, index) => <FeaturedCard key={article.slug} article={article} primary={index === 0} />)}
          </div>
        </section>
      )}

      <section aria-labelledby="all-articles-heading">
        <div className="mb-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm sm:p-md">
          <label htmlFor="article-search" className="mb-2 block text-label-sm font-semibold text-on-surface">Meklē rakstos</label>
          <div className="relative">
            <Icon name="search" size="20px" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              id="article-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Piemēram, tomāti, sīpoli vai dzeltenas lapas"
              className="min-h-11 w-full rounded-lg border border-outline-variant/30 bg-surface-container pl-10 pr-3 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
            />
          </div>
          <div className="mt-sm flex gap-2 overflow-x-auto pb-1" aria-label="Rakstu kategorijas">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={clsx(
                  "min-h-11 shrink-0 rounded-full border px-4 text-label-md transition-colors",
                  category === item ? "border-primary bg-primary text-on-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-sm flex items-center justify-between gap-md">
          <h2 id="all-articles-heading" className="text-headline-md text-on-surface">{isFiltering ? "Meklēšanas rezultāti" : "Visi raksti"}</h2>
          <span className="text-label-sm text-on-surface-variant">{visible.length} {visible.length === 1 ? "raksts" : "raksti"}</span>
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            {visible.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <Card tone="container" className="p-lg text-center">
            <Icon name="search_off" size="30px" className="mx-auto text-tertiary" />
            <p className="mt-2 text-body-lg text-on-surface">Nekas netika atrasts.</p>
            <p className="mt-1 text-body-md text-on-surface-variant">Pamēģini īsāku vārdu vai izvēlies citu kategoriju.</p>
          </Card>
        )}
      </section>
    </>
  );
}
