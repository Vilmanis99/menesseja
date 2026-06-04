import type { MetadataRoute } from "next";
import { CROPS } from "@/lib/planting-crops";
import { REGIONS } from "@/lib/regions";
import { articleSlugs } from "@/lib/articles";
import { topSlugs } from "@/lib/tops";
import { recipeSlugs } from "@/lib/recipes";
import { flowerSlugs } from "@/lib/flowers";
import { problemSlugs } from "@/lib/kaitekli";
import { MONTH_SLUGS, CALENDAR_YEARS, SITE_URL } from "@/lib/seo";
import { DATA_REVIEWED } from "@/lib/sources";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p}`;
  const reviewed = new Date(`${DATA_REVIEWED}-01`);

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), priority: 1, changeFrequency: "daily" },
    { url: url("/augi"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/macies"), priority: 0.8, changeFrequency: "monthly" },
    { url: url("/kalendars"), priority: 0.7, changeFrequency: "daily" },
    { url: url("/celvedis"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/raksti"), priority: 0.8, changeFrequency: "weekly" },
    { url: url("/topi"), priority: 0.8, changeFrequency: "weekly" },
    { url: url("/receptes"), priority: 0.8, changeFrequency: "monthly" },
    { url: url("/pukes"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/kaitekli"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/ko-set"), priority: 0.7, changeFrequency: "monthly" },
    { url: url("/par"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/iesutit"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/planotajs"), priority: 0.5, changeFrequency: "monthly" },
    { url: url("/meness"), priority: 0.5, changeFrequency: "daily" },
    { url: url("/regioni"), priority: 0.6, changeFrequency: "monthly" },
  ];

  const regionPages: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: url(`/regioni/${r.id}`),
    lastModified: reviewed,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const articlePages: MetadataRoute.Sitemap = articleSlugs().map((slug) => ({
    url: url(`/raksti/${slug}`),
    lastModified: reviewed,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const koSetPages: MetadataRoute.Sitemap = MONTH_SLUGS.map((m) => ({
    url: url(`/ko-set/${m}`),
    lastModified: reviewed,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const topPages: MetadataRoute.Sitemap = topSlugs().map((slug) => ({
    url: url(`/topi/${slug}`),
    lastModified: reviewed,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const recipePages: MetadataRoute.Sitemap = recipeSlugs().map((slug) => ({
    url: url(`/receptes/${slug}`),
    lastModified: reviewed,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const flowerPages: MetadataRoute.Sitemap = flowerSlugs().map((slug) => ({
    url: url(`/pukes/${slug}`),
    lastModified: reviewed,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const problemPages: MetadataRoute.Sitemap = problemSlugs().map((slug) => ({
    url: url(`/kaitekli/${slug}`),
    lastModified: reviewed,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const cropPages: MetadataRoute.Sitemap = CROPS.map((c) => ({
    url: url(`/augi/${c.id}`),
    lastModified: reviewed,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const monthPages: MetadataRoute.Sitemap = CALENDAR_YEARS.flatMap((year) =>
    MONTH_SLUGS.map((m) => ({
      url: url(`/kalendars/${year}/${m}`),
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
  );

  return [...staticPages, ...regionPages, ...articlePages, ...koSetPages, ...topPages, ...recipePages, ...flowerPages, ...problemPages, ...cropPages, ...monthPages];
}
