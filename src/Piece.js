// Piece.js — Definición de tetrominos (equivalente a piece.py)

const COLORS = {
  I: 0xFF2D95,
  O: 0xFF5FA2,
  T: 0xE60073,
  S: 0xFF99CC,
  Z: 0xFFC1DA,
  J: 0xC0C0C0,
  L: 0xFFFFFF,
};

const SHAPES = {
  I: [
    [[0,1],[1,1],[2,1],[3,1]],
    [[2,0],[2,1],[2,2],[2,3]],
    [[0,2],[1,2],[2,2],[3,2]],
    [[1,0],[1,1],[1,2],[1,3]],
  ],
  O: [
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[2,1]],
  ],
  T: [
    [[1,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[2,1],[1,2]],
    [[1,0],[0,1],[1,1],[1,2]],
  ],
  S: [
    [[1,0],[2,0],[0,1],[1,1]],
    [[1,0],[1,1],[2,1],[2,2]],
    [[1,1],[2,1],[0,2],[1,2]],
    [[0,0],[0,1],[1,1],[1,2]],
  ],
  Z: [
    [[0,0],[1,0],[1,1],[2,1]],
    [[2,0],[1,1],[2,1],[1,2]],
    [[0,1],[1,1],[1,2],[2,2]],
    [[1,0],[0,1],[1,1],[0,2]],
  ],
  J: [
    [[0,0],[0,1],[1,1],[2,1]],
    [[1,0],[2,0],[1,1],[1,2]],
    [[0,1],[1,1],[2,1],[2,2]],
    [[1,0],[1,1],[0,2],[1,2]],
  ],
  L: [
    [[2,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,2]],
    [[0,1],[1,1],[2,1],[0,2]],
    [[0,0],[1,0],[1,1],[1,2]],
  ],
};

// Wall kicks SRS básico
const WALL_KICKS = {
  '0>1': [[ 0,0],[-1,0],[-1,1],[ 0,-2],[-1,-2]],
  '1>0': [[ 0,0],[ 1,0],[ 1,-1],[ 0, 2],[ 1, 2]],
  '1>2': [[ 0,0],[ 1,0],[ 1,-1],[ 0, 2],[ 1, 2]],
  '2>1': [[ 0,0],[-1,0],[-1, 1],[ 0,-2],[-1,-2]],
  '2>3': [[ 0,0],[ 1,0],[ 1, 1],[ 0,-2],[ 1,-2]],
  '3>2': [[ 0,0],[-1,0],[-1,-1],[ 0, 2],[-1, 2]],
  '3>0': [[ 0,0],[-1,0],[-1,-1],[ 0, 2],[-1, 2]],
  '0>3': [[ 0,0],[ 1,0],[ 1, 1],[ 0,-2],[ 1,-2]],
};

const WALL_KICKS_I = {
  '0>1': [[ 0,0],[-2,0],[ 1,0],[-2,-1],[ 1, 2]],
  '1>0': [[ 0,0],[ 2,0],[-1,0],[ 2, 1],[-1,-2]],
  '1>2': [[ 0,0],[-1,0],[ 2,0],[-1, 2],[ 2,-1]],
  '2>1': [[ 0,0],[ 1,0],[-2,0],[ 1,-2],[-2, 1]],
  '2>3': [[ 0,0],[ 2,0],[-1,0],[ 2, 1],[-1,-2]],
  '3>2': [[ 0,0],[-2,0],[ 1,0],[-2,-1],[ 1, 2]],
  '3>0': [[ 0,0],[ 1,0],[-2,0],[ 1,-2],[-2, 1]],
  '0>3': [[ 0,0],[-1,0],[ 2,0],[-1, 2],[ 2,-1]],
};

const PIECE_TYPES = Object.keys(SHAPES);

class Piece {
  constructor(kind) {
    this.kind = kind || PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    this.rotation = 0;
    this.color = COLORS[this.kind];
    this.x = 3;
    this.y = 0;
  }

  get blocks() {
    return this._blocksAt(this.x, this.y, this.rotation);
  }

  _blocksAt(x, y, rot) {
    return SHAPES[this.kind][rot].map(([dx, dy]) => [x + dx, y + dy]);
  }

  rotateCW() {
    return (this.rotation + 1) % 4;
  }

  clone() {
    const p = new Piece(this.kind);
    p.rotation = this.rotation;
    p.x = this.x;
    p.y = this.y;
    return p;
  }

  // Retorna kicks para esta pieza
  getKicks(fromRot, toRot) {
    const key = `${fromRot}>${toRot}`;
    const table = this.kind === 'I' ? WALL_KICKS_I : WALL_KICKS;
    return table[key] || [[0, 0]];
  }
}

function randomPiece() {
  return new Piece(PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]);
}

export { Piece, randomPiece };
