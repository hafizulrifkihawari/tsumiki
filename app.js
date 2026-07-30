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

  // Filter by the kanji's grammatical type
  const FILTERS = {
    all: () => true,
    verb: (c) => c.type === "godan" || c.type === "ichidan" || c.type === "suru",
    adj: (c) => c.type === "i-adj" || c.type === "na-adj",
    noun: (c) => c.type === "noun"
  };

  let filter = "all";
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
    const base = CARDS.filter(FILTERS[filter]);
    deck = shuffle ? shuffleArray(base) : base.slice();
    index = 0;
    render();
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

  function pickJaVoice() {
    const voices = window.speechSynthesis.getVoices();
    jaVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("ja")) || null;
  }

  if (ttsSupported) {
    pickJaVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickJaVoice;
    }
  } else {
    autoSpeak.disabled = true;
    autoSpeakLabel.textContent = "Auto-speak (unsupported in this browser)";
    speakFrontBtn.disabled = true;
    speakBackBtn.disabled = true;
    speakFrontBtn.title = "Text-to-speech isn't supported in this browser";
    speakBackBtn.title = "Text-to-speech isn't supported in this browser";
  }

  function speak(text, btn) {
    if (!ttsSupported || !text) return;
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

  function speakFront() {
    const c = deck[index];
    if (!c) return;
    speak(c.mode === "isolated" ? c.word : c.jp, speakFrontBtn);
  }
  function speakBack() {
    const c = deck[index];
    if (!c) return;
    speak(c.mode === "isolated" ? c.word : c.jp, speakBackBtn);
  }

  // ---- Navigation ----
  function next() {
    if (!deck.length) return;
    index = (index + 1) % deck.length;
    render();
    if (autoSpeak.checked) speakFront();
  }
  function prev() {
    if (!deck.length) return;
    index = (index - 1 + deck.length) % deck.length;
    render();
    if (autoSpeak.checked) speakFront();
  }
  function flip() {
    const willShowBack = !card.classList.contains("is-flipped");
    card.classList.toggle("is-flipped");
    if (autoSpeak.checked) {
      if (willShowBack) speakBack(); else speakFront();
    }
  }

  // ---- Events ----
  card.addEventListener("click", flip);
  el("flipBtn").addEventListener("click", flip);
  el("nextBtn").addEventListener("click", next);
  el("prevBtn").addEventListener("click", prev);
  el("shuffleBtn").addEventListener("click", () => buildDeck(true));
  el("resetBtn").addEventListener("click", () => buildDeck(false));

  speakFrontBtn.addEventListener("click", (e) => { e.stopPropagation(); speakFront(); });
  speakBackBtn.addEventListener("click", (e) => { e.stopPropagation(); speakBack(); });

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
      case "p": case "P":
        e.preventDefault();
        card.classList.contains("is-flipped") ? speakBack() : speakFront();
        break;
    }
  });

  // ---- Init: shuffled by default ----
  buildDeck(true);
})();
