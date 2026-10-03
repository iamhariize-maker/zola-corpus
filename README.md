# Zola Corpus

UPSC and APSC Prelims 2027 in one installable app: the **Forecast tracker**, **Hacking the System**
and the **CSAT Question Forge**. Open it once while online; after that it installs like an app and works
fully offline.

**Live:** https://iamhariize-maker.github.io/zola-corpus/
**Live feed:** [`iamhariize-maker/Zola-feed`](https://github.com/iamhariize-maker/Zola-feed) (exam dates, news inbox, notices)

## What the app layer gives you

| | |
|---|---|
| **Installs everywhere** | Android and desktop Chrome/Edge get an Install button. iPhone and iPad get a one-time "Share → Add to Home Screen" hint. The offer waits for a return visit (or 30 seconds on a first visit), and "Not now" keeps it quiet for two weeks. |
| **Rich install dialog** | Real app screenshots for phone and desktop, so the install sheet looks like a store listing. |
| **Works offline** | The whole app is saved on the device on the first visit ("Ready to work offline"). Going offline shows a short reassurance, not an error. |
| **Updates itself** | Publish a new `index.html` and open copies show **New build ready · Reload**. Copies left open for a while check again when you return to them. |
| **Home-screen shortcuts** | Long-press the icon to jump to Forecast, Hacking or CSAT. When the app is already open, a shortcut reuses that window instead of opening a second one. |
| **Keeps your progress** | Once installed, the app asks the browser to keep its storage, so a storage clean-up can't wipe your review progress. |
| **Looks right** | Crisp SVG favicon, maskable and monochrome (Android 13 themed) icons, a status bar that follows the in-app theme button, and a share card for WhatsApp/Telegram links. |

## Set up (once)

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Actions** tab: open **Deploy Zola Corpus** and press **Run workflow** (only needed the first time; later pushes deploy by themselves).
3. When the run is green, open https://iamhariize-maker.github.io/zola-corpus/ in Chrome on Android and tap **Install**.

## Ship a new build of the app

Replace `index.html` and commit it. That works from the GitHub website: **Add file → Upload files**.

You don't need to carry the install/offline layer across by hand. The deploy re-applies it from `pwa/` to
whatever `index.html` you upload, stamps a fresh cache version, checks everything and publishes.
Installed copies download the new build in the background and offer a reload.

On a computer, `npm run apply` (or `node tools/pwa.mjs apply path/to/new-build.html`) also writes the
layer into the repository copy, so the file works the same when opened directly.

## Files

| Path | Job |
|---|---|
| `index.html` | The whole app (Zola Corpus 2.4), with the PWA layer between `zola-pwa` markers |
| `pwa/head.html`, `pwa/body.html` | **The PWA layer.** Edit these, not the marked blocks in `index.html` |
| `manifest.webmanifest` | Name, icons, colours, shortcuts, screenshots, launch behaviour |
| `sw.js` | Service worker: offline copy, background refresh, update notices |
| `icons/`, `screenshots/` | Home-screen, maskable, monochrome, shortcut and share images; install-dialog screenshots |
| `404.html` | Sends a mistyped address back to the app |
| `tools/pwa.mjs` | `apply`, `check` and `build`, with no dependencies |
| `tools/screenshots.mjs` | Regenerates `screenshots/` from the real app (needs Playwright) |
| `.github/workflows/deploy.yml` | Check → build → publish to GitHub Pages on every push to `main` |

## On a computer

```bash
npm run check    # manifest, icons, screenshots, service worker and layer
npm run serve    # build to _site and serve at http://localhost:8080 (offline mode works on localhost)
```

## Good to know

- The repository is public, so anyone with the link can open and install the app.
- The app reads `https://raw.githubusercontent.com/iamhariize-maker/zola-feed/main/zola-feed.json`.
  Until the feed's `main` branch exists, **Go live** shows a 404 and the app keeps using its built-in data.
- If you ever switch Pages to **Deploy from a branch** instead, the files still work as they are. In that
  case, bump `VERSION` at the top of `sw.js` whenever you change icons, the manifest or `sw.js`.
