/* eslint-disable max-lines */
// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
const CANVAS_ID = "#game";
const CONTEXT_TYPE = "2d";
const TILE_WITH = 10;
const CONTEXT_CONFIG = {
    fillStyle: "#f73454",
    strokeStyle: "#f73454",
    lineWidth: 1,
};
const INITIAL_SPEED_LOOP_MS = 1000;
const MINIMUM_NEIGHBORS_TO_KEEP_ALIVE = 2;
const MAXIMUM_NEIGHBORS_TO_KEEP_ALIVE = 3;
const NEIGHBORS_TO_BORN = 3;
const ALIVE = true;
const DEAD = false;
const LIVING_CHANCE = 0.9;
const MINIMUM_SPEED_GAME_MS = 50;
const MAXIMUM_SPEED_GAME_MS = 2000;
const DELTA_SPEED_GAME_MS = 50;
const HELP_BUTTON_ID = "#help-btn";
const HELP_MODAL_ID = "#help-msg";
const PAUSE_KEY = "p";
const INCREASE_KEY = "+";
const DECREASE_KEY = "-";
const RANDOM_KEY = "r";
const CLEAR_KEY = "c";
const HELP_KEY = "?";
const canvas = document.querySelector(CANVAS_ID);
const context = canvas.getContext(CONTEXT_TYPE);
const width = window.innerWidth;
const height = window.innerHeight;
const columnsCount = Math.floor(width / TILE_WITH);
const rowsCount = Math.floor(height / TILE_WITH);
canvas.width = width;
canvas.height = height;
context.fillStyle = CONTEXT_CONFIG.fillStyle;
context.strokeStyle = CONTEXT_CONFIG.strokeStyle;
context.lineWidth = CONTEXT_CONFIG.lineWidth;
let isPaused = false;
let gameSpeedLoopMs = INITIAL_SPEED_LOOP_MS;
const prepareBoard = () => {
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
const drawBoard = (board) => {
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            if (!board[columnNumber][rowNumber]) {
                continue;
            }
            context.fillRect(columnNumber * TILE_WITH, rowNumber * TILE_WITH, TILE_WITH, TILE_WITH);
        }
    }
};
const isAlive = (columnNumber, rowNumber) => {
    if (columnNumber < 0 ||
        columnNumber >= columnsCount ||
        rowNumber < 0 ||
        rowNumber >= rowsCount) {
        return 0;
    }
    return gameBoard[columnNumber][rowNumber] ? 1 : 0;
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
            let countLiveNeighbors = 0;
            for (const deltaRow of [-1, 0, 1]) {
                for (const deltaColumn of [-1, 0, 1]) {
                    if (!(deltaRow === 0 && deltaColumn === 0)) {
                        countLiveNeighbors += isAlive(columnNumber + deltaRow, rowNumber + deltaColumn);
                    }
                }
            }
            if (!isAlive(columnNumber, rowNumber)) {
                if (countLiveNeighbors === NEIGHBORS_TO_BORN) {
                    board[columnNumber][rowNumber] = ALIVE;
                }
            }
            else {
                if (countLiveNeighbors == MINIMUM_NEIGHBORS_TO_KEEP_ALIVE ||
                    countLiveNeighbors == MAXIMUM_NEIGHBORS_TO_KEEP_ALIVE) {
                    board[columnNumber][rowNumber] = ALIVE;
                }
            }
        }
    }
    return board;
};
const redraw = () => {
    clearCanvas();
    drawBoard(gameBoard);
};
const drawNextGeneration = () => {
    if (isPaused) {
        return;
    }
    gameBoard = calculateNextGeneration();
    redraw();
};
const nextGenLoop = () => {
    drawNextGeneration();
    setTimeout(nextGenLoop, gameSpeedLoopMs);
};
nextGenLoop();
let isDrawing = true;
let isMouseDown = false;
function getPositionFromMouseEvent(mouseEvent) {
    const columnNumber = Math.floor((mouseEvent.clientX - canvas.offsetLeft) / TILE_WITH);
    const rowNumber = Math.floor((mouseEvent.clientY - canvas.offsetTop) / TILE_WITH);
    return [columnNumber, rowNumber];
}
canvas.addEventListener("mousedown", mouseEvent => {
    isMouseDown = true;
    const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent);
    isDrawing = !gameBoard[columnNumber][rowNumber];
    gameBoard[columnNumber][rowNumber] = isDrawing;
    redraw();
});
canvas.addEventListener("mousemove", mouseEvent => {
    if (!isMouseDown) {
        return;
    }
    const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent);
    gameBoard[columnNumber][rowNumber] = isDrawing;
    redraw();
});
canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});
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
        gameSpeedLoopMs = Math.max(MINIMUM_SPEED_GAME_MS, gameSpeedLoopMs - DELTA_SPEED_GAME_MS);
    }
    else if (keyBoardEvent.key === DECREASE_KEY) {
        gameSpeedLoopMs = Math.min(MAXIMUM_SPEED_GAME_MS, gameSpeedLoopMs + DELTA_SPEED_GAME_MS);
    }
    else if (keyBoardEvent.key === RANDOM_KEY) {
        gameBoard = generateRandom();
        redraw();
    }
    else if (keyBoardEvent.key === CLEAR_KEY) {
        gameBoard = prepareBoard();
        redraw();
    }
});
/* MODAL */
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
