"use client";

import { Icon } from "@/components/ui/icon";

/** Print the current page (A4 styles in globals.css strip the app chrome).
 *  The older half of the Moon-calendar audience prints these — newspapers have
 *  published this exact format for decades. */
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container px-4 py-1.5 text-label-md text-on-surface transition-colors hover:border-primary/40 hover:text-primary print:hidden"
    >
      <Icon name="print" size="18px" />
      Drukāt A4
    </button>
  );
}
