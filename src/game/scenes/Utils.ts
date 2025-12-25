export class Utils {

    public static CenterXY(game: Phaser.Game): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(
            game.scale.width * 0.5,
            game.scale.height * 0.5
        );
    }

    /**
     * Align target image to the TOP-LEFT of a reference image
     * with optional offset
     */
    public static AlignTopLeft(
        target: Phaser.GameObjects.GameObject,
        reference: Phaser.GameObjects.GameObject,
        offsetX: number = 0,
        offsetY: number = 0
    ): void {
        Phaser.Display.Align.In.TopLeft(target, reference, offsetX, offsetY);
    }

    public static AlignTopRight(
        target: Phaser.GameObjects.GameObject,
        reference: Phaser.GameObjects.GameObject,
        offsetX: number = 0,
        offsetY: number = 0
    ): void {

        Phaser.Display.Align.In.TopRight(target, reference, offsetX, offsetY);
    }

    public static AlignBottomCenter(
        target: Phaser.GameObjects.GameObject,
        reference: Phaser.GameObjects.GameObject,
        offsetX: number = 0,
        offsetY: number = 0
    ): void {
        Phaser.Display.Align.In.BottomCenter(target, reference, offsetX, offsetY);
    }

    public static AlignTopCenter(
        target: Phaser.GameObjects.GameObject,
        reference: Phaser.GameObjects.GameObject,
        offsetX: number = 0,
        offsetY: number = 0
    ): void {
        Phaser.Display.Align.In.TopCenter(target, reference, offsetX, offsetY);
    }

    /**
    * Adds button-like input behavior to an image
    */
    public static MakeButton(
        scene: Phaser.Scene,
        image: Phaser.GameObjects.Image,
        onClick: () => void,
        options?: {
            baseScale?: number;
            hoverScale?: number;
            pressScale?: number;
            pressDuration?: number;
        }
    ): void {

        const baseScale = options?.baseScale ?? image.scale;
        const hoverScale = options?.hoverScale ?? baseScale * 1.05;
        const pressScale = options?.pressScale ?? baseScale * 0.95;
        const pressDuration = options?.pressDuration ?? 80;

        image
            .setInteractive({ useHandCursor: true })
            .setScale(baseScale);

        image.on('pointerover', () => {
            image.setScale(hoverScale);
        });

        image.on('pointerout', () => {
            image.setScale(baseScale);
        });

        image.on('pointerdown', () => {
            scene.tweens.add({
                targets: image,
                scale: pressScale,
                duration: pressDuration,
                yoyo: true,
                onComplete: onClick
            });
        });
    }
}
