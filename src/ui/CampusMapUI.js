/**
 * Full-screen Interactive Campus Map Modal with 4-Section Regional Views & Fast Travel
 * Displays all 78 registered University of Hyderabad pins across:
 * - 🟢 North / Main Campus
 * - 🔵 South Campus
 * - 🟡 West Campus
 * - 🟣 East Campus
 */
export class CampusMapUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.isOpen = false;
    this.selectedSectionTab = 'active'; // 'active', 'main', 'south', 'west', 'east', 'overview'
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const modal = document.getElementById('map-modal');
    if (!modal) return;

    if (this.isOpen) {
      if (this.uiManager.game) {
        this.selectedSectionTab = this.uiManager.game.worldMap.currentSection || 'main';
      }
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
    const curSec = game.worldMap.currentSection;

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="frame-wrp" style="max-width: 1080px;">
        <div class="frame-wrp-inner">
          <button aria-label="Close" class="nes-btn is-error close-btn-position" id="btn-close-full-map">×</button>
          <div class="frame pixel-corners">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #334155; padding-bottom: 10px; margin-bottom: 12px;">
              <div>
                <h2 style="font-size: 13px; color: #f87171; margin-bottom: 4px;">🗺️ Regional Campus Radar Map</h2>
                <p style="font-size: 8px; color: #94a3b8;">Discover all ${game.locations.length} registered landmarks across the campus</p>
              </div>
              <div>
                <span class="chip" style="background: #1e293b; border: 2px solid #000; padding: 4px 8px; font-size: 8px; color: #fef08a;">
                  Progress: ${stats.discovered}/${stats.total} (${stats.percent}%)
                </span>
              </div>
            </div>

            <!-- Section Switcher Bar -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
              <button class="nes-btn ${this.selectedSectionTab === 'main' ? 'is-success' : ''}" data-sectab="main">🟢 NORTH / MAIN</button>
              <button class="nes-btn ${this.selectedSectionTab === 'south' ? 'is-primary' : ''}" data-sectab="south">🔵 SOUTH CAMPUS</button>
              <button class="nes-btn ${this.selectedSectionTab === 'west' ? 'is-warning' : ''}" data-sectab="west">🟡 WEST CAMPUS</button>
              <button class="nes-btn ${this.selectedSectionTab === 'east' ? 'is-error' : ''}" data-sectab="east">🟣 EAST CAMPUS</button>
              <button class="nes-btn ${this.selectedSectionTab === 'amphi_valley' ? 'is-success' : ''}" data-sectab="amphi_valley">🌲 WILDERNESS</button>
              <button class="nes-btn ${this.selectedSectionTab === 'overview' ? 'is-primary' : ''}" data-sectab="overview">🗺️ OVERVIEW</button>
            </div>

            <!-- Main Map Canvas & Sidebar Split -->
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              <div style="flex: 1; min-width: 320px; background: #000; border: 3px solid #000; box-shadow: inset 0 0 10px rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;">
                <canvas id="full-map-canvas" width="600" height="480" style="max-width: 100%; height: auto; display: block; image-rendering: pixelated;"></canvas>
              </div>

              <!-- Sidebar Fast Travel Portals -->
              <div style="width: 320px; max-width: 100%; display: flex; flex-direction: column; gap: 8px;">
                <h3 style="font-size: 9px; color: #facc15;">🚀 Fast Travel Portals</h3>
                <div style="max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
                  <!-- Main / North Campus -->
                  <button class="nes-btn is-success sec-main-btn" data-travel="37" style="text-align: left; font-size: 7px;">🏛️ Admission Office (#37)</button>
                  <button class="nes-btn is-success sec-main-btn" data-travel="48" style="text-align: left; font-size: 7px;">📚 Social Sciences (#48)</button>
                  <button class="nes-btn is-success sec-main-btn" data-travel="52" style="text-align: left; font-size: 7px;">📖 School of Humanities (#52)</button>
                  <button class="nes-btn is-success sec-main-btn" data-travel="27" style="text-align: left; font-size: 7px;">🪨 The Masoom's Rock (#27)</button>
                  <button class="nes-btn is-success sec-main-btn" data-travel="26" style="text-align: left; font-size: 7px;">🌊 Buffalo Lake (#26)</button>
                  <!-- South Campus -->
                  <button class="nes-btn is-primary sec-south-btn" data-travel="3" style="text-align: left; font-size: 7px;">🔬 Life Sciences (SLS) (#3)</button>
                  <button class="nes-btn is-primary sec-south-btn" data-travel="2" style="text-align: left; font-size: 7px;">🧬 ASPIRE BioNEST (#2)</button>
                  <button class="nes-btn is-primary sec-south-btn" data-travel="5" style="text-align: left; font-size: 7px;">🏫 Integrated Studies (CIS) (#5)</button>
                  <button class="nes-btn is-primary sec-south-btn" data-travel="21" style="text-align: left; font-size: 7px;">🎭 Amphitheatre UoH (#21)</button>
                  <button class="nes-btn is-primary sec-south-btn" data-travel="1" style="text-align: left; font-size: 7px;">🌊 Check Dam UoH (#1)</button>
                  <button class="nes-btn is-primary sec-south-btn" data-travel="13" style="text-align: left; font-size: 7px;">🏠 MHK Hostel (Dorm) (#13)</button>
                  <button class="nes-btn is-primary sec-south-btn" data-travel="9" style="text-align: left; font-size: 7px;">🛍️ South Shopping (#9)</button>
                  <!-- West Campus -->
                  <button class="nes-btn is-warning sec-west-btn" data-travel="30" style="text-align: left; font-size: 7px;">🏟️ Indoor Stadium & Gym (#30)</button>
                  <button class="nes-btn is-warning sec-west-btn" data-travel="73" style="text-align: left; font-size: 7px;">⚙️ Central Workshop (#73)</button>
                  <button class="nes-btn is-warning sec-west-btn" data-travel="75" style="text-align: left; font-size: 7px;">⛩️ Gate 3 IDC (#75)</button>
                  <!-- East Campus -->
                  <button class="nes-btn is-error sec-east-btn" data-travel="36" style="text-align: left; font-size: 7px;">🏛️ Admin Building (#36)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="51" style="text-align: left; font-size: 7px;">📚 IGM Library (#51)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="45" style="text-align: left; font-size: 7px;">💻 Computer Science (#45)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="59" style="text-align: left; font-size: 7px;">☕ Sukoon Canteen (#59)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="56" style="text-align: left; font-size: 7px;">🎭 SN School Main (#56)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="62" style="text-align: left; font-size: 7px;">📐 CR Rao AIMSCS (#62)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="92" style="text-align: left; font-size: 7px;">🏟️ Balayogi Athletics (#92)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="93" style="text-align: left; font-size: 7px;">🏊 Gachibowli Aquatics (#93)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="89" style="text-align: left; font-size: 7px;">🛕 Sai Baba Temple (#89)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="86" style="text-align: left; font-size: 7px;">🏛️ UoH Monument (#86)</button>
                  <button class="nes-btn is-error sec-east-btn" data-travel="28" style="text-align: left; font-size: 7px;">🌊 Peacock Lake (#28)</button>
                </div>
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
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (this.selectedSectionTab === 'overview') {
      this.drawFourSectionsOverview(ctx, w, h);
      return;
    }

    const targetSectionId = this.selectedSectionTab;
    const secCfg = game.worldMap.sectionConfigs[targetSectionId];
    if (!secCfg) return;

    const worldW = secCfg.width;
    const worldH = secCfg.height;
    const sx = w / worldW;
    const sy = h / worldH;

    // 1. Lush Section Terrain Ground
    ctx.fillStyle = '#4a7c36';
    ctx.fillRect(0, 0, w, h);

    // 1B. Earthen Agricultural Field Blocks
    for (const fb of secCfg.fieldBlocks || []) {
      ctx.fillStyle = '#8c6230';
      ctx.fillRect(fb.x * sx, fb.y * sy, fb.w * sx, fb.h * sy);
      ctx.strokeStyle = '#6a461e';
      ctx.lineWidth = 1;
      ctx.strokeRect(fb.x * sx, fb.y * sy, fb.w * sx, fb.h * sy);
    }

    // Subtle grid lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let x = 0; x < w; x += 16) {
      ctx.fillRect(x, 0, 1, h);
    }
    for (let y = 0; y < h; y += 16) {
      ctx.fillRect(0, y, w, 1);
    }

    // 2. Plazas & Quads
    for (const p of secCfg.plazas || []) {
      ctx.fillStyle = '#b8a070';
      ctx.fillRect(p.x * sx, p.y * sy, p.w * sx, p.h * sy);
      ctx.strokeStyle = '#947848';
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x * sx, p.y * sy, p.w * sx, p.h * sy);
    }

    // 3. Roads Network
    for (const [x1, y1, x2, y2, rw, isTrail] of secCfg.roads || []) {
      if (isTrail) {
        ctx.strokeStyle = '#8b6943';
        ctx.lineWidth = Math.max(2, rw * sx * 0.8);
        ctx.beginPath();
        ctx.moveTo(x1 * sx, y1 * sy);
        ctx.lineTo(x2 * sx, y2 * sy);
        ctx.stroke();
      } else {
        // Road curb
        ctx.strokeStyle = '#7c6848';
        ctx.lineWidth = Math.max(3, (rw + 4) * sx);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1 * sx, y1 * sy);
        ctx.lineTo(x2 * sx, y2 * sy);
        ctx.stroke();

        // Asphalt surface
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = Math.max(2, rw * sx);
        ctx.beginPath();
        ctx.moveTo(x1 * sx, y1 * sy);
        ctx.lineTo(x2 * sx, y2 * sy);
        ctx.stroke();
      }
    }

    // 4. Checkpoint Gates
    for (const cp of secCfg.checkpoints || []) {
      ctx.fillStyle = '#eab308';
      ctx.fillRect(cp.x * sx, cp.y * sy, Math.max(6, cp.width * sx), Math.max(6, cp.height * sy));
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cp.x * sx, cp.y * sy, Math.max(6, cp.width * sx), Math.max(6, cp.height * sy));

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${cp.shortLabel || '⛩️ Gate'}`, cp.x * sx + (cp.width * sx) / 2, cp.y * sy - 4);
    }

    // 5. Water Bodies
    for (const lake of secCfg.waterBodies || []) {
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.ellipse(lake.x * sx, lake.y * sy, lake.radiusX * sx, lake.radiusY * sy, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lake.name, lake.x * sx, lake.y * sy + 3);
    }

    // 6. Buildings & Landmarks in this section
    const secLocs = game.locations.filter(loc => loc.section === targetSectionId);
    for (const loc of secLocs) {
      if (loc.isLake) continue;

      const isDisc = game.discoverySystem.isDiscovered(loc.id);
      const bx = loc.x * sx;
      const by = loc.y * sy;
      const bw = Math.max(8, loc.width * sx);
      const bh = Math.max(7, loc.height * sy);

      // Color coding
      if (loc.category === 'academic') ctx.fillStyle = isDisc ? '#1d4ed8' : '#64748b';
      else if (loc.category === 'research') ctx.fillStyle = isDisc ? '#059669' : '#64748b';
      else if (loc.category === 'residential') ctx.fillStyle = isDisc ? '#d97706' : '#64748b';
      else if (loc.category === 'sports') ctx.fillStyle = isDisc ? '#0d9488' : '#64748b';
      else if (loc.category === 'nature-rocks') ctx.fillStyle = isDisc ? '#4b5563' : '#64748b';
      else if (loc.category === 'amenities' || loc.isNightCanteen) ctx.fillStyle = isDisc ? '#db2777' : '#64748b';
      else ctx.fillStyle = isDisc ? '#ea580c' : '#64748b';

      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);

      // Number badge
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(bx + bw / 2, by + bh / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 6px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${loc.id}`, bx + bw / 2, by + bh / 2);
    }

    // 7. Player Marker (if player is currently in this section)
    if (game.worldMap.currentSection === targetSectionId) {
      const px = game.player.x * sx;
      const py = game.player.y * sy;

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('YOU', px, py - 12);
    }
  }

  drawFourSectionsOverview(ctx, w, h) {
    const game = this.uiManager.game;

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    // Title banner
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNIVERSITY OF HYDERABAD — REGIONAL HUBS & BUFFER ROUTES', w / 2, 32);

    // Draw Section Quadrants & Connector
    const pad = 35;
    const boxW = (w - pad * 3) / 2;
    const boxH = (h - pad * 3 - 35) / 2;

    const sections = [
      { id: 'west', name: '🟡 WEST CAMPUS', sub: `Stadium, IDC & Gate 3 (${game.locations.filter(l => l.section === 'west').length} POIs)`, x: pad, y: pad + 15, w: boxW, h: boxH, color: 'rgba(234, 179, 8, 0.20)', border: '#eab308' },
      { id: 'main', name: '🟢 NORTH / MAIN CAMPUS', sub: `Humanities, Social Sciences & Lakes (${game.locations.filter(l => l.section === 'main').length} POIs)`, x: pad * 2 + boxW, y: pad + 15, w: boxW, h: boxH, color: 'rgba(168, 85, 247, 0.20)', border: '#10b981' },
      { id: 'south', name: '🔵 SOUTH CAMPUS', sub: `SLS Road & Hostels Quads (${game.locations.filter(l => l.section === 'south').length} POIs)`, x: pad, y: pad * 2 + 15 + boxH, w: boxW, h: boxH, color: 'rgba(37, 99, 235, 0.20)', border: '#2563eb' },
      { id: 'east', name: '🟣 EAST CAMPUS', sub: `Academic Core, Sports & Sukoon (${game.locations.filter(l => l.section === 'east').length} POIs)`, x: pad * 2 + boxW, y: pad * 2 + 15 + boxH, w: boxW, h: boxH, color: 'rgba(168, 85, 247, 0.20)', border: '#a855f7' }
    ];

    sections.forEach(s => {
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.strokeStyle = s.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(s.x, s.y, s.w, s.h);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(s.name, s.x + 12, s.y + 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(s.sub, s.x + 12, s.y + 34);

      if (game.worldMap.currentSection === s.id) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(s.x + s.w - 105, s.y + 6, 95, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📍 YOU ARE HERE', s.x + s.w - 58, s.y + 18);
      }
    });

    // 1. Check Dam Buffer Badge (Between West & South)
    const cdX = pad + boxW * 0.15;
    const cdY = pad + 15 + boxH - 22;
    const cdW = boxW * 0.7;
    const cdH = 44;

    ctx.fillStyle = game.worldMap.currentSection === 'checkdam_buffer' ? 'rgba(2, 132, 199, 0.9)' : 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(cdX, cdY, cdW, cdH);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(cdX, cdY, cdW, cdH);

    const cdCount = game.locations.filter(l => l.section === 'checkdam_buffer').length;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🌊 CHECK DAM BUFFER (${cdCount} POIs)`, cdX + cdW / 2, cdY + 18);

    ctx.fillStyle = '#7dd3fc';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('Check Dam · Globe Rock · Temple (West ↔ South)', cdX + cdW / 2, cdY + 32);

    // 2. Amphi Valley Buffer Badge (Between Main & South)
    const amphiX = pad * 2 + boxW * 0.05;
    const amphiY = pad + 15 + boxH - 22;
    const amphiW = boxW * 0.7;
    const amphiH = 44;

    ctx.fillStyle = game.worldMap.currentSection === 'amphi_valley' ? 'rgba(5, 150, 105, 0.9)' : 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(amphiX, amphiY, amphiW, amphiH);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(amphiX, amphiY, amphiW, amphiH);

    const amphiCount = game.locations.filter(l => l.section === 'amphi_valley').length;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🌲 AMPHI VALLEY BUFFER (${amphiCount} POIs)`, amphiX + amphiW / 2, amphiY + 18);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('Amphitheatre UoH · Amphi Lake (Main ↔ South)', amphiX + amphiW / 2, amphiY + 32);

    // Draw Main Campus Road Spine (Connecting highway through buffer routes)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // West to Main
    ctx.moveTo(pad + boxW * 0.7, pad + 15 + boxH * 0.4);
    ctx.lineTo(pad * 2 + boxW * 0.3, pad + 15 + boxH * 0.4);
    // West to Check Dam to South
    ctx.moveTo(pad + boxW * 0.5, pad + 15 + boxH * 0.7);
    ctx.lineTo(cdX + cdW / 2, cdY + cdH / 2);
    ctx.lineTo(pad + boxW * 0.3, pad * 2 + 15 + boxH + 30);
    // Main to Amphi Valley to South
    ctx.moveTo(pad * 2 + boxW * 0.2, pad + 15 + boxH * 0.7);
    ctx.lineTo(amphiX + amphiW / 2, amphiY + amphiH / 2);
    ctx.lineTo(pad + boxW * 0.85, pad * 2 + 15 + boxH + 30);
    // Main to East
    ctx.moveTo(pad * 2 + boxW * 0.7, pad + 15 + boxH * 0.6);
    ctx.lineTo(pad * 2 + boxW * 0.3, pad * 2 + 15 + boxH * 0.3);
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔴 Main Campus Connecting Highway & Scenic Checkpoint Routes', w / 2, h - 8);
  }

  bindEvents(modal) {
    document.getElementById('btn-close-full-map')?.addEventListener('click', () => {
      soundManager.playMenuClose();
      this.toggle();
    });

    modal.querySelectorAll('[data-sectab]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        soundManager.playBtnClick();
        this.selectedSectionTab = e.currentTarget.getAttribute('data-sectab');
        this.render();
        this.drawFullMap();
      });
    });

    modal.querySelectorAll('[data-travel]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const locId = parseInt(e.currentTarget.getAttribute('data-travel'), 10);
        soundManager.playDoorTransition();
        this.uiManager.game.fastTravelTo(locId);
        this.toggle();
      });
    });
  }
}
