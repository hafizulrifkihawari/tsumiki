/*
 * Tsumiki 積み木 — release version and offline asset list.
 *
 * Single source of truth: pages load this with <script src="version.js"> and
 * sw.js loads it with importScripts(). To ship a release, bump APP_VERSION
 * only — the service worker cache name derives from it, and shell.js compares
 * it against a no-store fetch of this same file to tell users when a newer
 * version is live.
 */
self.APP_VERSION = "43";
self.APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./version.js",
  "./shell.js",
  "./app.js",
  "./conjugate.js",
  "./romaji.js",
  "./data.js",
  "./srs.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./audio/manifest.json",
  "./kotoba.html",
  "./kotoba.css",
  "./kotoba-data.js",
  "./kotoba-app.js",
  "./kotoba-manage.html",
  "./kotoba-manage.css",
  "./kotoba-manage.js",
  "./manage.html",
  "./manage.js",
  "./bunpou.html",
  "./bunpou.css",
  "./bunpou-data.js",
  "./bunpou-quiz-data.js",
  "./bunpou-particle-data.js",
  "./bunpou-app.js",
  "./n4sim-data.js",
  "./n4sim.js",
  "./choukai-data.js",
  "./choukai.js",
  "./kotd.html",
  "./kotd.css",
  "./kotd-data.js",
  "./kotd.js"
];
