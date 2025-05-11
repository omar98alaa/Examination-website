// Global Variables
var currentQuestionIndex = 0;
var answeredQuestions = 0;
var totalQuestions;
var userAnswers = [];
var userMarkedQuestions = [];
var shuffledExam = [];
var wasPreviouslyAnswered;
var progressPercentage = 0;
var examDurationMinutes;
var examDurationSeconds;
var timerInterval;

// DOM elements
var quizWrapper = document.getElementById("quiz-wrapper");
var resultContainer = document.getElementById("result-container");
var scoreContainer = document.getElementById("score-container");
var questionText = document.getElementById("question-text");
var questionNumber = document.getElementById("question-number");
var questionTimer = document.querySelector(".timer-value");
var ExamTitle = document.getElementById("quiz-title");
var optionA = document.getElementById("option-A");
var optionB = document.getElementById("option-B");
var optionC = document.getElementById("option-C");
var optionD = document.getElementById("option-D");
var optionAContainer = document.getElementById("option-A-container");
var optionBContainer = document.getElementById("option-B-container");
var optionCContainer = document.getElementById("option-C-container");
var optionDContainer = document.getElementById("option-D-container");
var markQuestionButton = document.getElementById("review-question");
var prevBtn = document.getElementById("prev-btn");
var nextBtn = document.getElementById("next-btn");
var finishBtn = document.getElementById("finish-btn");
var questionsPanelGrid = document.querySelector(".question-grid");
var Username = document.getElementById("user-name");
var questionPanelItems = [];

document.addEventListener("DOMContentLoaded", function () {
  // Load exam data
  var xhrExam = new XMLHttpRequest();
  xhrExam.open("GET", "MCQ_Exam.json", true);
  xhrExam.send();

  xhrExam.addEventListener("readystatechange", function () {
    if (xhrExam.readyState === 4 && xhrExam.status === 200) {
      var Exam = JSON.parse(xhrExam.responseText);

      // Convert to array of question objects
      var ExamArray = Exam.questions.map((question) => {
        return {
          question: question.question,
          options: [question.a, question.b, question.c, question.d],
          answer: question.answer,
        };
      });

      // Shuffle the questions
      shuffledExam = shuffleArray(ExamArray);
      userAnswers = new Array(shuffledExam.length).fill(null);
      userMarkedQuestions = new Array(shuffledExam.length).fill(false);
      totalQuestions = shuffledExam.length;

      examDurationMinutes = Exam.ExamDuration;
      examDurationSeconds = examDurationMinutes * 60;

      // Render the exam UI

      // Show The user Name
      var userName = `${localStorage.getItem(
        "firstName"
      )} ${localStorage.getItem("lastName")}`;
      Username.textContent = `Welcome ${userName}`;

      // Show exam title
      ExamTitle.textContent = Exam.ExamTitle;
      renderExamUI(shuffledExam);

      // Start timer
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);

      // Hide loading spinner
      document.getElementById("loading").style.display = "none";
    }
  });
});

// Render the complete exam UI after questions are loaded
function renderExamUI(questions) {
  // Display current question
  showQuestion(currentQuestionIndex);

  //Display Questions Marks
  showQuestionsPanel();

  // Set up event listeners for navigation
  prevBtn.addEventListener("click", function () {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
      updateNavigationButtons();
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
      updateNavigationButtons();
    }
  });

  finishBtn.addEventListener("click", function () {
    showResults();
  });

  // Set up click handlers for each option
  optionAContainer.onclick = () =>
    updateSelectedQuestionAnswer(currentQuestionIndex, "a", optionAContainer);
  optionBContainer.onclick = () =>
    updateSelectedQuestionAnswer(currentQuestionIndex, "b", optionBContainer);
  optionCContainer.onclick = () =>
    updateSelectedQuestionAnswer(currentQuestionIndex, "c", optionCContainer);
  optionDContainer.onclick = () =>
    updateSelectedQuestionAnswer(currentQuestionIndex, "d", optionDContainer);

  // initialize progress bar
  updateProgress();

  // Initialize navigation buttons
  updateNavigationButtons();
}

function showQuestionsPanel() {
  for (var i = 0; i < totalQuestions; i++) {
    const newElement = document.createElement("button");
    newElement.id = i;
    newElement.innerHTML = i + 1;
    newElement.classList.add("question-item", "not-attempted");
    newElement.addEventListener("click", function () {
      currentQuestionIndex = Number(this.id);
      showQuestion(currentQuestionIndex);
      updateNavigationButtons();
    });
    questionsPanelGrid.appendChild(newElement);
  }
  questionPanelItems = document.querySelectorAll(`.question-item`);
}

// This function is called to show the question and its options
function showQuestion(index) {
  questionNumber.textContent = "Question " + (index + 1);
  questionText.textContent = shuffledExam[index].question;
  optionA.textContent = shuffledExam[index].options[0];
  optionB.textContent = shuffledExam[index].options[1];
  optionC.textContent = shuffledExam[index].options[2];
  optionD.textContent = shuffledExam[index].options[3];

  optionAContainer.classList.remove("selected");
  optionBContainer.classList.remove("selected");
  optionCContainer.classList.remove("selected");
  optionDContainer.classList.remove("selected");
  updateMarkButton();

  // Check if user had previously selected an answer for this question
  if (userAnswers[index]) {
    // Highlight the previously selected option
    switch (userAnswers[index]) {
      case "a":
        optionAContainer.classList.add("selected");
        break;
      case "b":
        optionBContainer.classList.add("selected");
        break;
      case "c":
        optionCContainer.classList.add("selected");
        break;
      case "d":
        optionDContainer.classList.add("selected");
        break;
    }
  }
}

// Mark question button click event
function toggleMarkQuestion() {
  // Toggle the marked state
  userMarkedQuestions[currentQuestionIndex] = !userMarkedQuestions[currentQuestionIndex];

  // Update the button and question appearance
  updateMarkButton();
  updateQuestionInQuestionsPanel();
}

// Update the button text and style based on the marked state
function updateMarkButton() {
  if (userMarkedQuestions[currentQuestionIndex]) {
    markQuestionButton.textContent = "Unmark";
    markQuestionButton.classList.add("marked-question");
  } else {
    markQuestionButton.textContent = "Mark";
    markQuestionButton.classList.remove("marked-question");
  }
}

// Update the question panel to reflect the marked or Answered state
function updateQuestionInQuestionsPanel() {
  if (userMarkedQuestions[currentQuestionIndex]) {
    questionPanelItems[currentQuestionIndex].classList.add("marked");
    questionPanelItems[currentQuestionIndex].classList.remove("not-attempted");
  }
  else {
    questionPanelItems[currentQuestionIndex].classList.remove("marked");
    questionPanelItems[currentQuestionIndex].classList.add("not-attempted");
  }

  if (userAnswers[currentQuestionIndex] !== null && !userMarkedQuestions[currentQuestionIndex]) {
    questionPanelItems[currentQuestionIndex].classList.add("answered");
    questionPanelItems[currentQuestionIndex].classList.remove("not-attempted");
  }
}

// Update the selected question answer, progress bar and question state in questions panel when answering a question
function updateSelectedQuestionAnswer(questionIndex, optionValue, optionElement) {
  optionAContainer.classList.remove("selected");
  optionBContainer.classList.remove("selected");
  optionCContainer.classList.remove("selected");
  optionDContainer.classList.remove("selected");

  optionElement.classList.add("selected");

  // Track if this is a new answer
  wasPreviouslyAnswered = userAnswers[questionIndex] !== null;
  userAnswers[questionIndex] = optionValue;

  // Update progress if this is a new answer
  if (!wasPreviouslyAnswered) {
    answeredQuestions++;
    updateProgress();
  }
  updateQuestionInQuestionsPanel();
}

// Update the progress bar
function updateProgress() {
  progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
  document.querySelector(
    ".progress-percentage"
  ).textContent = `${answeredQuestions} / ${totalQuestions}`;
  document.querySelector(
    ".progress-fill"
  ).style.width = `${progressPercentage}%`;
}

// Update the navigation buttons based on the current question index
function updateNavigationButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === shuffledExam.length - 1;
}

// Show design
function showResults() {
  // Calculate result
  var result = calculateResult();
  var numQuestions = shuffledExam.length;
  var percent = result / numQuestions;

  // Stop timer
  stopTimer();

  // Show result
  var color = percent < 0.5 ? "var(--text-red)" : "var(--text-green)";

  scoreContainer.innerText = `${result} / ${shuffledExam.length}`;
  scoreContainer.style.backgroundImage = `radial-gradient(
      closest-side,
      var(--background-color) 89%,
      transparent 90% 100%
    ),
    conic-gradient(${color} ${percent * 360}deg, var(--card-bg-color) 0deg)`;

  quizWrapper.classList.add("hidden");
  resultContainer.classList.remove("hidden");
}

// Calculate results
function calculateResult() {
  var result = 0;

  shuffledExam.forEach((question, index) => {
    if (question.answer === userAnswers[index]) {
      result++;
    }
  });

  return result;
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Update the timer display every second
function updateTimer() {
  // Stop the timer when time is up
  if (examDurationSeconds < 0) {
    stopTimer();

    //  auto-submit
    showResults();
    return;
  }

  // Calculate minutes and seconds
  const minutes = Math.floor(examDurationSeconds / 60);
  const seconds = examDurationSeconds % 60;

  // Update the timer display
  questionTimer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} Min`;

  if (
    questionTimer.style.color !== "orange" &&
    minutes < examDurationMinutes / 2
  ) {
    questionTimer.style.color = "orange";
  }

  // Decrement the remaining time
  examDurationSeconds--;
}

// Add this to clean up the timer when needed
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}
