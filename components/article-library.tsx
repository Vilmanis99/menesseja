"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { CreditedPhoto, type CreditedPhotoAsset } from "@/components/credited-photo";
import { clsx } from "@/lib/clsx";
import { MONTHS_LV_LOCATIVE } from "@/lib/seo";
import { ARTICLE_QUERY_LIMIT, EMPTY_ARTICLE_FILTERS, articleSearchParams, matchesArticle, readArticleFilters, type ArticleFilters } from "@/lib/article-search";

export interface ArticleTeaser {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  intent: "problem" | "how-to" | "seasonal" | "reference";
  readMinutes: number;
  updatedAt: string;
  seasonalMonths?: number[];
  searchTerms?: string[];
  photo?: CreditedPhotoAsset & { caption: string };
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
  const href = `/raksti/${article.slug}`;
  return (
    <Card
      tone={primary ? "highest" : "high"}
      elevated
      accent={primary ? "primary" : undefined}
      className="flex flex-col transition-colors hover:border-primary/30"
    >
      <Link href={href} className={clsx("flex flex-col p-md transition-colors hover:bg-surface-container-highest", primary && "featured-article-card")}>
        <p className="mb-2 text-label-sm uppercase tracking-[0.16em] text-primary">{article.category}</p>
        <h3 className={clsx("text-on-surface", primary ? "text-headline-md md:text-headline-lg" : "text-xl font-semibold")}>{article.title}</h3>
        <p className="mt-2 line-clamp-3 text-body-md leading-relaxed text-on-surface-variant">{article.excerpt}</p>
        <Meta article={article} />
      </Link>
      {article.photo && <CreditedPhoto
        asset={article.photo}
        caption={article.photo.caption}
        href={href}
        linkLabel={`Atvērt rakstu: ${article.title}`}
        sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) calc((100vw - 328px) / 2), 500px"
        imageClassName={primary ? "h-48 sm:h-56" : "h-40"}
        className="border-t border-outline-variant/20"
      />}
    </Card>
  );
}

function ArticleCard({ article }: { article: ArticleTeaser }) {
  const href = `/raksti/${article.slug}`;
  return (
    <Card tone="high" className="flex h-full flex-col transition-colors hover:border-primary/30">
      <Link href={href} className="flex flex-1 flex-col p-md transition-colors hover:bg-surface-container-highest">
        <p className="text-label-sm uppercase tracking-[0.14em] text-tertiary">{article.category}</p>
        <h3 className="mt-1 text-xl font-semibold leading-snug text-on-surface">{article.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-body-md leading-relaxed text-on-surface-variant">{article.excerpt}</p>
        <Meta article={article} />
      </Link>
      {article.photo && <CreditedPhoto
        asset={article.photo}
        caption={article.photo.caption}
        href={href}
        linkLabel={`Atvērt rakstu: ${article.title}`}
        sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc((100vw - 72px) / 2), (max-width: 1279px) calc((100vw - 328px) / 2), 500px"
        imageClassName="h-40 sm:h-44"
        className="border-t border-outline-variant/20"
      />}
    </Card>
  );
}

export function ArticleLibrary({ articles, featuredSlugs, monthLabel, monthGuideLinks, children }: { articles: ArticleTeaser[]; featuredSlugs: string[]; monthLabel: string; monthGuideLinks: string[]; children: ReactNode }) {
  const [filters, setFilters] = useState<ArticleFilters>(EMPTY_ARTICLE_FILTERS);
  const { query, category, month } = filters;
  const searchInput = useRef<HTMLInputElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const categories = useMemo(() => ["Visi", ...Array.from(new Set(articles.map((article) => article.category))).sort((a, b) => a.localeCompare(b, "lv"))], [articles]);
  const featured = featuredSlugs.map((slug) => articles.find((article) => article.slug === slug)).filter((article): article is ArticleTeaser => Boolean(article));
  const isFiltering = Boolean(query.trim()) || category !== "Visi" || month !== 0;
  const visible = articles.filter((article) => matchesArticle(article, filters));

  useEffect(() => {
    function restoreFilters() {
      clearTimeout(saveTimer.current);
      setFilters(readArticleFilters(window.location.search, categories));
    }
    restoreFilters();
    window.addEventListener("popstate", restoreFilters);
    return () => {
      clearTimeout(saveTimer.current);
      window.removeEventListener("popstate", restoreFilters);
    };
  }, [categories]);

  function saveFilters(next: ArticleFilters) {
    const search = articleSearchParams(next, window.location.search);
    const href = `${window.location.pathname}${search ? `?${search}` : ""}`;
    if (href !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, "", href);
    }
  }

  function updateFilters(next: ArticleFilters) {
    setFilters(next);
    clearTimeout(saveTimer.current);
    // Coalesce typing without delaying the visible results or adding Back entries.
    saveTimer.current = setTimeout(() => saveFilters(next), 300);
  }

  function flushFilters(next = filters) {
    clearTimeout(saveTimer.current);
    saveFilters(next);
  }

  function resetFilters() {
    setFilters(EMPTY_ARTICLE_FILTERS);
    flushFilters(EMPTY_ARTICLE_FILTERS);
    searchInput.current?.focus();
  }

  return (
    <div onClickCapture={(event) => {
      // Commit even when a result is opened before the typing timer has fired.
      if ((event.target as Element).closest("a") && isFiltering) flushFilters();
    }}>
      <form id="rakstu-meklesana" role="search" aria-label="Rakstu meklēšana" className="mb-lg scroll-mt-24 rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm sm:p-md" onSubmit={(event) => {
        event.preventDefault();
        flushFilters();
        resultsHeading.current?.focus({ preventScroll: true });
        resultsHeading.current?.scrollIntoView({ block: "start" });
      }}>
        <label htmlFor="article-search" className="mb-2 block text-title-md text-on-surface">Meklē rakstos</label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <div className="relative">
            <Icon name="search" size="20px" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              ref={searchInput}
              id="article-search"
              name="q"
              type="search"
              value={query}
              maxLength={ARTICLE_QUERY_LIMIT}
              onChange={(event) => updateFilters({ ...filters, query: event.target.value })}
              onBlur={() => flushFilters()}
              placeholder="Augs vai problēma"
              aria-describedby="article-search-help"
              aria-controls="article-results"
              className="min-h-11 w-full rounded-lg border border-outline-variant/30 bg-surface-container pl-10 pr-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary"
            />
          </div>
          <button type="submit" className="min-h-11 rounded-lg bg-primary px-4 text-label-md font-semibold text-on-primary hover:brightness-110">Meklēt</button>
        </div>
        <p id="article-search-help" className="mt-2 text-label-md text-on-surface-variant">Vari rakstīt arī bez garumzīmēm un mīkstinājuma zīmēm.</p>
        <div className="mt-sm grid items-end gap-2 sm:grid-cols-2">
          <div>
            <label htmlFor="article-month" className="mb-2 block text-label-sm font-semibold text-on-surface">Raksti pēc mēneša</label>
            <select
              id="article-month"
              value={month}
              onChange={(event) => updateFilters({ ...filters, month: Number(event.target.value) })}
              className="min-h-11 w-full rounded-lg border border-outline-variant/30 bg-surface-container px-3 text-body-md text-on-surface focus:border-primary"
            >
              <option value={0}>Visam gadam</option>
              {MONTHS_LV_LOCATIVE.map((label, index) => (
                <option key={label} value={index + 1}>{label[0].toLocaleUpperCase("lv") + label.slice(1)}</option>
              ))}
            </select>
          </div>
          {month > 0 && (
            <Link href={monthGuideLinks[month - 1]} className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
              Darbu ceļvedis {MONTHS_LV_LOCATIVE[month - 1]} <Icon name="arrow_forward" size="16px" />
            </Link>
          )}
        </div>
        <div className="mt-sm flex flex-wrap gap-2" role="group" aria-label="Rakstu kategorijas">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => updateFilters({ ...filters, category: item })}
              className={clsx(
                "min-h-11 shrink-0 rounded-full border px-4 text-label-md transition-colors",
                category === item ? "border-primary bg-primary text-on-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        {isFiltering && <button type="button" onClick={resetFilters} className="mt-sm inline-flex min-h-11 items-center gap-1 text-body-md text-primary underline underline-offset-2"><Icon name="close" size="18px" /> Notīrīt meklējumu un filtrus</button>}
      </form>

      {/* Server-rendered discovery content stays available until a search starts. */}
      {!isFiltering && children}

      <div id="rakstu-biblioteka" className="scroll-mt-24">
        {!isFiltering && featured.length > 0 && (
          <section className="mb-lg" aria-labelledby="seasonal-heading">
            <div className="mb-sm flex items-end justify-between gap-md">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-tertiary">Šobrīd dārzā</p>
                <h2 id="seasonal-heading" className="text-headline-md text-on-surface">{monthLabel} aktuāli</h2>
              </div>
              <Icon name="wb_twilight" size="28px" className="text-secondary" />
            </div>
            <div className="grid items-start gap-md lg:grid-cols-3">
              {featured.map((article, index) => <FeaturedCard key={article.slug} article={article} primary={index === 0} />)}
            </div>
          </section>
        )}

        <section id="article-results" aria-labelledby="all-articles-heading">
          <div className="mb-sm flex items-center justify-between gap-md">
            <h2 ref={resultsHeading} id="all-articles-heading" tabIndex={-1} className="scroll-mt-24 text-headline-md text-on-surface">{isFiltering ? "Meklēšanas rezultāti" : "Visi raksti"}</h2>
            <span role="status" aria-atomic="true" className="shrink-0 text-label-sm text-on-surface-variant">{visible.length} {visible.length % 10 === 1 && visible.length % 100 !== 11 ? "raksts" : "raksti"}</span>
          </div>

          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
              {visible.map((article) => <ArticleCard key={article.slug} article={article} />)}
            </div>
          ) : (
            <Card tone="container" className="p-lg text-center">
              <Icon name="search_off" size="30px" className="mx-auto text-tertiary" />
              <p className="mt-2 text-body-lg text-on-surface">Nekas netika atrasts.</p>
              <p className="mt-1 text-body-md text-on-surface-variant">Pamēģini īsāku vārdu, citu kategoriju vai izvēlies “Visam gadam”.</p>
              <button type="button" onClick={resetFilters} className="mt-md inline-flex min-h-11 items-center justify-center rounded-full border border-primary/40 px-5 text-body-md text-primary hover:bg-primary-container/20">Notīrīt filtrus un skatīt visus rakstus</button>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
