//  ********* INITIALISE GAME *********
// GET ROOT ELEMENT TO APPEND TO DOM
// Get the root element to use to append elements to DOM
const root = document.getElementById("root");

const initGame = () => {
  // Get welcome Message and start button
  const startButton = document.querySelector(".start-button");
  const welcomeMsg = document.querySelector(".welcome-msg");
  // Hide Welcome message && button
  startButton.style.display = "none";
  welcomeMsg.style.display = "none";

  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  console.log("THIS IS DOUBLEDECK ---> ", doubleDeck);
  // Slice method returns a copy of the array with the selected elements
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  console.log("THIS IS DECKSUBSET ---> ", deckSubset);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      // pushing into the nested array in board
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  root.appendChild(boardEl);
};
// initGame();
