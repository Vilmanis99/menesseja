import { Body, Observer, SearchRiseSet } from "astronomy-engine";
import { latviaDateKey } from "./day-anchor";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const localClock = new Intl.DateTimeFormat("lv-LV", {
  timeZone: "Europe/Riga", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
const localOffset = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Riga", timeZoneName: "shortOffset" });

function offsetAt(date: Date) {
  return localOffset.formatToParts(date).find((part) => part.type === "timeZoneName")!.value;
}

/** Nearest civil minute, keeping the event on its original date and side of a clock change. */
export function formatHorizonTime(date: Date): string {
  const rounded = new Date(Math.round(date.getTime() / MINUTE) * MINUTE);
  const offset = offsetAt(date);
  const display = latviaDateKey(rounded) === latviaDateKey(date) && offsetAt(rounded) === offset ? rounded : date;
  const clock = localClock.format(display);
  // The last Sunday of October has two distinct copies of the same local hour.
  const ambiguous = [-HOUR, HOUR].some((delta) => localClock.format(display.getTime() + delta) === clock);
  return ambiguous ? `${clock} (${offset.replace("GMT", "UTC")})` : clock;
}

/** All upper-limb crossings of a level sea-level horizon during one Riga civil day. */
export function moonHorizonForDay(dateKey: string, lat: number, lon: number): { rises: Date[]; sets: Date[] } {
  const midnightUtc = new Date(`${dateKey}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !Number.isFinite(midnightUtc.getTime()) ||
      midnightUtc.toISOString().slice(0, 10) !== dateKey) {
    throw new RangeError("Invalid date key");
  }
  if (!Number.isFinite(lat) || Math.abs(lat) > 90 || !Number.isFinite(lon) || Math.abs(lon) > 180) {
    throw new RangeError("Invalid observer coordinates");
  }

  const observer = new Observer(lat, lon, 0);
  // The UTC search window spans the whole Riga date under both standard and
  // summer time. Membership is determined from each event's unrounded instant.
  const start = midnightUtc.getTime() - 12 * HOUR;
  const end = midnightUtc.getTime() + DAY;

  function crossings(direction: 1 | -1): Date[] {
    const events: Date[] = [];
    let cursor = start;
    while (cursor < end) {
      const event = SearchRiseSet(Body.Moon, observer, direction, new Date(cursor), (end - cursor) / DAY);
      if (!event) break;
      const localDay = latviaDateKey(event.date);
      if (localDay > dateKey) break;
      if (localDay === dateKey) events.push(event.date);
      // Move beyond the library's 0.1-second root-finding tolerance.
      cursor = event.date.getTime() + 1000;
    }
    return events;
  }

  return { rises: crossings(1), sets: crossings(-1) };
}
