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
| `scripts/generate-audio.js` | One-time (macOS `say`) script that pre-renders `audio/` from `data.js` |
| `manifest.json` / `sw.js` | PWA install & offline support |
