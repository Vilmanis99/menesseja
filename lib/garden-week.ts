import { calendarGuide, type CalendarGuide } from "./calendar-guides";
import { dayAnchor, latviaNoon } from "./day-anchor";

interface WeeklyTask {
  month: number;
  year: number;
  start: Date;
  end: Date;
  section: CalendarGuide["sections"][number];
}

/** Match each Riga day in the Monday–Sunday week to the month editor's
 *  1–10, 11–20 or 21–end plan. Repeated tasks span the matching days once. */
export function gardenWeek(asOf = new Date()) {
  const today = dayAnchor(asOf);
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth() + 1;
  const monday = today.getUTCDate() - (today.getUTCDay() + 6) % 7;
  const tasks = new Map<string, WeeklyTask>();

  for (let offset = 0; offset < 7; offset++) {
    const date = latviaNoon(year, month, monday + offset);
    const taskYear = date.getUTCFullYear();
    const taskMonth = date.getUTCMonth() + 1;
    const guide = calendarGuide(taskMonth);
    const period = Math.min(2, Math.floor((date.getUTCDate() - 1) / 10));
    for (const id of guide.timeline[period].sectionIds) {
      const key = `${taskYear}-${taskMonth}-${id}`;
      const existing = tasks.get(key);
      if (existing) {
        existing.end = date;
      } else {
        const section = guide.sections.find((entry) => entry.id === id);
        if (!section) throw new Error(`Unknown calendar task ${key}`);
        tasks.set(key, { month: taskMonth, year: taskYear, start: date, end: date, section });
      }
    }
  }

  return { start: latviaNoon(year, month, monday), end: latviaNoon(year, month, monday + 6), tasks: [...tasks.values()] };
}
