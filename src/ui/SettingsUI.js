import { soundManager } from '../game/AudioSynth.js';

/**
 * Settings, Controls Guide, Manual Save & Reset Modal
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
      this.render(content);
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  render(content) {
    content.innerHTML = `
      <div class="settings-container glass-panel">
        <div class="settings-header">
          <span class="settings-icon">⚙️</span>
          <h2>Campus Adventure Settings & Guide</h2>
          <button class="modal-close-btn" id="btn-close-settings">✕</button>
        </div>

        <div class="settings-section">
          <h3>🎮 Controls Guide</h3>
          <div class="controls-grid">
            <div class="control-item">
              <span class="key-badge">W A S D / Arrows</span>
              <span class="key-desc">Walk & Explore Campus</span>
            </div>
            <div class="control-item">
              <span class="key-badge">Shift (Hold)</span>
              <span class="key-desc">Sprint / Fast Run</span>
            </div>
            <div class="control-item">
              <span class="key-badge">E / Space / Enter</span>
              <span class="key-desc">Interact with NPCs, Doors & Quizzes</span>
            </div>
            <div class="control-item">
              <span class="key-badge">M</span>
              <span class="key-desc">Open Full Campus Map & Fast Travel</span>
            </div>
            <div class="control-item">
              <span class="key-badge">J / B</span>
              <span class="key-desc">Open Campus Discovery Book</span>
            </div>
            <div class="control-item">
              <span class="key-badge">Q</span>
              <span class="key-desc">View Exploration Quests</span>
            </div>
            <div class="control-item">
              <span class="key-badge">U</span>
              <span class="key-desc">Emergency Unstuck / Respawn on Road</span>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>💾 Game Progress & Save Management</h3>
          <div class="save-actions-row">
            <button class="btn btn-primary" id="btn-manual-save">💾 Save Game Now</button>
            <button class="btn btn-warning" id="btn-unstuck-player" style="background:#d97706; border-color:#fcd34d;">🧭 Unstuck Player (Respawn on Road)</button>
            <button class="btn btn-danger" id="btn-reset-game">⚠️ Reset Progress (New Game)</button>
          </div>
          <p class="save-note">Progress automatically saves when you discover landmarks, complete quests, pass quizzes, and sleep in your MHK hostel room.</p>
        </div>

        <div class="settings-section">
          <h3>🏛️ About UoH Campus Adventure</h3>
          <p class="about-text">
            Based on the authentic 2,300-acre campus of the University of Hyderabad (HCU / UoH).
            Recreates 78 indexed locations, 6 natural lakes & dams, 3 major gates, and ancient rock formations like The Masoom's Rock.
          </p>
        </div>

        <div class="settings-footer">
          <button class="btn btn-secondary" id="btn-close-settings-footer">Back to Game</button>
        </div>
      </div>
    `;

    document.getElementById('btn-close-settings')?.addEventListener('click', () => this.toggle());
    document.getElementById('btn-close-settings-footer')?.addEventListener('click', () => this.toggle());

    document.getElementById('btn-manual-save')?.addEventListener('click', () => {
      this.uiManager.game.autoSave();
      soundManager.playQuizCorrect();
      this.uiManager.showToast('💾 Game progress successfully saved to browser local storage!', 'success');
    });

    document.getElementById('btn-unstuck-player')?.addEventListener('click', () => {
      this.uiManager.game.respawnOnSafeRoad();
      this.toggle();
    });

    document.getElementById('btn-reset-game')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all discoveries, score, and quest progress and start a new student game?')) {
        this.uiManager.game.saveSystem.clearSave();
        window.location.reload();
      }
    });
  }
}
