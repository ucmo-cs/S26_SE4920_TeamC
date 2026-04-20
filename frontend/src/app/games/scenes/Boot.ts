import * as Phaser from 'phaser';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.image('background', 'assets/game/background.jpg');
  }

  create(): void {
    this.scene.start('Preloader');
  }
}
