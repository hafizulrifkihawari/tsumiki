import Foundation

/// Mirrors kotd-data.js's `example: { jp, reading, meaning }`.
struct KotdExample: Codable {
    let jp: String
    let reading: String
    let meaning: String
}

/// Mirrors kotd-data.js's RAW entry shape. `single` entries use kanji/onyomi/
/// kunyomi; `compound` entries use word/reading/parts — fields that don't
/// apply to a given `type` are nil, matching the JS source's duck-typing
/// rather than splitting into two exclusive types.
struct KotdEntry: Codable {
    let id: Int
    let type: String
    let kanji: String?
    let word: String?
    let onyomi: String?
    let kunyomi: String?
    let reading: String?
    let meaning: String
    let meaningEn: String
    let level: String
    let example: KotdExample
    let parts: [Int]?
}

/// How many entries are featured per day. Must match kotd.js's KOTD_DAILY_COUNT (3).
let kotdDailyCount = 3

private let dayMs: Double = 24 * 60 * 60 * 1000

/// Same UTC "YYYY-MM-DD" stamp as srs.js's todayStamp(). `en_US_POSIX` is
/// required here — without a fixed locale, DateFormatter parsing/formatting
/// can behave unexpectedly under some device locale/calendar settings (a
/// real iOS gotcha with no JS equivalent, since Date.parse isn't
/// locale-sensitive).
func todayStampUTC(_ now: Date = Date()) -> String {
    let f = DateFormatter()
    f.dateFormat = "yyyy-MM-dd"
    f.timeZone = TimeZone(identifier: "UTC")
    f.locale = Locale(identifier: "en_US_POSIX")
    return f.string(from: now)
}

private func utcStampFormatter() -> DateFormatter {
    let f = DateFormatter()
    f.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    f.timeZone = TimeZone(identifier: "UTC")
    f.locale = Locale(identifier: "en_US_POSIX")
    return f
}

/// UTC midnight Date for a "YYYY-MM-DD" stamp.
func utcMidnight(forStamp stamp: String) -> Date {
    utcStampFormatter().date(from: "\(stamp)T00:00:00Z")!
}

/// Epoch-day index for a UTC midnight, matching kotd.js's
/// `Math.floor(Date.parse(stamp + "T00:00:00Z") / DAY_MS)`.
func dayIndex(forStamp stamp: String) -> Int {
    Int(floor(utcMidnight(forStamp: stamp).timeIntervalSince1970 * 1000 / dayMs))
}

/// Deterministic per-UTC-day picker — a literal port of kotd.js's pickDaily().
func pickDaily<T>(_ list: [T], _ count: Int, _ stamp: String) -> [T] {
    let n = list.count
    if n == 0 { return [] }
    let c = min(count, n)
    let di = dayIndex(forStamp: stamp)
    let start = (di * c) % n
    return (0..<c).map { list[(start + $0) % n] }
}

enum KotdData {
    /// Loads and decodes the bundled kotd-data.json (added as a resource of
    /// the KotdWidgetExtension target specifically).
    static func loadAll() -> [KotdEntry] {
        guard let url = Bundle.main.url(forResource: "kotd-data", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let entries = try? JSONDecoder().decode([KotdEntry].self, from: data) else {
            return []
        }
        return entries
    }

    /// Today's featured entry (index 0 of the day's picks), for a given stamp.
    static func featuredEntry(forStamp stamp: String, in all: [KotdEntry]) -> KotdEntry? {
        pickDaily(all, kotdDailyCount, stamp).first
    }
}
