import type { Metadata } from "next";
import Link from "next/link";
import { CalendarNavigation } from "@/components/calendar-navigation";
import { MonthChecklist, MonthPreparation } from "@/components/month-preparation";
import { CalendarMonthGuide, CalendarWorkPlan } from "@/components/calendar-month-guide";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { moonForDate, moonPhasesForMonth } from "@/lib/moon";
import { SeasonalLinks } from "@/components/seasonal-links";
import { sowingDay, isRestDay, ELEMENT_META, PART_GENITIVE, type Element } from "@/lib/biodynamic";
import { latviaNoon } from "@/lib/day-anchor";
import { calendarGuide, CALENDAR_GUIDES_UPDATED_AT } from "@/lib/calendar-guides";
import { contentImage } from "@/lib/content-images";
import { MONTH_GUIDES } from "@/lib/month-guides";
import { namedaysForDay } from "@/lib/vardadienas";
import { PrintButton } from "@/components/print-button";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { newsletterConfigured } from "@/lib/brevo";
import { repottingDays, dayRanges, REPOT_SEASON_NOTE } from "@/lib/repotting";
import { seasonForMonth } from "@/lib/seasonal";
import { cropPart } from "@/lib/crop-part";
import { cropHref } from "@/lib/flowers";
import { cropEmoji } from "@/lib/crop-visual";
import { CROPS, MONTHS_LV_FULL, MONTHS_LV_GENITIVE } from "@/lib/planting-crops";
import { REGIONS } from "@/lib/regions";
import { MONTH_SLUGS, monthFromSlug, CALENDAR_YEARS, MONTHS_LV_LOCATIVE, canonical, SITE_NAME, og } from "@/lib/seo";

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
  const nameGen = MONTHS_LV_GENITIVE[p.month - 1];
  // Title targets both "dārza darbu kalendārs [mēnesis]" (dominant LV phrase) and "mēness kalendārs".
  const title = `${year}. gada ${nameGen} dārza darbu un Mēness kalendārs`;
  const guide = calendarGuide(p.month);
  const description = `${year}. gads. ${guide.description}`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/kalendars/${year}/${month}`) },
    openGraph: og({ path: `/kalendars/${year}/${month}`, title, description, image: contentImage(guide.image.id).src }),
  };
}

const SOW_KEYS = ["sowIndoors", "sowOutdoors", "transplant"] as const;
const PHASE_DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", timeZone: "Europe/Riga" });
const PHASE_TIME_FMT = new Intl.DateTimeFormat("lv-LV", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Riga" });
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
  const name = MONTHS_LV_FULL[month - 1]; // nominative — for standalone "Mēnesis Gads" stamps
  const nameGen = MONTHS_LV_GENITIVE[month - 1]; // "...gada jūnija"
  const nameLoc = MONTHS_LV_LOCATIVE[month - 1]; // "jūnijā" — "in June"
  const guide = calendarGuide(month);

  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
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

  const keyPhases = moonPhasesForMonth(year, month);
  const repotRanges = dayRanges(repottingDays(year, month).map((d) => d.day));

  const elements: Element[] = ["zeme", "udens", "gaiss", "uguns"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${year}. gada ${nameGen} Mēness sējas kalendārs`,
    description: guide.description,
    dateModified: CALENDAR_GUIDES_UPDATED_AT,
    image: canonical(contentImage(guide.image.id).src),
    inLanguage: "lv",
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
    <article className="month-calendar mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant print:hidden">
        <Link href="/kalendars" className="hover:text-primary">Kalendārs</Link>
        <Icon name="chevron_right" size="14px" />
        <Link href={`/kalendars/${year}`} className="hover:text-primary">{year}</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface capitalize">{name}</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Senču gudrība · Mēness kalendārs · Maria Thun</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">
          Dārza darbu kalendārs — {name} {year}
        </h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          {guide.description}
        </p>
        <div className="mt-sm print:hidden">
          <PrintButton />
        </div>
        <div className="print:hidden">
          <DataNote variant="moon" className="mt-md" />
        </div>
      </header>

      <CalendarNavigation year={year} month={month} />

      <nav aria-label="Mēneša kalendāra sadaļas" className="mb-md flex flex-wrap gap-2 print:hidden">
        {[
          { href: "#menesa-darbi", label: "Praktiskais ceļvedis" },
          { href: "#meness-fazes", label: "Mēness fāzes" },
          { href: "#seja-stadisana", label: "Sēja un stādīšana" },
          { href: "#visas-dienas", label: "Dienu tabula" },
        ].map((link) => <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-full border border-outline-variant/30 px-4 text-label-md text-primary hover:bg-surface-container">{link.label}</a>)}
      </nav>

      {/* Seasonal tasks + folklore — unique per month */}
      <Card tone="high" elevated linen className="month-summary mb-lg flex items-start gap-sm p-md">
        <Icon name="eco" className="text-primary" />
        <div>
          <h2 className="mb-1 text-headline-md text-on-surface">Dārza darbi {nameLoc}</h2>
          <p className="text-body-md leading-relaxed text-on-surface-variant">{MONTH_GUIDES[month]?.shortAnswer}</p>
        </div>
      </Card>

      <CalendarWorkPlan month={month} />

      {/* Key phases */}
      <h2 id="meness-fazes" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Mēness fāzes {nameLoc}</h2>
      <div className="month-phases mb-sm grid grid-cols-1 gap-md sm:grid-cols-2">
        {keyPhases.map((p) => (
          <Card key={p.date.toISOString()} tone="high" elevated className="flex items-center gap-md p-md">
            <MoonPhase phase={p.frac} size={52} idPrefix={`calendar-phase-${p.date.getTime()}`} />
            <div>
              <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{p.name}</p>
              <p className="text-headline-md text-on-surface">{PHASE_DATE_FMT.format(p.date)}</p>
              <p className="text-body-md text-on-surface-variant">plkst. {PHASE_TIME_FMT.format(p.date)}</p>
            </div>
          </Card>
        ))}
      </div>
      <p className="month-phase-note mb-lg text-label-sm text-on-surface-variant">Fāžu maiņas norādītas pēc Latvijas laika; dienu tabulā fāze aprēķināta plkst. 10.00 UTC.</p>

      <CalendarMonthGuide month={month} />

      {/* What to sow this month, by element */}
      <div className="print:hidden">
        <h2 id="seja-stadisana" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Ko sēt un stādīt {nameLoc}</h2>
        <p className="mb-sm text-body-md text-on-surface-variant">Sarakstā apvienota sēja telpās, sēja dobēs un izstādīšana. Atver auga ceļvedi, lai pārbaudītu konkrēto darbu un apstākļus; elementu diena neatceļ temperatūras vai salnu ierobežojumus.</p>
        {!elements.some((element) => sowableThisMonth(element, month).length > 0) && (
          <p className="mb-md text-body-md text-on-surface-variant">
            Šī mēneša sarakstā nav sējamu vai izstādāmu kultūru. Izmanto laiku sagatavošanās darbiem;
            sēju telpās plāno pēc konkrētās šķirnes, gaismas un temperatūras prasībām.
            {" "}<Link href={`/ko-set/${mSlug}`} className="text-primary hover:underline">Skaties mēneša darbu ceļvedi.</Link>
          </p>
        )}
        <div className="mb-lg grid grid-cols-1 gap-2 sm:grid-cols-2">
          {elements.map((e) => {
            const meta = ELEMENT_META[e];
            const crops = sowableThisMonth(e, month).slice(0, 8);
            if (!crops.length) return null;
            return (
              <Card key={e} tone="container" className="p-sm">
                <p className="mb-1 flex items-center gap-1.5 text-label-md text-on-surface">
                  <Icon name={meta.icon} size="16px" className={meta.color} /> {PART_GENITIVE[meta.part]} dienās
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {crops.map((c) => (
                    <Link key={c.id} href={cropHref(c.id)} className="inline-flex min-h-11 items-center rounded-full bg-background/50 px-3 text-label-sm text-on-surface hover:text-primary">
                      {cropEmoji(c.id)} {c.name}
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <section className="mb-lg print:hidden" aria-labelledby="istabas-augi">
        <h2 id="istabas-augi" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Istabas augu pārstādīšana {nameLoc}</h2>
        <Card tone="container" className="flex items-start gap-sm p-md">
          <Icon name="potted_plant" className="text-primary" />
          <p className="text-body-md leading-relaxed text-on-surface-variant">
            Tradīcijā piemērotās krītošā Mēness dienas: <span className="font-semibold text-on-surface">{repotRanges || "šomēnes nav."}</span>{" "}
            {REPOT_SEASON_NOTE[seasonForMonth(month)]}{" "}
            <Link href="/kalendars/istabas-augu-parstadisana" className="text-primary hover:underline">Pārstādīšanas kalendārs un padomi →</Link>
          </p>
        </Card>
      </section>

      {/* Day-by-day table */}
      <h2 id="visas-dienas" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Visas dienas — {name} {year}</h2>
      <Card tone="low" elevated className="month-day-table mb-lg divide-y divide-outline-variant/10 p-0">
        {days.map((d) => {
          const meta = ELEMENT_META[d.sow.element];
          return (
            <div key={d.day} className="flex items-center gap-2 px-sm py-2 sm:gap-3 sm:px-md print:break-inside-avoid">
              <span className="w-7 shrink-0 text-body-md font-semibold text-on-surface">{d.day}.</span>
              <MoonPhase phase={d.moon.phase} size={26} glow={false} idPrefix={`calendar-day-${d.day}`} />
              <span className="w-24 shrink-0 text-label-sm text-on-surface-variant sm:w-28">{d.moon.name}</span>
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
      <p className="hidden print:block print:text-[10px]">Mēness sēja ir tradīcija; darbus pielāgo laikapstākļiem un augsnei. menesseja.lv/kalendars/{year}/{mSlug}</p>

      <div className="print:hidden">
        <MonthChecklist month={month} />
        <SeasonalLinks month={month} />
        <MonthPreparation month={month} />
      </div>

      {newsletterConfigured() && <div className="mb-lg print:hidden"><NewsletterSignup source={`kalendars:${year}-${mSlug}`} /></div>}

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
        <Link href={`/kalendars/${year}`} className="inline-flex items-center gap-1 text-label-md text-primary hover:underline">
          Mēness kalendārs {year} <Icon name="arrow_forward" size="16px" />
        </Link>
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
