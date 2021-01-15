// global variables
let seconds = 0;
let minutes = 0;
let hours = 0;
let canStart = true;
let ref;
let canReset = true;
const delayMilliSeconds = 10;

// DOM elements
const elapsedTime = document.createElement('div');
const hour = document.createElement('span');
const minute = document.createElement('span');
const second = document.createElement('span');
const startButton = document.createElement('button');
const stopButton = document.createElement('button');
const resetButton = document.createElement('button');

hour.innerText = `${0}hr(s)`;
minute.innerText = `${0}min(s)`;
second.innerText = `${0}s`;
startButton.innerText = 'Start';
stopButton.innerText = 'Stop';
resetButton.innerText = 'Reset';

elapsedTime.classList.add('elapsedTime');

document.body.appendChild(elapsedTime);
document.body.appendChild(startButton);
document.body.appendChild(stopButton);
document.body.appendChild(resetButton);
elapsedTime.appendChild(hour);
elapsedTime.appendChild(minute);
elapsedTime.appendChild(second);

// function to start timer
const startTimer = () => {
  second.innerText = `${seconds}s`;
  minute.innerText = `${minutes}min(s)`;
  hour.innerText = `${hours}hr(s)`;
  seconds += 1;
  second.innerText = `${seconds}s`;
  if (seconds === 59) {
    seconds = 0;
    minutes += 1;
    minute.innerText = `${minutes}min(s)`;
  }
  if (minutes === 59) {
    seconds = 0;
    minutes = 0;
    hours += 1;
    hour.innerText = `${hours}hr(s)`;
  }
};

// function to reset timer
const resetTimer = () => {
  if (canReset === true) {
    clearInterval(ref);
    second.innerText = `${0}s`;
    minute.innerText = `${0}min(s)`;
    hour.innerText = `${0}hr(s)`;
    seconds = 0;
    minutes = 0;
    hours = 0;
    canStart = true;
  }
};

// start timer when start button is clicked
startButton.addEventListener('click', () => {
  if (canStart === true) {
    ref = setInterval(startTimer, delayMilliSeconds);
  }
  canStart = false;
});

// stop timer when stop button is clicked
stopButton.addEventListener('click', () => {
  clearInterval(ref);
  canStart = true;
  canReset = true;
});

// reset timer when reset button is clicked
resetButton.addEventListener('click', resetTimer);
