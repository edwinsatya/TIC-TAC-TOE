let inputSize = document.getElementById("input-size");
let inputSizeDisable = document.getElementById("input-size-disable");

let state = {
  board: [],
  size: "3",
  turn: "O",
};

function initialSetup() {
  inputSize.value = state.size;
  inputSizeDisable.value = state.size;
  inputSize.size = state.size.length;
  inputSizeDisable.size = state.size.length;
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
  let value = e.target.value.replace(/[^0-9]+/gi, "");

  if (value < 3) {
    value = 3;
  }
  if (value % 2 == 0) {
    value--;
  }
  state.size = value;

  updateBoardSize(state.size);
}

function updateBoardSize(size) {
  inputSize.value = size;
  inputSizeDisable.value = size;
  inputSize.size = size.length;
  inputSizeDisable.size = size.length;
  console.log(state);
}

// initialSetup();

function startGame() {
  state.size = parseInt(inputSize.value);
  state.board = new Array(state.size * state.size).fill("");
}

window.onload = () => {
  initialSetup();
};
