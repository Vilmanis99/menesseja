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
