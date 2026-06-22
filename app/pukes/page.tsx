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
  title: "Puķu nosaukumi alfabēta secībā — 31 Latvijas dārza puķe | Mēness Sēja",
  description:
    "Pilns puķu nosaukumu saraksts alfabēta secībā: 31 Latvijas dārza puķe no A līdz Z — asteres, dālijas, hortenzijas, peonijas, tulpes un citas. Katrai latīniskais nosaukums, ziedēšanas laiks un kad stādīt pēc Mēness.",
  alternates: { canonical: canonical("/pukes") },
  openGraph: og({
    path: "/pukes",
    title: "Puķu nosaukumi alfabēta secībā — 31 Latvijas dārza puķe | Mēness Sēja",
    description:
      "Pilns puķu nosaukumu saraksts alfabēta secībā: 31 Latvijas dārza puķe no A līdz Z — asteres, dālijas, hortenzijas, peonijas, tulpes un citas. Katrai latīniskais nosaukums, ziedēšanas laiks un kad stādīt pēc Mēness.",
    type: "website",
  }),
};

export default function PukesPage() {
  const flowers = getAllFlowers();
  const alpha = [...flowers].sort((x, y) => x.name.localeCompare(y.name, "lv"));
  const byType = FLOWER_TYPE_ORDER.map((t) => ({
    type: t,
    meta: FLOWER_TYPE_META[t],
    items: flowers.filter((f) => f.type === t),
  })).filter((g) => g.items.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Puķu nosaukumi alfabēta secībā",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    mainEntity: {
      "@type": "ItemList",
      name: "Puķu nosaukumi alfabēta secībā (A–Z)",
      numberOfItems: alpha.length,
      itemListElement: alpha.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: f.name,
        url: canonical(`/pukes/${f.slug}`),
      })),
    },
    hasPart: flowers.map((f) => ({ "@type": "Article", name: f.name, url: canonical(`/pukes/${f.slug}`) })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        eyebrow="Puķu ceļvedis"
        title="Puķu nosaukumi: Latvijas dārza puķes alfabēta secībā"
        subtitle="31 Latvijas dārza puķe no A līdz Z — ar latīnisko nosaukumu, ziedēšanas laiku un kad stādīt pēc Mēness."
      />

      <p className="mb-lg max-w-3xl text-body-md text-on-surface-variant">
        Šeit ir mūsu puķu nosaukumu saraksts alfabēta secībā — Latvijas dārzos visbiežāk audzētās puķes no A
        līdz Z, ar latīnisko nosaukumu, ziedēšanas laiku un padomu, kad katru stādīt un kopt pēc Mēness. Lieto
        to gan kā ātru sarakstu, ja meklē konkrētas puķes nosaukumu, gan kā ceļvedi, lai izvēlētos, ko stādīt
        savā dobē.
      </p>

      <section className="mb-lg">
        <h2 className="mb-sm text-headline-md text-on-surface">Visi puķu nosaukumi alfabēta secībā (A–Z)</h2>
        <ul className="grid grid-cols-1 gap-x-md gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {alpha.map((f) => (
            <li key={f.slug}>
              <Link
                href={`/pukes/${f.slug}`}
                className="inline-flex flex-wrap items-baseline gap-x-1.5 text-body-md text-on-surface transition-colors hover:text-primary"
              >
                <span>{f.name}</span>
                {f.latin && <span className="text-body-sm italic text-on-surface-variant">({f.latin})</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>

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

      <h2 className="mb-md text-headline-md text-on-surface">Puķes pēc veida</h2>

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
                <h3 className="text-headline-md text-on-surface">{g.meta.label}</h3>
              </div>
              <p className="mb-sm text-body-md text-on-surface-variant">{g.meta.blurb}</p>
              <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                {g.items.map((f) => (
                  <Link key={f.slug} href={`/pukes/${f.slug}`}>
                    <Card tone="high" elevated className="flex h-full items-start gap-md p-md transition-colors hover:bg-surface-container-highest">
                      <span className="text-4xl leading-none">{f.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-headline-md text-on-surface">{f.name}</h4>
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
