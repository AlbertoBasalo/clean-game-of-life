export var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["Dead"] = 0] = "Dead";
    CellStatus[CellStatus["Alive"] = 1] = "Alive";
})(CellStatus || (CellStatus = {}));
export class Board {
    size;
    cells;
    constructor(size) {
        this.size = size;
        this.cells = this.create();
    }
    clear() {
        for (let column = 0; column < this.size.columns; column++) {
            for (let row = 0; row < this.size.rows; row++) {
                this.cells[column][row] = CellStatus.Dead;
            }
        }
    }
    countLivingNeighbors(cell, neighborDeltas) {
        let numberOfLivingNeighbors = 0;
        for (const deltaRow of neighborDeltas) {
            for (const deltaColumn of neighborDeltas) {
                const delta = { column: deltaColumn, row: deltaRow };
                const hasLivingNeighbor = this.hasLiveNeighbor(delta, cell);
                numberOfLivingNeighbors += hasLivingNeighbor ? 1 : 0;
            }
        }
        return numberOfLivingNeighbors;
    }
    setStatus(cell, status) {
        if (this.isOutsideBoard(cell))
            return;
        this.cells[cell.column][cell.row] = status;
    }
    getStatus(cell) {
        if (this.isOutsideBoard(cell))
            return CellStatus.Dead;
        return this.cells[cell.column][cell.row];
    }
    hasLiveNeighbor(delta, cell) {
        if (this.isMe(delta)) {
            return false;
        }
        const neighbor = {
            column: cell.column + delta.column,
            row: cell.row + delta.row,
        };
        return this.getStatus(neighbor) === CellStatus.Alive ? true : false;
    }
    isMe(delta) {
        const hasNoHorizontalDelta = delta.row === 0;
        const hasNoVerticalDelta = delta.column === 0;
        return hasNoHorizontalDelta && hasNoVerticalDelta;
    }
    isOutsideBoard(cell) {
        if (cell.column < 0)
            return true;
        if (cell.column >= this.size.columns)
            return true;
        if (cell.row < 0)
            return true;
        if (cell.row >= this.size.rows)
            return true;
        return false;
    }
    create() {
        const cells = [];
        for (let column = 0; column < this.size.columns; column++) {
            const rowCells = [];
            for (let row = 0; row < this.size.rows; row++) {
                rowCells.push(CellStatus.Dead);
            }
            cells.push(rowCells);
        }
        return cells;
    }
}
