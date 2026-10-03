# AGENTS.md: working on Zola Corpus

Read this first. It is the contract for any coding agent (Codex, Claude, or a person) taking over this repo.
The roadmap with ready-to-pick tasks is in [`docs/ROADMAP.md`](docs/ROADMAP.md).

## What this is

Zola Corpus is an installable, offline-first web app (PWA) for UPSC and APSC Prelims 2027, published at
**https://iamhariize-maker.github.io/zola-corpus/**. It has three parts in one page:

| Part | Where in `index.html` | Routes |
|---|---|---|
| **A · Forecast tracker** | `#catA`, sub-sections `section#p-brief`, `#p-tracker`, `#p-watch`, `#p-evidence`, `#p-papers`, `#p-lab`, `#p-sources` | `#forecast/<sub>` |
| **B · Hacking the System** | `#frB`; the app renders pages into `#b-content` | `#hacking`, `#hacking/review`, `#hacking/M01`, … |
| **C · CSAT Question Forge** | `iframe#frC`, built from the base64 document in `script#srcC` | `#csat` |

Live data (exam dates, news inbox, notices) comes from the companion repo
[`iamhariize-maker/Zola-feed`](https://github.com/iamhariize-maker/Zola-feed) as
`https://raw.githubusercontent.com/iamhariize-maker/zola-feed/main/zola-feed.json`. See that repo's `AGENTS.md`.

## The one rule that matters most

`index.html` is the owner's study content (about 1.9 MB: questions, machines, evidence, the CSAT app). **Do not
hand-edit it.** Everything this repo adds (install, offline, design, motion, UX) lives in the `pwa/` source files and is
written into `index.html` between markers by a tool:

```
pwa/head.html  →  between <!-- zola-pwa:head --> … <!-- /zola-pwa:head -->   (before </head>)
pwa/body.html  →  between <!-- zola-pwa:body --> … <!-- /zola-pwa:body -->   (before </body>)
```

Edit `pwa/*.html`, `pwa/*.css` or `pwa/*.js`, then run `node tools/pwa.mjs apply`. The deploy re-applies the layer anyway, so a fresh
`index.html` uploaded by the owner automatically gets it. If a task truly needs a change to the app's own content
or logic, stop and ask the owner. Their builds come from elsewhere and would overwrite yours.

The owner authorized the import and strict-feed safeguards on 3 October 2026. These narrow logic changes live
in `tools/app-fixes.mjs` and are reapplied by the build tool, rather than hand-edited into the owner document.
Changed upstream entry points fail the build and need review. `pwa/data.js` is inlined into the managed head
and supplies their validators plus the complete backup validator. See `docs/FIX-LOG.md`.

### What is in the layer

`pwa/head.html`: manifest/icons/meta, Open Graph card, font faces (`#zfonts-neo`), launch screen (`#zboot` CSS and
a tiny script that adds `html.zboot`).

`pwa/body.html`, in order:

| Block | Job |
|---|---|
| `style#pwa-css` + first script | Notices (install, iOS hint, offline, update, ready), service-worker registration, update checks, launch-screen lift, launchQueue, durable storage, theme-colour sync |
| `style#zmotion` | Section transitions, touch feedback (respects reduced motion) |
| `style#zneo` | **Boardroom Neon** design tokens and component styles; type rules |
| `style#zneo-motion` + script | Count-up figures (once a day), scroll reveal, bar growth, ripple, theme cross-fade, reading-progress bar, CSAT frame dressing |
| `style#zux` + script | Scroll memory per section, collapsing header, exam-dates sheet and `.ics` export |
| `pwa/studio.css`, `pwa/studio-frame.css`, `pwa/studio.js` | Final Studio design overrides, Brief actions, return-to-top and CSAT palette; inlined at `<!-- zola-studio -->` |
| `pwa/stats.js` | Anonymous counts (GoatCounter, owner-approved 3 Oct 2026); inert until `CODE` is set; inlined after the Studio script |

Plain ES5-style JavaScript (no modules, no build step, no runtime dependencies). Keep it that way.

## Commands

```bash
npm run check        # manifest, icons, screenshots, service worker, layer freshness (no dependencies)
npm run apply        # write pwa/*.html into index.html
npm run build        # _site/ = deployable site, layer applied, cache version stamped from content hash
npm run serve        # build + serve _site at http://localhost:8080 (service worker works on localhost)
npm test             # build + contract/browser suites, contract and browser checks
npm run screenshots  # regenerate screenshots/ for the install dialog (do this after visual changes)
```

Browser tests need Playwright once: `npm ci && npx playwright install chromium`.

**Before every push: `npm run check` and `npm test` must pass.** Add a check to `tests/ux.test.mjs` (or
`tests/pwa.test.mjs`) for any new behaviour.

### Testing gotchas (learned the hard way)

- Playwright's `page.click()` scrolls the target into view first. On the sticky section bars that moves the page,
  so use the in-page `click()` helper in `tests/ux.test.mjs` when a test measures scroll position.
- Chromium cannot emulate `display-mode: standalone`. To test installed-app behaviour, override `matchMedia` in
  an init script.
- The live feed is answered from `tests/fixtures/zola-feed.json` so tests never depend on the network.
- Count-up runs once per day per device (`localStorage['zola.neo.countedOn']`). Tests that read figures must wait
  for the count (about 2 s) or use a fresh context.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: `node tools/pwa.mjs build _site` → GitHub Pages
(source: GitHub Actions). The service-worker cache version is a content hash, so installed copies get
"New build ready · Reload" by themselves. Never bump `VERSION` in `sw.js` by hand (only needed for branch deploys).
After deploy, the site updates within about a minute. Check `https://iamhariize-maker.github.io/zola-corpus/`.

Files the service worker precaches are listed in `SHELL` in `sw.js`. If you add a file the app needs offline,
add it there too (`npm run check` fails if a listed file is missing). New top-level folders that must be
published go in `SITE_FILES` in `tools/pwa.mjs`.

## Design system (Zola Studio)

- Final tokens and component rules live in `pwa/studio.css`; shared palette tokens before the
  `shared-surface-end` comment also enter the CSAT frame, followed by `pwa/studio-frame.css`.
- Light surfaces are ivory/white with navy ink; dark surfaces are navy with pale ink. **Vivid accents:** each app
  owns one hue (violet Forecast, teal Hacking, amber CSAT; rose is the fourth figure colour). `studio.js` sets
  `html[data-zapp]` from the selected category (`head.html` sets it early from the hash), and `--pen`/`--neo-*` derive
  from `--z-accent`. Add colour by using those tokens, not new literals. Gradients mark identity, progress and the primary
  action only. Text hues pass AA on paper and sheet; gradient text is reserved for large display type. Keep strong text contrast, visible focus and generous spacing. The older `#zneo` rules
  supply baseline typography and components; the Studio layer owns the final visual choices.
- Space Grotesk: interface/headlines/figures. Newsreader: reading. JetBrains Mono: compact labels.
  Fonts are bundled WOFF2 (OFL); no third-party runtime scripts or fonts.
- Use one short section entrance (the Brief and Hacking heroes stagger within it), subtle press feedback and transitions
  on specific properties. Category and section indicators glide on `transform`; a bar that has just appeared jumps
  into place instead of sliding. No perpetual
  decoration, hidden lists or moving static cards. Reduced motion disables animation in both documents.
- Header controls and key actions have at least 44 px touch targets. Forecast overflow utilities remain ordinary
  buttons, not tabs: the layer repairs the owner's broad `.sub button` ARIA update after each route change.
- Scroll restoration suppresses only restoration frames, not user scrolling during a fixed delay. Back to top
  targets the active document. Check shell and CSAT at 320, 412, 432, 768 and 1440 px.
- WCAG A/AA axe checks found no violations on Brief, Tracker, Hacking library and CSAT in either theme during
  this release. This is sampled automated coverage, not a full accessibility certification.

## Storage keys (do not rename without migrating)

| Key | Owner | Holds |
|---|---|---|
| `zolaV2.*` | app (Forecast) | theme, weights, tracker settings |
| `zolaB.v22` | app (Hacking) | trap histories, walkthroughs, review preferences: **the learner's data** |
| `zolaCsatForge.v1` | app (CSAT) | practice ledger, mock history, unfinished paper: **the learner's data** |
| `zola.live.v1` | app (Zola Live) | last good copy of the feed |
| `zola.pwa.*` | PWA layer | install snooze, visits, update-check time, ready notice |
| `zola.neo.countedOn` | design layer | date figures last counted up |
| `zola.stat.off`, `zola.stat.appSeen` | counting layer | counting turned off on this device; first installed launch already counted |
| `sessionStorage['zola.ux.pos']` | UX layer | scroll position per section |

Full backups include both learner-progress keys and every `zolaV2.*`/`zola.*` localStorage key. Backup/restore
is available from Brief; do not revert to prefix-only exports. Feed checks follow `docs/FEED-CONTRACT.md`.

## Voice and honesty

The app is deliberately honest: it ranks topics, never predicts questions, labels unverified items and shows
sources. Keep that. Plain English, no hype, no claims the app cannot back (for example, nothing like "free"
or "guaranteed"). No trackers, no third-party scripts or CDNs (offline-first), and no network calls beyond the feed, with one
owner-approved exception: `pwa/stats.js` sends anonymous counts to GoatCounter (views, `?s=qr` scans, `?s=link` opens,
installs) when its `CODE` is set. It sends no names, input or progress, sets no cookies, honours Do Not Track/GPC and a
per-device opt-out, and rewrites the app's "nothing leaves your device"/"no tracking" lines so they stay true. Never add
identifying data to it. Share images live in `share/`; the QR code points at `?s=qr`.

## Owner and accounts

- Owner: `iamhariize-maker` on GitHub. Both repos are public (Pages and the raw feed need that).
- Commit to `main` only with the owner's go-ahead for that piece of work; otherwise use a branch and open a PR.
