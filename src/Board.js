// Board.js — Estado del grid y colisiones (equivalente a board.py)

const COLS = 10;
const ROWS = 20;

class Board {
  constructor() {
    this.grid = this._emptyGrid();
  }

  _emptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  reset() {
    this.grid = this._emptyGrid();
  }

  // ── Colisión ──────────────────────────────────────────────────────────────
  isValid(blocks) {
    for (const [col, row] of blocks) {
      if (col < 0 || col >= COLS) return false;
      if (row >= ROWS) return false;
      if (row >= 0 && this.grid[row][col] !== null) return false;
    }
    return true;
  }

  // ── Rotación con wall kick ────────────────────────────────────────────────
  tryRotate(piece) {
    const newRot = piece.rotateCW();
    const kicks = piece.getKicks(piece.rotation, newRot);
    for (const [dx, dy] of kicks) {
      const blocks = piece._blocksAt(piece.x + dx, piece.y + dy, newRot);
      if (this.isValid(blocks)) {
        piece.x += dx;
        piece.y += dy;
        piece.rotation = newRot;
        return true;
      }
    }
    return false;
  }

  // ── Movimiento ────────────────────────────────────────────────────────────
  move(piece, dx, dy) {
    const blocks = piece._blocksAt(piece.x + dx, piece.y + dy, piece.rotation);
    if (this.isValid(blocks)) {
      piece.x += dx;
      piece.y += dy;
      return true;
    }
    return false;
  }

  hardDropDistance(piece) {
    let dist = 0;
    while (true) {
      const blocks = piece._blocksAt(piece.x, piece.y + dist + 1, piece.rotation);
      if (!this.isValid(blocks)) break;
      dist++;
    }
    return dist;
  }

  // ── Fijar pieza ───────────────────────────────────────────────────────────
  lockPiece(piece) {
    for (const [col, row] of piece.blocks) {
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        this.grid[row][col] = piece.color;
      }
    }
    return this._findFullRows();
  }

  _findFullRows() {
    return this.grid.reduce((acc, row, i) => {
      if (row.every(cell => cell !== null)) acc.push(i);
      return acc;
    }, []);
  }

  clearRows(rows) {
    const sorted = [...rows].sort((a, b) => b - a);
    for (const r of sorted) {
      this.grid.splice(r, 1);
      this.grid.unshift(Array(COLS).fill(null));
    }
  }

  isToppedOut(piece) {
    return !this.isValid(piece.blocks);
  }
}

export default Board;
