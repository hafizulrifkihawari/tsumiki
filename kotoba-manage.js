/* 管理 — enable/disable which Pelajaran (lessons) appear in the kotoba deck.
 *
 * Filters by whole lesson, not by individual word: each row is one Pelajaran,
 * and unchecking it excludes every word tagged with that lesson number. The
 * set of *disabled* lesson numbers is stored in localStorage under the same
 * key kotoba-app.js reads at buildDeck time. Changes
 * are written only when the user presses Save.
 */
(function () {
  "use strict";

  const DISABLED_KEY = "kotoba.disabledLessons";

  const list = document.getElementById("lessonList");
  const enabledNum = document.getElementById("enabledNum");
  const enabledCount = document.getElementById("enabledCount");

  function loadDisabled() {
    try {
      const raw = localStorage.getItem(DISABLED_KEY);
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return new Set();
  }
  function saveDisabled(set) {
    try { localStorage.setItem(DISABLED_KEY, JSON.stringify([...set])); } catch (e) { /* ignore */ }
  }

  const disabled = loadDisabled();

  // Edits stay in memory until the user presses Save. The saved snapshot tells
  // us whether the current state differs from what is in localStorage.
  const saveBtn = document.getElementById("saveBtn");
  const saveStatus = document.getElementById("saveStatus");
  function snapshot(set) {
    return JSON.stringify([...set].sort((a, b) => a - b));
  }
  let savedSnapshot = snapshot(disabled);
  function isDirty() {
    return snapshot(disabled) !== savedSnapshot;
  }
  function markDirty() {
    const dirty = isDirty();
    saveBtn.disabled = !dirty;
    saveStatus.textContent = dirty ? "Unsaved changes" : "All changes saved";
    saveStatus.classList.toggle("is-dirty", dirty);
  }
  saveBtn.addEventListener("click", () => {
    saveDisabled(disabled);
    savedSnapshot = snapshot(disabled);
    markDirty();
    saveStatus.textContent = "Saved";
  });
  window.addEventListener("beforeunload", (ev) => {
    if (!isDirty()) return;
    ev.preventDefault();
    ev.returnValue = "";
  });
  const total = KOTOBA.length;

  // Group word counts by lesson, preserving ascending Pelajaran order.
  const countByLesson = new Map();
  for (const c of KOTOBA) {
    countByLesson.set(c.lesson, (countByLesson.get(c.lesson) || 0) + 1);
  }
  const lessons = [...countByLesson.keys()].sort((a, b) => a - b);

  function activeWordCount() {
    let n = 0;
    for (const lesson of lessons) {
      if (!disabled.has(lesson)) n += countByLesson.get(lesson);
    }
    return n;
  }

  function updateCount() {
    const active = activeWordCount();
    enabledNum.textContent = active;
    enabledCount.lastChild.textContent = "/" + total;
    enabledCount.title = active + " of " + total + " words enabled";
  }

  function buildRow(lesson) {
    const row = document.createElement("label");
    row.className = "lesson-row";
    if (disabled.has(lesson)) row.classList.add("is-off");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "lesson-check";
    cb.checked = !disabled.has(lesson);

    const info = document.createElement("span");
    info.className = "lesson-info";
    const title = document.createElement("span");
    title.className = "lesson-title";
    title.textContent = "Pelajaran " + lesson;
    const meta = document.createElement("span");
    meta.className = "lesson-meta";
    meta.textContent = countByLesson.get(lesson) + " words";
    info.append(title, meta);

    cb.addEventListener("change", () => {
      if (cb.checked) disabled.delete(lesson); else disabled.add(lesson);
      row.classList.toggle("is-off", !cb.checked);
      markDirty();
      updateCount();
    });

    row.append(cb, info);
    list.appendChild(row);
  }

  lessons.forEach(buildRow);
  updateCount();

  function setAll(enabled) {
    disabled.clear();
    if (!enabled) lessons.forEach((lesson) => disabled.add(lesson));
    markDirty();
    document.querySelectorAll(".lesson-check").forEach((cb) => {
      cb.checked = enabled;
      cb.closest(".lesson-row").classList.toggle("is-off", !enabled);
    });
    updateCount();
  }
  document.getElementById("allOnBtn").addEventListener("click", () => setAll(true));
  document.getElementById("allOffBtn").addEventListener("click", () => setAll(false));
})();
