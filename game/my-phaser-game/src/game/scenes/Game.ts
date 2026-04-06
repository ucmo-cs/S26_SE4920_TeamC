import { Scene, GameObjects } from 'phaser';
import {TrailContext, HazardQueue} from "../assets/trail/Trail.ts"
import {CreateHazardOnTrail, AdvanceHazards} from "../assets/trail/TrailStrategys.ts"
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
    // how fast the game moves
    clicks: integer = 800;

    hudBackground: Phaser.GameObjects.Rectangle;
    timerText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    elapsedSeconds = 0;
    score = 0;

    constructor ()
    {
        super('Game');
    }

    init (data: { difficulty: integer })
    {
        this.clicks = data.difficulty;
    }

    // refactor for performance
    renderTrail() : void{
        this.group.clear(true, true);
        let currentNode = HazardQueue.getFront();
        let yPos = 280;

        while(currentNode !== null){
            const txt = this.add.text(400, yPos, currentNode.data.toString(), {
                    fontSize: '32px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    padding: { x: 10, y: 5 },
            })

            this.group.add(txt);
            currentNode = currentNode.next;
            yPos -= 30;
        }
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x1b1b1b);

        this.background = this.add.image(512, 384, 'bg');

        this.background.setScale(0.7);
        this.background.setAlpha(0.5);

        const config = {
            classType: Phaser.GameObjects.Text,
        }

        this.group = this.add.group(config);

        this.hudBackground = this.add.rectangle(512, 34, 1024, 68, 0x0047ab).setOrigin(0.5, 0.5).setDepth(10);

        const hudStyle = {
            fontSize: '22px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff',
            lineSpacing: 6,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 0, stroke: true, fill: true }
        };

        this.timerText = this.add.text(32, 14, 'TIME 0s', hudStyle).setDepth(11);
        this.scoreText = this.add.text(640, 14, 'SCORE 0000', hudStyle).setDepth(11);

        // setup trail handler. First step is to set strategy as create hazard
        this.trailContext = new TrailContext(new CreateHazardOnTrail);

        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();

        //const hazardArray = HazardQueue.toArray() as GameObjects.Sprite[];

        this.renderTrail();

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    hazardTimer = 0;
    // make it so each of these do not run every second.
    // use the time and delta values for effective performance.
    update(time: number, delta: number): void {
        this.hazardTimer += delta;

        // add difficulty here
        if (this.hazardTimer >= this.clicks) {
            this.elapsedSeconds += 1;
            this.score += 10;
            this.timerText.setText(`TIME ${this.elapsedSeconds}s`);
            this.scoreText.setText(`SCORE ${this.score.toString().padStart(4, '0')}`);

            this.trailContext = new TrailContext(new CreateHazardOnTrail)
            this.trailContext.executeStrategy();
            this.trailContext = new TrailContext(new AdvanceHazards)
            this.trailContext.executeStrategy();
            this.renderTrail();

            this.hazardTimer = 0;
        }
    }
}
