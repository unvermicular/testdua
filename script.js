// === Mythic Waters - Fixed & Balanced Script ===
// - Location aliasing (prevents crashes)
// - Luck & secret rarity math rebalanced (no runaway %)
// - UI text & shop metadata clarified
// - Starting economy tuned
// - Defensive guards and small UX polish
//
// Drop-in replacement for your existing script.js

// -----------------------------
// Locations (display + theme)
// -----------------------------
const locations = {
  "Mistvale Lake": {
    description:
      "Mist-veiled shallows with luminous reeds and echoing birdsong.",
    theme: {
      bg: "linear-gradient(120deg, #1a2231, #34506d)",
      accent: "#8ff3ff",
    },
  },
  "Shalequartz Rapids": {
    description: "Crystalline rapids and chiseled canyons that roar with wind.",
    theme: {
      bg: "linear-gradient(120deg, #1d2333, #3d3f54)",
      accent: "#ffc983",
    },
  },
  "Emberhollow Lagoon": {
    description: "Smouldering mangroves crackle above ember-lit water.",
    theme: {
      bg: "linear-gradient(120deg, #2a1914, #663020)",
      accent: "#ff9b53",
    },
  },
  "Verdant Expanse": {
    description: "A bioluminescent marsh carpeted in moss and fireflies.",
    theme: {
      bg: "linear-gradient(120deg, #0f271c, #0f4733)",
      accent: "#7df0b5",
    },
  },
  "Glacial Halo": {
    description: "A mirrored lagoon of obsidian ice and geothermal steam.",
    theme: {
      bg: "linear-gradient(120deg, #102132, #2a4e65)",
      accent: "#c6f1ff",
    },
  },
  "Sapphire Depths": {
    description: "Ocean trench carved in sapphire glass and cold starlight.",
    theme: {
      bg: "linear-gradient(120deg, #071421, #0c2746)",
      accent: "#4de0ff",
    },
  },
  "Starlit Abyss": {
    description: "Endless nightwaters peppered with aurora constellations.",
    theme: {
      bg: "linear-gradient(120deg, #140b2f, #310f4f)",
      accent: "#d5a9ff",
    },
  },
  "Solstice Delta": {
    description:
      "Radiant floodplains drenched in sunflare, mirrors, and lilies.",
    theme: {
      bg: "linear-gradient(120deg, #1a1200, #52340e)",
      accent: "#ffda66",
    },
  },
  "Whispering Tidepool": {
    description:
      "Moonlit pools cradle ancient shells, where the ocean hums forgotten lullabies.",
    theme: {
      bg: "linear-gradient(120deg, #0f1e2e, #2a4a5e)",
      accent: "#7dd3e8",
    },
  },

  "Cinderbloom Marsh": {
    description:
      "Volcanic soil births crimson blossoms that float on ashen streams.",
    theme: {
      bg: "linear-gradient(120deg, #221411, #4a2f28)",
      accent: "#ff6b6b",
    },
  },
};

// Map display-location keys to fishDatabase keys
const locationAliases = {
  "Shalequartz Rapids": "Stone Rapids",
  "Sapphire Depths": "Crystal Trench",
  "Starlit Abyss": "Midnight Ocean",
  "Emberhollow Lagoon": "Volcanic Bay",
  "Verdant Expanse": "Emerald Basin",
  "Glacial Halo": "Frozen Peak Lake",
};
function getFishLocationKey(displayName) {
  return fishDatabase[displayName]
    ? displayName
    : locationAliases[displayName] ?? displayName;
}

// -----------------------------
// Gear data
// -----------------------------
const rods = [
  { name: "Driftwood Rod", cost: 0, luck: 0, speed: 0, weight: 20 },
  { name: "Emberfiber Rod", cost: 500, luck: 20, speed: 10, weight: 35 },
  { name: "Frostline Rod", cost: 1500, luck: 30, speed: 12, weight: 80 },
  { name: "Verdantwhip Rod", cost: 5000, luck: 40, speed: 15, weight: 200 },
  { name: "Starcaller Rod", cost: 15000, luck: 60, speed: 20, weight: 525 },
  { name: "Stormcoil Rod", cost: 45000, luck: 90, speed: 25, weight: 1400 },
  { name: "Prismweave Rod", cost: 135000, luck: 130, speed: 30, weight: 3500 },
  { name: "Inferno Rod", cost: 400000, luck: 190, speed: 36, weight: 9200 },
  { name: "Aether Rod", cost: 1200000, luck: 275, speed: 44, weight: 24000 },
  {
    name: "Prismbloom Rod",
    cost: 3600000,
    luck: 400,
    speed: 54,
    weight: 62000,
  },
  {
    name: "Roselight Rod",
    cost: 10000000,
    luck: 580,
    speed: 65,
    weight: 160000,
  },
  {
    name: "Leviathan Crown Rod",
    cost: 35000000,
    luck: 9000000000000, // preserved data; normalized by effectiveLuck()
    speed: 7500000,
    weight: 3200000000,
  },
];

const baits = [
  { name: "Dewdrop Pebble Bait", rarity: "Common", cost: 0, luck: 5 },
  { name: "Riverlily Bait", rarity: "Common", cost: 1000, luck: 10 },
  { name: "Firefly Pearl Bait", rarity: "Uncommon", cost: 3000, luck: 18 },
  { name: "Sunset Minnow Bait", rarity: "Uncommon", cost: 8000, luck: 25 },
  { name: "Moonpetal Swarm Bait", rarity: "Rare", cost: 20000, luck: 35 },
  { name: "Stormsong Shrimp Bait", rarity: "Rare", cost: 55000, luck: 50 },
  { name: "Opal Jelly Bait", rarity: "Epic", cost: 160000, luck: 70 },
  { name: "Emberrose Bait", rarity: "Epic", cost: 480000, luck: 90 },
  { name: "Aurora Bait", rarity: "Legendary", cost: 1400000, luck: 115 },
  { name: "Celestial Bait", rarity: "Mythic", cost: 4000000, luck: 140 },
  {
    name: "Leviathan Lullaby Bait",
    rarity: "Relic",
    cost: 12000000,
    luck: 18000000000000, // preserved data; normalized by effectiveLuck()
  },
];

// -----------------------------
// Fish database (unchanged)
// -----------------------------
const fishDatabase = {
  "Mistvale Lake": {
    common: [
      ["Coastal Minnow", 0.3, 1.2],
      ["Silver Dart", 0.3, 1.2],
      ["Misty Anchovy", 0.3, 1.2],
      ["Cove Sardine", 0.3, 1.2],
      ["Fog Goby", 0.3, 1.2],
      ["Pebble Blenny", 0.3, 1.2],
      ["Shore Killifish", 0.3, 1.2],
      ["Marsh Stickleback", 0.3, 1.2],
      ["Tide Shiner", 0.3, 1.2],
      ["Bay Silverside", 0.3, 1.2],
    ],
    uncommon: [
      ["Chromis viridis", 1.5, 30],
      ["Mist Perch", 1.5, 30],
      ["Fogbound Wrasse", 1.5, 30],
      ["Pomacentrus coelestis", 1.5, 30],
      ["Twilight Damsel", 1.5, 30],
      ["Nebula Goby", 1.5, 30],
      ["Apogon aureus", 1.5, 30],
      ["Veiled Cardinalfish", 1.5, 30],
      ["Pseudochromis diadema", 1.5, 30],
      ["Cove Triggerfish", 1.5, 30],
    ],
    rare: [
      ["Acanthurus sohal", 32.3, 280],
      ["Phantom Grouper", 32.3, 280],
      ["Epinephelus lanceolatus", 32.3, 280],
      ["Misty Barracuda", 32.3, 280],
      ["Cheilinus undulatus", 32.3, 280],
      ["Ethereal Snapper", 32.3, 280],
      ["Lutjanus sebae", 32.3, 280],
      ["Nebulous Trevally", 32.3, 280],
      ["Plectropomus leopardus", 32.3, 280],
      ["Vapor Cobia", 32.3, 280],
    ],
    epic: [
      ["Thunnus obesus", 303.7, 1000],
      ["Stormborn Marlin", 303.7, 1000],
      ["Makaira nigricans", 303.7, 1000],
      ["Thunder Sailfish", 303.7, 1000],
      ["Xiphias gladius", 303.7, 1000],
      ["Mistral Swordfish", 303.7, 1000],
      ["Istiophorus platypterus", 303.7, 1000],
      ["Tempest Wahoo", 303.7, 1000],
      ["Acanthocybium solandri", 303.7, 1000],
      ["Cyclone Tuna", 303.7, 1000],
    ],
    legendary: [
      ["Rhincodon typus", 1500, 7000],
      ["Abyssal Titan", 1500, 7000],
      ["Cetorhinus maximus", 1500, 7000],
      ["Leviathan Ray", 1500, 7000],
      ["Manta birostris", 1500, 7000],
      ["Oceanic Behemoth", 1500, 7000],
      ["Carcharodon carcharias", 1500, 7000],
      ["Primordial Sunfish", 1500, 7000],
      ["Mola mola", 1500, 7000],
      ["Ancient Megamouth", 1500, 7000],
    ],
    mythic: [
      ["Aetherfin", 8000, 88560],
      ["Voidwhale", 8000, 88560],
      ["Celestia", 8000, 88560],
      ["Nebulith", 8000, 88560],
      ["Phantasm", 8000, 88560],
      ["Stardrift", 8000, 88560],
      ["Eclipsor", 8000, 88560],
      ["Lunaris", 8000, 88560],
      ["Dreamtide", 8000, 88560],
      ["Chronos", 8000, 88560],
    ],
    secret1: [
      ["Crystallis", 44000, 78000],
      ["Eternity", 70000, 130000],
      ["Voidheart", 60000, 90000],
    ],
    secret2: [
      ["Omniscale", 80000, 230000],
      ["Infinitus", 100000, 344000],
    ],
    secret3: [
      ["Primordius", 545000, 840000],
      ["Nexarion", 300000, 550000],
      ["Cosmara", 200000, 340000],
      ["Exaltus", 767000, 1393000],
      ["Transcendis", 987654, 2345678],
    ],
  },

  "Stone Rapids": {
    // prev: 'Shalequartz Rapids'
    common: [
      ["Rapid Riffle", 0.3, 1.2],
      ["Stone Dart", 0.3, 1.2],
      ["Creek Twisty", 0.3, 1.2],
      ["Torrent Nibbler", 0.3, 1.2],
      ["Boulder Hopper", 0.3, 1.2],
      ["Current Flicker", 0.3, 1.2],
      ["Rapids Darter", 0.3, 1.2],
      ["Cascade Swimmer", 0.3, 1.2],
      ["Whitewater Zinger", 0.3, 1.2],
      ["Rocky Streamer", 0.3, 1.2],
    ],
    uncommon: [
      ["Oncorhynchus clarkii", 1.5, 30],
      ["Torrent Dancer", 1.5, 30],
      ["Salmo trutta", 1.5, 30],
      ["Stone Glider", 1.5, 30],
      ["Cottus asper", 1.5, 30],
      ["Rapids Phantom", 1.5, 30],
      ["Barbatula barbatula", 1.5, 30],
      ["Current Prowler", 1.5, 30],
      ["Gasterosteus aculeatus", 1.5, 30],
      ["Cascade Guardian", 1.5, 30],
    ],
    rare: [
      ["Hucho hucho", 32.3, 280],
      ["Raging Trout", 32.3, 280],
      ["Salvelinus confluentus", 32.3, 280],
      ["Boulder Serpent", 32.3, 280],
      ["Esox lucius", 32.3, 280],
      ["Whitewater Specter", 32.3, 280],
      ["Thymallus arcticus", 32.3, 280],
      ["Torrent Dancer", 32.3, 280],
      ["Acipenser sturio", 32.3, 280],
      ["Granite Lurker", 32.3, 280],
    ],
    epic: [
      ["Salmo salar", 303.7, 1000],
      ["Stormrush Leviathan", 303.7, 1000],
      ["Oncorhynchus tshawytscha", 303.7, 1000],
      ["Cascading Titan", 303.7, 1000],
      ["Salvelinus malma", 303.7, 1000],
      ["Torrent Colossus", 303.7, 1000],
      ["Hucho taimen", 303.7, 1000],
      ["Rapids Wraith", 303.7, 1000],
      ["Silurus glanis", 303.7, 1000],
      ["Stone Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Arapaima gigas", 1500, 7000],
      ["Ancient Gorger", 1500, 7000],
      ["Wallago leeri", 1500, 7000],
      ["Boulder Monarchs", 1500, 7000],
      ["Pangasius sanitwongsei", 1500, 7000],
      ["Raging Behemoth", 1500, 7000],
      ["Catlocarpio siamensis", 1500, 7000],
      ["Rapids Destructor", 1500, 7000],
      ["Lates niloticus", 1500, 7000],
      ["Primordial Gorge King", 1500, 7000],
    ],
    mythic: [
      ["Torrentheart", 8000, 88560],
      ["Stonebringer", 8000, 88560],
      ["Maelstrom", 8000, 88560],
      ["Boulderion", 8000, 88560],
      ["Vortexus", 8000, 88560],
      ["Cascadion", 8000, 88560],
      ["Torrentia", 8000, 88560],
      ["Granite Wrath", 8000, 88560],
      ["Swiftcurrent", 8000, 88560],
      ["Abyssal Surge", 8000, 88560],
    ],
    secret1: [
      ["Aquefort", 44000, 78000],
      ["Riverborn", 70000, 130000],
      ["Torrentide", 60000, 90000],
    ],
    secret2: [
      ["Lithosphere", 80000, 230000],
      ["Hydromajestic", 100000, 344000],
    ],
    secret3: [
      ["Cataclysm", 545000, 840000],
      ["Rapidsoul", 300000, 550000],
      ["Streamborn", 200000, 340000],
      ["Granite Sovereign", 767000, 1393000],
      ["Waterborne Eternus", 987654, 2345678],
    ],
  },

  "Volcanic Bay": {
    common: [
      ["Scorch Minnow", 0.3, 1.2],
      ["Lava Flicker", 0.3, 1.2],
      ["Ember Dart", 0.3, 1.2],
      ["Thermal Nibbler", 0.3, 1.2],
      ["Sulfur Hopper", 0.3, 1.2],
      ["Magma Spark", 0.3, 1.2],
      ["Ash Swimmer", 0.3, 1.2],
      ["Volcanic Zest", 0.3, 1.2],
      ["Obsidian Streamer", 0.3, 1.2],
      ["Molten Wiggler", 0.3, 1.2],
    ],
    uncommon: [
      ["Fundulus heteroclitus", 1.5, 30],
      ["Heat Glider", 1.5, 30],
      ["Oreochromis niloticus", 1.5, 30],
      ["Thermal Prowler", 1.5, 30],
      ["Cichlasoma citrinellum", 1.5, 30],
      ["Sulfur Dancer", 1.5, 30],
      ["Amphilophus citrinellum", 1.5, 30],
      ["Magma Guardian", 1.5, 30],
      ["Vieja synspila", 1.5, 30],
      ["Lava Phantom", 1.5, 30],
    ],
    rare: [
      ["Astronotus crassipinnis", 32.3, 280],
      ["Obsidian Terror", 32.3, 280],
      ["Cichla monoculus", 32.3, 280],
      ["Thermal Specter", 32.3, 280],
      ["Vieja heterospila", 32.3, 280],
      ["Inferno Lurker", 32.3, 280],
      ["Hemichromis elongatus", 32.3, 280],
      ["Volcanic Reaver", 32.3, 280],
      ["Cichla orinocensis", 32.3, 280],
      ["Slag Serpent", 32.3, 280],
    ],
    epic: [
      ["Cichlasoma managuense", 303.7, 1000],
      ["Pyroclasm Titan", 303.7, 1000],
      ["Cichla temensis", 303.7, 1000],
      ["Molten Leviathan", 303.7, 1000],
      ["Oreochromis mossambicus", 303.7, 1000],
      ["Scorching Colossus", 303.7, 1000],
      ["Parachromis motaguensis", 303.7, 1000],
      ["Volcanic Wraith", 303.7, 1000],
      ["Etroplus suratensis", 303.7, 1000],
      ["Obsidian Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Hydrocynus goliath", 1500, 7000],
      ["Infernal Gorger", 1500, 7000],
      ["Serrasalmus rhombeus", 1500, 7000],
      ["Volcanic Monarchs", 1500, 7000],
      ["Hoplias aimara", 1500, 7000],
      ["Magma Behemoth", 1500, 7000],
      ["Pterodoras granulosus", 1500, 7000],
      ["Thermal Destructor", 1500, 7000],
      ["Pygocentrus piraya", 1500, 7000],
      ["Primordial Lava King", 1500, 7000],
    ],
    mythic: [
      ["Pyraxis", 8000, 88560],
      ["Magmaheart", 8000, 88560],
      ["Calderis", 8000, 88560],
      ["Infernion", 8000, 88560],
      ["Scorchwrath", 8000, 88560],
      ["Vulkaros", 8000, 88560],
      ["Thermaxis", 8000, 88560],
      ["Cinder Soul", 8000, 88560],
      ["Sulfur Crown", 8000, 88560],
      ["Lava Æon", 8000, 88560],
    ],
    secret1: [
      ["Pyroclassic", 44000, 78000],
      ["Infernalis", 70000, 130000],
      ["Volcanic Æther", 60000, 90000],
    ],
    secret2: [
      ["Thermal Sublime", 80000, 230000],
      ["Magma Infinite", 100000, 344000],
    ],
    secret3: [
      ["Caldera Eternal", 545000, 840000],
      ["Magmatic Soul", 300000, 550000],
      ["Flamebringer", 200000, 340000],
      ["Obsidian Sovereign", 767000, 1393000],
      ["Phoenix Eternus", 987654, 2345678],
    ],
  },

  "Emerald Basin": {
    common: [
      ["Jade Minnow", 0.3, 1.2],
      ["Verdant Flicker", 0.3, 1.2],
      ["Forest Dart", 0.3, 1.2],
      ["Moss Nibbler", 0.3, 1.2],
      ["Leaf Hopper", 0.3, 1.2],
      ["Emerald Spark", 0.3, 1.2],
      ["Grove Swimmer", 0.3, 1.2],
      ["Basin Zest", 0.3, 1.2],
      ["Chlorophyll Streamer", 0.3, 1.2],
      ["Woodland Wiggler", 0.3, 1.2],
    ],
    uncommon: [
      ["Leuciscus leuciscus", 1.5, 30],
      ["Verdure Glider", 1.5, 30],
      ["Barbus barbus", 1.5, 30],
      ["Emerald Prowler", 1.5, 30],
      ["Abramis brama", 1.5, 30],
      ["Canopy Dancer", 1.5, 30],
      ["Tinca tinca", 1.5, 30],
      ["Basin Guardian", 1.5, 30],
      ["Rutilus rutilus", 1.5, 30],
      ["Verdant Phantom", 1.5, 30],
    ],
    rare: [
      ["Sander lucioperca", 32.3, 280],
      ["Jade Specter", 32.3, 280],
      ["Perca fluviatilis", 32.3, 280],
      ["Forest Lurker", 32.3, 280],
      ["Esocidae luxurians", 32.3, 280],
      ["Emerald Reaver", 32.3, 280],
      ["Silurus meridionalis", 32.3, 280],
      ["Lush Serpent", 32.3, 280],
      ["Silurus glanis variant", 32.3, 280],
      ["Canopy Serpent", 32.3, 280],
    ],
    epic: [
      ["Siluroidea gigantis", 303.7, 1000],
      ["Verdant Titan", 303.7, 1000],
      ["Esox lucius variant", 303.7, 1000],
      ["Emerald Leviathan", 303.7, 1000],
      ["Silurus warneri", 303.7, 1000],
      ["Forest Colossus", 303.7, 1000],
      ["Leucaspius delineatus", 303.7, 1000],
      ["Basin Wraith", 303.7, 1000],
      ["Anguilla anguilla major", 303.7, 1000],
      ["Jade Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Hypophthalmichthys molitrix", 1500, 7000],
      ["Primordial Feeder", 1500, 7000],
      ["Aristichthys nobilis", 1500, 7000],
      ["Emerald Monarchs", 1500, 7000],
      ["Ctenopharyngodon idella", 1500, 7000],
      ["Verdant Behemoth", 1500, 7000],
      ["Mylopharyngodon piceus", 1500, 7000],
      ["Basin Destructor", 1500, 7000],
      ["Megalobrama macropterus", 1500, 7000],
      ["Primordial Grove King", 1500, 7000],
    ],
    mythic: [
      ["Verdaxis", 8000, 88560],
      ["Emeraldheart", 8000, 88560],
      ["Silvanias", 8000, 88560],
      ["Jadeborn", 8000, 88560],
      ["Canopion", 8000, 88560],
      ["Forestian", 8000, 88560],
      ["Botanis", 8000, 88560],
      ["Verdure Soul", 8000, 88560],
      ["Leafborn Crown", 8000, 88560],
      ["Basin Éon", 8000, 88560],
    ],
    secret1: [
      ["Sylvatic", 44000, 78000],
      ["Emeraldian", 70000, 130000],
      ["Verdant Æther", 60000, 90000],
    ],
    secret2: [
      ["Jade Sublime", 80000, 230000],
      ["Forest Infinite", 100000, 344000],
    ],
    secret3: [
      ["Basin Eternal", 545000, 840000],
      ["Verdant Soul", 300000, 550000],
      ["Sylvanbringer", 200000, 340000],
      ["Chlorophyll Sovereign", 767000, 1393000],
      ["Nature Eternus", 987654, 2345678],
    ],
  },

  "Frozen Peak Lake": {
    common: [
      ["Frost Minnow", 0.3, 1.2],
      ["Glacial Flicker", 0.3, 1.2],
      ["Alpine Dart", 0.3, 1.2],
      ["Crystal Nibbler", 0.3, 1.2],
      ["Snowpeak Hopper", 0.3, 1.2],
      ["Icebound Spark", 0.3, 1.2],
      ["Summit Swimmer", 0.3, 1.2],
      ["Chill Zest", 0.3, 1.2],
      ["Frostbite Streamer", 0.3, 1.2],
      ["Mountain Wiggler", 0.3, 1.2],
    ],
    uncommon: [
      ["Salvelinus alpinus", 1.5, 30],
      ["Glacial Glider", 1.5, 30],
      ["Thymallus thymallus", 1.5, 30],
      ["Frozen Prowler", 1.5, 30],
      ["Hucho perryi", 1.5, 30],
      ["Summit Dancer", 1.5, 30],
      ["Cottus gobio", 1.5, 30],
      ["Peak Guardian", 1.5, 30],
      ["Nemachilus steindachneri", 1.5, 30],
      ["Glacial Phantom", 1.5, 30],
    ],
    rare: [
      ["Salmo marmoratus", 32.3, 280],
      ["Crystalline Specter", 32.3, 280],
      ["Salvelinus confluentus variant", 32.3, 280],
      ["Frigid Lurker", 32.3, 280],
      ["Acipenser baerii", 32.3, 280],
      ["Frozen Reaver", 32.3, 280],
      ["Stenodus leucichthys", 32.3, 280],
      ["Icefall Serpent", 32.3, 280],
      ["Dallia pectoralis", 32.3, 280],
      ["Alpine Specter", 32.3, 280],
    ],
    epic: [
      ["Salmo salar variant", 303.7, 1000],
      ["Blizzard Titan", 303.7, 1000],
      ["Oncorhynchus nerka", 303.7, 1000],
      ["Frozen Leviathan", 303.7, 1000],
      ["Hucho taimen variant", 303.7, 1000],
      ["Alpine Colossus", 303.7, 1000],
      ["Leucichthys nasus", 303.7, 1000],
      ["Peak Wraith", 303.7, 1000],
      ["Coregonus lavaretus", 303.7, 1000],
      ["Frostbite Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Acipenser transmontanus", 1500, 7000],
      ["Glacial Gorger", 1500, 7000],
      ["Thymallus arcticus", 1500, 7000],
      ["Alpine Monarchs", 1500, 7000],
      ["Hucho bleeker", 1500, 7000],
      ["Frozen Behemoth", 1500, 7000],
      ["Stenodus nelma", 1500, 7000],
      ["Peak Destructor", 1500, 7000],
      ["Salvelinus namaycush", 1500, 7000],
      ["Primordial Snowpeak King", 1500, 7000],
    ],
    mythic: [
      ["Frostaxis", 8000, 88560],
      ["Glaciaheart", 8000, 88560],
      ["Alpinion", 8000, 88560],
      ["Crystallion", 8000, 88560],
      ["Fimbulwinter", 8000, 88560],
      ["Peakborn", 8000, 88560],
      ["Tundraleth", 8000, 88560],
      ["Icewhisper Soul", 8000, 88560],
      ["Snowveil Crown", 8000, 88560],
      ["Glacial Æon", 8000, 88560],
    ],
    secret1: [
      ["Frostine", 44000, 78000],
      ["Glacialis", 70000, 130000],
      ["Alpine Æther", 60000, 90000],
    ],
    secret2: [
      ["Crystal Sublime", 80000, 230000],
      ["Frozen Infinite", 100000, 344000],
    ],
    secret3: [
      ["Peak Eternal", 545000, 840000],
      ["Glacial Soul", 300000, 550000],
      ["Frostbringer", 200000, 340000],
      ["Snowpeak Sovereign", 767000, 1393000],
      ["Absolute Eternus", 987654, 2345678],
    ],
  },

  "Crystal Trench": {
    // prev: 'Sapphire Depths'
    common: [
      ["Luminous Minnow", 0.3, 1.2],
      ["Twilight Glimmer", 0.3, 1.2],
      ["Abyssal Dart", 0.3, 1.2],
      ["Biolume Nibbler", 0.3, 1.2],
      ["Deep Hopper", 0.3, 1.2],
      ["Shadow Spark", 0.3, 1.2],
      ["Trench Swimmer", 0.3, 1.2],
      ["Abyss Zest", 0.3, 1.2],
      ["Phosphor Streamer", 0.3, 1.2],
      ["Void Wiggler", 0.3, 1.2],
    ],
    uncommon: [
      ["Myctophidae viridis", 1.5, 30],
      ["Trench Glider", 1.5, 30],
      ["Stomias boa", 1.5, 30],
      ["Luminous Prowler", 1.5, 30],
      ["Photichthys argenteus", 1.5, 30],
      ["Depth Dancer", 1.5, 30],
      ["Searsia koefoedi", 1.5, 30],
      ["Abyss Guardian", 1.5, 30],
      ["Triplopus americanus", 1.5, 30],
      ["Crystal Phantom", 1.5, 30],
    ],
    rare: [
      ["Himantolophus groenlandicus", 32.3, 280],
      ["Glowing Specter", 32.3, 280],
      ["Cryptopsaras coesi", 32.3, 280],
      ["Abyssal Lurker", 32.3, 280],
      ["Pseudoscopelus scriptus", 32.3, 280],
      ["Trench Reaver", 32.3, 280],
      ["Chaunax coloratus", 32.3, 280],
      ["Void Serpent", 32.3, 280],
      ["Atolla jellyfish mimic", 32.3, 280],
      ["Depth Specter", 32.3, 280],
    ],
    epic: [
      ["Melanocetus johnsonii", 303.7, 1000],
      ["Biolumen Titan", 303.7, 1000],
      ["Chiasmodon niger", 303.7, 1000],
      ["Abyssal Leviathan", 303.7, 1000],
      ["Idiacanthus atlanticus", 303.7, 1000],
      ["Trench Colossus", 303.7, 1000],
      ["Bathylagus tenuis", 303.7, 1000],
      ["Crystal Wraith", 303.7, 1000],
      ["Cyclothone brunneichthys", 303.7, 1000],
      ["Phosphorescent Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Architeuthis dux", 1500, 7000],
      ["Abyssal Gorger", 1500, 7000],
      ["Vampyroteuthis infernalis", 1500, 7000],
      ["Trench Monarchs", 1500, 7000],
      ["Mesonychoteuthis hamiltoni", 1500, 7000],
      ["Abyss Behemoth", 1500, 7000],
      ["Grimpoteuthis bathronis", 1500, 7000],
      ["Trench Destructor", 1500, 7000],
      ["Humboldt squid colossal", 1500, 7000],
      ["Primordial Trench King", 1500, 7000],
    ],
    mythic: [
      ["Abyssheart", 8000, 88560],
      ["Luminaxis", 8000, 88560],
      ["Trenchion", 8000, 88560],
      ["Voidlight", 8000, 88560],
      ["Biolumis", 8000, 88560],
      ["Depthborn", 8000, 88560],
      ["Phosphoria", 8000, 88560],
      ["Darkwater Soul", 8000, 88560],
      ["Shadowglow Crown", 8000, 88560],
      ["Abysmal Æon", 8000, 88560],
    ],
    secret1: [
      ["Luminalis", 44000, 78000],
      ["Trenchian", 70000, 130000],
      ["Abyssal Æther", 60000, 90000],
    ],
    secret2: [
      ["Void Sublime", 80000, 230000],
      ["Biolume Infinite", 100000, 344000],
    ],
    secret3: [
      ["Trench Eternal", 545000, 840000],
      ["Abysmal Soul", 300000, 550000],
      ["Luminbringer", 200000, 340000],
      ["Twilight Sovereign", 767000, 1393000],
      ["Primordial Eternus", 987654, 2345678],
    ],
  },

  "Midnight Ocean": {
    // prev: 'Starlit Abyss'
    common: [
      ["Nocturnal Minnow", 0.3, 1.2],
      ["Moonless Flicker", 0.3, 1.2],
      ["Deepnight Dart", 0.3, 1.2],
      ["Shadow Nibbler", 0.3, 1.2],
      ["Midnight Hopper", 0.3, 1.2],
      ["Starless Spark", 0.3, 1.2],
      ["Ocean Whisper", 0.3, 1.2],
      ["Velvet Zest", 0.3, 1.2],
      ["Ebony Streamer", 0.3, 1.2],
      ["Nightborn Wiggler", 0.3, 1.2],
    ],
    uncommon: [
      ["Benthosema glaciale", 1.5, 30],
      ["Midnight Glider", 1.5, 30],
      ["Maurolicus muelleri", 1.5, 30],
      ["Nocturnal Prowler", 1.5, 30],
      ["Symbolophorus veranyi", 1.5, 30],
      ["Darkness Dancer", 1.5, 30],
      ["Gonostoma atlanticum", 1.5, 30],
      ["Nightwatch Guardian", 1.5, 30],
      ["Ceratoscopelus townsendi", 1.5, 30],
      ["Raven Phantom", 1.5, 30],
    ],
    rare: [
      ["Photostichthus argenteus", 32.3, 280],
      ["Midnight Specter", 32.3, 280],
      ["Sternoptyx thaumatodon", 32.3, 280],
      ["Nocturnal Lurker", 32.3, 280],
      ["Argyropelecus hemigymnus", 32.3, 280],
      ["Nighttime Reaver", 32.3, 280],
      ["Phosichthys photichthys", 32.3, 280],
      ["Endless Serpent", 32.3, 280],
      ["Polymetme thaumatonectes", 32.3, 280],
      ["Ink Specter", 32.3, 280],
    ],
    epic: [
      ["Omosudis lowei", 303.7, 1000],
      ["Midnight Titan", 303.7, 1000],
      ["Astronesthes longibarba", 303.7, 1000],
      ["Nocturnal Leviathan", 303.7, 1000],
      ["Tactostoma macropus", 303.7, 1000],
      ["Darkness Colossus", 303.7, 1000],
      ["Malacosteus niger", 303.7, 1000],
      ["Void Wraith", 303.7, 1000],
      ["Photichthys spiniceps", 303.7, 1000],
      ["Obsidian Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Prionace glauca", 1500, 7000],
      ["Midnight Gorger", 1500, 7000],
      ["Lamna nasus", 1500, 7000],
      ["Nocturnal Monarchs", 1500, 7000],
      ["Carcharhinus leucas", 1500, 7000],
      ["Darkness Behemoth", 1500, 7000],
      ["Hexanchus griseus", 1500, 7000],
      ["Midnight Destructor", 1500, 7000],
      ["Galeorhinus galeus", 1500, 7000],
      ["Primordial Nightsea King", 1500, 7000],
    ],
    mythic: [
      ["Midniheart", 8000, 88560],
      ["Noctaxis", 8000, 88560],
      ["Midnight", 8000, 88560],
      ["Voidshroud", 8000, 88560],
      ["Darkbringer", 8000, 88560],
      ["Nightborn", 8000, 88560],
      ["Ebon Tide", 8000, 88560],
      ["Starless Soul", 8000, 88560],
      ["Obsidian Crown", 8000, 88560],
      ["Nocturnal Æon", 8000, 88560],
    ],
    secret1: [
      ["Nocturnalis", 44000, 78000],
      ["Midnightian", 70000, 130000],
      ["Nocturnal Æther", 60000, 90000],
    ],
    secret2: [
      ["Void Sublime", 80000, 230000],
      ["Darkness Infinite", 100000, 344000],
    ],
    secret3: [
      ["Midnight Eternal", 545000, 840000],
      ["Nocturnal Soul", 300000, 550000],
      ["Nightbringer", 200000, 340000],
      ["Starless Sovereign", 767000, 1393000],
      ["Timeless Eternus", 987654, 2345678],
    ],
  },

  "Solstice Delta": {
    common: [
      ["Starlit Minnow", 0.3, 1.2],
      ["Aurora Flicker", 0.3, 1.2],
      ["Celestial Dart", 0.3, 1.2],
      ["Cosmic Nibbler", 0.3, 1.2],
      ["Constellation Hopper", 0.3, 1.2],
      ["Nebula Spark", 0.3, 1.2],
      ["Stellar Swimmer", 0.3, 1.2],
      ["Heavens Zest", 0.3, 1.2],
      ["Moonbeam Streamer", 0.3, 1.2],
      ["Starborne Wiggler", 0.3, 1.2],
    ],
    uncommon: [
      ["Galaxias maculatus", 1.5, 30],
      ["Stellar Glider", 1.5, 30],
      ["Retropinna retropinna", 1.5, 30],
      ["Aurora Prowler", 1.5, 30],
      ["Prototroctes maraena", 1.5, 30],
      ["Cosmic Dancer", 1.5, 30],
      ["Lovettia seali", 1.5, 30],
      ["Celestial Guardian", 1.5, 30],
      ["Galaxiella nigrostriata", 1.5, 30],
      ["Starlight Phantom", 1.5, 30],
    ],
    rare: [
      ["Geotria australis", 32.3, 280],
      ["Cosmic Specter", 32.3, 280],
      ["Lampetra planeri", 32.3, 280],
      ["Celestial Lurker", 32.3, 280],
      ["Petromyzon marinus variant", 32.3, 280],
      ["Aurora Reaver", 32.3, 280],
      ["Entosphenus tridentatus", 32.3, 280],
      ["Starborn Serpent", 32.3, 280],
      ["Mordacia mordax", 32.3, 280],
      ["Constellation Specter", 32.3, 280],
    ],
    epic: [
      ["Salmo trutta fario", 303.7, 1000],
      ["Celestial Titan", 303.7, 1000],
      ["Oncorhynchus mykiss", 303.7, 1000],
      ["Stellar Leviathan", 303.7, 1000],
      ["Salvelinus malma variant", 303.7, 1000],
      ["Aurora Colossus", 303.7, 1000],
      ["Hucho taimen aurata", 303.7, 1000],
      ["Cosmic Wraith", 303.7, 1000],
      ["Thymallus thymallus major", 303.7, 1000],
      ["Starfire Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Acipenser sturio variant", 1500, 7000],
      ["Celestial Gorger", 1500, 7000],
      ["Huso huso", 1500, 7000],
      ["Stellar Monarchs", 1500, 7000],
      ["Acipenser oxyrinchus", 1500, 7000],
      ["Aurora Behemoth", 1500, 7000],
      ["Psephurus gladius", 1500, 7000],
      ["Celestial Destructor", 1500, 7000],
      ["Polyodon spathula", 1500, 7000],
      ["Primordial Starway King", 1500, 7000],
    ],
    mythic: [
      ["Stellarise", 8000, 88560],
      ["Aurorheart", 8000, 88560],
      ["Cosmalon", 8000, 88560],
      ["Galaxis", 8000, 88560],
      ["Nebulion", 8000, 88560],
      ["Starborn", 8000, 88560],
      ["Celestyne", 8000, 88560],
      ["Moonveil Soul", 8000, 88560],
      ["Aurora Crown", 8000, 88560],
      ["Cosmic Æon", 8000, 88560],
    ],
    secret1: [
      ["Stellaris", 44000, 78000],
      ["Celestian", 70000, 130000],
      ["Aurora Æther", 60000, 90000],
    ],
    secret2: [
      ["Stellar Sublime", 80000, 230000],
      ["Cosmic Infinite", 100000, 344000],
    ],
    secret3: [
      ["Celestial Eternal", 545000, 840000],
      ["Aurora Soul", 300000, 550000],
      ["Starbringer", 200000, 340000],
      ["Moonlit Sovereign", 767000, 1393000],
      ["Cosmic Eternus", 987654, 2345678],
    ],
  },

  "Whispering Tidepool": {
    common: [
      ["Lunar Minnow", 0.3, 1.2],
      ["Whisper Flicker", 0.3, 1.2],
      ["Moonpool Dart", 0.3, 1.2],
      ["Tidal Nibbler", 0.3, 1.2],
      ["Serene Hopper", 0.3, 1.2],
      ["Quiet Spark", 0.3, 1.2],
      ["Pool Swimmer", 0.3, 1.2],
      ["Mystic Zest", 0.3, 1.2],
      ["Silken Streamer", 0.3, 1.2],
      ["Tide Whisper", 0.3, 1.2],
    ],
    uncommon: [
      ["Hippocampus abdominalis", 1.5, 30],
      ["Moonlit Glider", 1.5, 30],
      ["Syngnathus fuscus", 1.5, 30],
      ["Whispering Prowler", 1.5, 30],
      ["Doryrhamphus dactyliophorus", 1.5, 30],
      ["Tidepool Dancer", 1.5, 30],
      ["Corythoichthys flavofasciatus", 1.5, 30],
      ["Serene Guardian", 1.5, 30],
      ["Nerophis ophidion", 1.5, 30],
      ["Lunar Phantom", 1.5, 30],
    ],
    rare: [
      ["Hippocampus kuda", 32.3, 280],
      ["Moonbeam Specter", 32.3, 280],
      ["Phycodurus eques", 32.3, 280],
      ["Whisper Lurker", 32.3, 280],
      ["Hippocampus suezensis", 32.3, 280],
      ["Tidepool Reaver", 32.3, 280],
      ["Solegnathus spinosissimus", 32.3, 280],
      ["Moonlit Serpent", 32.3, 280],
      ["Hippocampus comes", 32.3, 280],
      ["Silence Specter", 32.3, 280],
    ],
    epic: [
      ["Hippocampus ingens", 303.7, 1000],
      ["Moonpool Titan", 303.7, 1000],
      ["Trachyrhamphus serratus", 303.7, 1000],
      ["Whispering Leviathan", 303.7, 1000],
      ["Hippocampus reidi", 303.7, 1000],
      ["Tidepool Colossus", 303.7, 1000],
      ["Syngnathus acus", 303.7, 1000],
      ["Lunar Wraith", 303.7, 1000],
      ["Hippocampus erectus", 303.7, 1000],
      ["Moonlit Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Hippocampus bargibanti", 1500, 7000],
      ["Whispering Gorger", 1500, 7000],
      ["Syngnathus fulus", 1500, 7000],
      ["Lunar Monarchs", 1500, 7000],
      ["Micrognathus pygmaeus", 1500, 7000],
      ["Tidepool Behemoth", 1500, 7000],
      ["Nerophis acuminatus", 1500, 7000],
      ["Moonpool Destructor", 1500, 7000],
      ["Hippocampus capensis", 1500, 7000],
      ["Primordial Tidepool King", 1500, 7000],
    ],
    mythic: [
      ["Tideheart", 8000, 88560],
      ["Lunaheart", 8000, 88560],
      ["Whisperon", 8000, 88560],
      ["Sereniox", 8000, 88560],
      ["Poolion", 8000, 88560],
      ["Moonborn", 8000, 88560],
      ["Silentide", 8000, 88560],
      ["Tidecall Soul", 8000, 88560],
      ["Moonwhisper Crown", 8000, 88560],
      ["Serenity Æon", 8000, 88560],
    ],
    secret1: [
      ["Tidalian", 44000, 78000],
      ["Lunarion", 70000, 130000],
      ["Whisper Æther", 60000, 90000],
    ],
    secret2: [
      ["Serene Sublime", 80000, 230000],
      ["Moonpool Infinite", 100000, 344000],
    ],
    secret3: [
      ["Tidepool Eternal", 545000, 840000],
      ["Lunar Soul", 300000, 550000],
      ["Whisperbringer", 200000, 340000],
      ["Moonlit Sovereign", 767000, 1393000],
      ["Silence Eternus", 987654, 2345678],
    ],
  },

  "Cinderbloom Marsh": {
    common: [
      ["Ashveil Minnow", 0.3, 1.2],
      ["Ember Flicker", 0.3, 1.2],
      ["Cinder Dart", 0.3, 1.2],
      ["Bloom Nibbler", 0.3, 1.2],
      ["Marsh Hopper", 0.3, 1.2],
      ["Fire Spark", 0.3, 1.2],
      ["Swamp Swimmer", 0.3, 1.2],
      ["Charred Zest", 0.3, 1.2],
      ["Smoke Streamer", 0.3, 1.2],
      ["Fireborn Wiggler", 0.3, 1.2],
    ],
    uncommon: [
      ["Aplocheilus lineatus", 1.5, 30],
      ["Ashpool Glider", 1.5, 30],
      ["Oryzias melastigma", 1.5, 30],
      ["Ember Prowler", 1.5, 30],
      ["Ricefish parvus", 1.5, 30],
      ["Cinder Dancer", 1.5, 30],
      ["Medaka latipes", 1.5, 30],
      ["Bloom Guardian", 1.5, 30],
      ["Haplochilus lineatus", 1.5, 30],
      ["Flame Phantom", 1.5, 30],
    ],
    rare: [
      ["Fundulus grandis", 32.3, 280],
      ["Cinder Specter", 32.3, 280],
      ["Lucania parva", 32.3, 280],
      ["Ashburn Lurker", 32.3, 280],
      ["Jordanella floridae", 32.3, 280],
      ["Bloom Reaver", 32.3, 280],
      ["Rivulus marmoratus", 32.3, 280],
      ["Smoking Serpent", 32.3, 280],
      ["Profundulus punctatus", 32.3, 280],
      ["Charred Specter", 32.3, 280],
    ],
    epic: [
      ["Amia calva", 303.7, 1000],
      ["Ashbloom Titan", 303.7, 1000],
      ["Lepisosteus osseus", 303.7, 1000],
      ["Ember Leviathan", 303.7, 1000],
      ["Acipenser fulvescens", 303.7, 1000],
      ["Marsh Colossus", 303.7, 1000],
      ["Polyodon spathula variant", 303.7, 1000],
      ["Flame Wraith", 303.7, 1000],
      ["Caiman crocodilus", 303.7, 1000],
      ["Ashfire Reaper", 303.7, 1000],
    ],
    legendary: [
      ["Lepisosteus platostomus", 1500, 7000],
      ["Cinder Gorger", 1500, 7000],
      ["Lepisosteus platyrhincus", 1500, 7000],
      ["Bloom Monarchs", 1500, 7000],
      ["Atractosteus spatula", 1500, 7000],
      ["Marsh Behemoth", 1500, 7000],
      ["Atractosteus tristoechus", 1500, 7000],
      ["Marsh Destructor", 1500, 7000],
      ["Crocodylus niloticus", 1500, 7000],
      ["Primordial Ashbloom King", 1500, 7000],
    ],
    mythic: [
      ["Cinderheart", 8000, 88560],
      ["Ashbloom", 8000, 88560],
      ["Emberfion", 8000, 88560],
      ["Swampfire", 8000, 88560],
      ["Cinderion", 8000, 88560],
      ["Bloomborn", 8000, 88560],
      ["Smoketide", 8000, 88560],
      ["Ashfire Soul", 8000, 88560],
      ["Inferno Crown", 8000, 88560],
      ["Volcanic Æon", 8000, 88560],
    ],
    secret1: [
      ["Cinderian", 44000, 78000],
      ["Ashbloomian", 70000, 130000],
      ["Ember Æther", 60000, 90000],
    ],
    secret2: [
      ["Cinder Sublime", 80000, 230000],
      ["Bloom Infinite", 100000, 344000],
    ],
    secret3: [
      ["Marsh Eternal", 545000, 840000],
      ["Ashfire Soul", 300000, 550000],
      ["Emberbringer", 200000, 340000],
      ["Inferno Sovereign", 767000, 1393000],
      ["Primordial Eternus", 987654, 2345678],
    ],
  },
};

// -----------------------------
// Rarity, rewards, economy
// -----------------------------
const rarityOrder = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

// Align display text with intended base odds
const rarityDisplay = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
  secret1: "Secret (~1 in 350k)",
  secret2: "Secret (~1 in 1.2m)",
  secret3: "Secret (~1 in 4.25m)",
};

const rarityColors = {
  common: "#94a3b8", // Slate Gray
  uncommon: "#4ade80", // Lime Green
  rare: "#38bdf8", // Cyan Blue
  epic: "#a78bfa", // Lavender Purple
  legendary: "#fb7185", // Rose Pink
  mythic: "#f472b6", // Hot Pink
  secret1: "#fb923c", // Orange
  secret2: "#fbbf24", // Amber
  secret3: "#fde68a", // Pale Gold
};

const xpRewards = {
  common: 120,
  uncommon: 250,
  rare: 600,
  epic: 1200,
  legendary: 2200,
  mythic: 4000,
  secret1: 6000,
  secret2: 7500,
  secret3: 10000,
};

const sellMultipliers = {
  common: 4,
  uncommon: 9,
  rare: 25,
  epic: 45,
  legendary: 110,
  mythic: 260,
  secret1: 450,
  secret2: 650,
  secret3: 9834,
};

// Base secret odds now match display
const secretOdds = {
  secret1: 1 / 350000,
  secret2: 1 / 1200000,
  secret3: 1 / 4250000,
};

const baseWeights = {
  common: 42,
  uncommon: 24,
  rare: 15,
  epic: 10,
  legendary: 6,
  mythic: 3,
};

// Positive = shifts toward higher rarity; negative = away from it
const luckShift = {
  common: -0.12,
  uncommon: 0.02,
  rare: 0.05,
  epic: 0.08,
  legendary: 0.11,
  mythic: 0.15,
};

// -----------------------------
// State & persistence
// -----------------------------
const defaultState = {
  coins: 1000, // tuned down from 40,000,000
  level: 1,
  xp: 0,
  rod: "Driftwood Rod",
  rodsOwned: ["Driftwood Rod"],
  bait: "Dewdrop Pebble Bait",
  baitsOwned: ["Dewdrop Pebble Bait"],
  location: "Mistvale Lake",
  inventory: [],
};

let state = { ...defaultState };
let fishingTimeout = null;
const SAVE_KEY = "aurora-fishing-save";

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// -----------------------------
// DOM hooks
// -----------------------------
const elements = {
  locationGrid: document.getElementById("location-grid"),
  locationDescription: document.getElementById("location-description"),
  castButton: document.getElementById("cast-button"),
  lastCatch: document.getElementById("last-catch"),
  lineStatus: document.getElementById("line-status"),
  inventoryBody: document.getElementById("inventory-body"),
  rodShop: document.getElementById("rod-shop"),
  baitShop: document.getElementById("bait-shop"),
  log: document.getElementById("activity-log"),
  level: document.getElementById("player-level"),
  coins: document.getElementById("coins"),
  luck: document.getElementById("luck"),
  speed: document.getElementById("speed"),
  capacity: document.getElementById("capacity"),
  xpProgress: document.getElementById("xp-progress"),
  currentXp: document.getElementById("current-xp"),
  nextLevelXp: document.getElementById("next-level-xp"),
  manualSave: document.getElementById("manual-save"),
  exportSave: document.getElementById("export-save"),
  importSave: document.getElementById("import-save"),
  sellSelected: document.getElementById("sell-selected"),
  sellAll: document.getElementById("sell-all"),
};

// -----------------------------
// Utilities (formatting & RNG)
// -----------------------------
function formatCompactNumber(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000)
    return `${(value / 1_000_000_000_000).toFixed(2)}t`;
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}b`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}m`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(2)}k`;
  const isInteger = Number.isInteger(value);
  return value.toLocaleString(undefined, {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function formatCoinValue(value) {
  return formatCompactNumber(value);
}

function formatCoins(value) {
  return `${formatCoinValue(value)} coins`;
}

function formatWeight(weight) {
  if (weight >= 1000) {
    const tons = weight / 1000;
    return `${weight.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} KG (${tons.toFixed(2)} Ton)`;
  }
  return `${weight.toFixed(2)} KG`;
}

function gaussianWeight(min, max) {
  // Box-Muller transform
  const mean = (min + max) / 2;
  const stdDev = (max - min) / 6;
  let u1 = Math.random();
  let u2 = Math.random();
  u1 = u1 === 0 ? 1e-9 : u1;
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const value = mean + z0 * stdDev;
  return Math.min(Math.max(value, min), max);
}

// XP curve
function xpNeededForLevel(level) {
  if (level === 1) return 1000;
  if (level <= 20) return 5000 * level;
  return 10000 * level;
}

// Effective luck normalization
// Convert huge gear numbers into a modest 0..700 band using log scaling,
// so absurd values don't blow up the RNG.
function effectiveLuck() {
  const rodLuck = rods.find((r) => r.name === state.rod)?.luck ?? 0;
  const baitLuck = baits.find((b) => b.name === state.bait)?.luck ?? 0;
  const raw = Math.max(0, rodLuck + baitLuck);
  const eff = Math.log10(1 + raw) * 50; // ~0..700 band
  return Math.min(700, eff);
}

// Legacy name retained for UI update calls
function totalLuck() {
  return Math.round(effectiveLuck());
}

function rodSpeed() {
  return rods.find((r) => r.name === state.rod)?.speed ?? 0;
}

function rodCapacity() {
  return rods.find((r) => r.name === state.rod)?.weight ?? 20;
}

// -----------------------------
// UI helpers
// -----------------------------
function addLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  elements.log.prepend(li);
  while (elements.log.children.length > 30) {
    elements.log.removeChild(elements.log.lastChild);
  }
}

function updateStats() {
  elements.level.textContent = state.level;
  elements.coins.textContent = formatCoinValue(state.coins);
  elements.luck.textContent = `${formatCompactNumber(totalLuck())} pts`; // no %
  elements.speed.textContent = `${formatCompactNumber(rodSpeed())}%`;
  elements.capacity.textContent = `${formatCompactNumber(rodCapacity())} KG`;
  elements.currentXp.textContent = state.xp.toLocaleString();
  const needed = xpNeededForLevel(state.level);
  elements.nextLevelXp.textContent = needed.toLocaleString();
  const percent = Math.min(100, (state.xp / needed) * 100);
  elements.xpProgress.style.width = `${percent}%`;
}

function applyTheme() {
  const loc = locations[state.location];
  if (!loc) return;
  const { bg, accent } = loc.theme;
  document.documentElement.style.setProperty("--bg", bg);
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty(
    "--accent-soft",
    hexToRGBA(accent, 0.2)
  );
}

function hexToRGBA(hex, alpha) {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderLocations() {
  elements.locationGrid.innerHTML = "";
  Object.entries(locations).forEach(([name, info]) => {
    const card = document.createElement("div");
    card.className = "location-card";
    if (state.location === name) card.classList.add("active");
    card.innerHTML = `<h3>${name}</h3><p>${info.description}</p>`;
    card.addEventListener("click", () => {
      state.location = name;
      elements.locationDescription.textContent = info.description;
      renderLocations();
      applyTheme();
      addLog(`Relocated to ${name}. The atmosphere shifts entirely.`);
      saveGame();
    });
    elements.locationGrid.appendChild(card);
  });
  const current = locations[state.location];
  elements.locationDescription.textContent = current ? current.description : "";
}

function createShopItem(item, type) {
  const template = document.getElementById("shop-item-template");
  const node = template.content.cloneNode(true);
  node.querySelector(".item-name").textContent = item.name;

  let meta = "";
  if (type === "rod") {
    meta = `Luck rating ${formatCompactNumber(
      item.luck
    )} · Speed +${formatCompactNumber(
      item.speed
    )}% · Capacity ${formatCompactNumber(item.weight)} KG`;
  } else {
    meta = `${item.rarity} · Luck rating ${formatCompactNumber(item.luck)}`;
  }
  node.querySelector(".item-meta").textContent = meta;
  node.querySelector(".item-cost").textContent = formatCoins(item.cost);
  const button = node.querySelector("button");

  if (type === "rod") {
    if (state.rodsOwned.includes(item.name)) {
      if (state.rod === item.name) {
        button.textContent = "Equipped";
        button.disabled = true;
      } else {
        button.textContent = "Equip";
        button.addEventListener("click", () => equipRod(item.name));
      }
    } else {
      button.textContent = "Purchase";
      button.addEventListener("click", () => purchaseItem(item, type));
    }
  } else {
    if (state.baitsOwned.includes(item.name)) {
      if (state.bait === item.name) {
        button.textContent = "Equipped";
        button.disabled = true;
      } else {
        button.textContent = "Equip";
        button.addEventListener("click", () => equipBait(item.name));
      }
    } else {
      button.textContent = "Purchase";
      button.addEventListener("click", () => purchaseItem(item, type));
    }
  }
  return node;
}

function renderShops() {
  elements.rodShop.innerHTML = "";
  rods.forEach((rod) => {
    elements.rodShop.appendChild(createShopItem(rod, "rod"));
  });
  elements.baitShop.innerHTML = "";
  baits.forEach((bait) => {
    elements.baitShop.appendChild(createShopItem(bait, "bait"));
  });
}

// -----------------------------
// Economy actions
// -----------------------------
function purchaseItem(item, type) {
  if (state.coins < item.cost) {
    addLog("Not enough coins.");
    return;
  }
  state.coins -= item.cost;
  if (type === "rod") {
    if (!state.rodsOwned.includes(item.name)) state.rodsOwned.push(item.name);
    state.rod = item.name;
    addLog(`Purchased and equipped ${item.name}.`);
  } else {
    if (!state.baitsOwned.includes(item.name)) state.baitsOwned.push(item.name);
    state.bait = item.name;
    addLog(`Purchased and equipped ${item.name}.`);
  }
  renderShops();
  updateStats();
  saveGame();
}

function equipRod(name) {
  if (!state.rodsOwned.includes(name)) return;
  state.rod = name;
  addLog(`Equipped ${name}.`);
  renderShops();
  updateStats();
  saveGame();
}

function equipBait(name) {
  if (!state.baitsOwned.includes(name)) return;
  state.bait = name;
  addLog(`Equipped ${name}.`);
  renderShops();
  updateStats();
  saveGame();
}

// -----------------------------
/** Rarity RNG (fixed & balanced)
 * Secrets:
 *   chance = clamp(base + k * effectiveLuck, 0, 10%)
 *   where k is small; bases match display text.
 * Base rarities:
 *   weights = clamp(base + effectiveLuck * shift, 1, base*3)
 */
// -----------------------------
function rollRarity() {
  const L = effectiveLuck(); // 0..700

  // Secrets get small additive boosts (no multiplicative explosion)
  const s3 = Math.min(0.1, secretOdds.secret3 + L * 0.00000025); // up to ~0.17% @ cap
  const s2 = Math.min(0.1, secretOdds.secret2 + L * 0.0000005); // up to ~0.35% @ cap
  const s1 = Math.min(0.1, secretOdds.secret1 + L * 0.000001); // up to ~0.70% @ cap

  let r = Math.random();
  if (r < s3) return "secret3";
  r -= s3;
  if (r < s2) return "secret2";
  r -= s2;
  if (r < s1) return "secret1";

  // Weighted roll for normal rarities with capped influence of luck
  const scores = rarityOrder.map((rarity) => {
    const base = baseWeights[rarity] ?? 1;
    const shift = (luckShift[rarity] ?? 0) * L;
    const score = Math.max(1, Math.min(base * 3, base + shift)); // cap at 3x base
    return { rarity, score };
  });
  const totalScore = scores.reduce((sum, entry) => sum + entry.score, 0);
  let n = Math.random() * totalScore;
  for (const { rarity, score } of scores) {
    if (n < score) return rarity;
    n -= score;
  }
  return "common";
}

function pickFish(rarity) {
  const key = getFishLocationKey(state.location);
  const locationFish = fishDatabase[key];
  if (!locationFish) return null;
  const pool = locationFish[rarity];
  if (!pool || pool.length === 0) return null;
  const [name, min, max] = pool[Math.floor(Math.random() * pool.length)];
  const weight = gaussianWeight(min, max);
  const display = rarityDisplay[rarity] ?? rarity;
  return { name, rarity: display, rarityKey: rarity, weight };
}

// -----------------------------
// Fishing loop
// -----------------------------
function fishOnce() {
  const rarityKey = rollRarity();
  const fish = pickFish(rarityKey);
  if (!fish) {
    addLog("Nothing bit the hook.");
    elements.lastCatch.textContent = "Nothing was reeled in.";
    return;
  }
  const capacity = rodCapacity();
  if (fish.weight > capacity) {
    elements.lastCatch.textContent = `${fish.name} (${formatWeight(
      fish.weight
    )}) snapped the line (capacity ${formatCompactNumber(capacity)} KG).`;
    elements.lineStatus.textContent = "Catch failed - upgrade rod capacity.";
    addLog(`${fish.name} was too heavy for your ${state.rod}.`);
    return;
  }
  const value = Math.round(fish.weight * (sellMultipliers[rarityKey] ?? 1));
  const entry = {
    id: uuid(),
    name: fish.name,
    rarity: fish.rarity,
    rarityKey,
    weight: fish.weight,
    value,
    location: state.location,
  };
  state.inventory.unshift(entry);
  elements.lastCatch.textContent = `Caught ${fish.name} (${
    fish.rarity
  }) weighing ${formatWeight(fish.weight)}.`;
  elements.lineStatus.textContent = "Fish stored in inventory.";
  addLog(`Caught ${fish.name} at ${state.location}.`);
  gainXp(xpRewards[rarityKey] ?? 0);
  renderInventory();
}

function gainXp(amount) {
  state.xp += amount;
  let needed = xpNeededForLevel(state.level);
  while (state.xp >= needed) {
    state.xp -= needed;
    state.level += 1;
    needed = xpNeededForLevel(state.level);
    addLog(`Reached level ${state.level}!`);
  }
  updateStats();
}

// -----------------------------
// Inventory & selling
// -----------------------------
function renderInventory() {
  elements.inventoryBody.innerHTML = "";
  state.inventory.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" data-id="${item.id}" /></td>
      <td>${item.name}</td>
      <td style="color:${rarityColors[item.rarityKey] ?? "#fff"}">${
      item.rarity
    }</td>
      <td>${formatWeight(item.weight)}</td>
      <td>${formatCoins(item.value)}</td>
      <td>${item.location}</td>
    `;
    elements.inventoryBody.appendChild(tr);
  });
}

function sellFish(filterFn) {
  const selling = state.inventory.filter(filterFn);
  if (selling.length === 0) return;
  const earnings = selling.reduce((sum, fish) => sum + fish.value, 0);
  state.inventory = state.inventory.filter((item) => !filterFn(item));
  state.coins += earnings;
  addLog(`Sold ${selling.length} fish for ${formatCoinValue(earnings)} coins!`);
  renderInventory();
  updateStats();
  saveGame();
}

function handleSellSelected() {
  const ids = Array.from(
    elements.inventoryBody.querySelectorAll("input:checked")
  ).map((cb) => cb.dataset.id);
  sellFish((fish) => ids.includes(fish.id));
}

function handleSellAll() {
  sellFish(() => true);
}

// -----------------------------
// Casting & timing
// -----------------------------
function castLine() {
  if (fishingTimeout) return;
  elements.castButton.disabled = true;
  elements.lineStatus.textContent = "Line cast... waiting for a bite.";
  const wait = 4000 / (1 + rodSpeed() / 100);
  fishingTimeout = setTimeout(() => {
    fishingTimeout = null;
    elements.castButton.disabled = false;
    fishOnce();
    saveGame();
  }, Math.max(900, wait)); // 900ms floor
}

// -----------------------------
// Save/load
// -----------------------------
function saveGame() {
  try {
    const data = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, data);
  } catch (e) {
    console.warn("Save failed:", e);
  }
}

function manualSave() {
  saveGame();
  addLog("Manual save complete.");
}

function loadGame() {
  const data = localStorage.getItem(SAVE_KEY);
  if (!data) return;
  try {
    const parsed = JSON.parse(data);
    state = { ...defaultState, ...parsed };
    state.inventory ??= [];
    state.rodsOwned ??= ["Driftwood Rod"];
    state.baitsOwned ??= ["Dewdrop Pebble Bait"];
  } catch (err) {
    console.error("Save corrupted", err);
  }
}

function exportSave() {
  const blob = new Blob([JSON.stringify(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aurora-fishing-save.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importSave(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      state = { ...defaultState, ...data };
      renderLocations();
      renderShops();
      renderInventory();
      updateStats();
      applyTheme();
      saveGame();
      addLog("Save imported successfully.");
    } catch (err) {
      addLog("Import failed: invalid file.");
    }
    elements.importSave.value = "";
  };
  reader.readAsText(file);
}

// -----------------------------
// Bootstrap
// -----------------------------
function restoreUI() {
  renderLocations();
  renderShops();
  renderInventory();
  updateStats();
  applyTheme();
}

function init() {
  loadGame();
  restoreUI();
  elements.castButton.addEventListener("click", castLine);
  elements.manualSave.addEventListener("click", manualSave);
  elements.exportSave.addEventListener("click", exportSave);
  elements.importSave.addEventListener("change", (event) =>
    importSave(event.target.files[0])
  );
  elements.sellSelected.addEventListener("click", handleSellSelected);
  elements.sellAll.addEventListener("click", handleSellAll);
  setInterval(saveGame, 15000);
}

init();
