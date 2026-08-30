# 漢字 N4 Flashcards

A flashcard web app for studying N4 kanji and vocabulary, built so each word is drilled in context rather than in isolation.

**Live app:** https://hafizulrifkihawari.github.io/jp-flashcard/

## What it does

### Kanji flashcards (`index.html`)
- **300-word deck**, each flattened into ~10 cards: 1 card for the word alone, plus sentence cards — 9 conjugated-form cards for verbs/adjectives, or 9 hand-written usage-sentence cards for nouns.
- **Login & spaced repetition** — sign in with a name (or stay a `guest` for a fresh shuffle every time). Logged-in progress is saved per-user in `localStorage`: answering "Yes"/"No" on a card tracks correct/wrong counts per kanji, and well-known kanji are sampled less often in future sessions while struggling ones show up more.
- **Sessions are capped at 100 rotating cards** — each shuffle/login/filter change samples a fresh 100-card slice from the full pool, with a "Session complete!" screen and a button to start a new one at the end.
- **Manage page** (`manage.html`) — toggle individual kanji (or whole rows) off so they're excluded from every session.
- **Pre-rendered audio** — each card's audio is pre-generated (see `scripts/generate-audio.js`) and served from `audio/`, so pronunciation is consistent across visitors instead of depending on whatever TTS voice is installed on their device; falls back to the Web Speech API if a file is missing.
- **Romaji** (toggleable) — a hiragana-to-romaji converter that correctly distinguishes grammar particles (は/へ/を → wa/e/o) from words that merely start with the same kana.
- **Cloze mode** — blanks out the target word in its sentence for stronger recall.
- Filters for verbs / adjectives / nouns, and keyboard shortcuts (Space to flip, ←/→ to navigate, S to shuffle, Y/↑ and N/↓ to answer, P to play audio).

### Kotoba vocabulary (`kotoba.html`)
- A separate flashcard set for *Minna no Nihongo II* Pelajaran 26 vocabulary (`kotoba-data.js`), with its own simpler front/back card flow (`kotoba-app.js`).

### Shared
- **Installable PWA** — works offline once installed (`manifest.json` / `sw.js`); add it to your phone's home screen via the browser's "Install app" / "Add to Home Screen" option.
- **Force Update** button — unregisters the service worker and clears every cache before reloading, for recovering from a stuck/stale cached build.

## Running locally

No build step — it's plain HTML/CSS/JS. Either open `index.html` directly, or serve it:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Regenerating the 聴解 listening audio

The Bunpou page's 聴解 (listening) practice sets (`choukai-data.js`) play pre-rendered [VOICEVOX](https://github.com/VOICEVOX/voicevox_engine) clips from `audio/choukai/`, one distinct voice per speaker role (男性 = 青山龍星 `13`, 女性 = 春日部つむぎ `8`, ナレーター = 九州そら `16`). Re-run these steps only when a set's spoken text changes. Any line with no clip falls back to the Web Speech API, so the sets still work before you regenerate.

1. **Start the VOICEVOX engine.** It must serve `http://127.0.0.1:50021`. With Docker:
   ```
   docker run --rm --name voicevox-engine -p 50021:50021 voicevox/voicevox_engine:cpu-latest
   ```
   The `cpu-latest` image runs natively on Apple Silicon (arm64). The VOICEVOX desktop app works too.
2. **Generate the clips.** In a second terminal:
   ```
   node scripts/generate-choukai-audio.js        # natural speed
   node scripts/generate-choukai-audio.js 0.9    # slower, for learners
   ```
   The script renders every line, skips clips that already exist, and writes `audio/choukai/manifest.json`. CPU synthesis is slow — a full run of ~380 lines takes about 15 minutes.
3. **Bump the cache.** Increase `CACHE_NAME` in `sw.js` (for example `kanji-n4-v23` → `v24`) so visitors get the new clips.
4. **Commit** `audio/choukai/` and `sw.js`, then stop the engine (`docker stop voicevox-engine` or `Ctrl+C`).

**Docker credential note:** if a pull fails with `docker-credential-desktop ... not found`, your `~/.docker/config.json` has a stale `"credsStore": "desktop"` from Docker Desktop. Remove that line — public image pulls need no credentials.

## Files

| File | Purpose |
|---|---|
| `index.html` / `styles.css` | Kanji app structure & shared UI styles |
| `app.js` | Kanji card rendering, navigation, login/SRS, TTS, romaji toggle |
| `data.js` | The 300-word dataset, flattened into the full card deck |
| `conjugate.js` | Verb/adjective conjugation engine |
| `romaji.js` | Hiragana → romaji converter |
| `manage.html` / `manage.js` | Page for enabling/disabling individual kanji |
| `kotoba.html` / `kotoba-app.js` / `kotoba-data.js` / `kotoba.css` | Separate Kotoba vocabulary flashcard section |
| `audio/` | Pre-rendered per-card audio files + manifest |
| `audio/choukai/` | Pre-rendered 聴解 listening clips (VOICEVOX) + manifest |
| `scripts/generate-audio.js` | One-time (macOS `say`) script that pre-renders `audio/` from `data.js` |
| `scripts/generate-choukai-audio.js` | One-time (VOICEVOX) script that pre-renders `audio/choukai/` from `choukai-data.js` |
| `bunpou.html` / `bunpou-app.js` / `bunpou-data.js` / `bunpou.css` | Bunpou grammar section, plus the 模試 N4 and 聴解 modes (`n4sim.js`, `choukai.js`) |
| `manifest.json` / `sw.js` | PWA install & offline support |
