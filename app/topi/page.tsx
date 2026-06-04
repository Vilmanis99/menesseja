import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { getAllTopLists } from "@/lib/tops";
import { fetchNationalTops, totalPlantings } from "@/lib/supabase/tops";
import { canonical, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Topi — ko Latvijā audzē visvairāk un labākie augu saraksti",
  description:
    "Ko Latvijas dārznieki šomēnes stāda visvairāk (dzīvi dati no kopienas) un rūpīgi atlasīti TOP saraksti: vieglākie augi iesācējam, ātrākie, balkonam, ēnai, ziemas glabāšanai.",
  alternates: { canonical: canonical("/topi") },
  openGraph: { title: "Dārza Topi — Mēness Sēja", type: "website" },
};

export default async function TopiPage() {
  const [national, lists] = await Promise.all([fetchNationalTops(12), Promise.resolve(getAllTopLists())]);
  const total = totalPlantings(national);
  const max = Math.max(1, ...national.map((t) => t.plantings));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dārza Topi",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    hasPart: lists.map((l) => ({ "@type": "ItemList", name: l.title, url: canonical(`/topi/${l.slug}`) })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Dārza Topi"
        subtitle="Ko Latvijā audzē visvairāk — un rūpīgi atlasīti saraksti, ar ko sākt."
      />

      {/* Live national tops */}
      <section className="mb-lg">
        <div className="mb-sm flex items-center gap-2">
          <Icon name="trending_up" className="text-primary" />
          <h2 className="text-headline-md text-on-surface">Ko Latvijā stāda visvairāk</h2>
        </div>

        {national.length >= 3 ? (
          <Card tone="high" elevated className="p-md">
            <ol className="space-y-3">
              {national.map((t, i) => (
                <li key={t.cropId}>
                  <Link href={`/augi/${t.cropId}`} className="group flex items-center gap-3">
                    <span className="w-5 shrink-0 text-center text-label-md font-bold text-on-surface-variant">
                      {i + 1}
                    </span>
                    <span className="text-xl leading-none">{t.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate text-body-md text-on-surface group-hover:text-primary">{t.name}</span>
                        <span className="shrink-0 text-label-sm text-on-surface-variant">{t.plantings}×</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-variant/40">
                        <div
                          className="h-full rounded-full bg-primary/70"
                          style={{ width: `${Math.max(8, Math.round((t.plantings / max) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-md flex items-center gap-1.5 text-label-sm text-on-surface-variant/80">
              <Icon name="groups" size="14px" />
              Pamatojoties uz {total} augiem mūsu kopienas dārzos · pēdējās 30 dienās. Jo vairāk dārznieku
              pievienojas, jo precīzāks tops.
            </p>
          </Card>
        ) : (
          <Card tone="container" className="flex items-center gap-md p-md">
            <Icon name="sprout" className="text-primary" size="28px" />
            <div className="flex-1">
              <p className="font-semibold text-on-surface">Tops vēl tikai sākas</p>
              <p className="text-body-md text-on-surface-variant">
                Kad kopiena izaugs, šeit redzēsi, ko Latvijā stāda visvairāk. Pievieno savus augus, lai
                būtu pirmais!
              </p>
            </div>
            <Link href="/" className="shrink-0 text-label-md text-primary hover:underline">
              Uz dārzu
            </Link>
          </Card>
        )}
      </section>

      {/* Editorial top lists */}
      {lists.length > 0 && (
        <section>
          <div className="mb-sm flex items-center gap-2">
            <Icon name="format_list_numbered" className="text-primary" />
            <h2 className="text-headline-md text-on-surface">Labākie saraksti iesācējam</h2>
          </div>
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            {lists.map((l) => (
              <Link key={l.slug} href={`/topi/${l.slug}`}>
                <Card tone="high" elevated className="h-full p-md transition-colors hover:bg-surface-container-highest">
                  <p className="text-label-sm uppercase tracking-wider text-tertiary">{l.category}</p>
                  <h3 className="mt-1 text-headline-md text-on-surface">{l.title}</h3>
                  <p className="mt-1 text-body-md text-on-surface-variant">{l.subtitle}</p>
                  <p className="mt-sm inline-flex items-center gap-1 text-label-md text-primary">
                    Skatīt sarakstu <Icon name="arrow_forward" size="16px" />
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
