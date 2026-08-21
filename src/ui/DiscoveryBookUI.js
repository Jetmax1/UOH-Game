import { soundManager } from '../game/AudioSynth.js';

/**
 * Pokémon FireRed Pokédex-Style Campus Discovery Book
 */
export class DiscoveryBookUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.currentTab = 'all'; // 'all', 'nature', 'academic', 'residential', 'sports', 'quests'
    this.searchQuery = '';
    this.selectedLocationId = 1;
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const modal = document.getElementById('book-modal');
    if (!modal) return;

    if (this.isOpen) {
      soundManager.playInteract();
      this.render();
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  toggleToQuests() {
    this.currentTab = 'quests';
    if (!this.isOpen) {
      this.toggle();
    } else {
      this.render();
    }
  }

  render() {
    const modal = document.getElementById('book-modal');
    if (!modal || !this.uiManager.game) return;

    const stats = this.uiManager.game.discoverySystem.getDiscoveryStats();
    const quests = this.uiManager.game.questSystem.getAllQuestsWithProgress();

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="pokedex-casing">
          <!-- Pokédex Top Sensor Bar -->
          <div class="pokedex-top-bar">
            <div class="pokedex-big-blue-lens"></div>
            <div class="pokedex-leds">
              <span class="pokedex-led led-red"></span>
              <span class="pokedex-led led-yellow"></span>
              <span class="pokedex-led led-green"></span>
            </div>
            <div class="pokedex-title-badge">UoH CAMPUSDEX v1.0</div>
            <button class="pokedex-close-btn" id="btn-close-pokedex">✕</button>
          </div>

          <!-- Pokédex Navigation Tabs -->
          <div class="pokedex-tabs-row">
            <button class="pokedex-tab ${this.currentTab === 'all' ? 'active' : ''}" data-tab="all">ALL (#78)</button>
            <button class="pokedex-tab ${this.currentTab === 'nature' ? 'active' : ''}" data-tab="nature">LAKES & ROCKS</button>
            <button class="pokedex-tab ${this.currentTab === 'academic' ? 'active' : ''}" data-tab="academic">ACADEMIC</button>
            <button class="pokedex-tab ${this.currentTab === 'residential' ? 'active' : ''}" data-tab="residential">HOSTELS</button>
            <button class="pokedex-tab ${this.currentTab === 'sports' ? 'active' : ''}" data-tab="sports">SPORTS & AMENITIES</button>
            <button class="pokedex-tab ${this.currentTab === 'quests' ? 'active' : ''}" data-tab="quests">QUESTS (${quests.filter(q => q.isComplete).length}/${quests.length})</button>
          </div>

          <!-- Main Pokédex Screen -->
          <div class="pokedex-screen-frame">
            ${this.currentTab === 'quests' ? this.renderQuestsView(quests) : this.renderPokedexDualPane(stats)}
          </div>

          <!-- Pokédex Bottom Action Bar -->
          <div class="pokedex-bottom-bar">
            <div class="pokedex-dpad-icon">➕</div>
            <div class="pokedex-stats-readout">
              DISCOVERED: <strong>${stats.discovered} / ${stats.total}</strong> (${stats.percent}%) &nbsp;|&nbsp; SCORE: <strong>${stats.score} PTS</strong>
            </div>
            <div class="pokedex-buttons">
              <span class="pokedex-btn-pill btn-a">A SELECT</span>
              <span class="pokedex-btn-pill btn-b">B BACK</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(modal);
  }

  renderPokedexDualPane(stats) {
    const allLocs = this.uiManager.game.discoverySystem.getAllLocationsWithStatus();

    // Filter
    let filtered = allLocs.filter(loc => {
      if (this.currentTab === 'nature') return loc.category === 'nature-rocks' || loc.isLake || loc.isMajorWonder;
      if (this.currentTab === 'academic') return loc.category === 'academic' || loc.category === 'research';
      if (this.currentTab === 'residential') return loc.category === 'residential';
      if (this.currentTab === 'sports') return loc.category === 'sports' || loc.category === 'student-life' || loc.category === 'amenities';
      return true;
    });

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(loc =>
        loc.name.toLowerCase().includes(q) ||
        loc.shortName.toLowerCase().includes(q) ||
        `#${loc.id}`.includes(q)
      );
    }

    // Default selection
    if (!filtered.some(l => l.id === this.selectedLocationId) && filtered.length > 0) {
      this.selectedLocationId = filtered[0].id;
    }

    const selectedLoc = allLocs.find(l => l.id === this.selectedLocationId) || filtered[0] || allLocs[0];
    const isSelDiscovered = selectedLoc.isDiscovered;

    return `
      <div class="pokedex-dual-layout">
        <!-- Left Pane: Location Index List -->
        <div class="pokedex-list-pane">
          <div class="pokedex-search-box">
            <input type="text" id="pokedex-search" placeholder="🔍 Search Campusdex..." value="${this.searchQuery}">
          </div>
          <div class="pokedex-items-scroll">
            ${filtered.map(loc => `
              <div class="pokedex-entry-row ${loc.id === this.selectedLocationId ? 'selected' : ''} ${loc.isDiscovered ? 'entry-discovered' : 'entry-hidden'}" data-loc-id="${loc.id}">
                <span class="entry-ball">${loc.isDiscovered ? '🔴' : '⚪'}</span>
                <span class="entry-num">No. ${String(loc.id).padStart(3, '0')}</span>
                <span class="entry-name">${loc.isDiscovered ? loc.shortName : '----------'}</span>
                <span class="entry-check">${loc.isDiscovered ? '✓' : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right Pane: Detail Display Card -->
        <div class="pokedex-detail-pane">
          <div class="pokedex-detail-card">
            <div class="detail-card-top">
              <div class="detail-num-tag">No. ${String(selectedLoc.id).padStart(3, '0')}</div>
              <div class="detail-category-badge">${selectedLoc.category.toUpperCase()}</div>
            </div>

            <h3 class="detail-title">${isSelDiscovered ? selectedLoc.name : 'Unknown Campus Landmark'}</h3>

            <div class="detail-photo-box">
              <div class="detail-icon-display">${isSelDiscovered ? (selectedLoc.isLake ? '🌊' : (selectedLoc.id === 76 ? '🍄' : '🏛️')) : '❓'}</div>
              <div class="detail-zone-label">${selectedLoc.zone.toUpperCase()} ZONE</div>
            </div>

            <div class="detail-description">
              ${isSelDiscovered
                ? `<p>${selectedLoc.description}</p>`
                : `<p class="undisc-hint">Location data unavailable. Visit this campus zone to register details and earn exploration score.</p>`}
            </div>

            ${isSelDiscovered && selectedLoc.trivia ? `
              <div class="detail-fact-box">
                <strong>💡 LORE:</strong> ${selectedLoc.trivia}
              </div>
            ` : ''}

            <div class="detail-footer">
              <span class="detail-pts-tag">+${selectedLoc.points} PTS</span>
              <span class="detail-status-tag ${isSelDiscovered ? 'status-registered' : 'status-unseen'}">
                ${isSelDiscovered ? 'REGISTERED ★' : 'NOT FOUND'}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderQuestsView(quests) {
    return `
      <div class="pokedex-quests-pane">
        <h3 class="quests-pane-title">CAMPUS MISSION QUESTS</h3>
        <div class="pokedex-quests-list">
          ${quests.map(quest => `
            <div class="pokedex-quest-card ${quest.isComplete ? 'pokedex-quest-done' : ''}">
              <div class="pokedex-quest-top">
                <span class="pquest-icon">${quest.isComplete ? '🏆' : '🎯'}</span>
                <span class="pquest-title">${quest.title}</span>
                <span class="pquest-pts">+${quest.rewardPoints} PTS</span>
              </div>
              <p class="pquest-desc">${quest.description}</p>
              <div class="pquest-steps">
                ${quest.objectives.map(obj => `
                  <div class="pquest-step-item ${obj.completed ? 'step-done' : ''}">
                    <span>${obj.completed ? '🔴' : '⚪'}</span>
                    <span>${obj.description}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindEvents(modal) {
    document.getElementById('btn-close-pokedex')?.addEventListener('click', () => this.toggle());

    modal.querySelectorAll('.pokedex-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        soundManager.playInteract();
        this.currentTab = e.currentTarget.dataset.tab;
        this.render();
      });
    });

    const searchInput = document.getElementById('pokedex-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const screen = modal.querySelector('.pokedex-screen-frame');
        if (screen) {
          const stats = this.uiManager.game.discoverySystem.getDiscoveryStats();
          screen.innerHTML = this.renderPokedexDualPane(stats);
          this.bindEntryClickEvents(modal);
        }
      });
    }

    this.bindEntryClickEvents(modal);
  }

  bindEntryClickEvents(modal) {
    modal.querySelectorAll('.pokedex-entry-row').forEach(row => {
      row.addEventListener('click', (e) => {
        soundManager.playInteract();
        this.selectedLocationId = parseInt(e.currentTarget.dataset.locId, 10);
        const stats = this.uiManager.game.discoverySystem.getDiscoveryStats();
        const screen = modal.querySelector('.pokedex-screen-frame');
        if (screen) {
          screen.innerHTML = this.renderPokedexDualPane(stats);
          this.bindEntryClickEvents(modal);
        }
      });
    });
  }
}
