import { MONTH_PLANS } from "./month-plan";
import { latviaDateParts } from "./day-anchor";
import type { ContentImage } from "./content-images";

/** Canonical site origin (override via NEXT_PUBLIC_SITE_URL when deploying). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.menesseja.lv").replace(/\/$/, "");
export const SITE_NAME = "Mēness Sēja";

/** ASCII-safe month slugs (URL-friendly) ↔ month number 1–12. */
export const MONTH_SLUGS = [
  "janvaris", "februaris", "marts", "aprilis", "maijs", "junijs",
  "julijs", "augusts", "septembris", "oktobris", "novembris", "decembris",
] as const;

export function monthFromSlug(slug: string): number | null {
  const i = MONTH_SLUGS.indexOf(slug as (typeof MONTH_SLUGS)[number]);
  return i === -1 ? null : i + 1;
}

/** Locative month forms ("maijā") for "ko sēt {month}ā" phrasing (index 0 = Jan). */
export const MONTHS_LV_LOCATIVE = [
  "janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā",
  "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī",
];

/** Keep published archives and offer one full planning year ahead in Latvia. */
export function calendarYears(asOf = new Date()): number[] {
  const firstYear = 2025;
  const lastYear = latviaDateParts(asOf).year + 1;
  return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index);
}

export function calendarYearFromSlug(slug: string, asOf = new Date()): number | null {
  const year = Number(slug);
  return String(year) === slug && calendarYears(asOf).includes(year) ? year : null;
}

/** Per-month seasonal tasks + folklore (index 0 = January) — unique editorial
 *  copy so month pages aren't pure templates. */
export const MONTH_TIPS = MONTH_PLANS.map((plan) => plan.action);

export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Complete Open Graph block for a page — own title/description + absolute url +
 *  the site OG image (otherwise pages that define their own `openGraph` ship a
 *  null og:image and a generic/duplicate social card). Twitter inherits the image. */
export function og(opts: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string | Pick<ContentImage, "src" | "alt" | "width" | "height">;
}) {
  const photo = opts.image;
  const image = typeof photo === "object"
    ? { url: canonical(photo.src), alt: photo.alt, width: photo.width, height: photo.height }
    : canonical(photo ?? "/opengraph-image");
  return {
    title: opts.title,
    description: opts.description,
    url: canonical(opts.path),
    siteName: SITE_NAME,
    locale: "lv_LV",
    type: opts.type ?? "article",
    images: [image],
  };
}
