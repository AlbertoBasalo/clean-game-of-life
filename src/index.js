/* eslint-disable max-lines */
// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
const canvas = document.querySelector("#game");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
const tiles_x = Math.floor(width / 10);
const tiles_y = Math.floor(height / 10);
ctx.fillStyle = "#f73454";
ctx.strokeStyle = "#f73454";
ctx.lineWidth = 1;
let paused = false;
let gameSpeed = 1000;
const prepareBoard = () => {
    const b = [];
    for (let i = 0; i < tiles_x; i++) {
        const row = [];
        for (let j = 0; j < tiles_y; j++) {
            row.push(false);
        }
        b.push(row);
    }
    return b;
};
let BOARD = prepareBoard();
const clear = () => {
    ctx.clearRect(0, 0, width, height);
};
const drawBoard = (board) => {
    for (let i = 0; i < tiles_x; i++) {
        for (let j = 0; j < tiles_y; j++) {
            if (!board[i][j]) {
                continue;
            }
            ctx.fillRect(i * 10, j * 10, 10, 10);
        }
    }
};
const alive = (x, y) => {
    if (x < 0 || x >= tiles_x || y < 0 || y >= tiles_y) {
        return 0;
    }
    return BOARD[x][y] ? 1 : 0;
};
BOARD[1][0] = true;
BOARD[2][1] = true;
BOARD[0][2] = true;
BOARD[1][2] = true;
BOARD[2][2] = true;
const nextGeneration = () => {
    const board = prepareBoard();
    for (let i = 0; i < tiles_x; i++) {
        for (let j = 0; j < tiles_y; j++) {
            let count = 0;
            for (const k of [-1, 0, 1]) {
                for (const l of [-1, 0, 1]) {
                    if (!(k === 0 && l === 0)) {
                        count += alive(i + k, j + l);
                    }
                }
            }
            if (!alive(i, j)) {
                if (count === 3) {
                    board[i][j] = true;
                }
            }
            else {
                if (count == 2 || count == 3) {
                    board[i][j] = true;
                }
            }
        }
    }
    return board;
};
const drawAll = () => {
    clear();
    drawBoard(BOARD);
};
const nextGen = () => {
    if (paused) {
        return;
    }
    BOARD = nextGeneration();
    drawAll();
};
const nextGenLoop = () => {
    nextGen();
    setTimeout(nextGenLoop, gameSpeed);
};
nextGenLoop();
let drawing = true;
let mouseDown = false;
function getPositionFromEvent(e) {
    const x = Math.floor((e.clientX - canvas.offsetLeft) / 10);
    const y = Math.floor((e.clientY - canvas.offsetTop) / 10);
    return [x, y];
}
canvas.addEventListener("mousedown", e => {
    mouseDown = true;
    const [x, y] = getPositionFromEvent(e);
    drawing = !BOARD[x][y];
    BOARD[x][y] = drawing;
    drawAll();
});
canvas.addEventListener("mousemove", e => {
    if (!mouseDown) {
        return;
    }
    const [x, y] = getPositionFromEvent(e);
    BOARD[x][y] = drawing;
    drawAll();
});
canvas.addEventListener("mouseup", () => {
    mouseDown = false;
});
const generateRandom = () => {
    const board = prepareBoard();
    for (let i = 0; i < tiles_x; i++) {
        for (let j = 0; j < tiles_y; j++) {
            board[i][j] = Math.random() > 0.9;
        }
    }
    return board;
};
document.addEventListener("keydown", e => {
    console.log(e);
    if (e.key === "p") {
        paused = !paused;
    }
    else if (e.key === "+") {
        gameSpeed = Math.max(50, gameSpeed - 50);
    }
    else if (e.key === "-") {
        gameSpeed = Math.min(2000, gameSpeed + 50);
    }
    else if (e.key === "r") {
        BOARD = generateRandom();
        drawAll();
    }
    else if (e.key === "c") {
        BOARD = prepareBoard();
        drawAll();
    }
});
/* MODAL */
const btn = document.querySelector("#help-btn");
const modal = document.querySelector("#help-msg");
const toggleModal = () => {
    modal.classList.toggle("hidden");
};
document.addEventListener("keydown", e => {
    if (e.key === "?") {
        toggleModal();
    }
});
btn.addEventListener("click", toggleModal);
