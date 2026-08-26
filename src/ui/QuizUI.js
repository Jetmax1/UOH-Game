import { soundManager } from '../game/AudioSynth.js';

/**
 * 5-Question Interactive Classroom Quiz Modal
 * Retro NES Arcade style matching peteroravec.com
 */
export class QuizUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.quizSet = null;
    this.currentIndex = 0;
    this.score = 0;
    this.selectedOption = null;
    this.isAnswered = false;
    this.onCompleteCallback = null;
  }

  startQuiz(quizSet, onCompleteCallback) {
    this.quizSet = quizSet;
    this.currentIndex = 0;
    this.score = 0;
    this.selectedOption = null;
    this.isAnswered = false;
    this.onCompleteCallback = onCompleteCallback;

    const modal = document.getElementById('quiz-modal');
    if (!modal) return;

    soundManager.playMenuOpen();
    this.renderQuestion();
    modal.classList.remove('hidden');
  }

  renderQuestion() {
    const modal = document.getElementById('quiz-modal');
    if (!modal || !this.quizSet) return;

    const q = this.quizSet.questions[this.currentIndex];
    const totalQuestions = this.quizSet.questions.length;
    const progressPct = ((this.currentIndex + 1) / totalQuestions) * 100;

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="frame-wrp" style="max-width: 680px;">
        <div class="frame-wrp-inner">
          <button aria-label="Close" class="nes-btn is-error close-btn-position" id="btn-close-quiz">×</button>
          <div class="frame pixel-corners">
            <!-- Quiz Header -->
            <div class="quiz-header-bar">
              <div>
                <span class="chip" style="background: #1e293b; border: 2px solid #000; padding: 2px 6px; font-size: 7px; color: #facc15;">
                  ${this.quizSet.department}
                </span>
                <h2 style="font-size: 12px; color: #f87171; margin-top: 4px;">${this.quizSet.title}</h2>
              </div>
              <div style="font-size: 8px; color: #94a3b8;">
                Q ${this.currentIndex + 1} / ${totalQuestions}
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="width: 100%; height: 12px; background: #1e293b; border: 2px solid #000; margin-bottom: 16px;">
              <div style="height: 100%; width: ${progressPct}%; background: #3b82f6; transition: width 0.2s ease;"></div>
            </div>

            <!-- Question Body -->
            <div class="quiz-question-box">
              <h3>${q.question}</h3>
            </div>

            <!-- Multiple Choice Options -->
            <div class="quiz-options-list">
              ${q.options.map((opt, idx) => `
                <button type="button" class="nes-btn quiz-option-btn" data-opt-idx="${idx}">
                  <span style="color: #38bdf8; margin-right: 8px;">${String.fromCharCode(65 + idx)}:</span>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>

            <!-- Feedback Box -->
            <div id="quiz-feedback" class="hidden" style="margin-top: 14px; background: #1e293b; border: 2px solid #000; padding: 12px;">
              <div id="feedback-verdict" style="font-size: 9px; margin-bottom: 6px;"></div>
              <div id="feedback-exp" style="font-size: 8px; font-family: var(--body-font); color: #cbd5e1; line-height: 1.4;">
                ${q.explanation}
              </div>
            </div>

            <!-- Action Footer -->
            <div style="margin-top: 16px; text-align: right;">
              <button type="button" class="nes-btn is-primary hidden" id="btn-next-question">
                ${this.currentIndex + 1 === totalQuestions ? 'View Results 🎓' : 'Next Question ➔'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindQuestionEvents(modal, q);
  }

  bindQuestionEvents(modal, q) {
    document.getElementById('btn-close-quiz')?.addEventListener('click', () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
    });

    const optButtons = modal.querySelectorAll('.quiz-option-btn');
    const feedbackBox = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('btn-next-question');

    optButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const chosenIdx = parseInt(e.currentTarget.getAttribute('data-opt-idx'), 10);
        const isCorrect = chosenIdx === q.correctIndex;

        if (isCorrect) {
          soundManager.playQuizCorrect();
          e.currentTarget.classList.add('is-success');
          this.score += 20;
        } else {
          soundManager.playQuizWrong();
          e.currentTarget.classList.add('is-error');
          // Highlight correct one
          optButtons[q.correctIndex]?.classList.add('is-success');
        }

        if (feedbackBox) {
          feedbackBox.classList.remove('hidden');
          const verdict = document.getElementById('feedback-verdict');
          if (verdict) {
            verdict.textContent = isCorrect ? '🎉 Correct Answer! (+20 pts)' : '❌ Incorrect!';
            verdict.style.color = isCorrect ? '#86efac' : '#f87171';
          }
        }

        if (nextBtn) {
          nextBtn.classList.remove('hidden');
        }
      });
    });

    nextBtn?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.isAnswered = false;
      this.currentIndex += 1;
      if (this.currentIndex < this.quizSet.questions.length) {
        this.renderQuestion();
      } else {
        this.renderResults();
      }
    });
  }

  renderResults() {
    const modal = document.getElementById('quiz-modal');
    if (!modal || !this.quizSet) return;

    const totalQuestions = this.quizSet.questions.length;
    const correctCount = this.score / 20;
    const isPassed = correctCount >= (this.quizSet.passScore || 3);

    if (isPassed) soundManager.playQuestComplete();
    else soundManager.playQuizWrong();

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="frame-wrp" style="max-width: 550px;">
        <div class="frame-wrp-inner">
          <div class="frame pixel-corners" style="text-align: center;">
            <div style="font-size: 36px; margin-bottom: 8px;">${isPassed ? '🎓' : '📚'}</div>
            <h2 class="big-title">${isPassed ? 'Classroom Quiz Passed!' : 'Keep Studying!'}</h2>
            <p style="font-size: 8px; color: #94a3b8; margin-bottom: 16px;">
              ${this.quizSet.title} · ${this.quizSet.department}
            </p>

            <div style="background: #1e293b; border: 2px solid #000; padding: 16px; margin-bottom: 16px; display: flex; justify-content: space-around;">
              <div>
                <span style="font-size: 7px; color: #94a3b8; display: block;">CORRECT</span>
                <span style="font-size: 14px; color: #facc15;">${correctCount} / ${totalQuestions}</span>
              </div>
              <div>
                <span style="font-size: 7px; color: #94a3b8; display: block;">POINTS AWARDED</span>
                <span style="font-size: 14px; color: #86efac;">+${isPassed ? (correctCount === 5 ? 100 : 60) : 10} pts</span>
              </div>
              <div>
                <span style="font-size: 7px; color: #94a3b8; display: block;">RESULT</span>
                <span style="font-size: 11px; color: ${isPassed ? '#86efac' : '#f87171'};">
                  ${isPassed ? 'PASSED ✅' : 'RETRY 🔄'}
                </span>
              </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 8px; margin-top: 16px;">
              ${!isPassed ? `
                <button type="button" class="nes-btn is-warning" id="btn-retry-quiz">🔄 Try Again</button>
              ` : ''}
              <button type="button" class="nes-btn is-primary" id="btn-finish-quiz">Leave Classroom ➔</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-retry-quiz')?.addEventListener('click', () => {
      soundManager.playBtnClick();
      this.currentIndex = 0;
      this.score = 0;
      this.isAnswered = false;
      this.renderQuestion();
    });

    document.getElementById('btn-finish-quiz')?.addEventListener('click', () => {
      soundManager.playMenuClose();
      modal.classList.add('hidden');
      if (this.onCompleteCallback) {
        this.onCompleteCallback(this.score, isPassed);
      }
    });
  }
}
