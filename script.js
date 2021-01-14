// Please implement exercise logic here

// declare global variables
const board = [];
let firstCard = null;
const secondCard = null;
let firstCardElement = null;
const secondCardElement = null;
const boardSize = 4; // has to be an even number
let cardInfo;

let deck;

//
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

// function that executes when a card is clicked
const squareClick = (cardElement, column, row) => {
  if (firstCard === null) {
    firstCard = board[column][row];
    console.log('first card turned over');
    firstCardElement = cardElement;
    // turn this card over
    cardElement.innerText = firstCard.name;
  } else if (
    board[column][row].name === firstCard.name
    && board[column][row].suit === firstCard.suit
  ) {
    // turn this card over
    console.log('match');
    cardElement.innerText = board[column][row].name;
  } else {
    firstCard = null;
    console.log('no match');
    firstCardElement.innerText = '';
    firstCardElement = null;
    // turn this card back over
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
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }
  return boardElement;
};

const initGame = () => {
  // using the deck we made before, with double the number of cards
  const doubleDeck = makeDeck();
  // getting the number of cards needed to make up the board i.e 4 * 4
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

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
};

initGame();
