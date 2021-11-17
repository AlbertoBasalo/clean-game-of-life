"use strict";
/* eslint-disable max-lines */
// 🚧 Reduce complexity
// 🚧 Use functional programming style
// 🚧 No global variables
// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
const CANVAS_CONFIG = {
    id: "#game",
    tileLength: 10,
    fillStyle: "#f73454",
    strokeStyle: "#f73454",
    lineWidth: 1,
};
const GAME_SETTINGS = {
    initialSpeedLoopMs: 1000,
    maximumSpeedLoopMs: 50,
    minimumSpeedLoopMs: 200,
    deltaSpeedMs: 50,
};
const LIVING_RULES = {
    minimumNeighborsToKeepAlive: 2,
    maximumNeighborsToKeepAlive: 3,
    neededNeighborsToBorn: 3,
    alive: true,
    dead: false,
    randomLivingChance: 0.9,
    neighborDeltas: [-1, 0, 1],
};
const HELP_ELEMENTS = {
    buttonId: "#help-btn",
    modalId: "#help-msg",
};
const PAUSE_KEY = "p";
const INCREASE_KEY = "+";
const DECREASE_KEY = "-";
const RANDOM_KEY = "r";
const CLEAR_KEY = "c";
const HELP_KEY = "?";
// 🚧 Keep this global variable for now 🚧
const gameStatus = {
    isPaused: false,
    speedLoopMs: GAME_SETTINGS.initialSpeedLoopMs,
};
const mouseState = {
    current: LIVING_RULES.alive,
    isDown: false,
};
let gameBoard;
initializeGame();
function initializeGame() {
    console.log("initialization");
    const canvas = document.querySelector(CANVAS_CONFIG.id);
    if (!canvas)
        return;
    const context = canvas.getContext("2d");
    if (!context)
        return;
    const canvasContext = {
        canvas,
        context,
        size: { height: window.innerHeight, width: window.innerWidth },
    };
    const boardSize = {
        columnsCount: Math.floor(canvasContext.size.width / CANVAS_CONFIG.tileLength),
        rowsCount: Math.floor(canvasContext.size.height / CANVAS_CONFIG.tileLength),
    };
    gameBoard = prepareBoard(boardSize);
    initializeCanvas(canvasContext);
    wireCanvasEventHandlers(canvasContext);
    wireDocumentEventHandlers(document);
    initializeBoard(gameBoard);
    drawBoard(canvasContext, gameBoard);
    initializeHelp(document);
    performLoop(canvasContext, boardSize, gameStatus);
}
async function performLoop(canvasContext, boardSize, gameStatus) {
    // 🚧 Accessing global variables 🚧
    if (gameStatus.isPaused) {
        return;
    }
    const newBoard = drawNextGeneration(canvasContext, boardSize, gameBoard);
    gameBoard = newBoard;
    setTimeout(performLoop, gameStatus.speedLoopMs, canvasContext, boardSize, gameStatus, gameBoard);
}
function initializeCanvas(canvasContext) {
    canvasContext.canvas.width = canvasContext.size.width;
    canvasContext.canvas.height = canvasContext.size.height;
    canvasContext.context.fillStyle = CANVAS_CONFIG.fillStyle;
    canvasContext.context.strokeStyle = CANVAS_CONFIG.strokeStyle;
    canvasContext.context.lineWidth = CANVAS_CONFIG.lineWidth;
}
function initializeBoard(gameBoard) {
    gameBoard[0][2] = LIVING_RULES.alive;
    gameBoard[1][0] = LIVING_RULES.alive;
    gameBoard[1][2] = LIVING_RULES.alive;
    gameBoard[2][1] = LIVING_RULES.alive;
    gameBoard[2][2] = LIVING_RULES.alive;
}
function prepareBoard(boardSize) {
    const board = [];
    for (let columnNumber = 0; columnNumber < boardSize.columnsCount; columnNumber++) {
        const row = [];
        for (let rowNumber = 0; rowNumber < boardSize.rowsCount; rowNumber++) {
            row.push(LIVING_RULES.dead);
        }
        board.push(row);
    }
    return board;
}
function clearCanvas(canvasContext) {
    canvasContext.context.clearRect(0, 0, canvasContext.size.width, canvasContext.size.height);
}
function drawBoard(canvasContext, gameBoard) {
    const columnsCount = gameBoard.length;
    const rowsCount = gameBoard[0].length;
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            drawCell(canvasContext.context, gameBoard, rowNumber, columnNumber);
        }
    }
}
function drawCell(context, gameBoard, rowNumber, columnNumber) {
    if (isAlive(gameBoard, columnNumber, rowNumber)) {
        context.fillRect(columnNumber * CANVAS_CONFIG.tileLength, rowNumber * CANVAS_CONFIG.tileLength, CANVAS_CONFIG.tileLength, CANVAS_CONFIG.tileLength);
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
function calculateNextGeneration(currentBoard, boardSize) {
    const nextGameBoard = prepareBoard(boardSize);
    for (let columnNumber = 0; columnNumber < boardSize.columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < boardSize.rowsCount; rowNumber++) {
            const newCellState = calculateNextGenerationCell(currentBoard, rowNumber, columnNumber);
            nextGameBoard[columnNumber][rowNumber] = newCellState;
        }
    }
    return nextGameBoard;
}
function calculateNextGenerationCell(gameBoard, rowNumber, columnNumber) {
    let numberOfLivingNeighbors = 0;
    for (const deltaRow of LIVING_RULES.neighborDeltas) {
        for (const deltaColumn of LIVING_RULES.neighborDeltas) {
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
            return LIVING_RULES.alive;
        }
    }
    else {
        if (canBorn(numberOfLivingNeighbors)) {
            return LIVING_RULES.alive;
        }
    }
    return LIVING_RULES.dead;
}
function canKeepAlive(numberOfLivingNeighbors) {
    const isMinimum = numberOfLivingNeighbors == LIVING_RULES.minimumNeighborsToKeepAlive;
    const isMaximum = numberOfLivingNeighbors == LIVING_RULES.maximumNeighborsToKeepAlive;
    return isMinimum || isMaximum;
}
function canBorn(countLiveNeighbors) {
    return countLiveNeighbors == LIVING_RULES.neededNeighborsToBorn;
}
function isNotMe(deltaRow, deltaColumn) {
    const hasHorizontalDelta = deltaRow !== 0;
    const hasVerticalDelta = deltaColumn !== 0;
    return hasHorizontalDelta || hasVerticalDelta;
}
function redrawGameCanvas(canvasContext, gameBoard) {
    clearCanvas(canvasContext);
    drawBoard(canvasContext, gameBoard);
}
function drawNextGeneration(canvasContext, boardSize, gameBoard) {
    const nextGameBoard = calculateNextGeneration(gameBoard, boardSize);
    redrawGameCanvas(canvasContext, nextGameBoard);
    return nextGameBoard;
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
    return Math.floor(pixel / CANVAS_CONFIG.tileLength);
}
function wireCanvasEventHandlers(canvasContext) {
    // 🚧 Accessing global variable gameBoard 🚧
    canvasContext.canvas.addEventListener("mousedown", mouseEvent => {
        mouseState.isDown = true;
        const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent, canvasContext.canvas);
        const stateAtMousePosition = gameBoard[columnNumber][rowNumber];
        const newToggledState = !stateAtMousePosition;
        gameBoard[columnNumber][rowNumber] = newToggledState;
        mouseState.current = newToggledState;
        redrawGameCanvas(canvasContext, gameBoard);
    });
    canvasContext.canvas.addEventListener("mousemove", mouseEvent => {
        if (mouseState.isDown) {
            const [columnNumber, rowNumber] = getPositionFromMouseEvent(mouseEvent, canvasContext.canvas);
            gameBoard[columnNumber][rowNumber] = mouseState.current;
            redrawGameCanvas(canvasContext, gameBoard);
        }
    });
    canvasContext.canvas.addEventListener("mouseup", () => {
        mouseState.isDown = false;
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
}
/** Menu listeners */
const keyActions = {
    [PAUSE_KEY]: () => {
        gameStatus.isPaused = !gameStatus.isPaused;
    },
    [INCREASE_KEY]: () => {
        gameStatus.speedLoopMs = Math.max(GAME_SETTINGS.maximumSpeedLoopMs, gameStatus.speedLoopMs - GAME_SETTINGS.deltaSpeedMs);
    },
    [DECREASE_KEY]: () => {
        gameStatus.speedLoopMs = Math.min(GAME_SETTINGS.minimumSpeedLoopMs, gameStatus.speedLoopMs + GAME_SETTINGS.deltaSpeedMs);
    },
    [RANDOM_KEY]: () => {
        // 🚧 Accessing global variable gameBoard 🚧
        gameBoard = generateRandomGameBoard(gameBoard);
    },
    [CLEAR_KEY]: () => {
        // 🚧 Accessing global variable gameBoard 🚧
        const columnsCount = gameBoard.length;
        const rowsCount = gameBoard[0].length;
        gameBoard = prepareBoard({ columnsCount, rowsCount });
    },
};
function generateRandomGameBoard(gameBoard) {
    const columnsCount = gameBoard.length;
    const rowsCount = gameBoard[0].length;
    const randomGameBoard = prepareBoard({ columnsCount, rowsCount });
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            const isRandomlyAlive = Math.random() > LIVING_RULES.randomLivingChance;
            randomGameBoard[columnNumber][rowNumber] = isRandomlyAlive;
        }
    }
    return randomGameBoard;
}
/* Help button and modal */
function initializeHelp(document) {
    const helpButton = document.querySelector(HELP_ELEMENTS.buttonId);
    const helpModal = document.querySelector(HELP_ELEMENTS.modalId);
    const toggleHelpModal = () => {
        helpModal?.classList.toggle("hidden");
    };
    helpButton?.addEventListener("click", toggleHelpModal);
    document.addEventListener("keydown", keyboardEvent => {
        if (keyboardEvent.key === HELP_KEY) {
            toggleHelpModal();
        }
    });
}
