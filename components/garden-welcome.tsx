"use client";

import Link from "next/link";
import { useGarden } from "@/components/garden-context";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export function GardenWelcome() {
  const { hydrated, hasExamples } = useGarden();
  if (!hydrated || !hasExamples) return null;

  return (
    <Card tone="container" className="mb-md flex items-start gap-sm p-md">
      <Icon name="potted_plant" size="28px" className="shrink-0 text-primary" />
      <div>
        <h3 className="text-title-md text-on-surface">Iepazīsti dārzu ar parauga augiem</h3>
        <p className="mt-1 max-w-3xl text-body-md leading-relaxed text-on-surface-variant">
          Zemāk redzamie augi ir piemērs. Pievienojot savu pirmo augu, paraugus aizstās tavs dārzs.
          Vari sākt bez konta — pieraksti saglabāsies šajā ierīcē.
        </p>
        <Link href="/iestatijumi" className="mt-1 inline-flex min-h-11 items-center gap-1 text-body-md text-primary underline underline-offset-2">
          Izvēlēties dārza reģionu <Icon name="arrow_forward" size="17px" />
        </Link>
      </div>
    </Card>
  );
}
