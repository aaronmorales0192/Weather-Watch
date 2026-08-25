// Self-contained multiple-choice quiz for the Weather Models page.
// Renders questions one at a time into #model-quiz, tracks the score,
// and shows a results screen with a "Try Again" option at the end.

const QUIZ_QUESTIONS = [
  {
    prompt: "You want a forecast for a specific thunderstorm complex happening in the next 6 hours. Which type of model is best suited for this?",
    options: ["Global model", "Regional model", "Convection-Allowing Model (CAM)"],
    correctIndex: 2,
    explanation: "CAMs run at very high resolution (1–4 km) specifically to simulate individual thunderstorms, making them ideal for very short-range severe weather forecasting."
  },
  {
    prompt: "Why do global models use a coarser grid than regional models?",
    options: [
      "They're older and less advanced",
      "They need to cover the entire planet, which limits resolution",
      "They only run once a week"
    ],
    correctIndex: 1,
    explanation: "Covering the whole planet requires a trade-off. Global models sacrifice fine detail for complete worldwide coverage, which is why they're best for medium/long-range forecasting."
  },
  {
    prompt: "Which model type would a meteorologist rely on most for a forecast 7–10 days out?",
    options: ["Global model", "Convection-Allowing Model (CAM)", "None — models can't forecast that far out"],
    correctIndex: 0,
    explanation: "Global models like the GFS and ECMWF are built for medium-to-long-range forecasting, simulating large-scale atmospheric patterns days in advance."
  }
];

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('model-quiz');
  if (!container) return;

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    answered = false;
    const q = QUIZ_QUESTIONS[currentIndex];

    const optionsHtml = q.options.map(function (option, i) {
      return `<button type="button" class="quiz-option" data-index="${i}">${option}</button>`;
    }).join('');

    container.innerHTML = `
      <div class="quiz-progress">Question ${currentIndex + 1} of ${QUIZ_QUESTIONS.length}</div>
      <p class="quiz-prompt">${q.prompt}</p>
      <div class="quiz-options">${optionsHtml}</div>
      <div class="quiz-feedback" hidden></div>
      <button type="button" class="quiz-next-btn" hidden>Next Question</button>
    `;

    const optionButtons = container.querySelectorAll('.quiz-option');
    const feedbackEl = container.querySelector('.quiz-feedback');
    const nextBtn = container.querySelector('.quiz-next-btn');

    optionButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (answered) return;
        answered = true;

        const chosenIndex = Number(btn.dataset.index);
        const isCorrect = chosenIndex === q.correctIndex;

        if (isCorrect) score++;

        optionButtons.forEach(function (b) {
          const idx = Number(b.dataset.index);
          if (idx === q.correctIndex) {
            b.classList.add('correct');
          } else if (idx === chosenIndex) {
            b.classList.add('incorrect');
          }
          b.disabled = true;
        });

        feedbackEl.hidden = false;
        feedbackEl.className = 'quiz-feedback ' + (isCorrect ? 'correct-feedback' : 'incorrect-feedback');
        feedbackEl.innerHTML = `<strong>${isCorrect ? "That's right!" : "Not quite."}</strong> ${q.explanation}`;

        nextBtn.hidden = false;
        nextBtn.textContent = currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results';
      });
    });

    nextBtn.addEventListener('click', function () {
      currentIndex++;
      if (currentIndex < QUIZ_QUESTIONS.length) {
        renderQuestion();
      } else {
        renderResults();
      }
    });
  }

  function renderResults() {
    container.innerHTML = `
      <div class="quiz-results">
        <p class="quiz-score">You scored ${score} / ${QUIZ_QUESTIONS.length}</p>
        <button type="button" class="quiz-retry-btn">Try Again</button>
      </div>
    `;

    container.querySelector('.quiz-retry-btn').addEventListener('click', function () {
      currentIndex = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
});