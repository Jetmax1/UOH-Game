/**
 * ScheduleSystem: University Student Daily Schedule & Class Timetable Generator
 */
export class ScheduleSystem {
  constructor() {
    this.schedule = [
      { time: '08:30', hour: 8, minute: 30, title: 'Morning Lecture: Computer Science', location: 'SCIS Building (#45)', type: 'class', targetLocId: 45 },
      { time: '10:30', hour: 10, minute: 30, title: 'Tutorial: Linear Algebra & Science Lab', location: 'Science Complex (#36)', type: 'lab', targetLocId: 36 },
      { time: '12:30', hour: 12, minute: 30, title: 'Cafeteria Lunch & Chai Break', location: 'Zakir Food Court / Sukoon Canteen', type: 'food', targetLocId: 59 },
      { time: '14:00', hour: 14, minute: 0, title: 'Library Archival Study & Quests', location: 'IGM Library (#51)', type: 'study', targetLocId: 51 },
      { time: '16:30', hour: 16, minute: 30, title: 'University Club Meetup & Missions', location: 'Club HQs / Sukoon Canteen', type: 'club', targetLocId: 59 },
      { time: '19:00', hour: 19, minute: 0, title: 'Live Campus Trivia & Events', location: 'Student Centre / Stadium', type: 'event', targetLocId: 93 },
      { time: '22:30', hour: 22, minute: 30, title: 'Hostel Rest & Daily Sleep Loop', location: 'MHK Hostel Complex', type: 'sleep', targetLocId: 69 }
    ];
  }

  getCurrentAndNextActivity(currentHour, currentMinute) {
    const totalCurrentMins = currentHour * 60 + currentMinute;
    let currentItem = this.schedule[0];
    let nextItem = this.schedule[1];

    for (let i = 0; i < this.schedule.length; i++) {
      const itemMins = this.schedule[i].hour * 60 + this.schedule[i].minute;
      if (totalCurrentMins >= itemMins) {
        currentItem = this.schedule[i];
        nextItem = this.schedule[(i + 1) % this.schedule.length];
      }
    }

    return { current: currentItem, next: nextItem };
  }

  getTodaySchedule() {
    return this.schedule;
  }
}
