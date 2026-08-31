import { Player } from './Player.js';
import { WorldMap } from './WorldMap.js';
import { Interiors } from './Interiors.js';
import { TimeSystem } from './TimeSystem.js';
import { DiscoverySystem } from './DiscoverySystem.js';
import { QuestSystem } from './QuestSystem.js';
import { SaveSystem } from './SaveSystem.js';
import { InputManager } from './InputManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { soundManager } from './AudioSynth.js';

// Multiplayer & University RPG Subsystems
import { UniversityProgression } from '../multiplayer/UniversityProgression.js';
import { ClubSystem } from '../multiplayer/ClubSystem.js';
import { SocialSystem } from '../multiplayer/SocialSystem.js';
import { ChatSystem } from '../multiplayer/ChatSystem.js';
import { CampusEventSystem } from '../multiplayer/CampusEventSystem.js';
import { NetworkManager } from '../multiplayer/NetworkManager.js';

// Student Life Subsystems (University Simulator Integration)
import { StudentStats } from '../studentlife/StudentStats.js';
import { AcademicSystem } from '../studentlife/AcademicSystem.js';
import { ScheduleSystem } from '../studentlife/ScheduleSystem.js';
import { SocialFeedSystem } from '../studentlife/SocialFeedSystem.js';
import { SemesterSystem } from '../studentlife/SemesterSystem.js';
import { PhoneSystem } from '../studentlife/PhoneSystem.js';

import locationsData from '../data/locations.json';
import questsData from '../data/quests.json';
import quizQuestionsData from '../data/quizQuestions.json';
import npcsData from '../data/npcs.json';
import gameConfigData from '../data/gameConfig.json';

/**
 * Master Game Controller coordinating rendering, world physics, UI modals,
 * and Multiplayer University RPG subsystems.
 */
export class Game {
  constructor(canvas, uiManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.uiManager = uiManager;

    this.config = gameConfigData;
    this.locations = locationsData;
    this.quests = questsData;
    this.quizQuestions = quizQuestionsData;
    this.npcs = npcsData;

    // Subsystems
    this.input = new InputManager();
    this.particles = new ParticleSystem();
    this.timeSystem = new TimeSystem(this.config.time);
    this.interiors = new Interiors();
    this.saveSystem = new SaveSystem();

    // Multiplayer & RPG Subsystems
    this.progression = new UniversityProgression();
    this.clubSystem = new ClubSystem();
    this.socialSystem = new SocialSystem();
    this.chatSystem = new ChatSystem();
    this.eventSystem = new CampusEventSystem(this);

    // Student Life Subsystems
    this.studentStats = new StudentStats();
    this.academicSystem = new AcademicSystem();
    this.scheduleSystem = new ScheduleSystem();
    this.socialFeedSystem = new SocialFeedSystem();
    this.semesterSystem = new SemesterSystem();
    this.phoneSystem = new PhoneSystem(this);
    this.clubSystem = new ClubSystem();
    this.socialSystem = new SocialSystem();
    this.chatSystem = new ChatSystem();
    this.eventSystem = new CampusEventSystem(this);

    // Discovery & Quest Systems
    this.discoverySystem = new DiscoverySystem(this.locations, (loc, pts, totalScore) => {
      this.player.triggerExclamation();
      this.uiManager.showDiscoveryToast(loc, pts, totalScore);
      this.questSystem.onLocationVisited(loc.id);
      this.particles.createStarBurst(loc.x + loc.width / 2, loc.y + loc.height / 2);

      // RPG Progression
      this.progression.addXp(pts, `Discovered ${loc.shortName || loc.name}`);
      this.progression.addReputation(Math.floor(pts / 2), `Discovered ${loc.shortName || loc.name}`);
      this.progression.stats.discoveriesCount++;
      this.clubSystem.onLocationDiscovered(loc.id);
      this.eventSystem.checkTreasureLocation(loc.id);
      this.autoSave();
    });

    this.questSystem = new QuestSystem(this.quests, this.discoverySystem, (quest, pts, totalScore) => {
      this.uiManager.showQuestCompletedToast(quest, pts, totalScore);
      this.particles.createStarBurst(this.player.x, this.player.y);

      // RPG Progression
      this.progression.addXp(pts * 2, `Completed Quest: ${quest.title}`);
      this.progression.addReputation(pts, `Completed Quest: ${quest.title}`);
      this.progression.stats.questsCompleted++;
      this.autoSave();
    });

    // World Map (5 Sections Engine)
    this.worldMap = new WorldMap(this.locations, this.npcs);

    // Player Entity (Default Spawn at Admin Quad in Main Campus)
    const startX = 740;
    const startY = 320;
    this.player = new Player(startX, startY, this.config.player);

    // Network Manager (Initializes after player & subsystems are ready)
    this.networkManager = new NetworkManager(this);

    // GBA Camera Scale Factor (Authentic Handheld Zoom)
    this.zoom = 2.6;
    this.camera = {
      x: 0,
      y: 0,
      width: 440,
      height: 280
    };

    // State
    this.currentInterior = null;
    this.lastExteriorCoords = null;
    this.isPaused = false;
    this.isSleeping = false;
    this.isTransitioning = false;
    this.transitionFade = 0;
    this.lastSectorId = null;
    this.lastTime = performance.now();

    // Wire Progression Callbacks
    this.progression.onLevelUp = (lvl, title) => {
      soundManager.playLevelUp();
      this.uiManager.showLevelUpModal(lvl, title);
      this.particles.createStarBurst(this.player.x, this.player.y);
      this.chatSystem.addSystemMessage(`🎉 Congratulations! You reached Level ${lvl} (${title})!`);
      this.autoSave();
    };

    this.progression.onReputationGain = (pts, total, reason) => {
      soundManager.playReputationGain();
      this.uiManager.showToast(`⭐ +${pts} Reputation! (${reason || 'Campus Standing'})`, 'success');
      this.autoSave();
    };

    this.progression.onAchievementUnlock = (ach) => {
      soundManager.playDiscovery();
      this.uiManager.showAchievementToast(ach);
      this.chatSystem.addSystemMessage(`🏆 Achievement Unlocked: ${ach.name}!`);
      this.autoSave();
    };

    // Wire Club Callbacks
    this.clubSystem.onClubJoined = (club) => {
      soundManager.playMenuOpen();
      this.uiManager.showToast(`🏛️ Joined ${club.name}! Check your weekly missions.`, 'success');
      this.progression.unlockTitle(`${club.shortName} Member`);
      this.chatSystem.addSystemMessage(`🏛️ You are now a registered member of ${club.name}!`);
      this.autoSave();
    };

    this.clubSystem.onMissionCompleted = (m) => {
      soundManager.playLevelUp();
      this.progression.addXp(m.rewardXp, `Club Mission: ${m.title}`);
      this.progression.addReputation(m.rewardRep, `Club Mission: ${m.title}`);
      this.uiManager.showToast(`✅ Club Mission Complete: ${m.title}! (+${m.rewardXp} XP, +${m.rewardRep} Rep)`, 'success');
      this.autoSave();
    };

    this.clubSystem.onRankUp = (rank, club) => {
      soundManager.playLevelUp();
      this.uiManager.showToast(`🎖️ Promoted to ${rank} in ${club.shortName}!`, 'success');
      this.progression.unlockTitle(`${club.shortName} ${rank}`);
      this.autoSave();
    };

    // Wire Social Emote Callback
    this.socialSystem.onEmoteTriggered = (emote) => {
      soundManager.playEmoteSound();
      this.player.showEmote(emote);
      this.networkManager.broadcastEmote(emote);
    };

    // Wire Event System Callbacks
    this.eventSystem.onEventStateChanged = (state, event, timer, leaderboard) => {
      if (state === 'announcing') {
        soundManager.playEventStart();
        this.chatSystem.addSystemMessage(`📢 EVENT ALERT: ${event.title} begins in ${timer}s!`);
        this.uiManager.showEventBanner(event, timer);
      } else if (state === 'in_progress') {
        this.uiManager.showEventActiveUI(event, timer);
      } else if (state === 'completed') {
        this.uiManager.showEventResultsModal(event, leaderboard);
      }
    };

    // Wire Academic System Callbacks
    this.academicSystem.onClassAttended = (code, cgpa, attPct) => {
      soundManager.playLevelUp();
      this.progression.addXp(180, `Attended Class: ${code}`);
      this.studentStats.addMoney(150, 'Academic Stipend');
      this.uiManager.showToast(`📚 Attended ${code}! CGPA: ${cgpa} (${attPct}% Attended) +₹150 Stipend`, 'success');
      this.autoSave();
    };

    this.studentStats.onEnergyChanged = () => this.uiManager.updateHUD();
    this.studentStats.onMoneyChanged = () => this.uiManager.updateHUD();

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resizeCanvas(), 100));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => this.resizeCanvas());
    }

    // Try loading saved game
    const saved = this.saveSystem.loadGame();
    if (saved) {
      this.discoverySystem.loadState(saved.discovery);
      this.questSystem.loadState(saved.quests);
      if (saved.lastExteriorCoords) {
        this.lastExteriorCoords = saved.lastExteriorCoords;
      }
      if (saved.currentSection) {
        this.worldMap.setSection(saved.currentSection);
      }
      if (saved.player) {
        this.player.x = saved.player.x;
        this.player.y = saved.player.y;
        if (saved.player.currentInterior) {
          this.enterInterior(saved.player.currentInterior, null, false);
        }
      }
      if (saved.time) {
        this.timeSystem.hour = saved.time.hour;
        this.timeSystem.minute = saved.time.minute;
        this.timeSystem.day = saved.time.day;
      }
      if (saved.progression) this.progression.deserialize(saved.progression);
      if (saved.clubs) this.clubSystem.deserialize(saved.clubs);
      if (saved.social) this.socialSystem.deserialize(saved.social);
      if (saved.studentStats) this.studentStats.deserialize(saved.studentStats);
      if (saved.academic) this.academicSystem.deserialize(saved.academic);
      if (saved.semester) this.semesterSystem.deserialize(saved.semester);
    } else {
      this.discoverySystem.discoverLocation(36); // Admin Building (#36)
    }

    // Safe spawn check: If player spawned inside any collider, rescue to safe road
    this.verifyAndFixSafeSpawn();

    // Connect UI
    this.uiManager.setGame(this);
    this.uiManager.updateHUD();

    // Start Game Loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  resizeCanvas() {
    const isMobile = window.innerWidth < 768;
    const desiredVirtualWidth = isMobile ? 300 : 440;
    this.zoom = Math.max(1.2, Math.min(3.2, window.innerWidth / desiredVirtualWidth));

    const w = window.visualViewport ? window.visualViewport.width : (window.innerWidth || document.documentElement.clientWidth);
    const h = window.visualViewport ? window.visualViewport.height : (window.innerHeight || document.documentElement.clientHeight);
    this.canvas.width = Math.round(w);
    this.canvas.height = Math.round(h);

    this.camera.width = Math.round(w / this.zoom);
    this.camera.height = Math.round(h / this.zoom);
  }

  gameLoop(currentTime) {
    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (!this.isPaused && !this.isSleeping) {
      this.update(delta);
    }

    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(delta) {
    // 1. Time System
    this.timeSystem.update(delta);

    // 2. Audio Ambience
    this.updateAudioAmbience();

    // 3. Collision Checker
    const collisionChecker = (bounds) => {
      if (this.currentInterior) {
        return this.interiors.checkInteriorCollision(this.currentInterior, bounds);
      } else {
        return this.worldMap.checkCollision(bounds);
      }
    };

    // 4. Player Physics & Movement (Paused during transition)
    if (!this.isTransitioning) {
      this.player.update(
        delta,
        this.input,
        collisionChecker,
        this.particles,
        (x, y) => this.currentInterior ? 1.0 : this.worldMap.getSurfaceModifier(x, y)
      );
    }

    // 5. Update Student Life & Multiplayer Engines
    this.studentStats.update(delta, this.player.isSprinting, this.timeSystem);
    this.socialSystem.update(delta);
    this.eventSystem.update(delta);
    this.networkManager.update(delta);

    // 6. Check Sprint Race Checkpoints
    if (!this.currentInterior && this.eventSystem.activeEvent?.type === 'sprint') {
      this.eventSystem.checkRaceCheckpoint(this.player.x, this.player.y, this.worldMap.currentSection);
    }

    // 7. Update Wildlife
    if (!this.currentInterior) {
      this.worldMap.updateWildlife(delta);
    }

    // 8. Camera Follow (Smooth Centering on Player)
    if (!this.currentInterior) {
      const targetCamX = this.player.x + this.player.width / 2 - this.camera.width / 2;
      const targetCamY = this.player.y + this.player.height / 2 - this.camera.height / 2 - (this.player.z || 0) * 0.3;

      this.camera.x += (targetCamX - this.camera.x) * 0.15;
      this.camera.y += (targetCamY - this.camera.y) * 0.15;

      this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldMap.width - this.camera.width));
      this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldMap.height - this.camera.height));
    }

    // 9. Check Checkpoint Gate Collisions (Section Transitions)
    if (!this.currentInterior && !this.isTransitioning) {
      const cp = this.worldMap.checkCheckpointCollision(this.player.getBounds());
      if (cp) {
        this.transitionToSection(cp.targetSection, cp.targetX, cp.targetY, cp.targetDirection, cp.name);
      }
    }

    // 10. Check Proximity & Interactions
    this.checkInteractions();

    // 11. Automatic Discovery
    if (!this.currentInterior) {
      this.checkAutomaticDiscoveries();
    }

    // 12. Particles
    this.particles.createAmbientNature(this.camera, this.timeSystem.ambientMode);
    this.particles.update(delta);

    // 13. Menu Keys
    if (this.input.consumePhone()) this.uiManager.showPhoneModal();
    if (this.input.consumeProfile()) this.uiManager.showStudentProfile();
    if (this.input.consumeClubs()) this.uiManager.showClubModal();
    if (this.input.consumeSocial()) this.uiManager.showSocialModal();
    if (this.input.consumeEmote()) this.uiManager.toggleEmoteBar();
    if (this.input.consumeMap()) this.uiManager.toggleCampusMap();
    if (this.input.consumeBook()) this.uiManager.toggleDiscoveryBook();
    if (this.input.consumeQuest()) this.uiManager.toggleQuestsModal();
    if (this.input.consumePause()) this.uiManager.toggleSettings();
    if (this.input.consumeUnstuck()) this.respawnOnSafeRoad();

    // 14. Update HUD
    this.uiManager.updateHUD();
  }

  transitionToSection(targetSection, targetX, targetY, targetDirection = 'down', checkpointName = '') {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    soundManager.playDoorTransition();

    const fadeDuration = 250; // ms
    const startTime = performance.now();

    const performSwitch = () => {
      this.worldMap.setSection(targetSection);
      this.player.x = targetX;
      this.player.y = targetY;
      this.player.direction = targetDirection;

      this.camera.x = Math.max(0, Math.min(this.player.x - this.camera.width / 2, this.worldMap.width - this.camera.width));
      this.camera.y = Math.max(0, Math.min(this.player.y - this.camera.height / 2, this.worldMap.height - this.camera.height));

      this.uiManager.showZoneBanner(this.worldMap.getCurrentSector(this.player.x, this.player.y));
      this.autoSave();

      // Fade in
      const fadeInStart = performance.now();
      const fadeInStep = () => {
        const elapsed = performance.now() - fadeInStart;
        this.transitionFade = Math.max(0, 1 - (elapsed / fadeDuration));
        if (this.transitionFade > 0) {
          requestAnimationFrame(fadeInStep);
        } else {
          this.isTransitioning = false;
        }
      };
      requestAnimationFrame(fadeInStep);
    };

    // Fade out
    const fadeOutStep = () => {
      const elapsed = performance.now() - startTime;
      this.transitionFade = Math.min(1, elapsed / fadeDuration);
      if (this.transitionFade < 1) {
        requestAnimationFrame(fadeOutStep);
      } else {
        performSwitch();
      }
    };
    requestAnimationFrame(fadeOutStep);
  }

  fastTravelTo(locationId) {
    const loc = this.locations.find(l => l.id === locationId);
    if (!loc) {
      console.warn(`Location #${locationId} not found for fast travel.`);
      return false;
    }

    soundManager.playDoorTransition();

    // 1. If inside an interior, exit back to exterior first
    if (this.currentInterior) {
      this.exitInterior();
    }

    // 2. Target section & spawn coordinates
    const targetSection = loc.section || 'main';
    const spawnX = Math.round(loc.x + loc.width / 2 - this.player.width / 2);
    const spawnY = Math.round(loc.y + loc.height + 24);

    // 3. Switch section if different
    if (this.worldMap.currentSection !== targetSection) {
      this.worldMap.setSection(targetSection);
    }

    // 4. Set player position
    this.player.x = Math.max(20, Math.min(spawnX, this.worldMap.width - 40));
    this.player.y = Math.max(20, Math.min(spawnY, this.worldMap.height - 40));
    this.player.direction = 'down';

    // 5. Update camera
    this.camera.x = Math.max(0, Math.min(this.player.x + this.player.width / 2 - this.camera.width / 2, this.worldMap.width - this.camera.width));
    this.camera.y = Math.max(0, Math.min(this.player.y + this.player.height / 2 - this.camera.height / 2, this.worldMap.height - this.camera.height));

    // 6. Discover location if undiscovered
    this.discoverySystem.discoverLocation(loc.id);

    // 7. Inform user
    this.uiManager.showToast(`🚀 Fast traveled to #${loc.id} ${loc.shortName || loc.name}!`, 'success');
    this.autoSave();

    return true;
  }

  updateAudioAmbience() {
    if (this.currentInterior) {
      soundManager.setAmbientMode(this.currentInterior.ambientAudio || 'office');
    } else if (this.timeSystem.isSouthPartyActive() && this.worldMap.currentSection === 'south') {
      soundManager.setAmbientMode('party');
    } else if (this.isNearAnyLake(160)) {
      soundManager.setAmbientMode('lake');
    } else if (this.timeSystem.ambientMode === 'night') {
      soundManager.setAmbientMode('night');
    } else {
      soundManager.setAmbientMode('day');
    }
  }

  isNearLocation(locationId, radius = 100) {
    const loc = this.locations.find(l => l.id === locationId);
    if (!loc || loc.section !== this.worldMap.currentSection) return false;
    const cx = loc.x + loc.width / 2;
    const cy = loc.y + loc.height / 2;
    const dx = this.player.x - cx;
    const dy = this.player.y - cy;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  }

  isNearAnyLake(radius = 160) {
    for (const lake of this.worldMap.waterBodies) {
      const dx = this.player.x - lake.x;
      const dy = this.player.y - lake.y;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return true;
      }
    }
    return false;
  }

  checkAutomaticDiscoveries() {
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;

    for (const loc of this.worldMap.locations) {
      if (this.discoverySystem.isDiscovered(loc.id)) continue;

      const cx = loc.x + loc.width / 2;
      const cy = loc.y + loc.height / 2;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const discoveryRadius = Math.max(loc.width, loc.height) / 2 + 50;
      if (dist <= discoveryRadius) {
        this.discoverySystem.discoverLocation(loc.id);
      }
    }
  }

  checkInteractions() {
    let interactable = null;

    if (this.currentInterior) {
      interactable = this.interiors.getInteriorInteractableAt(this.currentInterior, this.player.x, this.player.y);
    } else {
      interactable = this.worldMap.getInteractableAt(this.player.x, this.player.y);
    }

    // Check Nearby Online / Simulated Students if not interacting with building/door
    if (!interactable || interactable.type === 'info') {
      const nearbyStudent = this.networkManager.getNearbyStudent(
        this.player.x,
        this.player.y,
        45,
        this.worldMap.currentSection,
        this.currentInterior ? this.player.currentInterior : null
      );

      if (nearbyStudent) {
        interactable = {
          type: 'student',
          data: nearbyStudent
        };
      }
    }

    this.player.nearbyInteractable = interactable;

    if (this.input.consumeInteract()) {
      soundManager.ensureContext();
      if (interactable) {
        this.handleInteraction(interactable);
      }
    }
  }

  handleInteraction(interactable) {
    soundManager.playInteract();

    // 1. Student Interaction Card
    if (interactable.type === 'student') {
      const student = interactable.data;
      this.uiManager.showStudentInteractionModal(student, {
        onTalk: () => {
          this.uiManager.showStudentDialogue(student);
        },
        onViewProfile: () => {
          this.uiManager.showStudentProfile(student);
        },
        onAddFriend: () => {
          this.socialSystem.addFriend(student);
          this.uiManager.showToast(`👥 Added ${student.name} to your friends list!`, 'success');
          this.progression.addReputation(25, `Made friend with ${student.name}`);
        },
        onInviteParty: () => {
          if (!this.socialSystem.party.inParty) {
            this.socialSystem.createParty(this.progression.getProfileSummary());
          }
          this.socialSystem.inviteToParty(student);
          this.uiManager.showToast(`🤝 Invited ${student.name} to your Party!`, 'success');
        },
        onChallenge: () => {
          this.eventSystem.startRandomEvent();
        }
      });
      return;
    }

    // 2. NPC Interaction
    if (interactable.type === 'npc' || interactable.type === 'interior_npc') {
      this.uiManager.showNPCDialog(interactable.data);
      return;
    }

    // 3. Bed Sleep & Save
    if (interactable.type === 'bed') {
      this.triggerSleepSequence();
      return;
    }

    // 4. Quiz Trigger
    if (interactable.type === 'quiz') {
      const quizSet = this.quizQuestions[interactable.quizKey];
      if (quizSet) {
        this.uiManager.showQuizModal(quizSet, (score, passed) => {
          if (passed) {
            this.discoverySystem.addDirectScore(100, 'Passed Classroom Quiz');
            this.questSystem.onActionCompleted('quiz_passed');
            this.progression.addXp(150, 'Classroom Quiz Passed');
            this.progression.addReputation(50, 'Academic Excellence');
            this.autoSave();
          }
        });
      }
      return;
    }

    // 5. Notice Board Reader
    if (interactable.type === 'notice_board') {
      this.uiManager.showNoticeBoard(interactable.data);
      return;
    }

    // 6. Readable Books & Lore
    if (interactable.type === 'book') {
      this.uiManager.showBookModal(interactable.data);
      return;
    }

    // 7. Canteen Menus
    if (interactable.type === 'menu') {
      this.uiManager.showCanteenMenuModal(interactable.data);
      return;
    }

    // 8. Scientific Equipment & Whiteboard Inspections
    if (interactable.type === 'examine') {
      this.uiManager.showExamineModal(interactable.data);
      return;
    }

    // 9. Exit Doorway
    if (interactable.type === 'exit_door') {
      this.exitInterior(interactable.exitX, interactable.exitY, interactable.section);
      return;
    }

    // 10. Building Entrances & Points of Interest
    if (interactable.type === 'location') {
      const loc = interactable.data;

      if (loc.hasInterior && loc.interiorType) {
        // Opening Hours Verification
        if (loc.openingHours && (loc.openingHours.open !== 0 || loc.openingHours.close !== 24)) {
          const curHour = this.timeSystem.hour;
          const isOpen = curHour >= loc.openingHours.open && curHour < loc.openingHours.close;
          if (!isOpen) {
            this.uiManager.showToast(`🔒 ${loc.shortName || loc.name} is CLOSED. (Hours: ${loc.openingHours.label})`, 'info');
            return;
          }
        }
        this.enterInterior(loc.interiorType, loc);
        return;
      }

      if (loc.isNightCanteen && this.timeSystem.isNightCanteenOpen()) {
        this.uiManager.showNightCanteenModal((item) => {
          this.discoverySystem.addDirectScore(item.points || 40, `Canteen: ${item.name}`);
          this.questSystem.onActionCompleted('night_canteen_visited');
          this.progression.addXp(60, `Canteen Treat: ${item.name}`);
          this.autoSave();
        });
        return;
      }

      this.uiManager.showLocationInfo(loc);
    }
  }

  enterInterior(interiorType, locData = null, animate = true) {
    const interior = this.interiors.getInterior(interiorType);
    if (!interior) return;

    // Save exact exterior coordinates and section before entering
    this.lastExteriorCoords = {
      x: this.player.x,
      y: this.player.y + 16,
      section: this.worldMap.currentSection
    };

    if (animate) {
      soundManager.playDoorTransition();
    }

    this.currentInterior = interior;
    this.player.currentInterior = interiorType;
    this.player.x = interior.spawnX;
    this.player.y = interior.spawnY;

    // Update Building-Specific Audio Ambience
    soundManager.setAmbientMode(interior.ambientAudio || 'office');

    // Show brief entrance banner
    this.uiManager.showBuildingEntryBanner(interior.name, interior.floorLabel);

    // Auto-discover location and advance quests
    const targetLocId = interior.locationId || (locData ? locData.id : null);
    if (targetLocId) {
      this.discoverySystem.discoverLocation(targetLocId);
      this.questSystem.onLocationVisited(targetLocId);
    }

    this.autoSave();
  }

  exitInterior(exitX, exitY, targetSection = null) {
    soundManager.playDoorTransition();
    this.currentInterior = null;
    this.player.currentInterior = null;

    // Return to exact outside entrance memory
    if (this.lastExteriorCoords) {
      this.worldMap.setSection(this.lastExteriorCoords.section);
      this.player.x = this.lastExteriorCoords.x;
      this.player.y = this.lastExteriorCoords.y;
    } else {
      if (targetSection) {
        this.worldMap.setSection(targetSection);
      } else {
        this.worldMap.setSection('main');
      }
      this.player.x = exitX || 740;
      this.player.y = exitY || 320;
    }

    // Camera follow smoothly
    this.camera.x = Math.max(0, Math.min(this.player.x - this.camera.width / 2, this.worldMap.width - this.camera.width));
    this.camera.y = Math.max(0, Math.min(this.player.y - this.camera.height / 2, this.worldMap.height - this.camera.height));

    // Restore outdoor ambience
    this.updateAudioAmbience();
    this.autoSave();
  }

  triggerSleepSequence() {
    this.isSleeping = true;
    soundManager.playSleepWake();

    this.uiManager.showSleepTransition(() => {
      this.timeSystem.sleepUntilMorning();
      this.player.stamina = this.player.maxStamina;
      this.isSleeping = false;
      this.autoSave();
      this.uiManager.showToast('🌅 Good Morning! You feel refreshed and stamina is fully restored. Progress saved.', 'success');
    });
  }

  verifyAndFixSafeSpawn() {
    const isStuck = this.currentInterior
      ? this.interiors.checkInteriorCollision(this.currentInterior, this.player.getBounds())
      : this.worldMap.checkCollision(this.player.getBounds());

    if (isStuck) {
      this.respawnOnSafeRoad();
    }
  }

  respawnOnSafeRoad(targetSection = null) {
    if (this.currentInterior) {
      this.currentInterior = null;
      this.player.currentInterior = null;
    }

    if (targetSection) {
      this.worldMap.setSection(targetSection);
    }

    const safeSpawns = {
      main: { x: 700, y: 300, dir: 'down' },
      south: { x: 950, y: 1200, dir: 'down' },
      west: { x: 550, y: 350, dir: 'down' },
      east: { x: 280, y: 510, dir: 'down' },
      amphi_valley: { x: 820, y: 620, dir: 'down' },
      checkdam_buffer: { x: 600, y: 360, dir: 'down' }
    };

    const sp = safeSpawns[this.worldMap.currentSection] || safeSpawns.main;
    this.player.x = sp.x;
    this.player.y = sp.y;
    this.player.direction = sp.dir;
    this.isTransitioning = false;
    this.transitionFade = 0;

    this.camera.x = Math.max(0, Math.min(this.player.x - this.camera.width / 2, this.worldMap.width - this.camera.width));
    this.camera.y = Math.max(0, Math.min(this.player.y - this.camera.height / 2, this.worldMap.height - this.camera.height));

    this.uiManager.showToast('🧭 Position reset to open campus road!', 'info');
    this.autoSave();
  }

  fastTravelTo(locationId) {
    const loc = this.locations.find(l => l.id === locationId);
    if (!loc) return;

    if (this.currentInterior) {
      this.currentInterior = null;
      this.player.currentInterior = null;
    }

    if (loc.section && loc.section !== this.worldMap.currentSection) {
      this.worldMap.setSection(loc.section);
    }

    this.isTransitioning = false;
    this.transitionFade = 0;

    if (loc.isLake || loc.isMajorWonder) {
      this.player.x = loc.x - this.player.width / 2;
      this.player.y = loc.y + (loc.radiusY || loc.height || 40) + 25;
    } else {
      this.player.x = loc.x + loc.width / 2 - this.player.width / 2;
      this.player.y = loc.y + loc.height + 30;
    }

    this.camera.x = Math.max(0, Math.min(this.player.x - this.camera.width / 2, this.worldMap.width - this.camera.width));
    this.camera.y = Math.max(0, Math.min(this.player.y - this.camera.height / 2, this.worldMap.height - this.camera.height));

    soundManager.playDoorTransition();
    this.uiManager.showZoneBanner(this.worldMap.getCurrentSector(this.player.x, this.player.y));
    this.uiManager.showToast(`🚀 Fast traveled to ${loc.shortName || loc.name} (${loc.section.toUpperCase()})!`, 'info');
    this.autoSave();
  }

  autoSave() {
    this.saveSystem.saveGame({
      currentSection: this.worldMap.currentSection,
      lastExteriorCoords: this.lastExteriorCoords,
      player: this.player,
      timeSystem: this.timeSystem,
      discoverySystem: this.discoverySystem,
      questSystem: this.questSystem,
      progression: this.progression,
      clubSystem: this.clubSystem,
      socialSystem: this.socialSystem
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Apply GBA Handheld Camera Scaling
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.imageSmoothingEnabled = false;

    // Get Active Remote Students in Current Scope
    const scopePlayers = this.networkManager.getPlayersInCurrentScope(
      this.worldMap.currentSection,
      this.currentInterior ? this.player.currentInterior : null
    );

    if (this.currentInterior) {
      this.interiors.drawInterior(this.ctx, this.currentInterior, this.player, this.camera, this.timeSystem, scopePlayers);
    } else {
      // 2.5D Unified Depth Render Engine (Handles Shadows, Z-Sorting, Occlusion, Remote Players)
      this.worldMap.draw(this.ctx, this.camera, this.timeSystem, this.particles, this.player, scopePlayers);

      if (this.timeSystem.ambientLightColor !== 'rgba(0, 0, 0, 0)') {
        this.ctx.fillStyle = this.timeSystem.ambientLightColor;
        this.ctx.fillRect(0, 0, this.camera.width, this.camera.height);
      }
    }

    // Screen Fade Effect for Section Checkpoint Transitions
    if (this.transitionFade > 0) {
      this.ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionFade})`;
      this.ctx.fillRect(0, 0, this.camera.width, this.camera.height);
    }

    this.ctx.restore();
  }
}
