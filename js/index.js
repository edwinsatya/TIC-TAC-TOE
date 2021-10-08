const setupGamePage = document.getElementById("setup-game");
const inGamePage = document.getElementById("in-game");
const inputSize = document.getElementById("input-size");
const inputSizeDisable = document.getElementById("input-size-disable");
const btnStartGame = document.getElementById("btn-start-game");
const board = document.getElementById("board");
const message = document.getElementById("message");

const state = {
  board: [],
  size: "3",
  currentTurn: "1",
};

function updateBoardSize(size) {
  inputSize.value = size;
  inputSizeDisable.value = size;
  inputSize.size = size.length;
  inputSizeDisable.size = size.length;
}

function updateCurrentTurn(currentTurn) {
  state.currentTurn = currentTurn;
  message.innerHTML = `Player 0${currentTurn} Turn`;
}

function initialSetupGame() {
  updateBoardSize(state.size);
  updateCurrentTurn(state.currentTurn);
  inputSize.oninput = handleSizeOnInput;
  inputSize.onblur = handleSizeOnBlur;
  btnStartGame.onclick = startGame;
  inGamePage.classList.add("hide");
  message.classList.add("hide");
}

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

function setupBoard() {
  state.board = new Array(Number(state.size) * Number(state.size)).fill("");
  board.style = `grid-template-columns: repeat(${state.size}, 1fr)`;

  for (let i = 0; i < state.board.length; i++) {
    let div = document.createElement("div");
    div.classList.add("cell");
    board.append(div);
  }

  inGamePage.classList.remove("hide");
  message.classList.remove("hide");
  setupGamePage.classList.add("hide");
}

function actionClickBoard() {
  let currentClass = state.currentTurn === "1" ? "xCross" : "oCircle";
  let newCurrentTurn = state.currentTurn === "1" ? "2" : "1";
  this.classList.add(currentClass);
  this.classList.remove(`${currentClass}-hover`);
  this.style.cursor = "not-allowed";
  updateCurrentTurn(newCurrentTurn);
}

function actionMouseHoverIn() {
  let currentClass = state.currentTurn === "1" ? "xCross" : "oCircle";
  if (this.classList.contains("xCross") || this.classList.contains("oCircle")) {
    this.style.cursor = "not-allowed";
  } else {
    this.classList.add(`${currentClass}-hover`);
  }
}

function actionMouseHoverOut() {
  if (
    this.classList.contains("xCross-hover") ||
    this.classList.contains("oCircle-hover")
  ) {
    this.classList.remove("xCross-hover", "oCircle-hover");
  }
}

function addActionListener() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("mouseenter", actionMouseHoverIn);
    cell.addEventListener("mouseleave", actionMouseHoverOut);
    cell.addEventListener("click", actionClickBoard, {
      once: true,
    });
  });
}

function startGame() {
  setupBoard();
  addActionListener();
}

window.onload = () => {
  initialSetupGame();
};
