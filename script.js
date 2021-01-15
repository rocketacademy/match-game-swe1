// Please implement exercise logic here

// declare global variables
const board = [];
let canClick = true;
let firstCard = null;
let secondCard = null;
let firstCardElement = null;

const boardSize = 4; // has to be an even number
let cardInfo;

let deck;
let ref;
let hours;
let minutes;
let seconds;

const getRandomIndex = (size) => Math.floor(Math.random() * size);

// cards is an array of card objects
const shuffleCards = (cards) => {
  // loop over the entire cards array
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitSymbols = ['♥️', '♦️', '♣️', '♠️'];
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    const currentSuitSymbol = suitSymbols[suitIndex];
    console.log(`current suit: ${currentSuit}`);
    console.log(`current suitSymbol: ${currentSuitSymbol}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      let cardDisplay = `${cardName}`;
      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
      } else if (cardName === '11') {
        cardName = 'jack';
      } else if (cardName === '12') {
        cardName = 'queen';
      } else if (cardName === '13') {
        cardName = 'king';
      }

      if (cardDisplay === '1') {
        cardDisplay = 'A';
      } else if (cardDisplay === '11') {
        cardDisplay = 'J';
      } else if (cardDisplay === '12') {
        cardDisplay = 'Q';
      } else if (cardDisplay === '13') {
        cardDisplay = 'K';
      }

      // make a single card object variable
      cardInfo = {
        suitSymbol: currentSuitSymbol,
        name: cardName,
        suit: currentSuit,
        display: cardDisplay,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // add the cardInfo to the deck, done twice to get a double deck
      newDeck.push(cardInfo);
      newDeck.push(cardInfo);
    }
  }

  return newDeck;
};

// showing match message
const showMatchMessage = () => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('heading');
  messageDiv.innerText = 'IT\'S A MATCH!!';
  return messageDiv;
};

// function that executes when a card is clicked
const squareClick = (cardElement, column, row) => {
  const clickCard = board[column][row];

  console.log('first card', firstCard);
  console.log('click card', clickCard);
  if (canClick === false) {
    return;
  }

  if (firstCard === null) {
    firstCard = clickCard;
    console.log('first card turned over');
    firstCardElement = cardElement;
    // turn this card over
    cardElement.innerText = firstCard.name;
  } else {
    secondCard = clickCard;
    console.log('second card', secondCard);

    if (secondCard.name === firstCard.name) {
    // turn this card over
      console.log('match');
      console.log('second card', secondCard);

      cardElement.innerText = secondCard.name;
      console.log('click card', clickCard);

      const output = showMatchMessage();
      document.body.append(output);

      setTimeout(() => {
        output.remove();
      }, 3000);
    } else {
      console.log('no match');
      // firstCardElement.innerText = '';
      cardElement.innerText = secondCard.name;
      canClick = false;
      setTimeout(() => {
        console.log('hello');
        cardElement.innerText = '';
        firstCardElement.innerText = '';
        canClick = true;
      }, 2000);
    // turn this card back over
    }
    firstCard = null;
  }
};

// building the board elements
const buildBoardElements = (board) => {
  // this is the container everything will go inside of
  const boardElement = document.createElement('div');
  boardElement.classList.add('board');

  // use the board created before to create the correct sized board
  for (let i = 0; i < board.length; i += 1) {
    // 1 row = 1 element(array) inside the array board
    const row = board[i];
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    // making the squares inside the rows
    for (let j = 0; j < row.length; j += 1) {
      // making the squares inside 1 row
      const square = document.createElement('div');
      square.classList.add('square');
      square.addEventListener('click', (event) => {
        console.log('card element', event.currentTarget);
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }

    boardElement.appendChild(rowElement);
  }
  return boardElement;
};

const buildTimerElements = () => {
  const timerContainer = document.createElement('div');
  timerContainer.classList.add('container');
  document.body.append(timerContainer);

  const timerDisplay = document.createElement('div');
  timerDisplay.classList.add('display');
  timerDisplay.innerText = 'timer ready ';
  timerContainer.appendChild(timerDisplay);

  const resetButton = document.createElement('button');
  resetButton.classList.add('button');
  resetButton.innerText = 'RESET';
  timerContainer.appendChild(resetButton);
  resetButton.addEventListener('click', () => {
    hours = 0;
    minutes = 0;
    seconds = 0;
    timerDisplay.innerHTML = `${hours} hours<br> ${minutes} minutes<br> ${seconds} seconds`;
  });

  const startButton = document.createElement('button');
  startButton.classList.add('button');
  startButton.innerText = 'START';
  timerContainer.appendChild(startButton);
  startButton.addEventListener('click', () => {
    setTimeout(() => {
      timerDisplay.innerHTML = `${hours} hours<br> ${minutes} minutes<br> ${seconds} seconds`;
    }, 2000);
    const milliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;

    const delayInMilliseconds = 1000;
    ref = setInterval(() => {
      timerDisplay.innerHTML = `${hours} hours<br> ${minutes} minutes<br> ${seconds} seconds`;
      if (seconds > 58 && seconds % 60 === 0) {
        minutes += 1;
        seconds = 0;
      }

      if (minutes > 58 && minutes % 60 === 0) {
        hours += 1;
        minutes = 0;
      }

      if (minutes > 2) {
        clearInterval(ref);
      }
      seconds += 1;
    }, delayInMilliseconds);
  });

  const stopButton = document.createElement('button');
  stopButton.classList.add('button');
  stopButton.innerText = 'STOP';
  timerContainer.appendChild(stopButton);
  stopButton.addEventListener('click', () => {
    clearInterval(ref);
  });

  return timerContainer;
};

const initGame = () => {
  const pageHeading = document.createElement('h2');
  pageHeading.classList.add('heading');
  pageHeading.innerHTML = 'SWE 1<br>MATCH GAME';
  document.body.appendChild(pageHeading);

  // using the deck we made before, with double the number of cards
  const doubleDeck = makeDeck();
  // getting the number of cards needed to make up the board i.e 4 * 4
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  // deck = shuffleCards(deckSubset);
  deck = deckSubset;

  for (let i = 0; i < boardSize; i += 1) {
    // generate 4 empty arrays within variable board (which is an empty array itself)
    // i.e board = [[], [], [], []]
    board.push([]);
    // push 4 cards from the deck into each empty array in board
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);

  const timerEl = buildTimerElements();
  document.body.appendChild(timerEl);
};

initGame();
