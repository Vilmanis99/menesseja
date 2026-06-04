"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionLabel } from "@/components/ui/section-label";
import { useGarden } from "@/components/garden-context";
import { cropById } from "@/lib/garden";
import { cropEmoji } from "@/lib/crop-visual";

/** Season harvest totals, aggregated from "raza" care-log entries across plants. */
export function HarvestSummary() {
  const { plants } = useGarden();

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of plants) {
      for (const l of p.log ?? []) {
        if (l.type === "raza" && l.amount) {
          map.set(p.cropId, (map.get(p.cropId) ?? 0) + l.amount);
        }
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [plants]);

  if (totals.length === 0) return null;
  const grand = totals.reduce((s, [, v]) => s + v, 0);

  return (
    <section className="mb-lg">
      <SectionLabel icon="agriculture" className="mb-sm">
        Raža šosezon
      </SectionLabel>
      <Card tone="container" className="p-md">
        <div className="mb-sm flex items-center gap-2">
          <Icon name="trophy" className="text-secondary" size="24px" />
          <p className="text-headline-md text-secondary">{grand.toFixed(1)} kg</p>
          <span className="text-body-md text-on-surface-variant">kopā</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {totals.map(([cropId, amount]) => (
            <span key={cropId} className="inline-flex items-center gap-1.5 rounded-full bg-background/50 px-3 py-1.5 text-body-md text-on-surface">
              <span className="text-base leading-none">{cropEmoji(cropId)}</span>
              {cropById(cropId)?.name} — <span className="font-semibold text-secondary">{amount.toFixed(1)} kg</span>
            </span>
          ))}
        </div>
      </Card>
    </section>
  );
}
