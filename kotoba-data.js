/*
 * 言葉 Kotoba — vocabulary flashcards from "Minna no Nihongo II", Pelajaran 26.
 * Source: Kosa Kata (p.3), Kaiwa & Yomimono vocab (p.4).
 *
 * Each entry: kana (main word, shown big on the front — hiragana/katakana
 * first so the word is learned by sound before the kanji), kanji (may be
 * null when the source gives no kanji), context (the "[~に…]" usage note
 * from the book, if any), type (short Indonesian part-of-speech badge),
 * meaning (Indonesian gloss from the book).
 */

const KOTOBA = [
  { lesson: 26, kana: "みます", kanji: "見ます、診ます", type: "Kata Kerja II", meaning: "melihat, memeriksa" },
  { lesson: 26, kana: "さがします", kanji: "探します、捜します", type: "Kata Kerja I", meaning: "mencari" },
  { lesson: 26, kana: "おくれます", kanji: "遅れます", context: "[じかんに〜]", type: "Kata Kerja II", meaning: "terlambat [pada waktu]" },
  { lesson: 26, kana: "まにあいます", kanji: "間に合います", context: "[じかんに〜]", type: "Kata Kerja I", meaning: "sempat [pada waktu]" },
  { lesson: 26, kana: "やります", kanji: null, type: "Kata Kerja I", meaning: "melakukan" },
  { lesson: 26, kana: "ひろいます", kanji: "拾います", type: "Kata Kerja I", meaning: "mendapat, mengambil" },
  { lesson: 26, kana: "れんらくします", kanji: "連絡します", type: "Kata Kerja III", meaning: "menghubungi" },
  { lesson: 26, kana: "きぶんがいい", kanji: "気分がいい", type: "Ungkapan", meaning: "rasa enak, segar" },
  { lesson: 26, kana: "きぶんがわるい", kanji: "気分が悪い", type: "Ungkapan", meaning: "rasa tidak enak" },
  { lesson: 26, kana: "うんどうかい", kanji: "運動会", type: "Kata Benda", meaning: "lomba olahraga" },
  { lesson: 26, kana: "ぼんおどり", kanji: "盆踊り", type: "Kata Benda", meaning: "tarian Bon" },
  { lesson: 26, kana: "フリーマーケット", kanji: null, type: "Kata Benda", meaning: "pasar rombengan" },
  { lesson: 26, kana: "ばしょ", kanji: "場所", type: "Kata Benda", meaning: "tempat" },
  { lesson: 26, kana: "ボランティア", kanji: null, type: "Kata Benda", meaning: "sukarelawan" },
  { lesson: 26, kana: "さいふ", kanji: "財布", type: "Kata Benda", meaning: "dompet" },
  { lesson: 26, kana: "ごみ", kanji: null, type: "Kata Benda", meaning: "sampah" },
  { lesson: 26, kana: "こっかいぎじどう", kanji: "国会議事堂", type: "Kata Benda", meaning: "gedung parlemen" },
  { lesson: 26, kana: "へいじつ", kanji: "平日", type: "Kata Benda", meaning: "hari kerja" },
  { lesson: 26, kana: "〜べん", kanji: "〜弁", type: "Sufiks", meaning: "dialek 〜" },
  { lesson: 26, kana: "こんど", kanji: "今度", type: "Kata Benda", meaning: "kali ini, lain kali" },
  { lesson: 26, kana: "ずいぶん", kanji: null, type: "Kata Keterangan", meaning: "sangat, amat" },
  { lesson: 26, kana: "ちょくせつ", kanji: "直接", type: "Kata Keterangan", meaning: "langsung" },
  { lesson: 26, kana: "いつでも", kanji: null, type: "Ungkapan", meaning: "kapan saja" },
  { lesson: 26, kana: "どこでも", kanji: null, type: "Ungkapan", meaning: "di mana-mana" },
  { lesson: 26, kana: "だれでも", kanji: null, type: "Ungkapan", meaning: "siapa saja" },
  { lesson: 26, kana: "なんでも", kanji: "何でも", type: "Ungkapan", meaning: "apa saja" },
  { lesson: 26, kana: "こんな〜", kanji: null, type: "Ungkapan", meaning: "〜 begini" },
  { lesson: 26, kana: "そんな〜", kanji: null, type: "Ungkapan", meaning: "〜 begitu (dekat dari lawan bicara)" },
  { lesson: 26, kana: "あんな〜", kanji: null, type: "Ungkapan", meaning: "〜 begitu (jauh dari si pembicara dan lawan bicara)" },

  { lesson: 26, kana: "かたづきます", kanji: "片づきます", context: "[荷物が〜]", type: "Kata Kerja I", meaning: "membereskan [barang]" },
  { lesson: 26, kana: "だします", kanji: "出します", context: "[ごみを〜]", type: "Kata Kerja I", meaning: "membuang [sampah], mengeluarkan" },
  { lesson: 26, kana: "もえるごみ", kanji: "燃えるごみ", type: "Kata Benda", meaning: "sampah organik" },
  { lesson: 26, kana: "おきば", kanji: "置き場", type: "Kata Benda", meaning: "tempat meletakkan sampah" },
  { lesson: 26, kana: "よこ", kanji: "横", type: "Kata Benda", meaning: "sebelah, samping" },
  { lesson: 26, kana: "びん", kanji: "瓶", type: "Kata Benda", meaning: "botol" },
  { lesson: 26, kana: "かん", kanji: "缶", type: "Kata Benda", meaning: "kaleng" },
  { lesson: 26, kana: "ガス", kanji: null, type: "Kata Benda", meaning: "gas" },
  { lesson: 26, kana: "〜がいしゃ", kanji: "〜会社", type: "Sufiks", meaning: "perusahaan 〜" },

  { lesson: 26, kana: "うちゅう", kanji: "宇宙", type: "Kata Benda", meaning: "angkasa" },
  { lesson: 26, kana: "〜さま", kanji: "〜様", type: "Sufiks", meaning: "kepada Yth. 〜, Bapak 〜, Ibu 〜, Sdr. 〜 (kata hormat dari 〜さん)" },
  { lesson: 26, kana: "うちゅうせん", kanji: "宇宙船", type: "Kata Benda", meaning: "wahana antariksa" },
  { lesson: 26, kana: "こわい", kanji: "怖い", type: "Kata Sifat", meaning: "takut" },
  { lesson: 26, kana: "うちゅうステーション", kanji: "宇宙ステーション", type: "Kata Benda", meaning: "stasiun luar angkasa" },
  { lesson: 26, kana: "ちがいます", kanji: "違います", type: "Kata Kerja I", meaning: "tidak benar" },
  { lesson: 26, kana: "うちゅうひこうし", kanji: "宇宙飛行士", type: "Kata Benda", meaning: "astronot" }
];
