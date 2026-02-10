import { Display, Scene } from "phaser";
import { Utils } from "./Utils";

export class InstructionScene extends Scene {
    fromScene!: string;

    constructor() {
        super({ key: "InstructionScene" });
    }

    init(data: { from: string }) {
        this.fromScene = data.from;
    }

    create() {
        const { x, y } = Utils.CenterXY(this.game);

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        // Settings panel background
        const panelBg = this.add.image(x, y, "insturction-bg").setOrigin(0.5);
        panelBg.setDisplaySize(850, 500);

        let img = 'insturction_1';
        if (this.fromScene === 'BasScene') {
            img = 'insturction_1';
        }
        else if (this.fromScene === 'KuasaScene') {
            img = 'insturction_2';
        }
        else if (this.fromScene === 'KayakScene') {
            img = 'insturction_3';
        }

        const instructionImg = this.add.image(0, 0, img).setOrigin(0.5).setDepth(1);
        Display.Align.In.TopCenter(instructionImg, panelBg, 0, -50);

        const okBtn = this.add.image(0, 0, 'ins-btn').setOrigin(0.5).setDepth(2).setScale(0.7);
        Display.Align.In.BottomCenter(okBtn, panelBg, 0, -10);

        Utils.MakeButton(this, okBtn, () => {
            this.scene.sendToBack();
        });
    }
}
