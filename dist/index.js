"use strict";
/* eslint-disable max-lines */
// 🚧 Reduce complexity
// 🚧 Use functional programming style
// 🚧 No global variables
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
// 🚧 Keep this global variable for now 🚧
let isPaused = false;
let gameSpeedLoopMs = INITIAL_SPEED_LOOP_MS;
let currentMouseState = ALIVE;
let isMouseDown = false;
let gameBoard;
//  ✅ Function for initialize the game
initializeGame();
// ✅ Enclose every instruction in a function
function initializeGame() {
    console.log("initialization");
    const canvas = document.querySelector(CANVAS_ID);
    if (!canvas)
        return;
    const context = canvas.getContext(CONTEXT_TYPE);
    if (!context)
        return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const columnsCount = Math.floor(width / TILE_LENGTH);
    const rowsCount = Math.floor(height / TILE_LENGTH);
    const startPaused = false;
    // ✅ Send everything to requesters
    gameBoard = prepareBoard(columnsCount, rowsCount);
    initializeCanvas(canvas, context, width, height);
    wireCanvasEventHandlers(canvas, context);
    wireDocumentEventHandlers(document);
    initializeBoard(gameBoard);
    drawBoard(context, gameBoard);
    performLoop(context, startPaused);
}
// ✅ Ask for your dependencies
// ✅ Use function declaration for first class functions
function initializeCanvas(canvas, context, width, height) {
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = CONTEXT_CONFIG.fillStyle;
    context.strokeStyle = CONTEXT_CONFIG.strokeStyle;
    context.lineWidth = CONTEXT_CONFIG.lineWidth;
}
function initializeBoard(gameBoard) {
    gameBoard[0][2] = ALIVE;
    gameBoard[1][0] = ALIVE;
    gameBoard[1][2] = ALIVE;
    gameBoard[2][1] = ALIVE;
    gameBoard[2][2] = ALIVE;
}
function prepareBoard(columnsCount, rowsCount) {
    const board = [];
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        const row = [];
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            row.push(DEAD);
        }
        board.push(row);
    }
    return board;
}
function clearCanvas(context, width, height) {
    context.clearRect(0, 0, width, height);
}
function drawBoard(context, gameBoard) {
    const columnsCount = gameBoard.length;
    const rowsCount = gameBoard[0].length;
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            drawCell(context, gameBoard, rowNumber, columnNumber);
        }
    }
}
function drawCell(context, gameBoard, rowNumber, columnNumber) {
    if (isAlive(gameBoard, columnNumber, rowNumber)) {
        context.fillRect(columnNumber * TILE_LENGTH, rowNumber * TILE_LENGTH, TILE_LENGTH, TILE_LENGTH);
    }
}
function isAlive(gameBoard, columnNumber, rowNumber) {
    const columnsCount = gameBoard.length;
    const rowsCount = gameBoard[0].length;
    if (isInsideBoard(columnNumber, rowNumber, columnsCount, rowsCount)) {
        return gameBoard[columnNumber][rowNumber];
    }
    else {
        return false;
    }
}
function isInsideBoard(columnNumber, rowNumber, columnsCount, rowsCount) {
    if (columnNumber < 0)
        return false;
    if (columnNumber >= columnsCount)
        return false;
    if (rowNumber < 0)
        return false;
    if (rowNumber >= rowsCount)
        return false;
    return true;
}
function calculateNextGeneration(currentBoard) {
    const columnsCount = currentBoard.length;
    const rowsCount = currentBoard[0].length;
    const nextGameBoard = prepareBoard(columnsCount, rowsCount);
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            const newCellState = calculateNextGenerationCell(currentBoard, rowNumber, columnNumber);
            nextGameBoard[columnNumber][rowNumber] = newCellState;
        }
    }
    return nextGameBoard;
}
function calculateNextGenerationCell(gameBoard, rowNumber, columnNumber) {
    let numberOfLivingNeighbors = 0;
    for (const deltaRow of DELTAS) {
        for (const deltaColumn of DELTAS) {
            const hasLivingNeighbor = hasLiveNeighbor(gameBoard, deltaRow, deltaColumn, columnNumber, rowNumber);
            numberOfLivingNeighbors += hasLivingNeighbor ? 1 : 0;
        }
    }
    return getNewGenerationCellState(gameBoard, rowNumber, columnNumber, numberOfLivingNeighbors);
}
function hasLiveNeighbor(gameBoard, deltaRow, deltaColumn, columnNumber, rowNumber) {
    if (isNotMe(deltaRow, deltaColumn)) {
        if (isAlive(gameBoard, columnNumber + deltaColumn, rowNumber + deltaRow)) {
            return true;
        }
    }
    return false;
}
function getNewGenerationCellState(gameBoard, rowNumber, columnNumber, numberOfLivingNeighbors) {
    if (isAlive(gameBoard, columnNumber, rowNumber)) {
        if (canKeepAlive(numberOfLivingNeighbors)) {
            return ALIVE;
        }
    }
    else {
        if (canBorn(numberOfLivingNeighbors)) {
            return ALIVE;
        }
    }
    return DEAD;
}
function canKeepAlive(numberOfLivingNeighbors) {
    const isMinimum = numberOfLivingNeighbors == MINIMUM_NEIGHBORS_TO_KEEP_ALIVE;
    const isMaximum = numberOfLivingNeighbors == MAXIMUM_NEIGHBORS_TO_KEEP_ALIVE;
    return isMinimum || isMaximum;
}
function canBorn(countLiveNeighbors) {
    return countLiveNeighbors == NEEDED_NEIGHBORS_TO_BORN;
}
function isNotMe(deltaRow, deltaColumn) {
    const hasHorizontalDelta = deltaRow !== 0;
    const hasVerticalDelta = deltaColumn !== 0;
    return hasHorizontalDelta || hasVerticalDelta;
}
function redrawGameCanvas(context, gameBoard) {
    const width = context.canvas.width;
    const height = context.canvas.height;
    clearCanvas(context, width, height);
    drawBoard(context, gameBoard);
}
function drawNextGeneration(context, isPaused, gameBoard) {
    const nextGameBoard = calculateNextGeneration(gameBoard);
    redrawGameCanvas(context, nextGameBoard);
    return nextGameBoard;
}
async function performLoop(context, isPaused) {
    // 🚧 Accessing global variables 🚧
    if (isPaused) {
        return;
    }
    const newBoard = drawNextGeneration(context, isPaused, gameBoard);
    gameBoard = newBoard;
    setTimeout(performLoop, gameSpeedLoopMs, context, isPaused, gameBoard);
}
/* Canvas user interaction */
// ✅ Homogenize event handlers
function getPositionFromMouseEvent(mouseEvent, canvas) {
    const horizontalPixel = getHorizontalPixelFromMouseEvent(mouseEvent, canvas);
    const columnNumber = getTileNumberFromPixel(horizontalPixel);
    const verticalPixel = getVerticalPixelFromMouseEvent(mouseEvent, canvas);
    const rowNumber = getTileNumberFromPixel(verticalPixel);
    return [columnNumber, rowNumber];
}
function getHorizontalPixelFromMouseEvent(mouseEvent, canvas) {
    return mouseEvent.clientX - canvas.offsetLeft;
}
function getVerticalPixelFromMouseEvent(mouseEvent, canvas) {
    return mouseEvent.clientY - canvas.offsetTop;
}
function getTileNumberFromPixel(pixel) {
    return Math.floor(pixel / TILE_LENGTH);
}
function wireCanvasEventHandlers(canvas, context) {
    // 🚧 Accessing global variable gameBoard 🚧
    canvas.addEventListener("mousedown", mouseEvent => {
        isMouseDown = true;
        const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent, canvas);
        const stateAtMousePosition = gameBoard[columnNumber][rowNumber];
        const newToggledState = !stateAtMousePosition;
        gameBoard[columnNumber][rowNumber] = newToggledState;
        currentMouseState = newToggledState;
        redrawGameCanvas(context, gameBoard);
    });
    canvas.addEventListener("mousemove", mouseEvent => {
        if (isMouseDown) {
            const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent, canvas);
            gameBoard[columnNumber][rowNumber] = currentMouseState;
            redrawGameCanvas(context, gameBoard);
        }
    });
    canvas.addEventListener("mouseup", () => {
        isMouseDown = false;
    });
}
function wireDocumentEventHandlers(document) {
    document.addEventListener("keydown", keyBoardEvent => {
        const keyPressed = keyBoardEvent.key;
        const allowedKeys = Object.keys(keyActions);
        if (allowedKeys.includes(keyPressed)) {
            const action = keyActions[keyPressed];
            action();
        }
    });
    document.addEventListener("keydown", keyboardEvent => {
        if (keyboardEvent.key === HELP_KEY) {
            toggleHelpModal();
        }
    });
}
/** Menu listeners */
const keyActions = {
    [PAUSE_KEY]: () => {
        isPaused = !isPaused;
    },
    [INCREASE_KEY]: () => {
        gameSpeedLoopMs = Math.max(MAXIMUM_SPEED_GAME_LOOP_MS, gameSpeedLoopMs - DELTA_SPEED_GAME_MS);
    },
    [DECREASE_KEY]: () => {
        gameSpeedLoopMs = Math.min(MINIMUM_SPEED_GAME_LOOP_MS, gameSpeedLoopMs + DELTA_SPEED_GAME_MS);
    },
    [RANDOM_KEY]: () => {
        // 🚧 Accessing global variable gameBoard 🚧
        gameBoard = generateRandomGameBoard(gameBoard);
    },
    [CLEAR_KEY]: () => {
        // 🚧 Accessing global variable gameBoard 🚧
        const columnsCount = gameBoard.length;
        const rowsCount = gameBoard[0].length;
        gameBoard = prepareBoard(columnsCount, rowsCount);
    },
};
function generateRandomGameBoard(gameBoard) {
    const columnsCount = gameBoard.length;
    const rowsCount = gameBoard[0].length;
    const randomGameBoard = prepareBoard(columnsCount, rowsCount);
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            const isRandomlyAlive = Math.random() > LIVING_CHANCE;
            randomGameBoard[columnNumber][rowNumber] = isRandomlyAlive;
        }
    }
    return randomGameBoard;
}
/* Help button and modal */
const helpButton = document.querySelector(HELP_BUTTON_ID);
const helpModal = document.querySelector(HELP_MODAL_ID);
const toggleHelpModal = () => {
    helpModal?.classList.toggle("hidden");
};
helpButton?.addEventListener("click", toggleHelpModal);
