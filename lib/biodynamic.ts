/**
 * Biodynamic sowing logic after Maria Thun.
 * The Moon's zodiac sign carries an element, and each element favours a
 * different part of the plant:
 *   Earth (Zeme)  → Roots   (Saknes)   — root vegetables
 *   Water (Ūdens) → Leaves  (Lapas)    — leafy greens, herbs
 *   Air   (Gaiss) → Flowers (Ziedi)    — flowering crops
 *   Fire  (Uguns) → Fruit   (Augļi)    — fruit & seed crops
 *
 * Zodiac longitude is a low-precision tropical approximation (≈1°), which is
 * ample for resolving the 30°-wide sign a planting calendar needs.
 */

import type { Category } from "@/lib/planting-crops";
import { dayAnchor } from "@/lib/day-anchor";

export type Element = "zeme" | "udens" | "gaiss" | "uguns";
export type PlantPart = "saknes" | "lapas" | "ziedi" | "augli";

export interface ZodiacSign {
  name: string; // Latvian
  symbol: string;
  element: Element;
}

// Order from 0° tropical longitude (Aries).
export const ZODIAC: ZodiacSign[] = [
  { name: "Auns", symbol: "♈", element: "uguns" },
  { name: "Vērsis", symbol: "♉", element: "zeme" },
  { name: "Dvīņi", symbol: "♊", element: "gaiss" },
  { name: "Vēzis", symbol: "♋", element: "udens" },
  { name: "Lauva", symbol: "♌", element: "uguns" },
  { name: "Jaunava", symbol: "♍", element: "zeme" },
  { name: "Svari", symbol: "♎", element: "gaiss" },
  { name: "Skorpions", symbol: "♏", element: "udens" },
  { name: "Strēlnieks", symbol: "♐", element: "uguns" },
  { name: "Mežāzis", symbol: "♑", element: "zeme" },
  { name: "Ūdensvīrs", symbol: "♒", element: "gaiss" },
  { name: "Zivis", symbol: "♓", element: "udens" },
];

export const ELEMENT_META: Record<
  Element,
  { label: string; part: PlantPart; partLabel: string; icon: string; color: string }
> = {
  zeme: { label: "Zeme", part: "saknes", partLabel: "Saknes", icon: "landslide", color: "text-secondary" },
  udens: { label: "Ūdens", part: "lapas", partLabel: "Lapas", icon: "water_drop", color: "text-primary" },
  gaiss: { label: "Gaiss", part: "ziedi", partLabel: "Ziedi", icon: "air", color: "text-tertiary" },
  uguns: { label: "Uguns", part: "augli", partLabel: "Augļi", icon: "local_fire_department", color: "text-secondary" },
};

/** Which crop category each plant-part day favours. */
export const PART_FAVOURS: Record<PlantPart, Category[]> = {
  saknes: ["darzeni"], // root veg (subset of darzeni)
  lapas: ["garsaugi", "darzeni"],
  ziedi: ["ogas"],
  augli: ["darzeni", "ogas"],
};

const RAD = Math.PI / 180;
const sin = (deg: number) => Math.sin(deg * RAD);

/**
 * Tropical ecliptic longitude of the Moon (degrees, 0..360), Meeus low-precision
 * series (top periodic terms → ~0.1–0.2°). Ample for resolving the constellation.
 */
export function moonLongitude(date: Date): number {
  const d = date.getTime() / 86400000 - 10957.5; // days since J2000.0 (TT≈UT here)
  const L = 218.316 + 13.176396 * d; // mean longitude
  const M = 134.963 + 13.064993 * d; // Moon mean anomaly
  const Ms = 357.529 + 0.985600 * d; // Sun mean anomaly
  const D = 297.850 + 12.190749 * d; // mean elongation
  const F = 93.272 + 13.229350 * d; // argument of latitude
  const lon =
    L +
    6.289 * sin(M) +
    1.274 * sin(2 * D - M) +
    0.658 * sin(2 * D) +
    0.214 * sin(2 * M) -
    0.186 * sin(Ms) -
    0.114 * sin(2 * F);
  return ((lon % 360) + 360) % 360;
}

/**
 * Sidereal constellation the Moon stands in — the *factual* (unequal) IAU
 * constellation spans Maria Thun's calendar uses, not equal 30° signs. Values are
 * the tropical ecliptic longitudes where the ecliptic enters each constellation
 * (current epoch; precession over a few decades is < 0.5° → negligible). The 13th
 * ecliptic constellation, Ophiuchus, is folded into Scorpius (water) per Thun.
 */
const CONSTELLATIONS: { start: number; zodiac: number }[] = [
  { start: 28.7, zodiac: 0 }, // Auns / Aries
  { start: 53.4, zodiac: 1 }, // Vērsis / Taurus
  { start: 90.1, zodiac: 2 }, // Dvīņi / Gemini
  { start: 118.3, zodiac: 3 }, // Vēzis / Cancer
  { start: 138.1, zodiac: 4 }, // Lauva / Leo
  { start: 173.9, zodiac: 5 }, // Jaunava / Virgo (widest — long root period)
  { start: 217.8, zodiac: 6 }, // Svari / Libra (narrowest — short flower period)
  { start: 241.1, zodiac: 7 }, // Skorpions / Scorpius (absorbs Ophiuchus → 266.3)
  { start: 266.3, zodiac: 8 }, // Strēlnieks / Sagittarius
  { start: 299.7, zodiac: 9 }, // Mežāzis / Capricornus
  { start: 328.0, zodiac: 10 }, // Ūdensvīrs / Aquarius
  { start: 351.7, zodiac: 11 }, // Zivis / Pisces (wraps past 0° to 28.7°)
];

export function moonSign(date: Date = new Date()): ZodiacSign {
  const lon = moonLongitude(dayAnchor(date));
  for (let i = CONSTELLATIONS.length - 1; i >= 0; i--) {
    if (lon >= CONSTELLATIONS[i].start) return ZODIAC[CONSTELLATIONS[i].zodiac];
  }
  return ZODIAC[11]; // below 28.7° → Pisces (wrap-around)
}

const OBLIQUITY = 23.44; // Earth's axial tilt
const days2000 = (date: Date) => date.getTime() / 86400000 - 10957.5;

/** Moon's ecliptic latitude β (deg) — the ±5.13° draconic term that drives the
 *  ascending/descending rhythm. F is the argument of latitude. */
function moonLatitude(date: Date): number {
  const F = 93.272 + 13.22935 * days2000(date);
  return 5.128 * Math.sin(F * RAD);
}

/** Geocentric declination of the Moon (deg), INCLUDING lunar latitude so the
 *  ascending/descending ("Mēness ceļš") rhythm is the real ~27.3-day draconic
 *  cycle, not a Sun-like longitude curve. */
function moonDeclination(date: Date): number {
  const lon = moonLongitude(date) * RAD;
  const beta = moonLatitude(date) * RAD;
  const eps = OBLIQUITY * RAD;
  const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lon);
  return Math.asin(sinDec) / RAD;
}

/**
 * "Augošs/dilstošs ceļš" — the Moon's monthly RISE vs FALL across the sky
 * (declination trend, ~27.3-day rhythm), distinct from the phase. Ascending =
 * sap rises (sow & harvest above-ground, graft); descending = plant, transplant,
 * root & soil work.
 */
export function moonAscending(date: Date = new Date()): boolean {
  const anchored = dayAnchor(date);
  const next = new Date(anchored.getTime() + 86400000);
  return moonDeclination(next) > moonDeclination(anchored);
}

/**
 * Rest day — the Moon is near a lunar node (crossing the ecliptic). Biodynamic
 * calendars mark these as unfavourable; better to skip sowing and tend/observe.
 */
export function isRestDay(date: Date = new Date()): boolean {
  const F = ((93.272 + 13.22935 * days2000(dayAnchor(date))) % 180 + 180) % 180;
  return Math.min(F, 180 - F) < 6.6; // within ~½ day of a node
}

export interface SowingDay {
  date: Date;
  sign: ZodiacSign;
  element: Element;
  part: PlantPart;
  partLabel: string;
  /** Headline guidance in Latvian */
  advice: string;
  favours: Category[];
}

const ADVICE: Record<PlantPart, string> = {
  saknes: "Saknes diena — labākais laiks sakņaugiem (burkāni, bietes, kartupeļi).",
  lapas: "Lapu diena — sēj un kopj lapu dārzeņus un garšaugus.",
  ziedi: "Ziedu diena — piemērota ziedaugiem un ogu krūmu kopšanai.",
  augli: "Augļu diena — sēj augļus un sēklas (tomāti, pupas, ķirbji).",
};

export function sowingDay(date: Date = new Date()): SowingDay {
  const sign = moonSign(date);
  const meta = ELEMENT_META[sign.element];
  return {
    date,
    sign,
    element: sign.element,
    part: meta.part,
    partLabel: meta.partLabel,
    advice: ADVICE[meta.part],
    favours: PART_FAVOURS[meta.part],
  };
}

/** Element-days across a span — used to paint the lunar calendar. */
export function sowingDays(start: Date, count: number): SowingDay[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return sowingDay(d);
  });
}
