import { Board } from "./board.js";
import { CanvasPainter } from "./canvas-painter.js";
import { Game } from "./game.js";

export class GoL {
  private canvasPainter: CanvasPainter;
  private game: Game;
  private isGamePaused: boolean = false;
  private loopSpeedMs: number = 1000;

  constructor(private window: Window, private document: Document) {
    this.canvasPainter = this.initializeCanvas();
    this.game = this.buildGame();
    this.wireUserEvents();
  }

  public playGame() {
    setInterval(this.performLoop.bind(this), this.loopSpeedMs);
  }

  private initializeCanvas() {
    const canvas = new CanvasPainter(this.window, this.document);
    canvas.clear();
    return canvas;
  }
  private buildGame(): Game {
    const boardSize = this.canvasPainter.getSizeInTiles();
    const board = new Board(boardSize);
    return new Game(board, this.canvasPainter);
  }
  private wireUserEvents() {
    this.document.addEventListener("keydown", keyBoardEvent => {});
    const canvas = this.canvasPainter.canvas;
    canvas.addEventListener("mousedown", mouseEvent => {});
    canvas.addEventListener("mousemove", mouseEvent => {});
    canvas.addEventListener("mouseup", () => {});
  }
  private performLoop() {
    if (this.isGamePaused) return;
    this.game.performNextGeneration();
  }
}
