/* 文法 Bunpou — grammar practice app. Independent of app.js/kotoba-app.js
 * (own dataset, own views) but shares srs.js for scheduling/streak so
 * progress feels consistent across every section of the app.
 *
 * Views (no SPA router — just show/hide sections, like the login/help/progress
 * overlays in app.js):
 *   #browseView  — grammar points grouped by level + function, with mastery pips
 *   #studyView   — full "how to use it" reference for one point
 *   #quizView    — due-first SRS queue mixing particle / mcq / sentence-build items
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

  // bunpou-quiz-data.js holds the bulk drill bank. Appending (never splicing in
  // front) keeps every existing SRS key — pointId::mcq::N — pointed at the same
  // question it was scheduled against. Guarded so the page still runs if that
  // script fails to load.
  if (typeof BUNPOU_QUIZ !== "undefined") {
    for (const p of BUNPOU) {
      const extraMcq = (BUNPOU_QUIZ.mcq || {})[p.id];
      const extraJlpt = (BUNPOU_QUIZ.jlptBuild || {})[p.id];
      const extraBuild = (BUNPOU_QUIZ.build || {})[p.id];
      if (extraMcq && extraMcq.length) p.mcq = (p.mcq || []).concat(extraMcq);
      if (extraJlpt && extraJlpt.length) p.jlptBuild = (p.jlptBuild || []).concat(extraJlpt);
      if (extraBuild && extraBuild.length) {
        // `chunks` is authored in the correct order; renderBuild grades against
        // `answer`, so derive it here rather than duplicating the array in the
        // data file where the two copies could silently drift apart.
        p.build = (p.build || []).concat(extraBuild.map((b) => ({
          chunks: b.chunks,
          answer: b.answer || b.chunks.slice(),
          translation: b.translation,
        })));
      }
    }
  }

  const RANK = { new: 0, learning: 1, mature: 2 };

  function buildItemPool() {
    const items = [];
    for (const p of BUNPOU) {
      (p.mcq || []).forEach((m, i) => {
        items.push({ type: "mcq", pointId: p.id, idx: i, key: p.id + "::mcq::" + i });
      });
      (p.build || []).forEach((b, i) => {
        items.push({ type: "build", pointId: p.id, idx: i, key: p.id + "::build::" + i });
      });
      (p.jlptBuild || []).forEach((b, i) => {
        items.push({ type: "jlptbuild", pointId: p.id, idx: i, key: p.id + "::jlptbuild::" + i });
      });
    }
    // Particle drill bank (bunpou-particle-data.js) — global, not attached to
    // any one grammar point, so pointId stays null. SRS keys are stable ids
    // ("particle::<id>"), not positional, so the bank is safe to reorder.
    if (typeof BUNPOU_PARTICLE !== "undefined") {
      BUNPOU_PARTICLE.forEach((q, i) => {
        items.push({ type: "particle", pointId: null, idx: i, key: "particle::" + q.id });
      });
    }
    return items;
  }

  const ITEM_POOL = buildItemPool();
  const itemsByKey = new Map(ITEM_POOL.map((it) => [it.key, it]));

  const itemKeysByPoint = new Map();
  for (const it of ITEM_POOL) {
    if (it.pointId == null) continue; // particle items aren't scoped to a point
    if (!itemKeysByPoint.has(it.pointId)) itemKeysByPoint.set(it.pointId, []);
    itemKeysByPoint.get(it.pointId).push(it.key);
  }

  let srsMap = loadSrs(BUNPOU_DECK, currentUser);
  // Items marked "sudah paham" — excluded from future buildQueue() calls
  // (see grep for "sudah paham" below). Keyed the same as srsMap: item.key.
  let bunpouKnown = loadKnown(BUNPOU_DECK, currentUser);

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
    if (it.type === "particle") return { particle: BUNPOU_PARTICLE[it.idx] };
    const p = pointsById.get(it.pointId);
    if (it.type === "mcq") return { point: p, mcq: p.mcq[it.idx] };
    if (it.type === "jlptbuild") return { point: p, jlptBuild: p.jlptBuild[it.idx] };
    return { point: p, build: p.build[it.idx] };
  }

  const LETTERS = ["A", "B", "C", "D"];

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

  // ---- Furigana ---------------------------------------------------------------
  // Questions author readings inline as 漢字[かんじ]. rubyize() turns each span
  // into a <ruby> element; the furigana toggle then hides the <rt> purely in CSS
  // (see .furi-off in bunpou.css), so flipping it never re-renders — and so it
  // can't disturb a question the learner has already answered.
  const FURIGANA_RE = /([一-鿿々ヶ]+)\[([^\][]*)\]/g;

  // Escapes first, then wraps — the bracket syntax survives esc() untouched
  // because esc() only rewrites & < >.
  function rubyize(s) {
    return esc(s).replace(FURIGANA_RE, (_, base, rt) => "<ruby>" + base + "<rt>" + rt + "</rt></ruby>");
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
  // n4sim.js's #examView and choukai.js's #choukaiView are siblings that
  // those modules show/hide on their own — but only ever un-hide *their*
  // own view plus this module's three (see showExam/showChoukai). showView
  // is the single owner of "what's on screen": every switch here also hides
  // both foreign views, and both modules route their exit back through
  // window.__bunpouShowView instead of touching #browseView directly.
  const examViewEl = el("examView");
  const choukaiViewEl = el("choukaiView");

  let currentLevelFilter = "all";
  let studyPointId = null;

  function showView(name) {
    browseView.hidden = name !== "browse";
    studyView.hidden = name !== "study";
    quizView.hidden = name !== "quiz";
    if (examViewEl) examViewEl.hidden = true;
    if (choukaiViewEl) choukaiViewEl.hidden = true;
    reviewBtn.hidden = name !== "browse";
    if (name === "browse") renderBrowse();
  }
  window.__bunpouShowView = showView;

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
            '<span class="bp-text">' +
              '<span class="bp-pattern">' + esc(p.pattern) + "</span>" +
              '<span class="bp-meaning">' + esc(p.meaning) + "</span>" +
            "</span>" +
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
    if (studyPointId) showModeSheet(studyPointId);
  });

  // ---- Mode picker (choose which drill type to focus a session on) -----------
  // Each MODE_DEFS entry's `cls` also drives the color-coded badge on quiz
  // cards (see renderParticle/renderMcq/renderJlptBuild/renderBuild), so the
  // color the learner picks in the sheet stays consistent throughout the session.
  const MODE_DEFS = [
    { key: "all", cls: "all", icon: "🎲", label: "Semua Mode", desc: "Campuran semua jenis latihan." },
    { key: "particle", cls: "particle", icon: "🧷", label: "構造 · Partikel", desc: "Pilih partikel yang tepat untuk melengkapi kalimat." },
    { key: "mcq", cls: "mcq", icon: "🔤", label: "文法1 · Pilihan Ganda", desc: "Pilih bentuk/partikel yang paling tepat." },
    { key: "jlptbuild", cls: "jlptbuild", icon: "🧩", label: "文法2 · Susun (★)", desc: "Urutkan 4 potongan, tebak posisi ★." },
    { key: "build", cls: "build", icon: "🔀", label: "Susun Bebas", desc: "Susun seluruh kalimat dari potongan acak." }
  ];
  const MODE_BY_KEY = new Map(MODE_DEFS.map((m) => [m.key, m]));

  const modeOverlay = el("modeOverlay");
  const modeListEl = el("modeList");
  const modeSheetTitle = el("modeSheetTitle");

  function modeCounts(pointId, key) {
    const pool = pointId ? ITEM_POOL.filter((it) => it.pointId === pointId) : ITEM_POOL;
    const filtered = key === "all" ? pool : pool.filter((it) => it.type === key);
    const now = Date.now();
    let due = 0;
    for (const it of filtered) {
      const entry = srsMap[it.key];
      if (entry && entry.box > 0 && isDue(entry, now)) due++;
    }
    return { total: filtered.length, due };
  }

  function renderModeList(pointId) {
    const point = pointId ? pointsById.get(pointId) : null;
    modeSheetTitle.textContent = point ? "Latihan: " + point.pattern : "Pilih Mode Latihan";
    modeListEl.innerHTML = MODE_DEFS.map((m) => {
      const c = modeCounts(pointId, m.key);
      const disabled = c.total === 0;
      const countText = disabled ? "Tidak ada" : (c.due > 0 ? c.due + " due · " : "") + c.total + " soal";
      return (
        '<button class="mode-row mode-row-' + m.cls + (disabled ? " is-disabled" : "") + '" type="button" data-mode="' + m.key + '"' + (disabled ? " disabled" : "") + ">" +
          '<span class="mode-row-icon">' + m.icon + "</span>" +
          '<span class="mode-row-text">' +
            '<span class="mode-row-title">' + esc(m.label) + "</span>" +
            '<span class="mode-row-desc">' + esc(m.desc) + "</span>" +
          "</span>" +
          '<span class="mode-row-count">' + esc(countText) + "</span>" +
        "</button>"
      );
    }).join("");

    modeListEl.querySelectorAll(".mode-row:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => {
        hideModeSheet();
        openQuiz(pointId, btn.getAttribute("data-mode"));
      });
    });
  }

  function showModeSheet(pointId) {
    renderModeList(pointId || null);
    modeOverlay.hidden = false;
  }
  function hideModeSheet() { modeOverlay.hidden = true; }

  modeOverlay.addEventListener("click", (e) => { if (e.target === modeOverlay) hideModeSheet(); });
  el("modeCloseBtn").addEventListener("click", hideModeSheet);

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
  let scopeMode = "all"; // which MODE_DEFS key this session was filtered to

  function updateScore() {
    scoreCountEl.textContent = sessionCorrect;
    missCountEl.textContent = sessionMissed;
  }
  function updateQueueBadge() {
    queueCountEl.textContent = againQueue.size;
    queueBadge.hidden = againQueue.size === 0;
  }
  function updateModeTag() {
    const tag = el("quizModeTag");
    const m = MODE_BY_KEY.get(scopeMode);
    if (!m || m.key === "all") { tag.hidden = true; return; }
    tag.hidden = false;
    tag.className = "quiz-mode-tag quiz-mode-tag-" + m.cls;
    tag.textContent = m.icon + " " + m.label;
  }

  const progressKeyFor = (u) => "bunpou.progress." + u;

  function saveProgress() {
    const data = {
      order: queue.map((it) => it.key),
      index, sessionCorrect, sessionMissed,
      againQueue: [...againQueue],
      scopePointId, scopeMode
    };
    ls(false, progressKeyFor(currentUser), JSON.stringify(data));
  }

  function loadProgress() {
    const raw = ls(true, progressKeyFor(currentUser));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  // Set when the pool would have had items but every one of them is marked
  // "sudah paham" — renderQuizItem() shows a different #quizEmpty message
  // (with a reset button) for this case than for a genuinely empty mode.
  let quizAllKnownEmpty = false;

  function buildQueue(pointId, modeKey) {
    const mode = MODE_BY_KEY.has(modeKey) ? modeKey : "all";
    const now = Date.now();
    let pool = pointId ? ITEM_POOL.filter((it) => it.pointId === pointId) : ITEM_POOL;
    if (mode !== "all") pool = pool.filter((it) => it.type === mode);
    const poolBeforeKnown = pool;
    pool = pool.filter((it) => !bunpouKnown.has(it.key));
    quizAllKnownEmpty = pool.length === 0 && poolBeforeKnown.length > 0;
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
    scopeMode = mode;
    updateScore();
    updateQueueBadge();
    updateModeTag();
    updateDueCount();
    renderQuizItem();
    saveProgress();
  }

  function restoreProgress(saved) {
    if (!saved || !Array.isArray(saved.order) || !saved.order.length) return false;
    const restored = saved.order.map((k) => itemsByKey.get(k)).filter((it) => it && !bunpouKnown.has(it.key));
    if (!restored.length) return false;
    queue = restored;
    index = Math.min(Math.max(0, saved.index || 0), queue.length - 1);
    sessionCorrect = saved.sessionCorrect || 0;
    sessionMissed = saved.sessionMissed || 0;
    againQueue = new Set(saved.againQueue || []);
    scopePointId = saved.scopePointId || null;
    scopeMode = saved.scopeMode || "all";
    updateScore();
    updateQueueBadge();
    updateModeTag();
    updateDueCount();
    renderQuizItem();
    return true;
  }

  function openQuiz(pointId, modeKey) {
    showView("quiz");
    buildQueue(pointId, modeKey);
  }

  el("reviewBtn").addEventListener("click", () => showModeSheet(null));
  el("quizBackBtn").addEventListener("click", () => { saveProgress(); showView("browse"); });
  el("quizEmptyBackBtn").addEventListener("click", () => showView("browse"));

  function next() {
    if (index < queue.length - 1) { index++; renderQuizItem(); saveProgress(); }
    else { queue = []; renderQuizItem(); saveProgress(); }
  }

  // Mirrors kotoba-app.js's grade(): schedule via srs.js, then either requeue
  // the item later this session ("again") or move on ("good"/"easy"). Used
  // uniformly by every mode's auto-graded (mcq/particle/build) outcome.
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
  // Shared engine behind renderMcq/renderParticle: both are single-shot
  // multiple-choice cards that shuffle their options, lock in an answer, and
  // reveal an explanation. Only the badge and question source differ.
  function renderMcqCard(opts) {
    const badgeCls = opts.badgeCls, badgeText = opts.badgeText;
    const sentence = opts.sentence, options = opts.options, answer = opts.answer;
    const explain = opts.explain, translation = opts.translation;

    // Options are authored with the correct answer first (answer: 0) and shuffled
    // here, the same way n4sim.js and choukai.js do it. Without this the answer
    // would sit on button A every single time and the drill would teach nothing.
    const shuffled = shuffleArray(options.map((text, i) => ({ text, correct: i === answer })));
    const answerAt = shuffled.findIndex((o) => o.correct);

    quizFace.innerHTML =
      '<span class="badge badge-type quiz-type-badge quiz-type-badge-' + badgeCls + '">' + esc(badgeText) + "</span>" +
      '<div class="quiz-jp">' + rubyize(sentence) + "</div>" +
      (translation ? '<div class="quiz-translation quiz-translation-q">' + esc(translation) + "</div>" : "") +
      '<div class="mcq-options">' +
        shuffled.map((o, i) =>
          '<button class="btn mcq-opt" type="button" data-i="' + i + '">' +
            '<span class="opt-letter">' + LETTERS[i] + '</span><span class="opt-text">' + rubyize(o.text) + "</span>" +
          "</button>"
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
        const correct = i === answerAt;
        quizFace.querySelectorAll(".mcq-opt").forEach((b, bi) => {
          b.disabled = true;
          if (bi === answerAt) b.classList.add("is-correct");
          else if (bi === i) b.classList.add("is-wrong");
        });
        // innerHTML (not textContent) so the explanation's own furigana renders.
        const fb = el("mcqFeedback");
        fb.hidden = false;
        fb.innerHTML =
          (correct ? "Benar! " : "Kurang tepat, jawaban yang benar: " + LETTERS[answerAt] + ". ") +
          rubyize(explain || "") +
          (translation ? '<span class="quiz-translation quiz-translation-a">' + esc(translation) + "</span>" : "");
        el("mcqNextBtn").hidden = false;
        el("mcqNextBtn").addEventListener("click", () => grade(correct ? "good" : "again"), { once: true });
      });
    });
  }

  function renderMcq(it, data) {
    const p = data.point, m = data.mcq;
    renderMcqCard({
      badgeCls: "mcq", badgeText: "文法1 · 文法形式の判断 · " + p.level,
      sentence: m.sentence, options: m.options, answer: m.answer,
      explain: m.explain, translation: m.translation
    });
  }

  function renderParticle(it, data) {
    const q = data.particle;
    renderMcqCard({
      badgeCls: "particle", badgeText: "構造 · 助詞 · " + q.level + " · " + q.focus,
      sentence: q.sentence, options: q.options, answer: q.answer,
      explain: q.explain, translation: q.translation
    });
  }

  // Authentic JLPT 文法2 (文の組み立て) format: 4 chunks form one sentence,
  // one slot is marked ★ — the learner mentally sorts all 4, then picks which
  // lettered chunk belongs in the ★ slot (rather than manually dragging the
  // whole sentence into place, like the free-arrange `build` mode above).
  function renderJlptBuild(it, data) {
    const p = data.point, b = data.jlptBuild;
    const options = shuffleArray(b.chunks.map((c, i) => ({ text: c, uid: i })));
    const correctText = b.chunks[b.starIndex];

    const slotsHtml = b.chunks.map((c, i) =>
      i === b.starIndex
        ? '<span class="jlpt-slot jlpt-slot-star">★</span>'
        : '<span class="jlpt-slot">＿＿＿</span>'
    ).join("");

    quizFace.innerHTML =
      '<span class="badge badge-type quiz-type-badge quiz-type-badge-jlptbuild">文法2 · 文の組み立て · ' + esc(p.level) + "</span>" +
      (b.prefix ? '<div class="quiz-jp">' + rubyize(b.prefix) + "</div>" : "") +
      '<div class="jlpt-slots">' + slotsHtml + (b.suffix ? esc(b.suffix) : "") + "</div>" +
      '<p class="jlpt-hint">★ に入るのはどれですか。(Pilih pilihan yang masuk ke posisi ★.)</p>' +
      '<div class="mcq-options">' +
        options.map((o, i) =>
          '<button class="btn mcq-opt" type="button" data-uid="' + o.uid + '">' +
            '<span class="opt-letter">' + LETTERS[i] + '</span><span class="opt-text">' + rubyize(o.text) + "</span>" +
          "</button>"
        ).join("") +
      "</div>" +
      '<div class="mcq-feedback" id="jlptFeedback" hidden></div>' +
      '<div class="quiz-actions"><button class="btn btn-flip" id="jlptNextBtn" type="button" hidden>Lanjut →</button></div>';

    let answered = false;
    quizFace.querySelectorAll(".mcq-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const uid = Number(btn.getAttribute("data-uid"));
        const chosen = options.find((o) => o.uid === uid);
        const correct = chosen.text === correctText;
        quizFace.querySelectorAll(".mcq-opt").forEach((bt) => {
          bt.disabled = true;
          const u = Number(bt.getAttribute("data-uid"));
          const optText = options.find((o) => o.uid === u).text;
          if (optText === correctText) bt.classList.add("is-correct");
          else if (u === uid) bt.classList.add("is-wrong");
        });
        const fb = el("jlptFeedback");
        fb.hidden = false;
        fb.innerHTML =
          "正しい文 (kalimat yang benar): " + rubyize(b.chunks.join("") + (b.suffix || "")) +
          (b.translation ? '<span class="quiz-translation quiz-translation-a">' + esc(b.translation) + "</span>" : "");
        el("jlptNextBtn").hidden = false;
        el("jlptNextBtn").addEventListener("click", () => grade(correct ? "good" : "again"), { once: true });
      });
    });
  }

  function renderBuild(it, data) {
    const p = data.point, b = data.build;
    const answerSlots = [];
    let bank = shuffleArray(b.chunks.map((c, i) => ({ text: c, uid: i })));

    quizFace.innerHTML =
      '<span class="badge badge-type quiz-type-badge quiz-type-badge-build">Susun Kalimat (Bebas) · ' + esc(p.level) + "</span>" +
      // Deliberately NOT gated by the translation toggle: in this mode the
      // Indonesian line is the question itself — hide it and there is nothing
      // left telling the learner which sentence to assemble.
      '<div class="quiz-translation quiz-translation-prompt">' + esc(b.translation || "") + "</div>" +
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
        '<button class="build-chunk" type="button" data-uid="' + c.uid + '">' + rubyize(c.text) + "</button>"
      ).join("");
      answerEl.innerHTML = answerSlots.map((c) =>
        '<button class="build-chunk" type="button" data-uid="' + c.uid + '">' + rubyize(c.text) + "</button>"
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
      // innerHTML so the rebuilt sentence carries its furigana too.
      fb.innerHTML =
        (correct ? "Benar! " : "Urutan yang benar: ") + rubyize(b.answer.join("")) +
        (b.translation ? '<span class="quiz-translation quiz-translation-a">' + esc(b.translation) + "</span>" : "");
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
      // Distinguish "genuinely nothing to review" from "every item here is
      // marked sudah paham" — the latter gets its own message + reset button.
      const title = el("quizEmptyTitle"), sub = el("quizEmptySub"), resetBtn = el("quizEmptyResetKnownBtn");
      if (quizAllKnownEmpty) {
        title.textContent = "Semua item sudah ditandai paham 🎉";
        sub.innerHTML = "Semua soal di sini sudah kamu tandai <span>sudah paham</span>. Tekan reset untuk memasukkannya lagi ke sesi berikutnya.";
        resetBtn.hidden = false;
      } else {
        title.textContent = "Tidak ada yang perlu di-review 🎉";
        sub.innerHTML = 'Semua poin sudah <span>up to date</span>. Buka salah satu poin untuk belajar hal baru, atau kembali lagi nanti.';
        resetBtn.hidden = true;
      }
      return;
    }
    quizScene.hidden = false;
    quizEmpty.hidden = true;

    const it = queue[index];
    const data = itemData(it);
    posNow.textContent = index + 1;
    posTotal.textContent = queue.length;
    progressFill.style.width = (((index + 1) / queue.length) * 100) + "%";
    updateKnownBtn(it);

    if (it.type === "particle") renderParticle(it, data);
    else if (it.type === "mcq") renderMcq(it, data);
    else if (it.type === "jlptbuild") renderJlptBuild(it, data);
    else renderBuild(it, data);
  }

  // ---- "Sudah paham" toggle ----------------------------------------------
  // Sits outside #quizFace (see the quiz-display-toggles comment in
  // bunpou.html) so it survives every renderer rewriting that element's
  // innerHTML — renderQuizItem() just re-syncs its pressed state per item.
  const quizKnownBtn = el("quizKnownBtn");

  function updateKnownBtn(it) {
    const known = bunpouKnown.has(it.key);
    quizKnownBtn.classList.toggle("is-active", known);
    quizKnownBtn.textContent = known ? "✓ Paham" : "✓ Sudah Paham";
  }

  quizKnownBtn.addEventListener("click", () => {
    if (!queue.length) return;
    const it = queue[index];
    if (bunpouKnown.has(it.key)) bunpouKnown.delete(it.key);
    else bunpouKnown.add(it.key);
    saveKnown(BUNPOU_DECK, currentUser, bunpouKnown);
    updateKnownBtn(it);
  });

  el("quizEmptyResetKnownBtn").addEventListener("click", () => {
    bunpouKnown = new Set();
    saveKnown(BUNPOU_DECK, currentUser, bunpouKnown);
    buildQueue(scopePointId, scopeMode);
  });

  // ---- Display toggles (furigana / terjemahan) --------------------------------
  // Deliberately NOT stored in srs.js's "kanji.prefs" blob: app.js rewrites that
  // whole object in savePrefsFromUI(), so anything bunpou wrote there would be
  // silently dropped the next time the kanji deck saved its own settings.
  const BUNPOU_PREFS_KEY = "bunpou.prefs";

  function loadDisplayPrefs() {
    try { return JSON.parse(ls(true, BUNPOU_PREFS_KEY)) || {}; }
    catch (e) { return {}; }
  }

  const furiToggle = el("furiganaToggle");
  const transToggle = el("translateToggle");
  const quizViewEl = el("quizView");

  // The classes gate visibility in CSS only — see .furi-off / .trans-off.
  function applyDisplayPrefs() {
    quizViewEl.classList.toggle("furi-off", !furiToggle.checked);
    quizViewEl.classList.toggle("trans-off", !transToggle.checked);
  }

  function saveDisplayPrefs() {
    ls(false, BUNPOU_PREFS_KEY, JSON.stringify({
      furigana: furiToggle.checked,
      translate: transToggle.checked,
    }));
    applyDisplayPrefs();
  }

  (function initDisplayPrefs() {
    const prefs = loadDisplayPrefs();
    // Furigana defaults ON (this deck is read-heavy); translation defaults OFF so
    // the meaning isn't given away before the learner has answered.
    furiToggle.checked = prefs.furigana !== false;
    transToggle.checked = prefs.translate === true;
    applyDisplayPrefs();
    furiToggle.addEventListener("change", saveDisplayPrefs);
    transToggle.addEventListener("change", saveDisplayPrefs);
  })();

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
