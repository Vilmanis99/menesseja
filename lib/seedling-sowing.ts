import { latviaDateParts } from "./day-anchor";

export const SEEDLING_CALCULATOR_HREF = "/raksti/kad-set-destus-rekini-atpakal#sejas-kalkulators";

/** Next occurrence of the article's example date in the Latvian calendar. */
export function exampleTransplantDate(now = new Date()): string {
  const { year, month, day } = latviaDateParts(now);
  const nextYear = month > 6 || (month === 6 && day > 1);
  return `${nextYear ? year + 1 : year}-06-01`;
}

interface DurationRange {
  min: string;
  max: string;
}

type SowingWindow = { earliest: Date; latest: Date } | { error: string };

function readRange(range: DurationRange, limit: number) {
  if (![range.min, range.max].every((value) => /^\d+$/.test(value))) return null;
  const min = Number(range.min);
  const max = Number(range.max);
  return min >= 1 && min <= max && max <= limit ? { min, max } : null;
}

/** All offsets are whole calendar days. Supply germination days only for ages counted from emergence. */
export function seedlingSowingWindow(transplant: string, growingWeeks: DurationRange, germinationDays?: DurationRange): SowingWindow {
  if (!/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(transplant)) return { error: "Ievadi izstādīšanas datumu ar četrciparu gadu." };
  const date = new Date(`${transplant}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== transplant) {
    return { error: "Pārbaudi izstādīšanas datumu. Šādas dienas kalendārā nav." };
  }

  const weeks = readRange(growingWeeks, 52);
  if (!weeks) return { error: "Ievadi nedēļu skaitu no 1 līdz 52. Lielākajai vērtībai jābūt vismaz tikpat lielai kā mazākajai." };
  const days = germinationDays ? readRange(germinationDays, 365) : { min: 0, max: 0 };
  if (!days) return { error: "Ievadi dīgšanas dienu skaitu no 1 līdz 365, sākot ar mazāko vērtību." };

  const earliest = new Date(date);
  const latest = new Date(date);
  earliest.setUTCDate(date.getUTCDate() - weeks.max * 7 - days.max);
  latest.setUTCDate(date.getUTCDate() - weeks.min * 7 - days.min);
  if (earliest.getUTCFullYear() < 1) return { error: "Izvēlies vēlāku izstādīšanas datumu." };
  return { earliest, latest };
}

export const SEEDLING_PLAN_NAME_MAX = 80;
const planHashPrefix = "#sejas-kalkulators?";

export interface SeedlingPlan {
  transplant: string;
  fromEmergence: boolean;
  weeks: DurationRange;
  days: DurationRange;
  name: string;
}

function planName(value: string): string {
  return Array.from(value.replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").trim()).slice(0, SEEDLING_PLAN_NAME_MAX).join("");
}

/** A saved calculation stays on the original article. Its values are carried in the URL fragment. */
export function seedlingPlanHash(plan: SeedlingPlan): string {
  const range = seedlingSowingWindow(plan.transplant, plan.weeks, plan.fromEmergence ? plan.days : undefined);
  if ("error" in range) throw new RangeError(range.error);
  const params = new URLSearchParams({
    datums: plan.transplant,
    nedelas: Number(plan.weeks.min) + "-" + Number(plan.weeks.max),
  });
  if (plan.fromEmergence) params.set("digsana", Number(plan.days.min) + "-" + Number(plan.days.max));
  const name = planName(plan.name);
  if (name) params.set("augs", name);
  return planHashPrefix + params.toString();
}

function savedRange(value: string | null): DurationRange | null {
  const match = /^(\d{1,3})-(\d{1,3})$/.exec(value ?? "");
  return match ? { min: match[1], max: match[2] } : null;
}

export function readSeedlingPlanHash(hash: string): SeedlingPlan | null {
  if (!hash.startsWith(planHashPrefix) || hash.length > 1800) return null;
  const params = new URLSearchParams(hash.slice(planHashPrefix.length));
  if (["datums", "nedelas", "digsana", "augs"].some((key) => params.getAll(key).length > 1)) return null;

  const transplant = params.get("datums") ?? "";
  const weeks = savedRange(params.get("nedelas"));
  const fromEmergence = params.has("digsana");
  const days = fromEmergence ? savedRange(params.get("digsana")) : { min: "", max: "" };
  if (!weeks || !days) return null;
  const range = seedlingSowingWindow(transplant, weeks, fromEmergence ? days : undefined);
  if ("error" in range) return null;
  return { transplant, weeks, fromEmergence, days, name: planName(params.get("augs") ?? "") };
}
