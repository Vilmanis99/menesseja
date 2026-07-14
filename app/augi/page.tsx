import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CropLibrary, type CropTeaser } from "@/components/crop-library";
import { CROPS, CATEGORIES, MONTHS_LV_FULL, type Crop, type MonthRange } from "@/lib/planting-crops";
import { flowerSlugs } from "@/lib/flowers";
import { canonical, SITE_NAME } from "@/lib/seo";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Augu enciklopēdija — kad sēt un stādīt Latvijā",
  description:
    "Visas dārza kultūras: kad sēt, stādīt un novākt Latvijas klimatam, labākās Mēness dienas un kaimiņaugi. Dārzeņi, garšaugi, ogas un puķes.",
  alternates: { canonical: canonical("/augi") },
};

const MONTHS_LV_LOCATIVE = [
  "janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā",
  "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī",
];

function formatRange(range: MonthRange): string {
  return range[0] === range[1]
    ? MONTHS_LV_FULL[range[0] - 1]
    : `${MONTHS_LV_FULL[range[0] - 1]}–${MONTHS_LV_FULL[range[1] - 1]}`;
}

function includesMonth(range: MonthRange, month: number): boolean {
  return month >= range[0] && month <= range[1];
}

function plantingTiming(crop: Crop, currentMonth: number) {
  const options = [
    crop.sowIndoors && { label: "Sēj telpās", range: crop.sowIndoors },
    crop.sowOutdoors && { label: "Sēj vai stāda laukā", range: crop.sowOutdoors },
    crop.transplant && { label: "Stāda laukā", range: crop.transplant },
  ].filter((option): option is { label: string; range: MonthRange } => Boolean(option));

  const current = options.find((option) => includesMonth(option.range, currentMonth));
  const selected = current ?? options.sort((a, b) => a.range[0] - b.range[0])[0];

  return {
    timingLabel: selected?.label ?? "Daudzgadīgs augs",
    timing: selected ? formatRange(selected.range) : "kopj visu sezonu",
    isCurrent: Boolean(current),
  };
}

export default function AugiIndex() {
  const currentMonth = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Riga", month: "numeric" }).format(new Date()),
  );
  const flowerSet = new Set(flowerSlugs());
  const cropHref = (cropId: string) => flowerSet.has(cropId) ? `/pukes/${cropId}` : `/augi/${cropId}`;
  const teasers: CropTeaser[] = CROPS.map((crop) => {
    const category = CATEGORIES.find((item) => item.id === crop.category);
    const timing = plantingTiming(crop, currentMonth);
    return {
      id: crop.id,
      href: cropHref(crop.id),
      name: crop.name,
      category: crop.category,
      categoryLabel: category?.label ?? "Citi",
      aliases: crop.aliases,
      timingLabel: timing.timingLabel,
      timing: timing.timing,
      harvest: crop.harvest ? (crop.harvest[0] === crop.harvest[1] ? MONTHS_LV_FULL[crop.harvest[0] - 1] : `${MONTHS_LV_FULL[crop.harvest[0] - 1]}–${MONTHS_LV_FULL[crop.harvest[1] - 1]}`) : undefined,
      isCurrent: timing.isCurrent,
    };
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Augu enciklopēdija",
    inLanguage: "lv",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: canonical("/") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: CROPS.length,
      itemListElement: CROPS.map((crop, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crop.name,
        url: canonical(cropHref(crop.id)),
      })),
    },
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

      <CropLibrary crops={teasers} monthLabel={MONTHS_LV_LOCATIVE[currentMonth - 1]} />
    </div>
  );
}
