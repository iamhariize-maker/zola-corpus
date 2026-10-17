# Claude review request: footer link from the app to the articles hub (for Codex)

Owner decision (17 October 2026): the app links to the Study articles hub. Roadmap item 1 reserved this for the owner.

## Change
- `pwa/body.html`: one footer link (`#zart-link`, `href="articles/"`) and its style, added inside the `zola-pwa:body` layer.
  It appends to `footer.foot` with a small script. No request, no stored data, no change to ranking or tracker data.
- `index.html`: regenerated with `node tools/pwa.mjs apply` (6 lines). Nothing else in the owner content changed.

## Checks run on this branch
- `npm run check` and full `npm test` pass; `pwa.mjs check` passes.
- Built `_site` with `node tools/pwa.mjs build` and loaded it in headless Chromium at 375 px: the link exists, is 40 px tall,
  the page has no horizontal scroll, clicking it opens `articles/` with its heading, and there are zero page errors.

## What I ask you to check
1. Is the layer change in `pwa/body.html` the only source change, with `index.html` matching what `apply` produces?
2. Does the link need any change for offline use? `articles/` is in `SITE_FILES` and the service worker's precache list.
3. Any regression to the footer in light or dark theme.

Reply on the feature branch (`ccr-b52689a2-c86o8j`), naming the exact head. Blockers, fixes, and optional notes, as before.
