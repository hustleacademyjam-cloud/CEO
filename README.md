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

## Story highlights (Team + FAQ)

Rendered by `NODE_PATH=$(npm root -g) node scripts/render-stories.mjs` from `design/stories.html`
and `design/logo-pink-october.html`. The script fails if an FAQ thread runs into the bottom button.

| File | What |
| --- | --- |
| `exports/stories/meet-the-team-1080x1920.png` | Meet the Team intro story (add members in the `team` array) |
| `exports/stories/faq-00-cover-1080x1920.png` … `faq-05-…png` | FAQ cover + 5 tweet-style Q&A stories |
| `exports/highlight-covers/highlight-cover-{team,faq}-1080x1920.png` | Highlight covers (icon sits in Instagram's centre crop) |
| `exports/logo/ha-badge-pink-october-transparent-1080.png` | Breast Cancer Awareness Month logo, transparent |
| `exports/logo/ha-badge-pink-october-profile-1080.png` | Same, on the brand's dark teal, for a profile picture |

FAQ answers use the services and prices on hustleacademyja.com as of 4 Oct 2026 (all USD).
Re-check the site and edit the `faq` array in `design/stories.html` if anything changes.
