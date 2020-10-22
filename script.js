/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
const board = [];
let firstCard = null;
const boardSize = 4; // has to be an even number
const winCondition = (boardSize * boardSize) / 2;
let deck;
let score = 0;
let firstSquareClick;
let secondSquareClick;
let abilityToClick = true;
let totalMatched = 0;
let gameMode = 'start';

// Helper function copied
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);
    let suitSymbol;
    let colorType;
    if (suitIndex == 0) {
      suitSymbol = '❤️';
      colorType = 'red';
    } else if (suitIndex == 1) {
      suitSymbol = '◆';
      colorType = 'red';
    } else if (suitIndex == 2) {
      suitSymbol = '♣️';
      colorType = 'black';
    } else {
      suitSymbol = '♠️';
      colorType = 'black';
    }

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

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        display: displayName,
        symbol: suitSymbol,
        color: colorType,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};
// randomIndex for shuffle cards
const getRandomIndex = (size) => Math.floor(Math.random() * size);
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

  // return shuffled deck
  return cards;
};

// Starting instructions
const gameInstructionDiv = document.createElement('div');
gameInstructionDiv.setAttribute('class', 'display');
// Output for Instructions
const gameMessage = (message) => {
  gameInstructionDiv.innerHTML = message;
};

// creating display Message that disappear after 3 seconds
const messageDisplay = (boardElement) => {
  const messageDisplayDiv = document.createElement('div');
  messageDisplayDiv.classList.add('message-display-div, display');
  messageDisplayDiv.innertext = 'Its a match!';
  boardElement.appendChild(messageDisplayDiv);

  // prevent user from having the ability to click
  abilityToClick = false;
  // using setTimeOut() to make message disappear after 3 seconds
  setTimeout(() => {
    boardElement.removeChild(messageDisplayDiv);
    abilityToClick = true;
    // change game message
    gameMessage('Please wait 3 Seconds...<br> Please press another card to match!');
  }, 3000);
};
// No match by user
const noMatch = (firstSquare, secondSquare) => {
  abilityToClick = false;
  setTimeout(() => {
    firstSquare.innerText = '';
    secondSquare.innerText = '';
    abilityToClick = true;
  }, 3000);
};

// Timer display
let timerID = 0;
const countDownEl = document.createElement('text');
countDownEl.setAttribute('class', 'display');
let currentTime = 0;
// countDown function
const countDown = () => {
  currentTime -= 1;
  countDownEl.innerHTML = `Time Remaining: ${currentTime}`;
  console.log(currentTime);
  if (currentTime === 0) {
    clearInterval(timerID);
    // eslint-disable-next-line no-alert
    alert(`Game Over! Your total matched is ${totalMatched}`);
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }
};
// change matched display
const changeMatchedDisplay = (firstSquare, secondSquare) => {
  firstSquare.innerHTML = '✅';
  secondSquare.innerHTML = '✅';
};
// Score display
const scoreMessageDiv = document.createElement('div');
scoreMessageDiv.setAttribute('class', 'display');

// create input box for user to input name
const nameInput = () => {
  // overall div for displaying of name
  const userDisplayDiv = document.createElement('div');
  userDisplayDiv.setAttribute('class', 'display');
  userDisplayDiv.setAttribute('id', 'display');
  // textbox for input
  const inputBox = document.createElement('input');
  // giving the box, attribute and adding placeholder
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('placeholder', 'Please Input Name');
  inputBox.setAttribute('class', 'display');
  // setting id so we can retrieve the value later
  inputBox.setAttribute('id', 'inputUser');
  // creating the submit button
  const submitButton = document.createElement('button');
  submitButton.innerHTML = 'Submit';
  // adding an eventlistner to the submitbutton to retrieve userInput
  submitButton.addEventListener('click', () => {
    const userInput = document.querySelector('#inputUser');
    gameInstructionDiv.innerHTML = `Hey there ${userInput.value}! Please click on a card to begin`;
    inputBox.value = '';
    gameMode = 'play';
    // eslint-disable-next-line no-use-before-define
    gameInit();
    document.body.removeChild(userDisplayDiv);
  });
  // creating the reset button
  const resetButtonEl = document.createElement('button');
  resetButtonEl.setAttribute('class', 'display reset');
  resetButtonEl.innerHTML = 'Reset';
  resetButtonEl.addEventListener('click', () => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  });
  // displaying the inputBox and the submit button on the screen
  userDisplayDiv.appendChild(inputBox);
  userDisplayDiv.appendChild(submitButton);
  document.body.appendChild(userDisplayDiv);
  document.body.appendChild(countDownEl);
  document.body.appendChild(resetButtonEl);
};

const squareClick = (cardElement, column, row, boardElement) => {
  let currentCard = board[column][row];
  console.log(cardElement);
  console.log('FIRST CARD', firstCard);
  console.log('CLICKED CARD', currentCard);
  if (firstCard === null) {
    firstCard = currentCard;
    firstSquareClick = cardElement;
    // turn this card over
    firstSquareClick.innerText = `${firstCard.display}, ${firstCard.symbol}`;
  } else if (currentCard.name === firstCard.name
        && currentCard.suit === firstCard.suit) {
    secondSquareClick = cardElement;
    // turn this card over
    secondSquareClick.innerText = `${currentCard.display},${currentCard.symbol}`;
    console.log('match');
    totalMatched += 1;
    changeMatchedDisplay(firstSquareClick, secondSquareClick);
    firstCard = null;
    if (totalMatched === winCondition) {
      gameMode = 'end';
      abilityToClick = false;

      const winMessage = document.createElement('img');
      winMessage.setAttribute('class', 'win-message');
      winMessage.src = 'https://pics.me.me/ok-fine-you-win-memegenerator-net-ok-fine-you-win-ay-53868343.png';
      document.body.appendChild(winMessage);

      setTimeout(() => {
        document.body.removeChild(winMessage);
        gameMessage('Well done! You win! Hit the reset button or refresh the page to play again');
      }, 5000);
    }
    gameMessage('It\'s a match!');
    messageDisplay(boardElement);
  } else { // not a match
    firstCard = null;
    // turn this card back over
    secondSquareClick = cardElement;
    secondSquareClick.innerText = `${board[column][row].display},${board[column][row].symbol}`;
    gameMessage('Oh no, your cards did not match! Keep trying! Please wait 3 Seconds...');
    noMatch(firstSquareClick, secondSquareClick);
  }
  scoreMessageDiv.innerText = `Total Matched: ${totalMatched}`;
};
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (boardA) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < boardA.length; i += 1) {
    // make a var for just this row of cards
    const row = boardA[i];

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
        if (abilityToClick === true && gameMode === 'play') {
          squareClick(event.currentTarget, i, j, boardElement);
        }
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};
const gameInit = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);
  const boardEl = buildBoardElements(board);
  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
      // call the function to dynamically create the userInput box and submit button
    } }
  if (gameMode == 'start') {
    nameInput();
    gameInstructionDiv.innerText = 'Hello, Please input your name! The game will begin immediately';
    document.body.appendChild(gameInstructionDiv);
  } else if (gameMode == 'play') {
    // Start timer
    currentTime = 180;
    timerID = setInterval(countDown, 1000);
    // display elements
    document.body.appendChild(gameInstructionDiv);
    document.body.appendChild(boardEl);
    document.body.appendChild(scoreMessageDiv);
  } else {
    gameMode = 'end';
  }
};

// Run the program
gameInit();
