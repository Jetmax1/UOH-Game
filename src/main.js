import { Game } from './game/Game.js';
import { UIManager } from './ui/UIManager.js';
import { soundManager } from './game/AudioSynth.js';
import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject();

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Canvas element #game-canvas not found');
    return;
  }

  // Initialize UI Manager
  const uiManager = new UIManager();

  // Initialize Master Game Controller
  const game = new Game(canvas, uiManager);

  // Resume Audio on first user interaction anywhere
  const resumeAudio = () => {
    soundManager.ensureContext();
    window.removeEventListener('click', resumeAudio);
    window.removeEventListener('keydown', resumeAudio);
    window.removeEventListener('touchstart', resumeAudio);
  };
  window.addEventListener('click', resumeAudio);
  window.addEventListener('keydown', resumeAudio);
  window.addEventListener('touchstart', resumeAudio);

  // Initial welcome toast
  setTimeout(() => {
    uiManager.showToast('🎓 Welcome to University of Hyderabad! Use WASD or Arrows to explore. Press E to interact.', 'info');
  }, 1000);
});
