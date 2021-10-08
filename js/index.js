let inputSize = document.getElementById("input-size");
let inputSizeDisable = document.getElementById("input-size-disable");
let board = document.getElementById("board");

let state = {
  board: [],
  size: "3",
  turn: "O",
};

function updateBoardSize(size) {
  inputSize.value = size;
  inputSizeDisable.value = size;
  inputSize.size = size.length;
  inputSizeDisable.size = size.length;
}

function initialSetupGame() {
  updateBoardSize(state.size);
  inputSize.oninput = handleSizeOnInput;
  inputSize.onblur = handleSizeOnBlur;
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
}

function startGame() {
  setupBoard();
}

window.onload = () => {
  initialSetupGame();
};
