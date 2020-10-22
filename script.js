// Global variables
const board = [];

// To track position of cards clicked and matched
const positionArray = [];
let firstCol;
let firstRow;

let firstCard = null;
let secondCard = null;

// Global state to track if cards are currently matched - purpose is to prevent the 3rd click which  yields a new firstCardHtml from erasing the 1st click's firstCardHtml
let currentNotMatched = true;
// track the first card and second card's HTML equivalent
let firstCardHtml;
let secondCardHtml;
const countDownTime = 180; // 180s

let ref = ''; // define & capture reference to timer event;
let ref2 = ''; // define & capture reference to the event where first 3 cards are clicked and the 1st 2 cards must be cleared.
let ref3 = ''; // special event
let timeLeft = 0; // capture the amount of time left; initialized to 0

const boardSize = 4; // has to be an even number
// game only starts when squareClicked.
let numOfClicks = 0;
let score = 0;
let deck;

// Track position of card clicked and prevent user from clicking on the same card multiple times to score
const positionOfCardClicked = {
  column: '',
  row: '',
};
// create resetButton here
const resetButton = document.createElement('button');
resetButton.setAttribute('id', 'rest');

// Main Output Area:
const outputValue = 'Hi, please input your name :)';
const outputDivTag = document.createElement('div');

// Score Output Area:
const scoreOutputDivTag = document.createElement('div');

// Time Output Area;
const timer = document.createElement('div');

// Helper functions below::

const restartGlobalVariables = () => {
// Global variables
  board.length = 0;

  // To track position of cards clicked and matched
  positionArray.length = 0;
  // firstCol;
  // firstRow;

  firstCard = null;
  secondCard = null;

  // Global state to track if cards are currently matched - purpose is to prevent the 3rd click which  yields a new firstCardHtml from erasing the 1st click's firstCardHtml
  currentNotMatched = true;

  ref = ''; // define & capture reference to timer event;
  ref2 = ''; // define & capture reference to the event where first 3 cards are clicked and the 1st 2 cards must be cleared.
  ref3 = ''; // special event
  timeLeft = 0; // capture the amount of time left; initialized to 0

  numOfClicks = 0;
  score = 0;

  // Refresh position of card clicked and prevent user from clicking on the same card multiple times to score
  positionOfCardClicked.column = '';
  positionOfCardClicked.row = '';
};

const getRandomIndex = (size) => Math.floor(Math.random() * size);

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

// Fn to display card in squareClick method
const outputCardDisplay = (cardHtml, card) => {
  for (let i = 0; i < cardHtml.childNodes.length; i += 1) {
    const currNode = cardHtml.childNodes[i];
    if (currNode.className === 'displayName') {
      currNode.innerHTML = card.display;
    } else {
      currNode.innerHTML = card.symbol;
    }
  }
};

// Fn to clear text by each nested div inside square divs
const clearCardDisplay = (cardHtml) => {
  if (cardHtml) {
    for (let i = 0; i < cardHtml.childNodes.length; i += 1) {
      const currNode = cardHtml.childNodes[i];
      if (currNode.className === 'displayName') {
        currNode.innerHTML = '';
      } else {
        currNode.innerHTML = '';
      }
    }
  }
};

// Say congrats and disappear in 5 seconds
const congratulations = (timeLeft) => {
  const congratsDisplay = document.createElement('div');
  console.log(timeLeft);
  congratsDisplay.innerHTML = `<img src="https://media4.giphy.com/media/g9582DNuQppxC/200.gif"/>   Congratulations! You\'ve won the game in ${timeLeft} seconds!</img>`;
  setTimeout(() => {
    congratsDisplay.innerHTML = '';
  }, 5000);
  document.body.appendChild(congratsDisplay);
};
const startGameTimer = (time) => {
  if (numOfClicks === 1) {
    time = 180;
    const initialMessage = 'Time left: ';
    timer.innerHTML = initialMessage + time + 's';

    ref = setInterval(() => {
      time -= 1;
      timeLeft = countDownTime - time;
      timer.innerHTML = initialMessage + time + 's';
    }, 1000);

    // if game ends before all cards are matched, clear interval
    setTimeout(() => {
      clearInterval(ref);
      let x = 3;
      // display message to user that game is restarting in 3 seconds synchronously
      const ref4 = setInterval(() => {
        timer.innerHTML = `Time\'s up! You lost. Restarting in ${x}...`;
        x -= 1;
        if (x === 0) {
          clearInterval(ref4);
        }
      }, 1000);
      // restart the game after 3 seconds
      setTimeout(() => {
        noClickResetGame();
      }, 4000);
    }, 180000); // 180s or 3mins
  } else if (numOfClicks > 1 && score === boardSize) {
    clearInterval(ref);
  }
};
const displayScore = () => `Your score is ${score}.`;

const squareClick = (cardElement, column, row) => {
  numOfClicks += 1;

  // firstCard is the card object
  // cardElement is HTML
  if (firstCard === null && secondCard === null) {
    firstCol = column;
    firstRow = row;
    currentNotMatched = true;
    console.log(firstCardHtml, 'firstCardHtml');

    if (positionArray[column][row] === 'matched') {
      outputDivTag.innerHTML = 'Illegal, you cannot choose a matched card <br> Please click another card.';
      // cannot clear the position of the matched card
    } else {
      firstCard = board[column][row];
      console.log(firstCard, 'first card is reassigned');
      positionArray[column][row] = 'x';
      // turn this card over

      // Tracking the firstCard's HTML in firstCardHTML
      // clearCardDisplay(firstCardHtml);
      // clearCardDisplay(secondCardHtml);
      firstCardHtml = cardElement;

      outputCardDisplay(firstCardHtml, firstCard);

      outputDivTag.innerHTML = 'Please click another card';
    }
    // In the event there is a match:
  }
  // after firstCard is revealed, check if secondCard is the same as firstCard
  else if (board[column][row].name === firstCard.name
  && board[column][row].suit === firstCard.suit) {
    console.log(board[column][row].name, 'name of card');

    if (positionArray[column][row] === 'x') {
      outputDivTag.innerHTML = 'Illegal. You cannot choose the same card.';
      positionArray[firstCol][firstRow] = '';
      firstCard = null;
      secondCard = null;
      clearCardDisplay(secondCardHtml);
      clearCardDisplay(firstCardHtml);
      console.log(positionArray);
    } else if (positionArray[column][row] === 'matched') {
      outputDivTag.innerHTML = 'Illegal. You cannot choose a matched card.';
      positionArray[firstCol][firstRow] = '';
      clearCardDisplay(firstCardHtml);
    }
    // if secondCard is not already selected 'x' or already 'matched - then assign secondCard to current cardElement
    else if (positionArray[column][row] !== 'x' && positionArray[firstCol][firstRow] !== 'matched') {
      // reassign secondCardHtml to new cardElement;
      secondCard = board[column][row];
      secondCardHtml = cardElement;
      // turn this card over
      secondCardHtml.innerHTML = `${secondCard.display} <br> ${secondCard.symbol}`;
      outputDivTag.innerHTML = 'Its a match!';
      currentNotMatched = false;
      // Increment score by 1 and output it into the scoreOutputDivTag
      score += 1;

      // Next check if in this click, player achieves max score ie completes game, show congrats msg
      if (score === (boardSize * boardSize) / 2) {
        congratulations(timeLeft);
      }
      // rename position x to matched
      positionArray[column][row] = 'matched';
      positionArray[firstCol][firstRow] = 'matched';
      firstCol = '';
      firstRow = '';
      scoreOutputDivTag.innerHTML = displayScore();
      firstCard = null;
      secondCard = null;
      // else clicking on positionArray with some position  or choosing a matched card inside
    } else if (positionArray[column][row] === '') {
      setTimeout(() => {
        clearCardDisplay(firstCardHtml);
        clearCardDisplay(secondCardHtml);
      }, 500);
    }

    // Remove message after 3 seconds
    setTimeout(() => { outputDivTag.innerHTML = ''; }, 3000);
    // In the event there is no match between the 1st 2 cards
  }
  // after firstCard is revealed, and secondCard is NOT the same as firstCard
  else if (firstCard !== null && secondCard === null) {
    // turn this card back over
    secondCard = board[column][row];
    secondCardHtml = cardElement;
    outputCardDisplay(secondCardHtml, secondCard);

    // check if second card is matched -
    if (positionArray[column][row] === 'matched') {
      positionArray[firstCol][firstRow] = '';
      firstCard = null;
      secondCard = null;
      ref2 = setTimeout(() => {
        clearCardDisplay(firstCardHtml);
      }, 500);
      // else if first card is x and second card is empty and no match:
    } else if (positionArray[column][row] === '') {
      console.log(positionArray);
      positionArray[firstCol][firstRow] = '';
      firstCard = null;
      secondCard = null;
      const clearCardHtml = firstCardHtml;

      ref3 = setTimeout(() => {
        clearCardDisplay(clearCardHtml);
        clearCardDisplay(secondCardHtml);
        // firstCard = null;
        // secondCard = null;
        console.log('clear card 2');
      }, 500);
    }
    outputDivTag.innerHTML = 'There is no-match. The first card is returned to null';

    // else if you clicked on 1st card and 2nd card (and now 3rd card)
  }
  // after firstCard and secondCard are both revealed and I click on a thirdCard
  else if (firstCard !== null && secondCard !== null && currentNotMatched === true) {
    // Immediately stop the first 2 references and restore to the first if-statement of a player drawing a new card
    currentMatched = false;
    clearInterval(ref2);
    clearInterval(ref3);
    firstCard = null;
    secondCard = null;
    // positionArray[firstCol][firstRow] = '';
    // const clearCardHtml3 = firstCardHtml;
    clearCardDisplay(firstCardHtml);
    clearCardDisplay(secondCardHtml);
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

        startGameTimer(countDownTime);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
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
// Fn to outputCardDisplay by each nested div inside square divs

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
    positionArray.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
      positionArray[i].push('');
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
  document.body.appendChild(resetButton);
};

const noClickResetGame = () => {
  // remove all elements under document.body
  document.body.innerHTML = '';
  timer.innerHTML = '';
  clearInterval(ref);
  restartGlobalVariables();
  gameInit();
  resetGame();
};

const resetGame = () => {
  resetButton.innerHTML = 'Reset Game';
  resetButton.addEventListener('click', () => {
    // setting the length of board array to zero removes all items in the array;
    board.length = 0;
    // remove all elements under document.body
    noClickResetGame(); });
};

// Run the program

gameInit();
resetGame();
