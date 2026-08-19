import { soundManager } from '../game/AudioSynth.js';

/**
 * Night Life Modals: South Complex Night Canteen Menu + Dance Party Mini-Activity
 */
export class NightActivitiesUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
  }

  showCanteen(onOrderCallback) {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    const menuItems = [
      { id: 'chai', name: 'Piping Hot Irani Chai ☕', desc: 'Brewed with cardamom, rich creamy milk, and slow-cooked tea leaves.', points: 40, stamina: 40 },
      { id: 'biscuits', name: 'Osmania Biscuits (Plate of 4) 🍪', desc: 'Classic Hyderabadi buttery sweet-and-salty biscuits.', points: 30, stamina: 30 },
      { id: 'samosa', name: 'Crispy Onion Samosas 🥟', desc: 'Hot, crunchy, spiced samosas served with tangy mint chutney.', points: 45, stamina: 50 },
      { id: 'maggi', name: 'Midnight Masala Egg Maggi 🍜', desc: 'The quintessential hostel comfort food prepared with fried egg and extra masala.', points: 60, stamina: 75 }
    ];

    content.innerHTML = `
      <div class="canteen-menu-container glass-panel">
        <div class="canteen-header">
          <span class="canteen-badge">🌙 NIGHT CANTEEN (AFTER 10 PM)</span>
          <h2>South Complex Night Food Hub</h2>
          <p class="canteen-subtitle">Late-night snacks, hot chai, and spirited campus conversations!</p>
        </div>

        <div class="canteen-items-list">
          ${menuItems.map(item => `
            <div class="canteen-item-card">
              <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <span class="item-perk">+${item.points} Exploration Pts · +${item.stamina}% Stamina</span>
              </div>
              <button class="btn btn-primary btn-order-item" data-item-id="${item.id}">Order ➔</button>
            </div>
          `).join('')}
        </div>

        <div class="canteen-footer">
          <button class="btn btn-secondary" id="btn-close-canteen">Close Menu</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    modal.querySelectorAll('.btn-order-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.currentTarget.dataset.itemId;
        const chosen = menuItems.find(m => m.id === itemId);
        if (chosen) {
          soundManager.playQuizCorrect();
          this.uiManager.showToast(`😋 Delicious! You enjoyed ${chosen.name}. (+${chosen.points} Pts)`, 'success');
          if (onOrderCallback) onOrderCallback(chosen);
          modal.classList.add('hidden');
        }
      });
    });

    document.getElementById('btn-close-canteen')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  showParty() {
    const modal = document.getElementById('generic-modal');
    const content = document.getElementById('generic-modal-content');
    if (!modal || !content) return;

    soundManager.setAmbientMode('party');

    let hits = 0;
    const maxHits = 5;

    content.innerHTML = `
      <div class="party-modal-container glass-panel">
        <div class="party-header">
          <span class="party-badge">🎉 NIGHT SOCIAL JAM</span>
          <h2>South Complex Student Open-Mic & Beats</h2>
          <p class="party-subtitle">Feel the campus rhythm! Tap along to the synth groove!</p>
        </div>

        <div class="dance-arena">
          <div class="dj-deck">🎧 🎵 🪩 🕺 💃</div>
          <div class="dance-target-circle" id="beat-target">TAP THE BEAT!</div>
          <div class="dance-score-tally">Rhythm Hits: <strong id="party-hits-count">0 / ${maxHits}</strong></div>
        </div>

        <div class="party-footer">
          <button class="btn btn-secondary" id="btn-leave-party">Leave Dance Floor</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    const target = document.getElementById('beat-target');
    const tally = document.getElementById('party-hits-count');

    target?.addEventListener('click', () => {
      hits += 1;
      soundManager.playQuizCorrect();
      if (tally) tally.textContent = `${hits} / ${maxHits}`;

      target.classList.add('beat-hit-anim');
      setTimeout(() => target.classList.remove('beat-hit-anim'), 200);

      if (hits >= maxHits) {
        soundManager.playQuestComplete();
        this.uiManager.showToast(`🔥 Amazing rhythm! You cheered up the student crowd! (+60 Pts)`, 'success');
        this.uiManager.game.discoverySystem.addDirectScore(60, 'South Complex Party');
        this.uiManager.game.questSystem.onActionCompleted('south_party_attended');
        this.uiManager.game.autoSave();
        modal.classList.add('hidden');
      }
    });

    document.getElementById('btn-leave-party')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
}
