import { Scene } from 'phaser';
import { Utils } from './Utils';

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
    score = 0;
    scoreBg: Phaser.GameObjects.Image;
    scoreText: Phaser.GameObjects.Text;
    hintImg: Phaser.GameObjects.Image;
    draggableLetters: any[];

    constructor() {
        super('KuasaScene');
    }

    init() {
        this.score = 0;
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

        const cityScape = this.add.image(x, y, "upper-bg").setOrigin(0.5).setDisplaySize(width, 401).setDepth(1);
        Utils.AlignTopCenter(cityScape, this.bgAlignZone, 0, 80);

        const sun = this.add.image(0, 0, "sun").setOrigin(0.5).setDepth(2).setScale(1);
        Utils.AlignTopRight(sun, this.bgAlignZone, -200, -50);

        const levelTitleBg = this.add.image(0, 0, "kuasa-level-title-bg").setOrigin(0.5).setDepth(11).setScale(0.9);
        Phaser.Display.Align.In.TopCenter(levelTitleBg, this.bgAlignZone, 0, -80);
        // Set camera bounds to the size of the background image
        this.cameras.main.setBounds(0, 0, this.bgAlignZone.width, this.bgAlignZone.height);

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
        });

        //? lives systems
        this.createLives();
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
}