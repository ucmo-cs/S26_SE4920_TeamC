import { Scene, GameObjects } from 'phaser';
import {TrailContext, HazardQueue} from "../assets/trail/Trail.ts"
import {CreateHazardOnTrail} from "../assets/trail/TrailStrategys.ts"
// Docs https://docs.phaser.io/api-documentation/class/scene


// needs refactoring and optimization
export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    logo: GameObjects.Image;
    hazard: GameObjects.Image;
    trailContext : TrailContext;
    group: GameObjects.Group;
    // Base step speed in ms. Lower is harder.
    stepMs = 780;
    minStepMs = 260;
    currentStepMs = 780;

    hudBackground: Phaser.GameObjects.Rectangle;
    timerText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    statusText: Phaser.GameObjects.Text;
    elapsedMs = 0;
    score = 0;
    ticks = 0;

    laneXs = [320, 512, 704];
    playerLane = 1;
    playerMarker: Phaser.GameObjects.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    lastLane = 1;

    constructor ()
    {
        super('Game');
    }

    init (data: { difficulty?: number })
    {
        this.stepMs = data.difficulty ?? 780;
        this.currentStepMs = this.stepMs;
        this.playerLane = 1;
        this.lastLane = 1;
        this.elapsedMs = 0;
        this.score = 0;
        this.ticks = 0;
    }

    renderTrail() : void{
        this.group.clear(true, true);

        const rows = HazardQueue.toArray() as string[][];
        let yPos = 570;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!Array.isArray(row)) {
                continue;
            }

            for (let lane = 0; lane < 3; lane++) {
                const isSafe = row[lane] === " S ";
                if (isSafe) {
                    const txt = this.add.text(this.laneXs[lane], yPos, '·', {
                        fontSize: '34px',
                        fontFamily: 'Arial Black',
                        color: '#7CFC00',
                        stroke: '#000000',
                        strokeThickness: 4,
                        align: 'center',
                    }).setOrigin(0.5, 0.5).setDepth(2);

                    this.group.add(txt);
                } else {
                    const txt = this.add.text(this.laneXs[lane], yPos, 'X', {
                        fontSize: '34px',
                        fontFamily: 'Arial Black',
                        color: '#ffffff',
                        stroke: '#000000',
                        strokeThickness: 4,
                        align: 'center',
                    }).setOrigin(0.5, 0.5).setDepth(2);

                    this.group.add(txt);
                }
            }

            yPos -= 36;
        }

        this.playerMarker.setX(this.laneXs[this.playerLane]);
        this.playerMarker.setY(635);
    }

    create () {
        this.background = this.add.image(512, 384, 'background')
            .setDisplaySize(1024, 768)
            .setDepth(0);

        // Create HUD elements
        this.hudBackground = this.add.rectangle(512, 20, 1024, 40, 0x000000, 0.8).setDepth(10);
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

        this.statusText = this.add.text(900, 10, 'STATUS', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setDepth(11);

        // Create cat animations
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

        // Create cat sprite player marker
        this.playerMarker = this.add.sprite(this.laneXs[this.playerLane], 635, 'cat', 0)
            .setOrigin(0.5, 0.5)
            .setDepth(12)
            .setScale(0.8);
        this.playerMarker.play('rear_run');

        this.cursors = this.input.keyboard!.createCursorKeys();

        while (!HazardQueue.isEmpty()) {
            HazardQueue.dequeue();
        }

        // setup trail handler. First step is to set strategy as create hazard
        this.trailContext = new TrailContext(new CreateHazardOnTrail);

        for (let i = 0; i < 10; i++) {
            this.trailContext.executeStrategy();
        }

        this.renderTrail();
    }

    hazardTimer = 0;
    update(time: number, delta: number): void {
        let laneChanged = false;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
            this.playerLane = Math.max(0, this.playerLane - 1);
            laneChanged = true;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
            this.playerLane = Math.min(2, this.playerLane + 1);
            laneChanged = true;
        }

        // Update animation based on lane change
        if (laneChanged) {
            if (this.playerLane < this.lastLane) {
                this.playerMarker.stop();
                this.playerMarker.play('left_dodge');
            } else if (this.playerLane > this.lastLane) {
                this.playerMarker.stop();
                this.playerMarker.play('right_dodge');
            }
            this.lastLane = this.playerLane;
        }

        this.hazardTimer += delta;
        this.elapsedMs += delta;

        const elapsedSeconds = Math.floor(this.elapsedMs / 1000);
        this.timerText.setText(`TIME ${Math.floor(elapsedSeconds / 60)}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`);

        this.playerMarker.setX(this.laneXs[this.playerLane]);

        if (this.hazardTimer >= this.currentStepMs) {
            const incoming = HazardQueue.dequeue() as string[] | number;

            if (incoming !== -1 && Array.isArray(incoming) && incoming[this.playerLane] !== " S ") {
                this.scene.start('GameOver', {
                    score: this.score,
                    elapsedSeconds
                });
                return;
            }

            this.trailContext = new TrailContext(new CreateHazardOnTrail);
            this.trailContext.executeStrategy();

            this.ticks += 1;
            this.score += 10;
            this.scoreText.setText(`SCORE ${this.score.toString().padStart(4, '0')}`);
            this.currentStepMs = Math.max(this.minStepMs, this.stepMs - this.ticks * 8);
            this.renderTrail();

            // Return to rear_run animation when idle
            if (!laneChanged) {
                this.playerMarker.play('rear_run', true);
            }

            this.hazardTimer = 0;
        }
    }
}
