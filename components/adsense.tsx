import Script from "next/script";

// Public AdSense publisher ID — ships to the browser regardless; not a secret.
const ADSENSE_CLIENT = "ca-pub-1169910140391869";

/**
 * Google AdSense loader (adsbygoogle.js).
 *  • Loaded `afterInteractive` so it never blocks first paint.
 *  • Skipped outside production, so it doesn't load on localhost (AdSense flags
 *    invalid traffic from dev/test).
 * Cross-origin (googlesyndication.com) → the service worker passes it straight
 * through. Actual ads only appear once ad units / Auto ads are enabled in the
 * AdSense dashboard and the site is approved; this loader also serves as the
 * site-verification snippet Google looks for.
 */
export function AdSense() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
