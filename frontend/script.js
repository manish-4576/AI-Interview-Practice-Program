let currentSkill = "";
let currentQuestion = 0;
let totalQuestions = 30;
let timeLeft = 60;
let timer = null;
let isSubmitting = false;

const FULL_TIME = 60;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let autoSpeakEnabled = true;

/* =========================
   TYPEWRITER EFFECT (FIXED)
========================= */
function typeText(element, text, speed = 25) {
  element.innerHTML = ""; // 🔥 important
  let i = 0;

  const typing = setInterval(() => {
    const char = text.charAt(i);

    // ✅ preserve spaces and line breaks
    if (char === " ") {
      element.innerHTML += "&nbsp;";
    } else if (char === "\n") {
      element.innerHTML += "<br>";
    } else {
      element.innerHTML += char;
    }

    i++;

    if (i >= text.length) {
      clearInterval(typing);
    }
  }, speed);
}


/* =========================
   AUTO SPEAK
========================= */
function speakQuestion(text) {
  if (!autoSpeakEnabled) return;
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

/* =========================
   LOAD QUESTION (PREMIUM SYNC)
========================= */
function loadQuestion() {
  if (!currentSkill) return;

  clearInterval(timer);
  isSubmitting = false;

  const qEl = document.getElementById("question");
  qEl.innerText = "Loading question...";

  fetch(`http://localhost:5000/api/interview/question/${currentSkill}`)
    .then(res => res.json())
    .then(data => {
      const questionText = data.question || "No question received";

      // 🧠 calculate typing duration
      const typingSpeed = 18;
      const typingDuration = questionText.length * typingSpeed;

      // ✨ typing effect
      typeText(qEl, questionText, typingSpeed);

      document.getElementById("questionCount").innerText =
        `Q ${currentQuestion + 1} / ${totalQuestions}`;

      updateProgress();

      // 🔊 speak AFTER typing completes
      setTimeout(() => {
        speakQuestion(questionText);
      }, typingDuration + 200);

      // ⏱️ start timer AFTER typing completes
      setTimeout(() => {
        resetTimer();
      }, typingDuration + 300);
    })
    .catch(err => {
      console.error("Load question error:", err);
      qEl.innerText = "Error loading question";
    });
}


/* =========================
   SUBMIT ANSWER
========================= */
function submitAnswer(auto = false) {
  if (isSubmitting) return;
  if (!currentSkill) return;

  isSubmitting = true;
  clearInterval(timer);

  const answer = document.getElementById("answer").value.trim();
  const payload = { answer: answer || "No answer" };

  fetch(`http://localhost:5000/api/interview/answer/${currentSkill}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("feedback").innerText =
        auto
          ? `⏰ Time's up! Score: ${data.score} | ${data.feedback}`
          : `Score: ${data.score} | ${data.feedback}`;

      document.getElementById("answer").value = "";

      isSubmitting = false;
      nextQuestion();
    })
    .catch(err => {
      console.error("Submit error:", err);
      isSubmitting = false;
    });
}

/* =========================
   NEXT QUESTION
========================= */
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < totalQuestions) {
    loadQuestion();
  } else {
    document.getElementById("question").innerText =
      "Interview Completed 🎉";

    document.getElementById("feedback").innerText =
      "Great job! You completed the interview.";

    clearInterval(timer);
  }
}

/* =========================
   TIMER (FAANG STYLE)
========================= */
function startTimer() {
  clearInterval(timer);

  const circle = document.getElementById("timerCircle");
  const timerText = document.getElementById("timerText");

  circle.style.strokeDasharray = CIRCUMFERENCE;

  timer = setInterval(() => {
    timeLeft--;

    timerText.innerText = timeLeft;

    const progress =
      (timeLeft / FULL_TIME) * CIRCUMFERENCE;
    circle.style.strokeDashoffset =
      CIRCUMFERENCE - progress;

    // 🔴 danger zone
    if (timeLeft <= 10) {
      timerText.style.color = "#ff3b3b";
      circle.style.stroke = "#ff3b3b";
      circle.classList.add("pulse");
    }

    if (timeLeft <= 0) {
      submitAnswer(true);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);

  timeLeft = FULL_TIME;

  const circle = document.getElementById("timerCircle");
  const timerText = document.getElementById("timerText");

  timerText.innerText = timeLeft;
  timerText.style.color = "";

  circle.style.stroke = "#6366f1";
  circle.style.strokeDasharray = CIRCUMFERENCE;
  circle.style.strokeDashoffset = 0;
  circle.classList.remove("pulse");

  startTimer();
}

/* =========================
   PROGRESS BAR
========================= */
function updateProgress() {
  const percent =
    ((currentQuestion + 1) / totalQuestions) * 100;

  document.getElementById("progressBar").style.width =
    percent + "%";
}

/* =========================
   HISTORY
========================= */
function viewHistory() {
  fetch("http://localhost:5000/api/interview/history")
    .then(res => res.json())
    .then(data => {
      const tbody =
        document.querySelector("#historyTable tbody");

      tbody.innerHTML = "";

      if (!data.length) {
        tbody.innerHTML =
          `<tr><td colspan="4">No history found</td></tr>`;
      } else {
        data.forEach(item => {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${item.skill || "N/A"}</td>
            <td>${item.question || ""}</td>
            <td>${item.score ?? 0}</td>
            <td>${item.date ? new Date(item.date).toLocaleString() : "N/A"}</td>
          `;

          tbody.appendChild(row);
        });
      }

      document.getElementById("historyTable").style.display =
        "table";
    })
    .catch(err => console.error("History error:", err));
}

function closeHistory() {
  document.getElementById("historyTable").style.display =
    "none";
}

function clearHistory() {
  if (!confirm("Are you sure you want to clear history?")) return;

  fetch("http://localhost:5000/api/interview/history", {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "History cleared");
      document.querySelector("#historyTable tbody").innerHTML = "";
      document.getElementById("historyTable").style.display =
        "none";
    })
    .catch(err => console.error("Clear history error:", err));
}

/* =========================
   MIC + SPEAKER
========================= */
function setupMic() {
  const speakBtn = document.getElementById("speakQuestionBtn");

  if (speakBtn) {
    speakBtn.addEventListener("click", () => {
      const text = document.getElementById("question").innerText;
      speakQuestion(text);
    });
  }

  const micBtn = document.getElementById("startMicBtn");

  if (micBtn) {
    micBtn.addEventListener("click", () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = (event) => {
        document.getElementById("answer").value =
          event.results[0][0].transcript;
      };
    });
  }
}

/* =========================
   DARK MODE
========================= */
function setupTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

/* =========================
   DOM READY
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("startSkillBtn")
    .addEventListener("click", () => {
      const skill = document.getElementById("skill").value;

      if (!skill) {
        alert("Please select a skill");
        return;
      }

      currentSkill = skill;
      currentQuestion = 0;
      isSubmitting = false;

      updateProgress();
      loadQuestion();

      document.getElementById("feedback").innerText =
        `Skill Interview Started for ${skill}`;
    });

  document
    .getElementById("viewHistoryBtn")
    .addEventListener("click", viewHistory);

  document
    .getElementById("closeHistoryBtn")
    .addEventListener("click", closeHistory);

  document
    .getElementById("clearHistoryBtn")
    .addEventListener("click", clearHistory);

  setupMic();
  setupTheme();
});
