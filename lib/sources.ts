/**
 * Provenance for the data shown to users — the honest answer to
 * "no kurienes ņemta / vai uzticama". Surfaced via <DataNote/>.
 */

/** When the planting/frost data was last reviewed (YYYY-MM). */
export const DATA_REVIEWED = "2026-06";

export interface Source {
  label: string;
  url: string;
}

export const SOURCES: Source[] = [
  { label: "LLKC (Latvijas Lauku konsultāciju centrs)", url: "https://www.llkc.lv" },
  { label: "LVĢMC klimata normas (salnas)", url: "https://www.meteo.lv" },
  { label: "Maria Thun, “Aussaattage” (biodinamiskais kalendārs)", url: "https://www.mariathun.com" },
];

export const WEATHER_SOURCE: Source = { label: "Open-Meteo.com", url: "https://open-meteo.com" };

/** Honest one-liners reused wherever planting/moon data is asserted. */
export const PLANTING_PROVENANCE =
  "Sējas un ražas logi ir orientējoši, pielāgoti Latvijas klimatam — precīzie datumi atkarīgi no laikapstākļiem un tava reģiona. Pārbaudi savam dārzam.";

export const MOON_HEDGE =
  "Mēness sēja ir tradīcija, ne zinātnisks fakts — laikapstākļi un augsnes temperatūra ir svarīgāki. Uzzini vairāk.";
