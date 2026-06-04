import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { CROPS, MONTHS_LV_FULL, ACTIVITY_META, type ActivityKey } from "@/lib/planting-crops";
import { cropEmoji } from "@/lib/crop-visual";
import { MONTH_SLUGS, monthFromSlug, MONTH_TIPS, MONTHS_LV_LOCATIVE, canonical, SITE_NAME } from "@/lib/seo";

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
  const title = `Ko sēt ${loc} Latvijā — dārza darbi un sēja`;
  const description = `Ko sēt, stādīt un novākt ${loc} Latvijas dārzā: pilns saraksts pa darbiem, sezonas padomi un labākās Mēness dienas.`;
  return { title, description, alternates: { canonical: canonical(`/ko-set/${month}`) }, openGraph: { title, description, type: "article" } };
}

export default async function KoSetPage({ params }: { params: Promise<{ month: string }> }) {
  const { month: slug } = await params;
  const month = monthFromSlug(slug);
  if (!month) notFound();
  const name = MONTHS_LV_FULL[month - 1];

  const groups = GROUPS.map((g) => ({ ...g, crops: cropsFor(g.key, month) })).filter((g) => g.crops.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Ko sēt ${name} Latvijā`,
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/ko-set" className="hover:text-primary">Ko sēt</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="capitalize text-on-surface">{name}</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Dārza darbi pa mēnešiem</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Ko sēt {MONTHS_LV_LOCATIVE[month - 1]} Latvijā</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">{MONTH_TIPS[month - 1]}</p>
      </header>

      <div className="mb-md space-y-md">
        {groups.map((g) => (
          <Card key={g.key} tone="high" elevated className="p-md">
            <h2 className="mb-sm flex items-center gap-sm text-headline-md text-on-surface">
              <Icon name={g.icon} className="text-primary" /> {g.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {g.crops.map((c) => (
                <Link key={c.id} href={`/augi/${c.id}`} className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface hover:text-primary">
                  {cropEmoji(c.id)} {c.name}
                </Link>
              ))}
            </div>
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
        <Link href={`/kalendars/${CAL_YEAR}/${slug}`} className="inline-flex shrink-0 items-center gap-1 text-label-md text-primary hover:underline">
          Kalendārs <Icon name="arrow_forward" size="16px" />
        </Link>
      </Card>

      <div className="flex flex-wrap gap-2">
        {MONTH_SLUGS.map((s, i) => (
          <Link key={s} href={`/ko-set/${s}`} className={`rounded-full px-3 py-1 text-label-sm ${i + 1 === month ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-primary"}`}>
            {MONTHS_LV_FULL[i].slice(0, 3)}
          </Link>
        ))}
      </div>
    </article>
  );
}
