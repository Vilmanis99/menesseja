"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { clsx } from "@/lib/clsx";
import { cropEmoji } from "@/lib/crop-visual";

export interface CropTeaser {
  id: string;
  href: string;
  name: string;
  category: string;
  categoryLabel: string;
  aliases?: string[];
  timingLabel: string;
  timing: string;
  harvest?: string;
  isCurrent: boolean;
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLocaleLowerCase("lv");
}

function CropCard({ crop, featured = false }: { crop: CropTeaser; featured?: boolean }) {
  return (
    <Link
      href={crop.href}
      aria-label={`${crop.name}. ${crop.timingLabel}: ${crop.timing}.`}
      className="group block h-full rounded-xl active:scale-[0.99]"
    >
      <Card
        tone={featured ? "highest" : "high"}
        elevated={featured}
        className={clsx(
          "flex h-full items-center gap-3 p-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:bg-surface-container-highest group-focus-visible:border-primary/50",
          featured && "border-primary/20",
        )}
      >
        <span className={clsx("flex shrink-0 items-center justify-center rounded-xl bg-primary-container/25 leading-none", featured ? "h-14 w-14 text-3xl" : "h-11 w-11 text-2xl")} aria-hidden="true">{cropEmoji(crop.id)}</span>
        <div className="min-w-0 flex-1">
          <p className="text-body-md font-semibold leading-snug text-on-surface">{crop.name}</p>
          <p className="mt-0.5 text-label-sm text-on-surface-variant">{crop.timingLabel}: {crop.timing}</p>
          {featured && crop.harvest && <p className="mt-0.5 text-label-sm text-tertiary">Novāc: {crop.harvest}</p>}
        </div>
        <Icon name="chevron_right" size="18px" className="shrink-0 text-on-surface-variant transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
      </Card>
    </Link>
  );
}

export function CropLibrary({ crops, monthLabel }: { crops: CropTeaser[]; monthLabel: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Visi");
  const categories = useMemo(() => ["Visi", ...Array.from(new Set(crops.map((crop) => crop.categoryLabel)))], [crops]);
  const categoryCounts = useMemo(
    () => new Map(categories.map((item) => [item, item === "Visi" ? crops.length : crops.filter((crop) => crop.categoryLabel === item).length])),
    [categories, crops],
  );
  const normalizedQuery = normalizeSearch(query);
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const current = useMemo(() => crops.filter((crop) => crop.isCurrent).slice(0, 6), [crops]);
  const visible = crops.filter((crop) => {
    const categoryMatches = category === "Visi" || crop.categoryLabel === category;
    const text = normalizeSearch([
      crop.id,
      crop.name,
      crop.categoryLabel,
      crop.timingLabel,
      crop.timing,
      crop.harvest,
      ...(crop.aliases ?? []),
    ].filter(Boolean).join(" "));
    return categoryMatches && queryTokens.every((token) => text.includes(token));
  });
  const resetFilters = () => {
    setQuery("");
    setCategory("Visi");
  };

  return (
    <>
      {current.length > 0 && !normalizedQuery && category === "Visi" && (
        <section className="mb-lg" aria-labelledby="current-crops-heading">
          <div className="mb-sm flex items-end justify-between gap-md">
            <div>
              <p className="text-label-sm uppercase tracking-[0.18em] text-tertiary">Sezonas izvēle</p>
              <h2 id="current-crops-heading" className="text-headline-md text-on-surface">Ko sēt un stādīt {monthLabel}</h2>
            </div>
            <Link href="/ko-set" className="inline-flex min-h-11 items-center gap-1 text-label-md font-semibold text-primary hover:underline">Visi mēneši <Icon name="arrow_forward" size="16px" /></Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {current.map((crop) => <CropCard key={crop.id} crop={crop} featured />)}
          </div>
        </section>
      )}

      <section aria-labelledby="crop-library-heading">
        <div className="mb-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-sm sm:p-md">
          <label htmlFor="crop-search" className="mb-2 block text-label-sm font-semibold text-on-surface">Meklē augu</label>
          <div className="relative">
            <Icon name="search" size="20px" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              id="crop-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && query) setQuery("");
              }}
              placeholder="Piemēram, redīsi, tomāti vai garšaugi"
              enterKeyHint="search"
              aria-controls="crop-results"
              className="min-h-12 w-full rounded-lg border border-outline-variant/30 bg-surface-container pl-10 pr-12 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Notīrīt augu meklēšanu"
                className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-primary"
              >
                <Icon name="close" size="18px" />
              </button>
            )}
          </div>
          <div className="custom-scrollbar mt-sm flex gap-2 overflow-x-auto overscroll-x-contain pb-1" role="group" aria-label="Augu kategorijas">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                aria-controls="crop-results"
                aria-label={`${item}: ${categoryCounts.get(item)} augi`}
                onClick={() => setCategory(item)}
                className={clsx(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-label-md transition-colors active:scale-[0.98]",
                  category === item ? "border-primary bg-primary text-on-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary",
                )}
              >
                {item}
                <span className={clsx("tabular-nums", category === item ? "text-on-primary/75" : "text-on-surface-variant/65")}>{categoryCounts.get(item)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-sm flex items-center justify-between gap-md">
          <h2 id="crop-library-heading" className="text-headline-md text-on-surface">Visi augi</h2>
          <span role="status" aria-live="polite" aria-atomic="true" className="text-label-sm text-on-surface-variant">
            {visible.length} {visible.length === 1 ? "rezultāts" : "rezultāti"}
          </span>
        </div>
        {visible.length > 0 ? (
          <div id="crop-results" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((crop) => <CropCard key={crop.id} crop={crop} />)}
          </div>
        ) : (
          <Card tone="container" className="p-lg text-center">
            <Icon name="search_off" size="30px" className="mx-auto text-tertiary" />
            <p className="mt-2 text-body-lg text-on-surface">Šāds augs nav atrasts.</p>
            <p className="mt-1 text-body-md text-on-surface-variant">Pamēģini citu nosaukumu vai kategoriju.</p>
            <Button variant="outline" icon="refresh" className="mt-md" onClick={resetFilters}>Notīrīt filtrus</Button>
          </Card>
        )}
      </section>
    </>
  );
}
