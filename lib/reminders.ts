import { CROPS, MONTHS_LV_FULL, type Crop } from "@/lib/planting-crops";
import { sowingDay, PART_GENITIVE } from "@/lib/biodynamic";
import { cropPart } from "@/lib/crop-part";
import { soilReadiness } from "@/lib/sowing-thresholds";
import { nextSowing } from "@/lib/succession";
import { cropById, plantStatus, type Plant } from "@/lib/garden";
import type { Region } from "@/lib/regions";
import type { Weather } from "@/lib/weather";

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
  const month = date.getMonth() + 1;
  const sow = sowingDay(date);
  const out: Reminder[] = [];

  // 1) Frost tonight — most urgent
  if (weather && weather.minTonightC < 1) {
    out.push({
      id: "frost",
      icon: "ac_unit",
      tone: "secondary",
      title: "Salnas brīdinājums",
      meta: `Naktī ${Math.round(weather.minTonightC)}°C • apsedz jutīgos stādus`,
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
    const ageDays = (date.getTime() - new Date(plant.sownAt).getTime()) / 86400000;
    const grown = plantStatus(plant, date).progress >= 80;
    if (inMonth(crop.harvest, month) && grown) {
      // Ornamental crops bloom; they aren't "harvested".
      const isFlower = crop.category === "pukes";
      out.push({
        id: `harvest-${plant.id}`,
        icon: isFlower ? "local_florist" : "agriculture",
        tone: "primary",
        title: isFlower ? `Ziedēšanas laiks — ${crop.name}` : `Laiks novākt — ${crop.name}`,
        meta: isFlower ? `${plant.area} • ${MONTHS_LV_FULL[month - 1]}` : `${plant.area} • raža ${MONTHS_LV_FULL[month - 1]}`,
      });
    } else if (inMonth(crop.transplant, month) && ageDays >= 21) {
      out.push({
        id: `transplant-${plant.id}`,
        icon: "yard",
        tone: "primary",
        title: `Laiks stādīt laukā — ${crop.name}`,
        meta: `${plant.area} • īstais laiks`,
      });
    }
    // Succession: time to sow the next batch for a continuous harvest
    const succ = nextSowing(plant, date);
    if (succ && succ.inWindow && succ.date.getTime() <= date.getTime() + 3 * 86400000) {
      out.push({
        id: `succ-${plant.id}`,
        icon: "restart_alt",
        tone: "primary",
        title: `Laiks sēt nākamo partiju — ${crop.name}`,
        meta: `${plant.area} • atkārtotā sēja nepārtrauktai ražai`,
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
    const canSow = inMonth(candidate.sowOutdoors, month) || inMonth(candidate.sowIndoors, month);
    const ready = soilReadiness(candidate.id, weather?.soilC);
    const soilNote =
      weather && ready.min !== undefined
        ? ready.ready
          ? `augsne ${Math.round(weather.soilC)}° ✓`
          : `gaidi siltāku augsni (≥${ready.min}°)`
        : "labvēlīga zīme";
    out.push({
      id: "element-day",
      icon: sow.element === "udens" ? "water_drop" : sow.element === "zeme" ? "spa" : "eco",
      tone: "primary",
      title: `${PART_GENITIVE[sow.part]} diena — ${canSow ? "sēj" : "stādi"} ${candidate.name.toLowerCase()}`,
      meta: `${sow.sign.symbol} ${sow.sign.name} • ${soilNote}`,
    });
  }

  // 4) Generic soil-ready nudge if nothing else fired
  if (out.length === 0 && weather) {
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
