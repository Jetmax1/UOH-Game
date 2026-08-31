/**
 * CampusEventSystem: Scheduled & Interactive Campus Events (Treasure Hunt, Quiz Blitz, Campus Sprint)
 */
export class CampusEventSystem {
  constructor(game) {
    this.game = game;

    // Active Event State
    this.activeEvent = null; // null or event object
    this.eventCountdown = 180; // 3 minutes between event cycles
    this.eventState = 'idle'; // 'idle', 'announcing', 'in_progress', 'completed'
    this.eventTimer = 0;

    // Event Results / Leaderboard
    this.leaderboard = [];

    // Clue Treasure Hunt State
    this.huntStep = 0;
    this.huntClues = [
      {
        step: 1,
        riddle: 'Where thousands of volumes sleep by the peaceful lake shore.',
        targetId: 51,
        hint: 'IGM Library, East Campus',
        solvedText: 'Found the ancient Library archives!'
      },
      {
        step: 2,
        riddle: 'The twin Precambrian granite monoliths standing since antiquity.',
        targetId: 27,
        hint: 'Masoom\'s Rock, Main Campus',
        solvedText: 'Discovered the Masoom\'s Rock heritage plinth!'
      },
      {
        step: 3,
        riddle: 'Steaming hot chai, glade umbrella seating, and late evening debates.',
        targetId: 59,
        hint: 'Sukoon Canteen, East Campus',
        solvedText: 'Relaxed at Sukoon Canteen pavilion!'
      },
      {
        step: 4,
        riddle: 'The grand synthetic running track where varsity champions train.',
        targetId: 93,
        hint: 'Gachibowli Stadium, West Campus',
        solvedText: 'Crossed the finish line at Gachibowli Stadium!'
      }
    ];

    // Quiz Blitz State
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizStreak = 0;
    this.quizQuestions = [
      {
        q: 'Which lake is located adjacent to the Indira Gandhi Memorial Library in East Campus?',
        options: ['Buffalo Lake', 'Peacock Lake', 'Amphi Lake', 'Secret Lake'],
        answer: 1,
        fact: 'Peacock Lake is famed for roaming Indian Peafowl and sunset trails!'
      },
      {
        q: 'What is the number designation of the School of Computer Sciences (SCIS)?',
        options: ['#36', '#45', '#51', '#3'],
        answer: 1,
        fact: 'SCIS is landmark #45 located on SCIS Road!'
      },
      {
        q: 'What iconic geological rock formation is located near the Central Administration quad?',
        options: ['Cherry Rock', 'Masoom\'s Rock', 'Globbo Rock', 'Aquarium Rock'],
        answer: 1,
        fact: 'Masoom\'s Rock (#27) is a protected heritage granite formation.'
      },
      {
        q: 'Which campus facility features international standard synthetic running tracks?',
        options: ['GMC Balayogi Complex & Stadium', 'Karthik Xerox', 'India Post', 'Auroya Dam'],
        answer: 0,
        fact: 'GMC Balayogi Complex (#92/#93) hosts national athletic events.'
      },
      {
        q: 'Where do students gather for open-air tea and cultural discussions in East Campus?',
        options: ['Sukoon Canteen', 'Health Centre', 'Gate 1 Office', 'Check Dam'],
        answer: 0,
        fact: 'Sukoon Canteen (#59) is the cultural heart of evening student life.'
      }
    ];

    // Sprint Race State
    this.raceCheckpoints = [
      { name: 'Admin Quad Start', x: 740, y: 320, section: 'main' },
      { name: 'Buffalo Lake Bend', x: 420, y: 650, section: 'main' },
      { name: 'Masoom\'s Rock Turn', x: 800, y: 780, section: 'main' },
      { name: 'Main Gate Arch', x: 1200, y: 550, section: 'main' }
    ];
    this.raceStep = 0;
    this.raceStartTime = 0;

    // Callbacks
    this.onEventStateChanged = null;
    this.onTreasureHuntProgress = null;
    this.onQuizQuestionNext = null;
    this.onRaceCheckpointPassed = null;
  }

  update(delta) {
    if (this.eventState === 'idle') {
      this.eventCountdown -= delta;
      if (this.eventCountdown <= 0) {
        this.startRandomEvent();
      }
    } else if (this.eventState === 'announcing') {
      this.eventTimer -= delta;
      if (this.eventTimer <= 0) {
        this.beginEventGameplay();
      }
    } else if (this.eventState === 'in_progress') {
      this.eventTimer -= delta;
      if (this.eventTimer <= 0) {
        this.concludeEvent();
      }
    }
  }

  startRandomEvent() {
    const events = [
      {
        id: 'treasure_hunt',
        type: 'hunt',
        title: 'Campus Clue Treasure Hunt',
        icon: '🗺️',
        desc: 'Solve cryptic campus riddles and uncover secret heritage markers!',
        location: 'Campus Wide',
        duration: 180, // 3 min
        rewardXp: 350,
        rewardRep: 120
      },
      {
        id: 'quiz_blitz',
        type: 'quiz',
        title: 'Live Campus Trivia Blitz',
        icon: '⚡',
        desc: 'Fast-paced UOH campus trivia tournament! Answer quickly to build streaks.',
        location: 'Student Centre & Library',
        duration: 60, // 1 min
        rewardXp: 400,
        rewardRep: 150
      },
      {
        id: 'campus_sprint',
        type: 'sprint',
        title: 'Great Campus Sprint Challenge',
        icon: '🏃',
        desc: 'Race through campus checkpoint gates against the clock!',
        location: 'Main Campus Quad',
        duration: 90, // 1.5 min
        rewardXp: 300,
        rewardRep: 100
      }
    ];

    const pick = events[Math.floor(Math.random() * events.length)];
    this.activeEvent = pick;
    this.eventState = 'announcing';
    this.eventTimer = 15; // 15s announcement countdown

    if (this.onEventStateChanged) {
      this.onEventStateChanged(this.eventState, this.activeEvent, this.eventTimer);
    }
  }

  beginEventGameplay() {
    this.eventState = 'in_progress';
    this.eventTimer = this.activeEvent.duration;

    if (this.activeEvent.type === 'hunt') {
      this.huntStep = 0;
    } else if (this.activeEvent.type === 'quiz') {
      this.quizIndex = 0;
      this.quizScore = 0;
      this.quizStreak = 0;
    } else if (this.activeEvent.type === 'sprint') {
      this.raceStep = 0;
      this.raceStartTime = Date.now();
    }

    if (this.onEventStateChanged) {
      this.onEventStateChanged(this.eventState, this.activeEvent, this.eventTimer);
    }
  }

  // --- TREASURE HUNT LOGIC ---
  getCurrentClue() {
    if (this.huntStep >= this.huntClues.length) return null;
    return this.huntClues[this.huntStep];
  }

  checkTreasureLocation(locationId) {
    if (this.eventState !== 'in_progress' || this.activeEvent?.type !== 'hunt') return false;
    const clue = this.getCurrentClue();
    if (!clue) return false;

    if (locationId === clue.targetId) {
      this.huntStep += 1;
      const isComplete = this.huntStep >= this.huntClues.length;

      if (this.onTreasureHuntProgress) {
        this.onTreasureHuntProgress(this.huntStep, this.huntClues.length, clue, isComplete);
      }

      if (isComplete) {
        this.concludeEvent(true);
      }
      return true;
    }
    return false;
  }

  // --- QUIZ BLITZ LOGIC ---
  getCurrentQuizQuestion() {
    if (this.quizIndex >= this.quizQuestions.length) return null;
    return {
      index: this.quizIndex + 1,
      total: this.quizQuestions.length,
      ...this.quizQuestions[this.quizIndex]
    };
  }

  answerQuiz(optionIndex) {
    if (this.eventState !== 'in_progress' || this.activeEvent?.type !== 'quiz') return null;
    const q = this.quizQuestions[this.quizIndex];
    if (!q) return null;

    const isCorrect = optionIndex === q.answer;
    if (isCorrect) {
      this.quizStreak += 1;
      this.quizScore += 100 * this.quizStreak;
    } else {
      this.quizStreak = 0;
    }

    const result = {
      isCorrect,
      correctOption: q.answer,
      fact: q.fact,
      score: this.quizScore,
      streak: this.quizStreak
    };

    this.quizIndex += 1;
    if (this.quizIndex >= this.quizQuestions.length) {
      setTimeout(() => this.concludeEvent(true), 1200);
    } else if (this.onQuizQuestionNext) {
      this.onQuizQuestionNext(this.getCurrentQuizQuestion());
    }

    return result;
  }

  // --- SPRINT RACE LOGIC ---
  checkRaceCheckpoint(playerX, playerY, playerSection) {
    if (this.eventState !== 'in_progress' || this.activeEvent?.type !== 'sprint') return false;
    if (this.raceStep >= this.raceCheckpoints.length) return false;

    const cp = this.raceCheckpoints[this.raceStep];
    if (playerSection !== cp.section) return false;

    const dist = Math.hypot(playerX - cp.x, playerY - cp.y);
    if (dist < 70) {
      this.raceStep += 1;
      const isFinished = this.raceStep >= this.raceCheckpoints.length;
      const elapsedSec = ((Date.now() - this.raceStartTime) / 1000).toFixed(1);

      if (this.onRaceCheckpointPassed) {
        this.onRaceCheckpointPassed(this.raceStep, this.raceCheckpoints.length, cp, isFinished, elapsedSec);
      }

      if (isFinished) {
        this.concludeEvent(true, { finishTime: elapsedSec });
      }
      return true;
    }
    return false;
  }

  concludeEvent(success = false, extra = {}) {
    this.eventState = 'completed';

    // Build leaderboard
    this.leaderboard = [
      { rank: 1, name: this.game.progression?.studentName || 'You', score: success ? (this.quizScore || 850) : 320, title: this.game.progression?.activeTitle || 'Student' },
      { rank: 2, name: 'Rahul V.', score: 680, title: 'Campus Explorer' },
      { rank: 3, name: 'Priya S.', score: 540, title: 'Active Scholar' },
      { rank: 4, name: 'Aman K.', score: 410, title: 'Freshman' }
    ];

    if (success && this.activeEvent) {
      if (this.game.progression) {
        this.game.progression.addXp(this.activeEvent.rewardXp, `Event Won: ${this.activeEvent.title}`);
        this.game.progression.addReputation(this.activeEvent.rewardRep, `Event Won: ${this.activeEvent.title}`);
        if (this.game.progression.stats) this.game.progression.stats.eventsWon++;
      }
      this.game.particles.createStarBurst(this.game.player.x, this.game.player.y);
    }

    if (this.onEventStateChanged) {
      this.onEventStateChanged(this.eventState, this.activeEvent, 0, this.leaderboard);
    }

    // Reset back to idle after 15s
    setTimeout(() => {
      this.activeEvent = null;
      this.eventState = 'idle';
      this.eventCountdown = 240; // 4 min to next event
      if (this.onEventStateChanged) {
        this.onEventStateChanged(this.eventState, null, 0);
      }
    }, 12000);
  }
}
