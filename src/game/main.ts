import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { BasScene } from './scenes/BasScene';
import { KuasaScene } from './scenes/KuasaScene';
import { KaysakScene } from './scenes/KayakScene';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 900;

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        BasScene,
        KuasaScene,
        KaysakScene,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
