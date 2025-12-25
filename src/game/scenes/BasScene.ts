import { Scene } from 'phaser';
import { Utils } from './Utils';

export class BasScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    wordRects: Phaser.GameObjects.Image;

    constructor() {
        super('BasScene');
    }

    create() {
        const { width, height } = this.cameras.main;
        const { x, y } = Utils.CenterXY(this.game);

        // Background
        this.background = this.add
            .image(x, y, 'paper')
            .setDepth(-1)
            .setOrigin(0.5).setDisplaySize(width, height);

        // Word Rects
        this.wordRects = this.add
            .image(x, y, 'rect_bus')
            .setOrigin(0.5)
            .setScale(1);
        Utils.AlignBottomCenter(this.wordRects, this.background, 0, 250);


        const road = this.add
            .image(x, y + 120, 'road')
            .setOrigin(0.5)
            .setScale(1);

        const cityScape = this.add
            .image(x, y, 'upper-bg')
            .setOrigin(0.5)
            .setDisplaySize(width, 401)
            .setDepth(1);

        Utils.AlignTopCenter(cityScape, this.background, 0, 330);

        const sun = this.add
            .image(0, 0, 'sun')
            .setOrigin(0.5)
            .setDepth(2)
            .setScale(1);

        Utils.AlignTopRight(sun, cityScape, -400, -100);

        // Set camera bounds to the size of the background image
        this.cameras.main.setBounds(0, 0, this.background.width, this.background.height);
    }
}