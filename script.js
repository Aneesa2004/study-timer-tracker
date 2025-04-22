let workTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = workTime;
let timer;
let isRunning = false;
let sessionsCompleted = 0;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const endSessionBtn = document.getElementById("end-session-btn");
const sessionCountDisplay = document.getElementById("sessionCount");

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (!isRunning) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        alert("Time’s up! Take a break!");
        incrementSessionCount();
        resetTimer();
      }
    }, 1000);
    isRunning = true;
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = workTime;
  updateDisplay();
  isRunning = false;
}

function incrementSessionCount() {
  sessionsCompleted++;
  sessionCountDisplay.textContent = sessionsCompleted;
  localStorage.setItem('sessions', sessionsCompleted);
}

endSessionBtn.addEventListener("click", () => {
  incrementSessionCount();
  resetTimer();
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

window.onload = function () {
  let storedSessions = localStorage.getItem('sessions');
  if (storedSessions) {
    sessionsCompleted = parseInt(storedSessions);
    sessionCountDisplay.textContent = sessionsCompleted;
  }
  updateDisplay();
};


// Chart.js setup
const ctx = document.getElementById('productivityChart').getContext('2d');
const productivityChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      label: 'Pomodoros Completed',
      data: [3, 5, 2, 4, 6, 1, 0],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      borderRadius: 8
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Theme toggle setup
document.addEventListener("DOMContentLoaded", () => {
  const switchToggle = document.getElementById("theme-switch");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    switchToggle.checked = true;
  }

  switchToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  });
});