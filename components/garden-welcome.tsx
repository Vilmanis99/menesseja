"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { AddPlantButton } from "@/components/add-plant-sheet";
import { useGarden } from "@/components/garden-context";
import { DashboardReminders, GardenAreas } from "@/components/garden-dashboard";
import { HarvestSummary } from "@/components/harvest-summary";
import { Icon } from "@/components/ui/icon";

export function GardenOverview() {
  const { plants, hydrated, hasExamples, clearExamples } = useGarden();
  const { user } = useAuth();
  const hasPlants = hydrated && plants.some((plant) => !plant.seed);

  return (
    <>
      <div className="mb-md">
        <h2 id="my-garden-heading" className="text-headline-lg-mobile text-on-surface md:text-headline-lg">Mans dārzs</h2>
        <p className="mt-1 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
          {hasPlants ? "Atver augu, lai pierakstītu laistīšanu vai ražu." : "Pievieno augu, ko audzē dobē, siltumnīcā vai uz palodzes. Te varēsi pierakstīt, kad to laistīji un cik ražas ievāci."}
        </p>
        <div className="mt-sm flex flex-wrap items-center gap-x-md gap-y-2">
          <AddPlantButton label={hydrated && !hasPlants ? "Pievienot pirmo augu" : "Pievienot augu"} handleDeepLink />

        </div>
        {hydrated && !hasPlants && !user && <p className="mt-2 text-body-md text-on-surface-variant">Vari sākt bez konta. Viesa pieraksti glabājas šajā pārlūkā.</p>}
      </div>

      {hasPlants && <>
        <section aria-labelledby="garden-plants-heading" className="mb-lg">
          <h3 id="garden-plants-heading" className="sr-only min-[360px]:not-sr-only min-[360px]:mb-sm min-[360px]:block min-[360px]:text-title-md min-[360px]:text-on-surface">Tavi augi</h3>
          <GardenAreas />
          <Link href="/dienasgramata" className="mt-2 inline-flex min-h-11 items-center gap-2 text-body-md text-primary underline underline-offset-4">
            <Icon name="menu_book" size="18px" /> Raža un piezīmes
          </Link>
        </section>
        <HarvestSummary />
        <DashboardReminders />
      </>}
      {hydrated && hasExamples && !hasPlants && (
        <details className="mb-lg rounded-xl border border-outline-variant/30 bg-surface-container-low px-sm">
          <summary className="min-h-11 cursor-pointer py-3 text-body-md font-semibold text-primary">Apskatīt dārza piemēru</summary>
          <p className="mb-sm text-body-md text-on-surface-variant">Šie ir parauga augi. Atver kādu, lai apskatītu tā kartīti.</p>
          <GardenAreas examples />
          <button type="button" onClick={clearExamples} className="my-1 inline-flex min-h-11 items-center text-body-md text-primary underline underline-offset-4">Noņemt paraugus</button>
        </details>
      )}
    </>
  );
}
