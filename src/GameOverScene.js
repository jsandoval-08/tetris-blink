// GameOverScene.js — Pantalla de Game Over

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key:'GameOverScene' });
  }

  init(data){
    this.score = data.score || 0;
    this.best  = data.best || 0;
  }

  create(){
    const W = this.scale.width;
    const H = this.scale.height;

    // Fondo
    this.add.rectangle(0,0,W,H,0x0D0D0D).setOrigin(0,0);

    // Título
    document.fonts.ready.then(()=>{
      this.add.text(W/2,H*0.25,'GAME OVER',{
        fontFamily:'"Orbitron", Arial, sans-serif',
        fontSize:'48px',
        color:'#FF2D95',
        stroke:'#E60073',
        strokeThickness:2
      }).setOrigin(0.5);

      this.add.text(W/2,H*0.40,`SCORE: ${this.score}`,{
        fontFamily:'"Orbitron", Arial, sans-serif',
        fontSize:'20px',
        color:'#FF2D95'
      }).setOrigin(0.5);

      this.add.text(W/2,H*0.48,`BEST: ${this.best}`,{
        fontFamily:'"Orbitron", Arial, sans-serif',
        fontSize:'20px',
        color:'#FF2D95'
      }).setOrigin(0.5);

      // Botón RESTART
      this._makeButton(W/2,H*0.65,'RESTART',()=>this.scene.start('GameScene'));
      // Botón MENU
      this._makeButton(W/2,H*0.75,'MENU',()=>this.scene.start('MenuScene'));
    });
  }

  _makeButton(x,y,label,callback){
    const Wb = 180,Hb=48;
    const bg = this.add.graphics();

    const draw=(hovered)=>{
      bg.clear();
      bg.fillStyle(hovered?0xFF2D95:0x1A1A1A,1);
      bg.fillRoundedRect(x-Wb/2,y-Hb/2,Wb,Hb,6);
      bg.lineStyle(1,hovered?0xFF2D95:0x444444,1);
      bg.strokeRoundedRect(x-Wb/2,y-Hb/2,Wb,Hb,6);
    };
    draw(false);

    const txt=this.add.text(x,y,label,{
      fontFamily:'"Orbitron", Arial, sans-serif',
      fontSize:'18px',
      color:'#C0C0C0'
    }).setOrigin(0.5);

    const zone=this.add.zone(x,y,Wb,Hb).setInteractive({useHandCursor:true});
    zone.on('pointerover',()=>{ draw(true); txt.setColor('#FFFFFF'); });
    zone.on('pointerout', ()=>{ draw(false); txt.setColor('#C0C0C0'); });
    zone.on('pointerdown', callback);
  }
}

export default GameOverScene;
