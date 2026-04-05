// GameScene.js — Escena principal del juego
import Board from './Board.js';
import { randomPiece } from './Piece.js'; // asegúrate de exportar randomPiece desde Piece.js

const CELL    = 28;
const BOARD_X = 20;
const BOARD_Y = 20;

// Creamos un tablero temporal para calcular dimensiones
const tempBoard = new Board();
const COLS = tempBoard.grid[0].length;
const ROWS = tempBoard.grid.length;

const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;
const PANEL_X = BOARD_X + BOARD_W + 16;
const PANEL_W = 120;

const LINE_POINTS  = { 1: 100, 2: 300, 3: 500, 4: 1000 };
const DAS_DELAY    = 170;
const DAS_REPEAT   = 50;
const LOCK_DELAY   = 500;
const CLEAR_ANIM   = 250;

function fallSpeed(level) {
  return Math.max(50, 900 - (level - 1) * 55);
}

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  create() {
    this.board      = new Board();
    this.current    = randomPiece();
    this.nextPiece  = randomPiece();
    this.score      = 0;
    this.level      = 1;
    this.lines      = 0;
    this.bestScore  = parseInt(localStorage.getItem('blinkblocks_best') || '0');

    // Timers internos
    this._fallTimer   = 0;
    this._lockTimer   = 0;
    this._dasDir      = 0;
    this._dasTimer    = 0;
    this._dasActive   = false;
    this._clearTimer  = 0;
    this._clearRows   = [];
    this._glowTimer   = 0;
    this._comboText   = '';
    this._comboTimer  = 0;

    // Gráficos
    this.gBoard    = this.add.graphics();
    this.gPiece    = this.add.graphics();
    this.gGhost    = this.add.graphics();
    this.gUI       = this.add.graphics();
    this.gOverlay  = this.add.graphics();

    // Espera a que cargue Orbitron antes de crear textos y controles
    document.fonts.ready.then(() => {
      this._buildHUD();
      this._buildKeyboard();
      this._buildTouchControls();
      this._redraw();
    });
  }

  update(time, delta) {
    if (this._clearRows.length > 0) {
      this._clearTimer -= delta;
      this._redraw();
      if (this._clearTimer <= 0) {
        this.board.clearRows(this._clearRows);
        this._clearRows = [];
        this._spawnNext();
      }
      return;
    }

    this._handleDAS(delta);
    this._handleFall(delta);

    if (this._glowTimer > 0) this._glowTimer -= delta;
    if (this._comboTimer > 0) this._comboTimer -= delta;

    this._redraw();
  }

  // ── Input teclado ─────────────────────────────────────────────────────────
  _buildKeyboard() {
    const kb = this.input.keyboard;
    kb.on('keydown-W', () => this._rotate());
    kb.on('keydown-SPACE', () => this._hardDrop());
    kb.on('keydown-A', () => { this._moveH(-1); this._dasDir=-1; this._dasTimer=0; this._dasActive=false; });
    kb.on('keydown-D', () => { this._moveH(1); this._dasDir=1; this._dasTimer=0; this._dasActive=false; });
    kb.on('keyup-A', () => { if(this._dasDir===-1){this._dasDir=0; this._dasActive=false;} });
    kb.on('keyup-D', () => { if(this._dasDir===1){this._dasDir=0; this._dasActive=false;} });

    this._softDrop = false;
    kb.on('keydown-S', () => { this._softDrop = true; });
    kb.on('keyup-S', () => { this._softDrop = false; });
  }

  _handleDAS(delta) {
    if(this._dasDir===0) return;
    this._dasTimer += delta;
    const threshold = this._dasActive ? DAS_REPEAT : DAS_DELAY;
    if(this._dasTimer >= threshold){
      this._dasTimer = 0;
      this._dasActive = true;
      this._moveH(this._dasDir);
    }
  }

  _moveH(dir){ if(this.board.move(this.current,dir,0)) this._playSfx('sfx_move'); }
  _rotate(){ if(this.board.tryRotate(this.current)) this._playSfx('sfx_rotate'); }

  _hardDrop(){
    const dist = this.board.hardDropDistance(this.current);
    this.current.y += dist;
    this.score += dist*2;
    this._lockPiece();
    this._playSfx('sfx_place');
  }

  _handleFall(delta){
    const speed = this._softDrop ? fallSpeed(this.level)/8 : fallSpeed(this.level);
    this._fallTimer += delta;
    if(this._fallTimer >= speed){
      this._fallTimer = 0;
      const moved = this.board.move(this.current,0,1);
      if(!moved){
        this._lockTimer += speed;
        if(this._lockTimer >= LOCK_DELAY) this._lockPiece();
      }else this._lockTimer = 0;
    }
  }

  _lockPiece(){
    const fullRows = this.board.lockPiece(this.current);
    this._glowTimer = 150;
    this._playSfx('sfx_place');

    if(fullRows.length>0) {
      const n = fullRows.length;
      this.score += (LINE_POINTS[n]||0)*this.level;
      this.lines += n;
      this.level = Math.floor(this.lines/10)+1;

      if(n===4){ this._comboText='TETRIS'; this._playSfx('sfx_tetris'); }
      else if(n===3){ this._comboText='PERFECT'; }
      else if(n>=2){ this._comboText='DOUBLE'; }
      else this._comboText='';

      this._comboTimer = 1800;
      this._clearRows = fullRows;
      this._clearTimer = CLEAR_ANIM;
      this._playSfx('sfx_clear');
      this._saveBest();
    } else this._spawnNext();
  }

  _spawnNext(){
    this.current = this.nextPiece;
    this.nextPiece = randomPiece();
    this._fallTimer = 0;
    this._lockTimer = 0;

    if(this.board.isToppedOut(this.current)){
      this._playSfx('sfx_gameover');
      this._saveBest();
      this.scene.start('GameOverScene',{score:this.score,best:this.bestScore});
    }
  }

  _saveBest(){
    if(this.score>this.bestScore){
      this.bestScore=this.score;
      localStorage.setItem('blinkblocks_best',this.bestScore);
    }
  }

  _playSfx(key){ try{ this.sound.play(key,{volume:0.5}); }catch(e){} }

  // ── HUD textos ────────────────────────────────────────────────────────────
  _buildHUD(){
    const style = (size) => ({
      fontFamily: '"Orbitron", Arial, sans-serif',
      fontSize: `${size}px`,
      color: '#FF2D95',
    });
    const labelStyle = {
      fontFamily: '"Orbitron", Arial, sans-serif',
      fontSize: '11px',
      color: '#555555',
      letterSpacing: 2,
    };

    const px = PANEL_X;
    const by = BOARD_Y;

    this._lblScore  = this.add.text(px, by+10,  'SCORE', labelStyle);
    this._txtScore  = this.add.text(px, by+24,  '0', style(20));
    this._lblBest   = this.add.text(px, by+70,  'BEST', labelStyle);
    this._txtBest   = this.add.text(px, by+84,  '0', style(16));
    this._lblLevel  = this.add.text(px, by+130, 'LEVEL', labelStyle);
    this._txtLevel  = this.add.text(px, by+144, '1', style(20));
    this._lblLines  = this.add.text(px, by+190, 'LINES', labelStyle);
    this._txtLines  = this.add.text(px, by+204, '0', style(16));
    this._lblNext   = this.add.text(px, by+270, 'NEXT', labelStyle);

    this._txtCombo = this.add.text(
      BOARD_X + BOARD_W/2,
      BOARD_Y + BOARD_H/2 - 20,
      '',
      {
        fontFamily: '"Orbitron", Arial, sans-serif',
        fontSize: '16px',
        color: '#FF2D95',
        letterSpacing: 4,
      }
    ).setOrigin(0.5).setAlpha(0);
  }

  _redraw(){
    this._updateTexts();
    this._drawBoard();
    this._drawGhost();
    this._drawCurrent();
    this._drawNext();
    this._drawCombo();
  }

  _updateTexts(){
    this._txtScore.setText(this.score.toString());
    this._txtBest.setText(this.bestScore.toString());
    this._txtLevel.setText(this.level.toString());
    this._txtLines.setText(this.lines.toString());
  }

  _buildTouchControls(){
    const W = this.scale.width;
    const H = this.scale.height;
    const btnY = H-70;
    const btnSize = 52;

    const buttons = [
      { label:'◁', x:W*0.12, action:()=>this._moveH(-1) },
      { label:'▷', x:W*0.28, action:()=>this._moveH(1) },
      { label:'▽', x:W*0.44, action:()=>{ this.board.move(this.current,0,1); } },
      { label:'↻', x:W*0.60, action:()=>this._rotate() },
      { label:'▽', x:W*0.76, action:()=>this._hardDrop() },
    ];

    for(const btn of buttons){
      const g = this.add.graphics();
      g.fillStyle(0x1A1A1A,0.85);
      g.fillRoundedRect(btn.x-btnSize/2, btnY-btnSize/2, btnSize, btnSize, 8);
      g.lineStyle(1,0xFF2D95,0.5);
      g.strokeRoundedRect(btn.x-btnSize/2, btnY-btnSize/2, btnSize, btnSize, 8);

      this.add.text(btn.x, btnY, btn.label, {
        fontFamily: '"Orbitron", Arial, sans-serif',
        fontSize: '20px',
        color: '#FF2D95',
      }).setOrigin(0.5);

      const zone = this.add.zone(btn.x, btnY, btnSize, btnSize).setInteractive();
      zone.on('pointerdown', btn.action);
    }
  }

  // ── Métodos de dibujo (_drawBoard, _drawCurrent, etc.) ──
  // Debes tenerlos aquí igual que antes
}

export default GameScene;
