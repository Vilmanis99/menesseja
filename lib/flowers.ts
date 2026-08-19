import fs from "node:fs";
import path from "node:path";
import type { RecipePhase, RecipeElement } from "./recipes";

/** Ornamental-flower content type. The single biggest traffic category in the
 *  Latvian gardening market (peonijas, narcises, pelargonijas …) — and the one
 *  that fits the Moon engine best: blooms are sown/tended on flower (ziedu/gaiss)
 *  days. Each page pairs real Latvia growing data with that Moon angle + folklore. */

export type FlowerType = "daudzgadiga" | "sipolpuke" | "viengadiga" | "krums";

export interface Flower {
  slug: string;
  name: string; // Latvian
  latin?: string;
  /** Optional head-term SEO overrides — for pillar pages chasing a big query
   *  (e.g. "peonijas"); the generic title template covers the rest. */
  seoTitle?: string;
  seoDescription?: string;
  emoji: string;
  type: FlowerType;
  tagline: string;
  bloom: string; // "Jūnijs–jūlijs"
  height: string; // "60–100 cm"
  sun: string; // "Saule" | "Saule / pussēna" | "Pussēna"
  hardy: boolean; // pārziemo Latvijā bez izrakšanas
  difficulty: "viegli" | "vidēji" | "grūti";
  plantWhen: string; // "Septembris–oktobris (sīpoli)"
  moonPhase: RecipePhase;
  moonElement: RecipeElement; // ziedi (lielākā daļa) vai saknes (sīpoli/sakneņi)
  moonText: string;
  /** Bloom months as numbers, derived from `bloom` prose. Structured so list
   *  pages ("kas zied rudenī") can be generated instead of hand-maintained. */
  bloomMonths: number[];
  intro: string[];
  planting: string[]; // kā stādīt — dziļums, atstatums
  care: string[]; // laistīšana, mēslošana, atbalsts
  winter?: string; // pārziemošana
  problems?: string[]; // biežākās problēmas
  folklore?: string;
  faq?: { q: string; a: string }[];
  links?: { label: string; href: string }[]; // padziļinātie raksti par šo puķi (kopas savienošana)
  related?: string[]; // citas puķu slugs
}

export const FLOWER_TYPE_META: Record<FlowerType, { label: string; icon: string; blurb: string }> = {
  daudzgadiga: { label: "Daudzgadīgās", icon: "local_florist", blurb: "Iestādi reizi — zied gadiem." },
  sipolpuke: { label: "Sīpolpuķes", icon: "spa", blurb: "Sīpoli un gumi — pavasara un vasaras krāsas." },
  viengadiga: { label: "Viengadīgās", icon: "potted_plant", blurb: "Vienas sezonas spožums dobēm un balkoniem." },
  krums: { label: "Ziedoši krūmi", icon: "park", blurb: "Dārza karkass, kas zied gadu no gada." },
};

export const FLOWER_TYPE_ORDER: FlowerType[] = ["daudzgadiga", "sipolpuke", "viengadiga", "krums"];

const DIR = path.join(process.cwd(), "content", "flowers");

function read(file: string): Flower | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, file), "utf-8")) as Flower;
  } catch {
    return null;
  }
}

export function flowerSlugs(): string[] {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

/** Ornamentals live under /pukes and /augi/<slug> only 308s there, so every
 *  internal link should point at the canonical URL rather than at a redirect.
 *  Server-side only — this module reads from disk. */
export function cropHref(cropId: string): string {
  return flowerSlugSet().has(cropId) ? `/pukes/${cropId}` : `/augi/${cropId}`;
}

let slugSetCache: Set<string> | null = null;
function flowerSlugSet(): Set<string> {
  if (!slugSetCache) slugSetCache = new Set(flowerSlugs());
  return slugSetCache;
}

export function getAllFlowers(): Flower[] {
  return flowerSlugs()
    .map((s) => read(`${s}.json`))
    .filter((r): r is Flower => r !== null);
}

export function getFlower(slug: string): Flower | null {
  return read(`${slug}.json`);
}
