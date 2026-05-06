import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { createGame } from '../games/main';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private game?: Phaser.Game;

  initializeGame(containerId: string, onGameOver?: (score: number) => void): Phaser.Game {
    this.destroyGame();
    this.game = createGame(containerId, onGameOver);
    return this.game;
  }

  destroyGame(): void {
    if (!this.game) {
      return;
    }

    this.game.destroy(true);
    this.game = undefined;
  }
}
