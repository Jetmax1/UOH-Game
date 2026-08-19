import { pixelEngine } from './PixelArtEngine.js';

/**
 * Pokémon FireRed GBA Multi-Section Campus World Map
 * Features dense forest borders, 9 distinct regional sectors, stone plazas,
 * flowerbed gardens, park benches, fountains, and wandering wildlife.
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
      { id: 'south_campus', name: 'SOUTH COMMUNE', sub: 'MHK Hostel, CIS & Night Canteen', bounds: { x1: 50, y1: 1450, x2: 900, y2: 2150 } }
    ];

    // Lakes
    this.waterBodies = [
      { id: 101, name: 'Gundla Kunta', x: 980, y: 1180, radiusX: 95, radiusY: 75, color: '#3878b8' },
      { id: 102, name: 'Peacock Lake', x: 1680, y: 1080, radiusX: 105, radiusY: 85, color: '#2868a8' },
      { id: 103, name: 'Chilkala Kunta', x: 1020, y: 1780, radiusX: 85, radiusY: 65, color: '#3070b0' },
      { id: 104, name: 'Nallagandla Lake', x: 130, y: 950, radiusX: 85, radiusY: 70, color: '#3880c0' },
      { id: 105, name: 'Kamalavanam Kunta', x: 860, y: 1520, radiusX: 65, radiusY: 55, color: '#205898' }
    ];

    // Roads & Paved Avenue Segments [x1, y1, x2, y2, width]
    this.roads = [
      [500, 180, 1850, 180, 24],  // Old Bombay Highway
      [890, 180, 890, 750, 22],   // Route 1 Spine
      [890, 750, 1150, 750, 20],  // Central Academic Square
      [1150, 750, 1150, 950, 20],
      [890, 750, 890, 1050, 20],
      [890, 1050, 1150, 1050, 20],
      [1150, 950, 1150, 1050, 20],
      [1470, 180, 1470, 550, 20], // East Science Avenue
      [1470, 550, 1750, 550, 18],
      [1750, 550, 1750, 700, 18],
      [1150, 750, 1470, 550, 18],
      [1150, 750, 1470, 750, 18],
      [890, 650, 550, 650, 18],   // West Stadium Avenue
      [550, 650, 550, 850, 20],
      [550, 850, 350, 850, 16],
      [890, 1050, 780, 1250, 18], // South Spine
      [780, 1250, 620, 1450, 18],
      [620, 1450, 450, 1700, 20],
      [450, 1700, 450, 1980, 20],
      [450, 1980, 260, 2020, 22],
      [120, 1660, 550, 1660, 18], // South Cross Avenues
      [450, 1700, 750, 1700, 18],
      [450, 1900, 750, 1900, 18],
      [1150, 1050, 1450, 1100, 12], // Nature Trails
      [1450, 1100, 1680, 1180, 12],
      [1680, 1180, 2000, 1120, 12],
      [1450, 1100, 1520, 1000, 10],
      [1150, 1050, 1340, 1150, 10],
      [780, 1250, 950, 1220, 12]
    ];

    // Decorative Plazas & Stone Courtyards
    this.plazas = [
      { x: 840, y: 460, w: 100, h: 50 },  // Admin Quad
      { x: 1080, y: 880, w: 120, h: 70 }, // Library Square
      { x: 1260, y: 680, w: 90, h: 60 },  // Zakir Food Plaza
      { x: 420, y: 1720, w: 110, h: 80 }  // South Night Hub Plaza
    ];

    // Park Benches & Props
    this.benches = [
      { x: 860, y: 530 }, { x: 920, y: 530 },
      { x: 1110, y: 940 }, { x: 1170, y: 940 },
      { x: 1290, y: 760 }, { x: 1330, y: 760 },
      { x: 440, y: 1800 }, { x: 490, y: 1800 }
    ];

    // Stone Fountains
    this.fountains = [
      { x: 890, y: 480 },  // Admin Fountain
      { x: 1140, y: 910 }, // Library Square Fountain
      { x: 480, y: 1760 }  // South Quad Fountain
    ];

    // Garden Hedges [x, y, w, h in 16px tiles]
    this.hedges = [
      { x: 820, y: 410, tilesX: 3, tilesY: 1 },
      { x: 950, y: 410, tilesX: 3, tilesY: 1 },
      { x: 1060, y: 860, tilesX: 1, tilesY: 4 },
      { x: 1220, y: 860, tilesX: 1, tilesY: 4 }
    ];

    // Fences
    this.fences = [
      { x: 850, y: 200, length: 5 },
      { x: 920, y: 200, length: 5 },
      { x: 1430, y: 200, length: 4 },
      { x: 1520, y: 200, length: 4 },
      { x: 220, y: 2000, length: 4 },
      { x: 310, y: 2000, length: 4 },
      { x: 510, y: 660, length: 6 }
    ];

    // Signposts
    this.signposts = [
      { x: 870, y: 240, text: 'ROUTE 1 — Entrance to Central Campus & Administration' },
      { x: 1180, y: 730, text: 'CENTRAL GROVE — School of Computer Science & Information Sciences' },
      { x: 1180, y: 960, text: 'CENTRAL GROVE — Indira Gandhi Memorial Library' },
      { x: 1490, y: 240, text: 'SCIENCE VALLEY — School of Chemistry & Research Institutes' },
      { x: 470, y: 1910, text: 'SOUTH COMMUNE — MHK Hostel & Player Dormitories' },
      { x: 1980, y: 1090, text: 'NATURAL WONDER — Protected Heritage Mushroom Rock' }
    ];

    // Street Lamps
    this.streetLamps = [
      { x: 890, y: 220 }, { x: 890, y: 350 }, { x: 890, y: 500 }, { x: 890, y: 650 },
      { x: 1020, y: 750 }, { x: 1150, y: 750 }, { x: 1150, y: 880 }, { x: 1150, y: 1020 },
      { x: 1470, y: 250 }, { x: 1470, y: 400 }, { x: 1600, y: 550 }, { x: 1750, y: 620 },
      { x: 720, y: 650 }, { x: 550, y: 700 }, { x: 550, y: 820 },
      { x: 830, y: 1150 }, { x: 700, y: 1350 }, { x: 540, y: 1550 },
      { x: 450, y: 1720 }, { x: 450, y: 1880 }, { x: 300, y: 1780 }, { x: 260, y: 2000 }
    ];

    // Wandering Wildlife Instances
    this.wildlife = [
      { type: 'peacock', x: 1620, y: 1120, startX: 1620, startY: 1120, vx: 12, timer: 0 },
      { type: 'peacock', x: 1720, y: 1150, startX: 1720, startY: 1150, vx: -10, timer: 0 },
      { type: 'deer', x: 1080, y: 1320, startX: 1080, startY: 1320, vx: 8, timer: 0 },
      { type: 'deer', x: 1480, y: 920, startX: 1480, startY: 920, vx: -8, timer: 0 },
      { type: 'butterfly', x: 870, y: 520, startX: 870, startY: 520, vx: 15, timer: 0 },
      { type: 'butterfly', x: 1120, y: 920, startX: 1120, startY: 920, vx: 15, timer: 0 }
    ];

    // Build dense forest wall tree grids
    this.generateDenseWorld();

    // Colliders
    this.colliders = [];
    this.buildColliders();
  }

  generateDenseWorld() {
    this.denseForestTrees = [];
    this.tallGrassPatches = [];

    // Dense Forest Wall Blocks enclosing routes (like FireRed Kanto maps!)
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
      // South-East Chilkala buffer
      { x: 960, y: 1880, w: 420, h: 180 },
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

    // Tall grass patches around nature paths and lakes
    const grassAreas = [
      { x: 960, y: 1100, w: 4, h: 3 },
      { x: 1600, y: 1040, w: 5, h: 4 },
      { x: 1740, y: 1180, w: 6, h: 3 },
      { x: 1480, y: 980, w: 4, h: 3 },
      { x: 1320, y: 1140, w: 3, h: 3 },
      { x: 460, y: 1840, w: 4, h: 3 }
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
      if (loc.isLake || loc.isMajorWonder || loc.isGate) return;
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
    // 1. Check NPCs
    for (const npc of this.npcs) {
      const dx = playerX - npc.x;
      const dy = playerY - npc.y;
      if (Math.sqrt(dx * dx + dy * dy) <= maxDist) {
        return { type: 'npc', data: npc };
      }
    }

    // 2. Check Signposts
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

    // 3. Check Locations & Interiors
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

    // 1. Ground Grass & Flowerbeds
    this.drawTerrain(ctx, camera);

    // 2. Stone Plazas & Courtyards
    this.drawPlazas(ctx, camera);

    // 3. Roads & Cobblestone Avenues
    this.drawRoads(ctx, camera);

    // 4. Tall Grass Wild Patches
    this.drawTallGrass(ctx, camera);

    // 5. Garden Hedges
    this.drawHedges(ctx, camera);

    // 6. Water Bodies with Wave Crests
    this.drawWaterBodies(ctx, camera);

    // 7. Ancient Rock Formations & Mushroom Rock
    this.drawRockFormations(ctx, camera);

    // 8. FireRed Building Facades
    this.drawBuildings(ctx, camera);

    // 9. Fences, Benches, Fountains & Signs
    this.drawProps(ctx, camera);

    // 10. Dense Layered Trees (Forest Walls)
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

      // Stone Courtyard base
      ctx.fillStyle = '#d0b888';
      ctx.fillRect(sx, sy, p.w, p.h);

      // Brick borders
      ctx.strokeStyle = '#a88850';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, p.w, p.h);

      // Paved Grid
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

      // Sandy stone curb
      ctx.strokeStyle = '#c8a870';
      ctx.lineWidth = w + 4;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();

      // Cobblestone body
      ctx.strokeStyle = '#e0c890';
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();

      // Brick pattern dash
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
    // Mushroom Rock (#76)
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

    // Virgin Rock & High Rock
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

    // Megalithic Site (#42)
    const megaLoc = this.locations.find(l => l.id === 42);
    if (megaLoc) {
      const sx = megaLoc.x - camera.x;
      const sy = megaLoc.y - camera.y;
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const bx = sx + 30 + Math.cos(angle) * 22;
        const by = sy + 25 + Math.sin(angle) * 22;
        ctx.fillStyle = '#585868';
        ctx.fillRect(bx - 4, by - 4, 8, 8);
        ctx.fillStyle = '#888898';
        ctx.fillRect(bx - 3, by - 3, 5, 5);
      }
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Megalithic Circle', sx + 30, sy + 44);
      ctx.restore();
    }
  }

  drawBuildings(ctx, camera) {
    for (const loc of this.locations) {
      if (loc.isLake || loc.isMajorWonder || loc.id === 42) continue;

      const sx = loc.x - camera.x;
      const sy = loc.y - camera.y;

      if (sx + loc.width < -20 || sx > camera.width + 20 || sy + loc.height < -20 || sy > camera.height + 20) continue;

      ctx.save();

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
      } else if (loc.category === 'sports') {
        roofPrimary = '#28a848';
        roofShadow = '#106828';
        roofHighlight = '#58d878';
      }

      if (loc.id === 73) {
        const rad = loc.width / 2;
        ctx.fillStyle = wallColor;
        ctx.beginPath();
        ctx.arc(sx + rad, sy + rad, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = roofPrimary;
        ctx.beginPath();
        ctx.arc(sx + rad, sy + rad, rad - 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = roofHighlight;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (loc.id === 47) {
        ctx.fillStyle = '#b84030';
        ctx.beginPath();
        ctx.ellipse(sx + loc.width / 2, sy + loc.height / 2, loc.width / 2, loc.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38b848';
        ctx.beginPath();
        ctx.ellipse(sx + loc.width / 2, sy + loc.height / 2, loc.width / 2 - 12, loc.height / 2 - 12, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = foundationColor;
        ctx.fillRect(sx, sy + loc.height - 8, loc.width, 8);

        ctx.fillStyle = wallColor;
        ctx.fillRect(sx + 2, sy + 18, loc.width - 4, loc.height - 26);

        ctx.fillStyle = roofShadow;
        ctx.fillRect(sx, sy, loc.width, 18);
        ctx.fillStyle = roofPrimary;
        ctx.fillRect(sx + 2, sy + 2, loc.width - 4, 14);
        ctx.fillStyle = roofHighlight;
        ctx.fillRect(sx + 4, sy + 2, loc.width - 8, 3);

        ctx.fillStyle = roofShadow;
        for (let rx = sx + 8; rx < sx + loc.width - 6; rx += 12) {
          ctx.fillRect(rx, sy + 5, 2, 10);
        }

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

    // Fences
    for (const f of this.fences) {
      for (let i = 0; i < f.length; i++) {
        const sx = (f.x + i * 16) - camera.x;
        const sy = f.y - camera.y;
        if (sx > -20 && sx < camera.width + 20 && sy > -20 && sy < camera.height + 20) {
          ctx.drawImage(fenceTile, sx, sy);
        }
      }
    }

    // Benches
    for (const b of this.benches) {
      const sx = b.x - camera.x;
      const sy = b.y - camera.y;
      if (sx > -30 && sx < camera.width + 30 && sy > -20 && sy < camera.height + 20) {
        ctx.drawImage(benchSprite, sx, sy);
      }
    }

    // Fountains
    for (const fn of this.fountains) {
      const sx = fn.x - camera.x - 16;
      const sy = fn.y - camera.y - 16;
      if (sx > -40 && sx < camera.width + 40 && sy > -40 && sy < camera.height + 40) {
        ctx.drawImage(fountainSprite, sx, sy);
      }
    }

    // Signposts
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
