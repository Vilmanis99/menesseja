import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { getAllArticles } from "@/lib/articles";
import { canonical, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Raksti — Mēness sēja un dārzkopība iesācējiem",
  description:
    "Vienkārši raksti par Mēness fāzēm, biodinamiku, salnām, augsnes temperatūru un dārza plānošanu — kā sākt dārzot saskaņā ar dabu Latvijā.",
  alternates: { canonical: canonical("/raksti") },
};

export default function RakstiIndex() {
  const articles = getAllArticles();
  const cats = [...new Set(articles.map((a) => a.category))];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Raksti",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Mācies dārzot</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Raksti iesācējiem</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          Ja nav skaidrs, kas ir tās Mēness fāzes un kā tās izmantot dārzā — sāc šeit. Vienkārši,
          godīgi un Latvijas klimatam.
        </p>
      </header>

      {articles.length === 0 && (
        <Card tone="container" className="p-lg text-center text-body-md text-on-surface-variant">
          Raksti drīzumā.
        </Card>
      )}

      {cats.map((cat) => (
        <section key={cat} className="mb-lg">
          <h2 className="mb-sm text-headline-md text-on-surface">{cat}</h2>
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
            {articles.filter((a) => a.category === cat).map((a) => (
              <Link key={a.slug} href={`/raksti/${a.slug}`}>
                <Card tone="high" elevated className="flex h-full flex-col p-md transition-colors hover:bg-surface-container-highest">
                  <h3 className="text-headline-md text-on-surface">{a.title}</h3>
                  <p className="mt-1 flex-1 text-body-md text-on-surface-variant">{a.excerpt}</p>
                  <p className="mt-sm flex items-center gap-1 text-label-sm text-tertiary">
                    <Icon name="schedule" size="14px" /> {a.readMinutes} min lasīšana
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
