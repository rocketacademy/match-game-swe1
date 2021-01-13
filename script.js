// Global declaration
const board = []; // board will be the array of arrays
const topMsgContainer = document.createElement('div');
const gameMsgElement = document.createElement('div');
const playerNameElement = document.createElement('div');
const btnSubmit = document.createElement('button');
const inputField = document.createElement('input');
const outcomeMsgElement = document.createElement('div');
let firstCard = null;
let firstCardE = null;
let gameMode = 'welcome';
let playerName = '';
let score = 0;
const boardSize = 4;
const gameTime = 4;
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
  }, 2000);
  firstCard = null;
  firstCardE = null;
};

// Function 8: to flip up a single card
const flipUpOneCard = (cardObj, cardElement, col, row) => {
  cardObj = board[col][row];
  cardElement.innerText = cardObj.name;
  return cardObj;
};

// Function 9: Pop up message
const popUpMessage = (message) => {
  outcomeMsgElement.innerText = '';
  outcomeMsgElement.style.opacity = '1';
  outcomeMsgElement.style.fontSize = '100px';
  outcomeMsgElement.innerText = message;
  if (message === 'match!') {
    outcomeMsgElement.style.backgroundColor = 'green';
  } else if (message === 'no match!') {
    outcomeMsgElement.style.backgroundColor = 'orange';
  }
  setTimeout(() => {
    outcomeMsgElement.innerText = '';
    outcomeMsgElement.style.opacity = '0';
  }, 2000);
};

// Function 10: Game Prompt Messages
const updateTopMsgBoard = () => {
  playerNameElement.innerHTML = `${playerName} </br> Score: ${score}`;
  gameMsgElement.innerHTML = '';

  if (gameMode === 'choose1stCard') {
    gameMsgElement.innerHTML = 'Choose your first card!';
  } else if (gameMode === 'choose2ndCard') {
    gameMsgElement.innerHTML = 'Choose your second card!';
  } else if (gameMode === 'gameWin') {
    gameMsgElement.innerHTML = 'Congratulations!';
  } else if (gameMode === 'welcome') {
    gameMsgElement.innerHTML = 'Submit your name to start!';
    playerNameElement.innerHTML = '';
  }

  if (score == boardSize * boardSize) {
    gameMode = 'gameWin';
    popUpMessage('You won!');
  }
};

// Function 4: when square clicked, check if cards match
const squareClick = (cardElement, column, row) => {
  console.log(`column: ${column}`);
  console.log(`row: ${row}`);

  const secondCard = null;
  // if first card
  if (firstCard === null) {
    firstCard = flipUpOneCard(firstCard, cardElement, column, row);
    gameMode = 'choose2ndCard';
    updateTopMsgBoard();
    firstCardE = cardElement;
    //
    // 2nd card: if card names match
  } else if (board[column][row].name === firstCard.name) {
    flipUpOneCard(secondCard, cardElement, column, row);
    firstCardE.style.backgroundColor = 'green';
    cardElement.style.backgroundColor = 'green';
    popUpMessage('match!');
    score += 2;
    gameMode = 'choose1stCard';
    updateTopMsgBoard();
    firstCard = null;
    // flipDownCards(firstCardE, cardElement);
    //
    // 2nd card: if card names do not match
  } else {
    flipUpOneCard(secondCard, cardElement, column, row);
    popUpMessage('no match!');
    gameMode = 'choose1stCard';
    updateTopMsgBoard();
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
  score = 0;
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
  // Add DOM elements
  document.body.appendChild(inputField);
  document.body.appendChild(btnSubmit);
  document.body.appendChild(topMsgContainer);
  topMsgContainer.appendChild(playerNameElement);
  topMsgContainer.appendChild(gameMsgElement);
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
  document.body.appendChild(outcomeMsgElement);

  // Add classes to elements
  topMsgContainer.classList.add('message');
  inputField.classList.add('input');
  btnSubmit.classList.add('button');
  gameMsgElement.classList.add('message');
  outcomeMsgElement.classList.add('message');
  outcomeMsgElement.style.opacity = 0;
  btnSubmit.innerHTML = 'Submit';

  // Add events to elements
  btnSubmit.addEventListener('click', () => {
    playerName = inputField.value;
    inputField.value = '';
    console.log(playerName);
    playerNameElement.innerHTML = playerName;
    inputField.remove();
    btnSubmit.remove();
    gameMode = 'choose1stCard';
    updateTopMsgBoard();
  });

  updateTopMsgBoard();
};

// Create game
initGame();
// popUpMessage('GAME START');
// setTimeout(() => {
//   popUpMessage('GAME END');
// }, gameTime * 1000);
