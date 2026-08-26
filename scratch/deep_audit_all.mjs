import locations from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/locations.json' with { type: 'json' };
import npcs from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/npcs.json' with { type: 'json' };
import quests from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/quests.json' with { type: 'json' };
import quizQuestions from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/quizQuestions.json' with { type: 'json' };
import gameConfig from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/gameConfig.json' with { type: 'json' };
import { sectionConfigs } from 'file:///c:/Users/harsh/Documents/Project/UOH game/src/data/map/worldData.js';

console.log('=== FULL DEEP AUDIT: DUPLICATE LOCATIONS, EVENTS, QUESTS, NPCS, QUIZZES ===\n');

// 1. Check locations across all sections for duplicate spots or overlapping real-world places
console.log('--- 1. LOCATIONS AUDIT ---');
for (let i = 0; i < locations.length; i++) {
  for (let j = i + 1; j < locations.length; j++) {
    const a = locations[i];
    const b = locations[j];
    
    // Check similar names, same category + similar coordinates, etc.
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    if (nameA === nameB) {
      console.log(`[EXACT NAME DUPLICATE] #${a.id} (${a.section}) and #${b.id} (${b.section}): "${a.name}"`);
    } else {
      // Check word overlap
      const wordsA = nameA.split(/\s+/).filter(w => w.length > 3 && !['university', 'hyderabad', 'school', 'centre', 'center', 'department', 'hostel', 'building'].includes(w));
      const wordsB = nameB.split(/\s+/).filter(w => w.length > 3 && !['university', 'hyderabad', 'school', 'centre', 'center', 'department', 'hostel', 'building'].includes(w));
      
      const common = wordsA.filter(w => wordsB.includes(w));
      if (common.length >= 2 || (common.length >= 1 && (a.category === b.category))) {
        console.log(`[SIMILAR SPOT] Common words [${common.join(', ')}]:\n   -> #${a.id} (${a.section}): "${a.name}" (${a.category})\n   -> #${b.id} (${b.section}): "${b.name}" (${b.category})`);
      }
    }
  }
}

// 2. Check Quests & Events
console.log('\n--- 2. QUESTS & EVENTS AUDIT ---');
for (const q of quests) {
  console.log(`Quest [${q.id}]: "${q.title}"`);
  console.log(`   Steps:`, q.steps || q.objectives);
}

// 3. Check NPCs and their dialogue events
console.log('\n--- 3. NPCS & DIALOGUES AUDIT ---');
for (const npc of npcs) {
  console.log(`NPC [${npc.id}]: "${npc.name}" in sec [${npc.section}]`);
  console.log(`   Dialogue count: ${npc.dialogue ? npc.dialogue.length : 0}, Has Quest: ${npc.questId || 'none'}`);
}

// 4. Check Quiz Questions for duplicates
console.log('\n--- 4. QUIZ QUESTIONS AUDIT ---');
const qSet = new Map();
for (const q of quizQuestions) {
  const norm = q.question.toLowerCase().trim();
  if (qSet.has(norm)) {
    console.log(`[DUPLICATE QUIZ QUESTION] Q#${q.id} duplicates Q#${qSet.get(norm)}: "${q.question}"`);
  } else {
    qSet.set(norm, q.id);
  }
}

// 5. Check Time/Night Events in Game Config
console.log('\n--- 5. GAME CONFIG & SCHEDULED EVENTS AUDIT ---');
console.log('Events in config:', gameConfig.events || gameConfig.nightActivities || 'none');

// 6. Check Checkpoints / Transitions between sections
console.log('\n--- 6. SECTION TRANSITION CHECKPOINTS ---');
for (const [secKey, secVal] of Object.entries(sectionConfigs)) {
  console.log(`Section [${secKey}] checkpoints:`, secVal.checkpoints?.map(c => `to [${c.targetSection}] at (${c.x}, ${c.y})`));
}
