import DATA from "./vardadienas-data.json";

/**
 * Latvian name days ("vārda dienas") — THE daily-return hook in Latvia: the
 * newspaper Moon-calendar format people grew up with is exactly
 * "date + name day + Moon phase". Data: slikts/vardadienas (MIT), the
 * community-maintained canonical calendar (originally compiled by laacz).
 */

const NAMEDAYS = DATA as Record<string, string[]>;

const pad = (n: number) => String(n).padStart(2, "0");

/** Names celebrated on the given calendar date (empty on blank days like Feb 29). */
export function namedaysFor(date: Date): string[] {
  return NAMEDAYS[`${pad(date.getMonth() + 1)}-${pad(date.getDate())}`] ?? [];
}

/** Names for an explicit month/day (1-based), for prerendered month pages. */
export function namedaysForDay(month1: number, day: number): string[] {
  return NAMEDAYS[`${pad(month1)}-${pad(day)}`] ?? [];
}
