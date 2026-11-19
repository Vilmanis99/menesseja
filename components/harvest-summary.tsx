"use client";

import { useMemo, useState } from "react";
import { useGarden } from "@/components/garden-context";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { harvestQuantities, harvestSeasons } from "@/lib/harvest-summary";
import { plantDisplayName } from "@/lib/plant-display-name";

const firstDateFormat = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", timeZone: "Europe/Riga" });

export function HarvestSummary() {
  const { plants } = useGarden();
  const seasons = useMemo(() => harvestSeasons(plants), [plants]);
  const [year, setYear] = useState("");
  const current = seasons.find((season) => season.year === year) ?? seasons[0];
  if (!current) return null;
  const total = harvestQuantities(current.amounts);

  return (
    <section className="mb-lg" aria-labelledby="harvest-summary-title">
      <div className="mb-sm flex flex-wrap items-center justify-between gap-2">
        <h2 id="harvest-summary-title" className="flex items-center gap-2 text-title-md text-on-surface">
          <Icon name="agriculture" className="text-secondary" size="20px" />
          Raža manā dārzā
        </h2>
        {seasons.length > 1 ? (
          <select aria-label="Ražas gads" value={current.year} onChange={(event) => setYear(event.target.value)} className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-md text-on-surface">
            {seasons.map((season) => <option key={season.year}>{season.year}</option>)}
          </select>
        ) : <span className="text-body-md text-on-surface-variant">{current.year}. gads</span>}
      </div>
      <Card tone="container" className="p-md">
        {total && <p className="mb-sm text-title-md text-secondary">Kopā {total}</p>}
        <ul className="divide-y divide-outline-variant/40">
          {current.rows.map(({ plant, firstDate, amounts, unlabelled }) => (
            <li key={plant.id} className="grid gap-1 py-3 first:pt-0 last:pb-0">
              <p className="font-semibold text-on-surface [overflow-wrap:anywhere]">{plantDisplayName(plant)}</p>
              <p className="text-body-md text-on-surface-variant">
                {plant.area} · Pirmā reģistrētā raža · <time dateTime={firstDate}>{firstDateFormat.format(new Date(firstDate))}</time>
              </p>
              {harvestQuantities(amounts) && <p className="text-body-md text-secondary">{harvestQuantities(amounts)}</p>}
              {unlabelled && <p className="text-label-md text-on-surface-variant">Daudzums bez mērvienības redzams auga pierakstos.</p>}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
