import { soundManager } from './AudioSynth.js';
import { locationRegistry } from './LocationRegistry.js';

/**
 * Data-Driven Quest Progression System
 */
export class QuestSystem {
  constructor(questsData, discoverySystem, onQuestCompletedCallback) {
    this.quests = JSON.parse(JSON.stringify(questsData)); // clone
    this.discoverySystem = discoverySystem;
    this.onQuestCompletedCallback = onQuestCompletedCallback;
    this.completedQuestIds = new Set();
  }

  loadState(savedData) {
    if (!savedData) return;
    if (savedData.completedQuestIds && Array.isArray(savedData.completedQuestIds)) {
      this.completedQuestIds = new Set(savedData.completedQuestIds);
    }
    if (savedData.quests && Array.isArray(savedData.quests)) {
      savedData.quests.forEach(sq => {
        const q = this.quests.find(item => item.id === sq.id);
        if (q && sq.objectives) {
          sq.objectives.forEach(so => {
            const obj = q.objectives.find(o => o.id === so.id);
            if (obj) obj.completed = !!so.completed;
          });
        }
      });
    }
  }

  getState() {
    return {
      completedQuestIds: Array.from(this.completedQuestIds),
      quests: this.quests.map(q => ({
        id: q.id,
        objectives: q.objectives.map(o => ({ id: o.id, completed: o.completed }))
      }))
    };
  }

  onLocationVisited(locationId) {
    const canonicalId = locationRegistry.migrateId(locationId);
    let questProgressed = false;

    for (const quest of this.quests) {
      if (this.completedQuestIds.has(quest.id)) continue;

      let changedInThisQuest = false;
      for (const obj of quest.objectives) {
        const targetCanonical = locationRegistry.migrateId(obj.targetLocationId);
        if (!obj.completed && targetCanonical === canonicalId) {
          obj.completed = true;
          changedInThisQuest = true;
          questProgressed = true;
        }
      }

      if (changedInThisQuest) {
        this.checkQuestCompletion(quest);
      }
    }

    return questProgressed;
  }

  onActionCompleted(actionType) {
    let questProgressed = false;

    for (const quest of this.quests) {
      if (this.completedQuestIds.has(quest.id)) continue;

      let changedInThisQuest = false;
      for (const obj of quest.objectives) {
        if (!obj.completed && obj.type === actionType) {
          obj.completed = true;
          changedInThisQuest = true;
          questProgressed = true;
        }
      }

      if (changedInThisQuest) {
        this.checkQuestCompletion(quest);
      }
    }

    return questProgressed;
  }

  checkQuestCompletion(quest) {
    const allDone = quest.objectives.every(o => o.completed);
    if (allDone && !this.completedQuestIds.has(quest.id)) {
      this.completedQuestIds.add(quest.id);
      const pts = quest.rewardPoints || 100;
      this.discoverySystem.addDirectScore(pts, `Quest: ${quest.title}`);

      soundManager.playQuestComplete();

      if (this.onQuestCompletedCallback) {
        this.onQuestCompletedCallback(quest, pts, this.discoverySystem.score);
      }
    }
  }

  getActiveQuests() {
    return this.quests.filter(q => !this.completedQuestIds.has(q.id));
  }

  getCompletedQuests() {
    return this.quests.filter(q => this.completedQuestIds.has(q.id));
  }

  getCurrentPrimaryObjective() {
    const active = this.getActiveQuests();
    if (active.length === 0) return { title: "Campus Master", text: "All current quests completed! Keep exploring secrets." };
    const firstQuest = active[0];
    const pendingObj = firstQuest.objectives.find(o => !o.completed) || firstQuest.objectives[0];
    return {
      title: firstQuest.title,
      text: pendingObj.description,
      progress: `${firstQuest.objectives.filter(o => o.completed).length}/${firstQuest.objectives.length}`
    };
  }

  getAllQuestsWithProgress() {
    return this.quests.map(q => {
      const completedCount = q.objectives.filter(o => o.completed).length;
      const totalCount = q.objectives.length;
      const isComplete = this.completedQuestIds.has(q.id);
      return {
        ...q,
        completedCount,
        totalCount,
        isComplete,
        percent: Math.round((completedCount / totalCount) * 100)
      };
    });
  }
}
