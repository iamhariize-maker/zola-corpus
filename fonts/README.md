# Fonts

| File | Family | Used for | Licence |
|---|---|---|---|
| `space-grotesk.woff2` | Space Grotesk (variable, 300–700) | Headlines, interface, figures | SIL Open Font License 1.1, `OFL-SpaceGrotesk.txt` |
| `jetbrains-mono.woff2` | JetBrains Mono (variable, 100–800) | Small labels, tags, captions, tier letters | SIL Open Font License 1.1, `OFL-JetBrainsMono.txt` |

Reading text stays in Newsreader, which is embedded in `index.html`.

Both files are subset to the characters the app uses (Latin, punctuation, arrows, ₹, and so on), so they stay small
(about 21 KB and 36 KB). The service worker precaches them for offline use. To rebuild them from the full fonts:

```bash
pyftsubset "SpaceGrotesk[wght].ttf" --text-file=chars.txt --layout-features='*' --flavor=woff2 --no-hinting --desubroutinize --output-file=space-grotesk.woff2
```
