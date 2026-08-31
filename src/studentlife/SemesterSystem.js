/**
 * SemesterSystem: 16-Week University Semester Progression & Report Card
 */
export class SemesterSystem {
  constructor(initialData = {}) {
    this.currentSemester = initialData.currentSemester || 1;
    this.currentWeek = initialData.currentWeek || 1;
    this.maxWeeks = 16;

    this.onSemesterCompleted = null;
    this.onWeekAdvanced = null;
  }

  advanceDay() {
    // Every 7 days = 1 Semester Week
    if (Math.random() < 0.25) { // 25% chance per day sleep cycle to advance week
      this.advanceWeek();
    }
  }

  advanceWeek() {
    this.currentWeek += 1;
    if (this.currentWeek > this.maxWeeks) {
      this.completeSemester();
    } else if (this.onWeekAdvanced) {
      this.onWeekAdvanced(this.currentWeek, this.getWeekPhaseName());
    }
  }

  getWeekPhaseName() {
    if (this.currentWeek <= 3) return 'Orientation & Exploration';
    if (this.currentWeek <= 7) return 'Mid-Semester Examinations';
    if (this.currentWeek <= 12) return 'Campus Events & Projects';
    if (this.currentWeek <= 15) return 'Final Exam Revision';
    return 'Final Semester Examinations';
  }

  completeSemester() {
    const completedSem = this.currentSemester;
    this.currentSemester += 1;
    this.currentWeek = 1;

    if (this.onSemesterCompleted) {
      this.onSemesterCompleted(completedSem);
    }
  }

  serialize() {
    return {
      currentSemester: this.currentSemester,
      currentWeek: this.currentWeek
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.currentSemester) this.currentSemester = data.currentSemester;
    if (data.currentWeek) this.currentWeek = data.currentWeek;
  }
}
