import { Scene } from 'phaser';
import { stopTempleMusic } from '../audio/music';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text : Phaser.GameObjects.Text;
    summaryText: Phaser.GameObjects.Text;
    private readonly muteStorageKey = 'roc-game-muted';

    constructor ()
    {
        super('GameOver');
    }

    create (data: { score?: number; elapsedSeconds?: number })
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);
        stopTempleMusic();

        const score = data?.score ?? 0;
        const targetOrigin = this.getParentOrigin();
        this.postScoreToPortal(score, targetOrigin);
        this.playDistressedMeow();

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameover_text = this.add.text(512, 384, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.gameover_text.setOrigin(0.5);

        const elapsed = data?.elapsedSeconds ?? 0;
        this.summaryText = this.add.text(512, 462, `Score ${score}  |  Time ${elapsed}s\nClick to return to menu`, {
            fontFamily: 'Arial',
            fontSize: 28,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }

    private postScoreToPortal(score: number, targetOrigin: string): void {
        if (!window.opener || typeof window.opener.postMessage !== 'function') {
            return;
        }

        try {
            window.opener.postMessage({ type: 'ROC_GAME_SCORE', score }, targetOrigin);
        } catch {
            // Ignore cross-window messaging failures and keep game flow uninterrupted.
        }
    }

    private getParentOrigin(): string {
        const query = new URLSearchParams(window.location.search);
        const parentOrigin = query.get('parentOrigin');
        return parentOrigin || 'http://localhost:4200';
    }

    private playDistressedMeow(): void {
        if (localStorage.getItem(this.muteStorageKey) === 'true') {
            return;
        }

        const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
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
            // Ignore audio failures so game-over flow still works.
        }
    }
}
