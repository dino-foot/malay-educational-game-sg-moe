import { Display, Scene } from "phaser";
import { Utils } from "./Utils";
import { SoundUtil } from "./SoundUtil";

export class GameTitlePopupScene extends Scene {
    private myContainer!: Phaser.GameObjects.Container;
    private currentY = 0;

    constructor() {
        super("GameTitlePopupScene");
    }

    init() { }

    create() {
        SoundUtil.init(this);
        const { x, y } = Utils.CenterXY(this.game);

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        // 1. Create a Container to hold the popup elements
        const popupContainer = this.add.container(x, y);

        // 2. Add elements to the container (positions are now relative to container's center 0,0)
        const panelBg = this.add.image(0, 0, "setting-bg").setOrigin(0.5);
        const titleImg = this.add.image(0, 0, "GameTitlePopUpText").setOrigin(0.5, 0); // Adjusted for container
        const closeBtn = this.add.image(0, 0, "GameTitle-Close").setOrigin(0.5); // Adjusted for container

        popupContainer.add([panelBg, titleImg, closeBtn]);
        Display.Align.In.BottomCenter(closeBtn, panelBg, 0, -50);
        Display.Align.In.TopCenter(titleImg, panelBg, 20, -50);

        // 3. Set initial state for the animation
        popupContainer.setScale(0); // Start invisible/small
        popupContainer.setAlpha(0);

        // 4. Add the "Pop Up" Tween
        this.tweens.add({
            targets: popupContainer,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 200,
            ease: Phaser.Math.Easing.Sine.Out, // Gives it a slight "bounce" effect
            onComplete: () => {
                // Optional: Play VO or enable buttons only after animation finishes
            }
        });

        this.registry.set('isFirstEntry', false);
        Utils.MakeButton(this, closeBtn, () => {
            SoundUtil.playClick();

            // Optional: Add a "Close" tween before stopping the scene
            this.tweens.add({
                targets: popupContainer,
                scale: 0,
                alpha: 0,
                duration: 200,
                onComplete: () => this.scene.stop()
            });
        });

    }
}
