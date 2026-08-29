#!/usr/bin/env node
/*
 * scripts/build-kotd-widget-data.js — converts kotd-data.js's RAW array into
 * plain JSON bundled into both native widget targets (Android/iOS), so the
 * home-screen widgets can pick "today's" entry entirely on-device without
 * depending on the web app ever having been opened.
 *
 * Manual step, not part of any build pipeline (this repo doesn't have one) —
 * re-run this and rebuild both native targets whenever kotd-data.js's RAW
 * array changes. See the reminder comment at the top of kotd-data.js.
 *
 * Usage: node scripts/build-kotd-widget-data.js
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadRaw() {
  const ctx = { module: { exports: {} } };
  vm.createContext(ctx);
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "..", "kotd-data.js"), "utf8") + "\nmodule.exports = RAW;",
    ctx
  );
  return ctx.module.exports;
}

function main() {
  const RAW = loadRaw();
  const json = JSON.stringify(RAW);

  const targets = [
    path.join(__dirname, "..", "android", "app", "src", "main", "assets", "kotd-data.json"),
    path.join(__dirname, "..", "ios", "App", "KotdWidgetExtension", "kotd-data.json"),
  ];
  for (const t of targets) {
    fs.mkdirSync(path.dirname(t), { recursive: true });
    fs.writeFileSync(t, json);
    console.log("wrote", t, `(${RAW.length} entries)`);
  }
}

main();
