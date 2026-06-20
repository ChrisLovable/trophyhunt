import type { BulletPreset } from "@/lib/types/ballistics";

// All velocities are manufacturer-quoted from 24" test barrel.
// muzzle_velocity_ms = Math.round(muzzle_velocity_fps * 0.3048)

export const BULLET_PRESETS: BulletPreset[] = [

  // ── .22 LR ──
  { id:"22lr-40-hp",      name:"CCI Mini-Mag 40gr HP",        maker:"CCI",       caliber:".22 LR",          grains:40,  bc_g1:0.130, muzzle_velocity_fps:1235, muzzle_velocity_ms:376,  use_case:"Small Game",        tip_type:"hollow",  color:"#a0a0a0" },
  { id:"22lr-40-sv",      name:"CCI Standard Velocity 40gr",  maker:"CCI",       caliber:".22 LR",          grains:40,  bc_g1:0.138, muzzle_velocity_fps:1070, muzzle_velocity_ms:326,  use_case:"Plinking",          tip_type:"lead",    color:"#909090" },
  { id:"22lr-36-hp",      name:"Federal 36gr HP",             maker:"Federal",   caliber:".22 LR",          grains:36,  bc_g1:0.125, muzzle_velocity_fps:1260, muzzle_velocity_ms:384,  use_case:"Small Game",        tip_type:"hollow",  color:"#a0a0a0" },

  // ── .22 WMR ──
  { id:"22wmr-40-hp",     name:"CCI 40gr HP",                 maker:"CCI",       caliber:".22 WMR",         grains:40,  bc_g1:0.110, muzzle_velocity_fps:1875, muzzle_velocity_ms:572,  use_case:"Varmint",           tip_type:"hollow",  color:"#b0b0b0" },
  { id:"22wmr-50-sp",     name:"Hornady 50gr XTP",            maker:"Hornady",   caliber:".22 WMR",         grains:50,  bc_g1:0.130, muzzle_velocity_fps:1530, muzzle_velocity_ms:466,  use_case:"Varmint",           tip_type:"hollow",  color:"#ff6b35" },

  // ── .222 Rem ──
  { id:"222-50-sp",       name:"Hornady 50gr SP",             maker:"Hornady",   caliber:".222 Rem",        grains:50,  bc_g1:0.238, muzzle_velocity_fps:3140, muzzle_velocity_ms:957,  use_case:"Varmint",           tip_type:"lead",    color:"#c8a96e" },
  { id:"222-55-sp",       name:"Federal 55gr SP",             maker:"Federal",   caliber:".222 Rem",        grains:55,  bc_g1:0.255, muzzle_velocity_fps:3020, muzzle_velocity_ms:920,  use_case:"Varmint",           tip_type:"lead",    color:"#e8c060" },
  { id:"222-50-vmax",     name:"Hornady 50gr V-MAX",          maker:"Hornady",   caliber:".222 Rem",        grains:50,  bc_g1:0.242, muzzle_velocity_fps:3200, muzzle_velocity_ms:975,  use_case:"Varmint",           tip_type:"polymer", color:"#ff6b35" },

  // ── .223 Rem ──
  { id:"223-55-vmax",     name:"Hornady 55gr V-MAX",          maker:"Hornady",   caliber:".223 Rem",        grains:55,  bc_g1:0.255, muzzle_velocity_fps:3240, muzzle_velocity_ms:988,  use_case:"Varmint",           tip_type:"polymer", color:"#ff6b35" },
  { id:"223-55-fmj",      name:"Federal 55gr FMJ",            maker:"Federal",   caliber:".223 Rem",        grains:55,  bc_g1:0.243, muzzle_velocity_fps:3240, muzzle_velocity_ms:988,  use_case:"Varmint/Range",     tip_type:"lead",    color:"#a0a0a0" },
  { id:"223-69-smk",      name:"Sierra 69gr MatchKing",       maker:"Sierra",    caliber:".223 Rem",        grains:69,  bc_g1:0.301, muzzle_velocity_fps:2950, muzzle_velocity_ms:899,  use_case:"Target/Varmint",    tip_type:"hollow",  color:"#7ab0e0" },
  { id:"223-77-smk",      name:"Sierra 77gr MatchKing",       maker:"Sierra",    caliber:".223 Rem",        grains:77,  bc_g1:0.362, muzzle_velocity_fps:2750, muzzle_velocity_ms:838,  use_case:"Long Range",        tip_type:"hollow",  color:"#7ab0e0" },

  // ── .22-250 Rem ──
  { id:"22250-55-vmax",   name:"Hornady 55gr V-MAX",          maker:"Hornady",   caliber:".22-250 Rem",     grains:55,  bc_g1:0.255, muzzle_velocity_fps:3680, muzzle_velocity_ms:1122, use_case:"Varmint",           tip_type:"polymer", color:"#ff6b35" },
  { id:"22250-50-vmax",   name:"Hornady 50gr V-MAX",          maker:"Hornady",   caliber:".22-250 Rem",     grains:50,  bc_g1:0.242, muzzle_velocity_fps:3800, muzzle_velocity_ms:1158, use_case:"Varmint",           tip_type:"polymer", color:"#ff6b35" },
  { id:"22250-55-sp",     name:"Nosler 55gr BT",              maker:"Nosler",    caliber:".22-250 Rem",     grains:55,  bc_g1:0.267, muzzle_velocity_fps:3650, muzzle_velocity_ms:1113, use_case:"Varmint",           tip_type:"polymer", color:"#c8a96e" },

  // ── .243 Win ──
  { id:"243-55-vmax",     name:"Hornady 55gr V-MAX",          maker:"Hornady",   caliber:".243 Win",        grains:55,  bc_g1:0.267, muzzle_velocity_fps:3750, muzzle_velocity_ms:1143, use_case:"Varmint",           tip_type:"polymer", color:"#ff6b35" },
  { id:"243-95-sst",      name:"Hornady 95gr SST",            maker:"Hornady",   caliber:".243 Win",        grains:95,  bc_g1:0.355, muzzle_velocity_fps:3090, muzzle_velocity_ms:942,  use_case:"Light Game",        tip_type:"polymer", color:"#ff4444" },
  { id:"243-100-part",    name:"Nosler 100gr Partition",      maker:"Nosler",    caliber:".243 Win",        grains:100, bc_g1:0.356, muzzle_velocity_fps:2960, muzzle_velocity_ms:902,  use_case:"Light Plains Game", tip_type:"lead",    color:"#c8a96e" },
  { id:"243-100-bt",      name:"Nosler 100gr Ballistic Tip",  maker:"Nosler",    caliber:".243 Win",        grains:100, bc_g1:0.384, muzzle_velocity_fps:2960, muzzle_velocity_ms:902,  use_case:"Plains Game",       tip_type:"polymer", color:"#7ab0e0" },

  // ── 6mm Rem ──
  { id:"6mm-100-part",    name:"Nosler 100gr Partition",      maker:"Nosler",    caliber:"6mm Rem",         grains:100, bc_g1:0.356, muzzle_velocity_fps:3100, muzzle_velocity_ms:945,  use_case:"Light Game",        tip_type:"lead",    color:"#c8a96e" },
  { id:"6mm-95-sst",      name:"Hornady 95gr SST",            maker:"Hornady",   caliber:"6mm Rem",         grains:95,  bc_g1:0.355, muzzle_velocity_fps:3150, muzzle_velocity_ms:960,  use_case:"Light Game",        tip_type:"polymer", color:"#ff6b35" },

  // ── 6.5 Creedmoor ──
  { id:"65cm-140-eldx",   name:"Hornady 140gr ELD-X",         maker:"Hornady",   caliber:"6.5 Creedmoor",   grains:140, bc_g1:0.610, muzzle_velocity_fps:2710, muzzle_velocity_ms:826,  use_case:"Plains Game",       tip_type:"polymer", color:"#ff6b35" },
  { id:"65cm-143-eldx",   name:"Hornady 143gr ELD-X",         maker:"Hornady",   caliber:"6.5 Creedmoor",   grains:143, bc_g1:0.625, muzzle_velocity_fps:2700, muzzle_velocity_ms:823,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },
  { id:"65cm-140-ab",     name:"Nosler 140gr AccuBond",       maker:"Nosler",    caliber:"6.5 Creedmoor",   grains:140, bc_g1:0.509, muzzle_velocity_fps:2710, muzzle_velocity_ms:826,  use_case:"Plains Game",       tip_type:"polymer", color:"#7ab0e0" },
  { id:"65cm-130-part",   name:"Nosler 130gr Partition",      maker:"Nosler",    caliber:"6.5 Creedmoor",   grains:130, bc_g1:0.448, muzzle_velocity_fps:2875, muzzle_velocity_ms:876,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },
  { id:"65cm-120-ttsx",   name:"Barnes 120gr TTSX",           maker:"Barnes",    caliber:"6.5 Creedmoor",   grains:120, bc_g1:0.430, muzzle_velocity_fps:2960, muzzle_velocity_ms:902,  use_case:"Plains Game",       tip_type:"solid",   color:"#c87040" },

  // ── 6.5x55 Swedish ──
  { id:"6555-140-part",   name:"Nosler 140gr Partition",      maker:"Nosler",    caliber:"6.5x55 Swedish",  grains:140, bc_g1:0.490, muzzle_velocity_fps:2625, muzzle_velocity_ms:800,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },
  { id:"6555-156-oryx",   name:"Norma 156gr Oryx",            maker:"Norma",     caliber:"6.5x55 Swedish",  grains:156, bc_g1:0.480, muzzle_velocity_fps:2559, muzzle_velocity_ms:780,  use_case:"Large Plains Game", tip_type:"lead",    color:"#50c878" },
  { id:"6555-139-eldx",   name:"Hornady 139gr ELD-X",         maker:"Hornady",   caliber:"6.5x55 Swedish",  grains:139, bc_g1:0.614, muzzle_velocity_fps:2740, muzzle_velocity_ms:835,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },

  // ── 6.5 PRC ──
  { id:"65prc-143-eldx",  name:"Hornady 143gr ELD-X",         maker:"Hornady",   caliber:"6.5 PRC",         grains:143, bc_g1:0.625, muzzle_velocity_fps:2960, muzzle_velocity_ms:902,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },
  { id:"65prc-147-eldm",  name:"Hornady 147gr ELD-M",         maker:"Hornady",   caliber:"6.5 PRC",         grains:147, bc_g1:0.697, muzzle_velocity_fps:2930, muzzle_velocity_ms:893,  use_case:"Extreme Long Range",tip_type:"hollow",  color:"#9060c0" },

  // ── .257 Roberts ──
  { id:"257-117-part",    name:"Nosler 117gr Partition",      maker:"Nosler",    caliber:".257 Roberts",    grains:117, bc_g1:0.391, muzzle_velocity_fps:2780, muzzle_velocity_ms:847,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },
  { id:"257-100-bt",      name:"Nosler 100gr BT",             maker:"Nosler",    caliber:".257 Roberts",    grains:100, bc_g1:0.357, muzzle_velocity_fps:2900, muzzle_velocity_ms:884,  use_case:"Light Game",        tip_type:"polymer", color:"#7ab0e0" },

  // ── .260 Rem ──
  { id:"260-140-ab",      name:"Nosler 140gr AccuBond",       maker:"Nosler",    caliber:".260 Rem",        grains:140, bc_g1:0.509, muzzle_velocity_fps:2750, muzzle_velocity_ms:838,  use_case:"Plains Game",       tip_type:"polymer", color:"#7ab0e0" },
  { id:"260-130-part",    name:"Nosler 130gr Partition",      maker:"Nosler",    caliber:".260 Rem",        grains:130, bc_g1:0.448, muzzle_velocity_fps:2875, muzzle_velocity_ms:876,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },

  // ── .270 Win ──
  { id:"270-130-part",    name:"Nosler 130gr Partition",      maker:"Nosler",    caliber:".270 Win",        grains:130, bc_g1:0.416, muzzle_velocity_fps:3050, muzzle_velocity_ms:930,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },
  { id:"270-140-ab",      name:"Nosler 140gr AccuBond",       maker:"Nosler",    caliber:".270 Win",        grains:140, bc_g1:0.496, muzzle_velocity_fps:2980, muzzle_velocity_ms:908,  use_case:"All Game",          tip_type:"polymer", color:"#7ab0e0" },
  { id:"270-150-part",    name:"Nosler 150gr Partition",      maker:"Nosler",    caliber:".270 Win",        grains:150, bc_g1:0.465, muzzle_velocity_fps:2850, muzzle_velocity_ms:869,  use_case:"Large Plains",      tip_type:"lead",    color:"#c8a96e" },
  { id:"270-130-sst",     name:"Hornady 130gr SST",           maker:"Hornady",   caliber:".270 Win",        grains:130, bc_g1:0.424, muzzle_velocity_fps:3060, muzzle_velocity_ms:933,  use_case:"Plains Game",       tip_type:"polymer", color:"#ff6b35" },
  { id:"270-145-eldx",    name:"Hornady 145gr ELD-X",         maker:"Hornady",   caliber:".270 Win",        grains:145, bc_g1:0.536, muzzle_velocity_fps:2970, muzzle_velocity_ms:905,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },
  { id:"270-130-ttsx",    name:"Barnes 130gr TTSX",           maker:"Barnes",    caliber:".270 Win",        grains:130, bc_g1:0.392, muzzle_velocity_fps:3060, muzzle_velocity_ms:933,  use_case:"All Game",          tip_type:"solid",   color:"#c87040" },

  // ── .270 WSM ──
  { id:"270wsm-140-ab",   name:"Nosler 140gr AccuBond",       maker:"Nosler",    caliber:".270 WSM",        grains:140, bc_g1:0.496, muzzle_velocity_fps:3125, muzzle_velocity_ms:953,  use_case:"All Game",          tip_type:"polymer", color:"#7ab0e0" },
  { id:"270wsm-150-part", name:"Nosler 150gr Partition",      maker:"Nosler",    caliber:".270 WSM",        grains:150, bc_g1:0.465, muzzle_velocity_fps:3000, muzzle_velocity_ms:914,  use_case:"Large Game",        tip_type:"lead",    color:"#c8a96e" },

  // ── 7x57 Mauser ──
  { id:"7x57-140-part",   name:"Nosler 140gr Partition",      maker:"Nosler",    caliber:"7x57 Mauser",     grains:140, bc_g1:0.490, muzzle_velocity_fps:2750, muzzle_velocity_ms:838,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },
  { id:"7x57-154-oryx",   name:"Norma 154gr Oryx",            maker:"Norma",     caliber:"7x57 Mauser",     grains:154, bc_g1:0.480, muzzle_velocity_fps:2690, muzzle_velocity_ms:820,  use_case:"Large Plains",      tip_type:"lead",    color:"#50c878" },
  { id:"7x57-175-sp",     name:"Federal 175gr SP",            maker:"Federal",   caliber:"7x57 Mauser",     grains:175, bc_g1:0.440, muzzle_velocity_fps:2440, muzzle_velocity_ms:744,  use_case:"Large Game",        tip_type:"lead",    color:"#e8c060" },

  // ── 7mm-08 Rem ──
  { id:"708-140-part",    name:"Nosler 140gr Partition",      maker:"Nosler",    caliber:"7mm-08 Rem",      grains:140, bc_g1:0.490, muzzle_velocity_fps:2800, muzzle_velocity_ms:853,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },
  { id:"708-140-ab",      name:"Nosler 140gr AccuBond",       maker:"Nosler",    caliber:"7mm-08 Rem",      grains:140, bc_g1:0.509, muzzle_velocity_fps:2800, muzzle_velocity_ms:853,  use_case:"All Game",          tip_type:"polymer", color:"#7ab0e0" },
  { id:"708-139-eldx",    name:"Hornady 139gr ELD-X",         maker:"Hornady",   caliber:"7mm-08 Rem",      grains:139, bc_g1:0.486, muzzle_velocity_fps:2850, muzzle_velocity_ms:869,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },

  // ── 7mm Rem Mag ──
  { id:"7rm-160-ab",      name:"Nosler 160gr AccuBond",       maker:"Nosler",    caliber:"7mm Rem Mag",     grains:160, bc_g1:0.531, muzzle_velocity_fps:3050, muzzle_velocity_ms:930,  use_case:"All Game",          tip_type:"polymer", color:"#7ab0e0" },
  { id:"7rm-162-eldx",    name:"Hornady 162gr ELD-X",         maker:"Hornady",   caliber:"7mm Rem Mag",     grains:162, bc_g1:0.631, muzzle_velocity_fps:2940, muzzle_velocity_ms:896,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },
  { id:"7rm-175-ab",      name:"Nosler 175gr AccuBond",       maker:"Nosler",    caliber:"7mm Rem Mag",     grains:175, bc_g1:0.620, muzzle_velocity_fps:2860, muzzle_velocity_ms:872,  use_case:"Large Game",        tip_type:"polymer", color:"#7ab0e0" },
  { id:"7rm-140-part",    name:"Nosler 140gr Partition",      maker:"Nosler",    caliber:"7mm Rem Mag",     grains:140, bc_g1:0.464, muzzle_velocity_fps:3125, muzzle_velocity_ms:953,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },
  { id:"7rm-150-ttsx",    name:"Barnes 150gr TTSX",           maker:"Barnes",    caliber:"7mm Rem Mag",     grains:150, bc_g1:0.459, muzzle_velocity_fps:3100, muzzle_velocity_ms:945,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },

  // ── 7mm WSM ──
  { id:"7wsm-160-ab",     name:"Nosler 160gr AccuBond",       maker:"Nosler",    caliber:"7mm WSM",         grains:160, bc_g1:0.531, muzzle_velocity_fps:3100, muzzle_velocity_ms:945,  use_case:"All Game",          tip_type:"polymer", color:"#7ab0e0" },
  { id:"7wsm-140-part",   name:"Nosler 140gr Partition",      maker:"Nosler",    caliber:"7mm WSM",         grains:140, bc_g1:0.464, muzzle_velocity_fps:3250, muzzle_velocity_ms:991,  use_case:"Plains Game",       tip_type:"lead",    color:"#c8a96e" },

  // ── .28 Nosler ──
  { id:"28nos-175-ab",    name:"Nosler 175gr AccuBond LR",    maker:"Nosler",    caliber:".28 Nosler",      grains:175, bc_g1:0.672, muzzle_velocity_fps:3125, muzzle_velocity_ms:953,  use_case:"Extreme Long Range",tip_type:"polymer", color:"#7ab0e0" },
  { id:"28nos-160-ab",    name:"Nosler 160gr AccuBond",       maker:"Nosler",    caliber:".28 Nosler",      grains:160, bc_g1:0.531, muzzle_velocity_fps:3300, muzzle_velocity_ms:1006, use_case:"Long Range",        tip_type:"polymer", color:"#7ab0e0" },

  // ── .308 Win ──
  { id:"308-150-psp",     name:"Federal 150gr Power-Shok",    maker:"Federal",   caliber:".308 Win",        grains:150, bc_g1:0.338, muzzle_velocity_fps:2820, muzzle_velocity_ms:860,  use_case:"Entry Level",       tip_type:"lead",    color:"#a09880" },
  { id:"308-165-tbt",     name:"Federal 165gr Trophy Bonded", maker:"Federal",   caliber:".308 Win",        grains:165, bc_g1:0.435, muzzle_velocity_fps:2670, muzzle_velocity_ms:814,  use_case:"Medium Game",       tip_type:"polymer", color:"#e8c060" },
  { id:"308-168-eldm",    name:"Hornady 168gr ELD-M",         maker:"Hornady",   caliber:".308 Win",        grains:168, bc_g1:0.523, muzzle_velocity_fps:2650, muzzle_velocity_ms:808,  use_case:"Long Range Target", tip_type:"hollow",  color:"#9060c0" },
  { id:"308-178-eldx",    name:"Hornady 178gr ELD-X",         maker:"Hornady",   caliber:".308 Win",        grains:178, bc_g1:0.552, muzzle_velocity_fps:2600, muzzle_velocity_ms:792,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },
  { id:"308-165-part",    name:"Nosler 165gr Partition",      maker:"Nosler",    caliber:".308 Win",        grains:165, bc_g1:0.433, muzzle_velocity_fps:2700, muzzle_velocity_ms:823,  use_case:"Large Game",        tip_type:"lead",    color:"#c8a96e" },
  { id:"308-150-ttsx",    name:"Barnes 150gr TTSX",           maker:"Barnes",    caliber:".308 Win",        grains:150, bc_g1:0.398, muzzle_velocity_fps:2820, muzzle_velocity_ms:860,  use_case:"All Game",          tip_type:"solid",   color:"#c87040" },

  // ── .30-06 Springfield ──
  { id:"3006-150-sst",    name:"Hornady 150gr SST",           maker:"Hornady",   caliber:".30-06",          grains:150, bc_g1:0.415, muzzle_velocity_fps:2910, muzzle_velocity_ms:887,  use_case:"Plains Game",       tip_type:"polymer", color:"#ff6b35" },
  { id:"3006-165-sst",    name:"Hornady 165gr SST",           maker:"Hornady",   caliber:".30-06",          grains:165, bc_g1:0.447, muzzle_velocity_fps:2800, muzzle_velocity_ms:853,  use_case:"Plains Game",       tip_type:"polymer", color:"#ff6b35" },
  { id:"3006-180-part",   name:"Nosler 180gr Partition",      maker:"Nosler",    caliber:".30-06",          grains:180, bc_g1:0.481, muzzle_velocity_fps:2700, muzzle_velocity_ms:823,  use_case:"Large Game",        tip_type:"lead",    color:"#c8a96e" },
  { id:"3006-180-tbt",    name:"Federal 180gr Trophy Bonded", maker:"Federal",   caliber:".30-06",          grains:180, bc_g1:0.500, muzzle_velocity_fps:2700, muzzle_velocity_ms:823,  use_case:"Big Game",          tip_type:"polymer", color:"#50c878" },
  { id:"3006-165-ttsx",   name:"Barnes 165gr TTSX",           maker:"Barnes",    caliber:".30-06",          grains:165, bc_g1:0.420, muzzle_velocity_fps:2800, muzzle_velocity_ms:853,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"3006-200-ab",     name:"Nosler 200gr AccuBond",       maker:"Nosler",    caliber:".30-06",          grains:200, bc_g1:0.588, muzzle_velocity_fps:2625, muzzle_velocity_ms:800,  use_case:"Heavy Game",        tip_type:"polymer", color:"#7ab0e0" },

  // ── .303 British ──
  { id:"303-150-sp",      name:"Federal 150gr SP",            maker:"Federal",   caliber:".303 British",    grains:150, bc_g1:0.318, muzzle_velocity_fps:2690, muzzle_velocity_ms:820,  use_case:"Plains Game",       tip_type:"lead",    color:"#a09880" },
  { id:"303-180-sp",      name:"Sellier 180gr SP",            maker:"S&B",       caliber:".303 British",    grains:180, bc_g1:0.350, muzzle_velocity_fps:2460, muzzle_velocity_ms:750,  use_case:"Large Game",        tip_type:"lead",    color:"#a09880" },
  { id:"303-174-fmj",     name:"PPU 174gr FMJ",               maker:"PPU",       caliber:".303 British",    grains:174, bc_g1:0.360, muzzle_velocity_fps:2540, muzzle_velocity_ms:774,  use_case:"Range/Hunting",     tip_type:"lead",    color:"#909090" },

  // ── 8x57 Mauser ──
  { id:"8x57-196-oryx",   name:"Norma 196gr Oryx",            maker:"Norma",     caliber:"8x57 Mauser",     grains:196, bc_g1:0.480, muzzle_velocity_fps:2526, muzzle_velocity_ms:770,  use_case:"Large Game",        tip_type:"lead",    color:"#50c878" },
  { id:"8x57-170-sp",     name:"Federal 170gr SP",            maker:"Federal",   caliber:"8x57 Mauser",     grains:170, bc_g1:0.390, muzzle_velocity_fps:2360, muzzle_velocity_ms:719,  use_case:"Plains Game",       tip_type:"lead",    color:"#e8c060" },
  { id:"8x57-200-rws",    name:"RWS 200gr H-Mantel",          maker:"RWS",       caliber:"8x57 Mauser",     grains:200, bc_g1:0.420, muzzle_velocity_fps:2526, muzzle_velocity_ms:770,  use_case:"Large Game",        tip_type:"lead",    color:"#a09880" },

  // ── .300 WSM ──
  { id:"300wsm-180-part", name:"Nosler 180gr Partition",      maker:"Nosler",    caliber:".300 WSM",        grains:180, bc_g1:0.481, muzzle_velocity_fps:2970, muzzle_velocity_ms:905,  use_case:"Large Game",        tip_type:"lead",    color:"#c8a96e" },
  { id:"300wsm-180-ab",   name:"Nosler 180gr AccuBond",       maker:"Nosler",    caliber:".300 WSM",        grains:180, bc_g1:0.507, muzzle_velocity_fps:2970, muzzle_velocity_ms:905,  use_case:"All Game",          tip_type:"polymer", color:"#7ab0e0" },
  { id:"300wsm-165-ttsx", name:"Barnes 165gr TTSX",           maker:"Barnes",    caliber:".300 WSM",        grains:165, bc_g1:0.420, muzzle_velocity_fps:3100, muzzle_velocity_ms:945,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },

  // ── .300 Win Mag ──
  { id:"300wm-178-eldx",  name:"Hornady 178gr ELD-X",         maker:"Hornady",   caliber:".300 Win Mag",    grains:178, bc_g1:0.552, muzzle_velocity_fps:2960, muzzle_velocity_ms:902,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },
  { id:"300wm-180-tbt",   name:"Federal 180gr Trophy Bonded", maker:"Federal",   caliber:".300 Win Mag",    grains:180, bc_g1:0.500, muzzle_velocity_fps:2960, muzzle_velocity_ms:902,  use_case:"Big Game",          tip_type:"polymer", color:"#50c878" },
  { id:"300wm-180-ttsx",  name:"Barnes 180gr TTSX",           maker:"Barnes",    caliber:".300 Win Mag",    grains:180, bc_g1:0.484, muzzle_velocity_fps:2960, muzzle_velocity_ms:902,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"300wm-200-ab",    name:"Nosler 200gr AccuBond",       maker:"Nosler",    caliber:".300 Win Mag",    grains:200, bc_g1:0.588, muzzle_velocity_fps:2800, muzzle_velocity_ms:853,  use_case:"Heavy Game",        tip_type:"polymer", color:"#7ab0e0" },
  { id:"300wm-220-rn",    name:"Nosler 220gr RN Partition",   maker:"Nosler",    caliber:".300 Win Mag",    grains:220, bc_g1:0.400, muzzle_velocity_fps:2700, muzzle_velocity_ms:823,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#c8a96e" },

  // ── .300 PRC ──
  { id:"300prc-212-eldx", name:"Hornady 212gr ELD-X",         maker:"Hornady",   caliber:".300 PRC",        grains:212, bc_g1:0.673, muzzle_velocity_fps:2860, muzzle_velocity_ms:872,  use_case:"Extreme Long Range",tip_type:"polymer", color:"#ff6b35" },
  { id:"300prc-225-eldm", name:"Hornady 225gr ELD-M",         maker:"Hornady",   caliber:".300 PRC",        grains:225, bc_g1:0.777, muzzle_velocity_fps:2800, muzzle_velocity_ms:853,  use_case:"Extreme Long Range",tip_type:"hollow",  color:"#9060c0" },

  // ── .338 Win Mag ──
  { id:"338wm-225-part",  name:"Nosler 225gr Partition",      maker:"Nosler",    caliber:".338 Win Mag",    grains:225, bc_g1:0.550, muzzle_velocity_fps:2780, muzzle_velocity_ms:847,  use_case:"Large Dangerous",   tip_type:"lead",    color:"#c8a96e" },
  { id:"338wm-250-part",  name:"Nosler 250gr Partition",      maker:"Nosler",    caliber:".338 Win Mag",    grains:250, bc_g1:0.480, muzzle_velocity_fps:2660, muzzle_velocity_ms:811,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#c8a96e" },
  { id:"338wm-225-ttsx",  name:"Barnes 225gr TTSX",           maker:"Barnes",    caliber:".338 Win Mag",    grains:225, bc_g1:0.452, muzzle_velocity_fps:2780, muzzle_velocity_ms:847,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },

  // ── .338 Lapua Mag ──
  { id:"338l-250-sc",     name:"Lapua 250gr Scenar",          maker:"Lapua",     caliber:".338 Lapua Mag",  grains:250, bc_g1:0.675, muzzle_velocity_fps:2970, muzzle_velocity_ms:905,  use_case:"Extreme Range",     tip_type:"hollow",  color:"#9060c0" },
  { id:"338l-300-ttsx",   name:"Barnes 300gr TTSX",           maker:"Barnes",    caliber:".338 Lapua Mag",  grains:300, bc_g1:0.768, muzzle_velocity_fps:2750, muzzle_velocity_ms:838,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"338l-285-eldm",   name:"Hornady 285gr ELD-M",         maker:"Hornady",   caliber:".338 Lapua Mag",  grains:285, bc_g1:0.789, muzzle_velocity_fps:2745, muzzle_velocity_ms:837,  use_case:"Extreme Long Range",tip_type:"hollow",  color:"#9060c0" },

  // ── .340 Wby Mag ──
  { id:"340wby-250-part", name:"Nosler 250gr Partition",      maker:"Nosler",    caliber:".340 Wby Mag",    grains:250, bc_g1:0.480, muzzle_velocity_fps:2850, muzzle_velocity_ms:869,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#c8a96e" },
  { id:"340wby-225-ttsx", name:"Barnes 225gr TTSX",           maker:"Barnes",    caliber:".340 Wby Mag",    grains:225, bc_g1:0.452, muzzle_velocity_fps:2950, muzzle_velocity_ms:899,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },

  // ── .375 H&H Magnum ──
  { id:"375hh-300-ttsx",  name:"Barnes 300gr TTSX",           maker:"Barnes",    caliber:".375 H&H Mag",    grains:300, bc_g1:0.398, muzzle_velocity_fps:2530, muzzle_velocity_ms:771,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"375hh-300-solid", name:"Woodleigh 300gr Solid",       maker:"Woodleigh", caliber:".375 H&H Mag",    grains:300, bc_g1:0.338, muzzle_velocity_fps:2530, muzzle_velocity_ms:771,  use_case:"Buffalo/Elephant",  tip_type:"solid",   color:"#808080" },
  { id:"375hh-270-sp",    name:"Federal 270gr SP",            maker:"Federal",   caliber:".375 H&H Mag",    grains:270, bc_g1:0.390, muzzle_velocity_fps:2690, muzzle_velocity_ms:820,  use_case:"Large Dangerous",   tip_type:"lead",    color:"#e8c060" },
  { id:"375hh-300-part",  name:"Nosler 300gr Partition",      maker:"Nosler",    caliber:".375 H&H Mag",    grains:300, bc_g1:0.364, muzzle_velocity_fps:2530, muzzle_velocity_ms:771,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#c8a96e" },

  // ── .375 Ruger ──
  { id:"375rug-300-ttsx", name:"Barnes 300gr TTSX",           maker:"Barnes",    caliber:".375 Ruger",      grains:300, bc_g1:0.398, muzzle_velocity_fps:2660, muzzle_velocity_ms:811,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"375rug-270-sp",   name:"Hornady 270gr SP",            maker:"Hornady",   caliber:".375 Ruger",      grains:270, bc_g1:0.398, muzzle_velocity_fps:2840, muzzle_velocity_ms:866,  use_case:"Large Dangerous",   tip_type:"lead",    color:"#ff6b35" },

  // ── .404 Jeffery ──
  { id:"404j-400-solid",  name:"Woodleigh 400gr Solid",       maker:"Woodleigh", caliber:".404 Jeffery",    grains:400, bc_g1:0.360, muzzle_velocity_fps:2150, muzzle_velocity_ms:655,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#808080" },
  { id:"404j-400-sp",     name:"Norma 400gr SP",              maker:"Norma",     caliber:".404 Jeffery",    grains:400, bc_g1:0.338, muzzle_velocity_fps:2150, muzzle_velocity_ms:655,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#50c878" },

  // ── .416 Rem Mag ──
  { id:"416rm-400-ttsx",  name:"Barnes 400gr TTSX",           maker:"Barnes",    caliber:".416 Rem Mag",    grains:400, bc_g1:0.380, muzzle_velocity_fps:2400, muzzle_velocity_ms:732,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"416rm-400-solid", name:"Woodleigh 400gr Solid",       maker:"Woodleigh", caliber:".416 Rem Mag",    grains:400, bc_g1:0.340, muzzle_velocity_fps:2400, muzzle_velocity_ms:732,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#808080" },

  // ── .416 Rigby ──
  { id:"416rig-400-ttsx", name:"Barnes 400gr TTSX",           maker:"Barnes",    caliber:".416 Rigby",      grains:400, bc_g1:0.380, muzzle_velocity_fps:2370, muzzle_velocity_ms:722,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"416rig-400-solid",name:"Woodleigh 400gr Solid",       maker:"Woodleigh", caliber:".416 Rigby",      grains:400, bc_g1:0.340, muzzle_velocity_fps:2370, muzzle_velocity_ms:722,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#808080" },

  // ── .458 Win Mag ──
  { id:"458wm-500-ttsx",  name:"Barnes 500gr TTSX",           maker:"Barnes",    caliber:".458 Win Mag",    grains:500, bc_g1:0.360, muzzle_velocity_fps:2090, muzzle_velocity_ms:637,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"458wm-500-solid", name:"Woodleigh 500gr Solid",       maker:"Woodleigh", caliber:".458 Win Mag",    grains:500, bc_g1:0.318, muzzle_velocity_fps:2050, muzzle_velocity_ms:625,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#808080" },

  // ── .458 Lott ──
  { id:"458lott-500-ttsx", name:"Barnes 500gr TTSX",          maker:"Barnes",    caliber:".458 Lott",       grains:500, bc_g1:0.360, muzzle_velocity_fps:2300, muzzle_velocity_ms:701,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#c87040" },
  { id:"458lott-500-solid",name:"Woodleigh 500gr Solid",      maker:"Woodleigh", caliber:".458 Lott",       grains:500, bc_g1:0.318, muzzle_velocity_fps:2250, muzzle_velocity_ms:686,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#808080" },

  // ── .470 Nitro Express ──
  { id:"470ne-500-solid",  name:"Woodleigh 500gr Solid",      maker:"Woodleigh", caliber:".470 Nitro Exp",  grains:500, bc_g1:0.318, muzzle_velocity_fps:2150, muzzle_velocity_ms:655,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#808080" },
  { id:"470ne-500-sp",     name:"Hornady 500gr DGX",          maker:"Hornady",   caliber:".470 Nitro Exp",  grains:500, bc_g1:0.330, muzzle_velocity_fps:2150, muzzle_velocity_ms:655,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#ff6b35" },

  // ── .500 Nitro Express ──
  { id:"500ne-570-solid",  name:"Woodleigh 570gr Solid",      maker:"Woodleigh", caliber:".500 Nitro Exp",  grains:570, bc_g1:0.295, muzzle_velocity_fps:2150, muzzle_velocity_ms:655,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#808080" },
  { id:"500ne-570-sp",     name:"Hornady 570gr DGX",          maker:"Hornady",   caliber:".500 Nitro Exp",  grains:570, bc_g1:0.310, muzzle_velocity_fps:2150, muzzle_velocity_ms:655,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#ff6b35" },

  // ── 7x64 Brenneke ──
  { id:"7x64-140-part",    name:"Nosler 140gr Partition",         maker:"Nosler",  caliber:"7x64 Brenneke",  grains:140, bc_g1:0.490, muzzle_velocity_fps:2953, muzzle_velocity_ms:900,  use_case:"All Game",          tip_type:"lead",    color:"#c8a96e" },
  { id:"7x64-150-pmp",     name:"PMP ProAmm 150gr SP",            maker:"PMP",     caliber:"7x64 Brenneke",  grains:150, bc_g1:0.469, muzzle_velocity_fps:2887, muzzle_velocity_ms:880,  use_case:"Plains Game",       tip_type:"lead",    color:"#50c878" },
  { id:"7x64-154-oryx",    name:"Norma 154gr Oryx",               maker:"Norma",   caliber:"7x64 Brenneke",  grains:154, bc_g1:0.480, muzzle_velocity_fps:2822, muzzle_velocity_ms:860,  use_case:"Large Plains",      tip_type:"lead",    color:"#50c878" },
  { id:"7x64-162-eldx",    name:"Hornady 162gr ELD-X",            maker:"Hornady", caliber:"7x64 Brenneke",  grains:162, bc_g1:0.550, muzzle_velocity_fps:2789, muzzle_velocity_ms:850,  use_case:"Long Range",        tip_type:"polymer", color:"#ff6b35" },

  // ── PMP ProAmm ──
  { id:"222-55-pmp",       name:"PMP ProAmm 55gr SP",             maker:"PMP",     caliber:".222 Rem",       grains:55,  bc_g1:0.245, muzzle_velocity_fps:3051, muzzle_velocity_ms:930,  use_case:"Varmint",           tip_type:"lead",    color:"#50c878" },
  { id:"243-100-pmp",      name:"PMP ProAmm 100gr SP",            maker:"PMP",     caliber:".243 Win",       grains:100, bc_g1:0.356, muzzle_velocity_fps:2953, muzzle_velocity_ms:900,  use_case:"Light Game",        tip_type:"lead",    color:"#50c878" },
  { id:"270-130-pmp",      name:"PMP ProAmm 130gr SP",            maker:"PMP",     caliber:".270 Win",       grains:130, bc_g1:0.416, muzzle_velocity_fps:3002, muzzle_velocity_ms:915,  use_case:"Plains Game",       tip_type:"lead",    color:"#50c878" },
  { id:"7x57-170-pmp",     name:"PMP ProAmm 170gr SP",            maker:"PMP",     caliber:"7x57 Mauser",    grains:170, bc_g1:0.430, muzzle_velocity_fps:2625, muzzle_velocity_ms:800,  use_case:"Large Plains",      tip_type:"lead",    color:"#50c878" },
  { id:"308-150-pmp",      name:"PMP ProAmm 150gr SP",            maker:"PMP",     caliber:".308 Win",       grains:150, bc_g1:0.338, muzzle_velocity_fps:2822, muzzle_velocity_ms:860,  use_case:"Plains Game",       tip_type:"lead",    color:"#50c878" },
  { id:"308-180-pmp",      name:"PMP ProAmm 180gr SP",            maker:"PMP",     caliber:".308 Win",       grains:180, bc_g1:0.391, muzzle_velocity_fps:2625, muzzle_velocity_ms:800,  use_case:"Large Game",        tip_type:"lead",    color:"#50c878" },
  { id:"3006-150-pmp",     name:"PMP ProAmm 150gr SP",            maker:"PMP",     caliber:".30-06",         grains:150, bc_g1:0.338, muzzle_velocity_fps:2887, muzzle_velocity_ms:880,  use_case:"Plains Game",       tip_type:"lead",    color:"#50c878" },
  { id:"3006-180-pmp",     name:"PMP ProAmm 180gr SP",            maker:"PMP",     caliber:".30-06",         grains:180, bc_g1:0.391, muzzle_velocity_fps:2723, muzzle_velocity_ms:830,  use_case:"Large Game",        tip_type:"lead",    color:"#50c878" },
  { id:"303-150-pmp",      name:"PMP ProAmm 150gr SP",            maker:"PMP",     caliber:".303 British",   grains:150, bc_g1:0.318, muzzle_velocity_fps:2749, muzzle_velocity_ms:838,  use_case:"Plains Game",       tip_type:"lead",    color:"#50c878" },
  { id:"375hh-286-pmp-s",  name:"PMP 286gr Solid",                maker:"PMP",     caliber:".375 H&H Mag",   grains:286, bc_g1:0.330, muzzle_velocity_fps:2559, muzzle_velocity_ms:780,  use_case:"Elephant/Buffalo",  tip_type:"solid",   color:"#50c878" },
  { id:"375hh-300-pmp",    name:"PMP 300gr SP",                   maker:"PMP",     caliber:".375 H&H Mag",   grains:300, bc_g1:0.364, muzzle_velocity_fps:2526, muzzle_velocity_ms:770,  use_case:"Dangerous Game",    tip_type:"lead",    color:"#50c878" },

  // ── PMP African Elite (Swift A-Frame) ──
  { id:"270-130-pmp-ae",   name:"PMP African Elite 130gr A-Frame",maker:"PMP",     caliber:".270 Win",       grains:130, bc_g1:0.390, muzzle_velocity_fps:2986, muzzle_velocity_ms:910,  use_case:"All Game",          tip_type:"solid",   color:"#50c878" },
  { id:"7x57-150-pmp-ae",  name:"PMP African Elite 150gr A-Frame",maker:"PMP",     caliber:"7x57 Mauser",    grains:150, bc_g1:0.430, muzzle_velocity_fps:2756, muzzle_velocity_ms:840,  use_case:"Large Plains",      tip_type:"solid",   color:"#50c878" },
  { id:"308-165-pmp-ae",   name:"PMP African Elite 165gr A-Frame",maker:"PMP",     caliber:".308 Win",       grains:165, bc_g1:0.435, muzzle_velocity_fps:2723, muzzle_velocity_ms:830,  use_case:"Large Game",        tip_type:"solid",   color:"#50c878" },
  { id:"3006-180-pmp-ae",  name:"PMP African Elite 180gr A-Frame",maker:"PMP",     caliber:".30-06",         grains:180, bc_g1:0.390, muzzle_velocity_fps:2756, muzzle_velocity_ms:840,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#50c878" },
  { id:"375hh-300-pmp-ae", name:"PMP African Elite 300gr A-Frame",maker:"PMP",     caliber:".375 H&H Mag",   grains:300, bc_g1:0.364, muzzle_velocity_fps:2526, muzzle_velocity_ms:770,  use_case:"Dangerous Game",    tip_type:"solid",   color:"#50c878" },

  // ── PMP Kalahari Elite (Swift Scirocco II) ──
  { id:"243-90-pmp-ke",    name:"PMP Kalahari Elite 90gr Scirocco", maker:"PMP",   caliber:".243 Win",       grains:90,  bc_g1:0.365, muzzle_velocity_fps:3100, muzzle_velocity_ms:945,  use_case:"Light Game",        tip_type:"polymer", color:"#50c878" },
  { id:"270-130-pmp-ke",   name:"PMP Kalahari Elite 130gr Scirocco",maker:"PMP",   caliber:".270 Win",       grains:130, bc_g1:0.450, muzzle_velocity_fps:3021, muzzle_velocity_ms:921,  use_case:"All Game",          tip_type:"polymer", color:"#50c878" },
  { id:"7x57-150-pmp-ke",  name:"PMP Kalahari Elite 150gr Scirocco",maker:"PMP",   caliber:"7x57 Mauser",    grains:150, bc_g1:0.465, muzzle_velocity_fps:2772, muzzle_velocity_ms:845,  use_case:"Large Plains",      tip_type:"polymer", color:"#50c878" },
  { id:"308-165-pmp-ke",   name:"PMP Kalahari Elite 165gr Scirocco",maker:"PMP",   caliber:".308 Win",       grains:165, bc_g1:0.460, muzzle_velocity_fps:2749, muzzle_velocity_ms:838,  use_case:"Large Game",        tip_type:"polymer", color:"#50c878" },
];

export const CALIBERS = Array.from(new Set(BULLET_PRESETS.map(b => b.caliber)));
export const MAKERS   = Array.from(new Set(BULLET_PRESETS.map(b => b.maker))).sort();
export const getByCAliber = (cal: string) => BULLET_PRESETS.filter(b => b.caliber === cal);
export const getByMaker   = (maker: string) => BULLET_PRESETS.filter(b => b.maker === maker);
export const getByUseCase = (use: string) => BULLET_PRESETS.filter(b => b.use_case.includes(use));

export const CALIBER_GROUPS: Record<string, string[]> = {
  "Rimfire":        [".22 LR", ".22 WMR"],
  "Varmint":        [".222 Rem", ".223 Rem", ".22-250 Rem", ".243 Win", "6mm Rem"],
  "Plains Game":    ["6.5 Creedmoor", "6.5x55 Swedish", "6.5 PRC", ".257 Roberts", ".260 Rem", ".270 Win", ".270 WSM", "7x57 Mauser", "7x64 Brenneke", "7mm-08 Rem"],
  "Large Plains":   ["7mm Rem Mag", "7mm WSM", ".28 Nosler", ".308 Win", ".30-06", ".303 British", "8x57 Mauser"],
  "Magnum":         [".300 WSM", ".300 Win Mag", ".300 PRC", ".338 Win Mag", ".338 Lapua Mag", ".340 Wby Mag"],
  "Dangerous Game": [".375 H&H Mag", ".375 Ruger", ".404 Jeffery", ".416 Rem Mag", ".416 Rigby", ".458 Win Mag", ".458 Lott", ".470 Nitro Exp", ".500 Nitro Exp"],
};
