import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    hard: GameObjects.Text;
    medium: GameObjects.Text;
    easy: GameObjects.Text;


    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo');

        this.title = this.add.text(512, 460, 'Start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        let clicks = 800;
        // add difficulty options here
        // update clicks based on difficulty chosen

        this.input.once('pointerdown', () => {

            this.scene.start('Game', { difficulty: clicks });

        });
    }
}
