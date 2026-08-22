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
  const reverseMode = el("reverseMode");
  const frontMeaning = el("frontMeaning");
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
  // Graded answering (Again / Good / Easy)
  const againBtn = el("againBtn");
  const goodBtn = el("goodBtn");
  const easyBtn = el("easyBtn");
  const scoreCount = el("scoreCount");
  const missCount = el("missCount");
  const answerbar = el("answerbar");
  const queueBadge = el("queueBadge");
  const queueCount = el("queueCount");

  // Help / onboarding
  const helpBtn = el("helpBtn");
  const helpOverlay = el("helpOverlay");
  const helpCloseBtn = el("helpCloseBtn");

  // Progress & mastery
  const progressBtn = el("progressBtn");
  const progressOverlay = el("progressOverlay");
  const progressCloseBtn = el("progressCloseBtn");
  const statDue = el("statDue");
  const statNew = el("statNew");
  const statStreak = el("statStreak");
  const masteryBar = el("masteryBar");
  const masteryGrid = el("masteryGrid");

  // Filter by the kanji's grammatical type
  const FILTERS = {
    all: () => true,
    verb: (c) => c.type === "godan" || c.type === "ichidan" || c.type === "suru",
    adj: (c) => c.type === "i-adj" || c.type === "na-adj",
    noun: (c) => c.type === "noun"
  };

  // A session is built from due reviews first, then new cards, capped at this
  // many total so a session stays a manageable size.
  const SESSION_CAP = 100;
  // No single kanji floods a session even if several of its forms are due
  // at once — mirrors the old per-kanji sampling cap.
  const PER_KANJI_SESSION_CAP = 4;

  let filter = "all";
  let deck = [];
  let index = 0;
  let finished = false;
  let sessionCorrect = 0;
  let sessionMissed = 0;
  let srsMap = {};             // audioFile -> SRS entry, see srs.js
  let againQueue = new Set();  // audioFile keys graded "again" and not yet resolved this session

  // ---- Users & persistent progress -----------------------------------------
  // "guest"           -> nothing is saved; every session is a fresh shuffle.
  // any other name    -> reviews are scheduled per-card via srs.js (Leitner
  //                      boxes + due dates), remembered in localStorage.
  const USER_KEY = "kanji.currentUser";
  const statsKeyFor = (u) => "kanji.stats." + u; // legacy key, read once by the seed below
  const GUEST = "guest";

  let currentUser = GUEST;

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

  // One-time migration: kanji that were well-known under the old Yes/No
  // correct-minus-wrong scheme start partway up the Leitner ladder instead
  // of back at square one. Runs once ever per user, never overwrites a card
  // that already has real SRS data, and never touches kanji.stats itself.
  function seedFromLegacyStatsOnce() {
    const seededKey = "kanji.srsSeeded." + currentUser;
    if (ls(true, seededKey)) return;
    ls(false, seededKey, "1");
    const raw = ls(true, statsKeyFor(currentUser));
    if (!raw) return;
    let legacyStats;
    try { legacyStats = JSON.parse(raw) || {}; } catch (e) { return; }
    const now = Date.now();
    let changed = false;
    for (const c of CARDS) {
      if (srsMap[c.audioFile]) continue;
      const s = legacyStats[c.kanjiId];
      if (!s) continue;
      if (s.correct - s.wrong >= 3) {
        srsMap[c.audioFile] = { box: 3, due: now, correct: 0, wrong: 0, seen: 0, last: now };
        changed = true;
      }
    }
    if (changed) saveSrs("kanji", currentUser, srsMap);
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

  // ---- Toggle preferences (persisted via srs.js, shared across sessions) ----
  function applyPrefs() {
    const prefs = loadPrefs();
    hintForm.checked = !!prefs.hintForm;
    clozeMode.checked = !!prefs.clozeMode;
    romajiMode.checked = !!prefs.romajiMode;
    autoSpeak.checked = !!prefs.autoSpeak;
    reverseMode.checked = !!prefs.reverseMode;
  }

  function savePrefsFromUI() {
    savePrefs({
      hintForm: hintForm.checked,
      clozeMode: clozeMode.checked,
      romajiMode: romajiMode.checked,
      autoSpeak: autoSpeak.checked,
      reverseMode: reverseMode.checked
    });
  }

  // ---- Session progress persistence -----------------------------------------
  // A plain page refresh (or navigating to Manage and back) used to silently
  // wipe the current position and score back to 0, since buildDeck() ran fresh
  // on every load. Now the in-progress deck/position/score survive a reload;
  // the only way to reset is the existing Shuffle / In order / Study Again
  // buttons (and the filter tabs), which already rebuild the deck on purpose.
  const progressKeyFor = (u) => "kanji.progress." + u;
  const cardsByAudioFile = new Map(CARDS.map((c) => [c.audioFile, c]));

  function saveProgress() {
    const data = {
      filter,
      order: deck.map((c) => c.audioFile),
      index, sessionCorrect, sessionMissed, finished,
      againQueue: [...againQueue]
    };
    ls(false, progressKeyFor(currentUser), JSON.stringify(data));
  }

  function loadProgress() {
    const raw = ls(true, progressKeyFor(currentUser));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  // Rebuilds `deck` from a saved session by mapping each stored audioFile back
  // to its CARDS entry. Returns false (and leaves state untouched) if the save
  // doesn't map to a usable deck, so the caller can fall back to buildDeck().
  function restoreProgress(saved) {
    if (!saved || !Array.isArray(saved.order) || !saved.order.length) return false;
    const disabled = loadDisabledSet();
    const restored = saved.order
      .map((key) => cardsByAudioFile.get(key))
      .filter((c) => c && !disabled.has(c.kanjiId));
    if (!restored.length) return false;

    filter = FILTERS[saved.filter] ? saved.filter : "all";
    document.querySelectorAll(".seg-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.filter === filter);
    });

    deck = restored;
    index = Math.min(Math.max(0, saved.index || 0), deck.length - 1);
    sessionCorrect = saved.sessionCorrect || 0;
    sessionMissed = saved.sessionMissed || 0;
    againQueue = new Set(saved.againQueue || []);
    updateScore();
    updateQueueBadge();
    setFinished(!!saved.finished);
    if (!finished) render();
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

  function setFinished(isFinished) {
    finished = isFinished;
    finishedScreen.hidden = !isFinished;
    cardScene.hidden = isFinished;
    answerbar.hidden = isFinished;
    if (isFinished) finishedCount.textContent = deck.length;
    saveProgress();
  }

  // Builds a session from the filtered, enabled pool: every due review first
  // (oldest-overdue first), then new (never-graded) cards fill the rest, each
  // kanji capped at PER_KANJI_SESSION_CAP cards so one kanji can't flood a
  // session even if several of its forms are due at once. `shuffle` controls
  // whether new-card order and the final deck order are randomized (Shuffle)
  // or left in natural deck order (In order) — due cards always come first
  // either way, since that's the point of spaced repetition.
  function buildDeck(shuffle) {
    const disabled = loadDisabledSet();
    const base = CARDS.filter(FILTERS[filter]).filter((c) => !disabled.has(c.kanjiId));

    const now = Date.now();
    const dueCards = [];
    const newCards = [];
    for (const c of base) {
      const entry = srsMap[c.audioFile];
      if (entry && entry.box > 0) {
        if (isDue(entry, now)) dueCards.push({ c, due: entry.due });
      } else {
        newCards.push(c);
      }
    }
    dueCards.sort((a, b) => a.due - b.due);
    const orderedNew = shuffle ? shuffleArray(newCards) : newCards;
    const ordered = dueCards.map((d) => d.c).concat(orderedNew);

    const perKanji = new Map();
    const session = [];
    for (const c of ordered) {
      const n = perKanji.get(c.kanjiId) || 0;
      if (n >= PER_KANJI_SESSION_CAP) continue;
      session.push(c);
      perKanji.set(c.kanjiId, n + 1);
      if (session.length >= SESSION_CAP) break;
    }

    deck = shuffle ? shuffleArray(session) : session;
    index = 0;
    sessionCorrect = 0;
    sessionMissed = 0;
    againQueue = new Set();
    updateScore();
    updateQueueBadge();
    setFinished(false);
    render();
  }

  function updateScore() {
    scoreCount.textContent = sessionCorrect;
    missCount.textContent = sessionMissed;
  }

  function updateQueueBadge() {
    queueCount.textContent = againQueue.size;
    queueBadge.hidden = againQueue.size === 0;
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

    const reverse = reverseMode.checked;
    // In reverse mode the front must never leak the Japanese answer: no
    // target text, no romaji of it, and no pronunciation button (that would
    // just hand over the reading by ear).
    speakFrontBtn.hidden = reverse;

    if (c.mode === "isolated") {
      // ---- "Just the kanji" card ----
      if (reverse) {
        frontWord.hidden = true;
        frontSentence.textContent = "";
        frontRomaji.hidden = true;
        frontMeaning.hidden = false;
        frontMeaning.textContent = c.meaning + "\n" + c.meaningEn;
        frontNote.textContent = "recall the word & reading";
      } else {
        frontWord.hidden = false;
        frontWord.textContent = c.word;
        frontSentence.textContent = "";
        setRomajiLine(frontRomaji, c.reading);
        frontMeaning.hidden = true;
        frontNote.textContent = "just the kanji — recall the reading & meaning";
      }
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
      if (reverse) {
        frontWord.hidden = true;
        // Always blank the target here regardless of the cloze toggle —
        // showing it would give away the exact answer being tested.
        renderSentence(frontSentence, c.jp, c.target, true);
        frontRomaji.hidden = true;
        frontMeaning.hidden = false;
        frontMeaning.textContent = c.sentMeaning;
        frontNote.textContent = "recall the word, reading & form to fill the blank";
      } else {
        frontWord.hidden = false;
        frontWord.textContent = c.target;
        renderSentence(frontSentence, c.jp, c.target, clozeMode.checked);
        setRomajiLine(frontRomaji, c.sentReading);
        frontMeaning.hidden = true;
        frontNote.textContent = isConjugated
          ? "conjugated form — recall the base word, reading & meaning"
          : "recall the reading & meaning";
      }
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

  // No-op in reverse mode: the front shows only the meaning, and playing the
  // target's pronunciation there would just hand over the reading by ear.
  function speakFront() { if (!reverseMode.checked) speakCard(deck[index], speakFrontBtn); }
  function speakBack() { speakCard(deck[index], speakBackBtn); }

  // ---- Navigation ----
  function next() {
    if (!deck.length || finished) return;
    if (index === deck.length - 1) { setFinished(true); return; }
    index++;
    render();
    saveProgress();
    if (autoSpeak.checked) speakFront();
  }
  function prev() {
    if (!deck.length || finished) return;
    index = (index - 1 + deck.length) % deck.length;
    render();
    saveProgress();
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

  // ---- Graded answering (Again / Good / Easy) ----
  // Every grade schedules the card via srs.js (Leitner box + due date).
  // "Again" -> counts as a miss, then drops the card back into a *random*
  //            spot in the back portion of the remaining deck (never
  //            dead-last), so it comes around again this session, shuffled
  //            rather than always at the very end.
  // "Good" / "Easy" -> counts as correct, card is done for this session, move on.
  function grade(level) {
    if (!deck.length || finished) return;
    const c = deck[index];
    srsMap[c.audioFile] = schedule(srsMap[c.audioFile], level);
    saveSrs("kanji", currentUser, srsMap);

    if (level === "again") {
      sessionMissed++;
      againQueue.add(c.audioFile);
      updateScore();
      updateQueueBadge();
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
      saveProgress();
      if (autoSpeak.checked) speakFront();
    } else {
      sessionCorrect++;
      againQueue.delete(c.audioFile);
      updateScore();
      updateQueueBadge();
      next();
    }
  }

  // ---- Login / user switching ----
  function applyUser(name) {
    currentUser = name;
    srsMap = loadSrs("kanji", currentUser);
    seedFromLegacyStatsOnce();
    bumpStreak(name);
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
    maybeShowHelpOnce();
  }

  function showLogin() {
    loginOverlay.hidden = false;
    loginInput.value = "";
    setTimeout(() => loginInput.focus(), 30);
  }

  // ---- Progress & mastery overlay ----
  const PROGRESS_PER_ROW = 10;

  function showProgress() { renderProgress(); progressOverlay.hidden = false; }
  function hideProgress() { progressOverlay.hidden = true; }

  // Builds the stat tiles, the new/learning/mature bar, and a per-kanji heat
  // grid (same 10-per-row layout as Manage) colored by that kanji's average
  // SRS box across its 10 cards — a quick "what still needs work" view.
  function renderProgress() {
    const now = Date.now();
    const disabled = loadDisabledSet();
    const enabledCards = CARDS.filter((c) => !disabled.has(c.kanjiId));

    let due = 0, newCount = 0;
    const bucketCounts = { new: 0, learning: 0, mature: 0 };
    const boxByKanji = new Map(); // kanjiId -> { sum, n }

    for (const c of enabledCards) {
      const entry = srsMap[c.audioFile];
      if (!entry || entry.box === 0) newCount++;
      else if (isDue(entry, now)) due++;
      bucketCounts[bucketOf(entry)]++;

      const box = entry ? entry.box : 0;
      const agg = boxByKanji.get(c.kanjiId) || { sum: 0, n: 0 };
      agg.sum += box; agg.n++;
      boxByKanji.set(c.kanjiId, agg);
    }

    statDue.textContent = due;
    statNew.textContent = newCount;
    statStreak.textContent = loadStreak(currentUser).count;

    const total = enabledCards.length || 1;
    masteryBar.innerHTML =
      `<span class="seg-new" style="width:${(bucketCounts.new / total) * 100}%"></span>` +
      `<span class="seg-learning" style="width:${(bucketCounts.learning / total) * 100}%"></span>` +
      `<span class="seg-mature" style="width:${(bucketCounts.mature / total) * 100}%"></span>`;

    masteryGrid.innerHTML = "";
    const kanjiList = RAW.filter((e) => !disabled.has(e.id));
    for (let i = 0; i < kanjiList.length; i += PROGRESS_PER_ROW) {
      const tr = document.createElement("tr");
      for (const e of kanjiList.slice(i, i + PROGRESS_PER_ROW)) {
        const td = document.createElement("td");
        const agg = boxByKanji.get(e.id);
        const avgBox = agg ? Math.round(agg.sum / agg.n) : 0;
        const bucket = bucketOf({ box: avgBox });
        const cell = document.createElement("div");
        cell.className = "cell bucket-" + bucket;
        cell.title = e.word + " — " + bucket;
        const kanji = document.createElement("span");
        kanji.className = "cell-kanji";
        kanji.textContent = e.word;
        cell.appendChild(kanji);
        td.appendChild(cell);
        tr.appendChild(td);
      }
      masteryGrid.appendChild(tr);
    }
  }

  // ---- Help / onboarding overlay ----
  const SEEN_HELP_KEY = "kanji.seenHelp";
  function showHelp() { helpOverlay.hidden = false; }
  function hideHelp() { helpOverlay.hidden = true; }
  // Surfaces the help sheet once, ever, per browser — but never stacked on
  // top of the login overlay (that would block picking a user), so callers
  // only invoke this once no overlay is already up.
  function maybeShowHelpOnce() {
    if (ls(true, SEEN_HELP_KEY)) return;
    ls(false, SEEN_HELP_KEY, "1");
    setTimeout(showHelp, 400);
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

  againBtn.addEventListener("click", () => grade("again"));
  goodBtn.addEventListener("click", () => grade("good"));
  easyBtn.addEventListener("click", () => grade("easy"));

  userChip.addEventListener("click", showLogin);
  loginForm.addEventListener("submit", (e) => { e.preventDefault(); login(loginInput.value); });
  document.querySelectorAll(".login-quick .chip").forEach((chip) => {
    chip.addEventListener("click", () => login(chip.dataset.user));
  });

  helpBtn.addEventListener("click", showHelp);
  helpCloseBtn.addEventListener("click", hideHelp);
  helpOverlay.addEventListener("click", (e) => { if (e.target === helpOverlay) hideHelp(); });

  progressBtn.addEventListener("click", showProgress);
  progressCloseBtn.addEventListener("click", hideProgress);
  progressOverlay.addEventListener("click", (e) => { if (e.target === progressOverlay) hideProgress(); });

  hintForm.addEventListener("change", () => { savePrefsFromUI(); render(); });
  clozeMode.addEventListener("change", () => { savePrefsFromUI(); render(); });
  romajiMode.addEventListener("change", () => { savePrefsFromUI(); render(); });
  reverseMode.addEventListener("change", () => { savePrefsFromUI(); unflip(); render(); });
  autoSpeak.addEventListener("change", savePrefsFromUI);

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
    if (e.key === "Escape") { hideHelp(); hideProgress(); return; }
    switch (e.key) {
      case " ":
      case "Enter": e.preventDefault(); flip(); break;
      case "ArrowRight": e.preventDefault(); next(); break;
      case "ArrowLeft": e.preventDefault(); prev(); break;
      case "s": case "S": buildDeck(true); break;
      case "2": case "y": case "Y": case "ArrowUp": e.preventDefault(); grade("good"); break;
      case "1": case "n": case "N": case "ArrowDown": e.preventDefault(); grade("again"); break;
      case "3": e.preventDefault(); grade("easy"); break;
      case "p": case "P":
        e.preventDefault();
        card.classList.contains("is-flipped") ? speakBack() : speakFront();
        break;
    }
  });

  // ---- Init: restore the last user, or ask who's studying ----
  // A saved session (deck order / position / score) is restored whenever one
  // exists for the user, so a refresh or a trip to another page and back
  // resumes exactly where it left off. Only the Shuffle / In order /
  // Study Again buttons and the filter tabs start a fresh session.
  applyPrefs();
  const saved = ls(true, USER_KEY);
  if (saved) {
    applyUser(saved);
    if (!restoreProgress(loadProgress())) buildDeck(true);
    maybeShowHelpOnce();
  } else {
    applyUser(GUEST);
    showLogin();
    if (!restoreProgress(loadProgress())) buildDeck(true);
    // help is deferred to login() so it never stacks on top of the login overlay
  }
})();
