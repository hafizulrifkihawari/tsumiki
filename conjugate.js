/*
 * conjugate.js — deterministic Japanese conjugation engine.
 *
 * Given a dictionary headword (kanji + reading + type) it returns 9 forms,
 * each as { key, label, disp, kana }.  Used to build the sentence flashcards
 * so the conjugations are guaranteed correct (unit-tested in test.js).
 *
 * Supported types: godan, ichidan, suru, i-adj, na-adj.
 */

// Godan euphonic maps keyed by the dictionary-final kana (the "row").
const I_ROW = { "う":"い","く":"き","ぐ":"ぎ","す":"し","つ":"ち","ぬ":"に","ぶ":"び","む":"み","る":"り" };
const A_ROW = { "う":"わ","く":"か","ぐ":"が","す":"さ","つ":"た","ぬ":"な","ぶ":"ば","む":"ま","る":"ら" };
const E_ROW = { "う":"え","く":"け","ぐ":"げ","す":"せ","つ":"て","ぬ":"ね","ぶ":"べ","む":"め","る":"れ" };
const TE_OKU = { "う":"って","つ":"って","る":"って","む":"んで","ぶ":"んで","ぬ":"んで","く":"いて","ぐ":"いで","す":"して" };
const TA_OKU = { "う":"った","つ":"った","る":"った","む":"んだ","ぶ":"んだ","ぬ":"んだ","く":"いた","ぐ":"いだ","す":"した" };

// Build one form object from a display stem, kana stem, and the okurigana to append.
function mk(key, label, dispStem, kanaStem, disp, kana) {
  return { key, label, disp: dispStem + disp, kana: kanaStem + kana };
}

function conjugate(word, reading, type) {
  switch (type) {
    case "godan": {
      const d = word.slice(0, -1), k = reading.slice(0, -1), e = reading.slice(-1);
      return [
        mk("basic",     "Basic (dict.)",      d, k, word.slice(-1),        e),
        mk("masu",      "-masu (polite)",     d, k, I_ROW[e] + "ます",     I_ROW[e] + "ます"),
        mk("te",        "-te form",           d, k, TE_OKU[e],             TE_OKU[e]),
        mk("ta",        "-ta (past)",         d, k, TA_OKU[e],             TA_OKU[e]),
        mk("nai",       "-nai (neg.)",        d, k, A_ROW[e] + "ない",     A_ROW[e] + "ない"),
        mk("mashita",   "-mashita (past pol.)", d, k, I_ROW[e] + "ました", I_ROW[e] + "ました"),
        mk("masen",     "-masen (neg. pol.)", d, k, I_ROW[e] + "ません",   I_ROW[e] + "ません"),
        mk("nakatta",   "-nakatta (past neg.)", d, k, A_ROW[e] + "なかった", A_ROW[e] + "なかった"),
        mk("potential", "Potential (can ~)",  d, k, E_ROW[e] + "る",       E_ROW[e] + "る")
      ];
    }
    case "ichidan": {
      const d = word.slice(0, -1), k = reading.slice(0, -1);
      return [
        mk("basic",     "Basic (dict.)",        d, k, "る", "る"),
        mk("masu",      "-masu (polite)",       d, k, "ます", "ます"),
        mk("te",        "-te form",             d, k, "て", "て"),
        mk("ta",        "-ta (past)",           d, k, "た", "た"),
        mk("nai",       "-nai (neg.)",          d, k, "ない", "ない"),
        mk("mashita",   "-mashita (past pol.)", d, k, "ました", "ました"),
        mk("masen",     "-masen (neg. pol.)",   d, k, "ません", "ません"),
        mk("nakatta",   "-nakatta (past neg.)", d, k, "なかった", "なかった"),
        mk("potential", "Potential (can ~)",    d, k, "られる", "られる")
      ];
    }
    case "suru": {
      const d = word.slice(0, -2), k = reading.slice(0, -2);
      return [
        mk("basic",     "Basic (dict.)",        d, k, "する", "する"),
        mk("masu",      "-masu (polite)",       d, k, "します", "します"),
        mk("te",        "-te form",             d, k, "して", "して"),
        mk("ta",        "-ta (past)",           d, k, "した", "した"),
        mk("nai",       "-nai (neg.)",          d, k, "しない", "しない"),
        mk("mashita",   "-mashita (past pol.)", d, k, "しました", "しました"),
        mk("masen",     "-masen (neg. pol.)",   d, k, "しません", "しません"),
        mk("nakatta",   "-nakatta (past neg.)", d, k, "しなかった", "しなかった"),
        mk("potential", "Potential (can ~)",    d, k, "できる", "できる")
      ];
    }
    case "i-adj": {
      const d = word.slice(0, -1), k = reading.slice(0, -1);
      return [
        mk("basic",         "Basic (dict.)",       d, k, "い", "い"),
        mk("polite",        "Polite (です)",       d, k, "いです", "いです"),
        mk("ta",            "-ta (past)",          d, k, "かった", "かった"),
        mk("pastPolite",    "Past polite",         d, k, "かったです", "かったです"),
        mk("nai",           "Negative (くない)",   d, k, "くない", "くない"),
        mk("negPolite",     "Neg. polite",         d, k, "くないです", "くないです"),
        mk("pastNeg",       "Past negative",       d, k, "くなかった", "くなかった"),
        mk("te",            "-te (くて)",          d, k, "くて", "くて"),
        mk("pastNegPolite", "Past neg. polite",    d, k, "くなかったです", "くなかったです")
      ];
    }
    case "na-adj": {
      // headword stored WITH な (e.g. 便利な); base = drop the final な
      const d = word.slice(0, -1), k = reading.slice(0, -1);
      return [
        mk("basic",         "Basic (だ)",        d, k, "だ", "だ"),
        mk("polite",        "Polite (です)",     d, k, "です", "です"),
        mk("ta",            "-ta (だった)",      d, k, "だった", "だった"),
        mk("pastPolite",    "Past polite (でした)", d, k, "でした", "でした"),
        mk("nai",           "Negative (じゃない)", d, k, "じゃない", "じゃない"),
        mk("negPolite",     "Neg. polite",       d, k, "じゃないです", "じゃないです"),
        mk("pastNeg",       "Past negative",     d, k, "じゃなかった", "じゃなかった"),
        mk("te",            "-te (で)",          d, k, "で", "で"),
        mk("pastNegPolite", "Past neg. polite",  d, k, "じゃなかったです", "じゃなかったです")
      ];
    }
    default:
      return [];
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { conjugate };
}
