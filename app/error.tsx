"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // surface in dev / monitoring
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-md py-xl text-center">
      <Icon name="cloud_off" size="56px" className="text-secondary" />
      <h1 className="text-headline-lg text-on-surface">Kaut kas nogāja greizi</h1>
      <p className="text-body-lg text-on-surface-variant">
        Atvaino — radās negaidīta kļūda. Mēģini vēlreiz vai atgriezies dārzā.
      </p>
      <div className="mt-sm flex gap-3">
        <Button icon="refresh" onClick={reset}>
          Mēģināt vēlreiz
        </Button>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-lg border border-primary px-md py-sm font-bold text-primary hover:bg-primary/10"
        >
          Uz dārzu
        </Link>
      </div>
    </div>
  );
}
