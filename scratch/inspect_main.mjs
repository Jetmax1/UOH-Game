import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };

const secLocs = locations.filter(l => l.section === 'main');
console.log(`SECTION: MAIN (${secLocs.length} locations)`);

const byCat = {};
for (const l of secLocs) {
  if (!byCat[l.category]) byCat[l.category] = [];
  byCat[l.category].push(l);
}

for (const [cat, locs] of Object.entries(byCat)) {
  console.log(`\n  Category: [${cat}]`);
  for (const l of locs) {
    console.log(`    #${l.id.toString().padStart(2, ' ')}: "${l.name}" | short: "${l.shortName}" | pos: (${l.x}, ${l.y}) | size: ${l.width}x${l.height}`);
  }
}
