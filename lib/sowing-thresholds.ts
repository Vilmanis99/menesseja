/**
 * Minimum soil temperature (°C at ~6 cm) for reliable germination / planting,
 * keyed by crop id from lib/planting-crops.ts. Used with live soil data to tell
 * the gardener whether the ground is warm enough to sow.
 */
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
  kiploki: 7,
  kaposti: 8,
  brokoli: 8,
  kartupeli: 8,
  // Warm-season — wait for properly warm soil
  pupas: 10,
  metra: 8,
  timians: 8,
  tomati: 12,
  gurki: 14,
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
  selerijas: 10,
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

export interface SoilReadiness {
  /** Threshold for this crop, or undefined if unknown */
  min?: number;
  /** True when soilC ≥ threshold */
  ready: boolean;
}

export function soilReadiness(cropId: string, soilC: number | undefined): SoilReadiness {
  const min = SOIL_TEMP_MIN[cropId];
  if (min === undefined || soilC === undefined) return { min, ready: false };
  return { min, ready: soilC >= min };
}
