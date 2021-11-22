import { Board } from "./board.js";
import { CanvasPainter } from "./canvas-painter.js";
import { Game } from "./game.js";
export class GoL {
    constructor(window, document) {
        this.window = window;
        this.document = document;
        this.isGamePaused = false;
        this.loopSpeedMs = 1000;
        this.canvasPainter = this.initializeCanvas();
        this.boardSize = this.canvasPainter.getSizeInTiles();
        this.game = this.buildGame();
        this.wireUserEvents();
        this.playGame();
    }
    initializeCanvas() {
        const canvas = new CanvasPainter(this.window, this.document);
        canvas.clear();
        return canvas;
    }
    buildGame() {
        const board = new Board(this.boardSize);
        return new Game(board);
    }
    wireUserEvents() {
        this.document.addEventListener("keydown", keyBoardEvent => { });
        this.canvasPainter.canvas.addEventListener("mousedown", mouseEvent => { });
        this.canvasPainter.canvas.addEventListener("mousemove", mouseEvent => { });
        this.canvasPainter.canvas.addEventListener("mouseup", () => { });
    }
    playGame() {
        setInterval(this.performLoop.bind(this), this.loopSpeedMs);
    }
    performLoop() {
        if (this.isGamePaused)
            return;
        this.game.setNextGenerationBoard();
        this.canvasPainter.clear();
        this.drawGameStatus();
    }
    drawGameStatus() {
        for (let column = 0; column < this.boardSize.columns; column++) {
            for (let row = 0; row < this.boardSize.rows; row++) {
                const cell = { column, row };
                if (this.game.isAlive(cell)) {
                    this.canvasPainter.fillCell(column, row);
                }
            }
        }
    }
}
