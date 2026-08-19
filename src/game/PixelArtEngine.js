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
}

export const pixelEngine = new PixelArtEngine();
