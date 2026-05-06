import * as Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

export const GAME_SCORE_EVENT = 'roc:game-score';

export function createGame(parent: string, onGameOver?: (score: number) => void): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent,
    backgroundColor: '#028af8',
    transparent: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    callbacks: {
      postBoot: (game) => {
        if (onGameOver) {
          game.events.on(GAME_SCORE_EVENT, onGameOver);
        }
      }
    },
    scene: [
      Boot,
      Preloader,
      MainMenu,
      MainGame,
      GameOver
    ]
  });
}
