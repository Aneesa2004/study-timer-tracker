const logForm = document.getElementById('logForm');
const logInput = document.getElementById('logInput');
const logList = document.getElementById('logList');

let logs = JSON.parse(localStorage.getItem('studyLogs')) || [];

function displayLogs() {
  logList.innerHTML = '';
  logs.forEach((log, index) => {
    const li = document.createElement('li');
    li.classList.add('log-item');
    li.draggable = true; // Enable dragging
    li.dataset.index = index;

    // Drag Handle Button (⬍)
    const dragHandle = document.createElement('span');
    dragHandle.classList.add('drag-handle');
    dragHandle.textContent = '⬍';

    // Log Text
    const logText = document.createElement('span');
    logText.classList.add('log-text');
    logText.textContent = log;

    // Delete Button (🗑)
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deleteLog(index);

    // Append Elements
    li.appendChild(dragHandle);
    li.appendChild(logText);
    li.appendChild(deleteBtn);
    logList.appendChild(li);

    // Drag-and-drop event listeners
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
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

// Drag-and-Drop functions
let draggedIndex = null;

function handleDragStart(e) {
  draggedIndex = e.target.dataset.index;
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const targetIndex = e.target.dataset.index;
  if (targetIndex !== undefined && draggedIndex !== null) {
    const draggedItem = logs.splice(draggedIndex, 1)[0];
    logs.splice(targetIndex, 0, draggedItem);
    localStorage.setItem('studyLogs', JSON.stringify(logs));
    displayLogs();
  }
}

window.onload = displayLogs;