import { ACTIVITY_KEYS, type ActivityKey, type Category, type Crop } from "./planting-crops";
import { latviaDateParts } from "./day-anchor";
import { normalizeArticleQuery } from "./article-search";
import { MONTH_SLUGS, monthFromSlug } from "./seo";

export const GUIDE_ACTIVITIES = [
  { id: "sowing", label: "Sēja un stādīšana" },
  { id: "harvest", label: "Ražas novākšana" },
  { id: "flowering", label: "Ziedēšana" },
  { id: "all", label: "Visas darbības" },
] as const;
export type GuideActivity = (typeof GUIDE_ACTIVITIES)[number]["id"];
export interface SowingFilters {
  month: number; // 0 = annual planning, 1–12 = a specific month
  activity: GuideActivity;
  category: Category | "all";
  query: string;
}

export function defaultSowingFilters(date = new Date()): SowingFilters {
  return { month: latviaDateParts(date).month, activity: "sowing", category: "all", query: "" };
}

const ACTIVITY_SLUGS: Record<GuideActivity, string> = {
  sowing: "seja", harvest: "raza", flowering: "ziedesana", all: "visas",
};

type GuidePeriod = Pick<SowingFilters, "month" | "activity">;

export function readSowingPeriod(params: Pick<URLSearchParams, "get">, date = new Date()): GuidePeriod {
  const slug = params.get("menesis");
  const month = slug === "viss-gads" ? 0 : monthFromSlug(slug ?? "") ?? latviaDateParts(date).month;
  const activity = GUIDE_ACTIVITIES.find(({ id }) => ACTIVITY_SLUGS[id] === params.get("darbiba"))?.id ?? "sowing";
  return { month, activity };
}

export function setSowingPeriod(params: URLSearchParams, period?: GuidePeriod) {
  if (period) {
    params.set("menesis", period.month === 0 ? "viss-gads" : MONTH_SLUGS[period.month - 1]);
  } else {
    params.delete("menesis");
  }
  if (period && period.activity !== "sowing") params.set("darbiba", ACTIVITY_SLUGS[period.activity]);
  else params.delete("darbiba");
}

export function sowingGuideHref(month: number, activity: GuideActivity = "sowing"): string {
  const params = new URLSearchParams();
  setSowingPeriod(params, { month, activity });
  return `/celvedis?${params}`;
}

/** Harvest/bloom windows must never make a crop eligible for sowing. */
export function guideActivities(crop: Crop, month: number, activity: GuideActivity): ActivityKey[] {
  if (!Number.isInteger(month) || month < 0 || month > 12) return [];
  return ACTIVITY_KEYS.filter((key) => {
    const range = crop[key];
    if (!range || (month !== 0 && (month < range[0] || month > range[1]))) return false;
    if (activity === "sowing") return key !== "harvest";
    if (activity === "harvest") return key === "harvest" && crop.category !== "pukes";
    if (activity === "flowering") return key === "harvest" && crop.category === "pukes";
    return true;
  });
}

export function matchesSowingCrop(crop: Crop, filters: SowingFilters): boolean {
  if (filters.category !== "all" && filters.category !== crop.category) return false;
  const text = normalizeArticleQuery([crop.name, ...(crop.aliases ?? [])].join(" "));
  const terms = normalizeArticleQuery(filters.query).split(" ").filter(Boolean);
  return terms.every((term) => text.includes(term)) && guideActivities(crop, filters.month, filters.activity).length > 0;
}
