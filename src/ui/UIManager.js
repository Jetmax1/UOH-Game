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
    // Top Bar Phone & RPG Buttons
    document.getElementById('btn-phone')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.showPhoneModal();
    });
    document.getElementById('btn-profile')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.showStudentProfile();
    });
    document.getElementById('btn-clubs')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.showClubModal();
    });
    document.getElementById('btn-social')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.showSocialModal();
    });
    document.getElementById('btn-emotes')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.toggleEmoteBar();
    });

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

    // Initialize Campus Chat & Emote Tray
    this.initChatDock();
    this.initEmoteTray();

    // Setup Mobile Touch Controls
    const dpad = document.getElementById('mobile-dpad');
    const interactBtn = document.getElementById('btn-mobile-interact');
    const sprintBtn = document.getElementById('btn-mobile-sprint');
    const mapBtn = document.getElementById('btn-mobile-map');
    const bookBtn = document.getElementById('btn-mobile-book');
    const questBtn = document.getElementById('btn-mobile-quests');
    if (this.game && dpad) {
      this.game.input.setupMobileTouchControls(dpad, interactBtn, sprintBtn, mapBtn, bookBtn, questBtn);
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

    // 2. Student Money (₹)
    const moneyEl = document.getElementById('hud-money');
    if (moneyEl && this.game.studentStats) {
      moneyEl.textContent = `₹${this.game.studentStats.money.toLocaleString()}`;
    }

    // 3. Clock & Time Period
    const timeEl = document.getElementById('hud-time');
    const periodEl = document.getElementById('hud-period');
    const timeIconEl = document.getElementById('hud-time-icon');
    if (timeEl) timeEl.textContent = this.game.timeSystem.getFormattedTime();
    if (periodEl) periodEl.textContent = `Sem ${this.game.semesterSystem?.currentSemester || 1} Wk ${this.game.semesterSystem?.currentWeek || 1} · ${this.game.timeSystem.getTimePeriodName()}`;
    if (timeIconEl) {
      const mode = this.game.timeSystem.ambientMode;
      timeIconEl.textContent = mode === 'night' ? '🌙' : (mode === 'evening' ? '🌇' : '☀️');
    }

    // 4. Active Quest Objective Ticker
    const questObj = this.game.questSystem.getCurrentPrimaryObjective();
    const questTitleEl = document.getElementById('hud-quest-title');
    const questTextEl = document.getElementById('hud-quest-text');
    const questProgEl = document.getElementById('hud-quest-prog');
    if (questTitleEl) questTitleEl.textContent = questObj.title;
    if (questTextEl) questTextEl.textContent = questObj.text;
    if (questProgEl) questProgEl.textContent = questObj.progress ? `[${questObj.progress}]` : '';

    // 5. Energy Bar (⚡)
    const energyFill = document.getElementById('energy-fill');
    if (energyFill && this.game.studentStats) {
      const ePct = (this.game.studentStats.energy / this.game.studentStats.maxEnergy) * 100;
      energyFill.style.width = `${ePct}%`;
    }

    // 6. Sprint Stamina Bar
    const staminaFill = document.getElementById('stamina-fill');
    if (staminaFill) {
      const pct = (this.game.player.stamina / this.game.player.maxStamina) * 100;
      staminaFill.style.width = `${pct}%`;
    }

    // 7. Render Minimap
    this.renderMinimap();
  }

  renderMinimap() {
    if (!this.minimapCtx || !this.game) return;

    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    // --- INDOOR RADAR MINIMAP ---
    if (this.game.currentInterior) {
      const interior = this.game.currentInterior;
      const headerSpan = document.querySelector('#minimap-container .minimap-header span');
      if (headerSpan) {
        headerSpan.textContent = `📍 Inside: ${interior.name.length > 15 ? interior.name.slice(0, 13) + '..' : interior.name}`;
      }

      ctx.clearRect(0, 0, w, h);

      // Dark Room Backing
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const sx = (w - 20) / interior.width;
      const sy = (h - 20) / interior.height;
      const scale = Math.min(sx, sy);
      const padX = (w - interior.width * scale) / 2;
      const padY = (h - interior.height * scale) / 2;

      // Floor Area
      ctx.fillStyle = interior.floorType === 'checker' ? '#78350f' : (interior.floorType === 'parquet' ? '#b45309' : (interior.floorType === 'sports_wood' ? '#d97706' : '#334155'));
      ctx.fillRect(padX, padY, interior.width * scale, interior.height * scale);
      ctx.strokeStyle = interior.wallTrimColor || '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(padX, padY, interior.width * scale, interior.height * scale);

      // Furniture
      for (const obj of interior.objects) {
        if (obj.type === 'plant' || obj.type === 'window') continue;
        ctx.fillStyle = obj.color || '#64748b';
        ctx.fillRect(padX + obj.x * scale, padY + obj.y * scale, Math.max(2, obj.w * scale), Math.max(2, obj.h * scale));
      }

      // Exit Door Threshold
      const doorW = 80;
      const doorX = (interior.width - doorW) / 2;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(padX + doorX * scale, padY + (interior.height - 12) * scale, doorW * scale, 12 * scale);

      // NPCs
      if (interior.npcs) {
        for (const npc of interior.npcs) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(padX + (npc.x + 8) * scale, padY + (npc.y + 10) * scale, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Player Pin
      const pScaleX = padX + (this.game.player.x + 12) * scale;
      const pScaleY = padY + (this.game.player.y + 15) * scale;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pScaleX, pScaleY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      return;
    }

    // --- OUTDOOR RADAR MINIMAP ---
    const headerSpan = document.querySelector('#minimap-container .minimap-header span');
    if (headerSpan) headerSpan.textContent = '📍 UoH Radar';

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
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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
                <div class="val">${this.game?.locations?.length || 95}</div>
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

  showNoticeBoard(noticeData) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playPageFlip();

    const bulletsHtml = (noticeData.noticeText || []).map(t => `<li style="margin-bottom: 8px; line-height: 1.5; color: #f8fafc;">${t}</li>`).join('');

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 580px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-notice-modal">×</button>
          <div class="frame pixel-corners" style="background: #0f172a; border-color: #f59e0b;">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 12px;">
              <span style="font-size: 20px;">📋</span>
              <div>
                <h3 style="font-size: 11px; color: #facc15; margin: 0;">${noticeData.noticeTitle || 'Official Notice Board'}</h3>
                <span style="font-size: 7px; color: #94a3b8;">${noticeData.noticeSubtitle || 'Campus Circular'}</span>
              </div>
            </div>
            <div style="background: rgba(30, 41, 59, 0.8); border: 2px solid #000; padding: 14px; margin-bottom: 16px; max-height: 280px; overflow-y: auto;">
              <ul style="font-size: 8px; font-family: var(--body-font); list-style-type: none; padding: 0; margin: 0;">
                ${bulletsHtml}
              </ul>
            </div>
            <div style="text-align: right;">
              <button class="nes-btn is-primary" id="btn-notice-ok">Close Circular</button>
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
    document.getElementById('btn-close-notice-modal')?.addEventListener('click', closeHandler);
    document.getElementById('btn-notice-ok')?.addEventListener('click', closeHandler);
  }

  showBookModal(bookData) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playPageFlip();

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 580px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-book-modal">×</button>
          <div class="frame pixel-corners" style="background: #1e1b4b; border-color: #818cf8;">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #312e81; padding-bottom: 8px; margin-bottom: 12px;">
              <span style="font-size: 20px;">📚</span>
              <div>
                <h3 style="font-size: 11px; color: #a5b4fc; margin: 0;">${bookData.bookTitle || 'Library Manuscript'}</h3>
                <span style="font-size: 7px; color: #cbd5e1;">University Reference Volume</span>
              </div>
            </div>
            <div style="background: #0f172a; border: 2px solid #000; padding: 14px; margin-bottom: 16px; max-height: 280px; overflow-y: auto;">
              <p style="font-size: 8px; font-family: var(--body-font); line-height: 1.7; color: #f1f5f9; margin: 0;">
                ${bookData.bookText || 'An ancient academic volume containing rich campus history and discoveries.'}
              </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 7px; color: #818cf8;">📖 Reading Volume</span>
              <button class="nes-btn is-primary" id="btn-book-ok">Return Book to Shelf</button>
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
    document.getElementById('btn-close-book-modal')?.addEventListener('click', closeHandler);
    document.getElementById('btn-book-ok')?.addEventListener('click', closeHandler);
  }

  showCanteenMenuModal(menuData) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playMenuOpen();

    const itemsHtml = (menuData.menuItems || []).map((item, idx) => {
      const priceNum = parseInt(item.price ? item.price.replace(/[^\d]/g, '') : '25', 10) || 25;
      const energyGain = Math.round(priceNum * 0.75);

      return `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; background: #0f172a; border: 2px solid #000; padding: 10px; margin-bottom: 8px; border-radius: 4px;">
          <div style="flex: 1;">
            <strong style="font-size: 8px; color: #facc15; display: block; margin-bottom: 4px;">${item.name}</strong>
            <span style="font-size: 7px; color: #94a3b8; font-family: var(--body-font);">${item.desc || 'Fresh campus food preparation.'}</span>
            <div style="font-size: 6px; color: #38bdf8; margin-top: 4px; font-weight: bold;">⚡ Restores +${energyGain}% Energy</div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span class="chip" style="background: #16a34a; color: #fff; font-size: 8px; font-weight: bold;">₹${priceNum}</span>
            <button class="nes-btn is-success btn-buy-food" data-item-name="${item.name}" data-price="${priceNum}" data-energy="${energyGain}" style="font-size: 6px; padding: 2px 6px;">BUY &amp; EAT</button>
          </div>
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 600px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-menu-modal">×</button>
          <div class="frame pixel-corners" style="background: #451a03; border-color: #f59e0b;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #78350f; padding-bottom: 8px; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">☕</span>
                <div>
                  <h3 style="font-size: 11px; color: #fde047; margin: 0;">${menuData.menuTitle || 'Canteen Menu'}</h3>
                  <span style="font-size: 7px; color: #fdba74;">${menuData.menuSubtitle || 'Fresh Food & Beverages'}</span>
                </div>
              </div>
              <div style="font-size: 8px; color: #facc15; font-weight: bold;">Wallet: ₹${this.game?.studentStats?.money || 0}</div>
            </div>
            <div style="max-height: 290px; overflow-y: auto; margin-bottom: 16px; padding-right: 4px;">
              ${itemsHtml}
            </div>
            <div style="text-align: right;">
              <button class="nes-btn is-warning" id="btn-menu-ok">Close Menu</button>
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
    document.getElementById('btn-close-menu-modal')?.addEventListener('click', closeHandler);
    document.getElementById('btn-menu-ok')?.addEventListener('click', closeHandler);

    content.querySelectorAll('.btn-buy-food').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.itemName;
        const price = parseInt(btn.dataset.price, 10);
        const energy = parseInt(btn.dataset.energy, 10);

        if (this.game?.studentStats) {
          if (this.game.studentStats.canAfford(price)) {
            this.game.studentStats.spendMoney(price, `Bought ${name}`);
            this.game.studentStats.restoreEnergy(energy, `Ate ${name}`);
            soundManager.playLevelUp();
            this.showToast(`☕ Purchased & Ate ${name}! Restored +${energy}% Energy ⚡ (Spent ₹${price})`, 'success');
            this.showCanteenMenuModal(menuData); // refresh wallet display
          } else {
            this.showToast(`❌ Insufficient funds! ${name} costs ₹${price} (You have ₹${this.game.studentStats.money})`, 'error');
          }
        }
      });
    });
  }

  showExamineModal(objData) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playInteract();

    const title = objData.examineTitle || objData.boardTitle || objData.label;
    const text = objData.examineText || objData.boardText || 'An impressive piece of university infrastructure.';

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 520px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-examine-modal">×</button>
          <div class="frame pixel-corners" style="background: #0f172a; border-color: #38bdf8;">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 12px;">
              <span style="font-size: 20px;">🔍</span>
              <div>
                <h3 style="font-size: 10px; color: #38bdf8; margin: 0;">${title}</h3>
                <span style="font-size: 7px; color: #94a3b8;">Detailed Inspection</span>
              </div>
            </div>
            <div style="background: #1e293b; border: 2px solid #000; padding: 12px; margin-bottom: 16px;">
              <p style="font-size: 8px; font-family: var(--body-font); line-height: 1.6; color: #f8fafc; margin: 0;">
                ${text}
              </p>
            </div>
            <div style="text-align: right;">
              <button class="nes-btn is-primary" id="btn-examine-ok">Close</button>
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
    document.getElementById('btn-close-examine-modal')?.addEventListener('click', closeHandler);
    document.getElementById('btn-examine-ok')?.addEventListener('click', closeHandler);
  }

  showBuildingEntryBanner(buildingName, floorLabel = '1F') {
    this.showToast(`🏛️ Entering: ${buildingName} (${floorLabel})`, 'discovery');
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

  // ==========================================================================
  // MULTIPLAYER & UNIVERSITY RPG UI METHODS
  // ==========================================================================

  initChatDock() {
    const dock = document.getElementById('campus-chat-dock');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const toggleBtn = document.getElementById('btn-toggle-chat');
    const tabBtns = document.querySelectorAll('.chat-tab-btn');

    if (!dock) return;

    // Toggle Minimize
    toggleBtn?.addEventListener('click', () => {
      dock.classList.toggle('minimized');
      toggleBtn.textContent = dock.classList.contains('minimized') ? '+' : '−';
    });

    // Channel Switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const channel = btn.dataset.channel;
        if (this.game?.chatSystem) {
          this.game.chatSystem.setChannel(channel);
          this.refreshChatMessages();
        }
      });
    });

    // Send Form
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input || !this.game?.chatSystem) return;
      const text = input.value.trim();
      if (!text) return;

      const prog = this.game.progression;
      const club = this.game.clubSystem?.getCurrentClubData();

      const msg = this.game.chatSystem.sendMessage(prog.studentName, text, this.game.chatSystem.activeChannel, {
        title: prog.activeTitle,
        club: club ? club.shortName : ''
      });

      if (msg) {
        this.game.networkManager.broadcastChat(text, this.game.chatSystem.activeChannel);
        this.game.player.showSpeech(text);
        input.value = '';
        input.blur();
      }
    });

    // Wire chat message receiver
    if (this.game?.chatSystem) {
      this.game.chatSystem.onMessageReceived = (msg) => {
        this.appendChatMessage(msg);
        soundManager.playChatBlip();
      };
    }
  }

  refreshChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container || !this.game?.chatSystem) return;

    container.innerHTML = '';
    const messages = this.game.chatSystem.getMessages(this.game.chatSystem.activeChannel);
    for (const msg of messages) {
      this.appendChatMessage(msg);
    }
  }

  appendChatMessage(msg) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `chat-msg ${msg.isSystem ? 'system' : ''}`;

    if (msg.isSystem) {
      el.innerHTML = `<span class="msg-text">${msg.text}</span>`;
    } else {
      el.innerHTML = `
        <span class="msg-time">[${msg.timestamp}]</span>
        <strong class="msg-sender">${msg.sender}:</strong>
        <span class="msg-text">${msg.text}</span>
      `;
    }

    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  initEmoteTray() {
    const tray = document.getElementById('emote-tray-bar');
    if (!tray) return;

    tray.querySelectorAll('.emote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const emoteId = btn.dataset.emote;
        if (this.game?.socialSystem) {
          this.game.socialSystem.triggerEmote(emoteId);
          tray.classList.add('hidden');
        }
      });
    });
  }

  toggleEmoteBar() {
    const tray = document.getElementById('emote-tray-bar');
    if (tray) {
      tray.classList.toggle('hidden');
      soundManager.playBtnClick();
    }
  }

  // 1. Official Student ID Card Modal
  showStudentProfile(studentData = null) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playMenuOpen();

    const isLocal = !studentData;
    const prog = isLocal ? this.game?.progression : studentData;
    const club = isLocal ? this.game?.clubSystem?.getCurrentClubData() : { name: studentData.club || 'Independent', role: studentData.title || 'Student' };
    const summary = isLocal ? prog.getProfileSummary(club) : {
      studentName: studentData.name,
      studentId: studentData.id || 'UOH-2024-STUDENT',
      department: studentData.department || 'School of Computer Sciences',
      year: '2nd Year',
      level: studentData.level || 1,
      xp: 450,
      xpNeeded: 800,
      reputation: studentData.reputation || 150,
      activeTitle: studentData.title || 'Student',
      unlockedTitles: [studentData.title || 'Student', 'Freshman', 'Campus Explorer'],
      clubName: studentData.club || 'Independent Student',
      clubRole: 'Active Member',
      achievements: [
        { name: 'Campus Explorer', icon: '🌲', description: 'Explored major campus landmarks' },
        { name: 'Quiz Initiate', icon: '⚡', description: 'Participated in university quiz blitz' }
      ]
    };

    const xpPct = Math.min(100, Math.round((summary.xp / summary.xpNeeded) * 100));

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 600px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-profile">×</button>
          <div class="student-id-card pixel-corners">
            <!-- Header -->
            <div class="student-id-header">
              <div class="student-id-seal">🏛️</div>
              <div class="student-id-univ">
                <h2>UNIVERSITY OF HYDERABAD</h2>
                <span>OFFICIAL STUDENT IDENTIFICATION &amp; RPG IDENTITY</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 7px; color: #facc15; font-weight: bold;">⭐ ${summary.reputation} REP</span>
              </div>
            </div>

            <!-- Body Profile -->
            <div class="student-id-body">
              <div class="student-avatar-box">
                <div class="student-avatar-img">🎓</div>
                <div style="font-size: 7px; font-weight: bold; color: #38bdf8;">LVL ${summary.level}</div>
                <div class="student-id-num">${summary.studentId}</div>
              </div>
              <div>
                <div class="student-details-grid">
                  <div>
                    <div class="student-prop-label">Full Name</div>
                    <div class="student-prop-val">${summary.studentName}</div>
                  </div>
                  <div>
                    <div class="student-prop-label">Active Title</div>
                    <div class="student-prop-val" style="color: #facc15;">🏷️ ${summary.activeTitle}</div>
                  </div>
                  <div>
                    <div class="student-prop-label">Department</div>
                    <div class="student-prop-val">${summary.department}</div>
                  </div>
                  <div>
                    <div class="student-prop-label">Registered Club</div>
                    <div class="student-prop-val" style="color: #34d399;">🏛️ ${summary.clubName}</div>
                  </div>
                </div>

                <!-- XP Bar -->
                <div class="student-xp-bar-wrap">
                  <div class="student-xp-header">
                    <span style="color: #94a3b8;">Level Progression</span>
                    <span style="color: #38bdf8; font-weight: bold;">${summary.xp} / ${summary.xpNeeded} XP (${xpPct}%)</span>
                  </div>
                  <div class="student-xp-track">
                    <div class="student-xp-fill" style="width: ${xpPct}%;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Achievements -->
            <div style="border-top: 1px solid #334155; padding-top: 10px;">
              <div style="font-size: 7px; color: #facc15; font-weight: bold; margin-bottom: 6px;">
                🏆 UNLOCKED HONORS &amp; ACHIEVEMENTS (${summary.achievements.length})
              </div>
              <div class="student-achievements-list">
                ${summary.achievements.length === 0 ? '<div style="font-size: 7px; color: #64748b;">No achievements unlocked yet. Explore campus landmarks and join events!</div>' : ''}
                ${summary.achievements.map(a => `
                  <div class="student-achieve-card">
                    <span class="student-achieve-icon">${a.icon || '🏆'}</span>
                    <div>
                      <div class="student-achieve-name">${a.name}</div>
                      <div style="font-size: 6px; color: #94a3b8;">${a.description}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-top: 14px; text-align: right;">
              <button class="nes-btn is-primary" id="btn-profile-ok">Done</button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    const close = () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    };
    document.getElementById('btn-close-profile')?.addEventListener('click', close);
    document.getElementById('btn-profile-ok')?.addEventListener('click', close);
  }

  // 2. University Clubs Modal
  showClubModal() {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content || !this.game?.clubSystem) return;

    soundManager.playMenuOpen();

    const clubs = this.game.clubSystem.getAllClubs();
    const currentClub = this.game.clubSystem.getCurrentClubData();

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 680px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-club">×</button>
          <div class="frame pixel-corners" style="background: #0f172a; border-color: #10b981;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">🏛️</span>
                <div>
                  <h3 style="font-size: 10px; color: #10b981; margin: 0;">UNIVERSITY CLUBS &amp; SOCIETIES</h3>
                  <span style="font-size: 7px; color: #94a3b8;">Join a campus club, complete weekly missions, and earn ranks!</span>
                </div>
              </div>
              ${currentClub ? `<div style="background: #065f46; border: 1px solid #10b981; padding: 4px 8px; font-size: 7px; color: #6ee7b7; font-weight: bold;">Registered: ${currentClub.shortName} (${currentClub.role})</div>` : ''}
            </div>

            <!-- Clubs List Grid -->
            <div class="clubs-grid">
              ${clubs.map(c => {
                const isJoined = currentClub && currentClub.id === c.id;
                return `
                  <div class="club-card ${isJoined ? 'joined' : ''}">
                    <div class="club-card-header">
                      <span class="club-card-icon">${c.icon}</span>
                      <div>
                        <h4 class="club-card-title">${c.name}</h4>
                        <span style="font-size: 6px; color: #94a3b8;">HQ: ${c.hqName}</span>
                      </div>
                    </div>
                    <div class="club-card-desc">${c.description}</div>
                    <div style="font-size: 6px; color: #facc15;">Lead: ${c.leadNpc}</div>
                    <div>
                      ${isJoined
                        ? `<button class="nes-btn is-disabled" style="width: 100%; font-size: 7px;" disabled>✓ ACTIVE CLUB</button>`
                        : `<button class="nes-btn is-success btn-join-club" data-club-id="${c.id}" style="width: 100%; font-size: 7px;">JOIN CLUB</button>`
                      }
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Active Club Missions if Joined -->
            ${currentClub ? `
              <div class="club-missions-wrap">
                <div style="font-size: 8px; color: #10b981; font-weight: bold; margin-bottom: 6px;">
                  📋 WEEKLY CLUB MISSIONS (${currentClub.shortName})
                </div>
                ${currentClub.missions.map(m => `
                  <div class="club-mission-item ${m.completed ? 'completed' : ''}">
                    <div>
                      <strong>${m.title}:</strong> ${m.desc}
                    </div>
                    <div>
                      <span style="color: #facc15;">+${m.rewardXp} XP</span> · 
                      <span style="color: ${m.completed ? '#34d399' : '#94a3b8'}; font-weight: bold;">
                        [${m.currentCount}/${m.targetCount}] ${m.completed ? '✓ DONE' : ''}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div style="margin-top: 14px; text-align: right;">
              <button class="nes-btn is-primary" id="btn-club-ok">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    const close = () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    };
    document.getElementById('btn-close-club')?.addEventListener('click', close);
    document.getElementById('btn-club-ok')?.addEventListener('click', close);

    content.querySelectorAll('.btn-join-club').forEach(btn => {
      btn.addEventListener('click', () => {
        const clubId = btn.dataset.clubId;
        this.game.clubSystem.joinClub(clubId);
        this.showClubModal(); // Re-render
      });
    });
  }

  // 3. Social & Friends Modal
  showSocialModal() {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content || !this.game?.socialSystem) return;

    soundManager.playMenuOpen();

    const friends = this.game.socialSystem.getFriends();
    const party = this.game.socialSystem.getParty();

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 580px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-social">×</button>
          <div class="frame pixel-corners" style="background: #0f172a; border-color: #f59e0b;">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 12px;">
              <span style="font-size: 24px;">👥</span>
              <div>
                <h3 style="font-size: 10px; color: #f59e0b; margin: 0;">CAMPUS FRIENDS &amp; PARTY SQUAD</h3>
                <span style="font-size: 7px; color: #94a3b8;">Stay connected with fellow campus students and form squads!</span>
              </div>
            </div>

            <!-- Party Status -->
            <div style="background: #1e293b; border: 2px solid #334155; padding: 10px; border-radius: 4px; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 8px; color: #38bdf8; font-weight: bold;">
                  🤝 PARTY SQUAD: ${party.inParty ? party.partyName : 'Not in a Party'}
                </span>
                ${party.inParty ? `<button class="nes-btn is-error" id="btn-leave-party" style="font-size: 6px; padding: 2px 6px;">LEAVE SQUAD</button>` : ''}
              </div>
              <div style="font-size: 7px; color: #94a3b8; font-family: var(--body-font);">
                ${party.inParty
                  ? party.members.map(m => `• ${m.name} (Lvl ${m.level}) ${m.isLeader ? '👑 Leader' : ''}`).join('<br>')
                  : 'Approach any campus student and press [E] to invite them to a squad!'}
              </div>
            </div>

            <!-- Friends List -->
            <div style="font-size: 8px; color: #facc15; font-weight: bold; margin-bottom: 8px;">
              CAMPUS FRIENDS DIRECTORY (${friends.length})
            </div>
            <div class="friends-list">
              ${friends.length === 0 ? '<div style="font-size: 7px; color: #64748b;">No friends added yet. Walk up to other students and select Add Friend!</div>' : ''}
              ${friends.map(f => `
                <div class="friend-item">
                  <div class="friend-left">
                    <div class="friend-online-dot ${f.isOnline ? 'online' : ''}"></div>
                    <div>
                      <div class="friend-info-name">${f.name} · Lvl ${f.level}</div>
                      <div class="friend-info-sub">${f.title} · ${f.club} · Section: ${f.section.toUpperCase()}</div>
                    </div>
                  </div>
                  <div class="friend-actions">
                    <button class="nes-btn is-primary btn-friend-profile" data-fid="${f.id}" style="font-size: 6px; padding: 4px 6px;">PROFILE</button>
                    <button class="nes-btn is-warning btn-friend-invite" data-fid="${f.id}" style="font-size: 6px; padding: 4px 6px;">INVITE</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 14px; text-align: right;">
              <button class="nes-btn is-primary" id="btn-social-ok">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    const close = () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    };
    document.getElementById('btn-close-social')?.addEventListener('click', close);
    document.getElementById('btn-social-ok')?.addEventListener('click', close);

    document.getElementById('btn-leave-party')?.addEventListener('click', () => {
      this.game.socialSystem.leaveParty(this.game.networkManager.localId);
      this.showSocialModal();
    });

    content.querySelectorAll('.btn-friend-invite').forEach(btn => {
      btn.addEventListener('click', () => {
        const fid = btn.dataset.fid;
        const target = friends.find(f => f.id === fid);
        if (target) {
          if (!this.game.socialSystem.party.inParty) {
            this.game.socialSystem.createParty(this.game.progression.getProfileSummary());
          }
          this.game.socialSystem.inviteToParty(target);
          this.showToast(`🤝 Invited ${target.name} to Party Squad!`, 'success');
          this.showSocialModal();
        }
      });
    });
  }

  // 4. Student Interaction Modal (Context Menu when pressing [E] on another student)
  showStudentInteractionModal(student, actions) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playMenuOpen();

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 440px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-student-interact">×</button>
          <div class="frame pixel-corners" style="background: #0f172a; border-color: #38bdf8;">
            <div style="display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #334155; padding-bottom: 10px; margin-bottom: 12px;">
              <div style="font-size: 28px; background: #1e293b; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border: 2px solid #38bdf8; border-radius: 4px;">
                🎓
              </div>
              <div>
                <h3 style="font-size: 9px; color: #38bdf8; margin: 0 0 2px 0;">${student.name}</h3>
                <span style="font-size: 7px; color: #facc15; font-weight: bold;">Lvl ${student.level} · ${student.title}</span>
                <div style="font-size: 6px; color: #94a3b8;">${student.club} · ${student.department || 'School of Computer Sciences'}</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="nes-btn is-primary" id="btn-std-talk" style="font-size: 7px;">
                💬 TALK / GREET STUDENT
              </button>
              <button class="nes-btn is-success" id="btn-std-profile" style="font-size: 7px;">
                🎓 VIEW STUDENT ID PROFILE
              </button>
              <button class="nes-btn is-warning" id="btn-std-party" style="font-size: 7px;">
                🤝 INVITE TO SQUAD / PARTY
              </button>
              <button class="nes-btn" id="btn-std-friend" style="font-size: 7px;">
                👥 ADD TO FRIENDS LIST
              </button>
              <button class="nes-btn is-error" id="btn-std-challenge" style="font-size: 7px;">
                ⚡ CHALLENGE TO CAMPUS TRIVIA
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    const close = () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    };
    document.getElementById('btn-close-student-interact')?.addEventListener('click', close);

    document.getElementById('btn-std-talk')?.addEventListener('click', () => {
      close();
      if (actions.onTalk) actions.onTalk();
    });
    document.getElementById('btn-std-profile')?.addEventListener('click', () => {
      close();
      if (actions.onViewProfile) actions.onViewProfile();
    });
    document.getElementById('btn-std-party')?.addEventListener('click', () => {
      close();
      if (actions.onInviteParty) actions.onInviteParty();
    });
    document.getElementById('btn-std-friend')?.addEventListener('click', () => {
      close();
      if (actions.onAddFriend) actions.onAddFriend();
    });
    document.getElementById('btn-std-challenge')?.addEventListener('click', () => {
      close();
      if (actions.onChallenge) actions.onChallenge();
    });
  }

  showStudentDialogue(student) {
    const greetings = [
      `Hey there! Exploring ${this.game?.worldMap.currentSection.toUpperCase()} Campus? The weather is fantastic today!`,
      `Hi! Have you visited Sukoon Canteen or Masoom's Rock yet? Such classic UoH hangout spots.`,
      `Greetings fellow scholar! Always great to meet active students on campus. Keep leveling up!`
    ];
    const pick = greetings[Math.floor(Math.random() * greetings.length)];

    this.showNPCDialog({
      name: student.name,
      role: `Level ${student.level} · ${student.club}`,
      avatar: '🎓',
      dialogue: [pick]
    });
  }

  // 5. Level Up Celebration Modal
  showLevelUpModal(level, title) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 460px;">
        <div class="frame-wrp-inner">
          <div class="frame pixel-corners" style="background: #020617; border-color: #facc15; text-align: center; box-shadow: 0 0 30px rgba(250, 204, 21, 0.4);">
            <div style="font-size: 36px; margin-bottom: 6px; animation: pulseBanner 1s infinite;">🎉 🎓 ⭐</div>
            <h2 style="font-size: 14px; color: #facc15; margin: 0 0 4px 0; text-shadow: 2px 2px #000;">LEVEL UP!</h2>
            <div style="font-size: 10px; color: #38bdf8; font-weight: bold; margin-bottom: 8px;">
              YOU ARE NOW LEVEL ${level}!
            </div>
            <div style="background: #0f172a; border: 2px solid #334155; padding: 10px; border-radius: 4px; margin-bottom: 14px;">
              <div style="font-size: 6px; color: #94a3b8; text-transform: uppercase;">Promoted Rank Title</div>
              <div style="font-size: 9px; color: #facc15; font-weight: bold; margin-top: 2px;">🏷️ ${title}</div>
            </div>
            <button class="nes-btn is-success" id="btn-level-up-close" style="font-size: 8px; width: 100%;">
              CONTINUE ADVENTURE
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('btn-level-up-close')?.addEventListener('click', () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    });
  }

  // 6. Live Event Banner
  showEventBanner(event, timer) {
    const banner = document.getElementById('campus-event-banner');
    if (!banner) return;

    banner.innerHTML = `
      <span class="event-banner-icon">${event.icon}</span>
      <div class="event-banner-info">
        <span class="event-banner-title">SCHEDULED EVENT: ${event.title}</span>
        <span class="event-banner-sub">${event.desc}</span>
      </div>
      <span class="event-banner-timer" id="event-countdown-display">${timer}s</span>
    `;

    banner.classList.remove('hidden');

    const interval = setInterval(() => {
      timer -= 1;
      const el = document.getElementById('event-countdown-display');
      if (el) el.textContent = `${Math.max(0, timer)}s`;
      if (timer <= 0) {
        clearInterval(interval);
        banner.classList.add('hidden');
      }
    }, 1000);
  }

  showEventActiveUI(event, timer) {
    const widget = document.getElementById('campus-event-widget');
    if (!widget) return;

    widget.innerHTML = `
      <div class="event-widget-header">
        <span class="event-widget-title">${event.icon} ${event.title}</span>
        <span class="event-widget-time" id="event-active-timer">${Math.round(timer)}s</span>
      </div>
      <div class="event-widget-body" id="event-widget-desc">
        ${event.type === 'hunt' ? 'Solve the clues across campus landmarks!' : ''}
        ${event.type === 'quiz' ? 'Answer live trivia questions at Student Centre!' : ''}
        ${event.type === 'sprint' ? 'Pass all checkpoint gates as fast as possible!' : ''}
      </div>
    `;

    widget.classList.remove('hidden');
  }

  showEventResultsModal(event, leaderboard) {
    const widget = document.getElementById('campus-event-widget');
    if (widget) widget.classList.add('hidden');

    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.playLevelUp();

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 480px;">
        <div class="frame-wrp-inner">
          <div class="frame pixel-corners" style="background: #0f172a; border-color: #facc15; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 4px;">🏆 🥇 🥈 🥉</div>
            <h2 style="font-size: 11px; color: #facc15; margin: 0 0 4px 0;">EVENT LEADERBOARD</h2>
            <div style="font-size: 8px; color: #94a3b8; margin-bottom: 12px;">${event.title} Podium Results</div>

            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
              ${leaderboard.map(entry => `
                <div style="background: ${entry.rank === 1 ? '#422006' : '#1e293b'}; border: 1px solid ${entry.rank === 1 ? '#facc15' : '#334155'}; padding: 6px 12px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                  <div style="font-size: 7px; font-weight: bold; color: ${entry.rank === 1 ? '#facc15' : '#f8fafc'};">
                    #${entry.rank} · ${entry.name} (${entry.title})
                  </div>
                  <div style="font-size: 8px; color: #38bdf8; font-weight: bold;">
                    ${entry.score} PTS
                  </div>
                </div>
              `).join('')}
            </div>

            <button class="nes-btn is-primary" id="btn-event-res-close" style="font-size: 7px; width: 100%;">
              CLAIM REWARDS &amp; CLOSE
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('btn-event-res-close')?.addEventListener('click', () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    });
  }

  showAchievementToast(achievement) {
    this.showToast(`🏆 Honor Unlocked: ${achievement.name}!`, 'discovery');
  }

  // ==========================================================================
  // IN-GAME STUDENT SMARTPHONE ("UOH PHONE") UI
  // ==========================================================================

  showPhoneModal(initialApp = 'schedule') {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content || !this.game?.phoneSystem) return;

    soundManager.playMenuOpen();
    this.game.phoneSystem.setActiveApp(initialApp);

    const apps = this.game.phoneSystem.getAppsList();
    const timeStr = this.game.timeSystem.getFormattedTime();

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 480px;">
        <div class="frame-wrp-inner">
          <button class="nes-btn is-error close-btn-position" id="btn-close-phone">×</button>
          <div class="phone-device-frame pixel-corners">
            <!-- Top Status Bar -->
            <div class="phone-status-bar">
              <span style="font-size: 7px; color: #94a3b8; font-weight: bold;">UoH Mobile 5G</span>
              <span style="font-size: 7px; color: #f8fafc; font-weight: bold;">${timeStr}</span>
              <span style="font-size: 7px; color: #10b981;">⚡ 98%</span>
            </div>

            <!-- App Bar Grid Navigation -->
            <div class="phone-apps-nav">
              ${apps.map(a => `
                <button class="phone-app-icon-btn ${this.game.phoneSystem.activeApp === a.id ? 'active' : ''}" data-app-id="${a.id}">
                  <span style="font-size: 16px;">${a.icon}</span>
                  <span style="font-size: 6px;">${a.name}</span>
                </button>
              `).join('')}
            </div>

            <!-- Active App View Container -->
            <div class="phone-app-viewport" id="phone-app-viewport">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    const close = () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    };
    document.getElementById('btn-close-phone')?.addEventListener('click', close);

    content.querySelectorAll('.phone-app-icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playBtnClick();
        content.querySelectorAll('.phone-app-icon-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const appId = btn.dataset.appId;
        this.game.phoneSystem.setActiveApp(appId);
        this.renderPhoneApp(appId);
      });
    });

    this.renderPhoneApp(this.game.phoneSystem.activeApp);
  }

  renderPhoneApp(appId) {
    const viewport = document.getElementById('phone-app-viewport');
    if (!viewport) return;

    if (appId === 'schedule') {
      const sched = this.game.scheduleSystem.getTodaySchedule();
      const currentHour = this.game.timeSystem.hour;
      const currentMin = this.game.timeSystem.minute;
      const status = this.game.scheduleSystem.getCurrentAndNextActivity(currentHour, currentMin);

      viewport.innerHTML = `
        <div style="font-size: 8px; color: #38bdf8; font-weight: bold; margin-bottom: 8px;">
          📅 DAILY CLASS TIMETABLE &amp; ROUTINE
        </div>
        <div style="background: #020617; border: 1px solid #38bdf8; padding: 8px; border-radius: 4px; margin-bottom: 10px;">
          <div style="font-size: 6px; color: #38bdf8; text-transform: uppercase;">CURRENT SCHEDULED ACTIVITY</div>
          <div style="font-size: 9px; font-weight: bold; color: #facc15; margin-top: 2px;">
            ${status.current.title}
          </div>
          <div style="font-size: 7px; color: #cbd5e1; margin-top: 2px;">📍 ${status.current.location}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto;">
          ${sched.map(s => {
            const isCurrent = s.time === status.current.time;
            return `
              <div style="background: ${isCurrent ? '#0c4a6e' : '#1e293b'}; border: 1px solid ${isCurrent ? '#38bdf8' : '#334155'}; padding: 6px 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 7px; font-weight: bold; color: ${isCurrent ? '#facc15' : '#f8fafc'};">${s.time} — ${s.title}</div>
                  <div style="font-size: 6px; color: #94a3b8;">📍 ${s.location}</div>
                </div>
                ${s.targetLocId ? `<button class="nes-btn is-primary btn-nav-class" data-loc-id="${s.targetLocId}" style="font-size: 6px; padding: 2px 6px;">GO</button>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;

      viewport.querySelectorAll('.btn-nav-class').forEach(btn => {
        btn.addEventListener('click', () => {
          const locId = parseInt(btn.dataset.locId, 10);
          document.getElementById('generic-modal')?.classList.add('hidden');
          this.game.fastTravelTo(locId);
        });
      });
    } else if (appId === 'academics') {
      const summary = this.game.academicSystem.getAcademicSummary();
      viewport.innerHTML = `
        <div style="font-size: 8px; color: #10b981; font-weight: bold; margin-bottom: 8px;">
          📊 ACADEMIC TRANSCRIPT &amp; CGPA
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 10px;">
          <div style="background: #020617; border: 1px solid #10b981; padding: 8px; border-radius: 4px; text-align: center;">
            <div style="font-size: 6px; color: #94a3b8;">CUMULATIVE CGPA</div>
            <div style="font-size: 16px; font-weight: bold; color: #10b981;">${summary.cgpa} / 10.0</div>
          </div>
          <div style="background: #020617; border: 1px solid #38bdf8; padding: 8px; border-radius: 4px; text-align: center;">
            <div style="font-size: 6px; color: #94a3b8;">ATTENDANCE RATE</div>
            <div style="font-size: 16px; font-weight: bold; color: #38bdf8;">${summary.attendancePct}%</div>
            <div style="font-size: 6px; color: #64748b;">${summary.attendedCount}/${summary.totalCount} Attended</div>
          </div>
        </div>

        <div style="font-size: 7px; color: #facc15; font-weight: bold; margin-bottom: 6px;">REGISTERED COURSES (${summary.departmentCode})</div>
        <div style="display: flex; flex-direction: column; gap: 6px; max-height: 180px; overflow-y: auto;">
          ${summary.courses.map(c => `
            <div style="background: #1e293b; border: 1px solid #334155; padding: 6px 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 7px; font-weight: bold; color: #f8fafc;">${c.code}: ${c.name}</div>
                <div style="font-size: 6px; color: #94a3b8;">Prof: ${c.prof} · ${c.credits} Credits</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 10px; font-weight: bold; color: #facc15;">${c.progress.grade}</span>
                <div style="font-size: 6px; color: #34d399;">Score: ${c.progress.score}%</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (appId === 'social') {
      const posts = this.game.socialFeedSystem.getPosts();
      viewport.innerHTML = `
        <div style="font-size: 8px; color: #f59e0b; font-weight: bold; margin-bottom: 8px;">
          💬 UOH CAMPUS SOCIAL FEED
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
          ${posts.map(p => `
            <div style="background: #1e293b; border: 1px solid #334155; padding: 8px; border-radius: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 14px;">${p.avatar}</span>
                  <div>
                    <strong style="font-size: 7px; color: #38bdf8;">${p.author}</strong>
                    <span style="font-size: 6px; color: #64748b;">${p.handle} · ${p.time}</span>
                  </div>
                </div>
                <span style="font-size: 6px; background: #0f172a; padding: 2px 4px; color: #facc15; border-radius: 2px;">${p.club}</span>
              </div>
              <p style="font-size: 7px; font-family: var(--body-font); line-height: 1.4; color: #f8fafc; margin: 0 0 6px 0;">${p.content}</p>
              <div style="text-align: right;">
                <button class="nes-btn btn-like-post" data-post-id="${p.id}" style="font-size: 6px; padding: 2px 6px;">❤️ ${p.likes}</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      viewport.querySelectorAll('.btn-like-post').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.dataset.postId;
          const newLikes = this.game.socialFeedSystem.likePost(pid);
          btn.textContent = `❤️ ${newLikes}`;
        });
      });
    } else if (appId === 'news') {
      viewport.innerHTML = `
        <div style="font-size: 8px; color: #ef4444; font-weight: bold; margin-bottom: 8px;">
          📰 OFFICIAL UOH CAMPUS NEWS &amp; NOTICES
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="background: #1e293b; border: 1px solid #ef4444; padding: 8px; border-radius: 4px;">
            <div style="font-size: 8px; font-weight: bold; color: #fca5a5;">🏛️ Annual University Athletic Meet</div>
            <div style="font-size: 6px; color: #94a3b8; margin: 2px 0 4px 0;">GMC Balayogi Sports Complex &amp; Stadium (#92/#93)</div>
            <p style="font-size: 7px; font-family: var(--body-font); color: #cbd5e1; margin: 0;">Sprint races, volleyball tournaments, and badminton finals open for student registrations.</p>
          </div>
          <div style="background: #1e293b; border: 1px solid #3b82f6; padding: 8px; border-radius: 4px;">
            <div style="font-size: 8px; font-weight: bold; color: #93c5fd;">💻 SCIS AI &amp; Robotics Research Expo</div>
            <div style="font-size: 6px; color: #94a3b8; margin: 2px 0 4px 0;">School of Computer Sciences (#45)</div>
            <p style="font-size: 7px; font-family: var(--body-font); color: #cbd5e1; margin: 0;">Exhibition of student autonomous e-shuttles and neural network models.</p>
          </div>
        </div>
      `;
    } else if (appId === 'profile') {
      this.showStudentProfile();
    } else if (appId === 'clubs') {
      this.showClubModal();
    } else if (appId === 'map') {
      document.getElementById('generic-modal')?.classList.add('hidden');
      this.toggleCampusMap();
    } else if (appId === 'settings') {
      document.getElementById('generic-modal')?.classList.add('hidden');
      this.toggleSettings();
    }
  }
}

