// //Globals
// const board = [];
// let firstCard = null;
// let firstCardElement = null;
// const boardSize = 4; // has to be an even number
// let deck;
// let match = 0
// //global variables for banner
// let bannerElement = document.createElement('div')
// bannerElement.classList.add('banner')


// const squareClick = (cardElement, column, row) => {
//   // return nothing if player clicks on a card that is already open
//   if (cardElement.innerText === board[column][row].name){
//     return;
//   }  else if (firstCard === null) {
//     firstCard = board[column][row];
//     firstCardElement = cardElement;
//     // turn this card over
//     cardElement.innerText = firstCard.name;
//   } 
//   else if (
//     board[column][row].name === firstCard.name &&
//     board[column][row].suit === firstCard.suit
//   ) {
//     // turn this card over
//     match += 1
//     console.log(match)
//     console.log('match');
//     cardElement.innerText = board[column][row].name;
//     firstCardElement.innerText = firstCard.name
//     firstCard = null
//     banner("MATCH!",1000)

//     if (match == boardSize * 2){
//       banner("You have won the game!",10000)
//   }
//   } else {
//     cardElement.innerText = board[column][row].name
//     firstCard = null;
//     console.log('no match')
//     // turning both the first and second card back over
//     banner('No Match!',1000)
//     setTimeout(() => {
//       cardElement.innerText = ''
//       firstCardElement.innerText = ''
//     // turn this card back over
//   }, 1000)
    
// };
// };


// // banner function
// const banner = (message, duration) => {
//   bannerElement.innerText = message
//   document.body.appendChild(bannerElement)
//   setTimeout(()=>{
//     bannerElement.innerText = ''
//   }, duration)
// }
  

// // create all the board elements that will go on the screen
// // return the built board
// const buildBoardElements = (board) => {
//   // create the element that everything will go inside of
//   const boardElement = document.createElement('div');

//   // give it a class for CSS purposes
//   boardElement.classList.add('board');

//   // use the board data structure we passed in to create the correct size board
//   for (let i = 0; i < board.length; i += 1) {
//     // make a var for just this row of cards
//     const row = board[i];

//     // make an element for this row of cards
//     const rowElement = document.createElement('div');
//     rowElement.classList.add('row');

//     // make all the squares for this row
//     for (let j = 0; j < row.length; j += 1) {
//       // create the square element
//       const square = document.createElement('div');

//       // set a class for CSS purposes
//       square.classList.add('square');

//       // set the click event
//       // eslint-disable-next-line
//       square.addEventListener('click', (event) => {
//         // we will want to pass in the card element so
//         // that we can change how it looks on screen, i.e.,
//         // "turn the card over"
//         // console.log(event)
//         squareClick(event.currentTarget, i, j);
//         // console.log(event.currentTarget)
//       });

//       rowElement.appendChild(square);
//     }
//     boardElement.appendChild(rowElement);
//   }

//   return boardElement;
// };

// // get a random index from an array given it's size
// const getRandomIndex = (size) => Math.floor(Math.random() * size);

// // cards is an array of card objects
// const shuffleCards = (cards) => {
//   // loop over the entire cards array
//   for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
//     // select a random position from the deck
//     const randomIndex = getRandomIndex(cards.length);

//     // get the current card in the loop
//     const currentItem = cards[currentIndex];

//     // get the random card
//     const randomItem = cards[randomIndex];

//     // swap the current card and the random card
//     cards[currentIndex] = randomItem;
//     cards[randomIndex] = currentItem;
//   }

//   // give back the shuffled deck
//   return cards;
// };

// const makeDeck = (cardAmount) => {
//   // create the empty deck at the beginning
//   const newDeck = [];
//   const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

//   for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
//     // make a variable of the current suit
//     const currentSuit = suits[suitIndex];
//     console.log(`current suit: ${currentSuit}`);

//     // loop to create all cards in this suit
//     // rank 1-13
//     for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
//       // Convert rankCounter to string
//       let cardName = `${rankCounter}`;

//       // 1, 11, 12 ,13
//       if (cardName === '1') {
//         cardName = 'ace';
//       } else if (cardName === '11') {
//         cardName = 'jack';
//       } else if (cardName === '12') {
//         cardName = 'queen';
//       } else if (cardName === '13') {
//         cardName = 'king';
//       }

//       // make a single card object variable
//       const card = {
//         name: cardName,
//         suit: currentSuit,
//         rank: rankCounter,
//       };

//       console.log(`rank: ${rankCounter}`);

//       // add the card to the deck
//       newDeck.push(card); // add double the cards to the deck
//       newDeck.push(card);
//     }
//   }

//   return newDeck;
// };

// const initGame = () => {
//   // create this special deck by getting the doubled cards and
//   // making a smaller array that is ( boardSize squared ) number of cards
//   let doubleDeck = makeDeck();
//   let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
//   deck = shuffleCards(deckSubset);

//   // deal the cards out to the board data structure
//   for (let i = 0; i < boardSize; i += 1) {
//     board.push([]);
//     for (let j = 0; j < boardSize; j += 1) {
//       board[i].push(deck.pop());
//     }
//   }
  
//   const boardEl = buildBoardElements(board);

//   document.body.appendChild(boardEl);
//   banner("Start the game by clicking on a sqaure!")
// };

// initGame()

let milliseconds = 0;
const delayInMilliseconds = 1;
let output = document.createElement('div');
output.innerText = milliseconds;
document.body.appendChild(output);

const ref = setInterval(() => {
  output.innerText = milliseconds;

  if (milliseconds == 5000) {
    clearInterval(ref);
  }

  milliseconds += 1;
}, delayInMilliseconds);