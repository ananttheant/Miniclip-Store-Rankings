# Miniclip in the store charts

A small, self-hosted GitHub Pages site that reads the current **US top-100 free
games** (App Store + Google Play) from the public Voodoo store-rankings data and
highlights every title published by **Miniclip or one of its studios**
(SYBO, Easybrain, Lessmore, Ilyon, Masomo, Gamebasics, Green Horse Games,
Eight Pixels Square, Supersonic Software / AppyNation, FuturLab, Triwin).

A scheduled GitHub Action re-fetches the charts every 30 minutes and commits the
refreshed data, so the page stays current on its own.

## Why an Action instead of fetching live in the browser

The Voodoo data files don't send CORS headers, so a browser page hosted on a
different domain (like `*.github.io`) can't fetch them directly. A GitHub Action
runs **server-side**, where CORS doesn't apply, fetches the data, and commits
it into `data/` — which the page then loads from its own origin.

## Files

| Path | What it does |
|------|--------------|
| `index.html` | The dashboard. Loads `data/itunes.json` + `data/google_play.json`. |
| `data/*.json` | Snapshot data (seeded now; refreshed by the Action). |
| `scripts/studios.mjs` | The Miniclip studio → publisher-name matching rules. |
| `scripts/update.mjs` | Fetches latest charts and writes `data/*.json`. |
| `scripts/build_seed.mjs` | One-off seed generator used to create the first data files. |
| `.github/workflows/update.yml` | Scheduled refresh + commit. |

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
   (It also runs automatically every 30 min.)

## Adjusting

- **Refresh frequency:** edit the `cron` in `.github/workflows/update.yml`.
- **Add/adjust studios:** edit `scripts/studios.mjs` (one matching rule per
  studio; patterns are case-insensitive substrings of the publisher name).

## Notes

- Data source: `https://store-rankings.voodoo-tech.io` (public). This is a
  third-party tool; treat the data as informational.
- Matching is by store **publisher name**, so a newly-acquired studio will be
  picked up as soon as its name is added to `studios.mjs`.
