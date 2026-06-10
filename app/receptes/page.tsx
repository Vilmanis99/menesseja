import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { DataNote } from "@/components/data-note";
import { getAllRecipes, PURPOSE_META, PURPOSE_ORDER } from "@/lib/recipes";
import { canonical, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dabīgā mēslojuma receptes — nātru virca, pelnu šķīdums un citas",
  description:
    "Tautas receptes dabīgam mēslojumam un augu kopšanai: nātru virca, koku pelnu šķīdums, kosas novārījums un citas. Katrai receptei norādīta arī tradicionāli labākā Mēness fāze tās lietošanai.",
  alternates: { canonical: canonical("/receptes") },
  openGraph: { title: "Dabīgā mēslojuma receptes — Mēness Sēja", type: "website" },
};

export default function ReceptesPage() {
  const recipes = getAllRecipes();
  const byPurpose = PURPOSE_ORDER.map((p) => ({
    purpose: p,
    meta: PURPOSE_META[p],
    items: recipes.filter((r) => r.purpose === p),
  })).filter((g) => g.items.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dabīgā mēslojuma receptes",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    // CreativeWork, not HowTo: HowTo requires `step`, which lives on the detail pages.
    hasPart: recipes.map((r) => ({ "@type": "CreativeWork", name: r.name, url: canonical(`/receptes/${r.slug}`) })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Receptūru krātuve"
        subtitle="Dabīgs mēslojums un augu kopšana no tautas gudrības — katra recepte saskaņota ar Mēness ritmu."
      />

      <Card tone="high" elevated linen className="mb-lg flex items-start gap-sm p-md">
        <Icon name="science" className="text-primary" />
        <div>
          <p className="text-body-md text-on-surface-variant">
            Senči baroja dārzu bez veikala — ar nātrēm, pelniem un kompostu. Katrai receptei esam
            pievienojuši tradicionāli labāko <span className="text-on-surface">Mēness fāzi un elementu dienu</span>{" "}
            tās lietošanai: sakņu barošanai un augsnes darbiem — dilstošā Mēnesī, lapu apsmidzināšanai —
            augošā. Tā ir tradīcija, ne garantija; laiks un augsnes stāvoklis ir svarīgāki.
          </p>
        </div>
      </Card>

      <Link href="/iesutit" className="mb-lg block">
        <Card tone="container" accent="secondary" className="flex items-center gap-md p-md transition-colors hover:bg-surface-container-high">
          <Icon name="volunteer_activism" className="text-secondary" size="26px" />
          <p className="flex-1 text-body-md text-on-surface">
            Zini vecmāmiņas recepti, kuras šeit nav? <span className="text-secondary-fixed">Iesūti to krātuvei →</span>
          </p>
        </Card>
      </Link>

      {byPurpose.length === 0 ? (
        <Card tone="container" className="p-lg text-center text-on-surface-variant">
          Receptes drīz būs šeit.
        </Card>
      ) : (
        <div className="space-y-lg">
          {byPurpose.map((g) => (
            <section key={g.purpose}>
              <div className="mb-sm flex items-center gap-2">
                <Icon name={g.meta.icon} className="text-primary" />
                <h2 className="text-headline-md text-on-surface">{g.meta.label}</h2>
              </div>
              <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                {g.items.map((r) => (
                  <Link key={r.slug} href={`/receptes/${r.slug}`}>
                    <Card tone="high" elevated className="h-full p-md transition-colors hover:bg-surface-container-highest">
                      <h3 className="text-headline-md text-on-surface">{r.name}</h3>
                      <p className="mt-1 text-body-md text-on-surface-variant">{r.tagline}</p>
                      <div className="mt-sm flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5">
                          <Icon name="schedule" size="14px" /> {r.timeText}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 capitalize">
                          <Icon name="bar_chart" size="14px" /> {r.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/20 px-2 py-0.5 text-primary-fixed">
                          <Icon name="brightness_3" size="14px" /> {r.moonPhase} Mēness
                        </span>
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
