"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/lib/regions";
import { useRegion } from "@/components/region-context";

export default function IestatijumiPage() {
  const { regionId, setRegionId, region, coords, geoStatus, requestLocation } = useRegion();

  function clearData() {
    if (!confirm("Dzēst visus saglabātos datus (dārzs, plāns, dienasgrāmata)?")) return;
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("meness-seja:")) localStorage.removeItem(k);
    }
    location.reload();
  }

  return (
    <>
      <PageHeader title="Iestatījumi" subtitle="Pielāgo savu Mēness Sējas pieredzi." />

      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        {/* Region */}
        <Card tone="container" className="p-md">
          <h3 className="mb-sm flex items-center gap-sm text-headline-md text-on-surface">
            <Icon name="map" className="text-primary" size="22px" />
            Reģions
          </h3>
          <p className="mb-sm text-body-md text-on-surface-variant">
            Pašlaik: <span className="text-on-surface">{region.name}</span> · {region.climateLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <Chip key={r.id} tone="neutral" active={r.id === regionId} onClick={() => setRegionId(r.id)}>
                {r.name}
              </Chip>
            ))}
          </div>
        </Card>

        {/* Location */}
        <Card tone="container" className="p-md">
          <h3 className="mb-sm flex items-center gap-sm text-headline-md text-on-surface">
            <Icon name="my_location" className="text-primary" size="22px" />
            Atrašanās vieta
          </h3>
          <p className="mb-sm text-body-md text-on-surface-variant">
            {coords
              ? `Izmanto precīzu atrašanās vietu (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}) laikapstākļiem.`
              : "Atļauj atrašanās vietu, lai laikapstākļi un augsnes temperatūra būtu precīzi tavam dārzam."}
          </p>
          {geoStatus !== "denied" ? (
            <Button variant="outline" icon="my_location" onClick={requestLocation} disabled={geoStatus === "locating"}>
              {geoStatus === "locating" ? "Nosaka…" : coords ? "Atjaunot vietu" : "Izmantot manu vietu"}
            </Button>
          ) : (
            <p className="text-label-sm text-error">Atrašanās vieta liegta. Atļauj to pārlūka iestatījumos.</p>
          )}
        </Card>

        {/* Data */}
        <Card tone="container" className="p-md lg:col-span-2">
          <h3 className="mb-sm flex items-center gap-sm text-headline-md text-on-surface">
            <Icon name="database" className="text-primary" size="22px" />
            Dati
          </h3>
          <p className="mb-sm text-body-md text-on-surface-variant">
            Tavs dārzs, plāns un dienasgrāmata tiek glabāti tikai šajā ierīcē (localStorage).
            Atrašanās vieta glabājas ierīcē un tiek izmantota tikai laikapstākļu iegūšanai.
          </p>
          <div className="mb-sm flex flex-wrap gap-3 text-label-md">
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Laikapstākļi: Open-Meteo.com
            </a>
            <Link href="/par" className="text-primary hover:underline">Avoti un metodoloģija →</Link>
          </div>
          <Button variant="ghost" icon="delete_sweep" onClick={clearData}>
            Dzēst visus datus
          </Button>
        </Card>
      </div>
    </>
  );
}
