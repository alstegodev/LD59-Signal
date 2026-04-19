import {Scene} from "phaser";

export class UI extends Scene {

    private mute: Phaser.GameObjects.Image;
    private sound_mute: Phaser.GameObjects.Image;

    private muted: boolean = false;
    private sound_muted: boolean = false;

    private score: number = 0;
    private score_text: Phaser.GameObjects.Text;

    private score_text_text = 'Connected Planets:'

    constructor() {
        super('UI');
    }

    create() {
        this.mute = this.add.image(600, 5, 'unmute').setOrigin(0).setScale(1);
        this.sound_mute = this.add.image(560, 3, 'sound_unmute').setOrigin(0).setScale(1.2);

        this.mute.setInteractive();
        this.sound_mute.setInteractive();

        this.score_text = this.add.text(360, 340, '', { fontSize: '20px' }).setOrigin(0);
        this.score_text.setAlpha(0)

        this.initListeners()
    }

    initListeners() {
        this.mute.on('pointerover', () => {
            this.mute.setTint(0x639bff);
        })

        this.sound_mute.on('pointerover', () => {
            this.sound_mute.setTint(0x639bff);
        })

        this.mute.on('pointerout', () => {
            this.mute.clearTint();
        })

        this.sound_mute.on('pointerout', () => {
            this.sound_mute.clearTint();
        })

        this.mute.on('pointerdown', () => {
            if (this.muted) {
                this.game.events.emit('unmute');
            } else {
                this.game.events.emit('mute');
            }
            this.muted = !this.muted;

            this.mute.setTexture(this.muted ? 'mute' : 'unmute');
        })

        this.sound_mute.on('pointerdown', () => {
            if (this.sound_muted) {
                this.game.events.emit('sound_unmute');
            } else {
                this.game.events.emit('sound_mute');
            }
            this.sound_muted = !this.sound_muted;

            this.sound_mute.setTexture(this.sound_muted ? 'sound_mute' : 'sound_unmute');
        })


        this.game.events.on('score_up', () => {
            this.score++
            this.score_text.setText(`${this.score_text_text} ${this.score}`)
            this.score_text.setAlpha(1)
        })

        this.game.events.on('score_down', () => {
            this.score--
            this.score_text.setText(`${this.score_text_text} ${this.score}`)
            this.score_text.setAlpha(1)
        })

        this.game.events.on('gameover', (data: { score_level: number }) => {
            this.score = this.score - data.score_level
            this.score_text.setText(`${this.score_text_text} ${this.score}`)
            this.score_text.setAlpha(1)
        })
    }
}
