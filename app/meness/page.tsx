import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { moonForDate, nextPrincipalPhases } from "@/lib/moon";
import { latviaDateParts } from "@/lib/day-anchor";
import { SeasonalLinks } from "@/components/seasonal-links";
import { sowingDays, ELEMENT_META } from "@/lib/biodynamic";
import { JsonLd } from "@/components/json-ld";
import { canonical, SITE_NAME } from "@/lib/seo";

const SHORT_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "short", weekday: "short", timeZone: "Europe/Riga" });
const TIME_FMT = new Intl.DateTimeFormat("lv-LV", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Riga" });
const DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Riga" });

// Nothing here is interactive — no state, no handlers. Rendering on the server
// puts the actual phase data in the HTML instead of an empty shell; the hourly
// revalidate keeps "today" honest.
export const revalidate = 3600;

export default function MenessPage() {
  const today = new Date();
  const moon = moonForDate(today);
  const upcoming = nextPrincipalPhases(today);
  const week = sowingDays(today, 7);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Mēness fāze šodien — ${moon.name}`,
    inLanguage: "lv",
    description: `Šodien ir ${moon.name.toLowerCase()}, ${Math.round(moon.illumination * 100)}% apgaismojums. Tuvākās Mēness fāzes un elementu dienas Latvijai.`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Debesu ritms"
        title="Mēness fāze šodien"
        display
        subtitle={`${DATE_FMT.format(today)} · ${moon.waxing ? "augošs" : "dilstošs"} Mēness`}
      />
      <p className="mb-md max-w-2xl text-body-lg text-on-surface-variant">
        Šodien ir {moon.name.toLowerCase()} ar {Math.round(moon.illumination * 100)}% apgaismojumu.
        Tuvākās fāžu maiņas zemāk norādītas pēc Latvijas laika. Dārza darbiem atver{" "}
        <Link href="/kalendars" className="text-primary hover:underline">Mēness kalendāru</Link> vai uzzini,{" "}
        <Link href="/macies" className="text-primary hover:underline">kas ir Mēness sēja</Link>.
      </p>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        {/* Hero moon */}
        <Card tone="highest" elevated linen className="flex flex-col items-center justify-center gap-md p-lg text-center lg:col-span-5">
          <MoonPhase phase={moon.phase} size={200} />
          <div>
            <h2 className="text-headline-lg text-on-surface">{moon.name}</h2>
            <p className="mt-1 text-body-lg text-on-surface-variant">
              {Math.round(moon.illumination * 100)}% apgaismojums · {moon.waxing ? "augošs" : "dilstošs"}
            </p>
          </div>
        </Card>

        <div className="flex flex-col gap-md lg:col-span-7">
          {/* Upcoming phases */}
          <Card tone="container" className="p-md">
            <h3 className="mb-md text-label-md uppercase tracking-wider text-on-surface">
              Tuvākās fāzes
            </h3>
            <div className="grid grid-cols-2 gap-sm sm:grid-cols-4">
              {upcoming.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant/10 bg-background/40 p-sm text-center"
                >
                  <MoonPhase phase={p.frac} size={44} glow={false} />
                  <div>
                    <p className="text-label-sm font-semibold text-on-surface">{p.name}</p>
                    <p className="text-label-sm capitalize text-on-surface-variant">
                      {SHORT_FMT.format(p.date)}
                    </p>
                    <p className="text-label-sm text-on-surface-variant">plkst. {TIME_FMT.format(p.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* This week's element days */}
          <Card tone="container" className="p-md">
            <h3 className="mb-md text-label-md uppercase tracking-wider text-on-surface">
              Šī nedēļa · elementu dienas
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
      <div className="mt-lg"><SeasonalLinks month={latviaDateParts(today).month} /></div>
      <p className="text-label-sm text-on-surface-variant">
        Fāžu aprēķins: <a href="https://github.com/cosinekitty/astronomy" className="text-primary hover:underline">Astronomy Engine</a>.
        Datumi pārbaudīti pret <a href="https://aa.usno.navy.mil/data/MoonPhases" className="text-primary hover:underline">USNO Mēness fāžu tabulām</a>.
      </p>
    </>
  );
}
