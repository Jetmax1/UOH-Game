import { pixelEngine } from './PixelArtEngine.js';

/**
 * Pokémon FireRed GBA 4-Section Campus World Map System
 * Features 4 spacious regional campus areas:
 * 1. North / Main Campus (Green)
 * 2. South Campus (Blue)
 * 3. West Campus (Yellow)
 * 4. East Campus (Purple)
 * Connected via authentic Pokémon-style road checkpoint gates with smooth transitions.
 */
export class WorldMap {
  constructor(locationsData, npcsData) {
    this.allLocations = locationsData;
    this.allNPCs = npcsData;
    this.currentSection = 'main'; // 'main', 'south', 'west', 'east'

    // Define all 4 Campus Regional Sections
    this.sectionConfigs = {
      // =======================================================================
      // 1. NORTH / MAIN CAMPUS (Academic Core, Admin, Library, Lakes)
      // =======================================================================
      main: {
        id: 'main',
        name: 'NORTH / MAIN CAMPUS',
        sub: 'Academic Core, IGM Library, SCIS, Social Sciences & Central Lakes',
        themeColor: '#10b981',
        width: 1700,
        height: 1350,
        waterBodies: [
          { id: 26, name: 'Buffalo Lake', x: 1080, y: 760, radiusX: 60, radiusY: 45, color: '#3070b0' },
          { id: 28, name: 'Peacock Lake', x: 1120, y: 1100, radiusX: 80, radiusY: 55, color: '#2868a8' },
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
            targetY: 480,
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
          // Nature & Lake Trails
          [940, 550, 1240, 540, 14, true],
          [1080, 690, 1080, 760, 14, true],
          [1080, 760, 1260, 820, 14, true],  // Trail to Masoom's Rock
          [880, 1110, 980, 1180, 14, true],
          [980, 1180, 1120, 1100, 14, true]
        ],
        plazas: [
          { x: 670, y: 220, w: 120, h: 60 },  // Admin Quad
          { x: 760, y: 860, w: 140, h: 70 },  // Library Square
          { x: 910, y: 500, w: 110, h: 60 },  // SCIS Plaza
          { x: 550, y: 270, w: 90, h: 50 }    // North Shopping Quad
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
          { x: 880, y: 730 }, { x: 1000, y: 970 }
        ],
        fountains: [
          { x: 745, y: 200 },
          { x: 850, y: 860 }
        ],
        hedges: [
          { x: 650, y: 190, tilesX: 5, tilesY: 1 },
          { x: 750, y: 840, tilesX: 1, tilesY: 5 },
          { x: 910, y: 840, tilesX: 1, tilesY: 5 }
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
          { x: 720, y: 220, text: 'NORTH PLAZA — Administration Building & Admission Office' },
          { x: 960, y: 510, text: 'CENTRAL GROVE — School of Computer & Information Sciences (SCIS)' },
          { x: 820, y: 860, text: 'CENTRAL GROVE — Indira Gandhi Memorial Library' },
          { x: 1240, y: 800, text: 'NATURAL MONUMENT — Protected The Masoom’s Rock' }
        ],
        streetLamps: [
          { x: 200, y: 235 }, { x: 480, y: 235 }, { x: 700, y: 235 }, { x: 880, y: 235 },
          { x: 700, y: 510 }, { x: 940, y: 535 }, { x: 1200, y: 535 }, { x: 1450, y: 535 },
          { x: 680, y: 635 }, { x: 640, y: 765 }, { x: 350, y: 795 },
          { x: 860, y: 700 }, { x: 800, y: 900 }, { x: 980, y: 925 }, { x: 1140, y: 925 }
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
          // 1. Central Vertical Spine (From North Checkpoint to South Gate)
          [950, 80, 950, 1850, 28, false],
          // Vertical Spine Lateral Branches (as in user blueprint):
          [950, 300, 1400, 300, 24, false], // Branch East -> Amphitheatre (#21) & Amphi Lake (#20)
          [350, 480, 950, 480, 24, false],  // Branch West -> Check Dam UoH (#1)
          [950, 750, 1300, 750, 22, false], // Branch East -> Faculty A Quarters (#82)
          [550, 920, 950, 920, 22, false],  // Branch West -> International Students Hostel (#8)

          // 2. Main Horizontal SLS Road Axis (Connecting Academic Wing to Hostels Cluster)
          [120, 1200, 1880, 1200, 28, false],

          // North Branches from SLS Road (Top Row - Standalone Buildings):
          [160, 1020, 160, 1200, 22, false], // To ASPIRE BioNEST (#2)
          [320, 1020, 320, 1200, 22, false], // To School of Life Sciences (#3)
          [560, 1020, 560, 1200, 22, false], // To Nanotechnology (#7)
          [1100, 1020, 1100, 1200, 22, false], // To Tagore International House (#10)
          [1240, 1020, 1240, 1200, 22, false], // To Men's Hostel J (#11)
          [1380, 1020, 1380, 1200, 20, false], // To Volleyball Court (#16)
          [1520, 1020, 1520, 1200, 22, false], // To MHK Hostel (#13)
          [1660, 1020, 1660, 1200, 22, false], // To Ladies Hostel 10 (#15)
          [1800, 1020, 1800, 1200, 22, false], // To Ladies Hostel 9 (#79)

          // South Branches from SLS Road (Bottom Row - Standalone Buildings):
          [160, 1200, 160, 1340, 22, false], // To Greenhouse Nursery (#4)
          [320, 1200, 320, 1340, 22, false], // To Study India Program (SIP) Building (#84)
          [560, 1200, 560, 1340, 22, false], // To CIS Main Building (#5)
          [560, 1340, 560, 1480, 20, false], // To CIS Reading Room (#6)
          [800, 1200, 800, 1340, 22, false], // To South Shopping Complex (#9)
          [1100, 1200, 1100, 1340, 22, false], // To Ladies Hostel 8 (#14)
          [1240, 1200, 1240, 1340, 22, false], // To Ladies Hostel 7 (#80)
          [1380, 1200, 1380, 1340, 22, false], // To Men's Hostel I (#12)
          [1520, 1200, 1520, 1340, 22, false]  // To Men's Hostel L (#81)
        ],
        plazas: [
          { x: 910, y: 1160, w: 80, h: 80 },  // Grand Central Spine × SLS Road Crossroad Plaza
          { x: 230, y: 990, w: 140, h: 70 },  // SLS Concentric Quad
          { x: 1360, y: 240, w: 180, h: 100 }, // Amphitheatre Stone Plaza
          { x: 310, y: 440, w: 110, h: 60 },  // Check Dam Overlook
          { x: 760, y: 1300, w: 100, h: 60 }, // South Shopping Plaza
          { x: 1500, y: 1010, w: 110, h: 60 } // MHK Hostel Quad
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
          [550, 450, 700, 1020, 24, false]
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
      // 4. EAST CAMPUS (Chemistry, CR Rao, Arts & Comm, Hostels, Sukoon)
      // =======================================================================
      east: {
        id: 'east',
        name: 'EAST CAMPUS',
        sub: 'Science Valley, School of Arts & Comm, Eastern Hostels & Sukoon',
        themeColor: '#a855f7',
        width: 1650,
        height: 1350,
        waterBodies: [],
        checkpoints: [
          {
            id: 'cp_east_to_main',
            name: '⛩️ Main Gate (to Main Campus)',
            shortLabel: '⛩️ Main Gate',
            targetSection: 'main',
            targetX: 1500,
            targetY: 530,
            targetDirection: 'left',
            x: 80,
            y: 440,
            width: 40,
            height: 100,
            isVertical: true
          }
        ],
        roads: [
          // West-to-East Main Science Avenue
          [80, 490, 280, 490, 26, false],
          [280, 490, 580, 510, 26, false],
          [580, 510, 760, 515, 24, false],
          [760, 515, 1020, 595, 24, false],
          [1020, 595, 1420, 310, 22, false], // To Small Gate & Xerox
          [1420, 310, 1420, 450, 20, false],
          // Faculty & Sports Loop
          [280, 490, 260, 245, 20, false],
          [260, 245, 520, 230, 20, false],
          [520, 230, 750, 255, 22, false],
          [750, 255, 940, 290, 20, false],
          [940, 290, 960, 450, 20, false],
          [960, 450, 760, 515, 20, false],
          // Arts & Eastern Hostels Avenue
          [580, 510, 440, 710, 22, false],
          [440, 710, 620, 730, 22, false],
          [620, 730, 820, 750, 22, false],
          [820, 750, 1040, 790, 22, false],
          [820, 750, 820, 910, 20, false],
          [440, 710, 440, 870, 20, false],
          [1040, 790, 1040, 995, 22, false],
          [1040, 995, 1240, 1020, 22, false],
          [1040, 790, 1260, 850, 20, false],
          // Nature & Rock Trails
          [940, 290, 1160, 270, 14, true],
          [1160, 270, 1160, 410, 14, true],
          [1020, 595, 1320, 630, 14, true]
        ],
        plazas: [
          { x: 240, y: 430, w: 100, h: 60 },  // Sukoon Canteen Plaza
          { x: 720, y: 450, w: 110, h: 60 },  // Chemistry Quad
          { x: 990, y: 930, w: 120, h: 60 }   // Arts & Comm Plaza
        ],
        zebraCrossings: [
          { x: 260, y: 480, w: 26, h: 18, isVertical: true },
          { x: 740, y: 505, w: 26, h: 18, isVertical: true },
          { x: 1000, y: 585, w: 26, h: 18, isVertical: true }
        ],
        benches: [
          { x: 260, y: 520 }, { x: 310, y: 520 },
          { x: 740, y: 550 }, { x: 800, y: 550 },
          { x: 1020, y: 830 }, { x: 1080, y: 830 }
        ],
        fountains: [
          { x: 260, y: 400 },
          { x: 780, y: 420 }
        ],
        hedges: [
          { x: 220, y: 410, tilesX: 4, tilesY: 1 },
          { x: 700, y: 430, tilesX: 5, tilesY: 1 }
        ],
        fences: [
          { x: 60, y: 420, length: 6 },
          { x: 60, y: 550, length: 6 },
          { x: 1400, y: 250, length: 5 },
          { x: 1400, y: 370, length: 5 }
        ],
        signposts: [
          { x: 130, y: 460, text: 'CHECKPOINT — Westbound to Administration & Central Campus' },
          { x: 250, y: 430, text: 'SUKOON PLAZA — Sukoon Canteen & Student Gathering' },
          { x: 730, y: 450, text: 'SCIENCE VALLEY — School of Chemistry & CR Rao AIMSCS' },
          { x: 1010, y: 930, text: 'CREATIVE ARTS — Sarojini Naidu School of Arts & Communication' },
          { x: 1390, y: 250, text: 'EAST GATE — HCU Small Gate to Gachibowli Road' }
        ],
        streetLamps: [
          { x: 180, y: 475 }, { x: 400, y: 495 }, { x: 650, y: 505 }, { x: 880, y: 550 },
          { x: 1100, y: 575 }, { x: 1350, y: 350 }, { x: 440, y: 690 }, { x: 820, y: 730 },
          { x: 1040, y: 770 }, { x: 1040, y: 975 }
        ],
        wildlife: [
          { type: 'butterfly', x: 260, y: 400, startX: 260, startY: 400, vx: 15, timer: 0 },
          { type: 'deer', x: 1200, y: 350, startX: 1200, startY: 350, vx: 8, timer: 0 }
        ],
        forestBlocks: [
          { x: 80, y: 80, w: 1450, h: 80 },
          { x: 1450, y: 500, w: 150, h: 700 },
          { x: 80, y: 600, w: 140, h: 650 },
          { x: 300, y: 1100, w: 900, h: 180 }
        ],
        tallGrassPatches: [
          { x: 1120, y: 290, w: 5, h: 3 },
          { x: 1280, y: 650, w: 6, h: 4 }
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
            name: '⛩️ Main Gate (to Main Campus)',
            shortLabel: '⛩️ Main Gate',
            targetSection: 'main',
            targetX: 240,
            targetY: 810,
            targetDirection: 'right',
            x: 1460,
            y: 180,
            width: 40,
            height: 90,
            isVertical: true
          },
          {
            id: 'cp_amphi_to_south',
            name: '⛩️ South Gate (to South Campus)',
            shortLabel: '⛩️ South Gate',
            targetSection: 'south',
            targetX: 1400,
            targetY: 480,
            targetDirection: 'left',
            x: 80,
            y: 880,
            width: 40,
            height: 90,
            isVertical: true
          }
        ],
        roads: [
          // Main Diagonal Highway from South-West to North-East (as seen in satellite imagery)
          [80, 920, 1460, 220, 26, false],
          // Amphitheatre & Pavilion Branches
          [740, 590, 820, 680, 22, false],
          [820, 680, 960, 680, 22, false],
          // Nature Trails to Lakes & Rocks
          [1040, 430, 1220, 320, 14, true],   // To Amphi Lake
          [820, 680, 1260, 860, 14, true],    // To Secret Lake
          [480, 300, 720, 280, 14, true],     // Globbo Rock to Temple
          [720, 280, 940, 320, 14, true],     // Temple to Tamarind Tree
          [940, 320, 1040, 430, 14, true]     // Tamarind to Main Highway
        ],
        plazas: [
          { x: 740, y: 610, w: 260, h: 140 }  // Amphitheatre & Pavilion Stone Plaza
        ],
        zebraCrossings: [
          { x: 750, y: 580, w: 26, h: 18, isVertical: true },
          { x: 1050, y: 420, w: 24, h: 18, isVertical: false }
        ],
        benches: [
          { x: 760, y: 640 }, { x: 920, y: 640 },
          { x: 800, y: 760 }, { x: 880, y: 760 }
        ],
        fountains: [
          { x: 890, y: 630 }
        ],
        hedges: [
          { x: 740, y: 600, tilesX: 6, tilesY: 1 },
          { x: 740, y: 750, tilesX: 6, tilesY: 1 }
        ],
        fences: [
          { x: 60, y: 860, length: 6 },
          { x: 60, y: 980, length: 6 },
          { x: 1440, y: 160, length: 6 },
          { x: 1440, y: 280, length: 6 }
        ],
        signposts: [
          { x: 130, y: 900, text: 'CHECKPOINT — Southbound to School of Life Sciences & Hostels' },
          { x: 1420, y: 200, text: 'CHECKPOINT — Northbound to Administration & IGM Library' },
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

    this.setSection('main');
  }

  setSection(sectionId) {
    if (!this.sectionConfigs[sectionId]) return;
    this.currentSection = sectionId;
    const cfg = this.sectionConfigs[sectionId];

    this.width = cfg.width;
    this.height = cfg.height;
    this.name = cfg.name;
    this.sub = cfg.sub;
    this.themeColor = cfg.themeColor;

    this.waterBodies = cfg.waterBodies || [];
    this.checkpoints = cfg.checkpoints || [];
    this.roads = cfg.roads || [];
    this.plazas = cfg.plazas || [];
    this.zebraCrossings = cfg.zebraCrossings || [];
    this.benches = cfg.benches || [];
    this.fountains = cfg.fountains || [];
    this.hedges = cfg.hedges || [];
    this.fences = cfg.fences || [];
    this.signposts = cfg.signposts || [];
    this.streetLamps = cfg.streetLamps || [];
    this.wildlife = cfg.wildlife || [];
    this.forestBlocks = cfg.forestBlocks || [];
    this.tallGrassPatches = cfg.tallGrassPatches || [];

    // Filter locations & NPCs belonging to this section
    this.locations = this.allLocations.filter(loc => loc.section === sectionId);
    this.npcs = this.allNPCs.filter(npc => npc.section === sectionId);

    this.generateDenseWorld();
    this.buildColliders();
  }

  generateDenseWorld() {
    this.denseForestTrees = [];
    this.forestBlocks.forEach(b => {
      for (let tx = b.x; tx < b.x + b.w; tx += 30) {
        for (let ty = b.y; ty < b.y + b.h; ty += 30) {
          this.denseForestTrees.push({
            x: tx,
            y: ty,
            type: ((tx + ty) % 3 === 0) ? 'pine' : (((tx * 3 + ty) % 5 === 0) ? 'gulmohar' : 'oak')
          });
        }
      }
    });
  }

  buildColliders() {
    this.colliders = [];

    // Outer Bounds
    this.colliders.push({ x: -100, y: -100, width: this.width + 200, height: 100 });
    this.colliders.push({ x: -100, y: this.height, width: this.width + 200, height: 100 });
    this.colliders.push({ x: -100, y: -100, width: 100, height: this.height + 200 });
    this.colliders.push({ x: this.width, y: -100, width: 100, height: this.height + 200 });

    // Locations (Buildings)
    this.locations.forEach(loc => {
      if (loc.isLake || loc.isMajorWonder || loc.isGate || loc.isAmphitheatre || loc.isVolleyball || loc.isCheckDam) return;
      this.colliders.push({
        id: loc.id,
        name: loc.name,
        x: loc.x,
        y: loc.y,
        width: loc.width,
        height: loc.height
      });
    });

    // Water Bodies
    this.waterBodies.forEach(w => {
      this.colliders.push({
        id: w.id,
        isWater: true,
        x: w.x - w.radiusX * 0.85,
        y: w.y - w.radiusY * 0.85,
        width: w.radiusX * 1.7,
        height: w.radiusY * 1.7
      });
    });

    // Fountains
    this.fountains.forEach(f => {
      this.colliders.push({
        x: f.x - 14,
        y: f.y - 14,
        width: 28,
        height: 28
      });
    });
  }

  checkCollision(bounds) {
    for (const box of this.colliders) {
      if (
        bounds.x < box.x + box.width &&
        bounds.x + bounds.width > box.x &&
        bounds.y < box.y + box.height &&
        bounds.y + bounds.height > box.y
      ) {
        return true;
      }
    }
    return false;
  }

  checkCheckpointCollision(playerBounds) {
    for (const cp of this.checkpoints) {
      if (
        playerBounds.x < cp.x + cp.width &&
        playerBounds.x + playerBounds.width > cp.x &&
        playerBounds.y < cp.y + cp.height &&
        playerBounds.y + playerBounds.height > cp.y
      ) {
        return cp;
      }
    }
    return null;
  }

  getCurrentSector(playerX, playerY) {
    return {
      id: this.currentSection,
      name: this.name,
      sub: this.sub
    };
  }

  getInteractableAt(playerX, playerY, maxDist = 55) {
    for (const npc of this.npcs) {
      const dx = playerX - npc.x;
      const dy = playerY - npc.y;
      if (Math.sqrt(dx * dx + dy * dy) <= maxDist) {
        return { type: 'npc', data: npc };
      }
    }

    for (const sign of this.signposts) {
      const dx = playerX - sign.x;
      const dy = playerY - sign.y;
      if (Math.sqrt(dx * dx + dy * dy) <= 35) {
        return {
          type: 'npc',
          data: {
            name: 'Campus Signpost',
            role: 'Information Notice',
            avatar: '🪧',
            dialogue: [sign.text]
          }
        };
      }
    }

    for (const loc of this.locations) {
      const centerX = loc.x + loc.width / 2;
      const centerY = loc.y + loc.height / 2;
      const dx = playerX - centerX;
      const dy = playerY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const effectiveRadius = Math.max(loc.width, loc.height) / 2 + maxDist;
      if (dist <= effectiveRadius) {
        return { type: 'location', data: loc };
      }
    }

    return null;
  }

  updateWildlife(delta) {
    for (const w of this.wildlife) {
      w.timer += delta;
      w.x += w.vx * delta;
      if (Math.abs(w.x - w.startX) > 40) {
        w.vx = -w.vx;
      }
    }
  }

  draw(ctx, camera, timeSystem, particleSystem) {
    ctx.imageSmoothingEnabled = false;

    // 1. Terrain Grass & Flowerbeds
    this.drawTerrain(ctx, camera);

    // 2. Stone Plazas & Courtyards
    this.drawPlazas(ctx, camera);

    // 3. Roads & Avenues (High Quality Asphalt + Curbs + Divider Dashes)
    this.drawRoads(ctx, camera);

    // 4. Zebra Crossings
    this.drawZebraCrossings(ctx, camera);

    // 5. Checkpoint Gates & Arches
    this.drawCheckpoints(ctx, camera);

    // 6. Tall Wild Grass
    this.drawTallGrass(ctx, camera);

    // 7. Hedges
    this.drawHedges(ctx, camera);

    // 8. Water Bodies (Lakes, Check Dam, Secret Lake, Peacock Lake)
    this.drawWaterBodies(ctx, camera);

    // 9. Geological Rocks & Monuments
    this.drawRockFormations(ctx, camera);

    // 10. Custom Architectural Buildings (All 78 Pins with Badges)
    this.drawBuildings(ctx, camera);

    // 11. Fences, Benches, Fountains, Signs
    this.drawProps(ctx, camera);

    // 12. Dense Trees & Forest Borders
    this.drawDenseForest(ctx, camera);

    // 13. Street Lamps
    this.drawStreetLamps(ctx, camera, timeSystem);

    // 14. Wildlife & NPCs
    this.drawWildlife(ctx, camera);
    this.drawNPCs(ctx, camera);
  }

  drawTerrain(ctx, camera) {
    const grassTile = pixelEngine.getGrassTile();
    const flowerRed = pixelEngine.getFlowerTile('red');
    const flowerYellow = pixelEngine.getFlowerTile('yellow');

    const tileSize = 16;
    const startTileX = Math.floor(camera.x / tileSize);
    const startTileY = Math.floor(camera.y / tileSize);
    const endTileX = Math.ceil((camera.x + camera.width) / tileSize);
    const endTileY = Math.ceil((camera.y + camera.height) / tileSize);

    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        const sx = tx * tileSize - camera.x;
        const sy = ty * tileSize - camera.y;

        if ((tx * 7 + ty * 13) % 23 === 0) {
          ctx.drawImage(flowerRed, sx, sy);
        } else if ((tx * 11 + ty * 5) % 19 === 0) {
          ctx.drawImage(flowerYellow, sx, sy);
        } else {
          ctx.drawImage(grassTile, sx, sy);
        }
      }
    }
  }

  drawPlazas(ctx, camera) {
    ctx.save();
    for (const p of this.plazas) {
      const sx = p.x - camera.x;
      const sy = p.y - camera.y;
      if (sx + p.w < -20 || sx > camera.width + 20 || sy + p.h < -20 || sy > camera.height + 20) continue;

      // Paved sandstone tiles
      ctx.fillStyle = '#d4be92';
      ctx.fillRect(sx, sy, p.w, p.h);

      ctx.strokeStyle = '#aa9060';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, p.w, p.h);

      ctx.strokeStyle = 'rgba(170, 144, 96, 0.4)';
      ctx.lineWidth = 1;
      for (let gx = sx + 16; gx < sx + p.w; gx += 16) {
        ctx.beginPath();
        ctx.moveTo(gx, sy);
        ctx.lineTo(gx, sy + p.h);
        ctx.stroke();
      }
      for (let gy = sy + 16; gy < sy + p.h; gy += 16) {
        ctx.beginPath();
        ctx.moveTo(sx, gy);
        ctx.lineTo(sx + p.w, gy);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawRoads(ctx, camera) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const [x1, y1, x2, y2, w, isTrail] of this.roads) {
      const sx1 = x1 - camera.x;
      const sy1 = y1 - camera.y;
      const sx2 = x2 - camera.x;
      const sy2 = y2 - camera.y;

      if (isTrail) {
        // Organic earthen gravel nature trail
        ctx.strokeStyle = '#9a7b56';
        ctx.lineWidth = w + 2;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();

        ctx.strokeStyle = '#c4a47c';
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();
      } else {
        // 1. Sandstone Road Curb / Shoulder
        ctx.strokeStyle = '#948058';
        ctx.lineWidth = w + 6;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();

        // 2. Concrete Curb Edge
        ctx.strokeStyle = '#b8a888';
        ctx.lineWidth = w + 2;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();

        // 3. Smooth Asphalt Pavement
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = w - 2;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();

        // 4. Center Yellow Divider Dashes for main avenues
        if (w >= 18) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(sx1, sy1);
          ctx.lineTo(sx2, sy2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
    ctx.restore();
  }

  drawZebraCrossings(ctx, camera) {
    ctx.save();
    for (const z of this.zebraCrossings) {
      const sx = z.x - camera.x;
      const sy = z.y - camera.y;
      if (sx + z.w < -20 || sx > camera.width + 20 || sy + z.h < -20 || sy > camera.height + 20) continue;

      ctx.fillStyle = '#ffffff';
      if (z.isVertical) {
        for (let i = 0; i < z.h; i += 6) {
          ctx.fillRect(sx, sy + i, z.w, 3);
        }
      } else {
        for (let i = 0; i < z.w; i += 6) {
          ctx.fillRect(sx + i, sy, 3, z.h);
        }
      }
    }
    ctx.restore();
  }

  drawCheckpoints(ctx, camera) {
    ctx.save();
    for (const cp of this.checkpoints) {
      const sx = cp.x - camera.x;
      const sy = cp.y - camera.y;

      if (sx + cp.width < -30 || sx > camera.width + 30 || sy + cp.height < -30 || sy > camera.height + 30) continue;

      // Road Checkpoint Barrier Pillars (Clean Amber/Charcoal Border)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(sx, sy, cp.width, cp.height);

      // Warning Amber Cross Stripes
      const stripeColors = ['#f59e0b', '#334155'];
      for (let i = 0; i < (cp.isVertical ? cp.height : cp.width); i += 10) {
        ctx.fillStyle = stripeColors[Math.floor(i / 10) % 2];
        if (cp.isVertical) {
          ctx.fillRect(sx, sy + i, cp.width, 10);
        } else {
          ctx.fillRect(sx + i, sy, 10, cp.height);
        }
      }

      // Checkpoint Glowing Beacon
      const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + pulse * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sx, sy, cp.width, cp.height);

      // Sleek Gate Badge Label
      const labelText = cp.shortLabel || '⛩️ Gate';
      ctx.font = 'bold 8px Inter, sans-serif';
      const textMetrics = ctx.measureText(labelText);
      const labelW = Math.max(70, textMetrics.width + 14);
      const labelH = 14;
      const lx = sx + cp.width / 2 - labelW / 2;
      const ly = cp.isVertical ? (sy - 16) : (sy - 14);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(lx, ly, labelW, labelH);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(lx, ly, labelW, labelH);

      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.fillText(labelText, sx + cp.width / 2, ly + 10);
    }
    ctx.restore();
  }

  drawTallGrass(ctx, camera) {
    const tallTile = pixelEngine.getTallGrassTile();
    for (const patch of this.tallGrassPatches) {
      for (let gx = 0; gx < patch.w; gx++) {
        for (let gy = 0; gy < patch.h; gy++) {
          const sx = (patch.x + gx * 16) - camera.x;
          const sy = (patch.y + gy * 16) - camera.y;
          if (sx > -20 && sx < camera.width + 20 && sy > -20 && sy < camera.height + 20) {
            ctx.drawImage(tallTile, sx, sy);
          }
        }
      }
    }
  }

  drawHedges(ctx, camera) {
    const hedgeTile = pixelEngine.getHedgeTile();
    for (const h of this.hedges) {
      for (let tx = 0; tx < h.tilesX; tx++) {
        for (let ty = 0; ty < h.tilesY; ty++) {
          const sx = (h.x + tx * 16) - camera.x;
          const sy = (h.y + ty * 16) - camera.y;
          if (sx > -20 && sx < camera.width + 20 && sy > -20 && sy < camera.height + 20) {
            ctx.drawImage(hedgeTile, sx, sy);
          }
        }
      }
    }
  }

  drawWaterBodies(ctx, camera) {
    const time = Date.now() / 1000;

    for (const lake of this.waterBodies) {
      const sx = lake.x - camera.x;
      const sy = lake.y - camera.y;

      if (sx + lake.radiusX < -30 || sx - lake.radiusX > camera.width + 30 ||
          sy + lake.radiusY < -30 || sy - lake.radiusY > camera.height + 30) continue;

      // Sandy Bank Surround
      ctx.fillStyle = '#d4be80';
      ctx.beginPath();
      ctx.ellipse(sx, sy, lake.radiusX + 6, lake.radiusY + 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deep Blue Lake Water
      ctx.fillStyle = lake.color;
      ctx.beginPath();
      ctx.ellipse(sx, sy, lake.radiusX, lake.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ripple Animations
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.5;
      for (let r = 12; r < lake.radiusX - 8; r += 16) {
        const offset = Math.sin(time * 3 + r) * 2;
        ctx.beginPath();
        ctx.ellipse(sx, sy, r + offset, (r + offset) * (lake.radiusY / lake.radiusX), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Name Banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(sx - 50, sy - 9, 100, 18);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - 50, sy - 9, 100, 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lake.name, sx, sy + 4);
    }
  }

  drawRockFormations(ctx, camera) {
    // 1. The Masoom's Rock (#27)
    const mrLoc = this.locations.find(l => l.id === 27);
    if (mrLoc) {
      pixelEngine.drawRockMonolith(ctx, mrLoc.x - camera.x, mrLoc.y - camera.y, mrLoc.shortName, 'masoom');
    }

    // 2. Globbo Rock (#17)
    const globLoc = this.locations.find(l => l.id === 17);
    if (globLoc) {
      pixelEngine.drawRockMonolith(ctx, globLoc.x - camera.x, globLoc.y - camera.y, globLoc.shortName, 'globbo');
    }

    // 3. Cherry Rock (#24)
    const cherryLoc = this.locations.find(l => l.id === 24);
    if (cherryLoc) {
      pixelEngine.drawRockMonolith(ctx, cherryLoc.x - camera.x, cherryLoc.y - camera.y, cherryLoc.shortName, 'cherry');
    }

    // 4. Aquarium Rock (#25)
    const aquaLoc = this.locations.find(l => l.id === 25);
    if (aquaLoc) {
      pixelEngine.drawRockMonolith(ctx, aquaLoc.x - camera.x, aquaLoc.y - camera.y, aquaLoc.shortName, 'aquarium');
    }
  }

  drawBuildings(ctx, camera) {
    for (const loc of this.locations) {
      if (loc.isLake || loc.isMajorWonder || loc.isGate) continue;

      const sx = loc.x - camera.x;
      const sy = loc.y - camera.y;

      if (sx + loc.width < -20 || sx > camera.width + 20 || sy + loc.height < -20 || sy > camera.height + 20) continue;

      ctx.save();

      // 1. Amphitheatre UoH (#21)
      if (loc.isAmphitheatre) {
        pixelEngine.drawAmphitheatre(ctx, sx + loc.width / 2, sy + loc.height / 2, 45);
        this.drawPinBadge(ctx, sx + 4, sy + 4, loc.id);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText(loc.shortName, sx + loc.width / 2, sy - 4);
        ctx.shadowBlur = 0;
        ctx.restore();
        continue;
      }

      // 2. Temple (Chinna Gudi) (#18)
      if (loc.isTemple) {
        pixelEngine.drawCampusTemple(ctx, sx + loc.width / 2, sy + loc.height / 2);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 3. Volleyball Court (#16)
      if (loc.isVolleyball) {
        pixelEngine.drawVolleyballCourt(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 4. Check Dam UoH (#1)
      if (loc.isCheckDam) {
        pixelEngine.drawCheckDam(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 5. Tennis Court (#63)
      if (loc.id === 63) {
        pixelEngine.drawTennisCourt(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 6. School of Life Sciences (#3) & ASPIRE BioNEST (#2)
      if (loc.id === 3) {
        const rad = loc.width / 2;
        const cx = sx + rad;
        const cy = sy + rad;

        // Outer Ring Wall & Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(cx, cy + 6, rad + 4, 0, Math.PI * 2);
        ctx.fill();

        // Outer Ring Base
        ctx.fillStyle = '#f8f8e8';
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();

        // Outer Ring Roof (Emerald / Teal Biotech Tile)
        ctx.fillStyle = '#107868';
        ctx.beginPath();
        ctx.arc(cx, cy, rad - 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner Courtyard Garden
        ctx.fillStyle = '#58b848';
        ctx.beginPath();
        ctx.arc(cx, cy, rad - 20, 0, Math.PI * 2);
        ctx.fill();

        // Central Glass Dome
        ctx.fillStyle = '#90d8f8';
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        this.drawPinBadge(ctx, cx - 7, cy - 6, loc.id);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText('School of Life Sciences', cx, sy - 4);
        ctx.shadowBlur = 0;

        ctx.restore();
        continue;
      }

      // 7. Standard Upgraded GBA Departmental & Residential Buildings
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(sx + 4, sy + 4, loc.width, loc.height);

      let roofPrimary = '#d83838';
      let roofShadow = '#981818';
      let roofHighlight = '#f86868';
      let wallColor = '#f8f8e8';
      let foundationColor = '#888898';

      if (loc.category === 'academic') {
        roofPrimary = '#2563eb';
        roofShadow = '#1e40af';
        roofHighlight = '#60a5fa';
      } else if (loc.category === 'research') {
        roofPrimary = '#059669';
        roofShadow = '#065f46';
        roofHighlight = '#34d399';
      } else if (loc.category === 'residential') {
        roofPrimary = '#d97706';
        roofShadow = '#92400e';
        roofHighlight = '#fbbf24';
      } else if (loc.category === 'amenities' || loc.isNightCanteen) {
        roofPrimary = '#db2777';
        roofShadow = '#9d174d';
        roofHighlight = '#f472b6';
      } else if (loc.category === 'sports') {
        roofPrimary = '#0d9488';
        roofShadow = '#115e59';
        roofHighlight = '#2dd4bf';
      }

      // Foundation
      ctx.fillStyle = foundationColor;
      ctx.fillRect(sx, sy + loc.height - 8, loc.width, 8);

      // Walls
      ctx.fillStyle = wallColor;
      ctx.fillRect(sx + 2, sy + 18, loc.width - 4, loc.height - 26);

      // Roof
      ctx.fillStyle = roofShadow;
      ctx.fillRect(sx, sy, loc.width, 18);
      ctx.fillStyle = roofPrimary;
      ctx.fillRect(sx + 2, sy + 2, loc.width - 4, 14);
      ctx.fillStyle = roofHighlight;
      ctx.fillRect(sx + 4, sy + 2, loc.width - 8, 3);

      for (let rx = sx + 8; rx < sx + loc.width - 6; rx += 12) {
        ctx.fillStyle = roofShadow;
        ctx.fillRect(rx, sy + 5, 2, 10);
      }

      // Entrance Door
      const doorW = 16;
      const doorX = sx + loc.width / 2 - doorW / 2;
      const doorY = sy + loc.height - 14;

      ctx.fillStyle = loc.hasInterior ? '#ef4444' : '#3b82f6';
      ctx.fillRect(doorX - 2, doorY + 8, doorW + 4, 6);

      ctx.fillStyle = '#1f2937';
      ctx.fillRect(doorX, doorY, doorW, 12);
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(doorX + 2, doorY + 2, 5, 8);
      ctx.fillRect(doorX + 9, doorY + 2, 5, 8);

      // Windows
      const numWindows = Math.max(1, Math.floor((loc.width - 24) / 16));
      for (let w = 0; w < numWindows; w++) {
        const wx = sx + 8 + w * 16;
        ctx.fillStyle = '#111827';
        ctx.fillRect(wx, sy + 22, 10, 8);
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(wx + 1, sy + 23, 8, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(wx + 2, sy + 24, 2, 2);
      }

      // Red numbered pin badge (1 to 78)
      this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);

      // Title label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 3;
      ctx.fillText(loc.shortName || loc.name, sx + loc.width / 2, sy - 3);
      ctx.shadowBlur = 0;

      // Interior pulse indicator
      if (loc.hasInterior) {
        const bob = Math.sin(Date.now() / 150) * 2;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(sx + loc.width / 2, sy + loc.height + 8 + bob);
        ctx.lineTo(sx + loc.width / 2 - 4, sy + loc.height + 4 + bob);
        ctx.lineTo(sx + loc.width / 2 + 4, sy + loc.height + 4 + bob);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  drawPinBadge(ctx, x, y, id) {
    if (id > 78) return;
    ctx.save();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x + 7, y + 6, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${id}`, x + 7, y + 6);
    ctx.restore();
  }

  drawProps(ctx, camera) {
    const fenceTile = pixelEngine.getFenceTile();
    const signTile = pixelEngine.getSignpostSprite();
    const benchSprite = pixelEngine.getBenchSprite();
    const fountainSprite = pixelEngine.getFountainSprite();

    for (const f of this.fences) {
      for (let i = 0; i < f.length; i++) {
        const sx = (f.x + i * 16) - camera.x;
        const sy = f.y - camera.y;
        if (sx > -20 && sx < camera.width + 20 && sy > -20 && sy < camera.height + 20) {
          ctx.drawImage(fenceTile, sx, sy);
        }
      }
    }

    for (const b of this.benches) {
      const sx = b.x - camera.x;
      const sy = b.y - camera.y;
      if (sx > -30 && sx < camera.width + 30 && sy > -20 && sy < camera.height + 20) {
        ctx.drawImage(benchSprite, sx, sy);
      }
    }

    for (const fn of this.fountains) {
      const sx = fn.x - camera.x - 16;
      const sy = fn.y - camera.y - 16;
      if (sx > -40 && sx < camera.width + 40 && sy > -40 && sy < camera.height + 40) {
        ctx.drawImage(fountainSprite, sx, sy);
      }
    }

    for (const s of this.signposts) {
      const sx = s.x - camera.x;
      const sy = s.y - camera.y;
      if (sx > -20 && sx < camera.width + 20 && sy > -20 && sy < camera.height + 20) {
        ctx.drawImage(signTile, sx, sy);
      }
    }
  }

  drawDenseForest(ctx, camera) {
    const oakSprite = pixelEngine.getTreeSprite();
    const pineSprite = pixelEngine.getPineTreeSprite();
    const gulmoharSprite = pixelEngine.getGulmoharTreeSprite();

    for (const tree of this.denseForestTrees) {
      const sx = tree.x - camera.x;
      const sy = tree.y - camera.y;

      if (sx < -40 || sx > camera.width + 40 || sy < -40 || sy > camera.height + 40) continue;

      let sprite = oakSprite;
      if (tree.type === 'pine') sprite = pineSprite;
      else if (tree.type === 'gulmohar') sprite = gulmoharSprite;

      ctx.drawImage(sprite, 0, 0, 32, 32, sx - 16, sy - 24, 32, 32);
    }
  }

  drawStreetLamps(ctx, camera, timeSystem) {
    const isNight = timeSystem.ambientMode === 'night' || timeSystem.ambientMode === 'evening';

    for (const lamp of this.streetLamps) {
      const sx = lamp.x - camera.x;
      const sy = lamp.y - camera.y;

      if (sx < -40 || sx > camera.width + 40 || sy < -40 || sy > camera.height + 40) continue;

      ctx.save();
      ctx.fillStyle = '#283848';
      ctx.fillRect(sx - 1, sy - 18, 2, 18);
      ctx.fillStyle = isNight ? '#f8e050' : '#d0d0d8';
      ctx.fillRect(sx - 3, sy - 20, 6, 4);

      if (isNight) {
        const gradient = ctx.createRadialGradient(sx, sy, 2, sx, sy, 40);
        gradient.addColorStop(0, 'rgba(255, 230, 100, 0.45)');
        gradient.addColorStop(0.6, 'rgba(255, 200, 50, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sx, sy, 40, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawWildlife(ctx, camera) {
    const frame = Math.floor(Date.now() / 250);
    for (const w of this.wildlife) {
      const sx = w.x - camera.x;
      const sy = w.y - camera.y;

      if (sx < -30 || sx > camera.width + 30 || sy < -30 || sy > camera.height + 30) continue;

      if (w.type === 'peacock') {
        const sprite = pixelEngine.getPeacockSprite(frame);
        ctx.drawImage(sprite, sx, sy);
      } else if (w.type === 'deer') {
        const sprite = pixelEngine.getDeerSprite(frame);
        ctx.drawImage(sprite, sx, sy);
      } else if (w.type === 'butterfly') {
        const sprite = pixelEngine.getButterflySprite(frame);
        ctx.drawImage(sprite, sx, sy);
      }
    }
  }

  drawNPCs(ctx, camera) {
    for (const npc of this.npcs) {
      const sx = npc.x - camera.x;
      const sy = npc.y - camera.y;

      if (sx < -20 || sx > camera.width + 20 || sy < -20 || sy > camera.height + 20) continue;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(sx + 8, sy + 18, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      let npcType = 'senior';
      if (npc.id.includes('guard')) npcType = 'guard';
      else if (npc.id.includes('prof')) npcType = 'prof';
      else if (npc.id.includes('canteen')) npcType = 'vendor';

      const sprite = pixelEngine.getNPCSprite(npcType);
      ctx.drawImage(sprite, 0, 0, 16, 20, sx, sy, 16, 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 3;
      ctx.fillText(npc.name, sx + 8, sy - 4);
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }
}
