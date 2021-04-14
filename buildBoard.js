//  ******** GAME INITIALISATION LOGIC *********

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement("div");

  // give it a class for CSS purposes
  boardElement.classList.add("board");

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement("div");
      const squareInner = document.createElement("div");
      const squareFront = document.createElement("div");
      const squareBack = document.createElement("div");
      const squareBackName = document.createElement("p");
      const squareBackSuit = document.createElement("p");
      // set a class for CSS purposes
      square.classList.add("square");
      squareInner.classList.add("square-inner");
      squareFront.classList.add("square-front");
      squareBack.classList.add("square-back");
      squareBackName.classList.add("square-back-name");
      squareBackSuit.classList.add("square-back-suit");
      // set the click event
      // eslint-disable-next-line
      square.addEventListener("click", (event) => {
        console.log("HERE EVENT TARGET ->> ", event.currentTarget);
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        // squareClick(event.currentTarget, i, j);
        squareClick(squareBackName, squareBackSuit, square, squareInner, i, j);

        console.log("THIS IS CURRENT TARGET ", event.currentTarget);
      });
      squareBack.appendChild(squareBackName);
      squareBack.appendChild(squareBackSuit);
      squareInner.appendChild(squareFront);
      squareInner.appendChild(squareBack);
      square.appendChild(squareInner);
      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// THIS SCRIPT IS USED IN initGame.js
