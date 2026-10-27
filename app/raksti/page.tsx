import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ArticleLibrary, type ArticleTeaser } from "@/components/article-library";
import { getAllArticles } from "@/lib/articles";
import { canonical, SITE_NAME, MONTH_SLUGS } from "@/lib/seo";
import { latviaDateParts } from "@/lib/day-anchor";
import { seasonalLinks, monthCalendarHref } from "@/lib/seasonal";
import { KnowledgeHub } from "@/components/knowledge-hub";
import { contentImage } from "@/lib/content-images";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Dārza zināšanu krātuve — padomi, gada plāns un pavasara darbi",
  description:
    "Dārza padomi visam gadam Latvijā: sēklu izvēle, dēsti, stādīšana, puķu kopšana, raža un pārziemošana. Izvēlies rakstus pēc mēneša un tēmas.",
  alternates: { canonical: canonical("/raksti") },
};

export default function RakstiIndex() {
  const articles = getAllArticles();
  const now = new Date();
  const currentMonth = latviaDateParts(now).month;
  // Resolve on the server so the hub and client-side filters share Riga's year.
  const monthGuideLinks = MONTH_SLUGS.map((slug, index) => {
    const calendarHref = monthCalendarHref(index + 1, now);
    return calendarHref === "/kalendars" ? `/ko-set/${slug}` : `${calendarHref}#menesa-darbi`;
  });
  const seasonalSlugs = seasonalLinks(currentMonth).filter((l) => l.href.startsWith("/raksti/")).map((l) => l.href.slice("/raksti/".length));
  const monthLabels = ["Janvārī", "Februārī", "Martā", "Aprīlī", "Maijā", "Jūnijā", "Jūlijā", "Augustā", "Septembrī", "Oktobrī", "Novembrī", "Decembrī"];
  const sorted = [...articles].sort((a, b) => {
    const relevant = (article: typeof a) => seasonalSlugs.includes(article.slug) || !!article.seasonalMonths?.includes(currentMonth);
    const seasonDifference = Number(relevant(b)) - Number(relevant(a));
    return seasonDifference || b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, "lv");
  });
  const teasers: ArticleTeaser[] = sorted.map(({ slug, title, excerpt, category, intent, readMinutes, updatedAt, seasonalMonths, primaryQuery, aliases, body }) => {
    const imageUse = body.find((section) => section.image)?.image;
    const asset = imageUse ? contentImage(imageUse.id) : undefined;
    return {
      slug, title, excerpt, category, intent, readMinutes, updatedAt, seasonalMonths,
      searchTerms: [primaryQuery, ...(aliases ?? [])],
      ...(asset && imageUse ? {
        photo: {
          src: asset.src, width: asset.width, height: asset.height, alt: asset.alt,
          author: asset.author, sourceName: asset.sourceName, sourceUrl: asset.sourceUrl,
          license: asset.license, licenseUrl: asset.licenseUrl, changes: asset.changes,
          caption: imageUse.caption,
        },
      } : {}),
    };
  });
  const featuredSlugs = [...new Set([
    ...seasonalSlugs.filter((slug) => articles.some((article) => article.slug === slug)),
    ...sorted.filter((article) => article.seasonalMonths?.includes(currentMonth)).map((article) => article.slug),
  ])].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dārza zināšanu krātuve",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <div className="mx-auto max-w-5xl">
      <JsonLd data={jsonLd} />
      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Mācies dārzot</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Dārza zināšanu krātuve</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          Atrodi padomu par savu augu, atrisini kopšanas problēmu vai izvēlies darbus katram mēnesim Latvijas dārzā.
        </p>
      </header>

      <ArticleLibrary articles={teasers} featuredSlugs={featuredSlugs} monthLabel={monthLabels[currentMonth - 1]} monthGuideLinks={monthGuideLinks}>
        <KnowledgeHub currentMonth={currentMonth} monthGuideLinks={monthGuideLinks} />
      </ArticleLibrary>
    </div>
  );
}
