import {Scene} from "phaser";

export class AudioManager extends Scene {

    sound_muted: boolean = false
    muted: boolean = false

    private theme: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    constructor() {
        super('AudioManager');
    }

    create() {
        this.theme = this.sound.add('theme', {loop: true, volume: 0.6});
        this.theme.play()


        this.initListeners()
    }

    private initListeners(): void {

        this.game.events.on('mute', () => {
            this.muted = true
        })

        this.game.events.on('unmute', () => {
            this.muted = false;
        })

        this.game.events.on('sound_mute', () => {
            this.theme.mute = true
        })

        this.game.events.on('sound_unmute', () => {
            this.theme.mute = false;
        })

        this.game.events.on('signal', () => {
            if (!this.muted)  this.sound.play('signal', {volume: 0.5});
        })

        this.game.events.on('gameover', () => {
            if (!this.muted) this.sound.play('gameover', {volume: 0.5});
        })

        this.game.events.on('success', () => {
            if (!this.muted) this.sound.play('success', {volume: 0.5});
        })

    }

}