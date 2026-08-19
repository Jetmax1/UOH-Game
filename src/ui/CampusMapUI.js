/**
 * Full-screen Interactive Campus Map Modal with live player pin and fast-travel
 */
export class CampusMapUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const modal = document.getElementById('map-modal');
    if (!modal) return;

    if (this.isOpen) {
      this.render();
      modal.classList.remove('hidden');
      this.drawFullMap();
    } else {
      modal.classList.add('hidden');
    }
  }

  render() {
    const modal = document.getElementById('map-modal');
    if (!modal || !this.uiManager.game) return;

    const game = this.uiManager.game;
    const stats = game.discoverySystem.getDiscoveryStats();

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="map-modal-container glass-panel">
          <!-- Header -->
          <div class="map-modal-header">
            <div class="map-title-group">
              <span class="map-icon">🗺️</span>
              <div>
                <h2>University of Hyderabad — Interactive Campus Map</h2>
                <p class="map-subtitle">Full World Layout & Real Locations Index (76 Buildings, 5 Lakes, 3 Gates)</p>
              </div>
            </div>
            <div class="map-header-right">
              <span class="map-stats-badge">Discovery Progress: <strong>${stats.discovered}/${stats.total} (${stats.percent}%)</strong></span>
              <button class="modal-close-btn" id="btn-close-full-map">✕</button>
            </div>
          </div>

          <!-- Main Map Canvas & Legend Split -->
          <div class="map-body-layout">
            <div class="map-canvas-wrapper">
              <canvas id="full-map-canvas" width="800" height="750"></canvas>
            </div>

            <!-- Sidebar Fast Travel & Legend -->
            <div class="map-sidebar">
              <h3>🚀 Fast Travel Portals</h3>
              <p class="sidebar-tip">Jump to unlocked gates and major hubs:</p>
              <div class="fast-travel-grid">
                <button class="btn btn-travel" data-travel="108">⛩️ Gate I (North)</button>
                <button class="btn btn-travel" data-travel="109">⛩️ Gate II (East)</button>
                <button class="btn btn-travel" data-travel="110">⛩️ Gate III (South)</button>
                <button class="btn btn-travel" data-travel="1">🏛️ Admin Building</button>
                <button class="btn btn-travel" data-travel="12">📚 IGM Library</button>
                <button class="btn btn-travel" data-travel="27">☕ Zakir Food Court</button>
                <button class="btn btn-travel" data-travel="10">💻 Computer Science</button>
                <button class="btn btn-travel" data-travel="15">📈 Management Studies</button>
                <button class="btn btn-travel" data-travel="47">🏟️ UoH Stadium</button>
                <button class="btn btn-travel" data-travel="73">🔬 Life Sciences (SLS)</button>
                <button class="btn btn-travel" data-travel="111">🎭 Amphitheatre (South)</button>
                <button class="btn btn-travel" data-travel="67">🏠 MHK Hostel (Dorm)</button>
                <button class="btn btn-travel" data-travel="101">🌊 Gundla Kunta</button>
                <button class="btn btn-travel" data-travel="76">🍄 Mushroom Rock</button>
                <button class="btn btn-travel" data-travel="112">🌊 Secret Lake</button>
              </div>

              <div class="map-legend">
                <h4>🎨 Map Legend</h4>
                <div class="legend-item"><span class="legend-swatch" style="background:#2980b9;"></span> Lakes & Water Bodies</div>
                <div class="legend-item"><span class="legend-swatch" style="background:#9c3d3d;"></span> Academic Schools</div>
                <div class="legend-item"><span class="legend-swatch" style="background:#1f618d;"></span> Research Institutes</div>
                <div class="legend-item"><span class="legend-swatch" style="background:#b9770e;"></span> Hostels & Housing</div>
                <div class="legend-item"><span class="legend-swatch" style="background:#16a085;"></span> Sports & Athletics</div>
                <div class="legend-item"><span class="legend-swatch" style="background:#7f8c8d;"></span> Natural Rocks & Heritage</div>
                <div class="legend-item"><span class="legend-swatch" style="background:#e74c3c; border-radius:50%;"></span> You Are Here</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(modal);
  }

  drawFullMap() {
    const canvas = document.getElementById('full-map-canvas');
    if (!canvas || !this.uiManager.game) return;

    const ctx = canvas.getContext('2d');
    const game = this.uiManager.game;
    const worldW = game.worldMap.width;
    const worldH = game.worldMap.height;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const sx = w / worldW;
    const sy = h / worldH;

    // 1. Lush Campus Ground
    ctx.fillStyle = '#5c8a3c';
    ctx.fillRect(0, 0, w, h);

    // 2. Water Bodies
    for (const lake of game.worldMap.waterBodies) {
      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.ellipse(lake.x * sx, lake.y * sy, lake.radiusX * sx, lake.radiusY * sy, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#1b4f72';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lake.name, lake.x * sx, lake.y * sy);
    }

    // 3. Roads Network
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 3;
    for (const [x1, y1, x2, y2] of game.worldMap.roads) {
      ctx.beginPath();
      ctx.moveTo(x1 * sx, y1 * sy);
      ctx.lineTo(x2 * sx, y2 * sy);
      ctx.stroke();
    }

    // 4. Buildings & Landmarks
    for (const loc of game.locations) {
      if (loc.isLake) continue;

      const isDisc = game.discoverySystem.isDiscovered(loc.id);
      const bx = loc.x * sx;
      const by = loc.y * sy;
      const bw = Math.max(4, loc.width * sx);
      const bh = Math.max(4, loc.height * sy);

      // Color coding
      if (loc.category === 'academic') ctx.fillStyle = isDisc ? '#9c3d3d' : '#5d6d7e';
      else if (loc.category === 'research') ctx.fillStyle = isDisc ? '#1f618d' : '#5d6d7e';
      else if (loc.category === 'residential') ctx.fillStyle = isDisc ? '#b9770e' : '#5d6d7e';
      else if (loc.category === 'sports') ctx.fillStyle = isDisc ? '#16a085' : '#5d6d7e';
      else if (loc.category === 'nature-rocks') ctx.fillStyle = isDisc ? '#7f8c8d' : '#5d6d7e';
      else ctx.fillStyle = isDisc ? '#f39c12' : '#7f8c8d';

      ctx.fillRect(bx, by, bw, bh);

      // Number badge if discovered or major
      if (loc.id <= 76 && (isDisc || loc.id % 5 === 0)) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${loc.id}`, bx + bw / 2, by + bh / 2 + 2);
      }
    }

    // 5. Player Marker
    const px = game.player.x * sx;
    const py = game.player.y * sy;

    // Pulsing radar ring
    ctx.strokeStyle = 'rgba(231, 76, 60, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('YOU', px, py - 12);
    ctx.shadowBlur = 0;
  }

  bindEvents(modal) {
    document.getElementById('btn-close-full-map')?.addEventListener('click', () => this.toggle());

    modal.querySelectorAll('.btn-travel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const locId = parseInt(e.currentTarget.dataset.travel, 10);
        this.uiManager.game.fastTravelTo(locId);
        this.toggle();
      });
    });
  }
}
