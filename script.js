// Global setup ----------------------------------------------------
const board = [];
let firstCard = null;
const boardSize = 4; // has to be an even number

// to store squareClickElement
let firstClickedSquare;
let secondClickedSquare;

let deck;

const gameInfo = document.createElement('div');

// Helper functions -----------------------------------------------
// output message
const output = (message) => {
  gameInfo.innerHTML = message;
};

// flip over cards that were clicked this round if they do not match
const flipOverSquares = (firstSquare, secondSquare) => {
  setTimeout(() => {
    console.log('turn both cards back over');
    firstSquare.innerText = '';
    secondSquare.innerText = '';
  }, 3000);
};

// flip cards and check for pairs when a square is clicked
const squareClick = (squareClickElement, column, row) => {
  console.log(squareClickElement);
  console.log('FIRST CARD', firstCard);
  console.log('CLICKED CARD', board[column][row]);

  if (firstCard === null) {
    firstCard = board[column][row];
    firstClickedSquare = squareClickElement;

    // turn this card over
    firstClickedSquare.innerText = `${firstCard.display},${firstCard.suitSymbol}`;

    // let player know to click another card
    output('Click on another square to flip over the 2nd card!');
  } else if (board[column][row].name === firstCard.name
  && board[column][row].suit === firstCard.suit) {
    secondClickedSquare = squareClickElement;

    // turn this card over
    secondClickedSquare.innerText = `${board[column][row].display},${board[column][row].suitSymbol}`;
    console.log('match');

    // let player know that it is a match and to pick another card
    output('It is a match! <br> Click on another square to continue!');
  } else {
    // empty first card
    firstCard = null;

    secondClickedSquare = squareClickElement;

    // turn this card over
    secondClickedSquare.innerText = `${board[column][row].display},${board[column][row].suitSymbol}`;

    // let player know that it is not a match and to pick another card
    output('Oops your cards did not match! <br> Click on another square to try again!');

    // turn this card and first card back over
    flipOverSquares(firstClickedSquare, secondClickedSquare);
  }
};

// make deck
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitColors = ['red', 'red', 'black', 'black'];
  const suitSymbols = ['♥', '♦', '♣', '♠'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // make a variable for the current suit color
    const currentSuitColor = suitColors[suitIndex];

    // make a variable for the current suit symbol
    const currentSuitSymbol = suitSymbols[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;
      let displayName = `${rankCounter}`;

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
        suit: currentSuit,
        rank: rankCounter,
        suitSymbol: currentSuitSymbol,
        display: displayName,
        color: currentSuitColor,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// get a random index from an array given it's size
const getRandomIndex = (size) => Math.floor(Math.random() * size);

// shuffle cards
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
    cards[currentIndex] = randomItem; // giving eslint warning bc it is advised
    cards[randomIndex] = currentItem; // not to alter the contents of an input (cards).
  }

  // give back the shuffled deck
  return cards;
};

const buildBoardElements = (currentBoard) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < currentBoard.length; i += 1) {
    // make a var for just this row of cards
    const row = currentBoard[i];

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

// Game initilization -------------------------------------------------
// create all the board elements that will go on the screen
// return the built board
const gameInit = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck(); // must not shuffle this deck bc you want to take out the pairs
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

  // initialize game info div with starting instructions
  gameInfo.innerText = 'Click on a square to flip over a card!';
  document.body.appendChild(gameInfo);
};

// start game
gameInit();
