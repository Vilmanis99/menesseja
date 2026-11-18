import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { WeeklyTaskCheck } from "@/components/weekly-task-check";
import { CALENDAR_SOURCES } from "@/lib/calendar-guides";
import { gardenWeek } from "@/lib/garden-week";
import { latviaDateKey } from "@/lib/day-anchor";
import { canonical, MONTH_SLUGS, og } from "@/lib/seo";

export const revalidate = 3600;
const path = "/darza-darbi-sonedel";
const title = "Dārza darbi šonedēļ Latvijā";
const description = "Šīs nedēļas darbu saraksts Latvijas dārzam. Pie katra darba redzēsi, kad sākt, ko darīt vispirms un kur atrast pilno ceļvedi.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: canonical(path) },
  openGraph: og({ path, title, description, type: "website" }),
};

const dateFormat = new Intl.DateTimeFormat("lv-LV", { timeZone: "Europe/Riga", day: "numeric", month: "long", year: "numeric" });
const shortDateFormat = new Intl.DateTimeFormat("lv-LV", { timeZone: "Europe/Riga", day: "numeric", month: "long" });

export default function WeeklyGardenPage() {
  const { start, end, tasks } = gardenWeek();
  const week = latviaDateKey(start);
  const sources = [...new Set(tasks.flatMap(({ section }) => section.sourceIds))];

  return (
    <article className="mx-auto max-w-3xl">
      <PageHeader title={title} eyebrow={dateFormat.formatRange(start, end)} display
        subtitle="Izvēlies savam dārzam piemērotos darbus un atzīmē paveikto. Datumi rāda plānošanas posmu. Pirms darba pārbaudi laikapstākļus un augu stāvokli savā dārzā." />
      <ol className="space-y-sm">
        {tasks.map(({ year, month, start: from, end: until, section }) => {
          const task = `${month}-${section.id}`;
          const href = `/kalendars/${year}/${MONTH_SLUGS[month - 1]}#darbs-${section.id}`;
          return (
            <li key={task}>
              <Card tone="container" className="p-md">
                <p className="mb-xs text-label-md text-tertiary">{shortDateFormat.formatRange(from, until)} · {section.area}</p>
                <h2 className="text-title-lg text-on-surface">{section.heading}</h2>
                <p className="mt-xs text-body-md text-on-surface-variant">{section.when}</p>
                <p className="mt-sm text-body-md text-on-surface">{section.steps[0]}</p>
                <div className="mt-sm flex flex-wrap items-center justify-between gap-x-md">
                  <Link href={href} aria-label={`Visi soļi: ${section.heading}`} className="inline-flex min-h-11 items-center text-label-md text-primary underline underline-offset-2">Skatīt visus soļus</Link>
                  <WeeklyTaskCheck task={task} week={week} heading={section.heading} />
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
      <details className="mt-lg border-t border-outline-variant/20 pt-sm">
        <summary className="min-h-11 cursor-pointer py-sm text-title-md text-on-surface">Šīs nedēļas darbu avoti</summary>
        <ul className="space-y-1">
          {sources.map((id) => <li key={id}><a className="inline-flex min-h-11 items-center text-body-md text-primary underline" href={CALENDAR_SOURCES[id].url}>{CALENDAR_SOURCES[id].label}</a></li>)}
        </ul>
      </details>
    </article>
  );
}
