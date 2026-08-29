/*
 * kotd.js — "Kanji of the Day" daily rotation + rendering. Loads after
 * kotd-data.js (RAW) and srs.js (todayStamp, DAY_MS — plain globals, not
 * IIFE-scoped, so they're reused directly here).
 */
"use strict";

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// How many entries to feature per day. Also hardcoded (must match) in the
// native widget ports: android's KotdPicker.kt and ios's KotdPicker.swift.
const KOTD_DAILY_COUNT = 3;

// ---- Text-to-speech (ported from app.js:444-528) ---------------------------
const ttsSupported = "speechSynthesis" in window;
let jaVoice = null;

// Preferred Japanese female voice, by name, in priority order — see app.js
// for why (Mizuki isn't available on macOS/iOS, so this falls back).
const VOICE_PRIORITY = ["mizuki", "kyoko", "nanami", "haruka", "ayumi", "o-ren"];

function pickJaVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return false;
  const jaVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("ja"));
  for (const name of VOICE_PRIORITY) {
    const match = jaVoices.find((v) => v.name.toLowerCase().includes(name));
    if (match) { jaVoice = match; return true; }
  }
  jaVoice = jaVoices[0] || null;
  return true;
}

if (ttsSupported) {
  pickJaVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = pickJaVoice;
  }
  // onvoiceschanged doesn't fire reliably on every mobile browser (notably
  // iOS Safari), so also poll briefly right after load as a fallback.
  let voicePollAttempts = 0;
  const voicePoll = setInterval(() => {
    voicePollAttempts++;
    if (pickJaVoice() || voicePollAttempts > 15) clearInterval(voicePoll);
  }, 300);
}

function speakDevice(text, btn) {
  if (!ttsSupported || !text) return;
  if (!jaVoice) pickJaVoice();
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = 0.85;
  if (jaVoice) utter.voice = jaVoice;
  if (btn) {
    btn.classList.add("is-speaking");
    utter.onend = () => btn.classList.remove("is-speaking");
    utter.onerror = () => btn.classList.remove("is-speaking");
  }
  window.speechSynthesis.speak(utter);
}

// Speaks a KOTD entry's example sentence by id. Shared by the in-page speak
// buttons and by the iOS widget's deep-link auto-play (kotd://kotd/speak?id=).
function speakEntryById(id, btn) {
  const entry = kotdIndex[id];
  if (entry && entry.example) speakDevice(entry.example.jp, btn);
}

// Deterministic per-UTC-day picker: advances the window by `count` each day
// and wraps via modulo, so the whole dataset cycles through over time
// instead of showing the same items forever or reshuffling randomly per visit.
function pickDaily(list, count, stamp) {
  const n = list.length;
  if (n === 0) return [];
  count = Math.min(count, n);
  const dayIndex = Math.floor(Date.parse(stamp + "T00:00:00Z") / DAY_MS);
  const start = (dayIndex * count) % n;
  const picks = [];
  for (let i = 0; i < count; i++) picks.push(list[(start + i) % n]);
  return picks;
}

// byId lookup used by compound entries to render their component breakdown.
function buildIndex(list) {
  const map = {};
  list.forEach((entry) => { map[entry.id] = entry; });
  return map;
}

function cardHtml(k, index) {
  const headChar = k.type === "compound" ? k.word : k.kanji;
  const readingsHtml = k.type === "compound"
    ? "<span><strong>読み</strong> " + esc(k.reading) + "</span>"
    : (k.onyomi ? "<span><strong>音</strong> " + esc(k.onyomi) + "</span>" : "") +
      (k.kunyomi ? "<span><strong>訓</strong> " + esc(k.kunyomi) + "</span>" : "");
  const partsHtml = k.type === "compound"
    ? '<div class="kotd-parts">Built from ' +
        k.parts.map((id) => esc(index[id].kanji) + " (" + esc(index[id].meaningEn) + ")").join(" + ") +
      "</div>"
    : "";
  return (
    '<article class="kotd-card">' +
      '<div class="kotd-card-top">' +
        '<span class="kotd-kanji">' + esc(headChar) + "</span>" +
        '<span class="badge badge-type">' + esc(k.level) + "</span>" +
      "</div>" +
      '<div class="kotd-readings">' + readingsHtml + "</div>" +
      partsHtml +
      '<div class="kotd-meaning">' + esc(k.meaning) + " (" + esc(k.meaningEn) + ")</div>" +
      '<div class="kotd-example">' +
        '<div class="kotd-example-top">' +
          '<div class="kotd-example-jp">' + esc(k.example.jp) + "</div>" +
          '<button class="speak-btn" type="button" data-entry-id="' + esc(k.id) + '" aria-label="Play example sentence" title="Play example sentence">🔊</button>' +
        "</div>" +
        '<div class="kotd-example-reading">' + esc(k.example.reading) + "</div>" +
        '<div class="kotd-example-meaning">' + esc(k.example.meaning) + "</div>" +
      "</div>" +
    "</article>"
  );
}

// Populated by render(); shared with speakEntryById() for the speak buttons
// and the hash-based auto-speak entry point below.
let kotdIndex = {};

function render() {
  const stamp = todayStamp();
  const picks = pickDaily(RAW, KOTD_DAILY_COUNT, stamp);
  kotdIndex = buildIndex(RAW);
  const dateEl = document.getElementById("kotdDate");
  const totalEl = document.getElementById("kotdTotal");
  const countEl = document.getElementById("kotdCount");
  const listEl = document.getElementById("kotdList");
  if (dateEl) dateEl.textContent = stamp;
  if (totalEl) totalEl.textContent = String(RAW.length);
  if (countEl) countEl.textContent = String(picks.length);
  if (listEl) {
    listEl.innerHTML = picks.map((k) => cardHtml(k, kotdIndex)).join("");
    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".speak-btn");
      if (!btn) return;
      speakEntryById(btn.dataset.entryId, btn);
    });
  }
}

// Auto-play an entry's example sentence when arriving via a #speak=<id> hash
// (set by the iOS widget's deep link, see the Capacitor appUrlOpen listener
// below). Handles both a fresh load and arriving while already on this page
// (hashchange doesn't fire if the hash is set to the same value twice).
function handleSpeakHash() {
  const m = /^#speak=(.+)$/.exec(location.hash);
  if (!m) return;
  const id = Number(decodeURIComponent(m[1]));
  // Voice list may not be ready the instant the page loads; wait for it.
  if (ttsSupported && !jaVoice) {
    let attempts = 0;
    const wait = setInterval(() => {
      attempts++;
      if (pickJaVoice() || attempts > 15) {
        clearInterval(wait);
        speakEntryById(id);
      }
    }, 300);
  } else {
    speakEntryById(id);
  }
}

window.addEventListener("hashchange", handleSpeakHash);

// Capacitor's @capacitor/app plugin forwards jpflashcard://kotd/speak?id=<id>
// opens here; no-ops on plain web where window.Capacitor doesn't exist.
if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
  window.Capacitor.Plugins.App.addListener("appUrlOpen", (data) => {
    try {
      const url = new URL(data.url);
      const id = url.searchParams.get("id");
      if (id) {
        location.hash = "speak=" + encodeURIComponent(id);
        handleSpeakHash(); // hash may already equal this value (no hashchange fired)
      }
    } catch (e) { /* malformed deep link — ignore */ }
  });
}

render();
handleSpeakHash();
