/* bunpou-quiz-data.js — extra question bank for the 文法 practice modes.
 *
 * Kept out of bunpou-data.js so that file stays readable as a *reference*
 * (patterns, formation tables, worked examples) while the bulk drill content
 * lives here. bunpou-app.js appends these onto each point's own `mcq` /
 * `jlptBuild` arrays at startup, so existing SRS keys (pointId::mcq::N) keep
 * pointing at the same items — new questions are always appended, never
 * inserted ahead of the originals.
 *
 * FURIGANA: written inline as 漢字[かんじ]. bunpou-app.js's rubyize() turns
 * each span into <ruby>漢字<rt>かんじ</rt></ruby>; the furigana toggle just
 * hides the <rt> via CSS, so nothing is re-rendered when it flips. Only mark
 * the kanji itself — 本[ほん] not お本[ほん] — and give each kanji run the
 * reading it actually has in that word (読[よ]みます, not 読[よみ]ます).
 *
 * MCQ CONVENTION: options[0] is always the correct answer (answer: 0), the
 * same convention n4sim.js and choukai-data.js use. renderMcq() shuffles at
 * display time and recomputes the index, so authoring order is never what the
 * learner sees. Do NOT hand-shuffle these.
 *
 * `translation` is Indonesian and is revealed by the translation toggle.
 */

const BUNPOU_QUIZ = {
  mcq: {
    // ---------------- N5 ----------------
    "n5-desu": [
      { sentence: "わたしは 学生[がくせい]＿＿。", options: ["です", "ます", "あります", "います"],
        answer: 0, explain: "Kata benda + です. ます hanya menempel pada kata kerja; あります/います untuk keberadaan benda/orang.",
        translation: "Saya seorang pelajar." },
      { sentence: "田中[たなか]さんは 医者[いしゃ]＿＿ありません。", options: ["じゃ", "が", "を", "に"],
        answer: 0, explain: "Negasi kata benda: N + じゃありません (bentuk halusnya では ありません). が/を/に adalah partikel, bukan bagian negasi.",
        translation: "Tuan Tanaka bukan seorang dokter." },
      { sentence: "きのうは 雨[あめ]＿＿。", options: ["でした", "です", "じゃありません", "でしょう"],
        answer: 0, explain: "きのう menuntut bentuk lampau, jadi です → でした. でしょう = dugaan, bukan lampau.",
        translation: "Kemarin hujan." },
      { sentence: "これは 日本[にほん]の 車[くるま]＿＿か。", options: ["です", "でした", "じゃ", "ですか"],
        answer: 0, explain: "Kalimat tanya = pernyataan + か, jadi ＿＿ diisi です saja. ですか akan menjadikannya ですかか.",
        translation: "Apakah ini mobil buatan Jepang?" },
      { sentence: "先週[せんしゅう]の テストは かんたん＿＿。", options: ["じゃありませんでした", "じゃありません", "くなかったです", "ないでした"],
        answer: 0, explain: "かんたん adalah な-adjektiva, jadi negasi lampaunya じゃありませんでした. 〜くなかった hanya untuk い-adjektiva.",
        translation: "Ujian minggu lalu tidak mudah." }
    ],
    "n5-wa-ga": [
      { sentence: "わたし＿＿ 田中[たなか]です。", options: ["は", "が", "を", "も"],
        answer: 0, explain: "Memperkenalkan diri = menyebut topik yang sudah jelas, jadi pakai は.",
        translation: "Saya Tanaka." },
      { sentence: "あそこに 猫[ねこ]＿＿ います。", options: ["が", "は", "を", "で"],
        answer: 0, explain: "Informasi baru yang baru muncul di layar pembicaraan memakai が, bukan は.",
        translation: "Di sana ada seekor kucing." },
      { sentence: "わたしは 犬[いぬ]＿＿ 好[す]きです。", options: ["が", "を", "は", "に"],
        answer: 0, explain: "好き adalah な-adjektiva, bukan kata kerja, jadi objeknya ditandai が — bukan を.",
        translation: "Saya suka anjing." },
      { sentence: "だれ＿＿ この ケーキを 作[つく]りましたか。", options: ["が", "は", "も", "を"],
        answer: 0, explain: "Kata tanya だれ/なに sebagai subjek selalu memakai が. だれは tidak pernah benar.",
        translation: "Siapa yang membuat kue ini?" },
      { sentence: "兄[あに]は 背[せ]＿＿ 高[たか]いです。", options: ["が", "を", "に", "で"],
        answer: 0, explain: "Pola 「A は B が + adjektiva」: A topik, B bagian yang dijelaskan. 背が高い = tinggi badannya.",
        translation: "Kakak laki-laki saya tinggi." }
    ],
    "n5-o-ni-de": [
      { sentence: "毎朝[まいあさ] パン＿＿ 食[た]べます。", options: ["を", "が", "に", "で"],
        answer: 0, explain: "Objek langsung dari kata kerja transitif ditandai を.",
        translation: "Setiap pagi saya makan roti." },
      { sentence: "七時[しちじ]＿＿ 起[お]きます。", options: ["に", "で", "を", "は"],
        answer: 0, explain: "Waktu yang bisa ditunjuk jam/tanggal memakai に. で dipakai untuk tempat kegiatan.",
        translation: "Saya bangun pukul tujuh." },
      { sentence: "図書館[としょかん]＿＿ 勉強[べんきょう]します。", options: ["で", "に", "を", "へ"],
        answer: 0, explain: "Tempat berlangsungnya suatu kegiatan memakai で. に dipakai untuk tempat keberadaan/tujuan.",
        translation: "Saya belajar di perpustakaan." },
      { sentence: "毎日[まいにち] 学校[がっこう]＿＿ 行[い]きます。", options: ["に", "で", "を", "が"],
        answer: 0, explain: "行きます/来ます/帰ります menandai tujuan dengan に (atau へ), bukan で.",
        translation: "Setiap hari saya pergi ke sekolah." },
      { sentence: "公園[こうえん]＿＿ 散歩[さんぽ]します。", options: ["を", "に", "で", "へ"],
        answer: 0, explain: "散歩する/歩く/渡る memakai を untuk ruang yang dilalui — を di sini bukan penanda objek.",
        translation: "Saya berjalan-jalan di taman." }
    ],
    "n5-arimasu-imasu": [
      { sentence: "つくえの 上[うえ]に 本[ほん]が ＿＿。", options: ["あります", "います", "です", "しました"],
        answer: 0, explain: "Benda mati memakai あります. います hanya untuk makhluk hidup.",
        translation: "Di atas meja ada buku." },
      { sentence: "へやに 猫[ねこ]が ＿＿。", options: ["います", "あります", "です", "なります"],
        answer: 0, explain: "Makhluk hidup (hewan/orang) memakai います.",
        translation: "Di kamar ada kucing." },
      { sentence: "わたしは 車[くるま]が ＿＿。", options: ["あります", "います", "もちます", "です"],
        answer: 0, explain: "Kepemilikan juga dinyatakan dengan あります: 「〜が あります」.",
        translation: "Saya punya mobil." },
      { sentence: "きょうしつに だれも ＿＿。", options: ["いません", "ありません", "います", "あります"],
        answer: 0, explain: "だれも menuntut bentuk negatif, dan karena subjeknya orang maka いません.",
        translation: "Di ruang kelas tidak ada siapa-siapa." },
      { sentence: "駅[えき]の 前[まえ]に 銀行[ぎんこう]が ＿＿。", options: ["あります", "います", "です", "おきます"],
        answer: 0, explain: "Bangunan adalah benda mati, jadi あります.",
        translation: "Di depan stasiun ada bank." }
    ],
    "n5-masu": [
      { sentence: "あした 友[とも]だちに ＿＿。", options: ["会[あ]います", "会[あ]いました", "会[あ]いません", "会[あ]っています"],
        answer: 0, explain: "あした = masa depan, jadi bentuk ます (bukan lampau ました).",
        translation: "Besok saya akan bertemu teman." },
      { sentence: "きのう テレビを ＿＿。", options: ["見[み]ました", "見[み]ます", "見[み]ません", "見[み]ましょう"],
        answer: 0, explain: "きのう menuntut bentuk lampau ました.",
        translation: "Kemarin saya menonton televisi." },
      { sentence: "わたしは お酒[さけ]を ＿＿。", options: ["飲[の]みません", "飲[の]みました", "飲[の]みましょう", "飲[の]みます"],
        answer: 0, explain: "Menyatakan kebiasaan yang tidak dilakukan = bentuk negatif ません.",
        translation: "Saya tidak minum minuman beralkohol." },
      { sentence: "先週[せんしゅう]は どこへも ＿＿。", options: ["行[い]きませんでした", "行[い]きました", "行[い]きません", "行[い]きましょう"],
        answer: 0, explain: "どこへも menuntut negatif, dan 先週 menuntut lampau → ませんでした.",
        translation: "Minggu lalu saya tidak pergi ke mana pun." },
      { sentence: "毎晩[まいばん] 十一時[じゅういちじ]に ＿＿。", options: ["寝[ね]ます", "寝[ね]ました", "寝[ね]ましょう", "寝[ね]ませんでした"],
        answer: 0, explain: "毎晩 = kebiasaan sekarang, jadi bentuk ます biasa.",
        translation: "Setiap malam saya tidur pukul sebelas." }
    ],
    "n5-iadj-nadj": [
      { sentence: "この 料理[りょうり]は ＿＿ ないです。", options: ["おいしく", "おいしい", "おいし", "おいしくて"],
        answer: 0, explain: "Negasi い-adjektiva: い → く + ない. おいしい → おいしくない.",
        translation: "Masakan ini tidak enak." },
      { sentence: "きのうの 映画[えいが]は ＿＿ です。", options: ["おもしろかった", "おもしろい", "おもしろく", "おもしろいでした"],
        answer: 0, explain: "Lampau い-adjektiva: い → かった. Bentuk 「おもしろいでした」 selalu salah.",
        translation: "Film kemarin menarik." },
      { sentence: "この 部屋[へや]は ＿＿ です。", options: ["きれい", "きれいい", "きれく", "きれいの"],
        answer: 0, explain: "きれい adalah な-adjektiva meski berakhir い — langsung disambung です tanpa perubahan.",
        translation: "Kamar ini bersih." },
      { sentence: "＿＿ 町[まち]に 住[す]んでいます。", options: ["しずかな", "しずか", "しずかい", "しずかで"],
        answer: 0, explain: "な-adjektiva yang menerangkan kata benda butuh な: しずかな町.",
        translation: "Saya tinggal di kota yang tenang." },
      { sentence: "この かばんは 安[やす]くて ＿＿ です。", options: ["じょうぶ", "じょうぶな", "じょうぶで", "じょうぶだ"],
        answer: 0, explain: "Di akhir kalimat な-adjektiva berdiri tanpa な: 〜じょうぶです.",
        translation: "Tas ini murah dan kuat." }
    ],
    "n5-tai-hoshii": [
      { sentence: "つめたい 水[みず]が ＿＿ です。", options: ["ほしい", "ほしく", "したい", "ほしいたい"],
        answer: 0, explain: "Menginginkan BENDA → 〜がほしい. 〜たい hanya menempel pada kata kerja.",
        translation: "Saya ingin air dingin." },
      { sentence: "日本[にほん]へ ＿＿ です。", options: ["行[い]きたい", "行[い]くたい", "行[い]きほしい", "行[い]って"],
        answer: 0, explain: "〜たい menempel pada batang ます: 行きます → 行き + たい.",
        translation: "Saya ingin pergi ke Jepang." },
      { sentence: "今[いま]は 何[なに]も ＿＿ ないです。", options: ["食[た]べたく", "食[た]べたい", "食[た]べほしく", "食[た]べて"],
        answer: 0, explain: "〜たい berkonjugasi seperti い-adjektiva: たい → たくない.",
        translation: "Sekarang saya tidak ingin makan apa pun." },
      { sentence: "子[こ]どもの とき、医者[いしゃ]に なり＿＿ です。", options: ["たかった", "たい", "たく", "ほしかった"],
        answer: 0, explain: "Keinginan di masa lalu: たい → たかった.",
        translation: "Waktu kecil, saya ingin menjadi dokter." },
      { sentence: "弟[おとうと]は 新[あたら]しい 自転車[じてんしゃ]を ＿＿ います。", options: ["ほしがって", "ほしくて", "ほしい", "ほしがる"],
        answer: 0, explain: "Keinginan ORANG KETIGA tidak boleh memakai ほしい langsung — pakai 〜をほしがっています.",
        translation: "Adik laki-laki saya menginginkan sepeda baru." }
    ],
    "n5-kudasai-mashou": [
      { sentence: "ここに 名前[なまえ]を 書[か]いて ＿＿。", options: ["ください", "ましょう", "です", "あります"],
        answer: 0, explain: "Permintaan sopan: bentuk て + ください.",
        translation: "Tolong tulis nama Anda di sini." },
      { sentence: "いっしょに 昼[ひる]ごはんを 食[た]べ＿＿。", options: ["ましょう", "たいです", "てください", "ました"],
        answer: 0, explain: "Ajakan kepada lawan bicara: batang ます + ましょう.",
        translation: "Mari kita makan siang bersama." },
      { sentence: "荷物[にもつ]を 持[も]ち＿＿か。", options: ["ましょう", "ません", "ください", "たい"],
        answer: 0, explain: "〜ましょうか = menawarkan bantuan (\"Mau saya bawakan?\").",
        translation: "Mari saya bawakan barangnya?" },
      { sentence: "すみません、もう 一度[いちど] 言[い]って ＿＿。", options: ["ください", "ましょう", "います", "あります"],
        answer: 0, explain: "Meminta pengulangan = 言って + ください.",
        translation: "Maaf, tolong ulangi sekali lagi." },
      { sentence: "ここで 写真[しゃしん]を 撮[と]ら ＿＿ ください。", options: ["ないで", "なくて", "ずに", "ません"],
        answer: 0, explain: "Permintaan agar TIDAK melakukan sesuatu: bentuk ない + で + ください.",
        translation: "Tolong jangan mengambil foto di sini." }
    ],
    "n5-teimasu": [
      { sentence: "今日[きょう]は 雨[あめ]が 降[ふ]って ＿＿。", options: ["います", "あります", "みます", "おきます"],
        answer: 0, explain: "Kegiatan yang sedang berlangsung: bentuk て + います.",
        translation: "Hari ini sedang turun hujan." },
      { sentence: "兄[あに]は 銀行[ぎんこう]で ＿＿ います。", options: ["働[はたら]いて", "働[はたら]きて", "働[はたら]く", "働[はたら]った"],
        answer: 0, explain: "働きます adalah kata kerja golongan I berakhir き → bentuk て-nya 働いて.",
        translation: "Kakak laki-laki saya bekerja di bank." },
      { sentence: "田中[たなか]さんは 結婚[けっこん]して ＿＿。", options: ["います", "あります", "おきます", "みます"],
        answer: 0, explain: "結婚する dengan ています menyatakan KEADAAN sekarang (sudah menikah), bukan aksi berlangsung.",
        translation: "Tuan Tanaka sudah menikah." },
      { sentence: "窓[まど]が ＿＿ います。", options: ["開[あ]いて", "開[あ]けて", "開[あ]く", "開[あ]きて"],
        answer: 0, explain: "開く (intransitif) + ています menyatakan keadaan jendela. 開けて memerlukan pelaku yang membukanya.",
        translation: "Jendelanya terbuka." },
      { sentence: "毎朝[まいあさ] ジョギングを して ＿＿。", options: ["います", "ありました", "ください", "みます"],
        answer: 0, explain: "毎朝 + ています menyatakan kebiasaan yang berulang.",
        translation: "Setiap pagi saya jogging." }
    ],
    "n5-temoii-tehaikenai": [
      { sentence: "ここで 写真[しゃしん]を 撮[と]って ＿＿ ですか。", options: ["も いい", "は いけない", "ください", "あります"],
        answer: 0, explain: "Meminta izin: bentuk て + もいいですか.",
        translation: "Bolehkah saya mengambil foto di sini?" },
      { sentence: "この 部屋[へや]で たばこを 吸[す]っては ＿＿。", options: ["いけません", "いいです", "ください", "あります"],
        answer: 0, explain: "Larangan: bentuk て + はいけません.",
        translation: "Dilarang merokok di ruangan ini." },
      { sentence: "えんぴつで 書[か]いても ＿＿ です。", options: ["いい", "いけない", "ください", "だめでは"],
        answer: 0, explain: "Memberi izin: 〜てもいいです.",
        translation: "Boleh menulis dengan pensil." },
      { sentence: "しけんちゅうは 話[はな]し＿＿ いけません。", options: ["ては", "ても", "たら", "ながら"],
        answer: 0, explain: "Pola larangan selalu 〜てはいけません; 〜てもいけません bukan bentuk baku.",
        translation: "Selama ujian tidak boleh berbicara." },
      { sentence: "ここに 車[くるま]を 止[と]めても ＿＿ か。", options: ["いいです", "いけません", "ください", "あります"],
        answer: 0, explain: "Bentuk tanya izin diakhiri いいですか.",
        translation: "Bolehkah saya memarkir mobil di sini?" }
    ],
    "n5-nakerebanaranai": [
      { sentence: "あした 早[はや]く 起[お]き＿＿ なりません。", options: ["なければ", "なくても", "ないと", "なくて"],
        answer: 0, explain: "Kewajiban: bentuk ない → なければ + なりません.",
        translation: "Besok saya harus bangun pagi." },
      { sentence: "土曜日[どようび]は 学校[がっこう]へ 行[い]か＿＿ いいです。", options: ["なくても", "なければ", "ないで", "なくて"],
        answer: 0, explain: "Tidak wajib: bentuk ない → なくても + いいです.",
        translation: "Hari Sabtu tidak perlu pergi ke sekolah." },
      { sentence: "くすりを 飲[の]ま＿＿ なりません。", options: ["なければ", "なくても", "ないでも", "なくては"],
        answer: 0, explain: "なければなりません adalah pasangan tetap. なくては berpasangan dengan いけません.",
        translation: "Saya harus minum obat." },
      { sentence: "パスポートを 見[み]せ＿＿ いけません。", options: ["なくては", "なくても", "なければも", "ないでは"],
        answer: 0, explain: "なくてはいけません = varian percakapan dari なければなりません.",
        translation: "Harus menunjukkan paspor." },
      { sentence: "きょうは 残業[ざんぎょう]し＿＿ いいですか。", options: ["なくても", "なければ", "ないでも", "なくては"],
        answer: 0, explain: "Menanyakan apakah boleh tidak melakukan: 〜なくてもいいですか.",
        translation: "Apakah hari ini saya tidak perlu lembur?" }
    ],
    "n5-yori-houga-ichiban": [
      { sentence: "電車[でんしゃ]は バス＿＿ 速[はや]いです。", options: ["より", "ほうが", "いちばん", "ほど"],
        answer: 0, explain: "Pembanding \"daripada\" = より, diletakkan setelah pihak yang dikalahkan.",
        translation: "Kereta lebih cepat daripada bus." },
      { sentence: "コーヒーより お茶[ちゃ]の ＿＿ が 好[す]きです。", options: ["ほう", "より", "いちばん", "こと"],
        answer: 0, explain: "Pola 「AよりBのほうが〜」 — sisi yang menang ditandai のほうが.",
        translation: "Saya lebih suka teh daripada kopi." },
      { sentence: "くだものの 中[なか]で りんごが ＿＿ 好[す]きです。", options: ["いちばん", "より", "ほうが", "もっと"],
        answer: 0, explain: "Superlatif dalam satu kelompok: 〜の中で + 一番.",
        translation: "Di antara buah-buahan, saya paling suka apel." },
      { sentence: "日本語[にほんご]と 英語[えいご]と ＿＿ が むずかしいですか。", options: ["どちら", "どこ", "だれ", "なに"],
        answer: 0, explain: "Membandingkan DUA hal memakai どちら, bukan どれ (tiga atau lebih).",
        translation: "Mana yang lebih sulit, bahasa Jepang atau bahasa Inggris?" },
      { sentence: "きょうは きのう＿＿ さむくないです。", options: ["ほど", "より", "ほうが", "いちばん"],
        answer: 0, explain: "〜ほど〜ない = \"tidak se-... seperti\". Dengan より kalimat negatif ini terdengar janggal.",
        translation: "Hari ini tidak sedingin kemarin." }
    ],
    // ---------------- N4 ----------------
    "n4-to-omou": [
      { sentence: "あしたは 雨[あめ]が 降[ふ]る＿＿ 思[おも]います。", options: ["と", "って", "を", "が"],
        answer: 0, explain: "〜と思う selalu didahului bentuk biasa (kamus/ない/た), lalu partikel と.",
        translation: "Saya pikir besok akan turun hujan." },
      { sentence: "先生[せんせい]は あした テストが ある＿＿ 言[い]いました。", options: ["と", "を", "に", "で"],
        answer: 0, explain: "Kutipan tidak langsung memakai と言いました.",
        translation: "Guru berkata bahwa besok ada ujian." },
      { sentence: "これは 日本語[にほんご]で 「さくら」＿＿ 言[い]います。", options: ["と", "を", "に", "が"],
        answer: 0, explain: "Menyebut nama/istilah: 「X」と言います.",
        translation: "Ini dalam bahasa Jepang disebut \"sakura\"." },
      { sentence: "田中[たなか]さん＿＿ 人[ひと]を 知[し]っていますか。", options: ["という", "と思う", "と言った", "というのは"],
        answer: 0, explain: "〜という + kata benda dipakai untuk memperkenalkan nama yang belum dikenal lawan bicara.",
        translation: "Apakah Anda kenal orang bernama Tanaka?" },
      { sentence: "わたしは その 話[はなし]は 本当[ほんとう]じゃない＿＿ 思[おも]います。", options: ["と", "って", "が", "の"],
        answer: 0, explain: "Bentuk biasa negatif じゃない + と思います. Jangan pakai じゃありませんと思います.",
        translation: "Saya rasa cerita itu tidak benar." }
    ],
    "n4-deshou": [
      { sentence: "あしたは たぶん 晴[は]れる ＿＿。", options: ["でしょう", "です", "ました", "ますか"],
        answer: 0, explain: "たぶん berpasangan dengan でしょう untuk dugaan.",
        translation: "Besok mungkin akan cerah." },
      { sentence: "この 問題[もんだい]は 学生[がくせい]には むずかしい ＿＿。", options: ["でしょう", "でした", "ましょう", "ください"],
        answer: 0, explain: "い-adjektiva + でしょう langsung, tanpa です di antaranya.",
        translation: "Soal ini mungkin sulit bagi siswa." },
      { sentence: "あの 人[ひと]は 来[こ]ない ＿＿ ね。", options: ["でしょう", "ましょう", "です", "でした"],
        answer: 0, explain: "Bentuk biasa negatif 来ない + でしょう; ね meminta persetujuan.",
        translation: "Orang itu mungkin tidak akan datang, ya." },
      { sentence: "友[とも]だちと 話[はな]すとき、「あした 来[く]る ＿＿？」と 聞[き]きます。", options: ["だろう", "でしょう", "ましょう", "ですか"],
        answer: 0, explain: "だろう adalah bentuk biasa (kasual) dari でしょう, cocok dipakai dengan teman.",
        translation: "Saat berbicara dengan teman, kita bertanya \"besok datang, kan?\"" },
      { sentence: "彼[かれ]は 日本[にほん]に 住[す]んでいたから、日本語[にほんご]が 上手[じょうず] ＿＿。", options: ["でしょう", "です", "ました", "ましょう"],
        answer: 0, explain: "な-adjektiva + でしょう tanpa だ: 上手でしょう.",
        translation: "Karena dia pernah tinggal di Jepang, bahasa Jepangnya pasti bagus." }
    ],
    "n4-kara": [
      { sentence: "時間[じかん]が ない＿＿、急[いそ]ぎましょう。", options: ["から", "ので", "のに", "ても"],
        answer: 0, explain: "から cocok mendahului ajakan/perintah; ので terdengar kurang alami di depan ましょう.",
        translation: "Karena tidak ada waktu, ayo bergegas." },
      { sentence: "寒[さむ]い＿＿、窓[まど]を 閉[し]めて ください。", options: ["から", "のに", "ても", "たら"],
        answer: 0, explain: "Alasan + permintaan memakai から.",
        translation: "Karena dingin, tolong tutup jendelanya." },
      { sentence: "きょうは 日曜日[にちようび]だ＿＿、銀行[ぎんこう]は 休[やす]みです。", options: ["から", "ので", "のに", "でも"],
        answer: 0, explain: "Kata benda dalam bentuk biasa memakai だ sebelum から: 日曜日だから.",
        translation: "Karena hari ini Minggu, bank tutup." },
      { sentence: "どうして 遅[おく]れたんですか。― 電車[でんしゃ]が 止[と]まった＿＿ です。", options: ["から", "ので", "のに", "ため"],
        answer: 0, explain: "Menjawab どうして dengan 〜からです adalah pola baku.",
        translation: "Kenapa terlambat? — Karena keretanya berhenti." },
      { sentence: "危[あぶ]ない＿＿、さわらないで ください。", options: ["から", "のに", "ても", "ば"],
        answer: 0, explain: "Alasan + larangan: から + 〜ないでください.",
        translation: "Karena berbahaya, tolong jangan disentuh." }
    ],
    "n4-node": [
      { sentence: "道[みち]が こんでいた＿＿、遅[おく]れて しまいました。", options: ["ので", "のに", "ても", "たら"],
        answer: 0, explain: "Alasan objektif di luar kendali pembicara — ので terdengar lebih sopan daripada から.",
        translation: "Karena jalanan macet, saya jadi terlambat." },
      { sentence: "きょうは 体[からだ]の 調子[ちょうし]が 悪[わる]い＿＿、休[やす]ませて ください。", options: ["ので", "のに", "ても", "ば"],
        answer: 0, explain: "Permintaan sopan lebih cocok didahului ので daripada から.",
        translation: "Karena kondisi badan saya kurang baik, izinkan saya istirahat." },
      { sentence: "子[こ]どもな＿＿、まだ わからないと 思[おも]います。", options: ["ので", "だので", "ので だ", "のに"],
        answer: 0, explain: "Kata benda + な + ので → 子どもなので. Bentuk だので tidak pernah benar.",
        translation: "Karena masih anak-anak, saya rasa dia belum mengerti." },
      { sentence: "ここは 図書館[としょかん]な＿＿、静[しず]かに して ください。", options: ["ので", "から", "のに", "ため"],
        answer: 0, explain: "N + なので, dan konteks permintaan sopan menuntut ので.",
        translation: "Karena ini perpustakaan, tolong tenang." },
      { sentence: "雨[あめ]が 降[ふ]って いる＿＿、きょうは 出[で]かけません。", options: ["ので", "のに", "ても", "なら"],
        answer: 0, explain: "Menyatakan sebab yang wajar diikuti keputusan — ので.",
        translation: "Karena sedang hujan, hari ini saya tidak keluar." }
    ],
    "n4-shi": [
      { sentence: "この 店[みせ]は 安[やす]い＿＿、おいしいです。", options: ["し", "て", "から", "が"],
        answer: 0, explain: "〜し menumpuk beberapa alasan/sifat yang searah.",
        translation: "Toko ini murah, dan juga enak." },
      { sentence: "きょうは 天気[てんき]も いい＿＿、散歩[さんぽ]しましょう。", options: ["し", "ので", "のに", "ても"],
        answer: 0, explain: "も + し sering berpasangan untuk menambah alasan sebelum ajakan.",
        translation: "Cuaca hari ini bagus, ayo jalan-jalan." },
      { sentence: "彼[かれ]は まじめだ＿＿、よく 働[はたら]きます。", options: ["し", "で", "から", "のに"],
        answer: 0, explain: "な-adjektiva bentuk biasa (まじめだ) + し.",
        translation: "Dia serius, dan juga rajin bekerja." },
      { sentence: "お金[かね]も ない＿＿、時間[じかん]も ありません。", options: ["し", "て", "が", "のに"],
        answer: 0, explain: "Pola 「〜も〜し、〜も〜」 untuk mendaftar dua hal negatif.",
        translation: "Tidak punya uang, waktu pun tidak ada." },
      { sentence: "雨[あめ]も 降[ふ]って いる＿＿、今日[きょう]は 家[いえ]に います。", options: ["し", "のに", "ても", "なら"],
        answer: 0, explain: "し memberi alasan yang mengarah ke kesimpulan di kalimat kedua.",
        translation: "Lagi pula sedang hujan, hari ini saya di rumah saja." }
    ],
    "n4-ndesu": [
      { sentence: "どうして 来[こ]なかった＿＿ か。", options: ["んです", "です", "ます", "でした"],
        answer: 0, explain: "Meminta penjelasan memakai 〜んですか setelah bentuk biasa.",
        translation: "Kenapa Anda tidak datang?" },
      { sentence: "顔色[かおいろ]が 悪[わる]いですね。― 頭[あたま]が 痛[いた]い＿＿。", options: ["んです", "です", "ました", "でしょう"],
        answer: 0, explain: "Menjelaskan sebab dari situasi yang terlihat: 〜んです.",
        translation: "Wajahmu pucat ya. — Kepala saya sakit." },
      { sentence: "しずかですね。― きょうは 休[やす]みな＿＿。", options: ["んです", "んだ です", "のです か", "だんです"],
        answer: 0, explain: "N/な-adj + な + んです → 休みなんです. Bentuk だんです salah.",
        translation: "Sepi ya. — Karena hari ini libur." },
      { sentence: "実[じつ]は、来月[らいげつ] 国[くに]へ 帰[かえ]る＿＿。", options: ["んです", "ます", "でした", "ましょう"],
        answer: 0, explain: "実は sering berpasangan dengan んです saat menyampaikan kabar/latar belakang.",
        translation: "Sebenarnya, bulan depan saya akan pulang ke negara saya." },
      { sentence: "道[みち]が わからない＿＿ が、駅[えき]は どこですか。", options: ["んです", "です", "ました", "でしょう"],
        answer: 0, explain: "〜んですが sebagai pembuka sopan sebelum bertanya atau meminta tolong.",
        translation: "Saya tidak tahu jalannya, stasiun di mana ya?" }
    ],
    "n4-tara": [
      { sentence: "駅[えき]に 着[つ]い＿＿、電話[でんわ]して ください。", options: ["たら", "ば", "と", "なら"],
        answer: 0, explain: "たら paling luwes untuk \"setelah/kalau\" yang diikuti permintaan.",
        translation: "Kalau sudah sampai di stasiun, tolong telepon saya." },
      { sentence: "安[やす]かっ＿＿、買[か]います。", options: ["たら", "ば", "と", "なら"],
        answer: 0, explain: "い-adjektiva: 安い → 安かった → 安かったら.",
        translation: "Kalau murah, saya akan beli." },
      { sentence: "家[いえ]に 帰[かえ]っ＿＿、だれも いませんでした。", options: ["たら", "ば", "なら", "ても"],
        answer: 0, explain: "たら juga menyatakan penemuan tak terduga di masa lalu — hanya たら yang bisa.",
        translation: "Ketika saya pulang, ternyata tidak ada siapa-siapa." },
      { sentence: "もし 時間[じかん]が あっ＿＿、手伝[てつだ]って ください。", options: ["たら", "ると", "れば", "なら"],
        answer: 0, explain: "もし sering berpasangan dengan たら untuk pengandaian.",
        translation: "Kalau ada waktu, tolong bantu saya." },
      { sentence: "大人[おとな]になっ＿＿、わかりますよ。", options: ["たら", "たり", "ては", "ながら"],
        answer: 0, explain: "Menyatakan syarat waktu yang pasti terjadi: 〜たら.",
        translation: "Kalau sudah dewasa, kamu akan mengerti." }
    ],
    "n4-ba": [
      { sentence: "この ボタンを 押[お]せ＿＿、切符[きっぷ]が 出[で]ます。", options: ["ば", "たら", "と", "なら"],
        answer: 0, explain: "Syarat umum/hukum sebab-akibat cocok dengan ば.",
        translation: "Kalau menekan tombol ini, karcisnya akan keluar." },
      { sentence: "安[やす]けれ＿＿、買[か]いたいです。", options: ["ば", "たら", "ると", "なら"],
        answer: 0, explain: "い-adjektiva: 安い → 安ければ.",
        translation: "Kalau murah, saya ingin membelinya." },
      { sentence: "練習[れんしゅう]すれ＿＿、上手[じょうず]に なります。", options: ["ば", "たら", "と", "ても"],
        answer: 0, explain: "する → すれば. Menyatakan syarat yang membawa hasil positif.",
        translation: "Kalau berlatih, akan menjadi mahir." },
      { sentence: "分[わ]からなけれ＿＿、聞[き]いて ください。", options: ["ば", "たら", "なら", "ても"],
        answer: 0, explain: "Bentuk negatif: 分からない → 分からなければ.",
        translation: "Kalau tidak mengerti, silakan bertanya." },
      { sentence: "天気[てんき]が よけれ＿＿、山[やま]が 見[み]えます。", options: ["ば", "たら", "と", "なら"],
        answer: 0, explain: "いい adalah pengecualian: いい → よければ, bukan いければ.",
        translation: "Kalau cuacanya bagus, gunungnya terlihat." }
    ],
    "n4-to-cond": [
      { sentence: "春[はる]に なる＿＿、桜[さくら]が 咲[さ]きます。", options: ["と", "たら", "ば", "なら"],
        answer: 0, explain: "と untuk hal yang SELALU terjadi (hukum alam/kebiasaan).",
        translation: "Kalau musim semi tiba, bunga sakura mekar." },
      { sentence: "この つまみを 右[みぎ]に まわす＿＿、音[おと]が 大[おお]きく なります。", options: ["と", "たら", "ば", "ても"],
        answer: 0, explain: "Cara kerja mesin/alat: hasil yang pasti → と.",
        translation: "Kalau memutar kenop ini ke kanan, suaranya membesar." },
      { sentence: "まっすぐ 行[い]く＿＿、右[みぎ]に 駅[えき]が あります。", options: ["と", "たら", "ば", "なら"],
        answer: 0, explain: "Memberi petunjuk arah memakai と.",
        translation: "Kalau jalan lurus, di sebelah kanan ada stasiun." },
      { sentence: "窓[まど]を 開[あ]ける＿＿、海[うみ]が 見[み]えた。", options: ["と", "ば", "なら", "ても"],
        answer: 0, explain: "と juga dipakai untuk penemuan langsung di masa lalu.",
        translation: "Begitu membuka jendela, laut pun terlihat." },
      { sentence: "お金[かね]を 入[い]れる＿＿、ボタンが 光[ひか]ります。", options: ["と", "たら", "なら", "ても"],
        answer: 0, explain: "Urutan otomatis mesin: と.",
        translation: "Kalau memasukkan uang, tombolnya menyala." }
    ],
    "n4-nara": [
      { sentence: "日本[にほん]へ 行[い]く＿＿、京都[きょうと]が いいですよ。", options: ["なら", "たら", "と", "ば"],
        answer: 0, explain: "なら menanggapi topik yang baru disebut lawan bicara lalu memberi saran.",
        translation: "Kalau mau ke Jepang, Kyoto bagus lho." },
      { sentence: "安[やす]い パソコン＿＿、あの 店[みせ]に ありますよ。", options: ["なら", "たら", "ば", "と"],
        answer: 0, explain: "Kata benda + なら langsung, tanpa だ.",
        translation: "Kalau laptop murah, ada di toko itu." },
      { sentence: "そんなに 忙[いそが]しい＿＿、手伝[てつだ]いましょうか。", options: ["なら", "と", "ても", "のに"],
        answer: 0, explain: "なら menanggapi kondisi lawan bicara lalu menawarkan bantuan.",
        translation: "Kalau memang sesibuk itu, mari saya bantu?" },
      { sentence: "田中[たなか]さん＿＿、さっき 帰[かえ]りましたよ。", options: ["なら", "たら", "ば", "と"],
        answer: 0, explain: "Menjawab pertanyaan tentang seseorang: 「Xなら〜」.",
        translation: "Kalau soal Tanaka, dia sudah pulang tadi." },
      { sentence: "雨[あめ]が 降[ふ]る＿＿、行[い]くのを やめます。", options: ["なら", "と", "ても", "のに"],
        answer: 0, explain: "なら menyatakan keputusan pembicara berdasarkan syarat itu.",
        translation: "Kalau memang akan hujan, saya batalkan perginya." }
    ],
    "n4-kanou": [
      { sentence: "わたしは 日本語[にほんご]が 少[すこ]し ＿＿。", options: ["話[はな]せます", "話[はな]します", "話[はな]られます", "話[はな]しられます"],
        answer: 0, explain: "話す (gol. I) → 話せます. Golongan I mengubah う-dan menjadi え-dan + る.",
        translation: "Saya bisa berbicara bahasa Jepang sedikit." },
      { sentence: "朝[あさ] 早[はや]く ＿＿ ますか。", options: ["起[お]きられ", "起[お]きれ", "起[お]きさせ", "起[お]きられれ"],
        answer: 0, explain: "起きる (gol. II) → 起きられる. Bentuk 起きれる adalah ら抜き, tidak baku di JLPT.",
        translation: "Apakah kamu bisa bangun pagi-pagi?" },
      { sentence: "この 漢字[かんじ]が ＿＿ ません。", options: ["読[よ]め", "読[よ]み", "読[よ]まれ", "読[よ]ませ"],
        answer: 0, explain: "読む → 読める → 読めません.",
        translation: "Saya tidak bisa membaca kanji ini." },
      { sentence: "あしたは ＿＿ ますか。", options: ["来[こ]られ", "来[き]られ", "来[く]られ", "来[こ]れられ"],
        answer: 0, explain: "来る adalah kata kerja tak beraturan: bentuk potensialnya 来られる (こられる).",
        translation: "Apakah besok Anda bisa datang?" },
      { sentence: "ここから 富士山[ふじさん]が ＿＿。", options: ["見[み]えます", "見[み]られます", "見[み]ます", "見[み]せます"],
        answer: 0, explain: "見える = terlihat dengan sendirinya (bukan karena usaha). 見られる berarti dapat kesempatan melihat.",
        translation: "Dari sini Gunung Fuji terlihat." }
    ],
    "n4-dekiru": [
      { sentence: "わたしは ピアノを ひく ＿＿ が できます。", options: ["こと", "の", "もの", "ところ"],
        answer: 0, explain: "Pola 「V(kamus)+ことができる」. Yang menominalkan di sini adalah こと.",
        translation: "Saya bisa bermain piano." },
      { sentence: "ここで 写真[しゃしん]を 撮[と]る ことが ＿＿。", options: ["できません", "ありません", "しません", "いません"],
        answer: 0, explain: "Negasi kemampuan/izin: ことができません.",
        translation: "Di sini tidak bisa mengambil foto." },
      { sentence: "彼[かれ]は 中国語[ちゅうごくご]が ＿＿。", options: ["できます", "することができます", "あります", "見[み]えます"],
        answer: 0, explain: "Untuk bahasa/keterampilan, cukup 「Nができる」 tanpa ことが.",
        translation: "Dia bisa bahasa Mandarin." },
      { sentence: "カードで 払[はら]う ことが ＿＿ か。", options: ["できます", "します", "あります", "なります"],
        answer: 0, explain: "Menanyakan apakah suatu tindakan dimungkinkan: 〜ことができますか.",
        translation: "Apakah bisa membayar dengan kartu?" },
      { sentence: "去年[きょねん]は 泳[およ]ぐ ことが ＿＿。", options: ["できませんでした", "できません", "しませんでした", "ありませんでした"],
        answer: 0, explain: "去年 menuntut lampau negatif: できませんでした.",
        translation: "Tahun lalu saya tidak bisa berenang." }
    ],
    "n4-you-ni-naru": [
      { sentence: "練習[れんしゅう]して、泳[およ]げる ＿＿ なりました。", options: ["ように", "ことに", "そうに", "ために"],
        answer: 0, explain: "Perubahan kemampuan: V(potensial) + ようになる.",
        translation: "Setelah berlatih, saya jadi bisa berenang." },
      { sentence: "日本[にほん]に 来[き]てから、納豆[なっとう]が 食[た]べられる ように ＿＿。", options: ["なりました", "しました", "きました", "いきました"],
        answer: 0, explain: "ように berpasangan dengan なる untuk perubahan alami.",
        translation: "Sejak datang ke Jepang, saya jadi bisa makan natto." },
      { sentence: "毎朝[まいあさ] 運動[うんどう]する ＿＿ しています。", options: ["ように", "ことに", "ために", "ようで"],
        answer: 0, explain: "〜ようにしている = membiasakan diri (usaha sadar), beda dengan ようになる.",
        translation: "Saya berusaha berolahraga setiap pagi." },
      { sentence: "赤[あか]ちゃんが 歩[ある]ける ように ＿＿。", options: ["なりました", "しました", "みました", "おきました"],
        answer: 0, explain: "Perubahan yang terjadi sendiri pada bayi → なりました.",
        translation: "Bayinya jadi bisa berjalan." },
      { sentence: "むずかしくて、前[まえ]は 読[よ]めなかったが、今[いま]は 読[よ]める ように ＿＿。", options: ["なった", "した", "いた", "あった"],
        answer: 0, explain: "Kontras \"dulu tidak bisa → sekarang bisa\" adalah inti dari ようになった.",
        translation: "Dulu sulit dan tidak terbaca, tapi sekarang jadi bisa saya baca." }
    ],
    "n4-rareru-passive": [
      { sentence: "わたしは 先生[せんせい]に ＿＿ ました。", options: ["ほめられ", "ほめさせ", "ほめ", "ほめられさせ"],
        answer: 0, explain: "Pasif: ほめる → ほめられる. Pelaku ditandai に.",
        translation: "Saya dipuji oleh guru." },
      { sentence: "電車[でんしゃ]の 中[なか]で 足[あし]を ＿＿ ました。", options: ["踏[ふ]まれ", "踏[ふ]ませ", "踏[ふ]み", "踏[ふ]まされ"],
        answer: 0, explain: "Pasif 'merugikan': bagian tubuh tetap ditandai を, pelakunya に.",
        translation: "Kaki saya terinjak di dalam kereta." },
      { sentence: "この お寺[てら]は 300年前[ねんまえ]に ＿＿ ました。", options: ["建[た]てられ", "建[た]て", "建[た]たれ", "建[た]てさせられ"],
        answer: 0, explain: "Pasif tanpa pelaku untuk fakta/sejarah: 建てられました.",
        translation: "Kuil ini dibangun 300 tahun yang lalu." },
      { sentence: "弟[おとうと]に ケーキを ＿＿ ました。", options: ["食[た]べられ", "食[た]べさせ", "食[た]べ", "食[た]べさせられ"],
        answer: 0, explain: "Pasif merugikan: kue saya dimakan adik (dan saya dirugikan).",
        translation: "Kue saya dimakan adik." },
      { sentence: "雨[あめ]に ＿＿、かぜを ひきました。", options: ["降[ふ]られて", "降[ふ]って", "降[ふ]らせて", "降[ふ]られさせて"],
        answer: 0, explain: "Pasif dari kata kerja intransitif menyatakan kerugian: 雨に降られる.",
        translation: "Saya kehujanan, lalu masuk angin." }
    ],
    "n4-saseru": [
      { sentence: "先生[せんせい]は 学生[がくせい]に 作文[さくぶん]を ＿＿ ました。", options: ["書[か]かせ", "書[か]かれ", "書[か]き", "書[か]かせられ"],
        answer: 0, explain: "Kausatif gol. I: 書く → 書かせる.",
        translation: "Guru menyuruh siswa menulis karangan." },
      { sentence: "母[はは]は 妹[いもうと]を 買[か]い物[もの]に ＿＿ ました。", options: ["行[い]かせ", "行[い]かれ", "行[い]き", "行[い]かさせ"],
        answer: 0, explain: "Kata kerja intransitif: orang yang disuruh ditandai を → 妹を行かせる.",
        translation: "Ibu menyuruh adik perempuan pergi berbelanja." },
      { sentence: "子[こ]どもに 野菜[やさい]を ＿＿ ています。", options: ["食[た]べさせ", "食[た]べられ", "食[た]べ", "食[た]べさせられ"],
        answer: 0, explain: "Kausatif gol. II: 食べる → 食べさせる. Objek benda tetap を, orangnya に.",
        translation: "Saya membiasakan anak makan sayur." },
      { sentence: "すみません、ちょっと 休[やす]ま＿＿ ください。", options: ["せて", "れて", "させて", "せられて"],
        answer: 0, explain: "Meminta izin: 休む → 休ませる → 休ませてください.",
        translation: "Maaf, izinkan saya istirahat sebentar." },
      { sentence: "部長[ぶちょう]に 一時間[いちじかん]も ＿＿ ました。", options: ["待[ま]たされ", "待[ま]たせ", "待[ま]たれ", "待[ま]ち"],
        answer: 0, explain: "Kausatif-pasif: dipaksa menunggu. 待つ → 待たせる → 待たされる.",
        translation: "Saya dibuat menunggu kepala bagian sampai satu jam." }
    ],
    "n4-te-ageru-kureru-morau": [
      { sentence: "わたしは 友[とも]だちに 日本語[にほんご]を 教[おし]えて ＿＿ ました。", options: ["あげ", "くれ", "もらい", "いただき"],
        answer: 0, explain: "Saya yang melakukan untuk orang lain → てあげる.",
        translation: "Saya mengajari teman bahasa Jepang." },
      { sentence: "友[とも]だちが 宿題[しゅくだい]を 手伝[てつだ]って ＿＿ ました。", options: ["くれ", "あげ", "もらい", "やり"],
        answer: 0, explain: "Orang lain melakukan untuk SAYA, subjeknya orang itu (が) → てくれる.",
        translation: "Teman saya membantu mengerjakan PR saya." },
      { sentence: "わたしは 先生[せんせい]に 手紙[てがみ]を 直[なお]して ＿＿ ました。", options: ["もらい", "あげ", "くれ", "やり"],
        answer: 0, explain: "Saya menerima jasa, pelakunya ditandai に → てもらう.",
        translation: "Saya minta guru membetulkan surat saya." },
      { sentence: "先生[せんせい]が 教[おし]えて ＿＿ ました。", options: ["くださり", "くれられ", "もらい", "あげ"],
        answer: 0, explain: "Bentuk hormat dari てくれる adalah てくださる → てくださいました.",
        translation: "Guru berkenan mengajari saya." },
      { sentence: "父[ちち]に 新[あたら]しい 時計[とけい]を 買[か]って ＿＿ ました。", options: ["もらい", "あげ", "くれ", "やり"],
        answer: 0, explain: "Penerima adalah saya dan pelakunya ditandai に → てもらう.",
        translation: "Saya dibelikan jam tangan baru oleh ayah." }
    ],
    "n4-te-shimau": [
      { sentence: "宿題[しゅくだい]は もう やって ＿＿ ました。", options: ["しまい", "おき", "み", "あり"],
        answer: 0, explain: "てしまう juga berarti \"selesai sepenuhnya\", sering dengan もう.",
        translation: "PR-nya sudah selesai saya kerjakan." },
      { sentence: "電車[でんしゃ]に かさを 忘[わす]れて ＿＿ ました。", options: ["しまい", "おき", "み", "い"],
        answer: 0, explain: "Penyesalan atas kejadian tak disengaja: てしまいました.",
        translation: "Saya ketinggalan payung di kereta." },
      { sentence: "ケーキを 全部[ぜんぶ] 食[た]べ＿＿ た。", options: ["ちゃっ", "でしまっ", "ておい", "てみ"],
        answer: 0, explain: "〜てしまった disingkat menjadi 〜ちゃった dalam percakapan santai.",
        translation: "Kuenya habis saya makan semua." },
      { sentence: "大切[たいせつ]な 皿[さら]を 割[わ]って ＿＿ ました。", options: ["しまい", "おき", "み", "くれ"],
        answer: 0, explain: "Menyatakan kejadian yang disesali: 割ってしまいました.",
        translation: "Saya memecahkan piring yang berharga." },
      { sentence: "その 本[ほん]は 一日[いちにち]で 読[よ]んで ＿＿ ました。", options: ["しまい", "おき", "み", "あげ"],
        answer: 0, explain: "Penyelesaian tuntas dalam waktu singkat → てしまう.",
        translation: "Buku itu habis saya baca dalam sehari." }
    ],
    "n4-te-oku": [
      { sentence: "旅行[りょこう]の 前[まえ]に、切符[きっぷ]を 買[か]って ＿＿ ます。", options: ["おき", "しまい", "み", "あり"],
        answer: 0, explain: "Persiapan sebelum suatu peristiwa: ておく.",
        translation: "Sebelum bepergian, saya membeli tiket lebih dulu." },
      { sentence: "使[つか]ったら、もとの ところに もどして ＿＿ ください。", options: ["おいて", "しまって", "みて", "あって"],
        answer: 0, explain: "Membiarkan dalam keadaan tertentu untuk nanti: もどしておく.",
        translation: "Kalau sudah dipakai, tolong kembalikan ke tempat semula." },
      { sentence: "会議[かいぎ]の 資料[しりょう]を コピーして ＿＿ ました。", options: ["おき", "み", "しまい", "くれ"],
        answer: 0, explain: "Menyiapkan sesuatu terlebih dahulu → しておきました.",
        translation: "Saya sudah menyalin bahan rapatnya." },
      { sentence: "ビールを 冷[ひ]やして ＿＿ ね。", options: ["おいて", "しまって", "みて", "あげて"],
        answer: 0, explain: "Permintaan agar sesuatu disiapkan lebih dulu: 冷やしておいて.",
        translation: "Tolong dinginkan birnya dulu ya." },
      { sentence: "あとで 使[つか]うから、そのままに して ＿＿ ください。", options: ["おいて", "しまって", "みて", "きて"],
        answer: 0, explain: "そのままにしておく = membiarkan apa adanya untuk dipakai nanti.",
        translation: "Karena nanti dipakai, tolong biarkan saja begitu." }
    ],
    "n4-te-miru": [
      { sentence: "この 服[ふく]を 着[き]て ＿＿ も いいですか。", options: ["み", "おき", "しまい", "あげ"],
        answer: 0, explain: "Mencoba melakukan sesuatu: てみる. 着てみてもいいですか = boleh saya coba pakai?",
        translation: "Bolehkah saya mencoba memakai baju ini?" },
      { sentence: "おいしそうですね。ちょっと 食[た]べて ＿＿ ます。", options: ["み", "おき", "しまい", "くれ"],
        answer: 0, explain: "食べてみます = mencoba memakannya.",
        translation: "Kelihatannya enak. Saya coba makan sedikit." },
      { sentence: "むずかしいですが、一度[いちど] やって ＿＿ ましょう。", options: ["み", "おき", "しまい", "あげ"],
        answer: 0, explain: "Mengajak mencoba: やってみましょう.",
        translation: "Memang sulit, tapi ayo kita coba sekali." },
      { sentence: "京都[きょうと]へ 行[い]って ＿＿ たいです。", options: ["み", "おき", "しまい", "くれ"],
        answer: 0, explain: "てみる + たい = ingin mencoba: 行ってみたい.",
        translation: "Saya ingin mencoba pergi ke Kyoto." },
      { sentence: "先生[せんせい]に 聞[き]いて ＿＿ ましたが、わかりませんでした。", options: ["み", "おき", "あげ", "くれ"],
        answer: 0, explain: "Sudah mencoba tapi hasilnya tidak sesuai harapan: 聞いてみました.",
        translation: "Saya sudah coba bertanya pada guru, tapi tetap tidak paham." }
    ],
    "n4-tsumori": [
      { sentence: "夏休[なつやす]みに 国[くに]へ 帰[かえ]る ＿＿ です。", options: ["つもり", "よう", "そう", "らしい"],
        answer: 0, explain: "Rencana yang sudah diputuskan: V(kamus) + つもりです.",
        translation: "Saya berencana pulang ke negara saya saat libur musim panas." },
      { sentence: "たばこは もう 吸[す]わない ＿＿ です。", options: ["つもり", "こと", "はず", " よう"],
        answer: 0, explain: "つもり juga menempel pada bentuk ない: 吸わないつもり.",
        translation: "Saya berniat tidak merokok lagi." },
      { sentence: "来年[らいねん] 結婚[けっこん]する つもり ＿＿。", options: ["です", "でした", "ました", "します"],
        answer: 0, explain: "つもり adalah kata benda, jadi diakhiri です.",
        translation: "Saya berencana menikah tahun depan." },
      { sentence: "行[い]く つもり ＿＿ が、忙[いそが]しくて 行[い]けませんでした。", options: ["でした", "です", "ました", "だろう"],
        answer: 0, explain: "つもりでした = rencana lampau yang tidak terlaksana.",
        translation: "Saya berniat pergi, tapi karena sibuk jadi tidak bisa." },
      { sentence: "しけんを 受[う]ける つもりは ＿＿。", options: ["ありません", "いません", "できません", "じゃありません"],
        answer: 0, explain: "Penyangkalan niat memakai つもりはありません (lebih tegas dari つもりじゃない).",
        translation: "Saya tidak berniat mengikuti ujian." }
    ],
    "n4-you-to-omou": [
      { sentence: "今日[きょう]は 早[はや]く ＿＿ と 思[おも]います。", options: ["寝[ね]よう", "寝[ね]る", "寝[ね]ます", "寝[ね]たい"],
        answer: 0, explain: "〜(よ)うと思う memakai bentuk kehendak: 寝る → 寝よう.",
        translation: "Hari ini saya berniat tidur lebih awal." },
      { sentence: "来月[らいげつ]から 運動[うんどう]を ＿＿ と 思[おも]っています。", options: ["始[はじ]めよう", "始[はじ]める", "始[はじ]めます", "始[はじ]めたい"],
        answer: 0, explain: "始める (gol. II) → 始めよう.",
        translation: "Saya berpikir untuk mulai berolahraga bulan depan." },
      { sentence: "日本[にほん]で ＿＿ と 思[おも]っています。", options: ["働[はたら]こう", "働[はたら]く", "働[はたら]き", "働[はたら]かせ"],
        answer: 0, explain: "働く (gol. I) → 働こう.",
        translation: "Saya berniat bekerja di Jepang." },
      { sentence: "車[くるま]を ＿＿ と 思[おも]います。", options: ["買[か]おう", "買[か]う", "買[か]い", "買[か]われ"],
        answer: 0, explain: "買う → 買おう (う-dan menjadi お-dan + う).",
        translation: "Saya berniat membeli mobil." },
      { sentence: "ずっと 前[まえ]から 留学[りゅうがく]しよう と 思[おも]って ＿＿。", options: ["います", "みます", "おきます", "しまいます"],
        answer: 0, explain: "〜ようと思っています menyatakan niat yang sudah lama dipegang.",
        translation: "Sejak lama saya berniat belajar ke luar negeri." }
    ],
    "n4-hou-ga-ii": [
      { sentence: "かぜですね。早[はや]く 帰[かえ]った ＿＿ いいですよ。", options: ["ほうが", "ことが", "のが", "ためが"],
        answer: 0, explain: "Saran kuat memakai bentuk た + ほうがいい.",
        translation: "Anda masuk angin ya. Sebaiknya pulang lebih awal." },
      { sentence: "むりを し＿＿ ほうが いいです。", options: ["ない", "なくて", "ず", "なく"],
        answer: 0, explain: "Saran negatif memakai bentuk ない (bukan なかった): しないほうがいい.",
        translation: "Sebaiknya jangan memaksakan diri." },
      { sentence: "野菜[やさい]を もっと 食[た]べた ほうが ＿＿。", options: ["いいです", "います", "あります", "します"],
        answer: 0, explain: "Pola tetap: 〜たほうがいいです.",
        translation: "Sebaiknya kamu makan sayur lebih banyak." },
      { sentence: "雨[あめ]が 降[ふ]りそうだから、かさを 持[も]って行[い]った ＿＿ いい。", options: ["ほうが", "ことが", "ものが", "はずが"],
        answer: 0, explain: "Saran berdasarkan situasi: 〜たほうがいい.",
        translation: "Sepertinya akan hujan, sebaiknya bawa payung." },
      { sentence: "お酒[さけ]を 飲[の]みすぎない ほうが ＿＿ と 思[おも]います。", options: ["いい", "ある", "する", "なる"],
        answer: 0, explain: "ほうがいい bisa dilembutkan dengan と思います.",
        translation: "Saya rasa sebaiknya jangan minum alkohol berlebihan." }
    ],
    "n4-sou-youtai": [
      { sentence: "この ケーキは おいし＿＿ ですね。", options: ["そう", "そうだ", "よう", "らしい"],
        answer: 0, explain: "様態 そう: い-adjektiva buang い → おいしそう. Berdasarkan penampakan langsung.",
        translation: "Kue ini kelihatannya enak ya." },
      { sentence: "今[いま]にも 雨[あめ]が 降[ふ]り＿＿ です。", options: ["そう", "そうだ", "らしい", "よう"],
        answer: 0, explain: "Kata kerja memakai batang ます + そう: 降ります → 降りそう.",
        translation: "Sebentar lagi sepertinya akan turun hujan." },
      { sentence: "この 問題[もんだい]は かんたん＿＿ に 見[み]えます。", options: ["そう", "そうだ", "らしい", "みたい"],
        answer: 0, explain: "な-adjektiva langsung + そう: かんたんそう.",
        translation: "Soal ini kelihatannya mudah." },
      { sentence: "彼[かれ]は 元気[げんき]が ＿＿ そうです。", options: ["なさ", "ない", "なく", "なさそうな"],
        answer: 0, explain: "ない adalah pengecualian: ない → なさそう, bukan なそう.",
        translation: "Dia kelihatannya tidak bersemangat." },
      { sentence: "たなの 上[うえ]の 箱[はこ]が ＿＿ そうです。", options: ["落[お]ち", "落[お]ちる", "落[お]ちて", "落[お]ちた"],
        answer: 0, explain: "様態 そう memakai batang ます: 落ちます → 落ちそう (hampir jatuh).",
        translation: "Kotak di atas rak sepertinya mau jatuh." }
    ],
    "n4-sou-denbun": [
      { sentence: "天気[てんき]よほうに よると、あしたは 雨[あめ]だ ＿＿ です。", options: ["そう", "よう", "らしく", "みたい"],
        answer: 0, explain: "伝聞 そう memakai bentuk BIASA + そうです. Kata benda tetap memakai だ.",
        translation: "Menurut ramalan cuaca, besok katanya hujan." },
      { sentence: "田中[たなか]さんは 来月[らいげつ] 結婚[けっこん]する ＿＿ です。", options: ["そう", "そうな", "よう", "らしく"],
        answer: 0, explain: "Bentuk kamus + そうです = informasi yang didengar.",
        translation: "Katanya Tanaka akan menikah bulan depan." },
      { sentence: "ニュースに よると、地震[じしん]が あった ＿＿ です。", options: ["そう", "よう", "みたい", "らしく"],
        answer: 0, explain: "〜によると sering berpasangan dengan 伝聞 そうです.",
        translation: "Menurut berita, katanya terjadi gempa." },
      { sentence: "この 店[みせ]の ラーメンは おいしい ＿＿ です。", options: ["そう", "そうな", "そうに", "よう"],
        answer: 0, explain: "伝聞: い-adjektiva TIDAK dibuang い-nya — おいしいそうです (kabar), beda dari おいしそうです (penampakan).",
        translation: "Katanya ramen di toko ini enak." },
      { sentence: "彼[かれ]は 来[こ]ない ＿＿ です。", options: ["そう", "そうに", "ような", "らしく"],
        answer: 0, explain: "Bentuk biasa negatif + そうです untuk menyampaikan kabar.",
        translation: "Katanya dia tidak akan datang." }
    ],
    "n4-you-mitai": [
      { sentence: "だれか 来[き]た ＿＿ です。玄関[げんかん]に くつが あります。", options: ["よう", "そう", "らしく", "みたいな"],
        answer: 0, explain: "ようだ = dugaan berdasarkan bukti yang pembicara lihat sendiri.",
        translation: "Sepertinya ada yang datang. Ada sepatu di pintu masuk." },
      { sentence: "かぜを ひいた ＿＿ です。熱[ねつ]が あります。", options: ["みたい", "そう", "らしく", "ような"],
        answer: 0, explain: "みたいです adalah versi percakapan dari ようです.",
        translation: "Sepertinya saya masuk angin. Badan saya demam." },
      { sentence: "この ケーキは 雲[くも]の ＿＿ やわらかいです。", options: ["ように", "そうに", "らしく", "みたいな"],
        answer: 0, explain: "N + の + ように + adjektiva = perumpamaan \"seperti\".",
        translation: "Kue ini lembut seperti awan." },
      { sentence: "彼[かれ]は 日本人[にほんじん]の ＿＿ 日本語[にほんご]を 話[はな]します。", options: ["ように", "ような", "そうに", "らしくて"],
        answer: 0, explain: "Menerangkan KATA KERJA memakai ように; ような untuk menerangkan kata benda.",
        translation: "Dia berbicara bahasa Jepang seperti orang Jepang." },
      { sentence: "子[こ]ども ＿＿ な 字[じ]ですね。", options: ["みたい", "よう", "そう", "らしい"],
        answer: 0, explain: "みたい berperilaku seperti な-adjektiva: 子どもみたいな字.",
        translation: "Tulisannya seperti tulisan anak-anak ya." }
    ],
    "n4-rashii": [
      { sentence: "となりの 部屋[へや]は だれも いない ＿＿ です。", options: ["らしい", "そうな", "ような", "みたいな"],
        answer: 0, explain: "らしい = dugaan berdasarkan kabar/bukti dari luar, bukan perasaan pembicara.",
        translation: "Sepertinya di kamar sebelah tidak ada siapa-siapa." },
      { sentence: "きょうは 春[はる] ＿＿ あたたかい 日[ひ]ですね。", options: ["らしい", "そうな", "ような", "みたい"],
        answer: 0, explain: "N + らしい juga berarti \"khas/pantas sebagai\": 春らしい = terasa benar-benar seperti musim semi.",
        translation: "Hari ini hangat, benar-benar khas musim semi ya." },
      { sentence: "彼[かれ]は 試験[しけん]に 合格[ごうかく]した ＿＿ です。", options: ["らしい", "らしく", "らしくて", "らしいな"],
        answer: 0, explain: "Bentuk biasa + らしいです untuk menyampaikan dugaan dari kabar.",
        translation: "Sepertinya dia lulus ujian." },
      { sentence: "男[おとこ]＿＿ 男[おとこ]だと 言[い]われました。", options: ["らしい", "そうな", "ような", "みたいな"],
        answer: 0, explain: "N + らしい + N yang sama = \"benar-benar pantas disebut\".",
        translation: "Dia dibilang laki-laki yang benar-benar jantan." },
      { sentence: "あの 店[みせ]は 今日[きょう] 休[やす]み ＿＿ ですよ。", options: ["らしい", "らしく", "らしいの", "らしくて"],
        answer: 0, explain: "Kata benda + らしい langsung tanpa だ: 休みらしいです.",
        translation: "Sepertinya toko itu hari ini tutup." }
    ],
    "n4-toki": [
      { sentence: "子[こ]どもの ＿＿、よく 川[かわ]で 泳[およ]ぎました。", options: ["とき", "ときに は", "ころに", "あいだ"],
        answer: 0, explain: "Kata benda + の + とき: 子どものとき.",
        translation: "Waktu kecil, saya sering berenang di sungai." },
      { sentence: "日本[にほん]へ 行[い]く ＿＿、パスポートが 要[い]ります。", options: ["とき", "ときは ない", "ながら", "あいだに"],
        answer: 0, explain: "Bentuk kamus + とき = sebelum/menjelang tindakan itu selesai.",
        translation: "Saat hendak pergi ke Jepang, paspor diperlukan." },
      { sentence: "国[くに]へ 帰[かえ]った ＿＿、友[とも]だちに 会[あ]いました。", options: ["とき", "ながら", "あいだ", "うちに"],
        answer: 0, explain: "Bentuk た + とき = setelah tindakan itu selesai. Bandingkan 帰るとき (sebelum sampai).",
        translation: "Ketika sudah pulang ke negara saya, saya bertemu teman." },
      { sentence: "ひま＿＿ とき、本[ほん]を 読[よ]みます。", options: ["な", "の", "だ", "で"],
        answer: 0, explain: "な-adjektiva + な + とき: ひまなとき.",
        translation: "Saat senggang, saya membaca buku." },
      { sentence: "寒[さむ]い ＿＿ は、あたたかい ものを 食[た]べましょう。", options: ["とき", "ところ", "あいだ", "ほう"],
        answer: 0, explain: "い-adjektiva langsung + とき: 寒いとき.",
        translation: "Saat dingin, ayo makan makanan hangat." }
    ],
    "n4-tameni-youni": [
      { sentence: "日本[にほん]で 働[はたら]く ＿＿、日本語[にほんご]を 勉強[べんきょう]しています。", options: ["ために", "ように", "のに", "ところに"],
        answer: 0, explain: "ために dipakai saat subjek sama dan tindakannya disengaja (V kamus/kehendak).",
        translation: "Untuk bekerja di Jepang, saya belajar bahasa Jepang." },
      { sentence: "よく 聞[き]こえる ＿＿、大[おお]きい 声[こえ]で 話[はな]します。", options: ["ように", "ために", "のに", "ばかりに"],
        answer: 0, explain: "ように dipakai dengan kata kerja potensial/tak disengaja (聞こえる).",
        translation: "Agar terdengar jelas, saya berbicara dengan suara keras." },
      { sentence: "忘[わす]れない ＿＿、メモを します。", options: ["ように", "ために", "のに", "ところに"],
        answer: 0, explain: "Bentuk ない selalu memakai ように, tidak pernah ために.",
        translation: "Agar tidak lupa, saya membuat catatan." },
      { sentence: "家族[かぞく]の ＿＿、一生懸命[いっしょうけんめい] 働[はたら]きます。", options: ["ために", "ように", "のに", "そうに"],
        answer: 0, explain: "Kata benda + の + ために = demi/untuk kepentingan.",
        translation: "Demi keluarga, saya bekerja keras." },
      { sentence: "子[こ]どもが 病気[びょうき]に ならない ＿＿、気[き]を つけて います。", options: ["ように", "ために", "ことに", "ところに"],
        answer: 0, explain: "Harapan atas hal di luar kendali + bentuk ない → ように.",
        translation: "Agar anak saya tidak sakit, saya selalu berhati-hati." }
    ],
    "n4-noni": [
      { sentence: "たくさん 勉強[べんきょう]した ＿＿、合格[ごうかく]できませんでした。", options: ["のに", "ので", "から", "たら"],
        answer: 0, explain: "のに menyatakan hasil yang berlawanan dengan harapan.",
        translation: "Padahal sudah banyak belajar, saya tidak lulus." },
      { sentence: "まだ 四月[しがつ]な ＿＿、とても 暑[あつ]いです。", options: ["のに", "ので", "から", "ても"],
        answer: 0, explain: "Kata benda + な + のに: 四月なのに.",
        translation: "Padahal masih bulan April, tapi sangat panas." },
      { sentence: "約束[やくそく]した ＿＿、彼[かれ]は 来[こ]なかった。", options: ["のに", "ので", "たら", "なら"],
        answer: 0, explain: "のに sering membawa nada kecewa/protes.",
        translation: "Padahal sudah janji, dia tidak datang." },
      { sentence: "この 店[みせ]は 安[やす]い ＿＿、あまり 客[きゃく]が いません。", options: ["のに", "ので", "から", "ば"],
        answer: 0, explain: "Fakta dan akibatnya tidak sejalan → のに.",
        translation: "Padahal toko ini murah, tapi pembelinya sedikit." },
      { sentence: "あんなに 元気[げんき]だった ＿＿、急[きゅう]に 入院[にゅういん]したそうです。", options: ["のに", "ので", "たら", "と"],
        answer: 0, explain: "な-adjektiva lampau 元気だった + のに.",
        translation: "Padahal dulu sehat sekali, katanya tiba-tiba dirawat di rumah sakit." }
    ],
    "n4-temo": [
      { sentence: "雨[あめ]が 降[ふ]っ＿＿、試合[しあい]を します。", options: ["ても", "たら", "ば", "から"],
        answer: 0, explain: "〜ても = \"meskipun\", hasilnya tetap sama.",
        translation: "Meskipun hujan, pertandingan tetap dilaksanakan." },
      { sentence: "高[たか]く＿＿、買[か]いたいです。", options: ["ても", "たら", "れば", "ては"],
        answer: 0, explain: "い-adjektiva: 高い → 高くても.",
        translation: "Meskipun mahal, saya tetap ingin membelinya." },
      { sentence: "日曜日[にちようび]＿＿、仕事[しごと]が あります。", options: ["でも", "ても", "だても", "なでも"],
        answer: 0, explain: "Kata benda/な-adjektiva memakai でも: 日曜日でも.",
        translation: "Meskipun hari Minggu, saya tetap ada pekerjaan." },
      { sentence: "いくら 説明[せつめい]し＿＿、わかって くれません。", options: ["ても", "たら", "れば", "たり"],
        answer: 0, explain: "いくら〜ても = \"sebanyak apa pun\".",
        translation: "Sebanyak apa pun saya jelaskan, dia tetap tidak mau mengerti." },
      { sentence: "どんなに 忙[いそが]しく＿＿、朝[あさ]ごはんは 食[た]べます。", options: ["ても", "たら", "ては", "ながら"],
        answer: 0, explain: "どんなに〜ても menekankan tingkat yang ekstrem.",
        translation: "Sesibuk apa pun, saya tetap sarapan." }
    ]
  },

  jlptBuild: {
    // ---------------- N5 ----------------
    "n5-desu": [
      { chunks: ["わたしの", "父[ちち]は", "先生[せんせい]", "です"], starIndex: 2, suffix: "。", translation: "Ayah saya adalah seorang guru." },
      { chunks: ["きのうの", "テストは", "かんたん", "でした"], starIndex: 2, suffix: "。", translation: "Ujian kemarin mudah." },
      { chunks: ["あの 人[ひと]は", "わたしの", "友[とも]だちじゃ", "ありません"], starIndex: 2, suffix: "。", translation: "Orang itu bukan teman saya." },
      { chunks: ["これは", "日本[にほん]の", "車[くるま]", "ですか"], starIndex: 1, suffix: "。", translation: "Apakah ini mobil buatan Jepang?" },
      { chunks: ["わたしの", "しゅみは", "音楽[おんがく]を", "聞[き]くことです"], starIndex: 2, suffix: "。", translation: "Hobi saya adalah mendengarkan musik." }
    ],
    "n5-wa-ga": [
      { chunks: ["あそこに", "大[おお]きい", "猫[ねこ]が", "います"], starIndex: 2, suffix: "。", translation: "Di sana ada kucing besar." },
      { chunks: ["わたしは", "あまい", "ものが", "好[す]きです"], starIndex: 2, suffix: "。", translation: "Saya suka makanan manis." },
      { chunks: ["兄[あに]は", "せが", "とても", "高[たか]いです"], starIndex: 1, suffix: "。", translation: "Kakak laki-laki saya sangat tinggi." },
      { chunks: ["この へやは", "まどが", "大[おお]きくて", "明[あか]るいです"], starIndex: 1, suffix: "。", translation: "Kamar ini jendelanya besar dan terang." },
      { chunks: ["だれが", "この", "しゃしんを", "とりましたか"], starIndex: 2, suffix: "。", translation: "Siapa yang mengambil foto ini?" }
    ],
    "n5-o-ni-de": [
      { chunks: ["毎朝[まいあさ]", "七時[しちじ]に", "うちを", "出[で]ます"], starIndex: 2, suffix: "。", translation: "Setiap pagi saya keluar rumah pukul tujuh." },
      { chunks: ["図書館[としょかん]で", "日本語[にほんご]の", "本[ほん]を", "読[よ]みます"], starIndex: 2, suffix: "。", translation: "Saya membaca buku bahasa Jepang di perpustakaan." },
      { chunks: ["日曜日[にちようび]に", "家族[かぞく]と", "公園[こうえん]へ", "行[い]きました"], starIndex: 2, suffix: "。", translation: "Hari Minggu saya pergi ke taman bersama keluarga." },
      { chunks: ["バスで", "駅[えき]まで", "行[い]く ことが", "できます"], starIndex: 1, suffix: "。", translation: "Bisa pergi ke stasiun dengan bus." },
      { chunks: ["毎朝[まいあさ]", "公園[こうえん]を", "三十分[さんじゅっぷん]", "散歩[さんぽ]します"], starIndex: 1, suffix: "。", translation: "Setiap pagi saya berjalan-jalan di taman selama tiga puluh menit." }
    ],
    "n5-arimasu-imasu": [
      { chunks: ["つくえの", "上[うえ]に", "本[ほん]が", "あります"], starIndex: 2, suffix: "。", translation: "Di atas meja ada buku." },
      { chunks: ["きょうしつに", "学生[がくせい]が", "三人[さんにん]", "います"], starIndex: 2, suffix: "。", translation: "Di ruang kelas ada tiga siswa." },
      { chunks: ["駅[えき]の", "前[まえ]に", "大[おお]きい", "銀行[ぎんこう]が あります"], starIndex: 2, suffix: "。", translation: "Di depan stasiun ada bank besar." },
      { chunks: ["わたしは", "日本[にほん]に", "友[とも]だちが", "います"], starIndex: 2, suffix: "。", translation: "Saya punya teman di Jepang." },
      { chunks: ["れいぞうこの", "中[なか]には", "何[なに]も", "ありません"], starIndex: 2, suffix: "。", translation: "Di dalam kulkas tidak ada apa-apa." }
    ],
    "n5-masu": [
      { chunks: ["あした", "友[とも]だちと", "映画[えいが]を", "見[み]ます"], starIndex: 2, suffix: "。", translation: "Besok saya akan menonton film bersama teman." },
      { chunks: ["きのうは", "どこへも", "行[い]き", "ませんでした"], starIndex: 2, suffix: "。", translation: "Kemarin saya tidak pergi ke mana pun." },
      { chunks: ["毎晩[まいばん]", "十一時[じゅういちじ]に", "寝[ね]ることに", "しています"], starIndex: 1, suffix: "。", translation: "Setiap malam saya membiasakan tidur pukul sebelas." },
      { chunks: ["わたしは", "お酒[さけ]を", "ぜんぜん", "飲[の]みません"], starIndex: 2, suffix: "。", translation: "Saya sama sekali tidak minum alkohol." },
      { chunks: ["先週[せんしゅう]の", "土曜日[どようび]に", "母[はは]と", "買[か]い物[もの]しました"], starIndex: 2, suffix: "。", translation: "Sabtu minggu lalu saya berbelanja bersama ibu." }
    ],
    "n5-iadj-nadj": [
      { chunks: ["この", "料理[りょうり]は", "あまり", "おいしくないです"], starIndex: 2, suffix: "。", translation: "Masakan ini tidak terlalu enak." },
      { chunks: ["きのう 見[み]た", "映画[えいが]は", "とても", "おもしろかったです"], starIndex: 2, suffix: "。", translation: "Film yang saya tonton kemarin sangat menarik." },
      { chunks: ["わたしは", "しずかな", "町[まち]に", "住[す]んでいます"], starIndex: 1, suffix: "。", translation: "Saya tinggal di kota yang tenang." },
      { chunks: ["この かばんは", "安[やす]くて", "じょうぶだから", "買[か]いました"], starIndex: 2, suffix: "。", translation: "Tas ini murah dan kuat, jadi saya beli." },
      { chunks: ["きょうは", "あまり", "さむく", "ありません"], starIndex: 2, suffix: "。", translation: "Hari ini tidak terlalu dingin." }
    ],
    "n5-tai-hoshii": [
      { chunks: ["わたしは", "新[あたら]しい", "じてんしゃが", "ほしいです"], starIndex: 2, suffix: "。", translation: "Saya ingin sepeda baru." },
      { chunks: ["今年[ことし]の 夏[なつ]は", "日本[にほん]へ", "行[い]きたいと", "思[おも]っています"], starIndex: 2, suffix: "。", translation: "Musim panas ini saya ingin pergi ke Jepang." },
      { chunks: ["おなかが いっぱいで", "今[いま]は", "何[なに]も", "食[た]べたくないです"], starIndex: 2, suffix: "。", translation: "Perut saya kenyang, sekarang tidak ingin makan apa-apa." },
      { chunks: ["子[こ]どもの とき", "医者[いしゃ]に", "なりたかった", "そうです"], starIndex: 2, suffix: "。", translation: "Katanya waktu kecil dia ingin menjadi dokter." },
      { chunks: ["弟[おとうと]は", "新[あたら]しい", "ゲームを", "ほしがっています"], starIndex: 2, suffix: "。", translation: "Adik laki-laki saya menginginkan game baru." }
    ],
    "n5-kudasai-mashou": [
      { chunks: ["ここに", "お名前[なまえ]を", "書[か]いて", "ください"], starIndex: 2, suffix: "。", translation: "Tolong tulis nama Anda di sini." },
      { chunks: ["いっしょに", "昼[ひる]ごはんを", "食[た]べに", "行[い]きましょう"], starIndex: 2, suffix: "。", translation: "Mari kita pergi makan siang bersama." },
      { chunks: ["おもそうですね", "荷物[にもつ]を", "持[も]ち", "ましょうか"], starIndex: 2, suffix: "。", translation: "Kelihatannya berat, mari saya bawakan barangnya?" },
      { chunks: ["すみませんが", "もう 一度[いちど]", "ゆっくり", "言[い]ってください"], starIndex: 2, suffix: "。", translation: "Maaf, tolong ucapkan sekali lagi dengan pelan." },
      { chunks: ["ここでは", "しゃしんを", "とらないで", "ください"], starIndex: 2, suffix: "。", translation: "Tolong jangan mengambil foto di sini." }
    ],
    "n5-teimasu": [
      { chunks: ["今[いま]", "そとは", "雨[あめ]が", "降[ふ]っています"], starIndex: 2, suffix: "。", translation: "Sekarang di luar sedang turun hujan." },
      { chunks: ["兄[あに]は", "銀行[ぎんこう]で", "五年[ごねん]", "働[はたら]いています"], starIndex: 2, suffix: "。", translation: "Kakak laki-laki saya sudah lima tahun bekerja di bank." },
      { chunks: ["田中[たなか]さんは", "去年[きょねん]", "結婚[けっこん]して", "います"], starIndex: 2, suffix: "。", translation: "Tuan Tanaka sudah menikah sejak tahun lalu." },
      { chunks: ["さむいですね", "まどが", "開[あ]いて", "いますよ"], starIndex: 2, suffix: "。", translation: "Dingin ya, jendelanya terbuka lho." },
      { chunks: ["毎朝[まいあさ]", "公園[こうえん]で", "ジョギングを", "しています"], starIndex: 2, suffix: "。", translation: "Setiap pagi saya jogging di taman." }
    ],
    "n5-temoii-tehaikenai": [
      { chunks: ["ここで", "しゃしんを", "とっても", "いいですか"], starIndex: 2, suffix: "。", translation: "Bolehkah saya mengambil foto di sini?" },
      { chunks: ["この へやで", "たばこを", "吸[す]っては", "いけません"], starIndex: 2, suffix: "。", translation: "Dilarang merokok di ruangan ini." },
      { chunks: ["しけんちゅうは", "となりの 人[ひと]と", "話[はな]しては", "いけません"], starIndex: 2, suffix: "。", translation: "Selama ujian dilarang berbicara dengan orang di sebelah." },
      { chunks: ["えんぴつで", "名前[なまえ]を", "書[か]いても", "いいです"], starIndex: 2, suffix: "。", translation: "Boleh menulis nama dengan pensil." },
      { chunks: ["ここに", "車[くるま]を", "止[と]めても", "いいですか"], starIndex: 2, suffix: "。", translation: "Bolehkah saya memarkir mobil di sini?" }
    ],
    "n5-nakerebanaranai": [
      { chunks: ["あしたは", "六時[ろくじ]に", "起[お]きなければ", "なりません"], starIndex: 2, suffix: "。", translation: "Besok saya harus bangun pukul enam." },
      { chunks: ["土曜日[どようび]は", "学校[がっこう]へ", "行[い]かなくても", "いいです"], starIndex: 2, suffix: "。", translation: "Hari Sabtu tidak perlu pergi ke sekolah." },
      { chunks: ["毎日[まいにち]", "このくすりを", "飲[の]まなければ", "なりません"], starIndex: 2, suffix: "。", translation: "Setiap hari saya harus minum obat ini." },
      { chunks: ["空港[くうこう]では", "パスポートを", "見[み]せなくては", "いけません"], starIndex: 2, suffix: "。", translation: "Di bandara harus menunjukkan paspor." },
      { chunks: ["きょうは", "残業[ざんぎょう]を", "しなくても", "いいですか"], starIndex: 2, suffix: "。", translation: "Apakah hari ini saya tidak perlu lembur?" }
    ],
    "n5-yori-houga-ichiban": [
      { chunks: ["電車[でんしゃ]は", "バスより", "ずっと", "速[はや]いです"], starIndex: 2, suffix: "。", translation: "Kereta jauh lebih cepat daripada bus." },
      { chunks: ["コーヒーより", "お茶[ちゃ]の", "ほうが", "好[す]きです"], starIndex: 2, suffix: "。", translation: "Saya lebih suka teh daripada kopi." },
      { chunks: ["くだものの", "中[なか]で", "りんごが", "一番[いちばん] 好[す]きです"], starIndex: 2, suffix: "。", translation: "Di antara buah-buahan, saya paling suka apel." },
      { chunks: ["日本語[にほんご]と", "英語[えいご]と", "どちらが", "むずかしいですか"], starIndex: 2, suffix: "。", translation: "Mana yang lebih sulit, bahasa Jepang atau Inggris?" },
      { chunks: ["きょうは", "きのうほど", "さむく", "ありません"], starIndex: 2, suffix: "。", translation: "Hari ini tidak sedingin kemarin." }
    ],
    // ---------------- N4 ----------------
    "n4-to-omou": [
      { chunks: ["あしたは", "たぶん 雨[あめ]が", "降[ふ]ると", "思[おも]います"], starIndex: 2, suffix: "。", translation: "Saya pikir besok mungkin akan hujan." },
      { chunks: ["先生[せんせい]は", "あした テストが", "あると", "言[い]いました"], starIndex: 2, suffix: "。", translation: "Guru berkata besok ada ujian." },
      { chunks: ["この 花[はな]は", "日本語[にほんご]で", "さくらと", "言[い]います"], starIndex: 2, suffix: "。", translation: "Bunga ini dalam bahasa Jepang disebut sakura." },
      { chunks: ["田中[たなか]さんという", "人[ひと]から", "電話[でんわ]が", "ありました"], starIndex: 1, suffix: "。", translation: "Ada telepon dari orang bernama Tanaka." },
      { chunks: ["その 話[はなし]は", "本当[ほんとう]じゃないと", "わたしは", "思[おも]います"], starIndex: 1, suffix: "。", translation: "Saya rasa cerita itu tidak benar." }
    ],
    "n4-deshou": [
      { chunks: ["あしたは", "たぶん", "いい 天気[てんき]に", "なるでしょう"], starIndex: 2, suffix: "。", translation: "Besok mungkin cuacanya akan bagus." },
      { chunks: ["この 問題[もんだい]は", "学生[がくせい]には", "むずかしい", "でしょう"], starIndex: 2, suffix: "。", translation: "Soal ini mungkin sulit bagi siswa." },
      { chunks: ["あの 人[ひと]は", "今日[きょう]は", "来[こ]ない", "でしょうね"], starIndex: 2, suffix: "。", translation: "Orang itu mungkin tidak datang hari ini ya." },
      { chunks: ["彼[かれ]は", "日本[にほん]に", "住[す]んでいたから", "日本語[にほんご]が 上手[じょうず]でしょう"], starIndex: 2, suffix: "。", translation: "Karena pernah tinggal di Jepang, bahasa Jepangnya pasti bagus." },
      { chunks: ["この 時間[じかん]なら", "道[みち]は", "こんで", "いないだろう"], starIndex: 2, suffix: "。", translation: "Kalau jam segini, jalanan mungkin tidak macet." }
    ],
    "n4-kara": [
      { chunks: ["時間[じかん]が", "ないから", "タクシーで", "行[い]きましょう"], starIndex: 2, suffix: "。", translation: "Karena tidak ada waktu, ayo pergi naik taksi." },
      { chunks: ["さむいですから", "まどを", "閉[し]めて", "ください"], starIndex: 2, suffix: "。", translation: "Karena dingin, tolong tutup jendelanya." },
      { chunks: ["今日[きょう]は", "日曜日[にちようび]だから", "銀行[ぎんこう]は", "休[やす]みです"], starIndex: 2, suffix: "。", translation: "Karena hari ini Minggu, bank tutup." },
      { chunks: ["電車[でんしゃ]が", "止[と]まったから", "会社[かいしゃ]に", "遅[おく]れました"], starIndex: 2, suffix: "。", translation: "Karena keretanya berhenti, saya terlambat ke kantor." },
      { chunks: ["ここは", "危[あぶ]ないですから", "入[はい]らないで", "ください"], starIndex: 2, suffix: "。", translation: "Karena di sini berbahaya, tolong jangan masuk." }
    ],
    "n4-node": [
      { chunks: ["道[みち]が", "こんでいたので", "約束[やくそく]の 時間[じかん]に", "遅[おく]れました"], starIndex: 2, suffix: "。", translation: "Karena jalanan macet, saya terlambat dari waktu janji." },
      { chunks: ["体[からだ]の", "調子[ちょうし]が 悪[わる]いので", "今日[きょう]は", "休[やす]ませてください"], starIndex: 2, suffix: "。", translation: "Karena kondisi badan kurang baik, izinkan saya istirahat hari ini." },
      { chunks: ["ここは", "図書館[としょかん]なので", "静[しず]かに", "してください"], starIndex: 2, suffix: "。", translation: "Karena ini perpustakaan, tolong tenang." },
      { chunks: ["まだ", "子[こ]どもなので", "むずかしいことは", "わかりません"], starIndex: 2, suffix: "。", translation: "Karena masih anak-anak, dia tidak paham hal yang sulit." },
      { chunks: ["雨[あめ]が", "降[ふ]っているので", "今日[きょう]は", "出[で]かけません"], starIndex: 2, suffix: "。", translation: "Karena sedang hujan, hari ini saya tidak keluar." }
    ],
    "n4-shi": [
      { chunks: ["この 店[みせ]は", "安[やす]いし", "おいしいから", "よく 来[き]ます"], starIndex: 1, suffix: "。", translation: "Toko ini murah dan enak, jadi saya sering ke sini." },
      { chunks: ["今日[きょう]は", "天気[てんき]も いいし", "散歩[さんぽ]でも", "しましょうか"], starIndex: 1, suffix: "。", translation: "Hari ini cuacanya bagus, bagaimana kalau jalan-jalan?" },
      { chunks: ["彼[かれ]は", "まじめだし", "よく", "働[はたら]きます"], starIndex: 1, suffix: "。", translation: "Dia serius dan rajin bekerja." },
      { chunks: ["お金[かね]も", "ないし", "時間[じかん]も", "ありません"], starIndex: 1, suffix: "。", translation: "Tidak punya uang, waktu pun tidak ada." },
      { chunks: ["雨[あめ]も", "降[ふ]っているし", "今日[きょう]は", "家[いえ]に います"], starIndex: 1, suffix: "。", translation: "Lagi pula sedang hujan, hari ini saya di rumah." }
    ],
    "n4-ndesu": [
      { chunks: ["どうして", "きのう", "来[こ]なかった", "んですか"], starIndex: 2, suffix: "。", translation: "Kenapa kemarin kamu tidak datang?" },
      { chunks: ["顔色[かおいろ]が", "悪[わる]いですね", "頭[あたま]が", "痛[いた]いんです"], starIndex: 2, suffix: "。", translation: "Wajahmu pucat ya. — Kepala saya sakit." },
      { chunks: ["実[じつ]は", "来月[らいげつ]", "国[くに]へ", "帰[かえ]るんです"], starIndex: 2, suffix: "。", translation: "Sebenarnya bulan depan saya pulang ke negara saya." },
      { chunks: ["道[みち]が", "わからないんですが", "駅[えき]は", "どこですか"], starIndex: 1, suffix: "。", translation: "Saya tidak tahu jalannya, stasiun di mana ya?" },
      { chunks: ["今日[きょう]は", "店[みせ]が", "休[やす]みなんです", "から 行[い]けません"], starIndex: 2, suffix: "。", translation: "Hari ini tokonya tutup, jadi tidak bisa pergi." }
    ],
    "n4-tara": [
      { chunks: ["駅[えき]に", "着[つ]いたら", "電話[でんわ]して", "ください"], starIndex: 1, suffix: "。", translation: "Kalau sudah sampai stasiun, tolong telepon." },
      { chunks: ["もし", "時間[じかん]が あったら", "手伝[てつだ]って", "ください"], starIndex: 1, suffix: "。", translation: "Kalau ada waktu, tolong bantu saya." },
      { chunks: ["家[いえ]に", "帰[かえ]ったら", "だれも", "いませんでした"], starIndex: 1, suffix: "。", translation: "Ketika pulang, ternyata tidak ada siapa-siapa." },
      { chunks: ["この くすりを", "飲[の]んだら", "すぐ", "よくなりますよ"], starIndex: 1, suffix: "。", translation: "Kalau minum obat ini, akan segera membaik." },
      { chunks: ["大人[おとな]に", "なったら", "この 気持[きも]ちが", "わかりますよ"], starIndex: 1, suffix: "。", translation: "Kalau sudah dewasa, kamu akan mengerti perasaan ini." }
    ],
    "n4-ba": [
      { chunks: ["この ボタンを", "押[お]せば", "切符[きっぷ]が", "出[で]ます"], starIndex: 1, suffix: "。", translation: "Kalau menekan tombol ini, karcisnya keluar." },
      { chunks: ["毎日[まいにち]", "練習[れんしゅう]すれば", "きっと", "上手[じょうず]になります"], starIndex: 1, suffix: "。", translation: "Kalau berlatih setiap hari, pasti akan mahir." },
      { chunks: ["わからなければ", "いつでも", "わたしに", "聞[き]いてください"], starIndex: 2, suffix: "。", translation: "Kalau tidak mengerti, tanyakan pada saya kapan saja." },
      { chunks: ["天気[てんき]が", "よければ", "ここから", "富士山[ふじさん]が 見[み]えます"], starIndex: 1, suffix: "。", translation: "Kalau cuacanya bagus, dari sini Gunung Fuji terlihat." },
      { chunks: ["もう 少[すこ]し", "安[やす]ければ", "すぐ", "買[か]うんですが"], starIndex: 1, suffix: "。", translation: "Kalau sedikit lebih murah, saya akan langsung membelinya." }
    ],
    "n4-to-cond": [
      { chunks: ["春[はる]に", "なると", "この 公園[こうえん]は", "桜[さくら]が きれいです"], starIndex: 1, suffix: "。", translation: "Kalau musim semi tiba, sakura di taman ini indah." },
      { chunks: ["まっすぐ", "行[い]くと", "右[みぎ]に", "駅[えき]が あります"], starIndex: 1, suffix: "。", translation: "Kalau jalan lurus, di kanan ada stasiun." },
      { chunks: ["この つまみを", "右[みぎ]に まわすと", "音[おと]が", "大[おお]きくなります"], starIndex: 1, suffix: "。", translation: "Kalau memutar kenop ini ke kanan, suaranya membesar." },
      { chunks: ["窓[まど]を", "開[あ]けると", "きれいな", "海[うみ]が 見[み]えた"], starIndex: 1, suffix: "。", translation: "Begitu membuka jendela, terlihat laut yang indah." },
      { chunks: ["お金[かね]を", "入[い]れると", "赤[あか]い ボタンが", "光[ひか]ります"], starIndex: 1, suffix: "。", translation: "Kalau memasukkan uang, tombol merahnya menyala." }
    ],
    "n4-nara": [
      { chunks: ["日本[にほん]へ", "行[い]くなら", "京都[きょうと]が", "おすすめですよ"], starIndex: 1, suffix: "。", translation: "Kalau mau ke Jepang, Kyoto saya rekomendasikan." },
      { chunks: ["安[やす]い", "パソコンなら", "駅前[えきまえ]の 店[みせ]に", "ありますよ"], starIndex: 1, suffix: "。", translation: "Kalau laptop murah, ada di toko depan stasiun." },
      { chunks: ["そんなに", "忙[いそが]しいなら", "わたしが", "手伝[てつだ]いましょうか"], starIndex: 1, suffix: "。", translation: "Kalau memang sesibuk itu, mari saya bantu?" },
      { chunks: ["田中[たなか]さんなら", "さっき", "帰[かえ]ったと", "思[おも]いますよ"], starIndex: 2, suffix: "。", translation: "Kalau soal Tanaka, saya rasa dia sudah pulang tadi." },
      { chunks: ["あした", "雨[あめ]が 降[ふ]るなら", "出[で]かけるのを", "やめます"], starIndex: 1, suffix: "。", translation: "Kalau besok hujan, saya batalkan keluarnya." }
    ],
    "n4-kanou": [
      { chunks: ["わたしは", "日本語[にほんご]が", "少[すこ]し", "話[はな]せます"], starIndex: 2, suffix: "。", translation: "Saya bisa berbicara bahasa Jepang sedikit." },
      { chunks: ["この 漢字[かんじ]は", "むずかしくて", "わたしには", "読[よ]めません"], starIndex: 2, suffix: "。", translation: "Kanji ini sulit, saya tidak bisa membacanya." },
      { chunks: ["あしたの 会議[かいぎ]に", "田中[たなか]さんは", "来[こ]られないと", "言[い]っていました"], starIndex: 2, suffix: "。", translation: "Katanya Tanaka tidak bisa datang ke rapat besok." },
      { chunks: ["ここから", "富士山[ふじさん]が", "とても きれいに", "見[み]えます"], starIndex: 2, suffix: "。", translation: "Dari sini Gunung Fuji terlihat sangat indah." },
      { chunks: ["朝[あさ] 早[はや]く", "起[お]きられる", "ように", "なりました"], starIndex: 1, suffix: "。", translation: "Saya jadi bisa bangun pagi-pagi." }
    ],
    "n4-dekiru": [
      { chunks: ["わたしは", "ピアノを", "ひく ことが", "できます"], starIndex: 2, suffix: "。", translation: "Saya bisa bermain piano." },
      { chunks: ["ここでは", "写真[しゃしん]を", "撮[と]る ことが", "できません"], starIndex: 2, suffix: "。", translation: "Di sini tidak boleh mengambil foto." },
      { chunks: ["この 店[みせ]では", "カードで", "払[はら]う ことが", "できますか"], starIndex: 2, suffix: "。", translation: "Di toko ini apakah bisa membayar dengan kartu?" },
      { chunks: ["去年[きょねん]までは", "百[ひゃく] メートルも", "泳[およ]ぐ ことが", "できませんでした"], starIndex: 2, suffix: "。", translation: "Sampai tahun lalu saya tidak bisa berenang seratus meter." },
      { chunks: ["インターネットで", "切符[きっぷ]を", "買[か]う ことが", "できます"], starIndex: 2, suffix: "。", translation: "Bisa membeli tiket lewat internet." }
    ],
    "n4-you-ni-naru": [
      { chunks: ["毎日[まいにち] 練習[れんしゅう]して", "百[ひゃく] メートル", "泳[およ]げる ように", "なりました"], starIndex: 2, suffix: "。", translation: "Setelah berlatih tiap hari, saya jadi bisa berenang seratus meter." },
      { chunks: ["日本[にほん]に 来[き]てから", "納豆[なっとう]が", "食[た]べられる ように", "なりました"], starIndex: 2, suffix: "。", translation: "Sejak datang ke Jepang, saya jadi bisa makan natto." },
      { chunks: ["健康[けんこう]の ために", "毎朝[まいあさ]", "運動[うんどう]する ように", "しています"], starIndex: 2, suffix: "。", translation: "Demi kesehatan, saya membiasakan olahraga setiap pagi." },
      { chunks: ["赤[あか]ちゃんが", "一人[ひとり]で", "歩[ある]ける ように", "なりました"], starIndex: 2, suffix: "。", translation: "Bayinya jadi bisa berjalan sendiri." },
      { chunks: ["前[まえ]は 読[よ]めなかったが", "今[いま]は", "新聞[しんぶん]が 読[よ]める ように", "なった"], starIndex: 2, suffix: "。", translation: "Dulu tidak bisa, sekarang saya jadi bisa membaca koran." }
    ],
    "n4-rareru-passive": [
      { chunks: ["わたしは", "きのう", "先生[せんせい]に", "ほめられました"], starIndex: 2, suffix: "。", translation: "Kemarin saya dipuji oleh guru." },
      { chunks: ["こんだ 電車[でんしゃ]の 中[なか]で", "知[し]らない 人[ひと]に", "足[あし]を", "踏[ふ]まれました"], starIndex: 2, suffix: "。", translation: "Di kereta yang penuh, kaki saya terinjak orang tak dikenal." },
      { chunks: ["この お寺[てら]は", "三百年[さんびゃくねん]", "前[まえ]に", "建[た]てられました"], starIndex: 2, suffix: "。", translation: "Kuil ini dibangun tiga ratus tahun yang lalu." },
      { chunks: ["大切[たいせつ]な ケーキを", "弟[おとうと]に", "全部[ぜんぶ]", "食[た]べられました"], starIndex: 2, suffix: "。", translation: "Kue berharga saya dimakan habis oleh adik." },
      { chunks: ["帰[かえ]る とちゅうで", "雨[あめ]に", "降[ふ]られて", "かぜを ひきました"], starIndex: 2, suffix: "。", translation: "Di tengah perjalanan pulang saya kehujanan lalu masuk angin." }
    ],
    "n4-saseru": [
      { chunks: ["先生[せんせい]は", "学生[がくせい]に", "作文[さくぶん]を", "書[か]かせました"], starIndex: 2, suffix: "。", translation: "Guru menyuruh siswa menulis karangan." },
      { chunks: ["母[はは]は", "妹[いもうと]を", "買[か]い物[もの]に", "行[い]かせました"], starIndex: 2, suffix: "。", translation: "Ibu menyuruh adik perempuan pergi berbelanja." },
      { chunks: ["毎日[まいにち]", "子[こ]どもに", "野菜[やさい]を", "食[た]べさせています"], starIndex: 2, suffix: "。", translation: "Setiap hari saya membiasakan anak makan sayur." },
      { chunks: ["すみませんが", "きょうは 早[はや]く", "帰[かえ]らせて", "ください"], starIndex: 2, suffix: "。", translation: "Maaf, izinkan saya pulang lebih awal hari ini." },
      { chunks: ["部長[ぶちょう]に", "一時間[いちじかん]も", "外[そと]で", "待[ま]たされました"], starIndex: 2, suffix: "。", translation: "Saya dibuat menunggu di luar sampai satu jam oleh kepala bagian." }
    ],
    "n4-te-ageru-kureru-morau": [
      { chunks: ["わたしは", "友[とも]だちに", "日本語[にほんご]を", "教[おし]えてあげました"], starIndex: 2, suffix: "。", translation: "Saya mengajari teman bahasa Jepang." },
      { chunks: ["友[とも]だちが", "むずかしい 宿題[しゅくだい]を", "手伝[てつだ]って", "くれました"], starIndex: 2, suffix: "。", translation: "Teman saya membantu PR yang sulit." },
      { chunks: ["わたしは", "先生[せんせい]に", "作文[さくぶん]を", "直[なお]してもらいました"], starIndex: 2, suffix: "。", translation: "Saya minta guru membetulkan karangan saya." },
      { chunks: ["先生[せんせい]が", "わかりやすく", "説明[せつめい]して", "くださいました"], starIndex: 2, suffix: "。", translation: "Guru berkenan menjelaskan dengan mudah dipahami." },
      { chunks: ["たんじょう日[び]に", "父[ちち]に", "新[あたら]しい 時計[とけい]を", "買[か]ってもらいました"], starIndex: 2, suffix: "。", translation: "Saat ulang tahun saya dibelikan jam baru oleh ayah." }
    ],
    "n4-te-shimau": [
      { chunks: ["宿題[しゅくだい]は", "もう", "全部[ぜんぶ]", "やってしまいました"], starIndex: 2, suffix: "。", translation: "PR-nya sudah selesai semua saya kerjakan." },
      { chunks: ["急[いそ]いでいたので", "電車[でんしゃ]に", "かさを", "忘[わす]れてしまいました"], starIndex: 2, suffix: "。", translation: "Karena terburu-buru, saya ketinggalan payung di kereta." },
      { chunks: ["おいしかったので", "ケーキを", "一人[ひとり]で", "全部[ぜんぶ] 食[た]べてしまった"], starIndex: 2, suffix: "。", translation: "Karena enak, kuenya habis saya makan sendiri." },
      { chunks: ["母[はは]に", "もらった", "大切[たいせつ]な 皿[さら]を", "割[わ]ってしまいました"], starIndex: 2, suffix: "。", translation: "Piring berharga pemberian ibu saya pecahkan." },
      { chunks: ["おもしろくて", "その 本[ほん]を", "一日[いちにち]で", "読[よ]んでしまいました"], starIndex: 2, suffix: "。", translation: "Karena menarik, buku itu habis saya baca dalam sehari." }
    ],
    "n4-te-oku": [
      { chunks: ["旅行[りょこう]の 前[まえ]に", "切符[きっぷ]を", "買[か]って", "おきます"], starIndex: 2, suffix: "。", translation: "Sebelum bepergian, saya akan membeli tiket dulu." },
      { chunks: ["使[つか]ったら", "もとの ところに", "もどして", "おいてください"], starIndex: 2, suffix: "。", translation: "Kalau sudah dipakai, kembalikan ke tempat semula." },
      { chunks: ["あしたの 会議[かいぎ]の", "資料[しりょう]を", "コピーして", "おきました"], starIndex: 2, suffix: "。", translation: "Saya sudah menyalin bahan rapat besok." },
      { chunks: ["お客[きゃく]さんが 来[く]るから", "ビールを", "冷[ひ]やして", "おいてね"], starIndex: 2, suffix: "。", translation: "Karena akan ada tamu, dinginkan birnya ya." },
      { chunks: ["あとで 使[つか]うので", "そのままに", "して", "おいてください"], starIndex: 2, suffix: "。", translation: "Karena nanti dipakai, biarkan saja seperti itu." }
    ],
    "n4-te-miru": [
      { chunks: ["この 服[ふく]を", "ちょっと", "着[き]て", "みてもいいですか"], starIndex: 2, suffix: "。", translation: "Bolehkah saya coba pakai baju ini sebentar?" },
      { chunks: ["おいしそうですね", "わたしも", "少[すこ]し", "食[た]べてみます"], starIndex: 2, suffix: "。", translation: "Kelihatannya enak, saya juga coba sedikit." },
      { chunks: ["むずかしいですが", "とにかく", "一度[いちど]", "やってみましょう"], starIndex: 2, suffix: "。", translation: "Memang sulit, tapi ayo coba sekali saja." },
      { chunks: ["いつか", "京都[きょうと]の お寺[てら]へ", "行[い]って", "みたいです"], starIndex: 2, suffix: "。", translation: "Suatu saat saya ingin mencoba pergi ke kuil di Kyoto." },
      { chunks: ["先生[せんせい]に", "聞[き]いて", "みましたが", "わかりませんでした"], starIndex: 1, suffix: "。", translation: "Saya sudah coba tanya guru, tapi tetap tidak paham." }
    ],
    "n4-tsumori": [
      { chunks: ["夏休[なつやす]みに", "国[くに]へ", "帰[かえ]る", "つもりです"], starIndex: 2, suffix: "。", translation: "Saat libur musim panas saya berencana pulang." },
      { chunks: ["体[からだ]に 悪[わる]いから", "たばこは", "もう 吸[す]わない", "つもりです"], starIndex: 2, suffix: "。", translation: "Karena buruk bagi tubuh, saya berniat tidak merokok lagi." },
      { chunks: ["来年[らいねん]の 春[はる]に", "彼女[かのじょ]と", "結婚[けっこん]する", "つもりです"], starIndex: 2, suffix: "。", translation: "Musim semi tahun depan saya berencana menikah dengannya." },
      { chunks: ["行[い]く つもりでしたが", "忙[いそが]しくて", "行[い]く ことが", "できませんでした"], starIndex: 2, suffix: "。", translation: "Saya berniat pergi, tapi karena sibuk jadi tidak bisa." },
      { chunks: ["今年[ことし]は", "しけんを", "受[う]ける つもりは", "ありません"], starIndex: 2, suffix: "。", translation: "Tahun ini saya tidak berniat ikut ujian." }
    ],
    "n4-you-to-omou": [
      { chunks: ["つかれたから", "今日[きょう]は", "早[はや]く", "寝[ね]ようと 思[おも]います"], starIndex: 2, suffix: "。", translation: "Karena lelah, hari ini saya berniat tidur lebih awal." },
      { chunks: ["来月[らいげつ]から", "健康[けんこう]の ために", "運動[うんどう]を", "始[はじ]めようと 思[おも]っています"], starIndex: 2, suffix: "。", translation: "Mulai bulan depan saya berniat mulai olahraga demi kesehatan." },
      { chunks: ["卒業[そつぎょう]したら", "日本[にほん]で", "働[はたら]こうと", "思[おも]っています"], starIndex: 2, suffix: "。", translation: "Setelah lulus, saya berniat bekerja di Jepang." },
      { chunks: ["お金[かね]が たまったら", "新[あたら]しい 車[くるま]を", "買[か]おうと", "思[おも]います"], starIndex: 2, suffix: "。", translation: "Kalau uangnya terkumpul, saya berniat membeli mobil baru." },
      { chunks: ["ずっと 前[まえ]から", "留学[りゅうがく]しようと", "思[おも]って", "いました"], starIndex: 1, suffix: "。", translation: "Sejak lama saya berniat belajar ke luar negeri." }
    ],
    "n4-hou-ga-ii": [
      { chunks: ["かぜですね", "今日[きょう]は", "早[はや]く 帰[かえ]った", "ほうがいいですよ"], starIndex: 2, suffix: "。", translation: "Anda masuk angin ya. Hari ini sebaiknya pulang lebih awal." },
      { chunks: ["体[からだ]に 悪[わる]いから", "むりを", "しない", "ほうがいいです"], starIndex: 2, suffix: "。", translation: "Karena buruk bagi tubuh, sebaiknya jangan memaksakan diri." },
      { chunks: ["健康[けんこう]の ために", "野菜[やさい]を", "もっと 食[た]べた", "ほうがいいですよ"], starIndex: 2, suffix: "。", translation: "Demi kesehatan, sebaiknya makan sayur lebih banyak." },
      { chunks: ["雨[あめ]が 降[ふ]りそうだから", "かさを", "持[も]って行[い]った", "ほうがいい"], starIndex: 2, suffix: "。", translation: "Sepertinya akan hujan, sebaiknya bawa payung." },
      { chunks: ["お酒[さけ]を", "飲[の]みすぎない", "ほうがいいと", "思[おも]います"], starIndex: 1, suffix: "。", translation: "Saya rasa sebaiknya jangan minum berlebihan." }
    ],
    "n4-sou-youtai": [
      { chunks: ["この ケーキは", "とても", "おいし", "そうですね"], starIndex: 2, suffix: "。", translation: "Kue ini kelihatannya sangat enak ya." },
      { chunks: ["空[そら]が 暗[くら]いです", "今[いま]にも", "雨[あめ]が 降[ふ]り", "そうです"], starIndex: 2, suffix: "。", translation: "Langitnya gelap, sebentar lagi sepertinya hujan." },
      { chunks: ["たなの 上[うえ]の", "箱[はこ]が", "今[いま]にも", "落[お]ちそうです"], starIndex: 2, suffix: "。", translation: "Kotak di atas rak sepertinya mau jatuh." },
      { chunks: ["彼[かれ]は", "きのうから", "元気[げんき]が", "なさそうです"], starIndex: 2, suffix: "。", translation: "Sejak kemarin dia kelihatan tidak bersemangat." },
      { chunks: ["この 問題[もんだい]は", "思[おも]ったより", "かんたん", "そうに 見[み]えます"], starIndex: 2, suffix: "。", translation: "Soal ini kelihatannya lebih mudah dari yang saya kira." }
    ],
    "n4-sou-denbun": [
      { chunks: ["天気[てんき]よほうに よると", "あしたは", "雨[あめ]だ", "そうです"], starIndex: 2, suffix: "。", translation: "Menurut ramalan cuaca, besok katanya hujan." },
      { chunks: ["田中[たなか]さんは", "来月[らいげつ]", "結婚[けっこん]する", "そうです"], starIndex: 2, suffix: "。", translation: "Katanya Tanaka akan menikah bulan depan." },
      { chunks: ["ニュースに よると", "きのう", "大[おお]きい 地震[じしん]が", "あったそうです"], starIndex: 2, suffix: "。", translation: "Menurut berita, kemarin katanya ada gempa besar." },
      { chunks: ["友[とも]だちの 話[はなし]では", "この 店[みせ]の ラーメンは", "とても", "おいしいそうです"], starIndex: 2, suffix: "。", translation: "Menurut cerita teman, ramen toko ini katanya sangat enak." },
      { chunks: ["田中[たなか]さんは", "かぜを ひいたので", "今日[きょう]は", "来[こ]ないそうです"], starIndex: 2, suffix: "。", translation: "Katanya Tanaka masuk angin, jadi hari ini tidak datang." }
    ],
    "n4-you-mitai": [
      { chunks: ["玄関[げんかん]に くつが あります", "だれか", "来[き]た", "ようです"], starIndex: 2, suffix: "。", translation: "Ada sepatu di pintu masuk, sepertinya ada yang datang." },
      { chunks: ["熱[ねつ]が あります", "かぜを", "ひいた", "みたいです"], starIndex: 2, suffix: "。", translation: "Saya demam, sepertinya masuk angin." },
      { chunks: ["この ケーキは", "雲[くも]の ように", "とても", "やわらかいです"], starIndex: 1, suffix: "。", translation: "Kue ini sangat lembut seperti awan." },
      { chunks: ["彼[かれ]は", "日本人[にほんじん]の ように", "きれいな", "日本語[にほんご]を 話[はな]します"], starIndex: 1, suffix: "。", translation: "Dia berbicara bahasa Jepang indah seperti orang Jepang." },
      { chunks: ["まだ 小[ちい]さいので", "子[こ]どもみたいな", "字[じ]を", "書[か]きます"], starIndex: 1, suffix: "。", translation: "Karena masih kecil, tulisannya seperti anak-anak." }
    ],
    "n4-rashii": [
      { chunks: ["電気[でんき]が 消[き]えています", "となりの 部屋[へや]は", "だれも", "いないらしいです"], starIndex: 2, suffix: "。", translation: "Lampunya mati, sepertinya di kamar sebelah tidak ada orang." },
      { chunks: ["きょうは", "とても あたたかくて", "春[はる]らしい", "日[ひ]ですね"], starIndex: 2, suffix: "。", translation: "Hari ini hangat, benar-benar hari khas musim semi ya." },
      { chunks: ["みんなの 話[はなし]では", "彼[かれ]は", "試験[しけん]に", "合格[ごうかく]したらしいです"], starIndex: 2, suffix: "。", translation: "Menurut cerita semua orang, sepertinya dia lulus ujian." },
      { chunks: ["はり紙[がみ]に よると", "あの 店[みせ]は", "今日[きょう]は", "休[やす]みらしいです"], starIndex: 2, suffix: "。", translation: "Menurut selebaran, sepertinya toko itu hari ini tutup." },
      { chunks: ["彼[かれ]は", "いつも 正直[しょうじき]で", "本当[ほんとう]に", "男[おとこ]らしい 人[ひと]です"], starIndex: 2, suffix: "。", translation: "Dia selalu jujur, benar-benar orang yang jantan." }
    ],
    "n4-toki": [
      { chunks: ["子[こ]どもの とき", "よく", "近[ちか]くの 川[かわ]で", "泳[およ]ぎました"], starIndex: 2, suffix: "。", translation: "Waktu kecil saya sering berenang di sungai dekat rumah." },
      { chunks: ["外国[がいこく]へ", "行[い]く とき", "パスポートが", "要[い]ります"], starIndex: 1, suffix: "。", translation: "Saat pergi ke luar negeri, paspor diperlukan." },
      { chunks: ["国[くに]へ", "帰[かえ]った とき", "むかしの 友[とも]だちに", "会[あ]いました"], starIndex: 1, suffix: "。", translation: "Ketika pulang ke negara saya, saya bertemu teman lama." },
      { chunks: ["ひまな とき", "わたしは", "いつも", "本[ほん]を 読[よ]みます"], starIndex: 2, suffix: "。", translation: "Saat senggang, saya selalu membaca buku." },
      { chunks: ["寒[さむ]い ときは", "あたたかい ものを", "食[た]べた", "ほうがいいです"], starIndex: 2, suffix: "。", translation: "Saat dingin, sebaiknya makan makanan hangat." }
    ],
    "n4-tameni-youni": [
      { chunks: ["日本[にほん]で", "働[はたら]く ために", "毎日[まいにち]", "日本語[にほんご]を 勉強[べんきょう]しています"], starIndex: 1, suffix: "。", translation: "Untuk bekerja di Jepang, saya belajar bahasa Jepang tiap hari." },
      { chunks: ["うしろの 人[ひと]にも", "よく 聞[き]こえる ように", "大[おお]きい 声[こえ]で", "話[はな]します"], starIndex: 1, suffix: "。", translation: "Agar orang di belakang juga dengar, saya bicara dengan suara keras." },
      { chunks: ["大切[たいせつ]な 約束[やくそく]を", "忘[わす]れない ように", "手帳[てちょう]に", "書[か]いておきます"], starIndex: 1, suffix: "。", translation: "Agar tidak lupa janji penting, saya catat di buku agenda." },
      { chunks: ["家族[かぞく]の ために", "毎日[まいにち]", "一生懸命[いっしょうけんめい]", "働[はたら]いています"], starIndex: 2, suffix: "。", translation: "Demi keluarga, setiap hari saya bekerja keras." },
      { chunks: ["子[こ]どもが", "病気[びょうき]に ならない ように", "いつも", "気[き]を つけています"], starIndex: 1, suffix: "。", translation: "Agar anak saya tidak sakit, saya selalu berhati-hati." }
    ],
    "n4-noni": [
      { chunks: ["あんなに", "たくさん 勉強[べんきょう]したのに", "試験[しけん]に", "合格[ごうかく]できませんでした"], starIndex: 1, suffix: "。", translation: "Padahal sudah belajar sebanyak itu, saya tidak lulus ujian." },
      { chunks: ["まだ", "四月[しがつ]なのに", "今日[きょう]は", "とても 暑[あつ]いです"], starIndex: 1, suffix: "。", translation: "Padahal masih April, hari ini sangat panas." },
      { chunks: ["三時[さんじ]に 会[あ]うと", "約束[やくそく]したのに", "彼[かれ]は", "来[こ]なかった"], starIndex: 1, suffix: "。", translation: "Padahal sudah janji bertemu jam tiga, dia tidak datang." },
      { chunks: ["この 店[みせ]は", "安[やす]くて おいしいのに", "あまり 客[きゃく]が", "いません"], starIndex: 1, suffix: "。", translation: "Padahal toko ini murah dan enak, pembelinya sedikit." },
      { chunks: ["先週[せんしゅう]まで", "あんなに 元気[げんき]だったのに", "急[きゅう]に", "入院[にゅういん]したそうです"], starIndex: 1, suffix: "。", translation: "Padahal sampai minggu lalu sehat sekali, katanya tiba-tiba dirawat." }
    ],
    "n4-temo": [
      { chunks: ["あしたは", "雨[あめ]が 降[ふ]っても", "試合[しあい]を", "するそうです"], starIndex: 1, suffix: "。", translation: "Katanya besok meskipun hujan pertandingan tetap dilaksanakan." },
      { chunks: ["ほしいから", "少[すこ]し", "高[たか]くても", "買[か]いたいです"], starIndex: 2, suffix: "。", translation: "Karena menginginkannya, meski agak mahal saya tetap ingin beli." },
      { chunks: ["わたしの 会社[かいしゃ]は", "日曜日[にちようび]でも", "仕事[しごと]が", "あります"], starIndex: 1, suffix: "。", translation: "Di perusahaan saya, meski hari Minggu tetap ada pekerjaan." },
      { chunks: ["いくら", "説明[せつめい]しても", "彼[かれ]は", "わかってくれません"], starIndex: 1, suffix: "。", translation: "Sebanyak apa pun saya jelaskan, dia tetap tidak mau mengerti." },
      { chunks: ["どんなに", "忙[いそが]しくても", "朝[あさ]ごはんだけは", "食[た]べます"], starIndex: 1, suffix: "。", translation: "Sesibuk apa pun, sarapan tetap saya makan." }
    ]
  },

  /* Susun Bebas (build): the learner arranges the WHOLE sentence from shuffled
   * chunks. Only `chunks` is authored — in correct order — and bunpou-app.js
   * derives `answer` from it at merge time, so the correct order can never
   * drift out of sync with the chunk list. The two original items in
   * bunpou-data.js still carry their own explicit `answer` and are untouched.
   *
   * NOTE: `translation` here is the PROMPT, not a hint — it is the only thing
   * telling the learner which sentence to build, so it stays visible even when
   * the translation toggle is off. The toggle governs the answer-side line.
   */
  build: {
    // ---------------- N5 ----------------
    "n5-desu": [
      { chunks: ["これは", "わたしの", "かばん", "です"], translation: "Ini adalah tas saya." },
      { chunks: ["山田[やまだ]さんは", "しんせつな", "人[ひと]", "です"], translation: "Tuan Yamada adalah orang yang baik." },
      { chunks: ["きのうは", "とても", "いい 天気[てんき]", "でした"], translation: "Kemarin cuacanya sangat bagus." },
      { chunks: ["わたしは", "日本人[にほんじん]じゃ", "ありません"], translation: "Saya bukan orang Jepang." },
      { chunks: ["あの 建物[たてもの]は", "新[あたら]しい", "図書館[としょかん]", "です"], translation: "Gedung itu adalah perpustakaan baru." }
    ],
    "n5-wa-ga": [
      { chunks: ["わたしは", "毎朝[まいあさ]", "コーヒーを", "飲[の]みます"], translation: "Saya minum kopi setiap pagi." },
      { chunks: ["つくえの 下[した]に", "小[ちい]さい", "犬[いぬ]が", "います"], translation: "Di bawah meja ada anjing kecil." },
      { chunks: ["姉[あね]は", "料理[りょうり]が", "とても", "上手[じょうず]です"], translation: "Kakak perempuan saya sangat pandai memasak." },
      { chunks: ["この 教室[きょうしつ]は", "まどが", "とても", "大[おお]きいです"], translation: "Ruang kelas ini jendelanya sangat besar." },
      { chunks: ["だれが", "この 手紙[てがみ]を", "書[か]きましたか"], translation: "Siapa yang menulis surat ini?" }
    ],
    "n5-o-ni-de": [
      { chunks: ["わたしは", "毎晩[まいばん]", "音楽[おんがく]を", "聞[き]きます"], translation: "Saya mendengarkan musik setiap malam." },
      { chunks: ["姉[あね]は", "八時[はちじ]に", "会社[かいしゃ]へ", "行[い]きます"], translation: "Kakak perempuan saya pergi ke kantor pukul delapan." },
      { chunks: ["きのう", "友[とも]だちと", "レストランで", "ごはんを 食[た]べました"], translation: "Kemarin saya makan di restoran bersama teman." },
      { chunks: ["父[ちち]は", "毎日[まいにち]", "電車[でんしゃ]で", "会社[かいしゃ]に 行[い]きます"], translation: "Ayah saya pergi ke kantor naik kereta setiap hari." },
      { chunks: ["犬[いぬ]と", "いっしょに", "公園[こうえん]を", "散歩[さんぽ]しました"], translation: "Saya berjalan-jalan di taman bersama anjing." }
    ],
    "n5-arimasu-imasu": [
      { chunks: ["いすの 上[うえ]に", "ねこが", "います"], translation: "Di atas kursi ada kucing." },
      { chunks: ["かばんの 中[なか]に", "本[ほん]が", "三冊[さんさつ]", "あります"], translation: "Di dalam tas ada tiga buah buku." },
      { chunks: ["わたしの 家[いえ]の 近[ちか]くに", "大[おお]きい", "公園[こうえん]が", "あります"], translation: "Di dekat rumah saya ada taman besar." },
      { chunks: ["教室[きょうしつ]には", "だれも", "いません"], translation: "Di ruang kelas tidak ada siapa-siapa." },
      { chunks: ["わたしは", "日本[にほん]に", "親[しん]せきが", "います"], translation: "Saya punya kerabat di Jepang." }
    ],
    "n5-masu": [
      { chunks: ["わたしは", "毎朝[まいあさ]", "六時[ろくじ]に", "起[お]きます"], translation: "Saya bangun pukul enam setiap pagi." },
      { chunks: ["きのう", "母[はは]と", "買[か]い物[もの]に", "行[い]きました"], translation: "Kemarin saya pergi berbelanja bersama ibu." },
      { chunks: ["わたしは", "にくを", "ぜんぜん", "食[た]べません"], translation: "Saya sama sekali tidak makan daging." },
      { chunks: ["先週[せんしゅう]は", "テレビを", "見[み]ませんでした"], translation: "Minggu lalu saya tidak menonton televisi." },
      { chunks: ["あした", "友[とも]だちと", "図書館[としょかん]で", "勉強[べんきょう]します"], translation: "Besok saya belajar di perpustakaan bersama teman." }
    ],
    "n5-iadj-nadj": [
      { chunks: ["この 問題[もんだい]は", "とても", "むずかしいです"], translation: "Soal ini sangat sulit." },
      { chunks: ["きのうの ばんごはんは", "あまり", "おいしくなかったです"], translation: "Makan malam kemarin tidak begitu enak." },
      { chunks: ["ここは", "とても", "しずかな", "ところです"], translation: "Di sini adalah tempat yang sangat tenang." },
      { chunks: ["あの 店[みせ]の ケーキは", "安[やす]くて", "おいしいです"], translation: "Kue di toko itu murah dan enak." },
      { chunks: ["きょうの しけんは", "思[おも]ったより", "かんたんでした"], translation: "Ujian hari ini lebih mudah dari yang saya kira." }
    ],
    "n5-tai-hoshii": [
      { chunks: ["わたしは", "あたらしい", "くつが", "ほしいです"], translation: "Saya ingin sepatu baru." },
      { chunks: ["夏休[なつやす]みに", "海[うみ]へ", "行[い]きたいです"], translation: "Saat libur musim panas saya ingin pergi ke laut." },
      { chunks: ["おなかが いっぱいなので", "今[いま]は", "何[なに]も", "食[た]べたくないです"], translation: "Karena kenyang, sekarang saya tidak ingin makan apa pun." },
      { chunks: ["子[こ]どもの とき", "先生[せんせい]に", "なりたかったです"], translation: "Waktu kecil saya ingin menjadi guru." },
      { chunks: ["妹[いもうと]は", "あたらしい", "かばんを", "ほしがっています"], translation: "Adik perempuan saya menginginkan tas baru." }
    ],
    "n5-kudasai-mashou": [
      { chunks: ["この 紙[かみ]に", "住所[じゅうしょ]を", "書[か]いて", "ください"], translation: "Tolong tulis alamat di kertas ini." },
      { chunks: ["あした", "いっしょに", "映画[えいが]を", "見[み]ましょう"], translation: "Besok mari kita menonton film bersama." },
      { chunks: ["ドアを", "開[あ]け", "ましょうか"], translation: "Mari saya bukakan pintunya?" },
      { chunks: ["すみませんが", "しおを", "とって", "ください"], translation: "Maaf, tolong ambilkan garam." },
      { chunks: ["ここでは", "大[おお]きい 声[こえ]で", "話[はな]さないで", "ください"], translation: "Di sini tolong jangan berbicara dengan suara keras." }
    ],
    "n5-teimasu": [
      { chunks: ["弟[おとうと]は", "今[いま]", "部屋[へや]で", "寝[ね]ています"], translation: "Adik laki-laki saya sekarang sedang tidur di kamar." },
      { chunks: ["父[ちち]は", "大[おお]きい 会社[かいしゃ]で", "働[はたら]いています"], translation: "Ayah saya bekerja di perusahaan besar." },
      { chunks: ["姉[あね]は", "三年前[さんねんまえ]に", "結婚[けっこん]して", "います"], translation: "Kakak perempuan saya sudah menikah tiga tahun lalu." },
      { chunks: ["今[いま]", "そとで", "雪[ゆき]が", "降[ふ]っています"], translation: "Sekarang di luar sedang turun salju." },
      { chunks: ["わたしは", "毎朝[まいあさ]", "新聞[しんぶん]を", "読[よ]んでいます"], translation: "Saya membaca koran setiap pagi." }
    ],
    "n5-temoii-tehaikenai": [
      { chunks: ["この へやに", "入[はい]っても", "いいですか"], translation: "Bolehkah saya masuk ke ruangan ini?" },
      { chunks: ["びょういんの 中[なか]で", "たばこを", "吸[す]っては", "いけません"], translation: "Di dalam rumah sakit dilarang merokok." },
      { chunks: ["この ペンを", "使[つか]っても", "いいです"], translation: "Boleh memakai pena ini." },
      { chunks: ["ここに", "ごみを", "すてては", "いけません"], translation: "Di sini dilarang membuang sampah." },
      { chunks: ["しつもんが あったら", "いつでも", "聞[き]いても", "いいですよ"], translation: "Kalau ada pertanyaan, boleh bertanya kapan saja." }
    ],
    "n5-nakerebanaranai": [
      { chunks: ["学生[がくせい]は", "毎日[まいにち]", "勉強[べんきょう]しなければ", "なりません"], translation: "Siswa harus belajar setiap hari." },
      { chunks: ["あしたは", "会社[かいしゃ]へ", "行[い]かなくても", "いいです"], translation: "Besok tidak perlu pergi ke kantor." },
      { chunks: ["くすりを", "毎日[まいにち]", "飲[の]まなければ", "なりません"], translation: "Obatnya harus diminum setiap hari." },
      { chunks: ["部屋[へや]を", "きれいに", "しなくては", "いけません"], translation: "Kamarnya harus dibersihkan." },
      { chunks: ["あしたは", "早[はや]く", "起[お]きなくても", "いいです"], translation: "Besok tidak perlu bangun pagi." }
    ],
    "n5-yori-houga-ichiban": [
      { chunks: ["ひこうきは", "電車[でんしゃ]より", "速[はや]いです"], translation: "Pesawat lebih cepat daripada kereta." },
      { chunks: ["にくより", "さかなの", "ほうが", "好[す]きです"], translation: "Saya lebih suka ikan daripada daging." },
      { chunks: ["クラスの 中[なか]で", "田中[たなか]さんが", "一番[いちばん]", "せが 高[たか]いです"], translation: "Di kelas, Tanaka yang paling tinggi." },
      { chunks: ["夏[なつ]と 冬[ふゆ]と", "どちらが", "好[す]きですか"], translation: "Mana yang lebih kamu suka, musim panas atau dingin?" },
      { chunks: ["きょうは", "きのうほど", "あつく", "ありません"], translation: "Hari ini tidak sepanas kemarin." }
    ],
    // ---------------- N4 ----------------
    "n4-to-omou": [
      { chunks: ["わたしは", "この 本[ほん]が", "おもしろいと", "思[おも]います"], translation: "Saya pikir buku ini menarik." },
      { chunks: ["母[はは]は", "あした 雨[あめ]が", "降[ふ]ると", "言[い]いました"], translation: "Ibu berkata besok akan hujan." },
      { chunks: ["この 魚[さかな]は", "日本語[にほんご]で", "さばと", "言[い]います"], translation: "Ikan ini dalam bahasa Jepang disebut saba." },
      { chunks: ["きのう", "田中[たなか]という", "人[ひと]に", "会[あ]いました"], translation: "Kemarin saya bertemu orang bernama Tanaka." },
      { chunks: ["彼[かれ]は", "来[こ]ないと", "思[おも]います"], translation: "Saya rasa dia tidak akan datang." }
    ],
    "n4-deshou": [
      { chunks: ["あしたは", "たぶん", "さむく", "なるでしょう"], translation: "Besok mungkin akan menjadi dingin." },
      { chunks: ["この しけんは", "学生[がくせい]には", "やさしい", "でしょう"], translation: "Ujian ini mungkin mudah bagi siswa." },
      { chunks: ["彼女[かのじょ]は", "もう", "国[くに]へ", "帰[かえ]ったでしょう"], translation: "Dia mungkin sudah pulang ke negaranya." },
      { chunks: ["この 時間[じかん]は", "道[みち]が", "こんでいる", "でしょう"], translation: "Jam segini jalanan mungkin macet." },
      { chunks: ["あの 店[みせ]は", "今日[きょう]は", "休[やす]み", "だろう"], translation: "Toko itu mungkin hari ini tutup." }
    ],
    "n4-kara": [
      { chunks: ["おそいから", "タクシーで", "帰[かえ]りましょう"], translation: "Karena sudah larut, ayo pulang naik taksi." },
      { chunks: ["あついから", "まどを", "開[あ]けて", "ください"], translation: "Karena panas, tolong buka jendelanya." },
      { chunks: ["あしたは", "休[やす]みだから", "どこかへ", "行[い]きましょう"], translation: "Karena besok libur, ayo pergi ke suatu tempat." },
      { chunks: ["雨[あめ]が", "降[ふ]っているから", "今日[きょう]は", "やめましょう"], translation: "Karena sedang hujan, hari ini kita batalkan saja." },
      { chunks: ["ここは", "危[あぶ]ないから", "気[き]を", "つけてください"], translation: "Karena di sini berbahaya, tolong hati-hati." }
    ],
    "n4-node": [
      { chunks: ["用事[ようじ]が あるので", "お先[さき]に", "失礼[しつれい]します"], translation: "Karena ada urusan, saya permisi duluan." },
      { chunks: ["ねつが あるので", "今日[きょう]は", "休[やす]みます"], translation: "Karena demam, hari ini saya istirahat." },
      { chunks: ["ここは", "病院[びょういん]なので", "静[しず]かに", "してください"], translation: "Karena ini rumah sakit, tolong tenang." },
      { chunks: ["日本語[にほんご]が", "まだ 下手[へた]なので", "ゆっくり", "話[はな]してください"], translation: "Karena bahasa Jepang saya masih buruk, tolong bicara pelan." },
      { chunks: ["電車[でんしゃ]が", "止[と]まったので", "遅[おく]れました"], translation: "Karena keretanya berhenti, saya terlambat." }
    ],
    "n4-shi": [
      { chunks: ["この へやは", "広[ひろ]いし", "明[あか]るいです"], translation: "Kamar ini luas dan terang." },
      { chunks: ["彼[かれ]は", "やさしいし", "あたまも", "いいです"], translation: "Dia baik hati dan juga pintar." },
      { chunks: ["今日[きょう]は", "つかれたし", "早[はや]く", "寝[ね]ます"], translation: "Hari ini saya lelah, jadi tidur lebih awal." },
      { chunks: ["この 店[みせ]は", "安[やす]いし", "店員[てんいん]も", "しんせつです"], translation: "Toko ini murah dan pegawainya juga ramah." },
      { chunks: ["時間[じかん]も ないし", "お金[かね]も", "ありません"], translation: "Waktu tidak ada, uang pun tidak ada." }
    ],
    "n4-ndesu": [
      { chunks: ["どうして", "そんなに", "急[いそ]いでいる", "んですか"], translation: "Kenapa kamu begitu terburu-buru?" },
      { chunks: ["おなかが", "痛[いた]い", "んです"], translation: "Perut saya sakit." },
      { chunks: ["実[じつ]は", "あした", "国[くに]へ", "帰[かえ]るんです"], translation: "Sebenarnya besok saya pulang ke negara saya." },
      { chunks: ["切符[きっぷ]を", "なくした", "んですが", "どうしたら いいですか"], translation: "Saya kehilangan tiket, bagaimana sebaiknya?" },
      { chunks: ["今日[きょう]は", "テストが ある", "んです"], translation: "Hari ini ada ujian." }
    ],
    "n4-tara": [
      { chunks: ["うちに", "帰[かえ]ったら", "すぐ", "電話[でんわ]します"], translation: "Kalau sudah sampai rumah, saya akan segera menelepon." },
      { chunks: ["お金[かね]が", "あったら", "車[くるま]を", "買[か]いたいです"], translation: "Kalau punya uang, saya ingin membeli mobil." },
      { chunks: ["まどを", "開[あ]けたら", "つめたい 風[かぜ]が", "入[はい]ってきた"], translation: "Ketika membuka jendela, angin dingin masuk." },
      { chunks: ["この くすりを", "飲[の]んだら", "よく", "なりますよ"], translation: "Kalau minum obat ini, akan membaik." },
      { chunks: ["もし", "時間[じかん]が", "あったら", "遊[あそ]びに 来[き]てください"], translation: "Kalau ada waktu, datanglah main." }
    ],
    "n4-ba": [
      { chunks: ["ボタンを", "押[お]せば", "ドアが", "開[あ]きます"], translation: "Kalau menekan tombol, pintunya terbuka." },
      { chunks: ["毎日[まいにち]", "練習[れんしゅう]すれば", "上手[じょうず]に", "なります"], translation: "Kalau berlatih setiap hari, akan menjadi mahir." },
      { chunks: ["分[わ]からなければ", "先生[せんせい]に", "聞[き]いて", "ください"], translation: "Kalau tidak mengerti, tanyakan pada guru." },
      { chunks: ["安[やす]ければ", "もう 一[ひと]つ", "買[か]います"], translation: "Kalau murah, saya beli satu lagi." },
      { chunks: ["天気[てんき]が", "よければ", "山[やま]に", "登[のぼ]ります"], translation: "Kalau cuacanya bagus, saya akan mendaki gunung." }
    ],
    "n4-to-cond": [
      { chunks: ["ここを", "押[お]すと", "お湯[ゆ]が", "出[で]ます"], translation: "Kalau menekan di sini, air panas keluar." },
      { chunks: ["春[はる]に なると", "あたたかく", "なります"], translation: "Kalau musim semi tiba, cuaca menjadi hangat." },
      { chunks: ["この 道[みち]を", "まっすぐ 行[い]くと", "公園[こうえん]が", "あります"], translation: "Kalau jalan lurus di jalan ini, ada taman." },
      { chunks: ["二[に]に 三[さん]を", "たすと", "五[ご]に", "なります"], translation: "Kalau dua ditambah tiga, menjadi lima." },
      { chunks: ["電気[でんき]を", "消[け]すと", "部屋[へや]が", "暗[くら]くなった"], translation: "Begitu lampu dimatikan, kamar menjadi gelap." }
    ],
    "n4-nara": [
      { chunks: ["くだものなら", "あの 店[みせ]が", "安[やす]いですよ"], translation: "Kalau buah, toko itu murah lho." },
      { chunks: ["日本[にほん]へ", "行[い]くなら", "春[はる]が", "いいですよ"], translation: "Kalau mau ke Jepang, musim semi bagus." },
      { chunks: ["ひまなら", "手伝[てつだ]って", "ください"], translation: "Kalau senggang, tolong bantu saya." },
      { chunks: ["田中[たなか]さんなら", "もう", "帰[かえ]りましたよ"], translation: "Kalau soal Tanaka, dia sudah pulang." },
      { chunks: ["そんなに", "つかれているなら", "早[はや]く", "休[やす]んでください"], translation: "Kalau memang selelah itu, cepatlah istirahat." }
    ],
    "n4-kanou": [
      { chunks: ["わたしは", "ひらがなが", "読[よ]めます"], translation: "Saya bisa membaca hiragana." },
      { chunks: ["この 漢字[かんじ]は", "むずかしくて", "読[よ]めません"], translation: "Kanji ini sulit dan tidak bisa saya baca." },
      { chunks: ["あしたは", "早[はや]く", "来[こ]られますか"], translation: "Apakah besok kamu bisa datang lebih awal?" },
      { chunks: ["ここから", "海[うみ]が", "きれいに", "見[み]えます"], translation: "Dari sini laut terlihat indah." },
      { chunks: ["兄[あに]は", "ピアノが", "とても", "上手[じょうず]に ひけます"], translation: "Kakak laki-laki saya bisa bermain piano dengan sangat baik." }
    ],
    "n4-dekiru": [
      { chunks: ["わたしは", "車[くるま]を", "運転[うんてん]する ことが", "できます"], translation: "Saya bisa mengemudikan mobil." },
      { chunks: ["ここでは", "お金[かね]を", "おろす ことが", "できます"], translation: "Di sini bisa menarik uang." },
      { chunks: ["この へやを", "使[つか]う ことが", "できますか"], translation: "Apakah ruangan ini bisa dipakai?" },
      { chunks: ["きのうは", "いそがしくて", "行[い]く ことが", "できませんでした"], translation: "Kemarin saya sibuk dan tidak bisa pergi." },
      { chunks: ["インターネットで", "予約[よやく]する ことが", "できます"], translation: "Bisa memesan lewat internet." }
    ],
    "n4-you-ni-naru": [
      { chunks: ["毎日[まいにち] 練習[れんしゅう]して", "自転車[じてんしゃ]に", "乗[の]れる ように", "なりました"], translation: "Setelah berlatih tiap hari, saya jadi bisa naik sepeda." },
      { chunks: ["日本[にほん]に 来[き]てから", "さしみが", "食[た]べられる ように", "なりました"], translation: "Sejak datang ke Jepang, saya jadi bisa makan sashimi." },
      { chunks: ["毎朝[まいあさ]", "早[はや]く", "起[お]きる ように", "しています"], translation: "Saya membiasakan bangun pagi setiap hari." },
      { chunks: ["弟[おとうと]は", "ひらがなが", "書[か]ける ように", "なりました"], translation: "Adik laki-laki saya jadi bisa menulis hiragana." },
      { chunks: ["最近[さいきん]", "野菜[やさい]を", "食[た]べる ように", "しています"], translation: "Belakangan ini saya membiasakan makan sayur." }
    ],
    "n4-rareru-passive": [
      { chunks: ["わたしは", "母[はは]に", "しかられました"], translation: "Saya dimarahi ibu." },
      { chunks: ["この 歌[うた]は", "若[わか]い 人[ひと]に", "よく", "歌[うた]われています"], translation: "Lagu ini sering dinyanyikan anak muda." },
      { chunks: ["この お寺[てら]は", "むかし", "建[た]てられました"], translation: "Kuil ini dibangun pada zaman dulu." },
      { chunks: ["電車[でんしゃ]の 中[なか]で", "足[あし]を", "踏[ふ]まれました"], translation: "Kaki saya terinjak di dalam kereta." },
      { chunks: ["帰[かえ]る とちゅうで", "雨[あめ]に", "降[ふ]られました"], translation: "Di tengah perjalanan pulang saya kehujanan." }
    ],
    "n4-saseru": [
      { chunks: ["先生[せんせい]は", "学生[がくせい]に", "本[ほん]を", "読[よ]ませました"], translation: "Guru menyuruh siswa membaca buku." },
      { chunks: ["母[はは]は", "妹[いもうと]を", "病院[びょういん]へ", "行[い]かせました"], translation: "Ibu menyuruh adik perempuan pergi ke rumah sakit." },
      { chunks: ["子[こ]どもに", "毎日[まいにち]", "牛乳[ぎゅうにゅう]を", "飲[の]ませています"], translation: "Saya membiasakan anak minum susu setiap hari." },
      { chunks: ["すみませんが", "少[すこ]し", "休[やす]ませて", "ください"], translation: "Maaf, izinkan saya istirahat sebentar." },
      { chunks: ["部長[ぶちょう]に", "長[なが]い 時間[じかん]", "待[ま]たされました"], translation: "Saya dibuat menunggu lama oleh kepala bagian." }
    ],
    "n4-te-ageru-kureru-morau": [
      { chunks: ["わたしは", "友[とも]だちに", "本[ほん]を", "貸[か]してあげました"], translation: "Saya meminjamkan buku kepada teman." },
      { chunks: ["友[とも]だちが", "駅[えき]まで", "送[おく]って", "くれました"], translation: "Teman saya mengantar sampai stasiun." },
      { chunks: ["先生[せんせい]に", "作文[さくぶん]を", "直[なお]して", "もらいました"], translation: "Saya minta guru membetulkan karangan." },
      { chunks: ["先生[せんせい]が", "手紙[てがみ]を", "読[よ]んで", "くださいました"], translation: "Guru berkenan membacakan surat itu." },
      { chunks: ["母[はは]に", "セーターを", "買[か]って", "もらいました"], translation: "Saya dibelikan sweter oleh ibu." }
    ],
    "n4-te-shimau": [
      { chunks: ["レポートは", "もう", "書[か]いて", "しまいました"], translation: "Laporannya sudah selesai saya tulis." },
      { chunks: ["電車[でんしゃ]に", "かさを", "忘[わす]れて", "しまいました"], translation: "Saya ketinggalan payung di kereta." },
      { chunks: ["おいしくて", "全部[ぜんぶ]", "食[た]べて", "しまいました"], translation: "Karena enak, habis saya makan semua." },
      { chunks: ["大切[たいせつ]な", "コップを", "われて", "しまいました"], translation: "Gelas yang berharga pecah." },
      { chunks: ["その 本[ほん]を", "一日[いちにち]で", "読[よ]んで", "しまいました"], translation: "Buku itu habis saya baca dalam sehari." }
    ],
    "n4-te-oku": [
      { chunks: ["旅行[りょこう]の 前[まえ]に", "ホテルを", "予約[よやく]して", "おきます"], translation: "Sebelum bepergian, saya memesan hotel dulu." },
      { chunks: ["使[つか]ったら", "もとの ところに", "もどして", "おいてください"], translation: "Kalau sudah dipakai, kembalikan ke tempat semula." },
      { chunks: ["会議[かいぎ]の 前[まえ]に", "資料[しりょう]を", "読[よ]んで", "おきました"], translation: "Sebelum rapat, saya sudah membaca bahannya." },
      { chunks: ["あとで 使[つか]うから", "ここに", "置[お]いて", "おいてください"], translation: "Karena nanti dipakai, tolong letakkan di sini." },
      { chunks: ["パーティーの 前[まえ]に", "飲[の]み物[もの]を", "買[か]って", "おきます"], translation: "Sebelum pesta, saya membeli minuman dulu." }
    ],
    "n4-te-miru": [
      { chunks: ["この くつを", "はいて", "みても", "いいですか"], translation: "Bolehkah saya coba pakai sepatu ini?" },
      { chunks: ["新[あたら]しい 店[みせ]に", "行[い]って", "みます"], translation: "Saya akan coba pergi ke toko baru itu." },
      { chunks: ["むずかしいですが", "一度[いちど]", "やって", "みましょう"], translation: "Memang sulit, tapi ayo coba sekali." },
      { chunks: ["いつか", "日本[にほん]に", "住[す]んで", "みたいです"], translation: "Suatu saat saya ingin mencoba tinggal di Jepang." },
      { chunks: ["先生[せんせい]に", "聞[き]いて", "みましたが", "分[わ]かりませんでした"], translation: "Saya sudah coba tanya guru, tapi tidak mengerti." }
    ],
    "n4-tsumori": [
      { chunks: ["来年[らいねん]", "日本[にほん]へ", "行[い]く", "つもりです"], translation: "Tahun depan saya berencana pergi ke Jepang." },
      { chunks: ["今年[ことし]は", "たばこを", "吸[す]わない", "つもりです"], translation: "Tahun ini saya berniat tidak merokok." },
      { chunks: ["夏休[なつやす]みは", "国[くに]へ", "帰[かえ]る", "つもりです"], translation: "Libur musim panas saya berencana pulang." },
      { chunks: ["行[い]く つもりでしたが", "いそがしくて", "行[い]けませんでした"], translation: "Saya berniat pergi, tapi sibuk jadi tidak bisa." },
      { chunks: ["その しけんを", "受[う]ける", "つもりは", "ありません"], translation: "Saya tidak berniat mengikuti ujian itu." }
    ],
    "n4-you-to-omou": [
      { chunks: ["今日[きょう]は", "早[はや]く", "寝[ね]ようと", "思[おも]います"], translation: "Hari ini saya berniat tidur lebih awal." },
      { chunks: ["来月[らいげつ]から", "運動[うんどう]を", "始[はじ]めようと", "思[おも]っています"], translation: "Mulai bulan depan saya berniat mulai berolahraga." },
      { chunks: ["卒業[そつぎょう]したら", "日本[にほん]で", "働[はたら]こうと", "思[おも]います"], translation: "Setelah lulus saya berniat bekerja di Jepang." },
      { chunks: ["あたらしい", "パソコンを", "買[か]おうと", "思[おも]います"], translation: "Saya berniat membeli komputer baru." },
      { chunks: ["ずっと 前[まえ]から", "日本語[にほんご]を", "習[なら]おうと", "思[おも]っていました"], translation: "Sejak lama saya berniat belajar bahasa Jepang." }
    ],
    "n4-hou-ga-ii": [
      { chunks: ["ねつが あるから", "今日[きょう]は", "休[やす]んだ", "ほうがいいです"], translation: "Karena demam, sebaiknya hari ini istirahat." },
      { chunks: ["体[からだ]に 悪[わる]いから", "たばこは", "吸[す]わない", "ほうがいいです"], translation: "Karena buruk bagi tubuh, sebaiknya jangan merokok." },
      { chunks: ["もっと", "野菜[やさい]を", "食[た]べた", "ほうがいいですよ"], translation: "Sebaiknya kamu makan sayur lebih banyak." },
      { chunks: ["雨[あめ]が 降[ふ]りそうだから", "かさを", "持[も]って行[い]った", "ほうがいい"], translation: "Sepertinya hujan, sebaiknya bawa payung." },
      { chunks: ["夜[よる]おそく", "コーヒーを", "飲[の]まない", "ほうがいいです"], translation: "Sebaiknya jangan minum kopi larut malam." }
    ],
    "n4-sou-youtai": [
      { chunks: ["この ケーキは", "とても", "おいし", "そうです"], translation: "Kue ini kelihatannya sangat enak." },
      { chunks: ["今[いま]にも", "雨[あめ]が", "降[ふ]り", "そうです"], translation: "Sebentar lagi sepertinya akan hujan." },
      { chunks: ["たなの 上[うえ]の 箱[はこ]が", "落[お]ち", "そうです"], translation: "Kotak di atas rak sepertinya mau jatuh." },
      { chunks: ["彼[かれ]は", "元気[げんき]が", "なさ", "そうです"], translation: "Dia kelihatannya tidak bersemangat." },
      { chunks: ["この 問題[もんだい]は", "かんたん", "そうに", "見[み]えます"], translation: "Soal ini kelihatannya mudah." }
    ],
    "n4-sou-denbun": [
      { chunks: ["天気[てんき]よほうに よると", "あしたは", "雨[あめ]だ", "そうです"], translation: "Menurut ramalan cuaca, besok katanya hujan." },
      { chunks: ["田中[たなか]さんは", "来月[らいげつ]", "結婚[けっこん]する", "そうです"], translation: "Katanya Tanaka menikah bulan depan." },
      { chunks: ["ニュースに よると", "地震[じしん]が", "あった", "そうです"], translation: "Menurut berita, katanya ada gempa." },
      { chunks: ["この 店[みせ]の ラーメンは", "とても", "おいしい", "そうです"], translation: "Katanya ramen toko ini sangat enak." },
      { chunks: ["彼[かれ]は", "今日[きょう]は", "来[こ]ない", "そうです"], translation: "Katanya dia hari ini tidak datang." }
    ],
    "n4-you-mitai": [
      { chunks: ["だれか", "来[き]た", "ようです"], translation: "Sepertinya ada yang datang." },
      { chunks: ["ねつが あるので", "かぜを", "ひいた", "みたいです"], translation: "Karena demam, sepertinya saya masuk angin." },
      { chunks: ["この ケーキは", "雲[くも]の ように", "やわらかいです"], translation: "Kue ini lembut seperti awan." },
      { chunks: ["彼[かれ]は", "日本人[にほんじん]の ように", "日本語[にほんご]を", "話[はな]します"], translation: "Dia berbicara bahasa Jepang seperti orang Jepang." },
      { chunks: ["あの 人[ひと]は", "先生[せんせい]の", "ような", "話[はな]し方[かた]をします"], translation: "Orang itu berbicara seperti seorang guru." }
    ],
    "n4-rashii": [
      { chunks: ["となりの 部屋[へや]には", "だれも", "いない", "らしいです"], translation: "Sepertinya di kamar sebelah tidak ada orang." },
      { chunks: ["きょうは", "とても", "春[はる]らしい", "天気[てんき]です"], translation: "Hari ini cuacanya benar-benar khas musim semi." },
      { chunks: ["彼[かれ]は", "しけんに", "合格[ごうかく]した", "らしいです"], translation: "Sepertinya dia lulus ujian." },
      { chunks: ["あの 店[みせ]は", "今日[きょう]は", "休[やす]み", "らしいです"], translation: "Sepertinya toko itu hari ini tutup." },
      { chunks: ["田中[たなか]さんは", "来月[らいげつ]", "国[くに]へ", "帰[かえ]るらしいです"], translation: "Sepertinya Tanaka pulang ke negaranya bulan depan." }
    ],
    "n4-toki": [
      { chunks: ["子[こ]どもの とき", "よく", "川[かわ]で", "泳[およ]ぎました"], translation: "Waktu kecil saya sering berenang di sungai." },
      { chunks: ["日本[にほん]へ", "行[い]く とき", "パスポートが", "要[い]ります"], translation: "Saat pergi ke Jepang, paspor diperlukan." },
      { chunks: ["国[くに]へ", "帰[かえ]った とき", "友[とも]だちに", "会[あ]いました"], translation: "Ketika pulang ke negara saya, saya bertemu teman." },
      { chunks: ["ひまな とき", "本[ほん]を", "読[よ]みます"], translation: "Saat senggang saya membaca buku." },
      { chunks: ["寒[さむ]い とき", "あたたかい ものを", "食[た]べます"], translation: "Saat dingin saya makan makanan hangat." }
    ],
    "n4-tameni-youni": [
      { chunks: ["日本[にほん]で", "働[はたら]く ために", "日本語[にほんご]を", "勉強[べんきょう]しています"], translation: "Untuk bekerja di Jepang, saya belajar bahasa Jepang." },
      { chunks: ["よく", "聞[き]こえる ように", "大[おお]きい 声[こえ]で", "話[はな]します"], translation: "Agar terdengar jelas, saya bicara dengan suara keras." },
      { chunks: ["忘[わす]れない ように", "手帳[てちょう]に", "書[か]きます"], translation: "Agar tidak lupa, saya menulis di buku agenda." },
      { chunks: ["家族[かぞく]の ために", "一生懸命[いっしょうけんめい]", "働[はたら]いています"], translation: "Demi keluarga, saya bekerja keras." },
      { chunks: ["かぜを", "ひかない ように", "気[き]を", "つけてください"], translation: "Agar tidak masuk angin, tolong hati-hati." }
    ],
    "n4-noni": [
      { chunks: ["たくさん", "勉強[べんきょう]したのに", "合格[ごうかく]できませんでした"], translation: "Padahal sudah banyak belajar, saya tidak lulus." },
      { chunks: ["まだ", "四月[しがつ]なのに", "とても", "暑[あつ]いです"], translation: "Padahal masih April, tapi sangat panas." },
      { chunks: ["約束[やくそく]したのに", "彼[かれ]は", "来[こ]ませんでした"], translation: "Padahal sudah janji, dia tidak datang." },
      { chunks: ["この 店[みせ]は", "安[やす]いのに", "客[きゃく]が", "少[すく]ないです"], translation: "Padahal toko ini murah, pembelinya sedikit." },
      { chunks: ["元気[げんき]だったのに", "急[きゅう]に", "入院[にゅういん]しました"], translation: "Padahal sehat, tiba-tiba dirawat di rumah sakit." }
    ],
    "n4-temo": [
      { chunks: ["雨[あめ]が", "降[ふ]っても", "試合[しあい]を", "します"], translation: "Meskipun hujan, pertandingan tetap dilaksanakan." },
      { chunks: ["高[たか]くても", "これを", "買[か]いたいです"], translation: "Meskipun mahal, saya ingin membeli ini." },
      { chunks: ["日曜日[にちようび]でも", "仕事[しごと]が", "あります"], translation: "Meskipun hari Minggu, tetap ada pekerjaan." },
      { chunks: ["いくら", "説明[せつめい]しても", "分[わ]かって", "くれません"], translation: "Sebanyak apa pun dijelaskan, dia tidak mau mengerti." },
      { chunks: ["どんなに", "いそがしくても", "朝[あさ]ごはんは", "食[た]べます"], translation: "Sesibuk apa pun, saya tetap sarapan." }
    ]
  }
};
