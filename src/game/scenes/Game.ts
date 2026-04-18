import {Math, Scene} from 'phaser';
import {levels} from "../classes/levels.ts";
import Sprite = Phaser.GameObjects.Sprite;

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;

    msg_text: Phaser.GameObjects.Text;

    currentlevel: number

    planets: {
        sprite: Phaser.GameObjects.Sprite,
        outline: Phaser.GameObjects.Sprite,
        active: boolean,
        finished: boolean
    }[] = [];

    signals: number = 0;


    constructor() {
        super('Game');
    }

    create(data: { currentLevel: number }) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        let background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        background.setDisplaySize(640, 360);

        this.currentlevel = data.currentLevel;

        this.loadLevel(data.currentLevel);
    }

    loadLevel(level: number) {
        this.msg_text = this.add.text(320, 180, 'Level: ' + (level + 1), {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            shadow: {offsetX: 2, offsetY: 2, color: '#00ff00', fill: true},
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);
        this.msg_text.setAlpha(1)


        this.signals = 0;

        console.log(levels[this.currentlevel].planets)

        this.planets = levels[this.currentlevel].planets.map(planet => {
            let sprite: Sprite
            let outline: Sprite
            switch (planet.size) {
                case 's':
                    sprite = this.add.sprite(planet.x, planet.y, 'planet-sheet-s', planet.sprite);
                    outline = this.add.sprite(planet.x, planet.y, 'outline-s').play({
                        key: 'Rotate_S',
                        repeat: -1,
                        timeScale: 0.5
                    })
                    break;
                case 'm':
                    sprite = this.add.sprite(planet.x, planet.y, 'planet-sheet-m', planet.sprite);
                    outline = this.add.sprite(planet.x, planet.y, 'outline-m').play({
                        key: 'Rotate_M',
                        repeat: -1,
                        timeScale: 0.5
                    })
                    break;
                case 'l':
                    sprite = this.add.sprite(planet.x, planet.y, 'planet-sheet-l', planet.sprite);
                    outline = this.add.sprite(planet.x, planet.y, 'outline-l').play({
                        key: 'Rotate_L',
                        repeat: -1,
                        timeScale: 0.5
                    })
                    break;
            }

            outline.setAlpha(0);

            return {
                sprite,
                outline,
                active: false,
                finished: false
            }
        })

        this.planets.forEach(planet => {
            planet.sprite.setInteractive();
            planet.sprite.on('pointerover', () => {
                planet.active = true;
                planet.outline.setAlpha(1);
            })

            planet.sprite.on('pointerout', () => {
                planet.active = false;
                planet.outline.setAlpha(0);
            })
        })

        this.finishPlanet(0)

        this.input.once('pointerdown', () => {
            this.sendSignal(0);
            this.msg_text.setAlpha(0);
        })

        this.children.bringToTop(this.msg_text);
    }

    sendSignal(planet: number) {
        let currentLevelConf = levels[this.currentlevel];
        let originPlanet = currentLevelConf.planets[planet];

        originPlanet.connections.forEach(connection => {
            let signal = this.add.sprite(originPlanet.x, originPlanet.y, 'signal')
            signal.setRotation(Math.Angle.BetweenPoints(originPlanet, currentLevelConf.planets[connection]));

            this.signals++
            this.tweens.add({
                targets: signal,
                x: currentLevelConf.planets[connection].x,
                y: currentLevelConf.planets[connection].y,
                rotate: Math.Angle.BetweenPoints(originPlanet, currentLevelConf.planets[connection]),
                duration: Math.Distance.BetweenPoints(originPlanet, currentLevelConf.planets[connection]) * currentLevelConf.signalSpeed,
                // ease: 'Sine.easeInOut',
                onComplete: () => {
                    this.signals--
                    signal.destroy();
                    if (this.planets[connection].active) {
                        this.sendSignal(connection);
                    }
                    this.finishPlanet(connection);
                    this.checkStatus()
                }
            })
        })
    }

    finishPlanet(planet: number) {
        let planetSprite = this.planets[planet].sprite;
        let planetOutline = this.planets[planet].outline;
        planetSprite.removeAllListeners()
        planetOutline.setAlpha(1)
        planetOutline.setTint(0x00ff00)
        this.planets[planet].active = false;
        this.planets[planet].finished = true;

        planetSprite.once('pointerdown', () => {
            this.planets[planet].active = true;
            this.planets[planet].finished = false;
            planetOutline.clearTint();

            planetSprite.on('pointerover', () => {
                this.planets[planet].active = true;
                this.planets[planet].outline.setAlpha(1);
            })

            planetSprite.on('pointerout', () => {
                this.planets[planet].active = false;
                this.planets[planet].outline.setAlpha(0);
            })
        })
    }

    checkStatus() {
        let finished = true;
        this.planets.forEach((planet) => {
            if (!planet.finished) {
                finished = false;
                return;
            }
        });
        if (finished) {
            this.unloadCurrentSprites();
            this.loadNextLevel();
        } else {
            if (this.signals <= 0) {
                this.msg_text.setText('Game Over');
                this.children.bringToTop(this.msg_text);
                this.msg_text.setAlpha(1)

                let againText = this.add.text(320, 260, 'Try Again?', {
                    fontFamily: 'Arial Black', fontSize: 16, color: '#ffffff',
                    shadow: {offsetX: 2, offsetY: 2, color: '#00ff00', fill: true},
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                });
                againText.setOrigin(0.5);
                this.children.bringToTop(againText);

                this.input.once('pointerdown', () => {
                    this.unloadCurrentSprites();
                    this.restartCurrentLevel()
                })
            }
        }
    }

    unloadCurrentSprites() {
        this.planets.forEach(planet => {
            planet.sprite.destroy();
            planet.outline.destroy();
        })
        this.planets = []
        this.signals = 0
        this.tweens.killAll()
    }

    restartCurrentLevel() {
        this.scene.start('Game', {currentLevel: this.currentlevel});
    }

    loadNextLevel() {

        if (this.currentlevel < levels.length - 1) {
            this.currentlevel++;
            this.scene.start('Game', {currentLevel: this.currentlevel});
        } else {
            this.scene.start('GameOver');
        }
    }
}
