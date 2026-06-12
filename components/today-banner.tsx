"use client";

import { useMemo } from "react";
import { MoonPhase } from "@/components/moon-phase";
import { Icon } from "@/components/ui/icon";
import { InfoTip } from "@/components/ui/info-tip";
import { Card } from "@/components/ui/card";
import { moonForDate } from "@/lib/moon";
import { sowingDay, ELEMENT_META, moonAscending, isRestDay } from "@/lib/biodynamic";
import { useRegion } from "@/components/region-context";
import { useWeather } from "@/lib/use-weather";
import { weatherMeta } from "@/lib/weather";
import { useMounted } from "@/lib/use-mounted";
import { namedaysFor } from "@/lib/vardadienas";

const DATE_FMT = new Intl.DateTimeFormat("lv-LV", {
  day: "numeric",
  month: "long",
  weekday: "long",
});

/**
 * The recurring "today" strip: current Moon phase, the biodynamic element-day
 * recommendation, and live air + soil temperature — all scoped to the region.
 */
export function TodayBanner() {
  const mounted = useMounted();
  const { region, weatherCoords, coords, geoStatus, requestLocation } = useRegion();
  const weather = useWeather(weatherCoords);
  const { moon, sow, today, ascending, rest } = useMemo(() => {
    const now = new Date();
    return { moon: moonForDate(now), sow: sowingDay(now), today: now, ascending: moonAscending(now), rest: isRestDay(now) };
  }, []);
  const elem = ELEMENT_META[sow.element];

  if (!mounted) return <Card tone="high" elevated className="mb-lg h-[150px] animate-pulse" />;

  const w = weather.data;
  const frost = w ? w.minTonightC < 1 : false;

  return (
    <Card tone="high" elevated linen className="mb-lg">
      <div className="flex flex-col gap-md p-md lg:flex-row lg:items-center">
        {/* Moon + date */}
        <div className="flex items-center gap-md">
          <MoonPhase phase={moon.phase} size={84} />
          <div>
            <p className="flex items-center gap-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
              {DATE_FMT.format(today)} · {region.name}
              {coords && <Icon name="my_location" size="14px" className="text-primary" />}
            </p>
            <h2 className="flex items-center gap-1 text-headline-md text-on-surface">
              {moon.name}
              <InfoTip
                text={
                  moon.waxing
                    ? "Augošs mēness (no jauna līdz pilnam): sulas ceļas uz augšu — labs laiks sēt to, kas aug virs zemes (lapas, augļi)."
                    : "Dilstošs mēness (no pilna līdz jaunam): enerģija iet saknēm — labs laiks sakņaugiem, ravēšanai un ražas vākšanai."
                }
              />
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {Math.round(moon.illumination * 100)}% apgaismojums ·{" "}
              {moon.waxing ? "augošs" : "dilstošs"}
            </p>
            {namedaysFor(today).length > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-label-sm text-tertiary">
                <Icon name="celebration" size="14px" />
                Vārda dienas: {namedaysFor(today).join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-outline-variant/20 lg:block" />

        {/* Element day */}
        <div className="flex flex-1 items-start gap-sm">
          <div className="rounded-lg bg-surface-variant/40 p-sm">
            <Icon name={elem.icon} className={elem.color} size="28px" />
          </div>
          <div>
            <p className="flex items-center gap-1 text-label-sm uppercase tracking-widest text-tertiary">
              {sow.sign.symbol} {sow.sign.name} · {elem.label} · {sow.partLabel}
              <InfoTip text={`Mēness šodien ir ${sow.sign.name} zīmē (${elem.label} elements). Tā ir ${sow.partLabel.toLowerCase()} diena — labvēlīga šai auga daļai. Uzzini vairāk sadaļā “Kas ir Mēness sēja?”.`} />
            </p>
            <p className="mt-1 text-body-lg font-semibold leading-snug text-on-surface">
              {rest ? "Biodinamikā uzskata par atpūtas dienu (Mēness mezgls) — laba diena vērot un kopt dārzu." : sow.advice}
            </p>
            <p className="mt-1 flex items-center gap-1 text-label-sm text-on-surface-variant">
              <Icon name={ascending ? "trending_up" : "trending_down"} size="14px" className="text-tertiary" />
              {ascending ? "Mēness kāpj" : "Mēness krīt"}
            </p>
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-outline-variant/20 lg:block" />

        {/* Weather */}
        <div className="flex shrink-0 items-center gap-md" role="status" aria-live="polite">
          {weather.status === "loading" && (
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Icon name="cloud_sync" className="animate-pulse" />
              <span className="text-body-md">Ielādē laikapstākļus…</span>
            </div>
          )}
          {weather.status === "error" && (
            <button
              onClick={weather.retry}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-on-surface-variant/80 hover:bg-surface-variant/40 hover:text-primary"
            >
              <Icon name="refresh" size="20px" />
              <span className="text-label-sm">Mēģināt vēlreiz</span>
            </button>
          )}
          {w && (
            <>
              <div className="text-center">
                <Icon name={weatherMeta(w.code).icon} className="text-tertiary" size="28px" />
                <p className="text-headline-md leading-tight text-on-surface">{Math.round(w.airC)}°</p>
                <p className="text-label-sm text-on-surface-variant">gaiss</p>
              </div>
              <div className="text-center">
                <Icon name="thermostat" className="text-secondary" size="28px" />
                <p className="text-headline-md leading-tight text-on-surface">{Math.round(w.soilC)}°</p>
                <p className="text-label-sm text-on-surface-variant">augsne</p>
              </div>
            </>
          )}
          {/* Use precise location */}
          {!coords && geoStatus !== "denied" && (
            <button
              onClick={requestLocation}
              disabled={geoStatus === "locating"}
              title="Izmantot manu atrašanās vietu"
              className="flex flex-col items-center gap-0.5 rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-variant/50 hover:text-primary disabled:opacity-50"
            >
              <Icon name="my_location" size="22px" className={geoStatus === "locating" ? "animate-pulse" : ""} />
              <span className="text-label-sm">{geoStatus === "locating" ? "Nosaka…" : "Mana vieta"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Frost warning ribbon */}
      {frost && (
        <div className="flex items-center gap-2 border-t border-error/30 bg-error-container/30 px-md py-sm">
          <Icon name="ac_unit" className="text-error" size="20px" />
          <p className="text-body-md text-on-error-container">
            Salnas brīdinājums — naktī {Math.round(w!.minTonightC)}°C. Apsedz jutīgos stādus.
          </p>
        </div>
      )}
    </Card>
  );
}
