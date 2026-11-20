"use client";

import { useEffect, useState } from "react";
import { seedlingCalendarFile } from "@/lib/seedling-calendar";
import {
  exampleTransplantDate, readSeedlingPlanHash, seedlingPlanHash, seedlingSowingWindow,
  SEEDLING_CALCULATOR_HREF, SEEDLING_PLAN_NAME_MAX, type SeedlingPlan,
} from "@/lib/seedling-sowing";
import { useMounted } from "@/lib/use-mounted";

const cropExamples = [
  { slug: "paprika", name: "Paprika", min: "8", max: "10" },
  { slug: "selerijas", name: "Kātu un sakņu selerijas", min: "10", max: "12" },
  { slug: "lauvmutites", name: "Lauvmutītes", min: "8", max: "10" },
];

const dateFormat = new Intl.DateTimeFormat("lv-LV", { timeZone: "UTC", dateStyle: "long" });
const labelClass = "flex min-w-0 flex-col gap-1 text-label-md text-on-surface-variant";
const inputClass = "min-h-11 w-full min-w-0 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 text-body-md text-on-surface";

const [articlePath, calculatorId] = SEEDLING_CALCULATOR_HREF.split("#");
const calculatorHash = "#" + calculatorId;

function defaultPlan(transplant: string): SeedlingPlan {
  return { transplant, fromEmergence: false, weeks: { min: "6", max: "8" }, days: { min: "", max: "" }, name: "" };
}

function cropPlan(transplant: string, { name, min, max }: typeof cropExamples[number]): SeedlingPlan {
  return { ...defaultPlan(transplant), name, weeks: { min, max } };
}

export function SeedlingSowingCalculator({ initialDate }: { initialDate: string }) {
  const mounted = useMounted();
  const [plan, setPlan] = useState(() => defaultPlan(initialDate));
  const [invalidLink, setInvalidLink] = useState(false);
  const { transplant, fromEmergence, weeks, days, name } = plan;
  const result = seedlingSowingWindow(transplant, weeks, fromEmergence ? days : undefined);
  const hash = "error" in result ? null : seedlingPlanHash(plan);

  useEffect(() => {
    let hadSavedPlan = false;
    let frame = 0;
    function restore(initial: boolean) {
      const fragment = window.location.hash;
      const isPlanLink = fragment.startsWith(calculatorHash + "?");
      const example = cropExamples.find((crop) => fragment === calculatorHash + "-" + crop.slug);
      const saved = isPlanLink ? readSeedlingPlanHash(fragment) : null;
      setInvalidLink(isPlanLink && !saved);
      if (saved) {
        setPlan(saved);
      } else if (example) {
        setPlan((current) => cropPlan(initial ? exampleTransplantDate() : current.transplant, example));
      } else if (initial || isPlanLink || (hadSavedPlan && (!fragment || fragment === calculatorHash))) {
        setPlan(defaultPlan(exampleTransplantDate()));
      }
      hadSavedPlan = isPlanLink;
      window.cancelAnimationFrame(frame);
      if (isPlanLink || example) {
        frame = window.requestAnimationFrame(() => {
          document.getElementById(example ? fragment.slice(1) : calculatorId)?.scrollIntoView({ behavior: "instant", block: "start" });
        });
      }
    }
    const onHashChange = () => restore(false);
    restore(true);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function edit(values: Partial<SeedlingPlan>) {
    setInvalidLink(false);
    setPlan((current) => ({ ...current, ...values }));
  }

  function downloadCalendar() {
    if (!hash || "error" in result) return;
    const planUrl = "https://www.menesseja.lv" + articlePath + hash;
    const calendar = seedlingCalendarFile({ ...result, transplant, name, planUrl });
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "sejas-laiks-" + result.earliest.toISOString().slice(0, 10) + ".ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-md rounded-xl border border-primary/30 bg-surface-container p-md">
      <fieldset disabled={!mounted} className="min-w-0 space-y-md">
        <legend className="sr-only">Dēstu sējas datuma aprēķins</legend>
        {invalidLink && <p role="status" className="text-body-md text-on-surface-variant">Saglabāto aprēķinu neizdevās atjaunot. Redzams sākuma piemērs.</p>}
        <div className="grid gap-sm sm:grid-cols-2">
          <label className={labelClass}>
            Plānotais izstādīšanas datums
            <input type="date" min="0001-01-01" max="9999-12-31" value={transplant} onChange={(e) => edit({ transplant: e.target.value })} className={inputClass} />
          </label>
          <label className={labelClass}>
            No kura brīža skaitītas nedēļas?
            <select value={fromEmergence ? "emergence" : "sowing"} onChange={(e) => edit({ fromEmergence: e.target.value === "emergence" })} className={inputClass}>
              <option value="sowing">No sējas</option>
              <option value="emergence">No sadīgšanas</option>
            </select>
          </label>
        </div>
        <fieldset className="min-w-0">
          <legend className="mb-xs text-label-md font-semibold text-on-surface">Aizpildi ar auga piemēru</legend>
          <div className="flex flex-wrap gap-2">
            {cropExamples.map((crop) => (
              <button key={crop.slug} id={calculatorId + "-" + crop.slug} type="button" onClick={() => edit(cropPlan(transplant, crop))} className="min-h-11 scroll-mt-48 rounded-lg border border-primary/30 px-3 text-label-md font-semibold text-primary hover:bg-primary-container/25">
                {crop.name} ({crop.min}–{crop.max} nedēļas)
              </button>
            ))}
          </div>
        </fieldset>
        <label className={labelClass}>
          Augs vai šķirne (pēc izvēles)
          <input type="text" maxLength={SEEDLING_PLAN_NAME_MAX} value={name} onChange={(e) => edit({ name: e.target.value })} className={inputClass} />
        </label>
        <div className="grid grid-cols-2 gap-sm">
          <label className={labelClass}>
            Mazākais nedēļu skaits
            <input type="number" inputMode="numeric" min="1" max="52" step="1" value={weeks.min} onChange={(e) => edit({ weeks: { ...weeks, min: e.target.value } })} className={inputClass} />
          </label>
          <label className={labelClass}>
            Lielākais nedēļu skaits
            <input type="number" inputMode="numeric" min="1" max="52" step="1" value={weeks.max} onChange={(e) => edit({ weeks: { ...weeks, max: e.target.value } })} className={inputClass} />
          </label>
        </div>
        {fromEmergence && (
          <div className="grid grid-cols-2 gap-sm">
            <label className={labelClass}>
              Mazākais dīgšanas dienu skaits
              <input type="number" inputMode="numeric" min="1" max="365" step="1" value={days.min} onChange={(e) => edit({ days: { ...days, min: e.target.value } })} className={inputClass} />
            </label>
            <label className={labelClass}>
              Lielākais dīgšanas dienu skaits
              <input type="number" inputMode="numeric" min="1" max="365" step="1" value={days.max} onChange={(e) => edit({ days: { ...days, max: e.target.value } })} className={inputClass} />
            </label>
          </div>
        )}
      </fieldset>
      <div role="status" aria-live="polite" aria-atomic="true" className="rounded-lg bg-primary-container/25 p-sm">
        {"error" in result ? <p className="text-body-md text-on-surface">{result.error}</p> : (
          <>
            <p className="text-label-md text-on-surface-variant">Plānotais sējas laiks</p>
            <p className="text-headline-md text-primary">{dateFormat.formatRange(result.earliest, result.latest)}</p>
          </>
        )}
      </div>
      {mounted && hash && (
        <div className="flex flex-wrap items-center gap-sm">
          <button type="button" onClick={downloadCalendar} className="min-h-11 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary">
            Lejupielādēt sējas laiku (.ics)
          </button>
          <a href={hash} className="inline-flex min-h-11 items-center text-label-md font-semibold text-primary underline underline-offset-4">
            Saite uz šo aprēķinu
          </a>
        </div>
      )}
      <noscript>Lai mainītu piemēra vērtības, ieslēdz JavaScript. Zemāk rakstā ir arī aprēķina formulas.</noscript>
    </div>
  );
}
