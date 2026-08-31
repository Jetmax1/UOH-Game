/**
 * Full-screen Interactive Campus Map Modal
 * Fixed:
 * - Section tab buttons
 * - Fast travel buttons
 * - Canvas pin clicks
 * - Overview mode
 * - Wilderness / buffer sections
 * - Close button
 * - Modal re-rendering
 * - Missing sectionConfig protection
 */
export class CampusMapUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.isOpen = false;
    this.selectedSectionTab = 'main';

    // Prevent duplicate event listeners
    this._bound = false;
  }

  toggle() {
    const modal = document.getElementById('map-modal');

    if (!modal) {
      console.warn('[CampusMapUI] #map-modal not found');
      return;
    }

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      const game = this.uiManager?.game;

      if (game?.worldMap?.currentSection) {
        this.selectedSectionTab = game.worldMap.currentSection;
      } else {
        this.selectedSectionTab = 'main';
      }

      modal.classList.remove('hidden');

      this.render();
      this.drawFullMap();
    } else {
      modal.classList.add('hidden');
    }
  }

  close() {
    const modal = document.getElementById('map-modal');

    this.isOpen = false;

    if (modal) {
      modal.classList.add('hidden');
    }
  }

  render() {
    const modal = document.getElementById('map-modal');
    const game = this.uiManager?.game;

    if (!modal || !game) {
      console.warn('[CampusMapUI] Cannot render map');
      return;
    }

    const stats = game.discoverySystem?.getDiscoveryStats?.() || {
      discovered: 0,
      total: game.locations?.length || 0,
      percent: 0
    };

    const curSec = game.worldMap?.currentSection || 'main';

    modal.innerHTML = `
      <div class="modal-backdrop" id="map-backdrop"></div>

      <div class="frame-wrp" style="max-width: 1080px;">
        <div class="frame-wrp-inner">

          <button
            aria-label="Close"
            class="nes-btn is-error close-btn-position"
            id="btn-close-full-map"
            type="button"
          >
            ×
          </button>

          <div class="frame pixel-corners">

            <!-- HEADER -->
            <div
              style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                border-bottom:2px solid #334155;
                padding-bottom:10px;
                margin-bottom:12px;
              "
            >
              <div>
                <h2
                  style="
                    font-size:13px;
                    color:#f87171;
                    margin-bottom:4px;
                  "
                >
                  🗺️ Regional Campus Radar Map
                </h2>

                <p
                  style="
                    font-size:8px;
                    color:#94a3b8;
                  "
                >
                  Discover all ${game.locations?.length || 0}
                  registered landmarks across the campus
                </p>

                ${game.currentInterior
        ? `
                      <div
                        style="
                          margin-top:4px;
                          font-size:8px;
                          color:#fde047;
                          background:#0f172a;
                          border:1px solid #f59e0b;
                          padding:2px 6px;
                          display:inline-block;
                        "
                      >
                        📍 Current Location:
                        CAMPUS ➔ ${String(curSec).toUpperCase()}
                        ➔ <strong>${game.currentInterior.name}</strong>
                        (${game.currentInterior.floorLabel || '1F'})
                      </div>
                    `
        : ''
      }
              </div>

              <div>
                <span
                  class="chip"
                  style="
                    background:#1e293b;
                    border:2px solid #000;
                    padding:4px 8px;
                    font-size:8px;
                    color:#fef08a;
                  "
                >
                  Progress:
                  ${stats.discovered}/${stats.total}
                  (${stats.percent}%)
                </span>
              </div>
            </div>

            <!-- SECTION BUTTONS -->
            <div
              id="map-section-tabs"
              style="
                display:flex;
                flex-wrap:wrap;
                gap:6px;
                margin-bottom:12px;
              "
            >
              ${this.getSectionTabsHtml(game)}
            </div>

            <!-- MAP + SIDEBAR -->
            <div
              style="
                display:flex;
                flex-wrap:wrap;
                gap:16px;
              "
            >

              <!-- CANVAS -->
              <div
                style="
                  flex:1;
                  min-width:320px;
                  background:#000;
                  border:3px solid #000;
                  box-shadow:inset 0 0 10px rgba(0,0,0,0.8);
                  display:flex;
                  justify-content:center;
                  align-items:center;
                  position:relative;
                "
              >
                <canvas
                  id="full-map-canvas"
                  width="600"
                  height="420"
                  style="
                    max-width:100%;
                    height:auto;
                    display:block;
                    image-rendering:pixelated;
                    cursor:pointer;
                  "
                ></canvas>
              </div>

              <!-- SIDEBAR -->
              <div
                style="
                  width:300px;
                  max-width:100%;
                  display:flex;
                  flex-direction:column;
                  gap:8px;
                "
              >
                <h3
                  style="
                    font-size:9px;
                    color:#facc15;
                  "
                >
                  🚀 Fast Travel Portals
                </h3>

                <div
                  id="map-travel-list"
                  style="
                    max-height:380px;
                    overflow-y:auto;
                    display:flex;
                    flex-direction:column;
                    gap:6px;
                    padding-right:4px;
                  "
                >
                  ${this.getSidebarPortalsHtml(game)}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;

    // IMPORTANT:
    // The HTML was replaced, so bind events AFTER render.
    this.bindEvents(modal);
  }

  getSectionTabsHtml(game) {
    const tabs = [
      {
        id: 'main',
        label: '🟢 NORTH / MAIN',
        activeClass: 'is-success'
      },
      {
        id: 'south',
        label: '🔵 SOUTH CAMPUS',
        activeClass: 'is-primary'
      },
      {
        id: 'west',
        label: '🟡 WEST CAMPUS',
        activeClass: 'is-warning'
      },
      {
        id: 'east',
        label: '🟣 EAST CAMPUS',
        activeClass: 'is-error'
      },
      {
        id: 'amphi_valley',
        label: '🌲 WILDERNESS',
        activeClass: 'is-success'
      },
      {
        id: 'overview',
        label: '🗺️ OVERVIEW',
        activeClass: 'is-primary'
      }
    ];

    return tabs
      .map(tab => {
        const active =
          this.selectedSectionTab === tab.id
            ? tab.activeClass
            : '';

        return `
          <button
            type="button"
            class="nes-btn ${active}"
            data-sectab="${tab.id}"
          >
            ${tab.label}
          </button>
        `;
      })
      .join('');
  }

  getSidebarPortalsHtml(game) {
    const activeTab = this.selectedSectionTab;

    const filterSec =
      activeTab === 'overview'
        ? game.worldMap?.currentSection || 'main'
        : activeTab;

    const locations = game.locations || [];

    const locs = locations.filter(loc => {
      if (loc.isLake) return false;

      return loc.section === filterSec;
    });

    if (locs.length === 0) {
      return `
        <div
          style="
            font-size:7px;
            color:#94a3b8;
            font-style:italic;
            padding:8px;
          "
        >
          No fast travel portals registered in this zone.
        </div>
      `;
    }

    return locs
      .map(loc => {
        const isDisc =
          game.discoverySystem?.isDiscovered?.(loc.id) || false;

        let btnClass = 'is-error';

        if (loc.section === 'main') {
          btnClass = 'is-success';
        } else if (loc.section === 'south') {
          btnClass = 'is-primary';
        } else if (loc.section === 'west') {
          btnClass = 'is-warning';
        } else if (loc.section === 'east') {
          btnClass = 'is-error';
        } else if (loc.section === 'amphi_valley') {
          btnClass = 'is-success';
        }

        return `
          <button
            type="button"
            class="nes-btn ${btnClass}"
            data-travel="${loc.id}"
            style="
              text-align:left;
              font-size:7px;
              display:flex;
              justify-content:space-between;
              align-items:center;
              width:100%;
            "
          >
            <span>
              ${loc.icon || '🏛️'}
              #${loc.id}
              ${loc.shortName || loc.name}
            </span>

            ${isDisc
            ? `
                  <span
                    style="
                      font-size:6px;
                      color:#facc15;
                      margin-left:5px;
                    "
                  >
                    ✓ Discovered
                  </span>
                `
            : `
                  <span
                    style="
                      font-size:6px;
                      color:#94a3b8;
                      margin-left:5px;
                    "
                  >
                    🔒 Unknown
                  </span>
                `
          }
          </button>
        `;
      })
      .join('');
  }

  /**
   * Safely travel to a location.
   */
  travelToLocation(locId) {
    const game = this.uiManager?.game;

    if (!game) {
      console.warn('[CampusMapUI] Game unavailable');
      return;
    }

    const location = game.locations?.find(
      loc => Number(loc.id) === Number(locId)
    );

    if (!location) {
      console.warn(
        `[CampusMapUI] Location ${locId} does not exist`
      );
      return;
    }

    try {
      if (typeof soundManager !== 'undefined') {
        soundManager.playDoorTransition?.();
      }

      if (typeof game.fastTravelTo !== 'function') {
        console.error(
          '[CampusMapUI] game.fastTravelTo() does not exist'
        );
        return;
      }

      game.fastTravelTo(Number(locId));

      this.close();
    } catch (error) {
      console.error(
        '[CampusMapUI] Fast travel failed:',
        error
      );
    }
  }

  /**
   * Change map section.
   *
   * IMPORTANT:
   * We deliberately render again after changing the tab.
   * The newly-created DOM then receives fresh event listeners.
   */
  selectSection(sectionId) {
    if (!sectionId) return;

    this.selectedSectionTab = sectionId;

    this.render();
    this.drawFullMap();
  }

  bindEvents(modal) {
    if (!modal) return;

    /*
     * CLOSE BUTTON
     */
    const closeBtn =
      modal.querySelector('#btn-close-full-map');

    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof soundManager !== 'undefined') {
          soundManager.playMenuClose?.();
        }

        this.close();
      };
    }

    /*
     * BACKDROP
     */
    const backdrop =
      modal.querySelector('#map-backdrop');

    if (backdrop) {
      backdrop.onclick = (e) => {
        if (e.target !== backdrop) return;

        if (typeof soundManager !== 'undefined') {
          soundManager.playMenuClose?.();
        }

        this.close();
      };
    }

    /*
     * SECTION BUTTONS
     */
    modal
      .querySelectorAll('[data-sectab]')
      .forEach(tab => {
        tab.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const sectionId =
            e.currentTarget.getAttribute('data-sectab');

          if (!sectionId) return;

          if (typeof soundManager !== 'undefined') {
            soundManager.playBtnClick?.();
          }

          this.selectSection(sectionId);
        };
      });

    /*
     * FAST TRAVEL BUTTONS
     */
    modal
      .querySelectorAll('[data-travel]')
      .forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const locId =
            Number(
              e.currentTarget.getAttribute('data-travel')
            );

          if (!Number.isFinite(locId)) {
            console.warn(
              '[CampusMapUI] Invalid travel location:',
              locId
            );
            return;
          }

          this.travelToLocation(locId);
        };
      });

    /*
     * CANVAS PIN CLICK
     */
    const canvas =
      modal.querySelector('#full-map-canvas');

    if (canvas) {
      canvas.onclick = (e) => {
        this.handleCanvasClick(e, canvas);
      };
    }
  }

  handleCanvasClick(e, canvas) {
    const game = this.uiManager?.game;

    if (!game) return;

    const rect =
      canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const clickX =
      ((e.clientX - rect.left) / rect.width) *
      canvas.width;

    const clickY =
      ((e.clientY - rect.top) / rect.height) *
      canvas.height;

    /*
     * OVERVIEW:
     *
     * Clicking a normal section box switches to that
     * section instead of trying to use coordinates from
     * a section map.
     */
    if (this.selectedSectionTab === 'overview') {
      const section = this.getOverviewSectionAtPoint(
        clickX,
        clickY,
        canvas.width,
        canvas.height
      );

      if (section) {
        if (typeof soundManager !== 'undefined') {
          soundManager.playBtnClick?.();
        }

        this.selectSection(section);
      }

      return;
    }

    const targetSectionId =
      this.selectedSectionTab;

    const secCfg =
      game.worldMap?.sectionConfigs?.[
      targetSectionId
      ];

    /*
     * Some games may not have a sectionConfig for
     * amphi_valley/checkdam_buffer even though locations
     * exist there.
     *
     * In that case don't throw an error.
     */
    if (!secCfg) {
      console.warn(
        `[CampusMapUI] No sectionConfig for "${targetSectionId}"`
      );
      return;
    }

    const sx =
      canvas.width / secCfg.width;

    const sy =
      canvas.height / secCfg.height;

    const secLocs =
      (game.locations || []).filter(
        loc =>
          loc.section === targetSectionId &&
          !loc.isLake
      );

    /*
     * Find closest pin.
     */
    let closestLocation = null;
    let closestDistance = Infinity;

    for (const loc of secLocs) {
      const pinX = loc.x * sx;
      const pinY = loc.y * sy;

      const distance =
        Math.hypot(
          clickX - pinX,
          clickY - pinY
        );

      if (
        distance <= 22 &&
        distance < closestDistance
      ) {
        closestDistance = distance;
        closestLocation = loc;
      }
    }

    if (closestLocation) {
      this.travelToLocation(
        closestLocation.id
      );
    }
  }

  /**
   * Detect which quadrant was clicked in overview mode.
   */
  getOverviewSectionAtPoint(
    x,
    y,
    w,
    h
  ) {
    const pad = 35;

    const boxW =
      (w - pad * 3) / 2;

    const boxH =
      (h - pad * 3 - 35) / 2;

    const sections = [
      {
        id: 'west',
        x: pad,
        y: pad + 15,
        w: boxW,
        h: boxH
      },
      {
        id: 'main',
        x: pad * 2 + boxW,
        y: pad + 15,
        w: boxW,
        h: boxH
      },
      {
        id: 'south',
        x: pad,
        y: pad * 2 + 15 + boxH,
        w: boxW,
        h: boxH
      },
      {
        id: 'east',
        x: pad * 2 + boxW,
        y: pad * 2 + 15 + boxH,
        w: boxW,
        h: boxH
      }
    ];

    for (const section of sections) {
      if (
        x >= section.x &&
        x <= section.x + section.w &&
        y >= section.y &&
        y <= section.y + section.h
      ) {
        return section.id;
      }
    }

    /*
     * Check Dam / Amphi Valley buffer areas.
     */
    const cdX =
      pad + boxW * 0.15;

    const cdY =
      pad + 15 + boxH - 22;

    const cdW =
      boxW * 0.7;

    const cdH = 44;

    if (
      x >= cdX &&
      x <= cdX + cdW &&
      y >= cdY &&
      y <= cdY + cdH
    ) {
      return 'checkdam_buffer';
    }

    const amphiX =
      pad * 2 + boxW * 0.05;

    const amphiY =
      pad + 15 + boxH - 22;

    const amphiW =
      boxW * 0.7;

    const amphiH = 44;

    if (
      x >= amphiX &&
      x <= amphiX + amphiW &&
      y >= amphiY &&
      y <= amphiY + amphiH
    ) {
      return 'amphi_valley';
    }

    return null;
  }

  drawFullMap() {
    const canvas =
      document.getElementById('full-map-canvas');

    const game = this.uiManager?.game;

    if (!canvas || !game) return;

    const ctx =
      canvas.getContext('2d');

    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(
      0,
      0,
      w,
      h
    );

    /*
     * OVERVIEW
     */
    if (
      this.selectedSectionTab ===
      'overview'
    ) {
      this.drawFourSectionsOverview(
        ctx,
        w,
        h
      );

      return;
    }

    const targetSectionId =
      this.selectedSectionTab;

    const secCfg =
      game.worldMap?.sectionConfigs?.[
      targetSectionId
      ];

    /*
     * No config:
     * Show a useful message instead of silently
     * displaying a blank canvas.
     */
    if (!secCfg) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(
        0,
        0,
        w,
        h
      );

      ctx.fillStyle = '#facc15';
      ctx.font =
        'bold 14px Inter, sans-serif';

      ctx.textAlign = 'center';

      ctx.fillText(
        'MAP DATA UNAVAILABLE',
        w / 2,
        h / 2 - 10
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font =
        '9px Inter, sans-serif';

      ctx.fillText(
        `${targetSectionId} has no sectionConfig`,
        w / 2,
        h / 2 + 12
      );

      return;
    }

    const worldW =
      secCfg.width;

    const worldH =
      secCfg.height;

    const sx =
      w / worldW;

    const sy =
      h / worldH;

    /*
     * 1. TERRAIN
     */
    ctx.fillStyle = '#4a7c36';

    ctx.fillRect(
      0,
      0,
      w,
      h
    );

    /*
     * 1B. FIELDS
     */
    for (
      const fb of secCfg.fieldBlocks || []
    ) {
      ctx.fillStyle = '#8c6230';

      ctx.fillRect(
        fb.x * sx,
        fb.y * sy,
        fb.w * sx,
        fb.h * sy
      );

      ctx.strokeStyle = '#6a461e';
      ctx.lineWidth = 1;

      ctx.strokeRect(
        fb.x * sx,
        fb.y * sy,
        fb.w * sx,
        fb.h * sy
      );
    }

    /*
     * GRID
     */
    ctx.fillStyle =
      'rgba(255,255,255,0.03)';

    for (
      let x = 0;
      x < w;
      x += 16
    ) {
      ctx.fillRect(
        x,
        0,
        1,
        h
      );
    }

    for (
      let y = 0;
      y < h;
      y += 16
    ) {
      ctx.fillRect(
        0,
        y,
        w,
        1
      );
    }

    /*
     * 2. PLAZAS
     */
    for (
      const p of secCfg.plazas || []
    ) {
      ctx.fillStyle = '#b8a070';

      ctx.fillRect(
        p.x * sx,
        p.y * sy,
        p.w * sx,
        p.h * sy
      );

      ctx.strokeStyle = '#947848';
      ctx.lineWidth = 1;

      ctx.strokeRect(
        p.x * sx,
        p.y * sy,
        p.w * sx,
        p.h * sy
      );
    }

    /*
     * 3. ROADS
     */
    const trails = [];
    const paved = [];

    for (
      const [
        x1,
        y1,
        x2,
        y2,
        rw,
        isTrail
      ] of secCfg.roads || []
    ) {
      if (isTrail) {
        trails.push({
          x1: x1 * sx,
          y1: y1 * sy,
          x2: x2 * sx,
          y2: y2 * sy,
          rw: Math.max(
            2,
            rw * sx * 0.8
          )
        });
      } else {
        paved.push({
          x1: x1 * sx,
          y1: y1 * sy,
          x2: x2 * sx,
          y2: y2 * sy,
          rw: Math.max(
            2.5,
            rw * sx
          )
        });
      }
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    /*
     * Trails
     */
    ctx.strokeStyle = '#855d38';

    for (const t of trails) {
      ctx.lineWidth =
        t.rw + 1.5;

      ctx.beginPath();

      ctx.moveTo(
        t.x1,
        t.y1
      );

      ctx.lineTo(
        t.x2,
        t.y2
      );

      ctx.stroke();
    }

    ctx.strokeStyle = '#c49a6c';

    for (const t of trails) {
      ctx.lineWidth =
        t.rw;

      ctx.beginPath();

      ctx.moveTo(
        t.x1,
        t.y1
      );

      ctx.lineTo(
        t.x2,
        t.y2
      );

      ctx.stroke();
    }

    /*
     * Paved roads - curb
     */
    ctx.strokeStyle = '#7c6848';

    for (const p of paved) {
      ctx.lineWidth =
        p.rw + 2;

      ctx.beginPath();

      ctx.moveTo(
        p.x1,
        p.y1
      );

      ctx.lineTo(
        p.x2,
        p.y2
      );

      ctx.stroke();
    }

    /*
     * Asphalt
     */
    ctx.strokeStyle = '#2d3748';

    for (const p of paved) {
      ctx.lineWidth =
        p.rw;

      ctx.beginPath();

      ctx.moveTo(
        p.x1,
        p.y1
      );

      ctx.lineTo(
        p.x2,
        p.y2
      );

      ctx.stroke();
    }

    /*
     * 4. CHECKPOINTS
     */
    for (
      const cp of secCfg.checkpoints || []
    ) {
      const cpW =
        Math.max(
          6,
          cp.width * sx
        );

      const cpH =
        Math.max(
          6,
          cp.height * sy
        );

      ctx.fillStyle = '#eab308';

      ctx.fillRect(
        cp.x * sx,
        cp.y * sy,
        cpW,
        cpH
      );

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;

      ctx.strokeRect(
        cp.x * sx,
        cp.y * sy,
        cpW,
        cpH
      );

      ctx.fillStyle = '#ffffff';
      ctx.font =
        'bold 8px Inter, sans-serif';

      ctx.textAlign = 'center';

      ctx.fillText(
        cp.shortLabel || '⛩️ Gate',
        cp.x * sx + cpW / 2,
        cp.y * sy - 4
      );
    }

    /*
     * 5. WATER
     */
    for (
      const lake of secCfg.waterBodies || []
    ) {
      ctx.fillStyle = '#2563eb';

      ctx.beginPath();

      ctx.ellipse(
        lake.x * sx,
        lake.y * sy,
        lake.radiusX * sx,
        lake.radiusY * sy,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 1.5;

      ctx.stroke();

      ctx.fillStyle = '#ffffff';

      ctx.font =
        'bold 8px Inter, sans-serif';

      ctx.textAlign = 'center';

      ctx.fillText(
        lake.name,
        lake.x * sx,
        lake.y * sy + 3
      );
    }

    /*
     * 6. LOCATIONS
     */
    const secLocs =
      (game.locations || []).filter(
        loc =>
          loc.section ===
          targetSectionId
      );

    for (const loc of secLocs) {
      if (loc.isLake) continue;

      const isDisc =
        game.discoverySystem?.isDiscovered?.(
          loc.id
        ) || false;

      const bx =
        loc.x * sx;

      const by =
        loc.y * sy;

      const bw =
        Math.max(
          8,
          (loc.width || 10) * sx
        );

      const bh =
        Math.max(
          7,
          (loc.height || 10) * sy
        );

      /*
       * CATEGORY COLOR
       */
      if (
        loc.category === 'academic'
      ) {
        ctx.fillStyle =
          isDisc
            ? '#1d4ed8'
            : '#64748b';
      } else if (
        loc.category === 'research'
      ) {
        ctx.fillStyle =
          isDisc
            ? '#059669'
            : '#64748b';
      } else if (
        loc.category === 'residential'
      ) {
        ctx.fillStyle =
          isDisc
            ? '#d97706'
            : '#64748b';
      } else if (
        loc.category === 'sports'
      ) {
        ctx.fillStyle =
          isDisc
            ? '#0d9488'
            : '#64748b';
      } else if (
        loc.category ===
        'nature-rocks'
      ) {
        ctx.fillStyle =
          isDisc
            ? '#4b5563'
            : '#64748b';
      } else if (
        loc.category ===
        'amenities' ||
        loc.isNightCanteen
      ) {
        ctx.fillStyle =
          isDisc
            ? '#db2777'
            : '#64748b';
      } else {
        ctx.fillStyle =
          isDisc
            ? '#ea580c'
            : '#64748b';
      }

      ctx.fillRect(
        bx,
        by,
        bw,
        bh
      );

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      ctx.strokeRect(
        bx,
        by,
        bw,
        bh
      );

      /*
       * NUMBER BADGE
       */
      ctx.fillStyle = '#dc2626';

      ctx.beginPath();

      ctx.arc(
        bx + bw / 2,
        by + bh / 2,
        5,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = '#ffffff';

      ctx.font =
        'bold 6px Inter, sans-serif';

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(
        `${loc.id}`,
        bx + bw / 2,
        by + bh / 2
      );
    }

    /*
     * 7. PLAYER
     */
    if (
      game.worldMap.currentSection ===
      targetSectionId
    ) {
      const px =
        game.player.x * sx;

      const py =
        game.player.y * sy;

      ctx.strokeStyle =
        'rgba(239,68,68,0.7)';

      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.arc(
        px,
        py,
        10,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.fillStyle = '#ef4444';

      ctx.beginPath();

      ctx.arc(
        px,
        py,
        5,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = '#ffffff';

      ctx.font =
        'bold 9px Inter, sans-serif';

      ctx.textAlign = 'center';

      ctx.fillText(
        'YOU',
        px,
        py - 12
      );
    }
  }

  drawFourSectionsOverview(
    ctx,
    w,
    h
  ) {
    const game =
      this.uiManager?.game;

    if (!game) return;

    /*
     * BACKGROUND
     */
    ctx.fillStyle = '#1e293b';

    ctx.fillRect(
      0,
      0,
      w,
      h
    );

    /*
     * TITLE
     */
    ctx.fillStyle = '#f8fafc';

    ctx.font =
      'bold 15px Inter, sans-serif';

    ctx.textAlign = 'center';

    ctx.fillText(
      'UNIVERSITY OF HYDERABAD — REGIONAL HUBS & BUFFER ROUTES',
      w / 2,
      32
    );

    const pad = 35;

    const boxW =
      (w - pad * 3) / 2;

    const boxH =
      (h - pad * 3 - 35) / 2;

    const sections = [
      {
        id: 'west',
        name: '🟡 WEST CAMPUS',
        sub: `Stadium, IDC & Gate 3 (${game.locations.filter(
          l => l.section === 'west'
        ).length
          } POIs)`,
        x: pad,
        y: pad + 15,
        w: boxW,
        h: boxH,
        color:
          'rgba(234,179,8,0.20)',
        border: '#eab308'
      },
      {
        id: 'main',
        name: '🟢 NORTH / MAIN CAMPUS',
        sub: `Humanities, Social Sciences & Lakes (${game.locations.filter(
          l => l.section === 'main'
        ).length
          } POIs)`,
        x: pad * 2 + boxW,
        y: pad + 15,
        w: boxW,
        h: boxH,
        color:
          'rgba(168,85,247,0.20)',
        border: '#10b981'
      },
      {
        id: 'south',
        name: '🔵 SOUTH CAMPUS',
        sub: `SLS Road & Hostels Quads (${game.locations.filter(
          l => l.section === 'south'
        ).length
          } POIs)`,
        x: pad,
        y: pad * 2 + 15 + boxH,
        w: boxW,
        h: boxH,
        color:
          'rgba(37,99,235,0.20)',
        border: '#2563eb'
      },
      {
        id: 'east',
        name: '🟣 EAST CAMPUS',
        sub: `Academic Core, Sports & Sukoon (${game.locations.filter(
          l => l.section === 'east'
        ).length
          } POIs)`,
        x: pad * 2 + boxW,
        y: pad * 2 + 15 + boxH,
        w: boxW,
        h: boxH,
        color:
          'rgba(168,85,247,0.20)',
        border: '#a855f7'
      }
    ];

    /*
     * SECTION BOXES
     */
    sections.forEach(s => {
      ctx.fillStyle = s.color;

      ctx.fillRect(
        s.x,
        s.y,
        s.w,
        s.h
      );

      ctx.strokeStyle =
        s.border;

      ctx.lineWidth = 2;

      ctx.strokeRect(
        s.x,
        s.y,
        s.w,
        s.h
      );

      ctx.fillStyle = '#ffffff';

      ctx.font =
        'bold 12px Inter, sans-serif';

      ctx.textAlign = 'left';

      ctx.fillText(
        s.name,
        s.x + 12,
        s.y + 20
      );

      ctx.fillStyle = '#94a3b8';

      ctx.font =
        '9px Inter, sans-serif';

      ctx.fillText(
        s.sub,
        s.x + 12,
        s.y + 34
      );

      /*
       * CURRENT LOCATION
       */
      if (
        game.worldMap.currentSection ===
        s.id
      ) {
        ctx.fillStyle = '#ef4444';

        ctx.fillRect(
          s.x + s.w - 105,
          s.y + 6,
          95,
          18
        );

        ctx.fillStyle = '#ffffff';

        ctx.font =
          'bold 8px Inter, sans-serif';

        ctx.textAlign = 'center';

        ctx.fillText(
          '📍 YOU ARE HERE',
          s.x + s.w - 58,
          s.y + 18
        );
      }
    });

    /*
     * CHECK DAM BUFFER
     */
    const cdX =
      pad + boxW * 0.15;

    const cdY =
      pad + 15 + boxH - 22;

    const cdW =
      boxW * 0.7;

    const cdH = 44;

    ctx.fillStyle =
      game.worldMap.currentSection ===
        'checkdam_buffer'
        ? 'rgba(2,132,199,0.9)'
        : 'rgba(15,23,42,0.92)';

    ctx.fillRect(
      cdX,
      cdY,
      cdW,
      cdH
    );

    ctx.strokeStyle = '#0284c7';

    ctx.lineWidth = 2;

    ctx.strokeRect(
      cdX,
      cdY,
      cdW,
      cdH
    );

    const cdCount =
      game.locations.filter(
        l =>
          l.section ===
          'checkdam_buffer'
      ).length;

    ctx.fillStyle = '#ffffff';

    ctx.font =
      'bold 10px Inter, sans-serif';

    ctx.textAlign = 'center';

    ctx.fillText(
      `🌊 CHECK DAM BUFFER (${cdCount} POIs)`,
      cdX + cdW / 2,
      cdY + 18
    );

    ctx.fillStyle = '#7dd3fc';

    ctx.font =
      '8px Inter, sans-serif';

    ctx.fillText(
      'Check Dam · Globe Rock · Temple (West ↔ South)',
      cdX + cdW / 2,
      cdY + 32
    );

    /*
     * AMPHI VALLEY
     */
    const amphiX =
      pad * 2 + boxW * 0.05;

    const amphiY =
      pad + 15 + boxH - 22;

    const amphiW =
      boxW * 0.7;

    const amphiH = 44;

    ctx.fillStyle =
      game.worldMap.currentSection ===
        'amphi_valley'
        ? 'rgba(5,150,105,0.9)'
        : 'rgba(15,23,42,0.92)';

    ctx.fillRect(
      amphiX,
      amphiY,
      amphiW,
      amphiH
    );

    ctx.strokeStyle = '#10b981';

    ctx.lineWidth = 2;

    ctx.strokeRect(
      amphiX,
      amphiY,
      amphiW,
      amphiH
    );

    const amphiCount =
      game.locations.filter(
        l =>
          l.section ===
          'amphi_valley'
      ).length;

    ctx.fillStyle = '#ffffff';

    ctx.font =
      'bold 10px Inter, sans-serif';

    ctx.textAlign = 'center';

    ctx.fillText(
      `🌲 AMPHI VALLEY BUFFER (${amphiCount} POIs)`,
      amphiX + amphiW / 2,
      amphiY + 18
    );

    ctx.fillStyle = '#a7f3d0';

    ctx.font =
      '8px Inter, sans-serif';

    ctx.fillText(
      'Amphitheatre UoH · Amphi Lake (Main ↔ South)',
      amphiX + amphiW / 2,
      amphiY + 32
    );

    /*
     * CONNECTING HIGHWAY
     */
    ctx.strokeStyle = '#dc2626';

    ctx.lineWidth = 5;

    ctx.lineCap = 'round';

    ctx.beginPath();

    // West -> Main
    ctx.moveTo(
      pad + boxW * 0.7,
      pad + 15 + boxH * 0.4
    );

    ctx.lineTo(
      pad * 2 + boxW * 0.3,
      pad + 15 + boxH * 0.4
    );

    // West -> Check Dam -> South
    ctx.moveTo(
      pad + boxW * 0.5,
      pad + 15 + boxH * 0.7
    );

    ctx.lineTo(
      cdX + cdW / 2,
      cdY + cdH / 2
    );

    ctx.lineTo(
      pad + boxW * 0.3,
      pad * 2 + 15 + boxH + 30
    );

    // Main -> Amphi -> South
    ctx.moveTo(
      pad * 2 + boxW * 0.2,
      pad + 15 + boxH * 0.7
    );

    ctx.lineTo(
      amphiX + amphiW / 2,
      amphiY + amphiH / 2
    );

    ctx.lineTo(
      pad + boxW * 0.85,
      pad * 2 + 15 + boxH + 30
    );

    // Main -> East
    ctx.moveTo(
      pad * 2 + boxW * 0.7,
      pad + 15 + boxH * 0.6
    );

    ctx.lineTo(
      pad * 2 + boxW * 0.3,
      pad * 2 + 15 + boxH * 0.3
    );

    ctx.stroke();

    /*
     * FOOTER
     */
    ctx.fillStyle = '#fef08a';

    ctx.font =
      'bold 9px Inter, sans-serif';

    ctx.textAlign = 'center';

    ctx.fillText(
      '🔴 Main Campus Connecting Highway & Scenic Checkpoint Routes',
      w / 2,
      h - 8
    );
  }
}