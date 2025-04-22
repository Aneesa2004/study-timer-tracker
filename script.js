document.addEventListener('DOMContentLoaded', () => {
  // === THEME TOGGLE ===
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      if (sessionChart) updateChartColors(sessionChart, isLight);
    });
  }

  // === POMODORO TIMER ===
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const timerDisplay = document.getElementById('timer');
  let timer, timeLeft = 1500;

  function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

  function startTimer() {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        alert('Time’s up!');
      }
    }, 1000);
  }

  if (startBtn) startBtn.addEventListener('click', () => startTimer());
  if (stopBtn) stopBtn.addEventListener('click', () => clearInterval(timer));
  if (resetBtn) resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timeLeft = 1500;
    updateTimerDisplay();
  });

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

    // Drag-and-drop
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
        if (offset < 5 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
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

    // Color switch for light/dark mode
    function updateChartColors(chart, isLight) {
      const color = isLight ? 'black' : 'white';
      chart.options.plugins.legend.labels.color = color;
      chart.options.scales.x.ticks.color = color;
      chart.options.scales.y.ticks.color = color;
      chart.update();
    }
  }
});