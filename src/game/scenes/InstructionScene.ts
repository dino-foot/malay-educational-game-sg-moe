import { Display, Scene } from "phaser";
import { Utils } from "./Utils";
import { SoundUtil } from "./SoundUtil";

export class InstructionScene extends Scene {
    fromScene!: string;

    constructor() {
        super({ key: "InstructionScene" });
    }

    init(data: { from: string }) {
        this.fromScene = data.from;
        this.scene.bringToTop();
    }

    create() {
        const { x, y } = Utils.CenterXY(this.game);

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        // Settings panel background
        const panelBg = this.add.image(x, y, "insturction-bg").setOrigin(0.5);
        panelBg.setDisplaySize(850, 600);

        let img = 'insturction_1';
        if (this.fromScene === 'BasScene') {
            img = 'insturction_1';
            SoundUtil.stopAllSfx();
            SoundUtil.playVO('Peringkat-1');
        }
        else if (this.fromScene === 'KuasaScene') {
            img = 'insturction_2';
            SoundUtil.stopAllSfx();
            SoundUtil.playVO('Peringkat-2');
        }
        else if (this.fromScene === 'KayakScene') {
            img = 'insturction_3';
            SoundUtil.stopAllSfx();
            SoundUtil.playVO('Peringkat-3');
        }

        const instructionImg = this.add.image(0, 0, img).setOrigin(0.5).setDepth(1);
        Display.Align.In.TopCenter(instructionImg, panelBg, 0, -50);

        const okBtn = this.add.image(0, 0, 'ins-btn').setOrigin(0.5).setDepth(2).setScale(0.65);
        Display.Align.In.BottomCenter(okBtn, panelBg, 0, 20);

        Utils.MakeButton(this, okBtn, () => {
            this.scene.stop();
            SoundUtil.stopAllSfx();
        });
    }
}
