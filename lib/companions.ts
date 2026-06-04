/**
 * Companion-planting compatibility between crops (by id from planting-crops.ts).
 * Relationships are symmetric. Based on well-established kitchen-garden lore
 * relevant to the Latvian crop set.
 */

type Pair = [string, string];

// Plants that help each other when grown side by side.
const GOOD: Pair[] = [
  ["burkani", "sipoli"],
  ["burkani", "salati"],
  ["burkani", "zirni"],
  ["burkani", "rediisi"],
  ["kiploki", "burkani"],
  ["salati", "dilles"],
  ["salati", "rediisi"],
  ["salati", "gurki"],
  ["salati", "zemenes"],
  ["salati", "spinati"],
  ["tomati", "baziliks"],
  ["tomati", "petersili"],
  ["tomati", "sipoli"],
  ["tomati", "salati"],
  ["paprika", "baziliks"],
  ["kaposti", "dilles"],
  ["kaposti", "bietes"],
  ["kaposti", "sipoli"],
  ["kaposti", "kartupeli"],
  ["gurki", "pupas"],
  ["gurki", "zirni"],
  ["gurki", "dilles"],
  ["pupas", "kartupeli"],
  ["pupas", "kabaci"],
  ["zemenes", "spinati"],
  ["sipoli", "bietes"],
  ["kiploki", "zemenes"],
  // Flowers as pest-repelling companions
  ["samtenes", "tomati"],
  ["samtenes", "gurki"],
  ["samtenes", "kartupeli"],
  ["kalendula", "tomati"],
  ["kalendula", "kaposti"],
  ["kalendula", "salati"],
];

// Plants that hinder each other (disease, competition, growth inhibition).
const BAD: Pair[] = [
  ["tomati", "kartupeli"],
  ["tomati", "kaposti"],
  ["tomati", "dilles"],
  ["tomati", "kirbji"],
  ["kartupeli", "gurki"],
  ["kartupeli", "kirbji"],
  ["kartupeli", "kabaci"],
  ["sipoli", "zirni"],
  ["sipoli", "pupas"],
  ["kiploki", "zirni"],
  ["kiploki", "pupas"],
  ["burkani", "dilles"],
  ["kaposti", "zemenes"],
  ["bietes", "pupas"],
];

const REASONS: Record<string, string> = {
  "kartupeli|tomati": "Viena dzimta — kopīgas slimības (lakstu puve).",
  "kaposti|tomati": "Konkurē par barību un vietu.",
  "dilles|tomati": "Dilles kavē tomātu augšanu.",
  "kirbji|tomati": "Konkurē par vietu un barību.",
  "gurki|kartupeli": "Kartupeļi veicina gurķu slimības.",
  "kartupeli|kirbji": "Konkurē par mitrumu un barību.",
  "kabaci|kartupeli": "Konkurē par mitrumu un barību.",
  "sipoli|zirni": "Sīpoli kavē pākšaugu (zirņu) augšanu.",
  "pupas|sipoli": "Sīpoli kavē pākšaugu (pupu) augšanu.",
  "kiploki|zirni": "Ķiploki kavē pākšaugu (zirņu) augšanu.",
  "kiploki|pupas": "Ķiploki kavē pākšaugu (pupu) augšanu.",
  "burkani|dilles": "Dilles var kavēt burkānu sakņu attīstību.",
  "kaposti|zemenes": "Kāposti nomāc zemeņu augšanu.",
  "bietes|pupas": "Kavē viens otra augšanu.",
};

const GOOD_SET = new Set(GOOD.map(([a, b]) => [a, b].sort().join("|")));
const BAD_SET = new Set(BAD.map(([a, b]) => [a, b].sort().join("|")));

export type Compat = "good" | "bad" | "neutral";

export function companionStatus(a: string, b: string): Compat {
  if (a === b) return "neutral";
  const key = [a, b].sort().join("|");
  if (BAD_SET.has(key)) return "bad";
  if (GOOD_SET.has(key)) return "good";
  return "neutral";
}

export function companionReason(a: string, b: string): string {
  return REASONS[[a, b].sort().join("|")] ?? "Šie augi nesader blakus.";
}

/** Other crop ids that grow well next to `cropId`. */
export function goodCompanions(cropId: string): string[] {
  const out: string[] = [];
  for (const [a, b] of GOOD) {
    if (a === cropId) out.push(b);
    else if (b === cropId) out.push(a);
  }
  return out;
}

/** Other crop ids that should NOT be next to `cropId`. */
export function badCompanions(cropId: string): string[] {
  const out: string[] = [];
  for (const [a, b] of BAD) {
    if (a === cropId) out.push(b);
    else if (b === cropId) out.push(a);
  }
  return out;
}
