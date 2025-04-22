document.addEventListener("DOMContentLoaded", () => {
  // === THEME TOGGLE ===
  const themeSwitch = document.getElementById("theme-switch");
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    if (sessionChart) updateChartColors(sessionChart, isLight);
  });

  // === POMODORO TIMER ===
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

  function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  function startTimer() {
    if (!isRunning) {
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateTimerDisplay();
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
    updateTimerDisplay();
    isRunning = false;
  }

  function incrementSessionCount() {
    sessionsCompleted++;
    sessionCountDisplay.textContent = sessionsCompleted;
    localStorage.setItem('sessions', sessionsCompleted);
  }

  startBtn?.addEventListener("click", startTimer);
  pauseBtn?.addEventListener("click", pauseTimer);
  resetBtn?.addEventListener("click", resetTimer);
  endSessionBtn?.addEventListener("click", () => {
    incrementSessionCount();
    resetTimer();
  });

  let storedSessions = localStorage.getItem('sessions');
  if (storedSessions) {
    sessionsCompleted = parseInt(storedSessions);
    sessionCountDisplay.textContent = sessionsCompleted;
  }
  updateTimerDisplay();

  // === STUDY LOG ===
  const studyForm = document.getElementById('studyForm');
  const studyList = document.getElementById('studyList');

  if (studyForm && studyList) {
    studyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('subject').value;
      const duration = document.getElementById('duration').value;
      const li = document.createElement('li');
      li.className = 'draggable';
      li.setAttribute('draggable', 'true');
      li.textContent = `${subject} - ${duration} min`;
      studyList.appendChild(li);
      studyForm.reset();
    });

    let draggedItem = null;
    studyList.addEventListener('dragstart', (e) => {
      draggedItem = e.target;
      e.target.classList.add('dragging');
    });
    studyList.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
    });
    studyList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(studyList, e.clientY);
      if (afterElement == null) {
        studyList.appendChild(draggedItem);
      } else {
        studyList.insertBefore(draggedItem, afterElement);
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return (offset < 5 && offset > closest.offset) ? { offset, element: child } : closest;
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  }

  // === DASHBOARD CHART ===
  const ctx = document.getElementById('sessionChart');
  let sessionChart = null;

  if (ctx) {
    sessionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Math', 'Science', 'History', 'Coding', 'English'],
        datasets: [{
          label: 'Study Minutes',
          data: [40, 30, 20, 60, 25],
          backgroundColor: 'rgba(100, 149, 237, 0.7)',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: 'white' }
          }
        },
        scales: {
          x: { ticks: { color: 'white' } },
          y: { ticks: { color: 'white' } }
        }
      }
    });
  }

  function updateChartColors(chart, isLight) {
    const color = isLight ? 'black' : 'white';
    chart.options.plugins.legend.labels.color = color;
    chart.options.scales.x.ticks.color = color;
    chart.options.scales.y.ticks.color = color;
    chart.update();
  }
});
