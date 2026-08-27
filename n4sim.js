/* 日本語能力試験 N4 — 模擬試験 (mock-exam) engine.
 *
 * Lives on the Bunpou page (loaded after bunpou-app.js) but is fully
 * self-contained: its own IIFE, its own #examView, its own localStorage keys.
 * Unlike the Bunpou SRS drills (immediate per-item feedback), this is a
 * fixed-length, timed, graded exam — correctness is hidden until you submit,
 * then a scorecard + review are shown.
 *
 * Reads N4_SIM from n4sim-data.js. Reuses styles.css / bunpou.css design-system
 * classes (.btn, .mcq-options, .mcq-opt, .opt-letter, .opt-text, .progress-fill,
 * .badge, .is-correct / .is-wrong) plus a few exam-specific classes in bunpou.css.
 */

(function () {
  "use strict";

  if (typeof N4_SIM === "undefined" || !Array.isArray(N4_SIM)) return;

  const el = (id) => document.getElementById(id);
  const examView = el("examView");
  if (!examView) return;

  function ls(get, key, val) {
    try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); }
    catch (e) { return null; }
  }
  function lsRemove(key) { try { localStorage.removeItem(key); } catch (e) {} }

  const currentUser = ls(true, "kanji.currentUser") || "guest";
  const PROGRESS_KEY = "n4sim.progress." + currentUser;
  const RESULTS_KEY = "n4sim.results." + currentUser;

  const LETTERS = ["A", "B", "C", "D"];
  const SECTION_ORDER = ["moji-goi", "bunpou", "dokkai"];
  const SECTION_SHORT = { "moji-goi": "文字・語彙", "bunpou": "文法", "dokkai": "読解" };
  const PASS_LINE = 38;      // sectional pass for 言語知識・読解 (0–120 scoring section)
  const SCALE_MAX = 120;

  // Official practice sources (opened in a new tab from the start screen).
  const OFFICIAL_SOURCES = [
    { label: "公式サンプル問題 (jlpt.jp)", url: "https://www.jlpt.jp/e/samples/sampleindex.html" },
    { label: "公式 N4 Practice Workbook（PDF・音声）", url: "https://jlptbootcamp.com/2012/11/the-official-jlpt-n4-practice-workbook/" }
  ];

  // ---- Bunpou views to hide while the exam is on screen ----------------------
  const otherViews = ["browseView", "studyView", "quizView"].map(el).filter(Boolean);
  const reviewBtn = el("reviewBtn");

  function showExam(on) {
    examView.hidden = !on;
    otherViews.forEach((v) => { v.hidden = on; });
    if (reviewBtn) reviewBtn.hidden = on;
    window.scrollTo(0, 0);
  }

  // ---- Text helpers ----------------------------------------------------------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }
  function nl2br(s) { return esc(s).replace(/\n/g, "<br>"); }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Wrap the first occurrence of `target` inside `text` in a highlight span.
  function markTarget(text, target) {
    if (!target) return esc(text);
    const i = text.indexOf(target);
    if (i === -1) return esc(text);
    return esc(text.slice(0, i)) + '<span class="exam-target">' + esc(target) + "</span>" + esc(text.slice(i + target.length));
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // ---- Set introspection -----------------------------------------------------
  function setStats(set) {
    const per = {}; let total = 0;
    for (const sec of set.sections) {
      let n = 0;
      for (const md of sec.mondai) n += (md.items || []).length;
      per[sec.key] = n; total += n;
    }
    return { per, total };
  }

  // Flatten a set into an ordered list of graded questions. Option order is
  // shuffled here (once per attempt) so on-screen positions vary and the
  // "correct answer is always first in the data" convention can't be gamed.
  function buildExam(set) {
    const questions = [];
    let gid = 0;
    for (const sec of set.sections) {
      for (const md of sec.mondai) {
        for (const it of (md.items || [])) {
          let options, answer;
          const q = {
            gid: gid++, secKey: sec.key, secName: sec.name,
            type: md.type, instruction: md.instruction,
            passage: md.passage || null, passageTitle: md.title || null,
            explain: it.explain || ""
          };
          if (md.type === "sentence-order") {
            const shuffled = shuffle(it.chunks);
            options = shuffled;
            answer = shuffled.indexOf(it.chunks[it.starIndex]);
            q.prefix = it.prefix || ""; q.suffix = it.suffix || "";
            q.translation = it.translation || ""; q.starIndex = it.starIndex;
            q.chunkCount = it.chunks.length;
          } else {
            // options[0] is the correct answer in the data — tag then shuffle.
            const tagged = it.options.map((t, i) => ({ t, correct: i === 0 }));
            const sh = shuffle(tagged);
            options = sh.map((o) => o.t);
            answer = sh.findIndex((o) => o.correct);
            q.sentence = it.sentence; q.target = it.target;
            q.word = it.word; q.label = it.label; q.question = it.question;
          }
          q.options = options; q.answer = answer;
          questions.push(q);
        }
      }
    }
    return questions;
  }

  // ---- Persistence -----------------------------------------------------------
  function saveProgress() {
    if (!exam) return;
    const data = {
      setId: exam.setId, label: exam.label, questions: exam.questions,
      answers: exam.answers, flags: exam.flags, index: exam.index,
      remainingSec: exam.remainingSec, durationMin: exam.durationMin
    };
    ls(false, PROGRESS_KEY, JSON.stringify(data));
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

  // ---- Live exam state -------------------------------------------------------
  let exam = null;      // { setId, label, questions, answers, flags, index, remainingSec, durationMin }
  let timerId = null;

  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      if (!exam) { stopTimer(); return; }
      exam.remainingSec -= 1;
      const t = el("examTimer");
      if (t) {
        t.textContent = fmtTime(exam.remainingSec);
        t.classList.toggle("is-low", exam.remainingSec <= 300);
      }
      if (exam.remainingSec % 15 === 0) saveProgress();
      if (exam.remainingSec <= 0) { stopTimer(); submitExam(true); }
    }, 1000);
  }

  // ============================ START SCREEN =================================
  function renderStart() {
    stopTimer();
    exam = null;
    const saved = loadProgress();
    const results = loadResults();

    const cards = N4_SIM.map((set) => {
      const st = setStats(set);
      const canResume = saved && saved.setId === set.id;
      const parts = SECTION_ORDER
        .filter((k) => st.per[k] != null)
        .map((k) => SECTION_SHORT[k] + " " + st.per[k]).join(" · ");
      return (
        '<button class="exam-set-card" type="button" data-set="' + esc(set.id) + '">' +
          '<div class="exam-set-main">' +
            '<span class="exam-set-label">' + esc(set.label) + "</span>" +
            '<span class="exam-set-meta">' + parts + "</span>" +
          "</div>" +
          '<div class="exam-set-side">' +
            '<span class="exam-set-count">' + st.total + " 問</span>" +
            '<span class="exam-set-time">⏱ ' + set.durationMin + " 分</span>" +
            (canResume ? '<span class="exam-set-resume">続きあり</span>' : "") +
          "</div>" +
        "</button>"
      );
    }).join("");

    const history = results.length
      ? '<div class="exam-history"><h3 class="exam-h3">これまでの結果</h3>' +
          results.slice(0, 6).map((r) => {
            const pass = r.scaledLK >= PASS_LINE;
            return '<div class="exam-history-row">' +
              '<span class="exam-history-label">' + esc(r.label) + "</span>" +
              '<span class="exam-history-date">' + esc(r.date) + "</span>" +
              '<span class="exam-history-score ' + (pass ? "is-pass" : "is-fail") + '">' +
                r.scaledLK + "/120 · " + r.correct + "/" + r.total + "</span>" +
            "</div>";
          }).join("") +
        "</div>"
      : "";

    const sources = '<div class="exam-sources"><h3 class="exam-h3">公式の練習素材</h3>' +
      OFFICIAL_SOURCES.map((s) =>
        '<a class="exam-source-link" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">↗ ' + esc(s.label) + "</a>"
      ).join("") +
      '<p class="exam-note">この模試は非公式・オリジナル問題です。実際の過去問は公開されていないため、公式サンプル問題と公式練習ワークブックの形式に合わせて作成しています。聴解は含みません。</p>' +
      "</div>";

    examView.innerHTML =
      '<div class="exam-start">' +
        '<div class="exam-start-head">' +
          '<button class="btn btn-ghost" id="examExitBtn" type="button">← 文法に戻る</button>' +
          "<h2>N4 模擬試験</h2>" +
          '<p class="exam-start-sub">本番形式のタイマー付き模試。最後に採点（120点満点換算）と合否ラインを表示します。</p>' +
        "</div>" +
        (saved ? '<div class="exam-resume-banner">前回の「' + esc(saved.label) + '」が途中です。<button class="btn btn-flip" id="examResumeBtn" type="button">続きから</button><button class="btn btn-ghost" id="examDiscardBtn" type="button">やめる</button></div>' : "") +
        '<div class="exam-set-list">' + cards + "</div>" +
        history +
        sources +
      "</div>";

    el("examExitBtn").addEventListener("click", exitToBrowse);
    examView.querySelectorAll(".exam-set-card").forEach((btn) => {
      btn.addEventListener("click", () => startExam(btn.getAttribute("data-set"), false));
    });
    if (saved) {
      const rb = el("examResumeBtn"), db = el("examDiscardBtn");
      if (rb) rb.addEventListener("click", () => startExam(saved.setId, true));
      if (db) db.addEventListener("click", () => { clearProgress(); renderStart(); });
    }
  }

  function exitToBrowse() {
    stopTimer();
    showExam(false);
    const bv = el("browseView");
    if (bv) bv.hidden = false;
  }

  // ============================ RUN AN EXAM ==================================
  function startExam(setId, resume) {
    const saved = resume ? loadProgress() : null;
    if (resume && saved && saved.setId === setId) {
      exam = {
        setId: saved.setId, label: saved.label, questions: saved.questions,
        answers: saved.answers || {}, flags: saved.flags || {},
        index: saved.index || 0, remainingSec: saved.remainingSec,
        durationMin: saved.durationMin
      };
    } else {
      const set = N4_SIM.find((s) => s.id === setId);
      if (!set) return;
      exam = {
        setId: set.id, label: set.label, questions: buildExam(set),
        answers: {}, flags: {}, index: 0,
        remainingSec: set.durationMin * 60, durationMin: set.durationMin
      };
      clearProgress();
    }
    saveProgress();
    showExam(true);
    renderExam();
    startTimer();
  }

  function answeredCount() {
    return exam.questions.reduce((n, q) => n + (exam.answers[q.gid] != null ? 1 : 0), 0);
  }

  function renderExam() {
    const q = exam.questions[exam.index];
    const total = exam.questions.length;
    const done = answeredCount();

    examView.innerHTML =
      '<div class="exam-run">' +
        '<header class="exam-bar">' +
          '<button class="btn btn-ghost" id="examBackBtn" type="button">← 中断</button>' +
          '<div class="exam-bar-mid">' +
            '<span class="exam-section-tag">' + esc(q.secName) + "</span>" +
            '<div class="progress-bar exam-progress"><div class="progress-fill" id="examFill"></div></div>' +
            '<span class="exam-pos">問 ' + (exam.index + 1) + " / " + total + " ・ 回答 " + done + "</span>" +
          "</div>" +
          '<span class="exam-timer" id="examTimer">' + fmtTime(exam.remainingSec) + "</span>" +
        "</header>" +

        '<main class="exam-qcard">' + renderQuestionBody(q) + "</main>" +

        '<div class="exam-controls">' +
          '<button class="btn btn-ghost" id="examPrevBtn" type="button"' + (exam.index === 0 ? " disabled" : "") + ">← 前</button>" +
          '<button class="btn btn-ghost exam-flag-btn' + (exam.flags[q.gid] ? " is-on" : "") + '" id="examFlagBtn" type="button">🚩 見直し</button>' +
          '<button class="btn btn-ghost" id="examPaletteBtn" type="button">問題一覧</button>' +
          (exam.index === total - 1
            ? '<button class="btn btn-flip" id="examSubmitBtn" type="button">採点する →</button>'
            : '<button class="btn btn-flip" id="examNextBtn" type="button">次 →</button>') +
        "</div>" +

        '<div class="exam-palette" id="examPalette" hidden></div>' +
      "</div>";

    el("examFill").style.width = ((exam.index + 1) / total * 100) + "%";
    el("examTimer").classList.toggle("is-low", exam.remainingSec <= 300);

    // Option selection
    examView.querySelectorAll(".mcq-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        exam.answers[q.gid] = Number(btn.getAttribute("data-i"));
        examView.querySelectorAll(".mcq-opt").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        saveProgress();
        const posEl = examView.querySelector(".exam-pos");
        if (posEl) posEl.textContent = "問 " + (exam.index + 1) + " / " + total + " ・ 回答 " + answeredCount();
      });
    });

    el("examBackBtn").addEventListener("click", () => { saveProgress(); renderStart(); });
    const prev = el("examPrevBtn"); if (prev) prev.addEventListener("click", () => goTo(exam.index - 1));
    const next = el("examNextBtn"); if (next) next.addEventListener("click", () => goTo(exam.index + 1));
    const sub = el("examSubmitBtn"); if (sub) sub.addEventListener("click", () => confirmSubmit());
    el("examFlagBtn").addEventListener("click", () => {
      exam.flags[q.gid] = !exam.flags[q.gid];
      el("examFlagBtn").classList.toggle("is-on", !!exam.flags[q.gid]);
      saveProgress();
    });
    el("examPaletteBtn").addEventListener("click", togglePalette);
  }

  function renderQuestionBody(q) {
    const sel = exam.answers[q.gid];
    let head = '<span class="badge exam-type-badge">' + esc(mondaiLabel(q)) + "</span>";
    if (q.instruction) head += '<p class="exam-instruction">' + esc(q.instruction) + "</p>";
    if (q.passage) {
      head += '<div class="exam-passage">' +
        (q.passageTitle ? '<span class="exam-passage-title">' + esc(q.passageTitle) + "</span>" : "") +
        '<div class="exam-passage-body">' + nl2br(q.passage) + "</div></div>";
    }
    head += '<div class="exam-stem">' + renderStem(q) + "</div>";
    head += renderOptions(q, { selectedIndex: sel });
    return head;
  }

  function mondaiLabel(q) {
    return ({
      "kanji-reading": "文字・語彙 ・ 漢字読み",
      "orthography": "文字・語彙 ・ 表記",
      "context-vocab": "文字・語彙 ・ 文脈規定",
      "paraphrase": "文字・語彙 ・ 言い換え類義",
      "usage": "文字・語彙 ・ 用法",
      "grammar-form": "文法 ・ 文法形式の判断",
      "sentence-order": "文法 ・ 文の組み立て",
      "text-grammar": "文法 ・ 文章の文法",
      "reading": "読解"
    })[q.type] || q.type;
  }

  function renderStem(q, opts) {
    opts = opts || {};
    switch (q.type) {
      case "kanji-reading":
      case "orthography":
        return '<div class="quiz-jp">' + markTarget(q.sentence, q.target) + "</div>";
      case "context-vocab":
      case "grammar-form":
        return '<div class="quiz-jp">' + esc(q.sentence) + "</div>";
      case "paraphrase":
        return '<div class="quiz-jp">' + esc(q.sentence) + '</div><p class="exam-arrow">≒ だいたい 同じ いみの 文は？</p>';
      case "usage":
        return '<p class="exam-usage-word">「' + esc(q.word) + '」の 正しい 使い方は？</p>';
      case "sentence-order": {
        let slots = "";
        for (let i = 0; i < q.chunkCount; i++) {
          slots += (i === q.starIndex)
            ? '<span class="jlpt-slot jlpt-slot-star">★</span>'
            : '<span class="jlpt-slot">＿＿</span>';
        }
        return (q.prefix ? '<span class="quiz-jp">' + esc(q.prefix) + " </span>" : "") +
          '<div class="jlpt-slots">' + slots + (q.suffix ? " " + esc(q.suffix) : "") + "</div>" +
          '<p class="jlpt-hint">★に 入る ものを えらんで ください。' + (opts.review && q.translation ? "（" + esc(q.translation) + "）" : "") + "</p>";
      }
      case "text-grammar":
        return '<div class="quiz-jp exam-blank-focus">' + esc(q.label) + " に 入る ことば</div>";
      case "reading":
        return '<div class="quiz-jp exam-question">' + esc(q.question) + "</div>";
      default:
        return "";
    }
  }

  function renderOptions(q, opts) {
    const selectedIndex = opts.selectedIndex;
    const review = opts.review;
    return '<div class="mcq-options">' +
      q.options.map((opt, i) => {
        let cls = "btn mcq-opt";
        if (review) {
          if (i === q.answer) cls += " is-correct";
          else if (i === selectedIndex) cls += " is-wrong";
        } else if (i === selectedIndex) {
          cls += " is-selected";
        }
        return '<button class="' + cls + '" type="button" data-i="' + i + '"' + (review ? " disabled" : "") + ">" +
          '<span class="opt-letter">' + LETTERS[i] + "</span>" +
          '<span class="opt-text">' + esc(opt) + "</span>" +
          "</button>";
      }).join("") +
      "</div>";
  }

  function goTo(i) {
    if (i < 0 || i >= exam.questions.length) return;
    exam.index = i;
    saveProgress();
    renderExam();
  }

  function togglePalette() {
    const p = el("examPalette");
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
    const msg = unanswered > 0
      ? "未回答が " + unanswered + " 問 あります。採点しますか？"
      : "採点しますか？";
    if (window.confirm(msg)) submitExam(false);
  }

  // ============================ SCORING ======================================
  function grade() {
    const per = {}; let correct = 0;
    for (const k of SECTION_ORDER) per[k] = { correct: 0, total: 0 };
    for (const q of exam.questions) {
      if (!per[q.secKey]) per[q.secKey] = { correct: 0, total: 0 };
      per[q.secKey].total += 1;
      if (exam.answers[q.gid] === q.answer) { per[q.secKey].correct += 1; correct += 1; }
    }
    const total = exam.questions.length;
    const scaledLK = Math.round(correct / total * SCALE_MAX);
    return { correct, total, scaledLK, per };
  }

  function submitExam(timedOut) {
    stopTimer();
    const g = grade();
    const now = new Date();
    const date = now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0");
    saveResult({
      setId: exam.setId, label: exam.label, date: date,
      scaledLK: g.scaledLK, correct: g.correct, total: g.total,
      per: g.per
    });
    clearProgress();
    renderResult(g, timedOut);
  }

  function renderResult(g, timedOut) {
    const pass = g.scaledLK >= PASS_LINE;
    const pct = Math.round(g.correct / g.total * 100);

    const secRows = SECTION_ORDER.filter((k) => g.per[k] && g.per[k].total).map((k) => {
      const s = g.per[k];
      const p = Math.round(s.correct / s.total * 100);
      return '<div class="exam-score-row">' +
        '<span class="exam-score-name">' + SECTION_SHORT[k] + "</span>" +
        '<div class="progress-bar exam-score-bar"><div class="progress-fill" style="width:' + p + '%"></div></div>' +
        '<span class="exam-score-num">' + s.correct + "/" + s.total + " ・ " + p + "%</span>" +
      "</div>";
    }).join("");

    examView.innerHTML =
      '<div class="exam-result">' +
        (timedOut ? '<div class="exam-timeout">⏱ 時間切れで 自動採点しました。</div>' : "") +
        '<div class="exam-scorecard ' + (pass ? "is-pass" : "is-fail") + '">' +
          '<span class="exam-verdict">' + (pass ? "合格ライン クリア ✓" : "もう少し") + "</span>" +
          '<div class="exam-bigscore">' + g.scaledLK + '<span class="exam-bigscore-max">/120</span></div>' +
          '<span class="exam-scorecard-sub">言語知識（文字語彙・文法）・読解 の 換算スコア（合格ライン ' + PASS_LINE + "）</span>" +
          '<span class="exam-scorecard-raw">正解 ' + g.correct + " / " + g.total + " 問（" + pct + "%）</span>" +
        "</div>" +
        '<div class="exam-score-rows">' + secRows + "</div>" +
        '<p class="exam-disclaimer">※ 本番のスコアはIRT（項目応答理論）換算のため、これは目安です。実際のN4合格には、聴解 ≥19/60 と 総合 ≥90/180 も必要ですが、この模試は聴解を含まないため判定できません。</p>' +
        '<div class="exam-result-actions">' +
          '<button class="btn btn-flip" id="examReviewBtn" type="button">解答を 見直す →</button>' +
          '<button class="btn btn-ghost" id="examRetryBtn" type="button">もう一度</button>' +
          '<button class="btn btn-ghost" id="examHomeBtn" type="button">模試一覧へ</button>' +
        "</div>" +
      "</div>";

    el("examReviewBtn").addEventListener("click", renderReview);
    el("examRetryBtn").addEventListener("click", () => startExam(exam.setId, false));
    el("examHomeBtn").addEventListener("click", renderStart);
  }

  // ============================ REVIEW =======================================
  function renderReview() {
    const rows = exam.questions.map((q, i) => {
      const sel = exam.answers[q.gid];
      const ok = sel === q.answer;
      const yourAns = sel != null ? LETTERS[sel] + ". " + esc(q.options[sel]) : "（未回答）";
      return '<div class="exam-review-item ' + (ok ? "is-ok" : "is-ng") + '">' +
        '<div class="exam-review-head">' +
          '<span class="exam-review-no">問 ' + (i + 1) + "</span>" +
          '<span class="badge exam-type-badge">' + esc(mondaiLabel(q)) + "</span>" +
          '<span class="exam-review-mark">' + (ok ? "✓" : "✗") + "</span>" +
        "</div>" +
        (q.passage ? '<div class="exam-passage exam-passage-sm">' + nl2br(q.passage) + "</div>" : "") +
        '<div class="exam-stem">' + renderStem(q, { review: true }) + "</div>" +
        renderOptions(q, { selectedIndex: sel, review: true }) +
        '<div class="exam-review-ans">あなたの 回答: ' + yourAns +
          " ／ 正解: " + LETTERS[q.answer] + ". " + esc(q.options[q.answer]) + "</div>" +
        (q.explain ? '<div class="exam-review-explain">' + esc(q.explain) + "</div>" : "") +
      "</div>";
    }).join("");

    examView.innerHTML =
      '<div class="exam-review">' +
        '<div class="exam-review-top">' +
          '<button class="btn btn-ghost" id="examReviewBackBtn" type="button">← 結果へ</button>' +
          "<h2>解答の 見直し</h2>" +
        "</div>" +
        rows +
        '<div class="exam-result-actions"><button class="btn btn-ghost" id="examReviewHomeBtn" type="button">模試一覧へ</button></div>' +
      "</div>";

    el("examReviewBackBtn").addEventListener("click", () => renderResult(grade(), false));
    el("examReviewHomeBtn").addEventListener("click", renderStart);
  }

  // ============================ LAUNCH =======================================
  const launchBtn = el("examLaunchBtn");
  if (launchBtn) launchBtn.addEventListener("click", () => { showExam(true); renderStart(); });

  window.addEventListener("beforeunload", () => { if (exam) saveProgress(); });
})();
