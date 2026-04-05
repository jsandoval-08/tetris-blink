// src/MenuScene.js — Pantalla de inicio

class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  preload() {
    // Audio
    this.load.audio('bgm', ['assets/music/lofi.ogg','assets/music/lofi.mp3']);
    this.load.audio('sfx_move',    'assets/sounds/move.wav');
    this.load.audio('sfx_rotate',  'assets/sounds/rotate.wav');
    this.load.audio('sfx_place',   'assets/sounds/place.wav');
    this.load.audio('sfx_clear',   'assets/sounds/clear.wav');
    this.load.audio('sfx_tetris',  'assets/sounds/tetris.wav');
    this.load.audio('sfx_gameover','assets/sounds/gameover.wav');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this._drawBg();

    if(this.sound.get('bgm')===null){
      try { this.bgm=this.sound.add('bgm',{loop:true,volume:0.35}); this.bgm.play(); } catch(e){}
    }

    document.fonts.ready.then(() => {
      // Línea decorativa
      const line=this.add.graphics();
      line.lineStyle(1,0xFF2D95,0.4);
      line.lineBetween(W*0.15,H*0.38,W*0.85,H*0.38);

      // Título
      const title=this.add.text(W/2,H*0.28,'BlinkBlocks',{
        fontFamily:'"Orbitron", "Arial", sans-serif',
        fontSize:'48px',
        color:'#FF2D95',
        stroke:'#E60073',
        strokeThickness:2,
        shadow:{offsetX:0,offsetY:0,color:'#FF2D95',blur:20,fill:true},
      }).setOrigin(0.5);

      // Subtítulo
      this.add.text(W/2,H*0.35,'K-pop Tetris Edition',{
        fontFamily:'"Orbitron", "Arial", sans-serif',
        fontSize:'13px',
        color:'#C0C0C0',
        letterSpacing:3
      }).setOrigin(0.5);

      // Botones
      this._makeButton(W/2,H*0.52,'PLAY',()=>{ this.scene.start('GameScene'); });
      this._makeButton(W/2,H*0.63,'EXIT',()=>{
        this.add.text(W/2,H*0.75,'Cierra la pestaña para salir',{
          fontFamily:'"Orbitron", "Arial", sans-serif',
          fontSize:'12px',
          color:'#555',
        }).setOrigin(0.5);
      });

      // Controles hint
      this.add.text(W/2,H*0.88,'W rotar  ·  A D mover  ·  S bajar  ·  ESPACIO caída',{
        fontFamily:'"Orbitron", "Arial", sans-serif',
        fontSize:'11px',
        color:'#333',
      }).setOrigin(0.5);

      // Hint móvil
      this.add.text(W/2,H*0.92,'📱 En móvil: botones táctiles en pantalla',{
        fontFamily:'"Orbitron", "Arial", sans-serif',
        fontSize:'11px',
        color:'#333',
      }).setOrigin(0.5);

      // Animación del título
      this.tweens.add({
        targets: title,
        y:H*0.28-6,
        duration:1800,
        yoyo:true,
        repeat:-1,
        ease:'Sine.easeInOut'
      });
    });
  }

  _drawBg(){
    const W=this.scale.width,H=this.scale.height,g=this.add.graphics();
    g.lineStyle(1,0x111111,1);
    for(let x=0;x<W;x+=40) g.lineBetween(x,0,x,H);
    for(let y=0;y<H;y+=40) g.lineBetween(0,y,W,y);
  }

  _makeButton(x,y,label,callback){
    const Wb=180,Hb=48,bg=this.add.graphics();

    const draw=(hovered)=>{
      bg.clear();
      bg.fillStyle(hovered?0xFF2D95:0x1A1A1A,1);
      bg.fillRoundedRect(x-Wb/2,y-Hb/2,Wb,Hb,6);
      bg.lineStyle(1,hovered?0xFF2D95:0x444444,1);
      bg.strokeRoundedRect(x-Wb/2,y-Hb/2,Wb,Hb,6);
    };

    draw(false);

    const txt=this.add.text(x,y,label,{
      fontFamily:'"Orbitron", "Arial", sans-serif',
      fontSize:'18px',
      color:'#C0C0C0',
    }).setOrigin(0.5);

    const zone=this.add.zone(x,y,Wb,Hb).setInteractive({useHandCursor:true});
    zone.on('pointerover',()=>{ draw(true); txt.setColor('#FFFFFF'); });
    zone.on('pointerout', ()=>{ draw(false); txt.setColor('#C0C0C0'); });
    zone.on('pointerdown',callback);
  }
}

export default MenuScene;
