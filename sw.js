/* Service worker — offline cache for the Tsumiki 積み木 PWA. */

importScripts("version.js");

const CACHE_NAME = "tsumiki-v" + self.APP_VERSION;
const FONT_ORIGINS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
// Asset list lives in version.js so pages (Force Update) and this worker share it.
const ASSETS = self.APP_ASSETS;

// cache: "reload" skips the browser HTTP cache, so a new worker never stores
// a stale copy of a file that the HTTP cache still holds from the old release.
const fresh = (url) => new Request(url, { cache: "reload" });

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(ASSETS.map(fresh)).then(() =>
          // Pre-cache every pre-rendered audio clip so cards work offline
          // even before they've ever been played. The 聴解 clips live under
          // audio/choukai/<hash>.m4a with their own hash-list manifest. Both
          // are tolerant: a missing manifest (e.g. clips not generated yet) or
          // an offline first install just lets the fetch handler cache lazily.
          Promise.all([
            fetch(fresh("./audio/manifest.json"))
              .then((r) => r.json())
              .then((files) => cache.addAll(files.map((f) => fresh(`./audio/${f}`))))
              .catch(() => {}),
            fetch(fresh("./audio/choukai/manifest.json"))
              .then((r) => (r.ok ? r.json() : []))
              .then((hashes) => cache.addAll(hashes.map((h) => fresh(`./audio/choukai/${h}.m4a`))))
              .catch(() => {}),
          ])
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first for same-origin GET requests (plus the Google Fonts origins, so
// Noto Sans JP keeps working offline after the first successful load),
// falling back to network then cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = FONT_ORIGINS.includes(url.origin);
  if (!sameOrigin && !isFont) return;
  // The version check (shell.js) must always reach the network and must
  // never land in the cache — let the browser handle it directly.
  if (sameOrigin && url.pathname.endsWith("/version.js") && url.searchParams.has("check")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
