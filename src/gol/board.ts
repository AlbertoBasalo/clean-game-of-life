export type BoardSize = {
  columns: number;
  rows: number;
};

export type Position = {
  column: number;
  row: number;
};

export enum CellStatus {
  Dead = 0,
  Alive = 1,
}

export class Board {
  private cells: CellStatus[][];

  constructor(public size: BoardSize) {
    this.cells = this.create();
  }

  public clear() {
    for (let column = 0; column < this.size.columns; column++) {
      for (let row = 0; row < this.size.rows; row++) {
        this.cells[column][row] = CellStatus.Dead;
      }
    }
  }
  public countLivingNeighbors(
    cell: Position,
    neighborDeltas: number[]
  ): number {
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
  public setStatus(cell: Position, status: CellStatus) {
    if (this.isOutsideBoard(cell)) return;
    this.cells[cell.column][cell.row] = status;
  }
  public getStatus(cell: Position): CellStatus {
    if (this.isOutsideBoard(cell)) return CellStatus.Dead;
    return this.cells[cell.column][cell.row];
  }

  private hasLiveNeighbor(delta: Position, cell: Position): boolean {
    if (this.isMe(delta)) {
      return false;
    }
    const neighbor: Position = {
      column: cell.column + delta.column,
      row: cell.row + delta.row,
    };
    return this.getStatus(neighbor) === CellStatus.Alive ? true : false;
  }

  private isMe(delta: Position): boolean {
    const hasNoHorizontalDelta = delta.row === 0;
    const hasNoVerticalDelta = delta.column === 0;
    return hasNoHorizontalDelta && hasNoVerticalDelta;
  }
  private isOutsideBoard(cell: Position): boolean {
    if (cell.column < 0) return true;
    if (cell.column >= this.size.columns) return true;
    if (cell.row < 0) return true;
    if (cell.row >= this.size.rows) return true;
    return false;
  }
  private create() {
    const cells: CellStatus[][] = [];
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
