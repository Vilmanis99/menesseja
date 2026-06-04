import fs from "node:fs";
import path from "node:path";

/** Garden problem (pest or disease) content type. Driven by the competitor finding
 *  that "zemesvēzis" is the fastest-rising Latvian gardening keyword — problem-driven
 *  search is huge. Our edge: every problem is solved with a NATURAL remedy that links
 *  straight into our own recipe vault (/receptes) + the AI photo tool (/diagnoze). */

export type ProblemType = "kaiteklis" | "slimiba";

export interface GardenProblem {
  slug: string;
  name: string; // Latvian
  latin?: string;
  emoji: string;
  type: ProblemType;
  tagline: string;
  severity: "viegls" | "vidējs" | "nopietns";
  affects: string[]; // skartie augi (brīvs teksts, lv)
  signs: string[]; // kā atpazīt
  intro: string[];
  control: string[]; // dabīgas apkarošanas metodes
  recipeSlugs: string[]; // saites uz /receptes (tikai reālas slugs)
  prevention: string[];
  moonNote?: string;
  folklore?: string;
  faq?: { q: string; a: string }[];
}

export const PROBLEM_TYPE_META: Record<ProblemType, { label: string; icon: string; blurb: string }> = {
  kaiteklis: { label: "Kaitēkļi", icon: "pest_control", blurb: "Kukaiņi, gliemeži un citi dārza apēdāji." },
  slimiba: { label: "Slimības", icon: "coronavirus", blurb: "Sēnītes un puves — kā atpazīt un apturēt." },
};

export const PROBLEM_TYPE_ORDER: ProblemType[] = ["kaiteklis", "slimiba"];

export const SEVERITY_META: Record<GardenProblem["severity"], { label: string; tone: string }> = {
  viegls: { label: "Viegls", tone: "text-primary" },
  vidējs: { label: "Vidējs", tone: "text-tertiary" },
  nopietns: { label: "Nopietns", tone: "text-error" },
};

const DIR = path.join(process.cwd(), "content", "kaitekli");

function read(file: string): GardenProblem | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, file), "utf-8")) as GardenProblem;
  } catch {
    return null;
  }
}

export function problemSlugs(): string[] {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export function getAllProblems(): GardenProblem[] {
  return problemSlugs()
    .map((s) => read(`${s}.json`))
    .filter((r): r is GardenProblem => r !== null);
}

export function getProblem(slug: string): GardenProblem | null {
  return read(`${slug}.json`);
}
