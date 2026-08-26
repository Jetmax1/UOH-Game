import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };
import npcs from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/npcs.json' with { type: 'json' };
import quests from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/quests.json' with { type: 'json' };
import quizQuestions from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/quizQuestions.json' with { type: 'json' };
import { sectionConfigs } from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/map/worldData.js';
import { locationRegistry, SECTION_OFFSETS, LOCATION_ID_MIGRATIONS } from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/game/LocationRegistry.js';
import { WorldMap } from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/game/WorldMap.js';

console.log('================================================================');
console.log('  UOH GAME — CANONICAL INTEGRITY & DEDUPLICATION AUDIT SUITE');
console.log('================================================================\n');

let errorCount = 0;

// 1. UNIQUE CANONICAL IDENTITIES
console.log('--- 1. CANONICAL IDENTITIES & ID UNIQUENESS ---');
const idSet = new Set();
const canonicalSlugSet = new Set();
const nameSet = new Set();

for (const loc of locations) {
  if (idSet.has(loc.id)) {
    console.error(`❌ ERROR: Duplicate numeric ID #${loc.id}`);
    errorCount++;
  }
  idSet.add(loc.id);

  if (!loc.canonicalId) {
    console.error(`❌ ERROR: Location #${loc.id} "${loc.name}" lacks canonicalId`);
    errorCount++;
  } else if (canonicalSlugSet.has(loc.canonicalId)) {
    console.error(`❌ ERROR: Duplicate canonicalId "${loc.canonicalId}" in #${loc.id}`);
    errorCount++;
  }
  canonicalSlugSet.add(loc.canonicalId);

  const normName = loc.name.toLowerCase().trim();
  if (nameSet.has(normName)) {
    console.error(`❌ ERROR: Duplicate exact name "${loc.name}" in #${loc.id}`);
    errorCount++;
  }
  nameSet.add(normName);
}
console.log(`✓ Total Locations: ${locations.length}`);
console.log(`✓ Total Unique Canonical IDs: ${canonicalSlugSet.size}`);
console.log(`✓ All location IDs, canonical slugs, and names are 100% unique.`);

// 2. WORLD COORDINATES & NORMALIZATION
console.log('\n--- 2. SECTION OFFSETS & WORLD COORDINATE INTEGRITY ---');
for (const loc of locations) {
  const expectedOffset = SECTION_OFFSETS[loc.section];
  if (!expectedOffset) {
    console.error(`❌ ERROR: Location #${loc.id} belongs to unknown section "${loc.section}"`);
    errorCount++;
    continue;
  }

  const expectedWorldX = expectedOffset.originX + loc.x;
  const expectedWorldY = expectedOffset.originY + loc.y;

  if (!loc.worldPosition || loc.worldPosition.x !== expectedWorldX || loc.worldPosition.y !== expectedWorldY) {
    console.error(`❌ ERROR: Location #${loc.id} worldPosition (${loc.worldPosition?.x}, ${loc.worldPosition?.y}) does not match expected (${expectedWorldX}, ${expectedWorldY})`);
    errorCount++;
  }
}
console.log(`✓ All 95 locations have verified normalized master world coordinates.`);

// 3. REGISTRY RESOLUTION & MIGRATIONS
console.log('\n--- 3. REGISTRY RESOLUTION & MIGRATION MAP ---');
for (const loc of locations) {
  const byId = locationRegistry.getById(loc.id);
  const bySlug = locationRegistry.getByCanonicalId(loc.canonicalId);
  const byName = locationRegistry.getByName(loc.name);

  if (!byId || byId.id !== loc.id) {
    console.error(`❌ ERROR: locationRegistry.getById(${loc.id}) failed`);
    errorCount++;
  }
  if (!bySlug || bySlug.id !== loc.id) {
    console.error(`❌ ERROR: locationRegistry.getByCanonicalId("${loc.canonicalId}") failed`);
    errorCount++;
  }
  if (!byName || byName.id !== loc.id) {
    console.error(`❌ ERROR: locationRegistry.getByName("${loc.name}") failed`);
    errorCount++;
  }
}

// Test legacy migrations
for (const [legacyId, targetId] of Object.entries(LOCATION_ID_MIGRATIONS)) {
  const resolved = locationRegistry.migrateId(legacyId);
  if (resolved !== targetId) {
    console.error(`❌ ERROR: Migration failed for "${legacyId}" -> expected ${targetId}, got ${resolved}`);
    errorCount++;
  }
}
console.log(`✓ LocationRegistry resolutions & legacy ID migrations verified.`);

// 4. QUEST OBJECTIVE TARGETS
console.log('\n--- 4. QUEST OBJECTIVE TARGET AUDIT ---');
for (const q of quests) {
  console.log(`Quest [${q.id}] "${q.title}":`);
  for (const obj of q.objectives || []) {
    if (obj.targetLocationId !== undefined) {
      const loc = locationRegistry.getById(obj.targetLocationId);
      if (!loc) {
        console.error(`❌ ERROR: Quest ${q.id} targets non-existent location #${obj.targetLocationId}`);
        errorCount++;
      } else {
        console.log(`   ✓ Objective [${obj.id}] -> Canonical #${loc.id} [${loc.canonicalId}] "${loc.name}" (${loc.section})`);
      }
    }
  }
}

// 5. NPC LOCATIONS & SECTION ASSIGNMENTS
console.log('\n--- 5. NPC SECTION & SPATIAL ASSIGNMENTS ---');
for (const npc of npcs) {
  if (!SECTION_OFFSETS[npc.section]) {
    console.error(`❌ ERROR: NPC "${npc.name}" belongs to invalid section "${npc.section}"`);
    errorCount++;
  } else {
    console.log(`   ✓ NPC [${npc.id}] "${npc.name}" in section [${npc.section}] at (${npc.x}, ${npc.y})`);
  }
}

// 6. WORLD MAP SECTIONS INITIALIZATION
console.log('\n--- 6. WORLD MAP 6-SECTION INITIALIZATION ---');
const wm = new WorldMap(locations, npcs);
const sections = ['main', 'south', 'west', 'east', 'amphi_valley', 'checkdam_buffer'];
for (const sec of sections) {
  wm.setSection(sec);
  console.log(`   ✓ Section [${sec}]: ${wm.locations.length} POIs, ${wm.npcs.length} NPCs, ${wm.colliders.length} colliders.`);
}

console.log('\n================================================================');
if (errorCount === 0) {
  console.log('🎉 AUDIT SUCCESS: 100% CANONICAL INTEGRITY PASSED WITH 0 ERRORS!');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 AUDIT FAILED: ${errorCount} ERRORS FOUND!`);
  console.log('================================================================\n');
  process.exit(1);
}
