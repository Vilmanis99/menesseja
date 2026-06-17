export type RegionId =
  | "kurzeme"
  | "vidzeme"
  | "zemgale"
  | "latgale"
  | "pieriga";

export type ClimateType = "jura" | "kontinentals" | "augstiene";

export interface Region {
  id: RegionId;
  name: string;
  /** Locative form ("Kurzemē") for "kalendārs {x}", "sēt {x}" phrasing */
  nameLocative: string;
  climate: ClimateType;
  climateLabel: string;
  /** Average last spring frost — display string */
  lastFrost: string;
  /** Average last spring frost as {month 1-12, day} — for frost logic */
  lastFrostDate: { month: number; day: number };
  /** Frost-free growing days */
  growingDays: number;
  /** Representative town coordinates for weather lookups */
  lat: number;
  lon: number;
  summary: string;
  challenges: { icon: string; text: string }[];
}

export const CLIMATE_COLOR: Record<ClimateType, string> = {
  jura: "bg-secondary",
  kontinentals: "bg-primary",
  augstiene: "bg-tertiary",
};

export const REGIONS: Region[] = [
  {
    id: "kurzeme",
    name: "Kurzeme",
    nameLocative: "Kurzemē",
    climate: "jura",
    climateLabel: "Mērens jūras klimats",
    lastFrost: "5. maijs",
    lastFrostDate: { month: 5, day: 5 },
    growingDays: 195,
    lat: 56.97, // Kuldīga
    lon: 21.97,
    summary:
      "Maigākās ziemas Latvijā, bet vējains piekrastes klimats prasa vēja aizsegus dārzeņiem.",
    challenges: [
      { icon: "air", text: "Sāļais jūras gaiss un brāzmaini vēji." },
      { icon: "rainy", text: "Augsts gaisa mitrums veicina miltrasu." },
    ],
  },
  {
    id: "vidzeme",
    name: "Vidzeme",
    nameLocative: "Vidzemē",
    climate: "augstiene",
    climateLabel: "Augstienes klimats",
    lastFrost: "28. maijs",
    lastFrostDate: { month: 5, day: 28 },
    growingDays: 175,
    lat: 57.31, // Cēsis
    lon: 25.27,
    summary:
      "Izteiktas reljefa svārstības. Ziemeļvidzemē salnas var atgriezties pat jūnija sākumā.",
    challenges: [
      { icon: "ac_unit", text: "Vēlas pavasara salnas augstienēs." },
      { icon: "thermostat", text: "Īsāka un vēsāka veģetācijas sezona." },
    ],
  },
  {
    id: "zemgale",
    name: "Zemgale",
    nameLocative: "Zemgalē",
    climate: "kontinentals",
    climateLabel: "Kontinentāls klimats",
    lastFrost: "15. maijs",
    lastFrostDate: { month: 5, day: 15 },
    growingDays: 185,
    lat: 56.65, // Jelgava
    lon: 23.71,
    summary:
      "Auglīgā Zemgales līdzenuma melnzeme — Latvijas labākā lauksaimniecības zeme ar siltām vasarām.",
    challenges: [
      { icon: "water_drop", text: "Sausuma periodi vasaras vidū." },
      { icon: "grass", text: "Smagas mālainas augsnes vietām." },
    ],
  },
  {
    id: "latgale",
    name: "Latgale",
    nameLocative: "Latgalē",
    climate: "kontinentals",
    climateLabel: "Kontinentāls klimats",
    lastFrost: "20. maijs",
    lastFrostDate: { month: 5, day: 20 },
    growingDays: 165,
    lat: 55.87, // Daugavpils
    lon: 26.52,
    summary:
      "Ezeru zeme ar izteikti kontinentālu klimatu — aukstākās ziemas un karstas, īsas vasaras.",
    challenges: [
      { icon: "ac_unit", text: "Bargas ziemas, vēlas pavasara salnas." },
      { icon: "wb_sunny", text: "Strauja sasilšana — ātri jāizmanto sējas logi." },
    ],
  },
  {
    id: "pieriga",
    name: "Pierīga",
    nameLocative: "Pierīgā",
    climate: "jura",
    climateLabel: "Jūras ietekmes klimats",
    lastFrost: "10. maijs",
    lastFrostDate: { month: 5, day: 10 },
    growingDays: 190,
    lat: 56.95, // Rīga
    lon: 24.11,
    summary:
      "Rīgas līča ietekme mīkstina klimatu — silts mikroklimats ar garu veģetācijas sezonu.",
    challenges: [
      { icon: "apartment", text: "Pilsētas siltuma efekts maina sējas laikus." },
      { icon: "water", text: "Vietām augsts gruntsūdens līmenis." },
    ],
  },
];

export function getRegion(id: RegionId): Region {
  return REGIONS.find((r) => r.id === id) ?? REGIONS[0];
}

/** Nearest region to a coordinate (squared-degree distance is fine at this scale). */
export function nearestRegion(lat: number, lon: number): Region {
  let best = REGIONS[0];
  let min = Infinity;
  for (const r of REGIONS) {
    const d = (r.lat - lat) ** 2 + (r.lon - lon) ** 2;
    if (d < min) {
      min = d;
      best = r;
    }
  }
  return best;
}
