import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };

const duplicates = [];
for (let i = 0; i < locations.length; i++) {
  for (let j = i + 1; j < locations.length; j++) {
    const l1 = locations[i];
    const l2 = locations[j];

    const n1 = l1.name.toLowerCase();
    const n2 = l2.name.toLowerCase();
    const s1 = (l1.shortName || '').toLowerCase();
    const s2 = (l2.shortName || '').toLowerCase();

    // Check overlaps
    if (n1 === n2 || s1 === s2 || 
        (n1.length > 5 && n2.includes(n1)) || 
        (n2.length > 5 && n1.includes(n2)) ||
        (s1.length > 4 && s2.includes(s1)) ||
        (s2.length > 4 && s1.includes(s2))) {
      duplicates.push({
        id1: l1.id,
        name1: l1.name,
        short1: l1.shortName,
        sec1: l1.section,
        id2: l2.id,
        name2: l2.name,
        short2: l2.shortName,
        sec2: l2.section
      });
    }
  }
}

console.log(`Found ${duplicates.length} potential duplicate pairs:\n`);
duplicates.forEach(d => {
  console.log(`[#${d.id1} (${d.sec1}) "${d.name1}" / "${d.short1}"] <===> [#${d.id2} (${d.sec2}) "${d.name2}" / "${d.short2}"]`);
});
