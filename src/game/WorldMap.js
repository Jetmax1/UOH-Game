import { pixelEngine } from './PixelArtEngine.js';
import { sectionConfigs, masterWorldConfig } from '../data/map/worldData.js';
import { navigationEngine } from './NavigationEngine.js';

/**
 * Pokémon FireRed GBA 4-Section Campus World Map System
 * Coordinates multi-section world simulation, collision boundaries, and visual rendering
 * driven by structured map data from worldData.js.
 */
export class WorldMap {
  constructor(locationsData, npcsData) {
    this.allLocations = locationsData;
    this.allNPCs = npcsData;
    this.currentSection = masterWorldConfig.defaultSection || 'main';

    this.masterConfig = masterWorldConfig;
    this.sectionConfigs = sectionConfigs;

    this.setSection(this.currentSection);
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
    this.fieldBlocks = cfg.fieldBlocks || [];
    this.tallGrassPatches = cfg.tallGrassPatches || [];

    // Filter locations & NPCs belonging to this section
    this.locations = this.allLocations.filter(loc => loc.section === sectionId);
    this.npcs = this.allNPCs.filter(npc => npc.section === sectionId);

    this.initVehiclesForSection();
    this.generateDenseWorld();
    this.buildColliders();
  }

  initVehiclesForSection() {
    this.vehicles = [];

    if (this.currentSection === 'main') {
      this.vehicles.push({
        id: 'shuttle_main_1',
        name: 'Campus E-Shuttle 1',
        x: 100,
        y: 240,
        color: 'emerald',
        speed: 38,
        direction: 'right',
        waypoints: [
          { x: 100, y: 240 },
          { x: 700, y: 240 },
          { x: 700, y: 520 },
          { x: 940, y: 540 },
          { x: 1540, y: 520 },
          { x: 940, y: 540 },
          { x: 700, y: 520 },
          { x: 700, y: 240 }
        ],
        currentWpIdx: 0,
        isBlinking: false,
        blinkSide: 'right',
        blinkerTimer: 0
      });
      this.vehicles.push({
        id: 'shuttle_main_2',
        name: 'Library Express Cart',
        x: 700,
        y: 520,
        color: 'yellow',
        speed: 32,
        direction: 'down',
        waypoints: [
          { x: 700, y: 240 },
          { x: 700, y: 520 },
          { x: 680, y: 640 },
          { x: 860, y: 705 },
          { x: 800, y: 910 },
          { x: 860, y: 705 },
          { x: 680, y: 640 },
          { x: 700, y: 520 }
        ],
        currentWpIdx: 1,
        isBlinking: false,
        blinkSide: 'left',
        blinkerTimer: 0
      });
    } else if (this.currentSection === 'south') {
      this.vehicles.push({
        id: 'shuttle_south_1',
        name: 'South Campus Buggy',
        x: 220,
        y: 470,
        color: 'blue',
        speed: 36,
        direction: 'right',
        waypoints: [
          { x: 220, y: 470 },
          { x: 700, y: 470 },
          { x: 1100, y: 470 },
          { x: 1100, y: 800 },
          { x: 1100, y: 1180 },
          { x: 1100, y: 800 },
          { x: 1100, y: 470 },
          { x: 700, y: 470 }
        ],
        currentWpIdx: 0,
        isBlinking: false,
        blinkSide: 'right',
        blinkerTimer: 0
      });
    } else if (this.currentSection === 'west') {
      this.vehicles.push({
        id: 'shuttle_west_1',
        name: 'Stadium Shuttle',
        x: 140,
        y: 250,
        color: 'emerald',
        speed: 38,
        direction: 'right',
        waypoints: [
          { x: 140, y: 250 },
          { x: 550, y: 250 },
          { x: 1280, y: 250 },
          { x: 1280, y: 590 },
          { x: 1280, y: 250 },
          { x: 550, y: 250 }
        ],
        currentWpIdx: 0,
        isBlinking: false,
        blinkSide: 'right',
        blinkerTimer: 0
      });
    } else if (this.currentSection === 'east') {
      this.vehicles.push({
        id: 'shuttle_east_1',
        name: 'Science & Sukoon Shuttle',
        x: 80,
        y: 520,
        color: 'purple',
        speed: 40,
        direction: 'right',
        waypoints: [
          { x: 80, y: 520 },
          { x: 440, y: 520 },
          { x: 740, y: 660 },
          { x: 1020, y: 760 },
          { x: 1360, y: 860 },
          { x: 1620, y: 960 },
          { x: 1980, y: 960 },
          { x: 1720, y: 680 },
          { x: 1440, y: 420 },
          { x: 1180, y: 180 },
          { x: 1000, y: 360 },
          { x: 740, y: 660 },
          { x: 440, y: 520 },
          { x: 80, y: 520 }
        ],
        currentWpIdx: 0,
        isBlinking: false,
        blinkSide: 'right',
        blinkerTimer: 0
      });
      this.vehicles.push({
        id: 'shuttle_east_2',
        name: 'Gachibowli Express Buggy',
        x: 1440,
        y: 420,
        color: 'emerald',
        speed: 42,
        direction: 'down',
        waypoints: [
          { x: 1440, y: 420 },
          { x: 1720, y: 680 },
          { x: 1980, y: 960 },
          { x: 2220, y: 1260 },
          { x: 2060, y: 1320 },
          { x: 1850, y: 1380 },
          { x: 1600, y: 1260 },
          { x: 1620, y: 960 },
          { x: 1980, y: 960 },
          { x: 1720, y: 680 },
          { x: 1440, y: 420 }
        ],
        currentWpIdx: 0,
        isBlinking: false,
        blinkSide: 'left',
        blinkerTimer: 0
      });
    }
  }

  generateDenseWorld() {
    this.denseForestTrees = [];
    const treeMargin = 14;

    const step = 24; // 24px retro RPG tree grid step (interlocking canopy like Pokemon/Zelda)
    for (let ty = 20; ty < this.height - 20; ty += step) {
      // Staggered rows for interlocking hexagonal tree canopy
      const rowOffset = (Math.floor(ty / step) % 2) * 12;
      for (let tx = 20 + rowOffset; tx < this.width - 20; tx += step) {
        const tLeft = tx - 14;
        const tRight = tx + 14;
        const tTop = ty - 22;
        const tBottom = ty + 6;

        // 1. Prevent trees from spawning inside or overlapping any building footprint
        let collidesBuilding = false;
        for (const loc of this.locations) {
          const locLeft = loc.x - treeMargin;
          const locRight = loc.x + loc.width + treeMargin;
          const locTop = loc.y - treeMargin;
          const locBottom = loc.y + loc.height + treeMargin;

          if (tLeft < locRight && tRight > locLeft && tTop < locBottom && tBottom > locTop) {
            collidesBuilding = true;
            break;
          }
        }
        if (collidesBuilding) continue;

        // 2. Prevent trees from spawning on plazas or courtyards
        let collidesPlaza = false;
        for (const p of this.plazas) {
          if (tLeft < p.x + p.w + 8 && tRight > p.x - 8 && tTop < p.y + p.h + 8 && tBottom > p.y - 8) {
            collidesPlaza = true;
            break;
          }
        }
        if (collidesPlaza) continue;

        // 3. Prevent trees from spawning inside water bodies & shorelines
        let collidesWater = false;
        for (const w of this.waterBodies) {
          const dx = (tx - w.x) / (w.radiusX + 16);
          const dy = (ty - w.y) / (w.radiusY + 16);
          if (dx * dx + dy * dy < 1) {
            collidesWater = true;
            break;
          }
        }
        if (collidesWater) continue;

        // 4. Prevent trees from spawning on paved roads, avenues, paths, and nature trails
        let collidesRoad = false;
        for (const [x1, y1, x2, y2, rw] of this.roads) {
          const dx = x2 - x1;
          const dy = y2 - y1;
          const lenSq = dx * dx + dy * dy;
          let dist;
          if (lenSq === 0) {
            dist = Math.hypot(tx - x1, ty - y1);
          } else {
            const t = Math.max(0, Math.min(1, ((tx - x1) * dx + (ty - y1) * dy) / lenSq));
            dist = Math.hypot(tx - (x1 + t * dx), ty - (y1 + t * dy));
          }
          if (dist < rw / 2 + 12) {
            collidesRoad = true;
            break;
          }
        }
        if (collidesRoad) continue;

        // 5. Prevent trees on checkpoint gates
        let collidesCheckpoint = false;
        for (const cp of this.checkpoints) {
          if (tLeft < cp.x + cp.width + 12 && tRight > cp.x - 12 && tTop < cp.y + cp.height + 12 && tBottom > cp.y - 12) {
            collidesCheckpoint = true;
            break;
          }
        }
        if (collidesCheckpoint) continue;

        // 6. In agricultural fields, keep trees sparse (orchard spacing) instead of dense wall
        let isField = false;
        for (const f of this.sectionConfigs[this.currentSection]?.fieldBlocks || []) {
          if (tx >= f.x && tx <= f.x + f.w && ty >= f.y && ty <= f.y + f.h) {
            isField = true;
            break;
          }
        }
        if (isField && ((tx + ty) % 96 !== 0)) continue;

        this.denseForestTrees.push({
          x: tx,
          y: ty,
          type: ((tx + ty) % 4 === 0) ? 'pine' : (((tx * 3 + ty) % 5 === 0) ? 'gulmohar' : 'oak')
        });
      }
    }
  }

  buildColliders() {
    this.colliders = [];

    // 1. Outer Bounds
    this.colliders.push({ x: -100, y: -100, width: this.width + 200, height: 100 });
    this.colliders.push({ x: -100, y: this.height, width: this.width + 200, height: 100 });
    this.colliders.push({ x: -100, y: -100, width: 100, height: this.height + 200 });
    this.colliders.push({ x: this.width, y: -100, width: 100, height: this.height + 200 });

    // 2. Locations (Buildings & Landmarks)
    this.locations.forEach(loc => {
      if (loc.isLake || loc.isMajorWonder || loc.isGate || loc.isAmphitheatre || loc.isVolleyball || loc.isCheckDam) return;
      this.colliders.push({
        id: loc.id,
        name: loc.name,
        x: loc.x,
        y: loc.y,
        width: loc.width,
        height: Math.max(16, loc.height - 8) // Clearance for entrance doorway threshold
      });
    });

    // 3. Water Bodies (Smooth Elliptical Shoreline Colliders)
    this.waterBodies.forEach(w => {
      const rx = w.radiusX * 0.90;
      const ry = w.radiusY * 0.90;
      this.colliders.push({
        id: w.id,
        isWater: true,
        isEllipse: true,
        centerX: w.x,
        centerY: w.y,
        radiusX: rx,
        radiusY: ry,
        x: w.x - rx,
        y: w.y - ry,
        width: rx * 2,
        height: ry * 2
      });
    });

    // 4. Perimeter Fences & Security Barriers
    this.fences.forEach(f => {
      this.colliders.push({
        isFence: true,
        x: f.x,
        y: f.y + 2,
        width: f.length * 16,
        height: 10
      });
    });

    // 5. Dense Forest Tree Trunks (Physical obstacle cores)
    this.denseForestTrees.forEach(t => {
      this.colliders.push({
        isTreeTrunk: true,
        x: t.x - 4,
        y: t.y - 2,
        width: 8,
        height: 6
      });
    });

    // 6. Fountains
    this.fountains.forEach(f => {
      this.colliders.push({
        x: f.x - 12,
        y: f.y - 12,
        width: 24,
        height: 24
      });
    });

    // Build spatial hash grid for instant collision queries
    navigationEngine.buildSpatialGrid(this.colliders, this.width, this.height);
    navigationEngine.buildRoadGraph(this.roads);
  }

  checkCollision(bounds) {
    return navigationEngine.checkCollision(bounds);
  }

  getSurfaceAt(x, y) {
    const cfg = this.sectionConfigs[this.currentSection];
    return navigationEngine.getSurfaceAt(x, y, cfg);
  }

  getSurfaceModifier(x, y) {
    const cfg = this.sectionConfigs[this.currentSection];
    return navigationEngine.getSpeedModifierAt(x, y, cfg);
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

  updateWildlife(delta, player = null) {
    for (const w of this.wildlife) {
      w.timer += delta;
      w.x += w.vx * delta;
      if (Math.abs(w.x - w.startX) > 40) {
        w.vx = -w.vx;
      }
    }

    this.updateVehicles(delta, player);
  }

  updateVehicles(delta, player) {
    if (!this.vehicles) return;

    for (const v of this.vehicles) {
      if (!v.waypoints || v.waypoints.length === 0) continue;

      const targetWp = v.waypoints[v.currentWpIdx];
      const dx = targetWp.x - v.x;
      const dy = targetWp.y - v.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Blinker animation timer
      v.blinkerTimer = (v.blinkerTimer || 0) + delta;
      v.isBlinking = (Math.floor(v.blinkerTimer * 4) % 2 === 0);

      // Check pedestrian safety: if player is right in front within 30px, slow down/yield
      let speed = v.speed;
      if (player) {
        const pdist = Math.hypot(player.x - v.x, player.y - v.y);
        if (pdist < 32) speed = 0;
      }

      if (dist < 4) {
        // Arrived at current waypoint, select next
        v.currentWpIdx = (v.currentWpIdx + 1) % v.waypoints.length;
        const nextWp = v.waypoints[v.currentWpIdx];
        const nextDx = nextWp.x - v.x;
        const nextDy = nextWp.y - v.y;

        if (Math.abs(nextDx) > Math.abs(nextDy)) {
          v.direction = nextDx > 0 ? 'right' : 'left';
        } else {
          v.direction = nextDy > 0 ? 'down' : 'up';
        }
      } else {
        const moveDist = Math.min(speed * delta, dist);
        v.x += (dx / dist) * moveDist;
        v.y += (dy / dist) * moveDist;

        if (Math.abs(dx) > Math.abs(dy)) {
          v.direction = dx > 0 ? 'right' : 'left';
        } else {
          v.direction = dy > 0 ? 'down' : 'up';
        }
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

    // 10. Dense Trees & Forest Borders (Rendered behind buildings to prevent covering)
    this.drawDenseForest(ctx, camera);

    // 11. Custom Architectural Buildings (All Pins with Badges)
    this.drawBuildings(ctx, camera);

    // 12. Campus Autonomous E-Shuttles & Traffic
    this.drawVehicles(ctx, camera, timeSystem);

    // 13. Fences, Benches, Fountains, Signs
    this.drawProps(ctx, camera);

    // 14. Street Lamps
    this.drawStreetLamps(ctx, camera, timeSystem);

    // 15. Wildlife & NPCs
    this.drawWildlife(ctx, camera);
    this.drawNPCs(ctx, camera);
  }

  drawVehicles(ctx, camera, timeSystem) {
    if (!this.vehicles) return;
    const isNight = timeSystem.ambientMode === 'night' || timeSystem.ambientMode === 'evening';

    for (const v of this.vehicles) {
      const sx = v.x - camera.x;
      const sy = v.y - camera.y;

      if (sx < -60 || sx > camera.width + 60 || sy < -60 || sy > camera.height + 60) continue;

      // Draw vehicle headlight beam at evening/night
      if (isNight) {
        ctx.save();
        let hx = sx + 18;
        let hy = sy + 11;
        let angle = 0;
        if (v.direction === 'right') { hx = sx + 34; hy = sy + 11; angle = 0; }
        else if (v.direction === 'left') { hx = sx + 2; hy = sy + 11; angle = Math.PI; }
        else if (v.direction === 'down') { hx = sx + 11; hy = sy + 34; angle = Math.PI / 2; }
        else if (v.direction === 'up') { hx = sx + 11; hy = sy + 2; angle = -Math.PI / 2; }

        ctx.translate(hx, hy);
        ctx.rotate(angle);

        const beam = ctx.createRadialGradient(0, 0, 5, 45, 0, 50);
        beam.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
        beam.addColorStop(0.5, 'rgba(254, 240, 138, 0.2)');
        beam.addColorStop(1, 'rgba(254, 240, 138, 0)');

        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(55, -22);
        ctx.lineTo(55, 22);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      const sprite = pixelEngine.getVehicleSprite(v.direction, v.color, v.isBlinking, v.blinkSide);
      ctx.drawImage(sprite, sx, sy);

      // Vehicle Name Tag
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 3;
      ctx.fillText(v.name, sx + (v.direction === 'left' || v.direction === 'right' ? 18 : 11), sy - 4);
      ctx.restore();
    }
  }

  drawTerrain(ctx, camera) {
    const grassTile = pixelEngine.getGrassTile();
    const flowerRed = pixelEngine.getFlowerTile('red');
    const flowerYellow = pixelEngine.getFlowerTile('yellow');
    const fieldTile = pixelEngine.getFieldTile();

    const tileSize = 16;
    const startTileX = Math.floor(camera.x / tileSize);
    const startTileY = Math.floor(camera.y / tileSize);
    const endTileX = Math.ceil((camera.x + camera.width) / tileSize);
    const endTileY = Math.ceil((camera.y + camera.height) / tileSize);

    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        const wx = tx * tileSize;
        const wy = ty * tileSize;
        const sx = wx - camera.x;
        const sy = wy - camera.y;

        // Check if tile falls within field / agricultural dirt patches
        let isField = false;
        if (this.fieldBlocks && this.fieldBlocks.length > 0) {
          for (let f = 0; f < this.fieldBlocks.length; f++) {
            const fb = this.fieldBlocks[f];
            if (wx >= fb.x && wx < fb.x + fb.w && wy >= fb.y && wy < fb.y + fb.h) {
              isField = true;
              break;
            }
          }
        }

        if (isField) {
          ctx.drawImage(fieldTile, sx, sy);
        } else if ((tx * 7 + ty * 13) % 23 === 0) {
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

      // 6. Overhead Water Tank (#91)
      if (loc.isWaterTank) {
        pixelEngine.drawWaterTank(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 7. GMC Balayogi Sports Complex (#92)
      if (loc.isBalayogi) {
        pixelEngine.drawBalayogiSportsComplex(ctx, sx, sy, loc.width / 2);
        this.drawPinBadge(ctx, sx + 4, sy + 4, loc.id);
        ctx.restore();
        continue;
      }

      // 8. Gachibowli Stadium (#93)
      if (loc.isGachibowliStadium) {
        pixelEngine.drawGachibowliStadium(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 4, sy + 4, loc.id);
        ctx.restore();
        continue;
      }

      // 9. University of Hyderabad Monument (#86)
      if (loc.isMonument) {
        pixelEngine.drawUoHMonument(ctx, sx, sy, loc.width / 2);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 10. SATG Shooting Ranges (#87)
      if (loc.isShootingRange) {
        pixelEngine.drawShootingRange(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 11. Sai Baba Temple (#89)
      if (loc.isSaiBabaTemple) {
        pixelEngine.drawSaiBabaTemple(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 12. Indian Immunologicals Limited (#90)
      if (loc.isIndianImmunologicals) {
        pixelEngine.drawIndianImmunologicals(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 13. Health Center (#38)
      if (loc.isHealthCenter) {
        pixelEngine.drawHealthCenter(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 14. Administration Building (#36)
      if (loc.isAdminBuilding) {
        pixelEngine.drawAdminBuilding(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 15. SCIS (School of Computer Sciences) (#45)
      if (loc.isSCIS) {
        pixelEngine.drawSCISBuilding(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 16. IGM Library, UoH (#51)
      if (loc.isIGMLibrary) {
        pixelEngine.drawIGMLibrary(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 17. HCU Small Gate Security Office (#41)
      if (loc.isSmallGate) {
        pixelEngine.drawSecurityGateOffice(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 18. Karthik SIM Cards & Xerox (#42)
      if (loc.isKarthikXerox) {
        pixelEngine.drawKarthikXerox(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 19. India Post (#74)
      if (loc.isIndiaPost) {
        pixelEngine.drawIndiaPost(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 20. Sukoon Canteen (#59)
      if (loc.isSukoonCanteen) {
        pixelEngine.drawSukoonCanteen(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 21. RV Panchajanya Kondapur (#88)
      if (loc.isRVPanchajanya) {
        pixelEngine.drawRVPanchajanya(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 22. Football Field (#94)
      if (loc.isFootballField) {
        pixelEngine.drawFootballField(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 23. Parking Area (#95)
      if (loc.isParkingArea) {
        pixelEngine.drawParkingArea(ctx, sx, sy, loc.width, loc.height);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 24. Central Rotunda Dome (#85)
      if (loc.isCentralDome) {
        pixelEngine.drawUoHMonument(ctx, sx, sy, loc.width / 2);
        this.drawPinBadge(ctx, sx + 2, sy + 2, loc.id);
        ctx.restore();
        continue;
      }

      // 25. School of Life Sciences (#3) & ASPIRE BioNEST (#2)
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

      // 26. Standard Upgraded GBA Departmental & Residential Buildings
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

      // Red numbered pin badge (1 to 99)
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
    if (id > 99) return;
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

    // Draw authentic 8-Bit Map Legend in East Campus
    if (this.currentSection === 'east') {
      const lx = 50 - camera.x;
      const ly = 1180 - camera.y;
      if (lx > -150 && lx < camera.width + 150 && ly > -150 && ly < camera.height + 150) {
        pixelEngine.drawMapLegend(ctx, lx, ly);
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
