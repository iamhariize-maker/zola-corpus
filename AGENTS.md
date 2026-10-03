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
hand-edit it.** Everything this repo adds (install, offline, design, motion, UX) lives in two files and is
written into `index.html` between markers by a tool:

```
pwa/head.html  →  between <!-- zola-pwa:head --> … <!-- /zola-pwa:head -->   (before </head>)
pwa/body.html  →  between <!-- zola-pwa:body --> … <!-- /zola-pwa:body -->   (before </body>)
```

Edit `pwa/*.html`, then run `node tools/pwa.mjs apply`. The deploy re-applies the layer anyway, so a fresh
`index.html` uploaded by the owner automatically gets it. If a task truly needs a change to the app's own content
or logic, stop and ask the owner. Their builds come from elsewhere and would overwrite yours.

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

Plain ES5-style JavaScript (no modules, no build step, no runtime dependencies). Keep it that way.

## Commands

```bash
npm run check        # manifest, icons, screenshots, service worker, layer freshness (no dependencies)
npm run apply        # write pwa/*.html into index.html
npm run build        # _site/ = deployable site, layer applied, cache version stamped from content hash
npm run serve        # build + serve _site at http://localhost:8080 (service worker works on localhost)
npm test             # build + browser suites (tests/pwa.test.mjs, tests/ux.test.mjs), 34 checks
npm run screenshots  # regenerate screenshots/ for the install dialog (do this after visual changes)
```

Browser tests need Playwright once: `npm i -D playwright && npx playwright install chromium`.

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

## Design system (Boardroom Neon)

- **Tokens** (in `#zneo`, light and dark): `--neo-v` violet, `--neo-m` magenta, `--neo-c` cyan, `--neo-line`
  (hairlines), `--neo-fill` (filled controls), `--neo-text` (gradient figures), `--neo-glow`, `--neo-ring`.
  The app's own tokens (`--paper`, `--sheet`, `--ink`, `--muted`, `--pen`, `--rule`, …) stay the base.
- **Rules:** neon is an accent, not a background. Text never sits on cyan; anything filled that carries text uses
  `--neo-fill` (deep violet → magenta) with white text. Tier S is the only place that glows by default.
- **Type:** `--display` and `--sans` = Space Grotesk (headlines, interface, figures); `--serif` = Newsreader (long
  reading); `--mono` = JetBrains Mono, small print only (labels, tags, captions, tier letters). Fonts are subset
  WOFF2 in `fonts/` (OFL). If new characters appear in content, re-subset (see `fonts/README.md`).
- **Motion:** every animation says something (selected, revealed, saved, live) and ends within about 1 s.
  Everything is off under `prefers-reduced-motion`. Never hide content that starts on screen. No reveal on long
  lists.
- **Accessibility:** keep the axe audit clean (one known moderate "region" item; see roadmap), 44 px touch targets,
  visible focus (`:focus-visible`), real buttons/links, `aria` on custom controls.

## Storage keys (do not rename without migrating)

| Key | Owner | Holds |
|---|---|---|
| `zolaV2.*` | app (Hacking) | review progress, settings: **the learner's data** |
| `zola.live.v1` | app (Zola Live) | last good copy of the feed |
| `zola.pwa.*` | PWA layer | install snooze, visits, update-check time, ready notice |
| `zola.neo.countedOn` | design layer | date figures last counted up |
| `sessionStorage['zola.ux.pos']` | UX layer | scroll position per section |

## Voice and honesty

The app is deliberately honest: it ranks topics, never predicts questions, labels unverified items and shows
sources. Keep that. Plain English, no hype, no claims the app cannot back (for example, nothing like "free"
or "guaranteed"). No trackers, no third-party scripts or CDNs (offline-first), and no network calls beyond the feed.

## Owner and accounts

- Owner: `iamhariize-maker` on GitHub. Both repos are public (Pages and the raw feed need that).
- Commit to `main` only with the owner's go-ahead for that piece of work; otherwise use a branch and open a PR.
