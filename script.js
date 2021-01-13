// Global declaration
const board = []; // board will be the array of arrays
const messageElement = document.createElement('div');
let firstCard = null;
let firstCardE = null;
const boardSize = 4;

let deck;

// Function 1: Random index from array
const getRandomIndex = (size) => Math.floor(Math.random() * size);

// Function 2: Create Deck
const makeDeck = () => {
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
      newDeck.push(card);
      newDeck.push(card);// add double the cards to the deck
    }
  }

  return newDeck;
};

// Function 3: Shuffle Cards
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

// Function 7: to flip back down cards
const flipDownCards = (card1Element, card2Element) => {
  setTimeout(() => {
    card1Element.innerText = '';
    card2Element.innerText = '';
  }, 3000);
  firstCard = null;
};

// Function 8: to flip up a single card
const flipUpOneCard = (cardObj, cardElement, col, row) => {
  cardObj = board[col][row];
  cardElement.innerText = cardObj.name;
  return cardObj;
};

// Function 9: Pop up message
const popUpMessage = (message) => {
  messageElement.innerText = '';
  messageElement.innerText = message;
  if (message === 'match!') {
    messageElement.style.backgroundColor = 'green';
  } else if (message === 'no match!') {
    messageElement.style.backgroundColor = 'orange';
  }
  setTimeout(() => {
    messageElement.innerText = '';
  }, 2000);
};

// Function 4: when square clicked, check if cards match
const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  console.log(`column: ${column}`);
  console.log(`row: ${row}`);
  console.log(`FIRST CARD: ${firstCard}`);
  console.log(`CLICKED CARD: ${board[column][row]}`);
  const secondCard = null;
  // if first card
  if (firstCard === null) {
    firstCard = flipUpOneCard(firstCard, cardElement, column, row);

    // firstCard = board[column][row];
    // // turn this card over
    // cardElement.innerText = firstCard.name;
    firstCardE = cardElement;
  // if card name and suit matches
  } else if (board[column][row].name === firstCard.name) {
    flipUpOneCard(secondCard, cardElement, column, row);
    console.log('match');
    // turn both cards back over
    popUpMessage('match!');
    flipDownCards(firstCardE, cardElement);
  } else {
    flipUpOneCard(secondCard, cardElement, column, row);
    console.log('2nd card no match');
    popUpMessage('no match!');
    // turn both cards back over
    flipDownCards(firstCardE, cardElement);
  }
};

// Function 5: Build the board elements
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

// Function 6: Set up the game
const initGame = () => {
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

  document.body.appendChild(boardEl);

  // Add message element
  messageElement.classList.add('message');
  document.body.appendChild(messageElement);
};

// Create game
initGame();
