export class CanvasPainter {
    size;
    canvas;
    context;
    constructor(window, document) {
        this.size = this.getSize(window);
        this.canvas = this.getCanvas(document);
        this.context = this.getContext();
    }
    clear() {
        this.context.clearRect(0, 0, this.size.width, this.size.height);
    }
    fillCell(column, row) {
        const tileLength = this.getConfig().tileLength;
        this.context.fillRect(column * tileLength, row * tileLength, tileLength, tileLength);
    }
    getTileFromPixel(pixelX, pixelY) {
        const canvasPixelX = pixelX - this.canvas.offsetLeft;
        const canvasPixelY = pixelY - this.canvas.offsetTop;
        const columnNumber = Math.floor(canvasPixelX / this.getConfig().tileLength);
        const rowNumber = Math.floor(canvasPixelY / this.getConfig().tileLength);
        const tile = [columnNumber, rowNumber];
        return tile;
    }
    getSizeInTiles() {
        const columns = Math.floor(this.size.width / this.getConfig().tileLength);
        const rows = Math.floor(this.size.height / this.getConfig().tileLength);
        return { columns, rows };
    }
    getCanvas(document) {
        const canvas = document.querySelector(this.getConfig().id);
        if (canvas) {
            return canvas;
        }
        else {
            throw new Error("No canvas elemento with ID:" + this.getConfig().id);
        }
    }
    getContext() {
        const context = this.canvas.getContext("2d");
        if (context) {
            context.fillStyle = this.getConfig().fillStyle;
            context.strokeStyle = this.getConfig().strokeStyle;
            context.lineWidth = this.getConfig().lineWidth;
            return context;
        }
        else {
            throw new Error("No 2d context found");
        }
    }
    getSize(window) {
        return { width: window.innerWidth, height: window.innerHeight };
    }
    getConfig() {
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
