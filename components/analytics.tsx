"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { analyticsAllowed, CONSENT_CHANGED_EVENT, track } from "@/lib/analytics";

// Public GA4 measurement ID — not a secret (it ships to the browser regardless).
const GA_ID = "G-HTRBSQVSGX";

/**
 * Google Analytics 4 (gtag.js).
 *  • Loaded `afterInteractive` so it never blocks first paint.
 *  • Skipped outside production, so local dev traffic doesn't pollute the stats.
 * The script is cross-origin (googletagmanager.com), so the service worker passes
 * it straight through — no caching, no interference.
 */
export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(analyticsAllowed());
    const changed = () => setAllowed(analyticsAllowed());
    window.addEventListener(CONSENT_CHANGED_EVENT, changed);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, changed);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const p = new URLSearchParams(window.location.search);
    if (p.get("utm_medium") === "organic_social") {
      track("social_visit", {
        source: p.get("utm_source") ?? "social",
        campaign: p.get("utm_campaign") ?? "unknown",
        content: p.get("utm_content") ?? "unknown",
      });
    }
  }, [allowed]);

  if (process.env.NODE_ENV !== "production" || !allowed) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script
        id="ahrefs-analytics"
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="VSYtbD2knOe7j3rYzA+qZA"
        strategy="afterInteractive"
      />
    </>
  );
}
