"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { MoonPhase } from "@/components/moon-phase";
import { moonForDate, phaseNameGenitive } from "@/lib/moon";
import { sowingDays, ELEMENT_META } from "@/lib/biodynamic";
import { useMounted } from "@/lib/use-mounted";

const SHORT_FMT = new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "short", weekday: "short" });
const SYNODIC = 29.530588853;

/** Next dates the moon crosses the four principal phases. */
function nextPrincipalPhases(from: Date) {
  const targets = [
    { frac: 0.0, name: "Jauns mēness", icon: "dark_mode" },
    { frac: 0.25, name: "Pirmais ceturksnis", icon: "brightness_2" },
    { frac: 0.5, name: "Pilns mēness", icon: "brightness_1" },
    { frac: 0.75, name: "Pēdējais ceturksnis", icon: "brightness_3" },
  ];
  const cur = moonForDate(from).phase;
  return targets.map((t) => {
    let delta = (t.frac - cur + 1) % 1;
    if (delta < 0.001) delta = 1; // already there → next cycle
    const date = new Date(from.getTime() + delta * SYNODIC * 86400000);
    return { ...t, date };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function MenessPage() {
  const mounted = useMounted();
  const today = useMemo(() => new Date(), []);
  const moon = moonForDate(today);
  const upcoming = useMemo(() => nextPrincipalPhases(today), [today]);
  const week = useMemo(() => sowingDays(today, 7), [today]);

  if (!mounted) return null;

  return (
    <>
      <PageHeader
        eyebrow="Debesu ritms"
        title="Mēness"
        display
        subtitle="Sekojiet Mēness ceļam pa zodiaku un sēklas dzīšanas ritmam."
      />

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        {/* Hero moon */}
        <Card tone="highest" elevated linen className="flex flex-col items-center justify-center gap-md p-lg text-center lg:col-span-5">
          <MoonPhase phase={moon.phase} size={200} />
          <div>
            <h2 className="text-headline-lg text-on-surface">{moon.name}</h2>
            <p className="mt-1 text-body-lg text-on-surface-variant">
              {Math.round(moon.illumination * 100)}% apgaismojums · {moon.waxing ? "augošs" : "dilstošs"}
            </p>
          </div>
        </Card>

        <div className="flex flex-col gap-md lg:col-span-7">
          {/* Upcoming phases */}
          <Card tone="container" className="p-md">
            <h3 className="mb-md text-label-md uppercase tracking-wider text-on-surface">
              Tuvākās fāzes
            </h3>
            <div className="grid grid-cols-2 gap-sm sm:grid-cols-4">
              {upcoming.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col items-center gap-2 rounded-xl border border-outline-variant/10 bg-background/40 p-sm text-center"
                >
                  <MoonPhase phase={p.frac} size={44} glow={false} />
                  <div>
                    <p className="text-label-sm font-semibold text-on-surface">{p.name}</p>
                    <p className="text-label-sm capitalize text-on-surface-variant">
                      {SHORT_FMT.format(p.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* This week's element days */}
          <Card tone="container" className="p-md">
            <h3 className="mb-md text-label-md uppercase tracking-wider text-on-surface">
              Šī nedēļa · elementu dienas
            </h3>
            <div className="space-y-2">
              {week.map((d) => {
                const elem = ELEMENT_META[d.element];
                return (
                  <div
                    key={d.date.toISOString()}
                    className="flex items-center gap-sm rounded-lg bg-background/40 p-sm"
                  >
                    <MoonPhase phase={moonForDate(d.date).phase} size={28} glow={false} />
                    <span className="w-28 text-body-md capitalize text-on-surface">
                      {SHORT_FMT.format(d.date)}
                    </span>
                    <Icon name={elem.icon} className={elem.color} size="20px" />
                    <span className="text-body-md text-on-surface-variant">
                      {d.sign.symbol} {d.sign.name} · {elem.label}
                    </span>
                    <span className="ml-auto text-label-sm font-semibold text-tertiary">
                      {d.partLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card tone="container" className="flex items-start gap-sm p-md">
            <Icon name="format_quote" className="text-primary-fixed" />
            <p className="text-body-md italic text-on-surface-variant">
              «{phaseNameGenitive(moon.phase)} laikā senči teica: sēj to, kas tev dārgs — Mēness vairo, ko zeme saņem.»
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
