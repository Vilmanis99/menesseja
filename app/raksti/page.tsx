import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ArticleLibrary, type ArticleTeaser } from "@/components/article-library";
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
  const currentMonth = new Date().getMonth() + 1;
  const monthLabels = ["Janvārī", "Februārī", "Martā", "Aprīlī", "Maijā", "Jūnijā", "Jūlijā", "Augustā", "Septembrī", "Oktobrī", "Novembrī", "Decembrī"];
  const sorted = [...articles].sort((a, b) => {
    const seasonDifference = Number(b.seasonalMonths?.includes(currentMonth)) - Number(a.seasonalMonths?.includes(currentMonth));
    return seasonDifference || b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, "lv");
  });
  const teasers: ArticleTeaser[] = sorted.map(({ slug, title, excerpt, category, intent, readMinutes, updatedAt }) => ({ slug, title, excerpt, category, intent, readMinutes, updatedAt }));
  const featuredSlugs = sorted.filter((article) => article.seasonalMonths?.includes(currentMonth)).slice(0, 3).map((article) => article.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Raksti",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <div className="mx-auto max-w-5xl">
      <JsonLd data={jsonLd} />
      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Mācies dārzot</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Dārza padomi Latvijas apstākļiem</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          Īsas atbildes uz dārza problēmām, sezonas darbi un soli pa solim pamācības. Pārbaudīti avoti,
          skaidra latviešu valoda un ieteikumi Latvijas klimatam.
        </p>
      </header>

      <ArticleLibrary articles={teasers} featuredSlugs={featuredSlugs} monthLabel={monthLabels[currentMonth - 1]} />
    </div>
  );
}
