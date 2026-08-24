/*
 * 文法 Bunpou — JLPT N5/N4 grammar dataset (N4-focused, with N5 as foundation).
 * Independent of data.js / kotoba-data.js so this section can grow on its own.
 *
 * Each point: id, level (N5/N4), group (function category), pattern, reading,
 * meaning (ID + EN). Study fields: whenToUse, formation (table rows),
 * register (nuance/pitfalls), contrast (vs confusable points), kanjiLinks
 * (words that also appear in the N4 kanji deck, data.js).
 *
 * examples[]: 8-10+ varied sentences (affirmative/negative, past/non-past,
 * casual/polite, different attaching parts of speech). Each carries jp +
 * reading + meaning; `cloze` marks the exact substring of `jp` to blank out
 * for the cloze drill (must appear verbatim in that example's jp).
 *
 * mcq[] / build[]: optional drill items authored for the more testable /
 * confusable points (JLPT-style 文法形式の判断 and 文の組み立て).
 *
 * v1 scope: full N5 foundation (12 points) + a curated N4 core (29 points,
 * covering reasons, conditionals, potential, passive/causative, giving &
 * receiving, aspect, intentions, advice, appearance/hearsay, time, purpose,
 * concession, decisions). Remaining N4 groups (すぎる/やすい・にくい,
 * ていく/てくる, ようにする, なる/する, たらどうですか, ことにする/になる,
 * かどうか, keigo) are deliberately left for a future pass — see README.
 */

const BUNPOU = [

// =====================================================================
// N5 — foundation
// =====================================================================

{
  id: "n5-desu", level: "N5", group: "Kopula & Negasi",
  pattern: "です／じゃありません／でした", reading: "desu / ja arimasen / deshita",
  meaning: "adalah ~ / bukan ~ / dulu adalah ~ (to be / not / was)",
  whenToUse: "です menyatakan sesuatu secara sopan (N/なadj + です). Negatif: じゃありません (lisan) / ではありません (formal). Lampau: でした / じゃありませんでした. (Polite copula; negative じゃ/ではありません; past でした/じゃありませんでした.)",
  formation: [
    { pos: "N + です", rule: "non-past sopan", ex: "学生 + です → 学生です" },
    { pos: "N + じゃありません", rule: "non-past negatif", ex: "学生じゃありません" },
    { pos: "N + でした", rule: "lampau", ex: "学生でした" },
    { pos: "N + じゃありませんでした", rule: "lampau negatif", ex: "学生じゃありませんでした" }
  ],
  register: "じゃ lebih santai daripada では; keduanya benar dalam percakapan sopan. Pitfall: jangan pakai です setelah bentuk kata kerja biasa (べんきょうするです ✗). (じゃ is more casual than では; don't attach です to a plain verb form.)",
  contrast: "vs だ: だ adalah bentuk biasa/kasual dari です, dipakai dengan teman dekat, bukan di percakapan sopan. (だ is the plain/casual form of です.)",
  examples: [
    { jp: "わたしは学生です。", reading: "わたしはがくせいです。", meaning: "Saya seorang murid. (I am a student.)", cloze: "です" },
    { jp: "これはペンじゃありません。", reading: "これはぺんじゃありません。", meaning: "Ini bukan pulpen. (This is not a pen.)", cloze: "じゃありません" },
    { jp: "きのうは休みでした。", reading: "きのうはやすみでした。", meaning: "Kemarin libur. (Yesterday was a holiday.)", cloze: "でした" },
    { jp: "田中さんは先生じゃありませんでした。", reading: "たなかさんはせんせいじゃありませんでした。", meaning: "Pak Tanaka dulu bukan guru. (Mr. Tanaka wasn't a teacher.)", cloze: "じゃありませんでした" },
    { jp: "これは私のかばんです。", reading: "これはわたしのかばんです。", meaning: "Ini tas saya. (This is my bag.)", cloze: "です" },
    { jp: "あの人は医者ですか。", reading: "あのひとはいしゃですか。", meaning: "Apakah orang itu dokter? (Is that person a doctor?)", cloze: "です" },
    { jp: "ここは静かじゃありません。", reading: "ここはしずかじゃありません。", meaning: "Di sini tidak tenang. (It's not quiet here.)", cloze: "じゃありません" },
    { jp: "子どものとき、体が弱かったです。", reading: "こどものとき、からだがよわかったです。", meaning: "Waktu kecil, badan saya lemah. (As a child, I was weak.)" }
  ]
},

{
  id: "n5-wa-ga", level: "N5", group: "Partikel Dasar",
  pattern: "は・が", reading: "wa / ga",
  meaning: "penanda topik / penanda subjek (topic marker / subject marker)",
  whenToUse: "は menandai topik kalimat (apa yang sedang dibicarakan); が menandai subjek gramatikal, sering untuk info baru atau menjawab 'siapa/apa'. (は marks the topic; が marks the grammatical subject, often for new information.)",
  formation: [
    { pos: "Topik", rule: "N + は", ex: "私は学生です。" },
    { pos: "Subjek/info baru", rule: "N + が", ex: "だれが来ましたか。" }
  ],
  register: "が sering dipakai setelah kata tanya (だれが、なにが) dan dalam anak kalimat. Pitfall: memakai は dua kali dalam satu kalimat biasanya aneh — kalimat kedua pakai が untuk subjek baru. (が follows question words like だれ/なに; avoid doubling は.)",
  contrast: "vs を: を menandai objek langsung, bukan topik/subjek. vs に: に menandai tujuan/waktu/lokasi, bukan pelaku. (を = direct object; に = destination/time/location.)",
  examples: [
    { jp: "私は日本人です。", reading: "わたしはにほんじんです。", meaning: "Saya orang Jepang. (I am Japanese.)", cloze: "は" },
    { jp: "これはおいしいです。", reading: "これはおいしいです。", meaning: "Ini enak. (This is delicious.)", cloze: "は" },
    { jp: "だれが窓を開けましたか。", reading: "だれがまどをあけましたか。", meaning: "Siapa yang membuka jendela? (Who opened the window?)", cloze: "が" },
    { jp: "山田さんが来ました。", reading: "やまださんがきました。", meaning: "Pak Yamada datang. (Mr. Yamada came.)", cloze: "が" },
    { jp: "象は鼻が長いです。", reading: "ぞうははながながいです。", meaning: "Gajah, belalainya panjang. (As for elephants, the trunk is long.)", cloze: "が" },
    { jp: "きょうは天気がいいです。", reading: "きょうはてんきがいいです。", meaning: "Hari ini cuacanya bagus. (Today the weather is nice.)", cloze: "は" },
    { jp: "何がほしいですか。", reading: "なにがほしいですか。", meaning: "Apa yang kamu inginkan? (What do you want?)", cloze: "が" },
    { jp: "この店はパンがおいしいです。", reading: "このみせはぱんがおいしいです。", meaning: "Toko ini rotinya enak. (This shop's bread is delicious.)" }
  ],
  mcq: [
    { sentence: "だれ＿＿窓を開けましたか。", options: ["が", "は", "を", "に"], answer: 0, explain: "Kata tanya だれ + が untuk menanyakan subjek/pelaku." }
  ]
},

{
  id: "n5-o-ni-de", level: "N5", group: "Partikel Dasar",
  pattern: "を・に・で", reading: "o / ni / de",
  meaning: "objek / waktu-tujuan-arah / tempat-alat (object / time-direction / place-means)",
  whenToUse: "を = objek langsung dari kata kerja. に = waktu spesifik, tujuan/arah, atau lokasi keberadaan. で = tempat terjadinya aksi, atau alat/cara. (を = direct object; に = specific time, direction/goal, or location of existence; で = place of action or means.)",
  formation: [
    { pos: "Objek", rule: "N + を + Vた", ex: "パンを食べる" },
    { pos: "Waktu/tujuan", rule: "N + に", ex: "7時に起きる／学校に行く" },
    { pos: "Tempat aksi/alat", rule: "N + で", ex: "図書館で勉強する／バスで行く" }
  ],
  register: "Pitfall umum: あります／います pakai に (lokasi keberadaan), sedangkan aksi pakai で. 'テーブルに本があります' ✓ vs '公園で遊びます' ✓. (Existence uses に; actions happen で.)",
  contrast: "vs へ: へ juga menunjukkan arah tapi lebih menekankan 'menuju', に lebih umum & juga dipakai untuk waktu. (へ emphasizes direction of movement; に is more general and also marks time.)",
  examples: [
    { jp: "朝ごはんを食べます。", reading: "あさごはんをたべます。", meaning: "Makan sarapan. (Eat breakfast.)", cloze: "を" },
    { jp: "7時に起きます。", reading: "しちじにおきます。", meaning: "Bangun jam 7. (Wake up at 7.)", cloze: "に" },
    { jp: "来週、京都に行きます。", reading: "らいしゅう、きょうとにいきます。", meaning: "Minggu depan pergi ke Kyoto. (Next week I'll go to Kyoto.)", cloze: "に" },
    { jp: "図書館で本を読みます。", reading: "としょかんでほんをよみます。", meaning: "Membaca buku di perpustakaan. (Read a book at the library.)", cloze: "で" },
    { jp: "バスで学校へ行きます。", reading: "ばすでがっこうへいきます。", meaning: "Pergi ke sekolah naik bus. (Go to school by bus.)", cloze: "で" },
    { jp: "テーブルに花があります。", reading: "てーぶるにはながあります。", meaning: "Ada bunga di atas meja. (There is a flower on the table.)", cloze: "に" },
    { jp: "公園で子どもが遊んでいます。", reading: "こうえんでこどもがあそんでいます。", meaning: "Anak-anak bermain di taman. (Children are playing in the park.)", cloze: "で" },
    { jp: "毎朝コーヒーを飲みます。", reading: "まいあさこーひーをのみます。", meaning: "Setiap pagi minum kopi. (I drink coffee every morning.)", cloze: "を" },
    { jp: "友だちに手紙を書きました。", reading: "ともだちにてがみをかきました。", meaning: "Menulis surat untuk teman. (I wrote a letter to my friend.)", cloze: "に" }
  ]
},

{
  id: "n5-arimasu-imasu", level: "N5", group: "Eksistensi",
  pattern: "あります／います", reading: "arimasu / imasu",
  meaning: "ada (untuk benda mati / makhluk hidup) (there is/are — inanimate / animate)",
  whenToUse: "あります dipakai untuk benda mati/tak bergerak (termasuk tumbuhan). います dipakai untuk manusia dan hewan (makhluk yang bergerak sendiri). (あります for inanimate objects; います for people/animals.)",
  formation: [
    { pos: "Benda mati", rule: "N(に) + N が + あります", ex: "机の上に本があります。" },
    { pos: "Makhluk hidup", rule: "N(に) + N が + います", ex: "教室に学生がいます。" }
  ],
  register: "Pitfall: 家族がいます (keluarga = orang → います), tapi 車があります (mobil = benda → あります). Pohon/tanaman tetap pakai あります meski 'hidup'. (Family → います; car → あります; plants still use あります.)",
  contrast: "vs あります(kegiatan): あります juga bisa berarti 'ada acara/jadwal' (例: 明日テストがあります), bukan hanya keberadaan benda.",
  examples: [
    { jp: "机の上に本があります。", reading: "つくえのうえにほんがあります。", meaning: "Ada buku di atas meja. (There's a book on the desk.)", cloze: "あります" },
    { jp: "教室に学生がいます。", reading: "きょうしつにがくせいがいます。", meaning: "Ada murid di kelas. (There are students in the classroom.)", cloze: "います" },
    { jp: "庭に猫がいます。", reading: "にわにねこがいます。", meaning: "Ada kucing di halaman. (There's a cat in the yard.)", cloze: "います" },
    { jp: "冷蔵庫に卵がありません。", reading: "れいぞうこにたまごがありません。", meaning: "Tidak ada telur di kulkas. (There are no eggs in the fridge.)", cloze: "ありません" },
    { jp: "兄弟がいますか。", reading: "きょうだいがいますか。", meaning: "Apakah kamu punya saudara? (Do you have siblings?)", cloze: "います" },
    { jp: "駅の前にコンビニがあります。", reading: "えきのまえにこんびにがあります。", meaning: "Ada minimarket di depan stasiun. (There's a convenience store in front of the station.)", cloze: "あります" },
    { jp: "きのう、会議がありました。", reading: "きのう、かいぎがありました。", meaning: "Kemarin ada rapat. (There was a meeting yesterday.)", cloze: "ありました" },
    { jp: "公園に子どもたちがいました。", reading: "こうえんにこどもたちがいました。", meaning: "Tadi ada anak-anak di taman. (There were children in the park.)", cloze: "いました" }
  ]
},

{
  id: "n5-masu", level: "N5", group: "Bentuk Kata Kerja",
  pattern: "ます／ません／ました／ませんでした", reading: "masu / masen / mashita / masendeshita",
  meaning: "bentuk sopan kata kerja: sekarang/negatif/lampau/lampau negatif",
  whenToUse: "Bentuk ます adalah bentuk sopan standar untuk semua kata kerja dalam percakapan formal/sopan, dipakai dengan orang yang belum akrab atau situasi resmi. (The polite verb form used in formal/polite speech.)",
  formation: [
    { pos: "Non-past", rule: "V-ます", ex: "食べます" },
    { pos: "Negatif", rule: "V-ません", ex: "食べません" },
    { pos: "Lampau", rule: "V-ました", ex: "食べました" },
    { pos: "Lampau negatif", rule: "V-ませんでした", ex: "食べませんでした" }
  ],
  register: "Selalu pakai bentuk ます saat bicara dengan atasan, orang baru kenal, atau di tempat kerja/sekolah. Dengan teman dekat biasanya beralih ke bentuk kamus/biasa. (Use ます with superiors/strangers; plain form with close friends.)",
  contrast: "vs bentuk biasa (plain form): 食べる/食べない/食べた/食べなかった adalah versi kasual dari 4 bentuk di atas, dipakai untuk teman dekat & sebagai basis banyak pola tata bahasa N4 (〜と思う、〜から dll).",
  examples: [
    { jp: "毎日、日本語を勉強します。", reading: "まいにち、にほんごをべんきょうします。", meaning: "Setiap hari belajar bahasa Jepang. (I study Japanese every day.)", cloze: "します" },
    { jp: "肉を食べません。", reading: "にくをたべません。", meaning: "Tidak makan daging. (I don't eat meat.)", cloze: "ません" },
    { jp: "先週、映画を見ました。", reading: "せんしゅう、えいがをみました。", meaning: "Minggu lalu menonton film. (I watched a movie last week.)", cloze: "見ました" },
    { jp: "きのう学校へ行きませんでした。", reading: "きのうがっこうへいきませんでした。", meaning: "Kemarin tidak pergi ke sekolah. (I didn't go to school yesterday.)", cloze: "行きませんでした" },
    { jp: "毎朝、新聞を読みます。", reading: "まいあさ、しんぶんをよみます。", meaning: "Setiap pagi membaca koran. (I read the newspaper every morning.)", cloze: "読みます" },
    { jp: "今晩、電話します。", reading: "こんばん、でんわします。", meaning: "Malam ini akan menelepon. (I'll call tonight.)", cloze: "します" },
    { jp: "彼はまだ来ません。", reading: "かれはまだきません。", meaning: "Dia belum datang. (He hasn't come yet.)", cloze: "来ません" },
    { jp: "去年、日本へ行きました。", reading: "きょねん、にほんへいきました。", meaning: "Tahun lalu pergi ke Jepang. (Last year I went to Japan.)", cloze: "行きました" }
  ]
},

{
  id: "n5-iadj-nadj", level: "N5", group: "Konjugasi Adjektiva",
  pattern: "い-adjektiva／な-adjektiva", reading: "i-keiyoushi / na-keiyoushi",
  meaning: "konjugasi kata sifat い dan な (i-adjective and na-adjective conjugation)",
  whenToUse: "いadj berakhiran い dan berkonjugasi sendiri (高い→高くない). なadj butuh な sebelum kata benda dan だ/です untuk predikat (静かな部屋／静かです). (い-adjectives conjugate on their own; な-adjectives need な before a noun and だ/です as predicate.)",
  formation: [
    { pos: "いadj negatif", rule: "い→くない", ex: "高い → 高くない" },
    { pos: "いadj lampau", rule: "い→かった", ex: "高い → 高かった" },
    { pos: "いadj lampau negatif", rule: "い→くなかった", ex: "高い → 高くなかった" },
    { pos: "なadj + N", rule: "なadj + な + N", ex: "静か + な + 部屋" },
    { pos: "なadj predikat", rule: "なadj + だ／です", ex: "静かです／静かじゃない" }
  ],
  register: "Pitfall: いい (bagus) tidak beraturan — negatifnya よくない, bukan いくない. Pitfall lain: 有名, 元気, きれい secara tampilan mirip いadj tapi sebenarnya なadj (きれいな花, bukan きれい花). (いい is irregular: negative is よくない; きれい/元気/有名 are な-adjectives despite ending in い.)",
  contrast: "vs kata benda + です: なadj berperilaku hampir sama seperti kata benda dalam konjugasi (だ/です/じゃない), sedangkan いadj berkonjugasi sendiri tanpa です di bentuk biasa.",
  examples: [
    { jp: "この本は高くないです。", reading: "このほんはたかくないです。", meaning: "Buku ini tidak mahal. (This book isn't expensive.)", cloze: "高くない" },
    { jp: "きのうは寒かったです。", reading: "きのうはさむかったです。", meaning: "Kemarin dingin. (Yesterday was cold.)", cloze: "寒かった" },
    { jp: "テストは難しくなかったです。", reading: "てすとはむずかしくなかったです。", meaning: "Tesnya tidak sulit. (The test wasn't difficult.)", cloze: "難しくなかった" },
    { jp: "この部屋は静かです。", reading: "このへやはしずかです。", meaning: "Kamar ini tenang. (This room is quiet.)", cloze: "静かです" },
    { jp: "彼女はきれいな人です。", reading: "かのじょはきれいなひとです。", meaning: "Dia orang yang cantik. (She's a pretty person.)", cloze: "きれいな" },
    { jp: "この町は有名じゃありません。", reading: "このまちはゆうめいじゃありません。", meaning: "Kota ini tidak terkenal. (This town isn't famous.)", cloze: "有名じゃありません" },
    { jp: "田中さんは元気でした。", reading: "たなかさんはげんきでした。", meaning: "Pak Tanaka sehat (waktu itu). (Mr. Tanaka was well.)", cloze: "元気でした" },
    { jp: "この料理はおいしくて安いです。", reading: "このりょうりはおいしくてやすいです。", meaning: "Masakan ini enak dan murah. (This dish is delicious and cheap.)" }
  ]
},

{
  id: "n5-tai-hoshii", level: "N5", group: "Keinginan",
  pattern: "〜たい／〜がほしい", reading: "tai / ga hoshii",
  meaning: "ingin melakukan ~ / ingin (benda) ~ (want to do / want [a thing])",
  whenToUse: "〜たい dipakai untuk 'ingin melakukan aksi' (menempel di kata kerja). 〜がほしい dipakai untuk 'ingin memiliki benda' (kata benda + が + ほしい). Keduanya hanya untuk keinginan diri sendiri (orang pertama). (〜たい = want to [verb]; 〜がほしい = want [a noun]; both are first-person.)",
  formation: [
    { pos: "V-ますstem + たい", rule: "食べます→食べたい", ex: "食べたい" },
    { pos: "N + が + ほしい", rule: "kata benda + がほしい", ex: "車がほしい" }
  ],
  register: "Untuk orang ketiga, pakai 〜たがっている / ほしがっている, bukan langsung 〜たい/ほしい (yang terdengar seperti menebak isi hati orang lain secara langsung, kurang sopan). (For third person, use 〜たがっている/ほしがっている instead.)",
  contrast: "vs 〜たいです vs ほしいです: 〜たい sendiri sudah bentuk biasa (い-adjektiva), + です untuk sopan; ほしい juga いadj, pola sama.",
  examples: [
    { jp: "日本へ行きたいです。", reading: "にほんへいきたいです。", meaning: "Ingin pergi ke Jepang. (I want to go to Japan.)", cloze: "行きたい" },
    { jp: "新しい車がほしいです。", reading: "あたらしいくるまがほしいです。", meaning: "Ingin mobil baru. (I want a new car.)", cloze: "ほしい" },
    { jp: "何も食べたくないです。", reading: "なにもたべたくないです。", meaning: "Tidak ingin makan apa-apa. (I don't want to eat anything.)", cloze: "食べたくない" },
    { jp: "去年は自転車がほしかったです。", reading: "きょねんはじてんしゃがほしかったです。", meaning: "Tahun lalu saya ingin sepeda. (Last year I wanted a bicycle.)", cloze: "ほしかった" },
    { jp: "少し休みたいです。", reading: "すこしやすみたいです。", meaning: "Ingin istirahat sebentar. (I want to rest a little.)", cloze: "休みたい" },
    { jp: "本当は留学したかったです。", reading: "ほんとうはりゅうがくしたかったです。", meaning: "Sebenarnya ingin kuliah di luar negeri. (Actually, I wanted to study abroad.)", cloze: "したかった" },
    { jp: "水がほしいですか。", reading: "みずがほしいですか。", meaning: "Apakah kamu ingin air? (Do you want water?)", cloze: "ほしい" },
    { jp: "彼はゲームがほしがっています。", reading: "かれはげーむがほしがっています。", meaning: "Dia (kelihatannya) ingin game. (He wants a game [3rd person].)" }
  ]
},

{
  id: "n5-kudasai-mashou", level: "N5", group: "Permintaan & Ajakan",
  pattern: "〜てください／〜ましょう(か)", reading: "te kudasai / mashou (ka)",
  meaning: "tolong lakukan ~ / ayo ~ (kah) (please do ~ / let's ~ [shall we?])",
  whenToUse: "〜てください untuk meminta seseorang melakukan sesuatu dengan sopan. 〜ましょう untuk mengajak melakukan bersama; 〜ましょうか untuk menawarkan bantuan atau bertanya 'bagaimana kalau'. (〜てください = polite request; 〜ましょう = let's; 〜ましょうか = shall we / shall I.)",
  formation: [
    { pos: "V-て + ください", rule: "bentuk て + ください", ex: "待ってください" },
    { pos: "V-ますstem + ましょう", rule: "ajakan", ex: "行きましょう" },
    { pos: "V-ますstem + ましょうか", rule: "tawaran/pertanyaan", ex: "手伝いましょうか" }
  ],
  register: "〜てください bisa terdengar seperti perintah jika dipakai ke atasan; lebih sopan pakai 〜ていただけますか. (てください can sound like an order to superiors; 〜ていただけますか is more polite.)",
  contrast: "vs 〜てくださいませんか: versi lebih sopan/berhati-hati dari 〜てください, cocok untuk situasi formal.",
  examples: [
    { jp: "ちょっと待ってください。", reading: "ちょっとまってください。", meaning: "Tunggu sebentar. (Please wait a moment.)", cloze: "待ってください" },
    { jp: "ここに名前を書いてください。", reading: "ここになまえをかいてください。", meaning: "Tolong tulis nama di sini. (Please write your name here.)", cloze: "書いてください" },
    { jp: "一緒に昼ごはんを食べましょう。", reading: "いっしょにひるごはんをたべましょう。", meaning: "Ayo makan siang bersama. (Let's eat lunch together.)", cloze: "食べましょう" },
    { jp: "窓を開けましょうか。", reading: "まどをあけましょうか。", meaning: "Bagaimana kalau saya buka jendelanya? (Shall I open the window?)", cloze: "開けましょうか" },
    { jp: "静かにしてください。", reading: "しずかにしてください。", meaning: "Tolong diam/tenang. (Please be quiet.)", cloze: "してください" },
    { jp: "来週また会いましょう。", reading: "らいしゅうまたあいましょう。", meaning: "Ayo bertemu lagi minggu depan. (Let's meet again next week.)", cloze: "会いましょう" },
    { jp: "荷物を持ちましょうか。", reading: "にもつをもちましょうか。", meaning: "Mau saya bawakan barangnya? (Shall I carry your luggage?)", cloze: "持ちましょうか" },
    { jp: "電気を消してください。", reading: "でんきをけしてください。", meaning: "Tolong matikan lampunya. (Please turn off the light.)", cloze: "消してください" }
  ]
},

{
  id: "n5-teimasu", level: "N5", group: "Aspek",
  pattern: "〜ています", reading: "te imasu",
  meaning: "sedang ~ / dalam keadaan ~ (be doing ~ / a resulting state)",
  whenToUse: "Untuk kata kerja aksi (食べる、読む), 〜ています berarti 'sedang melakukan'. Untuk kata kerja perubahan-keadaan (結婚する、住む、知る), 〜ています menunjukkan hasil/keadaan yang berlangsung. (For action verbs: 'is doing'; for change-of-state verbs: an ongoing resulting state.)",
  formation: [
    { pos: "V-て + います", rule: "sedang melakukan", ex: "食べています" },
    { pos: "Verba perubahan-keadaan", rule: "hasil/keadaan", ex: "結婚しています" }
  ],
  register: "Pitfall: 結婚しています (sudah menikah/berstatus menikah), bukan '結婚します' yang berarti 'akan menikah'. (結婚しています = married [state]; 結婚します = will get married.)",
  contrast: "vs 〜てあります: 〜てあります menekankan hasil aksi yang disengaja seseorang pada suatu benda (窓が開けてあります = jendela sengaja dibuka & masih terbuka).",
  examples: [
    { jp: "今、テレビを見ています。", reading: "いま、てれびをみています。", meaning: "Sekarang sedang menonton TV. (I'm watching TV now.)", cloze: "見ています" },
    { jp: "田中さんは本を読んでいます。", reading: "たなかさんはほんをよんでいます。", meaning: "Pak Tanaka sedang membaca buku. (Mr. Tanaka is reading a book.)", cloze: "読んでいます" },
    { jp: "彼は結婚しています。", reading: "かれはけっこんしています。", meaning: "Dia sudah menikah. (He is married.)", cloze: "結婚しています" },
    { jp: "東京に住んでいます。", reading: "とうきょうにすんでいます。", meaning: "Saya tinggal di Tokyo. (I live in Tokyo.)", cloze: "住んでいます" },
    { jp: "雨が降っていません。", reading: "あめがふっていません。", meaning: "Sedang tidak hujan. (It's not raining.)", cloze: "降っていません" },
    { jp: "さっきまで雨が降っていました。", reading: "さっきまであめがふっていました。", meaning: "Tadi hujan turun sampai barusan. (It was raining until just now.)", cloze: "降っていました" },
    { jp: "彼女はこの会社で働いています。", reading: "かのじょはこのかいしゃではたらいています。", meaning: "Dia bekerja di perusahaan ini. (She works at this company.)", cloze: "働いています" },
    { jp: "子どもたちは公園で走っています。", reading: "こどもたちはこうえんではしっています。", meaning: "Anak-anak sedang berlari di taman. (The children are running in the park.)" }
  ]
},

{
  id: "n5-temoii-tehaikenai", level: "N5", group: "Izin & Larangan",
  pattern: "〜てもいいです／〜てはいけません", reading: "temo ii desu / tewa ikemasen",
  meaning: "boleh ~ / tidak boleh ~ (may / must not)",
  whenToUse: "〜てもいいです memberi izin ('boleh melakukan'). 〜てはいけません melarang ('tidak boleh/dilarang'). Sering dipakai untuk aturan, izin sekolah/kantor, dsb. (〜てもいい grants permission; 〜てはいけない forbids.)",
  formation: [
    { pos: "V-て + もいいです", rule: "izin", ex: "帰ってもいいです" },
    { pos: "V-て + はいけません", rule: "larangan", ex: "帰ってはいけません" }
  ],
  register: "は setelah て sering diucapkan/ditulis casual sebagai ちゃ: 食べちゃいけない = 食べてはいけない. Pitfall: 〜てもいいですか untuk MEMINTA izin, 〜てもいいです untuk MEMBERI izin. (Casual contraction てはちゃ; ですか to ask permission, です to grant it.)",
  contrast: "vs 〜なくてもいいです: itu pola berbeda yang berarti 'tidak perlu melakukan' (lihat poin なければならない).",
  examples: [
    { jp: "ここに座ってもいいですか。", reading: "ここにすわってもいいですか。", meaning: "Bolehkah saya duduk di sini? (May I sit here?)", cloze: "座ってもいいです" },
    { jp: "写真を撮ってもいいです。", reading: "しゃしんをとってもいいです。", meaning: "Boleh memotret. (You may take photos.)", cloze: "撮ってもいいです" },
    { jp: "ここでたばこを吸ってはいけません。", reading: "ここでたばこをすってはいけません。", meaning: "Tidak boleh merokok di sini. (You must not smoke here.)", cloze: "吸ってはいけません" },
    { jp: "教室で食べてはいけません。", reading: "きょうしつでたべてはいけません。", meaning: "Tidak boleh makan di kelas. (You must not eat in the classroom.)", cloze: "食べてはいけません" },
    { jp: "この本を借りてもいいですか。", reading: "このほんをかりてもいいですか。", meaning: "Bolehkah saya pinjam buku ini? (May I borrow this book?)", cloze: "借りてもいいです" },
    { jp: "先に帰ってもいいです。", reading: "さきにかえってもいいです。", meaning: "Boleh pulang duluan. (You may go home first.)", cloze: "帰ってもいいです" },
    { jp: "ここに車を止めてはいけません。", reading: "ここにくるまをとめてはいけません。", meaning: "Tidak boleh parkir mobil di sini. (You must not park here.)", cloze: "止めてはいけません" },
    { jp: "テストのとき、辞書を使ってもいいですか。", reading: "てすとのとき、じしょをつかってもいいですか。", meaning: "Waktu tes, bolehkah pakai kamus? (May I use a dictionary during the test?)" }
  ],
  mcq: [
    { sentence: "ここでたばこを＿＿いけません。", options: ["吸っては", "吸っても", "吸ったら", "吸うなら"], answer: 0, explain: "Larangan = 〜てはいけません。〜てもいい = izin (kebalikannya)." }
  ]
},

{
  id: "n5-nakerebanaranai", level: "N5", group: "Kewajiban",
  pattern: "〜なければなりません／〜なくてもいいです", reading: "nakereba narimasen / nakutemo ii desu",
  meaning: "harus ~ / tidak perlu ~ (must / don't have to)",
  whenToUse: "〜なければなりません menyatakan kewajiban ('harus melakukan'). 〜なくてもいいです menyatakan tidak ada keharusan ('tidak perlu melakukan', boleh tidak dilakukan). (〜なければならない = must; 〜なくてもいい = don't have to.)",
  formation: [
    { pos: "V-ない → 〜なければ + なりません", rule: "kewajiban", ex: "行かなければなりません" },
    { pos: "V-ない → 〜なくてもいいです", rule: "tidak perlu", ex: "行かなくてもいいです" }
  ],
  register: "Bentuk lisan santai: 〜なきゃ (行かなきゃ). Pitfall: jangan disamakan dengan 〜てはいけません (dilarang) — なければならない adalah kewajiban, bukan larangan. (Casual: 〜なきゃ; don't confuse with てはいけません which is prohibition.)",
  contrast: "vs 〜ないといけない: pola alternatif yang berarti sama persis dengan なければならない, lebih sering dipakai lisan.",
  examples: [
    { jp: "明日、早く起きなければなりません。", reading: "あした、はやくおきなければなりません。", meaning: "Besok harus bangun pagi. (I must wake up early tomorrow.)", cloze: "起きなければなりません" },
    { jp: "宿題をしなければなりません。", reading: "しゅくだいをしなければなりません。", meaning: "Harus mengerjakan PR. (I must do my homework.)", cloze: "しなければなりません" },
    { jp: "今日は残業しなくてもいいです。", reading: "きょうはざんぎょうしなくてもいいです。", meaning: "Hari ini tidak perlu lembur. (I don't have to work overtime today.)", cloze: "しなくてもいいです" },
    { jp: "スーツを着なくてもいいです。", reading: "すーつをきなくてもいいです。", meaning: "Tidak perlu memakai jas. (You don't have to wear a suit.)", cloze: "着なくてもいいです" },
    { jp: "病院に行かなければなりませんでした。", reading: "びょういんにいかなければなりませんでした。", meaning: "(Waktu itu) harus pergi ke rumah sakit. (I had to go to the hospital.)", cloze: "行かなければなりませんでした" },
    { jp: "会議に出なければなりません。", reading: "かいぎにでなければなりません。", meaning: "Harus hadir rapat. (I must attend the meeting.)", cloze: "出なければなりません" },
    { jp: "今すぐ返事をしなくてもいいです。", reading: "いますぐへんじをしなくてもいいです。", meaning: "Tidak perlu membalas sekarang juga. (You don't have to reply right away.)", cloze: "しなくてもいいです" },
    { jp: "毎日漢字を勉強しなければなりません。", reading: "まいにちかんじをべんきょうしなければなりません。", meaning: "Harus belajar kanji setiap hari. (I have to study kanji every day.)" }
  ]
},

{
  id: "n5-yori-houga-ichiban", level: "N5", group: "Perbandingan",
  pattern: "〜より／〜ほうが／一番", reading: "yori / hou ga / ichiban",
  meaning: "lebih ~ daripada / paling ~ (more ~ than / the most ~)",
  whenToUse: "AはBより〜 membandingkan dua hal (A lebih ~ dari B). 〜ほうがいい dipakai untuk memilih salah satu opsi. 一番 menyatakan superlatif (paling). (A は B より = A is more ~ than B; ほうが for choosing between options; 一番 = the most.)",
  formation: [
    { pos: "Perbandingan", rule: "A は B より adj", ex: "夏は冬より暑いです。" },
    { pos: "Pilihan", rule: "A のほうが adj", ex: "電車のほうが速いです。" },
    { pos: "Superlatif", rule: "N の中で一番 adj", ex: "この中で一番安いです。" }
  ],
  register: "Pitfall: urutan A/B setelah より bisa dibalik posisinya dalam kalimat asal maknanya tetap jelas (より selalu menempel pada hal yang 'dikalahkan'). (より always attaches to the thing being surpassed, regardless of sentence order.)",
  contrast: "vs 〜ほど〜ない: pola untuk perbandingan negatif ('tidak se~'), misalnya 今日は昨日ほど暑くない (hari ini tidak sepanas kemarin).",
  examples: [
    { jp: "夏は冬より暑いです。", reading: "なつはふゆよりあついです。", meaning: "Musim panas lebih panas dari musim dingin. (Summer is hotter than winter.)", cloze: "より" },
    { jp: "電車のほうがバスより速いです。", reading: "でんしゃのほうがばすよりはやいです。", meaning: "Kereta lebih cepat daripada bus. (The train is faster than the bus.)", cloze: "ほうが" },
    { jp: "この中で一番安いのはこれです。", reading: "このなかでいちばんやすいのはこれです。", meaning: "Yang paling murah di antara ini adalah yang ini. (This is the cheapest among these.)", cloze: "一番" },
    { jp: "肉より魚のほうが好きです。", reading: "にくよりさかなのほうがすきです。", meaning: "Lebih suka ikan daripada daging. (I like fish more than meat.)", cloze: "より" },
    { jp: "日本語のクラスで彼が一番上手です。", reading: "にほんごのくらすでかれがいちばんじょうずです。", meaning: "Di kelas bahasa Jepang, dia yang paling pandai. (He's the best in the Japanese class.)", cloze: "一番" },
    { jp: "歩くより自転車のほうが楽です。", reading: "あるくよりじてんしゃのほうがらくです。", meaning: "Naik sepeda lebih santai daripada jalan kaki. (Biking is more comfortable than walking.)", cloze: "より" },
    { jp: "去年より今年のほうが忙しいです。", reading: "きょねんよりことしのほうがいそがしいです。", meaning: "Tahun ini lebih sibuk daripada tahun lalu. (This year is busier than last year.)", cloze: "より" },
    { jp: "家族の中で父が一番背が高いです。", reading: "かぞくのなかでちちがいちばんせがたかいです。", meaning: "Di keluarga, ayah yang paling tinggi. (In my family, my father is the tallest.)" }
  ]
}

,

// =====================================================================
// N4 — core (the emphasis of this deck)
// =====================================================================

// ---- Plain form & quoting ----
{
  id: "n4-to-omou", level: "N4", group: "Bentuk Biasa & Kutipan",
  pattern: "〜と思う／〜と言う／〜という", reading: "to omou / to iu / to iu",
  meaning: "menurut saya ~ / mengatakan ~ / yang disebut ~ (I think ~ / say ~ / called ~)",
  whenToUse: "〜と思う menyampaikan pendapat pribadi. 〜と言う melaporkan ucapan orang lain. 〜という dipakai untuk menyebut/menjelaskan nama sesuatu ('yang bernama'). Ketiganya menempel pada kalimat bentuk biasa sebelum と. (と思う = opinion; と言う = reported speech; という = 'called/named'.)",
  formation: [
    { pos: "Bentuk biasa + と思う", rule: "pendapat", ex: "雨が降ると思います。" },
    { pos: "Bentuk biasa/kutipan + と言う", rule: "ucapan orang lain", ex: "「行く」と言いました。" },
    { pos: "N/frasa + という + N", rule: "penamaan", ex: "すしという食べ物" }
  ],
  register: "Pitfall: setelah pendapat sendiri gunakan と思います (bukan と思っています, kecuali menyatakan pikiran yang berlangsung lama). と言いました selalu perlu penutur yang jelas (siapa yang berkata). (と思います for a momentary opinion; と言いました needs a clear speaker.)",
  contrast: "vs 〜そうだ(伝聞): 〜そうだ hearsay lebih menekankan 'saya dengar dari sumber', sedangkan と言う menyebutkan siapa & apa persisnya yang dikatakan.",
  examples: [
    { jp: "明日は雨が降ると思います。", reading: "あしたはあめがふるとおもいます。", meaning: "Menurut saya besok akan hujan. (I think it'll rain tomorrow.)", cloze: "と思います" },
    { jp: "この映画はおもしろいと思います。", reading: "このえいがはおもしろいとおもいます。", meaning: "Menurut saya film ini menarik. (I think this movie is interesting.)", cloze: "と思います" },
    { jp: "彼は来ないと思います。", reading: "かれはこないとおもいます。", meaning: "Menurut saya dia tidak akan datang. (I don't think he'll come.)", cloze: "と思います" },
    { jp: "田中さんは「疲れた」と言いました。", reading: "たなかさんは「つかれた」といいました。", meaning: "Pak Tanaka berkata, \"Saya lelah\". (Mr. Tanaka said, \"I'm tired.\")", cloze: "と言いました" },
    { jp: "母は来週来ると言っていました。", reading: "はははらいしゅうくるといっていました。", meaning: "Ibu bilang akan datang minggu depan. (Mom said she'll come next week.)", cloze: "と言っていました" },
    { jp: "すしという食べ物を知っていますか。", reading: "すしというたべものをしっていますか。", meaning: "Apakah kamu tahu makanan yang disebut sushi? (Do you know the food called sushi?)", cloze: "という" },
    { jp: "富士山という山を見たことがあります。", reading: "ふじさんというやまをみたことがあります。", meaning: "Saya pernah melihat gunung bernama Fuji. (I've seen the mountain called Fuji.)", cloze: "という" },
    { jp: "この漢字は何と読みますか。", reading: "このかんじはなんとよみますか。", meaning: "Kanji ini dibaca apa? (How do you read this kanji?)", cloze: "と読みます" },
    { jp: "それは無理だと思います。", reading: "それはむりだとおもいます。", meaning: "Menurut saya itu tidak mungkin. (I think that's impossible.)", cloze: "と思います" },
    { jp: "先生は明日休むと言いました。", reading: "せんせいはあしたやすむといいました。", meaning: "Guru bilang besok akan libur. (The teacher said he'd be off tomorrow.)" }
  ],
  mcq: [
    { sentence: "明日は雨が降る＿＿思います。", options: ["と", "を", "に", "で"], answer: 0, explain: "Pendapat pribadi menempel dengan と + 思います (bentuk biasa + と思う)。" }
  ],
  jlptBuild: [{ chunks: ["明日は", "雨が", "降ると", "思います"], starIndex: 2, suffix: "。", translation: "Saya pikir besok akan hujan。" }]
},

{
  id: "n4-deshou", level: "N4", group: "Bentuk Biasa & Kutipan",
  pattern: "〜でしょう／〜だろう", reading: "deshou / darou",
  meaning: "mungkin ~ / kan? (probably ~ / right?)",
  whenToUse: "でしょう(sopan)／だろう(biasa) dipakai untuk menebak/memperkirakan sesuatu dengan tingkat keyakinan tinggi, atau meminta konfirmasi (dengan intonasi naik). (Used for confident conjecture, or to seek agreement with rising intonation.)",
  formation: [
    { pos: "Bentuk biasa + でしょう", rule: "perkiraan sopan", ex: "明日は晴れるでしょう。" },
    { pos: "Bentuk biasa + だろう", rule: "perkiraan biasa/lisan", ex: "彼も来るだろう。" }
  ],
  register: "でしょう juga sering dipakai di ramalan cuaca (明日は雨でしょう). Pitfall: なadj/N + でしょう tanpa だ (静かでしょう, bukan 静かだでしょう). (Common in weather forecasts; drop だ before でしょう with な-adj/nouns.)",
  contrast: "vs たぶん〜でしょう: たぶん (mungkin) sering dipasangkan dengan でしょう untuk memperkuat nuansa perkiraan.",
  examples: [
    { jp: "明日は晴れるでしょう。", reading: "あしたははれるでしょう。", meaning: "Besok mungkin cerah. (It'll probably be sunny tomorrow.)", cloze: "でしょう" },
    { jp: "たぶん彼は知らないでしょう。", reading: "たぶんかれはしらないでしょう。", meaning: "Mungkin dia tidak tahu. (He probably doesn't know.)", cloze: "でしょう" },
    { jp: "この問題は難しいでしょう。", reading: "このもんだいはむずかしいでしょう。", meaning: "Soal ini mungkin sulit. (This problem is probably difficult.)", cloze: "でしょう" },
    { jp: "今夜は雪が降るだろう。", reading: "こんやはゆきがふるだろう。", meaning: "Malam ini mungkin akan turun salju. (It'll probably snow tonight.)", cloze: "だろう" },
    { jp: "これでいいでしょうか。", reading: "これでいいでしょうか。", meaning: "Apakah ini sudah cukup? (Would this be alright?)", cloze: "でしょうか" },
    { jp: "彼女もパーティーに来るでしょう。", reading: "かのじょもぱーてぃーにくるでしょう。", meaning: "Dia mungkin juga akan datang ke pesta. (She'll probably come to the party too.)", cloze: "でしょう" },
    { jp: "たぶん、この店は高いだろう。", reading: "たぶん、このみせはたかいだろう。", meaning: "Mungkin toko ini mahal. (This shop is probably expensive.)", cloze: "だろう" },
    { jp: "その話は本当でしょうか。", reading: "そのはなしはほんとうでしょうか。", meaning: "Apakah cerita itu benar ya? (Is that story true, I wonder?)", cloze: "でしょうか" },
    { jp: "彼はもう知っているでしょう。", reading: "かれはもうしっているでしょう。", meaning: "Dia mungkin sudah tahu. (He probably already knows.)", cloze: "でしょう" },
    { jp: "駅から近いから、便利でしょう。", reading: "えきからちかいから、べんりでしょう。", meaning: "Karena dekat dari stasiun, mungkin praktis. (Since it's close to the station, it's probably convenient.)", cloze: "でしょう" }
  ],
  mcq: [
    { sentence: "たぶん彼は来ない＿＿。", options: ["でしょう", "です", "ます", "ました"], answer: 0, explain: "Perkiraan/tebakan memakai でしょう, bukan bentuk です biasa。" }
  ],
  jlptBuild: [{ chunks: ["たぶん", "彼は", "来ない", "でしょう"], starIndex: 2, suffix: "。", translation: "Mungkin dia tidak akan datang。" }]
},

// ---- Reasons & explanation ----
{
  id: "n4-kara", level: "N4", group: "Alasan & Penjelasan",
  pattern: "〜から", reading: "kara",
  meaning: "karena ~ (because ~)",
  whenToUse: "Menyatakan sebab secara subjektif/tegas — sering dipakai saat memberi alasan atas keputusan, permintaan, atau perintah pribadi. (States a subjective/assertive reason — common when justifying a decision, request, or command.)",
  formation: [
    { pos: "Bentuk biasa + から", rule: "semua jenis kata", ex: "忙しいから、行けません。" },
    { pos: "です/ます + から", rule: "juga bisa bentuk sopan", ex: "忙しいですから" }
  ],
  register: "から bisa berdiri di awal jawaban untuk menjawab なぜ／どうして (kenapa). Pitfall: から terasa lebih 'personal/menekankan alasan sendiri' dibanding ので yang lebih objektif — dalam permintaan resmi, ので lebih sopan. (から commonly answers なぜ/どうして; ので is politer for formal requests.)",
  contrast: "vs ので: から = alasan subjektif, cocok untuk keputusan/perintah; ので = alasan objektif, lebih sopan/formal.",
  examples: [
    { jp: "疲れたから、早く寝ます。", reading: "つかれたから、はやくねます。", meaning: "Karena capek, saya akan tidur cepat. (I'm tired, so I'll sleep early.)", cloze: "から" },
    { jp: "今日は忙しいから、行けません。", reading: "きょうはいそがしいから、いけません。", meaning: "Hari ini sibuk, jadi tidak bisa pergi. (I'm busy today, so I can't go.)", cloze: "から" },
    { jp: "危ないから、気をつけてください。", reading: "あぶないから、きをつけてください。", meaning: "Karena berbahaya, tolong hati-hati. (It's dangerous, so please be careful.)", cloze: "から" },
    { jp: "安いから、これを買います。", reading: "やすいから、これをかいます。", meaning: "Karena murah, saya akan beli ini. (It's cheap, so I'll buy this.)", cloze: "から" },
    { jp: "雨が降っているから、傘を持って行きます。", reading: "あめがふっているから、かさをもっていきます。", meaning: "Karena sedang hujan, saya akan bawa payung. (It's raining, so I'll bring an umbrella.)", cloze: "から" },
    { jp: "彼は先生だから、よく知っています。", reading: "かれはせんせいだから、よくしっています。", meaning: "Karena dia guru, dia tahu banyak. (He's a teacher, so he knows well.)", cloze: "から" },
    { jp: "なぜ休んだんですか。—頭が痛かったからです。", reading: "なぜやすんだんですか。あたまがいたかったからです。", meaning: "Kenapa kamu absen? — Karena kepala saya sakit. (Why were you absent? — Because I had a headache.)", cloze: "からです" },
    { jp: "静かだから、ここで勉強します。", reading: "しずかだから、ここでべんきょうします。", meaning: "Karena tenang, saya belajar di sini. (It's quiet, so I'll study here.)", cloze: "から" },
    { jp: "もう遅いから、帰りましょう。", reading: "もうおそいから、かえりましょう。", meaning: "Karena sudah larut, ayo pulang. (It's late, so let's go home.)", cloze: "から" },
    { jp: "田中さんは病気だから、休んでいます。", reading: "たなかさんはびょうきだから、やすんでいます。", meaning: "Karena Pak Tanaka sakit, dia sedang izin. (Mr. Tanaka is sick, so he's off work.)", cloze: "から" }
  ],
  mcq: [
    { sentence: "頭が痛い＿＿、薬を飲みました。", options: ["から", "のに", "し", "ても"], answer: 0, explain: "頭が痛い (alasan langsung) + から → 薬を飲みました (aksi yang diambil karena alasan itu)." }
  ],
  jlptBuild: [{ chunks: ["雨が", "降っているから", "傘を", "持って行きます"], starIndex: 1, suffix: "。", translation: "Karena sedang hujan, saya akan bawa payung。" }]
},

{
  id: "n4-node", level: "N4", group: "Alasan & Penjelasan",
  pattern: "〜ので", reading: "node",
  meaning: "karena ~ (because ~)",
  whenToUse: "Menyatakan sebab/alasan secara objektif dan sopan. Dipakai saat menjelaskan kenapa sesuatu terjadi tanpa terdengar memaksa — cocok untuk permintaan izin/maaf yang sopan. (States a reason objectively and politely — good for polite requests/apologies.)",
  formation: [
    { pos: "Kata Kerja (V)", rule: "bentuk biasa + ので", ex: "遅れた + ので → 遅れたので" },
    { pos: "いadj", rule: "いadj + ので", ex: "高い + ので → 高いので" },
    { pos: "なadj", rule: "なadj + な + ので", ex: "静か + なので → 静かなので" },
    { pos: "Kata Benda (N)", rule: "N + な + ので", ex: "病気 + なので → 病気なので" }
  ],
  register: "Lebih halus & formal dari から; cocok untuk situasi sopan/tertulis. Pitfall: jangan pakai だので — dengan N/なadj gunakan なので, bukan だので. (Softer/more formal than から; common mistake だので → should be なので.)",
  contrast: "vs から: から menekankan alasan subjektif & sering dipakai untuk keputusan/perintah pribadi; ので terdengar lebih objektif & sopan, jarang dipakai untuk memerintah orang lain secara langsung.",
  kanjiLinks: ["遅れます"],
  examples: [
    { jp: "電車が遅れたので、遅刻しました。", reading: "でんしゃがおくれたので、ちこくしました。", meaning: "Karena kereta terlambat, saya terlambat. (The train was late, so I was late.)", cloze: "ので" },
    { jp: "頭が痛いので、今日は休みます。", reading: "あたまがいたいので、きょうはやすみます。", meaning: "Karena sakit kepala, hari ini saya izin. (I have a headache, so I'll take the day off.)", cloze: "ので" },
    { jp: "ここは静かなので、勉強しやすいです。", reading: "ここはしずかなので、べんきょうしやすいです。", meaning: "Karena di sini tenang, mudah untuk belajar. (It's quiet here, so it's easy to study.)", cloze: "なので" },
    { jp: "日曜日なので、銀行は閉まっています。", reading: "にちようびなので、ぎんこうはしまっています。", meaning: "Karena hari Minggu, bank tutup. (It's Sunday, so the bank is closed.)", cloze: "なので" },
    { jp: "お金がないので、買えません。", reading: "おかねがないので、かえません。", meaning: "Karena tidak ada uang, tidak bisa membeli. (I have no money, so I can't buy it.)", cloze: "ので" },
    { jp: "まだ子どもなので、わかりません。", reading: "まだこどもなので、わかりません。", meaning: "Karena masih anak-anak, dia tidak mengerti. (They're still a child, so they don't understand.)", cloze: "なので" },
    { jp: "時間がなかったので、朝ごはんを食べませんでした。", reading: "じかんがなかったので、あさごはんをたべませんでした。", meaning: "Karena tidak ada waktu, saya tidak sarapan. (I had no time, so I didn't eat breakfast.)", cloze: "ので" },
    { jp: "すみません、急いでいるので、先に失礼します。", reading: "すみません、いそいでいるので、さきにしつれいします。", meaning: "Maaf, karena sedang terburu-buru, saya permisi duluan. (Sorry, I'm in a hurry, so I'll excuse myself first.)", cloze: "ので" },
    { jp: "道が込んでいたので、遅くなりました。", reading: "みちがこんでいたので、おそくなりました。", meaning: "Karena jalan macet, saya jadi terlambat. (The road was congested, so I ended up late.)", cloze: "ので" },
    { jp: "彼女は忙しいので、パーティーに来られません。", reading: "かのじょはいそがしいので、ぱーてぃーにこられません。", meaning: "Karena dia sibuk, dia tidak bisa datang ke pesta. (She's busy, so she can't come to the party.)" }
  ],
  mcq: [
    { sentence: "この本は難しい＿＿、読みたくないです。", options: ["ので", "のに", "でも", "し"], answer: 0, explain: "難しい (alasan) → ので。のに = 'meskipun' (although), tidak cocok di sini." },
    { sentence: "日曜日＿＿、銀行は閉まっています。", options: ["なので", "ので", "だので", "のに"], answer: 0, explain: "Kata benda (日曜日) + ので butuh な di antaranya: 日曜日なので。だので salah." }
  ],
  build: [
    { chunks: ["電車が", "遅れた", "ので", "遅刻しました"], answer: ["電車が", "遅れた", "ので", "遅刻しました"], translation: "Karena kereta terlambat, saya terlambat." }
  ],
  jlptBuild: [{ chunks: ["頭が", "痛いので", "今日は", "休みます"], starIndex: 2, suffix: "。", translation: "Karena sakit kepala, hari ini saya izin。" }]
},

{
  id: "n4-shi", level: "N4", group: "Alasan & Penjelasan",
  pattern: "〜し", reading: "shi",
  meaning: "selain itu ~, juga ~ (and what's more ~; listing reasons)",
  whenToUse: "Menyusun beberapa alasan/sifat sekaligus untuk mendukung satu kesimpulan, memberi kesan 'bukan cuma satu alasan, masih ada lagi'. (Lists multiple reasons/qualities supporting one conclusion — 'not just one reason, there's more'.)",
  formation: [
    { pos: "Bentuk biasa + し", rule: "semua jenis kata, bisa diulang 2x+", ex: "安いし、おいしいし…" }
  ],
  register: "Bisa dipakai dengan hanya satu し untuk memberi kesan 'masih ada alasan lain yang tidak disebutkan'. Pitfall: jangan campur dengan から dalam kalimat yang sama (pilih salah satu pola). (A single し implies unstated additional reasons; don't mix with から in the same clause.)",
  contrast: "vs 〜て (te-form untuk menghubungkan sifat): 〜て hanya menyambung tanpa nuansa 'alasan', sedangkan し secara eksplisit menyusun alasan-alasan.",
  examples: [
    { jp: "この店は安いし、おいしいし、よく来ます。", reading: "このみせはやすいし、おいしいし、よくきます。", meaning: "Toko ini murah, enak pula, jadi saya sering ke sini. (This shop is cheap, and delicious too, so I come often.)", cloze: "し" },
    { jp: "今日は雨だし、寒いし、出かけたくないです。", reading: "きょうはあめだし、さむいし、でかけたくないです。", meaning: "Hari ini hujan, dingin pula, jadi tidak ingin keluar. (It's raining and cold today, so I don't want to go out.)", cloze: "し" },
    { jp: "彼は頭もいいし、優しいです。", reading: "かれはあたまもいいし、やさしいです。", meaning: "Dia pintar, dan juga baik hati. (He's smart, and kind too.)", cloze: "し" },
    { jp: "この部屋は狭いし、暗いです。", reading: "このへやはせまいし、くらいです。", meaning: "Kamar ini sempit, dan gelap pula. (This room is small, and dark too.)", cloze: "し" },
    { jp: "時間もないし、お金もないし、旅行は無理です。", reading: "じかんもないし、おかねもないし、りょこうはむりです。", meaning: "Tidak ada waktu, tidak ada uang pula, jadi liburan tidak mungkin. (No time, no money either, so a trip is impossible.)", cloze: "し" },
    { jp: "宿題もあるし、今日は早く帰ります。", reading: "しゅくだいもあるし、きょうははやくかえります。", meaning: "Ada PR juga, jadi hari ini saya pulang cepat. (I also have homework, so I'll go home early today.)", cloze: "し" },
    { jp: "疲れたし、もう寝ます。", reading: "つかれたし、もうねます。", meaning: "Sudah capek, jadi saya tidur sekarang. (I'm tired, so I'm going to sleep now.)", cloze: "し" },
    { jp: "彼女は歌も上手だし、ダンスも上手です。", reading: "かのじょはうたもじょうずだし、だんすもじょうずです。", meaning: "Dia pandai menyanyi, pandai menari juga. (She's good at singing, and good at dancing too.)", cloze: "し" },
    { jp: "この町は便利だし、静かだし、住みやすいです。", reading: "このまちはべんりだし、しずかだし、すみやすいです。", meaning: "Kota ini praktis, tenang pula, jadi nyaman ditinggali. (This town is convenient, and quiet too, so it's easy to live in.)", cloze: "し" },
    { jp: "雨も降っているし、風も強いし、今日は出かけません。", reading: "あめもふっているし、かぜもつよいし、きょうはでかけません。", meaning: "Hujan turun, angin kencang pula, jadi hari ini saya tidak keluar. (It's raining, and windy too, so I won't go out today.)", cloze: "し" }
  ],
  mcq: [
    { sentence: "この店は安い＿＿、おいしいです。", options: ["し", "から", "ので", "のに"], answer: 0, explain: "Menyusun beberapa alasan sekaligus (masih ada alasan lain yang tersirat) → し。" }
  ],
  jlptBuild: [{ chunks: ["この店は", "安いし", "おいしいし", "よく来ます"], starIndex: 1, suffix: "。", translation: "Toko ini murah, enak pula, jadi saya sering ke sini。" }]
},

{
  id: "n4-ndesu", level: "N4", group: "Alasan & Penjelasan",
  pattern: "〜んです／〜のだ", reading: "n desu / no da",
  meaning: "yaitu ~ / soalnya ~ (explanatory: the situation is that ~)",
  whenToUse: "Dipakai untuk memberi penjelasan latar belakang, alasan, atau meminta penjelasan — memberi nuansa 'ada cerita/alasan di balik ini'. Sangat umum dalam percakapan. (Adds an explanatory nuance — 'the thing is...' — very common in conversation.)",
  formation: [
    { pos: "V/いadj biasa + んです", rule: "penjelasan", ex: "遅れたんです" },
    { pos: "なadj/N + なんです", rule: "penjelasan", ex: "病気なんです" },
    { pos: "Pertanyaan + んですか", rule: "meminta penjelasan", ex: "どうしたんですか。" }
  ],
  register: "んです adalah versi lisan santai dari のです. Pitfall: jangan pakai んです untuk sekadar melaporkan fakta netral tanpa konteks — pakai saat memang ada 'alasan/latar belakang' yang relevan. (んです is the casual spoken form of のです; overusing it for plain facts sounds odd.)",
  contrast: "vs ます biasa: 田中さんが休みます (fakta netral) vs 田中さんが休むんです (ada alasan/konteks di baliknya, misal menjawab pertanyaan 'kenapa dia tidak ada?').",
  examples: [
    { jp: "どうしたんですか。", reading: "どうしたんですか。", meaning: "Ada apa? (What's wrong?)", cloze: "んですか" },
    { jp: "頭が痛いんです。", reading: "あたまがいたいんです。", meaning: "Soalnya kepala saya sakit. (The thing is, I have a headache.)", cloze: "んです" },
    { jp: "電車が遅れたんです。", reading: "でんしゃがおくれたんです。", meaning: "Soalnya keretanya terlambat. (You see, the train was late.)", cloze: "んです" },
    { jp: "実は、来月結婚するんです。", reading: "じつは、らいげつけっこんするんです。", meaning: "Sebenarnya, bulan depan saya akan menikah. (Actually, I'm getting married next month.)", cloze: "んです" },
    { jp: "彼は今、病気なんです。", reading: "かれはいま、びょうきなんです。", meaning: "Dia sekarang sedang sakit. (He's sick right now, you see.)", cloze: "なんです" },
    { jp: "どこへ行くんですか。", reading: "どこへいくんですか。", meaning: "Kamu mau pergi ke mana (memangnya)? (Where are you going?)", cloze: "んですか" },
    { jp: "財布を忘れたんです。", reading: "さいふをわすれたんです。", meaning: "Soalnya saya lupa membawa dompet. (The thing is, I forgot my wallet.)", cloze: "んです" },
    { jp: "この漢字が読めないんです。", reading: "このかんじがよめないんです。", meaning: "Soalnya saya tidak bisa membaca kanji ini. (The thing is, I can't read this kanji.)", cloze: "んです" },
    { jp: "実はあまり好きじゃないんです。", reading: "じつはあまりすきじゃないんです。", meaning: "Sebenarnya saya tidak terlalu suka. (Actually, I don't really like it.)", cloze: "んです" },
    { jp: "実は、もう食べたんです。", reading: "じつは、もうたべたんです。", meaning: "Sebenarnya, saya sudah makan (tadi). (Actually, I've already eaten, you see.)", cloze: "んです" }
  ],
  mcq: [
    { sentence: "実は、来月結婚する＿＿。", options: ["んです", "です", "こと", "とき"], answer: 0, explain: "Menyatakan alasan/latar belakang secara kasual dari bentuk biasa + んです。" }
  ],
  jlptBuild: [{ chunks: ["実は", "来月", "結婚する", "んです"], starIndex: 3, suffix: "。", translation: "Sebenarnya, bulan depan saya akan menikah。" }]
},

// ---- Conditionals ----
{
  id: "n4-tara", level: "N4", group: "Kalimat Pengandaian",
  pattern: "〜たら", reading: "tara",
  meaning: "kalau/jika sudah ~ (if/when ~ [happens])",
  whenToUse: "Kondisional paling fleksibel — dipakai untuk syarat umum, kejadian satu-kali (masa depan), maupun 'setelah X terjadi, ternyata Y'. Bisa juga untuk saran (〜たらどうですか). (The most flexible conditional — general conditions, one-time future events, or 'after X happened, Y').",
  formation: [
    { pos: "V/いadj lampau + ら", rule: "たformのら", ex: "行った → 行ったら" },
    { pos: "なadj/N + だったら", rule: "lampau + だったら", ex: "暇だったら" }
  ],
  register: "たら bisa dipakai untuk kejadian yang pasti/satu kali di masa depan (雨が降ったら、行きません), sedangkan ば kurang natural untuk konteks ini. Pitfall: klausa akhir tidak boleh berupa ajakan/perintah dengan pola ば, tapi たら & なら aman untuk itu. (たら works for one-time future events; final clause can be a command/invitation, unlike ば.)",
  contrast: "vs ば: ば lebih formal/tertulis & tidak cocok untuk perintah di klausa akhir. vs と: と tidak boleh dipakai untuk ajakan/perintah/permintaan sama sekali. vs なら: なら merespons topik yang sudah disebut, bukan urutan kejadian.",
  examples: [
    { jp: "雨が降ったら、行きません。", reading: "あめがふったら、いきません。", meaning: "Kalau hujan turun, saya tidak akan pergi. (If it rains, I won't go.)", cloze: "たら" },
    { jp: "家に着いたら、電話します。", reading: "いえについたら、でんわします。", meaning: "Kalau sudah sampai rumah, saya akan telepon. (When I get home, I'll call.)", cloze: "たら" },
    { jp: "お金があったら、旅行します。", reading: "おかねがあったら、りょこうします。", meaning: "Kalau punya uang, saya akan liburan. (If I had money, I'd travel.)", cloze: "たら" },
    { jp: "安かったら、買います。", reading: "やすかったら、かいます。", meaning: "Kalau murah, saya akan beli. (If it's cheap, I'll buy it.)", cloze: "たら" },
    { jp: "暇だったら、手伝ってください。", reading: "ひまだったら、てつだってください。", meaning: "Kalau senggang, tolong bantu saya. (If you're free, please help me.)", cloze: "だったら" },
    { jp: "疲れたら、休んでください。", reading: "つかれたら、やすんでください。", meaning: "Kalau lelah, silakan istirahat. (If you get tired, please rest.)", cloze: "たら" },
    { jp: "駅に着いたら、教えてください。", reading: "えきについたら、おしえてください。", meaning: "Kalau sudah sampai stasiun, tolong beri tahu saya. (When you arrive at the station, please let me know.)", cloze: "たら" },
    { jp: "薬を飲んだら、よくなりました。", reading: "くすりをのんだら、よくなりました。", meaning: "Setelah minum obat, ternyata membaik. (After I took the medicine, I got better.)", cloze: "んだら" },
    { jp: "疲れたら、休んだらどうですか。", reading: "つかれたら、やすんだらどうですか。", meaning: "Kalau lelah, bagaimana kalau istirahat? (If you're tired, why not rest?)", cloze: "んだらどうですか" },
    { jp: "窓を開けたら、鳥が入ってきました。", reading: "まどをあけたら、とりがはいってきました。", meaning: "Begitu jendela dibuka, ternyata burung masuk. (When I opened the window, a bird came in.)" }
  ],
  mcq: [
    { sentence: "雨が＿＿、試合は中止です。", options: ["降ったら", "降れば", "降ると", "降るなら"], answer: 0, explain: "Kejadian satu-kali di masa depan dengan hasil pasti → たら paling natural." }
  ],
  jlptBuild: [{ chunks: ["家に", "着いたら", "すぐに", "電話します"], starIndex: 1, suffix: "。", translation: "Begitu sampai rumah, saya akan langsung telepon。" }]
},

{
  id: "n4-ba", level: "N4", group: "Kalimat Pengandaian",
  pattern: "〜ば", reading: "ba",
  meaning: "kalau/jika ~ (if ~)",
  whenToUse: "Kondisional yang menekankan hubungan syarat-umum secara logis/alami ('jika A, maka secara alami B'), sering dipakai untuk peribahasa, aturan umum, dan saran tidak langsung. Klausa akhir biasanya bukan perintah/ajakan langsung. (Emphasizes a general, logical if-then relationship; final clause usually isn't a direct command.)",
  formation: [
    { pos: "V (u→e+ば)", rule: "行く→行けば", ex: "行けば" },
    { pos: "いadj (い→ければ)", rule: "安い→安ければ", ex: "安ければ" },
    { pos: "なadj/N + なら(ば)", rule: "biasanya cukup なら", ex: "静かなら" }
  ],
  register: "Pitfall: klausa akhir dengan ば tidak boleh berupa perintah/ajakan/permintaan langsung bila subjeknya sama dan aksinya disengaja (行けば、来てください ✗ secara ketat; gunakan たら). Cocok untuk 'semakin A semakin B' (〜ば〜ほど). (Avoid using ば's final clause as a direct command with the same volitional subject; great for 'the more A, the more B'.)",
  contrast: "vs たら: たら lebih fleksibel untuk kejadian spesifik & perintah/ajakan; ば lebih ke hubungan umum/logis & sering di kalimat tertulis/formal.",
  examples: [
    { jp: "安ければ、買います。", reading: "やすければ、かいます。", meaning: "Kalau murah, saya akan beli. (If it's cheap, I'll buy it.)", cloze: "ければ" },
    { jp: "たくさん練習すれば、上手になります。", reading: "たくさんれんしゅうすれば、じょうずになります。", meaning: "Kalau banyak berlatih, akan menjadi mahir. (If you practice a lot, you'll get good at it.)", cloze: "すれば" },
    { jp: "早く出れば、間に合います。", reading: "はやくでれば、まにあいます。", meaning: "Kalau berangkat lebih awal, akan sempat. (If you leave early, you'll make it in time.)", cloze: "出れば" },
    { jp: "薬を飲めば、治ります。", reading: "くすりをのめば、なおります。", meaning: "Kalau minum obat, akan sembuh. (If you take the medicine, you'll recover.)", cloze: "飲めば" },
    { jp: "静かなら、ここで勉強できます。", reading: "しずかなら、ここでべんきょうできます。", meaning: "Kalau tenang, bisa belajar di sini. (If it's quiet, I can study here.)", cloze: "なら" },
    { jp: "ボタンを押せば、ドアが開きます。", reading: "ぼたんをおせば、どあがあきます。", meaning: "Kalau tombolnya ditekan, pintu akan terbuka. (If you press the button, the door opens.)", cloze: "押せば" },
    { jp: "練習すればするほど、上手になります。", reading: "れんしゅうすればするほど、じょうずになります。", meaning: "Semakin berlatih, semakin mahir. (The more you practice, the better you get.)", cloze: "すれば" },
    { jp: "天気がよければ、出かけましょう。", reading: "てんきがよければ、でかけましょう。", meaning: "Kalau cuaca bagus, ayo kita keluar. (If the weather is good, let's go out.)", cloze: "よければ" },
    { jp: "分からなければ、質問してください。", reading: "わからなければ、しつもんしてください。", meaning: "Kalau tidak paham, silakan bertanya. (If you don't understand, please ask.)", cloze: "なければ" },
    { jp: "電気を消せば、部屋が暗くなります。", reading: "でんきをけせば、へやがくらくなります。", meaning: "Kalau lampu dimatikan, ruangan akan gelap. (If you turn off the light, the room will get dark.)", cloze: "消せば" }
  ],
  mcq: [
    { sentence: "練習＿＿するほど、上手になります。", options: ["すれば", "したら", "すると", "するなら"], answer: 0, explain: "Pola '〜ば〜ほど' (semakin...semakin) khusus memakai ば." }
  ],
  jlptBuild: [{ chunks: ["たくさん", "練習すれば", "上手に", "なります"], starIndex: 1, suffix: "。", translation: "Kalau banyak berlatih, akan menjadi mahir。" }]
},

{
  id: "n4-to-cond", level: "N4", group: "Kalimat Pengandaian",
  pattern: "〜と", reading: "to",
  meaning: "kalau ~ (pasti) ~ (whenever/if ~, then automatically ~)",
  whenToUse: "Dipakai untuk hubungan sebab-akibat yang otomatis/pasti terjadi (hukum alam, kebiasaan, cara kerja sesuatu), sering diterjemahkan 'setiap kali'. Klausa akhir TIDAK BOLEH perintah, ajakan, atau permintaan. (Used for automatic, guaranteed cause-effect — 'whenever'; the final clause cannot be a command/invitation/request.)",
  formation: [
    { pos: "Bentuk biasa non-past + と", rule: "semua jenis kata", ex: "春になると" }
  ],
  register: "Pitfall besar: 春になると、行きましょう ✗ (と tidak boleh diikuti ajakan). Gunakan たら/なら untuk itu. と cocok untuk arah/petunjuk jalan (この道をまっすぐ行くと、駅があります). (と cannot be followed by invitations/commands; great for directions.)",
  contrast: "vs たら: たら bisa untuk kejadian satu-kali & boleh diikuti perintah/ajakan; と khusus untuk hubungan otomatis/berulang & tidak boleh diikuti perintah.",
  examples: [
    { jp: "春になると、桜が咲きます。", reading: "はるになると、さくらがさきます。", meaning: "Kalau musim semi tiba, sakura mekar. (When spring comes, cherry blossoms bloom.)", cloze: "と" },
    { jp: "このボタンを押すと、電気がつきます。", reading: "このぼたんをおすと、でんきがつきます。", meaning: "Kalau tombol ini ditekan, lampu menyala. (If you press this button, the light turns on.)", cloze: "と" },
    { jp: "この道をまっすぐ行くと、駅があります。", reading: "このみちをまっすぐいくと、えきがあります。", meaning: "Kalau jalan ini diikuti lurus, ada stasiun. (If you go straight on this road, there's a station.)", cloze: "と" },
    { jp: "お酒を飲むと、顔が赤くなります。", reading: "おさけをのむと、かおがあかくなります。", meaning: "Kalau minum alkohol, wajah menjadi merah. (When I drink alcohol, my face turns red.)", cloze: "と" },
    { jp: "冬になると、寒くなります。", reading: "ふゆになると、さむくなります。", meaning: "Kalau musim dingin tiba, jadi dingin. (When winter comes, it gets cold.)", cloze: "と" },
    { jp: "このアプリを使うと、便利です。", reading: "このあぷりをつかうと、べんりです。", meaning: "Kalau memakai aplikasi ini, praktis. (If you use this app, it's convenient.)", cloze: "と" },
    { jp: "9時になると、店が閉まります。", reading: "くじになると、みせがしまります。", meaning: "Kalau sudah jam 9, toko tutup. (When it hits 9 o'clock, the shop closes.)", cloze: "と" },
    { jp: "右に曲がると、コンビニが見えます。", reading: "みぎにまがると、こんびにがみえます。", meaning: "Kalau belok kanan, minimarket terlihat. (If you turn right, you'll see a convenience store.)", cloze: "と" },
    { jp: "夜になると、星が見えます。", reading: "よるになると、ほしがみえます。", meaning: "Kalau malam tiba, bintang terlihat. (When night falls, stars become visible.)", cloze: "と" },
    { jp: "塩を入れないと、おいしくなりません。", reading: "しおをいれないと、おいしくなりません。", meaning: "Kalau tidak dimasukkan garam, tidak akan enak. (If you don't add salt, it won't taste good.)", cloze: "と" }
  ],
  mcq: [
    { sentence: "春になる＿＿、桜が咲きます。", options: ["と", "なら", "ので", "けど"], answer: 0, explain: "Hubungan otomatis/berulang (musim semi → sakura mekar) → と。なら salah karena bukan merespons topik yang baru disebut。" }
  ],
  jlptBuild: [{ chunks: ["この", "ボタンを", "押すと", "電気がつきます"], starIndex: 2, suffix: "。", translation: "Kalau tombol ini ditekan, lampu menyala。" }]
},

{
  id: "n4-nara", level: "N4", group: "Kalimat Pengandaian",
  pattern: "〜なら", reading: "nara",
  meaning: "kalau begitu ~ / kalau soal ~ (if that's the case ~ / speaking of ~)",
  whenToUse: "Merespons topik/informasi yang baru saja disebut lawan bicara ('kalau begitu...'), bukan urutan waktu. Sering dipakai untuk memberi saran berdasarkan situasi yang baru diketahui. (Responds to something just mentioned — 'if that's the case' — often used to give advice.)",
  formation: [
    { pos: "N + なら", rule: "langsung", ex: "田中さんなら" },
    { pos: "Bentuk biasa (non-past) + なら", rule: "V/adj biasa + なら", ex: "行くなら" }
  ],
  register: "Pitfall: なら bisa langsung menempel ke kata benda tanpa だ (東京旅行なら、京都もいいですよ). Beda dengan たら/ば yang butuh bentuk lampau/る kata kerja. (なら attaches directly to a noun, unlike たら/ば.)",
  contrast: "vs たら: たら menyatakan 'setelah X terjadi', なら menyatakan 'kalau memang begitu keadaannya/topiknya'. Urutan waktu penting membedakan keduanya.",
  examples: [
    { jp: "京都へ行くなら、この本が役に立ちます。", reading: "きょうとへいくなら、このほんがやくにたちます。", meaning: "Kalau mau pergi ke Kyoto, buku ini akan berguna. (If you're going to Kyoto, this book will help.)", cloze: "なら" },
    { jp: "田中さんなら、もう帰りましたよ。", reading: "たなかさんなら、もうかえりましたよ。", meaning: "Kalau soal Pak Tanaka, dia sudah pulang lho. (As for Mr. Tanaka, he's already gone home.)", cloze: "なら" },
    { jp: "頭が痛いなら、薬を飲んだほうがいいです。", reading: "あたまがいたいなら、くすりをのんだほうがいいです。", meaning: "Kalau memang sakit kepala, sebaiknya minum obat. (If you have a headache, you should take medicine.)", cloze: "なら" },
    { jp: "そんなに高いなら、買いません。", reading: "そんなにたかいなら、かいません。", meaning: "Kalau memang semahal itu, saya tidak akan beli. (If it's that expensive, I won't buy it.)", cloze: "なら" },
    { jp: "時間があるなら、手伝ってください。", reading: "じかんがあるなら、てつだってください。", meaning: "Kalau ada waktu, tolong bantu saya. (If you have time, please help me.)", cloze: "なら" },
    { jp: "日本料理なら、この店が一番です。", reading: "にほんりょうりなら、このみせがいちばんです。", meaning: "Kalau soal masakan Jepang, toko ini yang terbaik. (When it comes to Japanese food, this shop is the best.)", cloze: "なら" },
    { jp: "行きたくないなら、行かなくてもいいです。", reading: "いきたくないなら、いかなくてもいいです。", meaning: "Kalau tidak ingin pergi, tidak perlu pergi. (If you don't want to go, you don't have to.)", cloze: "なら" },
    { jp: "運転するなら、お酒を飲まないでください。", reading: "うんてんするなら、おさけをのまないでください。", meaning: "Kalau mau menyetir, jangan minum alkohol. (If you're going to drive, please don't drink alcohol.)", cloze: "なら" },
    { jp: "眠いなら、少し寝たほうがいいですよ。", reading: "ねむいなら、すこしねたほうがいいですよ。", meaning: "Kalau memang mengantuk, sebaiknya tidur sebentar lho. (If you're sleepy, you should sleep a little.)", cloze: "なら" },
    { jp: "安いホテルなら、駅の近くにあります。", reading: "やすいほてるなら、えきのちかくにあります。", meaning: "Kalau soal hotel murah, ada di dekat stasiun. (If it's a cheap hotel you want, there's one near the station.)", cloze: "なら" }
  ],
  mcq: [
    { sentence: "田中さん＿＿、もう帰りましたよ。", options: ["なら", "たら", "と", "ば"], answer: 0, explain: "Merespons topik yang baru disebut (田中さん) → なら, bukan urutan waktu." }
  ],
  jlptBuild: [{ chunks: ["京都へ", "行くなら", "この本が", "役に立ちます"], starIndex: 1, suffix: "。", translation: "Kalau mau pergi ke Kyoto, buku ini akan berguna。" }]
},

// ---- Potential ----
{
  id: "n4-kanou", level: "N4", group: "Potensial",
  pattern: "bentuk potensial (〜られる／〜える)", reading: "kanoukei",
  meaning: "bisa/mampu melakukan ~ (can do ~)",
  whenToUse: "Menyatakan kemampuan atau kemungkinan melakukan sesuatu. Objek yang bisa dilakukan sering ditandai が, bukan を. (States ability/possibility; the object often takes が instead of を.)",
  formation: [
    { pos: "Godan (u→e+る)", rule: "書く→書ける", ex: "書ける" },
    { pos: "Ichidan (る→られる)", rule: "食べる→食べられる", ex: "食べられる" },
    { pos: "Tidak beraturan", rule: "する→できる／来る→来られる", ex: "できる／来られる" }
  ],
  register: "Pitfall: bentuk potensial ichidan (〜られる) sering disingkat lisan jadi ら-nuki (食べれる), tapi bentuk baku tetap 食べられる. Objek pakai が: 日本語が話せます (bukan を). (Casual speech drops ら: 食べれる; formal keeps 食べられる; object takes が.)",
  contrast: "vs ことができる: makna sama, tapi ことができる lebih formal/tertulis dan bisa dipakai untuk semua kata kerja tanpa mengubah bentuknya.",
  examples: [
    { jp: "私は漢字が書けます。", reading: "わたしはかんじがかけます。", meaning: "Saya bisa menulis kanji. (I can write kanji.)", cloze: "書けます" },
    { jp: "日本語が話せますか。", reading: "にほんごがはなせますか。", meaning: "Bisakah kamu berbicara bahasa Jepang? (Can you speak Japanese?)", cloze: "話せます" },
    { jp: "辛い食べ物が食べられません。", reading: "からいたべものがたべられません。", meaning: "Saya tidak bisa makan makanan pedas. (I can't eat spicy food.)", cloze: "食べられません" },
    { jp: "この本は一日で読めます。", reading: "このほんはいちにちでよめます。", meaning: "Buku ini bisa dibaca dalam sehari. (This book can be read in a day.)", cloze: "読めます" },
    { jp: "彼はピアノが弾けます。", reading: "かれはぴあのがひけます。", meaning: "Dia bisa bermain piano. (He can play the piano.)", cloze: "弾けます" },
    { jp: "早く起きられませんでした。", reading: "はやくおきられませんでした。", meaning: "Saya tidak bisa bangun pagi (waktu itu). (I couldn't wake up early.)", cloze: "起きられませんでした" },
    { jp: "泳げますか。—少し泳げます。", reading: "およげますか。すこしおよげます。", meaning: "Bisa berenang? — Bisa sedikit. (Can you swim? — I can a little.)", cloze: "泳げます" },
    { jp: "土曜日なら来られます。", reading: "どようびならこられます。", meaning: "Kalau hari Sabtu, saya bisa datang. (If it's Saturday, I can come.)", cloze: "来られます" },
    { jp: "この漢字は難しくて読めません。", reading: "このかんじはむずかしくてよめません。", meaning: "Kanji ini sulit sehingga tidak bisa dibaca. (This kanji is too difficult to read.)", cloze: "読めません" },
    { jp: "彼は自転車に乗れません。", reading: "かれはじてんしゃにのれません。", meaning: "Dia tidak bisa naik sepeda. (He can't ride a bicycle.)", cloze: "乗れません" }
  ],
  mcq: [
    { sentence: "私は漢字が＿＿。", options: ["書けます", "書きます", "書いてあります", "書かせます"], answer: 0, explain: "Bentuk potensial (bisa menulis) = 書けます, objek yang bisa dilakukan ditandai が。" }
  ],
  jlptBuild: [{ chunks: ["私は", "日本語が", "少し", "話せます"], starIndex: 2, suffix: "。", translation: "Saya bisa berbicara bahasa Jepang sedikit。" }]
},

{
  id: "n4-dekiru", level: "N4", group: "Potensial",
  pattern: "〜ことができる", reading: "koto ga dekiru",
  meaning: "bisa/mampu melakukan ~ (be able to do ~)",
  whenToUse: "Versi lain dari bentuk potensial, dibentuk dari kata kerja bentuk kamus + ことができる. Lebih formal/netral, sering dipakai di tulisan/pengumuman resmi. (An alternative potential form, more formal/neutral, common in writing/announcements.)",
  formation: [
    { pos: "V bentuk kamus + ことができる", rule: "semua kata kerja", ex: "泳ぐ → 泳ぐことができる" }
  ],
  register: "Pitfall: setelah ことができる, partikel objek tetap bisa を (このプールで泳ぐことができます). Untuk versi lisan sehari-hari, bentuk potensial langsung (泳げる) lebih natural. (Object particle stays natural; potential form is more colloquial than ことができる.)",
  contrast: "vs bentuk potensial langsung: makna identik, tapi ことができる terasa lebih formal/tertulis dan cocok untuk semua kata kerja tanpa perlu mengingat konjugasi potensial.",
  examples: [
    { jp: "彼は3か国語を話すことができます。", reading: "かれはさんかこくごをはなすことができます。", meaning: "Dia bisa berbicara 3 bahasa. (He can speak 3 languages.)", cloze: "ことができます" },
    { jp: "ここで写真を撮ることができません。", reading: "ここでしゃしんをとることができません。", meaning: "Di sini tidak boleh/tidak bisa memotret. (You cannot take photos here.)", cloze: "ことができません" },
    { jp: "図書館でパソコンを使うことができます。", reading: "としょかんでぱそこんをつかうことができます。", meaning: "Di perpustakaan bisa memakai komputer. (You can use a computer at the library.)", cloze: "ことができます" },
    { jp: "このチケットで美術館に入ることができます。", reading: "このちけっとでびじゅつかんにはいることができます。", meaning: "Dengan tiket ini bisa masuk museum. (With this ticket, you can enter the museum.)", cloze: "ことができます" },
    { jp: "子どものとき、速く走ることができました。", reading: "こどものとき、はやくはしることができました。", meaning: "Waktu kecil, saya bisa lari cepat. (As a child, I could run fast.)", cloze: "ことができました" },
    { jp: "インターネットで予約することができます。", reading: "いんたーねっとでよやくすることができます。", meaning: "Bisa memesan lewat internet. (You can make a reservation online.)", cloze: "ことができます" },
    { jp: "彼女は漢字を千個覚えることができました。", reading: "かのじょはかんじをせんこおぼえることができました。", meaning: "Dia berhasil menghafal 1000 kanji. (She was able to memorize 1000 kanji.)", cloze: "ことができました" },
    { jp: "会員はこの部屋を無料で使うことができます。", reading: "かいいんはこのへやをむりょうでつかうことができます。", meaning: "Anggota bisa memakai ruangan ini gratis. (Members can use this room for free.)", cloze: "ことができます" },
    { jp: "駅の前で自転車を借りることができます。", reading: "えきのまえでじてんしゃをかりることができます。", meaning: "Di depan stasiun bisa menyewa sepeda. (You can rent a bicycle in front of the station.)", cloze: "ことができます" },
    { jp: "この公園ではバーベキューをすることができません。", reading: "このこうえんではばーべきゅーをすることができません。", meaning: "Di taman ini tidak boleh/tidak bisa barbeku. (You can't have a barbecue in this park.)", cloze: "ことができません" }
  ],
  mcq: [
    { sentence: "図書館でパソコンを使う＿＿できます。", options: ["ことが", "ことを", "のが", "ように"], answer: 0, explain: "Pola ことができる memakai partikel が: 使うことができます。" }
  ],
  jlptBuild: [{ chunks: ["ここで", "写真を", "撮ることが", "できません"], starIndex: 2, suffix: "。", translation: "Di sini tidak bisa memotret。" }]
},

{
  id: "n4-you-ni-naru", level: "N4", group: "Potensial",
  pattern: "〜ようになる", reading: "you ni naru",
  meaning: "jadi bisa/berubah menjadi ~ (come to be able to ~ / reach the point of ~)",
  whenToUse: "Menyatakan perubahan bertahap dari 'tidak bisa' menjadi 'bisa', atau perubahan kebiasaan/situasi seiring waktu — menekankan proses/perkembangan. (Expresses a gradual change from 'can't' to 'can', or a change in habit/situation over time.)",
  formation: [
    { pos: "Bentuk potensial + ようになる", rule: "V-potensial + ようになる", ex: "話せる → 話せるようになる" },
    { pos: "V biasa non-past + ようになる", rule: "perubahan kebiasaan", ex: "野菜を食べるようになりました" }
  ],
  register: "Pitfall: jangan disamakan dengan 〜ようにする (usaha yang disengaja) — ようになる menekankan PERUBAHAN yang terjadi/hasil, bukan usaha aktifnya. (Don't confuse with 〜ようにする, which is about deliberate effort, not the resulting change.)",
  contrast: "vs 〜ようにする: 〜ようにする = 'saya berusaha agar ~' (usaha sadar); 〜ようになる = 'jadi ~' (hasil perubahan, sering alami/bertahap).",
  examples: [
    { jp: "だんだん日本語が話せるようになりました。", reading: "だんだんにほんごがはなせるようになりました。", meaning: "Perlahan-lahan saya jadi bisa berbicara bahasa Jepang. (I gradually became able to speak Japanese.)", cloze: "ようになりました" },
    { jp: "練習して、泳げるようになりました。", reading: "れんしゅうして、およげるようになりました。", meaning: "Setelah berlatih, saya jadi bisa berenang. (After practicing, I became able to swim.)", cloze: "ようになりました" },
    { jp: "毎日運動して、健康になるようになりました。", reading: "まいにちうんどうして、けんこうになるようになりました。", meaning: "Karena olahraga tiap hari, jadi lebih sehat. (Exercising daily, I became healthier.)" },
    { jp: "子どもは一人で歩けるようになりました。", reading: "こどもはひとりであるけるようになりました。", meaning: "Anak itu jadi bisa berjalan sendiri. (The child became able to walk alone.)", cloze: "ようになりました" },
    { jp: "最近、野菜を食べるようになりました。", reading: "さいきん、やさいをたべるようになりました。", meaning: "Belakangan ini saya jadi (terbiasa) makan sayur. (Recently, I've come to eat vegetables.)", cloze: "ようになりました" },
    { jp: "薬のおかげで、よく眠れるようになりました。", reading: "くすりのおかげで、よくねむれるようになりました。", meaning: "Berkat obat, saya jadi bisa tidur nyenyak. (Thanks to the medicine, I've become able to sleep well.)", cloze: "ようになりました" },
    { jp: "この会社は日本語ができなくても働けるようになりました。", reading: "このかいしゃはにほんごができなくてもはたらけるようになりました。", meaning: "Perusahaan ini jadi memungkinkan bekerja walau tidak bisa bahasa Jepang. (This company came to allow working even without Japanese.)", cloze: "ようになりました" },
    { jp: "パソコンが使えるようになりたいです。", reading: "ぱそこんがつかえるようになりたいです。", meaning: "Saya ingin jadi bisa memakai komputer. (I want to become able to use a computer.)", cloze: "ようになりたい" },
    { jp: "毎日練習して、漢字が読めるようになりました。", reading: "まいにちれんしゅうして、かんじがよめるようになりました。", meaning: "Setelah berlatih tiap hari, saya jadi bisa membaca kanji. (After practicing every day, I became able to read kanji.)", cloze: "ようになりました" },
    { jp: "彼は最近、朝早く起きるようになりました。", reading: "かれはさいきん、あさはやくおきるようになりました。", meaning: "Belakangan ini dia jadi (terbiasa) bangun pagi. (Recently, he has come to wake up early.)", cloze: "ようになりました" }
  ],
  mcq: [
    { sentence: "練習して、泳げる＿＿なりました。", options: ["ように", "ために", "こと", "そう"], answer: 0, explain: "Perubahan bertahap dari tidak bisa menjadi bisa = 〜ようになる, bukan ために。" }
  ],
  jlptBuild: [{ chunks: ["練習して", "日本語が", "話せるように", "なりました"], starIndex: 2, suffix: "。", translation: "Setelah berlatih, saya jadi bisa berbicara bahasa Jepang。" }]
},

// ---- Passive / causative ----
{
  id: "n4-rareru-passive", level: "N4", group: "Pasif & Kausatif",
  pattern: "〜られる (pasif)", reading: "rareru (ukemi)",
  meaning: "di~ (oleh) (to be [verb]ed by)",
  whenToUse: "Menyatakan sesuatu dilakukan PADA subjek oleh pihak lain (yang menyebabkan pasif) — sering dipakai saat subjek terpengaruh/dirugikan (meiwaku no ukemi), atau untuk fakta umum tanpa menyebut pelaku. (Something is done TO the subject by another party; often expresses being negatively affected, or a general fact without naming the doer.)",
  formation: [
    { pos: "Godan (u→a+れる)", rule: "叱る→叱られる", ex: "叱られる" },
    { pos: "Ichidan (る→られる)", rule: "見る→見られる", ex: "見られる" },
    { pos: "Tidak beraturan", rule: "する→される／来る→来られる", ex: "される／来られる" }
  ],
  register: "Pelaku ditandai に (先生に叱られました). Pitfall: pasif 'meiwaku' (雨に降られた = kehujanan, terkena dampak buruk) sering membingungkan karena subjeknya bukan yang 'diguyur' secara harfiah. (The doer takes に; 'suffering passive' like 雨に降られた can feel counterintuitive.)",
  contrast: "vs させる(causative): させる = MENYURUH/MENGIZINKAN orang lain melakukan sesuatu; られる(pasif) = subjek DIKENAI aksi oleh orang lain — arah aksinya berlawanan.",
  examples: [
    { jp: "先生に叱られました。", reading: "せんせいにしかられました。", meaning: "Saya dimarahi guru. (I was scolded by the teacher.)", cloze: "叱られました" },
    { jp: "この本は多くの人に読まれています。", reading: "このほんはおおくのひとによまれています。", meaning: "Buku ini dibaca banyak orang. (This book is read by many people.)", cloze: "読まれています" },
    { jp: "赤ちゃんが生まれました。", reading: "あかちゃんがうまれました。", meaning: "Bayi telah lahir. (A baby was born.)", cloze: "生まれました" },
    { jp: "電車の中で足を踏まれました。", reading: "でんしゃのなかであしをふまれました。", meaning: "Kaki saya terinjak di dalam kereta. (My foot was stepped on in the train.)", cloze: "踏まれました" },
    { jp: "この寺は800年前に建てられました。", reading: "このてらははっぴゃくねんまえにたてられました。", meaning: "Kuil ini dibangun 800 tahun lalu. (This temple was built 800 years ago.)", cloze: "建てられました" },
    { jp: "友だちにパーティーに誘われました。", reading: "ともだちにぱーてぃーにさそわれました。", meaning: "Saya diajak teman ke pesta. (I was invited to a party by a friend.)", cloze: "誘われました" },
    { jp: "雨に降られて、濡れてしまいました。", reading: "あめにふられて、ぬれてしまいました。", meaning: "Kehujanan, jadi basah. (I got rained on and ended up soaked.)", cloze: "降られて" },
    { jp: "このケーキは母によって作られました。", reading: "このけーきははははによってつくられました。", meaning: "Kue ini dibuat oleh ibu saya. (This cake was made by my mother.)", cloze: "作られました" },
    { jp: "宿題を忘れて、先生に注意されました。", reading: "しゅくだいをわすれて、せんせいにちゅういされました。", meaning: "Lupa mengerjakan PR, ditegur guru. (I forgot my homework and was warned by the teacher.)", cloze: "注意されました" },
    { jp: "この歌は若い人によく知られています。", reading: "このうたはわかいひとによくしられています。", meaning: "Lagu ini dikenal baik oleh anak muda. (This song is well known among young people.)", cloze: "知られています" }
  ],
  mcq: [
    { sentence: "先生に＿＿。", options: ["叱られました", "叱りました", "叱らせました", "叱ってあげました"], answer: 0, explain: "Subjek dikenai aksi oleh guru (pelaku ditandai に) → bentuk pasif 叱られました。" }
  ],
  jlptBuild: [{ chunks: ["この本は", "多くの", "人に", "読まれています"], starIndex: 2, suffix: "。", translation: "Buku ini dibaca oleh banyak orang。" }]
},

{
  id: "n4-saseru", level: "N4", group: "Pasif & Kausatif",
  pattern: "〜させる (kausatif)", reading: "saseru (shieki)",
  meaning: "menyuruh/membiarkan ~ melakukan (make/let someone do ~)",
  whenToUse: "Menyatakan seseorang (atasan/orang tua/pihak berwenang) menyuruh atau mengizinkan orang lain melakukan sesuatu. Konteks menentukan 'menyuruh' (paksaan) atau 'mengizinkan' (membiarkan). (Someone makes or lets another person do something; context decides 'force' vs 'allow'.)",
  formation: [
    { pos: "Godan (u→a+せる)", rule: "書く→書かせる", ex: "書かせる" },
    { pos: "Ichidan (る→させる)", rule: "食べる→食べさせる", ex: "食べさせる" },
    { pos: "Tidak beraturan", rule: "する→させる／来る→来させる", ex: "させる／来させる" }
  ],
  register: "Objek yang disuruh ditandai に (biasanya) atau を (jika kata kerjanya intransitif). Pitfall: jangan tertukar dengan bentuk pasif られる — させる adalah PELAKU-menyuruh, arahnya kebalikan. (The person made to act usually takes に; careful not to confuse direction with passive られる.)",
  contrast: "vs させられる(causative-passive): させられる berarti 'DIPAKSA melakukan' (dari sudut pandang orang yang disuruh, terasa terpaksa) — kebalikan sudut pandang dari させる.",
  examples: [
    { jp: "先生は学生に本を読ませました。", reading: "せんせいはがくせいにほんをよませました。", meaning: "Guru menyuruh murid membaca buku. (The teacher made the students read a book.)", cloze: "読ませました" },
    { jp: "母は子どもに野菜を食べさせました。", reading: "はははこどもにやさいをたべさせました。", meaning: "Ibu menyuruh anaknya makan sayur. (Mom made her child eat vegetables.)", cloze: "食べさせました" },
    { jp: "親は子どもを自由に遊ばせています。", reading: "おやはこどもをじゆうにあそばせています。", meaning: "Orang tua membiarkan anaknya bermain bebas. (The parents let their child play freely.)", cloze: "遊ばせています" },
    { jp: "部長は部下に資料を作らせました。", reading: "ぶちょうはぶかにしりょうをつくらせました。", meaning: "Kepala bagian menyuruh bawahannya membuat dokumen. (The manager had his subordinate prepare the documents.)", cloze: "作らせました" },
    { jp: "先生は学生を早く帰らせました。", reading: "せんせいはがくせいをはやくかえらせました。", meaning: "Guru menyuruh/mengizinkan murid pulang cepat. (The teacher let/made the students go home early.)", cloze: "帰らせました" },
    { jp: "医者は患者を休ませました。", reading: "いしゃはかんじゃをやすませました。", meaning: "Dokter menyuruh pasien beristirahat. (The doctor had the patient rest.)", cloze: "休ませました" },
    { jp: "会社は社員に研修を受けさせます。", reading: "かいしゃはしゃいんにけんしゅうをうけさせます。", meaning: "Perusahaan mewajibkan karyawan mengikuti pelatihan. (The company has employees take training.)", cloze: "受けさせます" },
    { jp: "母は妹にピアノを習わせています。", reading: "はははいもうとにぴあのをならわせています。", meaning: "Ibu menyuruh adik perempuan belajar piano. (Mom has her younger sister learn piano.)", cloze: "習わせています" },
    { jp: "先生は学生に漢字を書かせました。", reading: "せんせいはがくせいにかんじをかかせました。", meaning: "Guru menyuruh murid menulis kanji. (The teacher had the students write kanji.)", cloze: "書かせました" },
    { jp: "親は子どもに毎日勉強させています。", reading: "おやはこどもにまいにちべんきょうさせています。", meaning: "Orang tua menyuruh anaknya belajar setiap hari. (The parents have their child study every day.)", cloze: "させています" }
  ],
  mcq: [
    { sentence: "母は子どもに野菜を＿＿。", options: ["食べさせました", "食べられました", "食べてあげました", "食べてもらいました"], answer: 0, explain: "Ibu MENYURUH anak makan sayur → kausatif させる, bukan pasif られる。" }
  ],
  jlptBuild: [{ chunks: ["先生は", "学生に", "本を", "読ませました"], starIndex: 2, suffix: "。", translation: "Guru menyuruh murid membaca buku。" }]
},

// ---- Giving & receiving ----
{
  id: "n4-te-ageru-kureru-morau", level: "N4", group: "Memberi & Menerima",
  pattern: "〜てあげる／〜てくれる／〜てもらう", reading: "te ageru / te kureru / te morau",
  meaning: "melakukan sesuatu untuk orang lain (do a favor for someone)",
  whenToUse: "〜てあげる: saya/dia melakukan sesuatu UNTUK orang lain (arah menjauh dari pembicara). 〜てくれる: orang lain melakukan sesuatu UNTUK saya (arah mendekat ke pembicara). 〜てもらう: saya MENERIMA bantuan dari orang lain (fokus pada penerima). (てあげる = doing a favor outward; てくれる = someone does a favor for me; てもらう = I receive a favor.)",
  formation: [
    { pos: "V-て + あげる", rule: "aku→orang lain", ex: "手伝ってあげる" },
    { pos: "V-て + くれる", rule: "orang lain→aku", ex: "手伝ってくれる" },
    { pos: "V-て + もらう", rule: "aku menerima dari orang lain", ex: "手伝ってもらう" }
  ],
  register: "Pitfall: 〜てあげる ke atasan/orang lebih tua bisa terdengar sombong/kurang sopan (seperti 'saya berbaik hati melakukan untukmu'); lebih aman pakai bentuk netral atau 〜て差し上げる untuk sangat sopan. (てあげる to a superior can sound presumptuous; use お手伝いします or 差し上げる instead.)",
  contrast: "vs あげる/くれる/もらう (tanpa て): versi dasar untuk MEMBERI/MENERIMA BENDA (プレゼントをあげる), sedangkan versi 〜て untuk MELAKUKAN AKSI sebagai bantuan.",
  examples: [
    { jp: "友だちに本を貸してあげました。", reading: "ともだちにほんをかしてあげました。", meaning: "Saya meminjamkan buku untuk teman. (I lent a book to my friend [as a favor].)", cloze: "貸してあげました" },
    { jp: "妹に日本語を教えてあげました。", reading: "いもうとににほんごをおしえてあげました。", meaning: "Saya mengajari bahasa Jepang untuk adik. (I taught my sister Japanese.)", cloze: "教えてあげました" },
    { jp: "友だちが宿題を手伝ってくれました。", reading: "ともだちがしゅくだいをてつだってくれました。", meaning: "Teman membantu saya mengerjakan PR. (My friend helped me with my homework.)", cloze: "手伝ってくれました" },
    { jp: "母が晩ごはんを作ってくれました。", reading: "ははがばんごはんをつくってくれました。", meaning: "Ibu memasakkan makan malam untuk saya. (My mom cooked dinner for me.)", cloze: "作ってくれました" },
    { jp: "先生に漢字を教えてもらいました。", reading: "せんせいにかんじをおしえてもらいました。", meaning: "Saya diajari kanji oleh guru. (I had the teacher teach me kanji.)", cloze: "教えてもらいました" },
    { jp: "友だちに空港まで送ってもらいました。", reading: "ともだちにくうこうまでおくってもらいました。", meaning: "Saya diantar teman sampai bandara. (I had my friend take me to the airport.)", cloze: "送ってもらいました" },
    { jp: "駅までの道を教えてもらえますか。", reading: "えきまでのみちをおしえてもらえますか。", meaning: "Bisakah Anda memberitahu saya jalan ke stasiun? (Could you tell me the way to the station?)", cloze: "教えてもらえますか" },
    { jp: "弟に自転車を直してあげました。", reading: "おとうとにじてんしゃをなおしてあげました。", meaning: "Saya membetulkan sepeda untuk adik. (I fixed my brother's bicycle for him.)", cloze: "直してあげました" },
    { jp: "隣の人が荷物を持ってくれました。", reading: "となりのひとがにもつをもってくれました。", meaning: "Orang di sebelah membawakan barang untuk saya. (The person next to me carried my luggage.)", cloze: "持ってくれました" },
    { jp: "子どもにおもちゃを買ってあげました。", reading: "こどもにおもちゃをかってあげました。", meaning: "Saya membelikan mainan untuk anak. (I bought a toy for the child.)", cloze: "買ってあげました" }
  ],
  mcq: [
    { sentence: "友だちが宿題を＿＿。", options: ["手伝ってくれました", "手伝ってあげました", "手伝ってもらいました", "手伝わせました"], answer: 0, explain: "Teman melakukan bantuan UNTUK saya (arah mendekat ke pembicara) → てくれる。" }
  ],
  jlptBuild: [{ chunks: ["友だちに", "空港まで", "送って", "もらいました"], starIndex: 2, suffix: "。", translation: "Saya diantar teman sampai bandara。" }]
},

// ---- Aspect helper て-forms ----
{
  id: "n4-te-shimau", level: "N4", group: "Aspek (Bentuk て tambahan)",
  pattern: "〜てしまう", reading: "te shimau",
  meaning: "terlanjur/sudah ~ (habis-habisan) (end up doing ~ / finish completely)",
  whenToUse: "Menyatakan aksi selesai TUNTAS, atau sesuatu terjadi secara tidak sengaja/disesalkan. Nuansa: 'terlanjur', 'apa boleh buat', atau 'sudah selesai sepenuhnya'. (Completes an action entirely, or expresses regret over something unintentional.)",
  formation: [
    { pos: "V-て + しまう", rule: "selesai tuntas / tidak sengaja", ex: "食べてしまう" },
    { pos: "Bentuk lisan santai", rule: "〜てしまう→ちゃう", ex: "食べちゃう" }
  ],
  register: "Bentuk lisan santai memendekkan てしまう jadi ちゃう (食べちゃった), dan でしまう jadi じゃう (飲んじゃった). Pitfall: jangan pakai てしまう untuk hal yang menyenangkan sebagai penyesalan — biasanya untuk hal yang disesali atau selesai tuntas. (Casual contractions ちゃう/じゃう; typically implies regret or full completion.)",
  contrast: "vs 〜ておく: 〜ておく = persiapan SENGAJA untuk nanti; 〜てしまう = SUDAH SELESAI (sering tanpa sengaja/disesalkan). Arah nuansa waktu berlawanan (persiapan vs penyelesaian/penyesalan).",
  examples: [
    { jp: "宿題を全部忘れてしまいました。", reading: "しゅくだいをぜんぶわすれてしまいました。", meaning: "Saya terlanjur lupa semua PR. (I ended up forgetting all my homework.)", cloze: "忘れてしまいました" },
    { jp: "ケーキを全部食べてしまいました。", reading: "けーきをぜんぶたべてしまいました。", meaning: "Kuenya terlanjur habis saya makan semua. (I ended up eating all the cake.)", cloze: "食べてしまいました" },
    { jp: "財布を落としてしまいました。", reading: "さいふをおとしてしまいました。", meaning: "Dompet saya terlanjur jatuh (hilang). (I ended up dropping my wallet.)", cloze: "落としてしまいました" },
    { jp: "もうレポートを書いてしまいました。", reading: "もうれぽーとをかいてしまいました。", meaning: "Saya sudah selesai menulis laporan (tuntas). (I've already finished writing the report.)", cloze: "書いてしまいました" },
    { jp: "電車の中で寝てしまいました。", reading: "でんしゃのなかでねてしまいました。", meaning: "Saya terlanjur ketiduran di kereta. (I ended up falling asleep on the train.)", cloze: "寝てしまいました" },
    { jp: "大事な写真を消してしまいました。", reading: "だいじなしゃしんをけしてしまいました。", meaning: "Foto penting terlanjur terhapus. (I accidentally deleted an important photo.)", cloze: "消してしまいました" },
    { jp: "約束を忘れてしまって、すみません。", reading: "やくそくをわすれてしまって、すみません。", meaning: "Maaf, saya terlanjur lupa janji. (I'm sorry, I ended up forgetting our promise.)", cloze: "忘れてしまって" },
    { jp: "早くこの仕事を終わらせてしまいたいです。", reading: "はやくこのしごとをおわらせてしまいたいです。", meaning: "Saya ingin cepat-cepat menyelesaikan tuntas pekerjaan ini. (I want to finish this job completely, soon.)", cloze: "しまいたい" },
    { jp: "大切な約束を忘れてしまいました。", reading: "たいせつなやくそくをわすれてしまいました。", meaning: "Saya terlanjur lupa janji penting. (I ended up forgetting an important promise.)", cloze: "忘れてしまいました" },
    { jp: "もう全部話してしまいました。", reading: "もうぜんぶはなしてしまいました。", meaning: "Saya sudah menceritakan semuanya (tuntas). (I've already told everything.)", cloze: "話してしまいました" }
  ],
  mcq: [
    { sentence: "ケーキを全部＿＿。", options: ["食べてしまいました", "食べておきました", "食べてみました", "食べてあげました"], answer: 0, explain: "Selesai tuntas / disesalkan (kue habis semua) → てしまう。" }
  ],
  jlptBuild: [{ chunks: ["大事な", "写真を", "消して", "しまいました"], starIndex: 2, suffix: "。", translation: "Foto penting terlanjur terhapus。" }]
},

{
  id: "n4-te-oku", level: "N4", group: "Aspek (Bentuk て tambahan)",
  pattern: "〜ておく", reading: "te oku",
  meaning: "melakukan ~ (sebagai persiapan) (do ~ in advance / leave it done)",
  whenToUse: "Menyatakan aksi dilakukan SENGAJA sebagai persiapan untuk nanti, atau membiarkan sesuatu dalam keadaan tertentu dengan sengaja. (Doing something deliberately in preparation for later, or intentionally leaving something in a state.)",
  formation: [
    { pos: "V-て + おく", rule: "persiapan", ex: "予約しておく" },
    { pos: "Bentuk lisan santai", rule: "〜ておく→とく", ex: "予約しとく" }
  ],
  register: "Bentuk lisan santai: 〜ておく sering dipersingkat jadi とく (買っとく). Pitfall: berbeda dari てある yang menekankan HASIL yang masih terlihat, ておく menekankan TINDAKAN persiapannya. (Casual: とく; てある emphasizes the visible result, ておく the preparatory act.)",
  contrast: "vs 〜てしまう: ておく = persiapan sengaja untuk manfaat nanti; てしまう = penyelesaian tuntas (kadang tak sengaja/disesalkan).",
  examples: [
    { jp: "レストランを予約しておきました。", reading: "れすとらんをよやくしておきました。", meaning: "Saya sudah memesan restoran (untuk persiapan). (I made a restaurant reservation in advance.)", cloze: "予約しておきました" },
    { jp: "会議の前に資料を読んでおいてください。", reading: "かいぎのまえにしりょうをよんでおいてください。", meaning: "Tolong baca dokumennya sebelum rapat. (Please read the materials beforehand, before the meeting.)", cloze: "読んでおいて" },
    { jp: "パーティーのために料理を作っておきます。", reading: "ぱーてぃーのためにりょうりをつくっておきます。", meaning: "Saya akan menyiapkan masakan untuk pesta lebih dulu. (I'll prepare the food in advance for the party.)", cloze: "作っておきます" },
    { jp: "旅行の前にお金を換えておきました。", reading: "りょこうのまえにおかねをかえておきました。", meaning: "Sebelum liburan saya sudah menukar uang. (Before the trip, I exchanged money in advance.)", cloze: "換えておきました" },
    { jp: "窓を開けておいてください。", reading: "まどをあけておいてください。", meaning: "Tolong biarkan jendelanya terbuka. (Please leave the window open.)", cloze: "開けておいて" },
    { jp: "飲み物を冷やしておきます。", reading: "のみものをひやしておきます。", meaning: "Saya akan mendinginkan minuman terlebih dahulu. (I'll chill the drinks in advance.)", cloze: "冷やしておきます" },
    { jp: "単語を覚えておかないと、テストで困ります。", reading: "たんごをおぼえておかないと、てすとでこまります。", meaning: "Kalau tidak menghafal kosakata dulu, akan kesulitan saat tes. (If you don't memorize the words beforehand, you'll struggle in the test.)", cloze: "覚えておかない" },
    { jp: "彼にメールを送っておきました。", reading: "かれにめーるをおくっておきました。", meaning: "Saya sudah mengirim email untuk dia terlebih dahulu. (I sent him an email in advance.)", cloze: "送っておきました" },
    { jp: "旅行の前に、荷物をまとめておきます。", reading: "りょこうのまえに、にもつをまとめておきます。", meaning: "Sebelum liburan, saya akan mengemasi barang terlebih dahulu. (Before the trip, I'll pack my luggage in advance.)", cloze: "まとめておきます" },
    { jp: "友だちが来る前に、部屋を掃除しておきました。", reading: "ともだちがくるまえに、へやをそうじしておきました。", meaning: "Sebelum teman datang, saya sudah bersih-bersih kamar terlebih dahulu. (Before my friend came, I cleaned the room in advance.)", cloze: "しておきました" }
  ],
  mcq: [
    { sentence: "会議の前に資料を＿＿ください。", options: ["読んでおいて", "読んでしまって", "読んでみて", "読まれて"], answer: 0, explain: "Persiapan sengaja untuk nanti (baca dokumen sebelum rapat) → ておく。" }
  ],
  jlptBuild: [{ chunks: ["旅行の", "前に", "お金を", "換えておきました"], starIndex: 3, suffix: "。", translation: "Sebelum liburan, saya sudah menukar uang terlebih dahulu。" }]
},

{
  id: "n4-te-miru", level: "N4", group: "Aspek (Bentuk て tambahan)",
  pattern: "〜てみる", reading: "te miru",
  meaning: "coba melakukan ~ (try doing ~)",
  whenToUse: "Menyatakan mencoba melakukan sesuatu untuk melihat hasilnya — rasa ingin tahu/eksperimen, tanpa memastikan hasilnya baik/buruk. (Trying something out to see what happens — curiosity/experimentation.)",
  formation: [
    { pos: "V-て + みる", rule: "mencoba", ex: "食べてみる" }
  ],
  register: "Pitfall: てみる secara harfiah dari 見る (melihat), tapi maknanya sudah luntur jadi 'mencoba' — jangan diterjemahkan literal 'mencoba melihat'. Sering dipakai dalam bentuk ajakan: 〜てみませんか. (Literally from 見る, but the meaning has bleached to just 'try'; often used as 〜てみませんか, 'why not try'.)",
  contrast: "vs 〜てみたい: menambahkan 〜たい pada てみる untuk menyatakan 'ingin mencoba', bukan sedang mencoba.",
  examples: [
    { jp: "この料理を食べてみてください。", reading: "このりょうりをたべてみてください。", meaning: "Silakan coba makan masakan ini. (Please try eating this dish.)", cloze: "食べてみて" },
    { jp: "新しい店に行ってみました。", reading: "あたらしいみせにいってみました。", meaning: "Saya coba pergi ke toko baru. (I tried going to the new shop.)", cloze: "行ってみました" },
    { jp: "先生に聞いてみます。", reading: "せんせいにきいてみます。", meaning: "Saya akan coba tanya ke guru. (I'll try asking the teacher.)", cloze: "聞いてみます" },
    { jp: "このシャツを着てみてもいいですか。", reading: "このしゃつをきてみてもいいですか。", meaning: "Bolehkah saya coba pakai kemeja ini? (May I try on this shirt?)", cloze: "着てみても" },
    { jp: "自分で考えてみましょう。", reading: "じぶんでかんがえてみましょう。", meaning: "Ayo coba pikirkan sendiri. (Let's try thinking about it ourselves.)", cloze: "考えてみましょう" },
    { jp: "一度、富士山に登ってみたいです。", reading: "いちど、ふじさんにのぼってみたいです。", meaning: "Saya ingin sekali-kali coba mendaki Gunung Fuji. (I want to try climbing Mt. Fuji once.)", cloze: "登ってみたい" },
    { jp: "分からなかったので、辞書で調べてみました。", reading: "わからなかったので、じしょでしらべてみました。", meaning: "Karena tidak mengerti, saya coba cari di kamus. (Since I didn't understand, I tried looking it up in the dictionary.)", cloze: "調べてみました" },
    { jp: "新しいレシピを試してみませんか。", reading: "あたらしいれしぴをためしてみませんか。", meaning: "Bagaimana kalau kita coba resep baru? (Why don't we try a new recipe?)", cloze: "試してみません" },
    { jp: "初めて日本料理を作ってみました。", reading: "はじめてにほんりょうりをつくってみました。", meaning: "Saya coba masak masakan Jepang untuk pertama kali. (I tried making Japanese food for the first time.)", cloze: "作ってみました" },
    { jp: "彼に本当のことを話してみます。", reading: "かれにほんとうのことをはなしてみます。", meaning: "Saya akan coba bicara hal yang sebenarnya padanya. (I'll try telling him the truth.)", cloze: "話してみます" }
  ],
  mcq: [
    { sentence: "この料理を＿＿ください。", options: ["食べてみて", "食べておいて", "食べてしまって", "食べさせて"], answer: 0, explain: "Mencoba melakukan untuk melihat hasilnya → てみる。" }
  ],
  jlptBuild: [{ chunks: ["一度", "富士山に", "登って", "みたいです"], starIndex: 2, suffix: "。", translation: "Saya ingin sekali-kali coba mendaki Gunung Fuji。" }]
},

// ---- Intentions & plans ----
{
  id: "n4-tsumori", level: "N4", group: "Niat & Rencana",
  pattern: "〜つもり", reading: "tsumori",
  meaning: "berniat/bermaksud ~ (intend to ~)",
  whenToUse: "Menyatakan niat/rencana pribadi yang cukup mantap, biasanya untuk rencana jangka menengah/panjang (bukan keputusan spontan). Bisa juga 'tidak berniat' (〜ないつもり). (Expresses a fairly firm personal intention/plan, usually not a spur-of-the-moment decision.)",
  formation: [
    { pos: "V biasa non-past + つもりです", rule: "berniat", ex: "行くつもりです" },
    { pos: "V-ない + つもりです", rule: "tidak berniat", ex: "行かないつもりです" }
  ],
  register: "Pitfall: つもり menyatakan niat DI DALAM PIKIRAN pembicara, bukan janji resmi ke orang lain — untuk rencana yang sudah pasti/terjadwal, 〜予定です lebih tepat. (つもり is a personal intention, not a fixed schedule — for confirmed plans, 予定です fits better.)",
  contrast: "vs 〜(よ)うと思う: 〜(よ)うと思う terasa lebih baru diputuskan/spontan; つもり terasa sudah dipikirkan lebih matang sebelumnya.",
  examples: [
    { jp: "来年、日本へ留学するつもりです。", reading: "らいねん、にほんへりゅうがくするつもりです。", meaning: "Tahun depan saya berniat kuliah di Jepang. (I intend to study abroad in Japan next year.)", cloze: "つもりです" },
    { jp: "今日は残業しないつもりです。", reading: "きょうはざんぎょうしないつもりです。", meaning: "Hari ini saya tidak berniat lembur. (I don't intend to work overtime today.)", cloze: "つもりです" },
    { jp: "週末は家でゆっくりするつもりです。", reading: "しゅうまつはいえでゆっくりするつもりです。", meaning: "Akhir pekan saya berniat santai di rumah. (I plan to relax at home this weekend.)", cloze: "つもりです" },
    { jp: "彼と結婚するつもりはありません。", reading: "かれとけっこんするつもりはありません。", meaning: "Saya tidak berniat menikah dengan dia. (I have no intention of marrying him.)", cloze: "つもりはありません" },
    { jp: "夏休みに国へ帰るつもりです。", reading: "なつやすみにくにへかえるつもりです。", meaning: "Liburan musim panas saya berniat pulang kampung. (I intend to go back to my country during summer break.)", cloze: "つもりです" },
    { jp: "彼女は仕事を辞めるつもりだそうです。", reading: "かのじょはしごとをやめるつもりだそうです。", meaning: "Katanya dia berniat berhenti kerja. (I heard she intends to quit her job.)", cloze: "つもり" },
    { jp: "今度こそ、たばこをやめるつもりです。", reading: "こんどこそ、たばこをやめるつもりです。", meaning: "Kali ini saya sungguh berniat berhenti merokok. (This time, I really intend to quit smoking.)", cloze: "つもりです" },
    { jp: "そんなつもりで言ったのではありません。", reading: "そんなつもりでいったのではありません。", meaning: "Saya tidak bermaksud begitu waktu mengatakannya. (I didn't mean it that way when I said it.)", cloze: "つもり" },
    { jp: "今度の休みは旅行に行くつもりです。", reading: "こんどのやすみはりょこうにいくつもりです。", meaning: "Liburan berikutnya saya berniat pergi liburan. (I intend to go on a trip during the next holiday.)", cloze: "つもりです" },
    { jp: "彼女は大学院に進学するつもりだそうです。", reading: "かのじょはだいがくいんにしんがくするつもりだそうです。", meaning: "Katanya dia berniat melanjutkan ke pascasarjana. (I heard she intends to go on to graduate school.)", cloze: "つもり" }
  ],
  mcq: [
    { sentence: "来年、日本へ留学する＿＿です。", options: ["つもり", "はず", "よう", "そう"], answer: 0, explain: "Niat pribadi yang sudah dipikirkan cukup matang → つもり。" }
  ],
  jlptBuild: [{ chunks: ["夏休みに", "国へ", "帰る", "つもりです"], starIndex: 2, suffix: "。", translation: "Liburan musim panas saya berniat pulang kampung。" }]
},

{
  id: "n4-you-to-omou", level: "N4", group: "Niat & Rencana",
  pattern: "〜(よ)うと思う", reading: "(y)ou to omou",
  meaning: "saya berpikir untuk ~ (I'm thinking of doing ~)",
  whenToUse: "Menyatakan niat yang baru saja diputuskan/dipikirkan pembicara, terasa lebih spontan dan personal dibanding つもり. (Expresses an intention just decided by the speaker — feels more spontaneous/personal than つもり.)",
  formation: [
    { pos: "V bentuk volitional + と思う", rule: "行く→行こうと思う", ex: "行こうと思います" },
    { pos: "V bentuk volitional + と思っている", rule: "niat yang sudah berlangsung", ex: "行こうと思っています" }
  ],
  register: "Pitfall: 〜と思います (niat baru) vs 〜と思っています (niat yang sudah dipikirkan sejak lama/masih berlaku) — bedanya nuansa durasi niat tersebut. (と思います = fresh intention; と思っています = a longer-held one.)",
  contrast: "vs つもり: つもり lebih mantap/sudah dipikirkan matang; 〜(よ)うと思う lebih terasa 'baru terpikir saat ini'.",
  examples: [
    { jp: "今度、京都へ行こうと思います。", reading: "こんど、きょうとへいこうとおもいます。", meaning: "Lain kali saya berpikir untuk pergi ke Kyoto. (I'm thinking of going to Kyoto next time.)", cloze: "行こうと思います" },
    { jp: "そろそろ寝ようと思います。", reading: "そろそろねようとおもいます。", meaning: "Sepertinya saya akan tidur sebentar lagi. (I'm thinking of going to sleep soon.)", cloze: "寝ようと思います" },
    { jp: "来月から運動しようと思っています。", reading: "らいげつからうんどうしようとおもっています。", meaning: "Sejak bulan depan saya berencana mulai olahraga. (I've been thinking of starting exercise next month.)", cloze: "運動しようと思っています" },
    { jp: "この本を買おうと思います。", reading: "このほんをかおうとおもいます。", meaning: "Saya berpikir untuk membeli buku ini. (I'm thinking of buying this book.)", cloze: "買おうと思います" },
    { jp: "疲れたので、少し休もうと思います。", reading: "つかれたので、すこしやすもうとおもいます。", meaning: "Karena lelah, saya berpikir untuk istirahat sebentar. (Since I'm tired, I'm thinking of resting a bit.)", cloze: "休もうと思います" },
    { jp: "彼女に会おうと思っています。", reading: "かのじょにあおうとおもっています。", meaning: "Saya sedang berpikir untuk menemui dia. (I've been thinking of meeting her.)", cloze: "会おうと思っています" },
    { jp: "新しい仕事を探そうと思います。", reading: "あたらしいしごとをさがそうとおもいます。", meaning: "Saya berpikir untuk mencari pekerjaan baru. (I'm thinking of looking for a new job.)", cloze: "探そうと思います" },
    { jp: "今年こそ日本語を頑張ろうと思います。", reading: "ことしこそにほんごをがんばろうとおもいます。", meaning: "Tahun ini saya benar-benar berniat berjuang belajar bahasa Jepang. (This year, I'm determined to work hard at Japanese.)", cloze: "と思います" },
    { jp: "今日は早く帰ろうと思います。", reading: "きょうははやくかえろうとおもいます。", meaning: "Hari ini saya berpikir untuk pulang cepat. (I'm thinking of going home early today.)", cloze: "帰ろうと思います" },
    { jp: "週末に部屋を掃除しようと思っています。", reading: "しゅうまつにへやをそうじしようとおもっています。", meaning: "Akhir pekan saya berencana membersihkan kamar. (I've been thinking of cleaning my room this weekend.)", cloze: "しようと思っています" }
  ],
  mcq: [
    { sentence: "そろそろ寝＿＿と思います。", options: ["よう", "る", "ない", "た"], answer: 0, explain: "Niat yang baru terpikir memakai bentuk volitional + と思う: 寝よう + と思います。" }
  ],
  jlptBuild: [{ chunks: ["疲れたので", "少し", "休もうと", "思います"], starIndex: 2, suffix: "。", translation: "Karena lelah, saya berpikir untuk istirahat sebentar。" }]
},

// ---- Advice ----
{
  id: "n4-hou-ga-ii", level: "N4", group: "Saran & Kewajiban",
  pattern: "〜ほうがいい", reading: "hou ga ii",
  meaning: "sebaiknya ~ (had better ~ / it's better to ~)",
  whenToUse: "Memberi saran atau rekomendasi — bentuk lampau untuk saran positif (〜たほうがいい), bentuk ない untuk saran negatif (〜ないほうがいい). (Giving advice — past tense for positive suggestions, ない form for negative ones.)",
  formation: [
    { pos: "V-た + ほうがいい", rule: "saran melakukan", ex: "休んだほうがいいです" },
    { pos: "V-ない + ほうがいい", rule: "saran tidak melakukan", ex: "行かないほうがいいです" }
  ],
  register: "Pitfall: untuk saran positif SELALU pakai bentuk lampau (た形) meski konteksnya masa depan (休んだほうがいい, bukan 休むほうがいい) — ini aturan khusus pola ini. Bisa terdengar terlalu langsung ke atasan; lebih sopan pakai 〜たらいかがですか. (Positive advice always uses past-tense form even for future actions — a special rule of this pattern.)",
  contrast: "vs 〜たらどうですか: lebih ringan/menyarankan sebagai opsi, bukan rekomendasi kuat seperti ほうがいい.",
  examples: [
    { jp: "熱があるなら、病院へ行ったほうがいいです。", reading: "ねつがあるなら、びょういんへいったほうがいいです。", meaning: "Kalau demam, sebaiknya pergi ke rumah sakit. (If you have a fever, you'd better go to the hospital.)", cloze: "行ったほうがいい" },
    { jp: "もう遅いから、早く寝たほうがいいです。", reading: "もうおそいから、はやくねたほうがいいです。", meaning: "Karena sudah larut, sebaiknya cepat tidur. (Since it's late, you'd better sleep early.)", cloze: "寝たほうがいい" },
    { jp: "たばこは吸わないほうがいいです。", reading: "たばこはすわないほうがいいです。", meaning: "Sebaiknya tidak merokok. (You'd better not smoke.)", cloze: "吸わないほうがいい" },
    { jp: "夜遅くコーヒーを飲まないほうがいいです。", reading: "よるおそくこーひーをのまないほうがいいです。", meaning: "Sebaiknya tidak minum kopi larut malam. (You'd better not drink coffee late at night.)", cloze: "飲まないほうがいい" },
    { jp: "この道は危ないから、行かないほうがいいです。", reading: "このみちはあぶないから、いかないほうがいいです。", meaning: "Jalan ini berbahaya, sebaiknya tidak lewat sini. (This road is dangerous, so you'd better not go.)", cloze: "行かないほうがいい" },
    { jp: "薬を飲んだほうがいいですよ。", reading: "くすりをのんだほうがいいですよ。", meaning: "Sebaiknya kamu minum obat lho. (You'd better take medicine, you know.)", cloze: "飲んだほうがいい" },
    { jp: "傘を持って行ったほうがいいです。", reading: "かさをもっていったほうがいいです。", meaning: "Sebaiknya bawa payung. (You'd better bring an umbrella.)", cloze: "持って行ったほうがいい" },
    { jp: "無理しないほうがいいですよ。", reading: "むりしないほうがいいですよ。", meaning: "Sebaiknya jangan memaksakan diri lho. (You'd better not overdo it, you know.)", cloze: "しないほうがいい" },
    { jp: "電車で行ったほうがいいですよ。", reading: "でんしゃでいったほうがいいですよ。", meaning: "Sebaiknya naik kereta lho. (You'd better go by train.)", cloze: "行ったほうがいい" },
    { jp: "甘い物を食べすぎないほうがいいです。", reading: "あまいものをたべすぎないほうがいいです。", meaning: "Sebaiknya jangan makan makanan manis terlalu banyak. (You'd better not eat too many sweets.)", cloze: "食べすぎないほうがいい" }
  ],
  mcq: [
    { sentence: "熱があるなら、病院へ＿＿いいです。", options: ["行ったほうが", "行くほうが", "行ったら", "行くなら"], answer: 0, explain: "Saran positif selalu pakai bentuk lampau + ほうがいい: 行ったほうがいい。 (行くほうが salah karena lupa bentuk lampau.)" }
  ],
  jlptBuild: [{ chunks: ["熱が", "あるなら", "病院へ", "行ったほうがいいです"], starIndex: 1, suffix: "。", translation: "Kalau demam, sebaiknya pergi ke rumah sakit。" }]
},

// ---- Appearance & hearsay ----
{
  id: "n4-sou-youtai", level: "N4", group: "Penampakan & Berita",
  pattern: "〜そう(だ) [様態]", reading: "sou da (youtai)",
  meaning: "kelihatannya ~ (looks like ~ [visual impression])",
  whenToUse: "Menyatakan kesan visual langsung dari pembicara ('kelihatannya akan...') berdasarkan apa yang dilihat SAAT ITU — bukan berdasarkan info dari orang lain. (A direct visual impression the speaker forms from what they see right now.)",
  formation: [
    { pos: "V-ますstem + そう", rule: "akan terjadi (kesan visual)", ex: "降りそう" },
    { pos: "いadj (hapus い) + そう", rule: "kelihatan sifatnya", ex: "おいしそう" },
    { pos: "なadj + そう", rule: "langsung + そう", ex: "元気そう" }
  ],
  register: "Pitfall besar: いい→よさそう (tidak beraturan!), ない→なさそう. Pola ini TIDAK BISA dipakai untuk fakta yang sudah dikonfirmasi terlihat langsung (misal melihat orang benar-benar sudah jatuh, bukan 'kelihatannya jatuh'). (いい becomes よさそう; ない becomes なさそう — both irregular.)",
  contrast: "vs そう(伝聞): 様態そう = kesan visual pembicara sendiri; 伝聞そう = mengutip info dari sumber lain (〜そうです setelah bentuk biasa lengkap, bukan stem).",
  examples: [
    { jp: "雨が降りそうです。", reading: "あめがふりそうです。", meaning: "Kelihatannya akan hujan. (It looks like it's going to rain.)", cloze: "降りそう" },
    { jp: "このケーキはおいしそうです。", reading: "このけーきはおいしそうです。", meaning: "Kue ini kelihatannya enak. (This cake looks delicious.)", cloze: "おいしそう" },
    { jp: "彼は元気そうです。", reading: "かれはげんきそうです。", meaning: "Dia kelihatannya sehat. (He looks well.)", cloze: "元気そう" },
    { jp: "この荷物は重そうです。", reading: "このにもつはおもそうです。", meaning: "Barang ini kelihatannya berat. (This luggage looks heavy.)", cloze: "重そう" },
    { jp: "今にも泣きそうな顔をしています。", reading: "いまにもなきそうなかおをしています。", meaning: "Wajahnya seperti mau menangis sekarang juga. (Their face looks like they're about to cry.)", cloze: "泣きそう" },
    { jp: "この問題は難しそうです。", reading: "このもんだいはむずかしそうです。", meaning: "Soal ini kelihatannya sulit. (This problem looks difficult.)", cloze: "難しそう" },
    { jp: "その服はよさそうですね。", reading: "そのふくはよさそうですね。", meaning: "Baju itu kelihatannya bagus ya. (That outfit looks nice, doesn't it?)", cloze: "よさそう" },
    { jp: "橋が今にも壊れそうです。", reading: "はしがいまにもこわれそうです。", meaning: "Jembatannya kelihatan seperti akan roboh sebentar lagi. (The bridge looks like it's about to collapse.)", cloze: "壊れそう" },
    { jp: "彼は忙しそうです。", reading: "かれはいそがしそうです。", meaning: "Dia kelihatannya sibuk. (He looks busy.)", cloze: "忙しそう" },
    { jp: "この犬はとても賢そうです。", reading: "このいぬはとてもかしこそうです。", meaning: "Anjing ini kelihatannya sangat pintar. (This dog looks very smart.)", cloze: "賢そう" }
  ],
  mcq: [
    { sentence: "このケーキは＿＿です。", options: ["おいしそう", "おいしそうだ", "おいしいらしい", "おいしいようだ"], answer: 0, explain: "Kesan visual langsung (kelihatan enak) dari いadj (hapus い) + そう: おいしそう。 (そうだ tidak bisa dobel dengan です; らしい/ようだ menempel di bentuk kamus lengkap, bukan makna 'kesan visual sendiri' di sini.)" }
  ],
  jlptBuild: [{ chunks: ["今にも", "雨が", "降り", "そうです"], starIndex: 2, suffix: "。", translation: "Kelihatannya sebentar lagi akan hujan。" }]
},

{
  id: "n4-sou-denbun", level: "N4", group: "Penampakan & Berita",
  pattern: "〜そうだ [伝聞]", reading: "sou da (denbun)",
  meaning: "katanya ~ (I heard that ~ [hearsay])",
  whenToUse: "Menyampaikan informasi yang didengar/dibaca dari sumber lain (berita, orang lain), bukan pendapat/kesan visual sendiri. そう di sini TIDAK berubah bentuk (selalu そうだ/そうです). (Reports information heard/read from another source; そう here never conjugates — always そうだ/そうです.)",
  formation: [
    { pos: "Bentuk biasa lengkap + そうです", rule: "V/いadj/なadj+だ/N+だ + そうです", ex: "雨が降るそうです" }
  ],
  register: "Pitfall utama pembeda dari 様態そう: 伝聞そう menempel pada BENTUK BIASA LENGKAP (降る, bukan 降り), dan なadj/N butuh だ sebelum そうです (静かだそうです, 学生だそうです). そうだ sendiri tidak pernah berkonjugasi seperti adjektiva. (Attaches to the full plain form, not the stem; な-adj/N need だ first; そうだ itself never conjugates.)",
  contrast: "vs 〜と言っていました: keduanya melaporkan ucapan, tapi 〜と言っていました menyebutkan SIAPA yang bicara secara eksplisit, 伝聞そう lebih ke 'saya dengar begitu' secara umum.",
  examples: [
    { jp: "天気予報によると、明日は雨が降るそうです。", reading: "てんきよほうによると、あしたはあめがふるそうです。", meaning: "Menurut ramalan cuaca, katanya besok akan hujan. (According to the forecast, I heard it'll rain tomorrow.)", cloze: "降るそうです" },
    { jp: "彼はもう国へ帰ったそうです。", reading: "かれはもうくにへかえったそうです。", meaning: "Katanya dia sudah pulang ke negaranya. (I heard he's already returned to his country.)", cloze: "帰ったそうです" },
    { jp: "このレストランは有名だそうです。", reading: "このれすとらんはゆうめいだそうです。", meaning: "Katanya restoran ini terkenal. (I heard this restaurant is famous.)", cloze: "有名だそうです" },
    { jp: "田中さんは今、忙しいそうです。", reading: "たなかさんはいま、いそがしいそうです。", meaning: "Katanya Pak Tanaka sekarang sedang sibuk. (I heard Mr. Tanaka is busy right now.)", cloze: "忙しいそうです" },
    { jp: "ニュースによると、事故があったそうです。", reading: "にゅーすによると、じこがあったそうです。", meaning: "Menurut berita, katanya ada kecelakaan. (According to the news, there was an accident.)", cloze: "あったそうです" },
    { jp: "彼女は来週結婚するそうです。", reading: "かのじょはらいしゅうけっこんするそうです。", meaning: "Katanya dia akan menikah minggu depan. (I heard she's getting married next week.)", cloze: "結婚するそうです" },
    { jp: "そのビルは古いそうです。", reading: "そのびるはふるいそうです。", meaning: "Katanya gedung itu tua. (I heard that building is old.)", cloze: "古いそうです" },
    { jp: "彼は日本語が上手だそうです。", reading: "かれはにほんごがじょうずだそうです。", meaning: "Katanya bahasa Jepangnya dia pandai. (I heard he's good at Japanese.)", cloze: "だそうです" },
    { jp: "友だちの話によると、この店は安いそうです。", reading: "ともだちのはなしによると、このみせはやすいそうです。", meaning: "Menurut cerita teman, katanya toko ini murah. (According to my friend, I heard this shop is cheap.)", cloze: "安いそうです" },
    { jp: "台風が来るそうです。", reading: "たいふうがくるそうです。", meaning: "Katanya topan akan datang. (I heard a typhoon is coming.)", cloze: "来るそうです" }
  ],
  mcq: [
    { sentence: "天気予報によると、明日は雨が降る＿＿。", options: ["そうです", "そうでした", "そうな", "そう"], answer: 0, explain: "伝聞そう menempel bentuk biasa lengkap (降る) + そうです, tanpa berkonjugasi lagi." }
  ],
  jlptBuild: [{ chunks: ["天気予報に", "よると", "明日は", "雨が降るそうです"], starIndex: 2, suffix: "。", translation: "Menurut ramalan cuaca, katanya besok akan hujan。" }]
},

{
  id: "n4-you-mitai", level: "N4", group: "Penampakan & Berita",
  pattern: "〜よう(だ)／〜みたい(だ)", reading: "you da / mitai da",
  meaning: "sepertinya ~ / mirip ~ (it seems like ~ / similar to ~)",
  whenToUse: "Menyatakan perkiraan berdasarkan bukti/indra (penglihatan, suara, dsb) atau perumpamaan. みたい lebih santai/lisan; よう lebih netral/bisa tertulis. (An inference based on evidence/the senses, or a simile. みたい is casual/spoken; よう is more neutral/written.)",
  formation: [
    { pos: "Bentuk biasa + よう(だ)", rule: "なadj/N + の + よう", ex: "先生のようだ" },
    { pos: "Bentuk biasa + みたい(だ)", rule: "N + みたい (tanpa の)", ex: "先生みたいだ" },
    { pos: "N + の/なし + ような／みたいな + N", rule: "modifikasi kata benda", ex: "夢のような話" }
  ],
  register: "Pitfall: よう butuh の sebelum kata benda (先生のようだ), sedangkan みたい langsung tanpa partikel (先生みたいだ). Keduanya bisa berarti 'sepertinya' (dugaan) maupun 'seperti/mirip' (perumpamaan). (よう needs の before a noun; みたい attaches directly.)",
  contrast: "vs らしい: らしい lebih menekankan info dari luar/sumber pihak ketiga (mirip 伝聞そう tapi kurang pasti); よう/みたい lebih ke kesimpulan pembicara sendiri dari bukti yang dilihat/dirasakan.",
  examples: [
    { jp: "外は雨が降っているようです。", reading: "そとはあめがふっているようです。", meaning: "Sepertinya di luar sedang hujan. (It seems like it's raining outside.)", cloze: "ようです" },
    { jp: "彼はもう帰ったみたいです。", reading: "かれはもうかえったみたいです。", meaning: "Sepertinya dia sudah pulang. (It seems he's already gone home.)", cloze: "みたいです" },
    { jp: "この人形はまるで人間のようです。", reading: "このにんぎょうはまるでにんげんのようです。", meaning: "Boneka ini seperti manusia sungguhan. (This doll looks just like a real human.)", cloze: "ようです" },
    { jp: "彼女は歌手みたいに歌が上手です。", reading: "かのじょはかしゅみたいにうたがじょうずです。", meaning: "Dia pandai menyanyi seperti penyanyi profesional. (She sings well, like a professional singer.)", cloze: "みたいに" },
    { jp: "今日は夏のように暑いです。", reading: "きょうはなつのようにあついです。", meaning: "Hari ini panas seperti musim panas. (Today is hot like summer.)", cloze: "ように" },
    { jp: "何か問題があるようです。", reading: "なにかもんだいがあるようです。", meaning: "Sepertinya ada masalah. (It seems there's some problem.)", cloze: "ようです" },
    { jp: "この店のラーメンは有名みたいです。", reading: "このみせのらーめんはゆうめいみたいです。", meaning: "Sepertinya ramen toko ini terkenal. (This shop's ramen seems to be famous.)", cloze: "みたいです" },
    { jp: "彼はまるで子どものように喜びました。", reading: "かれはまるでこどものようによろこびました。", meaning: "Dia senang sekali seperti anak kecil. (He was overjoyed just like a child.)", cloze: "ように" },
    { jp: "彼女は疲れているようです。", reading: "かのじょはつかれているようです。", meaning: "Sepertinya dia sedang lelah. (She seems to be tired.)", cloze: "ようです" },
    { jp: "まるで夢みたいな出来事でした。", reading: "まるでゆめみたいなできごとでした。", meaning: "Itu adalah kejadian yang seperti mimpi. (It was an event that felt just like a dream.)", cloze: "みたいな" }
  ],
  mcq: [
    { sentence: "空を見ると、雨が降っている＿＿です。", options: ["よう", "そう", "らしい", "はず"], answer: 0, explain: "Kesimpulan dari bukti yang dilihat sendiri (melihat langit) → よう。そう(伝聞) butuh sumber info dari luar, misalnya 天気予報によると。" }
  ],
  jlptBuild: [{ chunks: ["外は", "雨が", "降っている", "ようです"], starIndex: 2, suffix: "。", translation: "Sepertinya di luar sedang hujan。" }]
},

{
  id: "n4-rashii", level: "N4", group: "Penampakan & Berita",
  pattern: "〜らしい", reading: "rashii",
  meaning: "kabarnya/sepertinya ~ (I heard/it seems that ~; typically ~)",
  whenToUse: "Menyampaikan info yang didengar dari luar dengan tingkat kepastian kurang pasti dibanding そう(伝聞) — kesan 'katanya begitu, tapi saya tidak yakin 100%'. Juga bisa berarti 'sangat khas/typical' (男らしい = sangat maskulin). (Reports secondhand info with less certainty than そう; can also mean 'typically/very [noun]-like'.)",
  formation: [
    { pos: "Bentuk biasa + らしい", rule: "info tidak pasti", ex: "難しいらしいです" },
    { pos: "N + らしい", rule: "khas/typical", ex: "男らしい" }
  ],
  register: "Pitfall: なadj/N + らしい TIDAK butuh だ di depannya (静からしい, bukan 静かならしい). Beda dari そう(伝聞) yang butuh だ. (Unlike そう(伝聞), な-adj/N attach directly to らしい without だ.)",
  contrast: "vs そう(伝聞): そう terasa lebih yakin/langsung dari sumber jelas (misal berita resmi); らしい terasa 'kabar angin/kurang pasti', dan juga bisa berarti 'sangat khas'.",
  examples: [
    { jp: "明日のテストは難しいらしいです。", reading: "あしたのてすとはむずかしいらしいです。", meaning: "Kabarnya tes besok sulit. (I heard tomorrow's test is difficult.)", cloze: "らしいです" },
    { jp: "彼はもう結婚しているらしいです。", reading: "かれはもうけっこんしているらしいです。", meaning: "Kabarnya dia sudah menikah. (I heard he's already married.)", cloze: "らしいです" },
    { jp: "あの店はいつも混んでいるらしいです。", reading: "あのみせはいつもこんでいるらしいです。", meaning: "Kabarnya toko itu selalu ramai. (I heard that shop is always crowded.)", cloze: "らしいです" },
    { jp: "彼は本当に男らしい人です。", reading: "かれはほんとうにおとこらしいひとです。", meaning: "Dia benar-benar orang yang maskulin/gagah. (He's truly a manly person.)", cloze: "男らしい" },
    { jp: "今年の夏は涼しいらしいです。", reading: "ことしのなつはすずしいらしいです。", meaning: "Kabarnya musim panas tahun ini sejuk. (I heard this summer will be cool.)", cloze: "らしいです" },
    { jp: "田中さんは来月引っ越すらしいです。", reading: "たなかさんはらいげつひっこすらしいです。", meaning: "Kabarnya Pak Tanaka akan pindah bulan depan. (I heard Mr. Tanaka is moving next month.)", cloze: "らしいです" },
    { jp: "このあたりは昔、静からしいです。", reading: "このあたりはむかし、しずからしいです。", meaning: "Kabarnya daerah ini dulu tenang. (I heard this area used to be quiet.)", cloze: "らしいです" },
    { jp: "春らしい天気になりました。", reading: "はるらしいてんきになりました。", meaning: "Cuacanya jadi khas musim semi. (The weather has become spring-like.)", cloze: "らしい" },
    { jp: "隣の部屋には誰もいないらしいです。", reading: "となりのへやにはだれもいないらしいです。", meaning: "Kabarnya kamar sebelah tidak ada orang. (I heard there's no one in the next room.)", cloze: "らしいです" },
    { jp: "彼はこの分野に詳しいらしいです。", reading: "かれはこのぶんやにくわしいらしいです。", meaning: "Kabarnya dia ahli di bidang ini. (I heard he's knowledgeable in this field.)", cloze: "らしいです" }
  ],
  mcq: [
    { sentence: "うわさによると、彼はもう結婚している＿＿です。", options: ["らしい", "でしょう", "つもり", "はず"], answer: 0, explain: "うわさ (kabar angin) cocok dengan らしい yang menyampaikan info kurang pasti dari luar。" }
  ],
  jlptBuild: [{ chunks: ["彼は", "もう", "結婚している", "らしいです"], starIndex: 2, suffix: "。", translation: "Kabarnya dia sudah menikah。" }]
},

// ---- Time relations ----
{
  id: "n4-toki", level: "N4", group: "Hubungan Waktu",
  pattern: "〜とき", reading: "toki",
  meaning: "waktu/saat ~ (when ~ / at the time of ~)",
  whenToUse: "Menghubungkan dua kejadian berdasarkan waktu terjadinya. Bentuk kata kerja sebelum とき menentukan urutan: bentuk kamus/る-form = belum terjadi saat klausa utama; bentuk た = sudah terjadi lebih dulu. (Links two events by time; the tense before とき shows whether it happens before or after the main clause.)",
  formation: [
    { pos: "V る-form + とき", rule: "belum terjadi (bersamaan/sebelum)", ex: "日本へ行くとき" },
    { pos: "V た-form + とき", rule: "sudah terjadi lebih dulu", ex: "日本へ行ったとき" },
    { pos: "いadj/なadj/N + とき", rule: "keadaan", ex: "暇なとき／子どものとき" }
  ],
  register: "Pitfall klasik: 日本へ行くとき、パスポートを準備します (belum berangkat, persiapan SEBELUM pergi) vs 日本へ行ったとき、写真をたくさん撮りました (SUDAH di Jepang, foto diambil SELAMA di sana). Perbedaan る vs た penting sekali. (る-form: before/during the trip; た-form: already there/after arriving.)",
  contrast: "vs 〜間に: 〜間に menekankan 'di suatu titik SELAMA rentang waktu tersebut', sedangkan とき lebih umum/luas mencakup satu titik waktu tertentu.",
  examples: [
    { jp: "日本へ行くとき、パスポートを準備します。", reading: "にほんへいくとき、ぱすぽーとをじゅんびします。", meaning: "Saat (akan) pergi ke Jepang, saya menyiapkan paspor. (Before going to Japan, I prepare my passport.)", cloze: "とき" },
    { jp: "日本へ行ったとき、写真をたくさん撮りました。", reading: "にほんへいったとき、しゃしんをたくさんとりました。", meaning: "Waktu (sudah) di Jepang, saya banyak memotret. (When I was in Japan, I took a lot of photos.)", cloze: "とき" },
    { jp: "子どものとき、よくここで遊びました。", reading: "こどものとき、よくここであそびました。", meaning: "Waktu masih anak-anak, saya sering bermain di sini. (When I was a child, I often played here.)", cloze: "とき" },
    { jp: "暇なとき、映画を見ます。", reading: "ひまなとき、えいがをみます。", meaning: "Saat senggang, saya menonton film. (When I'm free, I watch movies.)", cloze: "とき" },
    { jp: "困ったとき、いつも彼が助けてくれます。", reading: "こまったとき、いつもかれがたすけてくれます。", meaning: "Saat kesulitan, dia selalu membantu saya. (Whenever I'm in trouble, he always helps me.)", cloze: "とき" },
    { jp: "料理をするとき、音楽を聞きます。", reading: "りょうりをするとき、おんがくをききます。", meaning: "Saat memasak, saya mendengarkan musik. (When cooking, I listen to music.)", cloze: "とき" },
    { jp: "20歳のとき、初めて海外へ行きました。", reading: "はたちのとき、はじめてかいがいへいきました。", meaning: "Waktu umur 20 tahun, saya pertama kali ke luar negeri. (When I was 20, I went abroad for the first time.)", cloze: "とき" },
    { jp: "疲れているとき、甘いものが食べたくなります。", reading: "つかれているとき、あまいものがたべたくなります。", meaning: "Saat lelah, saya jadi ingin makan yang manis. (When I'm tired, I crave something sweet.)", cloze: "とき" },
    { jp: "テレビを見ているとき、電話が鳴りました。", reading: "てれびをみているとき、でんわがなりました。", meaning: "Saat sedang menonton TV, telepon berdering. (While I was watching TV, the phone rang.)", cloze: "とき" },
    { jp: "分からないとき、先生に聞きます。", reading: "わからないとき、せんせいにききます。", meaning: "Saat tidak mengerti, saya bertanya ke guru. (When I don't understand, I ask the teacher.)", cloze: "とき" }
  ],
  mcq: [
    { sentence: "日本へ行った＿＿、写真をたくさん撮りました。", options: ["とき", "なら", "ので", "けど"], answer: 0, explain: "Menghubungkan dua kejadian berdasarkan waktu (sudah di Jepang) → とき, dengan bentuk た karena sudah terjadi。" }
  ],
  jlptBuild: [{ chunks: ["日本へ", "行った", "とき", "写真をたくさん撮りました"], starIndex: 2, suffix: "。", translation: "Waktu di Jepang, saya banyak memotret。" }]
},

// ---- Purpose & change ----
{
  id: "n4-tameni-youni", level: "N4", group: "Tujuan & Perubahan",
  pattern: "〜ために／〜ように", reading: "tame ni / you ni",
  meaning: "demi/untuk tujuan ~ (in order to ~ / so that ~)",
  whenToUse: "Keduanya menyatakan tujuan. ために dipakai dengan kata kerja yang BISA dikendalikan (aksi disengaja); ように dipakai dengan kata kerja yang TIDAK bisa dikendalikan langsung (potensial, keadaan, kata kerja intransitif). (ために for controllable/volitional verbs; ように for non-volitional/potential verbs.)",
  formation: [
    { pos: "V る-form (disengaja) + ために", rule: "aksi terkontrol", ex: "合格するために" },
    { pos: "V る/ない (tak terkontrol) + ように", rule: "aksi tak terkontrol/potensial", ex: "忘れないように" },
    { pos: "N + の + ために", rule: "demi seseorang/sesuatu", ex: "家族のために" }
  ],
  register: "Pitfall utama: 合格するために勉強します ✓ (合格する = disengaja) tapi 日本語が話せるようになるために ✗ — karena 話せる (potensial) harus pakai ように, bukan ために. (合格する is volitional → ために; 話せる is potential/non-volitional → ように.)",
  contrast: "vs 〜ようにする: ように sendiri menyatakan tujuan; 〜ようにする menambahkan makna 'berusaha supaya' (usaha aktif menuju tujuan itu).",
  kanjiLinks: ["元気"],
  examples: [
    { jp: "試験に合格するために、毎日勉強しています。", reading: "しけんにごうかくするために、まいにちべんきょうしています。", meaning: "Demi lulus ujian, saya belajar setiap hari. (In order to pass the exam, I study every day.)", cloze: "ために" },
    { jp: "健康のために、毎朝走っています。", reading: "けんこうのために、まいあさはしっています。", meaning: "Demi kesehatan, saya lari setiap pagi. (For my health, I run every morning.)", cloze: "ために" },
    { jp: "忘れないように、メモしておきます。", reading: "わすれないように、めもしておきます。", meaning: "Supaya tidak lupa, saya catat dulu. (So that I don't forget, I'll write a note.)", cloze: "ように" },
    { jp: "みんなに聞こえるように、大きい声で話しました。", reading: "みんなにきこえるように、おおきいこえではなしました。", meaning: "Supaya terdengar semua orang, saya bicara dengan suara keras. (So that everyone could hear, I spoke loudly.)", cloze: "ように" },
    { jp: "家族のために、頑張って働いています。", reading: "かぞくのために、がんばってはたらいています。", meaning: "Demi keluarga, saya bekerja keras. (For my family, I work hard.)", cloze: "ために" },
    { jp: "遅れないように、早く家を出ました。", reading: "おくれないように、はやくいえをでました。", meaning: "Supaya tidak terlambat, saya berangkat dari rumah lebih awal. (So as not to be late, I left home early.)", cloze: "ように" },
    { jp: "日本語が上手になるために、毎日練習します。", reading: "にほんごがじょうずになるために、まいにちれんしゅうします。", meaning: "Demi menjadi mahir bahasa Jepang, saya berlatih setiap hari. (In order to become good at Japanese, I practice every day.)", cloze: "ために" },
    { jp: "風邪をひかないように、気をつけています。", reading: "かぜをひかないように、きをつけています。", meaning: "Supaya tidak masuk angin, saya berhati-hati. (So as not to catch a cold, I'm being careful.)", cloze: "ように" },
    { jp: "太らないように、運動しています。", reading: "ふとらないように、うんどうしています。", meaning: "Supaya tidak gemuk, saya berolahraga. (So as not to gain weight, I exercise.)", cloze: "ように" },
    { jp: "夢を叶えるために、努力しています。", reading: "ゆめをかなえるために、どりょくしています。", meaning: "Demi mewujudkan impian, saya berusaha keras. (In order to make my dream come true, I'm making an effort.)", cloze: "ために" }
  ],
  mcq: [
    { sentence: "忘れない＿＿、メモしておきます。", options: ["ように", "ために", "から", "のに"], answer: 0, explain: "Kata kerja tak terkontrol/negatif (忘れない) + tujuan → ように, bukan ために。" }
  ],
  jlptBuild: [{ chunks: ["忘れない", "ように", "メモを", "しておきます"], starIndex: 1, suffix: "。", translation: "Supaya tidak lupa, saya catat dulu。" }]
},

// ---- Contrast & concession ----
{
  id: "n4-noni", level: "N4", group: "Kontras & Konsesi",
  pattern: "〜のに", reading: "noni",
  meaning: "padahal ~ (even though ~ / despite ~)",
  whenToUse: "Menghubungkan dua hal yang bertentangan, sering disertai nuansa kecewa/heran/kesal karena hasil tidak sesuai harapan. (Connects two contradictory facts, often with a nuance of surprise, disappointment, or frustration.)",
  formation: [
    { pos: "Bentuk biasa + のに", rule: "semua jenis kata", ex: "勉強したのに、失敗した。" },
    { pos: "なadj/N + なのに", rule: "butuh な", ex: "元気なのに" }
  ],
  register: "Pitfall: klausa setelah のに tidak boleh berupa saran/ajakan/perintah untuk lawan bicara (berbeda dari から). Nuansa emosionalnya (kecewa/heran) lebih kuat dibanding が(tapi) yang netral. (The clause after のに can't be advice/invitation to the listener; carries stronger emotional nuance than plain が.)",
  contrast: "vs 〜ても: ても menyatakan 'meskipun X (mungkin/hipotetis), tetap Y' (belum tentu terjadi); のに menyatakan 'padahal X SUDAH/MEMANG terjadi, tapi Y' (fakta yang berlawanan, dengan nada kecewa).",
  examples: [
    { jp: "たくさん勉強したのに、テストに失敗しました。", reading: "たくさんべんきょうしたのに、てすとにしっぱいしました。", meaning: "Padahal sudah belajar banyak, tapi gagal tes. (Even though I studied a lot, I failed the test.)", cloze: "のに" },
    { jp: "彼は忙しいのに、手伝ってくれました。", reading: "かれはいそがしいのに、てつだってくれました。", meaning: "Padahal dia sibuk, tapi dia mau membantu. (Even though he's busy, he helped me.)", cloze: "のに" },
    { jp: "もう5月なのに、まだ寒いです。", reading: "もうごがつなのに、まださむいです。", meaning: "Padahal sudah bulan Mei, masih dingin. (Even though it's already May, it's still cold.)", cloze: "なのに" },
    { jp: "彼女は元気なのに、休みました。", reading: "かのじょはげんきなのに、やすみました。", meaning: "Padahal dia sehat, tapi dia izin (tidak masuk). (Even though she's fine, she took the day off.)", cloze: "なのに" },
    { jp: "呼んだのに、返事がありませんでした。", reading: "よんだのに、へんじがありませんでした。", meaning: "Padahal sudah dipanggil, tidak ada jawaban. (Even though I called out, there was no response.)", cloze: "のに" },
    { jp: "高いお金を払ったのに、壊れてしまいました。", reading: "たかいおかねをはらったのに、こわれてしまいました。", meaning: "Padahal sudah bayar mahal, malah rusak. (Even though I paid a lot, it broke.)", cloze: "のに" },
    { jp: "約束したのに、彼は来ませんでした。", reading: "やくそくしたのに、かれはきませんでした。", meaning: "Padahal sudah janji, tapi dia tidak datang. (Even though we made a promise, he didn't come.)", cloze: "のに" },
    { jp: "説明を聞いたのに、まだわかりません。", reading: "せつめいをきいたのに、まだわかりません。", meaning: "Padahal sudah dengar penjelasannya, masih belum paham. (Even though I heard the explanation, I still don't understand.)", cloze: "のに" },
    { jp: "薬を飲んだのに、まだ熱があります。", reading: "くすりをのんだのに、まだねつがあります。", meaning: "Padahal sudah minum obat, masih demam. (Even though I took medicine, I still have a fever.)", cloze: "のに" },
    { jp: "もう夏なのに、涼しいです。", reading: "もうなつなのに、すずしいです。", meaning: "Padahal sudah musim panas, tapi sejuk. (Even though it's already summer, it's cool.)", cloze: "なのに" }
  ],
  mcq: [
    { sentence: "たくさん勉強した＿＿、テストに失敗しました。", options: ["のに", "から", "ので", "し"], answer: 0, explain: "Hasil bertentangan dengan harapan (belajar banyak tapi gagal) → のに, bukan alasan biasa." }
  ],
  jlptBuild: [{ chunks: ["たくさん", "勉強した", "のに", "失敗しました"], starIndex: 2, suffix: "。", translation: "Padahal sudah belajar banyak, tapi gagal。" }]
},

{
  id: "n4-temo", level: "N4", group: "Kontras & Konsesi",
  pattern: "〜ても", reading: "temo",
  meaning: "meskipun/walaupun ~ (even if ~)",
  whenToUse: "Menyatakan 'meskipun X terjadi/dilakukan, hasil Y tetap sama' — X bersifat hipotetis/masih mungkin, berbeda dari のに yang faktanya sudah pasti terjadi. (Even if X happens, Y stays the same — X is hypothetical, unlike のに where X is already a fact.)",
  formation: [
    { pos: "V-て + も", rule: "bentuk て + も", ex: "頑張っても" },
    { pos: "いadj (い→くても)", rule: "高い→高くても", ex: "高くても" },
    { pos: "なadj/N + でも", rule: "langsung でも", ex: "静かでも" }
  ],
  register: "Pitfall: bentuk tanya + ても bisa membentuk 'apapun/di manapun': 何をしても (apapun yang dilakukan), どこへ行っても (ke manapun pergi). (Combined with question words, ても forms 'no matter what/where': 何をしても, どこへ行っても.)",
  contrast: "vs のに: ても = hipotetis, klausa akhir bisa saran/ajakan; のに = fakta yang sudah terjadi, klausa akhir tidak boleh saran/ajakan, dan bernada lebih kecewa.",
  examples: [
    { jp: "いくら頑張っても、うまくいきません。", reading: "いくらがんばっても、うまくいきません。", meaning: "Sekeras apapun berusaha, tetap tidak berhasil. (No matter how hard I try, it doesn't go well.)", cloze: "頑張っても" },
    { jp: "高くても、これを買います。", reading: "たかくても、これをかいます。", meaning: "Walaupun mahal, saya akan beli ini. (Even if it's expensive, I'll buy this.)", cloze: "高くても" },
    { jp: "雨が降っても、行きます。", reading: "あめがふっても、いきます。", meaning: "Meskipun hujan turun, saya akan pergi. (Even if it rains, I'll go.)", cloze: "降っても" },
    { jp: "何を食べても、太りません。", reading: "なにをたべても、ふとりません。", meaning: "Apapun yang dimakan, tidak gemuk. (No matter what I eat, I don't gain weight.)", cloze: "食べても" },
    { jp: "何回説明しても、わかってくれません。", reading: "なんかいせつめいしても、わかってくれません。", meaning: "Berapa kali pun dijelaskan, dia tidak mengerti juga. (No matter how many times I explain, they don't understand.)", cloze: "説明しても" },
    { jp: "静かでも、集中できません。", reading: "しずかでも、しゅうちゅうできません。", meaning: "Meskipun tenang, tetap tidak bisa fokus. (Even if it's quiet, I can't concentrate.)", cloze: "静かでも" },
    { jp: "どんなに疲れていても、宿題をします。", reading: "どんなにつかれていても、しゅくだいをします。", meaning: "Sekelelahan apapun, saya tetap mengerjakan PR. (No matter how tired I am, I do my homework.)", cloze: "疲れていても" },
    { jp: "急いでも、間に合わないでしょう。", reading: "いそいでも、まにあわないでしょう。", meaning: "Meskipun bergegas, sepertinya tetap tidak akan sempat. (Even if I hurry, I probably won't make it in time.)", cloze: "急いでも" },
    { jp: "何度聞いても、忘れてしまいます。", reading: "なんどきいても、わすれてしまいます。", meaning: "Berapa kali pun didengar, tetap terlupa. (No matter how many times I hear it, I forget it.)", cloze: "聞いても" },
    { jp: "安くても、質が悪ければ買いません。", reading: "やすくても、しつがわるければかいません。", meaning: "Meskipun murah, kalau kualitasnya buruk saya tidak akan beli. (Even if it's cheap, I won't buy it if the quality is bad.)", cloze: "安くても" }
  ],
  build: [
    { chunks: ["いくら", "頑張っても", "うまく", "いきません"], answer: ["いくら", "頑張っても", "うまく", "いきません"], translation: "Sekeras apapun berusaha, tetap tidak berhasil." }
  ],
  mcq: [
    { sentence: "いくら＿＿、うまくいきません。", options: ["頑張っても", "頑張ったら", "頑張ると", "頑張るなら"], answer: 0, explain: "Meskipun berusaha (hipotetis, hasil tetap sama) → ても。" }
  ],
  jlptBuild: [{ chunks: ["いくら", "頑張っても", "うまく", "いきません"], starIndex: 1, suffix: "。", translation: "Sekeras apapun berusaha, tetap tidak berhasil。" }]
}

];
