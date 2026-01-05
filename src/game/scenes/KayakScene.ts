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
    SCORE = 0;
    kayak: any;
    kayakContainer = {} as {
        kayak: any;
        shadow: Phaser.GameObjects.Image;
    };
    graphics: any;
    answerPanel: Phaser.GameObjects.Image;
    fillGapZone: Phaser.GameObjects.Zone;

    constructor() {
        super("KayakScene");
    }

    init() {
        this.maxLives = 3;
        this.SCORE = 0;
        this.resetLives();
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

        const kayakShadow = this.add
            .image(250, y + 105, "boat_shadow")
            .setOrigin(0.5)
            .setDepth(8);
        this.kayakContainer.kayak = this.kayak;
        this.kayakContainer.shadow = kayakShadow;

        this.createHUD();
    }

    createHUD() {
        this.scoreBg = this.add.image(0, 0, "score").setOrigin(0.5).setDepth(12).setScale(0.9);
        this.scoreText = this.add.text(0, 0, "0000", Utils.fontStyle).setOrigin(0.5).setDepth(13);
        Phaser.Display.Align.In.TopRight(this.scoreBg, this.bgAlignZone);
        Phaser.Display.Align.In.RightCenter(this.scoreText, this.scoreBg, -70, 0);

        // HUD elements can be created here
        this.backButton = this.add.image(50, 50, "back").setOrigin(0.5).setScale(0.7).setDepth(10).setInteractive({ useHandCursor: true });
        // back button logic
        Utils.MakeButton(this, this.backButton, () => {
            this.scene.start("MainMenu");
        });
        2;

        // dragable words
        this.answerPanel = this.add.image(0, 0, "kayak-lower-panel").setOrigin(0.5).setDepth(1);
        Phaser.Display.Align.In.BottomCenter(this.answerPanel, this.bgAlignZone);

        this.questionPanel = this.add.image(0, 0, "kayak-sentence").setOrigin(0.5).setDepth(10).setScale(0.8);
        Phaser.Display.Align.In.TopLeft(this.questionPanel, this.answerPanel, 50, 160);

        //? lives systems
        this.createLives();
        this.setupLevel(0);
    }

    setupLevel(levelIndex = 0) {
        const padding = 24;
        const kayakFontStyle = this.getextStyle();
        let questionType = Math.random() > 0.5 ? "hintSentence" : "fillinTheGap";

        //? question text debug
        questionType = "fillinTheGap";

        if (questionType == "fillinTheGap") {
            this.createFillIntheGapZone(levelIndex);
        } else {
            this.questionText = this.add
                .text(this.questionPanel.x - this.questionPanel.width / 2 + padding, this.questionPanel.y - this.questionPanel.height / 2 + padding, KAYAK_LEVEL_DATA[levelIndex][questionType], kayakFontStyle)
                .setOrigin(0, 0)
                .setDepth(13);
            Phaser.Display.Align.In.Center(this.questionText, this.questionPanel);
        }

        // create 4 word container with wordcell and random word from level data
        // 1 word must be  KAYAK_LEVEL_DATA[levelIndex].correctWord and 3 random word no repeat of the KAYAK_LEVEL_DATA[levelIndex].correctWord

        const words: string[] = [KAYAK_LEVEL_DATA[levelIndex].correctWord, ...this.getRandomWrongWords(levelIndex, KAYAK_LEVEL_DATA[levelIndex].correctWord)];

        Phaser.Utils.Array.Shuffle(words);
        words.forEach((word, index) => {
            const container = this.add.container(0, 0);
            const wordCell = this.add.image(0, 0, "kayak_rnd_word").setOrigin(0.5).setScale(0.85);
            const wordText = this.add.text(0, 0, word, this.getextStyle()).setOrigin(0.5);
            container.add([wordCell, wordText]);
            container.setDepth(13);

            container.setSize(wordCell.width, wordCell.height);
            container.setInteractive({ useHandCursor: true });
            Phaser.Display.Align.In.LeftCenter(container, this.answerPanel, -270 * index);
            container.setData({ word, isCorrect: word === KAYAK_LEVEL_DATA[levelIndex].correctWord });

            if (questionType == "hintSentence") {
                Utils.MakeButton(this, container, () => {
                    this.handleCorrectAnswer(container);
                });
            } else {
                // make them dragable to the fillInThegap
                this.input.setDraggable(container);
                // store original position (important for reset)
                container.setData({
                    startX: container.x,
                    startY: container.y,
                });

                this.applyDrag(container);
            }
            // this.wordContainers.push(container);
        });

        // debug
        // this.graphics = this.add.graphics().setDepth(100);
        // this.graphics.clear();
        // this.graphics.lineStyle(1, 0xff0000, 1);
        // this.graphics.strokeRectShape(this.questionText.getBounds());
    }

    private createFillIntheGapZone(levelIndex) {
        const BLANK = "___________________";
        const parts = KAYAK_LEVEL_DATA[levelIndex].fillinTheGap.split(BLANK);

        const leftText = this.add.text(0, 0, parts[0], this.getextStyle()).setOrigin(0, 0.5).setDepth(13);

        const blankText = this.add.text(0, 0, BLANK, this.getextStyle()).setOrigin(0, 0.5).setDepth(13);

        const rightText = this.add.text(0, 0, parts[1], this.getextStyle()).setOrigin(0, 0.5).setDepth(13);

        const sentenceContainer = this.add.container(0, 0, [leftText, blankText, rightText]).setDepth(14);

        // todo fix it later for larger word
        console.log(`${parts[0].length + BLANK.length + parts[1].length}`);

        // this.questionPanel.displayWidth += 170;
        // this.questionPanel.x += 170;
        Phaser.Display.Align.In.LeftCenter(sentenceContainer, this.questionPanel, -100);

        // inline layout
        blankText.x = leftText.width;
        rightText.x = leftText.width + blankText.width;

        this.fillGapZone = this.add
            .zone(sentenceContainer.x + blankText.x + blankText.width / 2, sentenceContainer.y, blankText.width, 50)
            .setRectangleDropZone(blankText.width, blankText.height);

        // Optional debug
        Utils.DebugGraphics(this, this.fillGapZone);
    }

    private handleCorrectAnswer(container) {
        console.log("clicked ", container.getData("isCorrect"));
        const isCorrect = container.getData("isCorrect");
        const isLocked = container.getData("locked") === true;
        if (isLocked) return;

        container.setData("locked", true);
        this.handleScore(isCorrect);
    }

    private applyDrag(container) {
        this.input.on("dragstart", (_pointer, gameObject) => {
            gameObject.setDepth(20);
            this.tweens.add({
                targets: gameObject,
                scale: 1.05,
                duration: 100,
            });
        });

        this.input.on("drag", (_pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on("dragend", (_pointer, gameObject, dropped) => {
            gameObject.setDepth(13);
            if (!dropped) {
                // snap back if not dropped on target
                this.resetWordPosition(gameObject);
            }
        });

        this.input.on("drop", (_pointer, gameObject) => {
            const isCorrect = gameObject.getData("isCorrect");
            const isLocked = gameObject.getData("locked") === true;
            //? prevent double score
            if (isLocked) return;
            const isOverGap = Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), this.fillGapZone.getBounds());

            if (isCorrect && isOverGap) {
                // ✅ correct drop
                gameObject.setData("locked", true);
                gameObject.disableInteractive();

                this.snapToGap(gameObject);
                this.handleScore(true);
            } else {
                // wrong drop (released anywhere else)
                this.resetWordPosition(gameObject);
                this.handleScore(false);
            }
        });
    }

    private handleScore(isCorrect: boolean) {
        if (isCorrect) {
            this.SCORE += Utils.corectAnswerPoint;
        } else {
            this.SCORE -= Utils.wrongAnswerPoint;
            this.loseLife(); // loss 1 life
        }
        // this.SCORE = Phaser.Math.Clamp(this.SCORE, 0, 100);
        this.scoreText.setText(this.SCORE.toString());
        console.log("handle-score ", isCorrect, this.SCORE);
    }

    private clearLevel() {
        // todo clear level for
    }

    private resetLives() {
        this.currentLives = this.maxLives;
        this.lives.forEach((life) => {
            life.full.setVisible(true);
            life.empty.setVisible(false);
        });
    }

    private loseLife() {
        if (this.currentLives <= 0) {
            console.log("No lives left!");
            return;
        }
        this.currentLives--;
        const life = this.lives[this.currentLives];
        life.full.setVisible(false);
        life.empty.setVisible(true);

        if (this.currentLives === 0) {
            console.log("Game Over - No lives left");
            //? show gameover scene
            this.scene.launch("GameOver", {
                currentScore: this.SCORE,
            });
        } else {
            console.log(`Lives left: ${this.currentLives}`);
        }
    }

    private resetWordPosition(gameObject: Phaser.GameObjects.Container) {
        this.tweens.add({
            targets: gameObject,
            x: gameObject.getData("startX"),
            y: gameObject.getData("startY"),
            scale: 1,
            duration: 200,
            ease: "Back.easeOut",
        });
    }

    private snapToGap(gameObject: Phaser.GameObjects.Container) {
        this.tweens.add({
            targets: gameObject,
            x: this.fillGapZone.x,
            y: this.fillGapZone.y - 20,
            duration: 150,
            ease: "Back.easeOut",
        });
    }

    private getextStyle() {
        return {
            fontSize: "30px",
            color: "#000",
            fontFamily: "nunito",
            fontStyle: "bold",
            align: "center",
            wordWrap: {
                width: this.questionPanel.getBounds().width,
            },
        };
    }

    private getRandomWrongWords(currentIndex: number, correctWord: string, count = 3): string[] {
        const pool = KAYAK_LEVEL_DATA.filter((_, index) => index !== currentIndex)
            .map((level) => level.correctWord)
            .filter((word) => word !== correctWord);
        Phaser.Utils.Array.Shuffle(pool);
        return pool.slice(0, count);
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

    private fitPanelToContent(panel: Phaser.GameObjects.Image, content: Phaser.GameObjects.Container | Phaser.GameObjects.Text, paddingX: number = 40) {
        const contentWidth = content.getBounds().width;
        const minWidth = panel.width;

        const requiredWidth = contentWidth + paddingX * 2;
        const finalWidth = Math.max(minWidth, requiredWidth);

        const delta = finalWidth - panel.displayWidth;

        panel.displayWidth = finalWidth;
        panel.x += delta / 2;
        Phaser.Display.Align.In.Center(content, panel);
    }
}
