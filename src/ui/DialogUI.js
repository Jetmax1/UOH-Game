import { soundManager } from '../game/AudioSynth.js';

/**
 * Pokémon FireRed GBA-Style Dialogue Box with animated typewriter text & bouncing indicator arrow
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
      <div class="firered-dialog-overlay">
        <div class="firered-dialog-frame">
          <div class="firered-dialog-speaker">
            <span class="firered-speaker-avatar">${this.currentNPC.avatar || '👤'}</span>
            <span class="firered-speaker-name">${this.currentNPC.name}</span>
            <span class="firered-speaker-role">(${this.currentNPC.role || 'Resident'})</span>
          </div>
          <div class="firered-dialog-text" id="firered-text-body"></div>
          <div class="firered-dialog-arrow" id="firered-arrow">▼</div>
        </div>
      </div>
    `;

    const textBody = document.getElementById('firered-text-body');
    const arrow = document.getElementById('firered-arrow');
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
    const frame = modal.querySelector('.firered-dialog-frame');
    frame?.addEventListener('click', () => this.advance());
  }

  advance() {
    if (this.isTyping) {
      // Instantly finish sentence typing
      this.isTyping = false;
      if (this.typewriterTimer) clearInterval(this.typewriterTimer);
      const textBody = document.getElementById('firered-text-body');
      const arrow = document.getElementById('firered-arrow');
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
