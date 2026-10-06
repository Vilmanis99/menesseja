import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ArticleLibrary, type ArticleTeaser } from "@/components/article-library";
import { getAllArticles } from "@/lib/articles";
import { canonical, SITE_NAME } from "@/lib/seo";
import { latviaDateParts } from "@/lib/day-anchor";
import { seasonalLinks } from "@/lib/seasonal";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Raksti — Mēness sēja un dārzkopība iesācējiem",
  description:
    "Dārza padomi visam gadam Latvijā: sēklu izvēle, dēsti, stādīšana, puķu kopšana, raža un pārziemošana. Izvēlies rakstus pēc mēneša un tēmas.",
  alternates: { canonical: canonical("/raksti") },
};

export default function RakstiIndex() {
  const articles = getAllArticles();
  const currentMonth = latviaDateParts().month;
  const seasonalSlugs = seasonalLinks(currentMonth).filter((l) => l.href.startsWith("/raksti/")).map((l) => l.href.slice("/raksti/".length));
  const monthLabels = ["Janvārī", "Februārī", "Martā", "Aprīlī", "Maijā", "Jūnijā", "Jūlijā", "Augustā", "Septembrī", "Oktobrī", "Novembrī", "Decembrī"];
  const sorted = [...articles].sort((a, b) => {
    const relevant = (article: typeof a) => seasonalSlugs.includes(article.slug) || !!article.seasonalMonths?.includes(currentMonth);
    const seasonDifference = Number(relevant(b)) - Number(relevant(a));
    return seasonDifference || b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, "lv");
  });
  const teasers: ArticleTeaser[] = sorted.map(({ slug, title, excerpt, category, intent, readMinutes, updatedAt, seasonalMonths }) => ({ slug, title, excerpt, category, intent, readMinutes, updatedAt, seasonalMonths }));
  const featuredSlugs = [...new Set([
    ...seasonalSlugs.filter((slug) => articles.some((article) => article.slug === slug)),
    ...sorted.filter((article) => article.seasonalMonths?.includes(currentMonth)).map((article) => article.slug),
  ])].slice(0, 3);

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
