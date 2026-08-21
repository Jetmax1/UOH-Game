import { soundManager } from '../game/AudioSynth.js';
import { DiscoveryBookUI } from './DiscoveryBookUI.js';
import { CampusMapUI } from './CampusMapUI.js';
import { QuizUI } from './QuizUI.js';
import { NightActivitiesUI } from './NightActivitiesUI.js';
import { DialogUI } from './DialogUI.js';
import { SettingsUI } from './SettingsUI.js';

/**
 * Master UI Manager coordinating HUD, Minimap, Toasts, and Modals
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
  }

  setGame(game) {
    this.game = game;
    this.bindHUDButtons();
    this.initMinimap();
  }

  bindHUDButtons() {
    // Top Bar Buttons
    document.getElementById('btn-map')?.addEventListener('click', () => this.toggleCampusMap());
    document.getElementById('btn-book')?.addEventListener('click', () => this.toggleDiscoveryBook());
    document.getElementById('btn-quests')?.addEventListener('click', () => this.toggleQuestsModal());
    document.getElementById('btn-hud-unstuck')?.addEventListener('click', () => {
      if (this.game) this.game.respawnOnSafeRoad();
    });
    document.getElementById('btn-sound')?.addEventListener('click', () => {
      const enabled = soundManager.toggleSound();
      const icon = document.getElementById('sound-icon');
      if (icon) icon.textContent = enabled ? '🔊' : '🔇';
    });
    document.getElementById('btn-settings')?.addEventListener('click', () => this.toggleSettings());

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
    ctx.fillStyle = '#4f772d';
    ctx.fillRect(0, 0, w, h);

    // Scale ratios
    const sx = w / mapW;
    const sy = h / mapH;

    // Draw Lakes on Minimap
    ctx.fillStyle = '#2980b9';
    for (const lake of this.game.worldMap.waterBodies) {
      ctx.beginPath();
      ctx.ellipse(lake.x * sx, lake.y * sy, lake.radiusX * sx, lake.radiusY * sy, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Roads
    for (const [x1, y1, x2, y2, rw, isTrail] of this.game.worldMap.roads) {
      ctx.strokeStyle = isTrail ? '#9a7b56' : '#2c3e50';
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
      ctx.fillStyle = isDisc ? '#f59e0b' : 'rgba(255, 255, 255, 0.45)';
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
    let banner = document.getElementById('zone-transition-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'zone-transition-banner';
      banner.className = 'zone-banner';
      document.body.appendChild(banner);
    }

    banner.innerHTML = `
      <div class="zone-banner-casing">
        <div class="zone-banner-ribbon">
          <span class="zone-banner-title">${sector.name}</span>
          <span class="zone-banner-sub">${sector.sub}</span>
        </div>
      </div>
    `;

    banner.classList.remove('zone-banner-hide');
    banner.classList.add('zone-banner-show');

    if (this.zoneBannerTimeout) clearTimeout(this.zoneBannerTimeout);
    this.zoneBannerTimeout = setTimeout(() => {
      banner.classList.remove('zone-banner-show');
      banner.classList.add('zone-banner-hide');
    }, 2200);
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Clear old toast to prevent clutter
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `game-toast toast-${type} toast-enter`;
    toast.innerHTML = `
      <span class="toast-mini-icon">${type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️')}</span>
      <span class="toast-mini-text">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 2000);
  }

  showDiscoveryToast(location, points, totalScore) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Clear old toast so screen stays clean
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'game-toast toast-discovery toast-enter';
    toast.innerHTML = `
      <span class="toast-mini-icon">✨</span>
      <div class="toast-mini-body">
        <span class="toast-mini-title">${location.shortName || location.name}</span>
        <span class="toast-mini-sub">+${points} pts · Total: ${totalScore}</span>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  }

  showQuestCompletedToast(quest, points, totalScore) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'game-toast toast-quest-complete toast-enter';
    toast.innerHTML = `
      <span class="toast-mini-icon">🏆</span>
      <div class="toast-mini-body">
        <span class="toast-mini-title">Quest: ${quest.title}</span>
        <span class="toast-mini-sub">+${points} Bonus Pts!</span>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }

  showLocationInfo(location) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    const isDisc = this.game.discoverySystem.isDiscovered(location.id);

    content.innerHTML = `
      <div class="location-card">
        <div class="location-card-header">
          <span class="location-number">#${location.id}</span>
          <h2>${location.name}</h2>
          <span class="location-badge">${location.category.toUpperCase()}</span>
        </div>
        <p class="location-card-desc">${location.description}</p>
        <div class="location-card-trivia">
          <strong>💡 Campus Fact:</strong> ${location.trivia}
        </div>
        <div class="location-card-footer">
          <span>Status: ${isDisc ? '✅ Discovered' : '❓ Undiscovered'}</span>
          <button class="btn btn-primary" id="btn-close-loc-modal">Got it</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('btn-close-loc-modal')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
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
