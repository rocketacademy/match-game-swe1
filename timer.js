// GLOBAL VARIABLES
let seconds = 6;
let minutes = 3;
let hours = 0;
let stopTimerValue = false;

// QUERY DOM ELEMENTS
const startTimerButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetTimerButton = document.getElementById("reset");
const lapButton = document.getElementById("lap");
const displaySecondsOnScreen = document.getElementById("show-seconds");
const displayMinuteOnScreen = document.getElementById("show-minute");
const displayHourOnScreen = document.getElementById("show-hour");

// FUNCTION TO START TIMER
const startTimer = () => {
  stopTimerValue === true ? (stopTimerValue = false) : true;
  const toStartTimer = setInterval(() => {
    // minutes = 3;
    // seconds = 60;
    displaySecondsOnScreen.innerText = seconds;
    displayMinuteOnScreen.innerText = minutes;
    displayHourOnScreen.innerText = hours;
    seconds -= 1;
    if (stopTimerValue === true) {
      console.log("STOP CLICKED", stopTimerValue);
      console.log("Value of stopTimerValue", stopTimerValue);
      clearInterval(toStartTimer);
    } else if (seconds === 0 && minutes != 0) {
      minutes -= 1;
      console.log("minute ", minutes);
      seconds = 6;
      console.log("second ", minutes);
      //IF MINUTES == 60 ? HOURS === +=1 MINUTES === 0
    } else if (minutes === 0 && seconds === 0) {
      // hours += 1;
      // minutes = 0;
      showMsgFunc("Game about to end timer message", "red");
      clearInterval(toStartTimer);
      setTimeout(() => {
        location.reload();
      }, 5000);
    }
  }, 1000);
};

// FUNCTION TO STOP TIMER
const stopTimer = () => {
  console.log("Change value to true");
  stopTimerValue = true;
};

// FUNCTION TO RESET TIMER
const resetTimer = () => {
  console.log("RESET WAS CLICKED");
  // Stop timer
  stopTimer();
  // Reset timings to 0
  seconds = 0;
  minutes = 0;
  hours = 0;
};

// USER CLICK LISTENER
startTimerButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetTimerButton.addEventListener("click", resetTimer);
