// Set up variables
let workTime = 1500;
let breakTime = 300;
let timerInterval;
let timerType = "work";
let timerRunning = false;
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");
const workTimeInput = document.getElementById("work-time");
const breakTimeInput = document.getElementById("break-time");

// Add event listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
restartButton.addEventListener("click", restartTimer);
workTimeInput.addEventListener("change", updateWorkTime);
breakTimeInput.addEventListener("change", updateBreakTime);

// Initialize timer
updateTimerDisplay(workTime);

// Timer functions
function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(() => {
            updateTimerDisplay(getCurrentTime() - 1);

            if (getCurrentTime() === 0) {
                if (timerType === "work") {
                    sendNotification("Break time!");
                    updateTimerDisplay(breakTime);
                    timerType = "break";
                } else {
                    sendNotification("Work time!");
                    updateTimerDisplay(workTime);
                    timerType = "work";
                }
            }
        }, 1000);

        startButton.disabled = true;
        pauseButton.disabled = false;
        restartButton.disabled = true;
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;

    startButton.disabled = false;
    pauseButton.disabled = true;
    restartButton.disabled = false;
}

function updateTimerDisplay(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerDisplay.textContent = `${padTime(minutes)}:${padTime(seconds)}`;
}

function getCurrentTime() {
    let time = timerType === "work" ? workTime : breakTime;
    return parseInt(timerDisplay.textContent.split(":").reduce((a, v) => a * 60 + parseInt(v), 0));
}

function padTime(time) {
    return time.toString().padStart(2, "0");
}

function restartTimer() {
    pauseTimer();
    timerType = "work";
    updateTimerDisplay(workTime);
    startButton.disabled = false;
    restartButton.disabled = true;
}

function updateWorkTime() {
    workTime = parseInt(workTimeInput.value);
    updateTimerDisplay(workTime);
}

function updateBreakTime() {
    breakTime = parseInt(breakTimeInput.value);
}

function sendNotification(message) {
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification(message);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification(message);
                }
            });
        }
    }
}

// Auto start timer on page load
startTimer();
