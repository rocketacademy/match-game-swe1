// ======Global variables=====================
let outputBox = null;
let firstCardElement = null;

const myOutputValue = 'Welcome! try to find two matching cards in the grid below!';
// =================================
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    // console.log(`current suit: ${currentSuit}`);
    let color = '';
    let suitSymbol = suitIndex;
    if (suitSymbol === 0) {
      suitSymbol = '♥';
      color = 'red';
    } else if (suitSymbol === 1) {
      suitSymbol = '♦';

      color = 'red';
    } else if (suitSymbol === 2) {
      suitSymbol = '♣';
      color = 'black';
    } else if (suitSymbol === 3) {
      suitSymbol = '♠';
      color = 'black';
    }

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      let display = '';
      display = rankCounter;
      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'ace';
        display = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        display = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        display = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        display = 'K';
      }
      // make a single card object variable
      const card = {
        suitSymbol,
        name: cardName,
        display,
        color,
        suit: currentSuit,
        rank: rankCounter,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};
// ============RNG=======================

// get a random index from an array given it's size
const getRandomIndex = (size) => Math.floor(Math.random() * size);

// ======================================

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

// =====================================
const board = [];
let firstCard = null;
const boardSize = 4; // has to be an even number

let deck;

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  // createCard(cardElement);
  // board.column.row.appendChild(createCard);
  // board[column][row].appendChild(createCard);

  const clickedCard = board[column][row];

  console.log('FIRST CARD', firstCard);
  console.log('CLICKED CARD', board[column][row]);

  // if no first card has been selected,
  if (firstCard === null) {
    // assign clicked card data to firstCard variable
    firstCard = board[column][row];
    // assign the clicked card's element to the firstCardElement variable
    firstCardElement = cardElement;
    // turn this card over; set card element's inner text to display the card's name
    cardElement.innerText = firstCard.display;
    outputBox.innerText = 'Choose a second card';
  }
  // if the cards match: if the property 'name' of the clicked card is  the same as the first card's
  else if (board[column][row].display === firstCard.display
  // if the property 'suit' of the clicked card is the same as the first card's
  && board[column][row].suit === firstCard.suit) {
    // turn this card over
    console.log('match');
    // change inner text of cardElement variable to show the 'name' property in firstCard
    cardElement.innerText = firstCard.display;
    outputBox.innerText = 'Match! You win!';
  }
  // if the cards do not match:
  else {
    cardElement.innerText = clickedCard.display;
    setTimeout(() => {
    // clear the data of the first card
      firstCard = null;
      // make the card data disappear from user's view
      firstCardElement.innerText = '';
      cardElement.innerText = '';

      // re-enable clicking
    }, 2000);
    outputBox.innerText = 'No match! :( Try again';
  }
};

// ================================================
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

// ========initialise game================================
const gameInit = () => {
  // /create an outputbox
  outputBox = document.createElement('div');
  outputBox.classList.add('outputBox');
  outputBox.innerText = myOutputValue;

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

  document.body.appendChild(outputBox);
  document.body.appendChild(boardEl);
};

gameInit();
