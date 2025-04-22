const logForm = document.getElementById('logForm');
const logInput = document.getElementById('logInput');
const logList = document.getElementById('logList');

let logs = JSON.parse(localStorage.getItem('studyLogs')) || [];

function displayLogs() {
  logList.innerHTML = '';
  logs.forEach((log, index) => {
    const li = document.createElement('li');
    li.classList.add('log-item');
    li.draggable = true;
    li.dataset.index = index;

    const dragHandle = document.createElement('span');
    dragHandle.classList.add('drag-handle');
    dragHandle.textContent = '⬍';

    const logText = document.createElement('span');
    logText.classList.add('log-text');
    logText.textContent = log;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deleteLog(index);

    li.appendChild(dragHandle);
    li.appendChild(logText);
    li.appendChild(deleteBtn);
    logList.appendChild(li);

    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragleave', handleDragLeave);
  });
}

function deleteLog(index) {
  logs.splice(index, 1);
  localStorage.setItem('studyLogs', JSON.stringify(logs));
  displayLogs();
}

logForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newLog = logInput.value.trim();
  if (newLog !== '') {
    logs.push(newLog);
    localStorage.setItem('studyLogs', JSON.stringify(logs));
    displayLogs();
    logForm.reset();
  }
});

// Drag and drop behavior
let draggedEl = null;

function handleDragStart(e) {
  draggedEl = e.currentTarget;
  draggedEl.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  const target = e.currentTarget;
  const bounding = target.getBoundingClientRect();
  const offset = e.clientY - bounding.top;

  if (offset > bounding.height / 2) {
    target.style['border-bottom'] = '2px solid #7c3aed';
    target.style['border-top'] = '';
  } else {
    target.style['border-top'] = '2px solid #7c3aed';
    target.style['border-bottom'] = '';
  }
}

function handleDrop(e) {
  e.preventDefault();
  const target = e.currentTarget;
  target.style['border-top'] = '';
  target.style['border-bottom'] = '';

  const fromIndex = parseInt(draggedEl.dataset.index);
  const toIndex = parseInt(target.dataset.index);

  if (fromIndex === toIndex) return;

  const movedItem = logs.splice(fromIndex, 1)[0];
  logs.splice(toIndex, 0, movedItem);
  localStorage.setItem('studyLogs', JSON.stringify(logs));
  displayLogs();
}

function handleDragLeave(e) {
  const target = e.currentTarget;
  target.style['border-top'] = '';
  target.style['border-bottom'] = '';
}

window.onload = displayLogs;
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