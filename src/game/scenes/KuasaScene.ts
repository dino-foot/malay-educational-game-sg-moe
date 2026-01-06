import { Display, GameObjects, Scene } from "phaser";
import { Utils } from "./Utils";
import { KUASA_LEVEL_DATA } from "../KuasaLevelData";

export class KuasaScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    bgAlignZone: Phaser.GameObjects.Zone;
    backButton: Phaser.GameObjects.Image;

    lives: {
        container: Phaser.GameObjects.Container;
        full: Phaser.GameObjects.Image;
        empty: Phaser.GameObjects.Image;
    }[] = [];

    trainSpeed: number = 1;
    totalSteps: number = 10;
    currentLives: number = 3;
    maxLives: number = 3;
    baseDuration = 1500; // slowest
    minDuration = 400; // fastest
    maxLevels = 10;
    currentLevel = 1;
    currentStepIndex: number = 1;
    levelDataIndex: number = 1; // should be 0
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

    train1: GameObjects.Container;
    train2: GameObjects.Container;
    track1: GameObjects.Image;
    track2: GameObjects.Image;

    constructor() {
        super("KuasaScene");
    }

    init() {
        this.SCORE = 0;
        this.maxLevels = 3;
        this.currentStepIndex = 9;
        this.levelDataIndex = 9;
        this.currentLives = 3;
        this.maxLives = 3;
        this.trainSpeed = 1;
        this.resetLives();
    }

    create() {
        const { width, height } = this.cameras.main;
        const { x, y } = Utils.CenterXY(this.game);
        this.bgAlignZone = this.add.zone(x, y, width, height);
        const background = this.add.image(x, y, "train_bg").setOrigin(0.5);
        const levelTitleBg = this.add.image(0, 0, "kuasa-level-title-bg").setOrigin(0.5).setDepth(11).setScale(0.9);
        Phaser.Display.Align.In.TopCenter(levelTitleBg, this.bgAlignZone, 0, -10);
        // Set camera bounds to the size of the background image
        this.cameras.main.setBounds(0, 0, this.bgAlignZone.width, this.bgAlignZone.height);

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

        const beamContaier = this.add.container(0, 0).setName("beamContainer").setDepth(3);
        beamContaier.setSize(1000, 200);
        const beam1 = this.add.image(0, 0, "beam").setOrigin(0.5);
        const beam2 = this.add.image(beam1.width, 0, "beam").setOrigin(0.5);
        const beam3 = this.add.image(beam2.width + beam2.x, 0, "beam").setOrigin(0.5);
        const beam4 = this.add.image(beam3.width + beam3.x, 0, "beam").setOrigin(0.5);
        const beam5 = this.add.image(beam4.width + beam4.x, 0, "beam").setOrigin(0.5);
        beamContaier.add([beam1, beam2, beam3, beam4, beam5]);
        Phaser.Display.Align.In.TopCenter(beamContaier, this.bgAlignZone, -this.cameras.main.width / 2, -130);

        this.questionPanel = this.add.image(0, 0, 'train_question_panel').setOrigin(0.5).setDepth(10);
        this.questionPanel.setScale(0.9).setDepth(11);
        Display.Align.In.TopCenter(this.questionPanel, this.bgAlignZone, 0, -170);

        //? lives systems
        this.createLives();
        this.setupLevel();
    }

    private setupLevel() {


        //? setup train
        this.train1 = this.createTrain(300, 695, 3).setScale(0.8); // 3 compartments
        this.train1.setName('train1');

        this.train2 = this.createTrain(300, 392, 3).setScale(0.8); // 3 compartments
        this.train2.setName('train2');

        //? setup track
        this.track1 = this.add.image(0, 0, 'train_track').setOrigin(0.5).setDepth(9);
        Phaser.Display.Align.In.Center(this.track1, this.bgAlignZone, 0, 300)

        this.track2 = this.add.image(0, 0, 'train_track').setOrigin(0.5).setDepth(9);
        Phaser.Display.Align.In.Center(this.track2, this.bgAlignZone, 0, 0)
    }

    cleanupLevel() { }

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

        for (let i = 0; i < midCount; i++) {
            const mid = this.add.image(offsetX, 0, "mid_train").setOrigin(0.5, 0.5);
            offsetX += mid.width - 1;
            train.add(mid);
            mid.setDepth(-10);
        }

        const right = this.add.image(offsetX - 22, 0, "right_train").setOrigin(0.5, 0.5);
        train.add(right);
        train.setSize(offsetX + right.width, left.height);
        return train;
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

    private getRandomWrongWords(currentIndex: number, correctWord: string, count = 3): string[] {
        // const pool = KUASA_LEVEL_DATA.filter((_, index) => index !== currentIndex)
        //     .map((level) => level.correctWord)
        //     .filter((word) => word !== correctWord);
        // Phaser.Utils.Array.Shuffle(pool);
        // return pool.slice(0, count);
        return null;
    }

    private snapToGap(gameObject: Phaser.GameObjects.Container) {
        // this.tweens.add({
        //     targets: gameObject,
        //     x: this.fillGapZone.x,
        //     y: this.fillGapZone.y - 20,
        //     duration: 150,
        //     ease: "Back.easeOut",
        // });
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

    //? on level completed
    onLevelComplete() {
        const completed = this.registry.get("completedLevels") || 0;
        this.registry.set("completedLevels", completed + 1);
    }

    private trackObject<T extends Phaser.GameObjects.GameObject>(obj: T, type: keyof typeof this.levelObjects): T {
        this.levelObjects[type].push(obj as any);
        return obj;
    }
}
