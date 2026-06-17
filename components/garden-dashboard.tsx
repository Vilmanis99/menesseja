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
import { cropById, plantStatus, type Plant } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";
import { PlantDetail } from "@/components/plant-detail";
import { AddPlantButton } from "@/components/add-plant-sheet";

export function DashboardReminders() {
  const mounted = useMounted();
  const { plants } = useGarden();
  const { region, weatherCoords } = useRegion();
  const weather = useWeather(weatherCoords);

  const reminders = useMemo(
    () => buildReminders({ plants, region, weather: weather.data }),
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
          const crop = cropById(p.cropId);
          const st = plantStatus(p);
          const isNew = p.id === lastAddedId;
          return (
            <button
              key={p.id}
              ref={isNew ? newRef : undefined}
              onClick={() => setDetail(p)}
              className={`group/plant w-full rounded-lg text-left transition-all hover:opacity-90 ${
                isNew ? "bg-primary-container/15 p-2 ring-1 ring-primary/50" : ""
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2 text-body-md">
                <span className="flex items-center gap-2 text-on-surface">
                  <span className="text-base leading-none">{cropEmoji(p.cropId)}</span>
                  {crop?.name ?? p.cropId}
                  {p.seed && (
                    <span className="rounded-full bg-surface-variant/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-on-surface-variant">
                      paraugs
                    </span>
                  )}
                </span>
                <span
                  className={
                    st.tone === "secondary"
                      ? "font-bold text-secondary"
                      : st.tone === "primary"
                        ? "text-primary-fixed"
                        : "text-on-surface-variant"
                  }
                >
                  {st.label}
                </span>
              </div>
              <ProgressBar value={st.progress} tone={st.tone} glow={st.tone === "secondary"} />
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

export function GardenAreas() {
  const { plants, hydrated, hasExamples, clearExamples } = useGarden();

  const byArea = useMemo(() => {
    const map = new Map<string, Plant[]>();
    for (const p of plants) {
      const list = map.get(p.area) ?? [];
      list.push(p);
      map.set(p.area, list);
    }
    return [...map.entries()];
  }, [plants]);

  if (hydrated && plants.length === 0) {
    return (
      <Card tone="high" elevated className="flex flex-col items-center gap-sm p-lg text-center">
        <Icon name="potted_plant" className="text-primary/40" size="48px" />
        <p className="text-body-lg text-on-surface">Tavs dārzs vēl ir tukšs.</p>
        <p className="text-body-md text-on-surface-variant">
          Pievieno pirmo augu, un mēs sekosim tā augšanai saskaņā ar Mēness ritmu.
        </p>
        {/* The header button scrolls out of view on mobile — act right here. */}
        <AddPlantButton />
      </Card>
    );
  }

  return (
    <section id="mans-darzs">
      <div className="mb-sm flex items-center justify-between">
        <SectionLabel icon="nature_people" iconClassName="text-primary">
          Mans dārzs
        </SectionLabel>
        {hasExamples && (
          <button
            onClick={clearExamples}
            className="flex items-center gap-1 text-label-sm text-on-surface-variant transition-colors hover:text-error"
          >
            <Icon name="delete_sweep" size="16px" /> Noņemt paraugus
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
        {byArea.map(([area, list]) => (
          <AreaCard key={area} area={area} plants={list} />
        ))}
      </div>
    </section>
  );
}
