// Public Ahrefs Web Analytics site key — ships to the browser; not a secret.
const AHREFS_KEY = "VSYtbD2knOe7j3rYzA+qZA";

/**
 * Ahrefs Web Analytics (analytics.ahrefs.com).
 *
 * Rendered as a PLAIN <script> (not next/script): React 19 hoists it into
 * <head> as a real, server-rendered tag that the Ahrefs "Recheck installation"
 * crawler can read in the raw HTML — the same reason AdSense needed this.
 * Skipped outside production so local dev traffic isn't tracked. Cross-origin →
 * the service worker passes it straight through.
 */
export function AhrefsAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <script src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_KEY} async />
  );
}
