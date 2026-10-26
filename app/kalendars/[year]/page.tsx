import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { ContentFigure } from "@/components/content-figure";
import { PrintButton } from "@/components/print-button";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { newsletterConfigured } from "@/lib/brevo";
import { moonPhasesForMonth } from "@/lib/moon";
import { monthPlan } from "@/lib/month-plan";
import { repottingDays, dayRanges } from "@/lib/repotting";
import { contentImage } from "@/lib/content-images";
import { MONTHS_LV_FULL } from "@/lib/planting-crops";
import { MONTH_SLUGS, CALENDAR_YEARS, canonical, SITE_NAME, og } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return CALENDAR_YEARS.map((year) => ({ year: String(year) }));
}

function parseYear(value: string): number | null {
  const year = Number(value);
  return CALENDAR_YEARS.includes(year) ? year : null;
}

const DATE_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", timeZone: "Europe/Riga" });
const TIME_FMT = new Intl.DateTimeFormat("lv-LV", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Riga" });

function yearPhases(year: number) {
  return MONTH_SLUGS.map((slug, i) => {
    const month = i + 1;
    const phases = moonPhasesForMonth(year, month);
    return {
      month,
      slug,
      name: MONTHS_LV_FULL[i],
      phases,
      full: phases.filter((p) => p.frac === 0.5),
      new: phases.filter((p) => p.frac === 0),
      repot: dayRanges(repottingDays(year, month).map((d) => d.day)),
    };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const year = parseYear((await params).year);
  if (!year) return {};
  const title = `Mēness kalendārs ${year} — pilnmēness, fāzes un dārza darbi Latvijā`;
  const description = `${year}. gada Mēness kalendārs Latvijai: visi pilnmēness un jauna Mēness datumi Latvijas laikā, katra mēneša dārza darbi un saites uz sējas dienām.`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/kalendars/${year}`) },
    openGraph: og({ path: `/kalendars/${year}`, title, description, image: contentImage("pilnmeness").src }),
  };
}

export default async function YearCalendarPage({ params }: { params: Promise<{ year: string }> }) {
  const year = parseYear((await params).year);
  if (!year) notFound();
  const months = yearPhases(year);
  const fullMoons = months.flatMap((m) => m.full);
  const newMoons = months.flatMap((m) => m.new);
  const prevYear = CALENDAR_YEARS.includes(year - 1) ? year - 1 : null;
  const nextYear = CALENDAR_YEARS.includes(year + 1) ? year + 1 : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Mēness kalendārs ${year}`,
    description: `${year}. gada pilnmēness un jauna Mēness datumi Latvijas laikā un mēnešu dārza darbi.`,
    inLanguage: "lv",
    image: canonical(contentImage("pilnmeness").src),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Kalendārs", item: canonical("/kalendars") },
      { "@type": "ListItem", position: 2, name: String(year), item: canonical(`/kalendars/${year}`) },
    ],
  };

  return (
    <article className="year-calendar mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />

      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant print:hidden">
        <Link href="/kalendars" className="hover:text-primary">Kalendārs</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{year}</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Gada pārskats · Latvijas laiks</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Mēness kalendārs {year}</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          {year}. gadā ir {fullMoons.length} pilnmēness brīži un {newMoons.length} jauna Mēness brīži. Tabulā redzi katra mēneša
          fāzes pēc Latvijas laika un galveno dārza darbu; mēneša lapā atradīsi sakņu, lapu, ziedu un augļu dienas.
        </p>
        <div className="mt-sm flex flex-wrap items-center gap-2 print:hidden">
          <PrintButton />
          <a href="#pilnmeness" className="inline-flex min-h-11 items-center rounded-full border border-outline-variant/30 px-4 text-label-md text-primary hover:bg-surface-container">Pilnmēness {year}</a>
          <a href="#menesi" className="inline-flex min-h-11 items-center rounded-full border border-outline-variant/30 px-4 text-label-md text-primary hover:bg-surface-container">Mēneši un darbi</a>
        </div>
      </header>

      <section className="mb-lg" aria-labelledby="pilnmeness">
        <h2 id="pilnmeness" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Pilnmēness un jauns Mēness {year}. gadā</h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
          <table className="year-phase-table w-full border-collapse text-left text-body-md">
            <thead className="bg-surface-container-high">
              <tr>
                <th scope="col" className="px-sm py-2 font-semibold text-on-surface">Mēnesis</th>
                <th scope="col" className="px-sm py-2 font-semibold text-on-surface">Pilnmēness</th>
                <th scope="col" className="px-sm py-2 font-semibold text-on-surface">Jauns Mēness</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.slug} className="border-t border-outline-variant/10 align-top">
                  <th scope="row" className="px-sm py-2 font-semibold capitalize text-on-surface">
                    <Link href={`/kalendars/${year}/${m.slug}`} className="text-primary hover:underline">{m.name}</Link>
                  </th>
                  <td className="px-sm py-2 text-on-surface-variant">
                    {m.full.map((p) => <span key={p.date.toISOString()} className="block">{DATE_FMT.format(p.date)}, {TIME_FMT.format(p.date)}</span>)}
                  </td>
                  <td className="px-sm py-2 text-on-surface-variant">
                    {m.new.map((p) => <span key={p.date.toISOString()} className="block">{DATE_FMT.format(p.date)}, {TIME_FMT.format(p.date)}</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-label-sm text-on-surface-variant">Laiki aprēķināti astronomiski un norādīti pēc Latvijas laika (ziemā UTC+2, vasarā UTC+3).</p>
        <div className="print:hidden">
          <ContentFigure image={{ id: "pilnmeness", caption: "Pilnmēness ir brīdis, kad Mēness atrodas pretī Saulei. Pie debesīm tas izskatās gandrīz pilns arī dienu pirms un pēc šī brīža." }} />
        </div>
      </section>

      <section className="mb-lg" aria-labelledby="menesi">
        <h2 id="menesi" className="mb-sm scroll-mt-24 text-headline-md text-on-surface">Mēneši: fāzes un galvenais darbs</h2>
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
          {months.map((m) => {
            const plan = monthPlan(m.month);
            return (
              <Card key={m.slug} tone="high" className="year-month-card flex flex-col p-md print:break-inside-avoid">
                <Link href={`/kalendars/${year}/${m.slug}`} className="flex items-center justify-between gap-2 text-title-lg capitalize text-primary hover:underline">
                  {m.name} {year}
                  <Icon name="arrow_forward" size="18px" className="print:hidden" />
                </Link>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-label-md text-on-surface-variant">
                  {m.phases.map((p) => (
                    <li key={p.date.toISOString()} className="inline-flex items-center gap-1">
                      <MoonPhase phase={p.frac} size={18} glow={false} idPrefix={`year-${year}-${p.date.getTime()}`} />
                      {DATE_FMT.format(p.date)}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-body-md font-semibold text-on-surface">{plan.title}</p>
                <p className="mt-1 text-body-md text-on-surface-variant">{plan.action}</p>
                <p className="mt-2 text-label-md text-on-surface-variant">
                  <span className="text-on-surface">Istabas augu pārstādīšana tradīcijā:</span> {m.repot}
                </p>
              </Card>
            );
          })}
        </div>
        <p className="mt-sm text-body-md text-on-surface-variant print:hidden">
          Istabas augu pārstādīšanas dienas ir krītošā Mēness dienas bez Mēness mezglu atpūtas dienām.{" "}
          <Link href="/kalendars/istabas-augu-parstadisana" className="text-primary hover:underline">Kā tās izvēlēties un kad pārstādīšana nav vajadzīga →</Link>
        </p>
      </section>

      <section className="mb-lg print:hidden">
        <h2 className="mb-sm text-headline-md text-on-surface">Kā lietot gada Mēness kalendāru dārzā</h2>
        <div className="space-y-sm text-body-lg leading-relaxed text-on-surface-variant">
          <p>Vispirms izvēlies darbu pēc sezonas, laikapstākļiem un augsnes. Mēness kalendārs palīdz izvēlēties dienu jau iespējamā laika robežās: piemēram, dēstu sēju aprēķini no izstādīšanas datuma un tad izvēlies tuvāko piemēroto elementa dienu.</p>
          <p>Pilnmēness un jauns Mēness ir konkrēti astronomiski brīži. Biodinamiskajā tradīcijā sēju plāno pēc Mēness atrašanās zvaigznājos, tāpēc sakņu, lapu, ziedu un augļu dienas skaties mēneša lapā.</p>
        </div>
        <div className="mt-sm flex flex-wrap gap-3">
          <Link href="/raksti/ka-lasit-meness-kalendaru" className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline"><Icon name="arrow_forward" size="16px" /> Kā lasīt Mēness kalendāru</Link>
          <Link href="/raksti/kad-set-destus-rekini-atpakal" className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline"><Icon name="arrow_forward" size="16px" /> Kad sēt dēstus: rēķini atpakaļ</Link>
          <Link href="/meness" className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline"><Icon name="arrow_forward" size="16px" /> Mēness fāze šodien</Link>
        </div>
        <DataNote variant="moon" className="mt-md" />
      </section>

      <div className="print:hidden">
        {newsletterConfigured() && <NewsletterSignup source={`kalendars:${year}`} />}
      </div>

      <nav className="mt-lg flex items-center justify-between gap-2 border-y border-outline-variant/10 py-sm print:hidden">
        {prevYear ? (
          <Link href={`/kalendars/${prevYear}`} className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
            <Icon name="chevron_left" size="18px" /> Mēness kalendārs {prevYear}
          </Link>
        ) : <span />}
        {nextYear ? (
          <Link href={`/kalendars/${nextYear}`} className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
            Mēness kalendārs {nextYear} <Icon name="chevron_right" size="18px" />
          </Link>
        ) : <span />}
      </nav>
      <p className="hidden print:block print:text-[10px]">Mēness sēja ir tradīcija; darbus pielāgo laikapstākļiem un augsnei. menesseja.lv/kalendars/{year}</p>
    </article>
  );
}
