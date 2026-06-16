// One-off seed generator: builds the initial data/*.json from the chart
// listings captured on 2026-06-16, so the GitHub Pages site shows real data
// immediately, before the first scheduled `update.mjs` run enriches it with
// icons + app ids. Run: `node scripts/build_seed.mjs`
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { matchStudio } from "./studios.mjs";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "data");

// Each block = repeating triples of: rank / name / publisher
const ITUNES = `
1
Block Out! - Color Sort Puzzle
Grand Games A.Ş.
2
Meowdoku!
Oakever Games
3
Magic Sort!
Grand Games A.Ş.
4
Smash Fest!
Flow Games Bilisim Yazilim ve Pazarlama Anonim Sirketi
5
Arrows – Puzzle Escape
Lessmore GmbH
6
Roblox
Roblox Corporation
7
Vita Mahjong
Vita Studio
8
Block Blast！
Hungry Studio
9
Amaze GO!
Oakever Games
10
MONOPOLY GO!
Scopely, Inc.
11
Gossip Harbor®: Merge & Story
Microfun Limited
12
Solitaire Associations Journey
Hitapps Games LTD
13
Fortnite
Epic Games Inc.
14
Yarn Loop: Knit Puzzle
Combo Games
15
Among Us!
InnerSloth LLC
16
Royal Kingdom
Dream Games
17
Profile Perfect
Lion Studios Plus
18
Bus Traffic Fever!
GOODROID,Inc.
19
Pixel Flow!
Loom Games Oyun Yazilim ve Pazarlama Anonim Sirketi
20
Soccer Superstar
Real Free Soccer
21
Kingshot
Century Games Pte. Ltd.
22
Tasty Travels: Merge Game
Century Games Pte. Ltd.
23
Barbie™ Horse Ride & Rescue
PikPok
24
Jewel Coloring
Ta Ta Game Technology Limited
25
Subway Surfers
Sybo Games ApS
26
Whiteout Survival
Century Games Pte. Ltd.
27
Magic Tiles 3™: Piano Game
Amanotes Pte. Ltd.
28
Township
Playrix
29
8 Ball Pool™
Miniclip.com
30
Call of Duty®: Mobile
Activision Publishing, Inc.
31
Triumph: Play for Cash
Triumph Arcade
32
Color Block Jam
Rollic Games
33
X-Clash: Survival Challenge
9z Games(HK)
34
Word Search Explorer®
PlaySimple Games Pte Ltd
35
FIFA Panini Collection
Panini S.p.A.
36
Royal Match
Dream Games
37
Imposter Game - Party Edition
Sven Vucak
38
Playtest Pro by BestPlay
Bestplay Systems
39
Clash of Critters
Farlight Games
40
Cookingo: Perfect Meal
Higame Global Limited
41
Tile Explorer: Tiles Clear!
Oakever Games
42
Jackpot Nights
Lucky Link Ltd.
43
Cider Casino - Real Money
Mystic Mirror Studio Limited
44
Color Maze - Puzzle Game
Beijing Youyoutang Technology Co.,ltd.
45
EA SPORTS FC Soccer Mobile 26
Electronic Arts
46
Disney Solitaire
SuperPlay
47
Love Island: The Game
Fusebox Games
48
Bubble Word Jam
Lion Studios Plus
49
Hole.io
Voodoo
50
Angry Birds 2
Rovio Entertainment Oyj
51
Paper.io 2
Voodoo
52
Castle Busters
Voodoo
53
Sudoku.com - Number Games
Easybrain Ltd
54
Goods Puzzle: Sort Challenge
ONESOFT GLOBAL PTE. LTD.
55
Zen Word® - Relax Puzzle Game
Oakever Games
56
Solitaire Cash: Win Real Money
Papaya Gaming
57
Tang Luck: Casino Slots
SpinShift Limited
58
Hexa Away
GOODROID,Inc.
59
Candy Crush Saga
King
60
Total Battle: War Strategy
Scorewarrior
61
Yarn Fever! Unravel Puzzle
Brave HK Limited
62
Pokémon GO
Niantic, Inc.
63
Chess - Play & Learn Online
Chess.com
64
Stake US - Casino & Slots
Sweepsteaks Limited
65
Mahjong Blast
Nebula Studio
66
Travel Town - Merge Adventure
Moon Active
67
Brawl Stars
Supercell
68
Snake Puzzle: Slither to Eat!
Superboost Soft Limited
69
Hollywood Merge
VoyagerOne
70
Rummy 500 - Card Game *
Fiogonia Games
71
Cash Avalanche:Casino Slot
RELLGO, INC.
72
Offline Games - No Wifi Games
Moreno Maio
73
Geometry Dash Lite
RobTop Games AB
74
Fidget Toys Trading: 3D Pop It
Freeplay LLC
75
Happy Color by Numbers Game
X-Flow
76
Car Sort: Color Puzzle
Rollic Games
77
Exposed - Who's Most Likely To
Behind The App
78
Brain Puzzle 3: Crazy Mind
SmallStep Dev Team
79
Wool Crush™-Escape Traffic Jam
Astrasen Global
80
Tricky Story 2: Brain Twist
Tang Thi Thuy
81
Fidget Trading 3D- Toy Collect
MagicLab
82
Car Evolve
Heseri Games Inc
83
Marble Sort!
Voodoo
84
CrownCoins Casino
Sunflower
85
Lamar - Idle Vlogger
Crazy Labs
86
Modo Casino Slots & Games
ARB Gaming LLC
87
Bingo Cash - Win Real Money
Papaya Gaming
88
Match Factory!
Peak Games
89
Idle Dot Shooter!
INFINITY GAMES, LDA
90
Dark War:Survival
Omnilojo Pte Ltd
91
Hidden Object Games: Seek It
NimbleMind
92
Top Tycoon: Coin Theme Empire
BeheFun Games Limited
93
NYT Games: Wordle & Crossword
The New York Times Company
94
2 Player Games : Offline Games
Moreno Maio
95
Arrow Out
Lion Studios Plus
96
Jigsaw Drop: Solitaire Puzzle
Runyou Game
97
Crossword Go!
PlaySimple Games Pte Ltd
98
Sled Surfers
Crazy Labs
99
Merge Cooking®
Happibits
100
Coin Master
Moon Active
`;

const GOOGLE_PLAY = `
1
Meowdoku: Brain Puzzle Games
Oakever Games
2
Arrows – Puzzle Escape
Lessmore GmbH
3
Amaze GO!
Oakever Games
4
Vita Mahjong
Vita Studio.
5
Roblox
Roblox Corporation
6
Block Blast!
HungryStudio
7
Royal Kingdom
Dream Games, Ltd.
8
EA SPORTS FC Soccer Mobile 26
ELECTRONIC ARTS
9
MONOPOLY GO!
Scopely
10
Color by Number：Coloring Games
Wildlife Studios
11
Magic Sort!
Grand Games A.Ş.
12
Color Block: Combo Blast
Ivy
13
Bubble Word Jam
Lion Studios Plus
14
Yarn Loop
Combo Game
15
Profile Perfect
Lion Studios Plus
16
Arrow Puzzle: Tap Puzzle Games
Easybrain
17
Magic Tiles 3™ - Piano Game
AMANOTES PTE. LTD.
18
Arrow Out
Lion Studios Plus
19
Disney Solitaire
SuperPlay.
20
Paper.io 2
VOODOO
21
Pixel Flow!
Loom Games A.Ş.
22
Jewel Coloring
TaTa Game Technology Limited
23
Bus Traffic Fever!
GOODROID,Inc.
24
Tile Explorer - Triple Match
Oakever Games
25
Zen Word® - Relax Puzzle Game
Oakever Games
26
Solitaire - Classic Card Games
Guru Puzzle Game
27
Castle Busters
VOODOO
28
Mob Control
VOODOO
29
Snake Clash!
Supercent, Inc.
30
Fortnite
Epic Games, Inc
31
Among Us
Innersloth LLC
32
Sled Surfers
CrazyLabs LTD
33
Soccer Superstar
Real Freestyle Soccer
34
Level Devil - NOT A Troll Game
Poki.com
35
Zoo Prank: Crazy Animals
Unicorn Studio Official
36
Township
Playrix
37
Block Color Mania, Puzzle Game
Brainteaser Puzzle Game Studio
38
Geometry Dash Lite
RobTop Games
39
Subway Surfers City
SYBO Games
40
Melon Sandbox
playducky.com
41
Sword x Staff
BOLTRAY GAMES
42
Block Craft 3D：Building Game
Wildlife Studios
43
Category Sort
Lion Studios Plus
44
Clash of Critters
FARLIGHT
45
Pizza Ready!
Supercent, Inc.
46
Tetris® Block Party
PLAYSTUDIOS US, LLC
47
Woodoku Blast
Tripledot Studios Limited
48
Coin Master
Moon Active
49
Colorful Soda Sort
Space Kraft Media
50
Rebel Glam: Dress Up Games
31 Dress up Games
51
Perfect Makeover Cleaning ASMR
HMBL Apps
52
Coin Master - Board Adventure
Moon Active
53
Royal Match
Dream Games, Ltd.
54
Magic Level 9 Music Piano Game
Beatwave Studio
55
Toca Boca World
Toca Boca
56
Happy Color®: Color by Number
X-FLOW
57
Mini Challenges: Calm Games
UltraPub
58
Mahjong Blast
Nebula Studio
59
Fidget Toys Trading・Pop It 3D
Freeplay Inc
60
Subway Surfers
SYBO Games
61
Annoying Uncle Punch Game®
Game District LLC
62
Arrow Puzzle - Arrow Madness
Ashita Games
63
Kick the Buddy－Fun Action Game
Playgendary Limited
64
Offline Games No WiFi internet
Fun Offline Games
65
Animals & Coins Adventure Game
Innplay Labs
66
Gossip Harbor: Merge & Story
Microfun Limited
67
Match Factory!
Peak
68
Solitaire Associations Journey
Hitapps Games
69
Kingshot
Century Games PTE. LTD.
70
Marble Sort! - Color Puzzle
VOODOO
71
Color Slide - Hexa Puzzle
SayGames Ltd
72
Call of Duty®: Mobile
Activision Publishing, Inc.
73
Wool Crush™
Astrasen Global
74
Pokémon GO
Niantic, Inc.
75
Block Crazy Robo World Craft
Prokids Studio
76
Go Convenience store Ready
zame
77
Loop Sort
VOODOO
78
OneState RP - Role Play Life
ChillBase
79
I Am Cat
Estoty
80
Pixel Art - Color by Number
Easybrain
81
Tasty Travels: Merge Game
Century Games PTE. LTD.
82
Hole Stars: Puzzle Game
Moon Active
83
Tiles Survive!
FunPlus International AG
84
Arrows Puzzle Relax
olfa
85
Offline Games - No Wifi Games
JindoBlu
86
Snake.io - Fun Snake .io Games
Kooapps Games | Fun Arcade and Casual Action Games
87
Game Is Hard
Unico Studio
88
Chess - Play and Learn Online
Chess.com
89
Candy Crush Saga
King
90
Pokémon TCG Pocket - Card Game
The Pokémon Company
91
Block Blitz: Puzzle Adventure
Bluetile
92
Fidget Trading 3D Fidget Toys
MagicLab
93
XP Hero
Supercent, Inc.
94
X-Clash
Glaciers Game
95
Jigsawcard Solitaire Puzzle
Oakever Games
96
Word Search Explorer
PlaySimple Games
97
School Party Craft
Candy Room Games & RabbitCo
98
Mini Fidget Antistress Games
The Fashion Valley
99
Football League 2026
MOBILE SOCCER
100
My Talking Tom 2: Pet Game
Outfit7 Limited
`;

function parse(block) {
  const lines = block.split("\n").map((l) => l.trim()).filter((l) => l.length);
  const games = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const rank = Number(lines[i]);
    if (!Number.isInteger(rank)) throw new Error(`Bad rank at line ${i}: "${lines[i]}"`);
    games.push({
      rank,
      id: null,
      name: lines[i + 1],
      publisher: lines[i + 2],
      icon: null,
      dev_url: null,
      studio: matchStudio(lines[i + 2]),
    });
  }
  return games;
}

const META = {
  itunes: { updated_at: "2026-06-16T12:49:01.000Z", source_file: "/itunes/2026/06/16/1249.json", block: ITUNES },
  google_play: { updated_at: "2026-06-15T16:01:40.000Z", source_file: "/google_play/2026/06/15/1601.json", block: GOOGLE_PLAY },
};

await mkdir(DATA_DIR, { recursive: true });
const summary = {};
for (const [store, m] of Object.entries(META)) {
  const games = parse(m.block);
  if (games.length !== 100) throw new Error(`${store}: expected 100, got ${games.length}`);
  const out = {
    store,
    updated_at: m.updated_at,
    source_file: m.source_file,
    generated_at: new Date().toISOString(),
    seed: true,
    total: games.length,
    miniclip_count: games.filter((g) => g.studio).length,
    games,
  };
  await writeFile(join(DATA_DIR, `${store}.json`), JSON.stringify(out, null, 1));
  summary[store] = { updated_at: out.updated_at, total: out.total, miniclip_count: out.miniclip_count };
  console.log(`${store}: ${out.total} games, ${out.miniclip_count} Miniclip-family ->`,
    games.filter((g) => g.studio).map((g) => `#${g.rank} ${g.name} (${g.studio})`).join(", "));
}
await writeFile(join(DATA_DIR, "meta.json"),
  JSON.stringify({ generated_at: new Date().toISOString(), seed: true, stores: summary }, null, 1));
