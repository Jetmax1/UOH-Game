import { soundManager } from '../game/AudioSynth.js';
import { pixelEngine } from '../game/PixelArtEngine.js';
import { DiscoveryBookUI } from './DiscoveryBookUI.js';
import { CampusMapUI } from './CampusMapUI.js';
import { QuizUI } from './QuizUI.js';
import { NightActivitiesUI } from './NightActivitiesUI.js';
import { DialogUI } from './DialogUI.js';
import { SettingsUI } from './SettingsUI.js';

/**
 * Master UI Manager coordinating Preloader, Play Screen, HUD, Minimap, Toasts, and Modals
 * Matching the retro NES pixel art aesthetic of peteroravec.com
 */
export class UIManager {
  constructor() {
    this.game = null;

    // Sub-UIs
    this.discoveryBookUI = new DiscoveryBookUI(this);
    this.campusMapUI = new CampusMapUI(this);
    this.quizUI = new QuizUI(this);
    this.nightActivitiesUI = new NightActivitiesUI(this);
    this.dialogUI = new DialogUI(this);
    this.settingsUI = new SettingsUI(this);

    this.activeModal = null;
    this.isGameStarted = false;
    this.crtEnabled = false;

    this.initPreloader();
  }

  setGame(game) {
    this.game = game;
    this.bindHUDButtons();
    this.initMinimap();
  }

  initPreloader() {
    const initLoad = document.getElementById('init-load');
    if (initLoad) initLoad.style.display = 'none';

    const bar = document.getElementById('preloader-bar');
    const text = document.getElementById('preloader-text');
    const mascotCanvas = document.getElementById('preloader-mascot');
    const playScreen = document.getElementById('play-screen');
    const preloaderWrap = document.querySelector('.progress-percentage');
    const preloaderCover = document.querySelector('.progress-percentage-cover');

    let mascotCtx = null;
    if (mascotCanvas) mascotCtx = mascotCanvas.getContext('2d');

    // Mascot animation frame loop
    let mascotFrame = 0;
    const mascotTimer = setInterval(() => {
      if (mascotCtx) {
        mascotCtx.clearRect(0, 0, 64, 64);
        const sprite = pixelEngine.getMascotSprite(mascotFrame);
        mascotCtx.imageSmoothingEnabled = false;
        mascotCtx.drawImage(sprite, 0, 0, 32, 32, 0, 0, 64, 64);
      }
      mascotFrame++;
    }, 200);

    // Progress bar simulation (0% to 100%)
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 8;
      if (progress > 100) progress = 100;

      if (bar) bar.style.width = `${progress}%`;
      if (text) text.textContent = `${progress}%`;

      if (progress >= 100) {
        clearInterval(loadInterval);
        clearInterval(mascotTimer);

        setTimeout(() => {
          if (preloaderWrap) preloaderWrap.style.opacity = '0';
          if (preloaderCover) preloaderCover.style.opacity = '0';
          setTimeout(() => {
            if (preloaderWrap) preloaderWrap.classList.add('hidden');
            if (preloaderCover) preloaderCover.classList.add('hidden');
          }, 400);
        }, 300);
      }
    }, 100);

    // Start Button
    document.getElementById('btn-start-play')?.addEventListener('click', () => {
      this.startGame();
    });

    // Quick Jump Buttons on Play Screen (peteroravec.com style)
    document.getElementById('quick-btn-map')?.addEventListener('click', () => {
      this.startGame(() => this.toggleCampusMap());
    });
    document.getElementById('quick-btn-tech')?.addEventListener('click', () => {
      this.startGame(() => this.showTechModal());
    });
    document.getElementById('quick-btn-about')?.addEventListener('click', () => {
      this.startGame(() => this.showAboutModal());
    });
    document.getElementById('quick-btn-quests')?.addEventListener('click', () => {
      this.startGame(() => this.toggleQuestsModal());
    });
  }

  startGame(callback = null) {
    if (this.isGameStarted) {
      if (callback) callback();
      return;
    }

    this.isGameStarted = true;
    soundManager.ensureContext();
    soundManager.playDoorTransition();

    const playScreen = document.getElementById('play-screen');
    if (playScreen) {
      playScreen.classList.add('fade-out');
      setTimeout(() => playScreen.classList.add('hidden'), 500);
    }

    setTimeout(() => {
      this.showToast('🎓 Welcome to University of Hyderabad! WASD to move, E to interact.', 'info');
      if (callback) callback();
    }, 400);
  }

  bindHUDButtons() {
    // Top Bar Buttons
    document.getElementById('btn-map')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.toggleCampusMap();
    });
    document.getElementById('btn-book')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.toggleDiscoveryBook();
    });
    document.getElementById('btn-tech-hud')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.showTechModal();
    });
    document.getElementById('btn-about-hud')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.showAboutModal();
    });
    document.getElementById('btn-hud-unstuck')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      if (this.game) this.game.respawnOnSafeRoad();
    });
    document.getElementById('btn-sound')?.addEventListener('click', () => {
      const enabled = soundManager.toggleSound();
      const icon = document.getElementById('sound-icon');
      if (icon) icon.textContent = enabled ? '🔊' : '🔇';
    });
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.toggleSettings();
    });

    // Setup Mobile Touch Controls
    const dpad = document.getElementById('mobile-dpad');
    const interactBtn = document.getElementById('btn-mobile-interact');
    const sprintBtn = document.getElementById('btn-mobile-sprint');
    if (this.game && dpad) {
      this.game.input.setupMobileTouchControls(dpad, interactBtn, sprintBtn);
    }
  }

  initMinimap() {
    this.minimapCanvas = document.getElementById('minimap-canvas');
    if (this.minimapCanvas) {
      this.minimapCtx = this.minimapCanvas.getContext('2d');
    }
  }

  updateHUD() {
    if (!this.game) return;

    // 1. Score
    const scoreEl = document.getElementById('hud-score');
    if (scoreEl) scoreEl.textContent = this.game.discoverySystem.score.toLocaleString();

    // 2. Clock & Time Period
    const timeEl = document.getElementById('hud-time');
    const periodEl = document.getElementById('hud-period');
    const timeIconEl = document.getElementById('hud-time-icon');
    if (timeEl) timeEl.textContent = this.game.timeSystem.getFormattedTime();
    if (periodEl) periodEl.textContent = `Day ${this.game.timeSystem.day} · ${this.game.timeSystem.getTimePeriodName()}`;
    if (timeIconEl) {
      const mode = this.game.timeSystem.ambientMode;
      timeIconEl.textContent = mode === 'night' ? '🌙' : (mode === 'evening' ? '🌇' : '☀️');
    }

    // 3. Active Quest Objective Ticker
    const questObj = this.game.questSystem.getCurrentPrimaryObjective();
    const questTitleEl = document.getElementById('hud-quest-title');
    const questTextEl = document.getElementById('hud-quest-text');
    const questProgEl = document.getElementById('hud-quest-prog');
    if (questTitleEl) questTitleEl.textContent = questObj.title;
    if (questTextEl) questTextEl.textContent = questObj.text;
    if (questProgEl) questProgEl.textContent = questObj.progress ? `[${questObj.progress}]` : '';

    // 4. Stamina Bar
    const staminaFill = document.getElementById('stamina-fill');
    if (staminaFill) {
      const pct = (this.game.player.stamina / this.game.player.maxStamina) * 100;
      staminaFill.style.width = `${pct}%`;
    }

    // 5. Render Minimap
    this.renderMinimap();
  }

  renderMinimap() {
    if (!this.minimapCtx || !this.game || this.game.currentInterior) return;

    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    const mapW = this.game.worldMap.width;
    const mapH = this.game.worldMap.height;

    ctx.clearRect(0, 0, w, h);

    // Background terrain
    ctx.fillStyle = '#1e3a1e';
    ctx.fillRect(0, 0, w, h);

    // Scale ratios
    const sx = w / mapW;
    const sy = h / mapH;

    // Draw Lakes on Minimap
    ctx.fillStyle = '#2563eb';
    for (const lake of this.game.worldMap.waterBodies) {
      ctx.beginPath();
      ctx.ellipse(lake.x * sx, lake.y * sy, (lake.radiusX || 40) * sx, (lake.radiusY || 30) * sy, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Roads
    for (const [x1, y1, x2, y2, rw, isTrail] of this.game.worldMap.roads) {
      ctx.strokeStyle = isTrail ? '#b45309' : '#475569';
      ctx.lineWidth = isTrail ? 1.5 : 2.5;
      ctx.beginPath();
      ctx.moveTo(x1 * sx, y1 * sy);
      ctx.lineTo(x2 * sx, y2 * sy);
      ctx.stroke();
    }

    // Draw Discovered vs Undiscovered Buildings
    for (const loc of this.game.locations) {
      if (loc.isLake) continue;
      const isDisc = this.game.discoverySystem.isDiscovered(loc.id);
      ctx.fillStyle = isDisc ? '#f59e0b' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(loc.x * sx, loc.y * sy, Math.max(3, loc.width * sx), Math.max(3, loc.height * sy));
    }

    // Draw Player Radar Pin
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(this.game.player.x * sx, this.game.player.y * sy, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  showZoneBanner(sector) {
    if (!sector) return;
    this.showToast(`📍 Entering: ${sector.name}`, 'info');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    container.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '🌟' : (type === 'discovery' ? '✨' : 'ℹ️')}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2400);
  }

  showDiscoveryToast(location, points, totalScore) {
    soundManager.playDiscovery();
    this.showToast(`✨ Discovered: #${location.id} ${location.shortName || location.name} (+${points} pts · Total: ${totalScore})`, 'discovery');
  }

  showQuestCompletedToast(quest, points, totalScore) {
    soundManager.playQuestComplete();
    this.showToast(`🏆 Quest Complete: ${quest.title} (+${points} pts)`, 'success');
  }

  // --------------------------------------------------------------------------
  // Academic Schools & Technology Modal (peteroravec.com style)
  // --------------------------------------------------------------------------
  showTechModal() {
    const modal = document.getElementById('tech-modal');
    if (!modal) return;

    soundManager.playMenuOpen();
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="frame-wrp">
        <div class="frame-wrp-inner">
          <button aria-label="Close" class="nes-btn is-error close-btn-position" id="btn-close-tech">×</button>
          <div class="frame pixel-corners">
            <h2 class="big-title">Academic Schools &amp; Technology</h2>
            <p style="font-size: 8px; color: #94a3b8; text-align: center; margin-bottom: 20px; line-height: 1.6;">
              University of Hyderabad is an Institute of Eminence (IoE) renowned for cutting-edge Computer Science, Life Sciences, Management, and Physics research.
            </p>

            <div class="tech-stack">
              <!-- SCIS -->
              <div class="tech-card">
                <div class="logo">💻</div>
                <div class="texts">
                  <h3 class="title">School of Computer &amp; Information Sciences (#45)</h3>
                  <div class="desc">Artificial Intelligence, Machine Learning, Systems &amp; Web Technologies</div>
                  <p>
                    Leading center for Artificial Intelligence, Natural Language Processing, Computer Vision, Cybersecurity, and Distributed Cloud Systems.
                  </p>
                  <button type="button" class="nes-btn is-primary btn-tech-quiz" data-quiz="cs_dept">
                    Take CS Pop Quiz
                  </button>
                  <button type="button" class="nes-btn is-success btn-tech-warp" data-warp="45">
                    🚀 Warp to SCIS
                  </button>
                </div>
              </div>

              <!-- SMS -->
              <div class="tech-card">
                <div class="logo">📈</div>
                <div class="texts">
                  <h3 class="title">School of Management Studies (#72)</h3>
                  <div class="desc">Business Analytics, Strategic Leadership &amp; Financial Engineering</div>
                  <p>
                    Executive MBA programs with focus on tech entrepreneurship, healthcare analytics, and international financial systems.
                  </p>
                  <button type="button" class="nes-btn is-primary btn-tech-quiz" data-quiz="mba_dept">
                    Take Business Strategy Quiz
                  </button>
                  <button type="button" class="nes-btn is-success btn-tech-warp" data-warp="72">
                    🚀 Warp to SMS
                  </button>
                </div>
              </div>

              <!-- SLS -->
              <div class="tech-card">
                <div class="logo">🔬</div>
                <div class="texts">
                  <h3 class="title">School of Life Sciences (SLS) (#3)</h3>
                  <div class="desc">Biotechnology, Genomics, ASPIRE BioNEST &amp; Molecular Biology</div>
                  <p>
                    Premier life sciences hub housing national animal facility, high-throughput gene sequencers, and startup incubators.
                  </p>
                  <button type="button" class="nes-btn is-primary btn-tech-quiz" data-quiz="sls_dept">
                    Take Biology &amp; Heritage Quiz
                  </button>
                  <button type="button" class="nes-btn is-success btn-tech-warp" data-warp="3">
                    🚀 Warp to SLS
                  </button>
                </div>
              </div>

              <!-- IGM Library -->
              <div class="tech-card">
                <div class="logo">📚</div>
                <div class="texts">
                  <h3 class="title">Indira Gandhi Memorial Library (#51)</h3>
                  <div class="desc">Digital Archives, 400,000+ Volumes, Cyber Lab &amp; Reading Commons</div>
                  <p>
                    State-of-the-art automated library with 24/7 reading halls, rare manuscript archives, and online journal repositories.
                  </p>
                  <button type="button" class="nes-btn is-success btn-tech-warp" data-warp="51">
                    🚀 Warp to Library
                  </button>
                </div>
              </div>
            </div>

            <div style="margin-top: 24px;">
              <h4 style="font-size: 10px; color: #facc15; margin-bottom: 12px;">Other Centers &amp; Key Laboratories</h4>
              <ul class="other-skills-list">
                <li>ASPIRE BioNEST Startup Incubator</li>
                <li>Center for Neural &amp; Cognitive Sciences</li>
                <li>Center for Advanced Studies in Electronics</li>
                <li>Center for Earth &amp; Space Sciences</li>
                <li>National Center for Free Radical Research</li>
                <li>Zakir Hussain Innovation Complex</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('btn-close-tech')?.addEventListener('click', () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    });

    modal.querySelectorAll('.btn-tech-quiz').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quizKey = e.target.getAttribute('data-quiz');
        modal.classList.add('hidden');
        if (this.game && this.game.quizQuestions[quizKey]) {
          this.showQuizModal(this.game.quizQuestions[quizKey]);
        }
      });
    });

    modal.querySelectorAll('.btn-tech-warp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const locId = parseInt(e.target.getAttribute('data-warp'));
        modal.classList.add('hidden');
        if (this.game) this.game.fastTravelTo(locId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // About UoH Heritage Modal (peteroravec.com style)
  // --------------------------------------------------------------------------
  showAboutModal() {
    const modal = document.getElementById('about-modal');
    if (!modal) return;

    soundManager.playMenuOpen();
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="frame-wrp">
        <div class="frame-wrp-inner">
          <button aria-label="Close" class="nes-btn is-error close-btn-position" id="btn-close-about">×</button>
          <div class="frame pixel-corners">
            <h2 class="big-title">About University of Hyderabad</h2>
            
            <div class="heritage-profile-box">
              <div class="heritage-icon-big">🏛️</div>
              <div class="heritage-info">
                <h3>University of Hyderabad (UoH)</h3>
                <div class="sub">Institute of Eminence · Central University · Hyderabad, India</div>
              </div>
            </div>

            <div class="heritage-stat-grid">
              <div class="stat-chip">
                <div class="val">2,300</div>
                <div class="lbl">Acres of Lush Campus</div>
              </div>
              <div class="stat-chip">
                <div class="val">78</div>
                <div class="lbl">Indexed Landmarks</div>
              </div>
              <div class="stat-chip">
                <div class="val">6</div>
                <div class="lbl">Natural Lakes &amp; Dams</div>
              </div>
              <div class="stat-chip">
                <div class="val">1974</div>
                <div class="lbl">Year Established</div>
              </div>
            </div>

            <div class="text-block">
              <strong style="color: #60a5fa; display: block; margin-bottom: 6px;">Lush Ecosystem &amp; Prehistoric Rock Formations</strong>
              The campus sits on ancient Deccan granite plateaus dating back over 2.5 billion years. It features legendary natural monuments like <strong>The Masoom's Rock (#27)</strong>, Virgin Rock, and prehistoric megalithic stone cairns.
            </div>

            <div class="text-block">
              <strong style="color: #60a5fa; display: block; margin-bottom: 6px;">Vibrant Campus Life &amp; Night Culture</strong>
              Student life thrives at Zakir Complex food stalls, Sukoon Canteen, and the midnight canteen at South Complex. From cultural fests at Amphitheatre to rock climbing at Masoom's Rock, UoH is a living academic city.
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <button type="button" class="nes-btn is-primary" id="btn-about-open-map">
                🗺️ Explore Full Campus Radar Map
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    document.getElementById('btn-close-about')?.addEventListener('click', () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    });

    document.getElementById('btn-about-open-map')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      this.toggleCampusMap();
    });
  }

  showLocationInfo(location) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playMenuOpen();
    const isDisc = this.game.discoverySystem.isDiscovered(location.id);

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 500px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-loc-modal">×</button>
          <div class="frame pixel-corners">
            <h3 style="font-size: 12px; color: #f87171; margin-bottom: 8px;">#${location.id} ${location.name}</h3>
            <div style="font-size: 7px; color: #facc15; margin-bottom: 12px; text-transform: uppercase;">
              Category: ${location.category} · Section: ${location.section?.toUpperCase()}
            </div>
            <p style="font-size: 8px; font-family: var(--body-font); line-height: 1.5; color: #cbd5e1; margin-bottom: 12px;">
              ${location.description}
            </p>
            <div style="background: #1e293b; border: 2px solid #000; padding: 10px; font-size: 8px; color: #fef08a; margin-bottom: 16px;">
              💡 <strong>Campus Trivia:</strong> ${location.trivia}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 7px; color: ${isDisc ? '#86efac' : '#94a3b8'};">
                ${isDisc ? '✅ Discovered' : '❓ Undiscovered'}
              </span>
              <button class="nes-btn is-primary" id="btn-loc-ok">Got it</button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    const closeHandler = () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    };
    document.getElementById('btn-close-loc-modal')?.addEventListener('click', closeHandler);
    document.getElementById('btn-loc-ok')?.addEventListener('click', closeHandler);
  }

  showSleepTransition(onWakeCallback) {
    const overlay = document.getElementById('sleep-overlay');
    if (!overlay) {
      if (onWakeCallback) onWakeCallback();
      return;
    }

    overlay.classList.remove('hidden');
    overlay.style.opacity = '1';

    setTimeout(() => {
      if (onWakeCallback) onWakeCallback();
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.classList.add('hidden'), 600);
      }, 1000);
    }, 1200);
  }

  toggleDiscoveryBook() {
    this.discoveryBookUI.toggle();
  }

  toggleCampusMap() {
    this.campusMapUI.toggle();
  }

  toggleQuestsModal() {
    this.discoveryBookUI.toggleToQuests();
  }

  toggleSettings() {
    this.settingsUI.toggle();
  }

  showNPCDialog(npc) {
    this.dialogUI.show(npc);
  }

  showQuizModal(quizSet, onCompleteCallback) {
    this.quizUI.startQuiz(quizSet, onCompleteCallback);
  }

  showNightCanteenModal(onOrderCallback) {
    this.nightActivitiesUI.showCanteen(onOrderCallback);
  }

  showSouthPartyActivity() {
    this.nightActivitiesUI.showParty();
  }
}
