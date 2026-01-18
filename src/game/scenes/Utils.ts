export class Utils {
    public static fontStyle = {
        fontSize: "36px",
        color: "white",
        fontFamily: "nunito",
        fontStyle: "bold",
    };

    public static fontStyleBlack = {
        fontSize: "36px",
        color: "black",
        fontFamily: "nunito",
        fontStyle: "bold",
    };

    public static scoreFontStyle = {
        fontSize: "64px",
        color: "#000",
        fontFamily: "nunito",
        fontStyle: "bold",
    };

    // public static kayakFontStyle = {
    //     fontSize: "34px",
    //     color: "#000",
    //     fontFamily: "nunito",
    //     fontStyle: "bold",
    //     wordWrap: { width: 300 }
    // };

    public static corectAnswerPoint = 10;
    public static correctAnswerBonus = 5;
    public static wrongAnswerPoint = 5;
    public static maxLevels = 10;
    public static baseDuration = 1500; // slowest
    public static minDuration = 400; // fastest

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
        image: Phaser.GameObjects.Image | Phaser.GameObjects.Container,
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
        debugGraphics.lineStyle(5, 0x00ff00, 1).strokeRect(wordZone.getTopLeft().x ?? 0, wordZone.getTopLeft().y ?? 0, wordZone.width ?? 0, wordZone.height ?? 0);
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

    static FadeToScene(
        scene: Phaser.Scene,
        nextSceneKey: string,
        options?: {
            fadeOutDuration?: number;
            fadeInDuration?: number;
            color?: { r: number; g: number; b: number };
        }
    ) {
        const camera = scene.cameras.main;
        const { fadeOutDuration = 700, fadeInDuration = 700, color = { r: 0, g: 0, b: 0 } } = options || {};
        camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            scene.scene.start(nextSceneKey);
        });
        camera.fadeOut(fadeOutDuration, color.r, color.g, color.b);
    }

    static openSettings(scene: Phaser.Scene) {
        scene.scene.launch("SettingsMenu", { from: scene.scene.key });
        scene.scene.bringToTop('SettingsMenu');
        scene.scene.pause();
    }

    static GetTrainSpeedByLevel(levelIndex, randomize = false) {
        const BASE_SPEED = 15500; // level 1
        const SPEED_DECREMENT = 1500;
        const MIN_SPEED = 4000; // safety clamp
        // base speed calculation
        let speed = BASE_SPEED - levelIndex * SPEED_DECREMENT;

        // optional randomization (±8%)
        if (randomize) {
            const variance = speed * 0.07;
            speed += Phaser.Math.Between(-variance, variance);
        }

        const finalSpeed = Math.max(speed, MIN_SPEED);
        console.log("final speed", finalSpeed);
        return finalSpeed;
    }

    static StartLifePulseTween(
        scene: Phaser.Scene,
        targets: Phaser.GameObjects.Container[]
    ): Phaser.Tweens.Tween {

        return scene.tweens.add({
            targets,
            scale: 1.15,
            duration: 2000,
            ease: Phaser.Math.Easing.Elastic.Out,
            repeat: -1,
            delay: scene.tweens.stagger(500, {})
        });
    }

    static StopLifePulseTween(
        scene: Phaser.Scene,
        targets: Phaser.GameObjects.Container[]
    ) {
        scene.tweens.killTweensOf(targets);
        // Optional: reset scale if you want a clean state
        targets.forEach(t => t.setScale(1));
    }

} // end class
