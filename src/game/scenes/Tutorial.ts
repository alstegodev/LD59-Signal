import {Scene} from "phaser";

export class Tutorial extends Scene{

    constructor() {
        super('Tutorial');
    }

    public create(): void {

        let background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(640, 360);

        let tut1 = this.add.image(0, 0, 'tut1').setOrigin(0, 0);

        this.input.once('pointerdown', () => {
            tut1.setTexture('tut2');
            this.input.once('pointerdown', () => {
                tut1.setTexture('tut3');
                this.input.once('pointerdown', () => {
                    tut1.setTexture('tut3');
                    this.scene.start('Game', {currentLevel: 0, planetCount: 10, signalSpeed: 12});
                })
            })
        })

    }

}