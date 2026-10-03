# Fix log

Date: 3 October 2026. Based on the five findings in `INITIAL-AUDIT.md`. The owner authorized all fixes, including the necessary application-logic safeguards.

| Finding | Status | Change | Regression coverage |
|---|---|---|---|
| Hacking import overwrites progress before failing | Fixed and verified | Validate the entire candidate first; confirm replacement; write storage before changing memory; restore prior state if rendering fails; report storage failures. | Invalid histories/preferences, cancelled import, valid export/import round trip, failed storage write, reload after rejection. |
| Full backup misses Hacking/CSAT progress | Fixed and verified | Brief → **Back up / Restore** includes every `zolaV2.*` and `zola.*` key plus `zolaB.v22` and `zolaCsatForge.v1`. JSON includes UTC export date and edition. Restore validates before showing a preview; **Replace and reload** explicitly confirms replacement. Partial writes roll back; unrelated storage is preserved. A reminder appears at most once per 14 days after progress has gone unbacked for two weeks. | Exact storage round trip, real CSAT practice/unfinished paper, preview and cancellation, corrupt backup, partial storage failure, reload and reminder throttling. |
| Calendar ignores built-in dates/custom feed | Fixed and verified | Calendar uses `ZOLA_LIVE.exams()`, the accepted combined exam list. It needs no additional network request. Calendar text escaping also handles literal backslashes and line endings. | Four built-in dates without a saved feed, offline export, custom feed override, no default-feed request. |
| Publisher and browser accept invalid feed fields | Fixed and verified | Reject unsupported subjects/machines, malformed dates/timestamps, missing IDs/labels, duplicate IDs/tags, invalid statuses/links, bad field types and oversized lists. Both validators follow the documented contract and share 38 acceptance fixtures. Publisher checks continue to work with Python optimization enabled. Existing bot retry behavior and feed content are untouched. | 38 shared cases in Node and Python; supplied feed validation; browser retains last good data after a malformed fresh feed. |
| Phone section chevron is not tappable | Fixed and verified | Accessible 44 px overflow button opens all seven Forecast sections in one tap. Supports arrow keys, Home/End, Escape, outside dismissal and selected-section indication. It hides when the bar fits. Selecting a section brings its original tab into view. | Phone chooser, keyboard selection of Sources, Escape focus return, desktop hide. |

The existing CSAT theme bridge was already correct. New regressions cover Light/Dark/Auto and the hidden duplicate theme button.

## Maintenance

- `pwa/data.js` contains shared import/backup/browser-feed checks and is inlined into the managed head by `tools/pwa.mjs`; no extra offline network dependency was added.
- `tools/app-fixes.mjs` reapplies the two authorized owner-script safeguards whenever the layer is applied or a site is built. It fails with an actionable error if an upstream owner build changes the patched entry points. `index.html` is generated with `npm run apply`, never edited by hand.
- Both CI workflows run their new regressions. The app includes a dependency lockfile for repeatable browser-test installs.
- `docs/FEED-CONTRACT.md` is mirrored into the feed repository. Shared acceptance fixtures must be updated together.

## Verification

- `npm run check`: passed.
- `npm test`: passed, 106 checks across four suites (38 feed fixtures, three build safeguards, 34 original browser checks and 31 new data/navigation checks).
- `python scripts/update_feed.py --check`: passed; the published feed JSON is unchanged.
- `python -m unittest discover -s tests -v`: passed, including the same 38 feed acceptance cases and the supplied feed.
- `python -O scripts/update_feed.py --check`: passed.
- Both repositories contain identical feed-validation fixtures.
- Install-dialog screenshots regenerated with `npm run screenshots`.
- Updated source archive: `zola-fixed-projects.zip` (both repositories, excluding dependencies and generated build folders).
- Deployable site archive: `zola-corpus-site.zip` (contents of the checked `_site/` build).

## Scope and remaining roadmap work

This batch fixes all five audit findings. It does not claim a startup-speed improvement: the audit's local startup measurements already differed from the earlier production audit. Production-like performance profiling, the manually labelled 200-headline tagging evaluation, additional curated sources/cross-links and a full accessibility audit remain separate roadmap work. Browser checks use Chromium, including phone emulation; real Safari/Firefox and physical-device checks are not included.

The initial bug-fix handoff was provided as source/site archives without publishing. See the subsequent Studio release below for the deployment scope.

## Studio design release · 3 October 2026

The owner requested a professional visual/animation pass and explicitly authorized deployment. The release includes the earlier app safeguards above.

| Area | Change | Verification |
|---|---|---|
| Visual system | Ivory/white light surfaces, coordinated navy dark mode, restrained violet accents, stronger editorial typography and consistent cards, fields and dialogs across Forecast, Hacking and CSAT. | Manual desktop/phone screenshot review; automated layout checks at 320, 412, 432, 768 and 1440 px. |
| Brief and navigation | Two-column desktop overview, mobile stat ledger, direct tracker/review actions, cleaner segmented category navigation and compact backup controls. | Both new shortcuts exercised; all three apps and header controls fit all five viewport sizes. |
| Motion | Short section entrances, faster count-up, single launch entrance, quieter theme transitions. Removed perpetual decorative motion and layered list reveals; static figures remain still. | Existing launch/count/bar/ripple checks retained; live reduced-motion changes disable shell and CSAT animations. |
| Long-page use | Added Back to top for both parent sections and the independent CSAT document; CSAT scrolling now updates the header reading-progress indicator. | Parent and CSAT scroll/return/hide regressions. |
| Scroll memory | Replaced the fixed 450 ms position-recording blackout with frame-scoped restoration suppression. An immediate user scroll is retained when switching away and back. | Existing restoration check plus a regression for scrolling 180 ms after navigation. |
| Accessible section chooser | The owner's broad tab update also reached the utility buttons, assigning invalid `aria-selected` and `tabIndex=-1`. The managed layer restores normal button semantics and keyboard access after each route. | Keyboard/ARIA regression; axe WCAG A/AA samples on Brief, Tracker, Hacking library and CSAT, light and dark: zero violations. |
| Theme and install finish | Final palette reaches saved-theme browser chrome and the CSAT frame; splash/manifest colours aligned; all five install screenshots refreshed. | Saved light/dark theme checks; frame parity; PWA install/offline/update suites. |

### Source and maintenance

- New `pwa/studio.css`, `pwa/studio-frame.css` and `pwa/studio.js` are inlined into the managed body by `tools/pwa.mjs`. They add no runtime dependency or offline network request.
- `index.html` is generated with `npm run apply`. Owner study content and question banks are preserved.
- `README.md` and `AGENTS.md` now describe the active design and its maintenance rules.
- Added 17 meaningful UX assertions, bringing the complete suite to 123 checks.
- Accessibility sampling used axe-core 4.13.0 with WCAG 2 A/AA and WCAG 2.1 AA tags. Manual assistive-technology testing and physical Safari/Firefox checks remain outside this release.
- Deployment target: https://iamhariize-maker.github.io/zola-corpus/ via the repository's GitHub Actions Pages workflow. Existing installs receive the normal **New build ready · Reload** offer.
- Companion feed publisher safeguards remain in the supplied source bundle; this deployment publishes the PWA repository.

Release checks before publishing: `npm run check` and `npm test` passed (123 assertions across four suites); all eight final axe route/theme samples passed. The publish checkout was byte-for-byte compared with the tested source.

## Vivid colour and motion release · 3 October 2026

The owner asked for tasteful colour and matching animation on top of the Studio release, keeping its smoothness, and authorized deployment.

| Area | Change | Verification |
|---|---|---|
| Colour system | Each app owns one accent: violet Forecast, teal Hacking, amber CSAT. The active app sets `html[data-zapp]`, and every `--pen`/`--neo-*` token follows it, so buttons, tabs, labels, focus rings and bars change together. Head script sets the hue before first paint for deep links. | Accent hues pass WCAG AA on paper and sheet in both themes (manual ratios ≥ 5.0:1); gradient end colours used only on large display text (≥ 3.8:1). |
| Surfaces | Soft static aurora behind the top of each app; deep-hue brand mark; colour-coded Brief and Hacking figures (four hues with small drawn tabs); app gradient on the top tier, signal bars, inbox rule and reading-progress bar; headline ink warms into the accent; CSAT cover gathers amber light. | Light/dark screenshots at phone and desktop widths; install screenshots regenerated. |
| Motion | Category card and Forecast underline / Hacking pill glide to the selection (transform-based, 0.38–0.42 s). Brief and Hacking heroes stagger within the single entrance; figure tabs draw in once. Primary buttons lift with a coloured glow and one light sweep on hover; Hacking cards glow on hover. No perpetual motion. | New regressions: accent follows the app, indicator glides and sits under the selected tab/page, CSAT keeps its own accent, Reduce motion stops indicators and hero entrance. |
| Accessibility | Forced-colours and print fall back to solid text. | axe-core 4.13.0 (WCAG 2 A/AA, 2.1 AA) on Brief, Tracker, Hacking library, M01 and CSAT (incl. frame), light and dark, phone and desktop: 0 violations in 20 samples. |

Release checks before publishing: `npm run check` and `npm test` passed.
