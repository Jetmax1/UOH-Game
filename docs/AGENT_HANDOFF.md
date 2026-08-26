# Developer & Agent Handoff Guide

## Canonical System & Location Registry

The game now uses a centralized Canonical Location & Event Registry in [src/game/LocationRegistry.js](file:///c:/Users/harsh/Documents/Project/UOH%20game/src/game/LocationRegistry.js).

### Key Guidelines for Future Changes:
1. **Adding or Modifying Locations**:
   - Always edit [src/data/locations.json](file:///c:/Users/harsh/Documents/Project/UOH%20game/src/data/locations.json).
   - Ensure every location has a unique `id`, a snake_case `canonicalId`, accurate `section`, `worldPosition` matching `SECTION_OFFSETS`, and representative `aliases`.
   - Never add duplicate venues or section-prefixed duplicate names (e.g. `main_peacock_lake`).

2. **Section Coordinates & Geometry**:
   - World coordinates are derived from `SECTION_OFFSETS`: `worldX = sectionOriginX + localX`.
   - Road, tree, water, and building colliders are generated dynamically in [src/game/WorldMap.js](file:///c:/Users/harsh/Documents/Project/UOH%20game/src/game/WorldMap.js) and indexed in [src/game/NavigationEngine.js](file:///c:/Users/harsh/Documents/Project/UOH%20game/src/game/NavigationEngine.js) spatial hash grid.

3. **Running Verification**:
   - Always run the canonical integrity suite before committing:
     ```bash
     node scratch/audit_canonical_integrity.mjs
     ```
   - Run physics and navigation verification:
     ```bash
     node scratch/test_navigation_verification.mjs
     ```
   - Validate production bundling:
     ```bash
     npm run build
     ```
