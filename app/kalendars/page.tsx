import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { JsonLd } from "@/components/json-ld";
import { CalendarExplorer } from "@/components/calendar-explorer";
import { moonForDate } from "@/lib/moon";
import { sowingDay, isRestDay, ELEMENT_META, PART_GENITIVE, type Element } from "@/lib/biodynamic";
import { latviaNoon } from "@/lib/day-anchor";
import { cropPart } from "@/lib/crop-part";
import { cropHref } from "@/lib/flowers";
import { cropEmoji } from "@/lib/crop-visual";
import { CROPS, MONTHS_LV_FULL, MONTHS_LV_GENITIVE } from "@/lib/planting-crops";
import { MONTH_SLUGS, CALENDAR_YEARS, MONTH_TIPS, MONTHS_LV_LOCATIVE, canonical, SITE_NAME } from "@/lib/seo";

// The month block below is dated, so the prerendered HTML must not go stale.
export const revalidate = 3600;

const SOW_KEYS = ["sowIndoors", "sowOutdoors", "transplant"] as const;
const ELEMENTS: Element[] = ["zeme", "udens", "gaiss", "uguns"];

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

export default function KalendarsPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const nameFull = MONTHS_LV_FULL[month - 1];
  const nameGen = MONTHS_LV_GENITIVE[month - 1];
  const nameLoc = MONTHS_LV_LOCATIVE[month - 1];

  const dayCount = new Date(year, month, 0).getDate();
  const days = Array.from({ length: dayCount }, (_, i) => {
    // latviaNoon keeps the classification identical whatever TZ the build ran in.
    const date = latviaNoon(year, month, i + 1);
    return { day: i + 1, date, moon: moonForDate(date), sow: sowingDay(date), rest: isRestDay(date) };
  });

  const today = days.find((d) => d.day === now.getDate()) ?? days[0];
  const newMoon = days.reduce((a, b) => (b.moon.illumination < a.moon.illumination ? b : a));
  const fullMoon = days.reduce((a, b) => (b.moon.illumination > a.moon.illumination ? b : a));
  const restDays = days.filter((d) => d.rest).map((d) => d.day);

  const byElement = ELEMENTS.map((element) => {
    const meta = ELEMENT_META[element];
    return {
      element,
      meta,
      days: days.filter((d) => d.sow.element === element && !d.rest).map((d) => d.day),
      crops: sowableThisMonth(element, month).slice(0, 6),
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Mēness kalendārs — ${year}. gada ${nameGen}`,
    inLanguage: "lv",
    description: `Mēness fāzes, elementu dienas un labākās sēšanas dienas ${nameLoc} Latvijā.`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHeader
        eyebrow="Senču gudrība · Maria Thun"
        title="Mēness kalendārs"
        display
        subtitle="Katra diena nes sava elementa ritmu. Sēj saskaņā ar Mēness fāzi un zodiaka zīmi."
      />

      <p className="mb-lg max-w-2xl text-body-lg text-on-surface-variant">
        Mēness sējas kalendārs apvieno Mēness fāzes, zodiaka zīmi un biodinamiskās elementu dienas
        (sakņu, lapu, ziedu un augļu dienas) ar Latvijas klimatu. Zemāk redzi {nameGen} galvenos
        datumus, bet interaktīvajā kalendārā vari atvērt jebkuru dienu vai izdrukāt visu mēnesi.
      </p>

      {/* Server-rendered substance: without this the page reached search engines
          as navigation chrome plus a single paragraph. */}
      <section className="mb-lg">
        <h2 className="mb-md text-headline-md text-on-surface">
          Mēness kalendārs {nameLoc} {year}
        </h2>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          <Card tone="low" elevated linen className="flex items-center gap-md p-md">
            <MoonPhase phase={today.moon.phase} size={72} />
            <div>
              <p className="text-label-sm uppercase tracking-[0.15em] text-tertiary">
                {today.day}. {nameGen}
              </p>
              <p className="text-headline-sm text-on-surface">{today.moon.name}</p>
              <p className="mt-1 text-body-md text-on-surface-variant">
                {today.moon.waxing ? "Augošs" : "Dilstošs"} Mēness ·{" "}
                {PART_GENITIVE[today.sow.part]} diena
              </p>
              <p className="mt-xs text-body-md text-on-surface-variant">{today.sow.advice}</p>
            </div>
          </Card>

          <Card tone="low" elevated className="p-md">
            <h3 className="mb-sm text-title-md text-on-surface">Mēneša atskaites punkti</h3>
            <ul className="space-y-1.5 text-body-md text-on-surface-variant">
              <li className="flex items-center gap-2">
                <Icon name="dark_mode" size="18px" />
                Jauns Mēness — {newMoon.day}. {nameGen}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="brightness_1" size="18px" />
                Pilns Mēness — {fullMoon.day}. {nameGen}
              </li>
              {restDays.length > 0 && (
                <li className="flex items-start gap-2">
                  <Icon name="do_not_disturb_on" size="18px" />
                  <span>Nelabvēlīgās dienas — {restDays.join(", ")}.</span>
                </li>
              )}
            </ul>
            <p className="mt-sm text-body-md text-on-surface-variant">{MONTH_TIPS[month - 1]}</p>
          </Card>
        </div>
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">
          Labākās sēšanas dienas {nameLoc} pēc elementiem
        </h2>
        <p className="mb-md max-w-2xl text-body-md text-on-surface-variant">
          Katra diena pieder vienam elementam, un tas nosaka, kura auga daļa tajā dienā aug
          vislabāk. Nelabvēlīgās dienas sarakstos nav iekļautas.
        </p>
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
          {byElement.map(({ element, meta, days: elementDays, crops }) => (
            <Card key={element} tone="low" className="p-md">
              <h3 className="flex items-center gap-2 text-title-md text-on-surface">
                <Icon name={meta.icon} size="20px" className={meta.color} />
                {PART_GENITIVE[meta.part]} dienas · {meta.label}
              </h3>
              <p className="mt-xs text-body-md text-on-surface-variant">
                {`${nameLoc.charAt(0).toUpperCase()}${nameLoc.slice(1)}: `}
                {elementDays.length > 0 ? elementDays.join(", ") + "." : "šomēnes nav."}
              </p>
              {crops.length > 0 && (
                <p className="mt-xs text-body-md text-on-surface-variant">
                  Ko sēt:{" "}
                  {crops.map((c, i) => (
                    <span key={c.id}>
                      {i > 0 && ", "}
                      <Link href={cropHref(c.id)} className="text-primary hover:underline">
                        {cropEmoji(c.id)} {c.name.toLowerCase()}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              )}
            </Card>
          ))}
        </div>
        <p className="mt-md text-body-md text-on-surface-variant">
          Pilns {nameGen} kalendārs ar vārda dienām un drukas skatu —{" "}
          <Link href={`/kalendars/${year}/${MONTH_SLUGS[month - 1]}`} className="text-primary hover:underline">
            {nameFull} {year}
          </Link>
          .
        </p>
      </section>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Visi mēneši</h2>
        <div className="space-y-1.5">
          {CALENDAR_YEARS.map((y) => (
            <div key={y} className="flex flex-wrap items-center gap-1.5">
              <span className="w-10 shrink-0 text-label-md text-on-surface-variant">{y}.</span>
              {MONTH_SLUGS.map((slug, i) => (
                <Link
                  key={slug}
                  href={`/kalendars/${y}/${slug}`}
                  className="rounded-full bg-surface-container px-2.5 py-1 text-label-sm capitalize text-on-surface hover:text-primary"
                >
                  {MONTHS_LV_FULL[i]}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <CalendarExplorer />
    </>
  );
}
