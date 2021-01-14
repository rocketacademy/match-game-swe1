// Global declaration
const board = []; // board will be the array of arrays
const gameHeaderElement = document.createElement('h1');
const topMsgContainer = document.createElement('div');
const playerStatsContainer = document.createElement('div');
const scoreElement = document.createElement('div');
const timerElement = document.createElement('div');
const gameMsgElement = document.createElement('div');
const playerNameElement = document.createElement('div');
const btnSubmit = document.createElement('button');
const inputField = document.createElement('input');
const btnReset = document.createElement('button');
const outcomeMsgElement = document.createElement('div');
let firstCard = null;
let firstCardE = null;
let gameMode = 'welcome';
let playerName = '';
let score = 0;
let popUpTimeOut;
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
  clearTimeout(popUpTimeOut);
  outcomeMsgElement.innerText = '';
  outcomeMsgElement.style.opacity = '1';
  outcomeMsgElement.style.fontSize = '100px';
  outcomeMsgElement.innerText = message;
  if (message === 'match!') {
    outcomeMsgElement.style.backgroundColor = 'green';
  } else if (message === 'no match!') {
    outcomeMsgElement.style.backgroundColor = 'orange';
  }
  popUpTimeOut = setTimeout(() => {
    outcomeMsgElement.innerText = '';
    outcomeMsgElement.style.opacity = '0';
  }, 2000);
};

// Function 10: Game Prompt Messages
const updateTopMsgBoard = () => {
  playerNameElement.innerHTML = `<b>Player:</b> ${playerName}`;
  scoreElement.innerHTML = `<b>Score:</b> ${score}`;
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
  } else if (gameMode === 'gameEnd') {
    gameMsgElement.innerHTML = 'Click reset to play again';
  }

  if (score === boardSize * boardSize) {
    gameMode = 'gameWin';
    popUpMessage('You won!');
  }
};

// Function 11: Flash pop up message
const flashPopUpMsg = (message, flashCount) => {
  let timeEndCounter = 0;
  const timeEnd = setInterval(() => {
    console.log(timeEndCounter);
    if (timeEndCounter % 2 === 0) {
      outcomeMsgElement.innerText = '';
      outcomeMsgElement.style.opacity = '0';
    } else {
      console.log('on');
      popUpMessage(message);
    }
    timeEndCounter += 1;
    if (timeEndCounter > flashCount * 2) {
      clearInterval(timeEnd);
    }
  }, 500);
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
  boardElement.innerHTML = '';

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
  gameMode = 'welcome';
  score = 0;
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // Empty board array
  for (let i = 0; i < boardSize; i += 1) {
    board.pop();
  }

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  // Add DOM elements
  document.body.innerHTML = '';
  document.body.appendChild(gameHeaderElement);
  document.body.appendChild(inputField);
  document.body.appendChild(btnSubmit);
  document.body.appendChild(topMsgContainer);
  topMsgContainer.appendChild(playerStatsContainer);
  playerStatsContainer.appendChild(playerNameElement);
  playerStatsContainer.appendChild(scoreElement);
  playerStatsContainer.appendChild(timerElement);
  topMsgContainer.appendChild(gameMsgElement);
  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
  document.body.appendChild(outcomeMsgElement);

  // Add classes to elements
  gameHeaderElement.classList.add('h1');
  topMsgContainer.classList.add('message');
  playerStatsContainer.classList.add('row');
  inputField.classList.add('input');
  btnSubmit.classList.add('button');
  btnReset.classList.add('button');
  gameMsgElement.classList.add('message');
  outcomeMsgElement.classList.add('message');
  outcomeMsgElement.style.opacity = 0;
  gameHeaderElement.innerHTML = '🔥 Match Game 🔥';
  btnSubmit.innerHTML = 'Submit';
  btnReset.innerHTML = 'Reset';

  // Add events to elements
  btnSubmit.addEventListener('click', () => {
    // Clear value and update player name on playerStatsContainer
    playerName = inputField.value;
    inputField.value = '';
    console.log(playerName);
    playerNameElement.innerHTML = playerName;
    // Clear the field and button
    inputField.remove();
    btnSubmit.remove();
    // Set gamemode and update game message
    gameMode = 'choose1stCard';
    updateTopMsgBoard();
    // Set timer
    timerElement.innerHTML = `<b>Timer:</b> ${gameTime}`;
    let counter = (gameTime - 1) * 1000;
    const timer = setInterval(() => {
      timerElement.innerHTML = `<b>Timer:</b> ${counter / 1000}`;
      if (counter <= 0) {
        clearInterval(timer);
        flashPopUpMsg('Game End', 5);
        gameMode = 'gameEnd';
        updateTopMsgBoard();
        // !!! BUG TO FIX: duplicate boardE1
        topMsgContainer.appendChild(btnReset);
        btnReset.addEventListener('click', () => {
          initGame();
          btnReset.remove();
        });
      }
      counter -= 1000;
    }, 1000);
  });

  updateTopMsgBoard();

  // Initial previews
  scoreElement.innerHTML = '';
  timerElement.innerHTML = '';
};

// Create game
initGame();
