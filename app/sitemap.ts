import type { MetadataRoute } from "next";
import { CROPS } from "@/lib/planting-crops";
import { getCropContent } from "@/lib/crop-content";
import { REGIONS } from "@/lib/regions";
import { getAllArticles } from "@/lib/articles";
import { topSlugs } from "@/lib/tops";
import { recipeSlugs } from "@/lib/recipes";
import { getAllFlowers } from "@/lib/flowers";
import { BLOOM_PERIODS } from "@/lib/bloom-periods";
import { getAllProblems } from "@/lib/kaitekli";
import { MONTH_SLUGS, calendarYears, SITE_URL } from "@/lib/seo";
import { MONTH_GUIDES } from "@/lib/month-guides";
import { SEASONAL_LINKS_UPDATED_AT } from "@/lib/seasonal";
import { CALENDAR_GUIDES_UPDATED_AT } from "@/lib/calendar-guides";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p}`;
  const articles = getAllArticles();
  const flowers = getAllFlowers();
  // lastModified is optional. Use a recorded content change where available.
  const articleIndexUpdated = articles.reduce(
    (latest, a) => (a.updatedAt > latest ? a.updatedAt : latest),
    SEASONAL_LINKS_UPDATED_AT,
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), priority: 1, changeFrequency: "daily" },
    { url: url("/augi"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/macies"), priority: 0.8, changeFrequency: "monthly" },
    { url: url("/kalendars"), priority: 0.7, changeFrequency: "daily" },
    { url: url("/darza-darbi-sonedel"), priority: 0.8, changeFrequency: "weekly" },
    { url: url("/celvedis"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/raksti"), lastModified: articleIndexUpdated, priority: 0.8, changeFrequency: "weekly" },
    { url: url("/topi"), priority: 0.8, changeFrequency: "weekly" },
    { url: url("/receptes"), priority: 0.8, changeFrequency: "monthly" },
    { url: url("/pukes"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/kaitekli"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/ko-set"), priority: 0.7, changeFrequency: "monthly" },
    { url: url("/par"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/privatums"), priority: 0.3, changeFrequency: "yearly" },
    { url: url("/iesutit"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/planotajs"), priority: 0.5, changeFrequency: "monthly" },
    { url: url("/kopiena"), priority: 0.5, changeFrequency: "weekly" },
    { url: url("/meness"), priority: 0.5, changeFrequency: "daily" },
    { url: url("/regioni"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/kalendars/istabas-augu-parstadisana"), priority: 0.7, changeFrequency: "daily" },
  ];

  const regionPages: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: url(`/regioni/${r.id}`),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: url(`/raksti/${article.slug}`),
    lastModified: new Date(article.updatedAt),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const koSetPages: MetadataRoute.Sitemap = MONTH_SLUGS.map((m, index) => {
    const guideUpdated = MONTH_GUIDES[index + 1]?.updatedAt;
    return {
      url: url(`/ko-set/${m}`),
      lastModified: guideUpdated && guideUpdated > SEASONAL_LINKS_UPDATED_AT ? guideUpdated : SEASONAL_LINKS_UPDATED_AT,
      priority: 0.7,
      changeFrequency: "monthly",
    };
  });

  const topPages: MetadataRoute.Sitemap = topSlugs().map((slug) => ({
    url: url(`/topi/${slug}`),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const recipePages: MetadataRoute.Sitemap = recipeSlugs().map((slug) => ({
    url: url(`/receptes/${slug}`),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const flowerPages: MetadataRoute.Sitemap = flowers.map((flower) => ({
    url: url(`/pukes/${flower.slug}`),
    lastModified: flower.updatedAt,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const bloomPeriodPages: MetadataRoute.Sitemap = BLOOM_PERIODS.map((period) => ({
    url: url(`/pukes/kas-zied/${period.slug}`),
    lastModified: new Date(period.updatedAt),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const problemPages: MetadataRoute.Sitemap = getAllProblems().map((problem) => ({
    url: url(`/kaitekli/${problem.slug}`),
    lastModified: problem.updatedAt,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  // Flowers with a /pukes content page redirect there from /augi — list only the canonical URL.
  const flowerSet = new Set(flowers.map((flower) => flower.slug));
  const cropPages: MetadataRoute.Sitemap = CROPS.filter((c) => !flowerSet.has(c.id)).map((c) => ({
    url: url(`/augi/${c.id}`),
    lastModified: getCropContent(c.id)?.updatedAt,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const years = calendarYears();
  const monthPages: MetadataRoute.Sitemap = years.flatMap((year) =>
    MONTH_SLUGS.map((m) => ({
      url: url(`/kalendars/${year}/${m}`),
      lastModified: new Date(CALENDAR_GUIDES_UPDATED_AT),
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
  );

  const yearPages: MetadataRoute.Sitemap = years.map((year) => ({
    url: url(`/kalendars/${year}`),
    lastModified: new Date(CALENDAR_GUIDES_UPDATED_AT),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...yearPages, ...regionPages, ...articlePages, ...koSetPages, ...topPages, ...recipePages, ...flowerPages, ...bloomPeriodPages, ...problemPages, ...cropPages, ...monthPages];
}
