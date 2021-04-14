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

// Match Message Fucntion
const matchMsg = () => {
  // Get the root element to append message
  const root = document.getElementById("root");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg-div");
  const msgHeader = document.createElement("h3");
  msgHeader.innerText = "MATCH! Well done!";
  msgDiv.appendChild(msgHeader);
  root.insertAdjacentElement("beforebegin", msgDiv);

  setTimeout(() => {
    msgDiv.style.display = "none";
  }, 3000);
};

// Start Game
const startButton = document.querySelector(".start-button");
startButton.addEventListener("click", (e) => {
  initGame();
});

//  ********* GAMEPLAY LOGIC *********
const squareClick = (
  squareBackName,
  squareBackSuit,
  squareInner,
  squareContainer,
  column,
  row
) => {
  console.log("FIRST CARD ELEMENT ->>>", firstCardElement);
  console.log("THIS IS squareBackName", squareBackName.innerText);
  console.log("THIS IS squareBackSuit", squareBackSuit);
  console.log("FIRST CARD DOM ELEMENT", firstCard);
  console.log("BOARD CLICKED CARD", board[column][row]);
  console.log("Weird boardcol", board[column][row]);
  if (firstCard === null) {
    // This equals an object of one card
    firstCard = board[column][row];

    squareBackName.innerText = firstCard.name;
    squareBackSuit.innerText = firstCard.suit;

    // hold onto this for later when it may not match
    firstCardElement = board[column][row];
    // flipCard(squareContainer, squareInner);
  } else if (
    board[column][row].name === firstCard.name &&
    board[column][row].suit === firstCard.suit
  ) {
    console.log("match");
    matchMsg();

    // turn this card over
    squareBackName.innerText = board[column][row].name;
    squareBackSuit.innerText = board[column][row].suit;
    console.log("LINE 50 SCRIPTJS SUITS - >> ", board[column][row].suit);
    flipCard(squareContainer, squareInner);
  } else {
    console.log("NOT a match");
    firstCard = null;

    // firstCardElement.innerText = "";
    firstCardElement = "";
    flipCard(squareContainer, squareInner);
  }
};
