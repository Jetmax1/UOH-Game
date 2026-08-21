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

  update(delta, inputManager, collisionChecker, particleSystem) {
    if (this.exclamationTimer > 0) {
      this.exclamationTimer -= delta;
    }

    const moveVec = inputManager.getMovementVector();
    this.isSprinting = inputManager.isSprinting() && this.stamina > 5;

    if (this.isSprinting && (moveVec.x !== 0 || moveVec.y !== 0)) {
      this.currentSpeed = this.sprintSpeed;
      this.stamina = Math.max(0, this.stamina - 28 * delta);
    } else {
      this.currentSpeed = this.normalSpeed;
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
      if (this.footstepTimer > (this.isSprinting ? 0.12 : 0.22) && particleSystem) {
        this.footstepTimer = 0;
        particleSystem.createFootstep(this.x + this.width / 2, this.y + this.height - 2);
      }
    } else {
      this.isMoving = false;
      this.walkFrame = 0;
    }
  }

  draw(ctx, camera) {
    const screenX = Math.round(this.x - camera.x);
    const screenY = Math.round(this.y - camera.y);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // GBA Oval Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(screenX + 12, screenY + 26, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw GBA Trainer Pixel Sprite (Scaled up from 16x20 to 24x30 for crisp pixel aesthetics)
    const spriteCanvas = pixelEngine.getTrainerSprite(this.direction, this.walkFrame, this.isSprinting);
    ctx.drawImage(spriteCanvas, 0, 0, 16, 20, screenX, screenY, 24, 30);

    // GBA "!" Exclamation Emote Pop
    if (this.exclamationTimer > 0) {
      const popBounce = Math.sin(this.exclamationTimer * 10) * 3;
      const bubble = pixelEngine.getExclamationBubble();
      ctx.drawImage(bubble, 0, 0, 14, 16, screenX + 5, screenY - 22 - popBounce, 14, 16);
    }

    // Nearby Interaction Indicator
    if (this.nearbyInteractable && this.exclamationTimer <= 0) {
      this.drawInteractBubble(ctx, screenX, screenY);
    }

    ctx.restore();
  }

  drawInteractBubble(ctx, sx, sy) {
    const bob = Math.sin(Date.now() / 160) * 2;
    const bubbleX = sx + 12;
    const bubbleY = sy - 12 + bob;

    ctx.fillStyle = '#2858b8';
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', bubbleX, bubbleY);
  }
}
