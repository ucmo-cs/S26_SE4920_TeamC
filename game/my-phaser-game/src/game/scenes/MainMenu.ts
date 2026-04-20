import { Scene, GameObjects } from 'phaser';
import { getMusicLabel, setMusicMuted, isMusicMuted } from '../audio/music';
import { returnToWork } from '../utils/portal-navigation';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    hard: GameObjects.Text;
    medium: GameObjects.Text;
    easy: GameObjects.Text;
    muteText: GameObjects.Text;
    musicText: GameObjects.Text;
    backToWorkText: GameObjects.Text;
    selectedDifficulty = 780;


    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo');

        this.title = this.add.text(512, 450, 'Choose Difficulty', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.subtitle = this.add.text(512, 500, 'Click a mode or press 1 / 2 / 3', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#ffffff'
        }).setOrigin(0.5);

        this.easy = this.add.text(270, 585, '1. EASY', {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#9cff9c',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.medium = this.add.text(512, 585, '2. MEDIUM', {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#ffe08a',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.hard = this.add.text(760, 585, '3. HARD', {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#ff9c9c',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.muteText = this.add.text(512, 650, this.getMuteLabel(), {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.musicText = this.add.text(512, 686, getMusicLabel('Music'), {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.backToWorkText = this.add.text(512, 96, 'Back to Work', {
            fontFamily: 'Arial Black',
            fontSize: 22,
            color: '#ffffff',
            backgroundColor: '#d62828',
            stroke: '#7f1d1d',
            strokeThickness: 2,
            align: 'center',
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const startGame = (difficulty: number) => {
            this.selectedDifficulty = difficulty;
            this.scene.start('Game', { difficulty: this.selectedDifficulty });
        };

        this.easy.on('pointerdown', () => startGame(920));
        this.medium.on('pointerdown', () => startGame(780));
        this.hard.on('pointerdown', () => startGame(640));
        this.muteText.on('pointerdown', () => this.toggleMute());
        this.musicText.on('pointerdown', () => this.toggleMusic());
        this.backToWorkText.on('pointerdown', () => returnToWork());

        this.input.keyboard?.on('keydown-ONE', () => startGame(920));
        this.input.keyboard?.on('keydown-TWO', () => startGame(780));
        this.input.keyboard?.on('keydown-THREE', () => startGame(640));
        this.input.keyboard?.on('keydown-NUMPAD_ONE', () => startGame(920));
        this.input.keyboard?.on('keydown-NUMPAD_TWO', () => startGame(780));
        this.input.keyboard?.on('keydown-NUMPAD_THREE', () => startGame(640));

        this.input.keyboard?.on('keydown-SPACE', () => startGame(780));
        this.input.keyboard?.on('keydown-M', () => this.toggleMute());
        this.input.keyboard?.on('keydown-B', () => returnToWork());
        this.input.keyboard?.on('keydown-ESC', () => returnToWork());
    }

    private async toggleMute(): Promise<void> {
        const nextMuted = !this.isMuted();
        await setMusicMuted(nextMuted);
        this.muteText.setText(this.getMuteLabel());
    }

    private isMuted(): boolean {
        return isMusicMuted();
    }

    private getMuteLabel(): string {
        return this.isMuted() ? 'Press M: SFX Muted' : 'Press M: SFX On';
    }

    private async toggleMusic(): Promise<void> {
        await toggleMusic();
        this.musicText.setText(getMusicLabel('Music'));
    }
}
