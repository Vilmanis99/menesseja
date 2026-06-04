import fs from "node:fs";
import path from "node:path";

export type RecipePurpose = "meslojums" | "kaitekli" | "slimibas" | "augsne" | "stadu-stiprinasana";
export type RecipePhase = "augošs" | "dilstošs" | "jebkurš";
export type RecipeElement = "lapas" | "saknes" | "ziedi" | "augli" | "jebkurs";

export interface Recipe {
  slug: string;
  name: string;
  tagline: string;
  purpose: RecipePurpose;
  difficulty: "viegli" | "videji";
  timeText: string;
  intro: string[];
  ingredients: string[];
  steps: string[];
  application: string[];
  moonPhase: RecipePhase;
  moonElement: RecipeElement;
  moonText: string;
  caution: string;
  folklore: string;
}

export const PURPOSE_META: Record<RecipePurpose, { label: string; icon: string }> = {
  meslojums: { label: "Mēslojums", icon: "compost" },
  augsne: { label: "Augsnei", icon: "landslide" },
  slimibas: { label: "Pret slimībām", icon: "healing" },
  kaitekli: { label: "Pret kaitēkļiem", icon: "pest_control" },
  "stadu-stiprinasana": { label: "Stādu stiprināšana", icon: "spa" },
};

export const PURPOSE_ORDER: RecipePurpose[] = ["meslojums", "augsne", "stadu-stiprinasana", "slimibas", "kaitekli"];

const DIR = path.join(process.cwd(), "content", "recipes");

function read(file: string): Recipe | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, file), "utf-8")) as Recipe;
  } catch {
    return null;
  }
}

export function recipeSlugs(): string[] {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export function getAllRecipes(): Recipe[] {
  return recipeSlugs()
    .map((s) => read(`${s}.json`))
    .filter((r): r is Recipe => r !== null);
}

export function getRecipe(slug: string): Recipe | null {
  return read(`${slug}.json`);
}
