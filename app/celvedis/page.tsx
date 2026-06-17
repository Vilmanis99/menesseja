"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { ActivityBar } from "@/components/activity-bar";
import {
  CROPS,
  CATEGORIES,
  ACTIVITY_KEYS,
  DIFFICULTY_LABEL,
  MONTHS_LV_FULL,
  type Category,
} from "@/lib/planting-crops";
import { cropPart, PART_ELEMENT } from "@/lib/crop-part";
import { ELEMENT_META, PART_GENITIVE } from "@/lib/biodynamic";
import { SOIL_TEMP_MIN } from "@/lib/sowing-thresholds";
import { useMounted } from "@/lib/use-mounted";
import { DataNote } from "@/components/data-note";

const DIFFICULTY_TONE: Record<1 | 2 | 3, string> = {
  1: "text-primary",
  2: "text-tertiary",
  3: "text-secondary",
};

export default function CelvedisPage() {
  const mounted = useMounted();
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);
  const [cat, setCat] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [thisMonth, setThisMonth] = useState(false);

  const crops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CROPS.filter((c) => {
      if (cat !== "all" && c.category !== cat) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (thisMonth && !ACTIVITY_KEYS.some((k) => {
        const r = c[k];
        return r && currentMonth >= r[0] && currentMonth <= r[1];
      })) return false;
      return true;
    });
  }, [cat, query, thisMonth, currentMonth]);

  if (!mounted) return null;

  return (
    <>
      <PageHeader
        eyebrow="Interaktīvais rīks"
        title="Sējas ceļvedis"
        display
        subtitle="Katras kultūras sējas, stādīšanas un ražas logi Latvijas klimatam — kopā ar labākajām Mēness dienām un augsnes siltumu."
      />

      <DataNote variant="planting" withSources className="mb-md" />

      {/* Filters */}
      <Card tone="container" className="mb-lg p-md">
        <div className="mb-sm flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-2">
          <Icon name="search" size="20px" className="text-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Meklēt kultūru…"
            className="flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="neutral" active={cat === "all"} onClick={() => setCat("all")}>
            Visi
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} tone="neutral" active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </Chip>
          ))}
          <span className="mx-1 w-px self-stretch bg-outline-variant/20" />
          <Chip tone="secondary" active={thisMonth} onClick={() => setThisMonth((v) => !v)}>
            Šomēnes ({MONTHS_LV_FULL[currentMonth - 1]})
          </Chip>
        </div>
      </Card>

      {/* Crop list */}
      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        {crops.map((crop) => {
          const part = cropPart(crop.id);
          const elem = ELEMENT_META[PART_ELEMENT[part]];
          const soil = SOIL_TEMP_MIN[crop.id];
          return (
            <Card key={crop.id} tone="high" elevated className="flex flex-col gap-sm p-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-headline-md text-on-surface">{crop.name}</h3>
                  <p className="text-label-sm text-on-surface-variant">
                    {CATEGORIES.find((c) => c.id === crop.category)?.label}
                    {crop.daysToHarvest ? ` • ${crop.daysToHarvest}` : ""}
                  </p>
                </div>
                <span className={`flex items-center gap-1 text-label-sm font-semibold ${DIFFICULTY_TONE[crop.difficulty]}`}>
                  <Icon name="eco" size="16px" />
                  {DIFFICULTY_LABEL[crop.difficulty]}
                </span>
              </div>

              <ActivityBar crop={crop} currentMonth={currentMonth} />

              {/* Moon day + soil + sun */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-variant/50 px-2.5 py-1 text-label-sm">
                  <Icon name={elem.icon} size="14px" className={elem.color} />
                  {PART_GENITIVE[elem.part]} diena
                </span>
                {soil !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-variant/50 px-2.5 py-1 text-label-sm text-on-surface-variant">
                    <Icon name="thermostat" size="14px" className="text-secondary" />
                    Augsne ≥{soil}°C
                  </span>
                )}
                {crop.sun && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-variant/50 px-2.5 py-1 text-label-sm text-on-surface-variant">
                    <Icon name="wb_sunny" size="14px" className="text-tertiary" />
                    {crop.sun}
                  </span>
                )}
              </div>

              {crop.note && (
                <p className="text-body-md italic text-on-surface-variant">{crop.note}</p>
              )}

              <Link
                href={`/augi/${crop.id}`}
                className="mt-auto inline-flex items-center gap-1 self-start text-label-md text-primary hover:underline"
              >
                Detalizēti par {crop.name.toLowerCase()} <Icon name="arrow_forward" size="16px" />
              </Link>
            </Card>
          );
        })}
      </div>

      {crops.length === 0 && (
        <Card tone="container" className="p-lg text-center">
          <p className="text-body-md text-on-surface-variant">Nav atrasta neviena kultūra.</p>
        </Card>
      )}
    </>
  );
}
