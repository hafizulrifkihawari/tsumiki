/*
 * srs.js — tiny Leitner-box spaced-repetition engine, shared by the kanji deck
 * (app.js) and the Kotoba deck (kotoba-app.js) so both decks schedule reviews,
 * remember toggle preferences, and track streaks the same way.
 *
 * A card's SRS state is a plain object keyed by the caller's own stable card
 * id (the kanji deck uses each card's `audioFile`; Kotoba uses "k-<lesson>-
 * <index>"): { box, due, correct, wrong, seen, last }.
 *   box 0        -> never graded ("new")
 *   box 1-5      -> graded at least once; box maps to an interval via
 *                   BOX_INTERVALS_DAYS below (higher box = longer gap)
 *   due          -> epoch ms the card should next be shown
 */

"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;
// Index = box. Box 0's interval is unused (a new card has no due date yet).
const BOX_INTERVALS_DAYS = [0, 1, 3, 7, 16, 35];
const MAX_BOX = BOX_INTERVALS_DAYS.length - 1;

function freshEntry(now) {
  return { box: 0, due: now, correct: 0, wrong: 0, seen: 0, last: now };
}

// Grades a card and returns its updated SRS entry (does not persist — callers
// read/write the whole per-deck map via loadSrs/saveSrs around this call).
// grade: "again" | "good" | "easy"
function schedule(entry, grade, now) {
  now = now || Date.now();
  entry = entry ? Object.assign({}, entry) : freshEntry(now);
  entry.seen++;
  entry.last = now;
  if (grade === "again") {
    // Failed recall: drop to box 1 but keep it due immediately so it
    // resurfaces later in the same session instead of tomorrow.
    entry.box = 1;
    entry.due = now;
    entry.wrong++;
  } else if (grade === "easy") {
    entry.box = Math.min(entry.box + 2, MAX_BOX);
    entry.due = now + BOX_INTERVALS_DAYS[entry.box] * DAY_MS;
    entry.correct++;
  } else { // "good" (default)
    entry.box = Math.min(entry.box + 1, MAX_BOX);
    entry.due = now + BOX_INTERVALS_DAYS[entry.box] * DAY_MS;
    entry.correct++;
  }
  return entry;
}

function isDue(entry, now) {
  now = now || Date.now();
  return !entry || entry.box === 0 || entry.due <= now;
}

// new | learning | mature, for progress-screen display.
function bucketOf(entry) {
  if (!entry || entry.box === 0) return "new";
  if (entry.box >= 4) return "mature";
  return "learning";
}

function ls(get, key, val) {
  try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); }
  catch (e) { return null; }
}

// ---- Per-deck, per-user SRS map -------------------------------------------
function srsKey(deck, user) { return "srs." + deck + "." + user; }

function loadSrs(deck, user) {
  const raw = ls(true, srsKey(deck, user));
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
}

function saveSrs(deck, user, data) {
  ls(false, srsKey(deck, user), JSON.stringify(data));
}

// ---- Toggle preferences (global, not per-user) ----------------------------
const PREFS_KEY = "kanji.prefs";

function loadPrefs() {
  const raw = ls(true, PREFS_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
}

function savePrefs(prefs) {
  ls(false, PREFS_KEY, JSON.stringify(prefs));
}

// ---- Daily study streak ----------------------------------------------------
function streakKey(user) { return "streak." + user; }

function todayStamp(now) {
  return new Date(now || Date.now()).toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function loadStreak(user) {
  const raw = ls(true, streakKey(user));
  if (!raw) return { count: 0, lastDate: null };
  try { return JSON.parse(raw) || { count: 0, lastDate: null }; }
  catch (e) { return { count: 0, lastDate: null }; }
}

// Call once per session (e.g. when a deck is built). No-ops if already
// bumped today; +1 if the last study day was yesterday; resets to 1 otherwise.
function bumpStreak(user, now) {
  now = now || Date.now();
  const today = todayStamp(now);
  const s = loadStreak(user);
  if (s.lastDate === today) return s;
  if (s.lastDate) {
    const diffDays = Math.round((Date.parse(today + "T00:00:00Z") - Date.parse(s.lastDate + "T00:00:00Z")) / DAY_MS);
    s.count = diffDays === 1 ? s.count + 1 : 1;
  } else {
    s.count = 1;
  }
  s.lastDate = today;
  ls(false, streakKey(user), JSON.stringify(s));
  return s;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BOX_INTERVALS_DAYS, MAX_BOX, schedule, isDue, bucketOf,
    loadSrs, saveSrs, loadPrefs, savePrefs, loadStreak, bumpStreak
  };
}
