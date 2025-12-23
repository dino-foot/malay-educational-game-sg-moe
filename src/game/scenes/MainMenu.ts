import { Scene, GameObjects } from 'phaser';
import { Utils } from './Utils';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    centerXY: Phaser.Math.Vector2;

    constructor() {
        super('MainMenu');
    }

    init() {
        this.centerXY = Utils.CenterXY(this.game);
    }

    create() {
        this.background = this.add.image(this.centerXY.x, this.centerXY.y, 'bg');

        this.logo = this.add.image(512, 300, 'logo');

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
