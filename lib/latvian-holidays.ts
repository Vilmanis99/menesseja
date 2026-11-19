export interface LatvianHoliday {
  day: number;
  name: string;
  kind: "holiday" | "day-off";
}

export const LATVIAN_HOLIDAYS_SOURCE = "https://likumi.lv/ta/id/72608-par-svetku-atceres-un-atzimejamam-dienam";

export function holidayNameForDay(holidays: LatvianHoliday[], day: number): string {
  return holidays.filter((holiday) => holiday.day === day).map((holiday) => holiday.name).join(" · ");
}

// Annual national holidays in section 1 of the Latvian public holidays law.
type FixedHoliday = readonly [month: number, day: number, name: string, followingDayOff?: string];

const FIXED_HOLIDAYS: FixedHoliday[] = [
  [1, 1, "Jaungada diena"],
  [5, 1, "Darba svētki un Latvijas Republikas Satversmes sapulces sasaukšanas diena"],
  [5, 4, "Latvijas Republikas Neatkarības atjaunošanas diena", "Brīvdiena par 4. maiju"],
  [6, 23, "Līgo diena"],
  [6, 24, "Jāņu diena"],
  [11, 18, "Latvijas Republikas Proklamēšanas diena", "Brīvdiena par 18. novembri"],
  [12, 24, "Ziemassvētku vakars"],
  [12, 25, "Pirmie Ziemassvētki"],
  [12, 26, "Otrie Ziemassvētki"],
  [12, 31, "Vecgada diena"],
];

// Add festival closing days only after official confirmation of the date.
// Cabinet Order No. 208, 14 April 2026: https://likumi.lv/ta/id/367734
const FESTIVAL_CLOSINGS: Partial<Record<number, FixedHoliday>> = {
  2028: [7, 9, "Vispārējo latviešu Dziesmu un deju svētku noslēguma diena", "Brīvdiena pēc Dziesmu un deju svētkiem"],
};

function easterSunday(year: number): Date {
  // Oudin's Gregorian ecclesiastical calendar, https://aa.usno.navy.mil/faq/easter
  const century = Math.floor(year / 100);
  const lunarCycle = year % 19;
  const correction = Math.floor((century - 17) / 25);
  let epact = (century - Math.floor(century / 4) - Math.floor((century - correction) / 3) + 19 * lunarCycle + 15) % 30;
  if (epact === 29 || (epact === 28 && lunarCycle >= 11)) epact -= 1;
  const weekday = (year + Math.floor(year / 4) + epact + 2 - century + Math.floor(century / 4)) % 7;
  return new Date(Date.UTC(year, 2, 28 + epact - weekday));
}

/** National holidays and statutory days off for the site's calendar archive (2025 onward). */
export function latvianHolidaysForMonth(year: number, month: number): LatvianHoliday[] {
  if (!Number.isInteger(year) || year < 2025 || !Number.isInteger(month) || month < 1 || month > 12) return [];
  const holidays: LatvianHoliday[] = [];
  const festival = FESTIVAL_CLOSINGS[year];
  for (const [holidayMonth, day, name, followingDayOff] of festival ? [...FIXED_HOLIDAYS, festival] : FIXED_HOLIDAYS) {
    if (holidayMonth !== month) continue;
    holidays.push({ day, name, kind: "holiday" });
    if (followingDayOff) {
      const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
      if (weekday === 0 || weekday === 6) {
        holidays.push({ day: day + (weekday === 0 ? 1 : 2), name: followingDayOff, kind: "day-off" });
      }
    }
  }

  if (month === 5) {
    const firstWeekday = new Date(Date.UTC(year, 4, 1)).getUTCDay();
    holidays.push({ day: 8 + (7 - firstWeekday) % 7, name: "Mātes diena", kind: "holiday" });
  }

  const easter = easterSunday(year);
  for (const [offset, name] of [[-2, "Lielā Piektdiena"], [0, "Pirmās Lieldienas"], [1, "Otrās Lieldienas"], [49, "Vasarsvētki"]] as const) {
    const date = new Date(easter);
    date.setUTCDate(easter.getUTCDate() + offset);
    if (date.getUTCMonth() + 1 === month) holidays.push({ day: date.getUTCDate(), name, kind: "holiday" });
  }
  return holidays.sort((left, right) => left.day - right.day);
}
