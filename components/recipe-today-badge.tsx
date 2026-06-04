"use client";

import { Icon } from "@/components/ui/icon";
import { useMounted } from "@/lib/use-mounted";
import { sowingDay, ELEMENT_META, type PlantPart } from "@/lib/biodynamic";
import { moonForDate } from "@/lib/moon";
import type { RecipePhase, RecipeElement } from "@/lib/recipes";

const PART_LABEL: Record<PlantPart, string> = {
  saknes: "Saknes",
  lapas: "Lapas",
  ziedi: "Ziedi",
  augli: "Augļi",
};

function dayState(date: Date) {
  const part = ELEMENT_META[sowingDay(date).element].part;
  const waxing = moonForDate(date).waxing;
  return { part, phase: (waxing ? "augošs" : "dilstošs") as "augošs" | "dilstošs" };
}

function matches(date: Date, phase: RecipePhase, element: RecipeElement) {
  const s = dayState(date);
  const phaseOk = phase === "jebkurš" || phase === s.phase;
  const elementOk = element === "jebkurs" || element === s.part;
  return phaseOk && elementOk;
}

const LV_MONTHS = ["janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā", "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī"];

/** Shows whether *today* suits this recipe's traditional Moon timing, and if not,
 *  the next day that does. Client-only (date-dependent) to avoid hydration drift. */
export function RecipeTodayBadge({ phase, element }: { phase: RecipePhase; element: RecipeElement }) {
  const mounted = useMounted();
  if (!mounted) return null;

  // "jebkurš/jebkurs" both → anytime
  if (phase === "jebkurš" && element === "jebkurs") {
    return (
      <Badge tone="good" icon="check_circle">
        Šo var darīt jebkurā laikā — Mēness fāze nav būtiska.
      </Badge>
    );
  }

  const today = new Date();
  if (matches(today, phase, element)) {
    return (
      <Badge tone="good" icon="check_circle">
        Šodien ir piemērots laiks šai receptei pēc tradīcijas.
      </Badge>
    );
  }

  // find the next matching day within ~30 days
  let next: Date | null = null;
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (matches(d, phase, element)) {
      next = d;
      break;
    }
  }

  return (
    <Badge tone="wait" icon="schedule">
      Šodien nav ideāli pēc tradīcijas.
      {next ? ` Nākamā piemērotā diena: ${next.getDate()}. ${LV_MONTHS[next.getMonth()]}.` : ""}
    </Badge>
  );
}

function Badge({ tone, icon, children }: { tone: "good" | "wait"; icon: string; children: React.ReactNode }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border p-sm text-body-md ${
        tone === "good"
          ? "border-primary/30 bg-primary-container/15 text-primary-fixed"
          : "border-outline-variant/20 bg-surface-container text-on-surface-variant"
      }`}
    >
      <Icon name={icon} size="18px" className={tone === "good" ? "text-primary" : "text-on-surface-variant"} />
      <span>{children}</span>
    </div>
  );
}
