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
        if(this.hazardTimer >= this.clicks) {
            this.trailContext = new TrailContext(new CreateHazardOnTrail)
            this.trailContext.executeStrategy();
            this.trailContext = new TrailContext(new AdvanceHazards)
            this.trailContext.executeStrategy();
            this.renderTrail();

            this.hazardTimer = 0;
        }
    }
}
