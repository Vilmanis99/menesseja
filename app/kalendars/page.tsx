"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { moonForDate } from "@/lib/moon";
import { sowingDay, ELEMENT_META, moonAscending, isRestDay, type Element, type PlantPart } from "@/lib/biodynamic";
import { CROPS, MONTHS_LV_FULL, ACTIVITY_META } from "@/lib/planting-crops";
import { cropPart } from "@/lib/crop-part";
import { cropEmoji } from "@/lib/crop-visual";
import { useMounted } from "@/lib/use-mounted";
import { DataNote } from "@/components/data-note";

const WEEKDAYS = ["P", "O", "T", "C", "Pk", "S", "Sv"]; // Mon-first
const ELEMENT_DOT: Record<Element, string> = {
  zeme: "bg-secondary",
  udens: "bg-primary",
  gaiss: "bg-tertiary",
  uguns: "bg-error",
};

/** Monday-first weekday index (0=Mon..6=Sun) */
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7;
}

// Only sowing/planting actions belong on a "what to sow today" list — NOT harvest.
const SOW_KEYS = ["sowIndoors", "sowOutdoors", "transplant"] as const;

interface DayCrop {
  id: string;
  name: string;
  action: string; // "Sēt telpās" | "Sēt" | "Stādīt"
}

/**
 * Crops you can sow/plant in this month whose grown-for part matches the day's
 * element-part (root day → root crops, fruit day → fruit crops, …).
 */
function cropsForDay(month: number, part: PlantPart): DayCrop[] {
  const out: DayCrop[] = [];
  for (const c of CROPS) {
    if (cropPart(c.id) !== part) continue;
    const key = SOW_KEYS.find((k) => {
      const r = c[k];
      return r && month >= r[0] && month <= r[1];
    });
    if (key) out.push({ id: c.id, name: c.name, action: ACTIVITY_META[key].label });
    if (out.length >= 6) break;
  }
  return out;
}

export default function KalendarsPage() {
  const mounted = useMounted();
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const lead = mondayIndex(first);
    const count = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= count; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [year, month]);

  const sel = sowingDay(selected);
  const selMoon = moonForDate(selected);
  const selElem = ELEMENT_META[sel.element];
  const suggestions = cropsForDay(selected.getMonth() + 1, sel.part);

  const sameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  if (!mounted) return null;

  return (
    <>
      <PageHeader
        eyebrow="Senču gudrība · Maria Thun"
        title="Mēness kalendārs"
        display
        subtitle="Katra diena nes sava elementa ritmu. Sēj saskaņā ar Mēness fāzi un zodiaka zīmi."
      />

      <DataNote variant="moon" className="mb-md" />

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        {/* Calendar grid */}
        <Card tone="low" elevated linen className="p-md lg:col-span-8">
          <div className="mb-md flex items-center justify-between">
            <button
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
            >
              <Icon name="chevron_left" />
            </button>
            <h2 className="text-headline-md capitalize text-on-surface">
              {MONTHS_LV_FULL[month]} {year}
            </h2>
            <button
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
            >
              <Icon name="chevron_right" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1 text-center text-label-sm uppercase text-on-surface-variant/70">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const sd = sowingDay(d);
              const m = moonForDate(d);
              const isSel = sameDay(d, selected);
              const isToday = sameDay(d, today);
              const rest = isRestDay(d);
              return (
                <button
                  key={i}
                  onClick={() => setSelected(d)}
                  className={`relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border transition-all hover:scale-105 ${
                    isSel
                      ? "border-primary bg-primary-container/30"
                      : "border-transparent bg-background/40 hover:border-primary/30"
                  }`}
                >
                  <span className={`text-label-sm ${isToday ? "font-bold text-secondary" : "text-on-surface"}`}>
                    {d.getDate()}
                  </span>
                  <MoonPhase phase={m.phase} size={18} glow={false} />
                  {rest ? (
                    <Icon name="block" size="11px" className="text-on-surface-variant/60" />
                  ) : (
                    <span className={`h-1.5 w-1.5 rounded-full ${ELEMENT_DOT[sd.element]}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Element legend */}
          <div className="mt-md flex flex-wrap gap-3 border-t border-outline-variant/10 pt-md">
            {(Object.keys(ELEMENT_META) as Element[]).map((e) => (
              <div key={e} className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                <span className={`h-2.5 w-2.5 rounded-full ${ELEMENT_DOT[e]}`} />
                {ELEMENT_META[e].label} · {ELEMENT_META[e].partLabel}
              </div>
            ))}
          </div>
        </Card>

        {/* Selected day detail */}
        <div className="flex flex-col gap-md lg:col-span-4">
          <Card tone="highest" elevated accent="primary" className="p-md">
            <div className="flex items-center gap-md">
              <MoonPhase phase={selMoon.phase} size={72} />
              <div>
                <p className="text-label-sm uppercase tracking-widest text-tertiary">
                  {sel.sign.symbol} {sel.sign.name}
                </p>
                <h3 className="text-headline-md text-on-surface">{selMoon.name}</h3>
                <p className="text-body-md text-on-surface-variant">
                  {Math.round(selMoon.illumination * 100)}% · {selMoon.waxing ? "augošs" : "dilstošs"}
                </p>
              </div>
            </div>
            {isRestDay(selected) ? (
              <div className="mt-md flex items-start gap-sm rounded-xl border border-outline-variant/30 bg-background/50 p-sm">
                <Icon name="block" className="text-on-surface-variant" />
                <div>
                  <p className="font-semibold text-on-surface">Nelabvēlīga diena (Mēness mezgls)</p>
                  <p className="mt-xs text-body-md text-on-surface-variant">
                    Biodinamikā šī ir atpūtas diena — labāk nesēt; vēro dārzu, ravē, plāno.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-md flex items-start gap-sm rounded-xl bg-background/50 p-sm">
                <Icon name={selElem.icon} className={selElem.color} />
                <div>
                  <p className="font-semibold text-on-surface">{selElem.label} · {sel.partLabel}</p>
                  <p className="mt-xs text-body-md text-on-surface-variant">{sel.advice}</p>
                </div>
              </div>
            )}
            <div className="mt-sm flex items-center gap-2 text-label-sm text-on-surface-variant">
              <Icon name={moonAscending(selected) ? "trending_up" : "trending_down"} size="16px" className="text-tertiary" />
              {moonAscending(selected)
                ? "Mēness kāpj — labvēlīgi sējai un ražas vākšanai (virszeme)"
                : "Mēness krīt — labvēlīgi stādīšanai un sakņu darbiem"}
            </div>
          </Card>

          <Card tone="container" className="p-md">
            <h4 className="mb-sm text-label-md uppercase tracking-wider text-on-surface">
              Ko sēt vai stādīt šajā dienā
            </h4>
            {suggestions.length ? (
              <div className="flex flex-col gap-2">
                {suggestions.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2"
                  >
                    <span className="text-lg leading-none">{cropEmoji(c.id)}</span>
                    <span className="text-body-md text-on-surface">{c.name}</span>
                    <span className="ml-auto text-label-sm text-primary">{c.action}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                {selected.getMonth() + 1 >= 11 || selected.getMonth() + 1 <= 2
                  ? "Sējas sezona vēl nav sākusies — laiks plānot un atpūsties."
                  : "Šajā mēnesī nav ko sēt šī elementa kultūrām — labs laiks kopšanai vai ražas novākšanai."}
              </p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
