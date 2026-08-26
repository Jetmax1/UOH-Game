import locationsData from '../data/locations.json' with { type: 'json' };

/**
 * Authoritative Section Spatial Offsets in Master Campus World Space.
 * Used for coordinate normalization across the 6 regional sections.
 */
export const SECTION_OFFSETS = {
  main: { originX: 0, originY: 0, width: 1700, height: 1350 },
  east: { originX: 1700, originY: 0, width: 2400, height: 1600 },
  west: { originX: -1400, originY: 1350, width: 1400, height: 1200 },
  south: { originX: 0, originY: 1350, width: 2000, height: 1900 },
  amphi_valley: { originX: 1600, originY: 1350, width: 1600, height: 1200 },
  checkdam_buffer: { originX: 400, originY: 1000, width: 1400, height: 1000 }
};

/**
 * Legacy ID Migration Map ensuring 100% safe save data & discovery migration.
 */
export const LOCATION_ID_MIGRATIONS = {
  98: 27, // Old Mushroom Rock -> Canonical #27 The Masoom's Rock
  'mushroom_rock': 27,
  'old_admin': 36,
  'gachibowli_stadium_dup': 93,
  'balayogi_complex_dup': 92
};

/**
 * Centralized Canonical Location Registry.
 * Serves as the single authoritative source of truth for all campus landmarks,
 * spatial coordinates, alias resolution, and event triggers.
 */
export class LocationRegistry {
  constructor(customLocations = null) {
    this.locations = customLocations || locationsData;
    this.sectionOffsets = SECTION_OFFSETS;
    this.migrations = LOCATION_ID_MIGRATIONS;

    this.idMap = new Map();
    this.canonicalMap = new Map();
    this.nameMap = new Map();
    this.aliasMap = new Map();

    this.indexLocations();
  }

  indexLocations() {
    this.idMap.clear();
    this.canonicalMap.clear();
    this.nameMap.clear();
    this.aliasMap.clear();

    for (const loc of this.locations) {
      this.idMap.set(loc.id, loc);

      if (loc.canonicalId) {
        this.canonicalMap.set(loc.canonicalId.toLowerCase(), loc);
      }

      if (loc.name) {
        this.nameMap.set(loc.name.toLowerCase(), loc);
      }
      if (loc.shortName) {
        this.nameMap.set(loc.shortName.toLowerCase(), loc);
      }

      if (loc.aliases && Array.isArray(loc.aliases)) {
        for (const alias of loc.aliases) {
          const normAlias = alias.toLowerCase();
          this.aliasMap.set(normAlias, loc);
          if (!this.nameMap.has(normAlias)) {
            this.nameMap.set(normAlias, loc);
          }
        }
      }
    }
  }

  /**
   * Migrate any legacy or aliased ID to the authoritative canonical location ID.
   */
  migrateId(id) {
    if (id === null || id === undefined) return null;
    if (this.migrations[id]) {
      return this.migrations[id];
    }
    // Check if numeric or string representation exists
    const num = Number(id);
    if (!isNaN(num) && this.idMap.has(num)) {
      return num;
    }
    const slugLoc = this.canonicalMap.get(String(id).toLowerCase());
    if (slugLoc) {
      return slugLoc.id;
    }
    return id;
  }

  /**
   * Get location by numeric ID.
   */
  getById(id) {
    const validId = this.migrateId(id);
    return this.idMap.get(validId) || null;
  }

  /**
   * Get location by canonical string identifier (e.g. 'peacock_lake', 'scis').
   */
  getByCanonicalId(canonicalId) {
    if (!canonicalId) return null;
    return this.canonicalMap.get(String(canonicalId).toLowerCase()) || null;
  }

  /**
   * Get location by exact name, shortName, or registered alias.
   */
  getByName(name) {
    if (!name) return null;
    const norm = String(name).toLowerCase().trim();
    return this.nameMap.get(norm) || this.aliasMap.get(norm) || null;
  }

  /**
   * Resolve any input (numeric ID, canonical slug, or name) to a Location object.
   */
  resolve(input) {
    if (typeof input === 'number') {
      return this.getById(input);
    }
    if (typeof input === 'string') {
      return this.getByCanonicalId(input) || this.getByName(input) || this.getById(Number(input));
    }
    if (input && typeof input === 'object' && input.id) {
      return this.getById(input.id) || input;
    }
    return null;
  }

  /**
   * Convert local section coordinates to normalized Master World coordinates.
   */
  toWorldCoords(section, localX, localY) {
    const sec = this.sectionOffsets[section] || { originX: 0, originY: 0 };
    return {
      x: sec.originX + localX,
      y: sec.originY + localY
    };
  }

  /**
   * Convert Master World coordinates to local section coordinates.
   */
  toLocalCoords(section, worldX, worldY) {
    const sec = this.sectionOffsets[section] || { originX: 0, originY: 0 };
    return {
      x: worldX - sec.originX,
      y: worldY - sec.originY
    };
  }

  /**
   * Get all registered aliases for a given location ID.
   */
  getAliases(id) {
    const loc = this.getById(id);
    return loc ? (loc.aliases || []) : [];
  }

  /**
   * Get section name for a given location ID.
   */
  getSection(id) {
    const loc = this.getById(id);
    return loc ? loc.section : null;
  }

  /**
   * Get all locations in the campus registry.
   */
  getAllLocations() {
    return this.locations;
  }

  /**
   * Get all locations belonging to a specific section.
   */
  getLocationsForSection(section) {
    return this.locations.filter(loc => loc.section === section);
  }

  /**
   * Spatially find any location near local section coordinates.
   */
  getByLocalPosition(section, localX, localY, radius = 50) {
    const secLocs = this.getLocationsForSection(section);
    for (const loc of secLocs) {
      const cx = loc.x + loc.width / 2;
      const cy = loc.y + loc.height / 2;
      const dx = localX - cx;
      const dy = localY - cy;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return loc;
      }
    }
    return null;
  }

  /**
   * Spatially find any location near master world coordinates.
   */
  getByWorldPosition(worldX, worldY, radius = 50) {
    for (const loc of this.locations) {
      const pos = loc.worldPosition || this.toWorldCoords(loc.section, loc.x, loc.y);
      const cx = pos.x + loc.width / 2;
      const cy = pos.y + loc.height / 2;
      const dx = worldX - cx;
      const dy = worldY - cy;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return loc;
      }
    }
    return null;
  }
}

// Global Singleton Instance
export const locationRegistry = new LocationRegistry();
