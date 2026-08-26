import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };

console.log('=== ALL 95 LOCATIONS AUDIT ===\n');
for (const loc of locations) {
  console.log(`[#${loc.id.toString().padStart(2, '0')}] [${loc.section.padEnd(15, ' ')}] "${loc.name}" (${loc.category}) at (${loc.x}, ${loc.y})`);
}
