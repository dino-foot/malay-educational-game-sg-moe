import { Scene } from 'phaser';

export class KaysakScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    constructor() {
        super('KayakScene');
    }
    create() { }
}