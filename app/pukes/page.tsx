import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { getAllFlowers, FLOWER_TYPE_META, FLOWER_TYPE_ORDER } from "@/lib/flowers";
import { canonical, SITE_NAME, og } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Puķes — kad stādīt un kopt pēc Mēness | peonijas, narcises, pelargonijas",
  description:
    "Latvijas dārza puķes: kad stādīt, kā kopt un labākā Mēness ziedu-diena katrai — peonijas, narcises, begonijas, pelargonijas, ehinācija un citas. Tautas gudrība un reāli dati.",
  alternates: { canonical: canonical("/pukes") },
  openGraph: og({ path: "/pukes", title: "Puķu ceļvedis — Mēness Sēja", description: "Latvijas dārza puķes: kad stādīt, kā kopt un labākā Mēness ziedu diena katrai.", type: "website" }),
};

export default function PukesPage() {
  const flowers = getAllFlowers();
  const byType = FLOWER_TYPE_ORDER.map((t) => ({
    type: t,
    meta: FLOWER_TYPE_META[t],
    items: flowers.filter((f) => f.type === t),
  })).filter((g) => g.items.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Puķu ceļvedis",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    hasPart: flowers.map((f) => ({ "@type": "Article", name: f.name, url: canonical(`/pukes/${f.slug}`) })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Puķu ceļvedis"
        subtitle="No peonijām līdz balkona pelargonijām — kad stādīt, kā kopt un kura ir labākā Mēness ziedu-diena."
      />

      <Card tone="high" elevated linen className="mb-lg flex items-start gap-sm p-md">
        <Icon name="local_florist" className="text-tertiary" />
        <div>
          <p className="text-body-md text-on-surface-variant">
            Biodinamikā ziedu augus sēj un kopj <span className="text-on-surface">ziedu dienās</span> (gaisa elements),
            kad Mēness iet caur Dvīņu, Svaru vai Ūdensvīra zvaigznāju. Katrai puķei esam pievienojuši šo
            tradicionālo laiku — kā gadsimtiem darīja senči, kad sēja, lai zied, nevis lai aug lapas.
          </p>
        </div>
      </Card>

      {byType.length === 0 ? (
        <Card tone="container" className="p-lg text-center text-on-surface-variant">
          Puķu lapas drīz būs šeit.
        </Card>
      ) : (
        <div className="space-y-lg">
          {byType.map((g) => (
            <section key={g.type}>
              <div className="mb-1 flex items-center gap-2">
                <Icon name={g.meta.icon} className="text-primary" />
                <h2 className="text-headline-md text-on-surface">{g.meta.label}</h2>
              </div>
              <p className="mb-sm text-body-md text-on-surface-variant">{g.meta.blurb}</p>
              <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                {g.items.map((f) => (
                  <Link key={f.slug} href={`/pukes/${f.slug}`}>
                    <Card tone="high" elevated className="flex h-full items-start gap-md p-md transition-colors hover:bg-surface-container-highest">
                      <span className="text-4xl leading-none">{f.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-headline-md text-on-surface">{f.name}</h3>
                        <p className="mt-0.5 text-body-md text-on-surface-variant">{f.tagline}</p>
                        <div className="mt-sm flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                            <Icon name="filter_vintage" size="14px" /> {f.bloom}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                            <Icon name="wb_sunny" size="14px" /> {f.sun}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <DataNote variant="moon" className="mt-lg" />
    </>
  );
}
