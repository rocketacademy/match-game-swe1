// Global elements
// Get a random number, given a maximum value
const getRandomNumber = (maxValue) => Math.floor(Math.random() * maxValue);

// Function to shuffle a set of cards
const shuffleCards = (cardArray) => {
  // loop over the entire cards array
  for (let currentIndex = 0; currentIndex < cardArray.length; currentIndex += 1) {
    // select a random position from the deck
    const randomIndex = getRandomNumber(cardArray.length);
    // get the current card in the loop
    const currentItem = cardArray[currentIndex];
    // get the random card
    const randomItem = cardArray[randomIndex];
    // swap the current card and the random card
    cardArray[currentIndex] = randomItem;
    cardArray[randomIndex] = currentItem;
  }
  // give back the shuffled deck
  return cardArray;
};

// Function to create a deck of cards
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  // Array to store the details of the card like Suit, Symbol and Color for respective suit
  const suits = [['hearts', '♥', 'red'], ['diamonds', '♦', 'red'],
    ['clubs', '♣', 'black'], ['spades', '♠', 'black']];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex][0];
    const currentSuitSymbol = suits[suitIndex][1];
    const currentCardColor = suits[suitIndex][2];
    // console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      let displayName = cardName;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
        displayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        displayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        displayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        displayName = 'K';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        display: displayName,
        suit: currentSuit,
        suitSymbol: currentSuitSymbol,
        rank: rankCounter,
        color: currentCardColor,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card);
      // Cards are duplicated - for matching cards
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Used to store all the cards of desired size in a 2D manner
const boardOfCards = [];
let firstCard = null;
const boardSize = 4; // has to be an even number
const delayInMilliSeconds = 3 * 1000;
const intervalInMilliSeconds = 1000 * 60 * 3; // 180000
// Store the cardElement of the first card.
// Used to turn it over, in case a match is not founded.
let firstCardElement = null;
let boardElement = null;
let gameStarted = false;
// this variable stores the sliced card deck as per the board size
let deck;
// A div element to display information on Game status when necessary
const divGameStatusInfo = document.createElement('div');

// create a helper function for setting the information on game
const setGameStatusInfo = (message) => {
  divGameStatusInfo.innerText = message;
};

// Game Play

// Function to display the card details in the respective card element
const displayCardElement = (cardElement, cardInfo) => {
  // Creating the element for storing the card display name
  // 2 Class names are applicable "name, <color>"
  const divNameElement = document.createElement('div');
  divNameElement.classList.add('name', cardInfo.color);
  divNameElement.innerText = cardInfo.display;

  // Creating the element for storing the suit symbol of the card
  // Class = "suit"
  const divSuitElement = document.createElement('div');
  divSuitElement.classList.add('suit', cardInfo.color);
  divSuitElement.innerText = cardInfo.suitSymbol;

  // The parent element that holds both the display name and suit symbol
  // This element represents a whole single card
  // Class name = "card"
  cardElement.innerHTML = '';
  cardElement.appendChild(divNameElement);
  cardElement.appendChild(divSuitElement);
  // Card element is returned from this function
  return cardElement;
};

const changeMatchedCardsDisplay = (firstCardEl, secondCardEl) => {
  firstCardEl.innerHTML = '🎉</br>✨';
  secondCardEl.innerHTML = '🎉</br>✨';
};

// This function handles the click on each square element corresponding to the
// card in the board
// cardElement ==> currently clicked square element for the card
// row and column => location at which that card is placed in the board
const squareCardClick = (cardElement, column, row) => {
  const currentCard = boardOfCards[column][row];

  console.log(cardElement);
  console.log('FIRST CARD', firstCard);
  console.log('CLICKED CARD', currentCard);

  // Only 2 cards will be considered for matching.
  if (firstCard === null) {
    // First card is chosen to be the first selected of the current round
    firstCard = currentCard;
    // turn this card over
    displayCardElement(cardElement, firstCard);
    firstCardElement = cardElement;
  }
  else if (currentCard.name === firstCard.name
    && currentCard.suit === firstCard.suit) {
    // turn this card over
    displayCardElement(cardElement, currentCard);
    console.log('match');
    setGameStatusInfo('You found a match');
    changeMatchedCardsDisplay(firstCardElement, cardElement);
    firstCard = null;
    // When the user matches a card, show a match message for 3 seconds, then make it disappear.
    setTimeout(() => {
      setGameStatusInfo('');
    }, delayInMilliSeconds);
  }
  else {
    // If the 2 selected cards are not matching, reset the firstCard
    // setGameStatusInfo('Not a match.');
    setGameStatusInfo(`Not a match. Please wait for ${(delayInMilliSeconds / 1000)} seconds before pressing another card. `);
    /*
    When the user clicks a square for a second time,
    turn the card over and if it doesn't match the first card,
    show it to the user for 3 seconds then turn it back over.
    */
    displayCardElement(cardElement, currentCard);

    // TO DO: How to control the user from clicking other card squares before finishin the timer
    setTimeout(() => {
      cardElement.innerHTML = '';
      firstCard = null;
      // turn this card back over
      firstCardElement.innerHTML = '';
      setGameStatusInfo('');
    }, delayInMilliSeconds);
  }
};

// Initialization
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const divBoardElement = document.createElement('div');
  // give it a class for CSS purposes
  divBoardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let indexRow = 0; indexRow < board.length; indexRow += 1) {
    // make a var for just this row of cards
    const row = board[indexRow];
    // make an element for this row of cards
    const divRowElement = document.createElement('div');
    divRowElement.classList.add('row');

    // make all the squares for this row
    for (let indexCol = 0; indexCol < row.length; indexCol += 1) {
      // create the square element - square represents the column in the row
      const divSquareElement = document.createElement('div');
      // set a class for CSS purposes
      divSquareElement.classList.add('square');

      // set the click event
      // eslint-disable-next-line
        divSquareElement.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareCardClick(event.currentTarget, indexRow, indexCol);
      });

      divRowElement.appendChild(divSquareElement);
    }
    divBoardElement.appendChild(divRowElement);
  }
  return divBoardElement;
};

const resetElements = () => {
  boardOfCards.length = 0;
  boardElement.innerHTML = '';
  divGameStatusInfo.innerHTML = '';
};

// This function performs all other intializations of the game
const startGame = () => {
  console.log('Start Game');
  if (gameStarted)
  {
    resetElements();
  }
  gameStarted = true;
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    boardOfCards.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      boardOfCards[i].push(deck.pop());
    }
  }
  boardElement = buildBoardElements(boardOfCards);
  document.body.appendChild(boardElement);

  // Add a class to game status
  divGameStatusInfo.classList.add('status');
  // Adding game info container to document.
  document.body.appendChild(divGameStatusInfo);
};

// Also it sets an interval for the game to end
let intervalReference = null;
const onClickStartButton = () => {
  console.log('onClickStart');
  startGame();
  intervalReference = setInterval(startGame, intervalInMilliSeconds);
};

const onClickStopButton = () => {
  clearInterval(intervalReference);
  resetElements();
};

const gameInit = () => {
  // Create a button for starting the game.
  const divStartEl = document.createElement('div');
  const startButton = document.createElement('button');
  startButton.innerText = 'Start Game';
  startButton.addEventListener('click', onClickStartButton);
  divStartEl.appendChild(startButton);

  const stopButton = document.createElement('button');
  stopButton.innerText = 'Stop Game';
  stopButton.addEventListener('click', onClickStopButton);
  divStartEl.appendChild(stopButton);

  document.body.appendChild(divStartEl);
};

gameInit();
