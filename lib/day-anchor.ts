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
 * Convention: a calendar day is classified at the NOON of that day in
 * Europe/Riga (printed Latvian biodynamic calendars do the same — the day's
 * dominant quality). All classification functions anchor their input here.
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
export function dayAnchor(date: Date): Date {
  const [y, m, d] = RIGA_DAY.format(date).split("-").map(Number);
  return latviaNoon(y, m, d);
}
