import { soundManager } from './AudioSynth.js';

/**
 * Campus Discovery & Exploration Progression System
 */
export class DiscoverySystem {
  constructor(locationsData, onDiscoveryCallback) {
    this.locations = locationsData;
    this.discoveredIds = new Set();
    this.score = 0;
    this.onDiscoveryCallback = onDiscoveryCallback;
  }

  loadState(savedData) {
    if (!savedData) return;
    if (savedData.discoveredIds && Array.isArray(savedData.discoveredIds)) {
      this.discoveredIds = new Set(savedData.discoveredIds);
    }
    if (typeof savedData.score === 'number') {
      this.score = savedData.score;
    }
  }

  getState() {
    return {
      discoveredIds: Array.from(this.discoveredIds),
      score: this.score
    };
  }

  isDiscovered(locationId) {
    return this.discoveredIds.has(locationId);
  }

  discoverLocation(locationId) {
    if (this.discoveredIds.has(locationId)) return false;

    const loc = this.locations.find(l => l.id === locationId);
    if (!loc) return false;

    this.discoveredIds.add(locationId);
    const pts = loc.points || 50;
    this.score += pts;

    soundManager.playDiscovery();

    if (this.onDiscoveryCallback) {
      this.onDiscoveryCallback(loc, pts, this.score);
    }

    return true;
  }

  addDirectScore(points, reason = '') {
    this.score += points;
    return this.score;
  }

  getDiscoveryStats() {
    const total = this.locations.length;
    const discovered = this.discoveredIds.size;
    const percent = total > 0 ? Math.round((discovered / total) * 100) : 0;

    const categories = {};
    for (const loc of this.locations) {
      const cat = loc.category || 'other';
      if (!categories[cat]) {
        categories[cat] = { total: 0, discovered: 0 };
      }
      categories[cat].total += 1;
      if (this.discoveredIds.has(loc.id)) {
        categories[cat].discovered += 1;
      }
    }

    return {
      total,
      discovered,
      percent,
      score: this.score,
      categories
    };
  }

  getAllLocationsWithStatus() {
    return this.locations.map(loc => ({
      ...loc,
      isDiscovered: this.discoveredIds.has(loc.id)
    }));
  }
}
