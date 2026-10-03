# Roadmap

Ordered by value to a student using the app daily. Each item says why, what "done" means, and where to work.
Read `AGENTS.md` first. Evidence numbers come from the audit on 3 Oct 2026 (Pixel 7 emulation, CPU slowed 6×).

## Done

| Item | Where |
|---|---|
| Install, offline, update notices, launch screen, shortcuts, icons (wH⚡p) | `pwa/`, `manifest.webmanifest`, `sw.js`, `icons/` |
| Boardroom Neon colour, motion and type | `pwa/body.html` (`#zneo`, `#zneo-motion`), `fonts/` |
| Switching Forecast/Hacking/CSAT opens at the top; coming back restores your place | `pwa/body.html` `#zux` |
| Header steps aside while reading (+48 px of reading space) | `#zux` |
| Calmer motion: launch reveal ~0.3 s, figures count once a day, no reveal on the tracker list | `pwa/head.html`, `#zneo-motion` |
| Exam dates → phone calendar (`.ics` with reminders), from the countdown and the Watch list | `#zux` |
| Feed inbox keeps only syllabus-relevant releases (17 of 20 vs 3 of 20 before) | `Zola-feed/scripts/update_feed.py` |

## Next

### 1. Backup and restore (high)
**Why:** all progress lives in one browser's `localStorage`. A lost phone or cleared browser data means it's gone,
and the only export is buried in Hacking → Review.
**Done when:**
- A "Back up" action saves one JSON file with every `zolaV2.*` and `zola.*` key, the date and the app edition.
- "Restore" reads that file, shows what it contains (counts, date), asks before overwriting, then reloads.
- A gentle reminder (a notice, at most once every 14 days) when there is progress and no backup for 14 days.
- Reachable from a visible place (header menu or Brief), not only from Review.
- Tests: round-trip export → clear storage → import → same keys and values; a corrupt file is refused.
**Where:** new block in `pwa/body.html`. Do not touch the app's own export code.

### 2. Faster first open (high)
**Why:** the first open took 3.2 s to become usable, with one 289 ms freeze (later opens 1.5 s). The whole app,
including Hacking's 1 MB of data (`script#zolaBData`) and the CSAT document (`script#srcC`), is parsed up front.
**Approach to investigate:** at build time (`tools/pwa.mjs build`) move the big inline data blocks into separate
files that are precached, and load them on first open of that section. This only works if the app reads them
lazily. Today it reads `zolaBData` at start-up, so this needs a small shim or a change in the app. **Ask the owner
before changing app logic.**
**Done when:** first open at 6× CPU is usable in under 2.0 s, warm in under 1.2 s, with no long task over 200 ms.
Offline still works and all tests pass.

### 3. Section bar discoverability (medium)
**Why:** only 4 of Forecast's 7 sections fit on a phone. Past papers, Model lab and Sources are easy to miss.
**Done when:** on a 412 px phone every section is reachable without guessing. Either the bar shows a clear
"more" affordance (fade and chevron that scrolls), or it wraps into two rows. Test: all 7 buttons are visible or
one tap away.

### 4. Feed quality (medium)
**Why:** tagging is keyword-based. It is better now, but machine matches (M01–M23) are still rare on real PIB
headlines.
**Done when:** on 200 recent PIB releases (use `Zola-feed/scripts/eval_tags.py`), at least 80% of kept items are
correctly tagged on manual review, and false "keep" is under 15%. Add the evaluation set to the feed repo.
Optionally add sources (PIB regional feeds, PRS legislative briefs) in `SOURCES`.

### 5. One theme switch (medium)
**Why:** CSAT (the iframe) has its own theme button, so the app has two.
**Done when:** changing the theme in the header also sets `data-theme` inside `#frC`, the CSAT button is hidden or
mirrors it, and the choice persists. Do it from the layer (the frame-dressing code in `#zneo-motion` already
reaches into the frame).

### 6. Cross-links between the three parts (high value, needs content)
**Why:** a student cannot see that a tracker event relates to a machine and to CSAT skills.
**Done when:** each tracker event shows the machines it touches (events already carry `machines` such as `M14` in
the feed schema) as links to `#hacking/M14`, and each machine page links back to recent events. Needs data
from the owner for the built-in events. Ask first.

### 7. Sources (high value, owner content)
Only 4 of 57 tracked events have a source link. This is content work for the owner. The app already shows
sources when present.

### 8. Small accessibility items (low)
- axe "region" (moderate): content of `#catA` and `#frB` is outside landmarks. Fix in the layer by adding
  `role="main"` or a landmark wrapper only if it does not break the app's own `<main>` elements; verify with axe.
- Touch targets under 40 px: brand mark (28 px tall), range inputs (32 px). Pad them in the layer.
- Gradient text (`--neo-text`) is not checked by tools. Add a test that computes contrast for both gradient end
  colours against `--sheet` and `--paper` in light and dark (need ≥ 3:1 for large figures).
- Mono tags at 10.5 px: consider 11 px if users find them hard to read.

### 9. Usage insight (owner decision)
There is no analytics, so nobody knows which sections are used. If the owner wants it, use a privacy-respecting,
cookie-less counter of section opens only, and say so in the app. Default: do nothing.
