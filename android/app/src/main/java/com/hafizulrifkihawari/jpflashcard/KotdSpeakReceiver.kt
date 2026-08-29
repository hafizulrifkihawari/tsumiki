package com.hafizulrifkihawari.jpflashcard

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.widget.Toast
import java.util.Locale

/**
 * Speaks the KOTD widget's example sentence directly, without launching the
 * app — the widget's speaker button PendingIntent targets this receiver.
 * (iOS can't do this: WidgetKit extensions aren't allowed to play audio at
 * all, so the iOS widget deep-links into the app instead — see kotd.js's
 * appUrlOpen listener. Android has no such restriction, so it speaks in
 * place.)
 */
class KotdSpeakReceiver : BroadcastReceiver() {
    companion object {
        const val ACTION_SPEAK = "com.hafizulrifkihawari.jpflashcard.ACTION_KOTD_SPEAK"
        const val EXTRA_TEXT = "text"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val text = intent.getStringExtra(EXTRA_TEXT)
        if (text.isNullOrEmpty()) return

        // A BroadcastReceiver's onReceive must return quickly and the process
        // may otherwise be reclaimed before the async TTS engine finishes
        // initializing and speaking — goAsync() extends its lifetime.
        val pendingResult = goAsync()
        val appContext = context.applicationContext
        var tts: TextToSpeech? = null
        tts = TextToSpeech(appContext) { status ->
            val engine = tts
            if (status != TextToSpeech.SUCCESS || engine == null) {
                pendingResult.finish()
                return@TextToSpeech
            }

            val availability = engine.isLanguageAvailable(Locale.JAPAN)
            if (availability < TextToSpeech.LANG_AVAILABLE) {
                Toast.makeText(appContext, "Japanese voice not available on this device", Toast.LENGTH_SHORT).show()
                engine.shutdown()
                pendingResult.finish()
                return@TextToSpeech
            }

            engine.language = Locale.JAPAN
            engine.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {}
                override fun onDone(utteranceId: String?) {
                    engine.shutdown()
                    pendingResult.finish()
                }
                @Deprecated("Deprecated in Java")
                override fun onError(utteranceId: String?) {
                    engine.shutdown()
                    pendingResult.finish()
                }
            })
            engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "kotd-widget-utterance")
        }
    }
}
