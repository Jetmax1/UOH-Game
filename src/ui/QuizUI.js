import { soundManager } from '../game/AudioSynth.js';

/**
 * 5-Question Interactive Classroom Quiz Modal
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
      <div class="modal-backdrop">
        <div class="quiz-container glass-panel">
          <!-- Quiz Header -->
          <div class="quiz-header">
            <div>
              <span class="quiz-dept-tag">${this.quizSet.department}</span>
              <h2>${this.quizSet.title}</h2>
            </div>
            <button class="modal-close-btn" id="btn-close-quiz">✕</button>
          </div>

          <!-- Progress Bar -->
          <div class="quiz-progress-section">
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
            </div>
            <div class="quiz-progress-labels">
              <span>Question ${this.currentIndex + 1} of ${totalQuestions}</span>
              <span>Current Score: ${this.score} pts</span>
            </div>
          </div>

          <!-- Question Body -->
          <div class="quiz-question-box">
            <h3 class="quiz-question-text">${q.question}</h3>
          </div>

          <!-- Multiple Choice Options -->
          <div class="quiz-options-list">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option-btn" data-opt-idx="${idx}">
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-text">${opt}</span>
              </button>
            `).join('')}
          </div>

          <!-- Explanation Box (Initially hidden) -->
          <div class="quiz-feedback-box hidden" id="quiz-feedback">
            <div class="feedback-icon" id="feedback-icon"></div>
            <div class="feedback-body">
              <strong id="feedback-verdict"></strong>
              <p id="feedback-exp">${q.explanation}</p>
            </div>
          </div>

          <!-- Action Footer -->
          <div class="quiz-footer">
            <button class="btn btn-primary hidden" id="btn-next-question">
              ${this.currentIndex + 1 === totalQuestions ? 'View Results 🎓' : 'Next Question ➔'}
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindQuestionEvents(modal, q);
  }

  bindQuestionEvents(modal, q) {
    document.getElementById('btn-close-quiz')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    const optButtons = modal.querySelectorAll('.quiz-option-btn');
    const feedbackBox = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('btn-next-question');

    optButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const chosenIdx = parseInt(e.currentTarget.dataset.optIdx, 10);
        const isCorrect = chosenIdx === q.correctIndex;

        // Visual highlights
        if (isCorrect) {
          e.currentTarget.classList.add('opt-correct');
          this.score += 20; // 20 pts per question = 100 pts max
          soundManager.playQuizCorrect();
        } else {
          e.currentTarget.classList.add('opt-wrong');
          // Highlight the right one
          optButtons[q.correctIndex].classList.add('opt-correct');
          soundManager.playQuizWrong();
        }

        // Show Explanation
        if (feedbackBox) {
          feedbackBox.classList.remove('hidden');
          feedbackBox.classList.toggle('feedback-success', isCorrect);
          feedbackBox.classList.toggle('feedback-fail', !isCorrect);
          const verdict = document.getElementById('feedback-verdict');
          const icon = document.getElementById('feedback-icon');
          if (verdict) verdict.textContent = isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect';
          if (icon) icon.textContent = isCorrect ? '✅' : '❌';
        }

        if (nextBtn) {
          nextBtn.classList.remove('hidden');
        }
      });
    });

    nextBtn?.addEventListener('click', () => {
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

    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="quiz-results-container glass-panel">
          <div class="results-badge-icon">${isPassed ? '🎓' : '📚'}</div>
          <h2>${isPassed ? 'Quiz Passed with Honors!' : 'Keep Learning!'}</h2>
          <p class="results-subtitle">${this.quizSet.title} · ${this.quizSet.department}</p>

          <div class="results-score-card">
            <div class="score-item">
              <span class="score-label">Score</span>
              <span class="score-value">${correctCount} / ${totalQuestions}</span>
            </div>
            <div class="score-item">
              <span class="score-label">Exploration Points</span>
              <span class="score-value highlight">+${isPassed ? (correctCount === 5 ? 100 : 50) : 10} pts</span>
            </div>
            <div class="score-item">
              <span class="score-label">Status</span>
              <span class="score-value ${isPassed ? 'text-pass' : 'text-retry'}">${isPassed ? 'PASSED ✅' : 'TRY AGAIN 🔄'}</span>
            </div>
          </div>

          <p class="results-message">
            ${isPassed
              ? 'Excellent mastery! Your score has been credited to your campus record.'
              : 'You need at least 3 correct answers to pass. Feel free to retry the lecture quiz!'}
          </p>

          <div class="results-actions">
            ${!isPassed ? `
              <button class="btn btn-secondary" id="btn-retry-quiz">🔄 Try Again</button>
            ` : ''}
            <button class="btn btn-primary" id="btn-finish-quiz">Leave Classroom ➔</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-retry-quiz')?.addEventListener('click', () => {
      this.currentIndex = 0;
      this.score = 0;
      this.isAnswered = false;
      this.renderQuestion();
    });

    document.getElementById('btn-finish-quiz')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      if (this.onCompleteCallback) {
        this.onCompleteCallback(this.score, isPassed);
      }
    });
  }
}
