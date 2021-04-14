// Create deck of cards
const getRandomNumber = (maxValue) => Math.floor(Math.random() * maxValue);

const shuffleCards = (cardArray) => {
  // loop over the entire cards array
  for (
    let currentIndex = 0;
    currentIndex < cardArray.length;
    currentIndex += 1
  ) {
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

// this makeDeck function creates two decks
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  // Array to store the details of the card like Suit, Symbol and Color for respective suit
  const suits = [
    ["hearts", "♥", "red"],
    ["diamonds", "♦", "red"],
    ["clubs", "♣", "black"],
    ["spades", "♠", "black"],
  ];

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
      if (cardName === "1") {
        cardName = "ace";
        displayName = "A";
      } else if (cardName === "11") {
        cardName = "jack";
        displayName = "J";
      } else if (cardName === "12") {
        cardName = "queen";
        displayName = "Q";
      } else if (cardName === "13") {
        cardName = "king";
        displayName = "K";
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

      // add the card to the deck
      newDeck.push(card);
      // Cards are duplicated - for matching cards
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Store player's name
let playerName = "";
const playerNameTag = document.querySelector("input");
const submitNameTag = document.querySelector(".submit-btn");

// Showing different divs
const inputDiv = document.querySelector(".name-div");
const gameControlsDiv = document.querySelector(".game-controls");
// Game controls are set to hidden by default

const startBtnTag = document.querySelector(".start-btn");
const replayBtnTag = document.querySelector(".replay-btn");
const endBtnTag = document.querySelector(".end-btn");

// Display instructions to user
const instructions = document.querySelector("h2.instructions-text");

// before the game starts
let gameStarted = false;

// Initialize game to begin
const initGame = () => {
  // User hasn't keyed in the name yet
  // if gameStarted is false
  if (!gameStarted) {
    gameControlsDiv.style.display = "none";
    boardTag.style.display = "none";
  }
};

// Create random board of cards
const boardSize = 4;
const boardOfCards = [];
const boardTag = document.querySelector("div.board");
let boardElement = null;

// create div to hold the cards
// all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // use the board data structure we passed in to create the correct size board
  for (let indexRow = 0; indexRow < board.length; indexRow += 1) {
    // make a var for just this row of cards
    const row = board[indexRow];

    // make an element for this row of cards
    const divRowElement = document.createElement("div");
    divRowElement.classList.add("row");

    // make all the squares for this row
    for (let indexCol = 0; indexCol < row.length; indexCol += 1) {
      // create the square element
      const divSquareElement = document.createElement("div");

      // set a class for CSS purposes
      divSquareElement.classList.add("square");

      // set the click event
      // eslint-disable-next-line
      divSquareElement.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, indexRow, indexCol);
      });

      divRowElement.appendChild(divSquareElement);
    }
    boardTag.appendChild(divRowElement);
  }
  return boardTag;
};

// Function takes in the card position in the board & card object
const displayCardElement = (cardElement, cardInfo) => {
  const cardRevealDiv = document.createElement("div");
  cardRevealDiv.classList.add("card-reveal");

  // Creating the element for storing the card display name
  // 2 Class names are applicable "name, <color>"
  const divNameElement = document.createElement("div");
  divNameElement.classList.add("card-name", cardInfo.color);
  divNameElement.innerText = cardInfo.display;

  // Creating the element for storing the suit symbol of the card
  // Class = "suit , <color>"
  const divSuitElement = document.createElement("div");
  divSuitElement.classList.add("card-suit", cardInfo.color);
  divSuitElement.innerText = cardInfo.suitSymbol;

  // The parent cardRevealDiv holds both the display name and suit symbol
  cardRevealDiv.appendChild(divNameElement);
  cardRevealDiv.appendChild(divSuitElement);

  // Class name = "card"
  // This element represents a whole single card
  cardElement.innerHTML = "";
  cardElement.appendChild(cardRevealDiv);
  // Card element is returned from this function
  return cardElement;
};

// takes card object and shows that cards have been matched
const changeMatchedCardsDisplay = (firstCardEl, secondCardEl) => {
  const firstCardElName = firstCardEl.name;
  console.log("first card el name is " + firstCardElName);
  const firstCardElSuit = firstCardEl.suit;
  const secondCardElName = secondCardEl.name;
  const secondCardElSuit = secondCardEl.suit;

  firstCardElName.innerHTML = "🎉";
  firstCardElSuit.innerHTML = "🎉";
  secondCardElName.innerHTML = "🎉";
  secondCardElSuit.innerHTML = "🎉";
};

// store card element of the first card
let firstCard = null;
let firstCardElement;

// set a mode so that the user can click on the cards
let canClick = true;

// cardElement ==> currently clicked square element for the card
// When card element is clicked (column & row = location of the card on the board)
const squareClick = (cardElement, column, row) => {
  if (canClick === false) {
    return;
  }

  const currentCard = boardOfCards[column][row];
  // When the first card is not empty,
  if (firstCard !== null) {
    canClick = false;
  }

  // only 2 cards are considered for matching
  if (firstCard === null) {
    // first card is chosen to be the current card
    firstCard = currentCard;
    // turn this card over by displaying the text
    displayCardElement(cardElement, firstCard);
    // cardElement.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;
    instructions.innerHTML = "Pick another card.";
  }
  // Conditions for matching
  else if (
    // any clicked on card
    currentCard.name === firstCard.name &&
    currentCard.suit === firstCard.suit
  ) {
    // turn this card over
    // displayCardElement(cardElement, currentCard);
    changeMatchedCardsDisplay(firstCard, currentCard);
    instructions.innerHTML = "🎉 You found a pair!";
    canClick = true;
    firstCard = null;
  } else {
    // If the 2 selected cards are not matching
    instructions.innerHTML = "Try again 💫";
    /*
    When the user clicks a square for a second time,
    turn the card over and if it doesn't match the first card,
    show it to the user for 3 seconds then turn it back over.
    */
    displayCardElement(cardElement, currentCard);
    cardElement.innerHTML = "";
    firstCard = null;
    // turn this card back over
    firstCardElement.innerHTML = "";
    canClick = true;
  }
};

const startGame = () => {
  gameControlsDiv.style.display = "none";
  boardTag.style.display = "inline-block";

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
  // call the
  boardElement = buildBoardElements(boardOfCards);
  return boardElement;
};

// =========== GAME BEGINS ==========

initGame();

// Store player's name then show game controls
submitNameTag.addEventListener("click", () => {
  // If there is a name
  if (playerNameTag.value) {
    playerName = playerNameTag.value;
    instructions.innerHTML = `Nice to meet you, ${playerName}! <br>Wanna match the card pairs?`;
    inputDiv.style.display = "none";
    gameControlsDiv.style.display = "flex";
    replayBtnTag.style.display = "none";
  } else {
    playerNameTag.placeholder = "Don't forget to tell us your name :( ";
  }
  // Signal that the game has started
  gameStarted = true;
});

// When user starts the game, deal the cards to the grid
startBtnTag.addEventListener("click", () => {
  if (gameStarted) {
    startGame();
  }
});

// When user runs out of time or ends the game, ask to replay the game
endBtnTag.addEventListener("click", () => {
  gameStarted = false;
  boardTag.style.display = "none";
  endBtnTag.style.display = "none";
  startBtnTag.style.display = "none";
  replayBtnTag.style.display = "block";
  instructions.innerHTML = `Sorry to see you go, ${playerName}!`;
});

replayBtnTag.addEventListener("click", () => {
  initGame();
});
