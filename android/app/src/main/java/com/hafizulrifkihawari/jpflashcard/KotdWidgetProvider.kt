package com.hafizulrifkihawari.jpflashcard

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class KotdWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        renderAll(context, appWidgetManager, appWidgetIds)
        KotdMidnightAlarm.scheduleNext(context)
    }

    override fun onEnabled(context: Context) {
        KotdMidnightAlarm.scheduleNext(context)
    }

    override fun onDisabled(context: Context) {
        KotdMidnightAlarm.cancel(context)
    }

    companion object {
        /** Shared by onUpdate() and KotdMidnightAlarmReceiver so both render identically. */
        fun renderAll(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
            val entry = todaysFeaturedEntry(context) ?: return
            for (widgetId in appWidgetIds) {
                appWidgetManager.updateAppWidget(widgetId, buildRemoteViews(context, entry))
            }
        }

        fun updateAllInstances(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(ComponentName(context, KotdWidgetProvider::class.java))
            if (ids.isNotEmpty()) renderAll(context, manager, ids)
        }

        private fun buildRemoteViews(context: Context, k: KotdEntry): RemoteViews {
            val views = RemoteViews(context.packageName, R.layout.kotd_widget_layout)

            val headline = if (k.type == "compound") k.word else k.kanji
            val readingLine = if (k.type == "compound") {
                "読み ${k.reading}"
            } else {
                listOfNotNull(
                    k.onyomi?.takeIf { it.isNotEmpty() }?.let { "音 $it" },
                    k.kunyomi?.takeIf { it.isNotEmpty() }?.let { "訓 $it" }
                ).joinToString("   ")
            }

            views.setTextViewText(R.id.kotd_widget_headline, headline ?: "")
            views.setTextViewText(R.id.kotd_widget_reading, readingLine)
            views.setTextViewText(R.id.kotd_widget_meaning, "${k.meaning} (${k.meaningEn})")
            views.setTextViewText(R.id.kotd_widget_example_jp, k.example.jp)
            views.setTextViewText(R.id.kotd_widget_example_reading, k.example.reading)

            // Speaker button: PendingIntent -> KotdSpeakReceiver, carrying the
            // sentence text directly so it's spoken exactly what's on screen
            // (no re-running pickDaily in the receiver, no drift possible).
            val speakIntent = Intent(context, KotdSpeakReceiver::class.java).apply {
                action = KotdSpeakReceiver.ACTION_SPEAK
                putExtra(KotdSpeakReceiver.EXTRA_TEXT, k.example.jp)
                // Unique data URI so each widget instance's PendingIntent isn't
                // collapsed into one by the system (extras alone aren't enough).
                data = android.net.Uri.parse("kotdspeak://${k.id}")
            }
            val speakPendingIntent = PendingIntent.getBroadcast(
                context, k.id, speakIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.kotd_widget_speak_btn, speakPendingIntent)

            return views
        }
    }
}
