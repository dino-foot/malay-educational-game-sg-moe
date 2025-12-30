import { Scene, GameObjects } from 'phaser';
import { Utils } from './Utils';

const menuButtons = [
    { key: 'bas', scene: 'BasScene' },
    { key: 'kuasa', scene: 'KuasaScene' },
    { key: 'kampung', scene: 'KaysakScene' },
];
export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    centerXY: Phaser.Math.Vector2;
    kuasaBtn: GameObjects.Image;
    settingsBtn: GameObjects.Image;

    constructor() {
        super('MainMenu');
    }

    init() {
        this.centerXY = Utils.CenterXY(this.game);
    }

    create() {
        const { x, y } = this.centerXY;

        //* add spine boat later    
        // const boat = this.add.spine(x, y, "boat-data", "boat-atlas").setOrigin(0.5);
        // boat.setDepth(10);
        // boat.setInteractive();
        // boat.animationState.setAnimation(0, "rowling", true);
        // this.input.enableDebug(boat, 0xff00ff);

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

        // settings button (top-right)
        this.settingsBtn = this.add
            .image(x + 450, y - 270, 'settings')
            .setOrigin(0.5)
            .setScale(0.9)
            .setInteractive({ useHandCursor: true });

        Utils.AlignTopRight(this.settingsBtn, this.background, -20, -20);
        Utils.MakeButton(this, this.settingsBtn, () => {
            this.scene.launch('SettingsMenu');
            this.scene.sendToBack();
            this.scene.pause();
        });

        const characterCointainer = this.add.container();
        const umar = this.add
            .image(x + 460, y + 70, 'omar')
            .setOrigin(0.5);

        characterCointainer.add(umar);
        characterCointainer.setDepth(1);

        //? debug start bas scene directly
        // this.scene.start('BasScene');

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

            Utils.MakeButton(this, button, () => {
                console.log(`Start scene: ${btn.key}`);
                this.scene.start(btn.scene);
            });
        });
    }


    btnHeight(key: string): number {
        const frame = this.textures.get(key).getSourceImage() as HTMLImageElement;
        return frame.height * 0.9; // match scale
    }

}
