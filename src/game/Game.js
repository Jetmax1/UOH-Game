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

import locationsData from '../data/locations.json';
import questsData from '../data/quests.json';
import quizQuestionsData from '../data/quizQuestions.json';
import npcsData from '../data/npcs.json';
import gameConfigData from '../data/gameConfig.json';

/**
 * Master Game Controller coordinating rendering, world physics, UI modals, and events.
 * Features Pokémon FireRed GBA camera scaling (2.6x–3.2x zoom), 4 spacious sections,
 * and checkpoint gate transitions.
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

    // Discovery & Quest Systems
    this.discoverySystem = new DiscoverySystem(this.locations, (loc, pts, totalScore) => {
      this.player.triggerExclamation();
      this.uiManager.showDiscoveryToast(loc, pts, totalScore);
      this.questSystem.onLocationVisited(loc.id);
      this.particles.createStarBurst(loc.x + loc.width / 2, loc.y + loc.height / 2);
      this.autoSave();
    });

    this.questSystem = new QuestSystem(this.quests, this.discoverySystem, (quest, pts, totalScore) => {
      this.uiManager.showQuestCompletedToast(quest, pts, totalScore);
      this.particles.createStarBurst(this.player.x, this.player.y);
      this.autoSave();
    });

    // World Map (4 Sections Engine)
    this.worldMap = new WorldMap(this.locations, this.npcs);

    // Player Entity (Default Spawn at Admin Quad in Main Campus)
    const startX = 740;
    const startY = 320;
    this.player = new Player(startX, startY, this.config.player);

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
    this.isPaused = false;
    this.isSleeping = false;
    this.isTransitioning = false;
    this.transitionFade = 0;
    this.lastSectorId = null;
    this.lastTime = performance.now();

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Try loading saved game
    const saved = this.saveSystem.loadGame();
    if (saved) {
      this.discoverySystem.loadState(saved.discovery);
      this.questSystem.loadState(saved.quests);
      if (saved.currentSection) {
        this.worldMap.setSection(saved.currentSection);
      }
      if (saved.player) {
        this.player.x = saved.player.x;
        this.player.y = saved.player.y;
        if (saved.player.currentInterior) {
          this.enterInterior(saved.player.currentInterior, false);
        }
      }
      if (saved.time) {
        this.timeSystem.hour = saved.time.hour;
        this.timeSystem.minute = saved.time.minute;
        this.timeSystem.day = saved.time.day;
      }
    } else {
      this.discoverySystem.discoverLocation(36); // Admin Building (#36)
    }

    // Safe spawn check: If player spawned inside any collider (e.g. from old saved coordinates), rescue to safe road
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

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.camera.width = Math.round(window.innerWidth / this.zoom);
    this.camera.height = Math.round(window.innerHeight / this.zoom);
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

    // 5. Update Wildlife
    if (!this.currentInterior) {
      this.worldMap.updateWildlife(delta);
    }

    // 6. Camera Follow (Smooth Centering on Player)
    if (!this.currentInterior) {
      const targetCamX = this.player.x + this.player.width / 2 - this.camera.width / 2;
      const targetCamY = this.player.y + this.player.height / 2 - this.camera.height / 2;

      this.camera.x += (targetCamX - this.camera.x) * 0.15;
      this.camera.y += (targetCamY - this.camera.y) * 0.15;

      this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldMap.width - this.camera.width));
      this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldMap.height - this.camera.height));
    }

    // 7. Check Checkpoint Gate Collisions (Section Transitions)
    if (!this.currentInterior && !this.isTransitioning) {
      const cp = this.worldMap.checkCheckpointCollision(this.player.getBounds());
      if (cp) {
        this.transitionToSection(cp.targetSection, cp.targetX, cp.targetY, cp.targetDirection, cp.name);
      }
    }

    // 8. Check Proximity & Interactions
    this.checkInteractions();

    // 9. Automatic Discovery
    if (!this.currentInterior) {
      this.checkAutomaticDiscoveries();
    }

    // 10. Particles
    this.particles.createAmbientNature(this.camera, this.timeSystem.ambientMode);
    this.particles.update(delta);

    // 11. Menu Keys
    if (this.input.consumeMap()) this.uiManager.toggleCampusMap();
    if (this.input.consumeBook()) this.uiManager.toggleDiscoveryBook();
    if (this.input.consumeQuest()) this.uiManager.toggleQuestsModal();
    if (this.input.consumePause()) this.uiManager.toggleSettings();
    if (this.input.consumeUnstuck()) this.respawnOnSafeRoad();

    // 12. Update HUD
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
      this.camera.x = Math.max(0, Math.min(targetX - this.camera.width / 2, this.worldMap.width - this.camera.width));
      this.camera.y = Math.max(0, Math.min(targetY - this.camera.height / 2, this.worldMap.height - this.camera.height));

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

  updateAudioAmbience() {
    if (this.timeSystem.isSouthPartyActive() && !this.currentInterior && this.worldMap.currentSection === 'south') {
      soundManager.setAmbientMode('party');
    } else if (this.isNearAnyLake(160) && !this.currentInterior) {
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

    if (interactable.type === 'npc' || interactable.type === 'interior_npc') {
      this.uiManager.showNPCDialog(interactable.data);
      return;
    }

    if (interactable.type === 'bed') {
      this.triggerSleepSequence();
      return;
    }

    if (interactable.type === 'quiz') {
      const quizSet = this.quizQuestions[interactable.quizKey];
      if (quizSet) {
        this.uiManager.showQuizModal(quizSet, (score, passed) => {
          if (passed) {
            this.discoverySystem.addDirectScore(100, 'Passed Classroom Quiz');
            this.questSystem.onActionCompleted('quiz_passed');
            this.autoSave();
          }
        });
      }
      return;
    }

    if (interactable.type === 'exit_door') {
      this.exitInterior(interactable.exitX, interactable.exitY);
      return;
    }

    if (interactable.type === 'location') {
      const loc = interactable.data;

      if (loc.isNightCanteen && this.timeSystem.isNightCanteenOpen()) {
        this.uiManager.showNightCanteenModal((item) => {
          this.discoverySystem.addDirectScore(item.points || 40, `Canteen: ${item.name}`);
          this.questSystem.onActionCompleted('night_canteen_visited');
          this.autoSave();
        });
        return;
      }

      if (loc.hasInterior && loc.interiorType) {
        this.enterInterior(loc.interiorType);
        return;
      }

      this.uiManager.showLocationInfo(loc);
    }
  }

  enterInterior(interiorType, animate = true) {
    const interior = this.interiors.getInterior(interiorType);
    if (!interior) return;

    soundManager.playDoorTransition();
    this.currentInterior = interior;
    this.player.currentInterior = interiorType;
    this.player.x = interior.spawnX;
    this.player.y = interior.spawnY;

    const locMap = {
      'library': 51,
      'cs_dept': 45,
      'sls_dept': 3,
      'hostel_mhk': 13,
      'mhk_hostel': 13,
      'sukoon_canteen': 59
    };
    if (locMap[interiorType]) {
      this.discoverySystem.discoverLocation(locMap[interiorType]);
      this.questSystem.onLocationVisited(locMap[interiorType]);
    }

    this.autoSave();
  }

  exitInterior(exitX, exitY) {
    soundManager.playDoorTransition();
    const prevInterior = this.player.currentInterior;
    this.currentInterior = null;
    this.player.currentInterior = null;

    if (prevInterior === 'sls_dept' || prevInterior === 'hostel_mhk' || prevInterior === 'mhk_hostel') {
      this.worldMap.setSection('south');
    } else if (prevInterior === 'sukoon_canteen' || prevInterior === 'library' || prevInterior === 'cs_dept') {
      this.worldMap.setSection('east');
    } else {
      this.worldMap.setSection('main');
    }

    this.player.x = exitX || 740;
    this.player.y = exitY || 320;
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
      console.log('Detected player inside collider on initialization. Rescuing to safe road...');
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
      player: this.player,
      timeSystem: this.timeSystem,
      discoverySystem: this.discoverySystem,
      questSystem: this.questSystem
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Apply GBA Handheld Camera Scaling
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.imageSmoothingEnabled = false;

    if (this.currentInterior) {
      this.interiors.drawInterior(this.ctx, this.currentInterior, this.player, this.camera);
    } else {
      this.worldMap.draw(this.ctx, this.camera, this.timeSystem, this.particles);
      this.player.draw(this.ctx, this.camera);
      this.particles.draw(this.ctx, this.camera);

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
