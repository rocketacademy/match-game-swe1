// boardSize has to be an even number
const boardSize = 2;
const maximumPoints = (boardSize * boardSize) / 2;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let userName;
let userScore = 0;
let totalWins = 0;
const gameInfo = document.createElement('div');
const resetBtn = document.createElement('button');
const gameContentContainer = document.querySelector('.game-content-container');

// make deck + shuffle cards
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['♥', '♦', '♣', '♠'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    // console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

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

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// Create a helper function for output to abstract complexity
// of DOM manipulation away from game logic
const output = (message) => {
  gameInfo.innerText = message;
};
// message that pops up when there's a match
const createMatchMessage = () => {
  const matchMessage = document.createElement('p');
  matchMessage.innerText = 'MATCHED!';
  matchMessage.classList.add('match-message');
  document.querySelector('.message-container').appendChild(matchMessage);
  setTimeout(() => matchMessage.remove(), 1000);
};

// message that pops up when a game is won
const createWinMessage = () => {
  // win message
  const winMessage = document.createElement('p');
  winMessage.innerText = `Great Job ${userName}!\nTotal Wins: ${totalWins}\n Starting new game in...`;
  winMessage.classList.add('win-message');
  document.querySelector('.message-container').appendChild(winMessage);
  // timer
  const timer = document.createElement('p');
  timer.innerText = '';
  timer.classList.add('timer-message');
  winMessage.appendChild(timer);

  const delayInSeconds = 1000;
  let startTime = 3000;
  const endTime = 0;

  const ref = setInterval(() => {
    timer.innerText = startTime;

    if (startTime <= endTime) {
      clearInterval(ref);
      //reset game
      resetGame();
    }

    startTime -= delayInSeconds;
  }, delayInSeconds);

  // setTimeout(() => winMessage.remove(), 3000);
};

// create a no click zone
const disableClicks = (num) => {
  const disableClick = document.createElement('div');
  disableClick.classList.add('no-click-zone');
  document.body.appendChild(disableClick);
  setTimeout(() => disableClick.remove(), num);
};

// get player's name when game is initialized
const createUserNameContainer = () => {
  // the main container
  const userNameContainer = document.createElement('form');
  userNameContainer.classList.add('user-name-container');

  // greeting
  const greeting = document.createElement('h4');
  greeting.innerText = 'Hello! What is your name?';

  // input fields container
  const inputFieldContainer = document.createElement('div');
  inputFieldContainer.classList.add('input-field-container');
  // input
  const nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('placeholder', 'bobby?');
  nameInput.classList.add('name-input');
  // submit button
  const nameBtn = document.createElement('button');
  nameBtn.innerText = 'enter';
  nameBtn.setAttribute('type', 'button');
  nameBtn.classList.add('name-btn');

  gameContentContainer.appendChild(userNameContainer);
  userNameContainer.appendChild(greeting);
  userNameContainer.appendChild(inputFieldContainer);
  inputFieldContainer.appendChild(nameInput);
  inputFieldContainer.appendChild(nameBtn);
};
const getUserName = () => {
  // make container
  createUserNameContainer();
  // create event listener for submission
  document.querySelector('.name-btn').addEventListener('click', () => {
    // store userName
    userName = document.querySelector('.name-input').value;
    console.log(userName);
    // delete container
    document.querySelector('.user-name-container').remove();
  });
};

// Game play logic
const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  // console.log('FIRST CARD DOM ELEMENT', firstCard);
  // console.log(`c: ${column},r: ${row}`);
  // console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    output('Click on another square!');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = `${firstCard.name}${firstCard.suit}`;
    console.log(firstCard);

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    // when player completes 1 game
    if (userScore === maximumPoints - 1) {
      // increase total score
      totalWins += 1;
      // winning message + reset grid
      createWinMessage();
    }
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      output('We gotta match!');
      if (userScore !== maximumPoints - 1) {
        createMatchMessage();
      }
      // turn this card over
      cardElement.innerText = `${clickedCard.name}${clickedCard.suit}`;
      //increase player score
      userScore += 1;
      console.log(userScore);
    } else {
      output('No Match. Try Again!');
      // turn this card over
      cardElement.innerText = `${clickedCard.name}${clickedCard.suit}`;
      // turn this card back over after a second
      setTimeout(() => {
        cardElement.innerText = '';
        firstCardElement.innerText = '';
      }, 500);
      //disable clicking
      disableClicks(500);
    }

    // reset the first card
    firstCard = null;
  }
};

// Game init logic
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (arrBoard) => {
  console.log(arrBoard);
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');
  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < arrBoard.length; i += 1) {
    // make a var for just this row of cards
    const row = arrBoard[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('p');
      // set a class for CSS purposes
      square.classList.add('square');
      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        // event.currentTarget returns the element that was clicked
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const initGame = () => {
  // create containers
  const gameInfoContainer = document.createElement('div');
  gameInfoContainer.classList.add('game-info-container');
  gameContentContainer.appendChild(gameInfoContainer);

  const timerContainer = document.createElement('div');
  timerContainer.classList.add('timer-container');
  gameContentContainer.appendChild(timerContainer);

  const matchMessageContainer = document.createElement('div');
  matchMessageContainer.classList.add('message-container');
  gameContentContainer.appendChild(matchMessageContainer);

  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);
  gameContentContainer.appendChild(boardEl);

  // create reset button
  resetBtn.innerText = 'RESET GAME';
  resetBtn.classList.add('reset-btn');
  gameContentContainer.appendChild(resetBtn);
  resetBtn.addEventListener('click', () => {
    totalWins = 0;
    resetGame();
  });

  // If this is the first game
  if (totalWins === 0) {
    // fill game info div with starting instructions
    gameInfo.innerText = 'Click on a square!';
    gameInfo.classList.add('gameInfo');
    document.querySelector('.game-info-container').appendChild(gameInfo);

    // ask for player name
    getUserName();
  }
};

const resetGame = () => {
  //reset game
  if (totalWins === 0) {
    // delete all child nodes of game-content
    gameContentContainer.innerHTML = '';
    //reset
    board.length = 0;
    firstCard = null;
    firstCardElement = '';
    deck = '';
    userName = '';
    userScore = 0;
    totalWins = 0;
    initGame();
  } else {
    // reset grid
    // delete all child nodes of game-content
    gameContentContainer.innerHTML = '';
    //reset
    board.length = 0;
    firstCard = null;
    firstCardElement = '';
    deck = '';
    userScore = 0;
    initGame();
  }
};

initGame();
