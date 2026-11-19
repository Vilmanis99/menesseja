"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionLabel } from "@/components/ui/section-label";
import { useGarden } from "@/components/garden-context";
import { useRegion } from "@/components/region-context";
import { useWeather } from "@/lib/use-weather";
import { buildReminders } from "@/lib/reminders";
import { useMounted } from "@/lib/use-mounted";
import { plantDisplayName } from "@/lib/plant-display-name";
import { isGardenDate, LOG_META, plantStatus, type LogEntry, type Plant } from "@/lib/garden";
import { latviaDateKey } from "@/lib/day-anchor";
import { cropEmoji } from "@/lib/crop-visual";
import { PlantDetail } from "@/components/plant-detail";

const careDate = new Intl.DateTimeFormat("lv-LV", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Riga" });

export function DashboardReminders() {
  const mounted = useMounted();
  const { plants } = useGarden();
  const { region, weatherCoords } = useRegion();
  const weather = useWeather(weatherCoords);

  const reminders = useMemo(
    () => buildReminders({ plants: plants.filter((plant) => !plant.seed), region, weather: weather.data }),
    [plants, region, weather.data],
  );

  if (!mounted || reminders.length === 0) return null;

  return (
    <section className="mb-lg">
      <SectionLabel icon="notifications_active" className="mb-sm">
        Šodienas atgādinājumi
      </SectionLabel>
      <div className="custom-scrollbar -mx-gutter flex gap-md overflow-x-auto px-gutter pb-sm md:mx-0 md:px-0">
        {reminders.map((r) => (
          <Card
            key={r.id}
            tone="low"
            className={`flex min-w-[260px] items-start gap-md p-md ${
              r.tone === "secondary" ? "border-secondary/20" : ""
            }`}
          >
            <div className={`rounded-lg p-xs ${r.tone === "secondary" ? "bg-secondary/10" : "bg-primary-container/20"}`}>
              <Icon name={r.icon} className={r.tone === "secondary" ? "text-secondary" : "text-primary"} />
            </div>
            <div>
              <p className="font-bold text-on-surface">{r.title}</p>
              <p className="mt-1 text-body-md text-on-surface-variant">{r.meta}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function AreaCard({ area, plants }: { area: string; plants: Plant[] }) {
  const { removePlant, lastAddedId } = useGarden();
  const [detail, setDetail] = useState<Plant | null>(null);
  const newRef = useRef<HTMLButtonElement>(null);
  const today = latviaDateKey();

  // Scroll the freshly-added plant into view so the user sees the result
  useEffect(() => {
    if (newRef.current) newRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [lastAddedId]);

  return (
    <Card tone="high" elevated linen className="flex flex-col p-md">
      <div className="mb-md flex items-start justify-between">
        <div>
          <h3 className="text-headline-md text-on-surface">{area}</h3>
          <p className="text-on-surface-variant">
            {plants.length} {plants.length % 10 === 1 && plants.length % 100 !== 11 ? "augs" : "augi"}
          </p>
        </div>
      </div>
      <div className="space-y-sm">
        {plants.map((p) => {
          const st = plantStatus(p);
          const isNew = p.id === lastAddedId;
          const last = p.log?.reduce<LogEntry | undefined>((latest, entry) => (
            isGardenDate(entry.date, today) && (!latest || entry.date > latest.date) ? entry : latest
          ), undefined);
          return (
            <button
              key={p.id}
              ref={isNew ? newRef : undefined}
              onClick={() => setDetail(p)}
              aria-haspopup="dialog"
              className={`group/plant block min-h-11 w-full space-y-2 rounded-lg border border-outline-variant/30 bg-background/30 p-sm text-left transition-colors hover:border-primary/50 focus-visible:outline-primary ${
                isNew ? "ring-1 ring-primary/50" : ""
              }`}
            >
              <span className="flex items-baseline gap-2 text-body-md font-semibold text-on-surface">
                <span aria-hidden="true" className="shrink-0">{cropEmoji(p.cropId)}</span>
                <span className="min-w-0 [overflow-wrap:anywhere]">{plantDisplayName(p)}</span>
                {p.seed && <span className="text-label-sm font-normal text-on-surface-variant">Paraugs</span>}
              </span>
              {!p.seed && last && (
                <span className="block text-body-sm text-on-surface-variant">Pēdējais ieraksts · {LOG_META[last.type]?.label ?? "Kopšanas ieraksts"} · <time dateTime={last.date}>{careDate.format(new Date(last.date))}</time></span>
              )}
              {st.progress !== null && <span className="block text-label-sm text-on-surface-variant">{st.label}</span>}
              {st.progress !== null && <ProgressBar value={st.progress} tone={st.tone} glow={st.tone === "secondary"} />}
              <span className="flex items-center justify-between gap-2 text-label-md font-semibold text-primary">
                {p.seed ? "Aplūkot piemēru" : "Pierakstīt kopšanu"} <Icon name="chevron_right" size="18px" />
              </span>
            </button>
          );
        })}
      </div>
      {detail && (
        <PlantDetail
          plant={detail}
          onClose={() => setDetail(null)}
          onRemove={() => removePlant(detail.id)}
        />
      )}
    </Card>
  );
}

export function GardenAreas({ examples = false }: { examples?: boolean }) {
  const { plants } = useGarden();

  const byArea = useMemo(() => {
    const map = new Map<string, Plant[]>();
    for (const p of plants) {
      if (Boolean(p.seed) !== examples) continue;
      const list = map.get(p.area) ?? [];
      list.push(p);
      map.set(p.area, list);
    }
    return [...map.entries()];
  }, [plants, examples]);

  if (!byArea.length) return null;
  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
      {byArea.map(([area, list]) => (
        <AreaCard key={area} area={area} plants={list} />
      ))}
    </div>
  );
}
