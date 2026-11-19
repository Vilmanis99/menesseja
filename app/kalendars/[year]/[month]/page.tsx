import type { Metadata } from "next";
import Link from "next/link";
import { DatedCalendarExplorer } from "@/components/dated-calendar-explorer";
import { CalendarNavigation } from "@/components/calendar-navigation";
import { MonthChecklist, MonthPreparation } from "@/components/month-preparation";
import { CalendarMonthGuide, CalendarWorkPlan } from "@/components/calendar-month-guide";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { dailyPhaseName, moonForDate, moonIntervalsForMonth, moonPhasesForMonth, type PrincipalMoonPhase } from "@/lib/moon";
import { SeasonalLinks } from "@/components/seasonal-links";
import { sowingDay, isRestDay, ELEMENT_META, PART_GENITIVE, type Element } from "@/lib/biodynamic";
import { latviaDateParts, latviaNoon } from "@/lib/day-anchor";
import { calendarGuide, calendarGuideUpdatedAt } from "@/lib/calendar-guides";
import { contentImage } from "@/lib/content-images";
import { MONTH_GUIDES } from "@/lib/month-guides";
import { holidayNameForDay, latvianHolidaysForMonth, LATVIAN_HOLIDAYS_SOURCE } from "@/lib/latvian-holidays";
import { namedaysForDay } from "@/lib/vardadienas";
import { TrackedLink } from "@/components/tracked-link";
import { PrintButton } from "@/components/print-button";
import { WinterDaylight } from "@/components/winter-daylight";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { newsletterConfigured } from "@/lib/brevo";
import { repottingDays, dayRanges, REPOT_SEASON_NOTE } from "@/lib/repotting";
import { seasonForMonth } from "@/lib/seasonal";
import { cropPart } from "@/lib/crop-part";
import { cropHref } from "@/lib/flowers";
import { cropEmoji } from "@/lib/crop-visual";
import { CROPS, MONTHS_LV_FULL, MONTHS_LV_GENITIVE } from "@/lib/planting-crops";
import { REGIONS } from "@/lib/regions";
import { MONTH_SLUGS, monthFromSlug, calendarYears, calendarYearFromSlug, MONTHS_LV_LOCATIVE, canonical, SITE_NAME, og } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 3600;

const weekdayShort = new Intl.DateTimeFormat("lv-LV", { weekday: "short", timeZone: "Europe/Riga" });
const weekdayLong = new Intl.DateTimeFormat("lv-LV", { weekday: "long", timeZone: "Europe/Riga" });

export function generateStaticParams() {
  return calendarYears().flatMap((year) =>
    MONTH_SLUGS.map((month) => ({ year: String(year), month })),
  );
}

function parse(yearStr: string, monthSlug: string) {
  const year = calendarYearFromSlug(yearStr);
  const month = monthFromSlug(monthSlug);
  if (year === null || !month) return null;
  return { year, month };
}

function phaseIntro(year: number, month: number, phases: PrincipalMoonPhase[], task: string) {
  const monthName = MONTHS_LV_LOCATIVE[month - 1];
  const dates = phases.filter((phase) => phase.frac === 0 || phase.frac === 0.5).map((phase, index) => {
    const date = `${latviaDateParts(phase.date).day}. ${monthName}`;
    const name = phase.frac === 0 ? "jaunmēness" : "pilnmēness";
    return index === 0 ? `Latvijā ${year}. gada ${date} iestājas ${name}` : `${date} – ${name}`;
  });
  return `${dates.join(", ")}. ${task}`;
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
  const description = guide.showPhaseDatesInIntro
    ? phaseIntro(p.year, p.month, moonPhasesForMonth(p.year, p.month), guide.description)
    : `${year}. gads. ${guide.description}`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/kalendars/${year}/${month}`) },
    openGraph: og({ path: `/kalendars/${year}/${month}`, title, description, image: contentImage(guide.image.id).src }),
  };
}

const SOW_KEYS = ["sowIndoors", "sowOutdoors", "transplant"] as const;
const PHASE_DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", timeZone: "Europe/Riga" });
const PHASE_YEAR_DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Riga" });
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

  const holidays = latvianHolidaysForMonth(year, month);
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
      holiday: holidayNameForDay(holidays, i + 1),
    };
  });

  const hasLunarEclipse = year === 2027 && month === 2;
  const keyPhases = moonPhasesForMonth(year, month);
  const intervals = moonIntervalsForMonth(year, month, keyPhases);
  const intro = guide.showPhaseDatesInIntro ? phaseIntro(year, month, keyPhases, guide.description) : guide.description;
  const eventsByDay = new Map(keyPhases.map((phase) => [latviaDateParts(phase.date).day, phase]));
  const repotRanges = dayRanges(repottingDays(year, month).map((d) => d.day));

  const elements: Element[] = ["zeme", "udens", "gaiss", "uguns"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${year}. gada ${nameGen} Mēness sējas kalendārs`,
    description: intro,
    dateModified: calendarGuideUpdatedAt(month),
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
    if (!calendarYears().includes(y)) return null;
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
          {intro}
        </p>
        {guide.shortcuts && (
          <nav aria-label={`Praktiskie darbi ${nameLoc}`} className="mt-sm print:hidden">
            <ul className="flex flex-wrap gap-x-3">
              <li>
                <a href="#visas-dienas" className="inline-flex min-h-11 items-center gap-1 text-body-md font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                  Visas {count} dienas<span aria-hidden="true"> ↓</span>
                </a>
              </li>
              {guide.shortcuts.map(({ href, label }) => (
                <li key={href}>
                  <TrackedLink href={href} source={`kalendars/${year}/${mSlug}`} placement="month_shortcut"
                    className="inline-flex min-h-11 items-center gap-1 text-body-md font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                    {label}<span aria-hidden="true"> →</span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {holidays.length > 0 && (
          <nav aria-label="Svētku dienas Latvijā" className="mt-md border-y border-outline-variant/30 py-sm print:hidden">
            <div className="flex flex-wrap items-baseline justify-between gap-x-sm">
              <h2 className="text-headline-md text-on-surface">Svētku dienas {nameLoc}</h2>
              <a href={LATVIAN_HOLIDAYS_SOURCE} className="text-label-md text-on-surface-variant underline underline-offset-2">
                Likums par svētku dienām
              </a>
            </div>
            <ul className="mt-xs grid gap-x-md sm:grid-cols-2">
              {days.filter((d) => d.holiday).map((d) => (
                <li key={d.day}>
                  <a href={`#diena-${d.day}`} className="inline-flex min-h-11 items-center gap-2 text-body-md text-primary hover:underline">
                    <time dateTime={d.date.toISOString().slice(0, 10)} className="shrink-0 font-semibold">
                      {PHASE_DATE_FMT.format(d.date)}
                    </time>
                    <span>{d.holiday}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
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
          ...(month === 12 || month === 1 ? [{ href: "#dienas-garums", label: "Dienas garums" }] : []),
          { href: "#augoss-un-dilstoss-meness", label: "Augošs un dilstošs Mēness" },
          ...(hasLunarEclipse ? [{ href: "#meness-aptumsums", label: "Mēness aptumsums" }] : []),
          { href: "#seja-stadisana", label: "Sēja un stādīšana" },
          { href: "#visas-dienas", label: "Dienu tabula" },
          { href: "#interaktivais-kalendars", label: "Interaktīvais kalendārs" },
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

      {(month === 12 || month === 1) && <WinterDaylight year={year} month={month} />}

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
      <p className="month-phase-note mb-lg text-label-sm text-on-surface-variant">Fāžu maiņas norādītas pēc Latvijas laika. Dienu tabulā attēlots Mēness izskats plkst. 10.00 UTC. Jauna Mēness, pilnmēness un ceturkšņu nosaukumi atzīmē to iestāšanās dienu Latvijā.</p>

      <section className="mb-lg print:mb-2" aria-labelledby="augoss-un-dilstoss-meness">
        <h2 id="augoss-un-dilstoss-meness" tabIndex={-1} className="mb-xs scroll-mt-24 text-headline-md text-on-surface print:mb-0! print:text-[12px]!">
          Kad Mēness aug un kad dilst {nameLoc}?
        </h2>
        <p className="mb-sm text-body-md text-on-surface-variant print:hidden">
          Mēness aug no jaunmēness līdz pilnmēnesim un pēc tam dilst līdz nākamajam jaunmēnesim. Laiki norādīti pēc Latvijas laika.
        </p>
        <dl className="divide-y divide-outline-variant/30 print:grid print:auto-cols-fr print:grid-flow-col print:gap-2 print:divide-y-0">
          {intervals.map(({ waxing, start, end }) => {
            const crossesYear = latviaDateParts(start).year !== latviaDateParts(end).year;
            const dateFormat = crossesYear ? PHASE_YEAR_DATE_FMT : PHASE_DATE_FMT;
            return (
              <div key={start.toISOString()} className="py-sm sm:flex sm:items-baseline sm:gap-md print:block print:py-0">
                <dt className="text-body-md font-semibold text-on-surface sm:w-36 sm:shrink-0 print:w-auto print:text-[10px] print:leading-tight">
                  {waxing ? "Augošs Mēness" : "Dilstošs Mēness"}
                </dt>
                <dd className="text-body-md text-on-surface-variant print:text-[10px] print:leading-tight">
                  <time dateTime={start.toISOString()}>{dateFormat.format(start)} <span className="whitespace-nowrap">plkst. {PHASE_TIME_FMT.format(start)}</span></time>
                  {" – "}
                  <time dateTime={end.toISOString()}>{dateFormat.format(end)} <span className="whitespace-nowrap">plkst. {PHASE_TIME_FMT.format(end)}</span></time>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      {hasLunarEclipse && (
        <Card tone="container" className="mb-lg p-md print:mb-2 print:px-2 print:py-1">
          <h2 id="meness-aptumsums" className="mb-sm scroll-mt-24 text-headline-md text-on-surface print:mb-0! print:text-[12px]!">Pusēnas Mēness aptumsums naktī no 20. uz 21. februāri</h2>
          <p className="mb-sm text-body-md text-on-surface-variant print:hidden">
            Rīgā Mēness visu aptumsuma laiku būs virs horizonta. Skaidrā laikā ap aptumsuma maksimumu
            varēs pamanīt, ka viena pilnmēness mala kļuvusi nedaudz tumšāka. Mēness šķērsos Zemes pusēnu,
            tāpēc aptumšojums būs viegls.
          </p>
          <p className="mb-sm text-body-md text-on-surface-variant print:mb-0 print:text-[10px] print:leading-tight">
            Pēc Latvijas laika aptumsums sāksies <time dateTime="2027-02-20T23:12:00+02:00">20. februārī ap plkst. 23.12</time>.
            Maksimums būs pēc pusnakts, <time dateTime="2027-02-21T01:13:00+02:00">21. februārī ap plkst. 01.13</time>,
            un aptumsums beigsies <time dateTime="2027-02-21T03:13:00+02:00">ap plkst. 03.13</time>.
          </p>
          <p className="flex flex-wrap gap-x-md gap-y-1 text-label-md print:hidden">
            <a className="text-primary underline" href="https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2027Feb20N.pdf">NASA aptumsuma shēma (PDF)</a>
            <a className="text-primary underline" href="https://www.timeanddate.com/eclipse/in/latvia/riga?iso=20270220">Aptumsuma redzamība Rīgā</a>
          </p>
        </Card>
      )}

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

      <DatedCalendarExplorer key={`${year}-${month}`} year={year} month={month} />

      {/* Day-by-day table */}
      <h2 id="visas-dienas" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Visas dienas — {name} {year}</h2>
      <Card tone="low" elevated className="month-day-table mb-lg divide-y divide-outline-variant/10 p-0">
        {days.map((d) => {
          const meta = ELEMENT_META[d.sow.element];
          return (
            <div key={d.day} id={`diena-${d.day}`} tabIndex={-1} className="flex scroll-mt-24 flex-wrap items-center gap-x-2 gap-y-0.5 px-sm py-2 target:bg-primary-container/30 sm:flex-nowrap sm:gap-x-3 sm:px-md print:flex-nowrap print:break-inside-avoid">
              <span className="w-10 shrink-0 text-body-md font-semibold text-on-surface sm:w-20 print:w-16">
                <time dateTime={d.date.toISOString().slice(0, 10)} className="flex flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-1 print:flex-row print:gap-1">
                  {d.day}.
                  <abbr title={weekdayLong.format(d.date)} className="text-label-sm font-normal text-on-surface-variant no-underline">{weekdayShort.format(d.date)}</abbr>
                </time>
              </span>
              <MoonPhase phase={d.moon.phase} size={26} glow={false} idPrefix={`calendar-day-${d.day}`} />
              <span className="w-24 shrink-0 text-label-sm text-on-surface-variant sm:w-28">{dailyPhaseName(d.moon, eventsByDay.get(d.day))}</span>
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
              {d.holiday ? (
                <span className="min-w-0 basis-full text-label-sm sm:ml-auto sm:basis-auto sm:text-right print:ml-auto print:basis-auto print:text-right">
                  <strong className="font-semibold text-primary">{d.holiday}</strong>
                  {d.names.length > 0 && <span className="hidden text-tertiary sm:inline print:inline"> · {d.names.join(", ")}</span>}
                </span>
              ) : d.names.length > 0 && (
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
        <a href="#interaktivais-kalendars" className="inline-flex items-center gap-1 text-label-md text-primary hover:underline">
          Interaktīvais kalendārs <Icon name="arrow_forward" size="16px" />
        </a>
        <Link href="/macies" className="text-label-md text-on-surface-variant hover:text-primary">Kas ir Mēness sēja?</Link>
        <Link href="/augi" className="text-label-md text-on-surface-variant hover:text-primary">Augu enciklopēdija</Link>
        <Link href="/raksti" className="text-label-md text-on-surface-variant hover:text-primary">Raksti</Link>
      </div>
    </article>
  );
}
