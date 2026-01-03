import { Scene } from "phaser";
import { Utils } from "./Utils";
import { KAYAK_LEVEL_DATA } from "../KayakLevelData";

export class KaysakScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    bgAlignZone: Phaser.GameObjects.Zone;
    backButton: Phaser.GameObjects.Image;
    questionPanel: Phaser.GameObjects.Image;
    questionText: Phaser.GameObjects.Text;
    lives: {
        container: Phaser.GameObjects.Container;
        full: Phaser.GameObjects.Image;
        empty: Phaser.GameObjects.Image;
    }[] = [];
    scoreBg: Phaser.GameObjects.Image;
    scoreText: Phaser.GameObjects.Text;
    currentLives: any;
    maxLives = 3;
    kayak: any;
    kayakContainer = {} as {
        kayak: any;
        shadow: Phaser.GameObjects.Image;
    };
    graphics: any;
    answerPanel: Phaser.GameObjects.Image;

    constructor() {
        super("KayakScene");
    }

    create() {
        const { width, height } = this.cameras.main;
        const { x, y } = Utils.CenterXY(this.game);
        this.bgAlignZone = this.add.zone(x, y, width, height);

        const background = this.add.image(x, y, "kayak-bg").setOrigin(0.5);
        const levelTitleBg = this.add.image(0, 0, "kayak_title").setOrigin(0.5).setDepth(11).setScale(0.9);
        Phaser.Display.Align.In.TopCenter(levelTitleBg, this.bgAlignZone, 0, -80);
        // Set camera bounds to the size of the background image
        this.cameras.main.setBounds(0, 0, this.bgAlignZone.width, this.bgAlignZone.height);

        //  spine boat later  
        //? Each correct answer pushes the kayak forward; wrong answers make it drift back slightly.
        this.kayak = this.add.spine(250, y + 50, "boat-data", "boat-atlas").setOrigin(0.5);
        this.kayak.setDepth(10);
        this.kayak.setInteractive();
        this.kayak.animationState.setAnimation(0, "rowling", true);

        const kayakShadow = this.add.image(250, y + 105, 'boat_shadow').setOrigin(0.5).setDepth(8)
        this.kayakContainer.kayak = this.kayak;
        this.kayakContainer.shadow = kayakShadow;

        this.createHUD();
    }

    createHUD() {
        this.scoreBg = this.add.image(0, 0, 'score').setOrigin(0.5).setDepth(12).setScale(0.9);
        this.scoreText = this.add.text(0, 0, '0000', Utils.fontStyle).setOrigin(0.5).setDepth(13);
        Phaser.Display.Align.In.TopRight(this.scoreBg, this.bgAlignZone);
        Phaser.Display.Align.In.RightCenter(this.scoreText, this.scoreBg, -70, 0);

        // HUD elements can be created here
        this.backButton = this.add.image(50, 50, "back").setOrigin(0.5).setScale(0.7).setDepth(10).setInteractive({ useHandCursor: true });
        // back button logic
        Utils.MakeButton(this, this.backButton, () => {
            this.scene.start('MainMenu');
        }); 2

        // dragable words
        this.answerPanel = this.add.image(0, 0, 'kayak-lower-panel').setOrigin(0.5).setDepth(1);
        Phaser.Display.Align.In.BottomCenter(this.answerPanel, this.bgAlignZone);

        this.questionPanel = this.add.image(0, 0, 'kayak-sentence').setOrigin(0.5).setDepth(10).setScale(0.8);
        Phaser.Display.Align.In.TopLeft(this.questionPanel, this.answerPanel, 50, 160);

        //? lives systems
        this.createLives();
        this.setupLevel();
    }

    private createLives() {
        this.lives = [];
        this.currentLives = this.maxLives;

        for (let i = 0; i < this.maxLives; i++) {
            const container = this.add.container(0, 0).setDepth(10);
            const fullHeart = this.add.image(0, 0, "heart").setOrigin(0.5).setScale(0.8);
            const emptyHeart = this.add.image(0, 0, "empty_heart").setOrigin(0.5).setScale(0.8).setVisible(false);

            container.setSize(fullHeart.width, fullHeart.height);
            container.add([fullHeart, emptyHeart]);
            Phaser.Display.Align.In.TopLeft(container, this.bgAlignZone, -100 - i * 60, -25);

            this.lives.push({
                container,
                full: fullHeart,
                empty: emptyHeart,
            });
        }
    }

    setupLevel(levelIndex = 0) {
        const padding = 24;
        const kayakFontStyle = this.getQuestionTextStyle();

        this.questionText = this.add.text(
            this.questionPanel.x - this.questionPanel.width / 2 + padding,
            this.questionPanel.y - this.questionPanel.height / 2 + padding,
            KAYAK_LEVEL_DATA[levelIndex].hintSentence, // todo random between hint and fill-the-gap
            kayakFontStyle
        )
            .setOrigin(0, 0)
            .setDepth(13);

        Phaser.Display.Align.In.Center(this.questionText, this.questionPanel);

        // create click/dragable words
        for (let i = 0; i < 4; i++) {
            const wordCell = this.add.image(0, 0, 'kayak_rnd_word').setOrigin(0.5).setDepth(13).setScale(0.9);
            Phaser.Display.Align.In.LeftCenter(wordCell, this.answerPanel, -80);
        }

        // debug
        this.graphics = this.add.graphics().setDepth(100);
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xff0000, 1);
        this.graphics.strokeRectShape(this.questionText.getBounds());
    }



    private getWordScaleConfig(wordLength: number) {
        return Utils.WORD_SCALE_CONFIG[wordLength] ?? Utils.DEFAULT_WORD_SCALE_CONFIG;
    }

    private resetLives() {
        this.currentLives = this.maxLives;
        this.lives.forEach((life) => {
            life.full.setVisible(true);
            life.empty.setVisible(false);
        });
    }

    private getQuestionTextStyle() {
        return {
            fontSize: "30px",
            color: "#000",
            fontFamily: "nunito",
            fontStyle: "bold",
            align: "center",
            wordWrap: {
                width: this.questionPanel.getBounds().width,
            }
        };
    }
}
