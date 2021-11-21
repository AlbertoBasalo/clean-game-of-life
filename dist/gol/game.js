import { Board, CellStatus } from "./board.js";
export class Game {
    board;
    constructor(board) {
        this.board = board;
        this.initializeFixed();
    }
    initializeFixed() {
        this.board.clear();
        this.board.setStatus({ column: 0, row: 2 }, CellStatus.Alive);
        this.board.setStatus({ column: 1, row: 0 }, CellStatus.Alive);
        this.board.setStatus({ column: 1, row: 2 }, CellStatus.Alive);
        this.board.setStatus({ column: 2, row: 1 }, CellStatus.Alive);
        this.board.setStatus({ column: 2, row: 2 }, CellStatus.Alive);
    }
    initializeRandom() {
        this.board.clear();
        for (let column = 0; column < this.board.size.columns; column++) {
            for (let row = 0; row < this.board.size.rows; row++) {
                const isRandomlyAlive = Math.random() > this.getRules().randomLivingChance;
                const cellStatus = isRandomlyAlive ? CellStatus.Alive : CellStatus.Dead;
                this.board.setStatus({ column, row }, cellStatus);
            }
        }
    }
    setNextGenerationBoard() {
        const nextBoard = this.getNextBoardFromCurrentBoard();
        this.setCurrentFromNextBoard(nextBoard);
    }
    isAlive(cell) {
        return this.board.getStatus(cell) === CellStatus.Alive;
    }
    getNextBoardFromCurrentBoard() {
        const nextBoard = new Board(this.board.size);
        for (let column = 0; column < this.board.size.columns; column++) {
            for (let row = 0; row < this.board.size.rows; row++) {
                const cell = { column, row };
                const nextCellStatus = this.getNextCellStatus(cell);
                nextBoard.setStatus({ column, row }, nextCellStatus);
            }
        }
        return nextBoard;
    }
    setCurrentFromNextBoard(nextBoard) {
        for (let column = 0; column < this.board.size.columns; column++) {
            for (let row = 0; row < this.board.size.rows; row++) {
                const cellPosition = { column, row };
                const nextCellStatus = nextBoard.getStatus(cellPosition);
                this.board.setStatus(cellPosition, nextCellStatus);
            }
        }
    }
    getNextCellStatus(cell) {
        const numberOfLivingNeighbors = this.getNumberOfLivingNeighbors(cell);
        if (this.isAlive(cell)) {
            if (this.canKeepAlive(numberOfLivingNeighbors)) {
                return CellStatus.Alive;
            }
        }
        else {
            if (this.canBorn(numberOfLivingNeighbors)) {
                return CellStatus.Alive;
            }
        }
        return CellStatus.Dead;
    }
    getNumberOfLivingNeighbors(cell) {
        return this.board.countLivingNeighbors(cell, this.getRules().neighborDeltas);
    }
    canBorn(numberOfLivingNeighbors) {
        return numberOfLivingNeighbors == this.getRules().neededNeighborsToBorn;
    }
    canKeepAlive(numberOfLivingNeighbors) {
        const isMinimum = numberOfLivingNeighbors == this.getRules().minimumNeighborsToKeepAlive;
        const isMaximum = numberOfLivingNeighbors == this.getRules().maximumNeighborsToKeepAlive;
        return isMinimum || isMaximum;
    }
    getRules() {
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
