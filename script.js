let timerDisplay = document.getElementById('timer');
 let startBtn = document.getElementById('startBtn');
 let pauseBtn = document.getElementById('pauseBtn');
 let resetBtn = document.getElementById('resetBtn');
 let sessionCount = document.getElementById('sessionCount');
 
 let workTime = 25 * 60; // 25 minutes
 let breakTime = 5 * 60; // 5 minutes (optional: implement later)
 let timeLeft = workTime;
 let timer;
 let isRunning = false;
 let sessionsCompleted = 0;
 
 function updateDisplay() {
   let minutes = Math.floor(timeLeft / 60);
   let seconds = timeLeft % 60;
   timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
     .toString()
     .padStart(2, '0')}`;
 }
 
 function startTimer() {
   if (!isRunning) {
     timer = setInterval(() => {
       if (timeLeft > 0) {
         timeLeft--;
         updateDisplay();
       } else {
         clearInterval(timer);
         alert('Time’s up! Take a break!');
         sessionsCompleted++;
         sessionCount.textContent = sessionsCompleted;
         localStorage.setItem('sessions', sessionsCompleted);
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
 
 startBtn.addEventListener('click', startTimer);
 pauseBtn.addEventListener('click', pauseTimer);
 resetBtn.addEventListener('click', resetTimer);
 
 // Load session count from storage
 window.onload = function () {
   let storedSessions = localStorage.getItem('sessions');
   if (storedSessions) {
     sessionsCompleted = parseInt(storedSessions);
     sessionCount.textContent = sessionsCompleted;
   }
 };
 
 updateDisplay();
 
 // Select the canvas element by its ID
 const ctx = document.getElementById('productivityChart').getContext('2d');
 
 // Create a new Chart instance
 const productivityChart = new Chart(ctx, {
   type: 'bar', // Change to 'line', 'pie', etc. if you want something different
   data: {
     labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
     datasets: [{
       label: 'Pomodoros Completed',
       data: [3, 5, 2, 4, 6, 1, 0], // Example data - you can change this later!
       backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light color inside bars
       borderColor: 'rgba(75, 192, 192, 1)',       // Border color of bars
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