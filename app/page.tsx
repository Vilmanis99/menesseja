import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TodayBanner } from "@/components/today-banner";
import { ThisWeek } from "@/components/this-week";
import { NationalTopsTeaser } from "@/components/national-tops-widget";
import { GardenOverview } from "@/components/garden-welcome";
import { TrackedLink } from "@/components/tracked-link";
import { Icon } from "@/components/ui/icon";
import { PortalSearchForm } from "@/components/portal-search-form";
import { HomeDiscovery } from "@/components/home-discovery";
import { Onboarding } from "@/components/onboarding";
import { og } from "@/lib/seo";

// The primary action must link to the current month in Riga on the first request after midnight.
export const revalidate = 0;

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
        eyebrow="Dārza kalendārs un padomi Latvijai"
        title="Dārzs katrā gadalaikā"
        subtitle="Mēneša darbi, augu audzēšana un praktiskas atbildes — vienuviet."
        display
        action={<TrackedLink href="#mans-darzs" source="home" placement="my-garden" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 px-md text-label-md font-semibold text-primary hover:bg-primary/10"><Icon name="nature_people" size="20px" /> Mans dārzs</TrackedLink>}
      />

      <PortalSearchForm />
      <HomeDiscovery date={new Date()} />

      <section id="mans-darzs" aria-labelledby="my-garden-heading" className="scroll-mt-20 md:scroll-mt-24">
        <GardenOverview />
        <TrackedLink href="/darza-darbi-sonedel" source="home" placement="weekly-plan" className="mb-lg inline-flex min-h-11 items-center gap-2 text-body-md font-semibold text-primary hover:underline">
          <Icon name="checklist" size="20px" /> Dārza darbi šonedēļ
        </TrackedLink>
        <details className="mb-md rounded-xl border border-outline-variant/30 px-sm">
          <summary className="min-h-11 cursor-pointer py-3 text-body-md font-semibold text-primary">Mēness kalendārs šai nedēļai</summary>
          <TodayBanner />
          <ThisWeek />
        </details>
        <div className="mb-md"><Onboarding /></div>
      </section>
      <NationalTopsTeaser />
    </>
  );
}
