import * as Phaser from 'phaser';
import { HazardQueue, TrailContext } from '../assets/trail/Trail';
import { CreateHazardOnTrail } from '../assets/trail/TrailStrategys';
import { ensureTempleMusicStarted, getMusicLabel, setMusicMuted, toggleMusic } from '../audio/music';

export class Game extends Phaser.Scene {
  private readonly muteStorageKey = 'roc-game-muted';
  private readonly laneXs = [320, 512, 704];

  private group!: Phaser.GameObjects.Group;
  private timerText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private musicText!: Phaser.GameObjects.Text;
  private playerMarker!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private trailContext!: TrailContext;

  private stepMs = 780;
  private readonly minStepMs = 260;
  private currentStepMs = 780;
  private elapsedMs = 0;
  private score = 0;
  private ticks = 0;
  private playerLane = 1;
  private lastLane = 1;
  private hazardTimer = 0;

  constructor() {
    super('Game');
  }

  init(data: { difficulty?: number }): void {
    this.stepMs = data.difficulty ?? 780;
    this.currentStepMs = this.stepMs;
    this.playerLane = 1;
    this.lastLane = 1;
    this.elapsedMs = 0;
    this.score = 0;
    this.ticks = 0;
    this.hazardTimer = 0;
  }

  create(): void {
    this.add.image(512, 384, 'background').setDisplaySize(1024, 768).setDepth(0);

    this.add.rectangle(512, 20, 1024, 40, 0x000000, 0.8).setDepth(10);
    this.group = this.add.group();

    this.timerText = this.add.text(100, 10, 'TIME 0:00', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setDepth(11);

    this.scoreText = this.add.text(512, 10, 'SCORE 0000', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setDepth(11).setOrigin(0.5, 0);

    this.statusText = this.add.text(900, 10, this.getMuteStatusLabel(), {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setDepth(11);

    this.musicText = this.add.text(760, 10, getMusicLabel('MUSIC'), {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setDepth(11).setInteractive({ useHandCursor: true });
    this.musicText.on('pointerdown', () => void this.handleMusicToggle());

    this.anims.create({
      key: 'rear_run',
      frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'left_dodge',
      frames: this.anims.generateFrameNumbers('cat', { start: 6, end: 11 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'right_dodge',
      frames: this.anims.generateFrameNumbers('cat', { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('cat', { start: 18, end: 21 }),
      frameRate: 10,
      repeat: -1
    });

    this.playerMarker = this.add.sprite(this.laneXs[this.playerLane], 635, 'cat', 0)
      .setOrigin(0.5, 0.5)
      .setDepth(12)
      .setScale(0.8);
    this.playerMarker.play('rear_run');

    this.cursors = this.input.keyboard?.createCursorKeys() ?? ({} as Phaser.Types.Input.Keyboard.CursorKeys);
    this.input.keyboard?.on('keydown-M', () => this.toggleMute());
    this.input.keyboard?.on('keydown-N', () => void this.handleMusicToggle());

    void ensureTempleMusicStarted();

    HazardQueue.clear();
    this.trailContext = new TrailContext(new CreateHazardOnTrail());

    for (let i = 0; i < 10; i += 1) {
      this.trailContext.executeStrategy();
    }

    this.renderTrail();
  }

  override update(_time: number, delta: number): void {
    let laneChanged = false;

    if (this.cursors.left && Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.playerLane = Math.max(0, this.playerLane - 1);
      laneChanged = true;
    }

    if (this.cursors.right && Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.playerLane = Math.min(2, this.playerLane + 1);
      laneChanged = true;
    }

    if (laneChanged) {
      if (this.playerLane < this.lastLane) {
        this.playerMarker.play('left_dodge', true);
      } else if (this.playerLane > this.lastLane) {
        this.playerMarker.play('right_dodge', true);
      }

      this.lastLane = this.playerLane;
    }

    this.hazardTimer += delta;
    this.elapsedMs += delta;

    const elapsedSeconds = Math.floor(this.elapsedMs / 1000);
    this.timerText.setText(`TIME ${Math.floor(elapsedSeconds / 60)}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`);
    this.playerMarker.setX(this.laneXs[this.playerLane]);

    if (this.hazardTimer < this.currentStepMs) {
      return;
    }

    const incoming = HazardQueue.dequeue();

    if (incoming && incoming[this.playerLane] !== ' S ') {
      this.scene.start('GameOver', {
        score: this.score,
        elapsedSeconds
      });
      return;
    }

    this.trailContext = new TrailContext(new CreateHazardOnTrail());
    this.trailContext.executeStrategy();

    this.ticks += 1;
    this.score += 10;
    this.scoreText.setText(`SCORE ${this.score.toString().padStart(4, '0')}`);
    this.currentStepMs = Math.max(this.minStepMs, this.stepMs - this.ticks * 8);
    this.renderTrail();

    if (!laneChanged) {
      this.playerMarker.play('rear_run', true);
    }

    this.hazardTimer = 0;
  }

  private renderTrail(): void {
    this.group.clear(true, true);

    const rows = HazardQueue.toArray();
    let yPos = 570;

    for (const row of rows) {
      for (let lane = 0; lane < 3; lane += 1) {
        const isSafe = row[lane] === ' S ';
        const marker = this.add.text(this.laneXs[lane], yPos, isSafe ? '·' : 'X', {
          fontSize: '34px',
          fontFamily: 'Arial Black',
          color: isSafe ? '#7CFC00' : '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
          align: 'center'
        }).setOrigin(0.5, 0.5).setDepth(2);

        this.group.add(marker);
      }

      yPos -= 36;
    }

    this.playerMarker.setPosition(this.laneXs[this.playerLane], 635);
  }

  private toggleMute(): void {
    const nextMuted = !this.isMuted();
    localStorage.setItem(this.muteStorageKey, nextMuted ? 'true' : 'false');
    this.statusText.setText(this.getMuteStatusLabel());
  }

  private isMuted(): boolean {
    return localStorage.getItem(this.muteStorageKey) === 'true';
  }

  private getMuteStatusLabel(): string {
    return this.isMuted() ? 'SFX OFF (M)' : 'SFX ON (M)';
  }

  private async handleMusicToggle(): Promise<void> {
    const nextMuted = await toggleMusic();

    if (nextMuted) {
      await setMusicMuted(true);
    } else {
      await ensureTempleMusicStarted();
    }

    this.musicText.setText(getMusicLabel('MUSIC'));
  }
}
