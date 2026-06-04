"use client";

import { useState } from "react";
import { getRegion, type RegionId, type ClimateType } from "@/lib/regions";
import { useRegion } from "@/components/region-context";
import { LATVIA_GEO, LATVIA_VIEWBOX } from "@/lib/latvia-geo";

/**
 * Geographically accurate, interactive map of Latvia's five planning regions.
 * Boundaries are the real administrative borders (geoBoundaries / Geoportal of
 * Latvia, CC BY 4.0) — the 43 territories dissolved into the 5 regions, projected
 * to an SVG viewBox. Regions are coloured by climate to match the legend.
 */
const CLIMATE_FILL: Record<ClimateType, string> = {
  jura: "var(--color-secondary)", // mērens jūras klimats
  kontinentals: "var(--color-primary)",
  augstiene: "var(--color-tertiary)",
};

export function LatviaMap() {
  const { regionId, setRegionId } = useRegion();
  const [hovered, setHovered] = useState<RegionId | null>(null);

  return (
    <svg
      viewBox={LATVIA_VIEWBOX}
      className="h-full w-full max-h-[460px]"
      role="img"
      aria-label="Latvijas reģionu karte — izvēlies reģionu"
    >
      {LATVIA_GEO.map((geo) => {
        const region = getRegion(geo.id);
        const fill = CLIMATE_FILL[region.climate];
        const active = geo.id === regionId;
        const hot = geo.id === hovered;
        return (
          <g
            key={geo.id}
            role="button"
            tabIndex={0}
            aria-label={`${region.name} — ${region.climateLabel}`}
            aria-pressed={active}
            className="cursor-pointer outline-none"
            onClick={() => setRegionId(geo.id)}
            onMouseEnter={() => setHovered(geo.id)}
            onMouseLeave={() => setHovered((h) => (h === geo.id ? null : h))}
            onFocus={() => setHovered(geo.id)}
            onBlur={() => setHovered((h) => (h === geo.id ? null : h))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setRegionId(geo.id);
              }
            }}
          >
            {geo.paths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={fill}
                fillOpacity={active ? 0.62 : hot ? 0.4 : 0.18}
                stroke={fill}
                strokeOpacity={active ? 1 : 0.55}
                strokeWidth={active ? 2.5 : 1.2}
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            ))}
            <text
              x={geo.label.x}
              y={geo.label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              paintOrder="stroke"
              stroke="var(--color-background)"
              strokeWidth={active ? 4 : 3}
              strokeLinejoin="round"
              className={`pointer-events-none select-none text-[19px] font-bold transition-all ${
                active ? "fill-on-surface" : hot ? "fill-on-surface" : "fill-on-surface-variant"
              }`}
              style={{ fontFamily: "var(--font-hanken)" }}
            >
              {active ? "★ " : ""}
              {region.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
