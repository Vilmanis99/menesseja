"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

/** Correct Latvian numeric agreement for "kultūra". */
function kulturas(n: number): string {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return `${n} kultūra`;
  if (d >= 2 && d <= 9 && !(dd >= 12 && dd <= 19)) return `${n} kultūras`;
  return `${n} kultūru`;
}

export function SowingGuide() {
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

  const filtered = cat !== "all" || query.trim() !== "" || thisMonth;
  function reset() {
    setCat("all");
    setQuery("");
    setThisMonth(false);
  }

  // The page shell (H1, intro, full sowing table) is server rendered by
  // app/celvedis/page.tsx — this component is only the interactive filter + list.
  if (!mounted) return null;

  return (
    <>
      {/* Filters — the always-visible result count below keeps the search from
          feeling "dead" on mobile even when results sit under the keyboard. */}
      <Card tone="container" className="mb-lg p-md">
        <div className="mb-sm flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-2">
          <Icon name="search" size="20px" className="text-on-surface-variant" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoCapitalize="off"
            autoCorrect="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Meklē, piem., kāposti…"
            className="flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/60"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Notīrīt meklēšanu"
              className="shrink-0 text-on-surface-variant hover:text-on-surface"
            >
              <Icon name="close" size="20px" />
            </button>
          )}
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
        {/* Always-visible result feedback — the key fix so the search never feels
            "dead" even when the results are below the mobile keyboard. */}
        <div className="mt-sm flex items-center justify-between gap-2 text-label-sm">
          <span className={crops.length === 0 ? "text-secondary" : "text-on-surface-variant"}>
            {crops.length === 0 ? "Nav atrasts neviens" : `Atrasts: ${kulturas(crops.length)}`}
          </span>
          {filtered && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <Icon name="close" size="14px" /> Notīrīt
            </button>
          )}
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
        <Card tone="container" className="flex flex-col items-center gap-sm p-lg text-center">
          <Icon name="search_off" size="32px" className="text-on-surface-variant/50" />
          <p className="text-body-md text-on-surface">
            {query.trim()
              ? `Nav atrasta neviena kultūra pēc “${query.trim()}”.`
              : "Nav atrasta neviena kultūra ar šiem filtriem."}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Pārbaudi rakstību vai notīri filtrus. Meklē arī{" "}
            <Link href="/pukes" className="text-primary hover:underline">puķu sarakstā</Link> un{" "}
            <Link href="/augi" className="text-primary hover:underline">augu enciklopēdijā</Link>.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-label-md font-semibold text-on-primary"
          >
            <Icon name="refresh" size="16px" /> Rādīt visas kultūras
          </button>
        </Card>
      )}

      {/* Provenance moved below the list so it doesn't push the tool off-screen on mobile. */}
      <DataNote variant="planting" withSources className="mt-lg" />
    </>
  );
}
