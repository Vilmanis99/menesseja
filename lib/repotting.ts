import { moonAscending, isRestDay, moonSign, ELEMENT_META, type PlantPart } from "./biodynamic";
import { latviaNoon } from "./day-anchor";

export interface RepotDay {
  day: number;
  date: Date;
  part: PlantPart;
}

/**
 * Houseplant repotting days in the biodynamic tradition (Maria Thun): the
 * Moon's path is descending ("stādīšanas laiks") and the day is not a node
 * rest day. Plant condition and season still decide whether to repot at all.
 */
export function repottingDays(year: number, month: number): RepotDay[] {
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const out: RepotDay[] = [];
  for (let day = 1; day <= count; day++) {
    const date = latviaNoon(year, month, day);
    if (moonAscending(date) || isRestDay(date)) continue;
    out.push({ day, date, part: ELEMENT_META[moonSign(date).element].part });
  }
  return out;
}

/** Collapse day numbers into Latvian ranges: [3,4,5,9,30,31] → "3.–5., 9., 30.–31." */
export function dayRanges(days: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < days.length; i++) {
    let j = i;
    while (j + 1 < days.length && days[j + 1] === days[j] + 1) j++;
    parts.push(j > i ? `${days[i]}.–${days[j]}.` : `${days[i]}.`);
    i = j;
  }
  return parts.join(", ");
}

/** The year a "pārstādīšanas kalendārs YYYY" reader is planning for: from
 *  October the coming spring is the useful one. */
export function repottingPlanYear(year: number, month: number): number {
  return month >= 10 ? year + 1 : year;
}

/** What the season means for repotting, shown next to the traditional days. */
export const REPOT_SEASON_NOTE = {
  ziema: "Ziemā augi aug lēni — pārstādi tikai tad, ja pods ir saplīsis vai saknes pūst.",
  pavasaris: "Pavasaris ir piemērotākais laiks, jo augi sāk augt un ātrāk ieaugas jaunajā podā.",
  vasara: "Vasarā var pārstādīt augus, kas aktīvi aug; ziedošus augus parasti pārstāda pēc ziedēšanas.",
  rudens: "Rudenī pārstādi tikai nepieciešamības gadījumā — ziemā svaigs substrāts lielā podā ilgi paliek slapjš.",
} as const;
