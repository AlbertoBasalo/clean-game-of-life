// https://medium.com/hypersphere-codes/conways-game-of-life-in-typescript-a955aec3bd49
const canvas = document.querySelector<HTMLCanvasElement>('#game');
// const width = canvas.width;
// const height = canvas.height;
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

const TILE_SIZE = 10;
const TILES_X = Math.floor(width / TILE_SIZE);
const TILES_Y = Math.floor(height / TILE_SIZE);

ctx.fillStyle = 'rgb(100, 240, 150)';
ctx.strokeStyle = 'rgb(90, 90, 90)';
ctx.lineWidth = 1;

let isGamePaused = false;
let gameSpeed = 1000;

const prepareBoard = (): boolean[][] => {
  const b = [];
  for (let i = 0; i < TILES_X; i++) {
    const row = [];
    for (let j = 0; j < TILES_Y; j++) {
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
  for (let i = 0; i < TILES_X; i++) {
    ctx.beginPath();
    ctx.moveTo(i * TILE_SIZE - 0.5, 0);
    ctx.lineTo(i * TILE_SIZE - 0.5, height);
    ctx.stroke();
  }

  for (let j = 0; j < TILES_Y; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * TILE_SIZE - 0.5);
    ctx.lineTo(width, j * TILE_SIZE - 0.5);
    ctx.stroke();
  }
};

const drawBoard = (board: boolean[][]) => {
  for (let i = 0; i < TILES_X; i++) {
    for (let j = 0; j < TILES_Y; j++) {
      if (!board[i][j]) {
        continue;
      }
      ctx.fillRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
};

const isAlive = (x: number, y: number): number => {
  if (x < 0 || x >= TILES_X || y < 0 || y >= TILES_Y) {
    return 0;
  }
  return BOARD[x][y] ? 1 : 0;
};

const neighborsCount = (x: number, y: number): number => {
  let count = 0;
  for (let i of [-1, 0, 1]) {
    for (let j of [-1, 0, 1]) {
      if (!(i === 0 && j === 0)) {
        count += isAlive(x + i, y + j);
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

const computeNextGeneration = () => {
  const board = prepareBoard();
  for (let i = 0; i < TILES_X; i++) {
    for (let j = 0; j < TILES_Y; j++) {
      if (!isAlive(i, j)) {
        if (neighborsCount(i, j) === 3) {
          board[i][j] = true;
        }
      } else {
        const count = neighborsCount(i, j);
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
  if (isGamePaused) {
    return;
  }
  BOARD = computeNextGeneration();
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

let isDrawMode = true;
let isMouseDown = false;

const getPositionFromEvent = (e) => {
  const x = Math.floor((e.clientX - canvas.offsetLeft) / TILE_SIZE);
  const y = Math.floor((e.clientY - canvas.offsetTop) / TILE_SIZE);
  return [x, y];
};

canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  const [x, y] = getPositionFromEvent(e);
  isDrawMode = !BOARD[x][y];
  BOARD[x][y] = isDrawMode;
  drawAll();
});

canvas.addEventListener('mousemove', (e) => {
  if (!isMouseDown) {
    return;
  }
  const [x, y] = getPositionFromEvent(e);
  BOARD[x][y] = isDrawMode;
  drawAll();
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

const generateRandom = () => {
  const board = prepareBoard();
  for (let i = 0; i < TILES_X; i++) {
    for (let j = 0; j < TILES_Y; j++) {
      board[i][j] = Math.random() > 0.9;
    }
  }
  return board;
};

document.addEventListener('keydown', (e) => {
  console.log(e);
  if (e.key === 'p') {
    isGamePaused = !isGamePaused;
  } else if (e.key === '+') {
    gameSpeed = Math.max(50, gameSpeed - 50);
  } else if (e.key === '-') {
    gameSpeed = Math.min(2000, gameSpeed + 50);
  } else if (e.key === 'r') {
    BOARD = generateRandom();
    drawAll();
  } else if (e.key === 'c') {
    BOARD = prepareBoard();
    drawAll();
  }
});

/* MODAL */
const btn = document.querySelector('#help-btn');
const modal = document.querySelector('#help-msg');

const toggleModal = () => {
  modal.classList.toggle('hidden');
};

document.addEventListener('keydown', (e) => {
  if (e.key === '?') {
    toggleModal();
  }
});

btn.addEventListener('click', toggleModal);
