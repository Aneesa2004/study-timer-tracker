const logForm = document.getElementById('logForm');
const logInput = document.getElementById('logInput');
const logList = document.getElementById('logList');

let logs = JSON.parse(localStorage.getItem('studyLogs')) || [];

function displayLogs() {
  logList.innerHTML = '';
  logs.forEach((log, index) => {
    const li = document.createElement('li');
    li.textContent = log;
    logList.appendChild(li);
  });
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

window.onload = displayLogs;
