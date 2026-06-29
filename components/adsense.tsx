// Public AdSense publisher ID — ships to the browser regardless; not a secret.
const ADSENSE_CLIENT = "ca-pub-1169910140391869";

/**
 * Google AdSense loader (adsbygoogle.js).
 *
 * Rendered as a PLAIN <script> (not next/script): React 19 hoists it into
 * <head> as a real, server-rendered tag that the AdSense verification crawler
 * can read in the raw HTML. (next/script `afterInteractive` only injects it
 * client-side via Next's loader, so the crawler couldn't verify the site.)
 *
 * Skipped outside production so it doesn't load on localhost (AdSense flags
 * dev/test as invalid traffic). Cross-origin → the service worker passes it
 * through. Ads only appear once units/Auto ads are enabled and the site is
 * approved; this tag also serves as the site-verification snippet.
 */
export function AdSense() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
