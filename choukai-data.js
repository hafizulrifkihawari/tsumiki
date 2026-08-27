/* 日本語能力試験 N4 — 聴解 (listening) 練習データ.
 *
 * One pilot set matching the real N4 聴解 composition: 問題1 課題理解 (8問) +
 * 問題2 ポイント理解 (7問) + 問題3 発話表現 (5問, 3択) + 問題4 即時応答 (8問, 3択)
 * = 28問. All content is original — modeled on the official format, not
 * transcribed from any real/copyrighted past paper (which JEES does not
 * publish anyway).
 *
 * Audio is produced live in-browser via choukai.js (Web Speech API) — there is
 * no pre-rendered audio here, so every spoken line is plain text with a
 * `speaker` tag ("M" | "F" | "N" for narrator) that choukai.js voices aloud.
 * The engine deliberately renders NO visible transcript for lines/options
 * during a live question — only the specific text this repo's real N4 booklet
 * would print (see the table in the plan) is ever shown before you answer;
 * full transcripts only appear afterward, in review.
 *
 * ── Schema ──────────────────────────────────────────────────────────────────
 *   CHOUKAI_SIM: [ Set ]
 *   Set = { id, label, mondai: [Mondai] }
 *   Mondai = { type, name, instruction, items: [Item] }
 *
 *   type: "task-comprehension" | "point-comprehension"  (mondai 1 / 2 shape)
 *     Item = { situation, lines: [{speaker, text}], question, options[4], explain }
 *     options[0] is always the correct answer — choukai.js shuffles the
 *     on-screen order at runtime (same convention as n4sim-data.js), since
 *     these are printed text choices where shuffling matters.
 *
 *   type: "utterance-expression"  (mondai 3 shape, 3-choice, no picture asset
 *         so `scene` is a printed text substitute for what would be a photo)
 *     Item = { scene, options: [{speaker,text} x3], correctIndex, explain }
 *
 *   type: "quick-response"  (mondai 4 shape, 3-choice, fully audio — nothing
 *         is printed at all until review)
 *     Item = { stimulus: {speaker,text}, options: [{speaker,text} x3], correctIndex, explain }
 *
 *   For utterance-expression / quick-response, option order is FIXED (not
 *   shuffled) — ①②③ literally mean "the first/second/third thing you heard",
 *   so `correctIndex` is stored directly rather than using the
 *   options[0]-is-correct convention.
 * ────────────────────────────────────────────────────────────────────────────
 */

const CHOUKAI_SIM = [
  {
    id: "choukaiA",
    label: "聴解 A",
    mondai: [
      {
        type: "task-comprehension",
        name: "問題1 課題理解",
        instruction: "はなしを 聞いて、質問に 答えて ください。話は 一度だけ 聞きます。それから、正しい 答えを 一つ えらんで ください。",
        items: [
          {
            situation: "会社で 上司と 部下が 話して います。部下は この あと、まず 何を しますか。",
            lines: [
              { speaker: "M", text: "この 資料、コピーしてから、会議室に 持って 行って ください。" },
              { speaker: "F", text: "はい、わかりました。何枚 コピーしますか。" },
              { speaker: "M", text: "10枚 お願いします。あ、その前に、田中さんに 電話して、会議の 時間を 確認して ください。" },
              { speaker: "F", text: "わかりました。先に 電話しますね。" }
            ],
            question: "部下は この あと、まず 何を しますか。",
            options: ["田中さんに 電話する", "資料を コピーする", "会議室に 行く", "上司と 話す"],
            explain: "上司が「その前に、田中さんに電話して」と言い、部下も「先に電話しますね」と答えている。"
          },
          {
            situation: "学校で 先生と 学生が 話して います。学生は 宿題を いつまでに 出しますか。",
            lines: [
              { speaker: "F", text: "山田さん、レポートの 宿題、忘れないで くださいね。" },
              { speaker: "M", text: "はい。えーと、今週の 金曜日までですよね。" },
              { speaker: "F", text: "いいえ、金曜日は 休みに なったので、来週の 月曜日までに 変わりました。" },
              { speaker: "M", text: "わかりました。来週の 月曜日ですね。" }
            ],
            question: "学生は 宿題を いつまでに 出しますか。",
            options: ["来週の 月曜日", "今週の 金曜日", "今週の 月曜日", "来週の 金曜日"],
            explain: "先生が「来週の月曜日までに変わりました」と言っている。"
          },
          {
            situation: "駅で 女の人が 駅員に 聞いて います。女の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "すみません、渋谷駅まで 行きたいんですが、この 電車で いいですか。" },
              { speaker: "M", text: "いいえ、この電車は 反対方向です。向かいの ホームの 電車に 乗って ください。" },
              { speaker: "F", text: "わかりました。ありがとうございます。あ、切符を まだ 買って いません。" },
              { speaker: "M", text: "それなら、まず 切符売り場で 切符を 買ってから、ホームに 行って ください。" }
            ],
            question: "女の人は この あと、まず 何を しますか。",
            options: ["切符を 買う", "電車に 乗る", "反対方向に 行く", "駅員に 聞く"],
            explain: "駅員が「まず切符売り場で切符を買ってから」と言っている。"
          },
          {
            situation: "家で 母と 息子が 話して います。息子は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "太郎、宿題は 終わったの?" },
              { speaker: "M", text: "うん、さっき 終わったよ。今から ゲームしても いい?" },
              { speaker: "F", text: "その前に、部屋を 片付けて ちょうだい。それから、犬の 散歩にも 行ってね。" },
              { speaker: "M", text: "わかった。じゃあ、先に 部屋を 片付けるね。" }
            ],
            question: "息子は この あと、まず 何を しますか。",
            options: ["部屋を 片付ける", "ゲームを する", "犬の 散歩に 行く", "宿題を する"],
            explain: "母に「その前に、部屋を片付けて」と言われ、息子も「先に片付けるね」と答えている。"
          },
          {
            situation: "会社で 女の人と 男の人が 話して います。男の人は この あと、何を 持って 行きますか。",
            lines: [
              { speaker: "F", text: "明日の 出張、準備は できましたか。" },
              { speaker: "M", text: "はい、資料と パソコンは 用意しました。" },
              { speaker: "F", text: "傘も 持って 行った ほうが いいですよ。明日は 雨が 降るそうです。" },
              { speaker: "M", text: "そうですか。じゃあ、傘も 入れて おきます。" }
            ],
            question: "男の人は この あと、何を 持って 行きますか。",
            options: ["資料と パソコンと 傘", "資料だけ", "パソコンだけ", "傘だけ"],
            explain: "資料とパソコンは準備済みで、傘も持って行くことにした。"
          },
          {
            situation: "図書館で 女の人が 係の人に 聞いて います。女の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "すみません、この本を 借りたいんですが。" },
              { speaker: "M", text: "図書館カードは お持ちですか。" },
              { speaker: "F", text: "いいえ、まだ 作って いません。" },
              { speaker: "M", text: "それでは、まず あちらの カウンターで カードを 作って ください。それから、こちらで 本を 借りられます。" }
            ],
            question: "女の人は この あと、まず 何を しますか。",
            options: ["図書館カードを 作る", "本を 借りる", "本を 返す", "カウンターで 払う"],
            explain: "係の人が「まずあちらのカウンターでカードを作ってください」と言っている。"
          },
          {
            situation: "レストランで 店員と 客が 話して います。客は この あと、何を 注文しますか。",
            lines: [
              { speaker: "M", text: "ご注文は お決まりですか。" },
              { speaker: "F", text: "すみません、カレーを お願いします。あ、でも カレーは もう ないんですか。" },
              { speaker: "M", text: "申し訳ございません、カレーは 売り切れです。ラーメンか うどんは いかがですか。" },
              { speaker: "F", text: "それなら、うどんを お願いします。" }
            ],
            question: "客は この あと、何を 注文しますか。",
            options: ["うどん", "カレー", "ラーメン", "何も 注文しない"],
            explain: "カレーが売り切れで、客は「うどんをお願いします」と言っている。"
          },
          {
            situation: "病院で 受付の人と 患者が 話して います。患者は この あと、まず 何を しますか。",
            lines: [
              { speaker: "M", text: "すみません、初めてなんですが。" },
              { speaker: "F", text: "初めての方は、まず こちらの紙に 名前と 住所を 書いて ください。" },
              { speaker: "M", text: "わかりました。書いたら どうすれば いいですか。" },
              { speaker: "F", text: "書いたら、この受付に 戻して ください。そのあと、番号が 呼ばれるまで お待ち ください。" }
            ],
            question: "患者は この あと、まず 何を しますか。",
            options: ["紙に 名前と 住所を 書く", "受付に 紙を 戻す", "座って 待つ", "番号を 呼ぶ"],
            explain: "受付の人が「まずこちらの紙に名前と住所を書いてください」と言っている。"
          }
        ]
      },
      {
        type: "point-comprehension",
        name: "問題2 ポイント理解",
        instruction: "はじめに 質問を 聞いて ください。それから 話を 聞いて、正しい 答えを 一つ えらんで ください。",
        items: [
          {
            situation: "女の人と 男の人が 話して います。女の人は どうして 会社を 休みますか。",
            question: "女の人は どうして 会社を 休みますか。",
            options: ["熱が あるから", "旅行に 行くから", "病院に 行くから", "仕事が 終わったから"],
            lines: [
              { speaker: "M", text: "田中さん、今日は 会社を 休むそうですね。どうしたんですか。" },
              { speaker: "F", text: "実は 熱が 少し あって。病院には 行かなくても 大丈夫だと思うんですが、休んで ゆっくり しようと思います。" },
              { speaker: "M", text: "それは 大変ですね。お大事に。" }
            ],
            explain: "女の人は「熱が少しあって」休むと言っており、病院には行かないと言っている。"
          },
          {
            situation: "男の人と 女の人が 電話で 話して います。二人は 何時に 会いますか。",
            question: "二人は 何時に 会いますか。",
            options: ["3時", "2時", "4時", "3時半"],
            lines: [
              { speaker: "M", text: "もしもし、明日の 約束なんですが、2時で いいですか。" },
              { speaker: "F", text: "すみません、2時は ちょっと 用事が あって。3時なら 大丈夫です。" },
              { speaker: "M", text: "わかりました。じゃあ、3時に 駅の前で 会いましょう。" }
            ],
            explain: "男の人が「じゃあ、3時に」と言い、3時に会うことに決まった。"
          },
          {
            situation: "会社で 女の人が 話して います。会議室は どこに 変わりましたか。",
            question: "会議室は どこに 変わりましたか。",
            options: ["4階の 会議室", "3階の 会議室", "2階の 会議室", "1階の 会議室"],
            lines: [
              { speaker: "F", text: "皆さん、お知らせです。今日の会議は、いつもの3階の会議室ではなく、4階の会議室に 変わりました。" },
              { speaker: "M", text: "え、4階ですか。わかりました。" },
              { speaker: "F", text: "はい、荷物を 持って、4階に 移動して ください。" }
            ],
            explain: "「4階の会議室に変わりました」と言っている。"
          },
          {
            situation: "女の人と 男の人が 話して います。男の人は 何で 会社に 行きますか。",
            question: "男の人は 何で 会社に 行きますか。",
            options: ["自転車", "電車", "バス", "車"],
            lines: [
              { speaker: "F", text: "最近、電車が よく 遅れるので、大変ですね。" },
              { speaker: "M", text: "そうなんです。だから、来週から 自転車で 会社に 行こうと思って います。" },
              { speaker: "F", text: "自転車ですか。健康にも いいですね。" },
              { speaker: "M", text: "はい、雨の日は バスを 使いますが。" }
            ],
            explain: "男の人は来週から自転車で会社に行くと言っている(雨の日はバス)。"
          },
          {
            situation: "母と 息子が 話して います。息子は 誕生日に 何が ほしいですか。",
            question: "息子は 誕生日に 何が ほしいですか。",
            options: ["自転車", "本", "時計", "ゲーム"],
            lines: [
              { speaker: "F", text: "太郎、誕生日に 何が ほしい? 前は 時計が ほしいって 言って たよね。" },
              { speaker: "M", text: "うん、でも 今は 自転車が ほしいな。学校まで 遠いから。" },
              { speaker: "F", text: "そう、自転車ね。わかった。" }
            ],
            explain: "息子は今は自転車がほしいと言っている(時計は以前ほしかったもの)。"
          },
          {
            situation: "女の人と 男の人が 話して います。二人は どうして 旅行の 予定を 変えましたか。",
            question: "二人は どうして 旅行の 予定を 変えましたか。",
            options: ["天気が 悪いから", "お金が ないから", "仕事が 忙しいから", "電車が ないから"],
            lines: [
              { speaker: "M", text: "来週の 旅行なんですが、天気予報を 見ましたか。" },
              { speaker: "F", text: "見ました。台風が来るそうで、雨が ひどいみたいです。" },
              { speaker: "M", text: "それなら、旅行は 来月に 変えた ほうが いいですね。" },
              { speaker: "F", text: "そうですね。そうしましょう。" }
            ],
            explain: "台風で天気が悪いので旅行の予定を変えた。"
          },
          {
            situation: "学生と 先生が 話して います。テストは 何ページから 何ページまでですか。",
            question: "テストは 何ページから 何ページまでですか。",
            options: ["10ページから 20ページまで", "1ページから 10ページまで", "10ページから 30ページまで", "20ページから 30ページまで"],
            lines: [
              { speaker: "M", text: "先生、来週の テストの範囲を 教えて ください。" },
              { speaker: "F", text: "はい、10ページから 20ページまでです。" },
              { speaker: "M", text: "1ページから 10ページまでじゃ ないんですか。" },
              { speaker: "F", text: "はい、そこは もう 終わったので、10ページからです。" }
            ],
            explain: "先生が「10ページから20ページまでです」と言っている。"
          }
        ]
      },
      {
        type: "utterance-expression",
        name: "問題3 発話表現",
        instruction: "（絵の代わりに 場面の 説明を 読んで ください。）正しい 文を 一つ えらんで ください。",
        items: [
          {
            scene: "友だちの 家に 遊びに 行きます。玄関で 何と 言いますか。",
            options: [
              { speaker: "N", text: "お邪魔します。" },
              { speaker: "N", text: "いただきます。" },
              { speaker: "N", text: "ごちそうさまでした。" }
            ],
            correctIndex: 0,
            explain: "人の家に入るとき「お邪魔します」と言う。「いただきます」は食事の前、「ごちそうさまでした」は食事の後。"
          },
          {
            scene: "電車の中で、お年寄りが 立って います。あなたは 座って います。何と 言いますか。",
            options: [
              { speaker: "N", text: "どうぞ、座って ください。" },
              { speaker: "N", text: "すみません、降ります。" },
              { speaker: "N", text: "ここは 私の 席です。" }
            ],
            correctIndex: 0,
            explain: "お年寄りに席を譲るとき「どうぞ、座ってください」と言う。"
          },
          {
            scene: "友だちに 借りた 本を 返します。何と 言いますか。",
            options: [
              { speaker: "N", text: "ありがとうございました。助かりました。" },
              { speaker: "N", text: "すみません、貸して ください。" },
              { speaker: "N", text: "いいえ、けっこうです。" }
            ],
            correctIndex: 0,
            explain: "借りたものを返すときはお礼を言う「ありがとうございました」が適切。"
          },
          {
            scene: "会社で、これから 帰ります。まだ 仕事を している 同僚に 何と 言いますか。",
            options: [
              { speaker: "N", text: "お先に 失礼します。" },
              { speaker: "N", text: "いってらっしゃい。" },
              { speaker: "N", text: "おかえりなさい。" }
            ],
            correctIndex: 0,
            explain: "先に帰るとき「お先に失礼します」と言う。"
          },
          {
            scene: "レストランで、店員に メニューを 見せて ほしいです。何と 言いますか。",
            options: [
              { speaker: "N", text: "すみません、メニューを 見せて ください。" },
              { speaker: "N", text: "ごちそうさまでした。" },
              { speaker: "N", text: "お会計を お願いします。" }
            ],
            correctIndex: 0,
            explain: "メニューが欲しいときは「メニューを見せてください」と頼む。"
          }
        ]
      },
      {
        type: "quick-response",
        name: "問題4 即時応答",
        instruction: "みじかい 文を 聞いて、1から3の 中から、いちばん いい ものを 一つ えらんで ください。",
        items: [
          {
            stimulus: { speaker: "F", text: "明日、いっしょに 映画を 見に 行きませんか。" },
            options: [
              { speaker: "M", text: "いいですね、行きましょう。" },
              { speaker: "M", text: "すみません、その映画は もう 見ました。" },
              { speaker: "M", text: "ありがとう、いただきます。" }
            ],
            correctIndex: 0,
            explain: "誘いに対する自然な返事は「いいですね、行きましょう」。"
          },
          {
            stimulus: { speaker: "M", text: "すみません、今 何時ですか。" },
            options: [
              { speaker: "F", text: "3時半です。" },
              { speaker: "F", text: "3人です。" },
              { speaker: "F", text: "3階です。" }
            ],
            correctIndex: 0,
            explain: "時間を聞かれたら時刻で答える。「3人」「3階」は不適切。"
          },
          {
            stimulus: { speaker: "F", text: "この荷物、重いですね。手伝いましょうか。" },
            options: [
              { speaker: "M", text: "ありがとうございます、お願いします。" },
              { speaker: "M", text: "いいえ、食べません。" },
              { speaker: "M", text: "はい、そうでしょう。" }
            ],
            correctIndex: 0,
            explain: "申し出への自然な返事は「ありがとうございます、お願いします」。"
          },
          {
            stimulus: { speaker: "M", text: "風邪を 引いたみたいで、頭が 痛いんです。" },
            options: [
              { speaker: "F", text: "それは 大変ですね。お大事に。" },
              { speaker: "F", text: "それは よかったですね。" },
              { speaker: "F", text: "おめでとうございます。" }
            ],
            correctIndex: 0,
            explain: "体調が悪い人には「お大事に」と言う。"
          },
          {
            stimulus: { speaker: "F", text: "すみません、駅は どちらですか。" },
            options: [
              { speaker: "M", text: "この道を まっすぐ 行くと、右側に あります。" },
              { speaker: "M", text: "駅は 9時からです。" },
              { speaker: "M", text: "駅は 3日前に 行きました。" }
            ],
            correctIndex: 0,
            explain: "場所を聞かれたら道順や方向で答える。"
          },
          {
            stimulus: { speaker: "M", text: "食事、もう 終わりましたか。" },
            options: [
              { speaker: "F", text: "はい、もう 終わりました。" },
              { speaker: "F", text: "はい、まだです。" },
              { speaker: "F", text: "いいえ、もう 終わりました。" }
            ],
            correctIndex: 0,
            explain: "質問と矛盾しない自然な返事は「はい、もう終わりました」。"
          },
          {
            stimulus: { speaker: "F", text: "来週の パーティー、何を 持って 行けば いいですか。" },
            options: [
              { speaker: "M", text: "飲み物を お願いします。" },
              { speaker: "M", text: "パーティーは 楽しかったです。" },
              { speaker: "M", text: "もう 持って 行きました。" }
            ],
            correctIndex: 0,
            explain: "「何を持って行けばいいか」という質問には、具体的な物で答える。"
          },
          {
            stimulus: { speaker: "M", text: "あのう、この席、空いて いますか。" },
            options: [
              { speaker: "F", text: "はい、どうぞ。" },
              { speaker: "F", text: "はい、いただきます。" },
              { speaker: "F", text: "いいえ、まだです。" }
            ],
            correctIndex: 0,
            explain: "席が空いているか聞かれたら「はい、どうぞ」と答える。"
          }
        ]
      }
    ]
  }
];

if (typeof module !== "undefined" && module.exports) module.exports = { CHOUKAI_SIM };
