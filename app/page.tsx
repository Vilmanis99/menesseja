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

export default function DarzsPage() {
  return (
    <>
      <PageHeader
        title="Mans dārzs"
        subtitle="Seko līdzi saviem augiem saskaņā ar dabas cikliem."
        action={<AddPlantButton />}
      />

      <GardenWelcome />

      <TodayBanner />
      <TrackedLink href="/raksti" source="garden" placement="knowledge-hub" className="mb-lg flex min-h-14 items-center justify-between gap-md rounded-xl border border-primary/20 bg-surface-container p-md text-on-surface hover:border-primary/50">
        <span><span className="block text-title-md">Dārza zināšanu krātuve</span><span className="mt-xs block text-body-md text-on-surface-variant">Darbi visiem 12 mēnešiem, pavasara plāns un piederumu kontrolsaraksts.</span></span>
        <Icon name="arrow_forward" className="shrink-0 text-primary" />
      </TrackedLink>
      <DashboardReminders />
      <ThisWeek />
      <HarvestSummary />
      <GardenAreas />
      <NationalTopsTeaser />
    </>
  );
}
