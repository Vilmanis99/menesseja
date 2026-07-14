"use client";

import Link from "next/link";
import { AddPlantButton } from "@/components/add-plant-sheet";
import { useGarden } from "@/components/garden-context";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export function GardenWelcome() {
  const { hydrated, hasExamples, clearExamples } = useGarden();
  if (!hydrated || !hasExamples) return null;

  return (
    <Card tone="highest" elevated accent="primary" className="mb-lg overflow-hidden">
      <div className="grid md:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.75fr)]">
        <div className="min-w-0 p-md sm:p-lg">
          <p className="text-label-sm uppercase tracking-[0.18em] text-secondary">Tavs dārzs bez reģistrācijas</p>
          <h2 className="mt-1 text-headline-lg-mobile text-on-surface md:text-headline-lg">Sāc ar vienu īstu augu</h2>
          <p className="mt-2 max-w-[36rem] text-body-lg leading-relaxed text-on-surface-variant">
            Zemāk redzi parauga dārzu. Pievieno savu pirmo augu, un paraugi pazudīs — paliks tavs kalendārs, darbi un piezīmes šajā ierīcē.
          </p>
          <ul className="mt-md grid gap-2 text-body-md text-on-surface-variant sm:grid-cols-3">
            <li className="flex items-center gap-2"><Icon name="no_accounts" size="19px" className="text-primary" /> Konts nav vajadzīgs</li>
            <li className="flex items-center gap-2"><Icon name="event_available" size="19px" className="text-primary" /> Aktuālie darbi</li>
            <li className="flex items-center gap-2"><Icon name="edit_note" size="19px" className="text-primary" /> Kopšanas pieraksti</li>
          </ul>
          <div className="mt-md flex flex-wrap items-center gap-4">
            <AddPlantButton label="Pievienot pirmo augu" onAdded={clearExamples} />
            <Link href="/macies" className="inline-flex min-h-11 items-center gap-1 text-label-md font-semibold text-primary hover:underline">
              Kā tas darbojas <Icon name="arrow_forward" size="17px" />
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-72 overflow-hidden border-l border-outline-variant/15 bg-surface-container md:block" aria-hidden="true">
          <div className="absolute -right-14 -top-14 h-56 w-56 rounded-full border border-primary/20" />
          <div className="garden-moon-glow absolute right-10 top-10 h-36 w-36 rounded-full bg-primary-container/25" />
          <Icon name="brightness_3" size="96px" className="absolute right-16 top-16 rotate-[-18deg] text-primary" />
          <div className="garden-landscape absolute inset-x-0 bottom-0 h-28" />
          <Icon name="potted_plant" size="72px" className="absolute bottom-10 left-14 text-secondary" />
          <Icon name="eco" size="46px" className="absolute bottom-16 right-16 rotate-12 text-primary" />
        </div>
      </div>
    </Card>
  );
}
