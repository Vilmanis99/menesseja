import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { TodayBanner } from "@/components/today-banner";
import { AddPlantButton } from "@/components/add-plant-sheet";
import { DashboardReminders, GardenAreas } from "@/components/garden-dashboard";
import { ThisWeek } from "@/components/this-week";
import { HarvestSummary } from "@/components/harvest-summary";
import { AccountBanner } from "@/components/account-banner";
import { NationalTopsTeaser } from "@/components/national-tops-widget";
import { Icon } from "@/components/ui/icon";

export default function DarzsPage() {
  return (
    <>
      <PageHeader
        title="Mans dārzs"
        subtitle="Seko līdzi saviem augiem saskaņā ar dabas cikliem."
        action={<AddPlantButton />}
      />

      <AccountBanner />

      <Link
        href="/macies"
        className="mb-md flex items-center gap-2 rounded-xl border border-primary/30 bg-primary-container/15 px-md py-sm text-body-md text-primary-fixed transition-colors hover:bg-primary-container/25"
      >
        <Icon name="school" size="20px" className="text-primary" />
        Jauns šeit? Uzzini, kas ir Mēness sēja un kā lasīt kalendāru
        <Icon name="arrow_forward" size="18px" className="ml-auto" />
      </Link>

      <TodayBanner />
      <DashboardReminders />
      <ThisWeek />
      <HarvestSummary />
      <GardenAreas />
      <NationalTopsTeaser />
    </>
  );
}
