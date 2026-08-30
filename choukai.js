/* 日本語能力試験 N4 — 聴解 (listening) practice engine.
 *
 * Lives on the Bunpou page (loaded after n4sim.js) as its own, independent
 * IIFE — own #choukaiView, own localStorage keys, own /60 scorecard. Separate
 * from the 模試 N4 text exam by design (see plan): scoring is not merged.
 *
 * Audio: each spoken line is pre-rendered at build time to a natural VOICEVOX
 * voice — a DISTINCT voice per speaker role (男性 / 女性 / ナレーター) — by
 * scripts/generate-choukai-audio.js into audio/choukai/<hash>.m4a. Clips are
 * content-addressed by fnv1a(speaker + text). If a clip is missing (no manifest,
 * failed fetch), the line falls back to the live Web Speech API — voice
 * selection is copied verbatim from app.js/kotoba-app.js's proven pattern
 * (VOICE_PRIORITY list, onvoiceschanged hook, iOS polling fallback).
 *
 * Reveal discipline (mirrors the n4sim.js `{ review: true }` gating pattern
 * introduced for the ★ sentence-order fix, applied more strictly here since
 * leaking transcript text would defeat the actual listening test):
 *   - task-comprehension / point-comprehension: dialogue is audio-only, never
 *     printed until review. point-comprehension additionally prints the
 *     question + options before playback (this is authentic — the real N4
 *     booklet prints mondai 2's question+choices ahead of the audio).
 *   - utterance-expression: prints a text scene description (substitute for
 *     the real exam's picture, which this app has no illustration assets
 *     for) but the 3 spoken options are audio-only, numbered ①②③.
 *   - quick-response: nothing is printed at all; fully audio-only, ①②③.
 */

(function () {
  "use strict";

  if (typeof CHOUKAI_SIM === "undefined" || !Array.isArray(CHOUKAI_SIM)) return;

  const el = (id) => document.getElementById(id);
  const choukaiView = el("choukaiView");
  if (!choukaiView) return;

  function ls(get, key, val) {
    try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); }
    catch (e) { return null; }
  }
  function lsRemove(key) { try { localStorage.removeItem(key); } catch (e) {} }

  const currentUser = ls(true, "kanji.currentUser") || "guest";
  const PROGRESS_KEY = "choukai.progress." + currentUser;
  const RESULTS_KEY = "choukai.results." + currentUser;

  const LETTERS = ["A", "B", "C", "D"];
  const NUMS = ["①", "②", "③"];
  const SCALE_MAX = 60;
  const PASS_LINE = 19;
  const LINE_GAP_MS = 550;

  // ---- Voice selection (copied verbatim from app.js L445-466 / kotoba-app.js
  // L207-221) — one voice is picked once and reused for every line/speaker. --
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
      window.speechSynthesis.onvoiceschanged = () => { pickJaVoice(); onVoicesReady(); };
    }
    let voicePollAttempts = 0;
    const voicePoll = setInterval(() => {
      voicePollAttempts++;
      if (pickJaVoice() || voicePollAttempts > 15) { clearInterval(voicePoll); onVoicesReady(); }
    }, 300);
  }
  function onVoicesReady() {
    // If the start screen is currently showing the compatibility warning,
    // re-render once a voice becomes available (getVoices() can be empty for
    // a moment after page load — see app.js's identical comment).
    if (choukaiView.dataset.view === "start") renderStart();
  }

  // ---- Pre-rendered audio (VOICEVOX) -------------------------------------
  // audio/choukai/<hash>.m4a clips, one per spoken line, with a distinct voice
  // per speaker role baked in. Content-addressed by the SAME fnv1a hash the
  // build script (scripts/generate-choukai-audio.js) uses. The manifest is a
  // list of the hashes present; if it fails to load the set stays empty and
  // every line falls back to Web Speech (i.e. the original behavior).
  const clipSet = new Set();
  let currentAudio = null;
  // Settler for the in-flight clip promise. pause() fires no 'ended'/'error',
  // so cancelSpeech calls this to resolve a clip it interrupts (otherwise the
  // awaiting speakSequence would hang forever).
  let settleClip = null;

  // FNV-1a (32-bit) — must stay byte-for-byte identical to the build script.
  function fnv1a(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, "0");
  }

  fetch("audio/choukai/manifest.json")
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => { if (Array.isArray(list)) list.forEach((h) => clipSet.add(h)); })
    .catch(() => {});

  // ---- Sequential TTS playback queue ------------------------------------
  // A mutable token guards against stale chains continuing to speak after the
  // learner navigates away mid-playback (Prev/Next/Back/Submit all bump it).
  const playToken = { value: 0 };

  // Plays the pre-rendered clip for a line. Resolves true when it finishes,
  // false if it fails to load or is interrupted by cancelSpeech.
  function playClip(hash) {
    return new Promise((resolve) => {
      const audio = new Audio("audio/choukai/" + hash + ".m4a");
      currentAudio = audio;
      const done = (ok) => {
        if (settleClip !== done) return; // already settled
        settleClip = null;
        if (currentAudio === audio) { currentAudio.pause(); currentAudio = null; }
        resolve(ok);
      };
      settleClip = done;
      audio.addEventListener("ended", () => done(true));
      audio.addEventListener("error", () => done(false));
      audio.play().catch(() => done(false));
    });
  }

  function speakDevice(line) {
    return new Promise((resolve) => {
      if (!ttsSupported) { resolve(); return; }
      const utter = new SpeechSynthesisUtterance(line.text);
      utter.lang = "ja-JP";
      utter.rate = 0.85;
      if (jaVoice) utter.voice = jaVoice;
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  }

  async function speakLine(line) {
    const myToken = playToken.value;
    const hash = fnv1a(line.speaker + "␟" + line.text);
    if (clipSet.has(hash)) {
      const ok = await playClip(hash);
      if (ok) return;
      // ok === false: either the clip failed to load (fall back to Web Speech)
      // or cancelSpeech interrupted it (token changed — abort, do NOT speak).
      if (playToken.value !== myToken) return;
    }
    await speakDevice(line);
  }

  // Resolves true if the whole sequence played to completion, false if a
  // newer token superseded it (navigation/cancel) partway through.
  async function speakSequence(lines) {
    const myToken = playToken.value;
    for (const line of lines) {
      if (playToken.value !== myToken) return false;
      await speakLine(line);
      if (playToken.value !== myToken) return false;
      await new Promise((r) => setTimeout(r, LINE_GAP_MS));
    }
    return true;
  }

  function cancelSpeech() {
    playToken.value++;
    if (settleClip) settleClip(false);
    else if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    if (ttsSupported) window.speechSynthesis.cancel();
  }

  // Cross-module coordination with n4sim.js (both live on the same page, own
  // independent timers/audio — guarded global hooks let each pause the other
  // if the learner switches modes mid-session without exiting cleanly).
  window.__choukaiStop = function () { cancelSpeech(); stopElapsed(); };

  function buildAudioLines(q) {
    if (q.type === "task-comprehension" || q.type === "point-comprehension") {
      const seq = [{ speaker: "N", text: q.situation }];
      q.lines.forEach((l) => seq.push(l));
      seq.push({ speaker: "N", text: q.question });
      return seq;
    }
    if (q.type === "utterance-expression") {
      return q.options.map((o, i) => ({ speaker: "N", text: (i + 1) + "。" + o.text }));
    }
    // quick-response
    const seq = [q.stimulus];
    q.options.forEach((o, i) => seq.push({ speaker: "N", text: (i + 1) + "。" + o.text }));
    return seq;
  }

  // ---- Text helpers -----------------------------------------------------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function fmtElapsed(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function speakerLabel(sp) {
    return sp === "M" ? "🔊 男性" : sp === "F" ? "🔊 女性" : "🔊 ナレーター";
  }

  // ---- View toggling ------------------------------------------------------
  const otherViews = ["browseView", "studyView", "quizView", "examView"].map(el).filter(Boolean);
  const reviewBtn = el("reviewBtn");

  function showChoukai(on) {
    if (on && window.__n4simStop) window.__n4simStop();
    choukaiView.hidden = !on;
    otherViews.forEach((v) => { v.hidden = on; });
    if (reviewBtn) reviewBtn.hidden = on;
    window.scrollTo(0, 0);
  }
  function exitToBrowse() {
    cancelSpeech();
    stopElapsed();
    showChoukai(false);
    const bv = el("browseView");
    if (bv) bv.hidden = false;
  }

  // ---- Set introspection --------------------------------------------------
  function setStats(set) {
    const per = {}; let total = 0;
    for (const md of set.mondai) { per[md.type] = (md.items || []).length; total += per[md.type]; }
    return { per, total };
  }

  function buildQuestions(set) {
    const qs = []; let gid = 0;
    for (const md of set.mondai) {
      for (const it of (md.items || [])) {
        const q = { gid: gid++, type: md.type, mondaiName: md.name, explain: it.explain || "" };
        if (md.type === "task-comprehension" || md.type === "point-comprehension") {
          const tagged = it.options.map((t, i) => ({ t, correct: i === 0 }));
          const sh = shuffle(tagged);
          q.options = sh.map((o) => o.t);
          q.answer = sh.findIndex((o) => o.correct);
          q.situation = it.situation; q.lines = it.lines; q.question = it.question;
        } else if (md.type === "utterance-expression") {
          q.scene = it.scene; q.options = it.options; q.answer = it.correctIndex;
        } else {
          q.stimulus = it.stimulus; q.options = it.options; q.answer = it.correctIndex;
        }
        qs.push(q);
      }
    }
    return qs;
  }

  // ---- Persistence ----------------------------------------------------------
  function saveProgress() {
    if (!exam) return;
    ls(false, PROGRESS_KEY, JSON.stringify({
      setId: exam.setId, label: exam.label, questions: exam.questions,
      answers: exam.answers, flags: exam.flags, played: exam.played,
      index: exam.index, elapsedSec: exam.elapsedSec
    }));
  }
  function loadProgress() {
    try { return JSON.parse(ls(true, PROGRESS_KEY) || "null"); } catch (e) { return null; }
  }
  function clearProgress() { lsRemove(PROGRESS_KEY); }
  function loadResults() {
    try { return JSON.parse(ls(true, RESULTS_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveResult(res) {
    const all = loadResults();
    all.unshift(res);
    ls(false, RESULTS_KEY, JSON.stringify(all.slice(0, 20)));
  }

  // ---- Live state -------------------------------------------------------
  let exam = null; // { setId, label, questions, answers, flags, played, index, elapsedSec }
  let elapsedTimerId = null;

  function stopElapsed() { if (elapsedTimerId) { clearInterval(elapsedTimerId); elapsedTimerId = null; } }
  function startElapsed() {
    stopElapsed();
    elapsedTimerId = setInterval(() => {
      if (!exam) { stopElapsed(); return; }
      exam.elapsedSec += 1;
      const t = el("choukaiElapsed");
      if (t) t.textContent = fmtElapsed(exam.elapsedSec);
      if (exam.elapsedSec % 20 === 0) saveProgress();
    }, 1000);
  }

  // ============================ START SCREEN =================================
  function renderStart() {
    cancelSpeech();
    stopElapsed();
    exam = null;
    choukaiView.dataset.view = "start";
    const saved = loadProgress();
    const results = loadResults();
    const voiceOk = ttsSupported && !!jaVoice;

    const warning = !voiceOk
      ? '<div class="choukai-warning">⚠️ お使いの ブラウザ／端末に 日本語音声が 見つかりませんでした。' +
          '別の ブラウザ（Chrome / Safari）や 端末で お試しください。' +
          '<button class="btn btn-ghost" id="choukaiRecheckBtn" type="button">🔄 再確認</button></div>'
      : "";

    const cards = CHOUKAI_SIM.map((set) => {
      const st = setStats(set);
      const canResume = saved && saved.setId === set.id;
      return (
        '<button class="exam-set-card" type="button" data-set="' + esc(set.id) + '"' + (voiceOk ? "" : " disabled") + '>' +
          '<div class="exam-set-main">' +
            '<span class="exam-set-label">🎧 ' + esc(set.label) + "</span>" +
            '<span class="exam-set-meta">問題1 課題理解 ' + (st.per["task-comprehension"] || 0) +
              " ・ 問題2 ポイント理解 " + (st.per["point-comprehension"] || 0) +
              " ・ 問題3 発話表現 " + (st.per["utterance-expression"] || 0) +
              " ・ 問題4 即時応答 " + (st.per["quick-response"] || 0) + "</span>" +
          "</div>" +
          '<div class="exam-set-side">' +
            '<span class="exam-set-count">' + st.total + " 問</span>" +
            (canResume ? '<span class="exam-set-resume">続きあり</span>' : "") +
          "</div>" +
        "</button>"
      );
    }).join("");

    const history = results.length
      ? '<div class="exam-history"><h3 class="exam-h3">これまでの結果</h3>' +
          results.slice(0, 6).map((r) => {
            const pass = r.scaled >= PASS_LINE;
            return '<div class="exam-history-row">' +
              '<span class="exam-history-label">🎧 ' + esc(r.label) + "</span>" +
              '<span class="exam-history-date">' + esc(r.date) + "</span>" +
              '<span class="exam-history-score ' + (pass ? "is-pass" : "is-fail") + '">' +
                r.scaled + "/60 · " + r.correct + "/" + r.total + "</span>" +
            "</div>";
          }).join("") +
        "</div>"
      : "";

    choukaiView.innerHTML =
      '<div class="exam-start">' +
        '<div class="exam-start-head">' +
          '<button class="btn btn-ghost" id="choukaiExitBtn" type="button">← 文法に戻る</button>' +
          "<h2>N4 聴解 (Listening)</h2>" +
          '<p class="exam-start-sub">音声は 一度しか 再生されません（本番形式）。採点は 60点満点、合格ラインは 19点です。この結果は 模試 N4（文字語彙・文法・読解）とは 別に 採点されます。実際のN4合格には 両方の 基準を 満たす 必要があります。</p>' +
        "</div>" +
        warning +
        (saved ? '<div class="exam-resume-banner">前回の「🎧 ' + esc(saved.label) + '」が途中です。<button class="btn btn-flip" id="choukaiResumeBtn" type="button">続きから</button><button class="btn btn-ghost" id="choukaiDiscardBtn" type="button">やめる</button></div>' : "") +
        '<div class="exam-set-list">' + cards + "</div>" +
        history +
        '<p class="choukai-credit">音声 VOICEVOX：青山龍星・春日部つむぎ・九州そら</p>' +
      "</div>";

    el("choukaiExitBtn").addEventListener("click", exitToBrowse);
    const recheck = el("choukaiRecheckBtn");
    if (recheck) recheck.addEventListener("click", () => { pickJaVoice(); renderStart(); });
    choukaiView.querySelectorAll(".exam-set-card").forEach((btn) => {
      btn.addEventListener("click", () => startExam(btn.getAttribute("data-set"), false));
    });
    if (saved) {
      const rb = el("choukaiResumeBtn"), db = el("choukaiDiscardBtn");
      if (rb) rb.addEventListener("click", () => startExam(saved.setId, true));
      if (db) db.addEventListener("click", () => { clearProgress(); renderStart(); });
    }
  }

  // ============================ RUN AN EXAM ==================================
  function startExam(setId, resume) {
    const saved = resume ? loadProgress() : null;
    if (resume && saved && saved.setId === setId) {
      exam = {
        setId: saved.setId, label: saved.label, questions: saved.questions,
        answers: saved.answers || {}, flags: saved.flags || {}, played: saved.played || {},
        index: saved.index || 0, elapsedSec: saved.elapsedSec || 0
      };
    } else {
      const set = CHOUKAI_SIM.find((s) => s.id === setId);
      if (!set) return;
      exam = {
        setId: set.id, label: set.label, questions: buildQuestions(set),
        answers: {}, flags: {}, played: {}, index: 0, elapsedSec: 0
      };
      clearProgress();
    }
    saveProgress();
    choukaiView.dataset.view = "run";
    showChoukai(true);
    renderRun();
    startElapsed();
  }

  function answeredCount() {
    return exam.questions.reduce((n, q) => n + (exam.answers[q.gid] != null ? 1 : 0), 0);
  }

  function renderRun() {
    const q = exam.questions[exam.index];
    const total = exam.questions.length;
    const done = answeredCount();

    choukaiView.innerHTML =
      '<div class="exam-run">' +
        '<header class="exam-bar">' +
          '<button class="btn btn-ghost" id="choukaiBackBtn" type="button">← 中断</button>' +
          '<div class="exam-bar-mid">' +
            '<span class="exam-section-tag">' + esc(q.mondaiName) + "</span>" +
            '<div class="progress-bar exam-progress"><div class="progress-fill" id="choukaiFill"></div></div>' +
            '<span class="exam-pos">問 ' + (exam.index + 1) + " / " + total + " ・ 回答 " + done + "</span>" +
          "</div>" +
          '<span class="exam-timer" id="choukaiElapsed">' + fmtElapsed(exam.elapsedSec) + "</span>" +
        "</header>" +

        '<main class="exam-qcard">' + renderQuestionBody(q) + "</main>" +

        '<div class="exam-controls">' +
          '<button class="btn btn-ghost" id="choukaiPrevBtn" type="button"' + (exam.index === 0 ? " disabled" : "") + ">← 前</button>" +
          '<button class="btn btn-ghost exam-flag-btn' + (exam.flags[q.gid] ? " is-on" : "") + '" id="choukaiFlagBtn" type="button">🚩 見直し</button>' +
          '<button class="btn btn-ghost" id="choukaiPaletteBtn" type="button">問題一覧</button>' +
          (exam.index === total - 1
            ? '<button class="btn btn-flip" id="choukaiSubmitBtn" type="button">採点する →</button>'
            : '<button class="btn btn-flip" id="choukaiNextBtn" type="button">次 →</button>') +
        "</div>" +

        '<div class="exam-palette" id="choukaiPalette" hidden></div>' +
      "</div>";

    el("choukaiFill").style.width = ((exam.index + 1) / total * 100) + "%";

    wirePlayButton(q);
    wireOptionButtons(q);

    el("choukaiBackBtn").addEventListener("click", () => { cancelSpeech(); saveProgress(); renderStart(); });
    const prev = el("choukaiPrevBtn"); if (prev) prev.addEventListener("click", () => goTo(exam.index - 1));
    const next = el("choukaiNextBtn"); if (next) next.addEventListener("click", () => goTo(exam.index + 1));
    const sub = el("choukaiSubmitBtn"); if (sub) sub.addEventListener("click", () => confirmSubmit());
    el("choukaiFlagBtn").addEventListener("click", () => {
      exam.flags[q.gid] = !exam.flags[q.gid];
      el("choukaiFlagBtn").classList.toggle("is-on", !!exam.flags[q.gid]);
      saveProgress();
    });
    el("choukaiPaletteBtn").addEventListener("click", togglePalette);
  }

  function renderQuestionBody(q) {
    const sel = exam.answers[q.gid];
    const played = !!exam.played[q.gid];
    let html = '<span class="badge exam-type-badge">' + esc(q.mondaiName) + "</span>";

    if (q.type === "point-comprehension") {
      html += '<p class="choukai-question-print">' + esc(q.question) + "</p>";
    }
    if (q.type === "utterance-expression") {
      html += '<div class="exam-passage choukai-scene">' + esc(q.scene) + "</div>";
    }
    if (q.type === "task-comprehension") {
      html += '<p class="choukai-lead">会話を 聞いて、正しい 答えを えらんで ください。</p>';
    }
    if (q.type === "quick-response") {
      html += '<p class="choukai-lead">みじかい 文を 聞いて、いちばん いい 返事を えらんで ください。</p>';
    }

    html += '<button class="btn choukai-play-btn' + (played ? " is-played" : "") + '" type="button" id="choukaiPlayBtn"' + (played ? " disabled" : "") + ">" +
      (played ? "🔒 再生済み" : "▶ 音声を 再生") + "</button>";
    if (!played) html += '<p class="choukai-lock-note">🔈 音声は 一度しか 再生されません（本番形式）。</p>';

    if (q.type === "task-comprehension" || q.type === "point-comprehension") {
      html += renderTextOptions(q, sel);
    } else {
      html += renderNumberedOptions(q, sel, played);
    }
    return html;
  }

  function renderTextOptions(q, selectedIndex) {
    return '<div class="mcq-options">' +
      q.options.map((opt, i) => {
        const cls = "btn mcq-opt" + (i === selectedIndex ? " is-selected" : "");
        return '<button class="' + cls + '" type="button" data-i="' + i + '">' +
          '<span class="opt-letter">' + LETTERS[i] + "</span>" +
          '<span class="opt-text">' + esc(opt) + "</span>" +
        "</button>";
      }).join("") +
    "</div>";
  }

  function renderNumberedOptions(q, selectedIndex, enabled) {
    return '<div class="choukai-num-options">' +
      q.options.map((opt, i) => {
        const cls = "btn choukai-num-opt" + (i === selectedIndex ? " is-selected" : "");
        return '<button class="' + cls + '" type="button" data-i="' + i + '"' + (enabled ? "" : " disabled") + ">" +
          '<span class="choukai-num-glyph">' + NUMS[i] + "</span>" +
        "</button>";
      }).join("") +
      (enabled ? "" : '<p class="choukai-num-hint">先に 音声を 聞いて ください。</p>') +
    "</div>";
  }

  function wirePlayButton(q) {
    const btn = el("choukaiPlayBtn");
    if (!btn || exam.played[q.gid]) return;
    btn.addEventListener("click", () => {
      btn.disabled = true;
      btn.classList.add("is-speaking");
      btn.textContent = "🔊 再生中…";
      const lockNote = choukaiView.querySelector(".choukai-lock-note");
      const seq = buildAudioLines(q);
      const myGid = q.gid;
      speakSequence(seq).then((completed) => {
        if (exam.index >= exam.questions.length || exam.questions[exam.index].gid !== myGid) return;
        btn.classList.remove("is-speaking");
        if (completed) {
          exam.played[myGid] = true;
          saveProgress();
          btn.textContent = "🔒 再生済み";
          btn.classList.add("is-played");
          if (lockNote) lockNote.remove();
          choukaiView.querySelectorAll(".choukai-num-opt").forEach((b) => { b.disabled = false; });
          const hint = choukaiView.querySelector(".choukai-num-hint");
          if (hint) hint.remove();
        } else {
          btn.disabled = false;
          btn.textContent = "▶ 音声を 再生";
        }
      });
    });
  }

  function wireOptionButtons(q) {
    choukaiView.querySelectorAll(".mcq-opt, .choukai-num-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        exam.answers[q.gid] = Number(btn.getAttribute("data-i"));
        choukaiView.querySelectorAll(".mcq-opt, .choukai-num-opt").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        saveProgress();
        const posEl = choukaiView.querySelector(".exam-pos");
        if (posEl) posEl.textContent = "問 " + (exam.index + 1) + " / " + exam.questions.length + " ・ 回答 " + answeredCount();
      });
    });
  }

  function goTo(i) {
    if (i < 0 || i >= exam.questions.length) return;
    cancelSpeech();
    exam.index = i;
    saveProgress();
    renderRun();
  }

  function togglePalette() {
    const p = el("choukaiPalette");
    if (!p) return;
    if (!p.hidden) { p.hidden = true; return; }
    p.innerHTML = exam.questions.map((q, i) => {
      let cls = "exam-pchip";
      if (i === exam.index) cls += " is-current";
      if (exam.answers[q.gid] != null) cls += " is-answered";
      if (exam.flags[q.gid]) cls += " is-flagged";
      return '<button class="' + cls + '" type="button" data-i="' + i + '">' + (i + 1) + "</button>";
    }).join("");
    p.hidden = false;
    p.querySelectorAll(".exam-pchip").forEach((chip) => {
      chip.addEventListener("click", () => { p.hidden = true; goTo(Number(chip.getAttribute("data-i"))); });
    });
  }

  function confirmSubmit() {
    const unanswered = exam.questions.length - answeredCount();
    const msg = unanswered > 0 ? "未回答が " + unanswered + " 問 あります。採点しますか？" : "採点しますか？";
    if (window.confirm(msg)) submitExam();
  }

  // ============================ SCORING ======================================
  function grade() {
    const byMondai = {}; let correct = 0;
    for (const q of exam.questions) {
      if (!byMondai[q.mondaiName]) byMondai[q.mondaiName] = { correct: 0, total: 0 };
      byMondai[q.mondaiName].total += 1;
      if (exam.answers[q.gid] === q.answer) { byMondai[q.mondaiName].correct += 1; correct += 1; }
    }
    const total = exam.questions.length;
    const scaled = Math.round(correct / total * SCALE_MAX);
    return { correct, total, scaled, byMondai };
  }

  function submitExam() {
    cancelSpeech();
    stopElapsed();
    const g = grade();
    const now = new Date();
    const date = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    saveResult({ setId: exam.setId, label: exam.label, date, scaled: g.scaled, correct: g.correct, total: g.total });
    clearProgress();
    renderResult(g);
  }

  function renderResult(g) {
    const pass = g.scaled >= PASS_LINE;
    const pct = Math.round(g.correct / g.total * 100);
    const rows = Object.keys(g.byMondai).map((name) => {
      const s = g.byMondai[name];
      const p = Math.round(s.correct / s.total * 100);
      return '<div class="exam-score-row">' +
        '<span class="exam-score-name choukai-score-name">' + esc(name) + "</span>" +
        '<div class="progress-bar exam-score-bar"><div class="progress-fill" style="width:' + p + '%"></div></div>' +
        '<span class="exam-score-num">' + s.correct + "/" + s.total + " ・ " + p + "%</span>" +
      "</div>";
    }).join("");

    choukaiView.innerHTML =
      '<div class="exam-result">' +
        '<div class="exam-scorecard ' + (pass ? "is-pass" : "is-fail") + '">' +
          '<span class="exam-verdict">' + (pass ? "合格ライン クリア ✓" : "もう少し") + "</span>" +
          '<div class="exam-bigscore">' + g.scaled + '<span class="exam-bigscore-max">/60</span></div>' +
          '<span class="exam-scorecard-sub">聴解 の 換算スコア（合格ライン ' + PASS_LINE + "）</span>" +
          '<span class="exam-scorecard-raw">正解 ' + g.correct + " / " + g.total + " 問（" + pct + "%）</span>" +
        "</div>" +
        '<div class="exam-score-rows">' + rows + "</div>" +
        '<p class="exam-disclaimer">※ この結果は 聴解セクションのみの 換算です。実際のN4合格には、言語知識・読解 ≥38/120 と 総合 ≥90/180 も 必要です。📝 模試 N4 の 結果と 合わせて 確認して ください。</p>' +
        '<div class="exam-result-actions">' +
          '<button class="btn btn-flip" id="choukaiReviewBtn" type="button">解答を 見直す →</button>' +
          '<button class="btn btn-ghost" id="choukaiRetryBtn" type="button">もう一度</button>' +
          '<button class="btn btn-ghost" id="choukaiHomeBtn" type="button">聴解 一覧へ</button>' +
        "</div>" +
      "</div>";

    el("choukaiReviewBtn").addEventListener("click", renderReview);
    el("choukaiRetryBtn").addEventListener("click", () => startExam(exam.setId, false));
    el("choukaiHomeBtn").addEventListener("click", renderStart);
  }

  // ============================ REVIEW =======================================
  function transcriptHtml(q) {
    if (q.type === "task-comprehension" || q.type === "point-comprehension") {
      const lines = [{ speaker: "N", text: q.situation }].concat(q.lines).concat([{ speaker: "N", text: q.question }]);
      return '<div class="choukai-transcript">' +
        lines.map((l) => '<p><span class="choukai-speaker">' + speakerLabel(l.speaker) + "：</span>" + esc(l.text) + "</p>").join("") +
      "</div>";
    }
    if (q.type === "utterance-expression") {
      return '<div class="exam-passage choukai-scene">' + esc(q.scene) + "</div>" +
        '<div class="choukai-transcript">' +
          q.options.map((o, i) => '<p>' + NUMS[i] + " " + esc(o.text) + "</p>").join("") +
        "</div>";
    }
    return '<div class="choukai-transcript">' +
      '<p><span class="choukai-speaker">' + speakerLabel(q.stimulus.speaker) + "：</span>" + esc(q.stimulus.text) + "</p>" +
      q.options.map((o, i) => '<p>' + NUMS[i] + " " + esc(o.text) + "</p>").join("") +
    "</div>";
  }

  function renderReview() {
    const rows = exam.questions.map((q, i) => {
      const sel = exam.answers[q.gid];
      const ok = sel === q.answer;
      const isText = q.type === "task-comprehension" || q.type === "point-comprehension";
      const marks = isText ? LETTERS : NUMS;
      const optLabel = (idx) => isText ? (marks[idx] + ". " + q.options[idx]) : (marks[idx] + " " + q.options[idx].text);
      const yourAns = sel != null ? esc(optLabel(sel)) : "（未回答）";
      return '<div class="exam-review-item ' + (ok ? "is-ok" : "is-ng") + '">' +
        '<div class="exam-review-head">' +
          '<span class="exam-review-no">問 ' + (i + 1) + "</span>" +
          '<span class="badge exam-type-badge">' + esc(q.mondaiName) + "</span>" +
          '<span class="exam-review-mark">' + (ok ? "✓" : "✗") + "</span>" +
          '<button class="btn btn-ghost choukai-replay-btn" type="button" data-gid="' + q.gid + '">🔁 もう一度聞く</button>' +
        "</div>" +
        transcriptHtml(q) +
        '<div class="exam-review-ans">あなたの 回答: ' + yourAns + " ／ 正解: " + esc(optLabel(q.answer)) + "</div>" +
        (q.explain ? '<div class="exam-review-explain">' + esc(q.explain) + "</div>" : "") +
      "</div>";
    }).join("");

    choukaiView.innerHTML =
      '<div class="exam-review">' +
        '<div class="exam-review-top">' +
          '<button class="btn btn-ghost" id="choukaiReviewBackBtn" type="button">← 結果へ</button>' +
          "<h2>解答の 見直し</h2>" +
        "</div>" +
        rows +
        '<div class="exam-result-actions"><button class="btn btn-ghost" id="choukaiReviewHomeBtn" type="button">聴解 一覧へ</button></div>' +
      "</div>";

    el("choukaiReviewBackBtn").addEventListener("click", () => renderResult(grade()));
    el("choukaiReviewHomeBtn").addEventListener("click", renderStart);
    choukaiView.querySelectorAll(".choukai-replay-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const gid = Number(btn.getAttribute("data-gid"));
        const q = exam.questions.find((qq) => qq.gid === gid);
        if (!q) return;
        cancelSpeech();
        btn.disabled = true; btn.textContent = "🔊 再生中…";
        speakSequence(buildAudioLines(q)).then(() => {
          btn.disabled = false; btn.textContent = "🔁 もう一度聞く";
        });
      });
    });
  }

  // ============================ LAUNCH =======================================
  const launchBtn = el("choukaiLaunchBtn");
  if (launchBtn) launchBtn.addEventListener("click", () => { showChoukai(true); renderStart(); });

  window.addEventListener("beforeunload", () => { if (exam) saveProgress(); cancelSpeech(); });
})();
