// Miniclip + acquired studios → matched by the App Store / Google Play
// publisher ("developer") name as it appears in the store charts.
//
// Matching is case-insensitive substring on the publisher name. Patterns are
// chosen to be specific enough to avoid false positives (e.g. "supersonic
// software" not just "supersonic", which is a different, unrelated company).
//
// Ownership sources: Miniclip acquired SYBO (Subway Surfers), Easybrain
// (Sudoku.com / Blockudoku), Lessmore (Eatventure / Arrows / We Are Warriors),
// Ilyon (Bubble Shooter), Masomo (Head Ball 2 / Soccer Stars), Gamebasics
// (Online Soccer Manager), Green Horse Games, Eight Pixels Square, Supersonic
// Software + AppyNation, FuturLab and others.

export const STUDIOS = [
  { label: "Miniclip",            patterns: ["miniclip"] },
  { label: "SYBO",                patterns: ["sybo"] },
  { label: "Easybrain",           patterns: ["easybrain"] },
  { label: "Lessmore",            patterns: ["lessmore"] },
  { label: "Ilyon",               patterns: ["ilyon"] },
  { label: "Masomo",              patterns: ["masomo"] },
  { label: "Gamebasics",          patterns: ["gamebasics"] },
  { label: "Green Horse Games",   patterns: ["green horse"] },
  { label: "Eight Pixels Square", patterns: ["eight pixels"] },
  { label: "Supersonic Software", patterns: ["supersonic software"] },
  { label: "AppyNation",          patterns: ["appynation", "appy nation"] },
  { label: "FuturLab",            patterns: ["futurlab"] },
  { label: "Triwin Games",        patterns: ["triwin"] },
];

export function matchStudio(publisher) {
  const p = (publisher || "").toLowerCase();
  for (const s of STUDIOS) {
    if (s.patterns.some((pat) => p.includes(pat))) return s.label;
  }
  return null;
}
