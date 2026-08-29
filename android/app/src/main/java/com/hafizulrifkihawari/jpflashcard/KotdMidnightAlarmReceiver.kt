package com.hafizulrifkihawari.jpflashcard

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import java.time.Instant

/**
 * Fires once at the next UTC midnight, updates every active KOTD widget
 * instance, and reschedules itself for the following midnight.
 *
 * `updatePeriodMillis` in kotd_widget_info.xml (30 min) is a backstop for
 * when this alarm is delayed or denied exact scheduling — see
 * KotdMidnightAlarm.scheduleNext() for why exact timing isn't guaranteed.
 */
class KotdMidnightAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        KotdWidgetProvider.updateAllInstances(context)
        KotdMidnightAlarm.scheduleNext(context)
    }
}

object KotdMidnightAlarm {
    private const val REQUEST_CODE = 1001

    private fun pendingIntent(context: Context): PendingIntent {
        val intent = Intent(context, KotdMidnightAlarmReceiver::class.java)
        return PendingIntent.getBroadcast(
            context, REQUEST_CODE, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun nextUtcMidnightMillis(): Long {
        val today = todayStampUtc()
        val todayMidnight = Instant.parse("${today}T00:00:00Z").toEpochMilli()
        return todayMidnight + 24L * 60 * 60 * 1000
    }

    /**
     * Schedules (idempotent — cancels any existing alarm first) the update for
     * the next UTC midnight. Exact alarms (API 31+) require the user-granted
     * SCHEDULE_EXACT_ALARM permission, which a flashcards app won't
     * auto-qualify for (that's reserved for alarm/calendar apps) — so this
     * falls back to inexact-while-idle scheduling when exact isn't grantable.
     * Either way, the 30-min updatePeriodMillis backstop bounds the staleness.
     */
    fun scheduleNext(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val triggerAt = nextUtcMidnightMillis()
        val pending = pendingIntent(context)

        val canExact = android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.S ||
            alarmManager.canScheduleExactAlarms()

        if (canExact) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC, triggerAt, pending)
        } else {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC, triggerAt, pending)
        }
    }

    fun cancel(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.cancel(pendingIntent(context))
    }
}
