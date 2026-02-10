import Phaser, { Display } from "phaser";
import { Utils } from "./Utils";
import { SoundUtil } from "./SoundUtil";

export class OnExitScene extends Phaser.Scene {
    fromScene!: string;

    constructor() {
        super({ key: "OnExitScene" });
    }

    init(data: { from: string }) {
        this.fromScene = data.from;
    }

    create() {
        SoundUtil.init(this);
        const { x, y } = Utils.CenterXY(this.game);

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        // Settings panel background
        const panelBg = this.add.image(x, y, "setting-bg").setOrigin(0.5);
        panelBg.setScale(0.9);
        // panelBg.setDisplaySize(panelBg.width, panelBg.height + 80);

        // settings button (top-right)
        const okBtn = this.add
            .image(200, 300, "ok")
            .setOrigin(0.5)
            .setScale(0.8)
            .setInteractive({ useHandCursor: true });

        const batalBtn = this.add
            .image(200, 300, "batal")
            .setOrigin(0.5)
            .setScale(0.8)
            .setInteractive({ useHandCursor: true });


        const menuText = this.add.image(0, 0, 'menu-title').setOrigin(0.5);
        const confirmationText = this.add.image(0, 0, 'confirmation-text').setOrigin(0.5);

        Display.Align.In.TopCenter(menuText, panelBg, 0, -70);
        Display.Align.In.TopCenter(confirmationText, panelBg, 0, -170);

        Display.Align.In.BottomCenter(okBtn, panelBg, -100, -50);
        Display.Align.In.BottomCenter(batalBtn, panelBg, 100, -50);


        Utils.MakeButton(this, okBtn, () => {
            SoundUtil.playClick();

            SoundUtil.stopSfx('paddleBoat');
            SoundUtil.stopSfx('busRollForward');
            SoundUtil.stopSfx('trainPassing');

            Utils.FadeToScene(this, 'MainMenu', () => {
                this.scene.sendToBack();
                this.scene.bringToTop('MainMenu');
            });
        });

        Utils.MakeButton(this, batalBtn, () => {
            SoundUtil.playClick();
            this.scene.stop();
            this.scene.resume(this.fromScene); // resume previous scene
        });
    }

}
