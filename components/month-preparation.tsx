import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { TrackedLink } from "@/components/tracked-link";
import { monthPlan } from "@/lib/month-plan";
import { MONTH_GUIDES } from "@/lib/month-guides";
import { MONTH_SLUGS, MONTHS_LV_LOCATIVE } from "@/lib/seo";

export function MonthChecklist({ month }: { month: number }) {
  const guide = MONTH_GUIDES[month];
  if (!guide) return null;
  return <section className="mb-lg" aria-labelledby="season-checklist">
    <h2 id="season-checklist" className="mb-sm text-headline-md text-on-surface">{guide.checklistTitle}</h2>
    <div className="grid gap-sm sm:grid-cols-3">
      {guide.checklist.map((item) => <Card key={item.title} tone="container" className="p-md">
        <Icon name={item.icon} className="text-primary" />
        <h3 className="mt-sm text-title-md text-on-surface">{item.title}</h3>
        <p className="mt-xs text-body-md text-on-surface-variant">{item.text}</p>
      </Card>)}
    </div>
    <TrackedLink href={`/ko-set/${MONTH_SLUGS[month - 1]}`} source="calendar" placement="month-checklist" className="mt-sm inline-flex min-h-11 items-center gap-2 text-body-md text-primary hover:underline">
      Pilns darbu ceļvedis un avoti {MONTHS_LV_LOCATIVE[month - 1]} <Icon name="arrow_forward" size="18px" />
    </TrackedLink>
  </section>;
}

export function MonthPreparation({ month }: { month: number }) {
  const plan = monthPlan(month);
  return <section className="mb-lg grid gap-sm sm:grid-cols-2" aria-label="Sagatavošanās un piederumi">
    <Card tone="container" className="p-md">
      <h2 className="text-title-md text-on-surface">Ko sagatavot laikus</h2>
      <p className="mt-xs text-body-md text-on-surface-variant">{plan.prepare}</p>
      <TrackedLink href="/raksti#pavasara-plans" source={`month:${month}`} placement="prepare" className="mt-sm inline-flex min-h-11 items-center gap-1 text-body-md text-primary hover:underline">Plāno pavasari <Icon name="arrow_forward" size="18px" /></TrackedLink>
    </Card>
    <Card tone="container" className="p-md">
      <h2 className="text-title-md text-on-surface">Pirms pirkuma</h2>
      <p className="mt-xs text-body-md text-on-surface-variant">{plan.supplies}</p>
      <TrackedLink href="/raksti#pirkumu-saraksts" source={`month:${month}`} placement="supplies" className="mt-sm inline-flex min-h-11 items-center gap-1 text-body-md text-primary hover:underline">Piederumu kontrolsaraksts <Icon name="arrow_forward" size="18px" /></TrackedLink>
    </Card>
  </section>;
}
