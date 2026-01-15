import { Display, GameObjects, Scene } from "phaser";
import { Utils } from "./Utils";
import { KUASA_LEVEL_DATA } from "../KuasaLevelData";
import { SoundUtil } from "./SoundUtil";
import { TrainLevelData } from "../LevelData";

export class KuasaScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    bgAlignZone: Phaser.GameObjects.Zone;
    backButton: Phaser.GameObjects.Image;
    settingsBtn: Phaser.GameObjects.Image;

    lives: {
        container: Phaser.GameObjects.Container;
        full: Phaser.GameObjects.Image;
        empty: Phaser.GameObjects.Image;
    }[] = [];

    speedIncreasePerLevel = 0.01;
    totalSteps: number = 10;
    currentLives: number = 3;
    baseDuration = 1500; // slowest
    minDuration = 400; // fastest
    maxLevels = 10;
    maxLives = 3;
    SCORE = 0;
    currentLevelIndex = 0;
    scoreBg: Phaser.GameObjects.Image;
    scoreText: Phaser.GameObjects.Text;
    questionPanel: GameObjects.Image;
    questionText: GameObjects.Text;
    draggableLetters: any[];
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

    bottomTrain: GameObjects.Container;
    topTrain: GameObjects.Container;

    track1: GameObjects.Image;
    track2: GameObjects.Image;
    wordsContainersList: GameObjects.Container[] = [];
    randomizedLevels: TrainLevelData[] = [];
    randomizeQuestion = false;
    isCrossLevel5 = false;

    constructor() {
        super("KuasaScene");
    }

    init() {
        this.maxLevels = 10;
        this.maxLives = 3;
        this.SCORE = 0;
        this.currentLevelIndex = 0;
        this.speedIncreasePerLevel = 0.01;
        this.wordsContainersList = [];
        this.randomizeQuestion = true;
        this.randomizedLevels = [];
        this.isCrossLevel5 = false;
        this.resetLives();
    }

    create() {
        const { width, height } = this.cameras.main;
        const { x, y } = Utils.CenterXY(this.game);
        this.bgAlignZone = this.add.zone(x, y, width, height);
        const background = this.add.image(x, y, "train_bg").setOrigin(0.5);
        const levelTitleBg = this.add.image(0, 0, "kuasa-level-title-bg").setOrigin(0.5).setDepth(11).setScale(0.9);
        Phaser.Display.Align.In.TopCenter(levelTitleBg, this.bgAlignZone, 0, 0);
        // Set camera bounds to the size of the background image
        this.cameras.main.setBounds(0, 0, this.bgAlignZone.width, this.bgAlignZone.height);

        //? randomized level data
        if (this.randomizeQuestion) {
            this.randomizedLevels = Phaser.Utils.Array.Shuffle([...KUASA_LEVEL_DATA]);
        } else {
            this.randomizedLevels = KUASA_LEVEL_DATA;
        }

        //! debug level
        const debugButton = this.add.image(400, 400, 'close-btn').setDepth(1000).setScale(0.5);
        Utils.MakeButton(this, debugButton, () => {
            SoundUtil.playClick();
            this.currentLevelIndex += 1;
            console.log('level ', this.currentLevelIndex);
        });

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
            SoundUtil.playClick();
            this.scene.start("MainMenu");
        });

        const beamContaier = this.add.container(0, 0).setName("beamContainer").setDepth(3);
        beamContaier.setSize(1000, 200);
        const beam1 = this.add.image(0, 0, "beam").setOrigin(0.5);
        const beam2 = this.add.image(beam1.width, 0, "beam").setOrigin(0.5);
        const beam3 = this.add.image(beam2.width + beam2.x, 0, "beam").setOrigin(0.5);
        const beam4 = this.add.image(beam3.width + beam3.x, 0, "beam").setOrigin(0.5);
        const beam5 = this.add.image(beam4.width + beam4.x, 0, "beam").setOrigin(0.5);
        beamContaier.add([beam1, beam2, beam3, beam4, beam5]);
        Phaser.Display.Align.In.TopCenter(beamContaier, this.bgAlignZone, -this.cameras.main.width / 2, -130);

        this.questionPanel = this.add.image(0, 0, "train_question_panel").setOrigin(0.5).setDepth(10);
        this.questionPanel.setScale(0.9).setDepth(11);
        Display.Align.In.TopCenter(this.questionPanel, this.bgAlignZone, 0, -170);

        const trainLinePiller1 = this.add.image(800, 968, "train_line").setOrigin(0.5).setDepth(10);
        const trainLinePiller2 = this.add.image(800, 695, "train_line").setOrigin(0.5).setDepth(9);

        //? lives systems
        this.createLives();
        this.setupLevel(this.currentLevelIndex);
    }

    private setupLevel(levelIndex = 0) {
        // setup question
        const showHintWord = Phaser.Math.Between(0, 1) === 0;
        const questionTextValue = showHintWord ? this.randomizedLevels[levelIndex].hintWord : this.randomizedLevels[levelIndex].hintSentence;

        this.questionText = this.add.text(0, 0, this.randomizedLevels[levelIndex].hintSentence, this.getextStyle()).setOrigin(0, 0).setDepth(13);
        Phaser.Display.Align.In.Center(this.questionText, this.questionPanel);

        //? setup track
        this.track1 = this.add.image(0, 0, "train_track").setOrigin(0.5).setDepth(9);
        Phaser.Display.Align.In.Center(this.track1, this.bgAlignZone, 0, 300);

        this.track2 = this.add.image(0, 0, "train_track").setOrigin(0.5).setDepth(9);
        Phaser.Display.Align.In.Center(this.track2, this.bgAlignZone, 0, 0);

        // this.startTrainSpawners(0);
        this.spawnBottomTrain();
        // this.spawnTopTrain();
    }

    private startTrainRpeat(delay = 100) {
        // bottom train always exists
        this.time.addEvent({
            delay: Utils.GetTrainSpeedByLevel(this.currentLevelIndex),
            loop: true,
            callback: () => {
                this.spawnBottomTrain();
            }
        });

        this.time.addEvent({
            delay: Utils.GetTrainSpeedByLevel(this.currentLevelIndex),
            loop: true,
            callback: () => {
                this.spawnTopTrain();
            }
        });
    }

    cleanupLevel() {
        console.log("cleanup level ", this.currentLevelIndex);

        if (this.currentLevelIndex >= this.randomizedLevels.length) {
            console.log("Reached end of the level set!");
            this.onLevelComplete(); // level complete callback
            this.scene.launch("GameOver", {
                currentScore: this.SCORE,
            });

            return;
        }

        //? update next question
        const showHintWord = Phaser.Math.Between(0, 1) === 0;
        const questionTextValue = showHintWord ? this.randomizedLevels[this.currentLevelIndex].hintWord : this.randomizedLevels[this.currentLevelIndex].hintSentence;
        this.questionText.setText(questionTextValue);
        Phaser.Display.Align.In.Center(this.questionText, this.questionPanel);

        //? update random answers
        let words: string[] = [
            this.randomizedLevels[this.currentLevelIndex].correctWord,
            ...this.getRandomWrongWords(this.currentLevelIndex, this.randomizedLevels[this.currentLevelIndex].correctWord, this.wordsContainersList.length - 1),
        ];

        console.log("next level words cont >> ", this.wordsContainersList.length);

        words = Phaser.Utils.Array.Shuffle(words);
        // const newWords = ['hello-world'];
        this.wordsContainersList.forEach((container, index) => {
            if (!words[index]) return;
            const text = container.getData("text") as Phaser.GameObjects.Text;
            container.setData("word", words[index]);
            text.setText(words[index]);
            // optional: re-center after text change
            Phaser.Display.Align.In.Center(text, container.getData("bg"));
        });
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

    private createTrain(x: number, y: number, midCount: number = 1) {
        const train = this.add.container(x, y).setDepth(10);

        let offsetX = 0;
        const left = this.add.image(offsetX - 36, 0, "left_train").setOrigin(0.5, 0.5);
        offsetX += left.width;
        train.add(left);

        const words: string[] = [
            this.randomizedLevels[this.currentLevelIndex].correctWord,
            ...this.getRandomWrongWords(this.currentLevelIndex, this.randomizedLevels[this.currentLevelIndex].correctWord, midCount),
        ];

        //? only for mid train add word card
        for (let i = 0; i < words.length - 1; i++) {
            const mid = this.add.image(offsetX, 0, "mid_train").setOrigin(0.5, 0.5);
            offsetX += mid.width - 1;
            train.add(mid);

            // rnd word that user must click
            const wordContainer = this.add.container(0, 0).setDepth(100).setSize(300, 100);
            wordContainer.setData("word", words[i]); // ✅ store word here
            const bg = this.add.image(0, 0, "kayak_rnd_word").setOrigin(0.5).setScale(1.1).setInteractive({ useHandCursor: true });
            const text = this.add.text(0, 0, words[i], this.geBlacktextStyle());
            wordContainer.setData("text", text);
            wordContainer.setData("bg", bg);

            Utils.MakeButton(this, bg, () => {
                this.handleAnswerSubmit(wordContainer);
            });

            wordContainer.add([bg, text]);
            Display.Align.In.Center(wordContainer, mid);
            Display.Align.In.Center(text, bg);
            train.add(wordContainer);

            this.wordsContainersList.push(wordContainer);
        }

        const right = this.add.image(offsetX - 22, 0, "right_train").setOrigin(0.5, 0.5);
        train.add(right);
        train.setSize(offsetX + right.width, left.height);
        return train;
    }

    private startTrainOneWay(train: GameObjects.Container, direction: "left" | "right", onComplete?: () => void) {
        const cam = this.cameras.main;
        const trainWidth = train.getBounds().width;
        const startX = direction === "left" ? cam.width + trainWidth / 2 : -trainWidth;
        const endX = direction === "left" ? -trainWidth : cam.width + trainWidth / 2;
        console.log(endX, startX);

        train.x = startX;
        this.tweens.add({
            targets: train,
            x: endX,
            duration: Utils.GetTrainSpeedByLevel(this.currentLevelIndex, (this.currentLevelIndex >= 5) ? true : false),
            ease: "Linear",
            onComplete: () => {
                train.destroy();
                onComplete?.();
            },
        });
    }

    private handleAnswerSubmit(container: Phaser.GameObjects.Container) {
        const selectedWord = container.getData("word");
        const correctWord = this.randomizedLevels[this.currentLevelIndex].correctWord;

        console.log("clicked >> ", selectedWord, correctWord);

        if (selectedWord === correctWord) {
            // ✅ CORRECT ANSWER
            console.log("✅ Correct Answer:", selectedWord);
            this.SCORE += Utils.corectAnswerPoint;
            this.currentLevelIndex += 1;
            this.cleanupLevel();
            // todo second train after level 5
        } else {
            // ❌ WRONG ANSWER
            console.log("❌ Wrong Answer:", selectedWord);
            this.SCORE -= Utils.wrongAnswerPoint;
            this.SCORE = Phaser.Math.Clamp(this.SCORE, 0, 100);
            this.loseLife();
        }
        this.scoreText.setText(this.SCORE.toString());
    }


    //? on level completed
    onLevelComplete() {
        const completed = this.registry.get("completedLevels") || 0;
        this.registry.set("completedLevels", completed + 1);
    }

    private spawnBottomTrain() {
        const train = this.createTrain(0, 695, 4).setScale(0.8);
        train.setName("bottomTrain");
        this.startTrainOneWay(train, "left", () => {
            // till level 4 less single train
            if (this.currentLevelIndex < 5) {
                this.spawnTopTrain();
            }
            else if (this.currentLevelIndex >= 5 && this.isCrossLevel5 == false) {
                this.startTrainRpeat();
                this.isCrossLevel5 = true;
            }
        });
    }

    private spawnTopTrain() {
        const train = this.createTrain(0, 392, 3).setScale(0.8);
        train.setName("topTrain");
        this.startTrainOneWay(train, "right", () => {
            if (this.currentLevelIndex < 5) {
                this.spawnBottomTrain();
            } else if (this.currentLevelIndex >= 5 && this.isCrossLevel5 == false) {
                this.startTrainRpeat();
                this.isCrossLevel5 = true;
            }
        });
    }

    private resetLives() {
        this.currentLives = this.maxLives;
        this.lives.forEach((life) => {
            life.full.setVisible(true);
            life.empty.setVisible(false);
        });
    }

    private getRandomWrongWords(currentIndex: number, correctWord: string, count = 3): string[] {
        const pool = this.randomizedLevels
            .filter((_, index) => index !== currentIndex)
            .map((level) => level.correctWord)
            .filter((word) => word !== correctWord);
        Phaser.Utils.Array.Shuffle(pool);
        return pool.slice(0, count);
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

    handleSettings() {
        // settings button (top-right)
        this.settingsBtn = this.add.image(0, 0, "settings").setOrigin(0.5).setScale(0.9).setDepth(100).setInteractive({ useHandCursor: true }).setName("settingsButton");

        Utils.AlignTopRight(this.settingsBtn, this.bgAlignZone, -5, 0);
        Utils.MakeButton(this, this.settingsBtn, () => {
            Utils.openSettings(this);
        });
    }

    private getextStyle() {
        return {
            fontSize: "30px",
            color: "white",
            fontFamily: "nunito",
            fontStyle: "bold",
            align: "center",
            wordWrap: {
                width: this.questionPanel.getBounds().width - 4,
            },
        };
    }

    private geBlacktextStyle() {
        return {
            fontSize: "40px",
            color: "black",
            fontFamily: "nunito",
            fontStyle: "bold",
            align: "center",
            wordWrap: {
                width: this.questionPanel.getBounds().width - 4,
            },
        };
    }
}
