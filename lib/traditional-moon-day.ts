import { dayAnchor } from "./day-anchor";
import { moonHorizonForDay } from "./moon-horizon";
import { getRegion } from "./regions";

const DAY_MS = 24 * 3_600_000;
const riga = getRegion("pieriga");
const risesByDay = new Map<string, Date[]>();

function rigaRises(dateKey: string): Date[] {
  const cached = risesByDay.get(dateKey);
  if (cached) return cached;
  const { rises } = moonHorizonForDay(dateKey, riga.lat, riga.lon);
  // Keep at most two lunations' worth of daily horizon calculations.
  if (risesByDay.size >= 62) risesByDay.clear();
  risesByDay.set(dateKey, rises);
  return rises;
}

/** Traditional ordinal: day one starts at conjunction, each subsequent Riga moonrise starts another day.
 * newMoon is the most recent conjunction returned by lunarAgeAt(date). */
export function rigaMoonDayAt(date: Date, newMoon: Date): number {
  const elapsed = date.getTime() - newMoon.getTime();
  if (!(elapsed >= 0 && elapsed < 30 * DAY_MS)) throw new RangeError("Expected the preceding new moon");
  const lastDay = dayAnchor(date).getTime();
  let ordinal = 1;
  // UTC anchors identify consecutive Riga civil dates even across daylight saving changes.
  for (let day = dayAnchor(newMoon).getTime(); day <= lastDay; day += DAY_MS) {
    const key = new Date(day).toISOString().slice(0, 10);
    for (const rise of rigaRises(key)) {
      if (rise > newMoon && rise <= date) ordinal++;
    }
  }
  return ordinal;
}
