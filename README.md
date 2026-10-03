# Zola Corpus (installable web app)

Live at **https://iamhariize-maker.github.io/zola-corpus/** once GitHub Pages is switched on.
Open it once while online; after that it installs like an app and works fully offline.
The live dot in the header reads from the companion repo `iamhariize-maker/zola-feed`.

## What is in this repo

| File | Job |
|---|---|
| `index.html` | The whole app (Zola Corpus 2.4) with the install and offline layer added |
| `manifest.webmanifest` | App name, icons, colours, home-screen shortcuts (Forecast, Hacking, CSAT) |
| `sw.js` | Service worker: keeps the app on the device, refreshes it in the background |
| `icons/` | Home-screen, maskable and Apple icons |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are (optional) |

## Set up both repos (once)

Do the feed first, then the app. Both repos must be **public** (GitHub Pages and the raw feed need that on a free account).

### Route 1: GitHub website (works from a phone, easier on a laptop)

**Feed repo**
1. Go to https://github.com/new, name it `zola-feed`, choose Public, create.
2. Unzip `zola-feed.zip`. Add file → Upload files, and drag in everything inside the `zola-feed` folder.
   If `.github` will not upload, use Add file → Create new file, type `.github/workflows/update-feed.yml`
   as the name and paste the file in.
3. Actions tab → allow workflows if asked → "Update Zola feed" → Run workflow.

**App repo**
1. https://github.com/new, name it `zola-corpus`, Public, create.
2. Unzip `zola-corpus-pwa.zip` and upload everything inside the `zola-corpus` folder, keeping `icons/` as a folder.
3. Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch `main`, folder `/ (root)` → Save.
4. After a minute or two, open https://iamhariize-maker.github.io/zola-corpus/ in Chrome on Android.
   Tap **Install** on the prompt at the bottom, or ⋮ → Install app.

### Route 2: command line (Windows terminal, or hand it to Claude Code)

Needs Git and the GitHub CLI (`winget install GitHub.cli`), then `gh auth login` once.

```bash
cd zola-feed
git init -b main && git add . && git commit -m "Zola feed"
gh repo create zola-feed --public --source . --push
gh workflow run update-feed.yml -R iamhariize-maker/zola-feed

cd ../zola-corpus
git init -b main && git add . && git commit -m "Zola Corpus 2.4 PWA"
gh repo create zola-corpus --public --source . --push
gh api -X POST repos/iamhariize-maker/zola-corpus/pages -f "source[branch]=main" -f "source[path]=/"
```

If `gh workflow run` says the workflow is not found, wait a minute and run it again.

## How updates reach people

- **Feed** (exam dates, news inbox, notices): edit `zola-feed.json` in the feed repo. The app picks it up on next open.
- **New build of the app**: replace `index.html` and commit. Installed copies download it in the background
  and show "A newer build of Zola Corpus has been saved on this device. Reload now".
  A fresh build from Claude will not include the install/offline layer on its own: give Claude this
  `index.html` together with the new file and ask it to carry the PWA layer across.
- Change `VERSION` at the top of `sw.js` only when you change icons, the manifest or `sw.js` itself.

## Good to know

- Public repo means anyone with the link can open and save the corpus.
- The app is pre-pointed at `https://raw.githubusercontent.com/iamhariize-maker/zola-feed/main/zola-feed.json`.
  Until the feed repo exists it shows a 404 under Go live and keeps using its built-in data, which is expected.
- Opening `index.html` straight from a file still works; installing and offline caching need the https address.
