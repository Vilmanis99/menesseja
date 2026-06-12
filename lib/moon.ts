/**
 * Lunar phase helpers for Mēness Sēja.
 * Phase value is a fraction 0..1 of the synodic cycle:
 *   0 / 1 = jauns mēness (new), 0.5 = pilns mēness (full).
 */

import { dayAnchor } from "@/lib/day-anchor";

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

const SYNODIC = 29.530588853; // days
/** A known new moon: 2000-01-06 18:14 UTC */
const KNOWN_NEW = Date.UTC(2000, 0, 6, 18, 14) / 86400000; // in days

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
  const days = dayAnchor(date).getTime() / 86400000 - KNOWN_NEW;
  const phase = ((days / SYNODIC) % 1 + 1) % 1;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
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
