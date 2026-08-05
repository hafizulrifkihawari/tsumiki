/* 管理 — enable/disable which kanji appear in the flashcards.
 *
 * Renders every kanji from RAW into a table, 10 per row. A checked box means
 * the kanji is enabled (in the deck); unchecking excludes it. Each row also has
 * a left-hand checkbox that toggles all 10 at once (and shows an indeterminate
 * state when the row is partially enabled). The set of *disabled* ids is stored
 * in localStorage under the same key app.js reads at buildDeck time.
 */
(function () {
  "use strict";

  const DISABLED_KEY = "kanji.disabledIds";
  const PER_ROW = 10;

  const body = document.getElementById("manageBody");
  const enabledNum = document.getElementById("enabledNum");

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
  const total = RAW.length;

  function updateCount() {
    enabledNum.textContent = total - disabled.size;
  }

  // Keep a row's header checkbox in sync with its 10 cell checkboxes.
  function syncRowHeader(rowEl) {
    const cells = rowEl.querySelectorAll(".cell-check");
    const on = [...cells].filter((c) => c.checked).length;
    const head = rowEl.querySelector(".row-check");
    head.checked = on === cells.length;
    head.indeterminate = on > 0 && on < cells.length;
  }

  function setKanji(id, enabled) {
    if (enabled) disabled.delete(id); else disabled.add(id);
  }

  function buildRow(entries) {
    const tr = document.createElement("tr");

    // Row toggle
    const th = document.createElement("td");
    th.className = "row-head";
    const rowCheck = document.createElement("input");
    rowCheck.type = "checkbox";
    rowCheck.className = "row-check";
    rowCheck.title = "Toggle all 10 in this row";
    th.appendChild(rowCheck);
    tr.appendChild(th);

    rowCheck.addEventListener("change", () => {
      const on = rowCheck.checked;
      tr.querySelectorAll(".cell-check").forEach((cb) => {
        cb.checked = on;
        setKanji(Number(cb.dataset.id), on);
        cb.closest(".cell").classList.toggle("is-off", !on);
      });
      rowCheck.indeterminate = false;
      saveDisabled(disabled);
      updateCount();
    });

    for (const e of entries) {
      const td = document.createElement("td");
      const label = document.createElement("label");
      label.className = "cell";
      if (disabled.has(e.id)) label.classList.add("is-off");

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "cell-check";
      cb.dataset.id = String(e.id);
      cb.checked = !disabled.has(e.id);

      const info = document.createElement("span");
      info.className = "cell-info";
      const kanji = document.createElement("span");
      kanji.className = "cell-kanji";
      kanji.textContent = e.word;
      const meta = document.createElement("span");
      meta.className = "cell-meta";
      meta.textContent = "#" + e.id + " · " + e.reading;
      info.append(kanji, meta);

      cb.addEventListener("change", () => {
        setKanji(e.id, cb.checked);
        label.classList.toggle("is-off", !cb.checked);
        syncRowHeader(tr);
        saveDisabled(disabled);
        updateCount();
      });

      label.append(cb, info);
      td.appendChild(label);
      tr.appendChild(td);
    }

    // Pad short final row so the grid stays aligned
    for (let i = entries.length; i < PER_ROW; i++) {
      tr.appendChild(document.createElement("td"));
    }

    body.appendChild(tr);
    syncRowHeader(tr);
  }

  for (let i = 0; i < RAW.length; i += PER_ROW) {
    buildRow(RAW.slice(i, i + PER_ROW));
  }
  updateCount();

  function setAll(enabled) {
    disabled.clear();
    if (!enabled) RAW.forEach((e) => disabled.add(e.id));
    saveDisabled(disabled);
    document.querySelectorAll(".cell-check").forEach((cb) => {
      cb.checked = enabled;
      cb.closest(".cell").classList.toggle("is-off", !enabled);
    });
    document.querySelectorAll(".manage-table tr").forEach(syncRowHeader);
    updateCount();
  }
  document.getElementById("allOnBtn").addEventListener("click", () => setAll(true));
  document.getElementById("allOffBtn").addEventListener("click", () => setAll(false));
})();
