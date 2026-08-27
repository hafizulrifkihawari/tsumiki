/*
 * kotd.js — "Kanji of the Day" daily rotation + rendering. Loads after
 * kotd-data.js (RAW) and srs.js (todayStamp, DAY_MS — plain globals, not
 * IIFE-scoped, so they're reused directly here).
 */
"use strict";

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
        '<div class="kotd-example-jp">' + esc(k.example.jp) + "</div>" +
        '<div class="kotd-example-reading">' + esc(k.example.reading) + "</div>" +
        '<div class="kotd-example-meaning">' + esc(k.example.meaning) + "</div>" +
      "</div>" +
    "</article>"
  );
}

function render() {
  const stamp = todayStamp();
  const picks = pickDaily(RAW, 5, stamp);
  const index = buildIndex(RAW);
  const dateEl = document.getElementById("kotdDate");
  const totalEl = document.getElementById("kotdTotal");
  const listEl = document.getElementById("kotdList");
  if (dateEl) dateEl.textContent = stamp;
  if (totalEl) totalEl.textContent = String(RAW.length);
  if (listEl) listEl.innerHTML = picks.map((k) => cardHtml(k, index)).join("");
}

render();
