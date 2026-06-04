import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { MONTH_SLUGS, MONTH_TIPS, canonical, SITE_NAME } from "@/lib/seo";
import { MONTHS_LV_FULL } from "@/lib/planting-crops";

export const metadata: Metadata = {
  title: "Ko sēt pa mēnešiem — dārza darbu kalendārs Latvijai",
  description:
    "Ko sēt, stādīt un novākt katrā mēnesī Latvijas dārzā. Izvēlies mēnesi un redzi visus dārza darbus + Mēness sējas dienas.",
  alternates: { canonical: canonical("/ko-set") },
};

export default function KoSetIndex() {
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
