"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { ActivityBar } from "@/components/activity-bar";
import { CROPS, CATEGORIES, DIFFICULTY_LABEL, MONTHS_LV_FULL, cropActivityMeta } from "@/lib/planting-crops";
import { defaultSowingFilters, guideActivities, GUIDE_ACTIVITIES, matchesSowingCrop, type GuideActivity } from "@/lib/sowing-guide-filter";
import { MONTH_SLUGS, MONTHS_LV_LOCATIVE } from "@/lib/seo";
import { useMounted } from "@/lib/use-mounted";
import { DataNote } from "@/components/data-note";

const DIFFICULTY_TONE = { 1: "text-primary", 2: "text-tertiary", 3: "text-secondary" };

function kulturas(n: number): string {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} kultūra`;
  if (d >= 2 && d <= 9 && !(dd >= 12 && dd <= 19)) return `${n} kultūras`;
  return `${n} kultūru`;
}

export function SowingGuide({ cropLinks }: { cropLinks: Record<string, string> }) {
  const mounted = useMounted();
  const [filters, setFilters] = useState(() => defaultSowingFilters());
  const { month, activity, category, query } = filters;
  const crops = useMemo(() => CROPS.filter((crop) => matchesSowingCrop(crop, filters)), [filters]);
  const activityLabel = GUIDE_ACTIVITIES.find((item) => item.id === activity)!.label;
  const period = month === 0 ? "visam gadam" : MONTHS_LV_LOCATIVE[month - 1];
  const narrowed = category !== "all" || query.trim() !== "";

  // The H1 and annual table are server rendered; use Riga time after mounting.
  if (!mounted) return null;

  return (
    <section aria-labelledby="sowing-results-heading">
      <Card tone="container" className="mb-md p-md">
        <div className="mb-sm grid gap-sm sm:grid-cols-2">
          <label className="flex min-w-0 flex-col gap-1 text-label-md text-on-surface-variant">
            Mēnesis
            <select value={month} onChange={(e) => setFilters({ ...filters, month: Number(e.target.value) })} className="min-h-11 w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 text-body-md text-on-surface">
              <option value={0}>Viss gads</option>
              {MONTHS_LV_FULL.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-label-md text-on-surface-variant">
            Darbība
            <select value={activity} onChange={(e) => setFilters({ ...filters, activity: e.target.value as GuideActivity })} className="min-h-11 w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 text-body-md text-on-surface">
              {GUIDE_ACTIVITIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <div className="mb-sm flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-low px-3">
          <Icon name="search" size="20px" className="shrink-0 text-on-surface-variant" />
          <input type="search" aria-label="Meklēt augu" inputMode="search" enterKeyHint="search" autoCapitalize="off" autoCorrect="off" value={query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder="Auga nosaukums, piem., burkāni…" className="min-h-11 min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60" />
          {query && <button type="button" onClick={() => setFilters({ ...filters, query: "" })} aria-label="Notīrīt meklēšanu" className="inline-flex min-h-11 min-w-11 items-center justify-center text-on-surface-variant hover:text-on-surface"><Icon name="close" size="20px" /></button>}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Augu kategorijas">
          <Chip tone="neutral" active={category === "all"} onClick={() => setFilters({ ...filters, category: "all" })}>Visi</Chip>
          {CATEGORIES.map((item) => <Chip key={item.id} tone="neutral" active={category === item.id} onClick={() => setFilters({ ...filters, category: item.id })}>{item.label}</Chip>)}
        </div>
        <div className="mt-sm flex flex-wrap items-center justify-between gap-2 text-label-sm">
          <span role="status" aria-live="polite" className="text-on-surface-variant">{activityLabel} {period}: {kulturas(crops.length)}</span>
          <button type="button" onClick={() => setFilters(defaultSowingFilters())} className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary hover:underline"><Icon name="refresh" size="16px" /> Atgriezties pie šī mēneša</button>
        </div>
      </Card>

      <div className="mb-md space-y-2">
        <h2 id="sowing-results-heading" className="text-headline-md text-on-surface">{activityLabel} {period}</h2>
        <p className="max-w-2xl text-body-md text-on-surface-variant">
          {month === 0 ? "Šis ir visa gada plānošanas skats, nevis šodien veicamo darbu saraksts. " : "Redzami tikai izvēlētajam mēnesim un darbībai atbilstošie augi. "}
          Mēneši ir orientieris: pirms sēšanas vai stādīšanas pārbaudi šķirni, salnu risku un augsnes stāvokli.
        </p>
        {month > 0 && <Link href={`/ko-set/${MONTH_SLUGS[month - 1]}`} className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">Visi dārza darbi {period}<Icon name="arrow_forward" size="16px" /></Link>}
      </div>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-2" data-sowing-results>
        {crops.map((crop) => {
          const actions = guideActivities(crop, month, activity);
          const showsGrowingAdvice = actions.some((key) => key !== "harvest");
          return (
            <Card key={crop.id} tone="high" elevated className="flex min-w-0 flex-col gap-sm p-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-headline-md text-on-surface">{crop.name}</h3>
                  <p className="text-label-sm text-on-surface-variant">{CATEGORIES.find((item) => item.id === crop.category)?.label}{crop.sun ? ` • ${crop.sun}` : ""}</p>
                </div>
                <span className={`flex shrink-0 items-center gap-1 text-label-sm font-semibold ${DIFFICULTY_TONE[crop.difficulty]}`}><Icon name="eco" size="16px" />{DIFFICULTY_LABEL[crop.difficulty]}</span>
              </div>
              <div className="rounded-lg bg-primary-container/25 px-3 py-2">
                <p className="mb-1 text-label-sm text-on-surface-variant">{month === 0 ? "Izvēlētās darbības gada laikā" : `Šajā mēnesī (${MONTHS_LV_FULL[month - 1]})`}</p>
                <ul className="space-y-1 text-body-md font-semibold text-primary">
                  {actions.map((key) => <li key={key}>{cropActivityMeta(crop, key).label}</li>)}
                </ul>
              </div>
              {showsGrowingAdvice && crop.note && <p className="text-body-md text-on-surface-variant"><span className="font-semibold">Par audzēšanu: </span>{crop.note}</p>}
              {showsGrowingAdvice && crop.noteSource && <a href={crop.noteSource.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-label-sm text-primary hover:underline">Avots: {crop.noteSource.label}</a>}
              <details className="text-label-md text-on-surface-variant" open={month === 0}>
                <summary className="min-h-11 cursor-pointer py-3 text-primary">Visa gada laiki</summary>
                <ActivityBar crop={crop} currentMonth={month} />
              </details>
              <Link href={cropLinks[crop.id]} className="mt-auto inline-flex min-h-11 items-center gap-1 self-start text-label-md text-primary hover:underline">Atvērt audzēšanas ceļvedi<Icon name="arrow_forward" size="16px" /></Link>
            </Card>
          );
        })}
      </div>

      {crops.length === 0 && <Card tone="container" className="flex flex-col items-center gap-sm p-lg text-center">
        <Icon name="search_off" size="32px" className="text-on-surface-variant" />
        <p className="text-body-md text-on-surface">{query.trim() ? `“${query.trim()}” neatbilst izvēlētajam mēnesim, darbībai vai kategorijai.` : "Šai mēneša, darbības un kategorijas izvēlei ceļvedī nav ierakstu."}</p>
        <p className="max-w-2xl text-body-sm text-on-surface-variant">Sējas laiks nav tas pats, kas ražas novākšanas vai ziedēšanas laiks. Izvēlies citu darbību vai apskati augu visam gadam.</p>
        <div className="flex flex-wrap justify-center gap-sm">
          <button type="button" onClick={() => setFilters({ ...filters, month: 0, activity: "all" })} className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-label-md font-semibold text-on-primary">Skatīt visam gadam</button>
          {narrowed && <button type="button" onClick={() => setFilters({ ...filters, query: "", category: "all" })} className="inline-flex min-h-11 items-center text-label-md text-primary hover:underline">Notīrīt nosaukumu un kategoriju</button>}
        </div>
      </Card>}
      <DataNote variant="planting" withSources className="mt-lg" />
    </section>
  );
}
