package com.hafizulrifkihawari.jpflashcard

import android.content.Context
import org.json.JSONArray
import java.io.BufferedReader
import java.io.InputStreamReader
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

/** Mirrors kotd-data.js's `example: { jp, reading, meaning }`. */
data class KotdExample(val jp: String, val reading: String, val meaning: String)

/**
 * Mirrors kotd-data.js's RAW entry shape. `single` entries use kanji/onyomi/
 * kunyomi; `compound` entries use word/reading/parts — fields not applicable
 * to a given `type` are null, matching the JS source's duck-typing rather
 * than splitting into two exclusive types.
 */
data class KotdEntry(
    val id: Int,
    val type: String,
    val kanji: String?,
    val word: String?,
    val onyomi: String?,
    val kunyomi: String?,
    val reading: String?,
    val meaning: String,
    val meaningEn: String,
    val level: String,
    val example: KotdExample,
    val parts: List<Int>?
)

/** How many entries are featured per day. Must match kotd.js's KOTD_DAILY_COUNT (3). */
const val KOTD_DAILY_COUNT = 3

private const val DAY_MS = 24L * 60 * 60 * 1000

/** Same UTC "YYYY-MM-DD" stamp as srs.js's todayStamp(). */
fun todayStampUtc(now: Instant = Instant.now()): String =
    DateTimeFormatter.ISO_LOCAL_DATE.withZone(ZoneOffset.UTC).format(now)

/**
 * Epoch-day index for a UTC midnight, matching kotd.js's
 * `Math.floor(Date.parse(stamp + "T00:00:00Z") / DAY_MS)`.
 */
fun dayIndexFor(stamp: String): Long {
    val midnightUtcMillis = Instant.parse("${stamp}T00:00:00Z").toEpochMilli()
    return Math.floorDiv(midnightUtcMillis, DAY_MS)
}

/**
 * Deterministic per-UTC-day picker — a literal port of kotd.js's pickDaily().
 * Intentionally uses plain (non floor-adjusted) `%` to mirror the JS exactly;
 * dayIndex is always positive for any real calendar date, so this doesn't
 * need JS's negative-modulo caveats. See kotd.js for the original.
 */
fun <T> pickDaily(list: List<T>, count: Int, stamp: String): List<T> {
    val n = list.size
    if (n == 0) return emptyList()
    val c = minOf(count, n)
    val dayIndex = dayIndexFor(stamp)
    val start = ((dayIndex * c) % n).toInt()
    return (0 until c).map { list[(start + it) % n] }
}

fun loadRawFromAssets(context: Context): List<KotdEntry> {
    val text = context.assets.open("kotd-data.json").use { stream ->
        BufferedReader(InputStreamReader(stream, Charsets.UTF_8)).readText()
    }
    val arr = JSONArray(text)
    val out = ArrayList<KotdEntry>(arr.length())
    for (i in 0 until arr.length()) {
        val o = arr.getJSONObject(i)
        val ex = o.getJSONObject("example")
        val parts = if (o.has("parts") && !o.isNull("parts")) {
            val partsArr = o.getJSONArray("parts")
            (0 until partsArr.length()).map { partsArr.getInt(it) }
        } else null
        fun optNullableString(key: String): String? = if (o.has(key) && !o.isNull(key)) o.getString(key) else null

        out.add(
            KotdEntry(
                id = o.getInt("id"),
                type = o.getString("type"),
                kanji = optNullableString("kanji"),
                word = optNullableString("word"),
                onyomi = optNullableString("onyomi"),
                kunyomi = optNullableString("kunyomi"),
                reading = optNullableString("reading"),
                meaning = o.getString("meaning"),
                meaningEn = o.getString("meaningEn"),
                level = o.getString("level"),
                example = KotdExample(ex.getString("jp"), ex.getString("reading"), ex.getString("meaning")),
                parts = parts
            )
        )
    }
    return out
}

fun buildIndex(list: List<KotdEntry>): Map<Int, KotdEntry> = list.associateBy { it.id }

/** Convenience for the widget: today's featured entry (index 0 of the day's picks). */
fun todaysFeaturedEntry(context: Context): KotdEntry? {
    val raw = loadRawFromAssets(context)
    val picks = pickDaily(raw, KOTD_DAILY_COUNT, todayStampUtc())
    return picks.firstOrNull()
}
