/* eslint-disable max-lines */

// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
const CANVAS_ID = "#game";
const CONTEXT_TYPE = "2d";
const TILE_LENGTH = 10;
const CONTEXT_CONFIG = {
  fillStyle: "#f73454",
  strokeStyle: "#f73454",
  lineWidth: 1,
};
const INITIAL_SPEED_LOOP_MS = 1000;
const MINIMUM_NEIGHBORS_TO_KEEP_ALIVE = 2;
const MAXIMUM_NEIGHBORS_TO_KEEP_ALIVE = 3;
const NEEDED_NEIGHBORS_TO_BORN = 3;
const ALIVE = true;
const DEAD = false;
const DELTAS = [-1, 0, 1];
const LIVING_CHANCE = 0.9;
const MAXIMUM_SPEED_GAME_LOOP_MS = 50;
const MINIMUM_SPEED_GAME_LOOP_MS = 2000;
const DELTA_SPEED_GAME_MS = 50;
const HELP_BUTTON_ID = "#help-btn";
const HELP_MODAL_ID = "#help-msg";
const PAUSE_KEY = "p";
const INCREASE_KEY = "+";
const DECREASE_KEY = "-";
const RANDOM_KEY = "r";
const CLEAR_KEY = "c";
const HELP_KEY = "?";

const canvas = document.querySelector<HTMLCanvasElement>(CANVAS_ID);
const context = canvas.getContext(CONTEXT_TYPE);
// To Do: remove redundant width and height variables, and use canvas.width and canvas.height
const width = window.innerWidth;
const height = window.innerHeight;
const columnsCount = Math.floor(width / TILE_LENGTH);
const rowsCount = Math.floor(height / TILE_LENGTH);

canvas.width = width;
canvas.height = height;

context.fillStyle = CONTEXT_CONFIG.fillStyle;
context.strokeStyle = CONTEXT_CONFIG.strokeStyle;
context.lineWidth = CONTEXT_CONFIG.lineWidth;

let isPaused = false;
let gameSpeedLoopMs = INITIAL_SPEED_LOOP_MS;

const prepareBoard = (): boolean[][] => {
  const board = [];
  for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
    const row = [];
    for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
      row.push(DEAD);
    }
    board.push(row);
  }
  return board;
};

let gameBoard = prepareBoard();

const clearCanvas = () => {
  context.clearRect(0, 0, width, height);
};

const drawBoard = () => {
  for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
    for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
      // ✅ Move nested structures to a new function
      drawCell(rowNumber, columnNumber);
    }
  }
};

const isAlive = (columnNumber: number, rowNumber: number): boolean => {
  // ✅ Move complex conditionals to a new function
  if (isInsideBoard(columnNumber, rowNumber)) {
    return gameBoard[columnNumber][rowNumber];
  } else {
    return false;
  }
};

const isInsideBoard = (columnNumber: number, rowNumber: number): boolean => {
  // ✅ Separate each condition to a conditional instruction
  if (columnNumber < 0) return false;
  if (columnNumber >= columnsCount) return false;
  if (rowNumber < 0) return false;
  if (rowNumber >= rowsCount) return false;
  return true;
};

const drawCell = (rowNumber: number, columnNumber: number) => {
  if (isAlive(columnNumber, rowNumber)) {
    context.fillRect(
      columnNumber * TILE_LENGTH,
      rowNumber * TILE_LENGTH,
      TILE_LENGTH,
      TILE_LENGTH
    );
  }
};

gameBoard[1][0] = ALIVE;
gameBoard[2][1] = ALIVE;
gameBoard[0][2] = ALIVE;
gameBoard[1][2] = ALIVE;
gameBoard[2][2] = ALIVE;

const calculateNextGeneration = () => {
  const board = prepareBoard();
  for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
    for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
      // ✅ Move nested structures to a new function
      calculateNextGenerationCell(board, rowNumber, columnNumber);
    }
  }
  return board;
};

const calculateNextGenerationCell = (
  board: boolean[][],
  rowNumber: number,
  columnNumber: number
) => {
  let numberOfLivingNeighbors = 0;
  for (const deltaRow of DELTAS) {
    for (const deltaColumn of DELTAS) {
      // ✅ Move nested structures to a new function
      numberOfLivingNeighbors = updateLivingNeighbors(
        deltaRow,
        deltaColumn,
        columnNumber,
        rowNumber,
        numberOfLivingNeighbors
      );
    }
  }
  // ✅ Reduce complexity by moving logic to a new function
  setNewGenerationCellState(
    board,
    rowNumber,
    columnNumber,
    numberOfLivingNeighbors
  );
};

const setNewGenerationCellState = (
  board: boolean[][],
  rowNumber: number,
  columnNumber: number,
  numberOfLivingNeighbors: number
) => {
  // Fair enough, but it's not the best way to do it
  if (isAlive(columnNumber, rowNumber)) {
    if (canKeepAlive(numberOfLivingNeighbors)) {
      board[columnNumber][rowNumber] = ALIVE;
    }
  } else {
    if (canBorn(numberOfLivingNeighbors)) {
      board[columnNumber][rowNumber] = ALIVE;
    }
  }
};

// ✅ A lot of new small functions with names expressing their purpose

const canKeepAlive = (numberOfLivingNeighbors: number) => {
  // ✅ Remember that each condition is a business rule
  const isMinimum = numberOfLivingNeighbors == MINIMUM_NEIGHBORS_TO_KEEP_ALIVE;
  const isMaximum = numberOfLivingNeighbors == MAXIMUM_NEIGHBORS_TO_KEEP_ALIVE;
  return isMinimum || isMaximum;
};
const canBorn = (countLiveNeighbors: number) => {
  // ✅ But keep it simple
  return countLiveNeighbors == NEEDED_NEIGHBORS_TO_BORN;
};

const updateLivingNeighbors = (
  deltaRow: number,
  deltaColumn: number,
  columnNumber: number,
  rowNumber: number,
  countLivingNeighbors: number
) => {
  // ⚠️ Fair enough, but it's not the best way to do it
  if (isNotMe(deltaRow, deltaColumn)) {
    if (isAlive(columnNumber + deltaColumn, rowNumber + deltaRow)) {
      countLivingNeighbors++;
    }
  }
  return countLivingNeighbors;
};

const isNotMe = (deltaRow: number, deltaColumn: number) => {
  const hasHorizontalDelta = deltaRow !== 0;
  const hasVerticalDelta = deltaColumn !== 0;
  return hasHorizontalDelta || hasVerticalDelta;
};

const redrawGameCanvas = () => {
  clearCanvas();
  drawBoard();
};

const drawNextGeneration = () => {
  if (isPaused) {
    return;
  }
  gameBoard = calculateNextGeneration();
  redrawGameCanvas();
};

const nextGenLoop = () => {
  drawNextGeneration();
  setTimeout(nextGenLoop, gameSpeedLoopMs);
};

nextGenLoop();

/* Canvas user interaction */
let currentMouseState = ALIVE;
let isMouseDown = false;

function getPositionFromMouseEvent(mouseEvent: MouseEvent) {
  // ✅ Divide and conquer
  const horizontalPixel = getHorizontalPixelFromMouseEvent(mouseEvent);
  const columnNumber = getTileNumberFromPixel(horizontalPixel);
  const verticalPixel = getVerticalPixelFromMouseEvent(mouseEvent);
  const rowNumber = getTileNumberFromPixel(verticalPixel);
  return [columnNumber, rowNumber];
}
function getHorizontalPixelFromMouseEvent(mouseEvent: MouseEvent) {
  return mouseEvent.clientX - canvas.offsetLeft;
}
function getVerticalPixelFromMouseEvent(mouseEvent: MouseEvent) {
  return mouseEvent.clientY - canvas.offsetTop;
}
function getTileNumberFromPixel(pixel: number) {
  return Math.floor(pixel / TILE_LENGTH);
}

canvas.addEventListener("mousedown", mouseEvent => {
  isMouseDown = true;
  const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent);
  // ⚠️ the variable isDrawing got a very bad name
  // isDrawing = !gameBoard[columnNumber][rowNumber];
  const stateAtMousePosition = gameBoard[columnNumber][rowNumber];
  // Toggle state
  const newToggledState = !stateAtMousePosition;
  gameBoard[columnNumber][rowNumber] = newToggledState;
  currentMouseState = newToggledState;
  redrawGameCanvas();
});

canvas.addEventListener("mousemove", mouseEvent => {
  if (isMouseDown) {
    const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent);
    // ⚠️ the variable isDrawing got a very bad name
    gameBoard[columnNumber][rowNumber] = currentMouseState;
    redrawGameCanvas();
  }
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

/** Menu listeners */

const generateRandom = () => {
  const board = prepareBoard();
  for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
    for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
      // ✅ Each operation on its own instruction
      const isRandomlyAlive = Math.random() > LIVING_CHANCE;
      board[columnNumber][rowNumber] = isRandomlyAlive;
    }
  }
  return board;
};

document.addEventListener("keydown", keyBoardEvent => {
  console.log(keyBoardEvent);
  const keyPressed = keyBoardEvent.key;
  // ✅ Use an object or a dictionary instead of a switch or nested ifs
  const allowedKeys = Object.keys(keyActions);
  if (allowedKeys.includes(keyPressed)) {
    // ✅ get and invoke function
    const action = keyActions[keyPressed];
    action();
  }
});

// ✅ A dictionary object with values or functions (as in this case)
const keyActions = {
  [PAUSE_KEY]: () => {
    isPaused = !isPaused;
  },
  [INCREASE_KEY]: () => {
    gameSpeedLoopMs = Math.max(
      MAXIMUM_SPEED_GAME_LOOP_MS,
      gameSpeedLoopMs - DELTA_SPEED_GAME_MS
    );
  },
  [DECREASE_KEY]: () => {
    gameSpeedLoopMs = Math.min(
      MINIMUM_SPEED_GAME_LOOP_MS,
      gameSpeedLoopMs + DELTA_SPEED_GAME_MS
    );
  },
  [RANDOM_KEY]: () => {
    gameBoard = generateRandom();
    redrawGameCanvas();
  },
  [CLEAR_KEY]: () => {
    gameBoard = prepareBoard();
    redrawGameCanvas();
  },
};

/* Help button and modal */
const helpButton = document.querySelector(HELP_BUTTON_ID);
const helpModal = document.querySelector(HELP_MODAL_ID);

const toggleHelpModal = () => {
  helpModal.classList.toggle("hidden");
};

document.addEventListener("keydown", keyboardEvent => {
  if (keyboardEvent.key === HELP_KEY) {
    toggleHelpModal();
  }
});

helpButton.addEventListener("click", toggleHelpModal);
