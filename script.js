// Please implement exercise logic here
/*
** GLOBALS
**
*/
// boardSize has to be an even number
const boardSize = 4;
const GAMEBOARD = [];
let firstCard = null;
let firstCardElement;
let deck;
// Boolean handler for timeout to prevent subsequent clicks
// while showing both unmatched cards
let canClick = true;
// Time to complete the game
let timer = 180;
// initialize timeout and interval variables
let displayMatchMessageTimeout;
let timerInterval;

/*
** NAMED TIMEOUT FUNCTIONS AND HELPERS
**
*/

const hideMatchMessages = () => {
  const matchMessageInstances = document.querySelectorAll('.matchMessage');

  for (let i = 0; i < matchMessageInstances.length; i += 1) {
    matchMessageInstances[i].remove();
  }
};

const showMatchMessage = (card) => {
  const matchMessageParagraph = document.createElement('p');
  matchMessageParagraph.className += 'matchMessage match-message';
  matchMessageParagraph.innerText = `You have matched a pair of ${card.name} of ${card.suit}!`;
  document.body.appendChild(matchMessageParagraph);
};

const handleMatchMessage = (card) => {
  clearTimeout(displayMatchMessageTimeout);
  hideMatchMessages();
  showMatchMessage(card);
  displayMatchMessageTimeout = setTimeout(() => {
    hideMatchMessages();
  }, 3000);
};

const initTimer = (timerEl) => {
  clearInterval(timerInterval);

  setInterval(() => {
    if (timer <= 0) {
      clearInterval(timerInterval);
      timerEl.innerText = 'Time is up!';
      canClick = false;
    } else {
      timer -= 1;
      timerEl.innerText = `${timer} seconds remaining!`;
    }
  }, 1000);
};

/**
 * OTHER HELPER FUNCTIONS
 * Helper functions for game logic
 */
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
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

/*
** GAMEPLAY LOGIC
**
*/
const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', GAMEBOARD[column][row]);

  const clickedCard = GAMEBOARD[column][row];

  // the user already clicked on this square
  // or canClick is false (timeout for closing cards not up)
  if (cardElement.innerText !== '' || !canClick) {
    return;
  }

  // first turn
  if (firstCard === null && canClick) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      handleMatchMessage(clickedCard);

      // turn this card over
      cardElement.innerText = clickedCard.name;
    } else {
      console.log('NOT a match');
      // prevent user from clicking additional cards
      // while both unmatched cards are showing
      canClick = false;
      cardElement.innerText = clickedCard.name;

      setTimeout(() => {
        // turn both cards back over
        firstCardElement.innerText = '';
        cardElement.innerText = '';
        // set canClick back to true
        canClick = true;
      }, 3000);
    }

    // reset the first card
    firstCard = null;
  }
};

/*
** BUILD BOARD ELEMENTS
**
*/
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

      // set a class for CSS purposes
      square.classList.add('square');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

/*
** MAKE NEW DECK
** Double of each card is added to the deck
*/
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

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

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

/*
** GAME INITIALISATION LOGIC
**
*/
const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    GAMEBOARD.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      GAMEBOARD[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(GAMEBOARD);

  document.body.appendChild(boardEl);

  const timerParagraph = document.createElement('p');
  timerParagraph.innerText = `${timer} seconds remaining!`;
  document.body.insertBefore(timerParagraph, boardEl);
  initTimer(timerParagraph);
};

initGame();
