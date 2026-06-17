import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { getAllProblems, PROBLEM_TYPE_META, PROBLEM_TYPE_ORDER, SEVERITY_META } from "@/lib/kaitekli";
import { canonical, SITE_NAME, og } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dārza kaitēkļi un slimības — dabīga apkarošana | zemesvēzis, laputis, gliemeži",
  description:
    "Kā atpazīt un dabīgi apkarot biežākos Latvijas dārza kaitēkļus un slimības: zemesvēzis, laputis, gliemeži, miltrasa, lakstu puve. Katrai problēmai tautas līdzeklis un mūsu receptes.",
  alternates: { canonical: canonical("/kaitekli") },
  openGraph: og({ path: "/kaitekli", title: "Kaitēkļi un slimības — Mēness Sēja", description: "Kā atpazīt un dabīgi apkarot Latvijas dārza kaitēkļus un slimības — tautas līdzekļi un mūsu receptes.", type: "website" }),
};

export default function KaitekliPage() {
  const problems = getAllProblems();
  const byType = PROBLEM_TYPE_ORDER.map((t) => ({
    type: t,
    meta: PROBLEM_TYPE_META[t],
    items: problems.filter((p) => p.type === t),
  })).filter((g) => g.items.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dārza kaitēkļi un slimības",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    hasPart: problems.map((p) => ({ "@type": "Article", name: p.name, url: canonical(`/kaitekli/${p.slug}`) })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Kaitēkļi un slimības"
        subtitle="Kā atpazīt biežākās dārza nelaimes un apkarot tās dabīgi — bez ķīmijas, ar tautas līdzekļiem."
      />

      <Card tone="high" elevated linen className="mb-lg flex items-start gap-sm p-md">
        <Icon name="health_and_safety" className="text-primary" />
        <div>
          <p className="text-body-md text-on-surface-variant">
            Senči dārzu sargāja bez veikala indēm — ar pelniem, nātru vircu, kosas novārījumu un vērīgu aci.
            Katrai problēmai šeit ir <span className="text-on-surface">dabīga apkarošana</span> un saite uz
            gatavu recepti no mūsu krātuves.
          </p>
        </div>
      </Card>

      {byType.length === 0 ? (
        <Card tone="container" className="p-lg text-center text-on-surface-variant">
          Kaitēkļu lapas drīz būs šeit.
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
                {g.items.map((p) => (
                  <Link key={p.slug} href={`/kaitekli/${p.slug}`}>
                    <Card tone="high" elevated className="flex h-full items-start gap-md p-md transition-colors hover:bg-surface-container-highest">
                      <span className="text-4xl leading-none">{p.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-headline-md text-on-surface">{p.name}</h3>
                          <span className={`text-label-sm ${SEVERITY_META[p.severity].tone}`}>● {SEVERITY_META[p.severity].label}</span>
                        </div>
                        <p className="mt-0.5 text-body-md text-on-surface-variant">{p.tagline}</p>
                        {p.affects.length > 0 && (
                          <p className="mt-sm text-label-sm text-on-surface-variant/70">
                            Skar: {p.affects.slice(0, 4).join(", ")}{p.affects.length > 4 ? "…" : ""}
                          </p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
