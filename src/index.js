/* eslint-disable max-lines */
// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
const columnsCount = Math.floor(width / 10);
const rowsCount = Math.floor(height / 10);
canvas.width = width;
canvas.height = height;
context.fillStyle = "#f73454";
context.strokeStyle = "#f73454";
context.lineWidth = 1;
let isPaused = false;
let gameSpeedMsLoop = 1000;
const prepareBoard = () => {
    const board = [];
    for (let columnNumber = 0; columnNumber < columnsCount; columnNumber++) {
        const row = [];
        for (let rowNumber = 0; rowNumber < rowsCount; rowNumber++) {
            row.push(false);
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
            context.fillRect(columnNumber * 10, rowNumber * 10, 10, 10);
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
gameBoard[1][0] = true;
gameBoard[2][1] = true;
gameBoard[0][2] = true;
gameBoard[1][2] = true;
gameBoard[2][2] = true;
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
                if (countLiveNeighbors === 3) {
                    board[columnNumber][rowNumber] = true;
                }
            }
            else {
                if (countLiveNeighbors == 2 || countLiveNeighbors == 3) {
                    board[columnNumber][rowNumber] = true;
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
    setTimeout(nextGenLoop, gameSpeedMsLoop);
};
nextGenLoop();
let isDrawing = true;
let isMouseDown = false;
function getPositionFromMouseEvent(mouseEvent) {
    const columnNumber = Math.floor((mouseEvent.clientX - canvas.offsetLeft) / 10);
    const rowNumber = Math.floor((mouseEvent.clientY - canvas.offsetTop) / 10);
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
            board[columnNumber][rowNumber] = Math.random() > 0.9;
        }
    }
    return board;
};
document.addEventListener("keydown", keyBoardEvent => {
    console.log(keyBoardEvent);
    if (keyBoardEvent.key === "p") {
        isPaused = !isPaused;
    }
    else if (keyBoardEvent.key === "+") {
        gameSpeedMsLoop = Math.max(50, gameSpeedMsLoop - 50);
    }
    else if (keyBoardEvent.key === "-") {
        gameSpeedMsLoop = Math.min(2000, gameSpeedMsLoop + 50);
    }
    else if (keyBoardEvent.key === "r") {
        gameBoard = generateRandom();
        redraw();
    }
    else if (keyBoardEvent.key === "c") {
        gameBoard = prepareBoard();
        redraw();
    }
});
/* MODAL */
const helpButton = document.querySelector("#help-btn");
const helpModal = document.querySelector("#help-msg");
const toggleHelpModal = () => {
    helpModal.classList.toggle("hidden");
};
document.addEventListener("keydown", keyboardEvent => {
    if (keyboardEvent.key === "?") {
        toggleHelpModal();
    }
});
helpButton.addEventListener("click", toggleHelpModal);
