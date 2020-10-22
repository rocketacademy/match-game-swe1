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
        matched: false,
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
const delayForGameStatusInMilliSeconds = 3 * 1000;
const delayForSpecialMessage = 5 * 1000;
const intervalSingleSecond = 1000;
const intervalInMinutes = 1;
const intervalInSeconds = intervalInMinutes * 60;
const intervalInMilliSeconds = 1000 * intervalInSeconds; // 180000 = 3 minutes
let countDownTime = intervalInMilliSeconds;
// Store the cardElement of the first card.
// Used to turn it over, in case a match is not founded.
let firstCardElement = null;
let boardElement = null;
let gameStarted = false;
// this variable stores the sliced card deck as per the board size
let deck;
// To store the reference to interval function to start the game
const intervalReference = null;
// To store the reference to the timeout function
let timeoutIntervalReference = null;
// To store the name
let playerName = '';
// // Score variable
let gameTotalScore = 0;
let gameAttempts = 0;

// A div element to display information on Game status when necessary
const divGameStatusInfo = document.createElement('div');
// Input element for entering the player name
const inputPlayerName = document.createElement('input');
// Button to submit the name
const inputNameSubmitButton = document.createElement('button');
// Refresh button
const resetButton = document.createElement('button');
// element for displaying countdown timer
const divTimer = document.createElement('div');
// create a p element for displaying time
const paraTimerElement = document.createElement('p');

// create a helper function for setting the information on game
const setGameStatusInfo = (message) => {
  divGameStatusInfo.innerText = message;
};

const setTimerMessage = (message) => { paraTimerElement.innerText = message; };

const convertMillisecondsToSeconds = (milliseconds) => ((milliseconds / 1000));

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
  firstCardEl.innerHTML = '🎉</br>✨<br/>🎊';
  secondCardEl.innerHTML = '🎉</br>✨<br/>🎊';
};

// This function marks the 2 cards as matched cards,
// so that no further click is allowed at the same cards again
const setMatchedCards = (secondCard) => {
  firstCard.matched = true;
  secondCard.matched = true;
};

const doesPlayerWin = () => (gameTotalScore === ((boardSize * boardSize) / 2));

let canClick = true;
// This function handles the click on each square element corresponding to the
// card in the board
// cardElement ==> currently clicked square element for the card
// row and column => location at which that card is placed in the board
const squareCardClick = (cardElement, column, row) => {
  setGameStatusInfo('');
  if (canClick === false)
  {
    return;
  }
  // Whenever a second click is made, it is counted as an attempt
  gameAttempts = (firstCard !== null) ? 1 : gameAttempts;

  const currentCard = boardOfCards[column][row];
  if (currentCard.matched)
  {
    setGameStatusInfo('Please select another card. This card is already matched.');
    return;
  }

  // console.log(cardElement);
  // console.log('FIRST CARD', firstCard);
  // console.log('CLICKED CARD', currentCard);

  // both first and second cards are selected
  if (firstCard !== null)
  {
    canClick = false;
  }

  // Only 2 cards will be considered for matching.
  if (firstCard === null) {
    // First card is chosen to be the first selected of the current round
    firstCard = currentCard;
    // turn this card over
    displayCardElement(cardElement, firstCard);
    firstCardElement = cardElement;
  }
  // Condition for matching
  else if (currentCard.name === firstCard.name
    && currentCard.suit === firstCard.suit) {
    // turn this card over
    displayCardElement(cardElement, currentCard);

    changeMatchedCardsDisplay(firstCardElement, cardElement);
    setMatchedCards(currentCard);
    firstCard = null;

    // when a match is found, score is increased
    gameTotalScore += 1;
    // When the user matches a card, show a message for the specific time, then make it disappear.
    console.log(`Game Score: ${gameTotalScore}`);
    let delayTime = delayForGameStatusInMilliSeconds;
    if (doesPlayerWin())
    {
      console.log('Maximum score got');
      // When the user matches all the cards, show a special message on screen for 5 seconds.
      setGameStatusInfo(`Great ${playerName}!!!
      You found all the matches.
      Please reset the game for a new set of cards.`);
      delayTime = delayForSpecialMessage;
    }
    else
    {
      setGameStatusInfo(`You found a match. Current Score: ${gameTotalScore}.
                         Please continue after this message disappears`);
    }

    // Disappearing the messahge
    setTimeout(() => {
      canClick = true;
      setGameStatusInfo('');
    }, delayTime);
  }
  else {
    // If the 2 selected cards are not matching, reset the firstCard
    // setGameStatusInfo('Not a match.');
    setGameStatusInfo(`Not a match.
    Please wait for this message to disappear before pressing another card. `);

    /*
    When the user clicks a square for a second time,
    turn the card over and if it doesn't match the first card,
    show it to the user for 3 seconds then turn it back over.
    */
    displayCardElement(cardElement, currentCard);

    setTimeout(() => {
      cardElement.innerHTML = '';
      firstCard = null;
      // turn this card back over
      firstCardElement.innerHTML = '';
      canClick = true;
      setGameStatusInfo('');
    }, delayForGameStatusInMilliSeconds);
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
  console.log('resetElements');
  if (timeoutIntervalReference !== null)
  {
    clearInterval(timeoutIntervalReference);
  }
  console.log(`Before: ${boardOfCards}`);
  boardOfCards.length = 0;
  console.log(`After: ${boardOfCards}`);
  if (boardElement !== null)
  {
    boardElement.innerHTML = '';
  }
  divGameStatusInfo.innerHTML = '';
  // setTimerMessage('');
  gameTotalScore = 0;
  gameAttempts = 0;
  gameStarted = false;
};

// This function performs all other intializations of the game
const startGame = () => {
  console.log('Start Game');
  // If the game is already started
  if (gameStarted)
  {
    // For handling the second automatic start, before the intervelled call to the game happens
    // from the function onClickStartButton
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
};

// Function to display the player Name
const displayPlayerName = () => {
  playerName = inputPlayerName.value;
  setGameStatusInfo(`Hey ${playerName}, You can start playing.`);
};

const playGameWithTimer = () => {
  if (playerName === '')
  {
    setGameStatusInfo('Please enter your name to start playing.');
    return;
  }
  countDownTime = intervalInMilliSeconds * 5;
  setTimerMessage(`Time remaining: ${convertMillisecondsToSeconds(countDownTime)} seconds.`);
  startGame();

  timeoutIntervalReference = setInterval(() => {
    countDownTime -= intervalSingleSecond; // decrease the counter by interval time for the timer
    setTimerMessage(`Time remaining: ${convertMillisecondsToSeconds(countDownTime)} seconds.`);
    const playerWin = doesPlayerWin();
    if (playerWin || countDownTime <= 0) // If the counter reaches zero, restart the game
    {
      if (playerWin)
      {
        setTimerMessage(`${playerName} wins. Please press Start if you would like to play more.`);
        countDownTime = 0;
      }
      else { setTimerMessage(`${playerName} lost. Time over. Stopping the game.`); }
      resetElements();
      clearInterval(timeoutIntervalReference);
    }
  }, intervalSingleSecond);
};

// Function that starts the game. Here it resets the board of cards
// Also it sets an interval to restart the game after a specific amount of time
const onClickStartButton = () => {
  console.log('onClickStart');
  // startGame();
  // intervalReference = setInterval(startGame, intervalInMilliSeconds);

  playGameWithTimer();
};

// Function to stop the resetting of the game after an interval
const onClickStopButton = () => {
  clearInterval(intervalReference);
  resetElements();
};

const gameInit = () => {
  // Section to handle the inputs received from user any
  const divInputNameElements = document.createElement('div');
  //   divInputNameElements.classList.add('common-margin');
  inputPlayerName.setAttribute('type', 'text');
  inputPlayerName.required = true;
  inputPlayerName.setAttribute('placeholder', 'Enter your name.');
  inputPlayerName.classList.add('common-margin');
  divInputNameElements.appendChild(inputPlayerName);

  inputNameSubmitButton.innerText = 'Submit Name';
  inputNameSubmitButton.classList.add('common-margin');
  inputNameSubmitButton.addEventListener('click', displayPlayerName);
  divInputNameElements.appendChild(inputNameSubmitButton);

  // Section that holds the reset button
  const divResetEl = document.createElement('div');
  divResetEl.classList.add('common-margin');
  resetButton.innerText = 'Reset Game';
  resetButton.addEventListener('click', resetElements);
  divResetEl.appendChild(resetButton);

  // Create a button for starting the game.
  const divStartEl = document.createElement('div');
  // divStartEl.classList.add('common-margin');
  const startButton = document.createElement('button');
  startButton.innerText = 'Start Game';
  startButton.classList.add('common-margin');
  startButton.addEventListener('click', onClickStartButton);
  divStartEl.appendChild(startButton);

  // For the time being there is no need of Start and Stop button
  // as timer is being introduced.
  // const stopButton = document.createElement('button');
  // stopButton.innerText = 'Stop Timer';
  // stopButton.classList.add('common-margin');
  // stopButton.addEventListener('click', onClickStopButton);
  // divStartEl.appendChild(stopButton);

  divTimer.classList.add('common-margin');
  divTimer.appendChild(paraTimerElement);

  document.body.appendChild(divInputNameElements);
  document.body.appendChild(divResetEl);
  document.body.appendChild(divStartEl);
  document.body.appendChild(divTimer);

  // Add a class to game status
  divGameStatusInfo.classList.add('status');
  // Adding game info container to document.
  document.body.appendChild(divGameStatusInfo);

  playGameWithTimer();
};

gameInit();
