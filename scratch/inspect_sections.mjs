import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };

const sections = ['main', 'south', 'west', 'east', 'amphi_valley', 'checkdam_buffer'];

for (const sec of sections) {
  console.log(`\n======================================================`);
  console.log(`SECTION: ${sec.toUpperCase()} (${locations.filter(l => l.section === sec).length} locations)`);
  console.log(`======================================================`);
  
  const secLocs = locations.filter(l => l.section === sec);
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
}
