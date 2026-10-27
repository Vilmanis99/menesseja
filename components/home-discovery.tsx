import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { TrackedLink } from "@/components/tracked-link";
import { calendarGuide } from "@/lib/calendar-guides";
import { contentImage } from "@/lib/content-images";
import { latviaDateParts } from "@/lib/day-anchor";
import { monthPlan } from "@/lib/month-plan";
import { adjacentMonth } from "@/lib/seasonal";
import { MONTHS_LV_LOCATIVE } from "@/lib/seo";

/** Public, server-rendered starting points alongside the personal garden. */
export function HomeDiscovery({ date }: { date: Date }) {
  const { year, month } = latviaDateParts(date);
  const current = adjacentMonth(year, month, 0);
  const next = adjacentMonth(year, month, 1);
  const guideHref = current.href.startsWith("/kalendars/") ? `${current.href}#menesa-darbi` : current.href;
  const nextHref = next.href.startsWith("/kalendars/") ? `${next.href}#menesa-darbi` : next.href;
  const plan = monthPlan(month);
  const guide = calendarGuide(month);
  const asset = contentImage(guide.image.id);
  const monthLabel = MONTHS_LV_LOCATIVE[month - 1];
  const routes = [
    { href: guideHref, icon: "calendar_month", title: `Darbi ${monthLabel}`, description: "Kad sākt, kā rīkoties un ko atlikt.", placement: "monthly-guide" },
    { href: "/augi", icon: "eco", title: "Atrodi savu augu", description: "Sēja, stādīšana un kopšana.", placement: "plant-library" },
    { href: "/raksti?kategorija=Probl%C4%93mas", icon: "search", title: "Atrisini auga problēmu", description: "Pazīmes, iespējamie cēloņi un rīcība.", placement: "problem-articles" },
  ];

  return (
    <>
      <nav aria-label="Ar ko sākt dārzā" className="mb-lg grid gap-2 lg:grid-cols-3 lg:gap-sm">
        {routes.map((route) => (
          <TrackedLink key={route.placement} href={route.href} source="home" placement={route.placement} className="group flex min-h-20 items-center gap-sm rounded-xl border border-outline-variant/20 bg-surface-container p-sm transition-colors hover:border-primary/50 hover:bg-surface-container-high">
            <Icon name={route.icon} size="26px" className="shrink-0 text-primary" />
            <span className="min-w-0 flex-1">
              <span className="block text-title-md text-on-surface">{route.title}</span>
              <span className="mt-1 block text-body-md text-on-surface-variant">{route.description}</span>
            </span>
            <Icon name="chevron_right" size="20px" className="shrink-0 text-primary" />
          </TrackedLink>
        ))}
      </nav>

      <section aria-labelledby="season-at-home" className="mb-lg overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center p-md lg:p-lg">
            <p className="text-label-sm uppercase tracking-[0.18em] text-tertiary">Šomēnes Latvijas dārzā · {year}</p>
            <h2 id="season-at-home" className="mt-2 text-headline-md text-on-surface md:text-headline-lg">{plan.title}</h2>
            <p className="mt-sm text-body-lg leading-relaxed text-on-surface-variant">{plan.action}</p>
            <div className="mt-md flex flex-wrap items-center gap-x-md gap-y-2">
              <TrackedLink href={guideHref} source="home" placement="season-feature" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-md py-sm text-label-md font-semibold text-on-primary hover:brightness-110">
                Skatīt mēneša darbus <Icon name="arrow_forward" size="18px" />
              </TrackedLink>
              <TrackedLink href={nextHref} source="home" placement="next-month" className="inline-flex min-h-11 items-center gap-1 text-body-md text-primary underline underline-offset-4">
                Plāns nākamajam mēnesim
              </TrackedLink>
            </div>
          </div>
          <figure className="border-t border-outline-variant/20 lg:border-l lg:border-t-0">
            <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes="(min-width: 1024px) 38vw, (min-width: 768px) calc(100vw - 352px), calc(100vw - 48px)" priority className="aspect-[3/2] w-full object-contain bg-surface-container" />
            <figcaption className="p-sm text-label-sm leading-relaxed text-on-surface-variant">
              <p>{guide.image.caption}</p>
              <p className="mt-2">Foto: {asset.author} · <a href={asset.sourceUrl} className="underline underline-offset-2">{asset.sourceName}</a> · <a href={asset.licenseUrl} className="underline underline-offset-2">{asset.license}</a>. {asset.changes}</p>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
