import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/json-ld";
import { CROPS, CATEGORIES, MONTHS_LV_FULL } from "@/lib/planting-crops";
import { cropEmoji } from "@/lib/crop-visual";
import { canonical, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Augu enciklopēdija — kad sēt un stādīt Latvijā",
  description:
    "Visas dārza kultūras: kad sēt, stādīt un novākt Latvijas klimatam, labākās Mēness dienas un kaimiņaugi. Dārzeņi, garšaugi, ogas un puķes.",
  alternates: { canonical: canonical("/augi") },
};

function sowText(crop: (typeof CROPS)[number]): string {
  const r = crop.sowOutdoors ?? crop.sowIndoors ?? crop.transplant;
  if (!r) return "Daudzgadīgs";
  return r[0] === r[1] ? MONTHS_LV_FULL[r[0] - 1] : `${MONTHS_LV_FULL[r[0] - 1]}–${MONTHS_LV_FULL[r[1] - 1]}`;
}

export default function AugiIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Augu enciklopēdija",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <JsonLd data={jsonLd} />
      <header className="mb-lg">
        <p className="text-label-sm uppercase tracking-[0.2em] text-tertiary">Ko audzēt un kad</p>
        <h1 className="text-headline-lg-mobile text-primary md:text-display-lg">Augu enciklopēdija</h1>
        <p className="mt-xs max-w-2xl text-body-lg text-on-surface-variant">
          {CROPS.length} dārza kultūras Latvijas klimatam — kad sēt, stādīt un novākt, labākās Mēness
          dienas un kaimiņaugi.
        </p>
      </header>

      {CATEGORIES.map((cat) => {
        const crops = CROPS.filter((c) => c.category === cat.id);
        if (!crops.length) return null;
        return (
          <section key={cat.id} className="mb-lg">
            <h2 className="mb-sm text-headline-md text-on-surface">{cat.label}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {crops.map((c) => (
                <Link key={c.id} href={`/augi/${c.id}`}>
                  <Card tone="high" className="flex items-center gap-3 p-sm transition-colors hover:bg-surface-container-highest">
                    <span className="text-3xl leading-none">{cropEmoji(c.id)}</span>
                    <div className="min-w-0">
                      <p className="truncate text-body-md font-semibold text-on-surface">{c.name}</p>
                      <p className="text-label-sm text-on-surface-variant">Sēj: {sowText(c)}</p>
                    </div>
                    <Icon name="chevron_right" size="18px" className="ml-auto text-on-surface-variant" />
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
