import * as Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init(): void {
    this.add.image(512, 384, 'background');
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    const bar = this.add.rectangle(282, 384, 4, 28, 0xffffff).setOrigin(0, 0.5);

    this.load.on('progress', (progress: number) => {
      bar.width = 4 + (460 * progress);
    });
  }

  preload(): void {
    this.load.image('logo', 'assets/game/logo.png');
    this.load.image('bg', 'assets/game/background.jpg');
    this.load.image('hazard', 'assets/game/hazard.webp');
    this.load.spritesheet('cat', 'assets/game/cat_sheet.png', {
      frameWidth: 128,
      frameHeight: 128
    });
  }

  create(): void {
    this.scene.start('MainMenu');
  }
}
