import { getAllProblems, type GardenProblem } from "@/lib/kaitekli";
import { CROPS, type Crop } from "@/lib/planting-crops";

/**
 * Links crops ↔ pests/diseases. The pest data only has a free-text `affects`
 * list (e.g. "tomātiem", "āboliem"), so we match by a normalized crop-name stem
 * that survives Latvian declension. Conservative (stem ≥4 chars) to avoid wrong
 * links; apples/pears etc. that aren't crops simply don't match (fine).
 */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[āàá]/g, "a").replace(/[ēèé]/g, "e").replace(/[īìí]/g, "i")
    .replace(/[ūùú]/g, "u").replace(/[ōò]/g, "o")
    .replace(/č/g, "c").replace(/ģ/g, "g").replace(/ķ/g, "k").replace(/ļ/g, "l")
    .replace(/ņ/g, "n").replace(/š/g, "s").replace(/ž/g, "z");

/** First word of a crop name, normalized, with the declension ending trimmed. */
function cropStem(name: string): string {
  const first = norm(name.split(/[\s/(,]/)[0]);
  return first.length > 4 ? first.slice(0, -1) : first;
}

/** Pests/diseases whose `affects` text mentions this crop. */
export function pestsForCrop(crop: Crop): GardenProblem[] {
  const s = cropStem(crop.name);
  if (s.length < 4) return [];
  return getAllProblems().filter((p) => p.affects.some((a) => norm(a).includes(s)));
}

/** The crop an `affects` phrase refers to (longest stem match), for linking. */
export function cropForAffect(affect: string): Crop | undefined {
  const a = norm(affect);
  let best: Crop | undefined;
  let bestLen = 0;
  for (const c of CROPS) {
    const s = cropStem(c.name);
    if (s.length >= 4 && a.includes(s) && s.length > bestLen) {
      best = c;
      bestLen = s.length;
    }
  }
  return best;
}
