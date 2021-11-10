/* eslint-disable max-lines */
// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
// ✅ Constant section at the beginning
// No magic numbers
// Screaming uppercase
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
// ✅ Variables (immutables) section
const canvas = document.querySelector(CANVAS_ID);
const context = canvas.getContext(CONTEXT_TYPE);
// ✅ Comments: some are necessary, some are not
// To Do: remove redundant width and height variables, and use canvas.width and canvas.height
const width = window.innerWidth;
const height = window.innerHeight;
const columnsCount = Math.floor(width / TILE_LENGTH);
const rowsCount = Math.floor(height / TILE_LENGTH);
// ✅ ONE blank line allow to keep the code readable
canvas.width = width;
canvas.height = height;
context.fillStyle = CONTEXT_CONFIG.fillStyle;
context.strokeStyle = CONTEXT_CONFIG.strokeStyle;
context.lineWidth = CONTEXT_CONFIG.lineWidth;
let isPaused = false; // ✅ Boolean variables start with a verb
let gameSpeedLoopMs = INITIAL_SPEED_LOOP_MS; // ✅ Measure variables contains the unit of measure
const prepareBoard = () => {
    // ✅ Always use full names for variables
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
// ✅ Always use verb and name for functions
const clearCanvas = () => {
    context.clearRect(0, 0, width, height);
};
const drawBoard = (board) => {
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            if (!board[columnNumber][rowNumber]) {
                continue;
            }
            context.fillRect(columnNumber * TILE_LENGTH, rowNumber * TILE_LENGTH, TILE_LENGTH, TILE_LENGTH);
        }
    }
};
// ✅ Boolean functions start with a verb like: is, has, can, must or should
const isAlive = (columnNumber, rowNumber) => {
    if (columnNumber < 0 ||
        columnNumber >= columnsCount ||
        rowNumber < 0 ||
        rowNumber >= rowsCount) {
        return DEAD;
    }
    return gameBoard[columnNumber][rowNumber];
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
            // ✅ The more expressive the best
            let numberOfLivingNeighbors = 0;
            for (const deltaRow of DELTAS) {
                for (const deltaColumn of DELTAS) {
                    if (!(deltaRow === 0 && deltaColumn === 0)) {
                        if (isAlive(columnNumber + deltaColumn, rowNumber + deltaRow)) {
                            numberOfLivingNeighbors++;
                        }
                    }
                }
            }
            if (!isAlive(columnNumber, rowNumber)) {
                if (numberOfLivingNeighbors === NEEDED_NEIGHBORS_TO_BORN) {
                    board[columnNumber][rowNumber] = ALIVE;
                }
            }
            else {
                if (numberOfLivingNeighbors == MINIMUM_NEIGHBORS_TO_KEEP_ALIVE ||
                    numberOfLivingNeighbors == MAXIMUM_NEIGHBORS_TO_KEEP_ALIVE) {
                    board[columnNumber][rowNumber] = ALIVE;
                }
            }
        }
    }
    return board;
};
// ✅ Use names that describe the function
const redrawGameCanvas = () => {
    clearCanvas();
    drawBoard(gameBoard);
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
// ✅ Those comment are a code smell... but right now they help to understand the code
/* Canvas user interaction */
let isDrawing = true;
let isMouseDown = false;
// ✅ Use well named arguments for functions
function getPositionFromMouseEvent(mouseEvent) {
    const columnNumber = Math.floor((mouseEvent.clientX - canvas.offsetLeft) / TILE_LENGTH);
    const rowNumber = Math.floor((mouseEvent.clientY - canvas.offsetTop) / TILE_LENGTH);
    return [columnNumber, rowNumber];
}
canvas.addEventListener("mousedown", mouseEvent => {
    isMouseDown = true;
    const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent);
    isDrawing = !gameBoard[columnNumber][rowNumber];
    gameBoard[columnNumber][rowNumber] = isDrawing;
    redrawGameCanvas();
});
canvas.addEventListener("mousemove", mouseEvent => {
    if (!isMouseDown) {
        return;
    }
    const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent);
    gameBoard[columnNumber][rowNumber] = isDrawing;
    redrawGameCanvas();
});
canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});
/** Menu listeners */
const generateRandom = () => {
    const board = prepareBoard();
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            board[columnNumber][rowNumber] = Math.random() > LIVING_CHANCE;
        }
    }
    return board;
};
document.addEventListener("keydown", keyBoardEvent => {
    console.log(keyBoardEvent);
    if (keyBoardEvent.key === PAUSE_KEY) {
        isPaused = !isPaused;
    }
    else if (keyBoardEvent.key === INCREASE_KEY) {
        gameSpeedLoopMs = Math.max(MAXIMUM_SPEED_GAME_LOOP_MS, gameSpeedLoopMs - DELTA_SPEED_GAME_MS);
    }
    else if (keyBoardEvent.key === DECREASE_KEY) {
        gameSpeedLoopMs = Math.min(MINIMUM_SPEED_GAME_LOOP_MS, gameSpeedLoopMs + DELTA_SPEED_GAME_MS);
    }
    else if (keyBoardEvent.key === RANDOM_KEY) {
        gameBoard = generateRandom();
        redrawGameCanvas();
    }
    else if (keyBoardEvent.key === CLEAR_KEY) {
        gameBoard = prepareBoard();
        redrawGameCanvas();
    }
});
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
