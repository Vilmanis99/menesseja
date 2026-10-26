import { ContentFigure } from "@/components/content-figure";
import { TrackedLink } from "@/components/tracked-link";
import { Icon } from "@/components/ui/icon";
import { calendarGuide, CALENDAR_SOURCES, CALENDAR_GUIDES_UPDATED_AT } from "@/lib/calendar-guides";
import { MONTHS_LV_LOCATIVE } from "@/lib/seo";

export function CalendarWorkPlan({ month }: { month: number }) {
  const guide = calendarGuide(month);
  return (
    <section className="mb-lg print:hidden" aria-labelledby="work-plan-heading">
      <h2 id="work-plan-heading" className="mb-sm text-headline-md text-on-surface">Kad ko darīt {MONTHS_LV_LOCATIVE[month - 1]}</h2>
      <p className="mb-md text-body-md leading-relaxed text-on-surface-variant">Orientējoša darbu secība mēneša plānošanai. Datumu posmi nav laikapstākļu prognoze: pie katra darba norādīts, kādos apstākļos to sākt. Salu, slapju augsni un auga attīstību ņem vērā pirms datuma.</p>
      <div className="grid gap-sm sm:grid-cols-3">
        {guide.timeline.map((item) => {
          return (
            <div key={item.period} className="rounded-xl border border-outline-variant/20 bg-surface-container p-sm sm:p-md">
              <h3 className="text-title-md text-primary">{item.period}</h3>
              <p className="mt-sm text-body-md leading-relaxed text-on-surface-variant">{item.focus}</p>
              <ul className="mt-sm divide-y divide-outline-variant/20">
                {item.sectionIds.map((id) => {
                  const task = guide.sections.find((section) => section.id === id)!;
                  return <li key={id}><a href={`#darbs-${id}`} className="inline-flex min-h-11 items-center gap-2 py-2 text-body-md text-primary underline decoration-primary/30 underline-offset-2">{task.heading}<Icon name="arrow_downward" size="16px" className="shrink-0" /></a></li>;
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function CalendarMonthGuide({ month }: { month: number }) {
  const guide = calendarGuide(month);
  return (
    <section id="menesa-darbi" className="article-reading-surface -mx-2 mb-lg scroll-mt-24 p-4 sm:mx-0 sm:p-8 print:hidden" aria-labelledby="month-guide-heading">
      <p className="text-label-sm uppercase tracking-[0.15em] text-tertiary">Praktiskais mēneša ceļvedis</p>
      <h2 id="month-guide-heading" className="mt-xs text-headline-lg-mobile text-on-surface">{guide.title}</h2>
      <ContentFigure image={guide.image} />
      <nav aria-label="Mēneša darbu saturs" className="my-md border-y border-outline-variant/20 py-sm">
        <p className="mb-xs text-title-md text-on-surface">Izvēlies sev vajadzīgo darbu</p>
        <ol className="list-decimal space-y-1 pl-5 text-body-md text-primary">
          {guide.sections.map((section) => <li key={section.id}><a href={`#darbs-${section.id}`} className="inline-flex min-h-11 items-center underline decoration-primary/30 underline-offset-2">{section.heading}</a></li>)}
        </ol>
      </nav>
      {guide.sections.map((section) => (
        <section id={`darbs-${section.id}`} key={section.id} className="mt-lg scroll-mt-24 border-t border-outline-variant/20 pt-md">
          <p className="mb-xs text-label-sm uppercase tracking-wide text-tertiary">{section.area}</p>
          <h3 className="mb-sm text-headline-md text-on-surface">{section.heading}</h3>
          <p className="mb-md border-l-2 border-primary pl-sm text-body-md leading-relaxed text-on-surface"><strong>Kad rīkoties:</strong> {section.when}</p>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className="mb-sm text-body-lg leading-relaxed text-on-surface-variant">{paragraph}</p>)}
          <ol className="my-md list-decimal space-y-sm pl-6 text-body-lg leading-relaxed text-on-surface-variant marker:font-semibold marker:text-primary">
            {section.steps.map((step) => <li key={step} className="pl-1">{step}</li>)}
          </ol>
          <p className="mb-sm text-body-md leading-relaxed text-on-surface-variant"><strong className="text-on-surface">Bieža kļūda:</strong> {section.avoid}</p>
          <TrackedLink href={section.link.href} source={`calendar:${month}`} placement="month-guide" className="inline-flex min-h-11 items-center gap-2 text-body-md text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
            {section.link.label}<Icon name="arrow_forward" size="18px" />
          </TrackedLink>
          <p className="mt-sm text-label-sm leading-relaxed text-on-surface-variant">Avoti: {section.sourceIds.map((id, index) => <span key={id}>{index > 0 && " · "}<a href={CALENDAR_SOURCES[id].url} className="underline underline-offset-2">{CALENDAR_SOURCES[id].label}</a></span>)}</p>
        </section>
      ))}
      <section className="mt-lg" aria-labelledby="month-faq-heading">
        <h3 id="month-faq-heading" className="mb-sm text-headline-md text-on-surface">Biežākie jautājumi</h3>
        <div className="divide-y divide-outline-variant/20 rounded-xl border border-outline-variant/20 px-sm sm:px-md">
          {guide.faq.map((item) => (
            <details key={item.q} className="group py-sm">
              <summary className="flex min-h-11 list-none items-center justify-between gap-sm text-body-md font-semibold text-on-surface marker:content-none">
                {item.q}<Icon name="expand_more" className="shrink-0 text-primary group-open:rotate-180" />
              </summary>
              <p className="mt-sm text-body-md leading-relaxed text-on-surface-variant">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <footer className="mt-lg border-t border-outline-variant/20 pt-md">
        <h3 className="text-title-md text-on-surface">Avoti un piemērošana Latvijā</h3>
        <p className="mt-sm text-body-md leading-relaxed text-on-surface-variant">Darbu laiku pielāgo savas vietas augsnei, salnām un auga prasībām. Ārvalstu avotu sējas datumus nepārņem tieši.{guide.sourceIds.includes("local-spring") && " LLKC sezonas novērojumi attiecas uz publikācijā norādīto gadu."}</p>
        <ul className="mt-sm space-y-1 text-body-md text-primary">
          {guide.sourceIds.map((id) => <li key={id}><a className="inline-flex min-h-11 items-center underline decoration-primary/30 underline-offset-2 hover:decoration-primary" href={CALENDAR_SOURCES[id].url}>{CALENDAR_SOURCES[id].label}</a></li>)}
        </ul>
        <p className="mt-sm text-label-sm text-on-surface-variant">Mēneša darbu ceļvedis atjaunots <time dateTime={CALENDAR_GUIDES_UPDATED_AT}>{new Intl.DateTimeFormat("lv-LV", { timeZone: "Europe/Riga" }).format(new Date(`${CALENDAR_GUIDES_UPDATED_AT}T12:00:00Z`))}</time></p>
      </footer>
    </section>
  );
}
