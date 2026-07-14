import { PageHeader } from "@/components/ui/page-header";
import { TodayBanner } from "@/components/today-banner";
import { AddPlantButton } from "@/components/add-plant-sheet";
import { DashboardReminders, GardenAreas } from "@/components/garden-dashboard";
import { ThisWeek } from "@/components/this-week";
import { HarvestSummary } from "@/components/harvest-summary";
import { NationalTopsTeaser } from "@/components/national-tops-widget";
import { GardenWelcome } from "@/components/garden-welcome";

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
      <DashboardReminders />
      <ThisWeek />
      <HarvestSummary />
      <GardenAreas />
      <NationalTopsTeaser />
    </>
  );
}
