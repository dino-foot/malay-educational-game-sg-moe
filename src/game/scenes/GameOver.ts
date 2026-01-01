import { Scene } from "phaser";
import { Utils } from "./Utils";

export class GameOver extends Scene {
    currentScore = 0;
    highScore = 0;
    scoreText!: Phaser.GameObjects.Text;
    currentTextColor = 0xB41212;
    highScoreColor = 0x038813;
    constructor() {
        super("GameOver");
    }

    init(data: { currentScore: number }) {
        this.currentScore = data.currentScore || 0;
        // console.log(data.currentScore, this.currentScore)
    }

    create() {
        const { x, y } = Utils.CenterXY(this.game);

        const savedHighScore = Number(localStorage.getItem("HIGH_SCORE")) || 0;
        // Calculate high score
        this.highScore = Math.max(this.currentScore, savedHighScore);
        // Save if new high score
        if (this.highScore > savedHighScore) {
            localStorage.setItem("HIGH_SCORE", this.highScore.toString());
        }

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        const panelBg = this.add.image(x, y, "setting-bg").setOrigin(0.5);
        panelBg.setDisplaySize(panelBg.width, panelBg.height);

        const titleImg = this.add.image(0, 0, "gameover").setOrigin(0.5).setDepth(11);
        Phaser.Display.Align.In.TopCenter(titleImg, panelBg, 0, -30);

        const scoreTitle = this.add.image(0, 0, "score-title").setDepth(10).setOrigin(0.5);
        Phaser.Display.Align.In.Center(scoreTitle, panelBg);

        // console.log(this.currentScore, this.highScore)
        this.scoreText = this.add.text(0, 0, `${this.currentScore} / ${this.highScore}`, Utils.scoreFontStyle);
        Phaser.Display.Align.In.Center(this.scoreText, panelBg, 0, 30);

        const backToMenu = this.add.image(0, 0, "back-to-menu").setOrigin(0.5).setDepth(12).setScale(0.8);
        Phaser.Display.Align.In.BottomCenter(backToMenu, panelBg, 0, -20);
        Utils.MakeButton(this, backToMenu, () => {
            this.scene.launch("MainMenu");
            this.scene.sendToBack();
            this.scene.pause();
        });
    }
}
