/**
 * Lunar phase helpers for Mēness Sēja.
 * Phase value is a fraction 0..1 of the synodic cycle:
 *   0 / 1 = jauns mēness (new), 0.5 = pilns mēness (full).
 */

import { Body, Illumination, MoonPhase, SearchMoonQuarter, NextMoonQuarter } from "astronomy-engine";
import { dayAnchor, latviaDateParts } from "./day-anchor";

export interface MoonInfo {
  /** 0..1 synodic fraction */
  phase: number;
  /** Latvian phase name */
  name: string;
  /** Illuminated fraction 0..1 */
  illumination: number;
  /** Waxing (augošs) vs waning (dilstošs) */
  waxing: boolean;
}

export interface PrincipalMoonPhase {
  date: Date;
  frac: number;
  name: string;
}

const PRINCIPAL_NAMES = ["Jauns mēness", "Pirmais ceturksnis", "Pilns mēness", "Pēdējais ceturksnis"];

/** Actual phase instants, not dates inferred from a fixed average lunar cycle. */
export function nextPrincipalPhases(from: Date, count = 4): PrincipalMoonPhase[] {
  if (!Number.isInteger(count) || count < 1 || count > 16) throw new RangeError("Invalid phase count");
  let quarter = SearchMoonQuarter(from);
  return Array.from({ length: count }, () => {
    const phase = { date: quarter.time.date, frac: quarter.quarter / 4, name: PRINCIPAL_NAMES[quarter.quarter] };
    quarter = NextMoonQuarter(quarter);
    return phase;
  });
}

/** Include every principal phase falling in this Latvian month, including
 * two full moons. UTC instants near midnight can belong to the next Riga day. */
export function moonPhasesForMonth(year: number, month: number): PrincipalMoonPhase[] {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("Invalid calendar month");
  }
  const start = new Date(Date.UTC(year, month - 1, 0));
  return nextPrincipalPhases(start, 6).filter(({ date }) => {
    const local = latviaDateParts(date);
    return local.year === year && local.month === month;
  });
}

const PHASE_NAMES: { max: number; name: string }[] = [
  { max: 0.03, name: "Jauns mēness" },
  { max: 0.22, name: "Augošs sirpis" },
  { max: 0.28, name: "Pirmais ceturksnis" },
  { max: 0.47, name: "Augošs mēness" },
  { max: 0.53, name: "Pilns mēness" },
  { max: 0.72, name: "Dilstošs mēness" },
  { max: 0.78, name: "Pēdējais ceturksnis" },
  { max: 0.97, name: "Dilstošs sirpis" },
  { max: 1.01, name: "Jauns mēness" },
];

export function phaseName(phase: number): string {
  const p = ((phase % 1) + 1) % 1;
  return PHASE_NAMES.find((b) => p < b.max)?.name ?? "Jauns mēness";
}

/** Genitive forms, for sentences like "Dilstoša sirpja laikā …" — the
 *  nominative phase name dropped into prose reads as a case error in Latvian. */
const PHASE_GENITIVE: Record<string, string> = {
  "Jauns mēness": "Jauna mēness",
  "Augošs sirpis": "Augoša sirpja",
  "Pirmais ceturksnis": "Pirmā ceturkšņa",
  "Augošs mēness": "Augoša mēness",
  "Pilns mēness": "Pilna mēness",
  "Dilstošs mēness": "Dilstoša mēness",
  "Pēdējais ceturksnis": "Pēdējā ceturkšņa",
  "Dilstošs sirpis": "Dilstoša sirpja",
};

export function phaseNameGenitive(phase: number): string {
  const name = phaseName(phase);
  return PHASE_GENITIVE[name] ?? name;
}

/** Moon phase for a given date (defaults to now). Anchored to the date's
 *  Latvian calendar day so every surface (and the UTC build server) agrees. */
export function moonForDate(date: Date = new Date()): MoonInfo {
  const anchor = dayAnchor(date);
  const phase = MoonPhase(anchor) / 360;
  const illumination = Illumination(Body.Moon, anchor).phase_fraction;
  return {
    phase,
    name: phaseName(phase),
    illumination,
    waxing: phase < 0.5,
  };
}

/**
 * SVG path (viewBox 0 0 100 100) for the *illuminated* portion of the disk.
 * Boundary is sampled so the terminator is geometrically correct for every
 * phase — waxing lights the right limb (Northern hemisphere convention).
 */
export function litPath(phase: number, steps = 36): string {
  const p = ((phase % 1) + 1) % 1;
  const R = 50;
  const cx = 50;
  const cy = 50;
  const s = p < 0.5 ? 1 : -1; // waxing → lit right, waning → lit left
  const termScale = Math.cos(2 * Math.PI * p); // signed terminator x-radius factor

  const pt = (x: number, y: number) => `${(cx + x).toFixed(2)},${(cy + y).toFixed(2)}`;

  const limb: string[] = [];
  const term: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const phi = (i / steps) * Math.PI; // 0 (top) → π (bottom)
    const y = -R * Math.cos(phi);
    limb.push(pt(s * R * Math.sin(phi), y));
    term.push(pt(s * R * termScale * Math.sin(phi), y));
  }
  term.reverse();

  return `M ${limb.concat(term).join(" L ")} Z`;
}
