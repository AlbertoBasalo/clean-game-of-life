type CanvasPixelsSize = {
  width: number;
  height: number;
};

export class CanvasPainter {
  public size: CanvasPixelsSize;
  public canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(window: Window, document: Document) {
    this.size = this.getSize(window);
    this.canvas = this.getCanvas(document);
    this.context = this.getContext();
  }

  public clear() {
    this.context.clearRect(0, 0, this.size.width, this.size.height);
  }
  public fillCell(column: number, row: number) {
    const tileLength = this.getConfig().tileLength;
    this.context.fillRect(
      column * tileLength,
      row * tileLength,
      tileLength,
      tileLength
    );
  }
  public getTileFromPixel(pixelX: number, pixelY: number): [number, number] {
    const canvasPixelX = pixelX - this.canvas.offsetLeft;
    const canvasPixelY = pixelY - this.canvas.offsetTop;
    const columnNumber = Math.floor(canvasPixelX / this.getConfig().tileLength);
    const rowNumber = Math.floor(canvasPixelY / this.getConfig().tileLength);
    const tile: [number, number] = [columnNumber, rowNumber];
    return tile;
  }
  public getSizeInTiles(): { columns: number; rows: number } {
    const columns = Math.floor(this.size.width / this.getConfig().tileLength);
    const rows = Math.floor(this.size.height / this.getConfig().tileLength);
    return { columns, rows };
  }

  private getCanvas(document: Document) {
    const canvas = document.querySelector<HTMLCanvasElement>(
      this.getConfig().id
    );
    if (canvas) {
      return canvas;
    } else {
      throw new Error("No canvas elemento with ID:" + this.getConfig().id);
    }
  }
  private getContext() {
    const context = this.canvas.getContext("2d");
    if (context) {
      context.fillStyle = this.getConfig().fillStyle;
      context.strokeStyle = this.getConfig().strokeStyle;
      context.lineWidth = this.getConfig().lineWidth;
      return context;
    } else {
      throw new Error("No 2d context found");
    }
  }
  private getSize(window: Window): CanvasPixelsSize {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  private getConfig() {
    // To Do: get like a dependency on constructor
    const CANVAS_CONFIG = {
      id: "#game",
      tileLength: 10,
      fillStyle: "#f73454",
      strokeStyle: "#f73454",
      lineWidth: 1,
    };
    return CANVAS_CONFIG;
  }
}
