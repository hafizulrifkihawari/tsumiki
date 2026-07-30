#!/usr/bin/env node
/*
 * scripts/generate-audio.js — one-time pre-render of every flashcard sentence
 * to an audio file using macOS's built-in `say` command, so the live site
 * ships a consistent Japanese voice instead of depending on each visitor's
 * device having one installed.
 *
 * Requires macOS with the target voice already downloaded (System Settings ->
 * Accessibility -> Spoken Content -> Manage Voices). Not part of the app's
 * runtime — this only needs to be re-run if data.js's sentences change.
 *
 * Usage: node scripts/generate-audio.js ["Kyoko (Enhanced)"]
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const VOICE = process.argv[2] || "Kyoko (Enhanced)";
const OUT_DIR = path.join(__dirname, "..", "audio");
const vm = require("vm");

function loadCards() {
  const ctx = { module: { exports: {} }, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "conjugate.js"), "utf8"), ctx);
  ctx.module = { exports: {} };
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "data.js"), "utf8"), ctx);
  return ctx.module.exports.CARDS;
}

function main() {
  const cards = loadCards();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let done = 0, skipped = 0, failed = 0;
  for (const c of cards) {
    const outPath = path.join(OUT_DIR, c.audioFile);
    if (fs.existsSync(outPath)) { skipped++; continue; }

    const tmpAiff = path.join(os.tmpdir(), `tts-${process.pid}-${done}.aiff`);
    try {
      execFileSync("say", ["-v", VOICE, "-o", tmpAiff, c.audioText], { stdio: "pipe" });
      execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", tmpAiff, outPath], { stdio: "pipe" });
      done++;
    } catch (err) {
      failed++;
      console.error("FAILED:", c.audioFile, c.audioText, "->", err.message.split("\n")[0]);
    } finally {
      if (fs.existsSync(tmpAiff)) fs.unlinkSync(tmpAiff);
    }
    if ((done + skipped + failed) % 50 === 0) {
      console.log(`progress: ${done + skipped + failed}/${cards.length}`);
    }
  }

  const manifest = cards.map((c) => c.audioFile);
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest));
  console.log(`Wrote audio/manifest.json (${manifest.length} entries)`);

  console.log(`\nDone. generated=${done} skipped(existing)=${skipped} failed=${failed} total=${cards.length}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
