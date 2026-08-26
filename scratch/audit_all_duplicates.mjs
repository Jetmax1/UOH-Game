import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };
import npcs from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/npcs.json' with { type: 'json' };
import quests from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/quests.json' with { type: 'json' };
import { sectionConfigs } from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/map/worldData.js';

console.log('=== FULL CAMPUS AUDIT: FINDING ALL DUPLICATES & REDUNDANCIES ===\n');

// 1. Audit Locations by Name similarity
console.log('--- 1. LOCATIONS AUDIT ---');
const locByName = new Map();
const duplicates = [];

for (const loc of locations) {
  const norm = loc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const shortNorm = loc.shortName ? loc.shortName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  
  for (const other of locations) {
    if (loc.id >= other.id) continue;
    const otherNorm = other.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const otherShortNorm = other.shortName ? other.shortName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

    // Check exact or very close similarity
    if (norm === otherNorm || shortNorm === otherShortNorm || 
        loc.name.toLowerCase().includes(other.name.toLowerCase()) || 
        other.name.toLowerCase().includes(loc.name.toLowerCase())) {
      duplicates.push({
        loc1: `${loc.name} (#${loc.id}, sec: ${loc.section})`,
        loc2: `${other.name} (#${other.id}, sec: ${other.section})`
      });
    }
  }
}

console.log(`Found ${duplicates.length} potential duplicate/similar locations:`);
duplicates.forEach(d => console.log(` - ${d.loc1} <---> ${d.loc2}`));

// 2. Audit Section by Section in locations.json
console.log('\n--- 2. LOCATIONS BY SECTION ---');
const sections = ['main', 'south', 'west', 'east', 'amphi_valley', 'checkdam_buffer'];
for (const sec of sections) {
  const secLocs = locations.filter(l => l.section === sec);
  console.log(`\nSection [${sec}] (${secLocs.length} locations):`);
  secLocs.forEach(l => console.log(`   #${l.id}: "${l.name}" (short: "${l.shortName}", cat: ${l.category}, x: ${l.x}, y: ${l.y})`));
}

// 3. Audit water bodies in worldData.js
console.log('\n--- 3. WATER BODIES ACROSS SECTIONS ---');
for (const [secKey, secVal] of Object.entries(sectionConfigs)) {
  console.log(`Section [${secKey}] water bodies:`, secVal.waterBodies?.map(w => `${w.name} (#${w.id || 'none'})`));
}

// 4. Audit NPCs
console.log('\n--- 4. NPCS AUDIT ---');
npcs.forEach(n => console.log(`   NPC #${n.id}: "${n.name}" in sec [${n.section}] at (${n.x}, ${n.y})`));

// 5. Audit Quests location targets
console.log('\n--- 5. QUESTS TARGET AUDIT ---');
for (const q of quests) {
  console.log(`Quest [${q.id}] "${q.title}":`);
  q.steps.forEach(s => {
    const loc = locations.find(l => l.id === s.locationId);
    console.log(`   Step: ${s.text} -> Target #${s.locationId} (${loc ? loc.name : 'MISSING!'})`);
  });
}
