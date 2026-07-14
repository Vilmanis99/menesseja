"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ANALYTICS_CONSENT_KEY, CONSENT_CHANGED_EVENT, CONSENT_OPEN_EVENT } from "@/lib/analytics";

type Choice = "granted" | "denied";

function storedChoice(): Choice | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function ConsentManager() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const choice = storedChoice();
    setAnalytics(choice === "granted");
    setOpen(choice === null);
    const reopen = () => {
      setAnalytics(storedChoice() === "granted");
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  function save(choice: Choice) {
    const previousChoice = storedChoice();
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    } catch {
      // A blocked storage API is treated like a rejection.
    }
    setAnalytics(choice === "granted");
    setOpen(false);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: choice }));
    // An external script cannot be reliably unloaded after it has executed.
    // Reloading on revocation guarantees the next page lifecycle contains no
    // Google or Ahrefs script at all.
    if (previousChoice === "granted" && choice === "denied") window.location.reload();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[300] p-sm md:left-64 md:p-md print:hidden" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="mx-auto max-w-2xl rounded-2xl border border-outline-variant/30 bg-surface-container-highest p-md shadow-2xl">
        <h2 id="consent-title" className="text-headline-md text-on-surface">Privātuma izvēle</h2>
        <p className="mt-1 text-body-md leading-relaxed text-on-surface-variant">
          Nepieciešamā ierīces glabātuve nodrošina dārzu un iestatījumus. Ar tavu atļauju izmantojam
          Google Analytics un Ahrefs, lai saprastu, kurš saturs palīdz. Reklāmas pašlaik ir izslēgtas.
          Vairāk lasi <Link href="/privatums" className="text-primary hover:underline">privātuma aprakstā</Link>.
        </p>

        {details && (
          <label className="mt-sm flex items-start gap-sm rounded-xl bg-surface-container p-sm">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary"
            />
            <span>
              <span className="block font-semibold text-on-surface">Analītika</span>
              <span className="text-body-sm text-on-surface-variant">Lapu skatījumi, lasīšanas iesaiste un pogu izmantošana. Nav nepieciešama vietnes darbībai.</span>
            </span>
          </label>
        )}

        <div className="mt-md flex flex-wrap justify-end gap-2">
          {!details && <Button variant="outline" onClick={() => setDetails(true)}>Iestatījumi</Button>}
          {details && <Button variant="outline" onClick={() => save(analytics ? "granted" : "denied")}>Saglabāt izvēli</Button>}
          <Button variant="outline" onClick={() => save("denied")}>Noraidīt</Button>
          <Button onClick={() => save("granted")}>Atļaut analītiku</Button>
        </div>
      </div>
    </div>
  );
}
