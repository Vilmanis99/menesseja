import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TodayBanner } from "@/components/today-banner";
import { AddPlantButton } from "@/components/add-plant-sheet";
import { DashboardReminders, GardenAreas } from "@/components/garden-dashboard";
import { ThisWeek } from "@/components/this-week";
import { HarvestSummary } from "@/components/harvest-summary";
import { NationalTopsTeaser } from "@/components/national-tops-widget";
import { GardenWelcome } from "@/components/garden-welcome";
import { TrackedLink } from "@/components/tracked-link";
import { Icon } from "@/components/ui/icon";
import { HomeDiscovery } from "@/components/home-discovery";
import { Onboarding } from "@/components/onboarding";
import { og } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Mēness Sēja — dārza darbi un sējas kalendārs Latvijā" },
  description: "Dārza darbi katram mēnesim, augu audzēšanas ceļveži un atbildes uz kopšanas problēmām. Mēness kalendārs un personīgā dārza pieraksti vienuviet.",
  alternates: { canonical: "/" },
  openGraph: og({ path: "/", title: "Mēness Sēja — dārza darbi Latvijā", description: "Mēneša darbi, augu audzēšana, praktiski padomi un tavs dārzs vienuviet.", type: "website" }),
};

export default function DarzsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Latvijas dārza almanahs"
        title="Dārzs katrā gadalaikā"
        subtitle="Mēneša darbi, augu audzēšana un praktiskas atbildes — vienuviet."
        display
        action={<TrackedLink href="#mans-darzs" source="home" placement="my-garden" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 px-md text-label-md font-semibold text-primary hover:bg-primary/10"><Icon name="nature_people" size="20px" /> Mans dārzs</TrackedLink>}
      />

      <HomeDiscovery date={new Date()} />

      <section id="mans-darzs" aria-labelledby="my-garden-heading" className="scroll-mt-24">
        <div className="mb-md flex flex-wrap items-center justify-between gap-sm">
          <div>
            <h2 id="my-garden-heading" className="text-headline-lg-mobile text-on-surface md:text-headline-lg">Mans dārzs</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">Tavi augi, kopšanas pieraksti un aktuālie darbi.</p>
          </div>
          <div className="flex flex-wrap gap-2"><AddPlantButton /><Onboarding /></div>
        </div>
        <GardenWelcome />
        <TodayBanner />
        <DashboardReminders />
        <ThisWeek />
        <HarvestSummary />
        <GardenAreas />
      </section>
      <NationalTopsTeaser />
    </>
  );
}
