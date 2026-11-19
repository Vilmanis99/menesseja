import { latviaDateKey } from "./day-anchor";
import { CROPS, accusative, type Crop } from "./planting-crops";
import { sowingDay, PART_GENITIVE } from "./biodynamic";
import { cropPart } from "./crop-part";
import { soilReadiness, soilTemperatureFact } from "./sowing-thresholds";
import { nextSowing } from "./succession";
import { cropById, gardenHarvestWindow, isGardenDate, type Plant } from "./garden";
import type { Region } from "./regions";
import type { Weather } from "./weather";

export interface Reminder {
  id: string;
  icon: string;
  tone: "primary" | "secondary";
  title: string;
  meta: string;
}

function inMonth(range: [number, number] | undefined, month: number): boolean {
  return !!range && month >= range[0] && month <= range[1];
}

/** Whole days from `date` until the given {month,day} this year (negative if past). */
function daysUntil(target: { month: number; day: number }, date: Date): number {
  const t = new Date(date.getFullYear(), target.month - 1, target.day);
  return Math.round((t.getTime() - date.getTime()) / 86400000);
}

interface Inputs {
  plants: Plant[];
  region: Region;
  weather: Weather | null;
  date?: Date;
}

/**
 * Today's garden tasks, assembled from: tonight's frost risk, the Moon's
 * element-day, soil-temperature readiness, and each plant's calendar window.
 * Ordered by urgency, capped so the dashboard stays scannable on mobile.
 */
export function buildReminders({ plants, region, weather, date = new Date() }: Inputs): Reminder[] {
  const today = latviaDateKey(date);
  const currentDay = Date.parse(today);
  const month = Number(today.slice(5, 7));
  const sow = sowingDay(date);
  const out: Reminder[] = [];

  // 1) Frost tonight — most urgent
  if (typeof weather?.minTonightC === "number" && Number.isFinite(weather.minTonightC) && weather.minTonightC < 1) {
    out.push({
      id: "frost",
      icon: "ac_unit",
      tone: "secondary",
      title: "Salnas brīdinājums",
      meta: `Tuvāko 18 stundu prognozē līdz ${weather.minTonightC.toLocaleString("lv-LV")} °C • apsedz jutīgos stādus`,
    });
  }

  // 1b) Climatological last-frost advisory — don't rush tender crops before it
  const daysToFrost = daysUntil(region.lastFrostDate, date);
  if (daysToFrost > 0 && daysToFrost <= 35 && (month === 4 || month === 5)) {
    out.push({
      id: "lastfrost",
      icon: "severe_cold",
      tone: "secondary",
      title: `Siltummīļus vēl nesteidzies (${region.name})`,
      meta: `Vidējā pēdējā salna ~${region.lastFrost} • tomāti, gurķi, paprika laukā tikai pēc tās`,
    });
  }

  // 2) A plant is ready to harvest or transplant this month.
  // Both checks respect WHEN this plant was actually sown — the crop's generic
  // window alone would say "harvest the lettuce" on the day it was sown.
  for (const plant of plants) {
    const crop = cropById(plant.cropId);
    if (!crop) continue;
    const area = plant.cultivar ? `${plant.area} · ${plant.cultivar}` : plant.area;
    const window = gardenHarvestWindow(plant, date);
    if (window && currentDay >= window.earliest.getTime() && currentDay <= window.latest.getTime()) {
      out.push({
        id: `harvest-${plant.id}`,
        icon: "agriculture",
        tone: "primary",
        title: `Pārbaudi ražas gatavību — ${crop.name}`,
        meta: `${area} • aptuvenais ražas periods pēc ierakstītā datuma`,
      });
    } else if (crop.sowIndoors && !crop.sowOutdoors && inMonth(crop.transplant, month) && !plant.plantedOn &&
      isGardenDate(plant.sownOn, today) && currentDay - Date.parse(plant.sownOn) >= 21 * 86400000) {
      const soil = soilTemperatureFact(crop);
      const condition = soil?.activity === "transplant"
        ? `${soil.label} — ${soil.value}`
        : "ņem vērā stādu gatavību un vietējo salnu prognozi";
      out.push({
        id: `transplant-${plant.id}`,
        icon: "yard",
        tone: "primary",
        title: `Pārbaudi, vai vari stādīt ${accusative(crop.name).toLowerCase()}`,
        meta: `${area} • ${condition}`,
      });
    }
    // Succession: time to sow the next batch for a continuous harvest
    const succ = nextSowing(plant, date);
    if (succ && succ.inWindow && succ.date.getTime() <= date.getTime() + 3 * 86400000) {
      out.push({
        id: `succ-${plant.id}`,
        icon: "restart_alt",
        tone: "primary",
        title: `Laiks atkārtoti sēt — ${accusative(crop.name)}`,
        meta: `${area} • atkārtotā sēja nepārtrauktai ražai`,
      });
    }
  }

  // 3) Today's Moon element-day → suggest a fitting in-season crop.
  // The verb must match the window that's actually open: "sēj" only when a sow
  // window is open, otherwise "stādi" (e.g. strawberries in August).
  const candidate: Crop | undefined = CROPS.find(
    (c) =>
      cropPart(c.id) === sow.part &&
      (inMonth(c.sowOutdoors, month) || inMonth(c.sowIndoors, month) || inMonth(c.transplant, month)),
  );
  if (candidate) {
    const activity = inMonth(candidate.sowOutdoors, month) ? "sowOutdoors"
      : inMonth(candidate.sowIndoors, month) ? "sowIndoors" : "transplant";
    const action = activity === "sowIndoors" ? "sēj telpās"
      : activity === "sowOutdoors" && candidate.outdoorAction !== "plant" ? "plāno sēt laukā" : "plāno stādīt";
    const soil = soilTemperatureFact(candidate);
    let soilNote = "labvēlīga zīme";
    if (soil?.activity === activity) {
      soilNote = `${soil.label} — ${soil.value}`;
      if (!soil.greenhouse && typeof weather?.soilC === "number" && Number.isFinite(weather.soilC)) {
        const estimate = weather.soilC.toLocaleString("lv-LV");
        const ready = soilReadiness(candidate.id, weather.soilC).ready;
        const checkInBed = activity === "sowOutdoors" && candidate.outdoorAction !== "plant"
          ? "pārbaudi sējas dziļumā" : "pārbaudi dobē";
        soilNote += ` • 6 cm dziļumā prognozēti ${estimate} °C, ${ready ? checkInBed : "nogaidi"}`;
      }
    }
    out.push({
      id: "element-day",
      icon: sow.element === "udens" ? "water_drop" : sow.element === "zeme" ? "spa" : "eco",
      tone: "primary",
      title: `${PART_GENITIVE[sow.part]} diena — ${action} ${accusative(candidate.name).toLowerCase()}`,
      meta: `${sow.sign.symbol} ${sow.sign.name} • ${soilNote}`,
    });
  }

  // 4) Generic soil-ready nudge if nothing else fired
  if (out.length === 0 && typeof weather?.soilC === "number" && Number.isFinite(weather.soilC)) {
    out.push({
      id: "soil",
      icon: "thermostat",
      tone: "primary",
      title: `Augsnes temperatūra ${Math.round(weather.soilC)}°C`,
      meta: `${region.name} • seko līdzi sējas logiem`,
    });
  }

  return out.slice(0, 4);
}
