//declare all document by id
const setupGamePage = document.getElementById("setup-game");
const inGamePage = document.getElementById("in-game");
const inputSize = document.getElementById("input-size");
const inputSizeDisable = document.getElementById("input-size-disable");
const btnStartGame = document.getElementById("btn-start-game");
const board = document.getElementById("board");
const message = document.getElementById("message");
const overlay = document.getElementById("overlay");
const btnReset = document.getElementById("btn-reset");
const btnTryAgain = document.getElementById("btn-try-again");
const btnExit = document.getElementById("btn-exit");
let cells;

const defaultState = {
  board: [],
  wonArr: [],
  size: "3",
  currentTurn: "1",
  background: "white",
};

let state = {
  board: [],
  wonArr: [],
  size: "3",
  currentTurn: "1",
  background: "white",
};

// update board size
function updateBoardSize(size) {
  inputSize.value = size;
  inputSizeDisable.value = size;
  inputSize.size = size.length;
  inputSizeDisable.size = size.length;
}

// update arr[index] in win condition for show highlight
function updateWonArr(arr) {
  state.wonArr = arr;
}

// change turn message
function updateMessageTurn(msg) {
  message.innerHTML = msg;
}

// update current turn
function updateCurrentTurn(currentTurn) {
  state.currentTurn = currentTurn;
  updateMessageTurn(`Player 0${currentTurn} Turn`);
}

// update board value with 1 or 2 and index board
function updateBoardValue(value, index) {
  state.board[index] = value;
}

// show highlight path if win or lose
function showHighLight(arr, isTie) {
  if (isTie) {
    cells.forEach((cell) => {
      cell.classList.add("highlight");
    });
  } else {
    arr.forEach((i) => {
      cells[i].classList.add("highlight");
    });
  }
}

// show overlay game over
function showOverlay() {
  setTimeout(() => {
    overlay.classList.add("active");
  }, 2000);

  btnReset.addEventListener("click", resetGame);
  btnTryAgain.addEventListener("click", tryAgainGame);
  btnExit.addEventListener("click", exitGame);
}

// handle size if user on input/change input
function handleSizeOnInput(e) {
  let value = e.target.value.replace(/[^0-9]+/gi, "");
  if (value.length > 1 && value.startsWith("0")) {
    value = value.substr(1);
  } else if (!value) {
    value = "0";
  }
  if (Number(value) > 65535) {
    value = String(65535);
  }
  state.size = value;

  updateBoardSize(state.size);
}

// handle size if user leave from input
function handleSizeOnBlur(e) {
  let value = Number(e.target.value);
  if (value < 3) {
    value = 3;
  }
  if (value % 2 == 0) {
    value = value - 1;
  }
  state.size = String(value);

  updateBoardSize(state.size);
}

// for effect like shadow "x" or "o"
function actionMouseHoverIn() {
  let currentClass = state.currentTurn === "1" ? "xCross" : "oCircle";
  if (this.classList.contains("xCross") || this.classList.contains("oCircle")) {
    this.style.cursor = "not-allowed";
  } else {
    this.classList.add(`${currentClass}-hover`);
  }
}

// delete effect shadow "x" or "o"
function actionMouseHoverOut() {
  if (
    this.classList.contains("xCross-hover") ||
    this.classList.contains("oCircle-hover")
  ) {
    this.classList.remove("xCross-hover", "oCircle-hover");
  }
}

// clear child element inside div.board
function clearChild() {
  let child = board.lastElementChild;
  while (child) {
    board.removeChild(child);
    child = board.lastElementChild;
  }
}

// for reset the game
function resetGame() {
  state = { ...defaultState };
  updateBoardSize(state.size);
  clearChild();
  updateMessageTurn(`Player 0${state.currentTurn} Turn`);
  removeActionOverlayListener();
  initialSetupGame();
}

// for try again the game
function tryAgainGame() {
  state.board = [];
  state.wonArr = [];
  state.currentTurn = "1";
  clearChild();
  setupBoard();
  overlay.classList.remove("active");
  updateMessageTurn(`Player 0${state.currentTurn} Turn`);
  removeActionOverlayListener();
  addActionListener();
}

// for exit the game (close page/tab)
function exitGame() {
  alert(
    `since browser has limitation on window.close usage, closing game/tab only work when you open the link in new tab (right click + open in new tab). Without it, the app won't close`
  );
  window.close();
}

// for add all listener in board action
function addActionListener() {
  cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("mouseenter", actionMouseHoverIn);
    cell.addEventListener("mouseleave", actionMouseHoverOut);
    cell.addEventListener("click", actionClickBoard, {
      once: true,
    });
  });
}

// for remove all listener in board action
function removeActionListener() {
  cells.forEach((cell) => {
    cell.removeEventListener("mouseenter", actionMouseHoverIn);
    cell.removeEventListener("mouseleave", actionMouseHoverOut);
    cell.removeEventListener("click", actionClickBoard);
    cell.style.cursor = "not-allowed";
  });
}

// for remove all listener in overlay (reset ,try again)
function removeActionOverlayListener() {
  btnReset.removeEventListener("click", resetGame);
  btnTryAgain.removeEventListener("click", tryAgainGame);
  btnExit.removeEventListener("click", exitGame);
  document.querySelectorAll(".bg-list").forEach((el) => {
    el.removeEventListener("click", changeBackground);
  });
}

// setup board (create board by size, and change condition home to in game)
function setupBoard() {
  state.board = new Array(Number(state.size) * Number(state.size)).fill("");
  board.style = `grid-template-columns: repeat(${state.size}, 1fr)`;

  for (let i = 0; i < state.board.length; i++) {
    let div = document.createElement("div");
    div.classList.add("cell");
    div.setAttribute("data-index", i);
    board.append(div);
  }

  inGamePage.classList.remove("hide");
  message.classList.remove("hide");
  setupGamePage.classList.add("hide");
}

// logic for check win
function isWinner(valueTurn) {
  const gridSize = Number(state.size);
  let horizontalCount;
  let verticalCount;
  let diagonalLeftToRight = 0;
  let diagonalRightToLeft = 0;
  let wonArrHorizontal;
  let wonArrVertical;
  let wonArrDiagonalLeftRight = [];
  let wonArrDiagonalRightLeft = [];

  for (let i = 0; i < gridSize; i++) {
    horizontalCount = 0;
    verticalCount = 0;
    wonArrHorizontal = [];
    wonArrVertical = [];
    for (let j = 0; j < gridSize; j++) {
      // like [0,1,2]
      if (state.board[i * gridSize + j] == valueTurn) {
        horizontalCount++;
        wonArrHorizontal.push(i * gridSize + j);
      }
      // like [0,3,6]
      if (state.board[j * gridSize + i] == valueTurn) {
        verticalCount++;
        wonArrVertical.push(j * gridSize + i);
      }
    }
    if (horizontalCount == gridSize) {
      // update arr[index path win condition]
      updateWonArr(wonArrHorizontal);
      return true;
    }
    if (verticalCount == gridSize) {
      // update arr[index path win condition]
      updateWonArr(wonArrVertical);
      return true;
    }
    // like [0,4,8]
    if (state.board[i * gridSize + i] == valueTurn) {
      diagonalLeftToRight++;
      wonArrDiagonalLeftRight.push(i * gridSize + i);
    }
    // like [2,4,6]
    if (state.board[(gridSize - 1) * (i + 1)] == valueTurn) {
      diagonalRightToLeft++;
      wonArrDiagonalRightLeft.push((gridSize - 1) * (i + 1));
    }
  }
  if (diagonalLeftToRight == gridSize) {
    // update arr[index path win condition]
    updateWonArr(wonArrDiagonalLeftRight);
    return true;
  }
  if (diagonalRightToLeft == gridSize) {
    // update arr[index path win condition]
    updateWonArr(wonArrDiagonalRightLeft);
    return true;
  }
  return false;
}

// all condition if user click box of board
function actionClickBoard(e) {
  const currentClass = state.currentTurn === "1" ? "xCross" : "oCircle";
  const currentTurn = state.currentTurn;
  const newCurrentTurn = state.currentTurn === "1" ? "2" : "1";
  const indexBoardClicked = e.target.dataset.index;
  let valueBoardClicked;
  this.classList.add(currentClass); // set 'X' or 'O'
  this.classList.remove(`${currentClass}-hover`); // remove hover if already selected
  this.style.cursor = "not-allowed";
  updateBoardValue(currentTurn, indexBoardClicked);
  valueBoardClicked = state.board[indexBoardClicked];
  if (isWinner(valueBoardClicked)) {
    // check win condition
    updateMessageTurn(`Player 0${currentTurn} Won !!!`);
    showHighLight(state.wonArr, false);
    removeActionListener();
    showOverlay();
    return;
  } else {
    const isTie = state.board.every((el) => el != "");
    if (isTie) {
      // if tie
      updateMessageTurn(`It is a Tie !!!`);
      showHighLight(cells, true);
      removeActionListener();
      showOverlay();
      return;
    }
    updateCurrentTurn(newCurrentTurn);
  }
}

// start the game (iam using set time out for see the auto change because some condition)
function startGame() {
  setTimeout(() => {
    setupBoard();
    addActionListener();
  }, 800);
}

// for change background color
function changeBackground(e) {
  const body = document.body;
  body.style = `background-color:${e.target.dataset.color};`;
  state.background = e.target.dataset.color;
}

// initial setup game
function initialSetupGame() {
  document.querySelectorAll(".bg-list").forEach((el) => {
    el.addEventListener("click", changeBackground);
  });
  updateBoardSize(state.size);
  updateCurrentTurn(state.currentTurn);
  inputSize.oninput = handleSizeOnInput;
  inputSize.onblur = handleSizeOnBlur;
  btnStartGame.onclick = startGame;
  setupGamePage.classList.remove("hide");
  overlay.classList.remove("active");
  inGamePage.classList.add("hide");
  message.classList.add("hide");
}

window.onload = () => {
  // the first load of page
  initialSetupGame();
};
