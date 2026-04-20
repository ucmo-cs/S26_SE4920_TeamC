import * as Phaser from 'phaser';
import { getMusicLabel, isMusicMuted, setMusicMuted, toggleMusic } from '../audio/music';

export class MainMenu extends Phaser.Scene {
  private muteText!: Phaser.GameObjects.Text;
  private musicText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainMenu');
  }

  create(): void {
    this.add.image(512, 384, 'background');
    this.add.image(512, 300, 'logo');

    this.add.text(512, 450, 'Choose Difficulty', {
      fontFamily: 'Arial Black',
      fontSize: '38px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(512, 500, 'Click a mode or press 1 / 2 / 3', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const easy = this.createMenuOption(270, '1. EASY', '#9cff9c');
    const medium = this.createMenuOption(512, '2. MEDIUM', '#ffe08a');
    const hard = this.createMenuOption(760, '3. HARD', '#ff9c9c');

    this.muteText = this.add.text(512, 650, this.getMuteLabel(), {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.musicText = this.add.text(512, 686, getMusicLabel('Music'), {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const startGame = (difficulty: number) => {
      this.scene.start('Game', { difficulty });
    };

    easy.on('pointerdown', () => startGame(920));
    medium.on('pointerdown', () => startGame(780));
    hard.on('pointerdown', () => startGame(640));
    this.muteText.on('pointerdown', () => void this.handleMuteToggle());
    this.musicText.on('pointerdown', () => void this.handleMusicToggle());

    this.input.keyboard?.on('keydown-ONE', () => startGame(920));
    this.input.keyboard?.on('keydown-TWO', () => startGame(780));
    this.input.keyboard?.on('keydown-THREE', () => startGame(640));
    this.input.keyboard?.on('keydown-NUMPAD_ONE', () => startGame(920));
    this.input.keyboard?.on('keydown-NUMPAD_TWO', () => startGame(780));
    this.input.keyboard?.on('keydown-NUMPAD_THREE', () => startGame(640));
    this.input.keyboard?.on('keydown-SPACE', () => startGame(780));
    this.input.keyboard?.on('keydown-M', () => void this.handleMuteToggle());
    this.input.keyboard?.on('keydown-N', () => void this.handleMusicToggle());
  }

  private createMenuOption(x: number, label: string, color: string): Phaser.GameObjects.Text {
    return this.add.text(x, 585, label, {
      fontFamily: 'Arial Black',
      fontSize: '30px',
      color,
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  }

  private async handleMuteToggle(): Promise<void> {
    const nextMuted = !isMusicMuted();
    await setMusicMuted(nextMuted);
    this.muteText.setText(this.getMuteLabel());
    this.musicText.setText(getMusicLabel('Music'));
  }

  private async handleMusicToggle(): Promise<void> {
    await toggleMusic();
    this.musicText.setText(getMusicLabel('Music'));
  }

  private getMuteLabel(): string {
    return isMusicMuted() ? 'Press M: Music Muted' : 'Press M: Music On';
  }
}
