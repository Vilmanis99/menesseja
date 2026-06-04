"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionLabel } from "@/components/ui/section-label";
import { MoonPhase } from "@/components/moon-phase";
import { moonForDate } from "@/lib/moon";
import { sowingDays, ELEMENT_META } from "@/lib/biodynamic";
import { useMounted } from "@/lib/use-mounted";

const DAY_FMT = new Intl.DateTimeFormat("lv-LV", { weekday: "short", day: "numeric" });

/** Compact 7-day outlook: Moon phase + element-day (what each day favours). */
export function ThisWeek() {
  const mounted = useMounted();
  const days = useMemo(() => {
    const today = new Date();
    return sowingDays(today, 7).map((sd) => ({
      sd,
      moon: moonForDate(sd.date),
      isToday: sd.date.toDateString() === today.toDateString(),
    }));
  }, []);

  if (!mounted) return null;

  return (
    <section className="mb-lg">
      <SectionLabel icon="date_range" className="mb-sm">
        Šonedēļ dārzā
      </SectionLabel>
      <Card tone="container" className="p-sm">
        <div className="custom-scrollbar flex gap-2 overflow-x-auto">
          {days.map(({ sd, moon, isToday }) => {
            const elem = ELEMENT_META[sd.element];
            return (
              <div
                key={sd.date.toISOString()}
                className={`flex min-w-[88px] flex-1 flex-col items-center gap-1 rounded-xl p-2 text-center ${
                  isToday ? "bg-primary-container/30 ring-1 ring-primary/40" : "bg-background/40"
                }`}
              >
                <span className={`text-label-sm capitalize ${isToday ? "font-bold text-primary" : "text-on-surface-variant"}`}>
                  {DAY_FMT.format(sd.date)}
                </span>
                <MoonPhase phase={moon.phase} size={32} glow={false} />
                <Icon name={elem.icon} size="16px" className={elem.color} />
                <span className="text-label-sm text-on-surface">{sd.partLabel}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
