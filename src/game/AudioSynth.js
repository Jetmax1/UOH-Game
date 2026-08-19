/**
 * 16-Bit Pokémon FireRed GBA-Style Chiptune Audio Synthesizer
 * Pure Web Audio API generating authentic square, triangle, and pulse wave retro sounds.
 */
export class AudioSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterGain = null;
    this.sfxGain = null;
    this.ambientGain = null;
    this.currentAmbientMode = null;
    this.musicTimer = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.35;
      this.ambientGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio init error:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (this.masterGain) {
      this.masterGain.gain.value = this.enabled ? 0.5 : 0;
    }
    return this.enabled;
  }

  // --- Retro Sound Effects ---

  // Iconic FireRed 4-Note Discovery / Item Fanfare
  playDiscovery() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // C5, E5, G5, C6 (classic victory chime)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + (idx === 3 ? 0.45 : 0.15));

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.5);
    });
  }

  // GBA Quest Complete Fanfare
  playQuestComplete() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 440, t: 0, d: 0.12 },
      { f: 554.37, t: 0.1, d: 0.12 },
      { f: 659.25, t: 0.2, d: 0.15 },
      { f: 880, t: 0.35, d: 0.5 },
      { f: 1108.73, t: 0.35, d: 0.5 }
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.2, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.1);
    });
  }

  playQuizCorrect() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [587.33, 880].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now + i * 0.09);
      gain.gain.setValueAtTime(0.18, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.35);
    });
  }

  playQuizWrong() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.22);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Classic FireRed A-button Select Blip
  playInteract() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.03);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // GBA Dialogue Typing Sound Blip
  playTextBlip() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440 + Math.random() * 40, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // GBA Door Warp Sound
  playDoorTransition() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playSleepWake() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [392.00, 523.25, 659.25, 783.99, 1046.50];
    melody.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.1);
      gain.gain.setValueAtTime(0.18, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.7);
    });
  }

  // --- Dynamic Chiptune Ambient Modes ---

  setAmbientMode(mode) {
    if (this.currentAmbientMode === mode) return;
    this.currentAmbientMode = mode;
    this.stopMusic();

    if (!this.enabled || !this.ctx) return;

    if (mode === 'day') {
      this.startChiptuneExploration();
    } else if (mode === 'lake') {
      this.startLakeChiptune();
    } else if (mode === 'night') {
      this.startNightChiptune();
    } else if (mode === 'party') {
      this.startPartyChiptune();
    }
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  startChiptuneExploration() {
    // Upbeat GBA 8-note melody loop
    const melody = [
      523.25, 587.33, 659.25, 783.99,
      659.25, 783.99, 880.00, 1046.50,
      880.00, 783.99, 659.25, 587.33,
      523.25, 659.25, 587.33, 523.25
    ];
    let noteIdx = 0;

    this.musicTimer = setInterval(() => {
      if (!this.enabled || !this.ctx || this.currentAmbientMode !== 'day') return;
      const now = this.ctx.currentTime;
      const freq = melody[noteIdx % melody.length];

      // Square lead
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(now);
      osc.stop(now + 0.3);

      // Triangle Bass
      if (noteIdx % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(freq / 4, now);
        bassGain.gain.setValueAtTime(0.06, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ambientGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.6);
      }

      noteIdx++;
    }, 320);
  }

  startLakeChiptune() {
    // Serene calming arpeggios
    const notes = [392.00, 493.88, 587.33, 783.99, 587.33, 493.88];
    let idx = 0;

    this.musicTimer = setInterval(() => {
      if (!this.enabled || !this.ctx || this.currentAmbientMode !== 'lake') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[idx % notes.length], now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(now);
      osc.stop(now + 0.5);
      idx++;
    }, 450);
  }

  startNightChiptune() {
    // Relaxed tranquil night vibes
    const notes = [261.63, 329.63, 392.00, 493.88];
    let idx = 0;

    this.musicTimer = setInterval(() => {
      if (!this.enabled || !this.ctx || this.currentAmbientMode !== 'night') return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[idx % notes.length], now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(now);
      osc.stop(now + 0.75);
      idx++;
    }, 600);
  }

  startPartyChiptune() {
    // Energetic GBA dance beat
    let step = 0;
    const bass = [110, 110, 146.83, 130.81];

    this.musicTimer = setInterval(() => {
      if (!this.enabled || !this.ctx || this.currentAmbientMode !== 'party') return;
      const now = this.ctx.currentTime;

      // Kick
      if (step % 2 === 0) {
        const kOsc = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kOsc.type = 'triangle';
        kOsc.frequency.setValueAtTime(160, now);
        kOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12);
        kGain.gain.setValueAtTime(0.18, now);
        kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        kOsc.connect(kGain);
        kGain.connect(this.ambientGain);
        kOsc.start(now);
        kOsc.stop(now + 0.15);
      }

      // Synth Bass
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'square';
      bOsc.frequency.setValueAtTime(bass[Math.floor(step / 2) % bass.length], now);
      bGain.gain.setValueAtTime(0.06, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      bOsc.connect(bGain);
      bGain.connect(this.ambientGain);
      bOsc.start(now);
      bOsc.stop(now + 0.22);

      step++;
    }, 250);
  }
}

export const soundManager = new AudioSynth();
