package com.hafizulrifkihawari.jpflashcard

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Cross-checks pickDaily()'s Kotlin port against the same computation done
 * directly from kotd.js/kotd-data.js in Node (see the plan's Stage F
 * verification step). A mismatch here means the widget would silently show
 * a different word than the web app on a given day, with no visible error —
 * this is the most important correctness check for the whole feature.
 *
 * Expected ids were generated with:
 *   node -e "... pickDaily(RAW, 3, stamp)[0].id ..."
 * against the real kotd-data.js, not hand-computed.
 */
class KotdPickerTest {

    // A tiny fixture list is enough to test the pure day-index/modulo math in
    // isolation without needing to load the real 227-entry dataset here.
    private fun list(n: Int): List<Int> = (0 until n).toList()

    @Test
    fun pickDaily_matchesJsAlgorithm_onFixtureList() {
        // n=10, count=3: dayIndex for 2026-08-28 is 20693 (epoch-day count),
        // so start = (20693*3) % 10 = 62079 % 10 = 9.
        assertEquals(20693L, dayIndexFor("2026-08-28"))
        assertEquals(listOf(9, 0, 1), pickDaily(list(10), 3, "2026-08-28"))
    }

    @Test
    fun pickDaily_matchesRealKotdDataJs_forSeveralDates() {
        val raw = loadRawFromAssetsFixture()
        val expected = mapOf(
            "2024-01-01" to 150,
            "2026-01-01" to 73,
            "2026-08-28" to 109,
            "2027-03-15" to 25,
            "2030-12-31" to 100,
            "1970-01-02" to 4
        )
        for ((stamp, expectedId) in expected) {
            val actual = pickDaily(raw, KOTD_DAILY_COUNT, stamp).first().id
            assertEquals("mismatch for $stamp", expectedId, actual)
        }
    }

    // Loads the same bundled JSON the widget itself reads, via a plain file
    // read (no Android Context available in a JVM unit test).
    private fun loadRawFromAssetsFixture(): List<KotdEntry> {
        val file = java.io.File("src/main/assets/kotd-data.json")
        val text = file.readText(Charsets.UTF_8)
        val arr = org.json.JSONArray(text)
        val out = ArrayList<KotdEntry>(arr.length())
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            val ex = o.getJSONObject("example")
            fun optNullableString(key: String): String? = if (o.has(key) && !o.isNull(key)) o.getString(key) else null
            val parts = if (o.has("parts") && !o.isNull("parts")) {
                val partsArr = o.getJSONArray("parts")
                (0 until partsArr.length()).map { partsArr.getInt(it) }
            } else null
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
}
