/**
 * UniversityProgression: Student Leveling, XP, Campus Reputation, Titles & Achievements
 */
export class UniversityProgression {
  constructor(initialData = {}) {
    this.studentName = initialData.studentName || 'Student';
    this.studentId = initialData.studentId || this.generateStudentId();
    this.department = initialData.department || 'School of Computer & Info Sciences';
    this.year = initialData.year || '2nd Year';
    
    // Core Progression
    this.level = initialData.level || 1;
    this.xp = initialData.xp || 0;
    this.reputation = initialData.reputation || 100; // Campus Community Standing (⭐)
    
    // Identity & Titles
    this.activeTitle = initialData.activeTitle || 'Freshman';
    this.unlockedTitles = initialData.unlockedTitles || ['Freshman', 'Campus Explorer'];
    
    // Stats & Tracking
    this.stats = {
      discoveriesCount: initialData.stats?.discoveriesCount || 0,
      questsCompleted: initialData.stats?.questsCompleted || 0,
      eventsWon: initialData.stats?.eventsWon || 0,
      quizzesAnswered: initialData.stats?.quizzesAnswered || 0,
      clubActivitiesDone: initialData.stats?.clubActivitiesDone || 0,
      socialInteractions: initialData.stats?.socialInteractions || 0,
      distanceWalked: initialData.stats?.distanceWalked || 0
    };

    // Unlocked Achievements
    this.achievements = initialData.achievements || [];
    
    // Event listeners
    this.onLevelUp = null;
    this.onReputationGain = null;
    this.onAchievementUnlock = null;
  }

  generateStudentId() {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `UOH-${year}-${rand}`;
  }

  getXpForNextLevel(lvl = this.level) {
    // Smooth quadratic RPG leveling curve
    return Math.floor(100 * Math.pow(lvl, 1.45));
  }

  addXp(amount, reason = '') {
    this.xp += amount;
    let leveledUp = false;

    while (this.xp >= this.getXpForNextLevel(this.level)) {
      this.xp -= this.getXpForNextLevel(this.level);
      this.level += 1;
      leveledUp = true;
      this.checkLevelTitleUnlocks();
    }

    if (leveledUp && this.onLevelUp) {
      this.onLevelUp(this.level, this.getRankTitle(this.level));
    }

    return { leveledUp, currentLevel: this.level, currentXp: this.xp, neededXp: this.getXpForNextLevel() };
  }

  addReputation(amount, reason = '') {
    this.reputation += amount;
    if (this.onReputationGain) {
      this.onReputationGain(amount, this.reputation, reason);
    }
  }

  getRankTitle(lvl = this.level) {
    if (lvl >= 30) return 'University Legend';
    if (lvl >= 20) return 'Campus Veteran';
    if (lvl >= 10) return 'Active Scholar';
    if (lvl >= 5) return 'Campus Explorer';
    return 'Freshman';
  }

  checkLevelTitleUnlocks() {
    const rankTitle = this.getRankTitle(this.level);
    if (!this.unlockedTitles.includes(rankTitle)) {
      this.unlockedTitles.push(rankTitle);
    }

    if (this.level >= 5 && !this.unlockedTitles.includes('Campus Explorer')) {
      this.unlockTitle('Campus Explorer');
    }
    if (this.level >= 10 && !this.unlockedTitles.includes('Dean\'s List')) {
      this.unlockTitle('Dean\'s List');
    }
    if (this.level >= 15 && !this.unlockedTitles.includes('Senior Scholar')) {
      this.unlockTitle('Senior Scholar');
    }
    if (this.level >= 25 && !this.unlockedTitles.includes('Distinguished Fellow')) {
      this.unlockTitle('Distinguished Fellow');
    }
  }

  unlockTitle(title) {
    if (!this.unlockedTitles.includes(title)) {
      this.unlockedTitles.push(title);
      return true;
    }
    return false;
  }

  setTitle(title) {
    if (this.unlockedTitles.includes(title)) {
      this.activeTitle = title;
      return true;
    }
    return false;
  }

  unlockAchievement(id, name, description, icon = '🏆', xpReward = 150, repReward = 50) {
    if (this.achievements.some(a => a.id === id)) return false;

    const achievement = {
      id,
      name,
      description,
      icon,
      unlockedAt: new Date().toISOString()
    };

    this.achievements.push(achievement);
    this.addXp(xpReward, `Achievement: ${name}`);
    this.addReputation(repReward, `Achievement: ${name}`);

    if (this.onAchievementUnlock) {
      this.onAchievementUnlock(achievement);
    }

    return true;
  }

  getProfileSummary(clubData = null) {
    return {
      studentName: this.studentName,
      studentId: this.studentId,
      department: this.department,
      year: this.year,
      level: this.level,
      xp: this.xp,
      xpNeeded: this.getXpForNextLevel(),
      reputation: this.reputation,
      activeTitle: this.activeTitle,
      unlockedTitles: this.unlockedTitles,
      clubName: clubData ? clubData.name : 'Independent Student',
      clubRole: clubData ? clubData.role : 'None',
      clubIcon: clubData ? clubData.icon : '🎓',
      achievementsCount: this.achievements.length,
      achievements: this.achievements,
      stats: this.stats
    };
  }

  serialize() {
    return {
      studentName: this.studentName,
      studentId: this.studentId,
      department: this.department,
      year: this.year,
      level: this.level,
      xp: this.xp,
      reputation: this.reputation,
      activeTitle: this.activeTitle,
      unlockedTitles: this.unlockedTitles,
      stats: this.stats,
      achievements: this.achievements
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.studentName) this.studentName = data.studentName;
    if (data.studentId) this.studentId = data.studentId;
    if (data.department) this.department = data.department;
    if (data.year) this.year = data.year;
    if (data.level) this.level = data.level;
    if (data.xp !== undefined) this.xp = data.xp;
    if (data.reputation !== undefined) this.reputation = data.reputation;
    if (data.activeTitle) this.activeTitle = data.activeTitle;
    if (data.unlockedTitles) this.unlockedTitles = data.unlockedTitles;
    if (data.stats) this.stats = { ...this.stats, ...data.stats };
    if (data.achievements) this.achievements = data.achievements;
  }
}
