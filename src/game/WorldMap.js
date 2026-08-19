import { pixelEngine } from './PixelArtEngine.js';

/**
 * Pokémon FireRed GBA Multi-Section Campus World Map
 * Recreates the complete University of Hyderabad campus with authentic Google Maps topology:
 * SLS circular ring, CIS/SIP complex, spacious hostel quads, Amphitheatre, Secret Lake,
 * Globe Rock, Chinna Gudi Temple, Volleyball Court, and Check Dam.
 */
export class WorldMap {
  constructor(locationsData, npcsData) {
    this.width = 2300;
    this.height = 2200;
    this.locations = locationsData;
    this.npcs = npcsData;

    // 9 Named Regional Sectors
    this.sectors = [
      { id: 'route_1', name: 'ROUTE 1', sub: 'Bombay Highway & Gate I Entrance', bounds: { x1: 500, y1: 100, x2: 1400, y2: 420 } },
      { id: 'north_plaza', name: 'NORTH PLAZA', sub: 'Administration & Health Quarter', bounds: { x1: 700, y1: 420, x2: 1100, y2: 720 } },
      { id: 'central_grove', name: 'CENTRAL GROVE', sub: 'School of CS, Library & OAT', bounds: { x1: 950, y1: 720, x2: 1420, y2: 1060 } },
      { id: 'east_science', name: 'SCIENCE VALLEY', sub: 'Gate II, Chemistry & Research Institutes', bounds: { x1: 1400, y1: 150, x2: 2150, y2: 750 } },
      { id: 'west_athletics', name: 'WEST PARK', sub: 'Athletics Stadium & Gymnasium', bounds: { x1: 250, y1: 550, x2: 780, y2: 1050 } },
      { id: 'gundla_kunta', name: 'GUNDLA KUNTA', sub: 'Central Lakefront & Boardwalk', bounds: { x1: 800, y1: 1060, x2: 1350, y2: 1450 } },
      { id: 'peacock_lake', name: 'PEACOCK RESERVE', sub: 'Eastern Wildlife Sanctuary & Nature Trail', bounds: { x1: 1500, y1: 950, x2: 2150, y2: 1450 } },
      { id: 'rock_sanctuary', name: 'ROCK RIDGE', sub: 'Mushroom Rock & Heritage Formations', bounds: { x1: 1850, y1: 900, x2: 2250, y2: 1350 } },
      { id: 'south_campus', name: 'SOUTH CAMPUS', sub: 'SLS, CIS, MHK Hostel & Amphitheatre', bounds: { x1: 50, y1: 1300, x2: 1200, y2: 2180 } }
    ];

    // Lakes & Water Bodies
    this.waterBodies = [
      { id: 101, name: 'Gundla Kunta', x: 980, y: 1180, radiusX: 95, radiusY: 75, color: '#3878b8' },
      { id: 102, name: 'Peacock Lake', x: 1680, y: 1080, radiusX: 105, radiusY: 85, color: '#2868a8' },
      { id: 103, name: 'Chilkala Kunta', x: 1020, y: 1820, radiusX: 85, radiusY: 65, color: '#3070b0' },
      { id: 104, name: 'Nallagandla Lake', x: 130, y: 950, radiusX: 85, radiusY: 70, color: '#3880c0' },
      { id: 105, name: 'Kamalavanam Kunta', x: 860, y: 1520, radiusX: 65, radiusY: 55, color: '#205898' },
      // New South Campus Lakes
      { id: 112, name: 'Secret Lake', x: 980, y: 1680, radiusX: 75, radiusY: 60, color: '#285890' },
      { id: 113, name: 'Check Dam UoH', x: 740, y: 1350, radiusX: 55, radiusY: 38, color: '#306898', isDam: true }
    ];

    // Comprehensive Road Network [x1, y1, x2, y2, width]
    this.roads = [
      // 1. North Boundary & Gate I
      [500, 180, 1850, 180, 24],  // Old Bombay Highway
      [890, 180, 890, 750, 22],   // Route 1 Spine to Central Ring

      // 2. Central Academic Ring
      [890, 750, 1150, 750, 20],
      [1150, 750, 1150, 950, 20],
      [890, 750, 890, 1050, 20],
      [890, 1050, 1150, 1050, 20],
      [1150, 950, 1150, 1050, 20],

      // 3. East Science Valley & Gate II
      [1470, 180, 1470, 550, 20],
      [1470, 550, 1750, 550, 18],
      [1750, 550, 1750, 700, 18],
      [1150, 750, 1470, 550, 18],
      [1150, 750, 1470, 750, 18],

      // 4. West Athletics Stadium
      [890, 650, 550, 650, 18],
      [550, 650, 550, 850, 20],
      [550, 850, 350, 850, 16],

      // 5. Central to South Connector Spine
      [890, 1050, 680, 1250, 20],
      [680, 1250, 420, 1370, 20],

      // 6. South Campus — School of Life Sciences (SLS) Ring Road
      [420, 1370, 420, 1500, 20], // SLS Road pass-through
      [340, 1370, 490, 1370, 16], // North ring tangent
      [490, 1370, 490, 1500, 16], // East ring tangent
      [490, 1500, 340, 1500, 16], // South ring tangent
      [340, 1500, 340, 1370, 16], // West ring tangent

      // 7. North-East South Trails (Globe Rock, Temple, Check Dam, Gate 3 / IDC)
      [490, 1420, 640, 1420, 16],
      [640, 1420, 780, 1380, 14],
      [780, 1380, 1020, 1340, 16],

      // 8. Main SLS Road (Passing SIP, CIS, Nanotech down to Hostels)
      [420, 1500, 420, 1750, 22],
      [420, 1750, 420, 2080, 22],

      // 9. Diagonal Avenue to Amphitheatre & Secret Lake
      [420, 1640, 600, 1640, 18],
      [600, 1640, 820, 1590, 18], // Diagonal to Amphitheatre
      [820, 1590, 980, 1660, 14], // Nature trail to Secret Lake
      [600, 1640, 720, 1750, 14], // Residential loop

      // 10. South Gate (Gate III) Western Avenue
      [420, 1770, 100, 1770, 20],
      [200, 1770, 180, 2020, 12], // Trail to The Trio Rock

      // 11. Eastern Nature Trails & Mushroom Rock
      [1150, 1050, 1450, 1100, 12],
      [1450, 1100, 1680, 1180, 12],
      [1680, 1180, 2000, 1120, 12],
      [1450, 1100, 1520, 1000, 10],
      [1150, 1050, 1340, 1150, 10]
    ];

    // Stone Courtyards & Plazas
    this.plazas = [
      { x: 840, y: 460, w: 100, h: 50 },  // Admin Quad
      { x: 1080, y: 880, w: 120, h: 70 }, // Library Square
      { x: 1260, y: 680, w: 90, h: 60 },  // Zakir Food Plaza
      { x: 380, y: 1680, w: 95, h: 60 }   // South Complex Night Hub Plaza
    ];

    // Park Benches
    this.benches = [
      { x: 860, y: 530 }, { x: 920, y: 530 },
      { x: 1110, y: 940 }, { x: 1170, y: 940 },
      { x: 1290, y: 760 }, { x: 1330, y: 760 },
      { x: 410, y: 1750 }, { x: 500, y: 1800 },
      { x: 550, y: 1910 }, { x: 440, y: 1980 }
    ];

    // Fountains
    this.fountains = [
      { x: 890, y: 480 },  // Admin Fountain
      { x: 1140, y: 910 }, // Library Square Fountain
      { x: 415, y: 1445 }  // Central SLS Ring Botanical Fountain
    ];

    // Hedges
    this.hedges = [
      { x: 820, y: 410, tilesX: 3, tilesY: 1 },
      { x: 950, y: 410, tilesX: 3, tilesY: 1 },
      { x: 1060, y: 860, tilesX: 1, tilesY: 4 },
      { x: 1220, y: 860, tilesX: 1, tilesY: 4 },
      { x: 400, y: 1760, tilesX: 3, tilesY: 1 }
    ];

    // Fences
    this.fences = [
      { x: 850, y: 200, length: 5 },
      { x: 920, y: 200, length: 5 },
      { x: 1430, y: 200, length: 4 },
      { x: 1520, y: 200, length: 4 },
      { x: 80, y: 1750, length: 4 }, // South Gate Fence
      { x: 80, y: 1790, length: 4 },
      { x: 510, y: 660, length: 6 }
    ];

    // Signposts
    this.signposts = [
      { x: 870, y: 240, text: 'ROUTE 1 — Entrance to Central Campus & Administration' },
      { x: 1180, y: 730, text: 'CENTRAL GROVE — School of Computer Science & Information Sciences' },
      { x: 1180, y: 960, text: 'CENTRAL GROVE — Indira Gandhi Memorial Library' },
      { x: 1490, y: 240, text: 'SCIENCE VALLEY — School of Chemistry & Research Institutes' },
      { x: 440, y: 1510, text: 'SLS ROAD — School of Life Sciences & Centre for Integrated Studies' },
      { x: 440, y: 1740, text: 'SOUTH RESIDENTIAL — Tagore House, ISH & MHK Hostel' },
      { x: 620, y: 1630, text: 'NATURE TRAIL — To Amphitheatre UoH & Secret Lake' },
      { x: 120, y: 1750, text: 'GATE III — South Gate to Tellapur / Nallagandla' },
      { x: 1980, y: 1090, text: 'NATURAL WONDER — Protected Heritage Mushroom Rock' }
    ];

    // Street Lamps
    this.streetLamps = [
      { x: 890, y: 220 }, { x: 890, y: 350 }, { x: 890, y: 500 }, { x: 890, y: 650 },
      { x: 1020, y: 750 }, { x: 1150, y: 750 }, { x: 1150, y: 880 }, { x: 1150, y: 1020 },
      { x: 1470, y: 250 }, { x: 1470, y: 400 }, { x: 1600, y: 550 }, { x: 1750, y: 620 },
      { x: 720, y: 650 }, { x: 550, y: 700 }, { x: 550, y: 820 },
      { x: 830, y: 1150 }, { x: 700, y: 1350 },
      // South Campus Street Lamps
      { x: 420, y: 1410 }, { x: 420, y: 1560 }, { x: 420, y: 1680 },
      { x: 420, y: 1800 }, { x: 420, y: 1930 }, { x: 420, y: 2050 },
      { x: 260, y: 1770 }, { x: 620, y: 1630 }, { x: 820, y: 1560 }
    ];

    // Wandering Wildlife
    this.wildlife = [
      { type: 'peacock', x: 1620, y: 1120, startX: 1620, startY: 1120, vx: 12, timer: 0 },
      { type: 'peacock', x: 1720, y: 1150, startX: 1720, startY: 1150, vx: -10, timer: 0 },
      { type: 'peacock', x: 960, y: 1650, startX: 960, startY: 1650, vx: 10, timer: 0 }, // Secret lake peacock
      { type: 'deer', x: 1080, y: 1320, startX: 1080, startY: 1320, vx: 8, timer: 0 },
      { type: 'deer', x: 720, y: 1480, startX: 720, startY: 1480, vx: -8, timer: 0 }, // South deer
      { type: 'butterfly', x: 870, y: 520, startX: 870, startY: 520, vx: 15, timer: 0 },
      { type: 'butterfly', x: 415, y: 1445, startX: 415, startY: 1445, vx: 15, timer: 0 }  // SLS botanical butterfly
    ];

    this.generateDenseWorld();
    this.colliders = [];
    this.buildColliders();
  }

  generateDenseWorld() {
    this.denseForestTrees = [];
    this.tallGrassPatches = [];

    const forestBlocks = [
      // North Highway buffer
      { x: 200, y: 80, w: 2000, h: 80 },
      // Route 1 West tree wall
      { x: 620, y: 200, w: 240, h: 420 },
      // Route 1 East tree wall
      { x: 950, y: 200, w: 480, h: 280 },
      // East Science buffer
      { x: 1320, y: 280, w: 120, h: 240 },
      // Central-East buffer
      { x: 1240, y: 540, w: 80, h: 140 },
      // Gundla Kunta Woods
      { x: 920, y: 1280, w: 320, h: 180 },
      // Peacock Reserve Woods
      { x: 1600, y: 920, w: 450, h: 320 },
      // South-West buffer
      { x: 60, y: 1850, w: 160, h: 300 },
      // Secret Lake Nature Reserve Woods
      { x: 890, y: 1580, w: 80, h: 220 },
      // Western Buffer
      { x: 80, y: 700, w: 220, h: 450 }
    ];

    forestBlocks.forEach(b => {
      for (let tx = b.x; tx < b.x + b.w; tx += 28) {
        for (let ty = b.y; ty < b.y + b.h; ty += 28) {
          this.denseForestTrees.push({
            x: tx,
            y: ty,
            type: ((tx + ty) % 3 === 0) ? 'pine' : (((tx * 3 + ty) % 5 === 0) ? 'gulmohar' : 'oak')
          });
        }
      }
    });

    const grassAreas = [
      { x: 960, y: 1100, w: 4, h: 3 },
      { x: 1600, y: 1040, w: 5, h: 4 },
      { x: 1740, y: 1180, w: 6, h: 3 },
      { x: 940, y: 1650, w: 5, h: 4 }, // Secret lake tall grass
      { x: 640, y: 1340, w: 4, h: 3 }, // Check dam tall grass
      { x: 180, y: 1980, w: 5, h: 4 }  // The Trio Rock tall grass
    ];

    grassAreas.forEach(a => {
      this.tallGrassPatches.push(a);
    });
  }

  buildColliders() {
    this.colliders = [];

    // Outer Bounds
    this.colliders.push({ x: -100, y: -100, width: this.width + 200, height: 100 });
    this.colliders.push({ x: -100, y: this.height, width: this.width + 200, height: 100 });
    this.colliders.push({ x: -100, y: -100, width: 100, height: this.height + 200 });
    this.colliders.push({ x: this.width, y: -100, width: 100, height: this.height + 200 });

    // Buildings
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

  getCurrentSector(playerX, playerY) {
    for (const s of this.sectors) {
      if (
        playerX >= s.bounds.x1 &&
        playerX <= s.bounds.x2 &&
        playerY >= s.bounds.y1 &&
        playerY <= s.bounds.y2
      ) {
        return s;
      }
    }
    return this.sectors[0];
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

    // 3. Roads & Avenues
    this.drawRoads(ctx, camera);

    // 4. Tall Wild Grass
    this.drawTallGrass(ctx, camera);

    // 5. Hedges
    this.drawHedges(ctx, camera);

    // 6. Water Bodies (Lakes, Check Dam, Secret Lake)
    this.drawWaterBodies(ctx, camera);

    // 7. Geological Rocks & Monuments (Mushroom Rock, Globe Rock, Trio Rock)
    this.drawRockFormations(ctx, camera);

    // 8. Custom Architectural Buildings (SLS Ring, Hostels, CIS, Amphitheatre, Temple, Volleyball)
    this.drawBuildings(ctx, camera);

    // 9. Fences, Benches, Fountains, Signs
    this.drawProps(ctx, camera);

    // 10. Dense Trees & Forest Borders
    this.drawDenseForest(ctx, camera);

    // 11. Street Lamps
    this.drawStreetLamps(ctx, camera, timeSystem);

    // 12. Wildlife & NPCs
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

      ctx.fillStyle = '#d0b888';
      ctx.fillRect(sx, sy, p.w, p.h);

      ctx.strokeStyle = '#a88850';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, p.w, p.h);

      ctx.strokeStyle = 'rgba(168, 136, 80, 0.4)';
      ctx.lineWidth = 1;
      for (let gx = sx + 16; gx < sx + p.w; gx += 16) {
        ctx.beginPath();
        ctx.moveTo(gx, sy);
        ctx.lineTo(gx, sy + p.h);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawRoads(ctx, camera) {
    ctx.save();
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';

    for (const [x1, y1, x2, y2, w] of this.roads) {
      const sx1 = x1 - camera.x;
      const sy1 = y1 - camera.y;
      const sx2 = x2 - camera.x;
      const sy2 = y2 - camera.y;

      ctx.strokeStyle = '#c8a870';
      ctx.lineWidth = w + 4;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();

      ctx.strokeStyle = '#e0c890';
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();

      if (w >= 18) {
        ctx.strokeStyle = '#d0b078';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
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

      ctx.fillStyle = '#e8d088';
      ctx.beginPath();
      ctx.ellipse(sx, sy, lake.radiusX + 8, lake.radiusY + 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = lake.color;
      ctx.beginPath();
      ctx.ellipse(sx, sy, lake.radiusX, lake.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#90d8f8';
      ctx.lineWidth = 1.5;
      for (let r = 16; r < lake.radiusX - 10; r += 20) {
        const offset = Math.sin(time * 3 + r) * 2;
        ctx.beginPath();
        ctx.ellipse(sx, sy, r + offset, (r + offset) * (lake.radiusY / lake.radiusX), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(sx - 55, sy - 10, 110, 20);
      ctx.strokeStyle = '#f8d030';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - 55, sy - 10, 110, 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lake.name, sx, sy + 4);
    }
  }

  drawRockFormations(ctx, camera) {
    // 1. Mushroom Rock (#76)
    const mrLoc = this.locations.find(l => l.id === 76);
    if (mrLoc) {
      const sx = mrLoc.x - camera.x;
      const sy = mrLoc.y - camera.y;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(sx + 40, sy + 62, 36, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#585868';
      ctx.fillRect(sx + 26, sy + 28, 28, 32);
      ctx.fillStyle = '#787888';
      ctx.fillRect(sx + 28, sy + 28, 12, 32);

      ctx.fillStyle = '#484858';
      ctx.beginPath();
      ctx.ellipse(sx + 40, sy + 24, 40, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#888898';
      ctx.beginPath();
      ctx.ellipse(sx + 40, sy + 20, 38, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b8b8c8';
      ctx.beginPath();
      ctx.ellipse(sx + 36, sy + 16, 26, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#d82828';
      ctx.fillRect(sx + 15, sy + 58, 50, 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MUSHROOM ROCK', sx + 40, sy + 67);
      ctx.restore();
    }

    // 2. Globe Rock (#115 - Perfectly round Deccan granite sphere)
    const globeLoc = this.locations.find(l => l.id === 115);
    if (globeLoc) {
      const sx = globeLoc.x - camera.x;
      const sy = globeLoc.y - camera.y;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(sx + 32, sy + 46, 26, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Giant Round Boulder
      ctx.fillStyle = '#484858';
      ctx.beginPath();
      ctx.arc(sx + 32, sy + 26, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#787888';
      ctx.beginPath();
      ctx.arc(sx + 30, sy + 24, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a8a8b8';
      ctx.beginPath();
      ctx.arc(sx + 24, sy + 18, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Globe Rock', sx + 32, sy + 56);
      ctx.restore();
    }

    // 3. The Trio Rock (#116 - 3 leaning monolith rocks)
    const trioLoc = this.locations.find(l => l.id === 116);
    if (trioLoc) {
      const sx = trioLoc.x - camera.x;
      const sy = trioLoc.y - camera.y;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(sx + 36, sy + 52, 34, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rock 1 (Left)
      ctx.fillStyle = '#585868';
      ctx.beginPath();
      ctx.moveTo(sx + 8, sy + 48);
      ctx.lineTo(sx + 22, sy + 12);
      ctx.lineTo(sx + 34, sy + 48);
      ctx.closePath();
      ctx.fill();

      // Rock 2 (Center tall)
      ctx.fillStyle = '#787888';
      ctx.beginPath();
      ctx.moveTo(sx + 24, sy + 48);
      ctx.lineTo(sx + 38, sy + 6);
      ctx.lineTo(sx + 52, sy + 48);
      ctx.closePath();
      ctx.fill();

      // Rock 3 (Right leaning)
      ctx.fillStyle = '#686878';
      ctx.beginPath();
      ctx.moveTo(sx + 42, sy + 48);
      ctx.lineTo(sx + 58, sy + 16);
      ctx.lineTo(sx + 68, sy + 48);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('The Trio Rock', sx + 36, sy + 62);
      ctx.restore();
    }

    // 4. Virgin Rock & High Rock
    [106, 107].forEach(id => {
      const rLoc = this.locations.find(l => l.id === id);
      if (rLoc) {
        const sx = rLoc.x - camera.x;
        const sy = rLoc.y - camera.y;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(sx + 35, sy + 48, 30, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#686878';
        ctx.beginPath();
        ctx.moveTo(sx + 10, sy + 46);
        ctx.lineTo(sx + 35, sy + 8);
        ctx.lineTo(sx + 65, sy + 46);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9898a8';
        ctx.beginPath();
        ctx.moveTo(sx + 15, sy + 46);
        ctx.lineTo(sx + 35, sy + 8);
        ctx.lineTo(sx + 38, sy + 46);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(rLoc.shortName, sx + 35, sy + 58);
        ctx.restore();
      }
    });
  }

  drawBuildings(ctx, camera) {
    for (const loc of this.locations) {
      if (loc.isLake || loc.isMajorWonder || loc.id === 42 || loc.isGate) continue;

      const sx = loc.x - camera.x;
      const sy = loc.y - camera.y;

      if (sx + loc.width < -20 || sx > camera.width + 20 || sy + loc.height < -20 || sy > camera.height + 20) continue;

      ctx.save();

      // 1. Amphitheatre UoH (#111)
      if (loc.isAmphitheatre) {
        pixelEngine.drawAmphitheatre(ctx, sx + loc.width / 2, sy + loc.height / 2, 45);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText(loc.shortName, sx + loc.width / 2, sy - 4);
        ctx.restore();
        continue;
      }

      // 2. Temple (Chinna Gudi) (#114)
      if (loc.isTemple) {
        pixelEngine.drawCampusTemple(ctx, sx + loc.width / 2, sy + loc.height / 2);
        ctx.restore();
        continue;
      }

      // 3. Volleyball Court (#117)
      if (loc.isVolleyball) {
        pixelEngine.drawVolleyballCourt(ctx, sx, sy, loc.width, loc.height);
        ctx.restore();
        continue;
      }

      // 4. Check Dam UoH (#113)
      if (loc.isCheckDam) {
        pixelEngine.drawCheckDam(ctx, sx, sy, loc.width, loc.height);
        ctx.restore();
        continue;
      }

      // 5. School of Life Sciences (#73) — Concentric Circular GBA Complex
      if (loc.id === 73) {
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

        // Inner Circular Courtyard Garden
        ctx.fillStyle = '#58b848';
        ctx.beginPath();
        ctx.arc(cx, cy, rad - 22, 0, Math.PI * 2);
        ctx.fill();

        // Central Glass Dome & ASPIRE-BioNEST Cupola
        ctx.fillStyle = '#90d8f8';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SLS', cx, cy + 3);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText('School of Life Sciences', cx, sy - 4);
        ctx.shadowBlur = 0;

        ctx.restore();
        continue;
      }

      // 6. Sports Stadium Oval Track (#47)
      if (loc.id === 47) {
        ctx.fillStyle = '#b84030';
        ctx.beginPath();
        ctx.ellipse(sx + loc.width / 2, sy + loc.height / 2, loc.width / 2, loc.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38b848';
        ctx.beginPath();
        ctx.ellipse(sx + loc.width / 2, sy + loc.height / 2, loc.width / 2 - 12, loc.height / 2 - 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(loc.shortName, sx + loc.width / 2, sy - 3);
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
        roofPrimary = '#3068b8';
        roofShadow = '#183878';
        roofHighlight = '#5898f8';
      } else if (loc.category === 'research') {
        roofPrimary = '#288878';
        roofShadow = '#105848';
        roofHighlight = '#48c8a8';
      } else if (loc.category === 'residential') {
        roofPrimary = '#d87828';
        roofShadow = '#984810';
        roofHighlight = '#f8a858';
      } else if (loc.category === 'student-life' || loc.isNightCanteen) {
        roofPrimary = '#e84878';
        roofShadow = '#982048';
        roofHighlight = '#f878a8';
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

      ctx.fillStyle = loc.hasInterior ? '#d82828' : '#3878b8';
      ctx.fillRect(doorX - 2, doorY + 8, doorW + 4, 6);

      ctx.fillStyle = '#282838';
      ctx.fillRect(doorX, doorY, doorW, 12);
      ctx.fillStyle = '#90d8f8';
      ctx.fillRect(doorX + 2, doorY + 2, 5, 8);
      ctx.fillRect(doorX + 9, doorY + 2, 5, 8);

      // Windows
      const numWindows = Math.max(1, Math.floor((loc.width - 24) / 16));
      for (let w = 0; w < numWindows; w++) {
        const wx = sx + 8 + w * 16;
        ctx.fillStyle = '#182838';
        ctx.fillRect(wx, sy + 22, 10, 8);
        ctx.fillStyle = '#90d8f8';
        ctx.fillRect(wx + 1, sy + 23, 8, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(wx + 2, sy + 24, 2, 2);
      }

      if (loc.id <= 76) {
        ctx.fillStyle = '#d82828';
        ctx.fillRect(sx + 2, sy + 2, 14, 10);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${loc.id}`, sx + 9, sy + 9);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 3;
      ctx.fillText(loc.shortName || loc.name, sx + loc.width / 2, sy - 3);
      ctx.shadowBlur = 0;

      if (loc.hasInterior) {
        const bob = Math.sin(Date.now() / 150) * 2;
        ctx.fillStyle = '#f8d030';
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
