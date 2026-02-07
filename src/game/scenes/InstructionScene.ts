import { Scene } from "phaser";
import { Utils } from "./Utils";

export class InstructionScene extends Scene {
    constructor() {
        super("InstructionScene");
    }

    init(data: { level: number }) {
        const level = data.level;
        console.log("InstructionScene >> level >> ", level);
    }

    create() {
        const { x, y } = Utils.CenterXY(this.game);

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        const panelBg = this.add.image(x, y, "setting-bg").setOrigin(0.5);
        panelBg.setDisplaySize(panelBg.width + 200, panelBg.height);
    }
}
