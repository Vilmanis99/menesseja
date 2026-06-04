"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { REGIONS, CLIMATE_COLOR } from "@/lib/regions";
import { useRegion } from "@/components/region-context";
import { LatviaMap } from "@/components/latvia-map";

const LEGEND = [
  { tone: "bg-secondary", label: "Jūras klimats" },
  { tone: "bg-primary", label: "Kontinentāls" },
  { tone: "bg-tertiary", label: "Augstienes" },
];

export default function RegioniPage() {
  const { regionId, setRegionId, region, geoStatus, requestLocation } = useRegion();

  return (
    <>
      <PageHeader
        title="Izvēlies savu reģionu"
        subtitle="Latvijas mikroklimats ir dažāds. No Kurzemes maigajām brīzēm līdz Latgales kontinentālajām salnām — pielāgojiet savu dārza kalendāru precīziem sējas logiem."
        action={
          geoStatus !== "denied" ? (
            <Button
              variant="outline"
              icon="my_location"
              onClick={requestLocation}
              disabled={geoStatus === "locating"}
            >
              {geoStatus === "locating" ? "Nosaka…" : "Noteikt automātiski"}
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        {/* Map */}
        <Card tone="container" elevated className="relative flex min-h-[440px] flex-col p-md md:col-span-7 lg:col-span-8">
          <div className="linen-texture pointer-events-none absolute inset-0 opacity-[0.04]" />
          <div className="flex flex-1 items-center justify-center">
            <LatviaMap />
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 rounded-xl border border-outline/5 bg-surface-container-lowest/60 p-4 backdrop-blur-md">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${l.tone}`} />
                <span className="text-label-sm opacity-80">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Detail panel */}
        <div className="flex flex-col gap-6 md:col-span-5 lg:col-span-4">
          <Card tone="highest" elevated accent="secondary" className="p-md">
            <h3 className="mb-2 text-headline-lg text-secondary">{region.name}</h3>
            <p className="mb-4 inline-block rounded bg-secondary-container/30 px-2 py-1 text-label-md text-on-secondary-container">
              {region.climateLabel}
            </p>
            <p className="mb-md text-body-md text-on-surface-variant">{region.summary}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-outline/5 bg-surface-container-lowest p-3">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Pēdējā salna
                </span>
                <p className="mt-1 text-headline-md text-primary">{region.lastFrost}</p>
              </div>
              <div className="rounded-lg border border-outline/5 bg-surface-container-lowest p-3">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Augšanas dienas
                </span>
                <p className="mt-1 text-headline-md text-primary">{region.growingDays}</p>
              </div>
            </div>
          </Card>

          <Card tone="container" className="p-md">
            <h4 className="mb-4 text-label-md uppercase tracking-wider text-on-surface">
              Galvenie izaicinājumi
            </h4>
            <ul className="space-y-3">
              {region.challenges.map((c) => (
                <li key={c.text} className="flex items-start gap-3">
                  <Icon name={c.icon} className="mt-1 text-secondary-fixed" size="18px" />
                  <p className="text-body-md text-on-surface-variant">{c.text}</p>
                </li>
              ))}
            </ul>
            <Link
              href={`/regioni/${region.id}`}
              className="mt-md inline-flex items-center gap-1 text-label-md text-primary hover:underline"
            >
              Pilns dārza kalendārs {region.name} <Icon name="arrow_forward" size="16px" />
            </Link>
          </Card>
        </div>
      </div>

      {/* Quick list */}
      <section className="mt-lg">
        <h3 className="mb-md text-headline-md text-on-surface">Visi reģioni</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {REGIONS.map((r) => {
            const active = r.id === regionId;
            return (
              <button
                key={r.id}
                onClick={() => setRegionId(r.id)}
                className={`group flex items-center justify-between rounded-xl border p-4 transition-all ${
                  active
                    ? "border-primary/40 bg-surface-container-high"
                    : "border-outline-variant/10 bg-surface-container-low hover:bg-surface-container-high"
                }`}
              >
                <span className="flex items-center gap-2 text-label-md text-on-surface">
                  <span className={`h-2.5 w-2.5 rounded-full ${CLIMATE_COLOR[r.climate]}`} />
                  {r.name}
                </span>
                <Icon
                  name={active ? "check_circle" : "chevron_right"}
                  className={active ? "text-primary" : "text-on-surface-variant opacity-0 group-hover:opacity-100"}
                />
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
