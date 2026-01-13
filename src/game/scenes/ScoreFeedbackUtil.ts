import Phaser from "phaser";

export class ScoreFeedbackUtil {
    static show(scene: Phaser.Scene, x: number, y: number, value: number, isCorrect: boolean) {
        const text = isCorrect ? `+${value}` : `-${Math.abs(value)}`;

        const color = isCorrect ? "#FFD54F" : "#E53935"; // yellow / red

        const scoreText = scene.add
            .text(x, y, text, {
                fontFamily: "nunito",
                fontStyle: "bold",
                fontSize: "50px",
                color: color,
                stroke: 'black',
                strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(1000);

        scene.tweens.add({
            targets: scoreText,
            y: y - 80, // float upward
            alpha: 0, // fade out
            duration: 1000,
            ease: Phaser.Math.Easing.Sine.Out,
            onComplete: () => {
                scoreText.destroy();
            },
        });
    }
}
