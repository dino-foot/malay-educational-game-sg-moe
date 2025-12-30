import { Scene } from "phaser";
import { Utils } from "./Utils";

export class GameOver extends Scene {

    constructor() {
        super("GameOver");
    }

    create() {
        const { x, y } = Utils.CenterXY(this.game);

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        const panelBg = this.add.image(x, y, "setting-bg").setOrigin(0.5);
        panelBg.setDisplaySize(panelBg.width, panelBg.height);

        const titleImg = this.add.image(0, 0, 'gameover').setOrigin(0.5).setDepth(11);
        Phaser.Display.Align.In.TopCenter(titleImg, panelBg, 0, -30);


        const backToMenu = this.add.image(0, 0, 'back-to-menu').setOrigin(0.5).setDepth(12).setScale(0.8);
        Phaser.Display.Align.In.BottomCenter(backToMenu, panelBg, 0, -20);
        Utils.MakeButton(this, backToMenu, () => {
            this.scene.launch('MainMenu');
            this.scene.sendToBack();
            this.scene.pause();
        });
    }
}
