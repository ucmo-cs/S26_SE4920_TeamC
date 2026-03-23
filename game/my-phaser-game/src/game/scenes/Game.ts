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
        // get it to run in order. Race condition
        // Promise.resolve()
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran");}, 2000))
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran2");}, 4000))
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran3");}, 6000))
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran4");}, 8000))
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran5");}, 10000))
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran6");}, 12000))
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran7");}, 14000))
        // .then(() => setTimeout(() => {this.trailContext.executeStrategy(); console.log("ran8");}, 16000))
        // .then(() => setTimeout(() => {console.log(HazardQueue.toString()); console.log("ran9");}, 18000)) // final call
        // .catch(err => console.error("Error executing strategies:", err));

        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();
        this.trailContext.executeStrategy();

        console.log(HazardQueue.toString());
    }

    // make it so each of these do not run every second.
    // use the time and delta values for effective performance.
    update(time: number, delta: number): void {
        this.trailContext = new TrailContext(new CreateHazardOnTrail)
        this.trailContext.executeStrategy();
        this.trailContext = new TrailContext(new AdvanceHazards)
        this.trailContext.executeStrategy()

        console.log(HazardQueue.toString());
    }
}
