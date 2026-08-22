/* 言葉 Kotoba flashcards — standalone app logic. Independent of app.js / data.js
 * (the N4 kanji deck) so this section can change without affecting it. */

(function () {
  "use strict";

  const el = (id) => document.getElementById(id);
  const card = el("card");
  const cardScene = el("cardScene");
  const cardFront = document.querySelector(".card-front");
  const cardBack = document.querySelector(".card-back");
  const frontLesson = el("frontLesson");
  const frontKana = el("frontKana");
  const frontKanji = el("frontKanji");
  const frontContext = el("frontContext");
  const backType = el("backType");
  const backKana = el("backKana");
  const backKanji = el("backKanji");
  const backContext = el("backContext");
  const backMeaning = el("backMeaning");
  const posNow = el("posNow");
  const posTotal = el("posTotal");
  const progressFill = el("progressFill");
  const wordCount = el("wordCount");
  const dueCountEl = el("dueCount");
  const speakFrontBtn = el("speakFrontBtn");

  // Graded answering (Again / Good / Easy) — same scheduling engine (srs.js)
  // and visual language as the N4 kanji deck, so studying here also builds
  // the shared streak and behaves consistently across both decks.
  const againBtn = el("againBtn");
  const goodBtn = el("goodBtn");
  const easyBtn = el("easyBtn");
  const scoreCountEl = el("scoreCount");
  const missCountEl = el("missCount");
  const queueBadge = el("queueBadge");
  const queueCountEl = el("queueCount");

  function ls(get, key, val) {
    try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); }
    catch (e) { return null; }
  }

  // Kotoba has no login UI of its own — it studies as whoever is currently
  // signed into the kanji deck (or "guest"), so SRS progress and the daily
  // streak are shared across both decks rather than siloed per page.
  const currentUser = ls(true, "kanji.currentUser") || "guest";
  const KOTOBA_DECK = "kotoba";

  // Stable per-card id (position in the fixed KOTOBA array never changes),
  // used as the SRS key and for restoring a saved session after reload.
  KOTOBA.forEach((c, i) => { c.key = "k-" + c.lesson + "-" + i; });
  const cardsByKey = new Map(KOTOBA.map((c) => [c.key, c]));

  let srsMap = loadSrs(KOTOBA_DECK, currentUser);
  let sessionCorrect = 0;
  let sessionMissed = 0;
  let againQueue = new Set();

  let deck = [];
  let index = 0;

  function updateScore() {
    scoreCountEl.textContent = sessionCorrect;
    missCountEl.textContent = sessionMissed;
  }

  function updateQueueBadge() {
    queueCountEl.textContent = againQueue.size;
    queueBadge.hidden = againQueue.size === 0;
  }

  function updateDueCount() {
    const now = Date.now();
    let due = 0;
    for (const c of KOTOBA) {
      const entry = srsMap[c.key];
      if (entry && entry.box > 0 && isDue(entry, now)) due++;
    }
    dueCountEl.textContent = due;
  }

  // ---- Session progress persistence ----
  const progressKeyFor = (u) => "kotoba.progress." + u;

  function saveProgress() {
    const data = {
      order: deck.map((c) => c.key),
      index, sessionCorrect, sessionMissed,
      againQueue: [...againQueue]
    };
    ls(false, progressKeyFor(currentUser), JSON.stringify(data));
  }

  function loadProgress() {
    const raw = ls(true, progressKeyFor(currentUser));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function restoreProgress(saved) {
    if (!saved || !Array.isArray(saved.order) || !saved.order.length) return false;
    const restored = saved.order.map((k) => cardsByKey.get(k)).filter(Boolean);
    if (!restored.length) return false;
    deck = restored;
    index = Math.min(Math.max(0, saved.index || 0), deck.length - 1);
    sessionCorrect = saved.sessionCorrect || 0;
    sessionMissed = saved.sessionMissed || 0;
    againQueue = new Set(saved.againQueue || []);
    wordCount.textContent = KOTOBA.length;
    updateScore();
    updateQueueBadge();
    updateDueCount();
    render();
    return true;
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Due reviews first (oldest-overdue first), then never-graded cards fill
  // the rest — same due-based approach as the kanji deck's buildDeck().
  function buildDeck(shuffle) {
    const now = Date.now();
    const dueCards = [];
    const newCards = [];
    for (const c of KOTOBA) {
      const entry = srsMap[c.key];
      if (entry && entry.box > 0) {
        if (isDue(entry, now)) dueCards.push({ c, due: entry.due });
      } else {
        newCards.push(c);
      }
    }
    dueCards.sort((a, b) => a.due - b.due);
    const orderedNew = shuffle ? shuffleArray(newCards) : newCards;
    const ordered = dueCards.map((d) => d.c).concat(orderedNew);

    deck = shuffle ? shuffleArray(ordered) : ordered;
    index = 0;
    sessionCorrect = 0;
    sessionMissed = 0;
    againQueue = new Set();
    wordCount.textContent = KOTOBA.length;
    updateScore();
    updateQueueBadge();
    updateDueCount();
    render();
    saveProgress();
  }

  function unflip() { card.classList.remove("is-flipped"); }

  // Some vocab words run long (e.g. "うちゅうステーション", 10 kana) and the
  // clamp()-based responsive size in kotoba.css is tuned for the common case
  // — on a long word it can spill past the fixed-height card on narrow
  // screens. Shrink it in steps until the face it lives in stops overflowing.
  function fitWordText(faceEl, wordEl) {
    if (!faceEl || !wordEl) return;
    wordEl.style.fontSize = ""; // reset to the CSS clamp() size before measuring
    const minSize = 22;
    let size = parseFloat(getComputedStyle(wordEl).fontSize);
    let guard = 0;
    while (faceEl.scrollHeight > faceEl.clientHeight + 1 && size > minSize && guard < 40) {
      size -= 2;
      wordEl.style.fontSize = size + "px";
      guard++;
    }
  }

  function render() {
    const c = deck[index];
    posTotal.textContent = deck.length;
    if (!c) return;
    unflip();

    frontLesson.textContent = "Pelajaran " + c.lesson;
    frontKana.textContent = c.kana;
    if (c.kanji) { frontKanji.textContent = c.kanji; frontKanji.hidden = false; }
    else { frontKanji.textContent = ""; frontKanji.hidden = true; }
    if (c.context) { frontContext.textContent = c.context; frontContext.hidden = false; }
    else { frontContext.hidden = true; }

    backType.textContent = c.type;
    backKana.textContent = c.kana;
    if (c.kanji) { backKanji.textContent = c.kanji; backKanji.hidden = false; }
    else { backKanji.textContent = ""; backKanji.hidden = true; }
    if (c.context) { backContext.textContent = c.context; backContext.hidden = false; }
    else { backContext.hidden = true; }
    backMeaning.textContent = c.meaning;

    fitWordText(cardFront, frontKana);
    fitWordText(cardBack, backKana);

    posNow.textContent = index + 1;
    const pct = deck.length ? ((index + 1) / deck.length) * 100 : 0;
    progressFill.style.width = pct + "%";
  }

  // ---- Text-to-speech (device voice only — no pre-rendered audio for this deck yet) ----
  const ttsSupported = "speechSynthesis" in window;
  let jaVoice = null;
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
    let voicePollAttempts = 0;
    const voicePoll = setInterval(() => {
      voicePollAttempts++;
      if (pickJaVoice() || voicePollAttempts > 15) clearInterval(voicePoll);
    }, 300);
  }

  function speak(text, btn) {
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

  function speakCurrent() {
    const c = deck[index];
    if (c) speak(c.kana, speakFrontBtn);
  }

  // ---- Navigation ----
  function next() { if (!deck.length) return; index = (index + 1) % deck.length; render(); saveProgress(); }
  function prev() { if (!deck.length) return; index = (index - 1 + deck.length) % deck.length; render(); saveProgress(); }
  function flip() { card.classList.toggle("is-flipped"); }

  // ---- Graded answering (Again / Good / Easy) ----
  // Mirrors the kanji deck's grade(): schedule via srs.js, then either
  // requeue the card later this session ("again") or move on ("good"/"easy").
  function grade(level) {
    if (!deck.length) return;
    const c = deck[index];
    srsMap[c.key] = schedule(srsMap[c.key], level);
    saveSrs(KOTOBA_DECK, currentUser, srsMap);
    updateDueCount();

    if (level === "again") {
      sessionMissed++;
      againQueue.add(c.key);
      updateScore();
      updateQueueBadge();
      deck.splice(index, 1);
      if (deck.length === 0) { render(); saveProgress(); return; }
      const remaining = deck.length - index;
      const lo = Math.min(deck.length, index + Math.max(1, Math.floor(remaining * 0.5)));
      const hiNoLast = Math.max(lo, deck.length - 1);
      const insertAt = lo + Math.floor(Math.random() * (hiNoLast - lo + 1));
      deck.splice(insertAt, 0, c);
      if (index >= deck.length) index = deck.length - 1;
      posTotal.textContent = deck.length;
      render();
      saveProgress();
    } else {
      sessionCorrect++;
      againQueue.delete(c.key);
      updateScore();
      updateQueueBadge();
      next();
    }
  }

  // ---- Swipe navigation (touch / mouse drag on the card) ----
  // Attached to cardScene (not the flipping .card itself) so hit-testing
  // stays stable through the rotateY flip animation.
  function setupSwipe(target, onSwipeLeft, onSwipeRight) {
    const THRESHOLD = 50;   // min horizontal travel, px
    const RESTRAINT = 0.6;  // max allowed |dy| relative to |dx|
    let startX = 0, startY = 0, tracking = false, swiped = false;

    target.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      startX = e.clientX; startY = e.clientY;
      tracking = true;
    });
    target.addEventListener("pointerup", (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) >= THRESHOLD && Math.abs(dy) <= Math.abs(dx) * RESTRAINT) {
        swiped = true;
        if (dx < 0) onSwipeLeft(); else onSwipeRight();
      }
    });
    target.addEventListener("pointercancel", () => { tracking = false; });
    // Swallow the click a swipe leaves behind so it doesn't also flip the card.
    target.addEventListener("click", (e) => {
      if (swiped) { swiped = false; e.stopPropagation(); }
    }, true);
  }

  // ---- Events ----
  card.addEventListener("click", flip);
  setupSwipe(cardScene, next, prev);
  el("flipBtn").addEventListener("click", flip);
  el("nextBtn").addEventListener("click", next);
  el("prevBtn").addEventListener("click", prev);
  el("shuffleBtn").addEventListener("click", () => buildDeck(true));
  el("resetBtn").addEventListener("click", () => buildDeck(false));
  speakFrontBtn.addEventListener("click", (e) => { e.stopPropagation(); speakCurrent(); });

  againBtn.addEventListener("click", () => grade("again"));
  goodBtn.addEventListener("click", () => grade("good"));
  easyBtn.addEventListener("click", () => grade("easy"));

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      fitWordText(cardFront, frontKana);
      fitWordText(cardBack, backKana);
    }, 150);
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    switch (e.key) {
      case " ":
      case "Enter": e.preventDefault(); flip(); break;
      case "ArrowRight": e.preventDefault(); next(); break;
      case "ArrowLeft": e.preventDefault(); prev(); break;
      case "s": case "S": buildDeck(true); break;
      case "1": case "n": case "N": case "ArrowDown": e.preventDefault(); grade("again"); break;
      case "2": case "y": case "Y": case "ArrowUp": e.preventDefault(); grade("good"); break;
      case "3": e.preventDefault(); grade("easy"); break;
      case "p": case "P": e.preventDefault(); speakCurrent(); break;
    }
  });

  // ---- Init: resume a saved session (position/score/queue) if one exists
  // for this user, otherwise build a fresh due-first session. ----
  bumpStreak(currentUser);
  if (!restoreProgress(loadProgress())) buildDeck(true);
})();
