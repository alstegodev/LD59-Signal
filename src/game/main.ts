import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import {WEBGL, Game, Scale} from 'phaser';
import { Preloader } from './scenes/Preloader';
import {AudioManager} from "./scenes/AudioManager.ts";
import {UI} from "./scenes/UI.ts";
import {Tutorial} from "./scenes/Tutorial.ts";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: WEBGL,
    width: 640,
    height: 360,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        AudioManager,
        UI,
        Tutorial
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
