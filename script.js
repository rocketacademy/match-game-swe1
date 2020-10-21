// Global variables
const board = [];
let firstCard = null;
let secondCard = null;

// track the first card and second card's HTML equivalent
let firstCardHtml;
let secondCardHtml;
const countDownTime = 180; // 180s

let ref = ''; // define & capture reference to timer event;
let ref2 = ''; // define & capture reference to the event where first 3 cards are clicked and the 1st 2 cards must be cleared.
let timeLeft = 0; // capture the amount of time left; initialized to 0

const boardSize = 4; // has to be an even number
// game only starts when squareClicked.
let numOfClicks = 0;
let score = 0;
let deck;

// Main Output Area:
const outputValue = 'Hi, please input your name :)';
const outputDivTag = document.createElement('div');

// Score Output Area:
const scoreOutputDivTag = document.createElement('div');

// Time Output Area;
const timer = document.createElement('div');

// Helper functions below::
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      // declare displayName
      let displayName;

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

      if (cardName === 'ace') {
        displayName = 'A';
      } else if (cardName === 'jack') {
        displayName = 'J';
      } else if (cardName === 'queen') {
        displayName = 'Q';
      } else if (cardName === 'king') {
        displayName = 'K';
      } else {
        displayName = cardName;
      }
      let suitSymbol;
      let colorX;
      if (suitIndex === 0) {
        suitSymbol = '❤️';
        colorX = 'red';
      } else if (suitIndex === 1) {
        suitSymbol = '◆';
        colorX = 'red';
      } else if (suitIndex === 2) {
        suitSymbol = '♣️';
        colorX = 'black';
      } else {
        suitSymbol = '♠️';
        colorX = 'black';
      }
      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        display: displayName,
        symbol: suitSymbol,
        color: colorX,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};
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

const getRandomIndex = (size) => Math.floor(Math.random() * size);

const squareClick = (cardElement, column, row) => {
  numOfClicks += 1;

  console.log(cardElement);
  console.log('FIRST CARD', firstCard);
  console.log('CLICKED CARD', board[column][row]);

  // firstCard is the card object
  // cardElement is HTML
  if (firstCard === null && secondCard === null) {
    firstCard = board[column][row];
    // turn this card over
    // Tracking the firstCard's HTML in firstCardHTML
    firstCardHtml = cardElement;
    console.log(cardElement, 'cardElement');
    console.log(cardElement.getElementsByClassName('displayName'), 'output display name');
    // firstCardHTML.getElementsByClassName('displayName').innerHTML = `${firstCard.display}`;
    // firstCardHTML.getElementsByClassName('displaySuit').innerHTML = `${firstCard.symbol}`;
    firstCardHtml.innerHTML = `<div>${firstCard.display}</div> <div>${firstCard.symbol}<div>`;

    outputDivTag.innerHTML = 'Please click another card';
  } else if (board[column][row].name === firstCard.name
  && board[column][row].suit === firstCard.suit) {
    // turn this card over
    // Tell user it is a match
    cardElement.innerHTML = `${firstCard.display} <br> ${firstCard.symbol}`;
    outputDivTag.innerHTML = 'Its a match!';
    // Increment score by 1 and output it into the scoreOutputDivTag
    score += 1;
    scoreOutputDivTag.innerHTML = displayScore();

    // if in this click, player achieves max score ie completes game, show congrats msg
    if (score === (boardSize * boardSize) / 2) {
      congratulations(timeLeft);
    }
    setTimeout(() => { outputDivTag.innerHTML = ''; }, 3000);
    firstCard = null;

  // } else if (firstCard !== null && secondCard !== null) {
  //   firstCard = null;
  //   secondCard = null;
  //   firstCardHTML.innerHTML = '';
  //   secondCardHTML.innerHTML = '';
  //   console.log('attempting to clear');
  } else if (firstCard !== null && secondCard === null) {
    // turn this card back over
    secondCard = board[column][row];
    secondCardHtml = cardElement;
    secondCardHtml.innerHTML = `${secondCard.display} <br> ${secondCard.symbol}`;

    console.log(firstCard, 'firstCard');
    console.log(secondCard, 'secondCard');

    ref2 = setTimeout(() => {
      firstCard = null;
      secondCard = null;
      secondCardHtml.innerHTML = '';
      firstCardHtml.innerHTML = ''; }, 1000);

    outputDivTag.innerHTML = 'There is no-match. The first card is returned to null';
  } else if (firstCard !== null && secondCard !== null) {
    clearInterval(ref2);
    firstCard = null;
    secondCard = null;
    firstCardHtml.innerHTML = '';
    secondCardHtml.innerHTML = '';
    // Calling squareclick() again recursively: clear 1st 2 cards and  simulate running the fn from the start by calling this fn again
    squareClick(cardElement, column, row);
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');
      const displayName = document.createElement('div');
      const displaySuit = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('square');
      displayName.classList.add('displayName');
      displaySuit.classList.add('displaySuit');

      // appending displayName and displaySuit div tags into square div tag
      square.appendChild(displayName);
      square.appendChild(displaySuit);

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {

        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
        console.log(event.currentTarget);

        startGameTimer(countDownTime);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const displayScore = () => `Your score is ${score}.`;

const startGameTimer = (time) => {
  if (numOfClicks === 1) {
    time = 180;
    const initialMessage = 'Time left: ';
    timer.innerHTML = initialMessage + time + 's';

    ref = setInterval(() => {
      time -= 1;
      timer.innerHTML = initialMessage + time + 's';
    }, 1000);

    // if game ends before all cards are matched, clear interval
    setTimeout(() => {
      clearInterval(ref);
      timer.innerHTML = 'Time\'s up!';
    }, 180000); // 180s or 3mins
  } else if (numOfClicks > 1 && score === boardSize) {
    clearInterval(ref);
    console.log('time remaining is ' + time);
    timeLeft = time;
    console.log(timeLeft, 'timeleft in startGameTimer fn');
  }
};

// Function that creates the userName input;
const getUserNameInput = () => {
// Creating the input box & submit button to take user name
  const inputBox = document.createElement('input');
  inputBox.setAttribute('placeholder', 'Please enter your name!');
  inputBox.setAttribute('id', 'submit-username');

  const submitButton = document.createElement('button');
  submitButton.innerHTML = 'Submit';

  const inputDiv = document.createElement('div');
  // Append inputBox & Submit Button into inputDiv Tag
  inputDiv.appendChild(inputBox);
  inputDiv.appendChild(submitButton);

  // Add event listener to submit button to get username
  submitButton.addEventListener('click', () => {
    const userName = document.querySelector('#submit-username');
    outputDivTag.innerHTML = `Welcome ${userName.value}! Please click on a card and the timer will begin.`;
    inputBox.value = '';
    console.log('test');
  });
  document.body.appendChild(inputDiv);
};

// Function that initializes the game;
const gameInit = () => {
  // create username and submit button on top first;
  getUserNameInput();
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  // Initialize welcome message and append output div and score div
  outputDivTag.innerHTML = outputValue;
  scoreOutputDivTag.innerHTML = `Your score is ${score}`;

  // Append all necessary elements below:
  document.body.appendChild(boardEl);
  document.body.appendChild(outputDivTag);
  document.body.appendChild(scoreOutputDivTag);
  document.body.appendChild(timer);
};

const resetGame = () => {
  const resetButton = document.createElement('button');
  resetButton.setAttribute('id', 'rest');
  resetButton.innerHTML = 'Reset Game';
  resetButton.addEventListener('click', () => {
    // setting the length of board array to zero removes all items in the array;
    board.length = 0;
    // remove all elements under document.body
    document.body.innerHTML = '';
    gameInit();
    resetGame();
  });

  document.body.appendChild(resetButton);
};

// Say congrats and disappear in 5 seconds
const congratulations = (timeLeft) => {
  const congratsDisplay = document.createElement('div');
  congratsDisplay.innerHTML = `<img src="https://media4.giphy.com/media/g9582DNuQppxC/200.gif"/>   Congratulations! You\'ve won the game in ${timeLeft} seconds!</img>`;
  console.log(timeLeft, 'timeleft in congratulations fn');
  setTimeout(() => {
    congratsDisplay.innerHTML = '';
  }, 5000);
  document.body.appendChild(congratsDisplay);
};

// Run the program

gameInit();
resetGame();
