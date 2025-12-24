import { Scene } from 'phaser';

export class BasScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    constructor() {
        super('BasScene');
    }

    create() {

    }
}