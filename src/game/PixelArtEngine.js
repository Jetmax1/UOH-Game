/**
 * PixelArtEngine: Procedural Pokémon FireRed GBA-Style Sprite, Tile & Architecture Generator
 * Generates authentic 16-bit GBA pixel-art tiles, characters, building facades, props, and wildlife.
 */

export class PixelArtEngine {
  constructor() {
    this.cache = {};
  }

  createCanvas(width, height) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas: c, ctx };
  }

  // =========================================================================
  // 1. GBA OVERWORLD TILES
  // =========================================================================

  getGrassTile() {
    if (this.cache.grass) return this.cache.grass;
    const { canvas, ctx } = this.createCanvas(16, 16);

    ctx.fillStyle = '#58b848';
    ctx.fillRect(0, 0, 16, 16);

    ctx.fillStyle = '#409838';
    ctx.fillRect(2, 3, 2, 2);
    ctx.fillRect(8, 11, 2, 2);
    ctx.fillRect(13, 5, 2, 2);

    ctx.fillStyle = '#78d860';
    ctx.fillRect(3, 2, 1, 2);
    ctx.fillRect(9, 10, 1, 2);
    ctx.fillRect(14, 4, 1, 2);

    this.cache.grass = canvas;
    return canvas;
  }

  getFlowerTile(color = 'red') {
    const key = `flower_${color}`;
    if (this.cache[key]) return this.cache[key];
    const { canvas, ctx } = this.createCanvas(16, 16);

    ctx.drawImage(this.getGrassTile(), 0, 0);

    const flowerColor = color === 'yellow' ? '#f8d030' : (color === 'blue' ? '#58a8f8' : '#f85858');
    const centerColor = color === 'yellow' ? '#f85820' : '#f8e878';

    const drawFlower = (fx, fy) => {
      ctx.fillStyle = flowerColor;
      ctx.fillRect(fx, fy - 1, 2, 1);
      ctx.fillRect(fx, fy + 2, 2, 1);
      ctx.fillRect(fx - 1, fy, 1, 2);
      ctx.fillRect(fx + 2, fy, 1, 2);
      ctx.fillStyle = centerColor;
      ctx.fillRect(fx, fy, 2, 2);
    };

    drawFlower(3, 4);
    drawFlower(10, 9);

    this.cache[key] = canvas;
    return canvas;
  }

  getTallGrassTile() {
    if (this.cache.tallGrass) return this.cache.tallGrass;
    const { canvas, ctx } = this.createCanvas(16, 16);

    ctx.fillStyle = '#409838';
    ctx.fillRect(0, 0, 16, 16);

    ctx.fillStyle = '#287020';
    ctx.fillRect(2, 6, 4, 10);
    ctx.fillRect(9, 4, 5, 12);

    ctx.fillStyle = '#60c850';
    ctx.fillRect(3, 4, 2, 8);
    ctx.fillRect(10, 2, 3, 10);

    ctx.fillStyle = '#88e870';
    ctx.fillRect(3, 2, 2, 2);
    ctx.fillRect(11, 0, 2, 2);

    this.cache.tallGrass = canvas;
    return canvas;
  }

  getHedgeTile() {
    if (this.cache.hedge) return this.cache.hedge;
    const { canvas, ctx } = this.createCanvas(16, 16);

    ctx.fillStyle = '#206020';
    ctx.fillRect(0, 0, 16, 16);

    ctx.fillStyle = '#389830';
    ctx.fillRect(1, 1, 14, 14);

    ctx.fillStyle = '#68c850';
    ctx.fillRect(2, 2, 12, 4);
    ctx.fillRect(3, 6, 10, 2);

    this.cache.hedge = canvas;
    return canvas;
  }

  getFieldTile() {
    if (this.cache.field) return this.cache.field;
    const { canvas, ctx } = this.createCanvas(16, 16);

    ctx.fillStyle = '#a67c48';
    ctx.fillRect(0, 0, 16, 16);

    // Earthen furrows and subtle dirt specks
    ctx.fillStyle = '#8c6230';
    ctx.fillRect(1, 3, 14, 2);
    ctx.fillRect(1, 8, 14, 2);
    ctx.fillRect(1, 13, 14, 2);

    ctx.fillStyle = '#c09860';
    ctx.fillRect(2, 2, 4, 1);
    ctx.fillRect(9, 2, 5, 1);
    ctx.fillRect(4, 7, 6, 1);
    ctx.fillRect(3, 12, 5, 1);

    ctx.fillStyle = '#6a461e';
    ctx.fillRect(6, 4, 2, 1);
    ctx.fillRect(12, 9, 2, 1);

    this.cache.field = canvas;
    return canvas;
  }

  getTreeSprite() {
    if (this.cache.tree) return this.cache.tree;
    const { canvas, ctx } = this.createCanvas(32, 32);

    ctx.fillStyle = '#483820';
    ctx.fillRect(12, 22, 8, 10);
    ctx.fillStyle = '#805830';
    ctx.fillRect(14, 22, 4, 10);
    ctx.fillStyle = '#a87848';
    ctx.fillRect(14, 22, 2, 10);

    ctx.fillStyle = '#206020';
    ctx.beginPath();
    ctx.arc(16, 14, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#48a838';
    ctx.beginPath();
    ctx.arc(15, 13, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78d858';
    ctx.beginPath();
    ctx.arc(12, 10, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#a8f888';
    ctx.fillRect(10, 7, 3, 3);
    ctx.fillRect(14, 9, 2, 2);

    this.cache.tree = canvas;
    return canvas;
  }

  getPineTreeSprite() {
    if (this.cache.pine) return this.cache.pine;
    const { canvas, ctx } = this.createCanvas(32, 36);

    ctx.fillStyle = '#483820';
    ctx.fillRect(13, 26, 6, 10);
    ctx.fillStyle = '#785028';
    ctx.fillRect(14, 26, 3, 10);

    ctx.fillStyle = '#185018';
    ctx.beginPath();
    ctx.moveTo(3, 26);
    ctx.lineTo(16, 12);
    ctx.lineTo(29, 26);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#308830';
    ctx.beginPath();
    ctx.moveTo(6, 25);
    ctx.lineTo(16, 13);
    ctx.lineTo(26, 25);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#185018';
    ctx.beginPath();
    ctx.moveTo(5, 18);
    ctx.lineTo(16, 6);
    ctx.lineTo(27, 18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#48a840';
    ctx.beginPath();
    ctx.moveTo(8, 17);
    ctx.lineTo(16, 7);
    ctx.lineTo(24, 17);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#60c850';
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(16, 1);
    ctx.lineTo(22, 10);
    ctx.closePath();
    ctx.fill();

    this.cache.pine = canvas;
    return canvas;
  }

  getGulmoharTreeSprite() {
    if (this.cache.gulmohar) return this.cache.gulmohar;
    const { canvas, ctx } = this.createCanvas(32, 32);

    ctx.fillStyle = '#483820';
    ctx.fillRect(12, 22, 8, 10);
    ctx.fillStyle = '#805830';
    ctx.fillRect(14, 22, 4, 10);

    ctx.fillStyle = '#881818';
    ctx.beginPath();
    ctx.arc(16, 14, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d83828';
    ctx.beginPath();
    ctx.arc(15, 13, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f87838';
    ctx.beginPath();
    ctx.arc(12, 10, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8e878';
    ctx.fillRect(10, 7, 3, 3);

    this.cache.gulmohar = canvas;
    return canvas;
  }

  getFenceTile() {
    if (this.cache.fence) return this.cache.fence;
    const { canvas, ctx } = this.createCanvas(16, 16);

    ctx.fillStyle = '#d8d8d8';
    ctx.fillRect(2, 2, 4, 14);
    ctx.fillRect(10, 2, 4, 14);
    ctx.fillRect(0, 5, 16, 3);
    ctx.fillRect(0, 11, 16, 3);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3, 2, 2, 13);
    ctx.fillRect(11, 2, 2, 13);
    ctx.fillRect(0, 5, 16, 1);
    ctx.fillRect(0, 11, 16, 1);

    this.cache.fence = canvas;
    return canvas;
  }

  getSignpostSprite() {
    if (this.cache.signpost) return this.cache.signpost;
    const { canvas, ctx } = this.createCanvas(16, 16);

    ctx.fillStyle = '#583818';
    ctx.fillRect(7, 8, 2, 8);

    ctx.fillStyle = '#402810';
    ctx.fillRect(1, 2, 14, 8);
    ctx.fillStyle = '#b88848';
    ctx.fillRect(2, 3, 12, 6);
    ctx.fillStyle = '#e8c078';
    ctx.fillRect(3, 4, 10, 2);

    this.cache.signpost = canvas;
    return canvas;
  }

  getBenchSprite() {
    if (this.cache.bench) return this.cache.bench;
    const { canvas, ctx } = this.createCanvas(24, 16);

    ctx.fillStyle = '#383848';
    ctx.fillRect(3, 8, 3, 8);
    ctx.fillRect(18, 8, 3, 8);

    ctx.fillStyle = '#885830';
    ctx.fillRect(1, 4, 22, 4);
    ctx.fillRect(1, 9, 22, 3);

    ctx.fillStyle = '#b88048';
    ctx.fillRect(2, 4, 20, 1);
    ctx.fillRect(2, 9, 20, 1);

    this.cache.bench = canvas;
    return canvas;
  }

  getFountainSprite() {
    if (this.cache.fountain) return this.cache.fountain;
    const { canvas, ctx } = this.createCanvas(32, 32);

    ctx.fillStyle = '#585868';
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#888898';
    ctx.beginPath();
    ctx.arc(16, 16, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3888d8';
    ctx.beginPath();
    ctx.arc(16, 16, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d0d0d8';
    ctx.fillRect(14, 10, 4, 12);
    ctx.fillStyle = '#90d8f8';
    ctx.fillRect(15, 6, 2, 4);

    this.cache.fountain = canvas;
    return canvas;
  }

  // =========================================================================
  // 2. SOUTH CAMPUS SPECIAL ARCHITECTURAL DESIGNS
  // =========================================================================

  // Semicircular Stepped Amphitheatre UoH
  drawAmphitheatre(ctx, sx, sy, radius = 55) {
    ctx.save();
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(sx, sy + 4, radius + 8, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Terraced Tiers
    const tiers = 4;
    for (let i = tiers; i >= 1; i--) {
      const r = (radius / tiers) * i;
      ctx.fillStyle = i % 2 === 0 ? '#d0b888' : '#e0c898';
      ctx.beginPath();
      ctx.arc(sx, sy, r, Math.PI * 0.9, Math.PI * 2.1);
      ctx.lineTo(sx, sy);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#a88850';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Center Performance Stage
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(sx, sy + 4, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('STAGE', sx, sy + 7);

    ctx.restore();
  }

  // Heritage Campus Temple (Chinna Gudi)
  drawCampusTemple(ctx, sx, sy) {
    ctx.save();
    // Base platform
    ctx.fillStyle = '#585868';
    ctx.fillRect(sx - 20, sy - 10, 40, 36);

    // Stone Mandapam Sanctum
    ctx.fillStyle = '#e8d8b8';
    ctx.fillRect(sx - 16, sy - 6, 32, 28);

    // Stone Pillars
    ctx.fillStyle = '#c0a070';
    ctx.fillRect(sx - 14, sy + 6, 4, 16);
    ctx.fillRect(sx + 10, sy + 6, 4, 16);

    // Temple Gopuram Pyramid Roof
    ctx.fillStyle = '#b84028';
    ctx.beginPath();
    ctx.moveTo(sx - 18, sy - 6);
    ctx.lineTo(sx, sy - 26);
    ctx.lineTo(sx + 18, sy - 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f89838';
    ctx.beginPath();
    ctx.moveTo(sx - 12, sy - 6);
    ctx.lineTo(sx, sy - 24);
    ctx.lineTo(sx + 12, sy - 6);
    ctx.closePath();
    ctx.fill();

    // Gold Kalasam & Flag
    ctx.fillStyle = '#f8d030';
    ctx.fillRect(sx - 2, sy - 30, 4, 4);
    ctx.fillStyle = '#e82828';
    ctx.fillRect(sx + 2, sy - 32, 6, 4);

    // Sanctum Idol / Lamp Glow
    ctx.fillStyle = '#f8a820';
    ctx.beginPath();
    ctx.arc(sx, sy + 12, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 2;
    ctx.fillText('Temple (Chinna Gudi)', sx, sy + 34);

    ctx.restore();
  }

  // Sand Volleyball Court
  drawVolleyballCourt(ctx, sx, sy, width = 64, height = 40) {
    ctx.save();
    // Yellow Sand Pitch
    ctx.fillStyle = '#ecd890';
    ctx.fillRect(sx, sy, width, height);

    // White Boundary Tape
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx + 2, sy + 2, width - 4, height - 4);

    // Center Net Line
    const midX = sx + width / 2;
    ctx.strokeStyle = '#282838';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX, sy);
    ctx.lineTo(midX, sy + height);
    ctx.stroke();

    // Net Mesh Texture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(midX, sy + 2);
    ctx.lineTo(midX, sy + height - 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Net Posts
    ctx.fillStyle = '#d82828';
    ctx.fillRect(midX - 2, sy - 3, 4, 4);
    ctx.fillRect(midX - 2, sy + height - 1, 4, 4);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VOLLEYBALL', midX, sy + height / 2 + 3);

    ctx.restore();
  }

  // Check Dam UoH (Reservoir & Stone Barrier)
  drawCheckDam(ctx, sx, sy, width = 70, height = 45) {
    ctx.save();
    // Reservoir Water
    ctx.fillStyle = '#2868a8';
    ctx.fillRect(sx, sy, width, height);

    // Water ripple lines
    ctx.strokeStyle = '#90d8f8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx + 8, sy + 12);
    ctx.lineTo(sx + width - 8, sy + 12);
    ctx.moveTo(sx + 14, sy + 24);
    ctx.lineTo(sx + width - 14, sy + 24);
    ctx.stroke();

    // Stone Dam Wall Barrier
    ctx.fillStyle = '#585868';
    ctx.fillRect(sx, sy + height - 8, width, 8);
    ctx.fillStyle = '#888898';
    ctx.fillRect(sx + 2, sy + height - 7, width - 4, 3);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 2;
    ctx.fillText('Check Dam UoH', sx + width / 2, sy + height / 2 + 2);

    ctx.restore();
  }

  // Championship Tennis Court
  drawTennisCourt(ctx, sx, sy, width = 60, height = 45) {
    ctx.save();
    // Blue hardcourt surface
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(sx, sy, width, height);

    // Green outer surround
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    ctx.strokeRect(sx, sy, width, height);

    // White court boundary lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx + 4, sy + 4, width - 8, height - 8);

    // Center Net
    const midX = sx + width / 2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX, sy + 2);
    ctx.lineTo(midX, sy + height - 2);
    ctx.stroke();

    // Center Service line
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx + 4, sy + height / 2);
    ctx.lineTo(sx + width - 4, sy + height / 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TENNIS', midX, sy + 10);

    ctx.restore();
  }

  // =========================================================================
  // 2B. EAST CAMPUS & UOH RETRO 8-BIT / 16-BIT LANDMARKS (REFERENCE MAP)
  // =========================================================================

  // 1. Overhead Water Tank (Elevated cylindrical steel water tower on 4 legs)
  drawWaterTank(ctx, sx, sy, width = 64, height = 76) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, sy + height - 4, width / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4 Steel Truss Legs (Stilts with cross bracing)
    const legTopY = sy + 36;
    const legBotY = sy + height - 8;
    const legSpread = 24;

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    // Left legs
    ctx.beginPath();
    ctx.moveTo(cx - 16, legTopY);
    ctx.lineTo(cx - legSpread, legBotY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 8, legTopY);
    ctx.lineTo(cx - 14, legBotY);
    ctx.stroke();

    // Right legs
    ctx.beginPath();
    ctx.moveTo(cx + 16, legTopY);
    ctx.lineTo(cx + legSpread, legBotY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 8, legTopY);
    ctx.lineTo(cx + 14, legBotY);
    ctx.stroke();

    // Steel Cross Bracing
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 22, sy + 50);
    ctx.lineTo(cx + 22, sy + 64);
    ctx.moveTo(cx + 22, sy + 50);
    ctx.lineTo(cx - 22, sy + 64);
    ctx.stroke();

    // Central Feed Pipe
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - 3, legTopY, 6, legBotY - legTopY);

    // Concrete Footings
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - legSpread - 4, legBotY, 8, 5);
    ctx.fillRect(cx + legSpread - 4, legBotY, 8, 5);
    ctx.fillRect(cx - 16, legBotY, 6, 5);
    ctx.fillRect(cx + 10, legBotY, 6, 5);

    // Tank Cylindrical Body
    const tankR = 24;
    const tankH = 26;
    const tankY = sy + 10;

    // Tank base rim
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.ellipse(cx, tankY + tankH, tankR, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tank cylinder gradient fill
    const grad = ctx.createLinearGradient(cx - tankR, 0, cx + tankR, 0);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.3, '#38bdf8');
    grad.addColorStop(0.7, '#7dd3fc');
    grad.addColorStop(1, '#0369a1');

    ctx.fillStyle = grad;
    ctx.fillRect(cx - tankR, tankY, tankR * 2, tankH);

    // Metal seams & bands
    ctx.strokeStyle = '#075985';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - tankR, tankY, tankR * 2, tankH);
    ctx.beginPath();
    ctx.moveTo(cx - tankR, tankY + tankH / 2);
    ctx.lineTo(cx + tankR, tankY + tankH / 2);
    ctx.stroke();

    // Conical Roof Cap
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(cx - tankR - 2, tankY);
    ctx.lineTo(cx, sy + 2);
    ctx.lineTo(cx + tankR + 2, tankY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Roof Finial & Warning Light
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 2, sy - 2, 4, 4);

    // Access Ladder on right side
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    for (let ly = tankY; ly < legBotY; ly += 6) {
      ctx.beginPath();
      ctx.moveTo(cx + 17, ly);
      ctx.lineTo(cx + 21, ly);
      ctx.stroke();
    }

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('OVERHEAD WATER TANK', cx, sy - 6);

    ctx.restore();
  }

  // 2. GMC Balayogi Sports Complex (Circular Colosseum Stone Arena)
  drawBalayogiSportsComplex(ctx, sx, sy, radius = 52) {
    ctx.save();
    const cx = sx + radius;
    const cy = sy + radius;

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(cx, cy + 6, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    // Outer Heavy Masonry Arena Wall
    ctx.fillStyle = '#b89f74';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7c6544';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Perimeter Arched Vomitoria / Gate Portals (8-Bit radial openings)
    const numArches = 16;
    for (let i = 0; i < numArches; i++) {
      const angle = (i / numArches) * Math.PI * 2;
      const ax = cx + Math.cos(angle) * (radius - 7);
      const ay = cy + Math.sin(angle) * (radius - 7);
      ctx.fillStyle = '#291d10';
      ctx.beginPath();
      ctx.arc(ax, ay, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ecd8b0';
      ctx.fillRect(ax - 2, ay + 2, 4, 2);
    }

    // Concentric Spectator Stepped Tiers
    const tiers = 3;
    for (let t = tiers; t >= 1; t--) {
      const r = (radius - 14) * (t / tiers) + 12;
      ctx.fillStyle = t % 2 === 0 ? '#d4be92' : '#e8d4a8';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#9c8052';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Center Green Sports Pitch
    const pitchR = 18;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(cx, cy, pitchR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center arena markings
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('GMC BALAYOGI SPORTS COMPLEX', cx, sy - 5);

    ctx.restore();
  }

  // 3. Gachibowli Stadium (Large Oval Athletic Stadium with Running Track & Soccer Field)
  drawGachibowliStadium(ctx, sx, sy, width = 115, height = 80) {
    ctx.save();
    const cx = sx + width / 2;
    const cy = sy + height / 2;
    const rx = width / 2;
    const ry = height / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 6, rx + 4, ry + 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer Stadium Concrete Shell
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Grandstand Spectator Seating (Terraced Tiers)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 6, ry - 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Seating rows (Yellow & Blue stadium chair bands)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 10, ry - 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 14, ry - 14, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Red Synthetic Cinder Running Track Oval
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 18, ry - 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Running Lanes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 21, ry - 18, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 24, ry - 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Green Natural Grass Football / Athletic Field
    const fw = (rx - 28) * 2;
    const fh = (ry - 22) * 2;
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);

    // Center Field Line & Center Circle
    ctx.beginPath();
    ctx.moveTo(cx, cy - fh / 2);
    ctx.lineTo(cx, cy + fh / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Goal Boxes
    ctx.strokeRect(cx - fw / 2, cy - 6, 6, 12);
    ctx.strokeRect(cx + fw / 2 - 6, cy - 6, 6, 12);

    // 4 Corner Stadium Floodlight Masts
    const floodPositions = [
      { x: cx - rx + 4, y: cy - ry + 4 },
      { x: cx + rx - 4, y: cy - ry + 4 },
      { x: cx - rx + 4, y: cy + ry - 4 },
      { x: cx + rx - 4, y: cy + ry - 4 }
    ];
    floodPositions.forEach(p => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    });

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('GACHIBOWLI STADIUM', cx, sy - 4);

    ctx.restore();
  }

  // 4. University of Hyderabad Circular Entrance Monument
  drawUoHMonument(ctx, sx, sy, radius = 45) {
    ctx.save();
    const cx = sx + radius;
    const cy = sy + radius;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(cx, cy + 5, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    // Outer Circular Stone Plaza with Radial Flagstone Rays
    ctx.fillStyle = '#d4be92';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8c7048';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Radial spokes
    ctx.strokeStyle = 'rgba(140, 112, 72, 0.6)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
      ctx.stroke();
    }

    // Inner Concentric Tier & Ring of 8 Stone Pillars
    ctx.fillStyle = '#ebdcc0';
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 12, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const px = cx + Math.cos(a) * (radius - 16);
      const py = cy + Math.sin(a) * (radius - 16);
      ctx.fillStyle = '#786040';
      ctx.fillRect(px - 3, py - 3, 6, 6);
      ctx.fillStyle = '#b89868';
      ctx.fillRect(px - 2, py - 2, 4, 4);
    }

    // Center Raised Circular Marble Plinth
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Central University Emblem Pillar / Obelisk
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cx - 2, cy - 2, 4, 4);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('UNIVERSITY OF HYDERABAD', cx, sy - 4);

    ctx.restore();
  }

  // 5. SATG Shooting Ranges & Athletic Track
  drawShootingRange(ctx, sx, sy, width = 85, height = 65) {
    ctx.save();
    const cx = sx + width / 2;
    const cy = sy + height / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, width / 2 + 2, height / 2 + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Clay/Dirt Oval Track
    ctx.fillStyle = '#b47846';
    ctx.beginPath();
    ctx.ellipse(cx, cy, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7c4820';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner Green Firing Area
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.ellipse(cx, cy, width / 2 - 12, height / 2 - 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Target Baffles & Firing Booths
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - 20, cy - 8, 40, 16);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - 18, cy - 6, 8, 12);
    ctx.fillRect(cx - 4, cy - 6, 8, 12);
    ctx.fillRect(cx + 10, cy - 6, 8, 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('SATG SHOOTING RANGES', cx, sy - 4);

    ctx.restore();
  }

  // 6. Sai Baba Temple (Ornate Mandapam with Golden Gopuram & Flag)
  drawSaiBabaTemple(ctx, sx, sy, width = 72, height = 62) {
    ctx.save();
    const cx = sx + width / 2;
    const cy = sy + height / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 3, sy + 3, width, height);

    // Stone Courtyard Base Platform
    ctx.fillStyle = '#e2d4be';
    ctx.fillRect(sx, sy, width, height);
    ctx.strokeStyle = '#9c784e';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, width, height);

    // Temple Walls
    const mw = width - 18;
    const mh = height - 18;
    const mx = sx + 9;
    const my = sy + 12;

    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mx, my, mw, mh);

    // Golden Tiered Gopuram (Pyramidal Temple Spire)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(mx - 2, my);
    ctx.lineTo(cx, sy - 14);
    ctx.lineTo(mx + mw + 2, my);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(mx + 4, my);
    ctx.lineTo(cx, sy - 10);
    ctx.lineTo(mx + mw - 4, my);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(mx + 10, my);
    ctx.lineTo(cx, sy - 6);
    ctx.lineTo(mx + mw - 10, my);
    ctx.closePath();
    ctx.fill();

    // Gold Kalasam & Saffron Flag
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx - 3, sy - 18, 6, 5);
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(cx, sy - 18);
    ctx.lineTo(cx + 8, sy - 22);
    ctx.lineTo(cx, sy - 26);
    ctx.closePath();
    ctx.fill();

    // Sanctum Entry & Oil Lamp Glow
    ctx.fillStyle = '#451a03';
    ctx.fillRect(cx - 8, my + mh - 12, 16, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, my + mh - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('SAI BABA TEMPLE', cx, sy - 8);

    ctx.restore();
  }

  // 7. Indian Immunologicals Limited (Biotech/Pharma Industrial Campus)
  drawIndianImmunologicals(ctx, sx, sy, width = 100, height = 75) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 4, sy + 4, width, height);

    // Foundation Base
    ctx.fillStyle = '#475569';
    ctx.fillRect(sx, sy, width, height);

    // Modern Teal/Steel R&D Facade
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(sx + 2, sy + 2, width - 4, height - 16);

    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(sx + 4, sy + 4, width - 8, 12);

    // Laboratory Ribbon Windows
    ctx.fillStyle = '#0284c7';
    for (let wx = sx + 8; wx < sx + width - 12; wx += 16) {
      ctx.fillRect(wx, sy + 22, 10, 8);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(wx + 1, sy + 23, 4, 3);
      ctx.fillStyle = '#0284c7';
    }

    // Fermentation Silos / Biotech Tanks on side
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(sx + width - 24, sy + 36, 8, 20);
    ctx.fillRect(sx + width - 14, sy + 36, 8, 20);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(sx + width - 20, sy + 36, 4, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(sx + width - 10, sy + 36, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Security Gate & Corporate Entrance
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + 10, sy + height - 14, 20, 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(sx + 12, sy + height - 12, 16, 8);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('INDIAN IMMUNOLOGICALS', cx, sy - 4);

    ctx.restore();
  }

  // 8. Health Center (Medical Clinic with Red Cross 'H' Sign)
  drawHealthCenter(ctx, sx, sy, width = 68, height = 52) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 3, sy + 3, width, height);

    // Clinic White/Cream Walls
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx, sy + 14, width, height - 14);

    // Red Terracotta Pitched Roof
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(sx - 2, sy, width + 4, 16);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(sx, sy + 2, width, 12);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(sx + 2, sy + 2, width - 4, 3);

    // Red Cross / 'H' Medical Emblem Sign
    const signW = 16;
    const signH = 14;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - signW / 2, sy + 8, signW, signH);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - signW / 2, sy + 8, signW, signH);

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', cx, sy + 15);

    // Clinic Glass Windows
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(sx + 6, sy + 28, 12, 10);
    ctx.fillRect(sx + width - 18, sy + 28, 12, 10);

    // Emergency Entrance Portico
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - 10, sy + height - 14, 20, 14);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cx - 8, sy + height - 12, 16, 12);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('HEALTH CENTER', cx, sy - 4);

    ctx.restore();
  }

  // 9. Administration Building (Stately Palace with Blue Roof, Dome & Pillars)
  drawAdminBuilding(ctx, sx, sy, width = 108, height = 75) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(sx + 4, sy + 4, width, height);

    // Foundation Base
    ctx.fillStyle = '#64748b';
    ctx.fillRect(sx, sy + height - 8, width, 8);

    // Ivory Classical Walls
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx + 2, sy + 22, width - 4, height - 30);

    // Royal Blue Grand Hipped Roof
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(sx - 2, sy + 6, width + 4, 18);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(sx, sy + 8, width, 14);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(sx + 4, sy + 8, width - 8, 3);

    // Central Dome / Clock Tower
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(cx, sy + 6, 12, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(cx, sy + 6, 10, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cx - 1, sy - 8, 2, 8);

    // Classical Pillars Portico (4-6 white columns)
    const porticoW = 44;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - porticoW / 2, sy + 18, porticoW, 6);

    for (let col = 0; col < 4; col++) {
      const colX = (cx - porticoW / 2 + 4) + col * 12;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(colX, sy + 24, 4, height - 32);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(colX + 3, sy + 24, 1, height - 32);
    }

    // Grand Entrance Doors
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(cx - 8, sy + height - 16, 16, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cx - 2, sy + height - 10, 4, 2);

    // Windows with Arches
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(sx + 8, sy + 30, 10, 12);
    ctx.fillRect(sx + width - 18, sy + 30, 10, 12);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('ADMINISTRATION BUILDING', cx, sy - 10);

    ctx.restore();
  }

  // 10. School of Computer and Information Sciences (SCIS)
  drawSCISBuilding(ctx, sx, sy, width = 95, height = 70) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 4, sy + 4, width, height);

    // Building Base & Walls
    ctx.fillStyle = '#475569';
    ctx.fillRect(sx, sy + height - 6, width, 6);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(sx + 2, sy + 18, width - 4, height - 24);

    // Sapphire Tech Roof
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(sx, sy + 2, width, 18);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(sx + 2, sy + 4, width - 4, 14);

    // Rooftop Solar Array Panels
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(sx + 8, sy + 6, 20, 8);
    ctx.fillRect(sx + width - 28, sy + 6, 20, 8);
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 8, sy + 6, 20, 8);
    ctx.strokeRect(sx + width - 28, sy + 6, 20, 8);

    // CS Lab Glass Ribbon Windows
    for (let wx = sx + 8; wx < sx + width - 12; wx += 15) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(wx, sy + 26, 10, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(wx + 1, sy + 27, 8, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(wx + 2, sy + 28, 2, 2);
    }

    // Glass Atrium Entrance
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cx - 10, sy + height - 16, 20, 14);
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(cx - 8, sy + height - 14, 16, 12);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('SCHOOL OF COMPUTER SCIENCES', cx, sy - 4);

    ctx.restore();
  }

  // 11. IGM Library, UoH (Lakeside Academic Library Complex)
  drawIGMLibrary(ctx, sx, sy, width = 110, height = 80) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(sx + 4, sy + 4, width, height);

    // Granite Foundation
    ctx.fillStyle = '#475569';
    ctx.fillRect(sx, sy + height - 8, width, 8);

    // Academic Ivory Walls
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx + 2, sy + 20, width - 4, height - 28);

    // Deep Indigo Academic Roof with Skylights
    ctx.fillStyle = '#172554';
    ctx.fillRect(sx, sy + 2, width, 20);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(sx + 2, sy + 4, width - 4, 16);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(sx + 4, sy + 4, width - 8, 3);

    // Skylight Glass Strips
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(sx + 14, sy + 8, 24, 6);
    ctx.fillRect(sx + width - 38, sy + 8, 24, 6);

    // Reading Room Panoramic Windows
    for (let wx = sx + 8; wx < sx + width - 10; wx += 18) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx, sy + 28, 12, 16);
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(wx + 1, sy + 29, 10, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(wx + 2, sy + 30, 2, 4);
    }

    // Grand Entrance Portal
    ctx.fillStyle = '#312e81';
    ctx.fillRect(cx - 12, sy + height - 16, 24, 14);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(cx - 10, sy + height - 14, 20, 12);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('IGM LIBRARY, UOH', cx, sy - 4);

    ctx.restore();
  }

  // 12. HCU Small Gate / Security Office (Barrier Gatehouse)
  drawSecurityGateOffice(ctx, sx, sy, width = 55, height = 40) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 3, sy + 3, width, height);

    // Security Cabin Walls
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx, sy + 10, width, height - 10);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx, sy + 10, width, height - 10);

    // Blue Sentry Roof
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(sx - 2, sy, width + 4, 12);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(sx, sy + 2, width, 8);

    // Security Lookout Window
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(sx + 6, sy + 18, 14, 10);

    // Sentry Door
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + width - 18, sy + 18, 12, height - 18);

    // Road Boom Barrier Arm (Striped red & white)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(sx - 20, sy + height - 8, 22, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx - 16, sy + height - 8, 4, 4);
    ctx.fillRect(sx - 8, sy + height - 8, 4, 4);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('HCU SMALL GATE', cx, sy - 4);

    ctx.restore();
  }

  // 13. Karthik SIM Cards and Xerox Shop
  drawKarthikXerox(ctx, sx, sy, width = 56, height = 44) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 3, sy + 3, width, height);

    // Shop Walls
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(sx, sy + 12, width, height - 12);

    // Blue & White Striped Storefront Awning
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(sx - 2, sy, width + 4, 14);
    ctx.fillStyle = '#ffffff';
    for (let ax = sx; ax < sx + width; ax += 10) {
      ctx.fillRect(ax, sy, 5, 14);
    }

    // Storefront Counter & Xerox Machine
    ctx.fillStyle = '#475569';
    ctx.fillRect(sx + 6, sy + 22, width - 12, height - 24);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(sx + 8, sy + 24, 16, 10); // Xerox machine

    // Signboard
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(sx + 2, sy + 14, width - 4, 7);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 6px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('XEROX & SIM', cx, sy + 20);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('KARTHIK XEROX', cx, sy - 4);

    ctx.restore();
  }

  // 14. India Post (Postal Office)
  drawIndiaPost(ctx, sx, sy, width = 60, height = 46) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 3, sy + 3, width, height);

    // Building Walls
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx, sy + 12, width, height - 12);

    // Red Post Office Roof
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(sx - 2, sy, width + 4, 14);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(sx, sy + 2, width, 10);

    // Postal Emblem Badge
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx - 8, sy + 14, 16, 8);
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 6px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POST', cx, sy + 20);

    // Red Mailbox outside
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(sx + 6, sy + height - 14, 6, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx + 7, sy + height - 12, 4, 2);

    // Service Door & Counter
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx, sy + 26, 16, height - 26);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('INDIA POST', cx, sy - 4);

    ctx.restore();
  }

  // 15. Sukoon Canteen (Cozy Open-Air Glade Pavilion with Umbrella Seating)
  drawSukoonCanteen(ctx, sx, sy, width = 76, height = 55) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(sx + 3, sy + 3, width, height);

    // Sandstone Ground Deck
    ctx.fillStyle = '#d4be92';
    ctx.fillRect(sx, sy, width, height);
    ctx.strokeStyle = '#947848';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx, sy, width, height);

    // Wooden Timber Canteen Cabin
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(sx + 6, sy + 6, 32, 28);
    ctx.fillStyle = '#15803d'; // Green pitched roof
    ctx.fillRect(sx + 4, sy + 4, 36, 10);

    // Chai / Food Serving Counter
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(sx + 10, sy + 18, 24, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx + 14, sy + 20, 6, 4); // Steaming tea kettle

    // Outdoor Striped Umbrellas & Picnic Benches
    const drawUmbrella = (ux, uy, color1 = '#ef4444', color2 = '#ffffff') => {
      // Umbrella stand
      ctx.fillStyle = '#475569';
      ctx.fillRect(ux - 1, uy, 2, 14);
      // Umbrella canopy
      ctx.fillStyle = color1;
      ctx.beginPath();
      ctx.arc(ux, uy, 10, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = color2;
      ctx.beginPath();
      ctx.arc(ux, uy, 6, Math.PI, 0);
      ctx.fill();
      // Table
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(ux - 6, uy + 10, 12, 4);
    };

    drawUmbrella(sx + width - 16, sy + 18, '#ef4444', '#f8fafc');
    drawUmbrella(sx + width - 16, sy + 40, '#3b82f6', '#f8fafc');
    drawUmbrella(sx + 20, sy + 40, '#f59e0b', '#f8fafc');

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('SUKOON', cx, sy - 4);

    ctx.restore();
  }

  // 16. RV Panchajanya Kondapur (Modern Dense Apartment Complex)
  drawRVPanchajanya(ctx, sx, sy, width = 95, height = 65) {
    ctx.save();
    const cx = sx + width / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(sx + 4, sy + 4, width, height);

    // Concrete Base & Twin High-Rise Blocks
    ctx.fillStyle = '#475569';
    ctx.fillRect(sx, sy + 10, width, height - 10);

    // Left Block
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(sx + 2, sy + 6, width / 2 - 4, height - 16);
    // Right Block
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(sx + width / 2 + 2, sy + 2, width / 2 - 4, height - 12);

    // Grids of Balcony Windows
    ctx.fillStyle = '#1e293b';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillRect(sx + 6 + c * 10, sy + 16 + r * 12, 6, 6);
        ctx.fillRect(sx + width / 2 + 6 + c * 10, sy + 12 + r * 12, 6, 6);
      }
    }

    // Rooftop Water Tanks
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(sx + 10, sy + 2, 8, 5);
    ctx.fillRect(sx + width - 18, sy - 2, 8, 5);

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText('RV PANCHAJANYA', cx, sy - 6);

    ctx.restore();
  }

  // 17. Green Football Turf / Sports Ground
  drawFootballField(ctx, sx, sy, width = 70, height = 50) {
    ctx.save();
    // Green Turf
    ctx.fillStyle = '#15803d';
    ctx.fillRect(sx, sy, width, height);

    // Outer line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx + 2, sy + 2, width - 4, height - 4);

    // Center Line & Circle
    const midX = sx + width / 2;
    ctx.beginPath();
    ctx.moveTo(midX, sy + 2);
    ctx.lineTo(midX, sy + height - 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(midX, sy + height / 2, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Goal Penalty Areas
    ctx.strokeRect(sx + 2, sy + height / 2 - 8, 8, 16);
    ctx.strokeRect(sx + width - 10, sy + height / 2 - 8, 8, 16);

    ctx.restore();
  }

  // 18. Parking Area with Blue "P" Sign & Pixel Cars
  drawParkingArea(ctx, sx, sy, width = 50, height = 40) {
    ctx.save();
    // Asphalt Pavement
    ctx.fillStyle = '#334155';
    ctx.fillRect(sx, sy, width, height);

    // White Parking Bays
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    for (let py = sy + 6; py < sy + height; py += 10) {
      ctx.beginPath();
      ctx.moveTo(sx + 4, py);
      ctx.lineTo(sx + 18, py);
      ctx.moveTo(sx + 26, py);
      ctx.lineTo(sx + width - 4, py);
      ctx.stroke();
    }

    // Parked Mini Pixel Cars
    const drawMiniCar = (mx, my, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(mx, my, 12, 6);
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(mx + 2, my + 1, 4, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(mx - 1, my, 2, 2);
      ctx.fillRect(mx - 1, my + 4, 2, 2);
      ctx.fillRect(mx + 11, my, 2, 2);
      ctx.fillRect(mx + 11, my + 4, 2, 2);
    };

    drawMiniCar(sx + 5, sy + 8, '#ef4444');
    drawMiniCar(sx + 30, sy + 18, '#3b82f6');
    drawMiniCar(sx + 5, sy + 28, '#f59e0b');

    // Blue "P" Sign Badge
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(sx + width - 16, sy + 4, 12, 12);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + width - 16, sy + 4, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('P', sx + width - 10, sy + 13);

    ctx.restore();
  }

  // 19. Authentic 8-Bit Map Legend Box
  drawMapLegend(ctx, sx, sy) {
    ctx.save();
    const w = 115;
    const h = 135;

    // Dark parchment background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(sx, sy, w, h);

    // Gold Double Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, w, h);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 3, sy + 3, w - 6, h - 6);

    // Title
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEGEND', sx + w / 2, sy + 15);

    // Divider
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx + 10, sy + 20);
    ctx.lineTo(sx + w - 10, sy + 20);
    ctx.stroke();

    const items = [
      { name: 'FOREST', color: '#15803d', icon: 'tree' },
      { name: 'GRASS', color: '#58b848', icon: 'square' },
      { name: 'FIELD', color: '#a67c48', icon: 'square' },
      { name: 'ROAD', color: '#374151', icon: 'road' },
      { name: 'PATH', color: '#9a7b56', icon: 'path' },
      { name: 'WATER', color: '#2563eb', icon: 'water' },
      { name: 'BUILDING', color: '#2563eb', icon: 'building' }
    ];

    let iy = sy + 32;
    items.forEach(item => {
      ctx.textAlign = 'left';

      // Swatch
      if (item.icon === 'tree') {
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(sx + 16, iy - 3, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.icon === 'road') {
        ctx.fillStyle = '#374151';
        ctx.fillRect(sx + 11, iy - 7, 12, 8);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + 11, iy - 3);
        ctx.lineTo(sx + 23, iy - 3);
        ctx.stroke();
      } else if (item.icon === 'path') {
        ctx.fillStyle = '#9a7b56';
        ctx.fillRect(sx + 11, iy - 7, 12, 8);
      } else if (item.icon === 'water') {
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(sx + 11, iy - 7, 12, 8);
      } else if (item.icon === 'building') {
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(sx + 11, iy - 7, 12, 8);
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(sx + 13, iy - 5, 3, 3);
      } else {
        ctx.fillStyle = item.color;
        ctx.fillRect(sx + 11, iy - 7, 12, 8);
      }

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 11, iy - 7, 12, 8);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(item.name, sx + 30, iy);

      iy += 15;
    });

    ctx.restore();
  }

  // Ancient Deccan Monolith Rock Formations
  drawRockMonolith(ctx, sx, sy, name, type = 'granite') {
    ctx.save();
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(sx + 30, sy + 38, 28, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    if (type === 'masoom') {
      // Mushroom-shaped iconic Masoom's Rock
      ctx.fillStyle = '#484858';
      ctx.fillRect(sx + 20, sy + 18, 20, 22);
      ctx.fillStyle = '#787888';
      ctx.fillRect(sx + 22, sy + 18, 8, 22);

      // Balancing top cap
      ctx.fillStyle = '#585868';
      ctx.beginPath();
      ctx.ellipse(sx + 30, sy + 14, 28, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#9898a8';
      ctx.beginPath();
      ctx.ellipse(sx + 28, sy + 11, 24, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#d82828';
      ctx.fillRect(sx + 10, sy + 38, 40, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("MASOOM'S ROCK", sx + 30, sy + 46);
    } else if (type === 'globbo') {
      // Spherical Deccan granite sphere
      ctx.fillStyle = '#484858';
      ctx.beginPath();
      ctx.arc(sx + 30, sy + 22, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#787888';
      ctx.beginPath();
      ctx.arc(sx + 28, sy + 20, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b8b8c8';
      ctx.beginPath();
      ctx.arc(sx + 24, sy + 16, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GLOBBO ROCK', sx + 30, sy + 46);
    } else if (type === 'cherry') {
      // Pinkish/cherry granite
      ctx.fillStyle = '#6b3848';
      ctx.beginPath();
      ctx.moveTo(sx + 8, sy + 36);
      ctx.lineTo(sx + 28, sy + 6);
      ctx.lineTo(sx + 52, sy + 36);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#b05870';
      ctx.beginPath();
      ctx.moveTo(sx + 14, sy + 34);
      ctx.lineTo(sx + 28, sy + 8);
      ctx.lineTo(sx + 40, sy + 34);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CHERRY ROCK', sx + 30, sy + 46);
    } else if (type === 'aquarium') {
      // Monolith with hollow basin pool
      ctx.fillStyle = '#484858';
      ctx.beginPath();
      ctx.ellipse(sx + 30, sy + 22, 26, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#787888';
      ctx.beginPath();
      ctx.ellipse(sx + 30, sy + 20, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rainwater basin pool
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(sx + 30, sy + 20, 14, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AQUARIUM ROCK', sx + 30, sy + 46);
    } else if (type === 'mushroom') {
      // Iconic Hyderabad INTACH Heritage Mushroom Rock
      // Stem / Pedestal
      ctx.fillStyle = '#3a3a48';
      ctx.fillRect(sx + 24, sy + 18, 12, 22);
      ctx.fillStyle = '#646474';
      ctx.fillRect(sx + 26, sy + 18, 6, 22);

      // Wide umbrella mushroom cap
      ctx.fillStyle = '#525262';
      ctx.beginPath();
      ctx.ellipse(sx + 30, sy + 14, 26, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8e8ea0';
      ctx.beginPath();
      ctx.ellipse(sx + 28, sy + 11, 22, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heritage plaque
      ctx.fillStyle = '#d97706';
      ctx.fillRect(sx + 8, sy + 38, 44, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MUSHROOM ROCK', sx + 30, sy + 46);
    } else {
      ctx.fillStyle = '#585868';
      ctx.beginPath();
      ctx.moveTo(sx + 10, sy + 36);
      ctx.lineTo(sx + 30, sy + 8);
      ctx.lineTo(sx + 50, sy + 36);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#888898';
      ctx.beginPath();
      ctx.moveTo(sx + 15, sy + 34);
      ctx.lineTo(sx + 30, sy + 10);
      ctx.lineTo(sx + 36, sy + 34);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(name || 'Rock', sx + 30, sy + 46);
    }
    ctx.restore();
  }

  // =========================================================================
  // 3. WILDLIFE PIXEL SPRITES
  // =========================================================================

  getPeacockSprite(frame = 0) {
    const key = `peacock_${frame}`;
    if (this.cache[key]) return this.cache[key];
    const { canvas, ctx } = this.createCanvas(20, 20);

    ctx.fillStyle = '#107850';
    ctx.beginPath();
    ctx.arc(14, 8, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8d030';
    ctx.fillRect(11, 4, 2, 2);
    ctx.fillRect(15, 4, 2, 2);
    ctx.fillRect(13, 8, 2, 2);

    ctx.fillStyle = '#1858b8';
    ctx.fillRect(5, 7, 6, 7);

    ctx.fillRect(4, 3, 3, 5);
    ctx.fillRect(3, 2, 4, 3);

    ctx.fillStyle = '#f8a820';
    ctx.fillRect(1, 3, 2, 1);
    ctx.fillStyle = '#107850';
    ctx.fillRect(4, 0, 2, 2);

    ctx.fillStyle = '#483820';
    ctx.fillRect(6, 14, 1, 5 + (frame % 2));
    ctx.fillRect(9, 14, 1, 5 - (frame % 2));

    this.cache[key] = canvas;
    return canvas;
  }

  getDeerSprite(frame = 0) {
    const key = `deer_${frame}`;
    if (this.cache[key]) return this.cache[key];
    const { canvas, ctx } = this.createCanvas(20, 22);

    ctx.fillStyle = '#a86830';
    ctx.fillRect(4, 7, 11, 7);

    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(6, 8, 2, 2);
    ctx.fillRect(10, 8, 2, 2);
    ctx.fillRect(8, 11, 2, 2);

    ctx.fillStyle = '#a86830';
    ctx.fillRect(12, 3, 4, 6);
    ctx.fillRect(13, 1, 5, 4);

    ctx.fillStyle = '#181820';
    ctx.fillRect(18, 3, 1, 1);
    ctx.fillRect(15, 2, 1, 1);

    ctx.fillStyle = '#583818';
    ctx.fillRect(13, 0, 2, 1);

    ctx.fillStyle = '#784818';
    ctx.fillRect(5, 14, 2, 7 + (frame % 2));
    ctx.fillRect(12, 14, 2, 7 - (frame % 2));

    this.cache[key] = canvas;
    return canvas;
  }

  getButterflySprite(frame = 0) {
    const key = `butterfly_${frame}`;
    if (this.cache[key]) return this.cache[key];
    const { canvas, ctx } = this.createCanvas(10, 10);

    const wingSpread = frame % 2 === 0 ? 3 : 1;

    ctx.fillStyle = '#f8d030';
    ctx.fillRect(5 - wingSpread, 2, wingSpread, 3);
    ctx.fillRect(5, 2, wingSpread, 3);
    ctx.fillRect(5 - wingSpread, 6, wingSpread, 2);
    ctx.fillRect(5, 6, wingSpread, 2);

    ctx.fillStyle = '#181828';
    ctx.fillRect(4, 2, 2, 6);

    this.cache[key] = canvas;
    return canvas;
  }

  // =========================================================================
  // 4. GBA TRAINER & NPC SPRITES
  // =========================================================================

  getTrainerSprite(direction = 'down', frame = 0, isSprinting = false) {
    const key = `trainer_${direction}_${frame}_${isSprinting}`;
    if (this.cache[key]) return this.cache[key];

    const { canvas, ctx } = this.createCanvas(16, 20);
    const legOffset = frame === 1 ? -1 : (frame === 2 ? 1 : 0);

    const capRed = '#d82828';
    const capWhite = '#f8f8f8';
    const skinTone = '#f8b888';
    const hairDark = '#282838';
    const vestBlue = '#2868c8';
    const shirtLight = '#e8f0f8';
    const pantsNavy = '#283858';
    const shoesRed = '#e84848';
    const bagGold = '#f8a820';

    if (direction === 'down') {
      ctx.fillStyle = capRed;
      ctx.fillRect(4, 0, 8, 4);
      ctx.fillStyle = capWhite;
      ctx.fillRect(4, 3, 8, 2);

      ctx.fillStyle = hairDark;
      ctx.fillRect(3, 4, 1, 3);
      ctx.fillRect(12, 4, 1, 3);

      ctx.fillStyle = skinTone;
      ctx.fillRect(4, 4, 8, 5);

      ctx.fillStyle = '#181828';
      ctx.fillRect(5, 6, 2, 2);
      ctx.fillRect(9, 6, 2, 2);

      ctx.fillStyle = vestBlue;
      ctx.fillRect(3, 9, 10, 6);
      ctx.fillStyle = shirtLight;
      ctx.fillRect(6, 9, 4, 5);

      ctx.fillStyle = skinTone;
      ctx.fillRect(2, 10 + legOffset, 2, 4);
      ctx.fillRect(12, 10 - legOffset, 2, 4);

      ctx.fillStyle = pantsNavy;
      ctx.fillRect(4, 15, 3, 3 + (legOffset > 0 ? 1 : 0));
      ctx.fillRect(9, 15, 3, 3 + (legOffset < 0 ? 1 : 0));

      ctx.fillStyle = shoesRed;
      ctx.fillRect(3, 17 + (legOffset > 0 ? 1 : 0), 4, 3);
      ctx.fillRect(9, 17 + (legOffset < 0 ? 1 : 0), 4, 3);
    } else if (direction === 'up') {
      ctx.fillStyle = capRed;
      ctx.fillRect(4, 0, 8, 5);

      ctx.fillStyle = hairDark;
      ctx.fillRect(3, 4, 10, 4);

      ctx.fillStyle = vestBlue;
      ctx.fillRect(3, 8, 10, 7);
      ctx.fillStyle = bagGold;
      ctx.fillRect(5, 9, 6, 5);
      ctx.fillStyle = '#b87010';
      ctx.fillRect(6, 11, 4, 2);

      ctx.fillStyle = skinTone;
      ctx.fillRect(2, 9 - legOffset, 2, 4);
      ctx.fillRect(12, 9 + legOffset, 2, 4);

      ctx.fillStyle = pantsNavy;
      ctx.fillRect(4, 15, 3, 3 + (legOffset < 0 ? 1 : 0));
      ctx.fillRect(9, 15, 3, 3 + (legOffset > 0 ? 1 : 0));

      ctx.fillStyle = shoesRed;
      ctx.fillRect(3, 17 + (legOffset < 0 ? 1 : 0), 4, 3);
      ctx.fillRect(9, 17 + (legOffset > 0 ? 1 : 0), 4, 3);
    } else if (direction === 'left') {
      ctx.fillStyle = capRed;
      ctx.fillRect(4, 0, 7, 4);
      ctx.fillStyle = capWhite;
      ctx.fillRect(2, 2, 3, 2);

      ctx.fillStyle = hairDark;
      ctx.fillRect(7, 4, 4, 3);
      ctx.fillStyle = skinTone;
      ctx.fillRect(3, 4, 5, 5);

      ctx.fillStyle = '#181828';
      ctx.fillRect(3, 6, 2, 2);

      ctx.fillStyle = vestBlue;
      ctx.fillRect(4, 9, 7, 6);
      ctx.fillStyle = bagGold;
      ctx.fillRect(8, 9, 3, 5);

      ctx.fillStyle = skinTone;
      ctx.fillRect(4, 10 + legOffset, 3, 4);

      ctx.fillStyle = pantsNavy;
      ctx.fillRect(5, 15, 5, 3);

      ctx.fillStyle = shoesRed;
      ctx.fillRect(3 + legOffset * 2, 17, 6, 3);
    } else if (direction === 'right') {
      ctx.fillStyle = capRed;
      ctx.fillRect(5, 0, 7, 4);
      ctx.fillStyle = capWhite;
      ctx.fillRect(11, 2, 3, 2);

      ctx.fillStyle = hairDark;
      ctx.fillRect(5, 4, 4, 3);
      ctx.fillStyle = skinTone;
      ctx.fillRect(8, 4, 5, 5);

      ctx.fillStyle = '#181828';
      ctx.fillRect(11, 6, 2, 2);

      ctx.fillStyle = vestBlue;
      ctx.fillRect(5, 9, 7, 6);
      ctx.fillStyle = bagGold;
      ctx.fillRect(5, 9, 3, 5);

      ctx.fillStyle = skinTone;
      ctx.fillRect(9, 10 - legOffset, 3, 4);

      ctx.fillStyle = pantsNavy;
      ctx.fillRect(6, 15, 5, 3);

      ctx.fillStyle = shoesRed;
      ctx.fillRect(7 - legOffset * 2, 17, 6, 3);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  getNPCSprite(type = 'senior') {
    const key = `npc_${type}`;
    if (this.cache[key]) return this.cache[key];

    const { canvas, ctx } = this.createCanvas(16, 20);

    if (type === 'prof') {
      ctx.fillStyle = '#d0d0d8';
      ctx.fillRect(4, 1, 8, 4);
      ctx.fillStyle = '#f8b888';
      ctx.fillRect(5, 4, 6, 5);
      ctx.fillStyle = '#181828';
      ctx.fillRect(5, 5, 2, 2);
      ctx.fillRect(9, 5, 2, 2);
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(3, 9, 10, 7);
      ctx.fillStyle = '#d82828';
      ctx.fillRect(7, 9, 2, 4);
      ctx.fillStyle = '#383848';
      ctx.fillRect(4, 16, 3, 3);
      ctx.fillRect(9, 16, 3, 3);
      ctx.fillStyle = '#181820';
      ctx.fillRect(3, 18, 4, 2);
      ctx.fillRect(9, 18, 4, 2);
    } else if (type === 'guard') {
      ctx.fillStyle = '#284878';
      ctx.fillRect(4, 1, 8, 4);
      ctx.fillStyle = '#f8d030';
      ctx.fillRect(7, 1, 2, 2);
      ctx.fillStyle = '#f8b888';
      ctx.fillRect(5, 4, 6, 5);
      ctx.fillStyle = '#181828';
      ctx.fillRect(6, 6, 2, 2);
      ctx.fillRect(9, 6, 2, 2);
      ctx.fillStyle = '#b8a078';
      ctx.fillRect(3, 9, 10, 6);
      ctx.fillStyle = '#284878';
      ctx.fillRect(3, 9, 2, 2);
      ctx.fillRect(11, 9, 2, 2);
      ctx.fillStyle = '#283858';
      ctx.fillRect(4, 15, 3, 4);
      ctx.fillRect(9, 15, 3, 4);
    } else if (type === 'vendor') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, 0, 8, 5);
      ctx.fillStyle = '#f8b888';
      ctx.fillRect(5, 4, 6, 5);
      ctx.fillStyle = '#181828';
      ctx.fillRect(6, 6, 2, 2);
      ctx.fillRect(9, 6, 2, 2);
      ctx.fillStyle = '#e84848';
      ctx.fillRect(3, 9, 10, 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, 9, 4, 6);
      ctx.fillStyle = '#282838';
      ctx.fillRect(4, 16, 3, 3);
      ctx.fillRect(9, 16, 3, 3);
    } else {
      ctx.fillStyle = '#804020';
      ctx.fillRect(3, 1, 10, 7);
      ctx.fillStyle = '#48c848';
      ctx.fillRect(4, 2, 8, 2);
      ctx.fillStyle = '#f8b888';
      ctx.fillRect(5, 4, 6, 5);
      ctx.fillStyle = '#181828';
      ctx.fillRect(6, 6, 2, 2);
      ctx.fillRect(9, 6, 2, 2);
      ctx.fillStyle = '#8838a8';
      ctx.fillRect(3, 9, 10, 6);
      ctx.fillStyle = '#f8d030';
      ctx.fillRect(4, 15, 8, 3);
      ctx.fillStyle = '#e84848';
      ctx.fillRect(4, 18, 3, 2);
      ctx.fillRect(9, 18, 3, 2);
    }

    this.cache[key] = canvas;
    return canvas;
  }

  getExclamationBubble() {
    if (this.cache.exclamation) return this.cache.exclamation;
    const { canvas, ctx } = this.createCanvas(14, 16);

    ctx.fillStyle = '#181828';
    ctx.fillRect(1, 0, 12, 13);
    ctx.fillRect(0, 1, 14, 11);
    ctx.fillRect(5, 13, 4, 2);
    ctx.fillRect(6, 15, 2, 1);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 1, 10, 11);
    ctx.fillRect(1, 2, 12, 9);
    ctx.fillRect(6, 12, 2, 2);

    ctx.fillStyle = '#e82828';
    ctx.fillRect(6, 3, 2, 5);
    ctx.fillRect(6, 9, 2, 2);

    this.cache.exclamation = canvas;
    return canvas;
  }

  // =========================================================================
  // 5. CAMPUS VEHICLES & E-SHUTTLES (peteroravec.com style traffic system)
  // =========================================================================

  getVehicleSprite(direction = 'right', color = 'emerald', isBlinking = false, blinkSide = 'right') {
    const key = `vehicle_${direction}_${color}_${isBlinking ? blinkSide : 'none'}`;
    if (this.cache[key]) return this.cache[key];

    const isHorizontal = direction === 'left' || direction === 'right';
    const width = isHorizontal ? 36 : 22;
    const height = isHorizontal ? 22 : 36;
    const { canvas, ctx } = this.createCanvas(width, height);

    const bodyColors = {
      emerald: { main: '#059669', dark: '#047857', light: '#34d399', roof: '#10b981' },
      blue: { main: '#2563eb', dark: '#1d4ed8', light: '#60a5fa', roof: '#3b82f6' },
      yellow: { main: '#d97706', dark: '#b45309', light: '#fcd34d', roof: '#f59e0b' },
      purple: { main: '#7c3aed', dark: '#6d28d9', light: '#a78bfa', roof: '#8b5cf6' }
    };
    const c = bodyColors[color] || bodyColors.emerald;

    if (isHorizontal) {
      const isRight = direction === 'right';
      // Chassis shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(2, 18, 32, 4);

      // Main Vehicle Body (Campus E-Shuttle Buggy)
      ctx.fillStyle = c.dark;
      ctx.fillRect(2, 6, 32, 12);
      ctx.fillStyle = c.main;
      ctx.fillRect(3, 7, 30, 10);

      // Canopy / Roof Pillars
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(5, 2, 2, 6);
      ctx.fillRect(17, 2, 2, 6);
      ctx.fillRect(29, 2, 2, 6);
      ctx.fillStyle = c.roof;
      ctx.fillRect(3, 0, 30, 3);
      ctx.fillStyle = c.light;
      ctx.fillRect(4, 1, 28, 1);

      // Windshield & Side Windows
      ctx.fillStyle = '#67e8f9';
      if (isRight) {
        ctx.fillRect(26, 4, 6, 4); // Front windshield
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(27, 4, 3, 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(7, 4, 18, 4); // Side passenger window
      } else {
        ctx.fillRect(4, 4, 6, 4); // Front windshield
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(6, 4, 3, 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(11, 4, 18, 4); // Side passenger window
      }

      // Wheels (Rubber tires with metal rims)
      const drawWheel = (wx, wy) => {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(wx, wy, 7, 6);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(wx + 1, wy + 1, 5, 4);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(wx + 2, wy + 2, 3, 2);
      };
      drawWheel(5, 14);
      drawWheel(24, 14);

      // Lights
      if (isRight) {
        // Headlights (Front right)
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(33, 9, 2, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(34, 10, 1, 1);
        // Taillights (Rear left)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(2, 9, 2, 3);
        // Blinkers
        if (isBlinking) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(33, 7, 2, 2);
        }
      } else {
        // Headlights (Front left)
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(1, 9, 2, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(1, 10, 1, 1);
        // Taillights (Rear right)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(32, 9, 2, 3);
        // Blinkers
        if (isBlinking) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(1, 7, 2, 2);
        }
      }
    } else {
      // Vertical (Up or Down)
      const isDown = direction === 'down';
      // Chassis shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(1, 4, 20, 30);

      // Body
      ctx.fillStyle = c.dark;
      ctx.fillRect(2, 2, 18, 32);
      ctx.fillStyle = c.main;
      ctx.fillRect(3, 3, 16, 30);

      // Roof
      ctx.fillStyle = c.roof;
      ctx.fillRect(4, 8, 14, 20);
      ctx.fillStyle = c.light;
      ctx.fillRect(5, 9, 12, 2);

      // Windshield
      ctx.fillStyle = '#67e8f9';
      if (isDown) {
        ctx.fillRect(4, 28, 14, 3);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(6, 29, 10, 1);
        // Headlights (Bottom)
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(3, 33, 3, 2);
        ctx.fillRect(16, 33, 3, 2);
        // Taillights (Top)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(3, 1, 3, 2);
        ctx.fillRect(16, 1, 3, 2);
      } else {
        ctx.fillRect(4, 5, 14, 3);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(6, 6, 10, 1);
        // Headlights (Top)
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(3, 1, 3, 2);
        ctx.fillRect(16, 1, 3, 2);
        // Taillights (Bottom)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(3, 33, 3, 2);
        ctx.fillRect(16, 33, 3, 2);
      }

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 5, 3, 6);
      ctx.fillRect(19, 5, 3, 6);
      ctx.fillRect(0, 25, 3, 6);
      ctx.fillRect(19, 25, 3, 6);

      // Blinkers
      if (isBlinking) {
        ctx.fillStyle = '#f59e0b';
        if (blinkSide === 'left') {
          ctx.fillRect(2, isDown ? 31 : 3, 3, 2);
        } else {
          ctx.fillRect(17, isDown ? 31 : 3, 3, 2);
        }
      }
    }

    this.cache[key] = canvas;
    return canvas;
  }

  // Preloader & Mascot Pixel Art Frame Generator
  getMascotSprite(frame = 0) {
    const key = `mascot_${frame % 4}`;
    if (this.cache[key]) return this.cache[key];

    const { canvas, ctx } = this.createCanvas(32, 32);
    const bounce = (frame % 2 === 1) ? 1 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(16, 28, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red Graduation Cap / Student Beanie
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(8, 4 + bounce, 16, 6);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(9, 3 + bounce, 14, 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(15, 2 + bounce, 2, 2); // Tassel button
    ctx.fillRect(21, 4 + bounce, 2, 6); // Tassel drop

    // Face / Skin
    ctx.fillStyle = '#f8b888';
    ctx.fillRect(9, 10 + bounce, 14, 9);
    // Hair
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(8, 9 + bounce, 3, 6);
    ctx.fillRect(21, 9 + bounce, 3, 6);
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(11, 13 + bounce, 2, 3);
    ctx.fillRect(19, 13 + bounce, 2, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(11, 13 + bounce, 1, 1);
    ctx.fillRect(19, 13 + bounce, 1, 1);
    // Smile
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(14, 16 + bounce, 4, 1);
    ctx.fillRect(15, 17 + bounce, 2, 1);

    // Blue Hoodie / Campus Jacket
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(7, 19 + bounce, 18, 7);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(9, 19 + bounce, 14, 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(15, 21 + bounce, 2, 5); // Zipper

    // Hands Waving
    if (frame % 4 < 2) {
      ctx.fillStyle = '#f8b888';
      ctx.fillRect(4, 16 + bounce, 4, 4);
    } else {
      ctx.fillStyle = '#f8b888';
      ctx.fillRect(24, 16 + bounce, 4, 4);
    }

    // Jeans & Red Sneakers
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(9, 26 + bounce, 6, 2);
    ctx.fillRect(17, 26 + bounce, 6, 2);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(8, 27 + bounce, 7, 3);
    ctx.fillRect(17, 27 + bounce, 7, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 29 + bounce, 7, 1);
    ctx.fillRect(17, 29 + bounce, 7, 1);

    this.cache[key] = canvas;
    return canvas;
  }
}

export const pixelEngine = new PixelArtEngine();
