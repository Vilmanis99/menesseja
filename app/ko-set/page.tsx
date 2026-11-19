import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { MONTH_SLUGS, MONTH_TIPS, MONTHS_LV_LOCATIVE, canonical, SITE_NAME } from "@/lib/seo";
import { MONTHS_LV_FULL } from "@/lib/planting-crops";
import { latviaDateParts } from "@/lib/day-anchor";
import { SEEDLING_CALCULATOR_HREF } from "@/lib/seedling-sowing";

// The featured guide follows the request’s current Latvian month.
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Ko sēt pa mēnešiem — dārza darbu kalendārs Latvijai",
  description:
    "Ko sēt, stādīt un novākt katrā mēnesī Latvijas dārzā. Izvēlies mēnesi un redzi visus dārza darbus + Mēness sējas dienas.",
  alternates: { canonical: canonical("/ko-set") },
};

export default function KoSetIndex() {
  const { month } = latviaDateParts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ko sēt pa mēnešiem",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };
  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd data={jsonLd} />
      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Dārza darbu kalendārs</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Ko sēt pa mēnešiem</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          Izvēlies mēnesi un redzi, ko Latvijā sēt, stādīt un novākt — kopā ar sezonas padomiem un
          Mēness sējas dienām.
        </p>
        <div className="mt-sm flex flex-wrap gap-x-md">
          <Link href={`/ko-set/${MONTH_SLUGS[month - 1]}`} className="inline-flex min-h-11 items-center gap-1 text-label-md font-semibold text-primary hover:underline">
            Dārza darbi {MONTHS_LV_LOCATIVE[month - 1]} <Icon name="arrow_forward" size="16px" />
          </Link>
          <Link href={SEEDLING_CALCULATOR_HREF} className="inline-flex min-h-11 items-center gap-1 text-label-md font-semibold text-primary hover:underline">
            Aprēķināt dēstu sējas laiku <Icon name="arrow_forward" size="16px" />
          </Link>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {MONTH_SLUGS.map((s, i) => (
          <Link key={s} href={`/ko-set/${s}`}>
            <Card tone="high" className="flex h-full items-start gap-3 p-md transition-colors hover:bg-surface-container-highest">
              <Icon name="calendar_month" className="mt-0.5 text-primary" size="22px" />
              <div>
                <p className="text-headline-md capitalize text-on-surface">{MONTHS_LV_FULL[i]}</p>
                <p className="line-clamp-2 text-label-sm text-on-surface-variant">{MONTH_TIPS[i]}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
