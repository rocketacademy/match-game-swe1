// Card Match Game V2

/* The user turns cards over one at a time to find
the matching pair of two identical cards. */

// Global Variables
const board = [];
const boardSize = 4; // Has to be an even number.
let firstCard = null; // Will be assigned a Card object.
let firstCardElement = null; // Will be assigned a <div> tag element representing card.
let deck;

const outputMatchMsg = () => {
  const outputDiv = document.createElement('div');
  outputDiv.classList.add('output-msg');
  outputDiv.innerHTML = ' 🎉  GREAT YOU FOUND MATCHING CARDS!  🎉 ';

  return outputDiv;
};

const openCloseCards = (previousCard, currentCard, clickedCard, matchCond = false) => {
  // Open cards
  setTimeout(() => {
    currentCard.innerText = clickedCard.name;
  }, 50);

  // Turn over cards if match condition is false.
  if (matchCond === false) {
    setTimeout(() => {
      previousCard.innerText = ''; // previousCard is a HTML element, Creates an "innerText" key for the firstCard Object
      currentCard.innerText = '';
    }, 900);
  } else {
    // If true, leave cards open & change color.
    firstCard.innerText = previousCard.name; // Eg. of firstCard: {name: "5", suit: "hearts", rank: 5, innerText: undefined}
    currentCard.innerText = clickedCard.name; // Eg. of currentCard: <div class="square">5</div>

    console.log('firstCard', firstCard);
    console.log('currentCard', currentCard);
    console.log('previousCard', previousCard);

    // Change the colors permantly when guessed correctly
    previousCard.className = 'cards-match'; // Eg. of previousCard: <div class="square">5</div>
    currentCard.className = 'cards-match';

    // Output match message
    const output = outputMatchMsg();
    document.body.appendChild(output);

    setTimeout(() => {
      output.innerText = '';
    }, 3000);
  }

  // Reset 1st card to null; When we call squareClick(), it will use its 1st condition (if applic.);
  firstCard = null;
};

// Callback function that will be attached to each Square of the Board.
const squareClick = (cardElement, column, row) => {
  const clickedCard = board[column][row]; // This is a Card object.

  console.log('FIRST CARD: ', firstCard);
  console.log('CLEEKED Card', clickedCard);
  console.log('--------------');

  // Set up first card (& resets every 2 clicks).
  if (firstCard === null) {
    firstCard = clickedCard;
    cardElement.innerText = firstCard.name; // Example of cardElement: <div class="square">5</div>
    firstCardElement = cardElement;
  // If the cards match
  } else if (firstCard.name === clickedCard.name) {
    console.log('CARDS MATCH!');
    console.log('--------------');
    // true condition set to leave matched cards open.
    openCloseCards(firstCardElement, cardElement, clickedCard, true);
  } else {
    console.log('CARDS N0 MATCH!');
    console.log('--------------');
    openCloseCards(firstCardElement, cardElement, clickedCard);
  }
};

// Create all board elements (with CSS) that will go on the screen (this is called in initGame())
const buildBoardElements = (populatedBoard) => {
  // Create <div> element where everything will be stored
  const boardElement = document.createElement('div');
  boardElement.classList.add('main-board'); // Applied Brown shade to it

  // Use board data structure we passed in to create correct size board
  for (let i = 0; i < populatedBoard.length; i += 1) {
    // Create a row of cards
    const row = populatedBoard[i];

    // Create a <div> element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row'); // Added a green shade to differentiate

    // Make all the squares for each row
    for (let j = 0; j < row.length; j += 1) {
      // Create square element
      const squareCard = document.createElement('div');
      squareCard.classList.add('square');

      // Add click event to every squareCard element.
      squareCard.addEventListener('click', (event) => {
        // Whatever card selected, apply squareClick() function to it.
        const cardElement = event.currentTarget; // Example output: <div class="square">5</div>
        // squareClick()
        squareClick(cardElement, i, j);
      });
      // Render each squareCard element to the DOM.
      rowElement.appendChild(squareCard);
    }
    // Render whole board along with each row to DOM.
    boardElement.appendChild(rowElement);
  }
  return boardElement;
};

const getRandomIndex = (arraySize) => Math.floor(Math.random() * arraySize);

const shuffleCards = (cards) => {
  // Loop over all the cards
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random position in the deck
    const randomIndex = getRandomIndex(cards.length);

    // Create variable for random & current card
    const currentItem = cards[currentIndex];
    const randomItem = cards[randomIndex];

    // Swap current card with random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;
  }
  // Return the shuffled deck of cards
  return cards;
};

// Produce an array of 104x Card objects for Match Game.
const makeDeck = () => {
  // Create deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit (rank 1-13)
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

      // Make a single Card object variable.
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // Add the same card 2x to the deck.
      newDeck.push(card);
      newDeck.push(card);
    }
  }
  return newDeck;
};

// Initialise Game
const initGame = () => {
  // Create a 104-card deck (2x decks combined, i.e. 52 + 52).
  const doubleDeck = makeDeck();

  // Extract a subset of cards according to the boardSize (squared).
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize);

  // Shuffle this extracted subset of cards (containing duplicates).
  deck = shuffleCards(deckSubset);

  // Deal cards out to the Board data structure.
  for (let i = 0; i < boardSize; i += 1) {
    // Create 4x empty arrays for card Object to be stored.
    board.push([]);
    // For each empty array (ROW), push 4x Card objects to each ROW.
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  // Render the 4x4 grid of cards populated in the double for-loop to the DOM.
  const boardEle = buildBoardElements(board);
  document.body.appendChild(boardEle);
};

initGame();
