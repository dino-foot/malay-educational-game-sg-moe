import { Scene, GameObjects } from "phaser";
import { Utils } from "./Utils";
import { SoundUtil } from "./SoundUtil";

const menuButtons = [
    { key: "bas", scene: "BasScene" },
    { key: "kuasa", scene: "KuasaScene" },
    { key: "kampung", scene: "KayakScene" },
];
export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    centerXY: Phaser.Math.Vector2;
    kuasaBtn: GameObjects.Image;
    settingsBtn: GameObjects.Image;
    watchLights: Phaser.GameObjects.Image[] = [];
    watchBars: Phaser.GameObjects.Image[] = [];

    constructor() {
        super("MainMenu");
    }

    init() {
        this.centerXY = Utils.CenterXY(this.game);
    }

    create() {
        const { x, y } = this.centerXY;

        SoundUtil.loadSettings();
        SoundUtil.init(this);
        SoundUtil.playBg('mainMenuMusic');

        // Background
        this.background = this.add.image(x, y, "bg").setOrigin(0.5);
        // Logo (top-left style like mockup)
        this.logo = this.add
            .image(x - 450, y - 270, "logo")
            .setOrigin(0.5)
            .setScale(0.9);
        this.createMenuButtons(x, y);

        // settings button (top-right)
        this.settingsBtn = this.add
            .image(0, 0, "settings")
            .setOrigin(0.5)
            .setScale(0.9)
            .setInteractive({ useHandCursor: true });

        Utils.AlignTopRight(this.settingsBtn, this.background, -20, -10);
        Utils.MakeButton(this, this.settingsBtn, () => {
            SoundUtil.playClick();
            Utils.openSettings(this);
        });

        const characterCointainer = this.add.container();
        const umar = this.add.image(x + 460, y + 70, "omar").setOrigin(0.5);
        const glow = this.add.image(0, 0, "glow").setOrigin(0.5).setDepth(2);
        const battery_off = this.add.image(0, 0, 'battery_off').setOrigin(0.5);

        const greenLight = this.add.image(927, 205, 'green_light').setOrigin(0.5); // always on
        const blueLight = this.add.image(952, 373, 'blue_light').setOrigin(0.5);
        const yellowLight = this.add.image(1035, 193, 'yellow_light').setOrigin(0.5).setAngle(7);
        const redLight = this.add.image(1057, 367, 'red_light').setOrigin(0.5);

        const bar1 = this.add.image(968, 288, 'bar1').setOrigin(0.5);
        const bar2 = this.add.image(990, 285, 'bar2').setOrigin(0.5);
        const bar3 = this.add.image(1014, 281, 'bar3').setOrigin(0.5);

        characterCointainer.setSize(300, 300)
        characterCointainer.add([umar, battery_off, bar1, bar2, bar3, greenLight, blueLight, yellowLight, redLight]);
        characterCointainer.setDepth(3);

        Phaser.Display.Align.In.Center(glow, umar, -250, -320);
        Phaser.Display.Align.In.Center(battery_off, umar, -270, -235);

        this.watchLights = [blueLight, yellowLight, redLight];
        this.watchBars = [bar1, bar2, bar3];

        // Hide all initially
        [...this.watchBars, ...this.watchLights].forEach(item => item.setVisible(false));

        const completedLevels = this.registry.get('completedLevels') || 0;
        this.updateProgress(completedLevels);

        //? debug start bas scene directly
        // this.scene.start("KayakScene");
    } // end

    private createMenuButtons(x: number, y: number) {
        const startX = x - 460;
        const startY = y - 10;
        const gapY = 20;

        menuButtons.forEach((btn, index) => {
            const button = this.add
                .image(startX, startY + index * (this.btnHeight(btn.key) + gapY), btn.key)
                .setOrigin(0.5)
                .setScale(0.9)
                .setInteractive({ useHandCursor: true });

            Utils.MakeButton(this, button, () => {
                // console.log(`Start scene: ${btn.key}`);
                SoundUtil.playClick();
                Utils.FadeToScene(this, btn.scene);
                // this.scene.start(btn.scene);
            });
        });
    }

    private updateProgress(levelCompletedCount: number) {
        for (let i = 0; i < levelCompletedCount; i++) {
            if (this.watchLights[i]) this.watchLights[i].setVisible(true);
            if (this.watchBars[i]) this.watchBars[i].setVisible(true);
        }
    }

    btnHeight(key: string): number {
        const frame = this.textures.get(key).getSourceImage() as HTMLImageElement;
        return frame.height * 0.9; // match scale
    }
}
