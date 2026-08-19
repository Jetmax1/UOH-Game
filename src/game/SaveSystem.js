/**
 * LocalStorage Save & Progress Persistence Manager
 */
export class SaveSystem {
  constructor(storageKey = 'uoh_campus_adventure_save_v1') {
    this.storageKey = storageKey;
  }

  saveGame(gameData) {
    try {
      const payload = {
        version: 1,
        timestamp: Date.now(),
        player: {
          x: gameData.player.x,
          y: gameData.player.y,
          currentInterior: gameData.player.currentInterior || null
        },
        time: {
          hour: gameData.timeSystem.hour,
          minute: gameData.timeSystem.minute,
          day: gameData.timeSystem.day
        },
        discovery: gameData.discoverySystem.getState(),
        quests: gameData.questSystem.getState(),
        quizProgress: gameData.quizProgress || {}
      };

      localStorage.setItem(this.storageKey, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error('Failed to save game to localStorage:', e);
      return false;
    }
  }

  loadGame() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse save game:', e);
      return null;
    }
  }

  hasSavedGame() {
    return !!localStorage.getItem(this.storageKey);
  }

  clearSave() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (e) {
      console.error('Failed to clear save:', e);
      return false;
    }
  }
}
