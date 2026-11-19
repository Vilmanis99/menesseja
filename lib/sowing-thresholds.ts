import type { Crop } from "@/lib/planting-crops";

/** Soil temperature guidelines for the outdoor activity in the crop calendar. */
export const SOIL_TEMP_MIN: Record<string, number> = {
  // Cool-season — sow as soon as ground thaws
  rediisi: 5,
  salati: 5,
  zirni: 5,
  spinati: 5,
  burkani: 5,
  petersili: 5,
  dilles: 5,
  // Slightly warmer
  bietes: 7,
  sipoli: 7,
  kaposti: 8,
  brokoli: 8,
  ziedkaposti: 8,
  kolrabji: 8,
  "kinas-kaposti": 8,
  kartupeli: 8,
  // Warm-season — wait for properly warm soil
  pupas: 10,
  metra: 8,
  timians: 8,
  tomati: 14,
  gurki: 15,
  kabaci: 12,
  kirbji: 12,
  baziliks: 12,
  paprika: 15,
  // Berries (planting, not sowing)
  zemenes: 8,
  avenes: 6,
  upenes: 6,
  janogas: 6,
  erkskogas: 6,
  rabarberi: 6,
  // Extra vegetables
  pastinaks: 5,
  kalji: 7,
  raceni: 5,
  puravi: 7,
  marrutki: 6,
  topinamburs: 7,
  laukapupas: 5,
  // Extra herbs
  koriandrs: 8,
  salvija: 12,
  melisa: 8,
  oregano: 10,
  // Flowers
  kalendula: 8,
  samtenes: 12,
  saulespukes: 10,
  nelkes: 10,
};

function soilThreshold(cropId: string) {
  const min = SOIL_TEMP_MIN[cropId];
  if (min === undefined) return undefined;
  // The Latvian cucumber guide specifies soil warmer than 15 °C at sowing depth.
  const exclusive = cropId === "gurki";
  const value = `${exclusive ? "virs" : "vismaz"} ${min} °C`;
  return { min, exclusive, value };
}

export function soilTemperatureFact(crop: Crop) {
  const threshold = soilThreshold(crop.id);
  if (!threshold) return undefined;
  const greenhouse = crop.id === "paprika";
  if (crop.sowOutdoors) {
    const label = crop.outdoorAction === "plant" ? "Augsne stādīšanai" : "Augsne tiešajai sējai";
    return { label, value: threshold.value, activity: "sowOutdoors" as const, greenhouse };
  }
  if (!crop.transplant) return undefined;
  const label = greenhouse ? "Augsne dēstu izstādīšanai siltumnīcā"
    : crop.sowIndoors ? "Augsne dēstu izstādīšanai laukā" : "Augsne stādīšanai";
  return { label, value: threshold.value, activity: "transplant" as const, greenhouse };
}

export interface SoilReadiness {
  min?: number;
  ready: boolean;
}

export function soilReadiness(cropId: string, soilC: number | undefined): SoilReadiness {
  const threshold = soilThreshold(cropId);
  const ready = threshold !== undefined && soilC !== undefined
    && (threshold.exclusive ? soilC > threshold.min : soilC >= threshold.min);
  return { min: threshold?.min, ready };
}
