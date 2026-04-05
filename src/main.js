// main.js — Configuración de Phaser y arranque del juego
import MenuScene from './src/MenuScene.js';
import GameScene from './src/GameScene.js';
import GameOverScene from './src/GameOverScene.js';

const GAME_W = 480;
const GAME_H = 720;

const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MenuScene, GameScene, GameOverScene],
};

const game = new Phaser.Game(config);
