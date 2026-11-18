/* 日本語能力試験 N4 — 模擬試験データ (mock-exam question bank).
 *
 * Independent, non-listening mock sets modeled on the official JLPT N4 format
 * (問題 types + section structure). Real past N4 papers are NOT publicly
 * released by JEES/Japan Foundation, so every item here is ORIGINAL, authored to
 * match the official sample-question / practice-workbook formats. Listening
 * (聴解) is out of scope — this repo has no audio pipeline for authored content —
 * so each set covers only the two on-paper scoring section components:
 * 言語知識（文字・語彙）+ 言語知識（文法）+ 読解.
 *
 *   模試 A–C, E, F : full-length practice sets (item counts vary a little).
 *   模試 D         : short format-familiarization run (2 items per type).
 *   模試 G–I       : 本番形式 — the exact item count of the current official
 *                    N4 paper, 57 items in 80 min:
 *       文字・語彙  問題1 漢字読み 7 · 問題2 表記 5 · 問題3 文脈規定 8 ·
 *                   問題4 言い換え類義 4 · 問題5 用法 4
 *       文法        問題1 文の文法1 13 · 問題2 文の組み立て 4 · 問題3 文章の文法 4
 *       読解        問題4 短文 3 (3 texts × 1) · 問題5 中文 3 · 問題6 情報検索 2
 *
 * Conventions match the rest of the codebase: Indonesian explanations (with the
 * Japanese/English inline where useful), KANA readings (no romaji anywhere),
 * fill-in blanks written as （　）or ＿＿.
 *
 * ── Schema ──────────────────────────────────────────────────────────────────
 *   N4_SIM: [ Set ]
 *   Set   = { id, label, durationMin, sections: [Section] }
 *   Section = { key: "moji-goi"|"bunpou"|"dokkai", name, mondai: [Mondai] }
 *   Mondai  = { type, instruction, [passage], [title], items: [Item] }
 *
 *   Item shapes by `type` (the CORRECT answer is always options[0]; n4sim.js
 *   shuffles the option order at runtime so on-screen positions vary):
 *     "kanji-reading" : { sentence, target, options[4 kana], explain }
 *     "orthography"   : { sentence, target, options[4 kanji], explain }
 *     "context-vocab" : { sentence(w/（　）), options[4], explain }
 *     "paraphrase"    : { sentence, options[4 sentences], explain }
 *     "usage"         : { word, options[4 sentences], explain }
 *     "grammar-form"  : { sentence(w/＿＿), options[4], explain }
 *     "sentence-order": { prefix, chunks[4], starIndex, suffix, translation, explain }
 *     "text-grammar"  : mondai has `passage` w/（１）…；items { label, options[4], explain }
 *     "reading"       : mondai has `passage`/`title`; items { question, options[4], explain }
 * ────────────────────────────────────────────────────────────────────────────
 */

const N4_SIM = [

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 A  (Set A)
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setA",
  label: "模試 A",
  durationMin: 80,
  sections: [

    /* ---------------- 言語知識（文字・語彙） ---------------- */
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "銀行で お金を 借りました。", target: "銀行", options: ["ぎんこう", "きんこう", "ぎんこ", "きんこ"], explain: "銀行 = ぎんこう (bank)。" },
            { sentence: "授業は 九時に 始まります。", target: "授業", options: ["じゅぎょう", "じゅうぎょう", "しゅぎょう", "じゅぎょ"], explain: "授業 = じゅぎょう (kelas/pelajaran)。" },
            { sentence: "この 道は 危ないですから、気を つけて ください。", target: "危ない", options: ["あぶない", "あふない", "きけない", "あぶらない"], explain: "危ない = あぶない (berbahaya)。" },
            { sentence: "兄は 医者に なりたいと 言って います。", target: "医者", options: ["いしゃ", "いっしゃ", "いじゃ", "えいしゃ"], explain: "医者 = いしゃ (dokter)。" },
            { sentence: "毎朝、公園を 散歩します。", target: "散歩", options: ["さんぽ", "さんほ", "さんぼ", "ちらぽ"], explain: "散歩 = さんぽ (jalan-jalan)。" },
            { sentence: "空が 青くて きれいです。", target: "青くて", options: ["あおくて", "あかくて", "しろくて", "くろくて"], explain: "青い = あおい (biru)。" },
            { sentence: "会議は 来週の 火曜日です。", target: "会議", options: ["かいぎ", "かいご", "かいき", "えかいぎ"], explain: "会議 = かいぎ (rapat)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "この へやは とても ひろいです。", target: "ひろい", options: ["広い", "店い", "床い", "仏い"], explain: "ひろい = 広い (luas)。" },
            { sentence: "あした えいがを 見に 行きます。", target: "えいが", options: ["映画", "映像", "英画", "画映"], explain: "えいが = 映画 (film)。" },
            { sentence: "あたらしい くつを 買いました。", target: "あたらしい", options: ["新しい", "親しい", "近しい", "辛しい"], explain: "あたらしい = 新しい (baru)。" },
            { sentence: "えきの ちかくに 銀行が あります。", target: "ちかく", options: ["近く", "遠く", "道く", "通く"], explain: "ちかく = 近く (dekat)。" },
            { sentence: "まいにち にほんごを べんきょうします。", target: "べんきょう", options: ["勉強", "勉張", "免強", "勉弱"], explain: "べんきょう = 勉強 (belajar)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "この カメラの 使い方が わからないので、（　）を 読みます。", options: ["説明書", "字引", "地図", "切符"], explain: "使い方 → 説明書 (buku petunjuk) untuk dibaca。" },
            { sentence: "部屋が 暗いですから、電気を （　）ください。", options: ["つけて", "けして", "しめて", "あけて"], explain: "暗い → 電気を つける (menyalakan lampu)。" },
            { sentence: "約束の 時間に （　）ないように、早く 出ます。", options: ["おくれ", "すすみ", "いそぎ", "まけ"], explain: "時間に おくれる = terlambat; おくれないように = agar tidak terlambat。" },
            { sentence: "この 問題は 難しくて、一人では （　）ません。", options: ["でき", "おき", "あき", "ひき"], explain: "できません = tidak bisa (menyelesaikan)。" },
            { sentence: "日本の 生活に もう （　）ましたか。", options: ["なれ", "われ", "たれ", "かれ"], explain: "生活に なれる = terbiasa dengan kehidupan。" },
            { sentence: "弟は 医者に なる ために、一生懸命 （　）います。", options: ["がんばって", "さぼって", "こまって", "すべって"], explain: "一生懸命 がんばる = berusaha keras。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "この 本は つまらないです。", options: ["この 本は おもしろくないです。", "この 本は やさしいです。", "この 本は たかいです。", "この 本は あついです。"], explain: "つまらない = tidak menarik = おもしろくない。" },
            { sentence: "きのうの テストは かんたんでした。", options: ["きのうの テストは やさしかったです。", "きのうの テストは むずかしかったです。", "きのうの テストは ながかったです。", "きのうの テストは たいへんでした。"], explain: "かんたん = mudah = やさしい。" },
            { sentence: "田中さんは がっこうを やすみました。", options: ["田中さんは がっこうへ 行きませんでした。", "田中さんは がっこうへ 早く 行きました。", "田中さんは がっこうで べんきょうしました。", "田中さんは がっこうに おくれました。"], explain: "学校を 休む = tidak masuk sekolah = 行きませんでした。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "あんぜん（安全）", options: ["この こうえんは 子どもが あそぶのに あんぜんです。", "あんぜんな りょうりを 食べました。", "かれは あんぜんに 日本語を 話します。", "きょうは あんぜんが いい てんきです。"], explain: "あんぜん (aman) dipakai untuk tempat/keadaan yang tidak berbahaya。" },
            { word: "そだてる（育てる）", options: ["にわで 花を そだてて います。", "本を そだてて 読みます。", "みちを そだてて わたります。", "じかんを そだてて まちます。"], explain: "そだてる = memelihara/membesarkan (花・子ども)。" },
            { word: "ねだん（値段）", options: ["この くつの ねだんは 五千円です。", "ねだんが たかい 人です。", "あめの ねだんが つよいです。", "ねだんを はやく はしります。"], explain: "ねだん = harga barang。" }
          ]
        }
      ]
    },

    /* ---------------- 言語知識（文法） ---------------- */
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "母＿＿ 作った 料理は おいしいです。", options: ["が", "を", "に", "へ"], explain: "従属節の 主語 → が (masak yang dibuat ibu)。" },
            { sentence: "くらいので、電気＿＿ つけて ください。", options: ["を", "が", "に", "で"], explain: "電気を つける — objek pakai を。" },
            { sentence: "日本＿＿ 来てから、二年に なります。", options: ["に", "へ", "で", "を"], explain: "日本に 来る — tujuan kedatangan pakai に。" },
            { sentence: "あした 雨が 降る＿＿ 思います。", options: ["と", "を", "に", "が"], explain: "〜と 思う — mengutip pikiran pakai と。" },
            { sentence: "この 薬を 飲めば、元気に なる＿＿。", options: ["でしょう", "ましょう", "ください", "ませんか"], explain: "予想 → 〜でしょう (mungkin akan)。" },
            { sentence: "母に 手紙を 書いて＿＿。", options: ["あげました", "くれました", "もらいました", "おきました"], explain: "私 → 母 (memberi) = 書いて あげました。" },
            { sentence: "日曜日な＿＿、銀行は 休みです。", options: ["ので", "のに", "から", "けど"], explain: "名詞 + な + ので (alasan: karena hari Minggu)。" },
            { sentence: "たくさん 勉強した＿＿、テストは だめでした。", options: ["のに", "ので", "から", "なら"], explain: "〜のに = padahal/meskipun (hasil di luar dugaan)。" },
            { sentence: "音楽を 聞き＿＿、勉強します。", options: ["ながら", "たり", "ように", "そうに"], explain: "ます形 + ながら = sambil (dua aksi bersamaan)。" },
            { sentence: "毎日 練習して、日本語が 話せる＿＿ なりました。", options: ["ように", "そうに", "ことに", "はずに"], explain: "可能形 + ように なる = jadi bisa。" },
            { sentence: "あの 店の ケーキは おいしい＿＿ですよ。友だちが 言って いました。", options: ["そう", "よう", "はず", "つもり"], explain: "伝聞 〜そうだ = katanya (dari yang didengar)。" },
            { sentence: "明日は 晴れる＿＿ しれません。", options: ["かも", "だけ", "しか", "ばかり"], explain: "〜かもしれない = mungkin。" },
            { sentence: "母は 弟に 部屋を そうじ＿＿。", options: ["させました", "されました", "できました", "しました"], explain: "使役 (menyuruh) = そうじ させました。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "これは", chunks: ["きのう", "図書館で", "借りた", "本"], starIndex: 2, suffix: "です。", translation: "Ini buku yang saya pinjam di perpustakaan kemarin.", explain: "正しい文: これは きのう 図書館で 借りた 本です。★ = 借りた。" },
            { prefix: "姉は", chunks: ["日本語を", "話す", "ことが", "できます"], starIndex: 1, suffix: "。", translation: "Kakak (perempuan) bisa berbicara bahasa Jepang.", explain: "正しい文: 姉は 日本語を 話す ことが できます。★ = 話す。" },
            { prefix: "", chunks: ["雨が", "降りそう", "だから", "かさを"], starIndex: 2, suffix: "持って 行きます。", translation: "Karena sepertinya akan hujan, saya bawa payung.", explain: "正しい文: 雨が 降りそう だから かさを 持って 行きます。★ = だから。" },
            { prefix: "わからない ときは", chunks: ["先生に", "聞いて", "から", "答えます"], starIndex: 1, suffix: "。", translation: "Kalau tidak paham, saya menjawab setelah bertanya pada guru.", explain: "正しい文: わからない ときは 先生に 聞いて から 答えます。★ = 聞いて。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "私の 町には 大きな 公園が あります。週末には、家族（１）そこで 散歩を します。公園は 家から 近い（２）、歩いて 行けます。子どもの ころは、毎日（３）遊んで いました。これからも、この きれいな 公園を 大切に（４）です。",
          items: [
            { label: "（１）", options: ["と", "で", "を", "へ"], explain: "家族と = bersama keluarga (partikel と)。" },
            { label: "（２）", options: ["ので", "のに", "でも", "より"], explain: "近いので = karena dekat (alasan)。" },
            { label: "（３）", options: ["そこで", "そこに", "そこを", "そこは"], explain: "そこで 遊ぶ = bermain di sana (tempat aksi pakai で)。" },
            { label: "（４）", options: ["したい", "します", "しました", "しよう"], explain: "大切に したいです = ingin menjaga (harapan)。" }
          ]
        }
      ]
    },

    /* ---------------- 読解 ---------------- */
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メールを 読んで、質問に 答えて ください。",
          passage: "山田さん\n\nあしたの 会議は 午後 2時から 3時までです。場所は 3階の 会議室です。会議の 前に、資料を コピーして おいて ください。\nよろしく お願いします。\n田中",
          items: [
            { question: "山田さんは 会議の 前に 何を しますか。", options: ["資料を コピーする。", "会議室を そうじする。", "田中さんに 電話する。", "2時に 帰る。"], explain: "「資料を コピーして おいて ください」とある。" },
            { question: "会議は どこで ありますか。", options: ["3階の 会議室", "2階の 会議室", "田中さんの 家", "1階の 教室"], explain: "「場所は 3階の 会議室」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "私は 毎日 自転車で 学校へ 行きます。でも、きのうは 雨が 降って いたので、バスで 行きました。今日は いい 天気なので、また 自転車で 来ました。",
          items: [
            { question: "この 人は きのう どうやって 学校へ 行きましたか。", options: ["バスで 行った。", "自転車で 行った。", "歩いて 行った。", "電車で 行った。"], explain: "「きのうは…バスで 行きました」とある。" },
            { question: "この 人は ふだん 何で 学校へ 行きますか。", options: ["自転車", "バス", "車", "電車"], explain: "「毎日 自転車で 学校へ 行きます」とある。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "先週の 日曜日、友だちと 山に 登りました。朝 6時に 家を 出て、電車で 山の 近くまで 行きました。天気が よくて、山の 上から 町が よく 見えました。お昼ごはんは 山の 上で 食べました。自分で 作った おにぎりは とても おいしかったです。山を 下りた あと、友だちと 温泉に 入りました。少し つかれましたが、とても 楽しい 一日でした。また 行きたいと 思います。",
          items: [
            { question: "この 人は 日曜日の 朝、何時に 家を 出ましたか。", options: ["6時", "7時", "8時", "9時"], explain: "「朝 6時に 家を 出て」とある。" },
            { question: "お昼ごはんは どこで 食べましたか。", options: ["山の 上", "家", "温泉", "電車の 中"], explain: "「お昼ごはんは 山の 上で 食べました」とある。" },
            { question: "この 人は 山を 下りた あと、何を しましたか。", options: ["温泉に 入った。", "おにぎりを 作った。", "電車に 乗った。", "町を 見た。"], explain: "「山を 下りた あと、友だちと 温泉に 入りました」とある。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの お知らせを 見て、質問に 答えて ください。",
          passage: "【図書館 利用案内】\n・開いて いる 時間：午前9時〜午後7時\n・休みの 日：毎週 月曜日\n・本を 借りる：一人 5冊まで、2週間\n・注意：中で 食べたり 飲んだり しないで ください。",
          items: [
            { question: "図書館は 何曜日が 休みですか。", options: ["月曜日", "日曜日", "土曜日", "火曜日"], explain: "「休みの 日：毎週 月曜日」とある。" },
            { question: "本は 一人 何冊まで 借りられますか。", options: ["5冊", "2冊", "7冊", "9冊"], explain: "「一人 5冊まで」とある。" },
            { question: "図書館の 中で して は いけない ことは 何ですか。", options: ["食べる こと", "本を 読む こと", "歩く こと", "勉強する こと"], explain: "「中で 食べたり 飲んだり しないで ください」とある。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 B  (Set B)
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setB",
  label: "模試 B",
  durationMin: 80,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "妹は 台所で 料理を して います。", target: "台所", options: ["だいどころ", "だいところ", "たいどころ", "だいどこ"], explain: "台所 = だいどころ (dapur)。" },
            { sentence: "この 電車は 特急です。", target: "特急", options: ["とっきゅう", "とくきゅう", "とっきゆう", "どっきゅう"], explain: "特急 = とっきゅう (kereta ekspres)。" },
            { sentence: "世界には たくさんの 国が あります。", target: "世界", options: ["せかい", "せいかい", "せっかい", "せかいい"], explain: "世界 = せかい (dunia)。" },
            { sentence: "台風で 電車が 止まりました。", target: "台風", options: ["たいふう", "だいふう", "たいふ", "たいぶう"], explain: "台風 = たいふう (topan)。" },
            { sentence: "兄は 銀行に 勤めて います。", target: "勤めて", options: ["つとめて", "つとめって", "きんめて", "つどめて"], explain: "勤める = つとめる (bekerja di)。" },
            { sentence: "会場の 場所を 教えて ください。", target: "場所", options: ["ばしょ", "ばしょう", "じょうしょ", "ばところ"], explain: "場所 = ばしょ (tempat)。" },
            { sentence: "昨日は とても 疲れました。", target: "疲れました", options: ["つかれました", "つがれました", "やぶれました", "よごれました"], explain: "疲れる = つかれる (lelah)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "この みちは あぶないですから、気を つけて。", target: "あぶない", options: ["危ない", "険ない", "払ない", "厄ない"], explain: "あぶない = 危ない (berbahaya)。" },
            { sentence: "としょかんで 本を 借りました。", target: "としょかん", options: ["図書館", "回書館", "図書官", "回書官"], explain: "としょかん = 図書館 (perpustakaan)。" },
            { sentence: "あの 山は とても たかいです。", target: "たかい", options: ["高い", "安い", "多い", "広い"], explain: "たかい = 高い (tinggi)。" },
            { sentence: "わたしは 毎日 ぎゅうにゅうを 飲みます。", target: "ぎゅうにゅう", options: ["牛乳", "牛肉", "午乳", "牛孔"], explain: "ぎゅうにゅう = 牛乳 (susu sapi)。" },
            { sentence: "あかるい 部屋が 好きです。", target: "あかるい", options: ["明るい", "朝るい", "名るい", "暗るい"], explain: "あかるい = 明るい (terang)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "田中さんは 親切な 人で、いつも 私を （　）くれます。", options: ["たすけて", "なげて", "こわして", "わすれて"], explain: "親切 → たすける (menolong)。" },
            { sentence: "この ボタンを 押すと、ドアが （　）。", options: ["あきます", "おきます", "あるきます", "はたらきます"], explain: "ドアが あく = pintu terbuka。" },
            { sentence: "電車の 中で さいふを （　）しまいました。", options: ["なくして", "さがして", "ひろって", "わたして"], explain: "さいふを なくす = kehilangan dompet。" },
            { sentence: "大切な 約束なので、絶対に （　）ません。", options: ["わすれ", "はじまり", "あつまり", "おわり"], explain: "約束を わすれる = melupakan janji。" },
            { sentence: "さむいので、コートを （　）出かけます。", options: ["きて", "はいて", "かぶって", "ぬいで"], explain: "コートを きる = memakai mantel (pakaian atas)。" },
            { sentence: "この 料理は 少し 味が （　）ので、塩を 入れます。", options: ["うすい", "あまい", "からい", "ふかい"], explain: "味が うすい = rasanya hambar → tambah garam。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "田中さんは アメリカへ 行った ことが あります。", options: ["田中さんは 前に アメリカへ 行きました。", "田中さんは アメリカへ 行きたいです。", "田中さんは アメリカに 住んで います。", "田中さんは アメリカへ 行く つもりです。"], explain: "〜た ことが ある = pernah (pengalaman lampau)。" },
            { sentence: "この 部屋は しずかじゃ ありません。", options: ["この 部屋は うるさいです。", "この 部屋は きれいです。", "この 部屋は ひろいです。", "この 部屋は あかるいです。"], explain: "しずかじゃ ない = tidak tenang = うるさい (berisik)。" },
            { sentence: "山田さんは まだ 来て いません。", options: ["山田さんは まだ ここに いません。", "山田さんは もう 帰りました。", "山田さんは 来たくないです。", "山田さんは ここに います。"], explain: "まだ 来て いない = belum datang = belum ada di sini。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "しんせつ（親切）", options: ["駅で しんせつな 人が 道を 教えて くれました。", "この 料理は とても しんせつです。", "今日は しんせつな 天気です。", "しんせつに 走って ください。"], explain: "しんせつ (baik hati) untuk orang。" },
            { word: "やめる", options: ["体に 悪いので、たばこを やめました。", "電車を やめて 会社へ 行きます。", "本を やめて 読みます。", "水を やめて 飲みます。"], explain: "やめる = berhenti (kebiasaan/aktivitas)。" },
            { word: "じゅんび（準備）", options: ["旅行の じゅんびを して います。", "じゅんびな 部屋で 休みます。", "彼は じゅんびに 走りました。", "じゅんびを 食べました。"], explain: "じゅんび = persiapan。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "父は 今 出かけて いて、家に ＿＿。", options: ["いません", "ありません", "しません", "きません"], explain: "人の 存在 → いる/いない (家に いません)。" },
            { sentence: "日本語で 手紙を 書く こと＿＿ できます。", options: ["が", "を", "に", "へ"], explain: "〜ことが できる = bisa (partikel が)。" },
            { sentence: "明日 雨が 降っ＿＿、試合は 中止です。", options: ["たら", "ても", "ながら", "のに"], explain: "〜たら = kalau/jika (syarat)。" },
            { sentence: "薬を 飲んだ＿＿、まだ 頭が 痛いです。", options: ["のに", "ので", "から", "なら"], explain: "〜のに = padahal sudah (hasil tak sesuai)。" },
            { sentence: "子どもの とき、母に よく 本を 読んで ＿＿。", options: ["もらいました", "あげました", "くれました", "おきました"], explain: "母 → 私 (menerima) = 読んで もらいました。" },
            { sentence: "わからない 漢字は 先生に 聞く ＿＿です。", options: ["つもり", "はず", "こと", "もの"], explain: "〜つもり = berniat/berencana。" },
            { sentence: "彼は 来ると 言って いたから、きっと 来る＿＿です。", options: ["はず", "つもり", "そう", "よう"], explain: "〜はず = seharusnya (dugaan berdasar alasan)。" },
            { sentence: "たばこは 体に 悪いので、吸わない＿＿ して います。", options: ["ように", "そうに", "ことに", "ための"], explain: "〜ないように する = berusaha agar tidak。" },
            { sentence: "日本に 住んで いるので、日本語が 上手に なる＿＿。", options: ["でしょう", "ましょう", "ください", "です"], explain: "予想 → 〜でしょう。" },
            { sentence: "先生に 名前を 呼ば＿＿、返事を しました。", options: ["れて", "せて", "られて", "させて"], explain: "受身 (dipanggil) = 呼ばれて。" },
            { sentence: "母は 私に 部屋を そうじ ＿＿。", options: ["させました", "されました", "できました", "なりました"], explain: "使役 (menyuruh) = そうじ させました。" },
            { sentence: "パーティーに 行く＿＿ 行かないか、まだ 決めて いません。", options: ["か", "が", "も", "と"], explain: "〜か 〜ないか = apakah … atau tidak。" },
            { sentence: "窓が 開いて いる。だれかが 開けた＿＿だ。", options: ["よう", "そう", "はず", "つもり"], explain: "〜ようだ = sepertinya (dugaan dari bukti)。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "これは", chunks: ["先週", "デパートで", "買った", "かばん"], starIndex: 2, suffix: "です。", translation: "Ini tas yang saya beli di department store minggu lalu.", explain: "正しい文: これは 先週 デパートで 買った かばんです。★ = 買った。" },
            { prefix: "弟は", chunks: ["まだ", "ひらがなを", "読む", "ことが"], starIndex: 2, suffix: "できません。", translation: "Adik belum bisa membaca hiragana.", explain: "正しい文: 弟は まだ ひらがなを 読む ことが できません。★ = 読む。" },
            { prefix: "", chunks: ["日本語が", "上手に", "なる", "ように"], starIndex: 2, suffix: "毎日 勉強します。", translation: "Saya belajar tiap hari agar mahir bahasa Jepang.", explain: "正しい文: 日本語が 上手に なる ように 毎日 勉強します。★ = なる。" },
            { prefix: "母は", chunks: ["私に", "へやを", "そうじ", "させました"], starIndex: 2, suffix: "。", translation: "Ibu menyuruh saya membersihkan kamar.", explain: "正しい文: 母は 私に へやを そうじ させました。★ = そうじ。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "私の しゅみは 写真を とる ことです。休みの 日には、いつも カメラを 持って、公園（１）行きます。きれいな 花を 見つけた（２）、すぐに 写真を とります。先週は 山へ 行きました。山の 上は 寒かった（３）、景色が とても きれいでした。これからも たくさん 写真を とり（４）と 思って います。",
          items: [
            { label: "（１）", options: ["へ", "を", "が", "の"], explain: "公園へ 行きます = pergi ke taman (arah pakai へ)。" },
            { label: "（２）", options: ["とき", "あいだ", "ながら", "ように"], explain: "見つけた とき = ketika menemukan。" },
            { label: "（３）", options: ["けど", "ので", "から", "より"], explain: "寒かった けど = meskipun dingin (kontras)。" },
            { label: "（４）", options: ["たい", "ました", "ましょう", "そう"], explain: "とりたいと 思って います = ingin memotret。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メッセージを 読んで、質問に 答えて ください。",
          passage: "木村さんへ\n\nあした 一緒に 映画を 見に 行きませんか。3時に 駅の 前で 会いましょう。もし 都合が 悪かったら、電話して ください。\n中村",
          items: [
            { question: "中村さんは 木村さんと 何を したいですか。", options: ["一緒に 映画を 見たい。", "一緒に 食事を したい。", "駅を 案内したい。", "電話を かけたい。"], explain: "「一緒に 映画を 見に 行きませんか」とある。" },
            { question: "都合が 悪い とき、木村さんは どうしますか。", options: ["電話する。", "3時に 行く。", "駅で 待つ。", "映画を 見る。"], explain: "「都合が 悪かったら、電話して ください」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "私の 姉は 看護師です。病院で 働いて います。仕事は 大変ですが、人の 役に 立つので、姉は この 仕事が 好きだと 言って います。私も 将来、姉のような 人に なりたいです。",
          items: [
            { question: "姉の 仕事は 何ですか。", options: ["看護師", "医者", "先生", "店員"], explain: "「私の 姉は 看護師です」とある。" },
            { question: "「私」は どう 思って いますか。", options: ["姉のような 人に なりたい。", "病院で 休みたい。", "仕事を やめたい。", "姉と 話したくない。"], explain: "「姉のような 人に なりたいです」とある。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "私は 去年、日本に 来ました。はじめは 日本語が ぜんぜん わからなくて、買い物も 大変でした。でも、日本人の 友だちが できてから、少しずつ 日本語が 話せるように なりました。友だちは いつも ゆっくり 話して くれるので、とても わかりやすいです。今は アルバイトも 始めました。お客さんと 話すのは まだ 難しいですが、毎日 練習して います。来年は もっと 上手に なりたいです。",
          items: [
            { question: "この 人は はじめ、どうして 大変でしたか。", options: ["日本語が わからなかったから。", "友だちが いたから。", "アルバイトを したから。", "お金が なかったから。"], explain: "「はじめは 日本語が ぜんぜん わからなくて」とある。" },
            { question: "いつから 日本語が 話せるように なりましたか。", options: ["友だちが できてから。", "日本に 来る 前。", "アルバイトを やめてから。", "去年より 前。"], explain: "「友だちが できてから、少しずつ 話せるように なりました」とある。" },
            { question: "今、この 人は 何を して いますか。", options: ["アルバイトを して いる。", "国に 帰った。", "日本語が わからない。", "友だちが いない。"], explain: "「今は アルバイトも 始めました」とある。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの お知らせを 見て、質問に 答えて ください。",
          passage: "【スポーツ教室の お知らせ】\n・日時：毎週 土曜日 午前10時〜12時\n・場所：市民 体育館\n・料金：一回 500円\n・持ち物：運動できる くつ、飲み物\n・申し込み：電話（012-345-678）で 金曜日までに",
          items: [
            { question: "スポーツ教室は いつ ありますか。", options: ["毎週 土曜日", "毎週 日曜日", "毎週 金曜日", "毎日"], explain: "「毎週 土曜日 午前10時〜12時」とある。" },
            { question: "教室に 行く とき、何を 持って 行きますか。", options: ["運動できる くつと 飲み物", "教科書", "カメラ", "お弁当"], explain: "「持ち物：運動できる くつ、飲み物」とある。" },
            { question: "申し込みは いつまでですか。", options: ["金曜日まで", "土曜日まで", "日曜日まで", "10時まで"], explain: "「金曜日までに」とある。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 C  (Set C)
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setC",
  label: "模試 C",
  durationMin: 80,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "交番で 道を 聞きました。", target: "交番", options: ["こうばん", "こおばん", "こうはん", "こうばい"], explain: "交番 = こうばん (pos polisi)。" },
            { sentence: "この 建物は 古いです。", target: "建物", options: ["たてもの", "けんぶつ", "たちもの", "たてぶつ"], explain: "建物 = たてもの (gedung)。" },
            { sentence: "母は 病院で 働いて います。", target: "病院", options: ["びょういん", "びよういん", "びょうい", "びょいん"], explain: "病院 = びょういん (rumah sakit)。" },
            { sentence: "旅行の 計画を 立てました。", target: "計画", options: ["けいかく", "けいが", "けいかん", "けかく"], explain: "計画 = けいかく (rencana)。" },
            { sentence: "駅で 友だちと 別れました。", target: "別れました", options: ["わかれました", "わすれました", "はなれました", "よかれました"], explain: "別れる = わかれる (berpisah)。" },
            { sentence: "姉は 親切で 有名です。", target: "有名", options: ["ゆうめい", "ゆめい", "ゆうみょう", "うめい"], explain: "有名 = ゆうめい (terkenal)。" },
            { sentence: "図書館は とても 静かです。", target: "静か", options: ["しずか", "せいか", "しづか", "しずが"], explain: "静か = しずか (tenang)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "あしたは やすみです。", target: "やすみ", options: ["休み", "体み", "仕み", "住み"], explain: "やすみ = 休み (libur)。" },
            { sentence: "この えきで おります。", target: "えき", options: ["駅", "験", "駐", "駆"], explain: "えき = 駅 (stasiun)。" },
            { sentence: "あには 大学生です。", target: "あに", options: ["兄", "弟", "父", "姉"], explain: "あに = 兄 (kakak laki-laki)。" },
            { sentence: "おおきな 犬が います。", target: "おおきな", options: ["大きな", "太きな", "犬きな", "丈きな"], explain: "おおきな = 大きな (besar)。" },
            { sentence: "まいにち しんぶんを 読みます。", target: "しんぶん", options: ["新聞", "親聞", "新問", "親問"], explain: "しんぶん = 新聞 (koran)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "部屋を 出る ときは、電気を （　）ください。", options: ["けして", "つけて", "あけて", "しめて"], explain: "出る とき → 電気を けす (matikan lampu)。" },
            { sentence: "この 川は とても （　）ので、泳いでは いけません。", options: ["ふかい", "あさい", "ひくい", "ちかい"], explain: "川が ふかい = sungainya dalam → bahaya berenang。" },
            { sentence: "兄は 大学で 経済を （　）います。", options: ["べんきょうして", "あそんで", "はたらいて", "やすんで"], explain: "経済を べんきょうする = belajar ekonomi。" },
            { sentence: "さいふを 落として、お金が （　）なりました。", options: ["なく", "よく", "ちかく", "おおく"], explain: "お金が なくなる = uangnya hilang/habis。" },
            { sentence: "電車が 遅れて、会議に （　）しまいました。", options: ["おくれて", "はやくて", "すすんで", "まにあって"], explain: "会議に おくれる = terlambat ke rapat。" },
            { sentence: "この 問題の 答えが （　）ら、教えて ください。", options: ["わかった", "わすれた", "こまった", "おわった"], explain: "答えが わかったら = kalau tahu jawabannya。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "へやが きたないです。", options: ["へやが きれいじゃ ありません。", "へやが きれいです。", "へやが ひろいです。", "へやが あかるいです。"], explain: "きたない = kotor = きれいじゃ ない。" },
            { sentence: "田中さんは やさしいです。", options: ["田中さんは しんせつです。", "田中さんは こわいです。", "田中さんは げんきです。", "田中さんは ゆうめいです。"], explain: "やさしい = ramah/baik = しんせつ。" },
            { sentence: "もう 昼ごはんを 食べました。", options: ["昼ごはんは もう 終わりました。", "これから 昼ごはんを 食べます。", "昼ごはんを 食べたくないです。", "昼ごはんを 食べて いません。"], explain: "もう 食べた = sudah selesai makan。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "こわい（怖い）", options: ["私は 大きな 犬が こわいです。", "この りんごは こわいです。", "天気が こわくて 出かけました。", "日本語は こわくて おもしろいです。"], explain: "こわい = takut (terhadap sesuatu)。" },
            { word: "あつめる（集める）", options: ["弟は 外国の 切手を あつめて います。", "水を あつめて 飲みます。", "道を あつめて 歩きます。", "時間を あつめて 待ちます。"], explain: "あつめる = mengumpulkan (koleksi)。" },
            { word: "べんり（便利）", options: ["この アプリは とても べんりです。", "べんりな 料理を 食べました。", "彼は べんりに 走ります。", "今日は べんりな 天気です。"], explain: "べんり = praktis/berguna (alat, tempat)。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "昼ごはんを 食べた あと＿＿、少し 休みます。", options: ["で", "に", "を", "が"], explain: "〜あとで = setelah (partikel で)。" },
            { sentence: "妹は ピアノを ひく こと＿＿ できます。", options: ["が", "を", "に", "へ"], explain: "〜ことが できる (partikel が)。" },
            { sentence: "お金が あれ＿＿、車を 買いたいです。", options: ["ば", "ても", "のに", "ながら"], explain: "〜ば = kalau (syarat/pengandaian)。" },
            { sentence: "一生懸命 練習した＿＿、試合に 負けました。", options: ["のに", "ので", "から", "なら"], explain: "〜のに = padahal sudah berlatih。" },
            { sentence: "わからない ところを 友だちに 教えて ＿＿。", options: ["もらいました", "あげました", "くれました", "おきました"], explain: "友だち → 私 = 教えて もらいました。" },
            { sentence: "来週 旅行に 行く ＿＿です。", options: ["つもり", "はず", "よう", "そう"], explain: "〜つもり = berniat/berencana。" },
            { sentence: "彼女は 5時に 来ると 言って いたから、もうすぐ 来る＿＿です。", options: ["はず", "つもり", "こと", "もの"], explain: "〜はず = seharusnya (dugaan berdasar alasan)。" },
            { sentence: "毎日 日本語を 話す＿＿ して います。", options: ["ように", "そうに", "ことに", "ための"], explain: "〜ように する = berusaha untuk。" },
            { sentence: "あの 二人は 兄弟だから、顔が 似て いる＿＿。", options: ["でしょう", "ましょう", "ください", "です"], explain: "予想 → 〜でしょう。" },
            { sentence: "先生に 作文を ほめ＿＿、うれしかったです。", options: ["られて", "させて", "せて", "て"], explain: "受身 (dipuji) = ほめられて。" },
            { sentence: "母は 私に 部屋を かたづけ ＿＿。", options: ["させました", "されました", "なりました", "できました"], explain: "使役 (menyuruh) = かたづけ させました。" },
            { sentence: "日曜日は 家に いる＿＿、出かけるか まだ 決めて いません。", options: ["か", "が", "も", "と"], explain: "〜か 〜か = apakah … atau …。" },
            { sentence: "電気が ついて いる。だれか 部屋に いる＿＿だ。", options: ["よう", "そう", "はず", "まま"], explain: "〜ようだ = sepertinya (dugaan dari bukti)。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "これは", chunks: ["日本語を", "勉強する", "ときに", "使う"], starIndex: 2, suffix: "本です。", translation: "Ini buku yang dipakai saat belajar bahasa Jepang.", explain: "正しい文: これは 日本語を 勉強する ときに 使う 本です。★ = ときに。" },
            { prefix: "私は", chunks: ["まだ", "漢字を", "書く", "ことが"], starIndex: 2, suffix: "できません。", translation: "Saya belum bisa menulis kanji.", explain: "正しい文: 私は まだ 漢字を 書く ことが できません。★ = 書く。" },
            { prefix: "", chunks: ["風邪を", "ひかない", "ように", "あたたかい"], starIndex: 2, suffix: "服を 着ます。", translation: "Saya memakai baju hangat agar tidak masuk angin.", explain: "正しい文: 風邪を ひかない ように あたたかい 服を 着ます。★ = ように。" },
            { prefix: "先生は", chunks: ["学生に", "本を", "たくさん", "読ませます"], starIndex: 2, suffix: "。", translation: "Guru menyuruh murid membaca banyak buku.", explain: "正しい文: 先生は 学生に 本を たくさん 読ませます。★ = たくさん。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "去年の 夏休み、私は 家族（１）海へ 行きました。海は 家から 遠かった（２）、朝 早く 出発しました。海に 着いてから、みんなで 泳いだり、砂で 山を 作ったり しました。お昼ごはんを 食べた（３）、貝を 集めました。とても 楽しかったので、今年も また 海へ 行き（４）と 思って います。",
          items: [
            { label: "（１）", options: ["と", "を", "へ", "の"], explain: "家族と = bersama keluarga (partikel と)。" },
            { label: "（２）", options: ["ので", "のに", "でも", "より"], explain: "遠かったので = karena jauh (alasan)。" },
            { label: "（３）", options: ["あとで", "まえに", "ながら", "ように"], explain: "食べた あとで = setelah makan。" },
            { label: "（４）", options: ["たい", "ました", "ましょう", "そう"], explain: "行きたいと 思って います = ingin pergi。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メモを 読んで、質問に 答えて ください。",
          passage: "田中さん\n\n会議の 資料が できました。私の 机の 上に 置いて あります。会議は 3時からですから、その 前に 見て おいて ください。\n山田",
          items: [
            { question: "資料は どこに ありますか。", options: ["山田さんの 机の 上", "田中さんの 机の 上", "会議室", "3階"], explain: "「私（＝山田）の 机の 上に 置いて あります」とある。" },
            { question: "田中さんは 3時までに 何を しますか。", options: ["資料を 見て おく。", "資料を 作る。", "会議室を そうじする。", "山田さんに 電話する。"], explain: "「その 前に 見て おいて ください」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "私の 町には 小さな 本屋が あります。あまり 大きくないですが、店の 人が とても 親切で、いつも いい 本を 教えて くれます。だから 私は この 店が 大好きで、よく 行きます。",
          items: [
            { question: "この 人は どうして その 本屋が 好きですか。", options: ["店の 人が 親切だから。", "店が 大きいから。", "本が 安いから。", "家から 近いから。"], explain: "「店の 人が とても 親切で…だから 大好き」とある。" },
            { question: "この 本屋は どんな 店ですか。", options: ["小さい 店", "大きい 店", "古い 店", "新しい 店"], explain: "「小さな 本屋が あります」とある。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "私は 音楽が 好きで、子どもの ころから ピアノを 習って います。はじめは あまり 上手では ありませんでしたが、毎日 練習した ので、少しずつ ひけるように なりました。中学生の とき、コンサートで ピアノを ひきました。たくさんの 人の 前で ひくのは とても きんちょうしましたが、終わった あと、みんなが はく手を して くれて、本当に うれしかったです。今も 時間が ある ときは、ピアノを ひいて います。",
          items: [
            { question: "この 人は いつから ピアノを 習って いますか。", options: ["子どもの ころから", "中学生から", "コンサートの あと", "去年から"], explain: "「子どもの ころから ピアノを 習って います」とある。" },
            { question: "どうして ピアノが ひけるように なりましたか。", options: ["毎日 練習したから。", "先生が やさしかったから。", "コンサートに 出たから。", "音楽が 好きだから。"], explain: "「毎日 練習した ので、少しずつ ひけるように なりました」とある。" },
            { question: "コンサートの あと、この 人は どう 思いましたか。", options: ["うれしかった。", "かなしかった。", "つかれた。", "こわかった。"], explain: "「みんなが はく手を して くれて、本当に うれしかった」とある。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの ご案内を 見て、質問に 答えて ください。",
          passage: "【料理教室の ご案内】\n・日にち：6月10日（土）\n・時間：午後1時〜4時\n・場所：みどり 公民館 2階\n・作る もの：日本の 家庭料理\n・料金：1,500円（材料費 込み）\n・注意：エプロンを 持って 来て ください。",
          items: [
            { question: "料理教室では 何を 作りますか。", options: ["日本の 家庭料理", "ケーキ", "外国の 料理", "パン"], explain: "「作る もの：日本の 家庭料理」とある。" },
            { question: "料金は いくらですか。", options: ["1,500円", "1,000円", "500円", "材料費は 別"], explain: "「料金：1,500円（材料費 込み）」とある。" },
            { question: "何を 持って 行かなければ なりませんか。", options: ["エプロン", "材料", "1,000円", "教科書"], explain: "「エプロンを 持って 来て ください」とある。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 D — 公式形式 (official-format diagnostic)
 *  Mirrors the official JLPT N4 Practice Workbook layout ("two examples of
 *  every question type"). Original items — a short format-familiarization run.
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setD",
  label: "模試 D（公式形式）",
  durationMin: 30,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "弟は 毎日 新聞を 読みます。", target: "新聞", options: ["しんぶん", "しんもん", "しんふん", "しむぶん"], explain: "新聞 = しんぶん (koran)。" },
            { sentence: "来月、日本へ 出張します。", target: "出張", options: ["しゅっちょう", "しゅつちょう", "しゅっちょ", "でちょう"], explain: "出張 = しゅっちょう (perjalanan dinas)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "この みずは とても つめたいです。", target: "つめたい", options: ["冷たい", "凍たい", "寒たい", "涼たい"], explain: "つめたい = 冷たい (dingin, untuk benda/air)。" },
            { sentence: "かぞくと りょこうに 行きます。", target: "りょこう", options: ["旅行", "旋行", "族行", "旅信"], explain: "りょこう = 旅行 (perjalanan/wisata)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "荷物が 重いので、タクシーを （　）。", options: ["よびます", "はしります", "あるきます", "のぼります"], explain: "タクシーを よぶ = memanggil taksi。" },
            { sentence: "この 席は （　）いますか。", options: ["あいて", "しめて", "つけて", "けして"], explain: "席が あく = kursi kosong (空いて いますか)。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "この みせは いつも すいて います。", options: ["この みせは いつも 人が 少ないです。", "この みせは いつも 人が 多いです。", "この みせは いつも しまって います。", "この みせは いつも たかいです。"], explain: "すいて いる = sepi = 人が 少ない。" },
            { sentence: "電気を つけて ください。", options: ["部屋を 明るく して ください。", "部屋を 暗く して ください。", "部屋を しずかに して ください。", "部屋を そうじして ください。"], explain: "電気を つける = menyalakan lampu = membuat terang。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "るす（留守）", options: ["電話したが、田中さんは るすだった。", "るすな 料理を 食べた。", "道が るすだ。", "天気が るすだ。"], explain: "るす = tidak ada di rumah。" },
            { word: "なおす（直す）", options: ["こわれた 時計を なおしました。", "水を なおして 飲みます。", "道を なおして 歩きます。", "本を なおして 読みます。"], explain: "なおす = memperbaiki (barang rusak)。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "田中さんは 来る＿＿ 言って いました。", options: ["と", "を", "に", "が"], explain: "〜と 言う = mengutip ucapan pakai と。" },
            { sentence: "宿題を し＿＿ から、遊びに 行きます。", options: ["て", "たり", "ても", "たら"], explain: "〜てから = setelah (て形 + から)。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "これは", chunks: ["母が", "作って", "くれた", "ケーキ"], starIndex: 2, suffix: "です。", translation: "Ini kue yang dibuatkan ibu.", explain: "正しい文: これは 母が 作って くれた ケーキです。★ = くれた。" },
            { prefix: "私は", chunks: ["日本の", "アニメを", "見る", "ことが"], starIndex: 2, suffix: "好きです。", translation: "Saya suka menonton anime Jepang.", explain: "正しい文: 私は 日本の アニメを 見る ことが 好きです。★ = 見る。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "私は 先週 かぜを ひきました。熱が 高かった（１）、学校を 休みました。今は もう 元気に なった（２）、心配しないで ください。",
          items: [
            { label: "（１）", options: ["ので", "のに", "でも", "より"], explain: "高かったので = karena tinggi (alasan)。" },
            { label: "（２）", options: ["から", "のに", "ながら", "より"], explain: "なったから = karena sudah sembuh。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "あした 学校は 休みです。でも、来週の 月曜日に テストが ありますから、家で 勉強して ください。",
          items: [
            { question: "あした 学校は ありますか。", options: ["ありません。", "あります。", "月曜日に あります。", "わかりません。"], explain: "「あした 学校は 休みです」とある。" },
            { question: "来週の 月曜日に 何が ありますか。", options: ["テスト", "休み", "そうじ", "りょこう"], explain: "「来週の 月曜日に テストが あります」とある。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 E  (Set E)
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setE",
  label: "模試 E",
  durationMin: 80,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "郵便局で 手紙を 出しました。", target: "郵便局", options: ["ゆうびんきょく", "ゆうびんきょうく", "ゆびんきょく", "ゆうべんきょく"], explain: "郵便局 = ゆうびんきょく (kantor pos)。" },
            { sentence: "天気予報に よると、あしたは 晴れるそうです。", target: "天気予報", options: ["てんきよほう", "てんきよほ", "てんきようほう", "てんぎよほう"], explain: "天気予報 = てんきよほう (prakiraan cuaca)。" },
            { sentence: "来月、新しい アパートに 引っ越します。", target: "引っ越します", options: ["ひっこします", "ひきこします", "ひっごします", "ひつこします"], explain: "引っ越す = ひっこす (pindah rumah)。" },
            { sentence: "財布を どこかに 忘れて しまいました。", target: "財布", options: ["さいふ", "ざいふ", "さいぶ", "さいうふ"], explain: "財布 = さいふ (dompet)。" },
            { sentence: "空港まで 電車で 一時間 かかります。", target: "空港", options: ["くうこう", "こうくう", "くうごう", "くこう"], explain: "空港 = くうこう (bandara)。" },
            { sentence: "動物園で 子どもたちが 喜んで いました。", target: "動物園", options: ["どうぶつえん", "どうもつえん", "どうぶつえ", "どぶつえん"], explain: "動物園 = どうぶつえん (kebun binatang)。" },
            { sentence: "祭りの 日は 道が こんで います。", target: "祭り", options: ["まつり", "さいり", "まづり", "まつい"], explain: "祭り = まつり (festival)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "つくえの うえに ねこが います。", target: "うえ", options: ["上", "下", "中", "外"], explain: "うえ = 上 (atas)。" },
            { sentence: "わたしの ともだちは しんせつです。", target: "ともだち", options: ["友達", "友違", "反達", "友通"], explain: "ともだち = 友達 (teman)。" },
            { sentence: "きょうは そらが くもりです。", target: "そら", options: ["空", "雲", "天", "風"], explain: "そら = 空 (langit)。" },
            { sentence: "あの たてものは がっこうです。", target: "たてもの", options: ["建物", "建者", "健物", "立物"], explain: "たてもの = 建物 (gedung)。" },
            { sentence: "がっこうの まえに こうえんが あります。", target: "まえ", options: ["前", "後", "中", "横"], explain: "まえ = 前 (depan)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "風が 強いので、帽子が （　）しまいました。", options: ["とんで", "あるいて", "のって", "すわって"], explain: "風で 帽子が とぶ = topi tertiup angin。" },
            { sentence: "この 荷物は 重いので、一人では （　）。", options: ["もてません", "たべません", "のみません", "みません"], explain: "持てません = tidak bisa membawa (berat)。" },
            { sentence: "電気が 急に （　）、部屋が 暗く なりました。", options: ["きえて", "ついて", "あいて", "しまって"], explain: "電気が 消える = lampu padam。" },
            { sentence: "試合に 負けて、とても （　）です。", options: ["くやしい", "うれしい", "たのしい", "やさしい"], explain: "悔しい = kecewa/menyesal。" },
            { sentence: "電車が 止まって、（　）に なりました。", options: ["ちこく", "あんしん", "べんり", "しんぱい"], explain: "遅刻 = terlambat。" },
            { sentence: "この 仕事は 一人では （　）ないので、手伝って ください。", options: ["でき", "はたらけ", "やすめ", "あそべ"], explain: "できない = tidak bisa (menyelesaikan sendiri)。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "この 道は せまいです。", options: ["この 道は ひろくないです。", "この 道は ひろいです。", "この 道は ながいです。", "この 道は みじかいです。"], explain: "せまい = sempit = ひろくない。" },
            { sentence: "田中さんは 元気が ないようです。", options: ["田中さんは あまり 元気じゃないようです。", "田中さんは とても 元気なようです。", "田中さんは いそがしいようです。", "田中さんは うれしいようです。"], explain: "元気がない = kurang semangat = あまり元気じゃない。" },
            { sentence: "この店は 今日 休みです。", options: ["この店は 今日 開いていません。", "この店は 今日 開いています。", "この店は 今日 新しいです。", "この店は 今日 安いです。"], explain: "休み = libur = 開いていない。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "しんぱい（心配）", options: ["母は 私の 健康を しんぱいして います。", "しんぱいな 料理を 作りました。", "かれは しんぱいに 走ります。", "きょうは しんぱいな 天気です。"], explain: "しんぱい (khawatir) dipakai untuk orang/hal。" },
            { word: "こしょう（故障）", options: ["エアコンが こしょうして、暑いです。", "こしょうな 人に 会いました。", "こしょうに 勉強します。", "こしょうを 食べました。"], explain: "こしょう = rusak (mesin/alat)。" },
            { word: "むり（無理）", options: ["体調が 悪いので、今日は 無理を しないで ください。", "むりな 料理を 食べました。", "彼は むりに 話します。", "むりな 天気です。"], explain: "無理を する = memaksakan diri。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "今日中に レポートを 出さ＿＿ なりません。", options: ["なければ", "なくても", "たら", "ながら"], explain: "〜なければならない = harus (keharusan)。" },
            { sentence: "明日は 休みなので、早く 起き＿＿ いいです。", options: ["なくても", "なければ", "たら", "ので"], explain: "〜なくてもいい = tidak wajib/tidak perlu。" },
            { sentence: "この 本は 字が 小さくて、読み＿＿です。", options: ["にくい", "やすい", "すぎる", "そうな"], explain: "〜にくい = sulit untuk (dibaca)。" },
            { sentence: "この ペンは 使い＿＿ので、好きです。", options: ["やすい", "にくい", "すぎる", "そうな"], explain: "〜やすい = mudah untuk (dipakai)。" },
            { sentence: "彼女は 何も 言わない＿＿、部屋を 出て 行きました。", options: ["まま", "ながら", "ように", "ため"], explain: "〜まま = dalam keadaan tetap (tanpa berkata apa-apa)。" },
            { sentence: "電車の 中に かさを 忘れて＿＿。", options: ["しまいました", "おきました", "あります", "みます"], explain: "〜てしまう = terlanjur/menyesal (lupa payung)。" },
            { sentence: "来週、国へ 帰る＿＿ しました。", options: ["ことに", "ことが", "はずに", "ように"], explain: "〜ことにする = memutuskan untuk。" },
            { sentence: "急に 雨が 降って＿＿、大変でした。", options: ["きて", "いって", "おいて", "しまって"], explain: "〜てくる = mulai terjadi (perubahan mendekat)。" },
            { sentence: "田中さんは 会議に 出る＿＿、出ないか まだ わかりません。", options: ["か", "が", "も", "と"], explain: "〜か〜ないか = apakah … atau tidak。" },
            { sentence: "彼は とても 疲れて いる＿＿だ。顔色が 悪い。", options: ["よう", "そう", "はず", "つもり"], explain: "〜ようだ = sepertinya (dugaan dari bukti/wajah)。" },
            { sentence: "天気予報に よると、明日は 雪が 降る＿＿です。", options: ["そう", "よう", "はず", "つもり"], explain: "〜そうだ (伝聞) = katanya (dari yang didengar)。" },
            { sentence: "母は 私に 野菜を 食べ＿＿。", options: ["させます", "されます", "できます", "なります"], explain: "使役 (menyuruh) = 食べさせます。" },
            { sentence: "この 部屋は 静かなので、勉強し＿＿。", options: ["やすいです", "にくいです", "すぎます", "そうです"], explain: "〜やすい = mudah untuk (belajar)。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "これは", chunks: ["田中さんが", "作って", "くれた", "料理"], starIndex: 2, suffix: "です。", translation: "Ini masakan yang dibuatkan oleh Tanaka.", explain: "正しい文: これは 田中さんが 作って くれた 料理です。★ = くれた。" },
            { prefix: "彼女は", chunks: ["日本語を", "教える", "ことに", "しました"], starIndex: 2, suffix: "。", translation: "Dia memutuskan untuk mengajar bahasa Jepang.", explain: "正しい文: 彼女は 日本語を 教える ことに しました。★ = ことに。" },
            { prefix: "", chunks: ["宿題が", "終わって", "から", "遊びに"], starIndex: 2, suffix: "行きます。", translation: "Setelah PR selesai, saya pergi bermain.", explain: "正しい文: 宿題が 終わって から 遊びに 行きます。★ = から。" },
            { prefix: "母は", chunks: ["私に", "野菜を", "食べる", "ように"], starIndex: 2, suffix: "言いました。", translation: "Ibu bilang agar saya makan sayur.", explain: "正しい文: 母は 私に 野菜を 食べる ように 言いました。★ = 食べる。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "先週、友だちと 海へ 行きました。海（１）着いてから、みんなで 泳いだり、写真を とったり しました。天気が よかった（２）、とても 楽しかったです。お昼は 近くの 店で 魚料理を（３）。帰る 前に、お土産を 買い（４）と 思っています。",
          items: [
            { label: "（１）", options: ["に", "で", "を", "へ"], explain: "海に 着く = tiba di laut (partikel に untuk titik tujuan)。" },
            { label: "（２）", options: ["ので", "のに", "でも", "より"], explain: "よかったので = karena cuacanya bagus。" },
            { label: "（３）", options: ["食べました", "食べます", "食べたい", "食べて"], explain: "食べました = sudah makan (laporan kegiatan)。" },
            { label: "（４）", options: ["たい", "ました", "ましょう", "そう"], explain: "買いたいと 思って います = ingin membeli。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メモを 読んで、質問に 答えて ください。",
          passage: "山本さん\n\n会議の 時間が 変わりました。3時からではなく、4時からに なりました。場所は 同じです。よろしく お願いします。\n佐藤",
          items: [
            { question: "会議は 何時から ですか。", options: ["4時から", "3時から", "5時から", "2時から"], explain: "「4時からに なりました」とある。" },
            { question: "会議の 場所は どう なりましたか。", options: ["変わりません。", "変わりました。", "わかりません。", "なくなりました。"], explain: "「場所は 同じです」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "わたしは 毎朝 コーヒーを 飲みます。でも、今朝は 時間が なかったので、飲みませんでした。会社で 眠くなって、大変でした。",
          items: [
            { question: "この人は 今朝、何を しませんでしたか。", options: ["コーヒーを 飲まなかった。", "会社に 行かなかった。", "朝ごはんを 食べなかった。", "早く 起きなかった。"], explain: "「今朝は…飲みませんでした」とある。" },
            { question: "会社で どう なりましたか。", options: ["眠く なった。", "元気に なった。", "うれしく なった。", "いそがしく なった。"], explain: "「会社で 眠くなって、大変でした」とある。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "先月、わたしは はじめて 一人で 旅行を しました。行き先は 京都です。新幹線に 乗るのは はじめてで、少し 緊張しました。京都に 着いてから、有名な お寺を いくつか まわりました。人が とても 多かったですが、景色は 本当に きれいでした。夜は 小さな 食堂で 京料理を 食べました。少し 高かったですが、とても おいしかったです。次の日は 雨が 降って いましたが、傘を 差して 町を 歩きました。一人旅は はじめてで 少し 心配でしたが、思っていたより ずっと 楽しかったです。また 一人で どこかへ 行きたいと 思います。",
          items: [
            { question: "この人は 何に 乗るのが はじめてでしたか。", options: ["新幹線", "飛行機", "バス", "船"], explain: "「新幹線に 乗るのは はじめてで」とある。" },
            { question: "夜は 何を しましたか。", options: ["食堂で 京料理を 食べた。", "お寺を まわった。", "ホテルで 休んだ。", "買い物を した。"], explain: "「夜は 小さな 食堂で 京料理を 食べました」とある。" },
            { question: "この人は 旅行を どう 思いましたか。", options: ["思っていたより 楽しかった。", "つまらなかった。", "高かったので 後悔した。", "もう 行きたくない。"], explain: "「思っていたより ずっと 楽しかった」とある。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの お知らせを 見て、質問に 答えて ください。",
          passage: "【日本語 スピーチ大会】\n・日にち：11月20日（金）\n・時間：午後2時〜4時\n・場所：市民ホール\n・参加費：無料\n・申し込み：11月10日までに、メールで お願いします。\n・注意：発表は 一人 5分までです。",
          items: [
            { question: "スピーチ大会は いつ ありますか。", options: ["11月20日", "11月10日", "12月20日", "11月2日"], explain: "「日にち：11月20日」とある。" },
            { question: "参加費は いくらですか。", options: ["無料です。", "1,000円です。", "500円です。", "わかりません。"], explain: "「参加費：無料」とある。" },
            { question: "申し込みは どうやって しますか。", options: ["メールで します。", "電話で します。", "市民ホールへ 行きます。", "手紙を 書きます。"], explain: "「メールで お願いします」とある。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 F  (Set F)
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setF",
  label: "模試 F",
  durationMin: 80,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "来週は 妹の 誕生日です。", target: "誕生日", options: ["たんじょうび", "だんじょうび", "たんじょうひ", "たんしょうび"], explain: "誕生日 = たんじょうび (ulang tahun)。" },
            { sentence: "お金を 銀行に 預けます。", target: "預けます", options: ["あずけます", "あづけます", "よけます", "あすけます"], explain: "預ける = あずける (menitipkan)。" },
            { sentence: "週末に 家族で キャンプに 行きます。", target: "家族", options: ["かぞく", "がぞく", "かそく", "かぞうく"], explain: "家族 = かぞく (keluarga)。" },
            { sentence: "自動販売機で ジュースを 買いました。", target: "自動販売機", options: ["じどうはんばいき", "じとうはんばいき", "じどうばんばいき", "じどうはんばいぎ"], explain: "自動販売機 = じどうはんばいき (mesin penjual otomatis)。" },
            { sentence: "空港で 友達を 迎えました。", target: "迎えました", options: ["むかえました", "おかえました", "むかいました", "まかえました"], explain: "迎える = むかえる (menjemput)。" },
            { sentence: "運動会は 来月の 土曜日です。", target: "運動会", options: ["うんどうかい", "うんとうかい", "うんどうがい", "うんどかい"], explain: "運動会 = うんどうかい (acara olahraga sekolah)。" },
            { sentence: "引っ越しを 友達に 手伝って もらいました。", target: "手伝って", options: ["てつだって", "てづだって", "てつたって", "でつだって"], explain: "手伝う = てつだう (membantu)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "きょうは いもうとの たんじょうびです。", target: "いもうと", options: ["妹", "姉", "兄", "弟"], explain: "いもうと = 妹 (adik perempuan)。" },
            { sentence: "がっこうの うんどうかいは たのしいです。", target: "たのしい", options: ["楽しい", "苦しい", "悲しい", "忙しい"], explain: "たのしい = 楽しい (menyenangkan)。" },
            { sentence: "この みちを まっすぐ 行くと、こうえんが あります。", target: "みち", options: ["道", "首", "通", "進"], explain: "みち = 道 (jalan)。" },
            { sentence: "つよい かぜが ふいて います。", target: "かぜ", options: ["風", "雨", "雪", "空"], explain: "かぜ = 風 (angin)。" },
            { sentence: "でんしゃの なかで ほんを よみます。", target: "なか", options: ["中", "外", "上", "下"], explain: "なか = 中 (dalam)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "毎月、少しずつ お金を （　）います。", options: ["ためて", "つかって", "かりて", "かえして"], explain: "貯める = menabung。" },
            { sentence: "自動販売機で のみものを （　）。", options: ["かいました", "つくりました", "もらいました", "かりました"], explain: "買いました = membeli (dari vending machine)。" },
            { sentence: "雨が 降って いたので、友だちに 傘を （　）もらいました。", options: ["かして", "かりて", "あげて", "くれて"], explain: "貸して もらう = dipinjami (payung)。" },
            { sentence: "ギターを 習い始めて、少しずつ （　）ように なりました。", options: ["ひける", "ひけない", "ひかない", "ひいた"], explain: "弾けるように なる = jadi bisa memainkan (gitar)。" },
            { sentence: "キャンプで テントを （　）のは 大変でした。", options: ["たてる", "たべる", "きる", "のる"], explain: "テントを 立てる = mendirikan tenda。" },
            { sentence: "空港で 友だちを （　）、うれしかったです。", options: ["むかえて", "おくって", "わすれて", "さがして"], explain: "友だちを 迎える = menjemput teman。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "この 仕事は かんたんでは ありません。", options: ["この 仕事は むずかしいです。", "この 仕事は やさしいです。", "この 仕事は はやいです。", "この 仕事は あんぜんです。"], explain: "かんたんではない = tidak mudah = むずかしい。" },
            { sentence: "彼は お金を たくさん もって います。", options: ["彼は お金持ちです。", "彼は びんぼうです。", "彼は けちです。", "彼は しんせつです。"], explain: "お金を たくさん 持って いる = お金持ち (kaya)。" },
            { sentence: "きのうの パーティーは にぎやかでした。", options: ["きのうの パーティーは 人が 多くて 楽しかったです。", "きのうの パーティーは しずかでした。", "きのうの パーティーは つまらなかったです。", "きのうの パーティーは さびしかったです。"], explain: "にぎやか = ramai = 人が多くて楽しい。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "たのむ（頼む）", options: ["友だちに 荷物を 運ぶのを 頼みました。", "本を 頼んで 読みます。", "道を 頼んで 歩きます。", "時間を 頼んで 待ちます。"], explain: "頼む = meminta tolong。" },
            { word: "しゅうかん（習慣）", options: ["朝、散歩を するのが 私の 習慣です。", "習慣な 料理を 食べました。", "彼は 習慣に 走ります。", "きょうは 習慣な 天気です。"], explain: "習慣 = kebiasaan。" },
            { word: "こわれる（壊れる）", options: ["古い 時計が 壊れて、動きません。", "時計が 壊れて、おいしいです。", "時計を 壊れて、走ります。", "時計が 壊れて、はやいです。"], explain: "壊れる = rusak (barang/mesin)。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "この ボタンを 押す＿＿、ドアが 開きます。", options: ["と", "なら", "ので", "のに"], explain: "〜と = jika (kondisi yang pasti terjadi)。" },
            { sentence: "図書館では 大きい 声で 話し＿＿。", options: ["てはいけません", "てもいいです", "ています", "ました"], explain: "〜てはいけない = dilarang (larangan)。" },
            { sentence: "疲れたら、少し 休ん＿＿いいですよ。", options: ["でも", "では", "でが", "でと"], explain: "〜てもいい = boleh (izin)。" },
            { sentence: "この 料理は 作った＿＿なので、まだ 熱いです。", options: ["ばかり", "まま", "ところ", "とおり"], explain: "〜たばかり = baru saja selesai。" },
            { sentence: "旅行の 前に、切符を 買って＿＿ ましょう。", options: ["おき", "み", "しまい", "あり"], explain: "〜ておく = melakukan sesuatu untuk persiapan。" },
            { sentence: "一度、その 映画を 見て＿＿たいです。", options: ["み", "おき", "しまい", "あり"], explain: "〜てみる = mencoba melakukan。" },
            { sentence: "弟は まだ 子どもな＿＿、よく 泣きます。", options: ["ので", "けど", "でも", "より"], explain: "子どもなので = karena masih anak-anak。" },
            { sentence: "一生懸命 練習した＿＿、上手に なりませんでした。", options: ["のに", "ので", "から", "なら"], explain: "〜のに = padahal sudah berlatih keras。" },
            { sentence: "会議は 午後3時＿＿ 始まります。", options: ["から", "まで", "より", "でも"], explain: "〜から = mulai dari jam 3。" },
            { sentence: "母は 忙しい＿＿、いつも 笑顔です。", options: ["のに", "ので", "から", "けど"], explain: "忙しいのに = padahal sibuk (kontras)。" },
            { sentence: "この 薬を 飲め＿＿、すぐ 治りますよ。", options: ["ば", "ても", "のに", "から"], explain: "〜ば = kalau (syarat dengan hasil positif)。" },
            { sentence: "彼女は 日本に 住んだ＿＿が あります。", options: ["こと", "もの", "とき", "ため"], explain: "〜たことがある = pernah (pengalaman)。" },
            { sentence: "忘れ物を しない＿＿、もう一度 かばんの 中を 確認して ください。", options: ["ように", "ために", "ながら", "のに"], explain: "〜ないように = agar tidak (lupa membawa barang)。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "この", chunks: ["ボタンを", "押す", "と", "電気が"], starIndex: 2, suffix: "つきます。", translation: "Kalau menekan tombol ini, lampu menyala.", explain: "正しい文: この ボタンを 押す と 電気が つきます。★ = と。" },
            { prefix: "図書館では", chunks: ["大きい", "声で", "話しては", "いけません"], starIndex: 2, suffix: "。", translation: "Di perpustakaan tidak boleh berbicara dengan suara keras.", explain: "正しい文: 図書館では 大きい 声で 話しては いけません。★ = 話しては。" },
            { prefix: "旅行の", chunks: ["前に", "切符を", "買って", "おきます"], starIndex: 2, suffix: "。", translation: "Sebelum bepergian, saya membeli tiket terlebih dahulu.", explain: "正しい文: 旅行の 前に 切符を 買って おきます。★ = 買って。" },
            { prefix: "彼女は", chunks: ["日本に", "住んだ", "ことが", "あります"], starIndex: 2, suffix: "。", translation: "Dia pernah tinggal di Jepang.", explain: "正しい文: 彼女は 日本に 住んだ ことが あります。★ = ことが。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "先週の 日曜日は 妹の 誕生日でした。家族（１）レストランへ 行って、お祝いを しました。妹は とても 喜んで いました。食事の（２）、みんなで 写真を とりました。来年も また 楽しい 誕生日に（３）と 思います。妹に プレゼントを 買う（４）、いろいろな 店を 見て 回りました。",
          items: [
            { label: "（１）", options: ["と", "で", "を", "へ"], explain: "家族と = bersama keluarga。" },
            { label: "（２）", options: ["あとで", "まえに", "ながら", "ように"], explain: "食事の あとで = setelah makan。" },
            { label: "（３）", options: ["したい", "します", "しました", "しよう"], explain: "したいと 思います = ingin menjadikannya (harapan)。" },
            { label: "（４）", options: ["ために", "ように", "のに", "から"], explain: "買う ために = demi/untuk membeli (tujuan)。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メモを 読んで、質問に 答えて ください。",
          passage: "鈴木さん\n\n明日の 練習は 雨の ため、中止に なりました。次の 練習は 来週の 土曜日です。場所は いつもと 同じ 体育館です。\n木村",
          items: [
            { question: "明日の 練習は どう なりましたか。", options: ["中止に なりました。", "時間が 変わりました。", "場所が 変わりました。", "そのまま 行われます。"], explain: "「中止に なりました」とある。" },
            { question: "次の 練習は いつですか。", options: ["来週の 土曜日", "明日", "今週の 土曜日", "来月"], explain: "「次の 練習は 来週の 土曜日です」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "わたしは 先月から 銀行で お金を ためて います。毎月 5千円ずつ 入れて、旅行の お金に する つもりです。まだ 少ししか たまって いませんが、少しずつ 頑張ります。",
          items: [
            { question: "この人は 何を して いますか。", options: ["お金を ためて いる。", "旅行に 行って いる。", "銀行で 働いて いる。", "お金を 借りて いる。"], explain: "「銀行で お金を ためて います」とある。" },
            { question: "貯めた お金は 何に 使う つもりですか。", options: ["旅行の お金", "家の お金", "学校の お金", "車の お金"], explain: "「旅行の お金に する つもりです」とある。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "先週の 週末、わたしは 友だちと 山へ キャンプに 行きました。テントを 立てるのは はじめてで、少し 難しかったですが、友だちが 手伝って くれたので、なんとか できました。夜は みんなで 火を 囲んで、料理を 作りました。星が とても きれいで、感動しました。次の日の 朝は 少し 寒かったですが、鳥の 声で 気持ちよく 目が覚めました。キャンプは 大変な ことも ありましたが、自然の 中で 過ごす 時間は とても 楽しかったです。また 機会が あれば、行きたいと 思います。",
          items: [
            { question: "テントを 立てるのは どうでしたか。", options: ["はじめてで、少し 難しかった。", "かんたんだった。", "友だちが 全部した。", "できなかった。"], explain: "「テントを 立てるのは はじめてで、少し 難しかった」とある。" },
            { question: "キャンプの 夜は 何を して 過ごしましたか。", options: ["火を 囲んで 料理を 作った。", "すぐ 寝た。", "山を 下りた。", "本を 読んだ。"], explain: "「夜は みんなで 火を 囲んで、料理を 作りました」とある。" },
            { question: "この人は キャンプを どう 思いましたか。", options: ["自然の 中で 過ごす 時間が 楽しかった。", "二度と 行きたくない。", "つまらなかった。", "寒くて 大変だっただけだった。"], explain: "「自然の 中で 過ごす 時間は とても 楽しかった」とある。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの お知らせを 見て、質問に 答えて ください。",
          passage: "【市民 テニス教室】\n・日にち：毎週 水曜日\n・時間：午後6時〜7時30分\n・場所：市民 テニスコート\n・対象：初めての 方でも 大丈夫です。\n・持ち物：ラケット（貸出も あります）、運動できる 服\n・料金：一回 800円\n・申し込み：当日 会場で 受け付けます。",
          items: [
            { question: "テニス教室は いつ ありますか。", options: ["毎週水曜日", "毎週日曜日", "毎月一回", "毎週土曜日"], explain: "「日にち：毎週 水曜日」とある。" },
            { question: "ラケットを 持って いない人は どうしますか。", options: ["会場で 借りる ことが できる。", "教室に 参加できない。", "自分で 買わなければ ならない。", "友だちに 借りる。"], explain: "「ラケット（貸出も あります）」とある。" },
            { question: "申し込みは いつ しますか。", options: ["当日、会場でする。", "前の日までにする。", "1週間前までにする。", "電話でする。"], explain: "「申し込み：当日 会場で 受け付けます」とある。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 G（本番形式）— 学校・毎日の 生活
 *  Exact official N4 item count (57). Original items.
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setG",
  label: "模試 G（本番形式）",
  durationMin: 80,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "明日の 朝 七時に 出発します。", target: "出発", options: ["しゅっぱつ", "しゅうぱつ", "しゅっはつ", "しゅうはつ"], explain: "出発 = しゅっぱつ (berangkat)。Perhatikan っ dan ぱ。" },
            { sentence: "この 問題は 少し 難しいです。", target: "問題", options: ["もんだい", "もんたい", "もうだい", "もんでい"], explain: "問題 = もんだい (soal/masalah)。" },
            { sentence: "教室の 窓を 開けて ください。", target: "教室", options: ["きょうしつ", "きょしつ", "きょうしち", "きょうじつ"], explain: "教室 = きょうしつ (ruang kelas)。Vokal panjang きょう。" },
            { sentence: "弟は 野菜が 嫌いです。", target: "野菜", options: ["やさい", "やざい", "のさい", "やせい"], explain: "野菜 = やさい (sayuran)。" },
            { sentence: "母は 台所で 料理を して います。", target: "台所", options: ["だいどころ", "たいどころ", "だいところ", "だいじょ"], explain: "台所 = だいどころ (dapur)。" },
            { sentence: "毎朝 八時に 家を 出ます。", target: "毎朝", options: ["まいあさ", "まいちょう", "まいにち", "めいあさ"], explain: "毎朝 = まいあさ (setiap pagi)。まいにち = 毎日。" },
            { sentence: "夏休みに 海で 泳ぎました。", target: "泳ぎました", options: ["およぎました", "あそぎました", "おおぎました", "およきました"], explain: "泳ぐ = およぐ (berenang)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "えきの まえで ともだちを まって います。", target: "まって", options: ["待って", "持って", "特って", "侍って"], explain: "まつ = 待つ (menunggu)。持つ = もつ (membawa)。" },
            { sentence: "この ペンは わたしのと いろが ちがいます。", target: "ちがいます", options: ["違います", "遠います", "連います", "達います"], explain: "ちがう = 違う (berbeda)。遠い = とおい (jauh)。" },
            { sentence: "ゆうがた、いぬと さんぽを します。", target: "ゆうがた", options: ["夕方", "夕万", "名方", "多方"], explain: "ゆうがた = 夕方 (sore hari)。" },
            { sentence: "きょうしつで しゅくだいを だしました。", target: "しゅくだい", options: ["宿題", "宿第", "宿顔", "泊題"], explain: "しゅくだい = 宿題 (PR)。" },
            { sentence: "けさは 五時に おきました。", target: "おきました", options: ["起きました", "記きました", "超きました", "走きました"], explain: "おきる = 起きる (bangun)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "テストの 前に、ノートを よく （　）して おきました。", options: ["ふくしゅう", "よしゅう", "しつもん", "しゅっせき"], explain: "復習 (ふくしゅう) = mengulang pelajaran sebelum tes。予習 = belajar sebelum kelas。" },
            { sentence: "かぜを ひいたので、学校を （　）。", options: ["休みました", "始めました", "閉めました", "忘れました"], explain: "学校を 休む = tidak masuk sekolah。" },
            { sentence: "先生の 話が よく 聞こえなかったので、もう 一度 （　）。", options: ["聞きました", "答えました", "教えました", "話しました"], explain: "Tidak terdengar → bertanya lagi (もう一度 聞く)。" },
            { sentence: "この 本は 字が （　）、読みにくいです。", options: ["小さくて", "大きくて", "明るくて", "やさしくて"], explain: "字が 小さい → 読みにくい (sulit dibaca)。" },
            { sentence: "雨で 体育の 授業は （　）に なりました。", options: ["中止", "中心", "注意", "予定"], explain: "中止に なる = dibatalkan。" },
            { sentence: "家から 学校までは あまり （　）ので、毎日 歩いて 行きます。", options: ["遠くない", "近くない", "広くない", "高くない"], explain: "遠くない (tidak jauh) → jalan kaki。" },
            { sentence: "名前を 呼ばれたら、大きい 声で 「はい」と （　）ください。", options: ["返事して", "質問して", "説明して", "相談して"], explain: "返事する = menjawab panggilan (「はい」)。" },
            { sentence: "毎日 練習したので、漢字を 書くのが （　）なりました。", options: ["上手に", "下手に", "大切に", "大変に"], explain: "練習した → 上手に なった (jadi pandai)。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "けさ、学校に ちこくしました。", options: ["けさ、じゅぎょうに おくれました。", "けさ、じゅぎょうを 休みました。", "けさ、はやく 学校に つきました。", "けさ、学校で ねて いました。"], explain: "ちこくする = terlambat = おくれる。" },
            { sentence: "この しゅくだいは かんたんです。", options: ["この しゅくだいは やさしいです。", "この しゅくだいは むずかしいです。", "この しゅくだいは おおいです。", "この しゅくだいは ながいです。"], explain: "かんたん = mudah = やさしい。" },
            { sentence: "あには りょうりが とくいです。", options: ["あには りょうりが じょうずです。", "あには りょうりが すきでは ありません。", "あには りょうりを した ことが ありません。", "あには りょうりが へたです。"], explain: "とくい = mahir = じょうず。" },
            { sentence: "先生に テストの ことを たずねました。", options: ["先生に テストの ことを しつもんしました。", "先生に テストの ことを おしえました。", "先生から テストの ことを ききました。", "先生に テストを わたしました。"], explain: "たずねる = bertanya = しつもんする。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "かたづける（片付ける）", options: ["あそんだ あとで、おもちゃを 片付けました。", "電話を 片付けて、友だちと 話しました。", "かぜが 片付けて、元気に なりました。", "ねむいので、目を 片付けました。"], explain: "片付ける = merapikan/membereskan barang。" },
            { word: "まにあう（間に合う）", options: ["走ったので、電車に 間に合いました。", "この くつは わたしの 足に 間に合います。", "友だちと 駅で 間に合いました。", "この 料理は 塩が 間に合います。"], explain: "間に合う = sempat/tidak terlambat。" },
            { word: "よしゅう（予習）", options: ["あしたの じゅぎょうの 予習を しました。", "予習が ふって、かさを さしました。", "ご飯の 予習を 食べました。", "けがの 予習を して、病院へ 行きました。"], explain: "予習 = belajar materi sebelum pelajaran。" },
            { word: "ねっしん（熱心）", options: ["田中さんは 熱心に 日本語を 勉強して います。", "この スープは 熱心なので、気を つけて ください。", "今日は 熱心な 天気です。", "熱心が あるので、薬を 飲みました。"], explain: "熱心 = tekun/bersemangat (orang)。Sup panas = 熱い。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "校長先生は もう 教室に ＿＿。", options: ["いらっしゃいました", "まいりました", "おりました", "うかがいました"], explain: "Bentuk hormat (尊敬語) untuk 来る/いる = いらっしゃる。まいる/おる/うかがう = bentuk merendah (謙譲語)。" },
            { sentence: "宿題を 忘れて、先生に ＿＿。", options: ["しかられました", "しかりました", "しからせました", "しかって いました"], explain: "先生に しかられる = dimarahi guru (pasif)。" },
            { sentence: "母は わたしに 毎日 ピアノを 練習＿＿。", options: ["させます", "されます", "できます", "させられます"], explain: "母は わたしに 〜させる = ibu menyuruh saya (kausatif)。" },
            { sentence: "空が 暗く なって きました。雨が 降り＿＿です。", options: ["そう", "よう", "らしい", "みたい"], explain: "Bentuk ます (降り) + そうだ = kelihatannya akan hujan。よう/らしい/みたい tidak bisa setelah 降り。" },
            { sentence: "ニュースに よると、明日は 雪が 降る＿＿です。", options: ["そう", "つもり", "ばかり", "ため"], explain: "〜に よると、〜そうです = katanya (kabar dari orang lain)。" },
            { sentence: "安けれ＿＿、買いたいです。", options: ["ば", "たら", "なら", "と"], explain: "安い → 安ければ (kalau murah)。" },
            { sentence: "日本へ 行く＿＿、京都に 行った ほうが いいですよ。", options: ["なら", "ば", "たら", "と"], explain: "〜なら = kalau (memang) mau ke Jepang, beri saran。" },
            { sentence: "友だちが わたしに 本を 貸して ＿＿。", options: ["くれました", "あげました", "もらいました", "やりました"], explain: "友だちが わたしに 〜て くれる = teman melakukan untuk saya。もらう perlu 友だちに。" },
            { sentence: "先生に 作文を 直して ＿＿。", options: ["いただきました", "くださいました", "さしあげました", "くれました"], explain: "先生に 〜て いただく = saya mendapat bantuan guru (sopan)。くださる perlu 先生が。" },
            { sentence: "日本に 来てから、なっとうが 食べられる＿＿ なりました。", options: ["ように", "ことに", "ために", "そうに"], explain: "〜ように なる = menjadi bisa (perubahan kemampuan)。" },
            { sentence: "来月から 大阪の 学校に 通う＿＿ なりました。", options: ["ことに", "ように", "ために", "そうに"], explain: "〜ことに なる = sudah diputuskan (oleh keadaan/orang lain)。" },
            { sentence: "田中さんは 今日 休みだから、教室に いない＿＿です。", options: ["はず", "つもり", "ところ", "ばかり"], explain: "〜はずだ = seharusnya (kesimpulan dari alasan)。" },
            { sentence: "パーティーに 行く＿＿どうか、まだ 決めて いません。", options: ["か", "の", "と", "が"], explain: "〜か どうか = apakah ... atau tidak。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "先生に", chunks: ["作文を", "直して", "いただいて", "とても"], starIndex: 2, suffix: "うれしかったです。", translation: "Saya sangat senang karena guru memperbaiki karangan saya.", explain: "正しい文: 先生に 作文を 直して いただいて とても うれしかったです。★ = いただいて。" },
            { prefix: "雨が", chunks: ["降りそう", "です", "から", "かさを"], starIndex: 2, suffix: "持って 行きましょう。", translation: "Sepertinya akan hujan, jadi mari bawa payung.", explain: "正しい文: 雨が 降りそう です から かさを 持って 行きましょう。★ = から。" },
            { prefix: "わたしは", chunks: ["毎晩", "ねる", "前に", "日記を"], starIndex: 2, suffix: "書く ことに して います。", translation: "Saya membiasakan menulis buku harian setiap malam sebelum tidur.", explain: "正しい文: わたしは 毎晩 ねる 前に 日記を 書く ことに して います。★ = 前に。" },
            { prefix: "テストに", chunks: ["合格", "できる", "ように", "毎日"], starIndex: 2, suffix: "勉強して います。", translation: "Saya belajar setiap hari supaya bisa lulus ujian.", explain: "正しい文: テストに 合格 できる ように 毎日 勉強して います。★ = ように。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "わたしの 学校には 大きい 図書館が あります。わたしは 毎週 金曜日に 図書館へ 行って、本を 二さつ（１）。先週は 日本の むかし話の 本を 読みました。むずかしい ことばが あって、少し 時間が かかりました（２）、とても おもしろかったです。図書館の 人に 「おもしろい 本は ありますか。」と 聞くと、いつも しんせつに 教えて（３）。これからも たくさん 本を 読む（４）したいです。",
          items: [
            { label: "（１）", options: ["借ります", "貸します", "あげます", "くれます"], explain: "図書館で 本を 借りる = meminjam buku。" },
            { label: "（２）", options: ["が", "ので", "から", "と"], explain: "〜が = tetapi (lama, tetapi menarik)。" },
            { label: "（３）", options: ["くれます", "あげます", "やります", "さしあげます"], explain: "Petugas perpustakaan melakukan untuk saya → 教えて くれます。" },
            { label: "（４）", options: ["ように", "ことが", "ために", "ところを"], explain: "〜ように する = berusaha membiasakan。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メモを 読んで、質問に 答えて ください。",
          passage: "リンさんへ\n\n田中先生から 電話が ありました。あしたの 漢字の テストは、来週の 月曜日に なったそうです。それから、テストの 前に 教科書の 30ページから 45ページまで 読んで おいて ください、と 言って いました。\n\n3月10日　午後4時　山下",
          items: [
            { question: "リンさんは テストの 前に 何を しなければ なりませんか。", options: ["教科書の 30ページから 45ページまで 読む。", "田中先生に 電話を する。", "あした 漢字の テストを 受ける。", "山下さんに 教科書を 返す。"], explain: "「テストの 前に 教科書の 30ページから 45ページまで 読んで おいて ください」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの メールを 読んで、質問に 答えて ください。",
          passage: "クラスの みなさん\n\n土曜日の バーベキューですが、天気予報で 雨が 降ると 言って いるので、日曜日に 変えます。時間と 場所は 同じです。飲み物は こちらで 用意します。食べたい ものが ある 人は、自分で 持って 来て ください。\n\nキム",
          items: [
            { question: "この メールで いちばん 言いたい ことは 何ですか。", options: ["バーベキューの 日が 日曜日に なった こと", "バーベキューの 場所が 変わった こと", "飲み物を 持って 来て ほしい こと", "雨なので バーベキューを やめる こと"], explain: "「日曜日に 変えます。時間と 場所は 同じです」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文③",
          instruction: "つぎの お知らせを 読んで、質問に 答えて ください。",
          passage: "【図書館からの お知らせ】\n図書館の 本は 2週間 借りる ことが できます。返す 日を 過ぎた 人は、本を 返すまで 新しい 本を 借りる ことが できません。図書館が 閉まって いる ときは、入口の 横の ポストに 本を 入れて ください。",
          items: [
            { question: "図書館が 閉まって いる 日に 本を 返したい 人は どう しますか。", options: ["入口の 横の ポストに 本を 入れる。", "次の 日まで 待って、受付で 返す。", "図書館の 人に 電話を する。", "2週間 あとで 返す。"], explain: "「閉まって いる ときは、入口の 横の ポストに 本を 入れて ください」とある。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "わたしの 日本の 生活　　グエン・ミン\n\nわたしは 去年の 四月に ベトナムから 日本へ 来ました。今は 日本語学校で 勉強して います。\n日本へ 来た ばかりの ころは、毎日 たいへんでした。いちばん 困ったのは ごみの 出し方です。日本では、ごみを 燃える ごみと 燃えない ごみに 分けて、決められた 日に 出さなければ なりません。わたしは それを 知らなかったので、となりの おばあさんに 注意されて しまいました。とても はずかしかったです。\nでも、その おばあさんは、次の 日 ごみの 出し方を 書いた 紙を 持って 来て、ていねいに 説明して くれました。それから、わたしたちは 会うと いつも 話を する ように なりました。おばあさんは ときどき 料理も 作って くれます。\n今では、ごみの 出し方も 日本語も 少し わかるように なりました。困った ときに 助けて くれる 人が いるのは、本当に うれしい ことだと 思います。",
          items: [
            { question: "グエンさんは どうして おばあさんに 注意されましたか。", options: ["ごみの 出し方を 知らなかったから", "ごみを 出すのを 忘れたから", "となりの 家の 前に ごみを 置いたから", "おばあさんと 話さなかったから"], explain: "「それを 知らなかったので、…注意されて しまいました」とある。" },
            { question: "注意された とき、グエンさんは どう 思いましたか。", options: ["はずかしいと 思った。", "うれしいと 思った。", "こわいと 思った。", "さびしいと 思った。"], explain: "「とても はずかしかったです」とある。" },
            { question: "この 文章で グエンさんが いちばん 言いたい ことは 何ですか。", options: ["困った ときに 助けて くれる 人が いて うれしい。", "日本の ごみの 出し方は とても むずかしい。", "日本語学校の 勉強は たいへんだ。", "おばあさんの 料理は おいしい。"], explain: "Kalimat terakhir adalah inti: 「助けて くれる 人が いるのは、本当に うれしい」。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの お知らせを 見て、質問に 答えて ください。",
          passage: "【さくら市 子ども 水泳教室（7月）】\n\nA　はじめての 人 ｜ 月・水 ｜ 午前10時〜11時 ｜ 4回 4,000円\nB　25m 泳げる 人 ｜ 火・木 ｜ 午後4時〜5時 ｜ 4回 4,000円\nC　50m 泳げる 人 ｜ 土 ｜ 午前9時〜11時 ｜ 4回 6,000円\nD　はじめての 人 ｜ 土 ｜ 午後1時〜2時 ｜ 4回 4,000円\n\n※ 兄弟で いっしょに 申し込むと、2人目は 1,000円 安く なります。\n※ 申し込みは 6月20日までに 市民プールの 受付で。",
          items: [
            { question: "ゆいさん（8さい）は まだ 泳げません。土曜日しか 行けません。どの クラスが いいですか。", options: ["D", "A", "B", "C"], explain: "Belum bisa berenang + hanya Sabtu → D (はじめての 人・土)。" },
            { question: "ゆいさんと 兄（25m 泳げる。火曜日と 木曜日に 行ける）が いっしょに 申し込みます。2人で いくら 払いますか。", options: ["7,000円", "8,000円", "9,000円", "10,000円"], explain: "D 4,000円 + B 4,000円 − 1,000円 (anak kedua) = 7,000円。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 H（本番形式）— 仕事・買い物・旅行
 *  Exact official N4 item count (57). Original items.
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setH",
  label: "模試 H（本番形式）",
  durationMin: 80,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "毎朝 電車で 会社に 通って います。", target: "通って", options: ["かよって", "とおって", "つうって", "かいって"], explain: "会社に 通う = かよう (pergi rutin)。とおる = melewati。" },
            { sentence: "この 店の 品物は とても 安いです。", target: "品物", options: ["しなもの", "ひんもの", "しなぶつ", "ひんぶつ"], explain: "品物 = しなもの (barang)。" },
            { sentence: "ホテルの 受付で かぎを もらいました。", target: "受付", options: ["うけつけ", "うけづけ", "じゅつけ", "うけつき"], explain: "受付 = うけつけ (resepsionis)。" },
            { sentence: "旅館の 料理は とても おいしかったです。", target: "旅館", options: ["りょかん", "りょうかん", "りょがん", "たびかん"], explain: "旅館 = りょかん (penginapan Jepang)。Tanpa vokal panjang。" },
            { sentence: "店員に トイレの 場所を 聞きました。", target: "店員", options: ["てんいん", "てんにん", "みせいん", "てんいい"], explain: "店員 = てんいん (pegawai toko)。" },
            { sentence: "空港に 着く 時間を 調べました。", target: "調べました", options: ["しらべました", "しらへました", "ちょうべました", "しかべました"], explain: "調べる = しらべる (memeriksa/mencari tahu)。" },
            { sentence: "あの 工場では 車を 作って います。", target: "工場", options: ["こうじょう", "こうじょ", "こじょう", "こうしょう"], explain: "工場 = こうじょう (pabrik)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "ちずを 見ながら 歩きました。", target: "ちず", options: ["地図", "池図", "地凶", "他図"], explain: "ちず = 地図 (peta)。" },
            { sentence: "この みせは よる 十時まで あいて います。", target: "あいて", options: ["開いて", "閉いて", "問いて", "間いて"], explain: "あく = 開く (buka)。閉 = しめる (tutup)。" },
            { sentence: "しごとが おわったら、のみに 行きましょう。", target: "おわったら", options: ["終わったら", "給わったら", "絡わったら", "続わったら"], explain: "おわる = 終わる (selesai)。" },
            { sentence: "ひこうきの きっぷを かいました。", target: "きっぷ", options: ["切符", "切府", "功符", "切付"], explain: "きっぷ = 切符 (tiket)。" },
            { sentence: "あには ぎんこうで はたらいて います。", target: "はたらいて", options: ["働いて", "動いて", "勤いて", "慟いて"], explain: "はたらく = 働く (bekerja)。動く = うごく (bergerak)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "旅行の （　）は もう 決まりましたか。", options: ["予定", "予習", "用事", "注意"], explain: "旅行の 予定 = rencana perjalanan。" },
            { sentence: "この シャツは 少し 大きいので、小さい サイズに （　）もらえますか。", options: ["とりかえて", "かえして", "つつんで", "はらって"], explain: "とりかえる = menukar (ukuran)。" },
            { sentence: "電話で レストランを （　）しました。", options: ["予約", "約束", "用意", "案内"], explain: "レストランを 予約する = memesan tempat。" },
            { sentence: "仕事が 忙しくて、昼ご飯を 食べる （　）が ありません。", options: ["ひま", "どうぐ", "ねだん", "きもち"], explain: "ひまが ない = tidak ada waktu luang。" },
            { sentence: "電車が 止まって、会議に （　）しまいました。", options: ["遅れて", "急いで", "間に合って", "着いて"], explain: "Kereta berhenti → 遅れて しまった (terlambat)。" },
            { sentence: "この かばんは （　）が 高くて、買えません。", options: ["ねだん", "おつり", "さいふ", "レジ"], explain: "ねだんが 高い = harganya mahal。" },
            { sentence: "コンビニで 1,000円 はらったら、50円の （　）を もらいました。", options: ["おつり", "ねだん", "ちょきん", "きっぷ"], explain: "おつり = uang kembalian。" },
            { sentence: "ホテルに 着いたら、すぐ 会社に （　）して ください。", options: ["連絡", "案内", "見物", "生産"], explain: "会社に 連絡する = menghubungi kantor。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "この 店は 夜 遅くまで あいて います。", options: ["この 店では 夜 遅くまで 買い物が できます。", "この 店は 夜 早く しまります。", "この 店は 夜は 休みです。", "この 店は 夜 遅く 始まります。"], explain: "遅くまで あいて いる = bisa belanja sampai malam。" },
            { sentence: "社長は もうすぐ いらっしゃいます。", options: ["社長は もうすぐ 来ます。", "社長は もうすぐ 帰ります。", "社長は もうすぐ 寝ます。", "社長は もうすぐ 食べます。"], explain: "いらっしゃる = 来る (bentuk hormat)。" },
            { sentence: "あの 店の 品物は どれも 高いです。", options: ["あの 店の 品物は どれも 安く ありません。", "あの 店の 品物は どれも 安いです。", "あの 店の 品物は どれも 少ないです。", "あの 店の 品物は どれも 古いです。"], explain: "高い = mahal = 安くない。" },
            { sentence: "きのう 京都を 見物しました。", options: ["きのう 京都を 見て 回りました。", "きのう 京都に 住みました。", "きのう 京都で 働きました。", "きのう 京都から 帰りました。"], explain: "見物する = berkeliling melihat-lihat。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "とどける（届ける）", options: ["わすれ物を 交番に 届けました。", "毎朝 6時に 目が 届けます。", "この 料理は 塩を 届けると おいしいです。", "かぜで 熱が 届けました。"], explain: "届ける = mengantarkan/menyerahkan (ke kantor polisi)。" },
            { word: "よてい（予定）", options: ["来週の 予定を 手帳に 書きました。", "この 予定は とても おいしいです。", "予定が ふって、さむいです。", "駅の 予定で 友だちに 会いました。"], explain: "予定 = rencana/jadwal。" },
            { word: "じゅんび（準備）", options: ["出張の 準備を して、早く 寝ました。", "準備が 青くて きれいです。", "準備で 手を 洗いました。", "友だちの 準備が 高いです。"], explain: "準備 = persiapan。" },
            { word: "すく（空く）", options: ["お昼すぎの 電車は すいて います。", "おなかが すいて、もう 食べられません。", "この 店の 料理は すいて おいしいです。", "道が すいて、ころびました。"], explain: "電車が すく = kereta sepi。おなかが すく = lapar (jadi ingin makan, bukan tidak bisa makan)。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "社長は もう お帰りに ＿＿。", options: ["なりました", "しました", "いたしました", "まいりました"], explain: "お＋ます形＋に なる = bentuk hormat (尊敬語)。" },
            { sentence: "では、わたしが 駅まで ご案内＿＿。", options: ["します", "なります", "くださいます", "いらっしゃいます"], explain: "ご＋kata benda＋する = bentuk merendah untuk tindakan sendiri。" },
            { sentence: "どうぞ こちらで 少々 お待ち＿＿。", options: ["ください", "します", "いたします", "まいります"], explain: "お＋ます形＋ください = mohon (permintaan sopan)。" },
            { sentence: "電車の 中で 足を ＿＿、痛かったです。", options: ["ふまれて", "ふんで", "ふませて", "ふませられて"], explain: "足を ふまれる = kaki diinjak (pasif kerugian)。" },
            { sentence: "子どもの とき、母に 毎日 野菜を 食べ＿＿。", options: ["させられました", "させました", "られました", "ました"], explain: "母に 〜させられる = dipaksa ibu (kausatif-pasif)。" },
            { sentence: "部長は 新しい 社員に コピーを ＿＿。", options: ["とらせました", "とられました", "とらされました", "とらせられました"], explain: "部長は 社員に 〜させる = menyuruh (kausatif)。" },
            { sentence: "この かばんは 丈夫＿＿ですね。", options: ["そう", "な", "の", "に"], explain: "丈夫そう = kelihatannya kuat。丈夫なです/丈夫のです salah。" },
            { sentence: "山田さんの 話に よると、あの 店は 来月 閉まる＿＿。", options: ["そうです", "つもりです", "ところです", "ばかりです"], explain: "〜に よると、〜そうです = katanya。" },
            { sentence: "安い ホテル＿＿、駅の 前に ありますよ。", options: ["なら", "ば", "たら", "と"], explain: "Kata benda + なら = kalau soal hotel murah ...。" },
            { sentence: "仕事が 早く 終わっ＿＿、いっしょに 飲みに 行きませんか。", options: ["たら", "ば", "なら", "と"], explain: "終わったら = kalau/setelah selesai。" },
            { sentence: "この ホテルは 駅から 近い＿＿、部屋も きれいだし、とても いいです。", options: ["し", "のに", "ても", "より"], explain: "〜し、〜し = menyebut beberapa alasan。" },
            { sentence: "来週の 出張は、田中さんが 行く＿＿ なりました。", options: ["ことに", "ように", "ために", "ところに"], explain: "〜ことに なる = sudah diputuskan。" },
            { sentence: "お客様が わたしに おみやげを ＿＿。", options: ["くださいました", "さしあげました", "いただきました", "まいりました"], explain: "お客様が わたしに くださる = tamu memberi saya (hormat)。いただく perlu お客様に。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "この 書類は", chunks: ["あしたの", "会議", "までに", "コピーして"], starIndex: 2, suffix: "おいて ください。", translation: "Tolong fotokopi dokumen ini sebelum rapat besok.", explain: "正しい文: この 書類は あしたの 会議 までに コピーして おいて ください。★ = までに。" },
            { prefix: "駅の 前に", chunks: ["新しく", "できた", "店で", "おみやげを"], starIndex: 2, suffix: "買いました。", translation: "Saya membeli oleh-oleh di toko yang baru dibuka di depan stasiun.", explain: "正しい文: 駅の 前に 新しく できた 店で おみやげを 買いました。★ = 店で。" },
            { prefix: "部長に", chunks: ["この", "書類を", "見て", "いただきたい"], starIndex: 2, suffix: "のですが。", translation: "Saya ingin Bapak manajer melihat dokumen ini.", explain: "正しい文: 部長に この 書類を 見て いただきたい のですが。★ = 見て。" },
            { prefix: "旅行の", chunks: ["写真を", "友だちに", "見せて", "あげました"], starIndex: 2, suffix: "。", translation: "Saya memperlihatkan foto perjalanan kepada teman.", explain: "正しい文: 旅行の 写真を 友だちに 見せて あげました。★ = 見せて。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "先週、会社の 人たちと 北海道へ 旅行に 行きました。飛行機で 1時間半（１）、北海道に 着きました。ホテルに 荷物を 置いてから、町を 見物しました。夜は 有名な 店で 魚料理を 食べました。とても おいしかった（２）、ねだんは あまり 高く ありませんでした。次の 日は 雪が たくさん 降って いました。わたしは 雪を 見るのが はじめてだったので、とても（３）。今度は 家族とも（４）と 思います。",
          items: [
            { label: "（１）", options: ["かかって", "かけて", "とって", "いって"], explain: "時間が かかる = memakan waktu。" },
            { label: "（２）", options: ["のに", "ので", "から", "ば"], explain: "〜のに = padahal enak, harganya tidak mahal (kontras)。" },
            { label: "（３）", options: ["うれしかったです", "さびしかったです", "つまらなかったです", "いそがしかったです"], explain: "Pertama kali melihat salju → senang。" },
            { label: "（４）", options: ["来よう", "来た", "来ない", "来られた"], explain: "Bentuk ajakan/niat (意向形) + と 思う = berniat。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メモを 読んで、質問に 答えて ください。",
          passage: "林さん\n\n12時ごろ、ABC会社の 森さんから 電話が ありました。あしたの 会議の 時間を 2時から 3時に 変えたいそうです。林さんの 都合を 聞きたいので、今日の 5時までに 森さんに 電話して ください。\n\n中川",
          items: [
            { question: "林さんは 何を しなければ なりませんか。", options: ["今日の 5時までに 森さんに 電話する。", "あしたの 2時に 森さんの 会社へ 行く。", "中川さんに 都合を 聞く。", "あしたの 3時に 森さんに 電話する。"], explain: "「今日の 5時までに 森さんに 電話して ください」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの お知らせを 読んで、質問に 答えて ください。",
          passage: "【お知らせ】\n店の 工事の ため、11月20日（月）から 22日（水）まで 休みます。23日（木）からは いつもどおり 朝10時から 開けます。休みの 間は、駅前の 2号店を ご利用 ください。\nスーパーみどり",
          items: [
            { question: "11月21日に 買い物を したい 人は どう しますか。", options: ["駅前の 2号店へ 行く。", "朝10時に この 店へ 行く。", "23日まで 買い物が できない。", "店に 電話で 注文する。"], explain: "21日 = hari libur toko → 「駅前の 2号店を ご利用 ください」。" }
          ]
        },
        {
          type: "reading",
          title: "短文③",
          instruction: "つぎの メールを 読んで、質問に 答えて ください。",
          passage: "山本さん\n\n来週の 大阪出張の ホテルですが、駅の 近くの ホテルは もう 部屋が ありませんでした。駅から バスで 10分の ホテルなら 予約できますが、それで いいですか。いいなら、あしたまでに 返事を ください。わたしが 予約して おきます。\n\n田村",
          items: [
            { question: "山本さんは 何を しますか。", options: ["バスで 10分の ホテルで いいか どうか、田村さんに 返事を する。", "駅の 近くの ホテルを 予約する。", "大阪の ホテルに 電話を する。", "バスの 時間を 調べる。"], explain: "「それで いいですか。…あしたまでに 返事を ください」。Yang memesan adalah 田村さん。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "日本の 会社で 働いて　　アナ・シルバ\n\nわたしは ブラジルから 来て、東京の 会社で 働いて 2年に なります。\n働き始めた ころ、びっくりした ことが あります。会議が 始まる 5分前に 会議室へ 行くと、ほかの 人は もう みんな すわって いたのです。ブラジルでは、会議に 少し 遅れても あまり 問題に なりません。だから、わたしは 時間どおりに 行けば いいと 思って いました。\n会議の あとで、となりの 席の 佐藤さんに その ことを 話すと、佐藤さんは 「日本では、時間より 少し 早く 行って、準備を して おく 人が 多いんですよ。」と 教えて くれました。それから、わたしも 10分前には 会議室に 行く ように して います。\nはじめは 大変だと 思いましたが、早く 行くと、ほかの 人と 話したり、書類を 読んだり する 時間が できます。今では、これは いい 習慣だと 思って います。",
          items: [
            { question: "アナさんは どうして びっくりしましたか。", options: ["5分前に 行ったのに、ほかの 人が もう すわって いたから", "会議に 遅れて、佐藤さんに 注意されたから", "会議室に だれも いなかったから", "会議が 時間どおりに 始まらなかったから"], explain: "「5分前に 会議室へ 行くと、ほかの 人は もう みんな すわって いた」とある。" },
            { question: "今 アナさんは 会議の 前に どう して いますか。", options: ["10分前には 会議室に 行く。", "時間ちょうどに 会議室に 行く。", "5分前に 会議室に 行く。", "佐藤さんと いっしょに 行く。"], explain: "「10分前には 会議室に 行く ように して います」とある。" },
            { question: "アナさんは 早く 行く ことに ついて、今 どう 思って いますか。", options: ["いい 習慣だと 思って いる。", "大変なので やめたいと 思って いる。", "ブラジルの やり方の ほうが いいと 思って いる。", "意味が ないと 思って いる。"], explain: "「今では、これは いい 習慣だと 思って います」とある。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの お知らせを 見て、質問に 答えて ください。",
          passage: "【みどり観光バス 日帰り旅行】\n\n①　富士山と 湖コース ｜ 毎週 土・日 ｜ 大人 8,000円 ｜ 子ども 4,000円\n②　温泉と 昼ご飯コース ｜ 毎週 水・土 ｜ 大人 9,500円 ｜ 子ども 5,000円\n③　いちごがりコース ｜ 毎週 日 ｜ 大人 6,000円 ｜ 子ども 3,000円\n④　町の 見物コース ｜ 毎日 ｜ 大人 5,000円 ｜ 子ども 2,500円\n\n※ 子どもは 12さいまでです。\n※ どの コースも 朝8時に 東京駅を 出発します。\n※ 申し込みは 出発日の 3日前までです。",
          items: [
            { question: "林さんは 水曜日が 休みです。昼ご飯が ついて いる コースに 行きたいです。どの コースが いいですか。", options: ["②", "①", "③", "④"], explain: "Rabu + ada makan siang → ② (水・土)。" },
            { question: "大人 2人と 子ども（8さい）1人で、日曜日に ③の コースに 行きます。全部で いくら ですか。", options: ["15,000円", "12,000円", "18,000円", "9,000円"], explain: "6,000円 × 2 + 3,000円 = 15,000円。" }
          ]
        }
      ]
    }
  ]
},

/* ══════════════════════════════════════════════════════════════════════════
 *  模試 I（本番形式）— 町・けんこう・しゅみ
 *  Exact official N4 item count (57). Original items.
 * ════════════════════════════════════════════════════════════════════════ */
{
  id: "setI",
  label: "模試 I（本番形式）",
  durationMin: 80,
  sections: [
    {
      key: "moji-goi",
      name: "言語知識（文字・語彙）",
      mondai: [
        {
          type: "kanji-reading",
          instruction: "＿＿の ことばは ひらがなで どう かきますか。",
          items: [
            { sentence: "病院で 薬を もらいました。", target: "病院", options: ["びょういん", "びよういん", "びょうい", "ひょういん"], explain: "病院 = びょういん (rumah sakit)。びよういん = 美容院 (salon)。" },
            { sentence: "近所の 人に あいさつを します。", target: "近所", options: ["きんじょ", "きんしょ", "ちかじょ", "きんじょう"], explain: "近所 = きんじょ (tetangga/sekitar)。" },
            { sentence: "毎晩 十時に 寝ます。", target: "毎晩", options: ["まいばん", "まいはん", "まいよる", "めいばん"], explain: "毎晩 = まいばん (setiap malam)。" },
            { sentence: "熱が あるので、学校を 休みます。", target: "熱", options: ["ねつ", "あつ", "ねっ", "ねち"], explain: "熱 = ねつ (demam)。" },
            { sentence: "わたしの 趣味は 写真です。", target: "写真", options: ["しゃしん", "しゃじん", "しゃっしん", "さしん"], explain: "写真 = しゃしん (foto)。" },
            { sentence: "この 町は 夜も にぎやかです。", target: "町", options: ["まち", "ちょう", "むら", "まつ"], explain: "町 (berdiri sendiri) = まち (kota)。" },
            { sentence: "先生の 説明は わかりやすいです。", target: "説明", options: ["せつめい", "せいめい", "せつめ", "せっめい"], explain: "説明 = せつめい (penjelasan)。" }
          ]
        },
        {
          type: "orthography",
          instruction: "＿＿の ことばは かんじで どう かきますか。",
          items: [
            { sentence: "まいにち くすりを のんで います。", target: "くすり", options: ["薬", "楽", "菜", "葉"], explain: "くすり = 薬 (obat)。楽 = たのしい。" },
            { sentence: "きょうは からだの ぐあいが わるいです。", target: "からだ", options: ["体", "休", "本", "木"], explain: "からだ = 体 (badan)。休 = やすむ。" },
            { sentence: "しゅみは えを かく ことです。", target: "え", options: ["絵", "会", "給", "続"], explain: "え = 絵 (gambar)。" },
            { sentence: "あの みせの パンは ゆうめいです。", target: "ゆうめい", options: ["有名", "右名", "有各", "友名"], explain: "ゆうめい = 有名 (terkenal)。" },
            { sentence: "おとうとは うたが じょうずです。", target: "うた", options: ["歌", "飲", "次", "吹"], explain: "うた = 歌 (lagu)。" }
          ]
        },
        {
          type: "context-vocab",
          instruction: "（　）に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "かぜが （　）まで、むりを しないで ください。", options: ["なおる", "こわれる", "やめる", "かわく"], explain: "かぜが 治る = sembuh dari flu。" },
            { sentence: "食べすぎて、おなかが （　）なりました。", options: ["いたく", "ほそく", "ひろく", "あおく"], explain: "おなかが いたい = sakit perut。" },
            { sentence: "ごみは 決められた 日に （　）ください。", options: ["出して", "入れて", "とって", "ひろって"], explain: "ごみを 出す = membuang sampah (meletakkan di tempat pengumpulan)。" },
            { sentence: "近所の 公園で （　）が あって、たくさんの 人が 集まりました。", options: ["お祭り", "お見舞い", "お礼", "お土産"], explain: "お祭り = festival (banyak orang berkumpul)。" },
            { sentence: "友だちが 入院したので、（　）に 行きました。", options: ["お見舞い", "お祭り", "お祝い", "お礼"], explain: "お見舞い = menjenguk orang sakit。" },
            { sentence: "週末は たいてい 家で ギターを （　）います。", options: ["ひいて", "ふいて", "うって", "なげて"], explain: "ギターを 弾く = memainkan gitar。笛を 吹く = meniup seruling。" },
            { sentence: "けがを しないように、（　）を してから 走りましょう。", options: ["準備運動", "予約", "見物", "返事"], explain: "準備運動 = pemanasan sebelum olahraga。" },
            { sentence: "この 町は 夜も 明るくて、（　）です。", options: ["安全", "危険", "心配", "残念"], explain: "明るい → 安全 (aman)。" }
          ]
        },
        {
          type: "paraphrase",
          instruction: "＿＿の 文と だいたい 同じ いみの 文を えらんで ください。",
          items: [
            { sentence: "この へんは しずかです。", options: ["この へんは うるさく ありません。", "この へんは にぎやかです。", "この へんは あぶないです。", "この へんは べんりです。"], explain: "しずか = tenang = うるさくない。" },
            { sentence: "父は たばこを やめました。", options: ["父は もう たばこを すいません。", "父は たばこを すいはじめました。", "父は たばこを たくさん すいます。", "父は たばこを 買いました。"], explain: "やめる = berhenti → もう すわない。" },
            { sentence: "きのう、いしゃに みて もらいました。", options: ["きのう、びょういんへ 行きました。", "きのう、いしゃに なりました。", "きのう、いしゃを 手伝いました。", "きのう、びょういんで はたらきました。"], explain: "いしゃに みて もらう = diperiksa dokter → pergi ke rumah sakit。" },
            { sentence: "わたしの しゅみは つりです。", options: ["わたしは 魚を つるのが 好きです。", "わたしは 魚を 食べるのが 好きです。", "わたしは 魚を 売る 仕事を して います。", "わたしは 魚が きらいです。"], explain: "つり = memancing → 魚を つる。" }
          ]
        },
        {
          type: "usage",
          instruction: "つぎの ことばの 使い方が いちばん いい 文を えらんで ください。",
          items: [
            { word: "ぐあい（具合）", options: ["きのうから 体の 具合が よく ありません。", "この 本は 具合が 多くて、読みにくいです。", "具合を して、手を 洗いました。", "駅までの 具合を 教えて ください。"], explain: "体の 具合 = kondisi badan。" },
            { word: "あつまる（集まる）", options: ["駅の 前に 人が たくさん 集まって います。", "この 料理は とても 集まって います。", "かぜが 集まって、熱が 出ました。", "わたしは 毎朝 6時に 集まります。"], explain: "集まる = berkumpul (banyak orang/benda)。" },
            { word: "ちゅうい（注意）", options: ["道を わたる ときは、車に 注意して ください。", "注意が おいしくて、たくさん 食べました。", "あしたは 注意なので、学校が 休みです。", "注意を 洗って、たなに 入れました。"], explain: "〜に 注意する = berhati-hati terhadap ...。" },
            { word: "ひどい", options: ["きのうの 雨は ひどかったです。", "この ケーキは ひどくて おいしいです。", "ひどい 友だちと 楽しく 遊びました。", "先生は ひどく しんせつです。"], explain: "ひどい = parah/buruk sekali (hujan lebat)。" }
          ]
        }
      ]
    },
    {
      key: "bunpou",
      name: "言語知識（文法）",
      mondai: [
        {
          type: "grammar-form",
          instruction: "＿＿に 何を 入れますか。いちばん いい ものを えらんで ください。",
          items: [
            { sentence: "先生の お宅で 晩ご飯を ごちそうに ＿＿。", options: ["なりました", "しました", "されました", "させました"], explain: "ごちそうに なる = ditraktir/dijamu。" },
            { sentence: "わたしは 毎朝 犬に 起こ＿＿。", options: ["されます", "させます", "します", "せます"], explain: "犬に 起こされる = dibangunkan oleh anjing (pasif)。" },
            { sentence: "医者に お酒を やめる＿＿ 言われました。", options: ["ように", "ために", "ことが", "のに"], explain: "〜ように 言われる = disuruh/dinasihati untuk ...。" },
            { sentence: "健康の ために、毎日 30分 歩く＿＿ して います。", options: ["ように", "ために", "から", "ながら"], explain: "〜ように する = berusaha membiasakan。" },
            { sentence: "熱が 高いなら、病院へ 行った＿＿ いいですよ。", options: ["ほうが", "ことが", "ものが", "ところが"], explain: "〜た ほうが いい = sebaiknya (saran)。" },
            { sentence: "この 薬を 飲む＿＿、眠く なります。", options: ["と", "のに", "まで", "ながら"], explain: "〜と = setiap kali/kalau ..., pasti (akibat alami)。" },
            { sentence: "となりの 部屋から 音が 聞こえます。だれか いる＿＿です。", options: ["よう", "つもり", "ところ", "ばかり"], explain: "〜ようだ = tampaknya (dugaan dari yang didengar/dilihat)。" },
            { sentence: "妹は ケーキを 見て、うれし＿＿ 笑いました。", options: ["そうに", "ように", "らしく", "みたいに"], explain: "うれしそうに = dengan wajah senang。Akar kata sifat + そう。" },
            { sentence: "雨が 降っ＿＿、サッカーの 試合は あります。", options: ["ても", "たら", "て", "たり"], explain: "〜ても = meskipun hujan, pertandingan tetap ada。" },
            { sentence: "わたしは 友だちに 誕生日の プレゼントを ＿＿。", options: ["あげました", "くれました", "くださいました", "もらわれました"], explain: "わたしは 友だちに あげる = saya memberi teman。くれる dipakai bila orang lain memberi saya。" },
            { sentence: "大切な かさを 電車に 忘れて ＿＿。", options: ["しまいました", "おきました", "みました", "ありました"], explain: "〜て しまう = tanpa sengaja (menyesal)。" },
            { sentence: "今 ちょうど 家を 出る＿＿です。", options: ["ところ", "ばかり", "ほう", "まま"], explain: "辞書形 + ところ = baru akan (tepat sekarang)。" },
            { sentence: "この 公園で ボール遊びを しても いい＿＿どうか、市に 聞いて みます。", options: ["か", "と", "が", "を"], explain: "〜か どうか = apakah ... atau tidak。" }
          ]
        },
        {
          type: "sentence-order",
          instruction: "★に 入る ものは どれですか。ただしい 文を つくって、★の ことばを えらんで ください。",
          items: [
            { prefix: "医者に", chunks: ["あまり", "お酒を", "飲まない", "ように"], starIndex: 2, suffix: "言われました。", translation: "Saya dinasihati dokter supaya tidak terlalu banyak minum alkohol.", explain: "正しい文: 医者に あまり お酒を 飲まない ように 言われました。★ = 飲まない。" },
            { prefix: "この", chunks: ["公園は", "夜に", "なると", "とても"], starIndex: 2, suffix: "静かです。", translation: "Taman ini menjadi sangat sepi kalau sudah malam.", explain: "正しい文: この 公園は 夜に なると とても 静かです。★ = なると。" },
            { prefix: "週末は", chunks: ["友だちと", "テニスを", "したり", "映画を"], starIndex: 2, suffix: "見たり します。", translation: "Akhir pekan saya bermain tenis dengan teman, menonton film, dan lain-lain.", explain: "正しい文: 週末は 友だちと テニスを したり 映画を 見たり します。★ = したり。" },
            { prefix: "かぜを", chunks: ["ひいた", "ときは", "あたたかく", "して"], starIndex: 2, suffix: "寝て ください。", translation: "Kalau masuk angin, tidurlah dengan badan yang hangat.", explain: "正しい文: かぜを ひいた ときは あたたかく して 寝て ください。★ = あたたかく。" }
          ]
        },
        {
          type: "text-grammar",
          instruction: "つぎの 文章を 読んで、（　）に 入る いちばん いい ものを えらんで ください。",
          passage: "わたしの 町では、毎年 夏に みんなで 川の そうじを します。今年は わたしも はじめて 手伝いました。朝 7時に 近所の 人たちが 川の 前に 集まりました。暑かった（１）、みんな 元気に 働いて いました。わたしは 小さい 子どもたちと いっしょに ごみを 拾いました。2時間ぐらいで 川は とても きれいに（２）。そうじの あと、町の 人が 冷たい お茶を（３）。来年も また 手伝い（４）です。",
          items: [
            { label: "（１）", options: ["のに", "ので", "から", "と"], explain: "暑かったのに = padahal panas (tetap semangat)。" },
            { label: "（２）", options: ["なりました", "しました", "させました", "いました"], explain: "川が きれいに なる = sungai menjadi bersih。" },
            { label: "（３）", options: ["くれました", "もらいました", "いただきました", "さしあげました"], explain: "町の 人が (subjek) memberi saya → くれました。" },
            { label: "（４）", options: ["たい", "そう", "よう", "らしい"], explain: "手伝いたい = ingin membantu (keinginan sendiri)。" }
          ]
        }
      ]
    },
    {
      key: "dokkai",
      name: "読解",
      mondai: [
        {
          type: "reading",
          title: "短文①",
          instruction: "つぎの メモを 読んで、質問に 答えて ください。",
          passage: "ゆみへ\n\nお母さんは 今日 おばあちゃんの お見舞いに 行くので、帰りが 遅く なります。晩ご飯は 冷蔵庫に カレーが あるから、あたためて 食べてね。それから、7時ごろ 荷物が 届くので、受け取って おいて ください。\n\n母より",
          items: [
            { question: "ゆみさんは 7時ごろ 何を しなければ なりませんか。", options: ["荷物を 受け取る。", "カレーを 作る。", "おばあちゃんの お見舞いに 行く。", "お母さんに 電話を する。"], explain: "「7時ごろ 荷物が 届くので、受け取って おいて ください」とある。" }
          ]
        },
        {
          type: "reading",
          title: "短文②",
          instruction: "つぎの お知らせを 読んで、質問に 答えて ください。",
          passage: "【ごみの 出し方が 変わります】\n4月から、プラスチックの ごみは 毎週 水曜日に 出して ください。今までは 金曜日でしたが、変わりますので 注意して ください。燃える ごみは 今までと 同じで、月曜日と 木曜日です。\nみどり市",
          items: [
            { question: "4月から、プラスチックの ごみは いつ 出しますか。", options: ["水曜日", "金曜日", "月曜日", "木曜日"], explain: "「4月から、プラスチックの ごみは 毎週 水曜日に」とある。金曜日 = jadwal lama。" }
          ]
        },
        {
          type: "reading",
          title: "短文③",
          instruction: "つぎの メールを 読んで、質問に 答えて ください。",
          passage: "テニスサークルの みなさん\n\n来週の 土曜日の 練習は、コートが 使えない ため、休みです。その かわり、日曜日の 午後2時から 練習を します。日曜日に 来られる 人は、金曜日までに わたしに メールで 知らせて ください。\n\n石田",
          items: [
            { question: "日曜日の 練習に 行きたい 人は どう しますか。", options: ["金曜日までに 石田さんに メールする。", "土曜日に コートへ 行く。", "日曜日の 2時に 石田さんに 電話する。", "何も しないで 日曜日に 行く。"], explain: "「金曜日までに わたしに メールで 知らせて ください」とある。" }
          ]
        },
        {
          type: "reading",
          title: "中文",
          instruction: "つぎの 文章を 読んで、質問に 答えて ください。",
          passage: "わたしと ジョギング　　ロイ・チャン\n\n日本に 来てから、わたしは 毎日 アルバイトと 勉強で 忙しく、ほとんど 運動を しませんでした。夜 遅くまで 起きて いて、朝ご飯も 食べない ことが 多かったです。その ため、よく かぜを ひいたり、授業中に 眠く なったり しました。\nある 日、病院の 医者に 「もう 少し 体を 動かした ほうが いいですよ。」と 言われました。それで、毎朝 30分 近くの 公園を 走る ことに しました。\nはじめの 1週間は とても つらくて、何度も やめようと 思いました。でも、公園で 毎朝 会う おじいさんが、「がんばって いますね。」と 声を かけて くれたので、続ける ことが できました。\n3か月が たった 今、体の 具合は とても いいです。夜も よく 眠れるように なりました。走るのは 今でも 楽では ありませんが、朝の 公園の 空気は 気持ちが いいです。",
          items: [
            { question: "チャンさんは どうして ジョギングを 始めましたか。", options: ["医者に 体を 動かした ほうが いいと 言われたから", "おじいさんに さそわれたから", "アルバイトで 走る ことが 必要だったから", "授業で 習ったから"], explain: "「医者に …と 言われました。それで、…走る ことに しました」とある。" },
            { question: "チャンさんが ジョギングを 続ける ことが できたのは どうしてですか。", options: ["おじいさんが 声を かけて くれたから", "はじめから 楽だったから", "友だちと いっしょに 走ったから", "医者が 毎朝 見に 来たから"], explain: "「おじいさんが …声を かけて くれたので、続ける ことが できました」とある。" },
            { question: "今の チャンさんに ついて、正しい ものは どれですか。", options: ["夜 よく 眠れるように なった。", "走るのが 楽に なった。", "ジョギングを やめた。", "よく かぜを ひく。"], explain: "「夜も よく 眠れるように なりました」。Lari masih 「楽では ありません」。" }
          ]
        },
        {
          type: "reading",
          title: "情報検索",
          instruction: "つぎの お知らせを 見て、質問に 答えて ください。",
          passage: "【みどり市民センター 秋の 教室】\n\nA　ヨガ ｜ 火曜日 午前10時〜11時 ｜ 8回 4,000円\nB　料理 ｜ 木曜日 午後6時〜8時 ｜ 4回 6,000円（材料の お金も 入って います）\nC　書道 ｜ 土曜日 午後2時〜4時 ｜ 8回 5,000円\nD　ギター ｜ 水曜日 午後7時〜8時30分 ｜ 8回 7,000円\n\n※ みどり市に 住んで いる 人は、どの 教室も 1,000円 安く なります。\n※ 申し込みは 9月15日まで。センターの 受付か 電話で どうぞ。",
          items: [
            { question: "マリアさんは 会社員で、月曜日から 金曜日まで 午後6時半まで 働いて います。平日の 仕事の あとで 習える 教室は どれですか。", options: ["D", "B", "A", "C"], explain: "Selesai kerja 18:30 → hanya D (Rabu 19:00) yang bisa di hari kerja。B mulai 18:00。" },
            { question: "みどり市に 住んで いる 林さんは、料理の 教室に 申し込みます。いくら 払いますか。", options: ["5,000円", "6,000円", "7,000円", "4,000円"], explain: "B 6,000円 − 1,000円 (warga kota) = 5,000円。" }
          ]
        }
      ]
    }
  ]
}

];

// Browser global (loaded via <script>), with a CommonJS fallback so the
// data-integrity check in Node can require() it.
if (typeof module !== "undefined" && module.exports) module.exports = { N4_SIM };
