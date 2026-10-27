"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { MoonPhase } from "@/components/moon-phase";
import { REGIONS } from "@/lib/regions";
import { useRegion } from "@/components/region-context";
import { moonForDate } from "@/lib/moon";

/** Optional garden introduction; reading the site never requires setup. */
export function Onboarding() {
  const { regionId, setRegionId, requestLocation, geoStatus, coords } = useRegion();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const stepTitle = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (show) stepTitle.current?.focus();
  }, [show, step]);

  function finish() {
    setShow(false);
  }

  const phase = show ? moonForDate(new Date()).phase : 0;

  return (
    <>
      <Button variant="outline" icon="help_outline" onClick={() => { setStep(0); setShow(true); }}>Īsā pamācība</Button>
      {show && <Modal
        onClose={finish}
        labelledBy="garden-intro-title"
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
            <button onClick={finish} className="inline-flex min-h-11 items-center rounded-lg px-2 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-variant/40 hover:text-primary">
              Aizvērt pamācību
            </button>
          </div>

          {step === 0 && (
            <div className="flex flex-col items-center gap-md py-md text-center">
              <MoonPhase phase={phase} size={96} />
              <h2 ref={stepTitle} tabIndex={-1} id="garden-intro-title" className="text-headline-lg text-primary">Iepazīsti savu dārzu</h2>
              <p className="max-w-[20rem] text-body-lg text-on-surface-variant">
                Pievieno augus, seko sezonas darbiem un veido kopšanas pierakstus. Reģionu vari izvēlēties nākamajā solī vai vēlāk iestatījumos.
              </p>
              <Link href="/macies" onClick={() => setShow(false)} className="text-label-md text-primary underline-offset-2 hover:underline">
                Kas ir Mēness sēja? →
              </Link>
              <Button fullWidth icon="arrow_forward" onClick={() => setStep(1)} className="mt-sm">
                Izvēlēties reģionu
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-md py-sm">
              <div className="text-center">
                <Icon name="map" className="text-primary" size="40px" />
                <h2 ref={stepTitle} tabIndex={-1} id="garden-intro-title" className="mt-2 text-headline-md text-on-surface">Kur tu dārzo?</h2>
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
              <h2 ref={stepTitle} tabIndex={-1} id="garden-intro-title" className="text-headline-md text-on-surface">Viss gatavs!</h2>
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
      </Modal>}
    </>
  );
}
