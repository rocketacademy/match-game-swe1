// Global Variables
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

// Flip Card Function
const flipCard = (squareContainer, squareInner) => {
  squareContainer.classList.add("clicked");
  squareInner.classList.add("clicked");
  setTimeout(() => {
    squareContainer.classList.remove("clicked");
    squareInner.classList.remove("clicked");
  }, 1500);
};

//  ********* GAMEPLAY LOGIC *********
const squareClick = (
  squareBackName,
  squareBackSuit,
  squareInner,
  squareContainer,
  column,
  row
) => {
  console.log("THIS IS squareBackName", squareBackName);
  console.log("THIS IS squareBackSuit", squareBackSuit);
  console.log("FIRST CARD DOM ELEMENT", firstCard);
  console.log("BOARD CLICKED CARD", board[column][row]);
  console.log("Weird boardcol", board[column][row]);
  if (firstCard === null) {
    firstCard = board[column][row];

    squareBackName.innerText = firstCard.name;

    // hold onto this for later when it may not match
    firstCardElement = squareBackName;
    flipCard(squareContainer, squareInner);
  } else if (
    board[column][row].name === firstCard.name &&
    board[column][row].suit === firstCard.suit
  ) {
    console.log("match");

    // turn this card over
    squareBackName.innerText = board[column][row].name;
    squareBackSuit.innerText = board[column][row].suit;
    console.log("LINE 50 SCRIPTJS SUITS - >> ", board[column][row].suit);
    flipCard(squareContainer, squareInner);
  } else {
    console.log("NOT a match");
    firstCard = null;

    firstCardElement.innerText = "";
    flipCard(squareContainer, squareInner);
  }
};
