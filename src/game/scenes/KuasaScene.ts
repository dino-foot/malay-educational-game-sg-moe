import { Scene } from 'phaser';

export class KuasaScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    constructor() {
        super('KuasaScene');
    }
    create() { }
}