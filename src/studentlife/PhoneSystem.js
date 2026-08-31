/**
 * PhoneSystem: In-Game Student Smartphone ("UOH Phone") & App Hub Controller
 */
export class PhoneSystem {
  constructor(game) {
    this.game = game;
    this.activeApp = 'schedule'; // Default app on phone unlock
    this.unreadNotifications = 2;
  }

  getAppsList() {
    return [
      { id: 'schedule', name: 'Schedule', icon: '📅', color: '#38bdf8', desc: 'Daily Timetable & Classes' },
      { id: 'academics', name: 'Academics', icon: '📊', color: '#10b981', desc: 'CGPA, Courses & Grades' },
      { id: 'social', name: 'UoH Social', icon: '💬', color: '#f59e0b', desc: 'Campus Social Feed' },
      { id: 'news', name: 'Campus News', icon: '📰', color: '#ef4444', desc: 'Official Announcements' },
      { id: 'profile', name: 'Student ID', icon: '👤', color: '#8b5cf6', desc: 'Profile & RPG Identity' },
      { id: 'clubs', name: 'Clubs', icon: '🏛️', color: '#06b6d4', desc: 'Campus Societies & Ranks' },
      { id: 'map', name: 'Campus Map', icon: '🗺️', color: '#ec4899', desc: 'Fast Navigation & Map' },
      { id: 'settings', name: 'Settings', icon: '⚙️', color: '#64748b', desc: 'Audio & Visual Controls' }
    ];
  }

  setActiveApp(appId) {
    this.activeApp = appId;
  }
}
