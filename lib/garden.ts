import { CROPS, MONTHS_LV_FULL, type Crop } from "./planting-crops";
import { latviaDateKey } from "./day-anchor";

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
  cultivar?: string | null;
  /** Older clients stored the day a plant was added without recording the action. */
  sownAt?: string | null;
  sownOn?: string | null;
  plantedOn?: string | null;
  /** True for the demo plants seeded before the user adds their own */
  seed?: boolean;
  /** Care-log entries (watering, fertilising, harvest, notes) */
  log?: LogEntry[];
}

export const GARDEN_AREAS = ["Siltumnīca", "Lielā dobe", "Augļu dārzs", "Balkons", "Palodze"] as const;

export const CULTIVAR_MAX_LENGTH = 100;

/** Keep an optional packet or plant label intact, including accents and F1. */
export function normalizeCultivar(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim();
  return name && name.length <= CULTIVAR_MAX_LENGTH ? name : null;
}

export class CultivarConflictError extends Error {
  constructor() { super("Stādījums ir mainīts citā cilnē vai ierīcē. Atver dārzu no jauna un pārbaudi šķirni."); }
}

export function cropById(cropId: string): Crop | undefined {
  return CROPS.find((c) => c.id === cropId);
}

export type GardenAction = "sown" | "planted";
export type PlantStart = { action: GardenAction; date: string } | { action: "unknown" };

export function gardenStartActions(crop: Crop): GardenAction[] {
  const actions: GardenAction[] = [];
  if (crop.sowIndoors || (crop.sowOutdoors && crop.outdoorAction !== "plant")) actions.push("sown");
  if (crop.transplant || crop.outdoorAction === "plant") actions.push("planted");
  return actions;
}

export function isGardenDate(value: unknown, today = latviaDateKey()): value is string {
  if (typeof value !== "string" || !/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(value) || value > today) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function harvestAmountError(input: string, unit: NonNullable<LogEntry["unit"]>): string | null {
  if (input === "") return null;
  const value = Number(input);
  if (!Number.isFinite(value) || value <= 0) return "Ievadi pozitīvu daudzumu vai atstāj lauku tukšu.";
  if (unit === "gab" && !Number.isSafeInteger(value)) return "Gabalu skaitam jābūt veselam skaitlim.";
  return null;
}

export function harvestDateError(plant: Pick<Plant, "sownOn">, date: string, today = latviaDateKey()): string | null {
  if (!isGardenDate(date, today)) return "Norādi ražas datumu līdz šodienai ieskaitot.";
  if (isGardenDate(plant.sownOn, today) && date < plant.sownOn) return "Ražas datums nevar būt pirms šā auga sējas.";
  return null;
}

export function plantDateError(plant: Pick<Plant, "sownOn" | "plantedOn" | "log">, action: GardenAction, date: string, today = latviaDateKey()): string | null {
  if (!isGardenDate(date, today)) return "Norādi īstu datumu līdz šodienai.";
  if (action === "sown" && isGardenDate(plant.plantedOn, today) && date > plant.plantedOn) {
    return "Sējas datumam jābūt pirms izstādīšanas vai tajā pašā dienā.";
  }
  if (action === "sown" && plant.log?.some((entry) => entry.type === "raza" && isGardenDate(entry.date, today) && entry.date < date)) {
    return "Sējas datums nevar būt pēc jau pierakstītas šā auga ražas.";
  }
  if (action === "planted" && isGardenDate(plant.sownOn, today) && date < plant.sownOn) {
    return "Izstādīšanas datumam jābūt sējas dienā vai vēlāk.";
  }
  return null;
}

const DAY_MS = 86400000;
const harvestDates = new Intl.DateTimeFormat("lv-LV", { dateStyle: "long", timeZone: "UTC" });

/** Only an explicitly recorded event with a documented duration gives a personal harvest interval. */
export function gardenHarvestWindow(plant: Plant, now = new Date()) {
  const crop = cropById(plant.cropId);
  const timing = crop?.harvestTiming;
  if (!timing) return null;
  const from = timing.from === "sown" ? plant.sownOn : plant.plantedOn;
  const today = latviaDateKey(now);
  if (!from || plantDateError(plant, timing.from, from, today)) return null;
  const start = Date.parse(from);
  return {
    start,
    earliest: new Date(start + timing.minDays * DAY_MS),
    latest: new Date(start + timing.maxDays * DAY_MS),
  };
}

export function harvestEstimate(plant: Plant, now = new Date()): string {
  const crop = cropById(plant.cropId);
  const window = gardenHarvestWindow(plant, now);
  if (window) {
    const range = harvestDates.formatRange(window.earliest, window.latest);
    return crop?.harvestTiming?.stage ? range + " (" + crop.harvestTiming.stage + ")" : range;
  }
  if (!crop?.harvest) return "Laiks atkarīgs no šķirnes";
  const [first, last] = crop.harvest;
  const season = first === last ? MONTHS_LV_FULL[first - 1] : MONTHS_LV_FULL[first - 1] + "–" + MONTHS_LV_FULL[last - 1];
  return "Parastais periods — " + season;
}

export interface PlantStatus {
  label: string;
  /** Elapsed share of the time to the earliest expected harvest, when known. */
  progress: number | null;
  tone: "primary" | "secondary" | "outline";
}

export function plantStatus(plant: Plant, now = new Date()): PlantStatus {
  const today = latviaDateKey(now);
  const window = gardenHarvestWindow(plant, now);
  if (!window) {
    const recorded = isGardenDate(plant.plantedOn, today) ? "Stādīšana reģistrēta"
      : isGardenDate(plant.sownOn, today) ? "Sēja reģistrēta" : "Sākuma datums nav zināms";
    return { label: recorded, progress: null, tone: "outline" };
  }

  const current = Date.parse(today);
  if (current > window.latest.getTime()) return { label: "Paredzētais ražas periods pagājis", progress: null, tone: "outline" };
  if (current >= window.earliest.getTime()) return { label: "Pārbaudi ražas gatavību", progress: 100, tone: "secondary" };
  const progress = Math.floor(100 * (current - window.start) / (window.earliest.getTime() - window.start));
  return { label: "Līdz paredzamajai ražai", progress, tone: "primary" };
}
