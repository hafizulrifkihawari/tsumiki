# Implementation Plan: Cross-Platform Home Screen Widgets via Capacitor
**Target Repository:** `https://hafizulrifkihawari.github.io/jp-flashcard/`
**Objective:** Deploy native home screen widgets displaying "Kanji of the Day" using Capacitor while keeping web deployment on GitHub Pages.

---

## 🛠️ Step 1: Initialize Capacitor Wrapper
Run these commands in your web project's root folder to initialize the Capacitor framework.

```bash
# 1. Install core dependencies
npm install @capacitor/core @capacitor/cli capacitor-widget-bridge

# 2. Initialize Capacitor configurations
npx cap init "JP Flashcards" "com.hafizulrifkihawari.jpflashcard" --web-dir=dist

# 3. Install platform binaries
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### Configure `capacitor.config.json`
Overwrite your root `capacitor.config.json` configuration to point directly to your GitHub Pages hosting instance. This ensures your app bypasses local compilation bundles and streams straight from the web server.

```json
{
  "appId": "com.hafizulrifkihawari.jpflashcard",
  "appName": "JP Flashcards",
  "webDir": "dist",
  "server": {
    "url": "https://hafizulrifkihawari.github.io/jp-flashcard/",
    "cleartext": true
  }
}
```

---

## 🌐 Step 2: Inject Web Data Synchronization Logic
Add this native bridge function to your PWA's web lifecycle initialization script (e.g., inside your dashboard load function). This writes data directly to the native host container memory shared with the system OS widgets.

```javascript
import { WidgetBridge } from 'capacitor-widget-bridge';

async function syncKanjiToHomeScreenWidget(kanji, reading, meaning) {
  try {
    const todayKanjiData = {
      kanji: kanji,     // e.g., "着物"
      reading: reading, // e.g., "きもの"
      meaning: meaning  // e.g., "kimono"
    };

    // Store data inside native Shared Preferences / UserDefaults memory space
    await WidgetBridge.setItem({
      key: "current_kanji",
      value: JSON.stringify(todayKanjiData),
      group: "group.com.hafizulrifkihawari.jpflashcard" // Critical AppGroup binding for iOS
    });

    // Fire hardware system call requesting immediate widget view refresh
    await WidgetBridge.reloadAllTimelines();
    console.log("Widget storage synchronized successfully.");
  } catch (error) {
    console.error("Widget bridge synchronization failed:", error);
  }
}
```

---

## 🤖 Step 3: Native Android Implementation

### 1. Generate Widget Architecture
Launch your project in Android Studio:
```bash
npx cap open android
```
Inside Android Studio: Right-click your main app module directory `app/src/main/java/com/hafizulrifkihawari/jpflashcard/` ➡️ **New** ➡️ **Widget** ➡️ **App Widget**. 
* **Class Name:** `KanjiWidgetProvider`
* **Placement:** Home screen Only

### 2. Configure Layout XML (`res/layout/kanji_widget_layout.xml`)
Replace the auto-generated layout bundle file with this scannable vocabulary layout:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp"
    android:background="#FFFFFF"
    android:orientation="vertical"
    android:gravity="center">

    <TextView
        android:id="@+id/widget_kanji"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="漢"
        android:textSize="36sp"
        android:textStyle="bold"
        android:textColor="#212121"/>

    <TextView
        android:id="@+id/widget_reading"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Reading"
        android:textSize="14sp"
        android:textColor="#666666"
        android:layout_marginTop="4dp"/>

    <TextView
        android:id="@+id/widget_meaning"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Meaning"
        android:textSize="16sp"
        android:textStyle="italic"
        android:textColor="#424242"
        android:layout_marginTop="2dp"/>
</LinearLayout>
```

### 3. Implement Broadcast Receiver Backend (`KanjiWidgetProvider.kt`)
Replace your Kotlin provider file logic to fetch your string payload straight out of the capacitor storage map:

```kotlin
package com.hafizulrifkihawari.jpflashcard

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import org.json.JSONObject

class KanjiWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.kanji_widget_layout)
            
            // Access Capacitor Shared Storage Context
            val prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE)
            val rawJson = prefs.getString("current_kanji", null)

            if (!rawJson.isNullOrEmpty()) {
                try {
                    val data = JSONObject(rawJson)
                    views.setTextViewText(R.id.widget_kanji, data.optString("kanji", "漢"))
                    views.setTextViewText(R.id.widget_reading, data.optString("reading", ""))
                    views.setTextViewText(R.id.widget_meaning, data.optString("meaning", ""))
                } catch (e: Exception) {
                    views.setTextViewText(R.id.widget_kanji, "Error")
                }
            } else {
                views.setTextViewText(R.id.widget_kanji, "学習")
                views.setTextViewText(R.id.widget_reading, "Open App to sync")
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
```

---

## 🍏 Step 4: Native iOS Implementation

### 1. Activate Sharing & Build Extension
Launch your project in Xcode:
```bash
npx cap open ios
```
1. Select your parent App file target workspace ➡️ Go to **Signing & Capabilities** ➡️ Click **+ Capability** ➡️ Select **App Groups**.
2. Create a new App Group container exactly named: `group.com.hafizulrifkihawari.jpflashcard`
3. Create target module: Go to **File** ➡️ **New** ➡️ **Target** ➡️ Search and select **Widget Extension**. Name it `KanjiWidgetExtension` and click Activate.
4. Select the newly generated `KanjiWidgetExtension` Target directory folder ➡️ Go to **Signing & Capabilities** ➡️ Click **+ Capability** ➡️ Select **App Groups** and check the exact same group named `group.com.hafizulrifkihawari.jpflashcard`.

### 2. Implement SwiftUI Interface Layout & Data Pipeline (`KanjiWidgetExtension.swift`)
Open the template swift bundle file inside your target extension folder and completely replace its logic with this code block:

```swift
import WidgetKit
import SwiftUI

struct KanjiDataModel: Codable {
    let kanji: String
    let reading: String
    let meaning: String
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), kanji: "漢", reading: "かんじ", meaning: "Kanji")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = fetchLatestKanji()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let entry = fetchLatestKanji()
        let timeline = Timeline(entries: [entry], policy: .never) // Refreshed strictly on-demand by PWA Web Bridge calls
        completion(timeline)
    }
    
    private func fetchLatestKanji() -> SimpleEntry {
        // Read data directly out of shared sandbox App Group container
        if let sharedDefaults = UserDefaults(suiteName: "group.com.hafizulrifkihawari.jpflashcard"),
           let rawJson = sharedDefaults.string(forKey: "current_kanji"),
           let jsonData = rawJson.data(using: .utf8) {
            do {
                let decoded = try JSONDecoder().decode(KanjiDataModel.self, from: jsonData)
                return SimpleEntry(date: Date(), kanji: decoded.kanji, reading: decoded.reading, meaning: decoded.meaning)
            } catch {
                print("Decoding failed")
            }
        }
        return SimpleEntry(date: Date(), kanji: "学習", reading: "Open app", meaning: "To sync daily kanji")
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let kanji: String
    let reading: String
    let meaning: String
}

struct KanjiWidgetExtensionEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(spacing: 4) {
            Text(entry.kanji)
                .font(.system(size: 42, weight: .bold))
                .foregroundColor(.primary)
            Text(entry.reading)
                .font(.subheadline)
                .foregroundColor(.secondary)
            Text(entry.meaning)
                .font(.headline)
                .foregroundColor(.secondary)
                .italic()
        }
        .padding()
        .containerBackground(.background, for: .widget)
    }
}

@main
struct KanjiWidgetExtension: Widget {
    let kind: String = "KanjiWidgetExtension"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            KanjiWidgetExtensionEntryView(entry: entry)
        }
        .configurationDisplayName("Daily Kanji")
        .description("Displays your current Kanji of the day.")
        .supportedFamilies([.systemSmall])
    }
}
```

---

## 🚀 Execution Summary Checklist for Agent Workflow
1. Execute terminal commands in **Step 1** to spin up project architecture framework dependencies.
2. Inject javascript bridge snippet directly inside web dashboard initialization routing script (**Step 2**).
3. Execute `npx cap open android`, generate the widget file component boilerplate, and replace xml/kotlin payloads (**Step 3**).
4. Execute `npx cap open ios`, initialize app groups inside platform provision configuration pipelines, and override extension configurations (**Step 4**).