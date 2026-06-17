import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { REGIONS, getRegion, type RegionId } from "@/lib/regions";
import { canonical, SITE_NAME, og } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.id }));
}

function valid(id: string): id is RegionId {
  return REGIONS.some((r) => r.id === id);
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;
  if (!valid(region)) return {};
  const r = getRegion(region);
  const title = `Dārza kalendārs ${r.nameLocative} — salnas, sējas logi un Mēness ritms`;
  const description = `Kad sēt un stādīt ${r.nameLocative} (${r.climateLabel}): vidējā pēdējā salna ${r.lastFrost}, ${r.growingDays} augšanas dienas. Reģionam pielāgots Mēness sējas kalendārs.`;
  return { title, description, alternates: { canonical: canonical(`/regioni/${r.id}`) }, openGraph: og({ path: `/regioni/${r.id}`, title, description }) };
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  if (!valid(region)) notFound();
  const r = getRegion(region);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Dārza kalendārs ${r.nameLocative}`,
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
    author: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <nav className="mb-md flex items-center gap-1 text-label-sm text-on-surface-variant">
        <Link href="/regioni" className="hover:text-primary">Reģioni</Link>
        <Icon name="chevron_right" size="14px" />
        <span className="text-on-surface">{r.name}</span>
      </nav>

      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">{r.climateLabel}</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Dārza kalendārs {r.nameLocative}</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">{r.summary}</p>
      </header>

      <div className="mb-md grid grid-cols-2 gap-md">
        <Card tone="high" elevated className="p-md">
          <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Vidējā pēdējā salna</p>
          <p className="text-headline-md text-primary">{r.lastFrost}</p>
        </Card>
        <Card tone="high" elevated className="p-md">
          <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Augšanas dienas</p>
          <p className="text-headline-md text-primary">{r.growingDays}</p>
        </Card>
      </div>

      <Card tone="container" className="mb-md p-md">
        <h2 className="mb-sm text-headline-md text-on-surface">Galvenie izaicinājumi</h2>
        <ul className="space-y-2">
          {r.challenges.map((c) => (
            <li key={c.text} className="flex items-start gap-2 text-body-md text-on-surface-variant">
              <Icon name={c.icon} size="18px" className="mt-0.5 text-secondary" />
              {c.text}
            </li>
          ))}
        </ul>
      </Card>

      <Card tone="highest" elevated accent="primary" className="mb-md p-md">
        <h2 className="mb-1 text-headline-md text-on-surface">Sējas padoms {r.nameLocative}</h2>
        <p className="text-body-md text-on-surface-variant">
          Siltummīļus (tomāti, gurķi, paprika) {r.nameLocative} laukā stādi tikai pēc vidējās pēdējās
          salnas ({r.lastFrost}) — līdz tam audzē tos siltumnīcā vai uz palodzes. Aukstumizturīgos
          (redīsi, salāti, zirņi, burkāni) vari sēt krietni agrāk.
        </p>
        <Link href="/kalendars" className="mt-sm inline-flex items-center gap-1 text-label-md text-primary hover:underline">
          Skatīt Mēness kalendāru <Icon name="arrow_forward" size="16px" />
        </Link>
      </Card>

      <DataNote variant="planting" withSources className="mb-md" />

      <div className="flex flex-wrap gap-3">
        {REGIONS.filter((x) => x.id !== r.id).map((x) => (
          <Link key={x.id} href={`/regioni/${x.id}`} className="text-label-md text-on-surface-variant hover:text-primary">
            {x.name}
          </Link>
        ))}
      </div>
    </article>
  );
}
