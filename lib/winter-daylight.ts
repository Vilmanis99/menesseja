import { Body, Observer, SearchRiseSet, Seasons } from "astronomy-engine";
import { latviaDateParts, latviaNoon } from "./day-anchor";
import { getRegion, type RegionId } from "./regions";

export function winterDaylightDates(year: number, month: 1 | 12): number[] {
  const middle = month === 12 ? latviaDateParts(Seasons(year).dec_solstice.date).day : 15;
  return [1, middle, 31];
}

export function winterDaylight(year: number, month: 1 | 12, day: number, region: RegionId) {
  const { lat, lon } = getRegion(region);
  const observer = new Observer(lat, lon, 0);
  const noon = latviaNoon(year, month, day);
  // In every Latvian city the Sun is above the horizon at this winter anchor.
  const rise = SearchRiseSet(Body.Sun, observer, 1, noon, -0.5);
  const set = SearchRiseSet(Body.Sun, observer, -1, noon, 0.5);
  if (!rise || !set) throw new Error("Missing winter Sun crossing in Latvia");
  return { day, rise: rise.date, set: set.date, durationMs: set.date.getTime() - rise.date.getTime() };
}
