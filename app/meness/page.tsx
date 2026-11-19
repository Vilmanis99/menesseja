import Link from "next/link";
import { TrackedLink } from "@/components/tracked-link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonHorizonTable } from "@/components/moon-horizon-table";
import { MoonPhase } from "@/components/moon-phase";
import { dailyPhaseName, lunarAgeAt, moonForDate, nextPrincipalPhases, principalPhasesOnDate } from "@/lib/moon";
import { rigaMoonDayAt } from "@/lib/traditional-moon-day";
import { dayAnchor, latviaDateParts } from "@/lib/day-anchor";
import { SeasonalLinks } from "@/components/seasonal-links";
import { sowingDays, ELEMENT_META } from "@/lib/biodynamic";
import { JsonLd } from "@/components/json-ld";
import { calendarYears, MONTH_SLUGS, MONTHS_LV_LOCATIVE, canonical, SITE_NAME } from "@/lib/seo";

const SHORT_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "short", weekday: "short", timeZone: "Europe/Riga" });
const TIME_FMT = new Intl.DateTimeFormat("lv-LV", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Riga" });
const DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Riga" });

const DAY_COUNT = new Intl.NumberFormat("lv-LV", { style: "unit", unit: "day", unitDisplay: "long" });
const HOUR_COUNT = new Intl.NumberFormat("lv-LV", { style: "unit", unit: "hour", unitDisplay: "long" });

function formatLunarAge(days: number, hours: number) {
  if (days && hours) return `${DAY_COUNT.format(days)} un ${HOUR_COUNT.format(hours)}`;
  if (days) return DAY_COUNT.format(days);
  if (hours) return HOUR_COUNT.format(hours);
  return "Mazāk par vienu stundu";
}

// A request just after midnight in Riga must receive the new date and its events.
export const revalidate = 0;

export default function MenessPage() {
  const today = new Date();
  const { year, month, day } = latviaDateParts(today);
  const moon = moonForDate(today);
  const age = lunarAgeAt(today);
  const moonDay = rigaMoonDayAt(today, age.newMoon);
  const newMoonDay = latviaDateParts(age.newMoon);
  const eventToday = principalPhasesOnDate(today)[0];
  const phaseLabel = dailyPhaseName(moon, eventToday);
  const sampleTime = TIME_FMT.format(dayAnchor(today));
  const illumination = Math.round(moon.illumination * 100);
  const summary = eventToday
    ? `Šodien plkst. ${TIME_FMT.format(eventToday.date)} pēc Latvijas laika iestājas ${eventToday.name.toLowerCase()}.`
    : `Šodien ir ${phaseLabel.toLowerCase()}.`;
  const appearance = `Plkst. ${sampleTime} pēc Latvijas laika Mēness ${moon.waxing ? "aug" : "dilst"}. Tā redzamā diska apgaismojums ir ${illumination} %.`;
  const upcoming = nextPrincipalPhases(today);
  const nextFullMoon = upcoming.find((phase) => phase.frac === 0.5)!;
  const nextTurn = upcoming.find((phase) => phase.frac === 0 || phase.frac === 0.5)!;
  const turnDay = latviaDateParts(nextTurn.date);
  const week = sowingDays(dayAnchor(today), 7);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Mēness fāze šodien — ${phaseLabel}`,
    inLanguage: "lv",
    description: `${summary} ${appearance}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Debesu ritms"
        title="Mēness fāze šodien"
        display
        subtitle={DATE_FMT.format(today)}
      />
      <p className="mb-md max-w-2xl text-body-lg text-on-surface-variant">
        {summary} {appearance}{" "}
        <a href="#meness-vecums" className="text-primary underline underline-offset-2">Kura Mēness diena ir Rīgā?</a>{" "}
        <a href="#meness-lekts-un-riets" className="text-primary underline underline-offset-2">Cikos šodien lec un riet Mēness?</a>{" "}
        Dārza darbiem atver{" "}
        <Link href="/kalendars" className="text-primary hover:underline">Mēness kalendāru</Link> vai uzzini,{" "}
        <Link href="/macies" className="text-primary hover:underline">kas ir Mēness sēja</Link>.
      </p>

      <section className="mb-lg rounded-xl border border-primary/20 bg-surface-container p-md" aria-labelledby="full-moon-today">
        <h2 id="full-moon-today" className="text-title-md text-on-surface">Vai šodien ir pilnmēness?</h2>
        <p className="mt-xs text-body-lg text-on-surface">
          {eventToday?.frac === 0.5
            ? `Jā. Pilnmēness iestāšanās brīdis šodien ir plkst. ${TIME_FMT.format(eventToday.date)} pēc Latvijas laika.`
            : `Nē. Nākamā pilnmēness datums: ${DATE_FMT.format(nextFullMoon.date)}, plkst. ${TIME_FMT.format(nextFullMoon.date)} pēc Latvijas laika.`}
        </p>
        <p className="mt-sm text-body-md text-on-surface-variant">Pilnmēness ir konkrēts astronomisks brīdis. Mēness izskatās gandrīz pilns arī dienās ap šo brīdi.</p>
        {calendarYears(today).includes(year) && (
          <nav aria-label="Mēness fāžu kalendāri" className="mt-sm flex flex-wrap gap-x-md gap-y-1 text-body-md">
            <Link href={`/kalendars/${year}/${MONTH_SLUGS[month - 1]}#meness-fazes`} className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">Mēness fāzes {MONTHS_LV_LOCATIVE[month - 1]}</Link>
            <Link href={`/kalendars/${year}#pilnmeness`} className="inline-flex min-h-11 items-center text-primary underline underline-offset-2">Visi {year}. gada pilnmēness datumi</Link>
          </nav>
        )}
      </section>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        {/* Hero moon */}
        <Card tone="highest" elevated linen className="flex flex-col items-center justify-center gap-md p-lg text-center lg:col-span-5">
          <MoonPhase phase={moon.phase} size={200} idPrefix="moon-today" />
          <div>
            <h2 className="text-headline-lg text-on-surface">{phaseLabel}</h2>
            <p className="mt-1 text-body-lg text-on-surface-variant">
              {illumination} % apgaismojums plkst. {sampleTime}
            </p>
          </div>
          <section id="meness-vecums" tabIndex={-1} aria-labelledby="meness-diena-riga" className="w-full scroll-mt-24 border-t border-outline-variant/30 pt-md text-left">
            <h2 id="meness-diena-riga" className="text-title-md text-on-surface">Kura Mēness diena šodien ir Rīgā?</h2>
            <p className="mt-xs text-body-lg text-on-surface">
              <time dateTime={today.toISOString()}>{day}. {MONTHS_LV_LOCATIVE[month - 1]} plkst. {TIME_FMT.format(today)}</time>{" "}
              Rīgā ir <strong>{moonDay}. Mēness diena</strong>.
            </p>
            <p className="mt-xs text-body-md text-on-surface-variant">
              Šajā tradīcijā pirmā diena sākas jaunmēness brīdī. Katra nākamā sākas, kad Rīgā uzlec Mēness.
            </p>
            <dl className="mt-md">
              <dt className="text-label-md text-on-surface-variant">Mēness vecums kopš jaunmēness</dt>
              <dd className="text-title-md text-on-surface">{formatLunarAge(age.days, age.hours)}</dd>
            </dl>
            <p className="mt-xs text-body-md text-on-surface-variant">
              Jaunmēness iestājās{" "}
              <time dateTime={age.newMoon.toISOString()}>{newMoonDay.year}. gada {newMoonDay.day}. {MONTHS_LV_LOCATIVE[newMoonDay.month - 1]} plkst. {TIME_FMT.format(age.newMoon)}</time>{" "}
              pēc Latvijas laika.
            </p>
          </section>
        </Card>

        <div className="flex flex-col gap-md lg:col-span-7">
          {/* Upcoming phases */}
          <Card tone="container" className="p-md">
            <h2 className="text-title-md text-on-surface">Tuvākās Mēness fāzes</h2>
            <p className="mb-md mt-xs text-body-md text-on-surface-variant">
              {nextTurn.frac === 0.5 ? "Mēness sāks dilt" : "Mēness sāks augt"}{" "}
              <time dateTime={nextTurn.date.toISOString()}>{turnDay.year !== year && `${turnDay.year}. gada `}{turnDay.day}. {MONTHS_LV_LOCATIVE[turnDay.month - 1]} plkst. {TIME_FMT.format(nextTurn.date)}</time>{" "}
              pēc Latvijas laika, kad iestāsies {nextTurn.frac === 0.5 ? "pilnmēness" : "jaunmēness"}.
            </p>
            <div className="grid grid-cols-2 gap-sm sm:grid-cols-4">
              {upcoming.map((phase) => {
                const local = latviaDateParts(phase.date);
                return (
                  <Link
                    key={phase.name}
                    href={`/kalendars/${local.year}/${MONTH_SLUGS[local.month - 1]}#meness-fazes`}
                    aria-label={`${phase.name}, ${DATE_FMT.format(phase.date)}, plkst. ${TIME_FMT.format(phase.date)}. Atvērt mēneša fāžu kalendāru`}
                    className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant/10 bg-background/40 p-sm text-center hover:border-primary/40"
                  >
                    <MoonPhase phase={phase.frac} size={44} glow={false} idPrefix={`moon-event-${phase.date.getTime()}`} />
                    <span>
                      <span className="block text-label-sm font-semibold text-primary underline underline-offset-2">{phase.name}</span>
                      <time dateTime={phase.date.toISOString()} className="block text-label-sm text-on-surface-variant">
                        {local.year === year ? SHORT_FMT.format(phase.date) : DATE_FMT.format(phase.date)}
                        <span className="block">plkst. {TIME_FMT.format(phase.date)}</span>
                      </time>
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* This week's element days */}
          <Card tone="container" className="p-md">
            <h3 className="mb-md text-label-md uppercase tracking-wider text-on-surface">
              Elementu dienas tuvākajās septiņās dienās
            </h3>
            <div className="space-y-2">
              {week.map((d) => {
                const elem = ELEMENT_META[d.element];
                return (
                  <div
                    key={d.date.toISOString()}
                    className="flex items-center gap-sm rounded-lg bg-background/40 p-sm"
                  >
                    <MoonPhase phase={moonForDate(d.date).phase} size={28} glow={false} />
                    <span className="w-28 text-body-md capitalize text-on-surface">
                      {SHORT_FMT.format(d.date)}
                    </span>
                    <Icon name={elem.icon} className={elem.color} size="20px" />
                    <span className="text-body-md text-on-surface-variant">
                      {d.sign.symbol} {d.sign.name} · {elem.label}
                    </span>
                    <span className="ml-auto text-label-sm font-semibold text-tertiary">
                      {d.partLabel}
                    </span>
                  </div>
                );
              })}
            </div>
            <TrackedLink href="/darza-darbi-sonedel" source="moon-today" placement="weekly-plan" className="mt-sm inline-flex min-h-11 items-center gap-1 text-body-md text-primary underline underline-offset-2">
              Šīs nedēļas dārza darbu saraksts <Icon name="arrow_forward" size="16px" />
            </TrackedLink>
          </Card>

          <Card tone="container" className="flex items-start gap-sm p-md">
            <Icon name="info" className="text-primary-fixed" />
            <p className="text-body-md text-on-surface-variant">
              Dienas fāze un apgaismojums aprēķināti plkst. 10.00 UTC (Latvijā ziemā 12.00, vasarā 13.00).
              Fāžu maiņas ir atsevišķi astronomiski notikumi. Elementu dienas ir biodinamiska tradīcija;
              sējot vispirms ņem vērā augsnes temperatūru un salnas.
            </p>
          </Card>
        </div>
      </div>
      <MoonHorizonTable today={today} />
      <div className="mt-lg"><SeasonalLinks month={month} /></div>
      <p className="text-label-sm text-on-surface-variant">
        Fāžu aprēķins: <a href="https://github.com/cosinekitty/astronomy" className="text-primary hover:underline">Astronomy Engine</a>.
        Datumi pārbaudīti pret <a href="https://aa.usno.navy.mil/data/MoonPhases" className="text-primary hover:underline">USNO Mēness fāžu tabulām</a>.{" "}
        <Link href="/raksti/meness-fazes-izskaidrotas#kas-vispar-ir-meness-faze" className="text-primary underline underline-offset-2">Kā nosaka Mēness vecumu un fāzes?</Link>
      </p>
    </>
  );
}
