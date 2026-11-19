/**
 * Lunar phase helpers for Mēness Sēja.
 * Phase value is a fraction 0..1 of the synodic cycle:
 *   0 / 1 = jauns mēness (new), 0.5 = pilns mēness (full).
 */

import { Body, Illumination, MoonPhase, SearchMoonQuarter, NextMoonQuarter } from "astronomy-engine";
import { dayAnchor, latviaDateParts, latviaDateKey } from "./day-anchor";

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

export interface MoonInterval {
  waxing: boolean;
  start: Date;
  end: Date;
}

/** Complete [start, end) waxing and waning intervals overlapping this Riga civil month. */
export function moonIntervalsForMonth(
  year: number,
  month: number,
  phases: readonly PrincipalMoonPhase[] = moonPhasesForMonth(year, month),
): MoonInterval[] {
  const isTurn = (phase: PrincipalMoonPhase) => phase.frac === 0 || phase.frac === 0.5;
  const previous = month === 1 ? moonPhasesForMonth(year - 1, 12) : moonPhasesForMonth(year, month - 1);
  const next = month === 12 ? moonPhasesForMonth(year + 1, 1) : moonPhasesForMonth(year, month + 1);
  // Every month has at least one turning point, including a February without a new moon.
  const turns = [...previous.filter(isTurn).slice(-1), ...phases.filter(isTurn), ...next.filter(isTurn).slice(0, 1)];
  const intervals: MoonInterval[] = [];
  for (let i = 0; i + 1 < turns.length; i++) {
    const start = turns[i];
    const end = turns[i + 1].date;
    // If the first in-month event falls at local midnight on day one, the previous interval has ended.
    if (i === 0 && latviaDateParts(new Date(end.getTime() - 1)).month !== month) continue;
    intervals.push({ waxing: start.frac === 0, start: start.date, end });
  }
  return intervals;
}

/** Whole elapsed days and remaining whole hours since conjunction, at the supplied instant. */
export function lunarAgeAt(date: Date): { newMoon: Date; days: number; hours: number } {
  const { year, month } = latviaDateParts(date);
  const cursor = new Date(Date.UTC(year, month - 1, 1));

  // A short February can have no new moon, so early March can still belong to January's lunation.
  for (let offset = 0; offset < 3; offset++) {
    const phases = moonPhasesForMonth(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1);
    const last = phases.reverse().find((phase) => phase.frac === 0 && phase.date <= date);
    if (last) {
      const elapsedHours = Math.floor((date.getTime() - last.date.getTime()) / 3_600_000);
      return { newMoon: last.date, days: Math.floor(elapsedHours / 24), hours: elapsedHours % 24 };
    }
    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  }
  throw new RangeError("No preceding new moon found");
}

/** A same-day event remains visible after its exact instant has passed. */
export function principalPhasesOnDate(date: Date): PrincipalMoonPhase[] {
  const { year, month } = latviaDateParts(date);
  return moonPhasesForMonth(year, month).filter((phase) => latviaDateKey(phase.date) === latviaDateKey(date));
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

/** Reserve exact quarter names for the Riga date when the event occurs.
 * The noon appearance can fall in the same phase band on adjacent days. */
export function dailyPhaseName(moon: MoonInfo, event?: PrincipalMoonPhase): string {
  if (event) return event.name;
  switch (moon.name) {
    case "Pilns mēness": return "Gandrīz pilns mēness";
    case "Jauns mēness": return moon.waxing ? "Augošs sirpis" : "Dilstošs sirpis";
    case "Pirmais ceturksnis": return "Augošs mēness";
    case "Pēdējais ceturksnis": return "Dilstošs mēness";
    default: return moon.name;
  }
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
