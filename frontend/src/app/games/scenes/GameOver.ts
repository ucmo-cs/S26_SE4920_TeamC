import * as Phaser from 'phaser';
import { GAME_SCORE_EVENT } from '../main';
import { stopTempleMusic } from '../audio/music';

export class GameOver extends Phaser.Scene {
  private readonly muteStorageKey = 'roc-game-muted';

  constructor() {
    super('GameOver');
  }

  create(data: { score?: number; elapsedSeconds?: number }): void {
    this.cameras.main.setBackgroundColor(0xff0000);
    stopTempleMusic();

    const score = data.score ?? 0;
    const elapsed = data.elapsedSeconds ?? 0;

    this.game.events.emit(GAME_SCORE_EVENT, score);
    this.playDistressedMeow();

    this.add.image(512, 384, 'background').setAlpha(0.5);

    this.add.text(512, 384, 'Game Over', {
      fontFamily: 'Arial Black',
      fontSize: '64px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(512, 462, `Score ${score}  |  Time ${elapsed}s\nClick to return to menu`, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }

  private playDistressedMeow(): void {
    if (localStorage.getItem(this.muteStorageKey) === 'true') {
      return;
    }

    const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }

    try {
      const context = new AudioContextCtor();
      const now = context.currentTime;
      const duration = 0.75;

      const carrier = context.createOscillator();
      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(780, now);
      carrier.frequency.exponentialRampToValueAtTime(360, now + duration);

      const modulator = context.createOscillator();
      modulator.type = 'triangle';
      modulator.frequency.setValueAtTime(10, now);

      const modGain = context.createGain();
      modGain.gain.setValueAtTime(28, now);
      modGain.gain.exponentialRampToValueAtTime(12, now + duration);

      const output = context.createGain();
      output.gain.setValueAtTime(0.0001, now);
      output.gain.exponentialRampToValueAtTime(0.22, now + 0.06);
      output.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(output);
      output.connect(context.destination);

      carrier.start(now);
      modulator.start(now);
      carrier.stop(now + duration);
      modulator.stop(now + duration);

      carrier.onended = () => {
        void context.close();
      };
    } catch {
      // Ignore audio failures so the scene still advances.
    }
  }
}
