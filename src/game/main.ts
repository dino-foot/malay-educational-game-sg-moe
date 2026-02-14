import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { BasScene } from './scenes/BasScene';
import { KuasaScene } from './scenes/KuasaScene';
import { KaysakScene } from './scenes/KayakScene';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { SpinePlugin } from '@esotericsoftware/spine-phaser';
import { SettingsScene } from './scenes/SettingsScene';
import { SplashScene } from './scenes/SplashScene';
import { CreditScene } from './scenes/CreditScene';
import { InstructionScene } from './scenes/InstructionScene';
import { OnExitScene } from './scenes/OnExitScene';
import { GameTitlePopupScene } from './scenes/GameTitlePopUpText';

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 900;

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    parent: 'game-container',
    backgroundColor: 'rgb(0, 0, 0)',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Boot,
        Preloader,
        SplashScene,
        CreditScene,
        MainMenu,
        BasScene,
        KuasaScene,
        KaysakScene,
        GameOver,
        SettingsScene,
        InstructionScene,
        OnExitScene,
        GameTitlePopupScene,
    ],

    plugins: {
        scene: [
            { key: "SpinePlugin", plugin: SpinePlugin, mapping: "spine", sceneKey: "MainMenu", start: true },
        ]
    }
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;

console.log('version 0.9 ❤️❤️❤️');
