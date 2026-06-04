// Mēness Sēja — minimal offline service worker.
// Network-first for navigations (fresh content when online), cache fallback
// when offline; cache-first for static assets.
const CACHE = "meness-seja-v2";
const APP_SHELL = [
  "/", "/kalendars", "/celvedis", "/planotajs", "/dienasgramata", "/meness",
  "/macies", "/augi", "/manifest.webmanifest", "/icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Cache Google Fonts (Material Symbols CSS + woff2) so icons render offline
  if (FONT_HOSTS.includes(url.host)) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(request).then(
          (hit) =>
            hit ||
            fetch(request).then((res) => {
              if (res.ok || res.type === "opaque") c.put(request, res.clone());
              return res;
            }).catch(() => hit),
        ),
      ),
    );
    return;
  }

  if (url.origin !== self.location.origin) return; // skip weather/AI API etc.

  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
    );
    return;
  }

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
});
