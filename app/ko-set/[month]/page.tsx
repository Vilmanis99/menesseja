import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { CROPS, MONTHS_LV_FULL, ACTIVITY_META, type ActivityKey } from "@/lib/planting-crops";
import { cropEmoji } from "@/lib/crop-visual";
import { MONTH_SLUGS, monthFromSlug, MONTH_TIPS, MONTHS_LV_LOCATIVE, canonical, SITE_NAME, og } from "@/lib/seo";
import { MONTH_GUIDES } from "@/lib/month-guides";
import { TrackedLink } from "@/components/tracked-link";

export const dynamicParams = false;
const CAL_YEAR = 2026;

export function generateStaticParams() {
  return MONTH_SLUGS.map((month) => ({ month }));
}

const GROUPS: { key: ActivityKey; title: string; icon: string }[] = [
  { key: "sowIndoors", title: "Sēt telpās (rasādēm)", icon: "yard" },
  { key: "sowOutdoors", title: "Sēt tieši laukā", icon: "grass" },
  { key: "transplant", title: "Stādīt laukā", icon: "potted_plant" },
  { key: "harvest", title: "Novākt", icon: "agriculture" },
];

function cropsFor(key: ActivityKey, month: number) {
  return CROPS.filter((c) => {
    const r = c[key];
    return r && month >= r[0] && month <= r[1];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ month: string }> }): Promise<Metadata> {
  const { month } = await params;
  const m = monthFromSlug(month);
  if (!m) return {};
  const loc = MONTHS_LV_LOCATIVE[m - 1];
  const title = m === 7 ? "Ko vēl sēt jūlijā otrajai ražai Latvijā" : `Ko sēt ${loc} Latvijā — dārza darbi un sēja`;
  const description = m === 7
    ? "Ko jūlijā vēl paspēt iesēt rudens ražai: Ķīnas kāposti, kolrābji, rāceņi, dilles, redīsi un salāti ar svarīgām karstuma niansēm."
    : `Ko sēt, stādīt un novākt ${loc} Latvijas dārzā: pilns saraksts pa darbiem, sezonas padomi un labākās Mēness dienas.`;
  return { title, description, alternates: { canonical: canonical(`/ko-set/${month}`) }, openGraph: og({ path: `/ko-set/${month}`, title, description }) };
}

export default async function KoSetPage({ params }: { params: Promise<{ month: string }> }) {
  const { month: slug } = await params;
  const month = monthFromSlug(slug);
  if (!month) notFound();
  const name = MONTHS_LV_FULL[month - 1];
  const guide = MONTH_GUIDES[month];

  const groups = GROUPS.map((g) => ({
    ...g,
    crops: cropsFor(g.key, month).sort((a, b) => {
      if (!guide || g.key !== "sowOutdoors") return 0;
      const aIndex = guide.priorityCropIds.indexOf(a.id);
      const bIndex = guide.priorityCropIds.indexOf(b.id);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    }),
  })).filter((g) => g.crops.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Ko sēt ${name} Latvijā`,
    inLanguage: "lv",
    ...(guide?.updatedAt ? { dateModified: guide.updatedAt } : {}),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
    author: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <nav className="mb-sm flex items-center gap-1 text-label-sm text-on-surface-variant" aria-label="Atpakaļceļš">
        <Link href="/ko-set" className="inline-flex min-h-11 items-center hover:text-primary">Ko sēt</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="capitalize text-on-surface">{name}</span>
      </nav>

      <Card tone="highest" elevated linen className="crop-hero mb-md p-md sm:p-lg">
        <header>
          <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Dārza darbi pa mēnešiem</p>
          <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">
            {month === 7 ? "Ko vēl sēt jūlijā" : `Ko sēt ${MONTHS_LV_LOCATIVE[month - 1]} Latvijā`}
          </h1>
          <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">{MONTH_TIPS[month - 1]}</p>
        </header>
      </Card>

      {guide && (
        <>
          <aside className="mb-md rounded-xl border-l-4 border-primary bg-primary-container/15 p-md" aria-labelledby="month-short-answer-heading">
            <p id="month-short-answer-heading" className="mb-1 flex items-center gap-1.5 text-label-md font-semibold uppercase tracking-wide text-primary">
              <Icon name="lightbulb" size="18px" /> Īsā atbilde
            </p>
            <p className="text-body-lg leading-relaxed text-on-surface">{guide.shortAnswer}</p>
          </aside>

          <section className="mb-lg" aria-labelledby="second-harvest-heading">
            <h2 id="second-harvest-heading" className="mb-sm text-headline-md text-on-surface">Trīs noteikumi otrajai ražai</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {guide.checklist.map((item) => (
                <Card key={item.title} tone="container" className="p-sm">
                  <Icon name={item.icon} size="21px" className="text-primary" />
                  <h3 className="mt-2 text-body-md font-semibold text-on-surface">{item.title}</h3>
                  <p className="mt-1 text-label-md leading-relaxed text-on-surface-variant">{item.text}</p>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="mb-md space-y-md">
        {groups.map((g) => (
          <Card key={g.key} tone="high" elevated className="p-md">
            <h2 className="mb-sm flex items-center gap-sm text-headline-md text-on-surface">
              <Icon name={g.icon} className="text-primary" /> {g.title}
            </h2>
            {g.key === "sowOutdoors" && guide ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {g.crops.map((c) => {
                  const isPriority = guide.priorityCropIds.includes(c.id);
                  return (
                    <Card key={c.id} tone={isPriority ? "highest" : "container"} elevated={isPriority} className="flex flex-col p-sm">
                      <div className="flex items-start gap-2">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container/25 text-2xl" aria-hidden="true">{cropEmoji(c.id)}</span>
                        <div className="min-w-0 flex-1">
                          <Link href={`/augi/${c.id}`} className="inline-flex min-h-11 items-center font-semibold text-on-surface hover:text-primary hover:underline">{c.name}</Link>
                          <p className="text-label-sm text-on-surface-variant">{c.daysToHarvest ?? "Skaties auga ceļvedī"}</p>
                        </div>
                      </div>
                      <p className="mt-2 flex-1 text-body-md leading-relaxed text-on-surface-variant">{guide.cropNotes[c.id] ?? c.note}</p>
                      <TrackedLink
                        href={`/?pievienot=${c.id}`}
                        source={`ko-set:${slug}`}
                        placement="crop-card"
                        className="mt-sm inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-primary-container/25 px-3 text-label-md font-semibold text-primary hover:brightness-110 active:scale-[0.98]"
                      >
                        <Icon name="add" size="18px" /> Pievienot dārzam
                      </TrackedLink>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {g.crops.map((c) => (
                  <Link key={c.id} href={`/augi/${c.id}`} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
                    {cropEmoji(c.id)} {c.name}
                  </Link>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <DataNote variant="planting" withSources className="mb-md" />

      <Card tone="container" className="mb-md flex items-center gap-md p-md">
        <Icon name="brightness_3" className="text-primary" size="28px" />
        <div className="flex-1">
          <p className="font-semibold text-on-surface">Sēt saskaņā ar Mēnesi?</p>
          <p className="text-body-md text-on-surface-variant">Skaties šī mēneša Mēness sējas kalendāru ar elementu dienām.</p>
        </div>
        <Link href={`/kalendars/${CAL_YEAR}/${slug}`} className="inline-flex min-h-11 shrink-0 items-center gap-1 text-label-md text-primary hover:underline">
          Kalendārs <Icon name="arrow_forward" size="16px" />
        </Link>
      </Card>

      {guide && (
        <section className="mb-md" aria-labelledby="month-related-heading">
          <h2 id="month-related-heading" className="mb-sm text-headline-md text-on-surface">Plašāki jūlija padomi</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {guide.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex min-h-14 items-center gap-2 rounded-xl border border-outline-variant/10 bg-surface-container px-md py-sm text-body-md font-semibold text-on-surface hover:bg-surface-container-high hover:text-primary">
                <Icon name="arrow_outward" size="18px" className="shrink-0 text-primary" /> {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {guide && (
        <section className="mb-md border-t border-outline-variant/10 pt-md" aria-labelledby="month-sources-heading">
          <h2 id="month-sources-heading" className="text-headline-md text-on-surface">Avoti un pārbaude</h2>
          <p className="mt-1 text-label-md text-on-surface-variant">
            Saturs pārbaudīts {new Intl.DateTimeFormat("lv-LV").format(new Date(`${guide.updatedAt}T12:00:00Z`))}.
          </p>
          <ul className="mt-2 space-y-1">
            {guide.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-label-md text-primary hover:underline">
                  {source.label} <Icon name="open_in_new" size="15px" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="custom-scrollbar flex gap-2 overflow-x-auto pb-1" aria-label="Citi mēneši">
        {MONTH_SLUGS.map((s, i) => (
          <Link key={s} href={`/ko-set/${s}`} aria-current={i + 1 === month ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3 py-1 text-label-sm ${i + 1 === month ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-primary"}`}>
            {MONTHS_LV_FULL[i].slice(0, 3)}
          </Link>
        ))}
      </nav>
    </article>
  );
}
