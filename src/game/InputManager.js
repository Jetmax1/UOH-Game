/**
 * Unified Input Manager for Desktop (Keyboard/Mouse) and Mobile/Tablet (Virtual Touch Joystick & Action Buttons)
 */
export class InputManager {
  constructor() {
    this.keys = {};
    this.interactPressed = false;
    this.mapPressed = false;
    this.bookPressed = false;
    this.questPressed = false;
    this.pausePressed = false;
    this.sprint = false;

    // Virtual Touch Joystick State
    this.touchActive = false;
    this.touchVector = { x: 0, y: 0 };
    this.joystickCenter = { x: 0, y: 0 };
    this.joystickRadius = 45;

    this.initKeyboard();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept typing if user is in an input field
      if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        return;
      }

      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;

      if (e.key === 'e' || e.key === 'E' || e.code === 'Space' || e.code === 'Enter') {
        this.interactPressed = true;
      }
      if (e.key === 'm' || e.key === 'M') {
        this.mapPressed = true;
      }
      if (e.key === 'j' || e.key === 'J' || e.key === 'b' || e.key === 'B') {
        this.bookPressed = true;
      }
      if (e.key === 'q' || e.key === 'Q') {
        this.questPressed = true;
      }
      if (e.key === 'Escape') {
        this.pausePressed = true;
      }
      if (e.shiftKey) {
        this.sprint = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
      if (!e.shiftKey) {
        this.sprint = false;
      }
    });
  }

  setupMobileTouchControls(dpadContainer, interactBtn, sprintBtn) {
    if (!dpadContainer) return;

    let touchId = null;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
      const rect = dpadContainer.getBoundingClientRect();
      this.joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      this.touchActive = true;
      this.updateJoystickPosition(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          this.updateJoystickPosition(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          break;
        }
      }
    };

    const handleTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          this.touchActive = false;
          this.touchVector = { x: 0, y: 0 };
          const stick = dpadContainer.querySelector('.joystick-stick');
          if (stick) stick.style.transform = `translate(-50%, -50%)`;
          touchId = null;
          break;
        }
      }
    };

    dpadContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    if (interactBtn) {
      interactBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.interactPressed = true;
      });
      interactBtn.addEventListener('click', (e) => {
        this.interactPressed = true;
      });
    }

    if (sprintBtn) {
      sprintBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.sprint = !this.sprint;
        sprintBtn.classList.toggle('active', this.sprint);
      });
    }
  }

  updateJoystickPosition(clientX, clientY) {
    const dx = clientX - this.joystickCenter.x;
    const dy = clientY - this.joystickCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxRadius = this.joystickRadius;
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    const stick = document.querySelector('.joystick-stick');
    if (stick) {
      stick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
    }

    if (clampedDist > 8) {
      this.touchVector = {
        x: Math.cos(angle) * (clampedDist / maxRadius),
        y: Math.sin(angle) * (clampedDist / maxRadius)
      };
    } else {
      this.touchVector = { x: 0, y: 0 };
    }
  }

  getMovementVector() {
    let vx = 0;
    let vy = 0;

    // Keyboard
    if (this.keys['w'] || this.keys['arrowup'] || this.keys['KeyW']) vy -= 1;
    if (this.keys['s'] || this.keys['arrowdown'] || this.keys['KeyS']) vy += 1;
    if (this.keys['a'] || this.keys['arrowleft'] || this.keys['KeyA']) vx -= 1;
    if (this.keys['d'] || this.keys['arrowright'] || this.keys['KeyD']) vx += 1;

    // Normalize diagonal keyboard movement
    if (vx !== 0 && vy !== 0) {
      const len = Math.sqrt(vx * vx + vy * vy);
      vx /= len;
      vy /= len;
    }

    // Touch joystick takes over if active
    if (this.touchActive && (Math.abs(this.touchVector.x) > 0.05 || Math.abs(this.touchVector.y) > 0.05)) {
      vx = this.touchVector.x;
      vy = this.touchVector.y;
    }

    return { x: vx, y: vy };
  }

  isSprinting() {
    return this.sprint || !!(this.keys['shiftleft'] || this.keys['shiftright'] || this.keys['shift']);
  }

  consumeInteract() {
    const res = this.interactPressed;
    this.interactPressed = false;
    return res;
  }

  consumeMap() {
    const res = this.mapPressed;
    this.mapPressed = false;
    return res;
  }

  consumeBook() {
    const res = this.bookPressed;
    this.bookPressed = false;
    return res;
  }

  consumeQuest() {
    const res = this.questPressed;
    this.questPressed = false;
    return res;
  }

  consumePause() {
    const res = this.pausePressed;
    this.pausePressed = false;
    return res;
  }
}
