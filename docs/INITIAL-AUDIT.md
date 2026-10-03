# Zola Corpus initial audit

Date: 3 October 2026. Scope: the supplied `zola-corpus.zip` and `zola-feed.zip`, project guidance, source inspection, existing browser suites, and additional local browser probes. This pass changes no application code or study content.

## Architecture and working boundaries

- Forecast is a main-document application with seven hash-routed sections, tracker filters, evidence charts and past papers.
- Hacking also runs in the main document. It parses its machine pack and extra material at startup and renders into `#b-content`.
- CSAT is a separate same-origin `srcdoc` iframe. The document is stored as base64 in `script#srcC` and decoded when first opened. Its document and scripts are therefore not executed at initial Forecast startup, although the base64 text is part of the initial download and outer HTML parse.
- Live updates come from the companion feed. The app validates and saves a feed copy, falls back to built-in data, and shows machine links for tagged inbox items.
- Install, offline notices, typography, motion, scroll memory and calendar export are supplied by `pwa/head.html` and `pwa/body.html`. `tools/pwa.mjs` applies these layers and stamps the service-worker cache from content hashes.
- Per `AGENTS.md`, owner application code and study content in `index.html` must not be hand-edited. Layer changes belong in `pwa/`; application-logic changes require owner authorization because fresh owner builds would overwrite them.

## Verified baseline

`npm run check`, `npm test` (34 checks across both browser suites), and `python scripts/update_feed.py --check` all passed.

The browser suites cover offline reload, install offers, update-and-reload, launch-screen removal, existing scroll memory, header collapse, reduced-motion reveal behavior and calendar export using a feed fixture. They do not establish the correctness of study content, all calculators, progress imports or feed tagging.

Three fresh browser contexts on Pixel 7 emulation (412 px width), with Chromium CPU throttled 6 times, became visible after approximately 1.17–1.21 seconds. The longest captured startup task was 83 ms. The HTML response was 1,999,235 bytes. These measurements used localhost without network throttling, and startup tasks were recorded until launch-screen removal. They do not reproduce the roadmap's production-device figures or establish real-phone performance. No speed optimization was made.

## Findings in recommended order

### 1. Hacking import persists malformed progress before reporting failure — high

`wireReview()` in the owner Hacking script checks only that an imported file contains `data.traps`. It merges the payload into the current in-memory state, writes it to `zolaB.v22`, then renders Review.

Reproduction in an isolated browser:

1. Open `#hacking/review` with a valid existing trap record.
2. Import JSON containing `data.traps` with a trap that has `box` and `due` but no `hist` array.
3. The screen reports `Import failed: Cannot read properties of undefined (reading 'length')`.
4. Read `localStorage['zolaB.v22']`: the malformed imported record has replaced the previous state.
5. Reload: Review is blank and the browser reports the same exception.

Proposed fix: validate the complete candidate state before changing either memory or storage; reject invalid trap histories, preferences and record types. Define whether import replaces or merges progress, and make that visible. Keep existing data intact when validation fails. Add a regression asserting byte-for-byte preservation of saved progress after a rejected import, then verify valid export/import round trips.

This involves owner application logic unless a carefully scoped layer guard is chosen. It has not been changed during this audit.

### 2. Backup roadmap omits the actual learner-progress keys — high

The roadmap proposes exporting `zolaV2.*` and `zola.*`. Source inspection shows these actual owners:

| Key | Data |
|---|---|
| `zolaV2.*` | Forecast settings, theme and tracker state |
| `zolaB.v22` | Hacking trap histories, walkthroughs and preferences |
| `zolaCsatForge.v1` | CSAT practice ledger, mock history and settings |
| `zola.live.v1` | Feed configuration and saved feed |
| `zola.pwa.*`, `zola.neo.countedOn` | Layer preferences and notice/animation bookkeeping |
| `sessionStorage['zola.ux.pos']` | Section scroll positions |

A backup that follows the existing prefix rule would omit Hacking and CSAT learning history. Hacking's existing export covers only its own progress; a complete accessible backup/restore flow is still absent.

Proposed fix: explicitly include both learner-progress keys alongside the documented prefixes; show backup date, edition and record counts; validate before restore; preview and confirm replacement; preserve existing storage if restore fails. Implement the new UI in the PWA layer without altering the existing Hacking export.

### 3. Exam calendar ignores built-in dates when no feed is saved — medium

The layer's `getExams()` reads `zola.live.v1`, then fetches the hard-coded default feed. It does not use the application's existing `ZOLA_LIVE.exams()` API, which already combines built-in dates with accepted feed data and respects the configured feed state.

Reproduction: forget downloaded feed data, block the feed request, and tap the countdown. The dialog asks for an internet connection, while `ZOLA_LIVE.exams().length` is still 4. Thus the offline app has dates but cannot export them through this dialog.

Proposed fix: use the app's accepted exam list, preserve its built-in fallback, and avoid a separate request to the default URL. Add regressions for no saved feed while offline, a custom configured feed, and feed overrides.

This can be addressed in `pwa/body.html`.

### 4. Feed checks accept values contrary to the documented schema — medium

The supplied feed is valid. However, direct in-memory probes of the Python validator accepted each of these mutations:

- An inbox machine of `M99`.
- An inbox subject outside the six supported chips.
- An exam with no label.
- A curated event with a non-date `date` value.

The browser validator also permits any `M` plus two digits and arbitrary subject strings; it silently drops some malformed records rather than rejecting the file as a whole. The publisher's checks and the app's acceptance policy are therefore inconsistent with the documented guarantees.

Proposed fix: define a shared acceptance contract, tighten publisher checks, and add malformed-feed fixtures. Preserve the current bot's race-safe retry loop and last-good-copy behavior.

The supplied inbox contains 17 releases; the offline tag evaluation keeps all 17 and none receives a machine tag. This sample has already been filtered and cannot measure false-keep rate or tagging accuracy. The proposed manually labelled evaluation set remains necessary.

### 5. Phone section navigation has a cue but no one-tap “more” control — medium

On a 412 px viewport, Brief, Tracker, Watch list and Evidence fit; Past papers is partial, while Model lab and Sources are offscreen. The existing owner CSS already adds a fade and `›` pseudo-element, so the bar is not entirely unmarked. However, the chevron uses `pointer-events:none` and cannot reveal more sections when tapped. Horizontal swiping remains necessary.

Proposed fix: make the overflow cue an accessible real button that advances the bar and reflects whether more sections remain, or choose a compact wrapped layout. Cover touch and keyboard navigation and verify every section is visible or one tap away. Apply the change through the layer.

## Roadmap corrections and performance direction

- The unified theme is already implemented in this archive. Light, Dark and Auto selected in the outer header all reached the CSAT document, and the inner theme button was hidden. Add regression coverage and update roadmap item 5 rather than rebuilding it.
- The section bar already has a visual chevron. Its remaining gap is interaction and discoverability, not a missing fade alone.
- First-open work should begin with repeatable production-like measurements. Hacking's data and code execute at startup, but CSAT decoding already waits for first entry. Externalizing everything without accounting for that distinction risks adding load-order and offline failures.
- Prefer fewer full-list redraws and unnecessary geometry measurements when profiling shows interaction freezes; do not add more animation to mask them.
- Accessibility needs its own audit. The existing Chromium suites do not substitute for axe, keyboard checks or real VoiceOver/TalkBack testing.

## Suggested first implementation batch

Start with a complete backup that includes both learner-progress keys, the calendar fallback bug, and a usable section overflow control, with regression tests. Treat import validation as the most urgent application-logic fix. Establish startup and interaction measurements before choosing a larger loading refactor.

No code has been deployed, pushed or committed. Browser probes used disposable local storage. Safari, Firefox, real mobile hardware and live-feed availability were not tested; feed-dependent checks used the supplied fixture.
