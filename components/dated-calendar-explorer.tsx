"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const CalendarExplorer = dynamic(() => import("./calendar-explorer").then((module) => module.CalendarExplorer));
const isOpen = () => window.location.hash === "#interaktivais-kalendars";
const initiallyClosed = () => false;

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

export function DatedCalendarExplorer({ year, month }: { year: number; month: number }) {
  const open = useSyncExternalStore(subscribe, isOpen, initiallyClosed);
  return (
    <section id="interaktivais-kalendars" aria-label="Interaktīvais kalendārs" className={`scroll-mt-24 print:!hidden ${open ? "block" : "hidden target:block"}`}>
      {open && <CalendarExplorer period={{ year, month }} />}
      <noscript><p className="mb-sm text-body-md text-on-surface-variant">Zemāk redzamas visas šī mēneša dienas. Lai izvēlētos dienu interaktīvajā skatā, ieslēdz JavaScript.</p></noscript>
    </section>
  );
}
