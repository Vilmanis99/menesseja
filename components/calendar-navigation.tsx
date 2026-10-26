import { TrackedLink } from "@/components/tracked-link";
import { Icon } from "@/components/ui/icon";
import { adjacentMonth } from "@/lib/seasonal";
import { MONTHS_LV_FULL } from "@/lib/planting-crops";

export function CalendarNavigation({ year, month, overview = false }: { year: number; month: number; overview?: boolean }) {
  const links = overview
    ? [{ ...adjacentMonth(year, month, 0), label: "Šis mēnesis" }, { ...adjacentMonth(year, month, 1), label: "Nākamais mēnesis" }]
    : [{ ...adjacentMonth(year, month, -1), label: "Iepriekšējais mēnesis" }, { ...adjacentMonth(year, month, 1), label: "Nākamais mēnesis" }];
  return <nav aria-label="Kalendāra mēneši" className="mb-lg grid grid-cols-2 gap-sm print:hidden">
    {links.map((link) => <TrackedLink key={link.href} href={link.href} source={`calendar:${year}-${month}`} placement="month-navigation" className="flex min-h-14 items-center justify-between gap-2 rounded-xl border border-outline-variant/20 bg-surface-container px-md py-sm text-on-surface hover:border-primary/50 hover:text-primary">
      <span><span className="block text-label-sm text-on-surface-variant">{link.label}</span><span className="text-body-md font-semibold capitalize">{MONTHS_LV_FULL[link.month - 1]} {link.year}</span></span>
      <Icon name="arrow_forward" size="20px" />
    </TrackedLink>)}
  </nav>;
}
