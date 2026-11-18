"use client";

import { useState } from "react";
import { exampleTransplantDate, seedlingSowingWindow } from "@/lib/seedling-sowing";
import { useMounted } from "@/lib/use-mounted";

const dateFormat = new Intl.DateTimeFormat("lv-LV", { timeZone: "UTC", dateStyle: "long" });
const labelClass = "flex min-w-0 flex-col gap-1 text-label-md text-on-surface-variant";
const inputClass = "min-h-11 w-full min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 text-body-md text-on-surface";

export function SeedlingSowingCalculator({ initialDate }: { initialDate: string }) {
  const mounted = useMounted();
  const [editedDate, setEditedDate] = useState<string | null>(null);
  const [fromEmergence, setFromEmergence] = useState(false);
  const [weeks, setWeeks] = useState({ min: "6", max: "8" });
  const [days, setDays] = useState({ min: "", max: "" });
  const transplant = editedDate ?? (mounted ? exampleTransplantDate() : initialDate);
  const window = seedlingSowingWindow(transplant, weeks, fromEmergence ? days : undefined);

  return (
    <div className="space-y-md rounded-xl border border-primary/30 bg-surface-container p-md">
      <fieldset disabled={!mounted} className="min-w-0 space-y-md">
        <legend className="sr-only">Dēstu sējas datuma aprēķins</legend>
        <div className="grid gap-sm sm:grid-cols-2">
          <label className={labelClass}>
            Plānotais izstādīšanas datums
            <input type="date" min="0001-01-01" max="9999-12-31" value={transplant} onChange={(e) => setEditedDate(e.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            No kura brīža skaitītas nedēļas?
            <select value={fromEmergence ? "emergence" : "sowing"} onChange={(e) => setFromEmergence(e.target.value === "emergence")} className={inputClass}>
              <option value="sowing">No sējas</option>
              <option value="emergence">No sadīgšanas</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-sm">
          <label className={labelClass}>
            Mazākais nedēļu skaits
            <input type="number" inputMode="numeric" min="1" max="52" step="1" value={weeks.min} onChange={(e) => setWeeks({ ...weeks, min: e.target.value })} className={inputClass} />
          </label>
          <label className={labelClass}>
            Lielākais nedēļu skaits
            <input type="number" inputMode="numeric" min="1" max="52" step="1" value={weeks.max} onChange={(e) => setWeeks({ ...weeks, max: e.target.value })} className={inputClass} />
          </label>
        </div>
        {fromEmergence && (
          <div className="grid grid-cols-2 gap-sm">
            <label className={labelClass}>
              Mazākais dīgšanas dienu skaits
              <input type="number" inputMode="numeric" min="1" max="365" step="1" value={days.min} onChange={(e) => setDays({ ...days, min: e.target.value })} className={inputClass} />
            </label>
            <label className={labelClass}>
              Lielākais dīgšanas dienu skaits
              <input type="number" inputMode="numeric" min="1" max="365" step="1" value={days.max} onChange={(e) => setDays({ ...days, max: e.target.value })} className={inputClass} />
            </label>
          </div>
        )}
      </fieldset>
      <div role="status" aria-live="polite" aria-atomic="true" className="rounded-lg bg-primary-container/25 p-sm">
        {"error" in window ? <p className="text-body-md text-on-surface">{window.error}</p> : (
          <>
            <p className="text-label-md text-on-surface-variant">Plānotais sējas laiks</p>
            <p className="text-headline-md text-primary">{dateFormat.formatRange(window.earliest, window.latest)}</p>
          </>
        )}
      </div>
      <noscript>Lai mainītu piemēra vērtības, ieslēdz JavaScript. Zemāk rakstā ir arī aprēķina formulas.</noscript>
    </div>
  );
}
