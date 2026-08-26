import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };
import npcs from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/npcs.json' with { type: 'json' };
import quests from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/quests.json' with { type: 'json' };
import quizQuestions from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/quizQuestions.json' with { type: 'json' };
import { sectionConfigs } from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/map/worldData.js';

console.log('=== CANONICAL SYSTEM PRE-AUDIT ===\n');

// 1. Check sections geometry and coordinate origins
// Let's determine the spatial relationship of the 6 sections in the UoH campus layout:
// Real UoH Map Layout:
// - North-West: SATG Shooting Range, Main Gate (East campus NW corner)
// - North: Main Campus (Admin, Social Sciences, Humanities, Masoom Rock, Buffalo Lake, Auroya Dam)
// - East: East Campus (SCIS, IGM Library, Sukoon, CR Rao, Peacock Lake, Balayogi Stadium, Sai Baba Temple)
// - South: South Campus (SLS, CIS, Nanotech, Hostels J, I, MHK, L, Ladies Hostels, South Gate)
// - South-West: West Campus (Indoor Stadium, Central Workshop, IDC Gate 3, Campus School)
// - Central Buffer & Valley: Amphi Valley (Secret Lake) & Check Dam Buffer (Globbo Rock, Chinna Gudi)

const sectionOffsets = {
  main: { originX: 0, originY: 0, width: 1700, height: 1350 },
  east: { originX: 1700, originY: 0, width: 2400, height: 1600 },
  west: { originX: -1400, originY: 1350, width: 1400, height: 1200 },
  south: { originX: 0, originY: 1350, width: 2000, height: 1900 },
  amphi_valley: { originX: 1600, originY: 1350, width: 1600, height: 1200 },
  checkdam_buffer: { originX: 400, originY: 1000, width: 1400, height: 1000 }
};

console.log('Section Offsets:', sectionOffsets);

// Compute world coordinates for each location
const locationsWithWorld = locations.map(loc => {
  const sec = sectionOffsets[loc.section] || { originX: 0, originY: 0 };
  const worldX = sec.originX + loc.x;
  const worldY = sec.originY + loc.y;
  return {
    ...loc,
    worldX,
    worldY
  };
});

console.log(`\nAuditing ${locationsWithWorld.length} locations for proximity in world space...`);

// Check for any locations within 120px in world space
const closePairs = [];
for (let i = 0; i < locationsWithWorld.length; i++) {
  for (let j = i + 1; j < locationsWithWorld.length; j++) {
    const a = locationsWithWorld[i];
    const b = locationsWithWorld[j];
    const dx = a.worldX - b.worldX;
    const dy = a.worldY - b.worldY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      closePairs.push({ a, b, dist: Math.round(dist) });
    }
  }
}

console.log(`Found ${closePairs.length} spatially close pairs (<120px world dist):`);
closePairs.forEach(p => {
  console.log(` - #${p.a.id} "${p.a.name}" (${p.a.section}) and #${p.b.id} "${p.b.name}" (${p.b.section}) -> dist: ${p.dist}px`);
});
