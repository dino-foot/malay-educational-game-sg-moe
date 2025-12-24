import { Scene, GameObjects } from 'phaser';
import { Utils } from './Utils';

const menuButtons = [
    { key: 'bas', scene: 'Game' },
    { key: 'kuasa', scene: 'Game2' },
    { key: 'kampung', scene: 'Game3' },
];
export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    centerXY: Phaser.Math.Vector2;
    kuasaBtn: GameObjects.Image;

    constructor() {
        super('MainMenu');
    }

    init() {
        this.centerXY = Utils.CenterXY(this.game);
    }

    create() {
        const { x, y } = this.centerXY;

        // Background
        this.background = this.add
            .image(x, y, 'bg')
            .setOrigin(0.5);

        // Logo (top-left style like mockup)
        this.logo = this.add
            .image(x - 450, y - 270, 'logo')
            .setOrigin(0.5)
            .setScale(0.9);

        this.createMenuButtons(x, y);

    } // end

    private createMenuButtons(x: number, y: number) {
        const startX = x - 460;
        const startY = y - 10;
        const gapY = 20;

        menuButtons.forEach((btn, index) => {
            const button = this.add
                .image(
                    startX,
                    startY + index * (this.btnHeight(btn.key) + gapY),
                    btn.key
                )
                .setOrigin(0.5)
                .setScale(0.9)
                .setInteractive({ useHandCursor: true });

            // Hover
            button.on('pointerover', () => {
                button.setScale(0.95);
            });

            button.on('pointerout', () => {
                button.setScale(0.9);
            });

            // Click
            button.on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scale: 0.85,
                    duration: 80,
                    yoyo: true,
                    onComplete: () => {
                        this.scene.start(btn.scene);
                    }
                });
            });
        });
    }


    btnHeight(key: string): number {
        const frame = this.textures.get(key).getSourceImage() as HTMLImageElement;
        return frame.height * 0.9; // match scale
    }

}
