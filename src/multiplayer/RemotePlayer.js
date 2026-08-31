import { pixelEngine } from '../game/PixelArtEngine.js';

/**
 * RemotePlayer: Networked Student Entity with 60fps Positional Interpolation,
 * Floating Student Nameplates, 2.5D Jump Height, Speech Bubbles & Emotes.
 */
export class RemotePlayer {
  constructor(id, data = {}) {
    this.id = id;
    this.name = data.name || 'Fellow Student';
    this.level = data.level || 1;
    this.title = data.title || 'Student';
    this.club = data.club || 'Independent';
    this.clubIcon = data.clubIcon || '🎓';
    this.department = data.department || 'School of Computer Sciences';
    this.reputation = data.reputation || 100;
    this.isAi = data.isAi || false;

    // Spatial & Animation State
    this.x = data.x || 740;
    this.y = data.y || 320;
    this.z = data.z || 0; // 2.5D Jump height
    this.targetX = this.x;
    this.targetY = this.y;
    this.targetZ = this.z;

    this.direction = data.direction || 'down';
    this.walkFrame = data.walkFrame || 0;
    this.isSprinting = data.isSprinting || false;
    this.section = data.section || 'main';
    this.interiorId = data.interiorId || null;

    // Speech & Emote Bubbles
    this.speechBubble = null;
    this.speechTimer = 0;
    this.activeEmote = null;
    this.emoteTimer = 0;

    // Entity Dimensions for 2.5D Z-Sorting
    this.width = 24;
    this.height = 30;

    // AI Routine Waypoints (if simulated student)
    this.waypoints = data.waypoints || [];
    this.currentWpIndex = 0;
    this.aiSpeed = data.aiSpeed || (70 + Math.random() * 40);
    this.idleTimer = 0;
  }

  updateState(data) {
    if (data.x !== undefined) this.targetX = data.x;
    if (data.y !== undefined) this.targetY = data.y;
    if (data.z !== undefined) this.targetZ = data.z;
    if (data.direction) this.direction = data.direction;
    if (data.walkFrame !== undefined) this.walkFrame = data.walkFrame;
    if (data.isSprinting !== undefined) this.isSprinting = data.isSprinting;
    if (data.section) this.section = data.section;
    if (data.interiorId !== undefined) this.interiorId = data.interiorId;
    if (data.name) this.name = data.name;
    if (data.level) this.level = data.level;
    if (data.title) this.title = data.title;
    if (data.club) this.club = data.club;
  }

  showSpeech(text, duration = 3.5) {
    this.speechBubble = text;
    this.speechTimer = duration;
  }

  showEmote(emoteObj, duration = 2.5) {
    this.activeEmote = emoteObj;
    this.emoteTimer = duration;
  }

  update(delta) {
    // 1. Speech & Emote Timers
    if (this.speechTimer > 0) {
      this.speechTimer -= delta;
      if (this.speechTimer <= 0) this.speechBubble = null;
    }
    if (this.emoteTimer > 0) {
      this.emoteTimer -= delta;
      if (this.emoteTimer <= 0) this.activeEmote = null;
    }

    // 2. Simulated AI Autonomous Movement (for active campus life)
    if (this.isAi && this.waypoints.length > 0) {
      if (this.idleTimer > 0) {
        this.idleTimer -= delta;
        this.walkFrame = 0;
      } else {
        const target = this.waypoints[this.currentWpIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 8) {
          this.currentWpIndex = (this.currentWpIndex + 1) % this.waypoints.length;
          this.idleTimer = 2 + Math.random() * 4;
        } else {
          const move = Math.min(this.aiSpeed * delta, dist);
          this.x += (dx / dist) * move;
          this.y += (dy / dist) * move;
          this.targetX = this.x;
          this.targetY = this.y;

          if (Math.abs(dx) > Math.abs(dy)) {
            this.direction = dx > 0 ? 'right' : 'left';
          } else {
            this.direction = dy > 0 ? 'down' : 'up';
          }

          const step = Math.floor(Date.now() / 150) % 4;
          this.walkFrame = step === 1 ? 1 : (step === 3 ? 2 : 0);
        }
      }
      return;
    }

    // 3. Smooth Positional Interpolation (Hermite / LERP at 60fps)
    const lerpRate = 0.25;
    this.x += (this.targetX - this.x) * lerpRate;
    this.y += (this.targetY - this.y) * lerpRate;
    this.z += (this.targetZ - this.z) * lerpRate;
  }

  drawShadow(ctx, camera, shadowOffset = { x: 0, y: 0 }) {
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);

    const shadowScale = Math.max(0.35, 1.0 - (this.z || 0) / 50);
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse(
      screenX + 12 + shadowOffset.x * 0.4,
      screenY + 26 + shadowOffset.y * 0.4,
      8 * shadowScale,
      3.5 * shadowScale,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  draw(ctx, camera, isOccluded = false) {
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);
    const elevatedY = Math.round(screenY - (this.z || 0));

    if (screenX < -60 || screenX > camera.width + 60 || screenY < -60 || screenY > camera.height + 60) return;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Draw Drop Shadow
    this.drawShadow(ctx, camera);

    if (isOccluded) {
      ctx.globalAlpha = 0.55;
    }

    // Draw Character Sprite
    const spriteCanvas = pixelEngine.getTrainerSprite(this.direction, this.walkFrame, this.isSprinting);
    ctx.drawImage(spriteCanvas, 0, 0, 16, 20, screenX, elevatedY, 24, 30);

    // Floating Student Nameplate
    this.drawNameplate(ctx, screenX + 12, elevatedY - 6);

    // Active Emote Pop
    if (this.activeEmote) {
      const bob = Math.sin(Date.now() / 120) * 3;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.arc(screenX + 12, elevatedY - 26 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.activeEmote.icon, screenX + 12, elevatedY - 25 + bob);
    }

    // Active Speech Bubble
    if (this.speechBubble) {
      this.drawSpeechBubble(ctx, screenX + 12, elevatedY - 30);
    }

    ctx.restore();
  }

  drawNameplate(ctx, centerX, topY) {
    ctx.save();
    const titleText = `Lvl ${this.level} · ${this.name}`;
    ctx.font = 'bold 7px sans-serif';
    const nameMetrics = ctx.measureText(titleText);

    const pad = 4;
    const w = nameMetrics.width + pad * 2 + 10;
    const h = 11;
    const rx = Math.round(centerX - w / 2);
    const ry = Math.round(topY - h);

    // Glass pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(rx, ry, w, h, 3);
    ctx.fill();

    // Club indicator accent
    let accent = '#38bdf8';
    if (this.club.includes('Photo')) accent = '#34d399';
    else if (this.club.includes('Turing') || this.club.includes('Coding')) accent = '#60a5fa';
    else if (this.club.includes('Sports')) accent = '#fbbf24';
    else if (this.club.includes('Quiz') || this.club.includes('Literary')) accent = '#c084fc';
    else if (this.club.includes('Bio') || this.club.includes('Life')) accent = '#22d3ee';

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Level dot
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(rx + 5, ry + h / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Name text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(titleText, rx + 10, ry + h / 2 + 0.5);

    ctx.restore();
  }

  drawSpeechBubble(ctx, centerX, topY) {
    ctx.save();
    ctx.font = '8px sans-serif';
    const metrics = ctx.measureText(this.speechBubble);
    const bw = Math.min(130, Math.max(40, metrics.width + 12));
    const bh = 15;
    const bx = Math.round(centerX - bw / 2);
    const by = Math.round(topY - bh);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 4);
    ctx.fill();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Bubble pointer
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(centerX - 3, topY);
    ctx.lineTo(centerX + 3, topY);
    ctx.lineTo(centerX, topY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = this.speechBubble.length > 22 ? this.speechBubble.slice(0, 20) + '...' : this.speechBubble;
    ctx.fillText(text, centerX, by + bh / 2 + 0.5);

    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x + 4,
      y: this.y + 14,
      width: 16,
      height: 14
    };
  }
}
