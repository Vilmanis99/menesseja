"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { MoonPhase } from "@/components/moon-phase";
import { REGIONS } from "@/lib/regions";
import { useRegion } from "@/components/region-context";
import { moonForDate } from "@/lib/moon";
import { storageGet, storageSet } from "@/lib/safe-storage";

const FLAG = "meness-seja:onboarded";

/** First-run 3-step intro: welcome → region → location, then never again. */
export function Onboarding() {
  const { regionId, setRegionId, requestLocation, geoStatus, coords } = useRegion();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  // Only greet on the app dashboard — never interrupt SEO content pages
  // (/augi, /kalendars/2026/…, /macies) where visitors arrive from Google.
  useEffect(() => {
    if (pathname === "/" && !storageGet(FLAG)) setShow(true);
  }, [pathname]);

  function finish() {
    storageSet(FLAG, "1");
    setShow(false);
  }

  if (!show) return null;
  const phase = moonForDate(new Date()).phase;

  return (
    <Modal
      onClose={finish}
      zClass="z-[200]"
      backdropClass="bg-background/80 backdrop-blur-md"
      dismissOnBackdrop={false}
      panelClassName="flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-t-2xl border border-outline-variant/20 bg-surface-container-high p-md shadow-2xl sm:max-w-[30rem] sm:rounded-2xl"
    >
      <>
        {/* progress dots */}
        <div className="mb-md flex items-center justify-between">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-surface-variant"}`}
              />
            ))}
          </div>
          <button onClick={finish} className="text-label-sm text-on-surface-variant hover:text-primary">
            Izlaist
          </button>
        </div>

        {step === 0 && (
          <div className="flex flex-col items-center gap-md py-md text-center">
            <MoonPhase phase={phase} size={96} />
            <h2 className="text-headline-lg text-primary">Mēness Sēja</h2>
            <p className="max-w-[20rem] text-body-lg text-on-surface-variant">
              Sēj un stādi saskaņā ar Mēnesi, laikapstākļiem un latviešu senču gudrību — vienkārši
              un Latvijas klimatam.
            </p>
            {/* Close WITHOUT the onboarded flag — the user hasn't picked a region
                yet, so the intro (and its region step) returns on the next visit. */}
            <Link href="/macies" onClick={() => setShow(false)} className="text-label-md text-primary underline-offset-2 hover:underline">
              Kas ir Mēness sēja? →
            </Link>
            <Button fullWidth icon="arrow_forward" onClick={() => setStep(1)} className="mt-sm">
              Sākt
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-md py-sm">
            <div className="text-center">
              <Icon name="map" className="text-primary" size="40px" />
              <h2 className="mt-2 text-headline-md text-on-surface">Kur tu dārzo?</h2>
              <p className="text-body-md text-on-surface-variant">
                Reģions nosaka sējas logus, salnas un laikapstākļus.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {REGIONS.map((r) => (
                <Chip key={r.id} tone="neutral" active={r.id === regionId} onClick={() => setRegionId(r.id)}>
                  {r.name}
                </Chip>
              ))}
            </div>
            <Button
              variant="outline"
              icon="my_location"
              onClick={requestLocation}
              disabled={geoStatus === "locating"}
            >
              {geoStatus === "locating" ? "Nosaka…" : coords ? "Atrašanās vieta atļauta ✓" : "Noteikt automātiski"}
            </Button>
            <Button fullWidth icon="arrow_forward" onClick={() => setStep(2)}>
              Tālāk
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-md py-md text-center">
            <Icon name="celebration" className="text-secondary" size="48px" />
            <h2 className="text-headline-md text-on-surface">Viss gatavs!</h2>
            <p className="max-w-[20rem] text-body-md text-on-surface-variant">
              Sākumlapā redzēsi šodienas Mēness fāzi un padomus. Pievieno savus augus ar pogu
              <strong className="text-on-surface"> “Pievienot augu”</strong>, un mēs sekosim to augšanai.
            </p>
            <Button fullWidth icon="check" onClick={finish}>
              Uz dārzu
            </Button>
          </div>
        )}
      </>
    </Modal>
  );
}
