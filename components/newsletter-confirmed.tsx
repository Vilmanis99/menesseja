"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { track, analyticsAllowed, CONSENT_CHANGED_EVENT } from "@/lib/analytics";
import { MONTH_SLUGS, MONTHS_LV_LOCATIVE } from "@/lib/seo";

export function NewsletterConfirmed({ month }: { month: number }) {
  useEffect(() => {
    let recorded = false;
    const recordView = () => {
      if (recorded || !analyticsAllowed()) return;
      // This redirect page is public: a visit alone cannot verify Brevo DOI.
      track("newsletter_confirmation_view", { source: "doi_redirect" });
      recorded = true;
    };
    recordView();
    window.addEventListener(CONSENT_CHANGED_EVENT, recordView);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, recordView);
  }, []);
  return (
    <Card tone="highest" elevated accent="primary" className="mx-auto max-w-[36rem] p-lg text-center">
      <Icon name="mark_email_read" size="48px" className="text-primary" />
      <h1 className="mt-sm text-headline-lg text-on-surface">E-pasts apstiprināts</h1>
      <p className="mt-sm text-body-lg text-on-surface-variant">Paldies! Tavs sezonas ceļvedis drīz būs e-pastā. Tikmēr vari apskatīt aktuālos darbus vai pievienot pirmo augu savam dārzam.</p>
      <div className="mt-md flex flex-wrap justify-center gap-2">
        <Link href={`/ko-set/${MONTH_SLUGS[month - 1]}`} className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 py-3 text-label-md font-semibold text-on-primary">Dārza darbi {MONTHS_LV_LOCATIVE[month - 1]}</Link>
        <Link href="/?pievienot=izveleties" className="inline-flex min-h-11 items-center rounded-full border border-outline-variant/40 px-6 py-3 text-label-md font-semibold text-primary">Pievienot pirmo augu</Link>
      </div>
    </Card>
  );
}
