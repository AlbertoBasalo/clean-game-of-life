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
        this.game = this.buildGame();
        this.wireUserEvents();
    }
    playGame() {
        setInterval(this.performLoop.bind(this), this.loopSpeedMs);
    }
    initializeCanvas() {
        const canvas = new CanvasPainter(this.window, this.document);
        canvas.clear();
        return canvas;
    }
    buildGame() {
        const boardSize = this.canvasPainter.getSizeInTiles();
        const board = new Board(boardSize);
        return new Game(board, this.canvasPainter);
    }
    wireUserEvents() {
        this.document.addEventListener("keydown", keyBoardEvent => { });
        const canvas = this.canvasPainter.canvas;
        canvas.addEventListener("mousedown", mouseEvent => { });
        canvas.addEventListener("mousemove", mouseEvent => { });
        canvas.addEventListener("mouseup", () => { });
    }
    performLoop() {
        if (this.isGamePaused)
            return;
        this.game.performNextGeneration();
    }
}
