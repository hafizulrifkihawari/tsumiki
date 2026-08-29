import WidgetKit
import SwiftUI

/// How many days ahead to pre-compute timeline entries for. iOS only invokes
/// getTimeline() a limited, system-controlled number of times per day, so a
/// forward window (rather than one entry + policy: .never) is what actually
/// keeps the widget correct across a UTC midnight rollover without depending
/// on the app being opened.
private let timelineWindowDays = 8

struct SimpleEntry: TimelineEntry {
    let date: Date
    let kotd: KotdEntry?
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), kotd: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let all = KotdData.loadAll()
        let stamp = todayStampUTC()
        completion(SimpleEntry(date: Date(), kotd: KotdData.featuredEntry(forStamp: stamp, in: all)))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let all = KotdData.loadAll()
        var entries: [SimpleEntry] = []
        for offset in 0..<timelineWindowDays {
            let stamp = todayStampUTC(Date().addingTimeInterval(Double(offset) * 86400))
            let entry = KotdData.featuredEntry(forStamp: stamp, in: all)
            entries.append(SimpleEntry(date: utcMidnight(forStamp: stamp), kotd: entry))
        }
        let nextStamp = todayStampUTC(Date().addingTimeInterval(86400))
        let policy: TimelineReloadPolicy = .after(utcMidnight(forStamp: nextStamp))
        completion(Timeline(entries: entries, policy: policy))
    }
}

struct KotdWidgetExtensionEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        if let k = entry.kotd {
            VStack(alignment: .leading, spacing: 4) {
                Text(k.type == "compound" ? (k.word ?? "") : (k.kanji ?? ""))
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(.primary)

                Text(readingLine(for: k))
                    .font(.caption)
                    .foregroundColor(.secondary)

                Text("\(k.meaning) (\(k.meaningEn))")
                    .font(.footnote)
                    .italic()
                    .foregroundColor(.secondary)

                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(k.example.jp)
                            .font(.caption)
                            .lineLimit(2)
                        Text(k.example.reading)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }
                    Spacer()
                    // Only this glyph auto-speaks on tap — WidgetKit extensions
                    // can't play audio themselves (Apple platform restriction),
                    // so this deep-links into the app, which plays it via the
                    // existing Web Speech API TTS pattern (kotd.js). The rest
                    // of the card uses the plain widgetURL below (opens the
                    // app without auto-playing).
                    Link(destination: speakURL(for: k)) {
                        Image(systemName: "speaker.wave.2.fill")
                            .foregroundColor(.white)
                            .padding(6)
                            .background(Circle().fill(Color.accentColor))
                    }
                }
                .padding(8)
                .background(RoundedRectangle(cornerRadius: 10).fill(Color(.secondarySystemBackground)))
            }
            .padding()
            .widgetURL(URL(string: "jpflashcard://kotd"))
        } else {
            Text("今日 Open the app to sync")
                .font(.footnote)
                .padding()
        }
    }

    private func readingLine(for k: KotdEntry) -> String {
        if k.type == "compound" {
            return "読み \(k.reading ?? "")"
        }
        return [k.onyomi.flatMap { $0.isEmpty ? nil : "音 \($0)" }, k.kunyomi.flatMap { $0.isEmpty ? nil : "訓 \($0)" }]
            .compactMap { $0 }
            .joined(separator: "   ")
    }

    private func speakURL(for k: KotdEntry) -> URL {
        URL(string: "jpflashcard://kotd/speak?id=\(k.id)") ?? URL(string: "jpflashcard://kotd")!
    }
}

@main
struct KotdWidgetExtension: Widget {
    let kind: String = "KotdWidgetExtension"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            KotdWidgetExtensionEntryView(entry: entry)
                .containerBackground(.background, for: .widget)
        }
        .configurationDisplayName("今日の言葉 KOTD")
        .description("Today's featured kanji/word with its example sentence — tap the speaker to hear it.")
        .supportedFamilies([.systemMedium])
    }
}
