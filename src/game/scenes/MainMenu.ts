import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        let background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(640, 360);

        this.logo = this.add.image(320, 140, 'logo');
        this.logo.setScale(2)

        this.title = this.add.text(320, 240, 'Press to Continue', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.title,
            alpha: {
                start: 1,
                from: 1,
                to: 0,
            },
            duration: 1000,
            repeat: -1,
            yoyo: true,
        })

        this.input.once('pointerdown', () => {

            this.scene.start('Game', {currentLevel: 0});

        });
    }
}
