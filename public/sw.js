// Mēness Sēja — offline service worker (safe caching).
//
// Caching strategy, chosen to never trap a browser on a stale build:
//   • /api/*               → network-only, NEVER cached (a cached 503 or feed
//                            would otherwise go stale — this was a real bug).
//   • /_next/static/*      → cache-first (filenames are content-hashed, so they
//                            are immutable and can never be stale).
//   • Google Fonts         → cache-first (immutable; lets icons render offline).
//   • everything else      → network-first (HTML navigations + RSC payloads +
//     (HTML, RSC, images)    images), so a fresh deploy is picked up immediately;
//                            cache is only a fallback when offline.
//
// Bump CACHE on any strategy change so `activate` purges the previous (possibly
// poisoned) cache for already-installed clients.
const CACHE = "meness-seja-v3";
const APP_SHELL = [
  "/", "/kalendars", "/celvedis", "/meness", "/macies", "/augi",
  "/manifest.webmanifest", "/icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      // Don't let one bad URL fail the whole install — cache best-effort.
      .then((c) => Promise.allSettled(APP_SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Google Fonts (immutable) → cache-first so Material Symbols render offline.
  if (FONT_HOSTS.includes(url.host)) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(request).then(
          (hit) =>
            hit ||
            fetch(request)
              .then((res) => {
                if (res.ok || res.type === "opaque") c.put(request, res.clone());
                return res;
              })
              .catch(() => hit),
        ),
      ),
    );
    return;
  }

  if (url.origin !== self.location.origin) return; // weather/AI/other origins → browser default

  // API → always hit the network, never cache. A cached community feed or a
  // cached "db-not-configured" 503 would otherwise persist after the backend
  // comes online. Let the page's own fetch handle offline/errors.
  if (url.pathname.startsWith("/api/")) return;

  // Content-hashed build assets are immutable → cache-first (fast, never stale).
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Everything else (HTML navigations, RSC payloads, images) → network-first so
  // a new deploy is reflected immediately; fall back to cache (then "/") offline.
  e.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() =>
        caches
          .match(request)
          .then((r) => r || (request.mode === "navigate" ? caches.match("/") : undefined)),
      ),
  );
});
