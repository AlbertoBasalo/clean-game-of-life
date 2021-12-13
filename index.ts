/* Game of life
 * source of inspiration
 * https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
 */

const canvas = document.querySelector<HTMLCanvasElement>("#game");
// const width = canvas.width;
// const height = canvas.height;
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

const prepareBoard = (): boolean[][] => {
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
const drawBorders = () => {
  for (let i = 0; i < tiles_x; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 10 - 0.5, 0);
    ctx.lineTo(i * 10 - 0.5, height);
    ctx.stroke();
  }

  for (let j = 0; j < tiles_y; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * 10 - 0.5);
    ctx.lineTo(width, j * 10 - 0.5);
    ctx.stroke();
  }
};




const drawBoard = (board: boolean[][]) => {
  for (let i = 0; i < tiles_x; i++) {
    for (let j = 0; j < tiles_y; j++) {


      if (!board[i][j]) {
        continue;
      }
      ctx.fillRect(i * 10, j * 10, 10, 10);
    }
  }
};

const alive = (x: number, y: number): number => {
  if (x < 0 || x >= tiles_x || y < 0 || y >= tiles_y) {
    return 0;
  }
  return BOARD[x][y] ? 1 : 0;
};

const neighborsCount = (i: number, j: number): number => {
  let count = 0;
  for (let k of [-1, 0, 1]) {
    for (let l of [-1, 0, 1]) {
      if (!(k === 0 && l === 0)) {
        count += alive(i + k, j + l);
      }
    }
  }
  return count;
};

BOARD[1][0] = true;
BOARD[2][1] = true;
BOARD[0][2] = true;
BOARD[1][2] = true;
BOARD[2][2] = true;

const makeGlider = (x: number, y: number): void => {
  BOARD[x + 1][y] = true;
  BOARD[x + 2][y + 1] = true;
  BOARD[x][y + 2] = true;
  BOARD[x + 1][y + 2] = true;
  BOARD[x + 2][y + 2] = true;
};

const nextGeneration = () => {
  const board = prepareBoard();
  for (let i = 0; i < tiles_x; i++) {
    for (let j = 0; j < tiles_y; j++) {


      let count = 0;
      for (let k of [-1, 0, 1]) {
        for (let l of [-1, 0, 1]) {
          if (!(k === 0 && l === 0)) {
            count += alive(i + k, j + l);
          }
        }
      }
      if (!alive(i, j)) {
        if (count === 3) {
            board[i][j] = true;
        }
      } else {
        if (count == 2 || count == 3) {
          board[i][j] = true;
        }
      }
    }
  }
  return board;
};

// BOARD[4][5] = true;
// BOARD[10][10] = true;

// BOARD[0][0] = true;
// BOARD[1][0] = true;

// makeGlider(20, 20);
// makeGlider(0, 0);
// makeGlider(5, 10);
// makeGlider(10, 20);
// for(let i=0;i<40;i+=10) {
//     makeGlider(i,i);
// }

const drawAll = () => {
  clear();
  drawBoard(BOARD);
  // drawBorders();
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

// canvas.addEventListener("click", e => {
//     console.log("CLICK");
//     console.log(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

//     const x = Math.floor( (e.clientX - canvas.offsetLeft) / TILE_SIZE);
//     const y = Math.floor( (e.clientY - canvas.offsetTop) / TILE_SIZE);
//     console.log(x, y);
//     BOARD[x][y] = !BOARD[x][y];
//     drawAll();
// });

let drawing = true;
let mouseDown = false;

function getPositionFromEvent(e){
  const x = Math.floor((e.clientX - canvas.offsetLeft) / 10);
  const y = Math.floor((e.clientY - canvas.offsetTop) / 10);
  return [x, y];
};

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  const [x, y] = getPositionFromEvent(e);
  drawing = !BOARD[x][y];
  BOARD[x][y] = drawing;
  drawAll();
});

canvas.addEventListener('mousemove', (e) => {
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

document.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.key === "p") {
    paused = !paused;
  } else if (e.key === "+") {
    gameSpeed = Math.max(50, gameSpeed - 50);
  } else if (e.key === "-") {
    gameSpeed = Math.min(2000, gameSpeed + 50);
  } else if (e.key === "r") {
    BOARD = generateRandom();
    drawAll();
  } else if (e.key === "c") {
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

document.addEventListener("keydown", (e) => {
  if (e.key === "?") { toggleModal(); }
});

btn.addEventListener("click", toggleModal);
