/*
 * kotd.js — "Kanji of the Day" rotation + rendering. Loads after
 * kotd-data.js (RAW) and srs.js (todayStamp, DAY_MS, ls, loadKnown/
 * saveKnown — plain globals, not IIFE-scoped, so they're reused directly
 * here).
 *
 * Picking: a small seeded PRNG (mulberry32) draws KOTD_DAILY_COUNT cards for
 * the day, seeded from the UTC day index so reopening the page the same day
 * shows the same cards — but the draw pool excludes anything marked "sudah
 * paham" (see loadKnown/saveKnown in srs.js), and a manual re-roll (one card
 * or all three) redraws with plain Math.random() and persists the result, so
 * it survives a reload for the rest of the day.
 */
"use strict";

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// How many entries to feature per day.
const KOTD_DAILY_COUNT = 3;
const KOTD_DECK = "kotd";

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

// Speaks a KOTD entry's example sentence by id. Called by the in-page speak
// buttons.
function speakEntryById(id, btn) {
  const entry = kotdIndex[id];
  if (entry && entry.example) speakDevice(entry.example.jp, btn);
}

// ---- Seeded PRNG (mulberry32) — deterministic per integer seed -------------
function mulberry32(seed) {
  let a = seed | 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRng(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleRandom(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// byId lookup used by compound entries to render their component breakdown,
// and by every draw/pick helper below.
function buildIndex(list) {
  const map = {};
  list.forEach((entry) => { map[entry.id] = entry; });
  return map;
}

// ---- Per-user state ---------------------------------------------------------
let currentUser = "guest";
let knownSet = new Set();
let kotdIndex = {};
let currentPicks = []; // array of entry ids, in on-screen slot order

function todayTodoKey(user) { return "kotd.today." + user; }

function loadTodayPicks(user) {
  const raw = ls(true, todayTodoKey(user));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveTodayPicks(user, ids) {
  ls(false, todayTodoKey(user), JSON.stringify({ date: todayStamp(), ids }));
}

// Cards not yet marked "sudah paham". Falls back to the whole dataset if
// every card has been retired, so the deck never goes empty.
function availablePool() {
  const pool = RAW.filter((e) => !knownSet.has(e.id));
  return pool.length ? pool : RAW.slice();
}

// Deterministic pick for "today" — same UTC day + same known-set -> same
// cards, so reopening the page doesn't reshuffle what's shown.
function drawSeededToday() {
  const pool = availablePool();
  const dayIndex = Math.floor(Date.parse(todayStamp() + "T00:00:00Z") / DAY_MS);
  const rng = mulberry32(dayIndex);
  return shuffleWithRng(pool, rng).slice(0, Math.min(KOTD_DAILY_COUNT, pool.length)).map((e) => e.id);
}

// Random draw of `count` ids, avoiding `excludeIds` where the pool is large
// enough to do so (falls back to allowing repeats only if the pool is too
// small — e.g. right after resetting "sudah paham" on a tiny leftover set).
function drawRandom(count, excludeIds) {
  excludeIds = excludeIds || [];
  const pool = availablePool();
  const fresh = pool.filter((e) => !excludeIds.includes(e.id));
  const source = fresh.length >= count ? fresh : pool;
  return shuffleRandom(source).slice(0, count).map((e) => e.id);
}

// Makes sure `currentPicks` holds today's cards: reuse a saved same-day pick
// (dropping/backfilling any card since marked "sudah paham"), or draw fresh.
function ensureTodayPicks() {
  const stamp = todayStamp();
  const saved = loadTodayPicks(currentUser);
  let ids;
  if (saved && saved.date === stamp && Array.isArray(saved.ids) && saved.ids.length) {
    ids = saved.ids.filter((id) => !knownSet.has(id) && kotdIndex[id]);
    while (ids.length < KOTD_DAILY_COUNT) {
      const fresh = drawRandom(1, ids);
      if (!fresh.length || ids.includes(fresh[0])) break;
      ids.push(fresh[0]);
    }
    if (ids.length !== saved.ids.length || ids.some((id, i) => id !== saved.ids[i])) {
      saveTodayPicks(currentUser, ids);
    }
  } else {
    ids = drawSeededToday();
    saveTodayPicks(currentUser, ids);
  }
  currentPicks = ids;
}

function cardHtml(k) {
  const headChar = k.type === "compound" ? k.word : k.kanji;
  const readingsHtml = k.type === "compound"
    ? "<span><strong>読み</strong> " + esc(k.reading) + "</span>"
    : (k.onyomi ? "<span><strong>音</strong> " + esc(k.onyomi) + "</span>" : "") +
      (k.kunyomi ? "<span><strong>訓</strong> " + esc(k.kunyomi) + "</span>" : "");
  const partsHtml = k.type === "compound"
    ? '<div class="kotd-parts">Built from ' +
        k.parts.map((id) => esc(kotdIndex[id].kanji) + " (" + esc(kotdIndex[id].meaningEn) + ")").join(" + ") +
      "</div>"
    : "";
  const isKnown = knownSet.has(k.id);
  return (
    '<article class="kotd-card">' +
      '<div class="kotd-card-top">' +
        '<span class="kotd-kanji">' + esc(headChar) + "</span>" +
        '<div class="kotd-card-badges">' +
          '<span class="badge badge-type">' + esc(k.level) + "</span>" +
          (k.category ? '<span class="badge badge-category">' + esc(k.category) + "</span>" : "") +
          '<div class="kotd-card-actions">' +
            '<button class="kotd-icon-btn kotd-reroll-btn" type="button" data-id="' + esc(k.id) + '" aria-label="Ganti kartu ini" title="Ganti kartu ini">🔀</button>' +
            '<button class="kotd-icon-btn kotd-known-btn' + (isKnown ? " is-known" : "") + '" type="button" data-id="' + esc(k.id) + '" aria-label="Tandai sudah paham" title="Tandai sudah paham">✓</button>' +
          "</div>" +
        "</div>" +
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

function renderHeader() {
  const dateEl = document.getElementById("kotdDate");
  const totalEl = document.getElementById("kotdTotal");
  const countEl = document.getElementById("kotdCount");
  const knownEl = document.getElementById("kotdKnownCount");
  const remainEl = document.getElementById("kotdRemainCount");
  const noteEl = document.getElementById("kotdAllKnownNote");
  if (dateEl) dateEl.textContent = todayStamp();
  if (totalEl) totalEl.textContent = String(RAW.length);
  if (countEl) countEl.textContent = String(currentPicks.length);
  if (knownEl) knownEl.textContent = String(knownSet.size);
  if (remainEl) remainEl.textContent = String(Math.max(0, RAW.length - knownSet.size));
  if (noteEl) noteEl.hidden = knownSet.size < RAW.length;
}

function renderCards() {
  const listEl = document.getElementById("kotdList");
  if (!listEl) return;
  const picks = currentPicks.map((id) => kotdIndex[id]).filter(Boolean);
  listEl.innerHTML = picks.map((k) => cardHtml(k)).join("");
}

function updateAll() {
  renderHeader();
  renderCards();
}

// ---- Actions ----------------------------------------------------------------
function rerollOne(id) {
  const idx = currentPicks.indexOf(id);
  if (idx === -1) return;
  const fresh = drawRandom(1, currentPicks);
  if (!fresh.length) return;
  currentPicks[idx] = fresh[0];
  saveTodayPicks(currentUser, currentPicks);
  updateAll();
}

function rerollAll() {
  currentPicks = drawRandom(KOTD_DAILY_COUNT, currentPicks);
  saveTodayPicks(currentUser, currentPicks);
  updateAll();
}

function markCardKnown(id) {
  knownSet.add(id);
  saveKnown(KOTD_DECK, currentUser, knownSet);
  const idx = currentPicks.indexOf(id);
  if (idx !== -1) {
    const fresh = drawRandom(1, currentPicks);
    if (fresh.length) currentPicks[idx] = fresh[0]; // else: everything's retired, keep showing it
    saveTodayPicks(currentUser, currentPicks);
  }
  updateAll();
}

function resetKnown() {
  knownSet = new Set();
  saveKnown(KOTD_DECK, currentUser, knownSet);
  updateAll();
}

function render() {
  currentUser = ls(true, "kanji.currentUser") || "guest";
  knownSet = loadKnown(KOTD_DECK, currentUser);
  kotdIndex = buildIndex(RAW);
  ensureTodayPicks();
  updateAll();
}

(function initControls() {
  const listEl = document.getElementById("kotdList");
  if (listEl) {
    listEl.addEventListener("click", (e) => {
      const speakBtn = e.target.closest(".speak-btn");
      if (speakBtn) { speakEntryById(Number(speakBtn.dataset.entryId), speakBtn); return; }
      const rerollBtn = e.target.closest(".kotd-reroll-btn");
      if (rerollBtn) { rerollOne(Number(rerollBtn.dataset.id)); return; }
      const knownBtn = e.target.closest(".kotd-known-btn");
      if (knownBtn) { markCardKnown(Number(knownBtn.dataset.id)); return; }
    });
  }
  const shuffleAllBtn = document.getElementById("kotdShuffleAllBtn");
  if (shuffleAllBtn) shuffleAllBtn.addEventListener("click", rerollAll);
  const resetKnownBtn = document.getElementById("kotdResetKnownBtn");
  if (resetKnownBtn) resetKnownBtn.addEventListener("click", resetKnown);
})();

render();
