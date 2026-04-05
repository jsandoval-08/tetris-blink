// GameOverScene.js — Pantalla de fin de juego

class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  init(data) {
    this.finalScore = data.score || 0;
    this.bestScore  = data.best  || 0;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Overlay oscuro
    this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.85);

    // Línea decorativa
    const g = this.add.graphics();
    g.lineStyle(1, 0xFF2D95, 0.4);
    g.lineBetween(W * 0.2, H * 0.42, W * 0.8, H * 0.42);

    // Título
    const title = this.add.text(W/2, H * 0.28, 'GAME OVER', {
      fontFamily: '"Orbitron", Arial, sans-serif',
      fontSize: '40px',
      color: '#FF2D95',
      stroke: '#E60073',
      strokeThickness: 2,
      shadow: { offsetX: 0, offsetY: 0, color: '#FF2D95', blur: 20, fill: true },
    }).setOrigin(0.5).setAlpha(0);

    // Score
    const scoreTxt = this.add.text(W/2, H * 0.46, `Score: ${this.finalScore}`, {
      fontFamily: '"Orbitron", Arial, sans-serif',
      fontSize: '22px',
      color: '#FFFFFF',
    }).setOrigin(0.5).setAlpha(0);

    const bestTxt = this.add.text(W/2, H * 0.54, `Best: ${this.bestScore}`, {
      fontFamily: '"Orbitron", Arial, sans-serif',
      fontSize: '15px',
      color: '#C0C0C0',
    }).setOrigin(0.5).setAlpha(0);

    // Fade in
    this.tweens.add({ targets: [title, scoreTxt, bestTxt], alpha: 1, duration: 600, ease: 'Power2' });

    // Botones (con delay para que aparezcan después del fade)
    this.time.delayedCall(500, () => {
      this._makeButton(W/2, H * 0.67, 'RESTART', () => {
        this.scene.start('GameScene');
      });
      this._makeButton(W/2, H * 0.78, 'MENU', () => {
        this.scene.start('MenuScene');
      });
    });
  }

  _makeButton(x, y, label, callback) {
    const W = 180, H = 48;
    const bg = this.add.graphics().setAlpha(0);
    const txt = this.add.text(x, y, label, {
      fontFamily: '"Orbitron", Arial, sans-serif',
      fontSize: '16px',
      color: '#C0C0C0',
    }).setOrigin(0.5).setAlpha(0);

    const draw = (hovered) => {
      bg.clear();
      bg.fillStyle(hovered ? 0xFF2D95 : 0x1A1A1A, 1);
      bg.fillRoundedRect(x - W/2, y - H/2, W, H, 6);
      bg.lineStyle(1, hovered ? 0xFF2D95 : 0x444444, 1);
      bg.strokeRoundedRect(x - W/2, y - H/2, W, H, 6);
    };
    draw(false);

    this.tweens.add({ targets: [bg, txt], alpha: 1, duration: 400 });

    const zone = this.add.zone(x, y, W, H).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => { draw(true); txt.setColor('#FFFFFF'); });
    zone.on('pointerout',  () => { draw(false); txt.setColor('#C0C0C0'); });
    zone.on('pointerdown', callback);
  }
}
