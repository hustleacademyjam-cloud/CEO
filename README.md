# Meet Our CEO — Hustle Academy JA

A "Meet our CEO" post in the style of the sticker-collage reference, rebuilt with the
**Hustle Academy Social** design system: teal gradient, Fraunces Black caps headline with a yellow
accent, the badge logo and wordmark, Inter body text and a pill button.

Caption: **Meet our CEO and Creative Design Manager**

## Exports

| File | Size | Use |
| --- | --- | --- |
| `exports/meet-our-ceo-story-1080x1920.png` | 1080×1920 | Instagram/Facebook Story, TikTok, Reels cover |
| `exports/meet-our-ceo-feed-1080x1350.png` | 1080×1350 | Instagram/Facebook feed post |

## Rebuild

```sh
python3 scripts/cutout.py source/ceo-photo-original.png build/ceo-cutout.png   # remove white background
python3 scripts/sticker.py build/ceo-cutout.png 1060 build/ceo-sticker-story.png
python3 scripts/sticker.py build/ceo-cutout.png 760  build/ceo-sticker-feed.png
NODE_PATH=$(npm root -g) node scripts/render.mjs                               # needs Playwright + Chromium
```

Layout, text and sticker positions live in `design/meet-our-ceo.html` (open it with
`?format=story` or `?format=feed`).
