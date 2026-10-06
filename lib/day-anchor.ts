/**
 * Day anchoring — makes "what kind of day is it?" timezone-independent.
 *
 * The Moon's sign/element, ascending path and node proximity move during the
 * day, so the answer depends on WHICH INSTANT of the day you sample. Before
 * this module each surface sampled differently (local midnight in the calendar
 * grid, build-server noon in static month pages, "now" in the banner), so a
 * Vercel build (UTC) could disagree with a Latvian browser, and surfaces could
 * contradict each other near sign boundaries.
 *
 * Convention: a calendar day is classified at 10:00 UTC (12:00 EET / 13:00
 * EEST), always inside that Latvian day. All classification functions anchor
 * their input here. Exact astronomical event times are not day-anchored.
 */

// en-CA → YYYY-MM-DD; the formatter resolves the date IN Riga time.
const RIGA_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Riga",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** The anchor instant for the given Latvian calendar day.
 *  10:00 UTC = 12:00 EET / 13:00 EEST — always inside that Riga day. */
export function latviaNoon(year: number, month1: number, day: number): Date {
  return new Date(Date.UTC(year, month1 - 1, day, 10));
}

/** Anchor an arbitrary instant to the noon of ITS calendar day in Latvia. */
export function latviaDateParts(date: Date = new Date()): { year: number; month: number; day: number } {
  const parts = RIGA_DAY.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}

export function latviaDateKey(date: Date = new Date()): string {
  const { year, month, day } = latviaDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function dayAnchor(date: Date): Date {
  const { year, month, day } = latviaDateParts(date);
  return latviaNoon(year, month, day);
}
