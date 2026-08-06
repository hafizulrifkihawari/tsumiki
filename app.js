/* 漢字 N4 flashcards — app logic (vanilla JS, no build step) */

(function () {
  "use strict";

  const el = (id) => document.getElementById(id);
  const card = el("card");
  const frontType = el("frontType");
  const frontFormHint = el("frontFormHint");
  const frontWord = el("frontWord");
  const frontSentence = el("frontSentence");
  const frontRomaji = el("frontRomaji");
  const frontNote = el("frontNote");
  const backType = el("backType");
  const backForm = el("backForm");
  const backReading = el("backReading");
  const backRomaji = el("backRomaji");
  const backBaseRow = el("backBaseRow");
  const backBaseWord = el("backBaseWord");
  const backBaseReading = el("backBaseReading");
  const backMeaning = el("backMeaning");
  const backMeaningEn = el("backMeaningEn");
  const backExample = el("backExample");
  const exJp = el("exJp");
  const exReading = el("exReading");
  const exRomaji = el("exRomaji");
  const exMeaning = el("exMeaning");
  const posNow = el("posNow");
  const posTotal = el("posTotal");
  const progressFill = el("progressFill");
  const hintForm = el("hintForm");
  const clozeMode = el("clozeMode");
  const romajiMode = el("romajiMode");
  const autoSpeak = el("autoSpeak");
  const autoSpeakLabel = el("autoSpeakLabel");
  const speakFrontBtn = el("speakFrontBtn");
  const speakBackBtn = el("speakBackBtn");

  // Login + session
  const loginOverlay = el("loginOverlay");
  const loginForm = el("loginForm");
  const loginInput = el("loginInput");
  const userChip = el("userChip");
  const userName = el("userName");
  const userAvatar = el("userAvatar");
  const brandSub = el("brandSub");
  // Yes / No answering
  const yesBtn = el("yesBtn");
  const noBtn = el("noBtn");
  const scoreCount = el("scoreCount");
  const answerbar = el("answerbar");

  // Filter by the kanji's grammatical type
  const FILTERS = {
    all: () => true,
    verb: (c) => c.type === "godan" || c.type === "ichidan" || c.type === "suru",
    adj: (c) => c.type === "i-adj" || c.type === "na-adj",
    noun: (c) => c.type === "noun"
  };

  // Baseline: each session samples this many cards per kanji from the full
  // 600-card pool, so a page refresh rotates through different cards while
  // every kanji still shows up several times.
  const SESSION_CARDS_PER_KANJI = 3;
  // Then the whole session is capped to this many cards, so a page refresh
  // rotates through a fresh 100-card slice instead of the full ~900-card pool.
  const SESSION_CAP = 100;

  let filter = "all";
  let deck = [];
  let index = 0;
  let finished = false;
  let sessionCorrect = 0;

  // ---- Users & persistent progress -----------------------------------------
  // "guest"           -> nothing is saved; every session is a fresh shuffle.
  // any other name    -> per-kanji correctness is remembered in localStorage,
  //                      and well-known kanji are shown less often (see below).
  const USER_KEY = "kanji.currentUser";
  const statsKeyFor = (u) => "kanji.stats." + u;
  const GUEST = "guest";

  let currentUser = GUEST;
  let stats = {};              // kanjiId -> { correct, wrong, seen }

  const isGuest = () => currentUser === GUEST;

  function ls(get, key, val) {
    try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); }
    catch (e) { return null; }
  }

  // Special-named profiles (psi / plumpey) aren't offered as login chips
  // anymore, but typing one in still works — remembered via a cookie so it
  // survives even if localStorage gets cleared.
  const SPECIAL_USERS = ["psi", "plumpey"];
  const SPECIAL_USER_COOKIE = "kanji.specialUser";

  function setCookie(name, value, days) {
    try {
      document.cookie = name + "=" + encodeURIComponent(value) +
        "; path=/; max-age=" + (days * 24 * 60 * 60) + "; samesite=lax";
    } catch (e) { /* ignore */ }
  }

  function loadStats() {
    stats = {};
    if (isGuest()) return;
    const raw = ls(true, statsKeyFor(currentUser));
    if (raw) { try { stats = JSON.parse(raw) || {}; } catch (e) { stats = {}; } }
  }

  function saveStats() {
    if (isGuest()) return;
    ls(false, statsKeyFor(currentUser), JSON.stringify(stats));
  }

  function statFor(kanjiId) {
    let s = stats[kanjiId];
    if (!s) { s = stats[kanjiId] = { correct: 0, wrong: 0, seen: 0 }; }
    return s;
  }

  function recordAnswer(kanjiId, correct) {
    const s = statFor(kanjiId);
    s.seen++;
    if (correct) s.correct++; else s.wrong++;
    saveStats();
  }

  // How many cards a kanji contributes to a session. Guests always get the flat
  // baseline. For a logged-in user the count bends with mastery: kanji answered
  // "yes" repeatedly appear less often, struggling ones a little more.
  function cardsForKanji(kanjiId) {
    if (isGuest()) return SESSION_CARDS_PER_KANJI;
    const s = stats[kanjiId];
    if (!s) return SESSION_CARDS_PER_KANJI;          // never seen -> baseline
    const net = s.correct - s.wrong;
    if (net >= 6) return 1;                          // well mastered -> rare
    if (net >= 3) return 2;                          // getting there
    if (net <= -2) return 4;                         // struggling -> more
    return SESSION_CARDS_PER_KANJI;
  }

  // Kanji the user has switched off on the Manage page are excluded from every
  // session. Shared across users (it's a deck-scope choice, not per-person).
  const DISABLED_KEY = "kanji.disabledIds";
  function loadDisabledSet() {
    const raw = ls(true, DISABLED_KEY);
    if (raw) { try { return new Set(JSON.parse(raw)); } catch (e) { /* ignore */ } }
    return new Set();
  }

  const finishedScreen = el("finishedScreen");
  const cardScene = el("cardScene");
  const finishedResetBtn = el("finishedResetBtn");
  const finishedCount = el("finishedCount");

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Groups cards by kanjiId and randomly samples cardsForKanji() cards from each
  // group, so every kanji appears a few times per session while the specific
  // cards shown still rotate across the full 600-card pool. For logged-in users
  // the per-kanji count is weighted by mastery (see cardsForKanji).
  function sampleSession(cards) {
    const byKanji = new Map();
    for (const c of cards) {
      if (!byKanji.has(c.kanjiId)) byKanji.set(c.kanjiId, []);
      byKanji.get(c.kanjiId).push(c);
    }
    const sampled = [];
    for (const [kanjiId, group] of byKanji.entries()) {
      const n = Math.min(group.length, cardsForKanji(kanjiId));
      sampled.push(...shuffleArray(group).slice(0, n));
    }
    return sampled;
  }

  function setFinished(isFinished) {
    finished = isFinished;
    finishedScreen.hidden = !isFinished;
    cardScene.hidden = isFinished;
    answerbar.hidden = isFinished;
    if (isFinished) finishedCount.textContent = deck.length;
  }

  function buildDeck(shuffle) {
    const disabled = loadDisabledSet();
    const base = CARDS.filter(FILTERS[filter]).filter((c) => !disabled.has(c.kanjiId));
    const session = sampleSession(base);
    deck = shuffle ? shuffleArray(session) : session;
    if (deck.length > SESSION_CAP) deck = deck.slice(0, SESSION_CAP);
    index = 0;
    sessionCorrect = 0;
    updateScore();
    setFinished(false);
    render();
  }

  function updateScore() {
    scoreCount.textContent = sessionCorrect;
  }

  function unflip() { card.classList.remove("is-flipped"); }

  // Render a sentence into `container`, highlighting (or blanking) `target`.
  // Built from DOM nodes so the text is never treated as HTML.
  function renderSentence(container, jp, target, cloze) {
    container.textContent = "";
    const idx = jp.indexOf(target);
    if (idx === -1) { container.textContent = jp; return; }
    container.append(document.createTextNode(jp.slice(0, idx)));
    const mark = document.createElement("span");
    mark.className = cloze ? "target target-cloze" : "target";
    mark.textContent = cloze ? "◯".repeat(Math.max(2, target.length)) : target;
    container.append(mark);
    container.append(document.createTextNode(jp.slice(idx + target.length)));
  }

  function setRomajiLine(elem, kana) {
    if (romajiMode.checked) {
      elem.textContent = toRomaji(kana);
      elem.hidden = false;
    } else {
      elem.hidden = true;
    }
  }

  function render() {
    const c = deck[index];
    posTotal.textContent = deck.length;
    if (!c) {
      posNow.textContent = 0;
      frontWord.textContent = "—";
      frontSentence.textContent = "";
      frontRomaji.hidden = true;
      frontNote.textContent = "No kanji enabled — open 管理 Manage to turn some on.";
      frontFormHint.hidden = true;
      return;
    }
    unflip();

    frontType.textContent = TYPE_LABELS[c.type] || c.type;
    backType.textContent = TYPE_LABELS[c.type] || c.type;

    if (c.mode === "isolated") {
      // ---- "Just the kanji" card ----
      frontWord.textContent = c.word;
      frontSentence.textContent = "";
      setRomajiLine(frontRomaji, c.reading);
      frontNote.textContent = "just the kanji — recall the reading & meaning";
      frontFormHint.hidden = true;

      backForm.textContent = "Word";
      backReading.textContent = c.reading;
      setRomajiLine(backRomaji, c.reading);
      backBaseRow.hidden = true;
      backMeaning.textContent = c.meaning;
      backMeaningEn.textContent = c.meaningEn;
      backExample.hidden = true;
    } else {
      // ---- Sentence card ----
      const isConjugated = c.target !== c.word;
      frontWord.textContent = c.target;
      renderSentence(frontSentence, c.jp, c.target, clozeMode.checked);
      setRomajiLine(frontRomaji, c.sentReading);
      frontNote.textContent = isConjugated
        ? "conjugated form — recall the base word, reading & meaning"
        : "recall the reading & meaning";
      if (hintForm.checked) {
        frontFormHint.textContent = c.form;
        frontFormHint.hidden = false;
      } else {
        frontFormHint.hidden = true;
      }

      backForm.textContent = c.form;
      backReading.textContent = c.targetKana;
      setRomajiLine(backRomaji, c.targetKana);
      if (isConjugated) {
        backBaseWord.textContent = c.word;
        backBaseReading.textContent = c.reading;
        backBaseRow.hidden = false;
      } else {
        backBaseRow.hidden = true;
      }
      backMeaning.textContent = c.meaning;
      backMeaningEn.textContent = c.meaningEn;

      backExample.hidden = false;
      renderSentence(exJp, c.jp, c.target, false);
      exReading.textContent = c.sentReading;
      setRomajiLine(exRomaji, c.sentReading);
      exMeaning.textContent = c.sentMeaning;
    }

    posNow.textContent = index + 1;
    const pct = deck.length ? ((index + 1) / deck.length) * 100 : 0;
    progressFill.style.width = pct + "%";
  }

  // ---- Text-to-speech ----
  const ttsSupported = "speechSynthesis" in window;
  let jaVoice = null;

  // Preferred Japanese female voice, by name, in priority order. "Mizuki" (the
  // requested voice) ships on some Windows/Android TTS engines but not on macOS
  // or most iPhones, so this falls back to other known Japanese female voices,
  // then to any Japanese voice, rather than silently going voiceless.
  const VOICE_PRIORITY = ["mizuki", "kyoko", "nanami", "haruka", "ayumi", "o-ren"];

  // Returns true once the OS/browser has actually reported its voice list —
  // on many mobile browsers getVoices() is empty for a moment after page load.
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
  // Note: no hard "unsupported" disable here — pre-rendered <audio> playback
  // (below) is the primary path and works in virtually every browser even
  // when speechSynthesis doesn't; speechSynthesis is only a fallback.

  // Plays a pre-rendered clip (scripts/generate-audio.js output). Falls back
  // to the device's own Japanese voice if the clip is missing or fails to load.
  let currentAudio = null;

  function playPrerendered(audioFile, btn) {
    return new Promise((resolve, reject) => {
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      const audio = new Audio(`audio/${audioFile}`);
      currentAudio = audio;
      const cleanup = () => { if (btn) btn.classList.remove("is-speaking"); };
      audio.addEventListener("ended", () => { cleanup(); resolve(); });
      audio.addEventListener("error", () => { cleanup(); reject(new Error("audio load failed")); });
      if (btn) btn.classList.add("is-speaking");
      audio.play().catch((err) => { cleanup(); reject(err); });
    });
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

  function speakCard(c, btn) {
    if (!c) return;
    const fallbackText = c.mode === "isolated" ? c.word : c.jp;
    if (c.audioFile) {
      playPrerendered(c.audioFile, btn).catch(() => speakDevice(fallbackText, btn));
    } else {
      speakDevice(fallbackText, btn);
    }
  }

  function speakFront() { speakCard(deck[index], speakFrontBtn); }
  function speakBack() { speakCard(deck[index], speakBackBtn); }

  // ---- Navigation ----
  function next() {
    if (!deck.length || finished) return;
    if (index === deck.length - 1) { setFinished(true); return; }
    index++;
    render();
    if (autoSpeak.checked) speakFront();
  }
  function prev() {
    if (!deck.length || finished) return;
    index = (index - 1 + deck.length) % deck.length;
    render();
    if (autoSpeak.checked) speakFront();
  }
  function flip() {
    if (finished) return;
    const willShowBack = !card.classList.contains("is-flipped");
    card.classList.toggle("is-flipped");
    if (autoSpeak.checked) {
      if (willShowBack) speakBack(); else speakFront();
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

  // ---- Yes / No answering ----
  // "Yes"  -> count it, remember it (for logged-in users), move on.
  // "No"   -> remember the miss, then drop the card back into a *random* spot
  //           in the back portion of the remaining deck (never dead-last), so
  //           it comes around again but shuffled, not always at the very end.
  function answerYes() {
    if (!deck.length || finished) return;
    const c = deck[index];
    recordAnswer(c.kanjiId, true);
    sessionCorrect++;
    updateScore();
    next();
  }

  function answerNo() {
    if (!deck.length || finished) return;
    const c = deck[index];
    recordAnswer(c.kanjiId, false);
    deck.splice(index, 1);                // pull the current card out
    if (deck.length === 0) { setFinished(true); return; }
    // Back half of what's left, excluding the very last slot when possible.
    const remaining = deck.length - index;
    const lo = Math.min(deck.length, index + Math.max(1, Math.floor(remaining * 0.5)));
    const hiNoLast = Math.max(lo, deck.length - 1);
    const insertAt = lo + Math.floor(Math.random() * (hiNoLast - lo + 1));
    deck.splice(insertAt, 0, c);
    if (index >= deck.length) index = deck.length - 1;
    posTotal.textContent = deck.length;
    render();
    if (autoSpeak.checked) speakFront();
  }

  // ---- Login / user switching ----
  function applyUser(name) {
    currentUser = name;
    loadStats();
    userName.textContent = name;
    userAvatar.textContent = name === GUEST ? "👤" : name.charAt(0).toUpperCase();
    brandSub.textContent = isGuest()
      ? "300 words · shuffled every session"
      : "300 words · remembers what you know";
    ls(false, USER_KEY, name);
  }

  function login(rawName) {
    const name = (rawName || "").trim().toLowerCase() || GUEST;
    if (SPECIAL_USERS.includes(name)) setCookie(SPECIAL_USER_COOKIE, name, 365);
    applyUser(name);
    loginOverlay.hidden = true;
    buildDeck(true);
  }

  function showLogin() {
    loginOverlay.hidden = false;
    loginInput.value = "";
    setTimeout(() => loginInput.focus(), 30);
  }

  // ---- Events ----
  card.addEventListener("click", flip);
  setupSwipe(cardScene, next, prev);
  el("flipBtn").addEventListener("click", flip);
  el("nextBtn").addEventListener("click", next);
  el("prevBtn").addEventListener("click", prev);
  el("shuffleBtn").addEventListener("click", () => buildDeck(true));
  el("resetBtn").addEventListener("click", () => buildDeck(false));
  finishedResetBtn.addEventListener("click", () => buildDeck(true));

  speakFrontBtn.addEventListener("click", (e) => { e.stopPropagation(); speakFront(); });
  speakBackBtn.addEventListener("click", (e) => { e.stopPropagation(); speakBack(); });

  yesBtn.addEventListener("click", answerYes);
  noBtn.addEventListener("click", answerNo);

  userChip.addEventListener("click", showLogin);
  loginForm.addEventListener("submit", (e) => { e.preventDefault(); login(loginInput.value); });
  document.querySelectorAll(".login-quick .chip").forEach((chip) => {
    chip.addEventListener("click", () => login(chip.dataset.user));
  });

  hintForm.addEventListener("change", render);
  clozeMode.addEventListener("change", render);
  romajiMode.addEventListener("change", render);

  el("filterSeg").addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    document.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    filter = btn.dataset.filter;
    buildDeck(true);   // keep it shuffled when switching filters
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    switch (e.key) {
      case " ":
      case "Enter": e.preventDefault(); flip(); break;
      case "ArrowRight": e.preventDefault(); next(); break;
      case "ArrowLeft": e.preventDefault(); prev(); break;
      case "s": case "S": buildDeck(true); break;
      case "y": case "Y": case "ArrowUp": e.preventDefault(); answerYes(); break;
      case "n": case "N": case "ArrowDown": e.preventDefault(); answerNo(); break;
      case "p": case "P":
        e.preventDefault();
        card.classList.contains("is-flipped") ? speakBack() : speakFront();
        break;
    }
  });

  // ---- Init: restore the last user, or ask who's studying ----
  const saved = ls(true, USER_KEY);
  if (saved) {
    applyUser(saved);
    buildDeck(true);
  } else {
    applyUser(GUEST);
    showLogin();
    buildDeck(true);   // build a guest deck behind the overlay so it's ready
  }
})();
