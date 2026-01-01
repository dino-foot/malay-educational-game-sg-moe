export class Utils {
    public static fontStyle = {
        fontSize: "36px",
        color: "#000",
        fontStyle: "bold",
    };

    public static corectAnswerPoint = 10;
    public static correctAnswerBonus = 5;
    public static wrongAnswer = -5;

    public static DEFAULT_WORD_SCALE_CONFIG = {
        letterScale: 0.75,
        slotScale: 0.9,
        spacing: 150,
        spacingOfRandomLetter: 110,
    };

    public static WORD_SCALE_CONFIG: {
        [length: number]: {
            letterScale: number;
            slotScale: number;
            spacing: number;
            spacingOfRandomLetter: number;
        };
    } = {
            // 8: { letterScale: 0.8, slotScale: 0.7, spacing: 105, verticalOffset: 20 },
            12: { letterScale: 0.7, slotScale: 0.7, spacing: 105, spacingOfRandomLetter: 90 },
            14: { letterScale: 0.6, slotScale: 0.6, spacing: 90, spacingOfRandomLetter: 80 },
        };

    public static CenterXY(game: Phaser.Game): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(game.scale.width * 0.5, game.scale.height * 0.5);
    }

    /**
     * Align target image to the TOP-LEFT of a reference image
     * with optional offset
     */
    public static AlignTopLeft(target: Phaser.GameObjects.GameObject, reference: Phaser.GameObjects.GameObject, offsetX: number = 0, offsetY: number = 0): void {
        Phaser.Display.Align.In.TopLeft(target, reference, offsetX, offsetY);
    }

    public static AlignTopRight(target: Phaser.GameObjects.GameObject, reference: Phaser.GameObjects.GameObject, offsetX: number = 0, offsetY: number = 0): void {
        Phaser.Display.Align.In.TopRight(target, reference, offsetX, offsetY);
    }

    public static AlignBottomCenter(target: Phaser.GameObjects.GameObject, reference: Phaser.GameObjects.GameObject, offsetX: number = 0, offsetY: number = 0): void {
        Phaser.Display.Align.In.BottomCenter(target, reference, offsetX, offsetY);
    }

    public static AlignTopCenter(target: Phaser.GameObjects.GameObject, reference: Phaser.GameObjects.GameObject, offsetX: number = 0, offsetY: number = 0): void {
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

        image.setInteractive({ useHandCursor: true }).setScale(baseScale);

        image.on("pointerover", () => {
            image.setScale(hoverScale);
        });

        image.on("pointerout", () => {
            image.setScale(baseScale);
        });

        image.on("pointerdown", () => {
            scene.tweens.add({
                targets: image,
                scale: pressScale,
                duration: pressDuration,
                yoyo: true,
                onComplete: onClick,
            });
        });
    }

    public static DebugGraphics(scene: Phaser.Scene, wordZone: Phaser.GameObjects.Zone) {
        const debugGraphics = scene.add.graphics().setDepth(1000);

        debugGraphics.lineStyle(10, 0x00ff00, 1).strokeRect(wordZone.getTopLeft().x ?? 0, wordZone.getTopLeft().y ?? 0, wordZone.width ?? 0, wordZone.height ?? 0);
    }

    public static Clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    public static ShuffleArray<T>(array: T[]): T[] {
        const shuffledArray = array.slice(); // Create a copy of the array
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

    public static LoadLocalFont(name: string, url: string) {
        const font = new FontFace(name, `url(${url})`);
        font
            .load()
            .then((loadedFont) => {
                document.fonts.add(loadedFont);
                console.log(`Font loaded: ${name}`);
            })
            .catch((err) => {
                console.error("Font loading failed", err);
            });
    }
}
