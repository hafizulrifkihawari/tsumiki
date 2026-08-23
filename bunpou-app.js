/* 文法 Bunpou — grammar practice app. Independent of app.js/kotoba-app.js
 * (own dataset, own views) but shares srs.js for scheduling/streak so
 * progress feels consistent across every section of the app.
 *
 * Views (no SPA router — just show/hide sections, like the login/help/progress
 * overlays in app.js):
 *   #browseView  — grammar points grouped by level + function, with mastery pips
 *   #studyView   — full "how to use it" reference for one point
 *   #quizView    — due-first SRS queue mixing cloze / mcq / sentence-build items
 */

(function () {
  "use strict";

  const el = (id) => document.getElementById(id);

  function ls(get, key, val) {
    try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); }
    catch (e) { return null; }
  }

  // Bunpou has no login UI of its own — studies as whoever is signed into the
  // kanji deck (or "guest"), so SRS progress and the daily streak are shared.
  const currentUser = ls(true, "kanji.currentUser") || "guest";
  const BUNPOU_DECK = "bunpou";

  // ---- Build a stable id -> point map and the flat drill-item pool ----------
  const pointsById = new Map(BUNPOU.map((p) => [p.id, p]));

  const RANK = { new: 0, learning: 1, mature: 2 };

  function buildItemPool() {
    const items = [];
    for (const p of BUNPOU) {
      (p.examples || []).forEach((ex, i) => {
        if (ex.cloze) items.push({ type: "cloze", pointId: p.id, idx: i, key: p.id + "::cloze::" + i });
      });
      (p.mcq || []).forEach((m, i) => {
        items.push({ type: "mcq", pointId: p.id, idx: i, key: p.id + "::mcq::" + i });
      });
      (p.build || []).forEach((b, i) => {
        items.push({ type: "build", pointId: p.id, idx: i, key: p.id + "::build::" + i });
      });
    }
    return items;
  }

  const ITEM_POOL = buildItemPool();
  const itemsByKey = new Map(ITEM_POOL.map((it) => [it.key, it]));

  const itemKeysByPoint = new Map();
  for (const it of ITEM_POOL) {
    if (!itemKeysByPoint.has(it.pointId)) itemKeysByPoint.set(it.pointId, []);
    itemKeysByPoint.get(it.pointId).push(it.key);
  }

  let srsMap = loadSrs(BUNPOU_DECK, currentUser);

  function pointBucket(p) {
    const keys = itemKeysByPoint.get(p.id) || [];
    if (!keys.length) return "new";
    let worst = "mature";
    let sawAny = false;
    for (const k of keys) {
      const entry = srsMap[k];
      if (!entry || entry.box === 0) return "new"; // any never-studied item -> whole point counts as new
      sawAny = true;
      const b = bucketOf(entry);
      if (RANK[b] < RANK[worst]) worst = b;
    }
    return sawAny ? worst : "new";
  }

  function itemData(it) {
    const p = pointsById.get(it.pointId);
    if (it.type === "cloze") return { point: p, example: p.examples[it.idx] };
    if (it.type === "mcq") return { point: p, mcq: p.mcq[it.idx] };
    return { point: p, build: p.build[it.idx] };
  }

  // ---- Text helpers ----------------------------------------------------------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  // Wraps the first occurrence of `target` inside `jp` in a highlight span.
  function highlightTarget(jp, target) {
    if (!target) return esc(jp);
    const i = jp.indexOf(target);
    if (i === -1) return esc(jp);
    return esc(jp.slice(0, i)) + '<span class="target">' + esc(target) + "</span>" + esc(jp.slice(i + target.length));
  }

  // Replaces the first occurrence of `target` inside `jp` with a blank marker.
  function blankTarget(jp, target) {
    if (!target) return esc(jp);
    const i = jp.indexOf(target);
    if (i === -1) return esc(jp);
    return esc(jp.slice(0, i)) + '<span class="target target-cloze">＿＿＿</span>' + esc(jp.slice(i + target.length));
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---- View switching ---------------------------------------------------------
  const browseView = el("browseView");
  const studyView = el("studyView");
  const quizView = el("quizView");
  const reviewBtn = el("reviewBtn");

  let currentLevelFilter = "all";
  let studyPointId = null;

  function showView(name) {
    browseView.hidden = name !== "browse";
    studyView.hidden = name !== "study";
    quizView.hidden = name !== "quiz";
    reviewBtn.hidden = name !== "browse";
    if (name === "browse") renderBrowse();
  }

  // ---- Browse view -------------------------------------------------------------
  const groupList = el("groupList");
  const pointCountEl = el("pointCount");
  const dueCountEl = el("dueCount");

  function updateDueCount() {
    const now = Date.now();
    let due = 0;
    for (const it of ITEM_POOL) {
      const entry = srsMap[it.key];
      if (entry && entry.box > 0 && isDue(entry, now)) due++;
    }
    dueCountEl.textContent = due;
  }

  function renderBrowse() {
    pointCountEl.textContent = BUNPOU.length;
    updateDueCount();

    const filtered = currentLevelFilter === "all" ? BUNPOU : BUNPOU.filter((p) => p.level === currentLevelFilter);

    // Group by level then by `group`, preserving first-seen order.
    const groups = [];
    const groupIndex = new Map();
    for (const p of filtered) {
      const gk = p.level + "::" + p.group;
      if (!groupIndex.has(gk)) {
        groupIndex.set(gk, groups.length);
        groups.push({ level: p.level, name: p.group, points: [] });
      }
      groups[groupIndex.get(gk)].points.push(p);
    }

    groupList.innerHTML = groups.map((g) => {
      const rows = g.points.map((p) => {
        const bucket = pointBucket(p);
        return (
          '<button class="bunpou-point-row" type="button" data-id="' + esc(p.id) + '">' +
            '<span class="dot dot-' + bucket + '"></span>' +
            '<span class="bp-pattern">' + esc(p.pattern) + "</span>" +
            '<span class="bp-meaning">' + esc(p.meaning) + "</span>" +
          "</button>"
        );
      }).join("");
      return (
        '<div class="bunpou-group">' +
          '<div class="bunpou-group-title"><span class="badge badge-type">' + esc(g.level) + "</span> " + esc(g.name) + "</div>" +
          '<div class="bunpou-points">' + rows + "</div>" +
        "</div>"
      );
    }).join("") || '<p class="hint-text">Tidak ada poin untuk filter ini.</p>';

    groupList.querySelectorAll(".bunpou-point-row").forEach((btn) => {
      btn.addEventListener("click", () => openStudy(btn.getAttribute("data-id")));
    });
  }

  el("levelSeg").addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    el("levelSeg").querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentLevelFilter = btn.getAttribute("data-level");
    renderBrowse();
  });

  // ---- Study view ----------------------------------------------------------
  const studyContent = el("studyContent");

  function renderFormationTable(rows) {
    if (!rows || !rows.length) return "";
    const trs = rows.map((r) =>
      "<tr><td>" + esc(r.pos) + "</td><td>" + esc(r.rule) + '</td><td class="formation-ex">' + esc(r.ex) + "</td></tr>"
    ).join("");
    return (
      '<table class="formation-table"><thead><tr><th>Jenis kata</th><th>Aturan</th><th>Contoh</th></tr></thead>' +
      "<tbody>" + trs + "</tbody></table>"
    );
  }

  function openStudy(id) {
    const p = pointsById.get(id);
    if (!p) return;
    studyPointId = id;

    const examplesHtml = (p.examples || []).map((ex, i) => (
      '<div class="example">' +
        '<div class="example-index">' + (i + 1) + "</div>" +
        '<div class="example-jp">' + highlightTarget(ex.jp, ex.cloze) + "</div>" +
        '<div class="example-reading">' + esc(ex.reading || "") + "</div>" +
        '<div class="example-meaning">' + esc(ex.meaning || "") + "</div>" +
      "</div>"
    )).join("");

    const kanjiChips = (p.kanjiLinks || []).map((w) =>
      '<span class="chip kanji-chip">' + esc(w) + "</span>"
    ).join("");

    studyContent.innerHTML =
      '<div class="study-header">' +
        '<span class="badge badge-type study-level-badge">' + esc(p.level) + " · " + esc(p.group) + "</span>" +
        '<div class="study-pattern">' + esc(p.pattern) + "</div>" +
        (p.reading ? '<div class="study-reading">' + esc(p.reading) + "</div>" : "") +
        '<div class="study-meaning">' + esc(p.meaning) + "</div>" +
      "</div>" +

      (p.whenToUse ? '<div class="study-section"><h4>Kapan dipakai</h4><p>' + esc(p.whenToUse) + "</p></div>" : "") +

      (p.formation ? '<div class="study-section"><h4>Pembentukan</h4>' + renderFormationTable(p.formation) + "</div>" : "") +

      (p.register ? '<div class="study-section"><h4>Nuansa &amp; kesalahan umum</h4><p>' + esc(p.register) + "</p></div>" : "") +

      (p.contrast ? '<div class="study-section"><h4>Perbandingan</h4><p>' + esc(p.contrast) + "</p></div>" : "") +

      (kanjiChips ? '<div class="study-section"><h4>Kosakata dari deck N4</h4><div class="kanji-chips">' + kanjiChips + "</div></div>" : "") +

      (examplesHtml ? '<div class="study-section"><h4>Contoh kalimat (' + (p.examples || []).length + ")</h4>" +
        '<div class="example-list">' + examplesHtml + "</div></div>" : "");

    showView("study");
  }

  el("studyBackBtn").addEventListener("click", () => showView("browse"));
  el("studyReviewBtn").addEventListener("click", () => {
    if (studyPointId) openQuiz(studyPointId);
  });

  // ---- Quiz view -------------------------------------------------------------
  const quizFace = el("quizFace");
  const quizEmpty = el("quizEmpty");
  const quizScene = el("quizScene");
  const posNow = el("posNow");
  const posTotal = el("posTotal");
  const progressFill = el("progressFill");
  const scoreCountEl = el("scoreCount");
  const missCountEl = el("missCount");
  const queueBadge = el("queueBadge");
  const queueCountEl = el("queueCount");

  const SESSION_CAP = 40;

  let queue = [];
  let index = 0;
  let sessionCorrect = 0;
  let sessionMissed = 0;
  let againQueue = new Set();
  let scopePointId = null; // non-null when reviewing just one point

  function updateScore() {
    scoreCountEl.textContent = sessionCorrect;
    missCountEl.textContent = sessionMissed;
  }
  function updateQueueBadge() {
    queueCountEl.textContent = againQueue.size;
    queueBadge.hidden = againQueue.size === 0;
  }

  const progressKeyFor = (u) => "bunpou.progress." + u;

  function saveProgress() {
    const data = {
      order: queue.map((it) => it.key),
      index, sessionCorrect, sessionMissed,
      againQueue: [...againQueue],
      scopePointId
    };
    ls(false, progressKeyFor(currentUser), JSON.stringify(data));
  }

  function loadProgress() {
    const raw = ls(true, progressKeyFor(currentUser));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function buildQueue(pointId) {
    const now = Date.now();
    const pool = pointId ? ITEM_POOL.filter((it) => it.pointId === pointId) : ITEM_POOL;
    const due = [];
    const fresh = [];
    for (const it of pool) {
      const entry = srsMap[it.key];
      if (entry && entry.box > 0) {
        if (isDue(entry, now)) due.push({ it, due: entry.due });
      } else {
        fresh.push(it);
      }
    }
    due.sort((a, b) => a.due - b.due);
    let ordered = due.map((d) => d.it).concat(shuffleArray(fresh));
    if (!pointId) ordered = ordered.slice(0, SESSION_CAP);
    queue = shuffleArray(ordered);
    index = 0;
    sessionCorrect = 0;
    sessionMissed = 0;
    againQueue = new Set();
    scopePointId = pointId || null;
    updateScore();
    updateQueueBadge();
    updateDueCount();
    renderQuizItem();
    saveProgress();
  }

  function restoreProgress(saved) {
    if (!saved || !Array.isArray(saved.order) || !saved.order.length) return false;
    const restored = saved.order.map((k) => itemsByKey.get(k)).filter(Boolean);
    if (!restored.length) return false;
    queue = restored;
    index = Math.min(Math.max(0, saved.index || 0), queue.length - 1);
    sessionCorrect = saved.sessionCorrect || 0;
    sessionMissed = saved.sessionMissed || 0;
    againQueue = new Set(saved.againQueue || []);
    scopePointId = saved.scopePointId || null;
    updateScore();
    updateQueueBadge();
    updateDueCount();
    renderQuizItem();
    return true;
  }

  function openQuiz(pointId) {
    showView("quiz");
    buildQueue(pointId);
  }

  el("reviewBtn").addEventListener("click", () => openQuiz(null));
  el("quizBackBtn").addEventListener("click", () => { saveProgress(); showView("browse"); });
  el("quizEmptyBackBtn").addEventListener("click", () => showView("browse"));

  function next() {
    if (index < queue.length - 1) { index++; renderQuizItem(); saveProgress(); }
    else { queue = []; renderQuizItem(); saveProgress(); }
  }

  // Mirrors kotoba-app.js's grade(): schedule via srs.js, then either requeue
  // the item later this session ("again") or move on ("good"/"easy"). Used
  // uniformly by cloze self-grading and by auto-graded mcq/build outcomes.
  function grade(level) {
    if (!queue.length) return;
    const it = queue[index];
    srsMap[it.key] = schedule(srsMap[it.key], level);
    saveSrs(BUNPOU_DECK, currentUser, srsMap);
    updateDueCount();

    if (level === "again") {
      sessionMissed++;
      againQueue.add(it.key);
      updateScore();
      updateQueueBadge();
      queue.splice(index, 1);
      if (queue.length === 0) { renderQuizItem(); saveProgress(); return; }
      const remaining = queue.length - index;
      const lo = Math.min(queue.length, index + Math.max(1, Math.floor(remaining * 0.5)));
      const hiNoLast = Math.max(lo, queue.length - 1);
      const insertAt = lo + Math.floor(Math.random() * (hiNoLast - lo + 1));
      queue.splice(insertAt, 0, it);
      if (index >= queue.length) index = queue.length - 1;
      renderQuizItem();
      saveProgress();
    } else {
      sessionCorrect++;
      againQueue.delete(it.key);
      updateScore();
      updateQueueBadge();
      next();
    }
  }

  // ---- Per-mode renderers ------------------------------------------------------
  function renderCloze(it, data) {
    const p = data.point, ex = data.example;
    quizFace.innerHTML =
      '<span class="badge badge-type quiz-type-badge">Ingat · ' + esc(p.level) + " · " + esc(p.pattern) + "</span>" +
      '<div class="quiz-jp">' + blankTarget(ex.jp, ex.cloze) + "</div>" +
      '<div class="quiz-actions"><button class="btn btn-flip" id="revealBtn" type="button">Tunjukkan jawaban</button></div>' +
      '<div class="reveal-panel" id="revealPanel" hidden>' +
        '<div class="example-jp">' + highlightTarget(ex.jp, ex.cloze) + "</div>" +
        '<div class="example-reading">' + esc(ex.reading || "") + "</div>" +
        '<div class="example-meaning">' + esc(ex.meaning || "") + "</div>" +
        '<div class="quiz-pattern-note"><strong>' + esc(p.pattern) + "</strong> — " + esc(p.meaning) + "</div>" +
      "</div>" +
      '<div class="answerbar-buttons" id="clozeAnswerbar" hidden>' +
        '<button class="btn btn-again" type="button" data-grade="again"><span class="btn-icon">↺</span> Again</button>' +
        '<button class="btn btn-good" type="button" data-grade="good"><span class="btn-icon">✓</span> Good</button>' +
        '<button class="btn btn-easy" type="button" data-grade="easy"><span class="btn-icon">⚡</span> Easy</button>' +
      "</div>";

    el("revealBtn").addEventListener("click", () => {
      el("revealPanel").hidden = false;
      el("clozeAnswerbar").hidden = false;
      el("revealBtn").hidden = true;
    });
    el("clozeAnswerbar").querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => grade(b.getAttribute("data-grade")));
    });
  }

  function renderMcq(it, data) {
    const p = data.point, m = data.mcq;
    quizFace.innerHTML =
      '<span class="badge badge-type quiz-type-badge">Bentuk Tata Bahasa · ' + esc(p.level) + "</span>" +
      '<div class="quiz-jp">' + esc(m.sentence) + "</div>" +
      '<div class="mcq-options">' +
        m.options.map((opt, i) =>
          '<button class="btn mcq-opt" type="button" data-i="' + i + '">' + esc(opt) + "</button>"
        ).join("") +
      "</div>" +
      '<div class="mcq-feedback" id="mcqFeedback" hidden></div>' +
      '<div class="quiz-actions"><button class="btn btn-flip" id="mcqNextBtn" type="button" hidden>Lanjut →</button></div>';

    let answered = false;
    quizFace.querySelectorAll(".mcq-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const i = Number(btn.getAttribute("data-i"));
        const correct = i === m.answer;
        quizFace.querySelectorAll(".mcq-opt").forEach((b, bi) => {
          b.disabled = true;
          if (bi === m.answer) b.classList.add("is-correct");
          else if (bi === i) b.classList.add("is-wrong");
        });
        const fb = el("mcqFeedback");
        fb.hidden = false;
        fb.textContent = (correct ? "Benar! " : "Kurang tepat. ") + (m.explain || "");
        el("mcqNextBtn").hidden = false;
        el("mcqNextBtn").addEventListener("click", () => grade(correct ? "good" : "again"), { once: true });
      });
    });
  }

  function renderBuild(it, data) {
    const p = data.point, b = data.build;
    const answerSlots = [];
    let bank = shuffleArray(b.chunks.map((c, i) => ({ text: c, uid: i })));

    quizFace.innerHTML =
      '<span class="badge badge-type quiz-type-badge">Susun Kalimat · ' + esc(p.level) + "</span>" +
      '<div class="quiz-translation">' + esc(b.translation || "") + "</div>" +
      '<div class="build-row build-answer" id="buildAnswer"></div>' +
      '<div class="build-row build-bank" id="buildBank"></div>' +
      '<div class="quiz-actions">' +
        '<button class="btn btn-ghost" id="buildClearBtn" type="button">Ulang</button>' +
        '<button class="btn btn-flip" id="buildCheckBtn" type="button">Periksa</button>' +
        '<button class="btn btn-flip" id="buildNextBtn" type="button" hidden>Lanjut →</button>' +
      "</div>" +
      '<div class="build-feedback" id="buildFeedback" hidden></div>';

    const answerEl = el("buildAnswer");
    const bankEl = el("buildBank");
    let locked = false;

    function renderChunks() {
      bankEl.innerHTML = bank.map((c) =>
        '<button class="build-chunk" type="button" data-uid="' + c.uid + '">' + esc(c.text) + "</button>"
      ).join("");
      answerEl.innerHTML = answerSlots.map((c) =>
        '<button class="build-chunk" type="button" data-uid="' + c.uid + '">' + esc(c.text) + "</button>"
      ).join("");
      bankEl.querySelectorAll(".build-chunk").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (locked) return;
          const uid = Number(btn.getAttribute("data-uid"));
          const i = bank.findIndex((c) => c.uid === uid);
          if (i === -1) return;
          answerSlots.push(bank[i]);
          bank.splice(i, 1);
          renderChunks();
        });
      });
      answerEl.querySelectorAll(".build-chunk").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (locked) return;
          const uid = Number(btn.getAttribute("data-uid"));
          const i = answerSlots.findIndex((c) => c.uid === uid);
          if (i === -1) return;
          bank.push(answerSlots[i]);
          answerSlots.splice(i, 1);
          renderChunks();
        });
      });
    }
    renderChunks();

    el("buildClearBtn").addEventListener("click", () => {
      if (locked) return;
      bank = bank.concat(answerSlots.splice(0, answerSlots.length));
      renderChunks();
    });

    el("buildCheckBtn").addEventListener("click", () => {
      if (locked) return;
      locked = true;
      const attempt = answerSlots.map((c) => c.text);
      const correct = attempt.length === b.answer.length && attempt.every((t, i) => t === b.answer[i]);
      const fb = el("buildFeedback");
      fb.hidden = false;
      fb.className = "build-feedback " + (correct ? "is-correct" : "is-wrong");
      fb.textContent = correct ? "Benar! " + b.answer.join("") : "Urutan yang benar: " + b.answer.join("");
      el("buildCheckBtn").hidden = true;
      el("buildNextBtn").hidden = false;
      el("buildNextBtn").addEventListener("click", () => grade(correct ? "good" : "again"), { once: true });
    });
  }

  function renderQuizItem() {
    if (!queue.length) {
      quizScene.hidden = true;
      quizEmpty.hidden = false;
      posTotal.textContent = 0;
      posNow.textContent = 0;
      progressFill.style.width = "0%";
      return;
    }
    quizScene.hidden = false;
    quizEmpty.hidden = true;

    const it = queue[index];
    const data = itemData(it);
    posNow.textContent = index + 1;
    posTotal.textContent = queue.length;
    progressFill.style.width = (((index + 1) / queue.length) * 100) + "%";

    if (it.type === "cloze") renderCloze(it, data);
    else if (it.type === "mcq") renderMcq(it, data);
    else renderBuild(it, data);
  }

  // ---- Init: resume a saved session if one exists, otherwise start on browse.
  bumpStreak(currentUser);
  renderBrowse();
  const saved = loadProgress();
  if (saved && Array.isArray(saved.order) && saved.order.length) {
    showView("quiz");
    restoreProgress(saved);
  } else {
    showView("browse");
  }
})();
