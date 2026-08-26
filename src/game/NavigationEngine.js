/**
 * NavigationEngine: Physical World Walkability, Surface Physics & Road Graph System
 * 
 * Provides:
 * 1. Surface type classification (Road, Path, Plaza, Trail, Grass, Field, Blocked)
 * 2. Surface physics speed multipliers (Roads are fastest; rough terrain/grass provides natural resistance)
 * 3. Fast spatial partitioning for zero-overhead collision checks
 * 4. Road network graph representation and A* pathfinding
 */

export const SURFACE_TYPES = {
  ROAD: 'road',       // Smooth asphalt highway / avenue (Speed: 1.10x)
  PATH: 'path',       // Paved sandstone walkway / sidewalk (Speed: 1.00x)
  PLAZA: 'plaza',     // Paved stone square / courtyard (Speed: 1.00x)
  TRAIL: 'trail',     // Earthen nature trail / gravel path (Speed: 0.92x)
  GRASS: 'grass',     // Open campus lawn / grass (Speed: 0.82x)
  FIELD: 'field',     // Agricultural farmland / rocky soil (Speed: 0.75x)
  BLOCKED: 'blocked'  // Impassable obstacle / deep water / building wall (Speed: 0.00x)
};

export const SURFACE_SPEED_MODIFIERS = {
  [SURFACE_TYPES.ROAD]: 1.10,
  [SURFACE_TYPES.PATH]: 1.00,
  [SURFACE_TYPES.PLAZA]: 1.00,
  [SURFACE_TYPES.TRAIL]: 0.92,
  [SURFACE_TYPES.GRASS]: 0.82,
  [SURFACE_TYPES.FIELD]: 0.75,
  [SURFACE_TYPES.BLOCKED]: 0.00
};

export class NavigationEngine {
  constructor() {
    this.spatialGrid = new Map();
    this.cellSize = 64; // 64x64 px spatial hash cells
    this.roadGraph = { nodes: [], edges: [] };
  }

  /**
   * Builds spatial hash partitioning for fast broad-phase collision checks.
   */
  buildSpatialGrid(colliders, worldWidth, worldHeight) {
    this.spatialGrid.clear();
    for (const box of colliders) {
      const minCellX = Math.floor(Math.max(0, box.x) / this.cellSize);
      const maxCellX = Math.floor(Math.min(worldWidth, box.x + box.width) / this.cellSize);
      const minCellY = Math.floor(Math.max(0, box.y) / this.cellSize);
      const maxCellY = Math.floor(Math.min(worldHeight, box.y + box.height) / this.cellSize);

      for (let cx = minCellX; cx <= maxCellX; cx++) {
        for (let cy = minCellY; cy <= maxCellY; cy++) {
          const key = `${cx},${cy}`;
          if (!this.spatialGrid.has(key)) {
            this.spatialGrid.set(key, []);
          }
          this.spatialGrid.get(key).push(box);
        }
      }
    }
  }

  /**
   * Fast collision check using spatial grid partitioning.
   */
  checkCollision(bounds) {
    const minCellX = Math.floor(bounds.x / this.cellSize);
    const maxCellX = Math.floor((bounds.x + bounds.width) / this.cellSize);
    const minCellY = Math.floor(bounds.y / this.cellSize);
    const maxCellY = Math.floor((bounds.y + bounds.height) / this.cellSize);

    const checkedBoxes = new Set();

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        const cell = this.spatialGrid.get(`${cx},${cy}`);
        if (!cell) continue;

        for (let i = 0; i < cell.length; i++) {
          const box = cell[i];
          if (checkedBoxes.has(box)) continue;
          checkedBoxes.add(box);

          if (
            bounds.x < box.x + box.width &&
            bounds.x + bounds.width > box.x &&
            bounds.y < box.y + box.height &&
            bounds.y + bounds.height > box.y
          ) {
            // If obstacle has circular/elliptical shape (e.g. lake shore, tree trunk)
            if (box.isEllipse) {
              const dx = (bounds.x + bounds.width / 2 - box.centerX) / (box.radiusX);
              const dy = (bounds.y + bounds.height / 2 - box.centerY) / (box.radiusY);
              if (dx * dx + dy * dy < 1) {
                return true;
              }
            } else {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Determines the terrain surface classification at world coordinate (x, y).
   */
  getSurfaceAt(x, y, sectionConfig) {
    if (!sectionConfig) return SURFACE_TYPES.GRASS;

    // 1. Plazas & Paved Courtyards
    for (const p of sectionConfig.plazas || []) {
      if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) {
        return SURFACE_TYPES.PLAZA;
      }
    }

    // 2. Roads, Avenues, Paths, and Nature Trails
    for (const [x1, y1, x2, y2, width, isTrail] of sectionConfig.roads || []) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      let dist;
      if (lenSq === 0) {
        dist = Math.hypot(x - x1, y - y1);
      } else {
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lenSq));
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;
        dist = Math.hypot(x - projX, y - projY);
      }

      if (dist <= width / 2) {
        if (isTrail) {
          return SURFACE_TYPES.TRAIL;
        } else if (width >= 24) {
          return SURFACE_TYPES.ROAD;
        } else {
          return SURFACE_TYPES.PATH;
        }
      }
    }

    // 3. Agricultural Field Blocks / Rocky Farmland
    for (const f of sectionConfig.fieldBlocks || []) {
      if (x >= f.x && x <= f.x + f.w && y >= f.y && y <= f.y + f.h) {
        return SURFACE_TYPES.FIELD;
      }
    }

    // 4. Default: Open Walkable Campus Grass
    return SURFACE_TYPES.GRASS;
  }

  /**
   * Returns the speed multiplier for movement at world coordinate (x, y).
   */
  getSpeedModifierAt(x, y, sectionConfig) {
    const surface = this.getSurfaceAt(x, y, sectionConfig);
    return SURFACE_SPEED_MODIFIERS[surface] || 1.0;
  }

  /**
   * Builds a connected graph of road network nodes and edges from road segments.
   */
  buildRoadGraph(roads) {
    const nodes = [];
    const edges = [];
    const nodeMap = new Map();

    const getOrCreateNode = (x, y) => {
      // Snap to nearby node within 6px threshold
      for (const node of nodes) {
        if (Math.hypot(node.x - x, node.y - y) <= 6) {
          return node;
        }
      }
      const node = { id: nodes.length, x, y, neighbors: [] };
      nodes.push(node);
      return node;
    };

    for (const [x1, y1, x2, y2, width, isTrail] of roads || []) {
      const u = getOrCreateNode(x1, y1);
      const v = getOrCreateNode(x2, y2);
      const dist = Math.hypot(x2 - x1, y2 - y1);

      u.neighbors.push({ target: v, distance: dist, width, isTrail });
      v.neighbors.push({ target: u, distance: dist, width, isTrail });
      edges.push({ from: u, to: v, distance: dist, width, isTrail });
    }

    this.roadGraph = { nodes, edges };
    return this.roadGraph;
  }

  /**
   * A* Pathfinding along connected road graph network.
   */
  findRoute(startX, startY, endX, endY) {
    if (!this.roadGraph.nodes || this.roadGraph.nodes.length === 0) return null;

    // Find closest starting and destination graph nodes
    let startNode = null;
    let endNode = null;
    let minStartDist = Infinity;
    let minEndDist = Infinity;

    for (const node of this.roadGraph.nodes) {
      const dStart = Math.hypot(node.x - startX, node.y - startY);
      const dEnd = Math.hypot(node.x - endX, node.y - endY);
      if (dStart < minStartDist) { minStartDist = dStart; startNode = node; }
      if (dEnd < minEndDist) { minEndDist = dEnd; endNode = node; }
    }

    if (!startNode || !endNode) return null;
    if (startNode === endNode) return [{ x: startNode.x, y: startNode.y }];

    // Standard A* implementation
    const openSet = new Set([startNode.id]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    this.roadGraph.nodes.forEach(n => {
      gScore.set(n.id, Infinity);
      fScore.set(n.id, Infinity);
    });

    gScore.set(startNode.id, 0);
    fScore.set(startNode.id, Math.hypot(startNode.x - endNode.x, startNode.y - endNode.y));

    while (openSet.size > 0) {
      // Find node in openSet with lowest fScore
      let current = null;
      let lowestF = Infinity;
      for (const nodeId of openSet) {
        const f = fScore.get(nodeId);
        if (f < lowestF) {
          lowestF = f;
          current = this.roadGraph.nodes[nodeId];
        }
      }

      if (!current) break;
      if (current.id === endNode.id) {
        // Reconstruct path
        const path = [{ x: current.x, y: current.y }];
        let currId = current.id;
        while (cameFrom.has(currId)) {
          currId = cameFrom.get(currId);
          const n = this.roadGraph.nodes[currId];
          path.unshift({ x: n.x, y: n.y });
        }
        return path;
      }

      openSet.delete(current.id);

      for (const edge of current.neighbors) {
        const neighbor = edge.target;
        const tentativeG = gScore.get(current.id) + edge.distance;

        if (tentativeG < gScore.get(neighbor.id)) {
          cameFrom.set(neighbor.id, current.id);
          gScore.set(neighbor.id, tentativeG);
          const h = Math.hypot(neighbor.x - endNode.x, neighbor.y - endNode.y);
          fScore.set(neighbor.id, tentativeG + h);
          openSet.add(neighbor.id);
        }
      }
    }

    return null;
  }
}

export const navigationEngine = new NavigationEngine();
