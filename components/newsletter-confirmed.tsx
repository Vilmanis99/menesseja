"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { track } from "@/lib/analytics";

export function NewsletterConfirmed() {
  useEffect(() => track("newsletter_confirmed", { source: "doi_redirect" }), []);
  return (
    <Card tone="highest" elevated accent="primary" className="mx-auto max-w-[36rem] p-lg text-center">
      <Icon name="mark_email_read" size="48px" className="text-primary" />
      <h1 className="mt-sm text-headline-lg text-on-surface">E-pasts apstiprināts</h1>
      <p className="mt-sm text-body-lg text-on-surface-variant">Paldies! Tavs sezonas ceļvedis drīz būs e-pastā. Tikmēr vari apskatīt aktuālos darbus vai pievienot pirmo augu savam dārzam.</p>
      <div className="mt-md flex flex-wrap justify-center gap-2">
        <Link href="/raksti/darza-darbi-augusta"><Button>Augusta darbi</Button></Link>
        <Link href="/?pievienot=tomati"><Button variant="outline">Pievienot pirmo augu</Button></Link>
      </div>
    </Card>
  );
}
