// Fetches the latest iTunes + Google Play store-ranking snapshots from the
// public Voodoo store-rankings data and writes annotated JSON into ../data.
// Runs server-side (Node 20+, GitHub Actions), so there is no CORS issue.
//
// Output schema (data/itunes.json, data/google_play.json):
//   { store, updated_at, source_file, generated_at, total, miniclip_count,
//     games: [ { rank, id, name, publisher, icon, dev_url, studio } ] }

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { matchStudio } from "./studios.mjs";

const BASE = "https://store-rankings.voodoo-tech.io";
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const STORES = ["itunes", "google_play"];

async function getJSON(url) {
  const res = await fetch(url, { headers: { "User-Agent": "miniclip-store-tracker" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function buildStore(store, meta, snap) {
  const games = (snap.games || []).map((g, i) => ({
    rank: i + 1,
    id: g.s ?? null,
    name: g.n ?? "",
    publisher: g.cn ?? "",
    icon: (g.il || g.is || "").split("?")[0] || null,
    dev_url: g.cl ? g.cl.split("?")[0] : null,
    studio: matchStudio(g.cn),
  }));
  return {
    store,
    updated_at: meta[store]?.updated_at ?? null,
    source_file: meta[store]?.file_name ?? null,
    generated_at: new Date().toISOString(),
    total: games.length,
    miniclip_count: games.filter((g) => g.studio).length,
    games,
  };
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const meta = await getJSON(`${BASE}/data/metadata.json`);
  const summary = {};
  for (const store of STORES) {
    const fileName = meta[store]?.file_name;
    if (!fileName) {
      console.warn(`No file_name for ${store}; skipping.`);
      continue;
    }
    const snap = await getJSON(`${BASE}/data${fileName}`);
    const out = buildStore(store, meta, snap);
    await writeFile(join(DATA_DIR, `${store}.json`), JSON.stringify(out, null, 1));
    summary[store] = {
      updated_at: out.updated_at,
      total: out.total,
      miniclip_count: out.miniclip_count,
    };
    console.log(`${store}: ${out.total} games, ${out.miniclip_count} Miniclip-family.`);
  }
  await writeFile(
    join(DATA_DIR, "meta.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), stores: summary }, null, 1)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
