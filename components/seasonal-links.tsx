import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { seasonalLinks } from "@/lib/seasonal";
import { MONTH_SLUGS, MONTHS_LV_LOCATIVE } from "@/lib/seo";

export function SeasonalLinks({ month, includeSowing = true }: { month: number; includeSowing?: boolean }) {
  const links = [
    ...(includeSowing ? [{ href: `/ko-set/${MONTH_SLUGS[month - 1]}`, label: `Ko sēt un stādīt ${MONTHS_LV_LOCATIVE[month - 1]}` }] : []),
    ...seasonalLinks(month),
  ];
  return (
    <section className="mb-lg print:hidden">
      <h2 className="mb-sm text-headline-md text-on-surface">Sezonas padomi {MONTHS_LV_LOCATIVE[month - 1]}</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="flex min-h-14 items-center gap-2 rounded-xl border border-outline-variant/10 bg-surface-container px-md py-sm text-body-md text-on-surface hover:text-primary">
            <Icon name="arrow_forward" size="18px" className="shrink-0 text-primary" />{link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
