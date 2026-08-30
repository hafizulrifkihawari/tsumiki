/* 日本語能力試験 N4 — 聴解 (listening) 練習データ.
 *
 * One pilot set matching the real N4 聴解 composition: 問題1 課題理解 (8問) +
 * 問題2 ポイント理解 (7問) + 問題3 発話表現 (5問, 3択) + 問題4 即時応答 (8問, 3択)
 * = 28問. All content is original — modeled on the official format, not
 * transcribed from any real/copyrighted past paper (which JEES does not
 * publish anyway).
 *
 * Audio: every spoken line is plain text with a `speaker` tag ("M" | "F" | "N"
 * for narrator). scripts/generate-choukai-audio.js pre-renders each line to a
 * natural VOICEVOX voice (a distinct voice per speaker tag) under
 * audio/choukai/. choukai.js plays those clips and falls back to the live Web
 * Speech API for any line with no clip.
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
  },
  {
    id: "choukaiB",
    label: "聴解 B",
    mondai: [
      {
        type: "task-comprehension",
        name: "問題1 課題理解",
        instruction: "はなしを 聞いて、質問に 答えて ください。話は 一度だけ 聞きます。それから、正しい 答えを 一つ えらんで ください。",
        items: [
          {
            situation: "会社で 女の人と 男の人が 話して います。男の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "山田さん、この 書類を 部長に 渡して もらえますか。" },
              { speaker: "M", text: "はい。今 すぐ 行きます。" },
              { speaker: "F", text: "あ、その前に、コピーを 3枚 とって おいて ください。" },
              { speaker: "M", text: "わかりました。じゃあ、先に コピーしますね。" }
            ],
            question: "男の人は この あと、まず 何を しますか。",
            options: ["書類を コピーする", "部長に 書類を 渡す", "部長に 電話する", "会社を 出る"],
            explain: "「その前に、コピーを3枚とっておいて」と言われ、男の人も「先にコピーしますね」と答えている。"
          },
          {
            situation: "花屋で 店員と 客が 話して います。客は この あと、何を 買いますか。",
            lines: [
              { speaker: "M", text: "いらっしゃいませ。何か お探しですか。" },
              { speaker: "F", text: "母の 誕生日に 花を 買いたいんです。赤い バラは ありますか。" },
              { speaker: "M", text: "申し訳ありません、赤い バラは 今 売り切れです。白い バラか、ひまわりは いかがですか。" },
              { speaker: "F", text: "そうですね…じゃあ、白い バラを ください。" }
            ],
            question: "客は この あと、何を 買いますか。",
            options: ["白い バラ", "赤い バラ", "ひまわり", "何も 買わない"],
            explain: "赤いバラは売り切れで、客は「白いバラをください」と言っている。"
          },
          {
            situation: "学校で 先生が 学生に 話して います。学生は 明日、何を 持って 来ますか。",
            lines: [
              { speaker: "F", text: "明日は 美術の 授業が あります。絵の具と 筆を 持って 来て ください。" },
              { speaker: "M", text: "先生、ノートも 要りますか。" },
              { speaker: "F", text: "ノートは 要りません。でも、汚れても いい服を 着て 来て くださいね。" },
              { speaker: "M", text: "はい、わかりました。" }
            ],
            question: "学生は 明日、何を 持って 来ますか。",
            options: ["絵の具と 筆", "ノートと 筆", "絵の具と ノート", "何も 要らない"],
            explain: "先生が「絵の具と筆を持って来てください」「ノートは要りません」と言っている。"
          },
          {
            situation: "家で 父と 娘が 話して います。娘は この あと、まず 何を しますか。",
            lines: [
              { speaker: "M", text: "みか、出かける前に 洗濯物を 取り込んで くれる?" },
              { speaker: "F", text: "うん、いいよ。あ、その前に お皿を 洗っちゃうね。" },
              { speaker: "M", text: "ありがとう。でも、雨が 降りそうだから、洗濯物を 先に お願い。" },
              { speaker: "F", text: "そっか、じゃあ 先に そっちを やるね。" }
            ],
            question: "娘は この あと、まず 何を しますか。",
            options: ["洗濯物を 取り込む", "お皿を 洗う", "出かける", "買い物に 行く"],
            explain: "父が「洗濯物を先にお願い」と言い、娘も「先にそっちをやるね」と答えている。"
          },
          {
            situation: "ホテルの 受付で 係の人と 客が 話して います。客は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "いらっしゃいませ。ご予約の お名前を お願いします。" },
              { speaker: "M", text: "田中です。あの、朝ごはんは 何時からですか。" },
              { speaker: "F", text: "朝食は 7時からです。お部屋の 鍵を お渡しする前に、こちらの 紙に サインを お願いします。" },
              { speaker: "M", text: "わかりました。サインしますね。" }
            ],
            question: "客は この あと、まず 何を しますか。",
            options: ["紙に サインする", "部屋の 鍵を もらう", "朝ごはんを 食べる", "予約を する"],
            explain: "係の人が「鍵をお渡しする前に、紙にサインを」と言っている。"
          },
          {
            situation: "郵便局で 係の人と 女の人が 話して います。女の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "すみません、この 荷物を 送りたいんですが。" },
              { speaker: "M", text: "はい。重さを 量りますので、こちらの 台に 載せて ください。" },
              { speaker: "F", text: "わかりました。あ、送り状は もう 書きました。" },
              { speaker: "M", text: "ありがとうございます。では、まず 台に 載せて ください。" }
            ],
            question: "女の人は この あと、まず 何を しますか。",
            options: ["荷物を 台に 載せる", "送り状を 書く", "お金を 払う", "荷物を 開ける"],
            explain: "係の人が「まず台に載せてください」と言っている(送り状は書き済み)。"
          },
          {
            situation: "料理教室で 先生が 話して います。学生は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "では、カレーを 作りましょう。はじめに 野菜を 切りますが、その前に 手を 洗って ください。" },
              { speaker: "M", text: "先生、肉は いつ 切りますか。" },
              { speaker: "F", text: "肉は 野菜の あとで 大丈夫です。まず 手を 洗ってから、野菜を お願いします。" },
              { speaker: "M", text: "はい、わかりました。" }
            ],
            question: "学生は この あと、まず 何を しますか。",
            options: ["手を 洗う", "野菜を 切る", "肉を 切る", "カレーを 食べる"],
            explain: "先生が「まず手を洗ってから、野菜を」と言っている。"
          },
          {
            situation: "会社で 男の人と 女の人が 話して います。女の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "M", text: "鈴木さん、明日の 会議の 資料は できましたか。" },
              { speaker: "F", text: "はい、できました。今 印刷しようと 思って います。" },
              { speaker: "M", text: "その前に、部長に メールで 確認して もらえますか。間違いが あると 困るので。" },
              { speaker: "F", text: "わかりました。じゃあ、先に メールを 送ります。" }
            ],
            question: "女の人は この あと、まず 何を しますか。",
            options: ["部長に メールを 送る", "資料を 印刷する", "会議に 出る", "資料を 作る"],
            explain: "男の人が「その前に、部長にメールで確認して」と言い、女の人も「先にメールを送ります」と答えている。"
          }
        ]
      },
      {
        type: "point-comprehension",
        name: "問題2 ポイント理解",
        instruction: "はじめに 質問を 聞いて ください。それから 話を 聞いて、正しい 答えを 一つ えらんで ください。",
        items: [
          {
            situation: "男の人と 女の人が 話して います。男の人は どうして 遅刻しましたか。",
            question: "男の人は どうして 遅刻しましたか。",
            options: ["電車が 止まったから", "寝坊したから", "道が わからなかったから", "忘れ物を したから"],
            lines: [
              { speaker: "F", text: "田中さん、今日は 遅かったですね。寝坊ですか。" },
              { speaker: "M", text: "いいえ、電車が 事故で 止まって しまって。30分も 待ちました。" },
              { speaker: "F", text: "そうだったんですか。大変でしたね。" }
            ],
            explain: "男の人は「電車が事故で止まって」遅刻したと言っている。"
          },
          {
            situation: "女の人が 話して います。コンサートは 何時に 始まりますか。",
            question: "コンサートは 何時に 始まりますか。",
            options: ["6時半", "6時", "7時", "5時半"],
            lines: [
              { speaker: "F", text: "皆さん、今日の コンサートに ようこそ。開演は 6時の 予定でしたが、少し 遅れて 6時半から 始まります。" },
              { speaker: "M", text: "え、6時からじゃ ないんですか。" },
              { speaker: "F", text: "はい、6時半からです。もう少し お待ち ください。" }
            ],
            explain: "「6時半から始まります」と言っている。"
          },
          {
            situation: "男の人と 女の人が 電話で 話して います。二人は どこで 会いますか。",
            question: "二人は どこで 会いますか。",
            options: ["駅の 北口", "駅の 南口", "デパートの 前", "映画館の 中"],
            lines: [
              { speaker: "M", text: "明日は デパートの 前で 会いましょうか。" },
              { speaker: "F", text: "うーん、人が 多いので、駅の 北口の ほうが いいです。" },
              { speaker: "M", text: "わかりました。じゃあ、北口で。" }
            ],
            explain: "女の人の提案で「駅の北口」で会うことになった。"
          },
          {
            situation: "女の人と 男の人が 話して います。女の人は 旅行に 何で 行きますか。",
            question: "女の人は 旅行に 何で 行きますか。",
            options: ["新幹線", "車", "飛行機", "バス"],
            lines: [
              { speaker: "M", text: "今度の 旅行、飛行機で 行くんですか。" },
              { speaker: "F", text: "いいえ、飛行機は 高いので、新幹線で 行きます。" },
              { speaker: "M", text: "車のほうが 安いかも しれませんよ。" },
              { speaker: "F", text: "でも、運転が 疲れるので、新幹線に します。" }
            ],
            explain: "女の人は「新幹線で行きます」と言っている。"
          },
          {
            situation: "店で 女の人と 店員が 話して います。女の人は 何色の かばんを 買いますか。",
            question: "女の人は 何色の かばんを 買いますか。",
            options: ["青", "赤", "黒", "白"],
            lines: [
              { speaker: "F", text: "この かばん、赤は ありますか。" },
              { speaker: "M", text: "申し訳ありません、赤は ありません。青と 黒なら ございます。" },
              { speaker: "F", text: "そうですか…じゃあ、青を ください。黒は もう 持って いるので。" }
            ],
            explain: "赤がなく、黒は持っているので、女の人は「青をください」と言っている。"
          },
          {
            situation: "男の人と 女の人が 話して います。男の人は どうして 傘を 買いませんでしたか。",
            question: "男の人は どうして 傘を 買いませんでしたか。",
            options: ["お金が 足りなかったから", "傘が 高かったから", "雨が やんだから", "傘を 持って いたから"],
            lines: [
              { speaker: "F", text: "あれ、傘は 買わなかったんですか。" },
              { speaker: "M", text: "うん、買おうと 思ったんだけど、財布に お金が あまり なくて。" },
              { speaker: "F", text: "そうだったんだ。じゃあ、私のを 貸すよ。" }
            ],
            explain: "男の人は「財布にお金があまりなくて」買えなかったと言っている。"
          },
          {
            situation: "店で 客と 店員が 話して います。客は 全部で いくら 払いますか。",
            question: "客は 全部で いくら 払いますか。",
            options: ["800円", "500円", "1000円", "300円"],
            lines: [
              { speaker: "F", text: "コーヒーが 300円、ケーキが 500円です。" },
              { speaker: "M", text: "じゃあ、両方 ください。全部で いくらですか。" },
              { speaker: "F", text: "800円に なります。" }
            ],
            explain: "コーヒー300円とケーキ500円で、合計800円。"
          }
        ]
      },
      {
        type: "utterance-expression",
        name: "問題3 発話表現",
        instruction: "（絵の代わりに 場面の 説明を 読んで ください。）正しい 文を 一つ えらんで ください。",
        items: [
          {
            scene: "朝、学校で 先生に 会いました。何と 言いますか。",
            options: [
              { speaker: "N", text: "おはようございます。" },
              { speaker: "N", text: "おやすみなさい。" },
              { speaker: "N", text: "はじめまして。" }
            ],
            correctIndex: 0,
            explain: "朝のあいさつは「おはようございます」。"
          },
          {
            scene: "レストランで 食事が 終わりました。お金を 払いたいです。店員に 何と 言いますか。",
            options: [
              { speaker: "N", text: "いらっしゃいませ。" },
              { speaker: "N", text: "お会計を お願いします。" },
              { speaker: "N", text: "いってきます。" }
            ],
            correctIndex: 1,
            explain: "支払いをするときは「お会計をお願いします」。"
          },
          {
            scene: "込んだ 電車の中で、前の 人に ぶつかりました。何と 言いますか。",
            options: [
              { speaker: "N", text: "ありがとうございます。" },
              { speaker: "N", text: "どういたしまして。" },
              { speaker: "N", text: "あ、すみません。" }
            ],
            correctIndex: 2,
            explain: "人にぶつかったら「すみません」と謝る。"
          },
          {
            scene: "友だちの 荷物が 重そうです。手伝いたいです。何と 言いますか。",
            options: [
              { speaker: "N", text: "手伝って くれますか。" },
              { speaker: "N", text: "持ちましょうか。" },
              { speaker: "N", text: "お邪魔します。" }
            ],
            correctIndex: 1,
            explain: "相手を手伝うと申し出るとき「持ちましょうか」。「手伝ってくれますか」は自分が頼むときの言い方。"
          },
          {
            scene: "先生に わからない ところを 質問したいです。何と 言いますか。",
            options: [
              { speaker: "N", text: "先生、ここが わからないので、教えて いただけますか。" },
              { speaker: "N", text: "先生、さようなら。" },
              { speaker: "N", text: "先生、いただきます。" }
            ],
            correctIndex: 0,
            explain: "質問したいときは「教えていただけますか」と丁寧に頼む。"
          }
        ]
      },
      {
        type: "quick-response",
        name: "問題4 即時応答",
        instruction: "みじかい 文を 聞いて、1から3の 中から、いちばん いい ものを 一つ えらんで ください。",
        items: [
          {
            stimulus: { speaker: "F", text: "この 資料、コピーして くれる?" },
            options: [
              { speaker: "M", text: "はい、すぐ やります。" },
              { speaker: "M", text: "いいえ、コピーは ここです。" },
              { speaker: "M", text: "はい、資料を 読みました。" }
            ],
            correctIndex: 0,
            explain: "依頼への返事は「はい、すぐやります」。"
          },
          {
            stimulus: { speaker: "M", text: "お誕生日、おめでとうございます。" },
            options: [
              { speaker: "F", text: "お大事に。" },
              { speaker: "F", text: "ありがとうございます。" },
              { speaker: "F", text: "いってらっしゃい。" }
            ],
            correctIndex: 1,
            explain: "お祝いの言葉には「ありがとうございます」と答える。"
          },
          {
            stimulus: { speaker: "F", text: "すみません、この ペン、借りても いいですか。" },
            options: [
              { speaker: "M", text: "いいえ、貸して ください。" },
              { speaker: "M", text: "はい、借ります。" },
              { speaker: "M", text: "ええ、どうぞ。" }
            ],
            correctIndex: 2,
            explain: "貸してと頼まれたら「ええ、どうぞ」と答える。"
          },
          {
            stimulus: { speaker: "M", text: "週末、どこか 行きましたか。" },
            options: [
              { speaker: "F", text: "はい、海に 行きました。" },
              { speaker: "F", text: "はい、行きましょう。" },
              { speaker: "F", text: "いいえ、明日 行きます。" }
            ],
            correctIndex: 0,
            explain: "過去のことを聞かれたので「海に行きました」と過去形で答える。"
          },
          {
            stimulus: { speaker: "F", text: "手伝ってくれて、ありがとう。" },
            options: [
              { speaker: "M", text: "すみませんでした。" },
              { speaker: "M", text: "いいえ、どういたしまして。" },
              { speaker: "M", text: "はい、お願いします。" }
            ],
            correctIndex: 1,
            explain: "お礼には「どういたしまして」と答える。"
          },
          {
            stimulus: { speaker: "M", text: "この ケーキ、一つ いかがですか。" },
            options: [
              { speaker: "F", text: "いいえ、あります。" },
              { speaker: "F", text: "はい、作りました。" },
              { speaker: "F", text: "ありがとうございます、いただきます。" }
            ],
            correctIndex: 2,
            explain: "食べ物を勧められたら「いただきます」と答える。"
          },
          {
            stimulus: { speaker: "F", text: "明日の 会議は 何時からですか。" },
            options: [
              { speaker: "M", text: "10時からです。" },
              { speaker: "M", text: "会議室です。" },
              { speaker: "M", text: "3人です。" }
            ],
            correctIndex: 0,
            explain: "「何時から」には時刻で答える。"
          },
          {
            stimulus: { speaker: "M", text: "少し 寒いですね。窓を 閉めましょうか。" },
            options: [
              { speaker: "F", text: "いいえ、開けました。" },
              { speaker: "F", text: "はい、お願いします。" },
              { speaker: "F", text: "窓は あちらです。" }
            ],
            correctIndex: 1,
            explain: "「閉めましょうか」という申し出には「はい、お願いします」。"
          }
        ]
      }
    ]
  },
  {
    id: "choukaiC",
    label: "聴解 C",
    mondai: [
      {
        type: "task-comprehension",
        name: "問題1 課題理解",
        instruction: "はなしを 聞いて、質問に 答えて ください。話は 一度だけ 聞きます。それから、正しい 答えを 一つ えらんで ください。",
        items: [
          {
            situation: "教室で 先生と 学生が 話して います。学生は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "テストを 始める前に、机の 上の 本を かばんに しまって ください。" },
              { speaker: "M", text: "先生、鉛筆は 出して おいても いいですか。" },
              { speaker: "F", text: "はい、鉛筆と 消しゴムは 出して おいて ください。まず 本を しまってから、始めましょう。" },
              { speaker: "M", text: "はい、わかりました。" }
            ],
            question: "学生は この あと、まず 何を しますか。",
            options: ["本を かばんに しまう", "鉛筆を 出す", "テストを 始める", "消しゴムを 借りる"],
            explain: "先生が「まず本をしまってから、始めましょう」と言っている。"
          },
          {
            situation: "会社で 男の人と 女の人が 話して います。女の人は 出張に 何を 持って 行きますか。",
            lines: [
              { speaker: "M", text: "明日の 出張、資料は 準備できましたか。" },
              { speaker: "F", text: "はい、資料と 名刺は 用意しました。" },
              { speaker: "M", text: "カメラも 持って 行って ください。写真を 撮る 予定なので。" },
              { speaker: "F", text: "わかりました。カメラも 入れて おきます。" }
            ],
            question: "女の人は 出張に 何を 持って 行きますか。",
            options: ["資料と 名刺と カメラ", "資料と 名刺だけ", "カメラだけ", "資料と カメラ"],
            explain: "資料と名刺は準備済みで、カメラも持って行くことにした。"
          },
          {
            situation: "スーパーで 妻と 夫が 電話で 話して います。妻は 何を 買いますか。",
            lines: [
              { speaker: "F", text: "今 スーパーに いるんだけど、何か 要る?" },
              { speaker: "M", text: "えーと、牛乳と 卵を お願い。" },
              { speaker: "F", text: "牛乳は 家に あるよ。卵だけで いい?" },
              { speaker: "M", text: "あ、そうだった。じゃあ、卵と パンを お願い。" }
            ],
            question: "妻は 何を 買いますか。",
            options: ["卵と パン", "牛乳と 卵", "牛乳と パン", "卵だけ"],
            explain: "牛乳は家にあるので、夫は「卵とパン」を頼んだ。"
          },
          {
            situation: "家で 母と 息子が 話して います。息子は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "健、お客さんが 来る前に、部屋を 掃除して。" },
              { speaker: "M", text: "うん。あ、その前に ゴミを 出して こようか?" },
              { speaker: "F", text: "ゴミは あとで いいから、先に 部屋を お願い。" },
              { speaker: "M", text: "わかった。じゃあ 先に 掃除するね。" }
            ],
            question: "息子は この あと、まず 何を しますか。",
            options: ["部屋を 掃除する", "ゴミを 出す", "お客さんを 迎える", "料理を する"],
            explain: "母が「先に部屋をお願い」と言い、息子も「先に掃除するね」と答えている。"
          },
          {
            situation: "歯医者で 受付の人と 男の人が 話して います。男の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "こんにちは。今日は どう されましたか。" },
              { speaker: "M", text: "歯が 痛くて。予約は して いないんですが。" },
              { speaker: "F", text: "わかりました。初めての 方なので、まず この 用紙に 記入して ください。そのあと、お呼びします。" },
              { speaker: "M", text: "はい、書きます。" }
            ],
            question: "男の人は この あと、まず 何を しますか。",
            options: ["用紙に 記入する", "歯を 見せる", "予約を する", "お金を 払う"],
            explain: "受付の人が「まずこの用紙に記入してください」と言っている。"
          },
          {
            situation: "駅で 男の人が 駅員に 聞いて います。男の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "M", text: "すみません、この 電車は 東京駅に 止まりますか。" },
              { speaker: "F", text: "いいえ、これは 急行なので、東京駅には 止まりません。次の 各駅停車に お乗り ください。" },
              { speaker: "M", text: "そうですか。じゃあ、この 電車を 降ります。" },
              { speaker: "F", text: "はい、この駅で 降りて、3番線で お待ち ください。" }
            ],
            question: "男の人は この あと、まず 何を しますか。",
            options: ["電車を 降りる", "東京駅で 降りる", "急行に 乗る", "切符を 買う"],
            explain: "駅員が「この駅で降りて」と案内し、男の人も「この電車を降ります」と言っている。"
          },
          {
            situation: "スポーツジムで 係の人と 女の人が 話して います。女の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "M", text: "初めての 方は、まず 中で 運動用の 靴に 履き替えて ください。" },
              { speaker: "F", text: "あ、運動用の 靴を 持って 来て いません。" },
              { speaker: "M", text: "それでしたら、受付で 貸し出しの 靴を 借りて ください。それから 中に 入れます。" },
              { speaker: "F", text: "わかりました。じゃあ、靴を 借りますね。" }
            ],
            question: "女の人は この あと、まず 何を しますか。",
            options: ["靴を 借りる", "会員カードを 作る", "運動を する", "靴を 履き替える"],
            explain: "運動用の靴がないので、係の人が「受付で靴を借りてください」と言い、女の人も「靴を借りますね」と答えている。"
          },
          {
            situation: "銀行で 係の人と 男の人が 話して います。男の人は この あと、まず 何を しますか。",
            lines: [
              { speaker: "F", text: "口座を 作りたいということですね。印鑑は お持ちですか。" },
              { speaker: "M", text: "はい、持って います。" },
              { speaker: "F", text: "ありがとうございます。では、まず あちらの 機械で 番号札を 取って、お待ち ください。" },
              { speaker: "M", text: "わかりました。番号札ですね。" }
            ],
            question: "男の人は この あと、まず 何を しますか。",
            options: ["番号札を 取る", "印鑑を 出す", "口座を 作る", "お金を 預ける"],
            explain: "係の人が「まず機械で番号札を取って」と言っている。"
          }
        ]
      },
      {
        type: "point-comprehension",
        name: "問題2 ポイント理解",
        instruction: "はじめに 質問を 聞いて ください。それから 話を 聞いて、正しい 答えを 一つ えらんで ください。",
        items: [
          {
            situation: "女の人と 男の人が 話して います。男の人は どうして パーティーに 行きませんか。",
            question: "男の人は どうして パーティーに 行きませんか。",
            options: ["仕事が あるから", "体調が 悪いから", "お金が ないから", "興味が ないから"],
            lines: [
              { speaker: "F", text: "土曜日の パーティー、来ますよね?" },
              { speaker: "M", text: "行きたいんですが、その日は 仕事が 入って いて。" },
              { speaker: "F", text: "そうですか、残念ですね。" },
              { speaker: "M", text: "ええ、また 今度 誘って ください。" }
            ],
            explain: "男の人は「その日は仕事が入っていて」行けないと言っている。"
          },
          {
            situation: "駅で アナウンスが 流れて います。次の 電車は 何時に 出ますか。",
            question: "次の 電車は 何時に 出ますか。",
            options: ["9時 15分", "9時", "9時 5分", "9時 50分"],
            lines: [
              { speaker: "F", text: "お待たせして います。9時発の 電車は、遅れて います。次の 電車は 9時 15分に 出発します。" },
              { speaker: "M", text: "え、9時じゃ ないの?" },
              { speaker: "F", text: "はい、9時 15分に 変わりました。" }
            ],
            explain: "「次の電車は9時15分に出発します」と言っている。"
          },
          {
            situation: "男の人と 女の人が 話して います。車の かぎは どこに ありますか。",
            question: "車の かぎは どこに ありますか。",
            options: ["机の 引き出しの 中", "机の 上", "かばんの 中", "ポケットの 中"],
            lines: [
              { speaker: "M", text: "あれ、車の かぎが ない。机の 上に 置いたと 思うんだけど。" },
              { speaker: "F", text: "机の 上には ないよ。引き出しの 中を 見た?" },
              { speaker: "M", text: "あ、あった。引き出しの 中に あったよ。" }
            ],
            explain: "かぎは「引き出しの中にあった」。"
          },
          {
            situation: "レストランで 男の人と 女の人が 話して います。女の人は 何を 注文しましたか。",
            question: "女の人は 何を 注文しましたか。",
            options: ["紅茶", "コーヒー", "ジュース", "水"],
            lines: [
              { speaker: "M", text: "僕は コーヒーに するけど、君は?" },
              { speaker: "F", text: "私は…コーヒーは 夜 眠れなく なるから、紅茶に する。" },
              { speaker: "M", text: "じゃあ、コーヒー 一つと 紅茶 一つですね。" }
            ],
            explain: "女の人は「紅茶にする」と言っている。"
          },
          {
            situation: "女の人と 男の人が 話して います。女の人は 誰と 映画に 行きますか。",
            question: "女の人は 誰と 映画に 行きますか。",
            options: ["妹", "友だち", "母", "一人"],
            lines: [
              { speaker: "M", text: "週末、友だちと 映画に 行くんですか。" },
              { speaker: "F", text: "友だちと 行く 予定でしたが、都合が 悪く なって。今回は 妹と 行きます。" },
              { speaker: "M", text: "そうですか、楽しんで きて ください。" }
            ],
            explain: "友だちの都合が悪くなり、女の人は「妹と行きます」と言っている。"
          },
          {
            situation: "テレビで 天気予報を 話して います。明日の 午後は どんな 天気ですか。",
            question: "明日の 午後は どんな 天気ですか。",
            options: ["雨", "晴れ", "くもり", "雪"],
            lines: [
              { speaker: "F", text: "明日の お天気です。午前中は 晴れますが、午後からは 雨が 降るでしょう。" },
              { speaker: "M", text: "一日中 晴れじゃ ないんですね。" },
              { speaker: "F", text: "はい、午後は 傘が 必要です。" }
            ],
            explain: "「午後からは雨が降るでしょう」と言っている。"
          },
          {
            situation: "店で 客と 店員が 話して います。客は いくら 払いますか。",
            question: "客は いくら 払いますか。",
            options: ["900円", "1000円", "800円", "1100円"],
            lines: [
              { speaker: "M", text: "この シャツは 1000円です。" },
              { speaker: "F", text: "今日は 安く なって いますか。" },
              { speaker: "M", text: "はい、100円 割引で、900円です。" }
            ],
            explain: "1000円から100円引きで900円。"
          }
        ]
      },
      {
        type: "utterance-expression",
        name: "問題3 発話表現",
        instruction: "（絵の代わりに 場面の 説明を 読んで ください。）正しい 文を 一つ えらんで ください。",
        items: [
          {
            scene: "初めて 会う 人に 自己紹介を します。何と 言いますか。",
            options: [
              { speaker: "N", text: "はじめまして、田中です。どうぞ よろしく。" },
              { speaker: "N", text: "おかえりなさい。" },
              { speaker: "N", text: "お疲れさまでした。" }
            ],
            correctIndex: 0,
            explain: "初対面のあいさつは「はじめまして、よろしく」。"
          },
          {
            scene: "友だちの 発表が とても よかったです。何と 言いますか。",
            options: [
              { speaker: "N", text: "お大事に。" },
              { speaker: "N", text: "ごめんなさい。" },
              { speaker: "N", text: "すごく よかったよ。おめでとう。" }
            ],
            correctIndex: 2,
            explain: "よい発表をほめるとき「よかったよ、おめでとう」と言う。"
          },
          {
            scene: "道が わからなくて 困って います。近くの 人に 聞きます。何と 言いますか。",
            options: [
              { speaker: "N", text: "いってらっしゃい。" },
              { speaker: "N", text: "すみません、駅は どちらですか。" },
              { speaker: "N", text: "お邪魔します。" }
            ],
            correctIndex: 1,
            explain: "道を尋ねるとき「すみません、駅はどちらですか」と聞く。"
          },
          {
            scene: "友だちに 消しゴムを 借りたいです。何と 言いますか。",
            options: [
              { speaker: "N", text: "消しゴムを 貸して くれない?" },
              { speaker: "N", text: "消しゴムを 貸そうか?" },
              { speaker: "N", text: "消しゴムは いかがですか?" }
            ],
            correctIndex: 0,
            explain: "自分が借りたいときは「貸してくれない?」と頼む。"
          },
          {
            scene: "会社を 出ます。まだ 働いて いる 人に 何と 言いますか。",
            options: [
              { speaker: "N", text: "いってきます。" },
              { speaker: "N", text: "ただいま。" },
              { speaker: "N", text: "お先に 失礼します。" }
            ],
            correctIndex: 2,
            explain: "先に帰るとき「お先に失礼します」と言う。"
          }
        ]
      },
      {
        type: "quick-response",
        name: "問題4 即時応答",
        instruction: "みじかい 文を 聞いて、1から3の 中から、いちばん いい ものを 一つ えらんで ください。",
        items: [
          {
            stimulus: { speaker: "F", text: "もう 昼ご飯は 食べましたか。" },
            options: [
              { speaker: "M", text: "いいえ、まだです。" },
              { speaker: "M", text: "はい、食べません。" },
              { speaker: "M", text: "いいえ、食べました。" }
            ],
            correctIndex: 0,
            explain: "まだ食べていないなら「いいえ、まだです」。"
          },
          {
            stimulus: { speaker: "M", text: "すみません、写真を 撮って もらえますか。" },
            options: [
              { speaker: "F", text: "いいえ、撮りました。" },
              { speaker: "F", text: "はい、撮って ください。" },
              { speaker: "F", text: "はい、いいですよ。" }
            ],
            correctIndex: 2,
            explain: "頼まれたら「はい、いいですよ」と引き受ける。"
          },
          {
            stimulus: { speaker: "F", text: "今日は 暑いですね。" },
            options: [
              { speaker: "M", text: "いいえ、涼しいです。" },
              { speaker: "M", text: "そうですね、本当に 暑いです。" },
              { speaker: "M", text: "はい、寒いですね。" }
            ],
            correctIndex: 1,
            explain: "同意するとき「そうですね、本当に暑いです」。"
          },
          {
            stimulus: { speaker: "M", text: "駅まで どのくらい かかりますか。" },
            options: [
              { speaker: "F", text: "歩いて 10分ぐらいです。" },
              { speaker: "F", text: "駅は あちらです。" },
              { speaker: "F", text: "電車で 行きます。" }
            ],
            correctIndex: 0,
            explain: "「どのくらいかかるか」には時間で答える。"
          },
          {
            stimulus: { speaker: "F", text: "この 席、座っても いいですか。" },
            options: [
              { speaker: "M", text: "いいえ、座りました。" },
              { speaker: "M", text: "はい、座りません。" },
              { speaker: "M", text: "ええ、どうぞ。" }
            ],
            correctIndex: 2,
            explain: "「座ってもいいか」には「ええ、どうぞ」。"
          },
          {
            stimulus: { speaker: "M", text: "だいぶ 遅く なったので、そろそろ 帰りませんか。" },
            options: [
              { speaker: "F", text: "いいえ、帰りました。" },
              { speaker: "F", text: "そうですね、帰りましょう。" },
              { speaker: "F", text: "はい、来ました。" }
            ],
            correctIndex: 1,
            explain: "「帰りませんか」の誘いに「そうですね、帰りましょう」。"
          },
          {
            stimulus: { speaker: "F", text: "お茶と コーヒー、どちらが いいですか。" },
            options: [
              { speaker: "M", text: "コーヒーを お願いします。" },
              { speaker: "M", text: "はい、そうです。" },
              { speaker: "M", text: "どちらも 行きます。" }
            ],
            correctIndex: 0,
            explain: "どちらがいいか聞かれたら一つ選んで答える。"
          },
          {
            stimulus: { speaker: "M", text: "先週の 旅行は どうでしたか。" },
            options: [
              { speaker: "F", text: "来週 行きます。" },
              { speaker: "F", text: "はい、行きましょう。" },
              { speaker: "F", text: "とても 楽しかったです。" }
            ],
            correctIndex: 2,
            explain: "感想を聞かれたので「とても楽しかったです」と答える。"
          }
        ]
      }
    ]
  }
];

if (typeof module !== "undefined" && module.exports) module.exports = { CHOUKAI_SIM };
