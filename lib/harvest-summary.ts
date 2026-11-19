import { latviaDateKey } from "./day-anchor";
import { isGardenDate, type LogEntry, type Plant } from "./garden";

type Amounts = { kg?: number; gab?: number };
type HarvestRow = { plant: Plant; firstDate: string; amounts: Amounts; unlabelled: boolean };
type Season = { year: string; amounts: Amounts; rows: HarvestRow[] };

function addAmount(amounts: Amounts, entry: LogEntry) {
  if ((entry.unit === "kg" || entry.unit === "gab") && typeof entry.amount === "number" && Number.isFinite(entry.amount) && entry.amount >= 0) {
    amounts[entry.unit] = (amounts[entry.unit] ?? 0) + entry.amount;
  }
}

export function harvestSeasons(plants: Plant[], today = latviaDateKey()): Season[] {
  const seasons = new Map<string, Season>();
  for (const plant of plants) {
    if (plant.seed) continue;
    const rows = new Map<string, HarvestRow>();
    for (const entry of plant.log ?? []) {
      if (entry.type !== "raza" || !isGardenDate(entry.date, today)) continue;
      const year = entry.date.slice(0, 4);
      let season = seasons.get(year);
      if (!season) {
        season = { year, amounts: {}, rows: [] };
        seasons.set(year, season);
      }
      let row = rows.get(year);
      if (!row) {
        row = { plant, firstDate: entry.date, amounts: {}, unlabelled: false };
        rows.set(year, row);
        season.rows.push(row);
      }
      if (entry.date < row.firstDate) row.firstDate = entry.date;
      if (typeof entry.amount === "number" && Number.isFinite(entry.amount) && !entry.unit) row.unlabelled = true;
      addAmount(row.amounts, entry);
      addAmount(season.amounts, entry);
    }
  }
  for (const season of seasons.values()) season.rows.sort((a, b) => a.firstDate.localeCompare(b.firstDate));
  return [...seasons.values()].sort((a, b) => b.year.localeCompare(a.year));
}

const quantityFormat = new Intl.NumberFormat("lv-LV", { maximumFractionDigits: 10 });

export function harvestQuantities({ kg, gab }: Amounts): string {
  const labels: string[] = [];
  if (kg !== undefined) labels.push(`${quantityFormat.format(kg)} kg`);
  if (gab !== undefined) labels.push(`${quantityFormat.format(gab)} gab.`);
  return labels.join(" · ");
}
