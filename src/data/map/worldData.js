/**
 * Authoritative Map Data Module for UOH Game
 * Separates terrain, roads, water bodies, plazas, props, wildlife, and checkpoint gates
 * from rendering and simulation engines.
 */

export const masterWorldConfig = {
  width: 2400,
  height: 1600,
  defaultSection: 'main',
  defaultSpawn: {
    section: 'main',
    x: 740,
    y: 320,
    direction: 'down'
  }
};

export const sectionConfigs = {
  // =======================================================================
  // 1. NORTH / MAIN CAMPUS (Academic Core, Admin, Library, Lakes)
  // =======================================================================
  main: {
    id: 'main',
    name: 'NORTH / MAIN CAMPUS',
    sub: 'Academic Core: Social Sciences, Humanities, Admission Office, Buffalo Lake & Masoom Rock',
    themeColor: '#10b981',
    width: 1700,
    height: 1350,
    waterBodies: [
      { id: 26, name: 'Buffalo Lake', x: 1080, y: 760, radiusX: 60, radiusY: 45, color: '#3070b0' },
      { id: 29, name: 'Auroya Dam', x: 980, y: 1180, radiusX: 40, radiusY: 26, color: '#306898', isDam: true }
    ],
    checkpoints: [
      {
        id: 'cp_main_to_west',
        name: '⛩️ West Gate (to West Campus)',
        shortLabel: '⛩️ West Gate',
        targetSection: 'west',
        targetX: 1300,
        targetY: 260,
        targetDirection: 'left',
        x: 80,
        y: 200,
        width: 40,
        height: 100,
        isVertical: true
      },
      {
        id: 'cp_main_to_south',
        name: '⛩️ Amphi Valley Gate (to Amphi Valley)',
        shortLabel: '⛩️ Amphi Gate',
        targetSection: 'amphi_valley',
        targetX: 1400,
        targetY: 220,
        targetDirection: 'left',
        x: 160,
        y: 760,
        width: 40,
        height: 100,
        isVertical: true
      },
      {
        id: 'cp_main_to_east',
        name: '⛩️ East Gate (to East Campus)',
        shortLabel: '⛩️ East Gate',
        targetSection: 'east',
        targetX: 160,
        targetY: 520,
        targetDirection: 'right',
        x: 1560,
        y: 480,
        width: 40,
        height: 100,
        isVertical: true
      }
    ],
    roads: [
      // Main West-East North Highway
      [80, 250, 700, 250, 26, false],
      [700, 250, 880, 250, 26, false],
      [880, 250, 1140, 250, 24, false],
      [880, 250, 880, 360, 22, false],
      [880, 360, 900, 360, 20, false],
      // North Hostels Ring
      [480, 250, 480, 430, 20, false],
      [380, 305, 480, 305, 18, false],
      [380, 430, 500, 430, 18, false],
      [580, 320, 700, 250, 20, false],
      // Central Academic Boulevard Spine
      [700, 250, 700, 525, 24, false],
      [700, 525, 940, 550, 24, false],
      [940, 550, 1560, 530, 24, false], // East Avenue
      [700, 525, 680, 650, 22, false],
      [680, 650, 640, 780, 22, false],
      [640, 780, 160, 810, 24, false],  // South connector road
      [680, 650, 860, 715, 22, false],
      [860, 715, 1080, 690, 22, false],
      [860, 715, 800, 920, 26, false],  // Library Boulevard
      [800, 920, 980, 940, 24, false],
      [980, 940, 1140, 940, 22, false],
      [800, 920, 740, 1075, 20, false],
      [740, 1075, 880, 1110, 20, false],
      // Nature & Lake Trails (Dirt Roads)
      [940, 550, 1240, 540, 14, true],
      [1240, 540, 1380, 620, 14, true],  // North-East Nature Path
      [1080, 690, 1080, 760, 14, true],
      [1080, 760, 1260, 820, 14, true],  // Trail to Masoom's Rock
      [1260, 820, 1360, 940, 14, true],  // Masoom's Rock to Southern Grove
      [1140, 940, 1360, 940, 14, true],  // Connecting Library Avenue to Masoom's Trail
      [1080, 760, 1020, 820, 14, true],  // Buffalo Lake Western Shoreline
      [1020, 820, 1120, 860, 14, true],  // Buffalo Lake Southern Loop
      [1120, 860, 1260, 820, 14, true],  // Buffalo Lake Loop to Masoom Rock
      [880, 1110, 980, 1180, 14, true],  // Trail to Auroya Dam
      [980, 1180, 1120, 1100, 14, true], // Auroya Dam East Trail
      [980, 1180, 820, 1220, 14, true],  // Auroya Dam West Wetlands Trail
      [700, 250, 720, 360, 14, true],   // Guest House Woodland Path
      [720, 360, 860, 420, 14, true],   // North Grove Connector
      [860, 420, 880, 360, 14, true]    // North Grove Loop
    ],
    plazas: [
      { x: 670, y: 220, w: 120, h: 60 },  // Admin Quad
      { x: 760, y: 860, w: 140, h: 70 },  // Library Square
      { x: 910, y: 500, w: 110, h: 60 },  // SCIS Plaza
      { x: 550, y: 270, w: 90, h: 50 },   // North Shopping Quad
      { x: 1220, y: 790, w: 100, h: 60 }, // Masoom Rock Overlook Plaza
      { x: 1020, y: 740, w: 90, h: 50 }   // Buffalo Lake Shoreline Garden
    ],
    zebraCrossings: [
      { x: 685, y: 240, w: 18, h: 26, isVertical: false },
      { x: 800, y: 910, w: 26, h: 18, isVertical: true },
      { x: 930, y: 540, w: 24, h: 18, isVertical: false },
      { x: 500, y: 240, w: 18, h: 22, isVertical: false }
    ],
    benches: [
      { x: 710, y: 290 }, { x: 770, y: 290 },
      { x: 820, y: 940 }, { x: 880, y: 940 },
      { x: 960, y: 590 }, { x: 1010, y: 590 },
      { x: 880, y: 730 }, { x: 1000, y: 970 },
      { x: 1230, y: 810 }, { x: 1280, y: 810 },
      { x: 1030, y: 755 }, { x: 1080, y: 755 }
    ],
    fountains: [
      { x: 745, y: 200 },
      { x: 850, y: 860 },
      { x: 1270, y: 820 }
    ],
    hedges: [
      { x: 650, y: 190, tilesX: 5, tilesY: 1 },
      { x: 750, y: 840, tilesX: 1, tilesY: 5 },
      { x: 910, y: 840, tilesX: 1, tilesY: 5 },
      { x: 1210, y: 780, tilesX: 4, tilesY: 1 }
    ],
    fences: [
      { x: 60, y: 190, length: 6 },
      { x: 60, y: 310, length: 6 },
      { x: 140, y: 750, length: 6 },
      { x: 140, y: 870, length: 6 },
      { x: 1540, y: 470, length: 6 },
      { x: 1540, y: 590, length: 6 }
    ],
    signposts: [
      { x: 130, y: 220, text: 'CHECKPOINT — Westbound to Indoor Stadium & Gate 3' },
      { x: 210, y: 780, text: 'CHECKPOINT — Southbound to School of Life Sciences & Hostels' },
      { x: 1510, y: 500, text: 'CHECKPOINT — Eastbound to Science Valley & Sukoon Canteen' },
      { x: 720, y: 220, text: 'NORTH PLAZA — Admission Office & University Guest House' },
      { x: 960, y: 510, text: 'CENTRAL GROVE — School of Humanities & Social Sciences' },
      { x: 820, y: 860, text: 'CENTRAL AVENUE — Westbound to Sports Stadium / Eastbound to IGM Library' },
      { x: 1240, y: 800, text: 'NATURAL MONUMENT — Protected The Masoom’s Rock' }
    ],
    streetLamps: [
      { x: 200, y: 235 }, { x: 480, y: 235 }, { x: 700, y: 235 }, { x: 880, y: 235 },
      { x: 700, y: 510 }, { x: 940, y: 535 }, { x: 1200, y: 535 }, { x: 1450, y: 535 },
      { x: 680, y: 635 }, { x: 640, y: 765 }, { x: 350, y: 795 },
      { x: 860, y: 700 }, { x: 800, y: 900 }, { x: 980, y: 925 }, { x: 1140, y: 925 },
      { x: 1240, y: 810 }, { x: 1060, y: 760 }
    ],
    wildlife: [
      { type: 'peacock', x: 1140, y: 1080, startX: 1140, startY: 1080, vx: 12, timer: 0 },
      { type: 'peacock', x: 1220, y: 560, startX: 1220, startY: 560, vx: -10, timer: 0 },
      { type: 'deer', x: 1060, y: 740, startX: 1060, startY: 740, vx: 8, timer: 0 }
    ],
    forestBlocks: [
      { x: 100, y: 60, w: 1500, h: 90 },
      { x: 60, y: 400, w: 120, h: 300 },
      { x: 60, y: 950, w: 150, h: 320 },
      { x: 1480, y: 150, w: 160, h: 300 },
      { x: 1450, y: 700, w: 180, h: 550 },
      { x: 400, y: 1200, w: 500, h: 100 }
    ],
    tallGrassPatches: [
      { x: 1200, y: 560, w: 5, h: 3 },
      { x: 1040, y: 780, w: 6, h: 3 },
      { x: 1220, y: 840, w: 5, h: 4 },
      { x: 1080, y: 1120, w: 6, h: 4 }
    ]
  },

  // =======================================================================
  // 2. SOUTH CAMPUS (Vertical Spine + Horizontal SLS Road Axis)
  // =======================================================================
  south: {
    id: 'south',
    name: 'SOUTH CAMPUS',
    sub: 'SLS Road & Central Spine: Life Sciences, CIS, Amphitheatre, Check Dam & Hostels',
    themeColor: '#2563eb',
    width: 2000,
    height: 2000,
    waterBodies: [
      { id: 1, name: 'Check Dam UoH', x: 350, y: 460, radiusX: 65, radiusY: 42, color: '#3880b8', isDam: true },
      { id: 20, name: 'Amphi Lake', x: 1560, y: 280, radiusX: 70, radiusY: 48, color: '#3878b8' }
    ],
    checkpoints: [
      {
        id: 'cp_south_to_main',
        name: '⛩️ Main Gate (to Main Campus)',
        shortLabel: '⛩️ Main Gate',
        targetSection: 'main',
        targetX: 240,
        targetY: 810,
        targetDirection: 'right',
        x: 930,
        y: 80,
        width: 80,
        height: 40,
        isVertical: false
      },
      {
        id: 'cp_south_to_west',
        name: '⛩️ West Trail (to West Campus)',
        shortLabel: '⛩️ West Trail',
        targetSection: 'west',
        targetX: 700,
        targetY: 960,
        targetDirection: 'up',
        x: 120,
        y: 1180,
        width: 40,
        height: 80,
        isVertical: true
      }
    ],
    roads: [
      // 1. Central Vertical Spine
      [950, 80, 950, 1850, 28, false],
      [950, 300, 1400, 300, 24, false], // Branch East -> Amphitheatre & Lake
      [350, 480, 950, 480, 24, false],  // Branch West -> Check Dam UoH
      [950, 750, 1300, 750, 22, false], // Branch East -> Faculty A Quarters
      [550, 920, 950, 920, 22, false],  // Branch West -> International Students Hostel

      // 2. Main Horizontal SLS Road Axis
      [120, 1200, 1880, 1200, 28, false],

      // North Branches from SLS Road:
      [160, 1020, 160, 1200, 22, false], // To ASPIRE BioNEST (#2)
      [320, 1020, 320, 1200, 22, false], // To School of Life Sciences (#3)
      [560, 1020, 560, 1200, 22, false], // To Nanotechnology (#7)
      [1100, 1020, 1100, 1200, 22, false], // To Tagore International House (#10)
      [1240, 1020, 1240, 1200, 22, false], // To Men's Hostel J (#11)
      [1380, 1020, 1380, 1200, 20, false], // To Volleyball Court (#16)
      [1520, 1020, 1520, 1200, 22, false], // To MHK Hostel (#13)
      [1660, 1020, 1660, 1200, 22, false], // To Ladies Hostel 10 (#15)
      [1800, 1020, 1800, 1200, 22, false], // To Ladies Hostel 9 (#79)

      // South Branches from SLS Road:
      [160, 1200, 160, 1340, 22, false], // To Greenhouse Nursery (#4)
      [320, 1200, 320, 1340, 22, false], // To SIP Building (#84)
      [560, 1200, 560, 1340, 22, false], // To CIS Main Building (#5)
      [560, 1340, 560, 1480, 20, false], // To CIS Reading Room (#6)
      [800, 1200, 800, 1340, 22, false], // To South Shopping Complex (#9)
      [1100, 1200, 1100, 1340, 22, false], // To Ladies Hostel 8 (#14)
      [1240, 1200, 1240, 1340, 22, false], // To Ladies Hostel 7 (#80)
      [1380, 1200, 1380, 1340, 22, false], // To Men's Hostel I (#12)
      [1520, 1200, 1520, 1340, 22, false], // To Men's Hostel L (#81)

      // 3. Scenic Earthen Trails & Dirt Roads:
      [350, 480, 220, 560, 14, true],     // Check Dam wetland path
      [220, 560, 160, 800, 14, true],     // West forest nature route
      [160, 800, 160, 1020, 14, true],    // Nature trail to BioNEST & Greenhouse
      [1400, 300, 1560, 220, 14, true],   // Amphi Lake North Loop
      [1560, 220, 1680, 320, 14, true],   // Amphi Lake Eastern Shoreline
      [1680, 320, 1560, 440, 14, true],   // Amphi Lake South Loop
      [1560, 440, 1400, 300, 14, true],   // Lake Loop return
      [1560, 440, 1660, 750, 14, true],   // Forest woodland route towards Hostels
      [1660, 750, 1660, 1020, 14, true],  // Woodland trail to MHK & LH-10
      [800, 1340, 950, 1480, 14, true],   // Shopping Complex to South Glade
      [950, 1480, 1100, 1340, 14, true],  // South Glade to LH-8
      [1100, 1340, 1380, 1480, 14, true], // LH-8 to Men's Hostels
      [1380, 1480, 1520, 1340, 14, true], // Men's Hostels to MH-L
      [950, 1850, 600, 1750, 14, true],   // South Boundary West Trail
      [950, 1850, 1400, 1750, 14, true]   // South Boundary East Trail
    ],
    plazas: [
      { x: 910, y: 1160, w: 80, h: 80 },   // Central Spine × SLS Road Crossroad Plaza
      { x: 230, y: 990, w: 140, h: 70 },   // SLS Concentric Quad
      { x: 1360, y: 240, w: 180, h: 100 }, // Amphitheatre Stone Plaza
      { x: 310, y: 440, w: 110, h: 60 },   // Check Dam Overlook
      { x: 760, y: 1300, w: 100, h: 60 },  // South Shopping Plaza
      { x: 1500, y: 1010, w: 110, h: 60 }  // MHK Hostel Quad
    ],
    zebraCrossings: [
      { x: 935, y: 1150, w: 30, h: 20, isVertical: false },
      { x: 935, y: 1230, w: 30, h: 20, isVertical: false },
      { x: 270, y: 1190, w: 20, h: 28, isVertical: true },
      { x: 550, y: 1190, w: 20, h: 28, isVertical: true },
      { x: 790, y: 1190, w: 20, h: 28, isVertical: true },
      { x: 1090, y: 1190, w: 20, h: 28, isVertical: true },
      { x: 1250, y: 1190, w: 20, h: 28, isVertical: true },
      { x: 1530, y: 1190, w: 20, h: 28, isVertical: true }
    ],
    benches: [
      { x: 930, y: 340 }, { x: 970, y: 340 },
      { x: 930, y: 780 }, { x: 970, y: 780 },
      { x: 250, y: 1060 }, { x: 370, y: 1060 },
      { x: 530, y: 1380 }, { x: 600, y: 1380 },
      { x: 770, y: 1380 }, { x: 840, y: 1380 },
      { x: 1070, y: 1070 }, { x: 1230, y: 1070 },
      { x: 1510, y: 1070 }, { x: 930, y: 1780 }
    ],
    fountains: [
      { x: 950, y: 1200 },
      { x: 280, y: 1000 },
      { x: 1540, y: 1010 }
    ],
    hedges: [
      { x: 900, y: 1150, tilesX: 1, tilesY: 6 },
      { x: 990, y: 1150, tilesX: 1, tilesY: 6 },
      { x: 230, y: 980, tilesX: 6, tilesY: 1 },
      { x: 1500, y: 1000, tilesX: 6, tilesY: 1 }
    ],
    fences: [
      { x: 880, y: 60, length: 5 },
      { x: 980, y: 60, length: 5 },
      { x: 880, y: 1870, length: 5 },
      { x: 980, y: 1870, length: 5 }
    ],
    signposts: [
      { x: 980, y: 100, text: 'CENTRAL SPINE — Northbound to Main Campus & Library' },
      { x: 980, y: 320, text: 'AMPHI ROAD — Eastbound to Amphitheatre & Amphi Lake' },
      { x: 910, y: 500, text: 'CHECK DAM ROAD — Westbound to Check Dam UoH' },
      { x: 980, y: 770, text: 'RESIDENTIAL WAY — Faculty A Quarters' },
      { x: 910, y: 970, text: 'INTERNATIONAL HOSTEL ROAD — ISH Central' },
      { x: 980, y: 1160, text: 'MAIN CROSSROAD — SLS Road Axis (Sciences ↔ Hostels)' },
      { x: 980, y: 1820, text: 'SOUTH GATE — University of Hyderabad Boundary Gate' },
      { x: 250, y: 1160, text: 'SLS ROAD WEST — School of Life Sciences & Greenhouse' },
      { x: 530, y: 1160, text: 'CENTRE FOR INTEGRATED STUDIES & Nanotechnology' },
      { x: 770, y: 1160, text: 'COMMERCIAL HUB — South Shopping Complex' },
      { x: 1220, y: 1160, text: 'HOSTELS AVENUE EAST — MHK, MH-J, MH-I & Ladies Hostels' }
    ],
    streetLamps: [
      { x: 950, y: 180 }, { x: 950, y: 400 }, { x: 950, y: 620 }, { x: 950, y: 860 },
      { x: 950, y: 1080 }, { x: 950, y: 1320 }, { x: 950, y: 1540 }, { x: 950, y: 1760 },
      { x: 280, y: 1180 }, { x: 560, y: 1180 }, { x: 800, y: 1180 }, { x: 1100, y: 1180 },
      { x: 1260, y: 1180 }, { x: 1400, y: 1180 }, { x: 1540, y: 1180 }, { x: 1700, y: 1180 }
    ],
    wildlife: [
      { type: 'peacock', x: 260, y: 980, startX: 260, startY: 980, vx: 10, timer: 0 },
      { type: 'deer', x: 1540, y: 260, startX: 1540, startY: 260, vx: 8, timer: 0 },
      { type: 'butterfly', x: 950, y: 1200, startX: 950, startY: 1200, vx: 12, timer: 0 }
    ],
    forestBlocks: [
      { x: 80, y: 80, w: 220, h: 800 },
      { x: 80, y: 1450, w: 220, h: 500 },
      { x: 1650, y: 80, w: 280, h: 800 },
      { x: 1650, y: 1450, w: 280, h: 500 },
      { x: 450, y: 80, w: 420, h: 320 },
      { x: 1050, y: 80, w: 420, h: 180 },
      { x: 1050, y: 400, w: 420, h: 300 },
      { x: 1050, y: 820, w: 420, h: 300 },
      { x: 350, y: 600, w: 520, h: 300 }
    ],
    tallGrassPatches: [
      { x: 260, y: 920, w: 6, h: 4 },
      { x: 1480, y: 220, w: 6, h: 4 },
      { x: 740, y: 1420, w: 6, h: 3 },
      { x: 1360, y: 1420, w: 6, h: 3 }
    ]
  },

  // =======================================================================
  // 3. WEST CAMPUS (Athletics Stadium, IDC, Central Workshop, Kirana)
  // =======================================================================
  west: {
    id: 'west',
    name: 'WEST CAMPUS',
    sub: 'Athletics Stadium, Gymnasium, IDC & Northern Gate 3',
    themeColor: '#eab308',
    width: 1500,
    height: 1150,
    waterBodies: [],
    checkpoints: [
      {
        id: 'cp_west_to_main',
        name: '⛩️ Main Gate (to Main Campus)',
        shortLabel: '⛩️ Main Gate',
        targetSection: 'main',
        targetX: 140,
        targetY: 250,
        targetDirection: 'right',
        x: 1380,
        y: 200,
        width: 40,
        height: 100,
        isVertical: true
      },
      {
        id: 'cp_west_to_checkdam',
        name: '⛩️ Check Dam Trail (to Check Dam)',
        shortLabel: '⛩️ Check Dam Trail',
        targetSection: 'checkdam_buffer',
        targetX: 600,
        targetY: 120,
        targetDirection: 'down',
        x: 650,
        y: 1020,
        width: 100,
        height: 40,
        isVertical: false
      }
    ],
    roads: [
      // Main West Avenue
      [360, 325, 550, 260, 24, false],
      [550, 260, 850, 260, 26, false],
      [850, 260, 1380, 250, 26, false], // To Main Campus Checkpoint
      // Stadium Loop & IDC Avenue
      [550, 260, 550, 450, 22, false],
      [550, 450, 680, 450, 22, false],
      [680, 450, 850, 455, 22, false],
      [850, 260, 850, 635, 24, false],
      [850, 635, 1020, 630, 20, false],
      // South Connector Spine
      [550, 450, 700, 1020, 24, false],

      // Scenic Earthen Nature Trails (Dirt Roads)
      [360, 325, 260, 480, 14, true],   // Stadium Backwoods Cross-Country Trail
      [260, 480, 480, 680, 14, true],   // Stadium Trail to South Path
      [480, 680, 700, 1020, 14, true],  // South Nature Connector
      [850, 455, 1020, 450, 14, true],  // IDC to Workshop Forest Path
      [1020, 450, 1020, 630, 14, true], // Workshop Loop
      [850, 260, 1100, 160, 14, true],  // Gate 3 Perimeter Trail
      [1100, 160, 1380, 250, 14, true]  // North Ridge Scenic Path
    ],
    plazas: [
      { x: 510, y: 180, w: 130, h: 70 },  // Stadium Plaza
      { x: 800, y: 380, w: 120, h: 60 }   // IDC Tech Plaza
    ],
    zebraCrossings: [
      { x: 530, y: 250, w: 26, h: 18, isVertical: true },
      { x: 830, y: 250, w: 26, h: 18, isVertical: true }
    ],
    benches: [
      { x: 530, y: 310 }, { x: 580, y: 310 },
      { x: 820, y: 490 }, { x: 880, y: 490 }
    ],
    fountains: [
      { x: 870, y: 360 }
    ],
    hedges: [
      { x: 490, y: 170, tilesX: 5, tilesY: 1 },
      { x: 780, y: 370, tilesX: 4, tilesY: 1 }
    ],
    fences: [
      { x: 630, y: 1040, length: 6 },
      { x: 750, y: 1040, length: 6 },
      { x: 1360, y: 180, length: 6 },
      { x: 1360, y: 310, length: 6 }
    ],
    signposts: [
      { x: 1330, y: 220, text: 'CHECKPOINT — Eastbound to Administration & Central Campus' },
      { x: 680, y: 980, text: 'CHECKPOINT — Southbound to School of Life Sciences' },
      { x: 520, y: 220, text: 'SPORTS COMPLEX — Indoor Stadium, Track & Gymnasium' },
      { x: 650, y: 420, text: 'RESEARCH ENCLAVE — Gate 3, IDC & Central Workshop' }
    ],
    streetLamps: [
      { x: 400, y: 300 }, { x: 550, y: 240 }, { x: 850, y: 240 }, { x: 1100, y: 240 },
      { x: 680, y: 430 }, { x: 850, y: 430 }, { x: 850, y: 610 }, { x: 620, y: 720 }
    ],
    wildlife: [
      { type: 'butterfly', x: 870, y: 360, startX: 870, startY: 360, vx: 15, timer: 0 }
    ],
    forestBlocks: [
      { x: 80, y: 80, w: 1350, h: 80 },
      { x: 80, y: 200, w: 180, h: 800 },
      { x: 1250, y: 400, w: 180, h: 650 },
      { x: 800, y: 800, w: 450, h: 250 }
    ],
    tallGrassPatches: [
      { x: 400, y: 360, w: 5, h: 3 },
      { x: 950, y: 480, w: 5, h: 4 }
    ]
  },

  // =======================================================================
  // 4. EAST CAMPUS (Detailed Retro 8-Bit Map Based on Reference)
  // =======================================================================
  east: {
    id: 'east',
    name: 'EAST CAMPUS',
    sub: 'Academic Core, Science Valley, Sports Enclave, Lakes & Heritage Woods',
    themeColor: '#a855f7',
    width: 2400,
    height: 1600,
    waterBodies: [
      // 1. Peacock Lake (Bottom Center) - Large elongated reservoir with natural sandy shores
      { id: 28, name: 'Peacock Lake', x: 1280, y: 1400, radiusX: 260, radiusY: 100, color: '#1e40af' },
      // 2. IGM Library Lake (West-Central) - Scenic natural lake wrapping around library
      { id: 96, name: 'Library Lake', x: 420, y: 990, radiusX: 140, radiusY: 100, color: '#2563eb' },
      // 3. Kondapur Lake / Northeast Pond (Northeast)
      { id: 97, name: 'Kondapur Lake', x: 1750, y: 190, radiusX: 75, radiusY: 60, color: '#3880b8' }
    ],
    checkpoints: [
      {
        id: 'cp_east_to_main',
        name: '⛩️ West Gate (to Main Campus)',
        shortLabel: '⛩️ West Gate',
        targetSection: 'main',
        targetX: 1500,
        targetY: 530,
        targetDirection: 'left',
        x: 40,
        y: 490,
        width: 40,
        height: 100,
        isVertical: true
      }
    ],
    roads: [
      // 1. MAIN DIAGONAL HIGHWAY (Multi-lane arterial running NW to SE past Small Gate to Stadium)
      [900, 40, 1180, 180, 32, false],
      [1180, 180, 1440, 420, 32, false],
      [1440, 420, 1720, 680, 32, false],
      [1720, 680, 1980, 960, 32, false],
      [1980, 960, 2220, 1260, 32, false],
      [2220, 1260, 2380, 1540, 32, false],

      // Highway Secondary Branches (To Kondapur, Sai Baba Temple & Indian Immunologicals)
      [1720, 680, 2060, 840, 24, false], // To Indian Immunologicals
      [1440, 420, 1800, 180, 24, false], // To Kondapur / Sai Baba Temple
      [1800, 180, 2000, 200, 22, false], // To Sai Baba Temple
      [1800, 180, 1840, 80, 22, false],  // To RV Panchajanya

      // 2. MAIN WEST-EAST ACADEMIC SPINE (UoH Monument -> SCIS -> Sukoon -> CR Rao)
      [40, 520, 160, 520, 26, false],
      [160, 520, 440, 520, 26, false],
      [440, 520, 740, 660, 26, false],  // To SCIS
      [740, 660, 1020, 760, 26, false], // To Sukoon
      [1020, 760, 1360, 860, 26, false],
      [1360, 860, 1620, 960, 26, false], // To CR Rao AIMSCS
      [1620, 960, 1980, 960, 26, false], // Connecting CR Rao to Main Diagonal Highway

      // 3. NORTH-WEST HIGHWAY & SHOOTING RANGE LOOP
      [160, 520, 160, 220, 22, false],
      [160, 220, 240, 100, 22, false],
      [240, 100, 440, 100, 22, false],
      [440, 100, 740, 220, 24, false],
      [740, 220, 940, 180, 24, false],  // To Admin Building
      [940, 180, 1180, 180, 26, false], // To Main Diagonal Highway

      // 4. CENTRAL ADMIN & HEALTH CENTER CORRIDOR
      [1000, 180, 1000, 360, 24, false], // Admin to Health Center
      [1000, 360, 1020, 760, 24, false], // Health Center to Sukoon
      [1000, 360, 1200, 440, 22, false], // To Horticulture Nursery
      [1200, 440, 1440, 420, 22, false], // To Small Gate on Highway

      // 5. LIBRARY & SOUTH-WEST LAKESIDE AVENUE
      [740, 660, 580, 860, 24, false],  // SCIS to IGM Library
      [580, 860, 680, 1020, 22, false], // Library Lake Loop
      [680, 1020, 780, 860, 20, false], // To Ladies Hostels
      [780, 860, 1020, 760, 22, false], // Hostels to Sukoon

      // 6. SUKOON TO PEACOCK LAKE & SOUTH SPORTS COMPLEX
      [1020, 760, 1040, 1240, 24, false], // Sukoon down to Peacock Lake
      [1040, 1240, 1360, 1240, 22, false],
      [1360, 1240, 1600, 1260, 24, false], // To Balayogi Sports Complex
      [1600, 1260, 1850, 1380, 24, false], // To Gachibowli Stadium
      [1850, 1380, 2060, 1320, 22, false], // To Sports Turf
      [2060, 1320, 2240, 1240, 22, false], // To Parking Area
      [1620, 960, 1600, 1260, 22, false],  // CR Rao down to Balayogi

      // 7. GRAVEL & EARTHEN NATURE TRAILS (Matching Reference Map)
      // Southwest field nature trails
      [160, 1300, 460, 1150, 14, true],
      [460, 1150, 700, 1280, 14, true],
      [700, 1280, 1040, 1240, 14, true],
      [160, 1450, 400, 1400, 14, true],
      [400, 1400, 780, 1460, 14, true],
      [780, 1460, 1040, 1480, 14, true],
      [1040, 1480, 1500, 1480, 14, true], // Trail along southern shore of Peacock Lake
      // Peacock Lake Full Circumferential Loop Trail
      [1040, 1240, 1280, 1280, 16, true],
      [1280, 1280, 1520, 1320, 16, true],
      [1520, 1320, 1600, 1420, 16, true],
      [1600, 1420, 1500, 1480, 16, true],
      // Library Lakeside Nature Walk
      [420, 860, 320, 940, 14, true],
      [320, 940, 360, 1080, 14, true],
      [360, 1080, 580, 1060, 14, true],
      // Sukoon Canteen to SN School & CR Rao woodland trails
      [1020, 760, 1200, 840, 14, true],
      [1200, 840, 1360, 860, 14, true],
      [1360, 860, 1480, 980, 14, true],
      // Forest trails around rocks & temples
      [1360, 860, 1420, 760, 14, true],   // To Cherry Rock & Aquarium Rock
      [1420, 760, 1620, 760, 14, true],
      [1750, 260, 1950, 240, 14, true],   // Trail around Kondapur Lake
      [1440, 420, 1680, 320, 14, true],   // Nature path to Sai Baba Temple
      [1680, 320, 1950, 240, 14, true],
      [240, 100, 440, 40, 14, true],       // Trail to SATG shooting track
      [1850, 1420, 1860, 1540, 14, true],  // Trail to Mushroom Rock

      // 8. PAVED PEDESTRIAN ENTRANCE APPROACHES
      [1015, 180, 1015, 210, 18, false],  // Administration Building Entrance Walkway
      [1010, 300, 1010, 365, 18, false],  // Health Center Entrance Walkway
      [740, 660, 740, 735, 18, false],    // SCIS CS Entrance Walkway
      [580, 860, 580, 975, 18, false],    // IGM Library Entrance Promenade
      [260, 520, 260, 550, 16, false],    // India Post Entrance
      [1695, 960, 1695, 990, 18, false]   // CR Rao Entrance Walkway
    ],
    fieldBlocks: [
      // Southwest agricultural & rocky brown field blocks
      { x: 60, y: 1100, w: 720, h: 460 },
      { x: 300, y: 1000, w: 380, h: 180 },
      { x: 740, y: 1400, w: 560, h: 160 }
    ],
    plazas: [
      { x: 920, y: 80, w: 190, h: 80 },    // Administration Grand Plaza
      { x: 500, y: 840, w: 160, h: 75 },   // Library Lake Promenade
      { x: 980, y: 740, w: 140, h: 70 },   // Sukoon Canteen Courtyard
      { x: 1580, y: 940, w: 180, h: 80 },  // CR Rao Science Square
      { x: 1960, y: 180, w: 140, h: 70 },  // Sai Baba Temple Courtyard
      { x: 1560, y: 1280, w: 160, h: 75 }, // Balayogi Sports Plaza
      { x: 1800, y: 1380, w: 180, h: 75 }  // Gachibowli Stadium Gateway
    ],
    zebraCrossings: [
      { x: 1180, y: 170, w: 32, h: 20, isVertical: false },
      { x: 1440, y: 410, w: 32, h: 20, isVertical: false },
      { x: 1720, y: 670, w: 32, h: 20, isVertical: false },
      { x: 1980, y: 950, w: 32, h: 20, isVertical: false },
      { x: 720, y: 650, w: 26, h: 20, isVertical: true },
      { x: 1000, y: 750, w: 26, h: 20, isVertical: true },
      { x: 1600, y: 950, w: 26, h: 20, isVertical: true }
    ],
    benches: [
      { x: 960, y: 170 }, { x: 1060, y: 170 },
      { x: 1000, y: 810 }, { x: 1070, y: 810 },
      { x: 560, y: 920 }, { x: 620, y: 920 },
      { x: 1640, y: 1030 }, { x: 1710, y: 1030 },
      { x: 2020, y: 260 }, { x: 2080, y: 260 },
      { x: 1620, y: 1370 }, { x: 1680, y: 1370 }
    ],
    fountains: [
      { x: 1000, y: 70 },
      { x: 580, y: 860 },
      { x: 1680, y: 950 }
    ],
    hedges: [
      { x: 920, y: 60, tilesX: 12, tilesY: 1 },
      { x: 500, y: 820, tilesX: 10, tilesY: 1 },
      { x: 1580, y: 920, tilesX: 11, tilesY: 1 }
    ],
    fences: [
      { x: 40, y: 460, length: 6 },
      { x: 40, y: 590, length: 6 },
      { x: 1420, y: 400, length: 5 },
      { x: 1420, y: 500, length: 5 },
      { x: 2040, y: 800, length: 8 },
      { x: 2040, y: 1380, length: 8 }
    ],
    signposts: [
      { x: 90, y: 490, text: 'CHECKPOINT — Westbound to Main Campus' },
      { x: 1000, y: 130, text: 'NORTH QUAD — Administration Headquarters & Central Dome' },
      { x: 1000, y: 320, text: 'HEALTH CENTER — 24x7 Emergency Medical Care' },
      { x: 740, y: 610, text: 'SCIS — School of Computer and Information Sciences' },
      { x: 540, y: 850, text: 'IGM LIBRARY — 400,000 Reference Volumes & Lakeshore Study' },
      { x: 1020, y: 750, text: 'SUKOON GLADE — Chai, Samosas & Scholar Gathering' },
      { x: 1620, y: 960, text: 'CR RAO AIMSCS — Advanced Mathematical Sciences' },
      { x: 1440, y: 420, text: 'EAST GATE — HCU Small Gate to Gachibowli Road' },
      { x: 1940, y: 1070, text: 'CAMPUS UTILITY — Overhead Water Tank Tower' },
      { x: 1600, y: 1280, text: 'SPORTS ENCLAVE — GMC Balayogi Sports Complex' },
      { x: 1850, y: 1380, text: 'ATHLETIC ARENA — Gachibowli Stadium' },
      { x: 1040, y: 1280, text: 'ECOLOGICAL GEM — Peacock Lake Wetland Sanctuary' },
      { x: 2000, y: 170, text: 'HERITAGE SANCTUARY — Sri Sai Baba Temple' },
      { x: 120, y: 50, text: 'MARKSMANSHIP GROUNDS — SATG Shooting Ranges' },
      { x: 2060, y: 810, text: 'BIOTECH ENCLAVE — Indian Immunologicals Limited' }
    ],
    streetLamps: [
      // Highway street lamps
      { x: 920, y: 25 }, { x: 1180, y: 160 }, { x: 1440, y: 400 },
      { x: 1720, y: 660 }, { x: 1980, y: 940 }, { x: 2220, y: 1240 }, { x: 2360, y: 1520 },
      // Avenues street lamps
      { x: 260, y: 500 }, { x: 520, y: 500 }, { x: 740, y: 640 },
      { x: 1000, y: 160 }, { x: 1000, y: 340 }, { x: 1020, y: 740 },
      { x: 1360, y: 840 }, { x: 1620, y: 940 }, { x: 1040, y: 1220 },
      { x: 1600, y: 1240 }, { x: 1850, y: 1360 }, { x: 580, y: 840 }
    ],
    wildlife: [
      { type: 'peacock', x: 1080, y: 1320, startX: 1080, startY: 1320, vx: 12, timer: 0 },
      { type: 'peacock', x: 1240, y: 1340, startX: 1240, startY: 1340, vx: -10, timer: 0 },
      { type: 'deer', x: 1380, y: 720, startX: 1380, startY: 720, vx: 8, timer: 0 },
      { type: 'deer', x: 480, y: 1200, startX: 480, startY: 1200, vx: 10, timer: 0 },
      { type: 'butterfly', x: 1020, y: 760, startX: 1020, startY: 760, vx: 14, timer: 0 },
      { type: 'butterfly', x: 2000, y: 220, startX: 2000, startY: 220, vx: 12, timer: 0 }
    ],
    forestBlocks: [
      // Dense forest framing matching reference map
      { x: 60, y: 40, w: 800, h: 120 },
      { x: 60, y: 180, w: 120, h: 280 },
      { x: 260, y: 180, w: 460, h: 300 },
      { x: 1240, y: 40, w: 500, h: 140 },
      { x: 1840, y: 280, w: 480, h: 480 },
      { x: 2180, y: 980, w: 180, h: 580 },
      { x: 740, y: 440, w: 220, h: 180 },
      { x: 1160, y: 440, w: 240, h: 280 },
      { x: 1480, y: 460, w: 220, h: 260 },
      { x: 60, y: 640, w: 320, h: 320 },
      { x: 1240, y: 840, w: 100, h: 140 },
      { x: 1480, y: 760, w: 120, h: 140 },
      { x: 1780, y: 760, w: 180, h: 180 },
      { x: 1540, y: 1460, w: 260, h: 100 }
    ],
    tallGrassPatches: [
      { x: 1080, y: 1300, w: 6, h: 4 },
      { x: 1320, y: 1320, w: 6, h: 4 },
      { x: 1420, y: 740, w: 5, h: 3 },
      { x: 440, y: 1180, w: 6, h: 4 },
      { x: 1980, y: 240, w: 5, h: 3 }
    ]
  },

  // =======================================================================
  // 5. AMPHI VALLEY & NATURE CORRIDOR (Buffer Route connecting North & South)
  // =======================================================================
  amphi_valley: {
    id: 'amphi_valley',
    name: 'AMPHI VALLEY & NATURE CORRIDOR',
    sub: 'Amphitheatre UoH, Amphi Lake, Secret Lake & Chief Warden\'s Pavilion',
    themeColor: '#059669',
    width: 1600,
    height: 1200,
    waterBodies: [
      { id: 20, name: 'Amphi Lake', x: 1220, y: 320, radiusX: 70, radiusY: 50, color: '#3878b8' },
      { id: 22, name: 'Secret Lake', x: 1260, y: 860, radiusX: 65, radiusY: 45, color: '#285890' }
    ],
    checkpoints: [
      {
        id: 'cp_amphi_to_main',
        name: '⛩️ North Campus Gate (to Main Campus)',
        shortLabel: '⛩️ North Gate',
        targetSection: 'main',
        targetX: 200,
        targetY: 810,
        targetDirection: 'right',
        x: 1460,
        y: 180,
        width: 40,
        height: 100,
        isVertical: true
      },
      {
        id: 'cp_amphi_to_south',
        name: '⛩️ South Campus Trail (to South Campus)',
        shortLabel: '⛩️ South Trail',
        targetSection: 'south',
        targetX: 1350,
        targetY: 300,
        targetDirection: 'left',
        x: 100,
        y: 840,
        width: 40,
        height: 100,
        isVertical: true
      }
    ],
    roads: [
      // Main Scenic Valley Road
      [1460, 230, 1200, 360, 24, false],
      [1200, 360, 950, 480, 24, false],
      [950, 480, 700, 600, 24, false],
      [700, 600, 450, 720, 24, false],
      [450, 720, 100, 890, 24, false],
      // Amphitheatre Loop
      [950, 480, 820, 640, 20, false],
      [820, 640, 960, 640, 20, false],
      [960, 640, 950, 480, 20, false],
      // Nature Trails
      [1200, 360, 1220, 320, 14, true],
      [700, 600, 1260, 860, 14, true]
    ],
    plazas: [
      { x: 760, y: 580, w: 140, h: 80 },  // Valley Amphitheatre Plaza
      { x: 920, y: 610, w: 90, h: 60 }    // Warden's Pavilion Forecourt
    ],
    zebraCrossings: [
      { x: 1180, y: 350, w: 24, h: 20, isVertical: true },
      { x: 440, y: 710, w: 24, h: 20, isVertical: true }
    ],
    benches: [
      { x: 750, y: 660 }, { x: 840, y: 660 },
      { x: 1180, y: 380 }, { x: 1220, y: 800 }
    ],
    fountains: [
      { x: 800, y: 560 }
    ],
    hedges: [
      { x: 740, y: 570, tilesX: 5, tilesY: 1 }
    ],
    fences: [
      { x: 1440, y: 160, length: 6 },
      { x: 1440, y: 290, length: 6 },
      { x: 80, y: 820, length: 6 },
      { x: 80, y: 950, length: 6 }
    ],
    signposts: [
      { x: 1420, y: 200, text: 'CHECKPOINT — Northbound to Main Campus & Library' },
      { x: 150, y: 860, text: 'CHECKPOINT — Southbound to School of Life Sciences & Hostels' },
      { x: 780, y: 600, text: 'AMPHI VALLEY — Amphitheatre UoH & Chief Warden’s Office' },
      { x: 1180, y: 340, text: 'NATURE TRAIL — Amphi Lake' },
      { x: 1220, y: 840, text: 'ECOLOGICAL GEM — Secret Lake Sanctuary' }
    ],
    streetLamps: [
      { x: 200, y: 860 }, { x: 450, y: 730 }, { x: 700, y: 610 }, { x: 950, y: 480 },
      { x: 1200, y: 350 }, { x: 1400, y: 250 }, { x: 820, y: 660 }, { x: 960, y: 660 }
    ],
    wildlife: [
      { type: 'peacock', x: 1180, y: 340, startX: 1180, startY: 340, vx: 10, timer: 0 },
      { type: 'deer', x: 1220, y: 820, startX: 1220, startY: 820, vx: 8, timer: 0 },
      { type: 'butterfly', x: 780, y: 620, startX: 780, startY: 620, vx: 12, timer: 0 }
    ],
    forestBlocks: [
      { x: 80, y: 60, w: 1450, h: 80 },
      { x: 80, y: 160, w: 200, h: 650 },
      { x: 1350, y: 400, w: 200, h: 700 },
      { x: 300, y: 950, w: 900, h: 200 }
    ],
    tallGrassPatches: [
      { x: 440, y: 320, w: 6, h: 3 },
      { x: 1150, y: 360, w: 6, h: 4 },
      { x: 1200, y: 820, w: 6, h: 4 }
    ]
  },

  // =======================================================================
  // 6. CHECK DAM BASIN & ROCKY WOODS (Buffer Route connecting West & South)
  // =======================================================================
  checkdam_buffer: {
    id: 'checkdam_buffer',
    name: 'CHECK DAM BASIN & ROCKY WOODS',
    sub: 'Check Dam UoH, Globe Rock, Temple & Deccan Water Basin',
    themeColor: '#0284c7',
    width: 1600,
    height: 1200,
    waterBodies: [
      { id: 1, name: 'Check Dam UoH', x: 520, y: 340, radiusX: 65, radiusY: 42, color: '#3880b8', isDam: true }
    ],
    checkpoints: [
      {
        id: 'cp_checkdam_to_west',
        name: '⛩️ West Campus Gate (to West Campus)',
        shortLabel: '⛩️ West Gate',
        targetSection: 'west',
        targetX: 700,
        targetY: 960,
        targetDirection: 'up',
        x: 550,
        y: 60,
        width: 100,
        height: 40,
        isVertical: false
      },
      {
        id: 'cp_checkdam_to_south',
        name: '⛩️ South Campus Gate (to South Campus)',
        shortLabel: '⛩️ South Gate',
        targetSection: 'south',
        targetX: 280,
        targetY: 200,
        targetDirection: 'down',
        x: 550,
        y: 1080,
        width: 100,
        height: 40,
        isVertical: false
      }
    ],
    roads: [
      // Main North-to-South Connector Road
      [600, 60, 600, 360, 24, false],
      [600, 360, 600, 800, 24, false],
      [600, 800, 600, 1080, 24, false],
      // Check Dam Weir Loop
      [600, 360, 580, 340, 16, true],
      [580, 340, 420, 340, 14, true],
      // Globe Rock, Temple & Tamarind Trails
      [600, 360, 920, 340, 14, true],   // To Globe Rock
      [920, 340, 940, 520, 14, true],   // To Temple
      [940, 520, 780, 680, 14, true],   // To Tamarind Tree
      [780, 680, 600, 800, 14, true]    // To Main Road
    ],
    plazas: [
      { x: 540, y: 310, w: 120, h: 70 },  // Check Dam Overlook Plaza
      { x: 900, y: 490, w: 90, h: 60 }    // Temple Courtyard
    ],
    zebraCrossings: [
      { x: 590, y: 350, w: 22, h: 24, isVertical: false },
      { x: 590, y: 790, w: 22, h: 24, isVertical: false }
    ],
    benches: [
      { x: 540, y: 380 }, { x: 660, y: 380 },
      { x: 900, y: 560 }, { x: 780, y: 730 }
    ],
    fountains: [
      { x: 580, y: 310 }
    ],
    hedges: [
      { x: 530, y: 300, tilesX: 4, tilesY: 1 },
      { x: 890, y: 480, tilesX: 3, tilesY: 1 }
    ],
    fences: [
      { x: 530, y: 40, length: 6 },
      { x: 670, y: 40, length: 6 },
      { x: 530, y: 1100, length: 6 },
      { x: 670, y: 1100, length: 6 }
    ],
    signposts: [
      { x: 630, y: 90, text: 'CHECKPOINT — Northbound to Stadium & Northern Gate 3' },
      { x: 630, y: 1050, text: 'CHECKPOINT — Southbound to School of Life Sciences & SLS Road' },
      { x: 520, y: 320, text: 'NATURE BASIN — Check Dam UoH & Wetland Aquifer' },
      { x: 900, y: 320, text: 'GEOLOGICAL MONUMENT — Globe Rock' },
      { x: 920, y: 500, text: 'HERITAGE HILLOCK — Chinna Gudi Temple' }
    ],
    streetLamps: [
      { x: 600, y: 180 }, { x: 600, y: 360 }, { x: 600, y: 580 },
      { x: 600, y: 800 }, { x: 600, y: 1000 }, { x: 920, y: 340 }
    ],
    wildlife: [
      { type: 'deer', x: 880, y: 360, startX: 880, startY: 360, vx: 8, timer: 0 },
      { type: 'peacock', x: 520, y: 380, startX: 520, startY: 380, vx: 10, timer: 0 },
      { type: 'butterfly', x: 760, y: 660, startX: 760, startY: 660, vx: 12, timer: 0 }
    ],
    forestBlocks: [
      { x: 80, y: 60, w: 420, h: 1050 },
      { x: 1100, y: 60, w: 420, h: 1050 },
      { x: 500, y: 60, w: 600, h: 60 },
      { x: 500, y: 1120, w: 600, h: 60 }
    ],
    tallGrassPatches: [
      { x: 510, y: 440, w: 5, h: 4 },
      { x: 880, y: 420, w: 5, h: 4 },
      { x: 740, y: 720, w: 5, h: 3 }
    ]
  }
};
