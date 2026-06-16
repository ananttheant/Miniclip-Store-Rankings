// Fetches the current US "Top Free Games" charts DIRECTLY from the App Store
// and Google Play (no Voodoo, no API keys) and writes annotated JSON into
// ../data. Runs server-side in GitHub Actions, so there is no CORS issue.
//
// Data sources:
//   - App Store : app-store-scraper  (Apple's own top-free-Games chart, genre 6014)
//   - Google Play: google-play-scraper (Play's own top-free GAME chart)
//
// Output schema (data/itunes.json, data/google_play.json):
//   { store, updated_at, source, generated_at, total, miniclip_count,
//     games: [ { rank, id, name, publisher, icon, dev_url, studio } ] }

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { matchStudio } from "./studios.mjs";

// Both libraries ship as CommonJS; normalise the default export for ESM import.
import appStorePkg from "app-store-scraper";
import gplayPkg from "google-play-scraper";
const appStore = appStorePkg.default ?? appStorePkg;
const gplay = gplayPkg.default ?? gplayPkg;

const COUNTRY = "us";
const NUM = 100;
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "data");

function annotate(rank, { id, name, publisher, icon, dev_url }) {
  return { rank, id, name, publisher, icon: icon || null, dev_url: dev_url || null, studio: matchStudio(publisher) };
}

async function appleGames() {
  const apps = await appStore.list({
    collection: appStore.collection.TOP_FREE_IOS,
    category: appStore.category.GAMES, // 6014
    country: COUNTRY,
    num: NUM,
  });
  return apps.map((a, i) =>
    annotate(i + 1, {
      id: String(a.id),
      name: a.title,
      publisher: a.developer,
      icon: a.icon,
      dev_url: a.developerUrl || a.url,
    })
  );
}

async function playGames() {
  const apps = await gplay.list({
    collection: gplay.collection.TOP_FREE,
    category: gplay.category.GAME,
    country: COUNTRY,
    num: NUM,
  });
  return apps.map((a, i) =>
    annotate(i + 1, {
      id: a.appId,
      name: a.title,
      publisher: a.developer,
      icon: a.icon,
      dev_url: a.developerId
        ? `https://play.google.com/store/apps/dev?id=${encodeURIComponent(a.developerId)}`
        : a.url,
    })
  );
}

function pack(store, source, games) {
  if (!games.length) throw new Error(`${store}: source returned 0 games — the store layout may have changed.`);
  const now = new Date().toISOString();
  return {
    store,
    updated_at: now,
    source,
    generated_at: now,
    total: games.length,
    miniclip_count: games.filter((g) => g.studio).length,
    games,
  };
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });

  const targets = [
    { file: "itunes.json",       store: "itunes",       source: "App Store · Top Free Games (US)",  fetch: appleGames },
    { file: "google_play.json",  store: "google_play",  source: "Google Play · Top Free Games (US)", fetch: playGames },
  ];

  const summary = {};
  const errors = [];
  for (const t of targets) {
    try {
      const out = pack(t.store, t.source, await t.fetch());
      await writeFile(join(DATA_DIR, t.file), JSON.stringify(out, null, 1));
      summary[t.store] = { updated_at: out.updated_at, total: out.total, miniclip_count: out.miniclip_count };
      console.log(`${t.store}: ${out.total} games, ${out.miniclip_count} Miniclip-family.`);
    } catch (err) {
      errors.push(`${t.store}: ${err.message}`);
      console.error(`FAILED ${t.store}:`, err.message);
    }
  }

  await writeFile(
    join(DATA_DIR, "meta.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), stores: summary }, null, 1)
  );

  // Fail the job if BOTH stores failed; tolerate one store breaking so the
  // other still refreshes.
  if (errors.length === targets.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
