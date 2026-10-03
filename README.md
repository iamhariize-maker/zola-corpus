# Zola Corpus

UPSC and APSC Prelims 2027 in one installable app: the **Forecast tracker**, **Hacking the System**
and the **CSAT Question Forge**. It installs like an app and works fully offline. No app store, no account.

## Open it

**https://iamhariize-maker.github.io/zola-corpus/**

The address always starts with `iamhariize-maker.github.io`. The app never asks for a password, payment or OTP.

### Install on your phone (30 seconds)

1. Open the link in **Chrome** on Android. Wait a moment for "Ready to work offline".
2. Tap **Install** on the banner at the bottom (or ⋮ → **Install app**).
   On **iPhone/iPad**, open it in Safari, tap **Share → Add to Home Screen**.
3. Open **Zola** from your home screen. After the first visit it works with no internet.

On a laptop, use the install icon in the address bar of Chrome or Edge.

### Share it with others

Send the link as plain text on WhatsApp or Telegram. It shows a preview with the logo and title, so people can
see what they are opening. [`share/Zola-Corpus-share.png`](share/Zola-Corpus-share.png) is a ready-made card
with the link and the install steps (deliberately no QR code, so people can read where it goes before tapping).

**Live feed:** [`iamhariize-maker/Zola-feed`](https://github.com/iamhariize-maker/Zola-feed) (exam dates, news inbox, notices)

## What the app layer gives you

| | |
|---|---|
| **Installs everywhere** | Android and desktop Chrome/Edge get an Install button. iPhone and iPad get a one-time "Share → Add to Home Screen" hint. The offer waits for a return visit (or 30 seconds on a first visit), and "Not now" keeps it quiet for two weeks. |
| **Opens smoothly** | A launch screen in the brand violet picks up where Android's own splash leaves off. It holds while the app assembles itself, then the logo zooms out into the finished page, so nobody sees half-built screens. Tabs, sections and Hacking pages glide in; tabs, pills and buttons respond to touch. "Reduce motion" on the phone is respected (quick fades only), and the launch screen can never trap the app: it clears itself after 4.5 s whatever happens. |
| **Boardroom Neon design** | The violet-ink app keeps its formal type and layout; a violet → magenta → cyan neon is added only as accents: a neon hairline under the header that fills as you read, chapter marks on section titles, gradient key figures, glowing tier S events, gradient buttons, chips and active tabs. Dark mode becomes a night-city boardroom with soft neon washes and a faint synthwave horizon grid. Text never sits on cyan, so contrast holds. The CSAT Question Forge wears the same layer. |
| **Fun that does a job** | Figures count up when they come into view; cards and charts rise in as you scroll (anything already on screen is never hidden); signal bars and chart bars grow when opened; selected tabs and answer bubbles pop; buttons and chips ripple under your finger; the live dot pings while the feed is connected; the theme button cross-fades. |
| **Rich install dialog** | Real app screenshots for phone and desktop, so the install sheet looks like a store listing. |
| **Works offline** | The whole app is saved on the device on the first visit ("Ready to work offline"). Going offline shows a short reassurance, not an error. |
| **Updates itself** | Publish a new `index.html` and open copies show **New build ready · Reload**. Copies left open for a while check again when you return to them. |
| **Home-screen shortcuts** | Long-press the icon to jump to Forecast, Hacking or CSAT. When the app is already open, a shortcut reuses that window instead of opening a second one. |
| **Keeps your progress** | Once installed, the app asks the browser to keep its storage, so a storage clean-up can't wipe your review progress. |
| **The wH⚡PLA5h mark** | The header, footer and CSAT section carry the same bolt in place of the "!", as inline vector so it looks identical on every device. The app icon is the wH⚡p wordmark: extra-bold letters from the app's own typeface, cut through by a marigold bolt, over the seal-red bar, on a violet-ink gradient. Browser tabs get the bolt alone, which stays legible at 16 px. Maskable (Android), Apple and monochrome (Android 13 themed icons) versions are each fitted to their platform's safe area. |
| **Looks right** | A status bar that follows the in-app theme button, and a share card for WhatsApp/Telegram links. |

## Publishing (already done for this repo)

Pages is set to **Settings → Pages → Source: GitHub Actions**, and every push to `main` deploys by itself
(**Actions → Deploy Zola Corpus**). If you ever copy this to a new repo, switch Pages to GitHub Actions once,
then run the workflow from the **Actions** tab.

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
| `icons/`, `screenshots/` | The logo as vector masters (`icon.svg`, `maskable.svg`, `apple-touch.svg`, `monochrome.svg`, `favicon.svg`) and the PNGs made from them; shortcut and share images; install-dialog screenshots |
| `share/` | The WhatsApp/Telegram share card (not published with the site) |
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
- The app reads `https://raw.githubusercontent.com/iamhariize-maker/zola-feed/main/zola-feed.json`
  (live; the news inbox refreshes every six hours). Open **Go live** in the header and press **Check now**:
  a green dot means it is connected. With no connection the app uses its built-in data.
- If you ever switch Pages to **Deploy from a branch** instead, the files still work as they are. In that
  case, bump `VERSION` at the top of `sw.js` whenever you change icons, the manifest or `sw.js`.
