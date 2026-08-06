/* 言葉 Kotoba flashcards — standalone app logic. Independent of app.js / data.js
 * (the N4 kanji deck) so this section can change without affecting it. */

(function () {
  "use strict";

  const el = (id) => document.getElementById(id);
  const card = el("card");
  const cardScene = el("cardScene");
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
  const speakFrontBtn = el("speakFrontBtn");

  let deck = [];
  let index = 0;

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildDeck(shuffle) {
    deck = shuffle ? shuffleArray(KOTOBA) : KOTOBA.slice();
    index = 0;
    wordCount.textContent = KOTOBA.length;
    render();
  }

  function unflip() { card.classList.remove("is-flipped"); }

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
  function next() { if (!deck.length) return; index = (index + 1) % deck.length; render(); }
  function prev() { if (!deck.length) return; index = (index - 1 + deck.length) % deck.length; render(); }
  function flip() { card.classList.toggle("is-flipped"); }

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

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    switch (e.key) {
      case " ":
      case "Enter": e.preventDefault(); flip(); break;
      case "ArrowRight": e.preventDefault(); next(); break;
      case "ArrowLeft": e.preventDefault(); prev(); break;
      case "s": case "S": buildDeck(true); break;
      case "p": case "P": e.preventDefault(); speakCurrent(); break;
    }
  });

  // ---- Init: shuffled by default ----
  buildDeck(true);
})();
