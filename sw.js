/* Service worker — offline cache for the N4 flashcard PWA. */

const CACHE_NAME = "kanji-n4-v7";
const FONT_ORIGINS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./conjugate.js",
  "./romaji.js",
  "./data.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./audio/manifest.json",
  "./kotoba.html",
  "./kotoba.css",
  "./kotoba-data.js",
  "./kotoba-app.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(ASSETS).then(() =>
          // Pre-cache every pre-rendered audio clip so cards work offline
          // even before they've ever been played.
          fetch("./audio/manifest.json")
            .then((r) => r.json())
            .then((files) => cache.addAll(files.map((f) => `./audio/${f}`)))
            .catch(() => {}) // offline on first install: audio caches lazily via fetch handler instead
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
