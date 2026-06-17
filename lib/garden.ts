import { CROPS, ACTIVITY_KEYS, type Crop } from "@/lib/planting-crops";

export type LogType = "laistits" | "meslots" | "kaite" | "raza" | "piezime";

export interface LogEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  type: LogType;
  note?: string;
  /** For "raza" — harvested amount */
  amount?: number;
  unit?: "kg" | "gab";
}

export const LOG_META: Record<LogType, { label: string; icon: string }> = {
  laistits: { label: "Laistīts", icon: "water_drop" },
  meslots: { label: "Mēslots", icon: "compost" },
  kaite: { label: "Kaite", icon: "pest_control" },
  raza: { label: "Raža", icon: "agriculture" },
  piezime: { label: "Piezīme", icon: "edit_note" },
};

/** A plant the gardener is actually growing. */
export interface Plant {
  id: string; // unique instance id
  cropId: string; // → CROPS
  area: string; // e.g. "Siltumnīca", "Lielā dobe"
  /** ISO date the plant was sown/planted */
  sownAt: string;
  /** True for the demo plants seeded before the user adds their own */
  seed?: boolean;
  /** Care-log entries (watering, fertilising, harvest, notes) */
  log?: LogEntry[];
}

export const GARDEN_AREAS = ["Siltumnīca", "Lielā dobe", "Augļu dārzs", "Balkons"] as const;

export function cropById(cropId: string): Crop | undefined {
  return CROPS.find((c) => c.id === cropId);
}

/** Mid-point month of a crop's harvest window, for rough progress math. */
function harvestMonth(crop: Crop): number | undefined {
  const h = crop.harvest;
  return h ? (h[0] + h[1]) / 2 : undefined;
}

/** First month any activity begins (sow indoors / sow / transplant). */
function startMonth(crop: Crop): number | undefined {
  const months = ACTIVITY_KEYS.filter((k) => k !== "harvest")
    .map((k) => crop[k]?.[0])
    .filter((m): m is number => m !== undefined);
  return months.length ? Math.min(...months) : undefined;
}

/** Average days-to-harvest parsed from the crop's free-text field, if numeric. */
function daysToHarvest(crop: Crop): number | undefined {
  const nums = crop.daysToHarvest?.match(/\d+/g);
  if (!nums) return undefined; // "Daudzgadīga", "Ziemo", etc.
  const a = parseInt(nums[0], 10);
  const b = nums[1] ? parseInt(nums[1], 10) : a;
  return (a + b) / 2;
}

export interface PlantStatus {
  label: string;
  /** 0–100 progress toward harvest */
  progress: number;
  tone: "primary" | "secondary" | "outline";
}

/**
 * How a crop enters the garden — drives which lifecycle wording fits:
 *  - "flower"  : ornamental (pukes) → blooms, never "harvested"/"germinated"
 *  - "planted" : perennials, bulbs, shrubs, overwintering (berries, roses,
 *                garlic) → planted as an established plant, so it "iesakņojas",
 *                it does NOT "dīgst" (germinate) in your garden
 *  - "sown"    : annual veg/herbs raised from seed → "Dīgst" is accurate early on
 */
type CropKind = "flower" | "planted" | "sown";

function cropKind(crop: Crop, hasNumericDays: boolean): CropKind {
  if (crop.category === "pukes") return "flower";
  // A numeric days-to-harvest marks a seed-raised annual; its absence
  // ("Daudzgadīga", "Ziemo", "Zied…") marks something planted established.
  return hasNumericDays ? "sown" : "planted";
}

/**
 * Rough growth status from the crop calendar + how long it's been in the ground.
 * Good enough to drive the dashboard bars without per-crop day counts. Wording
 * matches the crop kind so a freshly-added rose reads "Iesakņojas" (taking root),
 * not "Dīgst" (germinating), and tops out at "Zied" rather than "Gatavs novākšanai".
 */
function label(progress: number, kind: CropKind): PlantStatus {
  if (kind === "flower") {
    if (progress >= 100) return { label: "Zied", progress: 100, tone: "secondary" };
    if (progress >= 80) return { label: "Gatavojas ziedēšanai", progress, tone: "secondary" };
    if (progress >= 40) return { label: "Aug", progress, tone: "primary" };
    return { label: "Iesakņojas", progress, tone: "outline" };
  }
  if (progress >= 100) return { label: "Gatavs novākšanai", progress: 100, tone: "secondary" };
  if (progress >= 80) return { label: "Gatavojas ražai", progress, tone: "secondary" };
  if (progress >= 40) return { label: "Aug", progress, tone: "primary" };
  return { label: kind === "planted" ? "Iesakņojas" : "Dīgst", progress, tone: "outline" };
}

export function plantStatus(plant: Plant, now: Date = new Date()): PlantStatus {
  const crop = cropById(plant.cropId);
  if (!crop) return { label: "—", progress: 0, tone: "outline" };

  // Preferred: real elapsed days since the gardener planted it ÷ days-to-harvest.
  const days = daysToHarvest(crop);
  const kind = cropKind(crop, days !== undefined);
  if (days) {
    const elapsed = (now.getTime() - new Date(plant.sownAt).getTime()) / 86400000;
    return label(Math.max(5, Math.min(100, Math.round((elapsed / days) * 100))), kind);
  }

  // Fallback for perennials / overwintering crops with no day count.
  // Modulo-12 arithmetic so windows that wrap the year work: garlic is planted
  // in Sep–Oct and harvested next Jul–Aug — "month > harvest" would call it
  // ready the day it went into the ground.
  const harvest = harvestMonth(crop);
  if (!harvest) return { label: "Aug", progress: 50, tone: "primary" };
  const month = now.getMonth() + 1;
  const sownDate = new Date(plant.sownAt);
  const sownMonth = isNaN(sownDate.getTime()) ? startMonth(crop) ?? month : sownDate.getMonth() + 1;
  const span = (Math.ceil(harvest) - sownMonth + 12) % 12 || 1;
  const elapsed = (month - sownMonth + 12) % 12;
  return label(Math.max(5, Math.min(100, Math.round((elapsed / span) * 100))), kind);
}
