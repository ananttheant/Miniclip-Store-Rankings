# Miniclip in the store charts

A small, self-hosted GitHub Pages site that reads the current **US Top Free
Games** charts **directly from the App Store and Google Play** and highlights
every title published by **Miniclip or one of its studios** (SYBO, Easybrain,
Lessmore, Ilyon, Masomo, Gamebasics, Green Horse Games, Eight Pixels Square,
Supersonic Software / AppyNation, FuturLab, Triwin).

A scheduled GitHub Action re-fetches the charts once a day at midnight UTC and
commits the refreshed data, so the page stays current on its own.

## Data sources

- **App Store** — Apple's own "Top Free Games" RSS chart (genre 6014), via the
  [`app-store-scraper`](https://www.npmjs.com/package/app-store-scraper) library.
  This is the same feed third-party trackers resell, so results match them
  exactly.
- **Google Play** — Play's own Top Free GAME chart, via the
  [`google-play-scraper`](https://www.npmjs.com/package/google-play-scraper)
  library. Google has no official charts API, so this scrapes Play's internal
  endpoint; if Google changes it, bump the library version.

## Why an Action instead of fetching live in the browser

These store endpoints don't send CORS headers, so a browser page hosted on a
different domain (like `*.github.io`) can't fetch them directly. A GitHub Action
runs **server-side**, where CORS doesn't apply, fetches the data, and commits
it into `data/` — which the page then loads from its own origin.

## Files

| Path | What it does |
|------|--------------|
| `index.html` | The dashboard. Loads `data/itunes.json` + `data/google_play.json`. |
| `data/*.json` | Snapshot data, refreshed by the Action. |
| `scripts/studios.mjs` | The Miniclip studio → publisher-name matching rules. |
| `scripts/update.mjs` | Fetches the live charts from the stores and writes `data/*.json`. |
| `scripts/build_seed.mjs` | Legacy one-off seed generator (no longer used). |
| `package.json` | Declares the two scraper dependencies. |
| `.github/workflows/update.yml` | `npm install` + scheduled refresh + commit. |

## Setup (one time)

1. **Create a repo** on your GitHub (e.g. `miniclip-store-rankings`) and push
   these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/miniclip-store-rankings.git
   git push -u origin main
   ```
2. **Enable Pages:** repo → Settings → Pages → Source = *Deploy from a branch*,
   Branch = `main` / `/ (root)`. Your URL will be
   `https://<you>.github.io/miniclip-store-rankings/`.
3. **Allow the Action to commit:** repo → Settings → Actions → General →
   *Workflow permissions* → **Read and write permissions** → Save.
4. **Run it once now:** repo → Actions → *Update store rankings* → *Run workflow*.
   (It also runs automatically every day at midnight UTC.)

## Adjusting

- **Refresh frequency:** edit the `cron` in `.github/workflows/update.yml`.
- **Add/adjust studios:** edit `scripts/studios.mjs` (one matching rule per
  studio; patterns are case-insensitive substrings of the publisher name).

## Notes

- Data comes directly from the App Store and Google Play "Top Free Games" (US)
  charts. Apple is an official RSS feed; Google Play is scraped (no official
  API), so the Play job tolerates failure independently and the Action only
  errors if **both** stores fail.
- Matching is by store **publisher name**, so a newly-acquired studio will be
  picked up as soon as its name is added to `studios.mjs`.
