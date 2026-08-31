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
    const treeMargin = 28; // Spacious clearance margin around buildings for open campus lawns

    // 1. Perimeter / Forest Belt Trees (Dense forest boundary blocks)
    for (const f of this.sectionConfigs[this.currentSection]?.forestBlocks || []) {
      const step = 36; // Interlocking trees inside designated forest blocks
      for (let ty = f.y; ty < f.y + f.h; ty += step) {
        const rowOffset = (Math.floor(ty / step) % 2) * 18;
        for (let tx = f.x + rowOffset; tx < f.x + f.w; tx += step) {
          if (this.canPlaceTree(tx, ty, treeMargin)) {
            this.denseForestTrees.push({
              x: tx,
              y: ty,
              type: ((tx + ty) % 4 === 0) ? 'pine' : (((tx * 3 + ty) % 5 === 0) ? 'gulmohar' : 'oak')
            });
          }
        }
      }
    }

    // 2. Open Campus Lawn & Avenue Trees (Spaced out shade trees, step ~96px)
    const campusStep = 96; 
    for (let ty = 60; ty < this.height - 60; ty += campusStep) {
      const rowOffset = (Math.floor(ty / campusStep) % 2) * 48;
      for (let tx = 60 + rowOffset; tx < this.width - 60; tx += campusStep) {
        // Skip if already inside a dense forest block
        let inForestBlock = false;
        for (const f of this.sectionConfigs[this.currentSection]?.forestBlocks || []) {
          if (tx >= f.x && tx <= f.x + f.w && ty >= f.y && ty <= f.y + f.h) {
            inForestBlock = true;
            break;
          }
        }
        if (inForestBlock) continue;

        if (this.canPlaceTree(tx, ty, treeMargin)) {
          this.denseForestTrees.push({
            x: tx,
            y: ty,
            type: ((tx + ty) % 3 === 0) ? 'gulmohar' : 'oak'
          });
        }
      }
    }
  }

  canPlaceTree(tx, ty, treeMargin = 28) {
    const tLeft = tx - 14;
    const tRight = tx + 14;
    const tTop = ty - 22;
    const tBottom = ty + 6;

    // 1. Building clearance
    for (const loc of this.locations) {
      if (tLeft < loc.x + loc.width + treeMargin && tRight > loc.x - treeMargin &&
          tTop < loc.y + loc.height + treeMargin && tBottom > loc.y - treeMargin) {
        return false;
      }
    }

    // 2. Plaza clearance
    for (const p of this.plazas) {
      if (tLeft < p.x + p.w + 16 && tRight > p.x - 16 &&
          tTop < p.y + p.h + 16 && tBottom > p.y - 16) {
        return false;
      }
    }

    // 3. Water body clearance
    for (const w of this.waterBodies) {
      const dx = (tx - w.x) / (w.radiusX + 24);
      const dy = (ty - w.y) / (w.radiusY + 24);
      if (dx * dx + dy * dy < 1) return false;
    }

    // 4. Road & trail clearance
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
      if (dist < rw / 2 + 18) return false;
    }

    // 5. Checkpoint clearance
    for (const cp of this.checkpoints) {
      if (tLeft < cp.x + cp.width + 20 && tRight > cp.x - 20 &&
          tTop < cp.y + cp.height + 20 && tBottom > cp.y - 20) {
        return false;
      }
    }

    return true;
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

  getSunShadowOffset(hour = 12) {
    if (hour >= 7 && hour < 12) {
      // Morning: Sun in East -> Shadow extends to West/NW
      const t = (12 - hour) / 5;
      return { x: -8 - t * 10, y: 4 + t * 5, alpha: 0.28 + t * 0.08, length: 12 + t * 10 };
    } else if (hour >= 12 && hour < 15) {
      // Noon: Sun high overhead -> Short contact shadow
      return { x: 0, y: 4, alpha: 0.36, length: 6 };
    } else if (hour >= 15 && hour < 19) {
      // Evening / Golden Hour: Sun in West -> Shadow extends to East/NE
      const t = (hour - 15) / 4;
      return { x: 8 + t * 10, y: 4 + t * 6, alpha: 0.26 + t * 0.08, length: 12 + t * 12 };
    } else {
      // Night: Ambient Moonlight
      return { x: 2, y: 3, alpha: 0.16, length: 5 };
    }
  }

  drawGroundShadows(ctx, camera, timeSystem, player = null) {
    const shadow = this.getSunShadowOffset(timeSystem.hour);
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${shadow.alpha})`;

    // 1. 3D Building Cast Shadow Footprints
    for (const loc of this.locations) {
      if (loc.isLake || loc.isMajorWonder || loc.isGate) continue;
      const sx = loc.x - camera.x;
      const sy = loc.y - camera.y;

      if (sx + loc.width < -60 || sx > camera.width + 60 || sy + loc.height < -60 || sy > camera.height + 60) continue;

      ctx.beginPath();
      ctx.moveTo(sx, sy + loc.height);
      ctx.lineTo(sx + loc.width, sy + loc.height);
      ctx.lineTo(sx + loc.width + shadow.x, sy + loc.height + shadow.y);
      ctx.lineTo(sx + shadow.x, sy + loc.height + shadow.y);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Tree Directional Ground Shadows
    for (const tree of this.denseForestTrees) {
      const sx = tree.x - camera.x;
      const sy = tree.y - camera.y;
      if (sx < -40 || sx > camera.width + 40 || sy < -40 || sy > camera.height + 40) continue;
      ctx.beginPath();
      ctx.ellipse(sx + shadow.x * 0.5, sy + 6 + shadow.y * 0.4, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Geological Rock Monolith Shadows
    for (const rId of [17, 24, 25, 27]) {
      const rock = this.locations.find(l => l.id === rId);
      if (rock) {
        const sx = rock.x - camera.x;
        const sy = rock.y - camera.y;
        if (sx > -60 && sx < camera.width + 60 && sy > -60 && sy < camera.height + 60) {
          ctx.beginPath();
          ctx.ellipse(sx + rock.width / 2 + shadow.x * 0.6, sy + rock.height - 4 + shadow.y * 0.5, rock.width * 0.45, 7, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 4. Vehicle Shadows
    if (this.vehicles) {
      for (const v of this.vehicles) {
        const sx = v.x - camera.x;
        const sy = v.y - camera.y;
        if (sx < -60 || sx > camera.width + 60 || sy < -60 || sy > camera.height + 60) continue;
        ctx.beginPath();
        ctx.ellipse(sx + (v.direction === 'left' || v.direction === 'right' ? 18 : 11), sy + 18, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawDepthSortedEntities(ctx, camera, timeSystem, player = null, remotePlayers = []) {
    const isNight = timeSystem.ambientMode === 'night' || timeSystem.ambientMode === 'evening';
    const queue = [];

    // 1. Buildings & Landmarks
    for (const loc of this.locations) {
      if (loc.isLake || loc.isMajorWonder || loc.isGate) continue;
      const sx = loc.x - camera.x;
      const sy = loc.y - camera.y;
      if (sx + loc.width < -40 || sx > camera.width + 40 || sy + loc.height < -40 || sy > camera.height + 40) continue;

      queue.push({
        type: 'building',
        sortY: loc.y + loc.height,
        data: loc
      });
    }

    // 2. Dense Forest Trees
    for (const tree of this.denseForestTrees) {
      const sx = tree.x - camera.x;
      const sy = tree.y - camera.y;
      if (sx < -40 || sx > camera.width + 40 || sy < -40 || sy > camera.height + 40) continue;

      queue.push({
        type: 'tree',
        sortY: tree.y + 8,
        data: tree
      });
    }

    // 3. Vehicles
    if (this.vehicles) {
      for (const v of this.vehicles) {
        const sx = v.x - camera.x;
        const sy = v.y - camera.y;
        if (sx < -60 || sx > camera.width + 60 || sy < -60 || sy > camera.height + 60) continue;

        queue.push({
          type: 'vehicle',
          sortY: v.y + 14,
          data: v
        });
      }
    }

    // 4. NPCs
    for (const npc of this.npcs) {
      const sx = npc.x - camera.x;
      const sy = npc.y - camera.y;
      if (sx < -30 || sx > camera.width + 30 || sy < -30 || sy > camera.height + 30) continue;

      queue.push({
        type: 'npc',
        sortY: npc.y + 18,
        data: npc
      });
    }

    // 5. Wildlife
    for (const w of this.wildlife) {
      const sx = w.x - camera.x;
      const sy = w.y - camera.y;
      if (sx < -30 || sx > camera.width + 30 || sy < -30 || sy > camera.height + 30) continue;

      queue.push({
        type: 'wildlife',
        sortY: w.y + 12,
        data: w
      });
    }

    // 6. Geological Rock Monoliths
    for (const rId of [17, 24, 25, 27]) {
      const rock = this.locations.find(l => l.id === rId);
      if (rock) {
        const sx = rock.x - camera.x;
        const sy = rock.y - camera.y;
        if (sx > -60 && sx < camera.width + 60 && sy > -60 && sy < camera.height + 60) {
          queue.push({
            type: 'rock',
            sortY: rock.y + rock.height,
            data: rock
          });
        }
      }
    }

    // 7. Checkpoint Gates
    for (const cp of this.checkpoints) {
      const sx = cp.x - camera.x;
      const sy = cp.y - camera.y;
      if (sx + cp.width < -30 || sx > camera.width + 30 || sy + cp.height < -30 || sy > camera.height + 30) continue;

      queue.push({
        type: 'checkpoint',
        sortY: cp.y + cp.height,
        data: cp
      });
    }

    // 8. Remote Students (Multiplayer & Simulated Active Campus)
    if (remotePlayers && remotePlayers.length > 0) {
      for (const rp of remotePlayers) {
        if (rp.section === this.currentSection && !rp.interiorId) {
          queue.push({
            type: 'remote_player',
            sortY: rp.y + rp.height,
            data: rp
          });
        }
      }
    }

    // 9. Player Entity (Z-Axis Depth Sorted)
    if (player) {
      queue.push({
        type: 'player',
        sortY: player.y + player.height,
        data: player
      });
    }

    // 2.5D Depth Z-Sort: Sort all entities by base Y coordinate
    queue.sort((a, b) => a.sortY - b.sortY);

    // Check if player is occluded behind any building roof
    let isPlayerOccluded = false;
    if (player) {
      const pBounds = player.getBounds();
      for (const loc of this.locations) {
        if (loc.isLake || loc.isMajorWonder || loc.isGate) continue;
        const locBaseY = loc.y + loc.height;
        if (locBaseY > player.y + player.height) {
          if (
            pBounds.x + pBounds.width > loc.x - 4 &&
            pBounds.x < loc.x + loc.width + 4 &&
            pBounds.y + pBounds.height > loc.y &&
            pBounds.y < loc.y + loc.height
          ) {
            isPlayerOccluded = true;
            break;
          }
        }
      }
    }

    // Render all entities in 2.5D depth order
    for (const item of queue) {
      if (item.type === 'building') {
        this.drawSingleBuilding(ctx, camera, item.data);
      } else if (item.type === 'tree') {
        this.drawSingleTree(ctx, camera, item.data);
      } else if (item.type === 'npc') {
        this.drawSingleNPC(ctx, camera, item.data);
      } else if (item.type === 'vehicle') {
        this.drawSingleVehicle(ctx, camera, item.data, isNight);
      } else if (item.type === 'wildlife') {
        this.drawSingleWildlife(ctx, camera, item.data);
      } else if (item.type === 'rock') {
        this.drawSingleRock(ctx, camera, item.data);
      } else if (item.type === 'checkpoint') {
        this.drawSingleCheckpoint(ctx, camera, item.data);
      } else if (item.type === 'remote_player') {
        item.data.draw(ctx, camera);
      } else if (item.type === 'player') {
        item.data.draw(ctx, camera, isPlayerOccluded);
      }
    }
  }

  draw(ctx, camera, timeSystem, particleSystem, player = null, remotePlayers = []) {
    ctx.imageSmoothingEnabled = false;

    // 1. Terrain Grass & Flowerbeds
    this.drawTerrain(ctx, camera);

    // 2. Stone Plazas & Courtyards
    this.drawPlazas(ctx, camera);

    // 3. Roads & Nature Trails (Multi-Pass Smooth Seamless Network)
    this.drawRoads(ctx, camera);

    // 4. Zebra Crossings
    this.drawZebraCrossings(ctx, camera);

    // 5. Water Bodies (Lakes, Check Dam, Secret Lake, Peacock Lake)
    this.drawWaterBodies(ctx, camera);

    // 6. Tall Wild Grass & Hedges
    this.drawTallGrass(ctx, camera);
    this.drawHedges(ctx, camera);

    // 7. Dynamic 2.5D Directional Sun Shadows
    this.drawGroundShadows(ctx, camera, timeSystem, player);

    // 8. Fences, Benches, Fountains, Signs (Ground elements)
    this.drawProps(ctx, camera);

    // 9. Unified 2.5D Y-Sorted Depth Entity Queue (Buildings, Trees, NPCs, Remote Students, Player, Vehicles)
    this.drawDepthSortedEntities(ctx, camera, timeSystem, player, remotePlayers);

    // 10. Street Lamps Glowing Light Beams
    this.drawStreetLamps(ctx, camera, timeSystem);

    // 11. Atmospheric Weather Particles
    if (particleSystem) {
      particleSystem.draw(ctx, camera);
    }
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

    const trails = [];
    const paved = [];
    const trailNodes = [];
    const pavedNodes = [];

    // Collect and project visible road segments
    for (const [x1, y1, x2, y2, w, isTrail] of this.roads) {
      const minX = Math.min(x1, x2) - w - 20;
      const maxX = Math.max(x1, x2) + w + 20;
      const minY = Math.min(y1, y2) - w - 20;
      const maxY = Math.max(y1, y2) + w + 20;

      // Viewport culling
      if (
        maxX < camera.x ||
        minX > camera.x + camera.width ||
        maxY < camera.y ||
        minY > camera.y + camera.height
      ) {
        continue;
      }

      const sx1 = x1 - camera.x;
      const sy1 = y1 - camera.y;
      const sx2 = x2 - camera.x;
      const sy2 = y2 - camera.y;

      if (isTrail) {
        trails.push({ sx1, sy1, sx2, sy2, w });
        trailNodes.push({ x: sx1, y: sy1, w });
        trailNodes.push({ x: sx2, y: sy2, w });
      } else {
        paved.push({ sx1, sy1, sx2, sy2, w });
        pavedNodes.push({ x: sx1, y: sy1, w });
        pavedNodes.push({ x: sx2, y: sy2, w });
      }
    }

    // =========================================================================
    // PASS 1: DIRT TRAILS / NATURE PATHS (Warm Multi-Layer Organic Earth)
    // =========================================================================
    if (trails.length > 0) {
      // 1.1 Trail Base / Earthen Soft Edge
      ctx.strokeStyle = '#78512b';
      ctx.fillStyle = '#78512b';
      for (const t of trails) {
        ctx.lineWidth = t.w + 4;
        ctx.beginPath();
        ctx.moveTo(t.sx1, t.sy1);
        ctx.lineTo(t.sx2, t.sy2);
        ctx.stroke();
      }
      for (const n of trailNodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, (n.w + 4) / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1.2 Trail Main Packed Sand Surface
      ctx.strokeStyle = '#b98f5a';
      ctx.fillStyle = '#b98f5a';
      for (const t of trails) {
        ctx.lineWidth = t.w;
        ctx.beginPath();
        ctx.moveTo(t.sx1, t.sy1);
        ctx.lineTo(t.sx2, t.sy2);
        ctx.stroke();
      }
      for (const n of trailNodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1.3 Trail Center Subtle Dust Track
      ctx.strokeStyle = '#cfab78';
      for (const t of trails) {
        ctx.lineWidth = Math.max(2, t.w * 0.4);
        ctx.beginPath();
        ctx.moveTo(t.sx1, t.sy1);
        ctx.lineTo(t.sx2, t.sy2);
        ctx.stroke();
      }
    }

    // =========================================================================
    // PASS 2: PAVED ASPHALT ROADS (Smooth Seamless Multi-Pass Filleted Turns)
    // =========================================================================
    if (paved.length > 0) {
      // 2.1 Sandstone Road Curb / Shoulder
      ctx.strokeStyle = '#857048';
      ctx.fillStyle = '#857048';
      for (const r of paved) {
        ctx.lineWidth = r.w + 6;
        ctx.beginPath();
        ctx.moveTo(r.sx1, r.sy1);
        ctx.lineTo(r.sx2, r.sy2);
        ctx.stroke();
      }
      for (const n of pavedNodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, (n.w + 6) / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2.2 Concrete Curb Edge Boundary
      ctx.strokeStyle = '#b0a080';
      ctx.fillStyle = '#b0a080';
      for (const r of paved) {
        ctx.lineWidth = r.w + 2;
        ctx.beginPath();
        ctx.moveTo(r.sx1, r.sy1);
        ctx.lineTo(r.sx2, r.sy2);
        ctx.stroke();
      }
      for (const n of pavedNodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, (n.w + 2) / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2.3 Smooth Deep Asphalt Pavement
      ctx.strokeStyle = '#2d3748';
      ctx.fillStyle = '#2d3748';
      for (const r of paved) {
        ctx.lineWidth = r.w - 2;
        ctx.beginPath();
        ctx.moveTo(r.sx1, r.sy1);
        ctx.lineTo(r.sx2, r.sy2);
        ctx.stroke();
      }
      for (const n of pavedNodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, (n.w - 2) / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2.4 Center Yellow Dashes for Main Avenues
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([7, 9]);

      for (const r of paved) {
        if (r.w >= 20) {
          const dx = r.sx2 - r.sx1;
          const dy = r.sy2 - r.sy1;
          const len = Math.hypot(dx, dy);
          if (len > 30) {
            const trim = Math.min(12, len * 0.2);
            const ux = dx / len;
            const uy = dy / len;
            ctx.beginPath();
            ctx.moveTo(r.sx1 + ux * trim, r.sy1 + uy * trim);
            ctx.lineTo(r.sx2 - ux * trim, r.sy2 - uy * trim);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);
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
    for (const rock of this.locations.filter(l => [17, 24, 25, 27].includes(l.id))) {
      this.drawSingleRock(ctx, camera, rock);
    }
  }

  drawSingleBuilding(ctx, camera, loc) {
    const sx = loc.x - camera.x;
    const sy = loc.y - camera.y;

    if (sx + loc.width < -30 || sx > camera.width + 30 || sy + loc.height < -30 || sy > camera.height + 30) return;

    ctx.save();

    // 1. Amphitheatre UoH (#21)
    if (loc.isAmphitheatre) {
      pixelEngine.drawAmphitheatre(ctx, sx + loc.width / 2, sy + loc.height / 2, 45);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 2. Temple (Chinna Gudi) (#18)
    if (loc.isTemple) {
      pixelEngine.drawCampusTemple(ctx, sx + loc.width / 2, sy + loc.height / 2);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 3. Volleyball Court (#16)
    if (loc.isVolleyball) {
      pixelEngine.drawVolleyballCourt(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 4. Check Dam UoH (#1)
    if (loc.isCheckDam) {
      pixelEngine.drawCheckDam(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 5. Tennis Court (#63)
    if (loc.id === 63) {
      pixelEngine.drawTennisCourt(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 6. Overhead Water Tank (#91)
    if (loc.isWaterTank) {
      pixelEngine.drawWaterTank(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 7. GMC Balayogi Sports Complex (#92)
    if (loc.isBalayogi) {
      pixelEngine.drawBalayogiSportsComplex(ctx, sx, sy, loc.width / 2);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 8. Gachibowli Stadium (#93)
    if (loc.isGachibowliStadium) {
      pixelEngine.drawGachibowliStadium(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 9. University of Hyderabad Monument (#86)
    if (loc.isMonument) {
      pixelEngine.drawUoHMonument(ctx, sx, sy, loc.width / 2);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 10. SATG Shooting Ranges (#87)
    if (loc.isShootingRange) {
      pixelEngine.drawShootingRange(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 11. Sai Baba Temple (#89)
    if (loc.isSaiBabaTemple) {
      pixelEngine.drawSaiBabaTemple(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 12. Indian Immunologicals Limited (#90)
    if (loc.isIndianImmunologicals) {
      pixelEngine.drawIndianImmunologicals(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 13. Health Center (#38)
    if (loc.isHealthCenter) {
      pixelEngine.drawHealthCenter(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 14. Administration Building (#36)
    if (loc.isAdminBuilding) {
      pixelEngine.drawAdminBuilding(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 15. SCIS (School of Computer Sciences) (#45)
    if (loc.isSCIS) {
      pixelEngine.drawSCISBuilding(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 16. IGM Library, UoH (#51)
    if (loc.isIGMLibrary) {
      pixelEngine.drawIGMLibrary(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 17. HCU Small Gate Security Office (#41)
    if (loc.isSmallGate) {
      pixelEngine.drawSecurityGateOffice(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 18. Karthik SIM Cards & Xerox (#42)
    if (loc.isKarthikXerox) {
      pixelEngine.drawKarthikXerox(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 19. India Post (#74)
    if (loc.isIndiaPost) {
      pixelEngine.drawIndiaPost(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 20. Sukoon Canteen (#59)
    if (loc.isSukoonCanteen) {
      pixelEngine.drawSukoonCanteen(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 21. RV Panchajanya Kondapur (#88)
    if (loc.isRVPanchajanya) {
      pixelEngine.drawRVPanchajanya(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 22. Football Field (#94)
    if (loc.isFootballField) {
      pixelEngine.drawFootballField(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 23. Parking Area (#95)
    if (loc.isParkingArea) {
      pixelEngine.drawParkingArea(ctx, sx, sy, loc.width, loc.height);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 24. Central Rotunda Dome (#85)
    if (loc.isCentralDome) {
      pixelEngine.drawUoHMonument(ctx, sx, sy, loc.width / 2);
      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // 25. School of Life Sciences (#3) & ASPIRE BioNEST (#2)
    if (loc.id === 3) {
      const rad = loc.width / 2;
      const cx = sx + rad;
      const cy = sy + rad;

      // Outer Ring Wall & 3D Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(cx + 4, cy + 8, rad + 4, 0, Math.PI * 2);
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

      this.drawBuildingBadge(ctx, sx, sy, loc);
      ctx.restore();
      return;
    }

    // =========================================================================
    // 26. 2.5D Volumetric 3D Extruded Departmental & Residential Buildings
    // =========================================================================
    let roofPrimary = '#d83838';
    let roofShadow = '#881818';
    let roofHighlight = '#f86868';
    let wallColor = '#f1f5f9';
    let wallShadowColor = '#94a3b8';
    let foundationColor = '#475569';

    if (loc.category === 'academic') {
      roofPrimary = '#2563eb';
      roofShadow = '#1d4ed8';
      roofHighlight = '#60a5fa';
    } else if (loc.category === 'research') {
      roofPrimary = '#059669';
      roofShadow = '#047857';
      roofHighlight = '#34d399';
    } else if (loc.category === 'residential') {
      roofPrimary = '#d97706';
      roofShadow = '#b45309';
      roofHighlight = '#fbbf24';
    } else if (loc.category === 'amenities' || loc.isNightCanteen) {
      roofPrimary = '#db2777';
      roofShadow = '#be185d';
      roofHighlight = '#f472b6';
    } else if (loc.category === 'sports') {
      roofPrimary = '#0d9488';
      roofShadow = '#0f766e';
      roofHighlight = '#2dd4bf';
    }

    const depthX = 6;
    const depthY = 5;

    // 26.1 3D Right Side Facade Wall (Volumetric Extrusion)
    ctx.fillStyle = wallShadowColor;
    ctx.beginPath();
    ctx.moveTo(sx + loc.width - 2, sy + 18);
    ctx.lineTo(sx + loc.width + depthX, sy + 18 - depthY);
    ctx.lineTo(sx + loc.width + depthX, sy + loc.height - 8 - depthY);
    ctx.lineTo(sx + loc.width - 2, sy + loc.height - 8);
    ctx.closePath();
    ctx.fill();

    // Side Wall Grout Lines
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx + loc.width + depthX / 2, sy + 22 - depthY / 2);
    ctx.lineTo(sx + loc.width + depthX / 2, sy + loc.height - 8 - depthY / 2);
    ctx.stroke();

    // 26.2 3D Overhang Roof Top Slab
    ctx.fillStyle = roofPrimary;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + depthX, sy - depthY);
    ctx.lineTo(sx + loc.width + depthX, sy - depthY);
    ctx.lineTo(sx + loc.width, sy);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = roofHighlight;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 26.3 Main Building Foundation & Walls
    ctx.fillStyle = foundationColor;
    ctx.fillRect(sx, sy + loc.height - 8, loc.width, 8);

    ctx.fillStyle = wallColor;
    ctx.fillRect(sx + 2, sy + 18, loc.width - 4, loc.height - 26);

    // 26.4 Front Roof Fascia
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

    // 26.5 Entrance Doorway
    const doorW = 16;
    const doorX = sx + loc.width / 2 - doorW / 2;
    const doorY = sy + loc.height - 14;

    // Glowing entrance welcome mat for enterable buildings
    if (loc.hasInterior) {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(doorX - 3, doorY + 9, doorW + 6, 5);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(doorX - 2, doorY + 10, doorW + 4, 2);
    } else {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(doorX - 2, doorY + 8, doorW + 4, 6);
    }

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(doorX, doorY, doorW, 12);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(doorX + 2, doorY + 2, 5, 8);
    ctx.fillRect(doorX + 9, doorY + 2, 5, 8);

    // 26.6 Windows
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

    // 26.7 Sleek Floating Badge Label
    this.drawBuildingBadge(ctx, sx, sy, loc);

    ctx.restore();
  }

  drawBuildings(ctx, camera) {
    for (const loc of this.locations) {
      if (loc.isLake || loc.isMajorWonder || loc.isGate) continue;
      this.drawSingleBuilding(ctx, camera, loc);
    }
  }

  drawSingleTree(ctx, camera, tree) {
    const sx = tree.x - camera.x;
    const sy = tree.y - camera.y;

    if (sx < -40 || sx > camera.width + 40 || sy < -40 || sy > camera.height + 40) return;

    let sprite = pixelEngine.getTreeSprite();
    if (tree.type === 'pine') sprite = pixelEngine.getPineTreeSprite();
    else if (tree.type === 'gulmohar') sprite = pixelEngine.getGulmoharTreeSprite();

    ctx.drawImage(sprite, 0, 0, 32, 32, sx - 16, sy - 24, 32, 32);
  }

  drawSingleNPC(ctx, camera, npc) {
    const sx = npc.x - camera.x;
    const sy = npc.y - camera.y;

    if (sx < -20 || sx > camera.width + 20 || sy < -20 || sy > camera.height + 20) return;

    ctx.save();
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

  drawSingleVehicle(ctx, camera, v, isNight) {
    const sx = v.x - camera.x;
    const sy = v.y - camera.y;

    if (sx < -60 || sx > camera.width + 60 || sy < -60 || sy > camera.height + 60) return;

    // Draw headlight cone at night
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

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText(v.name, sx + (v.direction === 'left' || v.direction === 'right' ? 18 : 11), sy - 4);
    ctx.restore();
  }

  drawSingleWildlife(ctx, camera, w) {
    const frame = Math.floor(Date.now() / 250);
    const sx = w.x - camera.x;
    const sy = w.y - camera.y;

    if (sx < -30 || sx > camera.width + 30 || sy < -30 || sy > camera.height + 30) return;

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

  drawSingleRock(ctx, camera, rock) {
    let style = 'masoom';
    if (rock.id === 17) style = 'globbo';
    else if (rock.id === 24) style = 'cherry';
    else if (rock.id === 25) style = 'aquarium';
    pixelEngine.drawRockMonolith(ctx, rock.x - camera.x, rock.y - camera.y, rock.shortName, style);
  }

  drawSingleCheckpoint(ctx, camera, cp) {
    const sx = cp.x - camera.x;
    const sy = cp.y - camera.y;

    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(sx, sy, cp.width, cp.height);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + 4, sy + 4, cp.width - 8, cp.height - 8);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(sx + cp.width / 2 - 2, sy + 6, 4, cp.height - 12);

    ctx.font = 'bold 7.5px "Press Start 2P", monospace';
    const labelText = cp.shortLabel || cp.name;
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
    ctx.restore();
  }

  drawBuildingBadge(ctx, sx, sy, loc) {
    const name = loc.shortName || loc.name;
    ctx.save();
    ctx.font = 'bold 7px "Press Start 2P", monospace, sans-serif';

    const textMetrics = ctx.measureText(name);
    const idText = `#${loc.id}`;
    ctx.font = 'bold 7px sans-serif';
    const idMetrics = ctx.measureText(idText);

    const pad = 4;
    const tagW = Math.max(16, idMetrics.width + 6);
    const totalW = tagW + textMetrics.width + pad * 2 + (loc.hasInterior ? 8 : 0);
    const h = 13;
    const bx = Math.round(sx + loc.width / 2 - totalW / 2);
    const by = Math.round(sy - h - 3);

    // Pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(bx, by, totalW, h, 3);
    ctx.fill();

    // Category accent border
    let accent = '#60a5fa'; // academic
    if (loc.category === 'research') accent = '#34d399';
    else if (loc.category === 'residential') accent = '#fbbf24';
    else if (loc.category === 'amenities' || loc.isNightCanteen) accent = '#f472b6';
    else if (loc.category === 'sports') accent = '#2dd4bf';
    else if (loc.hasInterior) accent = '#f59e0b';

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Number tag box
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(bx + 1, by + 1, tagW, h - 2, [2, 0, 0, 2]);
    ctx.fill();

    // ID Text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(idText, bx + tagW / 2 + 1, by + h / 2);

    // Name Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 7px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, bx + tagW + 4, by + h / 2);

    // Enterable Indicator
    if (loc.hasInterior) {
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('✦', bx + totalW - 7, by + h / 2);
    }

    ctx.restore();
  }

  drawPinBadge(ctx, x, y, id) {
    // Replaced by drawBuildingBadge
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
    for (const tree of this.denseForestTrees) {
      this.drawSingleTree(ctx, camera, tree);
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
    for (const w of this.wildlife) {
      this.drawSingleWildlife(ctx, camera, w);
    }
  }

  drawNPCs(ctx, camera) {
    for (const npc of this.npcs) {
      this.drawSingleNPC(ctx, camera, npc);
    }
  }
}
