import { soundManager } from '../game/AudioSynth.js';

/**
 * Settings, Controls Guide, CRT Scanlines Toggle, Manual Save & Reset Modal
 * Retro NES Pixel art styling matching peteroravec.com
 */
export class SettingsUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    if (this.isOpen) {
      soundManager.playMenuOpen();
      this.render(content);
      modal.classList.remove('hidden');
    } else {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    }
  }

  render(content) {
    const crtActive = this.uiManager.crtEnabled;

    content.innerHTML = `
      <div class="frame-wrp" style="max-width: 680px;">
        <div class="frame-wrp-inner">
          <button aria-label="Close" class="nes-btn is-error close-btn-position" id="btn-close-settings">×</button>
          <div class="frame pixel-corners">
            <h2 class="big-title">Settings &amp; Controls Guide</h2>

            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 10px; color: #60a5fa; margin-bottom: 10px;">🎮 NES &amp; PC Controls</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px;">
                <div style="background: #1e293b; border: 2px solid #000; padding: 8px;">
                  <span style="color: #facc15; font-size: 8px; display: block;">WASD / ARROWS</span>
                  <span style="color: #cbd5e1; font-size: 7px;">Walk / Move Player</span>
                </div>
                <div style="background: #1e293b; border: 2px solid #000; padding: 8px;">
                  <span style="color: #facc15; font-size: 8px; display: block;">SHIFT (HOLD)</span>
                  <span style="color: #cbd5e1; font-size: 7px;">Sprint / Fast Run</span>
                </div>
                <div style="background: #1e293b; border: 2px solid #000; padding: 8px;">
                  <span style="color: #facc15; font-size: 8px; display: block;">E / SPACE / ENTER</span>
                  <span style="color: #cbd5e1; font-size: 7px;">Interact with NPCs &amp; Doors</span>
                </div>
                <div style="background: #1e293b; border: 2px solid #000; padding: 8px;">
                  <span style="color: #facc15; font-size: 8px; display: block;">M</span>
                  <span style="color: #cbd5e1; font-size: 7px;">Campus Map &amp; Fast Travel</span>
                </div>
                <div style="background: #1e293b; border: 2px solid #000; padding: 8px;">
                  <span style="color: #facc15; font-size: 8px; display: block;">J / B</span>
                  <span style="color: #cbd5e1; font-size: 7px;">Campus Discovery Book</span>
                </div>
                <div style="background: #1e293b; border: 2px solid #000; padding: 8px;">
                  <span style="color: #facc15; font-size: 8px; display: block;">U</span>
                  <span style="color: #cbd5e1; font-size: 7px;">Unstuck / Safe Road Warp</span>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 10px; color: #facc15; margin-bottom: 10px;">📺 Visuals &amp; Audio</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <button type="button" class="nes-btn ${crtActive ? 'is-success' : ''}" id="btn-toggle-crt">
                  📺 CRT Scanlines: ${crtActive ? 'ON' : 'OFF'}
                </button>
                <button type="button" class="nes-btn is-primary" id="btn-toggle-sound-settings">
                  🔊 Sound: ${soundManager.enabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 10px; color: #86efac; margin-bottom: 10px;">💾 Save &amp; Rescue Actions</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <button type="button" class="nes-btn is-primary" id="btn-manual-save">
                  💾 Save Game Now
                </button>
                <button type="button" class="nes-btn is-warning" id="btn-unstuck-player">
                  🧭 Unstuck Player
                </button>
                <button type="button" class="nes-btn is-error" id="btn-reset-game">
                  ⚠️ Reset Game
                </button>
              </div>
            </div>

            <div style="text-align: center; margin-top: 16px;">
              <button type="button" class="nes-btn" id="btn-close-settings-footer">
                Back to Game
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-settings')?.addEventListener('click', () => this.toggle());
    document.getElementById('btn-close-settings-footer')?.addEventListener('click', () => this.toggle());

    document.getElementById('btn-toggle-crt')?.addEventListener('click', () => {
      this.uiManager.crtEnabled = !this.uiManager.crtEnabled;
      const overlay = document.getElementById('crt-overlay');
      if (overlay) {
        if (this.uiManager.crtEnabled) overlay.classList.remove('hidden');
        else overlay.classList.add('hidden');
      }
      soundManager.playBtnClick();
      this.render(content);
    });

    document.getElementById('btn-toggle-sound-settings')?.addEventListener('click', () => {
      soundManager.toggleSound();
      this.render(content);
    });

    document.getElementById('btn-manual-save')?.addEventListener('click', () => {
      this.uiManager.game.autoSave();
      soundManager.playQuizCorrect();
      this.uiManager.showToast('💾 Progress saved to local storage!', 'success');
    });

    document.getElementById('btn-unstuck-player')?.addEventListener('click', () => {
      this.uiManager.game.respawnOnSafeRoad();
      this.toggle();
    });

    document.getElementById('btn-reset-game')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all discoveries and score to start a new game?')) {
        this.uiManager.game.saveSystem.clearSave();
        window.location.reload();
      }
    });
  }
}
