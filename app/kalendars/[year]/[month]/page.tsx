import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { moonForDate } from "@/lib/moon";
import { sowingDay, isRestDay, ELEMENT_META, type Element } from "@/lib/biodynamic";
import { latviaNoon } from "@/lib/day-anchor";
import { namedaysForDay } from "@/lib/vardadienas";
import { PrintButton } from "@/components/print-button";
import { cropPart } from "@/lib/crop-part";
import { cropEmoji } from "@/lib/crop-visual";
import { CROPS, MONTHS_LV_FULL, ACTIVITY_KEYS } from "@/lib/planting-crops";
import { REGIONS } from "@/lib/regions";
import { MONTH_SLUGS, monthFromSlug, CALENDAR_YEARS, MONTH_TIPS, canonical, SITE_NAME } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return CALENDAR_YEARS.flatMap((year) =>
    MONTH_SLUGS.map((month) => ({ year: String(year), month })),
  );
}

function parse(yearStr: string, monthSlug: string) {
  const year = Number(yearStr);
  const month = monthFromSlug(monthSlug);
  if (!CALENDAR_YEARS.includes(year) || !month) return null;
  return { year, month };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}): Promise<Metadata> {
  const { year, month } = await params;
  const p = parse(year, month);
  if (!p) return {};
  const name = MONTHS_LV_FULL[p.month - 1];
  const title = `Mēness sējas kalendārs — ${year}. gada ${name}`;
  const description = `${year}. gada ${name} Mēness kalendārs dārzkopjiem: Mēness fāzes, sēšanas un stādīšanas dienas pēc elementiem (saknes, lapas, ziedi, augļi) un nelabvēlīgās dienas.`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/kalendars/${year}/${month}`) },
    openGraph: { title, description, type: "article" },
  };
}

const SOW_KEYS = ["sowIndoors", "sowOutdoors", "transplant"] as const;
function sowableThisMonth(element: Element, month: number) {
  const part = ELEMENT_META[element].part;
  return CROPS.filter(
    (c) =>
      cropPart(c.id) === part &&
      SOW_KEYS.some((k) => {
        const r = c[k];
        return r && month >= r[0] && month <= r[1];
      }),
  );
}

export default async function MonthCalendarPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year: yStr, month: mSlug } = await params;
  const p = parse(yStr, mSlug);
  if (!p) notFound();
  const { year, month } = p;
  const name = MONTHS_LV_FULL[month - 1];

  const count = new Date(year, month, 0).getDate();
  const days = Array.from({ length: count }, (_, i) => {
    // latviaNoon → classification is identical no matter the build server's TZ
    const date = latviaNoon(year, month, i + 1);
    return {
      date,
      day: i + 1,
      moon: moonForDate(date),
      sow: sowingDay(date),
      rest: isRestDay(date),
      names: namedaysForDay(month, i + 1),
    };
  });

  // New & full moon dates this month (extremes of illumination)
  const newMoon = days.reduce((a, b) => (b.moon.illumination < a.moon.illumination ? b : a));
  const fullMoon = days.reduce((a, b) => (b.moon.illumination > a.moon.illumination ? b : a));

  const elements: Element[] = ["zeme", "udens", "gaiss", "uguns"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Mēness sējas kalendārs — ${year}. gada ${name}`,
    inLanguage: "lv",
    datePublished: `${year}-${String(month).padStart(2, "0")}-01`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };

  // Adjacent months (within the generated year range) for prev/next nav
  const adj = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    if (!CALENDAR_YEARS.includes(y)) return null;
    return { href: `/kalendars/${y}/${MONTH_SLUGS[m - 1]}`, label: `${MONTHS_LV_FULL[m - 1]} ${y}` };
  };
  const prev = adj(-1);
  const next = adj(1);

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant print:hidden">
        <Link href="/kalendars" className="hover:text-primary">Kalendārs</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface capitalize">{name} {year}</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Senču gudrība · Maria Thun</p>
        <h1 className="text-headline-lg-mobile capitalize text-primary md:text-display-lg">
          Mēness kalendārs — {name} {year}
        </h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          Kad sēt un stādīt {year}. gada {name} saskaņā ar Mēnesi: katras dienas fāze, elementu diena,
          vārda dienas un nelabvēlīgās dienas Latvijas dārzkopjiem.
        </p>
        <div className="mt-sm print:hidden">
          <PrintButton />
        </div>
        <div className="print:hidden">
          <DataNote variant="moon" className="mt-md" />
        </div>
      </header>

      {/* Seasonal tasks + folklore — unique per month */}
      <Card tone="high" elevated linen className="mb-lg flex items-start gap-sm p-md">
        <Icon name="eco" className="text-primary" />
        <div>
          <h2 className="mb-1 text-headline-md text-on-surface">Dārza darbi {name}</h2>
          <p className="text-body-md text-on-surface-variant">{MONTH_TIPS[month - 1]}</p>
        </div>
      </Card>

      {/* Key phases */}
      <div className="mb-lg grid grid-cols-2 gap-md">
        {[{ d: newMoon, t: "Jauns mēness" }, { d: fullMoon, t: "Pilns mēness" }].map(({ d, t }) => (
          <Card key={t} tone="high" elevated className="flex items-center gap-md p-md">
            <MoonPhase phase={d.moon.phase} size={52} />
            <div>
              <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{t}</p>
              <p className="text-headline-md text-on-surface">{d.day}. {name}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* What to sow this month, by element */}
      <h2 className="mb-sm text-headline-md text-on-surface">Ko sēt {name}</h2>
      <div className="mb-lg grid grid-cols-1 gap-2 sm:grid-cols-2">
        {elements.map((e) => {
          const meta = ELEMENT_META[e];
          const crops = sowableThisMonth(e, month).slice(0, 8);
          if (!crops.length) return null;
          return (
            <Card key={e} tone="container" className="p-sm">
              <p className="mb-1 flex items-center gap-1.5 text-label-md text-on-surface">
                <Icon name={meta.icon} size="16px" className={meta.color} /> {meta.partLabel} dienās
              </p>
              <div className="flex flex-wrap gap-1.5">
                {crops.map((c) => (
                  <Link key={c.id} href={`/augi/${c.id}`} className="rounded-full bg-background/50 px-2 py-0.5 text-label-sm text-on-surface hover:text-primary">
                    {cropEmoji(c.id)} {c.name}
                  </Link>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Day-by-day table */}
      <h2 className="mb-sm text-headline-md text-on-surface">Visas dienas</h2>
      <Card tone="low" elevated className="mb-lg divide-y divide-outline-variant/10 p-0">
        {days.map((d) => {
          const meta = ELEMENT_META[d.sow.element];
          return (
            <div key={d.day} className="flex items-center gap-3 px-md py-2">
              <span className="w-8 text-body-md font-semibold text-on-surface">{d.day}.</span>
              <MoonPhase phase={d.moon.phase} size={26} glow={false} />
              <span className="w-28 text-label-sm text-on-surface-variant">{d.moon.name}</span>
              {d.rest ? (
                <span className="flex items-center gap-1 text-label-sm text-on-surface-variant">
                  <Icon name="block" size="14px" /> Atpūtas diena
                </span>
              ) : (
                <span className="flex items-center gap-1 text-label-sm">
                  <Icon name={meta.icon} size="14px" className={meta.color} />
                  {d.sow.sign.symbol} {meta.partLabel}
                </span>
              )}
              {d.names.length > 0 && (
                <span className="ml-auto hidden min-w-0 truncate text-right text-label-sm text-tertiary sm:block print:block">
                  {d.names.join(", ")}
                </span>
              )}
            </div>
          );
        })}
      </Card>

      {/* Prev / next month navigation */}
      <nav className="mb-md flex items-center justify-between gap-2 border-y border-outline-variant/10 py-sm print:hidden">
        {prev ? (
          <Link href={prev.href} className="inline-flex items-center gap-1 text-label-md text-primary hover:underline">
            <Icon name="chevron_left" size="18px" /> <span className="capitalize">{prev.label}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={next.href} className="inline-flex items-center gap-1 text-label-md text-primary hover:underline">
            <span className="capitalize">{next.label}</span> <Icon name="chevron_right" size="18px" />
          </Link>
        ) : <span />}
      </nav>

      {/* By region */}
      <div className="mb-md print:hidden">
        <p className="mb-2 text-label-sm uppercase tracking-wide text-on-surface-variant">Pēc reģiona</p>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((reg) => (
            <Link key={reg.id} href={`/regioni/${reg.id}`} className="rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
              {reg.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 print:hidden">
        <Link href="/kalendars" className="inline-flex items-center gap-1 text-label-md text-primary hover:underline">
          Interaktīvais kalendārs <Icon name="arrow_forward" size="16px" />
        </Link>
        <Link href="/macies" className="text-label-md text-on-surface-variant hover:text-primary">Kas ir Mēness sēja?</Link>
        <Link href="/augi" className="text-label-md text-on-surface-variant hover:text-primary">Augu enciklopēdija</Link>
        <Link href="/raksti" className="text-label-md text-on-surface-variant hover:text-primary">Raksti</Link>
      </div>
    </article>
  );
}
