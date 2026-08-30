#!/usr/bin/env node
/*
 * scripts/generate-choukai-audio.js — one-time pre-render of every spoken line
 * in the N4 聴解 (listening) mode to an audio file, so the live site ships a
 * fluent, natural Japanese voice with a DISTINCT voice per speaker role
 * (男性 / 女性 / ナレーター) instead of the device's single Web Speech voice.
 *
 * Engine: VOICEVOX (free, local). Start the VOICEVOX engine/app BEFORE running
 * this — it must be serving its HTTP API on http://127.0.0.1:50021. Confirm the
 * speaker style IDs below against `GET /speakers` on your install. This is a
 * build-time tool only — the app never touches it at runtime. Re-run it only
 * when choukai-data.js's spoken text changes.
 *
 * Clips are content-addressed: filename = fnv1a(speaker + "␟" + text). The
 * SAME hash is computed in choukai.js, so no IDs are threaded through the data
 * and re-runs only render new/changed lines.
 *
 * Usage:
 *   node scripts/generate-choukai-audio.js [speedScale]
 *   (speedScale default 1.0; e.g. 0.9 to slow the audio down for learners)
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");

const VOICEVOX = process.env.VOICEVOX_URL || "http://127.0.0.1:50021";
const SPEED_SCALE = parseFloat(process.argv[2]) || 1.0;
const OUT_DIR = path.join(__dirname, "..", "audio", "choukai");

// Speaker role -> VOICEVOX speaker (style) id. Confirm against `GET /speakers`.
//   M (男性) 青山龍星 ／ F (女性) 春日部つむぎ ／ N (ナレーター) 九州そら(ノーマル)
const ROLE_SPEAKER = { M: 13, F: 8, N: 16 };
const CREDIT = "VOICEVOX:青山龍星・春日部つむぎ・九州そら";

// FNV-1a (32-bit) — kept byte-for-byte identical to choukai.js so the browser
// recomputes the same filename without needing crypto.subtle's async API.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function loadSim() {
  const ctx = { module: { exports: {} }, console };
  vm.createContext(ctx);
  // choukai-data.js declares `const CHOUKAI_SIM = [...]` (no module.exports). A
  // top-level `const` does NOT attach to the context object, so read it from
  // the script's completion value by appending a trailing reference to it.
  const src = fs.readFileSync(path.join(__dirname, "..", "choukai-data.js"), "utf8");
  return vm.runInContext(src + "\nCHOUKAI_SIM;", ctx);
}

// Mirrors buildAudioLines() in choukai.js EXACTLY — the spoken text must match
// byte-for-byte or the runtime hash will not find the clip.
function buildAudioLines(q) {
  if (q.type === "task-comprehension" || q.type === "point-comprehension") {
    const seq = [{ speaker: "N", text: q.situation }];
    q.lines.forEach((l) => seq.push(l));
    seq.push({ speaker: "N", text: q.question });
    return seq;
  }
  if (q.type === "utterance-expression") {
    return q.options.map((o, i) => ({ speaker: "N", text: (i + 1) + "。" + o.text }));
  }
  // quick-response
  const seq = [q.stimulus];
  q.options.forEach((o, i) => seq.push({ speaker: "N", text: (i + 1) + "。" + o.text }));
  return seq;
}

// Every distinct spoken line across every set, de-duplicated by content hash.
function collectLines(sim) {
  const byHash = new Map();
  for (const set of sim) {
    for (const md of set.mondai) {
      for (const item of md.items) {
        const q = Object.assign({ type: md.type }, item);
        for (const line of buildAudioLines(q)) {
          const hash = fnv1a(line.speaker + "␟" + line.text);
          if (!byHash.has(hash)) byHash.set(hash, line);
        }
      }
    }
  }
  return byHash;
}

// The data spaces words apart for on-screen readability, but VOICEVOX treats
// every space as an accent-phrase boundary and inserts a pause there — which
// makes it read word-by-word. Strip the separator spaces before synthesis; the
// 、。 punctuation still gives natural pauses. (The clip hash stays on the
// original spaced text, so the runtime lookup in choukai.js is unaffected.)
function forTts(text) {
  return text.replace(/[ \t　]+/g, "");
}

async function synthWav(text, speakerId) {
  const q = await fetch(
    `${VOICEVOX}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
    { method: "POST" }
  );
  if (!q.ok) throw new Error(`audio_query ${q.status}`);
  const query = await q.json();
  query.speedScale = SPEED_SCALE;
  const s = await fetch(`${VOICEVOX}/synthesis?speaker=${speakerId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  if (!s.ok) throw new Error(`synthesis ${s.status}`);
  return Buffer.from(await s.arrayBuffer());
}

async function main() {
  const sim = loadSim();
  if (!Array.isArray(sim)) { console.error("CHOUKAI_SIM not found"); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const lines = collectLines(sim);
  const hashes = [...lines.keys()];
  let done = 0, skipped = 0, failed = 0, i = 0;

  for (const [hash, line] of lines) {
    i++;
    const outPath = path.join(OUT_DIR, hash + ".m4a");
    if (fs.existsSync(outPath)) { skipped++; continue; }

    const speakerId = ROLE_SPEAKER[line.speaker] != null ? ROLE_SPEAKER[line.speaker] : ROLE_SPEAKER.N;
    const tmpWav = path.join(os.tmpdir(), `choukai-${process.pid}-${i}.wav`);
    try {
      fs.writeFileSync(tmpWav, await synthWav(forTts(line.text), speakerId));
      execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", tmpWav, outPath], { stdio: "pipe" });
      done++;
    } catch (err) {
      failed++;
      console.error("FAILED:", hash, line.speaker, line.text, "->", String(err.message).split("\n")[0]);
    } finally {
      if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
    }
    if (i % 20 === 0) console.log(`progress: ${i}/${lines.size}`);
  }

  // Only list clips that actually exist on disk, so the runtime never fetches
  // a missing one (a failed synth just falls back to Web Speech for that line).
  const present = hashes.filter((h) => fs.existsSync(path.join(OUT_DIR, h + ".m4a")));
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(present));
  console.log(`Wrote audio/choukai/manifest.json (${present.length}/${hashes.length} entries)`);
  console.log(`Credit line for the app: ${CREDIT}`);
  console.log(`\nDone. generated=${done} skipped(existing)=${skipped} failed=${failed} total=${lines.size}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
