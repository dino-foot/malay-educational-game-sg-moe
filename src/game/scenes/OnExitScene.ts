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
        panelBg.setDisplaySize(panelBg.width, panelBg.height + 80);

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

        Display.Align.In.BottomCenter(okBtn, panelBg, -100, -10);
        Display.Align.In.BottomCenter(batalBtn, panelBg, 100, -10);


        Utils.MakeButton(this, okBtn, () => {
            SoundUtil.playClick();
            // Utils.openSettings(this);
        });

        Utils.MakeButton(this, batalBtn, () => {
            SoundUtil.playClick();
            // Utils.openSettings(this);
        });
    }

}
