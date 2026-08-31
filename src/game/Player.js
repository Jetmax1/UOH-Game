import { pixelEngine } from './PixelArtEngine.js';

/**
 * Player Entity with Pokémon FireRed GBA-Style Pixel Sprite & Movement Animations
 */
export class Player {
  constructor(x, y, config = {}) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 30;
    this.collisionBox = {
      offsetX: 4,
      offsetY: 14,
      width: 16,
      height: 14
    };

    this.normalSpeed = config.normalSpeed || 200;
    this.sprintSpeed = config.sprintSpeed || 320;
    this.currentSpeed = this.normalSpeed;

    this.direction = 'down'; // 'down', 'up', 'left', 'right'
    this.isMoving = false;
    this.walkAnimTimer = 0;
    this.walkFrame = 0; // 0 = idle, 1 = left step, 2 = right step

    this.stamina = 100;
    this.maxStamina = 100;
    this.isSprinting = false;

    // 2.5D Z-Axis Elevation & Jumping Physics
    this.z = 0;
    this.vz = 0;
    this.isJumping = false;

    this.currentInterior = null;
    this.nearbyInteractable = null;

    // GBA "!" Exclamation Emote Pop
    this.exclamationTimer = 0;

    // Dust particles
    this.footstepTimer = 0;
  }

  triggerExclamation() {
    this.exclamationTimer = 1.2; // Show for 1.2s
  }

  getBounds() {
    return {
      x: this.x + this.collisionBox.offsetX,
      y: this.y + this.collisionBox.offsetY,
      width: this.collisionBox.width,
      height: this.collisionBox.height
    };
  }

  update(delta, inputManager, collisionChecker, particleSystem, surfaceModifierGetter = null) {
    if (this.exclamationTimer > 0) {
      this.exclamationTimer -= delta;
    }

    // 2.5D Jump Physics
    if (inputManager.consumeJump && inputManager.consumeJump() && this.z === 0 && !this.currentInterior) {
      this.vz = 140;
      this.isJumping = true;
      if (particleSystem) {
        particleSystem.createFootstep(this.x + this.width / 2, this.y + this.height - 2);
      }
    }

    if (this.z > 0 || this.vz !== 0) {
      this.z += this.vz * delta;
      this.vz -= 380 * delta; // Gravity
      if (this.z <= 0) {
        this.z = 0;
        this.vz = 0;
        this.isJumping = false;
        if (particleSystem) {
          particleSystem.createFootstep(this.x + this.width / 2, this.y + this.height - 2);
        }
      }
    }

    const moveVec = inputManager.getMovementVector();
    this.isSprinting = inputManager.isSprinting() && this.stamina > 5;

    // Physical surface modifier at player foot position (Road: 1.10x, Path: 1.0x, Grass: 0.82x, Field: 0.75x)
    const footX = this.x + this.width / 2;
    const footY = this.y + this.height - 2;
    const surfaceMod = surfaceModifierGetter ? surfaceModifierGetter(footX, footY) : 1.0;

    const baseSpeed = this.isSprinting ? this.sprintSpeed : this.normalSpeed;
    this.currentSpeed = baseSpeed * surfaceMod;

    if (this.isSprinting && (moveVec.x !== 0 || moveVec.y !== 0)) {
      this.stamina = Math.max(0, this.stamina - 28 * delta);
    } else {
      this.stamina = Math.min(this.maxStamina, this.stamina + 25 * delta);
    }

    if (moveVec.x !== 0 || moveVec.y !== 0) {
      this.isMoving = true;

      // Update Direction
      if (Math.abs(moveVec.x) > Math.abs(moveVec.y)) {
        this.direction = moveVec.x > 0 ? 'right' : 'left';
      } else {
        this.direction = moveVec.y > 0 ? 'down' : 'up';
      }

      // 3-Frame Walk Cycle (0: idle, 1: step A, 2: step B)
      this.walkAnimTimer += delta * (this.isSprinting ? 12 : 8);
      const stepState = Math.floor(this.walkAnimTimer) % 4;
      this.walkFrame = stepState === 1 ? 1 : (stepState === 3 ? 2 : 0);

      // Separate X and Y movement for smooth wall sliding
      const dx = moveVec.x * this.currentSpeed * delta;
      const dy = moveVec.y * this.currentSpeed * delta;

      const currentBounds = this.getBounds();
      const isCurrentlyStuck = collisionChecker(currentBounds);

      // If player is currently stuck inside a collider (e.g. from an old save or spawn),
      // allow moving in any direction that gets closer to freedom or nudge out
      if (isCurrentlyStuck) {
        this.x += dx;
        this.y += dy;
      } else {
        const newX = this.x + dx;
        if (!collisionChecker({
          x: newX + this.collisionBox.offsetX,
          y: this.y + this.collisionBox.offsetY,
          width: this.collisionBox.width,
          height: this.collisionBox.height
        })) {
          this.x = newX;
        }

        const newY = this.y + dy;
        if (!collisionChecker({
          x: this.x + this.collisionBox.offsetX,
          y: newY + this.collisionBox.offsetY,
          width: this.collisionBox.width,
          height: this.collisionBox.height
        })) {
          this.y = newY;
        }
      }

      // Footstep dust puff
      this.footstepTimer += delta;
      const dustInterval = (this.isSprinting ? 0.10 : 0.20) / Math.max(0.5, surfaceMod);
      if (this.footstepTimer > dustInterval && particleSystem && this.z === 0) {
        this.footstepTimer = 0;
        particleSystem.createFootstep(this.x + this.width / 2, this.y + this.height - 2);
      }
    } else {
      this.isMoving = false;
      this.walkFrame = 0;
    }
  }

  drawShadow(ctx, camera, shadowOffset = { x: 0, y: 0 }) {
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);

    const shadowScale = Math.max(0.35, 1.0 - this.z / 50);
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
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
    const elevatedY = Math.round(screenY - this.z);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Ground Shadow (if not rendered in global shadow pass)
    this.drawShadow(ctx, camera);

    // Occlusion X-Ray Silhouette Effect
    if (isOccluded) {
      ctx.globalAlpha = 0.55;
    }

    // Draw GBA Trainer Pixel Sprite (Scaled up from 16x20 to 24x30 for crisp pixel aesthetics)
    const spriteCanvas = pixelEngine.getTrainerSprite(this.direction, this.walkFrame, this.isSprinting);
    ctx.drawImage(spriteCanvas, 0, 0, 16, 20, screenX, elevatedY, 24, 30);

    // GBA "!" Exclamation Emote Pop
    if (this.exclamationTimer > 0) {
      const popBounce = Math.sin(this.exclamationTimer * 10) * 3;
      const bubble = pixelEngine.getExclamationBubble();
      ctx.drawImage(bubble, 0, 0, 14, 16, screenX + 5, elevatedY - 22 - popBounce, 14, 16);
    }

    // Active Local Student Emote Pop
    if (this.activeEmote) {
      const bob = Math.sin(Date.now() / 120) * 3;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.arc(screenX + 12, elevatedY - 24 + bob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.activeEmote.icon, screenX + 12, elevatedY - 23 + bob);
    }

    // Active Local Student Speech Bubble
    if (this.speechBubble) {
      this.drawSpeechBubble(ctx, screenX + 12, elevatedY - 28);
    }

    // Nearby Interaction Indicator
    if (this.nearbyInteractable && this.exclamationTimer <= 0) {
      this.drawInteractBubble(ctx, screenX, elevatedY);
    }

    ctx.restore();
  }

  showSpeech(text, duration = 3.5) {
    this.speechBubble = text;
    this.speechTimer = duration;
  }

  showEmote(emoteObj, duration = 2.4) {
    this.activeEmote = emoteObj;
    this.emoteTimer = duration;
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

  drawInteractBubble(ctx, sx, sy) {
    const bob = Math.sin(Date.now() / 160) * 2;
    const bubbleX = sx + 12;
    const bubbleY = sy - 14 + bob;

    let label = 'E';
    let action = '';
      if (this.nearbyInteractable.type === 'student') {
        action = 'STUDENT';
      } else if (this.nearbyInteractable.type === 'npc' || this.nearbyInteractable.type === 'interior_npc') {
        action = 'TALK';
      } else if (this.nearbyInteractable.type === 'bed') {
        action = 'SLEEP';
      } else if (this.nearbyInteractable.type === 'quiz') {
        action = 'QUIZ';
      } else if (this.nearbyInteractable.type === 'notice_board') {
        action = 'NOTICE';
      } else if (this.nearbyInteractable.type === 'book') {
        action = 'READ';
      } else if (this.nearbyInteractable.type === 'menu') {
        action = 'MENU';
      } else if (this.nearbyInteractable.type === 'examine') {
        action = 'EXAMINE';
      } else if (this.nearbyInteractable.type === 'exit_door') {
        action = 'EXIT';
      } else if (this.nearbyInteractable.data?.hasInterior) {
        action = 'ENTER';
      } else if (this.nearbyInteractable.data?.isNightCanteen) {
        action = 'CANTEEN';
      } else {
        action = 'INFO';
      }

    const text = action ? `[E] ${action}` : '[E]';
    ctx.save();
    ctx.font = 'bold 7px "Press Start 2P", monospace';
    const textWidth = ctx.measureText(text).width;
    const pad = 4;
    const boxW = Math.max(20, textWidth + pad * 2);
    const boxH = 14;
    const boxX = bubbleX - boxW / 2;
    const boxY = bubbleY - boxH / 2;

    // NES pixel-corner badge background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);

    // Border highlights
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(boxX + 1, boxY + 1, boxW - 2, 1);
    ctx.fillRect(boxX + 1, boxY + 1, 1, boxH - 2);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bubbleX, bubbleY + 1);
    ctx.restore();
  }
}
