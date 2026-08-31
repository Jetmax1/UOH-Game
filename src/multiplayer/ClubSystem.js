/**
 * ClubSystem: Authentic University of Hyderabad Student Clubs & Campus Societies
 */
export const UOH_CLUBS = [
  {
    id: 'photography',
    name: 'UOH Photography & Nature Society',
    shortName: 'Photo & Nature',
    icon: '📷',
    badgeColor: '#10b981',
    hqLocationId: 59, // Sukoon Canteen
    hqName: 'Sukoon Canteen & Lakeside Glade',
    description: 'Capture the rocky monoliths, flora, Peacock Lake wildlife, and golden sunsets of UoH.',
    leadNpc: 'Priya Sharma (Nature Lead)',
    ranks: ['Junior Shutterbug', 'Field Photographer', 'Senior Chronicler', 'Club President'],
    missions: [
      { id: 'photo_m1', title: 'Monolith Heritage', desc: 'Visit Masoom\'s Rock (#27) and Globbo Rock (#17)', targetCount: 2, currentCount: 0, rewardXp: 180, rewardRep: 60 },
      { id: 'photo_m2', title: 'Lakeside Serenity', desc: 'Photograph Peacock Lake shoreline and Buffalo Lake', targetCount: 2, currentCount: 0, rewardXp: 220, rewardRep: 80 },
      { id: 'photo_m3', title: 'Wildlife Spotting', desc: 'Encounter 3 roaming peacocks or deer across campus', targetCount: 3, currentCount: 0, rewardXp: 250, rewardRep: 90 }
    ]
  },
  {
    id: 'coding',
    name: 'SCIS Turing Coding & Robotics Society',
    shortName: 'Turing Coding Club',
    icon: '💻',
    badgeColor: '#3b82f6',
    hqLocationId: 45, // SCIS
    hqName: 'School of Computer Sciences (SCIS, #45)',
    description: 'Algorithmic competitions, autonomous shuttle robotics, open-source campus tech, and hackathons.',
    leadNpc: 'Karthik Rao (Senior Coder)',
    ranks: ['Code Novice', 'Algorithm Dev', 'Systems Architect', 'Lead Hacker'],
    missions: [
      { id: 'code_m1', title: 'Lab Inspection', desc: 'Enter SCIS (#45) and inspect the AI Research Notice Board', targetCount: 1, currentCount: 0, rewardXp: 150, rewardRep: 50 },
      { id: 'code_m2', title: 'Shuttle Telemetry', desc: 'Observe autonomous campus e-shuttles on Main Avenue', targetCount: 2, currentCount: 0, rewardXp: 180, rewardRep: 60 },
      { id: 'code_m3', title: 'Tech Library Sprint', desc: 'Read a Computer Science research volume in IGM Library', targetCount: 1, currentCount: 0, rewardXp: 200, rewardRep: 75 }
    ]
  },
  {
    id: 'sports',
    name: 'UOH Athletics & Sports Club',
    shortName: 'Athletics & Sports',
    icon: '🏆',
    badgeColor: '#f59e0b',
    hqLocationId: 92, // Balayogi Sports Complex
    hqName: 'GMC Balayogi Sports Complex (#92)',
    description: 'Track & field sprints, volleyball, football tournaments, and campus fitness marathons.',
    leadNpc: 'Vikram Singh (Sports Captain)',
    ranks: ['Varsity Trainee', 'Active Athlete', 'Team Captain', 'Sports Legend'],
    missions: [
      { id: 'sports_m1', title: 'Stadium Lap', desc: 'Sprint around the Gachibowli Stadium Track (#93)', targetCount: 1, currentCount: 0, rewardXp: 200, rewardRep: 70 },
      { id: 'sports_m2', title: 'Court Challenge', desc: 'Visit the Volleyball Court (#16) and Tennis Court (#63)', targetCount: 2, currentCount: 0, rewardXp: 180, rewardRep: 60 },
      { id: 'sports_m3', title: 'Cross-Campus Run', desc: 'Travel from Gate 1 Checkpoint to South Campus Check Dam', targetCount: 1, currentCount: 0, rewardXp: 260, rewardRep: 100 }
    ]
  },
  {
    id: 'literary',
    name: 'IGM Literary, Debate & Quiz Society',
    shortName: 'Literary & Quiz Society',
    icon: '📚',
    badgeColor: '#8b5cf6',
    hqLocationId: 51, // IGM Library
    hqName: 'Indira Gandhi Memorial Library (#51)',
    description: 'University trivia tournaments, philosophical debates, archival campus research, and poetry slams.',
    leadNpc: 'Dr. Ananya Sen (Quizmaster)',
    ranks: ['Trivia Initiate', 'Debate Fellow', 'Quizmaster', 'Grand Chancellor'],
    missions: [
      { id: 'lit_m1', title: 'Library Archives', desc: 'Explore both 1F and 2F of IGM Library (#51)', targetCount: 2, currentCount: 0, rewardXp: 160, rewardRep: 60 },
      { id: 'lit_m2', title: 'Historical Monument', desc: 'Visit the University Entrance Monument (#86)', targetCount: 1, currentCount: 0, rewardXp: 180, rewardRep: 65 },
      { id: 'lit_m3', title: 'Trivia Master', desc: 'Achieve a streak of 5 correct answers in the Campus Quiz', targetCount: 1, currentCount: 0, rewardXp: 300, rewardRep: 120 }
    ]
  },
  {
    id: 'biotech',
    name: 'Life Sciences & ASPIRE BioNEST Club',
    shortName: 'Life Sciences Club',
    icon: '🔬',
    badgeColor: '#06b6d4',
    hqLocationId: 3, // SLS
    hqName: 'School of Life Sciences & ASPIRE BioNEST (#3)',
    description: 'Biotech innovation, plant taxonomy, ecosystem conservation, and wetland microbiology research.',
    leadNpc: 'Dr. Ramesh Babu (Biotech Lead)',
    ranks: ['Lab Apprentice', 'Biotech Researcher', 'Senior Investigator', 'Chief Scientist'],
    missions: [
      { id: 'bio_m1', title: 'Greenhouse Flora', desc: 'Visit the South Campus Botanical Greenhouse (#2)', targetCount: 1, currentCount: 0, rewardXp: 180, rewardRep: 60 },
      { id: 'bio_m2', title: 'Wetland Ecology', desc: 'Examine the Check Dam wetland ecosystem (#1)', targetCount: 1, currentCount: 0, rewardXp: 200, rewardRep: 75 },
      { id: 'bio_m3', title: 'Herbarium Archives', desc: 'Inspect specimen books inside the School of Life Sciences', targetCount: 1, currentCount: 0, rewardXp: 240, rewardRep: 85 }
    ]
  }
];

export class ClubSystem {
  constructor(initialData = {}) {
    this.joinedClubId = initialData.joinedClubId || null;
    this.clubRankIndex = initialData.clubRankIndex || 0;
    this.clubPoints = initialData.clubPoints || 0;
    this.missions = this.initMissions(initialData.missions);

    this.onClubJoined = null;
    this.onMissionCompleted = null;
    this.onRankUp = null;
  }

  initMissions(savedMissions) {
    const map = {};
    for (const club of UOH_CLUBS) {
      map[club.id] = club.missions.map(m => {
        const saved = savedMissions && savedMissions[m.id];
        return {
          ...m,
          currentCount: saved ? saved.currentCount : 0,
          completed: saved ? saved.completed : false
        };
      });
    }
    return map;
  }

  getAllClubs() {
    return UOH_CLUBS;
  }

  getClub(id = this.joinedClubId) {
    return UOH_CLUBS.find(c => c.id === id) || null;
  }

  getCurrentClubData() {
    const club = this.getClub();
    if (!club) return null;

    const rankName = club.ranks[Math.min(this.clubRankIndex, club.ranks.length - 1)];
    const activeMissions = this.missions[club.id] || [];

    return {
      id: club.id,
      name: club.name,
      shortName: club.shortName,
      icon: club.icon,
      badgeColor: club.badgeColor,
      role: rankName,
      rankIndex: this.clubRankIndex,
      points: this.clubPoints,
      hqName: club.hqName,
      leadNpc: club.leadNpc,
      missions: activeMissions
    };
  }

  joinClub(clubId) {
    const target = UOH_CLUBS.find(c => c.id === clubId);
    if (!target) return false;

    this.joinedClubId = clubId;
    this.clubRankIndex = 0;
    this.clubPoints = 0;

    if (this.onClubJoined) {
      this.onClubJoined(target);
    }
    return true;
  }

  leaveClub() {
    this.joinedClubId = null;
    this.clubRankIndex = 0;
  }

  progressMission(missionId, amount = 1) {
    if (!this.joinedClubId) return false;
    const clubMissions = this.missions[this.joinedClubId];
    if (!clubMissions) return false;

    const mission = clubMissions.find(m => m.id === missionId);
    if (!mission || mission.completed) return false;

    mission.currentCount = Math.min(mission.targetCount, mission.currentCount + amount);
    if (mission.currentCount >= mission.targetCount) {
      mission.completed = true;
      this.clubPoints += 100;
      this.checkRankProgression();

      if (this.onMissionCompleted) {
        this.onMissionCompleted(mission);
      }
      return { completed: true, mission };
    }

    return { completed: false, mission };
  }

  checkRankProgression() {
    const club = this.getClub();
    if (!club) return;

    const neededPoints = (this.clubRankIndex + 1) * 200;
    if (this.clubPoints >= neededPoints && this.clubRankIndex < club.ranks.length - 1) {
      this.clubRankIndex += 1;
      const newRank = club.ranks[this.clubRankIndex];
      if (this.onRankUp) {
        this.onRankUp(newRank, club);
      }
    }
  }

  onLocationDiscovered(locationId) {
    if (!this.joinedClubId) return;

    if (this.joinedClubId === 'photography') {
      if (locationId === 27 || locationId === 17) this.progressMission('photo_m1');
      if (locationId === 49 || locationId === 69) this.progressMission('photo_m2');
    } else if (this.joinedClubId === 'coding') {
      if (locationId === 45) this.progressMission('code_m1');
    } else if (this.joinedClubId === 'sports') {
      if (locationId === 93) this.progressMission('sports_m1');
      if (locationId === 16 || locationId === 63) this.progressMission('sports_m2');
    } else if (this.joinedClubId === 'literary') {
      if (locationId === 51) this.progressMission('lit_m1');
      if (locationId === 86) this.progressMission('lit_m2');
    } else if (this.joinedClubId === 'biotech') {
      if (locationId === 2) this.progressMission('bio_m1');
      if (locationId === 1) this.progressMission('bio_m2');
    }
  }

  serialize() {
    return {
      joinedClubId: this.joinedClubId,
      clubRankIndex: this.clubRankIndex,
      clubPoints: this.clubPoints,
      missions: this.missions
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.joinedClubId !== undefined) this.joinedClubId = data.joinedClubId;
    if (data.clubRankIndex !== undefined) this.clubRankIndex = data.clubRankIndex;
    if (data.clubPoints !== undefined) this.clubPoints = data.clubPoints;
    if (data.missions) this.missions = this.initMissions(data.missions);
  }
}
