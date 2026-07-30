/*
 * romaji.js — hiragana -> romaji converter (modified Hepburn, no macrons).
 *
 * Grammar-particle handling:
 *   は/へ/を are pronounced "wa"/"e"/"o" ONLY when used as grammatical particles;
 *   otherwise they keep their plain kana sound (ha/he/o-as-wo-is-unused-here).
 *   Since this file has no sentence tokenizer, correctness relies on an explicit
 *   PROTECTED_WORDS list of every は/へ-initial word that appears anywhere in
 *   this project's flashcard sentences (data.js) as an ordinary word rather than
 *   a particle (e.g. 入る=hairu, 働く=hataraku, 箸=hashi, 母=haha). Every は/へ NOT
 *   matched by this list is a standalone particle and is romanized wa/e — this
 *   was verified by manually auditing every は/へ occurrence in data.js.
 *   を has no such ambiguity in this dataset (always the object particle) and is
 *   always rendered "o".
 *   If new sentences introduce another は/へ-initial word, add it here.
 */

const PROTECTED_WORDS = [
  { kana: "はいる", romaji: "hairu" },     // 入る (to enter)
  { kana: "はたらく", romaji: "hataraku" }, // 働く (to work)
  { kana: "はなす", romaji: "hanasu" },     // 話す (to speak)
  { kana: "はこぶ", romaji: "hakobu" },     // 運ぶ (to carry)
  { kana: "はやく", romaji: "hayaku" },     // 早く (quickly/early)
  { kana: "はやい", romaji: "hayai" },      // 早い (early/fast)
  { kana: "はは", romaji: "haha" },         // 母 (mother)
  { kana: "はし", romaji: "hashi" }         // 箸 (chopsticks)
].sort((a, b) => b.kana.length - a.kana.length); // longest match first

const SEION = {
  "あ":"a","い":"i","う":"u","え":"e","お":"o",
  "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
  "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
  "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
  "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
  "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
  "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
  "や":"ya","ゆ":"yu","よ":"yo",
  "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
  "わ":"wa","ゐ":"i","ゑ":"e",
  "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
  "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
  "だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do",
  "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
  "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
  "ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o"
};

const YOUON = {
  "きゃ":"kya","きゅ":"kyu","きょ":"kyo",
  "しゃ":"sha","しゅ":"shu","しょ":"sho",
  "ちゃ":"cha","ちゅ":"chu","ちょ":"cho",
  "にゃ":"nya","にゅ":"nyu","にょ":"nyo",
  "ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo",
  "みゃ":"mya","みゅ":"myu","みょ":"myo",
  "りゃ":"rya","りゅ":"ryu","りょ":"ryo",
  "ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo",
  "じゃ":"ja","じゅ":"ju","じょ":"jo",
  "びゃ":"bya","びゅ":"byu","びょ":"byo",
  "ぴゃ":"pya","ぴゅ":"pyu","ぴょ":"pyo"
};

// Sentence-final copula suffixes we allow a space before, longest first.
const COPULA_SUFFIXES = [
  "janakattadesu", "janaidesu", "janakatta", "deshita",
  "datta", "janai", "desu", "da", "de"
].sort((a, b) => b.length - a.length);

function nextMora(kana, i) {
  const two = kana.slice(i, i + 2);
  if (YOUON[two]) return { romaji: YOUON[two], len: 2 };
  const one = kana[i];
  if (SEION[one]) return { romaji: SEION[one], len: 1 };
  return null;
}

function toRomaji(kana) {
  if (!kana) return "";
  let out = "";
  let lastVowel = "";
  let i = 0;
  const n = kana.length;

  while (i < n) {
    // 1. Protected word-internal は/へ exceptions (longest match first)
    const protectedMatch = PROTECTED_WORDS.find((p) => kana.startsWith(p.kana, i));
    if (protectedMatch) {
      out += protectedMatch.romaji;
      lastVowel = protectedMatch.romaji.slice(-1);
      i += protectedMatch.kana.length;
      continue;
    }

    const ch = kana[i];

    // 2. Punctuation / whitespace
    if (ch === "。") { out += "."; i++; continue; }
    if (ch === "、") { out += ","; i++; continue; }
    if (ch === "？" || ch === "?") { out += "?"; i++; continue; }
    if (ch === "！" || ch === "!") { out += "!"; i++; continue; }
    if (/\s/.test(ch)) { out += " "; i++; continue; }

    // 3. Long vowel mark (katakana loanwords)
    if (ch === "ー") { out += lastVowel; i++; continue; }

    // 4. Sokuon (small っ) — doubles the following consonant
    if (ch === "っ") {
      const next = nextMora(kana, i + 1);
      if (next) {
        out += (next.romaji.startsWith("ch") ? "t" : next.romaji[0]) + next.romaji;
        lastVowel = next.romaji.slice(-1);
        i += 1 + next.len;
      } else {
        i++;
      }
      continue;
    }

    // 5. Grammar particles with a pronunciation shift (see header comment)
    //    Spaced on both sides so they read as separate words.
    if (ch === "は" || ch === "へ" || ch === "を") {
      if (out && !out.endsWith(" ")) out += " ";
      out += (ch === "は" ? "wa" : ch === "へ" ? "e" : "o") + " ";
      lastVowel = ch === "へ" ? "e" : "a";
      i++;
      continue;
    }

    // 6. ん (n, with an apostrophe before a vowel/y to avoid ambiguity)
    if (ch === "ん") {
      const next = kana[i + 1];
      out += (next && /[あいうえおやゆよ]/.test(next)) ? "n'" : "n";
      lastVowel = "n";
      i++;
      continue;
    }

    // 7. Regular mora (youon 2-char combo or plain 1-char)
    const mora = nextMora(kana, i);
    if (mora) {
      out += mora.romaji;
      lastVowel = mora.romaji.slice(-1);
      i += mora.len;
      continue;
    }

    // Unrecognized character — pass through unchanged
    out += ch;
    i++;
  }

  // Clean up spacing
  out = out.replace(/ +([.,?!])/g, "$1").replace(/ {2,}/g, " ").trim();

  // Add a space before a sentence-final copula, if not already spaced
  for (const suf of COPULA_SUFFIXES) {
    const body = out.replace(/[.!?]+$/, "");
    const punct = out.slice(body.length);
    if (body.endsWith(suf) && body.length > suf.length && body[body.length - suf.length - 1] !== " ") {
      out = body.slice(0, -suf.length) + " " + suf + punct;
      break;
    }
  }

  return out;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { toRomaji, PROTECTED_WORDS };
}
