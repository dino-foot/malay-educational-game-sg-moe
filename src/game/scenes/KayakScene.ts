import { Scene } from "phaser";
import { Utils } from "./Utils";
import { KAYAK_LEVEL_DATA } from "../KayakLevelData";
import { KayakLevelData } from "../LevelData";
import { ScoreFeedbackUtil } from "./ScoreFeedbackUtil";

export class KaysakScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    bgAlignZone: Phaser.GameObjects.Zone;
    settingsBtn: Phaser.GameObjects.Image;
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
    currentLevelIndex = 0;
    kayak: any;
    kayakContainer = {} as {
        kayak: any;
        shadow: Phaser.GameObjects.Image;
    };
    graphics: any;
    answerPanel: Phaser.GameObjects.Image;
    fillGapZone: Phaser.GameObjects.Zone;
    levelObjects: {
        texts: Phaser.GameObjects.Text[];
        images: Phaser.GameObjects.Image[];
        containers: Phaser.GameObjects.Container[];
        zones: Phaser.GameObjects.Zone[];
    } = {
            texts: [],
            images: [],
            containers: [],
            zones: [],
        };

    stepsMarkers: any = [];
    randomizedLevels: KayakLevelData[] = [];
    randomizeQuestion = false;

    constructor() {
        super("KayakScene");
    }

    init() {
        this.maxLives = 3;
        this.SCORE = 0;
        this.currentLevelIndex = 0;
        this.fillGapZone = null;
        this.randomizeQuestion = true;
        this.randomizedLevels = [];

        this.levelObjects.texts?.forEach((item) => item.destroy());
        this.levelObjects.images?.forEach((item) => item.destroy());
        this.levelObjects.containers?.forEach((item) => item.destroy());
        this.levelObjects.zones?.forEach((item) => item.destroy());
        this.resetLives();
    }

    create() {
        const { width, height } = this.cameras.main;
        const { x, y } = Utils.CenterXY(this.game);
        this.bgAlignZone = this.add.zone(x, y, width, height);

        //? randomized level data
        if (this.randomizeQuestion) {
            this.randomizedLevels = Phaser.Utils.Array.Shuffle([...KAYAK_LEVEL_DATA]);
        } else {
            this.randomizedLevels = KAYAK_LEVEL_DATA;
        }

        const background = this.add.image(x, y, "kayak-bg").setOrigin(0.5);
        const levelTitleBg = this.add.image(0, 0, "kayak_title").setOrigin(0.5).setDepth(11).setScale(0.9);
        Phaser.Display.Align.In.TopCenter(levelTitleBg, this.bgAlignZone, 0, 0);
        // Set camera bounds to the size of the background image
        this.cameras.main.setBounds(0, 0, this.bgAlignZone.width, this.bgAlignZone.height);

        const jetty = this.add.image(0, 0, "jetty").setOrigin(0.5).setDepth(10);
        Phaser.Display.Align.In.RightCenter(jetty, this.bgAlignZone, 0, 50);

        //  spine boat later
        //? Each correct answer pushes the kayak forward; wrong answers make it drift back slightly.
        this.kayak = this.add.spine(250, y + 50, "boat-data", "boat-atlas").setOrigin(0.5);
        this.kayak.setDepth(10);
        this.kayak.setInteractive();
        // this.kayak.animationState.setAnimation(0, "rowling", true);

        const kayakShadow = this.add
            .image(250, y + 105, "boat_shadow")
            .setOrigin(0.5)
            .setDepth(8);
        this.kayakContainer.kayak = this.kayak;
        this.kayakContainer.shadow = kayakShadow;

        for (let i = 0; i < 10; i++) {
            const stepMarker = this.add.image(0, 0, "grey_mark").setOrigin(0.5).setDepth(10);
            stepMarker.setAlpha(0);
            this.stepsMarkers.push(stepMarker);
            Phaser.Display.Align.In.LeftCenter(stepMarker, this.kayak, -250 + i * -115, 20);
        }

        this.handleSettings();
        this.createHUD();
    }

    createHUD() {
        this.scoreBg = this.add.image(0, 0, "score").setOrigin(0.5).setDepth(12).setScale(0.9);
        this.scoreText = this.add.text(0, 0, "0000", Utils.fontStyle).setOrigin(0.5).setDepth(13);
        Phaser.Display.Align.In.TopRight(this.scoreBg, this.bgAlignZone, -80);
        Phaser.Display.Align.In.RightCenter(this.scoreText, this.scoreBg, -70, 0);

        // HUD elements can be created here
        this.backButton = this.add.image(50, 50, "back").setOrigin(0.5).setScale(0.7).setDepth(10).setInteractive({ useHandCursor: true });
        // back button logic
        Utils.MakeButton(this, this.backButton, () => {
            this.scene.start("MainMenu");
        });

        // dragable words
        this.answerPanel = this.add.image(0, 0, "kayak-lower-panel").setOrigin(0.5).setDepth(1);
        Phaser.Display.Align.In.BottomCenter(this.answerPanel, this.bgAlignZone);

        //? lives systems
        this.createLives();
        this.setupLevel(this.currentLevelIndex);
        this.registerDragEvents();
    }

    setupLevel(levelIndex = 0) {
        this.questionPanel = this.add.image(0, 0, "kayak-sentence").setOrigin(0.5).setDepth(10).setScale(0.7);
        Phaser.Display.Align.In.TopLeft(this.questionPanel, this.answerPanel, 200, 170);
        this.track(this.questionPanel, "images");

        const padding = 10;
        const kayakFontStyle = this.getextStyle();
        let questionType = Math.random() > 0.5 ? "hintSentence" : "fillinTheGap";

        //? question text debug
        // questionType = "hintSentence";

        if (questionType == "fillinTheGap") {
            this.createFillIntheGapZone(levelIndex);
        } else {
            this.questionText = this.add
                .text(0, 0, this.randomizedLevels[levelIndex][questionType], kayakFontStyle)
                .setOrigin(0, 0)
                .setDepth(13);
            Phaser.Display.Align.In.Center(this.questionText, this.questionPanel);
            this.track(this.questionText, "texts");
        }

        // create 4 word container with wordcell and random word from level data
        // 1 word must be  KAYAK_LEVEL_DATA[levelIndex].correctWord and 3 random word no repeat of the KAYAK_LEVEL_DATA[levelIndex].correctWord

        const words: string[] = [this.randomizedLevels[levelIndex].correctWord, ...this.getRandomWrongWords(levelIndex, this.randomizedLevels[levelIndex].correctWord)];

        Phaser.Utils.Array.Shuffle(words);
        words.forEach((word, index) => {
            const container = this.add.container(0, 0);
            const wordCell = this.add.image(0, 0, "kayak_rnd_word").setOrigin(0.5).setScale(0.85);
            const wordText = this.add.text(0, 0, word, this.getextStyle()).setOrigin(0.5);
            container.add([wordCell, wordText]);
            this.track(container, "containers");
            container.setDepth(13);

            container.setSize(wordCell.width, wordCell.height);
            container.setInteractive({ useHandCursor: true });
            const startOffsetX = 60;
            Phaser.Display.Align.In.LeftCenter(container, this.answerPanel, -270 * index - startOffsetX);
            container.setData({ word, isCorrect: word === this.randomizedLevels[levelIndex].correctWord });

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
                    word,
                    isCorrect: word === this.randomizedLevels[levelIndex].correctWord,
                    isWord: true,
                    locked: false,
                });

                // this.applyDrag(container);
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
        const parts = this.randomizedLevels[levelIndex].fillinTheGap.split(BLANK);
        const leftText = this.add.text(0, 0, parts[0], this.getextStyle()).setOrigin(0, 0.5).setDepth(13);
        const blankText = this.add.text(0, 0, BLANK, this.getextStyle()).setOrigin(0, 0.5).setDepth(13);
        const rightText = this.add.text(0, 0, parts[1], this.getextStyle()).setOrigin(0, 0.5).setDepth(13);

        const sentenceContainer = this.add.container(0, 0, [leftText, blankText, rightText]).setDepth(14);
        sentenceContainer.setSize(700, 100);
        this.track(sentenceContainer, "containers");
        Phaser.Display.Align.In.LeftCenter(sentenceContainer, this.questionPanel, 0);

        // inline layout
        blankText.x = leftText.width;
        rightText.x = leftText.width + blankText.width;

        this.fillGapZone = this.add.zone(sentenceContainer.x + blankText.x + blankText.width / 2, sentenceContainer.y, blankText.width, 50).setRectangleDropZone(blankText.width, blankText.height);

        this.track(this.fillGapZone, "containers");
        // Optional debug
        // Utils.DebugGraphics(this, this.fillGapZone);
    }

    private handleCorrectAnswer(container) {
        // console.log("clicked ", container.getData("isCorrect"));
        const isCorrect = container.getData("isCorrect");
        const isLocked = container.getData("locked") === true;
        if (isLocked) return;

        container.setData("locked", true);
        this.handleScore(isCorrect);
    }

    private handleScore(isCorrect: boolean) {
        if (isCorrect) {
            this.SCORE += Utils.corectAnswerPoint;
            ScoreFeedbackUtil.show(this, this.cameras.main.centerX, this.cameras.main.centerY, 10, true);
            this.OnEachStepComplete();
        } else {
            this.SCORE -= Utils.wrongAnswerPoint;
            ScoreFeedbackUtil.show(this, this.cameras.main.centerX, this.cameras.main.centerY, 5, false);
            this.loseLife(); // loss 1 life
            // todo play wrong sound fx
        }
        this.SCORE = Phaser.Math.Clamp(this.SCORE, 0, 100);
        this.scoreText.setText(this.SCORE.toString());
        // console.log("handle-score ", isCorrect, this.SCORE);
    }

    private OnEachStepComplete() {
        //
        // stop if reached end
        if (this.currentLevelIndex >= this.stepsMarkers.length) {
            return;
        }

        // calculate speed (linear interpolation)
        const progress = (this.currentLevelIndex - 1) / (Utils.maxLevels - 1);
        const duration = Phaser.Math.Linear(Utils.baseDuration, Utils.minDuration, progress);

        const targetMark = this.stepsMarkers[this.currentLevelIndex];
        // console.log('target mark ', targetMark);

        this.tweens.add({
            targets: [this.kayakContainer.kayak, this.kayakContainer.shadow],
            x: targetMark.x,
            duration: duration,
            ease: Phaser.Math.Easing.Linear,
            onStart: () => {
                const state = this.kayak.animationState;
                // clear any running animation
                state.clearTrack(0);
                // play "rowling" twice (non-loop)
                state.addAnimation(0, "rowling", false, 0);
                state.addAnimation(0, "rowling", false, 0);
            },
            onComplete: () => {
                // this.currentStepIndex++;
                this.clearLevel();
                if (this.currentLevelIndex >= this.stepsMarkers.length) {
                    //? load next scene
                    console.log("level completed");
                    Utils.FadeToScene(this, "MainMenu");
                }

                console.log(`Level ${this.currentLevelIndex} | speed duration: ${Math.round(duration)}ms`);
            },
        });
    }

    private clearLevel() {
        //? clear level for
        if (this.currentLevelIndex >= KAYAK_LEVEL_DATA.length) {
            console.log("🏁 Reached end of the level set!");
            this.scene.launch("GameOver", {
                currentScore: this.SCORE,
            });
            return;
        }

        // cleanup
        this.levelObjects.texts?.forEach((item) => item.destroy());
        this.levelObjects.images?.forEach((item) => item.destroy());
        this.levelObjects.containers?.forEach((item) => item.destroy());
        this.levelObjects.zones?.forEach((item) => item.destroy());
        this.fillGapZone = null;
        // setup new level data
        this.currentLevelIndex += 1;
        this.setupLevel(this.currentLevelIndex);
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

    private registerDragEvents() {
        // drag start
        this.input.on("dragstart", (_pointer, gameObject) => {
            gameObject.setDepth(20);
            gameObject.setData("dragHandled", false);

            this.tweens.add({
                targets: gameObject,
                scale: 1.05,
                duration: 100,
            });
        });

        // dragging
        this.input.on("drag", (_pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // drag end (🔥 SINGLE SOURCE OF TRUTH)
        this.input.on("dragend", (_pointer, gameObject) => {
            // ignore non-word objects
            if (!gameObject.getData("isWord")) return;

            // ⛔ HARD GUARD
            if (gameObject.getData("dragHandled")) return;
            gameObject.setData("dragHandled", true);

            const isLocked = gameObject.getData("locked") === true;
            if (isLocked) return;

            const isCorrect = gameObject.getData("isCorrect");

            const isOverGap = Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), this.fillGapZone.getBounds());

            if (isCorrect && isOverGap) {
                gameObject.setData("locked", true);
                gameObject.disableInteractive();

                this.snapToGap(gameObject);
                this.handleScore(true);
            } else {
                this.resetWordPosition(gameObject);
                this.handleScore(false);
            }
        });
    }

    handleSettings() {
        // settings button (top-right)
        this.settingsBtn = this.add
            .image(0, 0, "settings")
            .setOrigin(0.5)
            .setScale(0.9)
            .setName('settingsButton')
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        Utils.AlignTopRight(this.settingsBtn, this.bgAlignZone, -5, 0);
        Utils.MakeButton(this, this.settingsBtn, () => {
            Utils.openSettings(this);
        });
    }

    //? on level completed
    onLevelComplete() {
        const completed = this.registry.get('completedLevels') || 0;
        this.registry.set('completedLevels', completed + 1);
    }

    private track<T extends Phaser.GameObjects.GameObject>(obj: T, type: keyof typeof this.levelObjects): T {
        this.levelObjects[type].push(obj as any);
        return obj;
    }
}
