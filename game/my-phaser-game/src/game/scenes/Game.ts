import { Scene } from 'phaser';
import {TrailContext, HazardQueue} from "../assets/trail/Trail.ts"
import {CreateHazardOnTrail, AdvanceHazards} from "../assets/trail/TrailStrategys.ts"
// Docs https://docs.phaser.io/api-documentation/class/scene
export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    trailContext : TrailContext;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });

        // setup trail handler. First step is to set strategy as create hazard
        this.trailContext = new TrailContext(new CreateHazardOnTrail)

        // starts on creates hazard. Strategy set in create()
        while(HazardQueue.size() < 8)
            this.trailContext.executeStrategy();

        for (let index = 0; index < 15; index++) {
            console.log(HazardQueue.toString());
            console.log(HazardQueue.size());
            // change to strategy to AdvanceHazards
            this.trailContext = new TrailContext(new AdvanceHazards);
            this.trailContext.executeStrategy();

            // back to creating hazards
            this.trailContext = new TrailContext(new CreateHazardOnTrail);
            console.log(HazardQueue.toString());
            console.log(HazardQueue.size());

            this.trailContext.executeStrategy();
        }
    }

    // make it so each of these do not run every second.
    // use the time and delta values for effective performance.
    update(time: number, delta: number): void {
    }
}
