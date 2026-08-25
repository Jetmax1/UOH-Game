import { soundManager } from '../game/AudioSynth.js';

/**
 * NES Pixel Art Dialogue Box with typewriter text & retro speaker portrait
 * Matching peteroravec.com retro 8-bit styling
 */
export class DialogUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.currentNPC = null;
    this.dialogueIndex = 0;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.fullText = '';
    this.displayedLength = 0;
  }

  show(npc) {
    this.currentNPC = npc;
    this.dialogueIndex = 0;

    const modal = document.getElementById('dialog-modal');
    if (!modal) return;

    soundManager.playInteract();
    modal.classList.remove('hidden');
    this.renderSentence();
  }

  renderSentence() {
    const modal = document.getElementById('dialog-modal');
    if (!modal || !this.currentNPC) return;

    const texts = Array.isArray(this.currentNPC.dialogue)
      ? this.currentNPC.dialogue
      : [this.currentNPC.dialogue];

    this.fullText = texts[this.dialogueIndex] || '';
    this.displayedLength = 0;
    this.isTyping = true;

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 720px; z-index: 300;">
        <div class="frame pixel-corners" style="background: #0f172a; border: 4px solid #000; padding: 18px 24px; box-shadow: 0 -4px 0 0 #3b82f6, 0 4px 0 0 #3b82f6, -4px 0 0 0 #3b82f6, 4px 0 0 0 #3b82f6; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">${this.currentNPC.avatar || '👤'}</span>
              <span style="font-size: 10px; color: #f87171; font-weight: bold;">${this.currentNPC.name}</span>
              <span style="font-size: 7px; color: #94a3b8;">(${this.currentNPC.role || 'Resident'})</span>
            </div>
            <span style="font-size: 7px; color: #facc15;">CLICK / ENTER ➔</span>
          </div>
          <div id="nes-dialog-text" style="font-size: 9px; line-height: 1.7; color: #f8fafc; min-height: 48px;"></div>
          <div id="nes-dialog-arrow" style="text-align: right; font-size: 10px; color: #38bdf8; animation: bounce 0.6s infinite alternate;">▼</div>
        </div>
      </div>
    `;

    const textBody = document.getElementById('nes-dialog-text');
    const arrow = document.getElementById('nes-dialog-arrow');
    if (arrow) arrow.style.display = 'none';

    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    // Typewriter animation loop
    this.typewriterTimer = setInterval(() => {
      if (this.displayedLength < this.fullText.length) {
        this.displayedLength += 1;
        if (textBody) {
          textBody.textContent = this.fullText.slice(0, this.displayedLength);
        }
        if (this.displayedLength % 2 === 0) {
          soundManager.playTextBlip();
        }
      } else {
        this.isTyping = false;
        clearInterval(this.typewriterTimer);
        if (arrow) arrow.style.display = 'block';
      }
    }, 28);

    // Click / Advance handler
    const frame = modal.querySelector('.frame');
    frame?.addEventListener('click', () => this.advance());
  }

  advance() {
    if (this.isTyping) {
      // Instantly finish sentence typing
      this.isTyping = false;
      if (this.typewriterTimer) clearInterval(this.typewriterTimer);
      const textBody = document.getElementById('nes-dialog-text');
      const arrow = document.getElementById('nes-dialog-arrow');
      if (textBody) textBody.textContent = this.fullText;
      if (arrow) arrow.style.display = 'block';
      return;
    }

    soundManager.playInteract();
    const texts = Array.isArray(this.currentNPC.dialogue)
      ? this.currentNPC.dialogue
      : [this.currentNPC.dialogue];

    if (this.dialogueIndex < texts.length - 1) {
      this.dialogueIndex += 1;
      this.renderSentence();
    } else {
      // Close Dialogue
      const modal = document.getElementById('dialog-modal');
      if (modal) modal.classList.add('hidden');
    }
  }
}
