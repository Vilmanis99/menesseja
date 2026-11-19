import { cropById, isGardenDate, type Plant } from "./garden";
import { latviaDateKey } from "./day-anchor";

/**
 * Crops worth re-sowing on an interval for a continuous harvest, and the gap
 * (in weeks) between sowings. Mirrors the "sēj atkārtoti" notes in the crop data.
 */
export const SUCCESSION: Record<string, number> = {
  rediisi: 2,
  salati: 2,
  dilles: 2,
  spinati: 3,
  bietes: 3,
  raceni: 3,
  koriandrs: 3,
  zirni: 3,
  burkani: 4,
};

export function isSuccession(cropId: string): boolean {
  return cropId in SUCCESSION;
}

export interface NextSowing {
  date: Date;
  weeks: number;
  /** Still inside the crop's outdoor/indoor sow window for that month */
  inWindow: boolean;
}

/** When to sow the next batch of a succession crop, or null if not applicable.
 *  Rolls forward past missed dates, so the rhythm keeps suggesting all season
 *  (not only the first batch after the original sowing). */
export function nextSowing(plant: Plant, now: Date = new Date()): NextSowing | null {
  const weeks = SUCCESSION[plant.cropId];
  if (!weeks) return null;
  const crop = cropById(plant.cropId);
  if (!crop) return null;

  const today = latviaDateKey(now);
  if (!isGardenDate(plant.sownOn, today)) return null;
  const base = Date.parse(plant.sownOn);
  const interval = weeks * 7 * 86400000;
  const first = base + interval;
  const oldestUseful = Date.parse(today) - 2 * 86400000;
  const missed = Math.max(0, Math.ceil((oldestUseful - first) / interval));
  const date = new Date(first + missed * interval);

  const m = date.getUTCMonth() + 1;
  const sow = crop.sowOutdoors ?? crop.sowIndoors;
  const inWindow = !!sow && m >= sow[0] && m <= sow[1];

  return { date, weeks, inWindow };
}
