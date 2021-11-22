import { Board, BoardSize, Position } from "./board.js";
import { CanvasPainter } from "./canvas-painter.js";
import { Game } from "./game.js";

export class GoL {
  private canvasPainter: CanvasPainter;
  private game: Game;
  private boardSize: BoardSize;
  private isGamePaused: boolean = false;
  private loopSpeedMs: number = 1000;

  constructor(private window: Window, private document: Document) {
    this.canvasPainter = this.initializeCanvas();
    this.boardSize = this.canvasPainter.getSizeInTiles();
    this.game = this.buildGame();
    this.wireUserEvents();
    this.playGame();
  }

  private initializeCanvas() {
    const canvas = new CanvasPainter(this.window, this.document);
    canvas.clear();
    return canvas;
  }
  private buildGame(): Game {
    const board = new Board(this.boardSize);
    return new Game(board);
  }
  private wireUserEvents() {
    this.document.addEventListener("keydown", keyBoardEvent => {});
    this.canvasPainter.canvas.addEventListener("mousedown", mouseEvent => {});
    this.canvasPainter.canvas.addEventListener("mousemove", mouseEvent => {});
    this.canvasPainter.canvas.addEventListener("mouseup", () => {});
  }
  private playGame() {
    setInterval(this.performLoop.bind(this), this.loopSpeedMs);
  }
  private performLoop() {
    if (this.isGamePaused) return;
    this.game.setNextGenerationBoard();
    this.canvasPainter.clear();
    this.drawGameStatus();
  }

  private drawGameStatus() {
    for (let column = 0; column < this.boardSize.columns; column++) {
      for (let row = 0; row < this.boardSize.rows; row++) {
        const cell: Position = { column, row };
        if (this.game.isAlive(cell)) {
          this.canvasPainter.fillCell(column, row);
        }
      }
    }
  }
}
