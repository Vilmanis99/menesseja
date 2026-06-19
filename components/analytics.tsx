import Script from "next/script";

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
  if (process.env.NODE_ENV !== "production") return null;
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
    </>
  );
}
