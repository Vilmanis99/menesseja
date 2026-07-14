"use client";

import { openConsentSettings } from "@/lib/analytics";

export function ConsentSettingsButton() {
  return <button type="button" onClick={openConsentSettings} className="inline-flex min-h-11 items-center rounded-lg px-1 text-label-md transition-colors hover:text-primary">Privātuma iestatījumi</button>;
}
