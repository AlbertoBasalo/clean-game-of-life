import { Board, CellStatus, Position } from "./board";

export class Game {
  constructor(private board: Board) {
    this.initializeFixed();
  }

  public initializeFixed() {
    this.board.clear();
    this.board.setStatus({ column: 0, row: 2 }, CellStatus.Alive);
    this.board.setStatus({ column: 1, row: 0 }, CellStatus.Alive);
    this.board.setStatus({ column: 1, row: 2 }, CellStatus.Alive);
    this.board.setStatus({ column: 2, row: 1 }, CellStatus.Alive);
    this.board.setStatus({ column: 2, row: 2 }, CellStatus.Alive);
  }
  public initializeRandom() {
    this.board.clear();
    for (let column = 0; column < this.board.size.columns; column++) {
      for (let row = 0; row < this.board.size.rows; row++) {
        const isRandomlyAlive =
          Math.random() > this.getRules().randomLivingChance;
        const cellStatus = isRandomlyAlive ? CellStatus.Alive : CellStatus.Dead;
        this.board.setStatus({ column, row }, cellStatus);
      }
    }
  }
  public setNextGenerationBoard() {
    const nextBoard = this.getNextBoardFromCurrentBoard();
    this.setCurrentFromNextBoard(nextBoard);
  }
  public isAlive(cell: Position): boolean {
    return this.board.getStatus(cell) === CellStatus.Alive;
  }

  private getNextBoardFromCurrentBoard(): Board {
    const nextBoard = new Board(this.board.size);
    for (let column = 0; column < this.board.size.columns; column++) {
      for (let row = 0; row < this.board.size.rows; row++) {
        const cell: Position = { column, row };
        const nextCellStatus = this.getNextCellStatus(cell);
        nextBoard.setStatus({ column, row }, nextCellStatus);
      }
    }
    return nextBoard;
  }
  private setCurrentFromNextBoard(nextBoard: Board) {
    for (let column = 0; column < this.board.size.columns; column++) {
      for (let row = 0; row < this.board.size.rows; row++) {
        const cellPosition = { column, row };
        const nextCellStatus = nextBoard.getStatus(cellPosition);
        this.board.setStatus(cellPosition, nextCellStatus);
      }
    }
  }

  private getNextCellStatus(cell: Position): CellStatus {
    const numberOfLivingNeighbors = this.getNumberOfLivingNeighbors(cell);
    if (this.isAlive(cell)) {
      if (this.canKeepAlive(numberOfLivingNeighbors)) {
        return CellStatus.Alive;
      }
    } else {
      if (this.canBorn(numberOfLivingNeighbors)) {
        return CellStatus.Alive;
      }
    }
    return CellStatus.Dead;
  }

  private getNumberOfLivingNeighbors(cell: Position): number {
    return this.board.countLivingNeighbors(
      cell,
      this.getRules().neighborDeltas
    );
  }
  private canBorn(numberOfLivingNeighbors: number) {
    return numberOfLivingNeighbors == this.getRules().neededNeighborsToBorn;
  }
  private canKeepAlive(numberOfLivingNeighbors: number): boolean {
    const isMinimum =
      numberOfLivingNeighbors == this.getRules().minimumNeighborsToKeepAlive;
    const isMaximum =
      numberOfLivingNeighbors == this.getRules().maximumNeighborsToKeepAlive;
    return isMinimum || isMaximum;
  }
  private getRules() {
    const LIVING_RULES = {
      minimumNeighborsToKeepAlive: 2,
      maximumNeighborsToKeepAlive: 3,
      neededNeighborsToBorn: 3,
      alive: true,
      dead: false,
      randomLivingChance: 0.9,
      neighborDeltas: [-1, 0, 1],
    };
    return LIVING_RULES;
  }
}
