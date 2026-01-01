import { Display, Scene } from "phaser";
import { Utils } from "./Utils";
import { BUS_LEVELS_DATA } from "../BusLevelData";

export class BasScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    wordRects: Phaser.GameObjects.Image;
    bgAlignZone: Phaser.GameObjects.Zone;
    busTrack: Phaser.GameObjects.Image;
    answerSubmitBtn: Phaser.GameObjects.Image;
    backButton: Phaser.GameObjects.Image;
    questionContainer: Phaser.GameObjects.Container;
    wordsZone: Phaser.GameObjects.Zone; // scatter words here
    road: Phaser.GameObjects.Image;

    roadMarksList: {
        container: Phaser.GameObjects.Container;
        mark: Phaser.GameObjects.Image;
        flag: Phaser.GameObjects.Image;
        tick: Phaser.GameObjects.Image;
    }[] = [];

    lives: {
        container: Phaser.GameObjects.Container;
        full: Phaser.GameObjects.Image;
        empty: Phaser.GameObjects.Image;
    }[] = [];

    letterSlots: Phaser.GameObjects.Container[] = [];
    bus: Phaser.GameObjects.Image;
    busSpeed: number = 1;
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
        super("BasScene");
    }

    create() {
        const { width, height } = this.cameras.main;
        const { x, y } = Utils.CenterXY(this.game);

        this.bgAlignZone = this.add.zone(x, y, width, height);
        // Word Rects
        this.wordRects = this.add.image(x, y, "rect_bus").setOrigin(0.5).setScale(1);
        Utils.AlignBottomCenter(this.wordRects, this.bgAlignZone, 0, 0);

        this.road = this.add
            .image(x, y + 120, "road")
            .setOrigin(0.5)
            .setScale(1);

        //? question box container
        this.questionContainer = this.add.container(0, 0).setDepth(10);
        Phaser.Display.Align.In.LeftCenter(this.questionContainer, this.road, -180, 20);

        const imageBox = this.add.image(0, 0, "question_box").setOrigin(0.5).setScale(0.9);
        this.questionContainer.add(imageBox);

        this.busTrack = this.add
            .image(x, y - 110, "small_road")
            .setOrigin(0.5)
            .setDepth(2)
            .setDisplaySize(width, 239);

        const cityScape = this.add.image(x, y, "upper-bg").setOrigin(0.5).setDisplaySize(width, 401).setDepth(1);

        Utils.AlignTopCenter(cityScape, this.bgAlignZone, 0, 80);

        const sun = this.add.image(0, 0, "sun").setOrigin(0.5).setDepth(2).setScale(1);

        Utils.AlignTopRight(sun, this.bgAlignZone, -200, -50);

        const levelTitleBg = this.add.image(0, 0, "bus-level-title-bg").setOrigin(0.5).setDepth(11).setScale(0.9);
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
        this.answerSubmitBtn = this.add.image(0, 0, "rect_green_btn").setOrigin(0.5).setScale(0.8).setDepth(10).setInteractive({ useHandCursor: true });

        // back button logic
        Utils.MakeButton(this, this.backButton, () => {
            this.scene.start('MainMenu');
        });

        // submit button
        Utils.MakeButton(this, this.answerSubmitBtn, () => {
            this.validateWord();
        });
        Phaser.Display.Align.In.BottomRight(this.answerSubmitBtn, this.bgAlignZone, -20, -20);
        this.disableButton(this.answerSubmitBtn);

        //? lives systems
        this.createLives();

        //? grey marks on bus track
        for (let i = 0; i < 10; i++) {
            const { container, mark, flag, tick } = this.createMarker(0, 0);
            this.roadMarksList.push({ container, mark, flag, tick });
            Phaser.Display.Align.In.LeftCenter(container, this.busTrack, -280 + i * -115, 55);
        }

        // create bus
        this.bus = this.add.image(0, 0, "bus").setOrigin(0.5).setScale(1).setDepth(12);
        Phaser.Display.Align.In.LeftCenter(this.bus, this.busTrack, -200, 40);


        this.setupGameplay();
    }

    setupGameplay() {
        console.log('level ' + BUS_LEVELS_DATA[this.levelDataIndex].correctWord.length)
        const levelData = BUS_LEVELS_DATA[this.levelDataIndex];
        const wordLength = BUS_LEVELS_DATA[this.levelDataIndex].correctWord.length;

        this.hintImg = this.add.image(0, 0, levelData.imageKey).setOrigin(0.5).setScale(1).setDepth(11);
        Phaser.Display.Align.In.Center(this.hintImg, this.questionContainer);

        let spacing = this.getWordScaleConfig(wordLength).spacing;
        const scale = this.getWordScaleConfig(wordLength).slotScale;
        const slots: Phaser.GameObjects.Container[] = [];

        for (let i = 0; i < levelData.correctWord.length; i++) {
            const expectedLetter = levelData.correctWord[i];
            const img = this.add.image(0, 0, "letter_placement").setOrigin(0.5).setScale(scale);
            const slot = this.add.container(0, 0, [img]).setDepth(9).setSize(90, 90).setData({
                expectedLetter,
                currentLetter: null,
                occupied: false,
            });

            slots.push(slot);
        }

        // position slots
        const { centerX, centerY } = this.wordRects.getBounds();
        const halfWidth = ((slots.length - 1) * spacing) / 2;

        Phaser.Actions.PlaceOnLine(slots, new Phaser.Geom.Line(centerX - halfWidth, centerY, centerX + halfWidth, centerY));
        this.letterSlots = slots;

        // word drag zone
        const wordZone = this.add.zone(this.road.getBounds().centerX + 180, this.road.getBounds().centerY, this.road.width / 1.5, this.road.height - 70);
        Phaser.Display.Align.In.Center(wordZone, this.road);

        // create draggable letters
        this.draggableLetters = this.createPatternWordSlots(levelData.correctWord, wordZone);

        //? on each correct answer
        //! debug 
        // this.OnEachStepComplete();
        // this.time.addEvent({
        //     delay: 10000,
        //     loop: true,
        //     callback: () => this.OnEachStepComplete()
        // });

    }

    private OnEachStepComplete() {
        // stop if reached end
        if (this.currentStepIndex >= this.roadMarksList.length) {
            return;
        }

        // increase level (max 10)
        this.currentLevel = Math.min(this.currentLevel + 1, this.maxLevels);
        // calculate speed (linear interpolation)
        const progress = (this.currentLevel - 1) / (this.maxLevels - 1);
        const duration = Phaser.Math.Linear(this.baseDuration, this.minDuration, progress);

        const targetMark = this.roadMarksList[this.currentStepIndex].container;
        this.tweens.add({
            targets: this.bus,
            x: targetMark.x,
            duration: duration,
            ease: Phaser.Math.Easing.Linear,
            onComplete: () => {

                // correct answer increment score
                this.incrementScore();
                this.cleanupLevel();

                // show cheked flag
                this.roadMarksList[this.currentStepIndex - 1].mark.setVisible(false);
                this.roadMarksList[this.currentStepIndex - 1].tick.setVisible(true);
                this.roadMarksList[this.currentStepIndex - 1].flag.setVisible(true);

                this.currentStepIndex++;
                if (this.currentStepIndex >= this.roadMarksList.length) {
                    // todo load next scene
                    console.log("Bus reached the final stop");
                }
                console.log(`Level ${this.currentLevel} | Bus speed duration: ${Math.round(duration)}ms`);
            },
        });
    }

    private cleanupLevel() {
        this.letterSlots.forEach((item) => {
            item.destroy();
        });

        this.draggableLetters.forEach((item) => {
            item.destroy();
        });

        if (this.levelDataIndex < BUS_LEVELS_DATA.length) {
            this.levelDataIndex += 1;
        }

        this.setupGameplay();
        this.disableButton(this.answerSubmitBtn);
    }


    private createMarker(x: number, y: number) {
        const container = this.add.container(x, y).setDepth(10);
        const mark = this.add.image(0, 0, "grey_mark").setDepth(9);
        const flag = this.add.image(10, -70, "flag").setVisible(false).setOrigin(0.5).setDepth(10);
        const tick = this.add.image(0, 0, "green_tick").setVisible(false).setDepth(10);

        container.add([mark, flag, tick]);
        return { container, mark, flag, tick };
    }

    private createPatternWordSlots(word: string, zone: Phaser.GameObjects.Zone, slotSize: number = 100, spacing: number = 100) {
        const letters = Phaser.Utils.Array.Shuffle(word.split(''));
        const center = zone.getCenter(new Phaser.Math.Vector2());
        spacing = this.getWordScaleConfig(letters.length).spacingOfRandomLetter;

        const totalWidth = (letters.length - 1) * spacing;
        const startX = center.x - totalWidth / 3;
        const draggableLetters = [];

        for (let i = 0; i < letters.length; i++) {
            const x = startX + i * spacing;
            const y = center.y + (i % 2 === 0 ? -50 : 50);
            const bg = this.add.image(0, 0, "letter").setDisplaySize(slotSize, slotSize).setOrigin(0.5);
            bg.setScale(this.getWordScaleConfig(letters.length).letterScale)

            const text = this.add
                .text(0, 0, letters[i], Utils.fontStyle)
                .setOrigin(0.5);

            const rndRotation = Phaser.Math.Between(-20, 20);
            const container = this.add.container(x, y, [bg, text]).setDepth(11).setSize(slotSize, slotSize).setInteractive({ useHandCursor: true });
            container.setRotation(Phaser.Math.DegToRad(rndRotation));
            this.input.setDraggable(container);
            // store initial position
            container.setData({
                letter: letters[i],
                startX: x,
                startY: y,
                rotation: rndRotation,
                locked: false,
            });
            draggableLetters.push(container);
        }

        // register drag events ONCE
        this.input.on("drag", this.onDragLetter, this);
        this.input.on("dragend", this.onDragEndLetter, this);
        return draggableLetters;
    }

    private onDragEndLetter(pointer: Phaser.Input.Pointer, letterObj: Phaser.GameObjects.Container) {
        if (letterObj.getData("locked")) return;

        for (const slot of this.letterSlots) {
            if (slot.getData("occupied")) continue;

            if (Phaser.Geom.Intersects.RectangleToRectangle(letterObj.getBounds(), slot.getBounds())) {
                // SNAP TO ANY EMPTY SLOT
                letterObj.setPosition(slot.x, slot.y);
                letterObj.setRotation(0);

                slot.setData({
                    occupied: true,
                    currentLetter: letterObj,
                });

                letterObj.setData({
                    locked: true,
                    slot,
                });

                letterObj.disableInteractive();

                this.checkAllSlotsFilled();
                return;
            }
        }

        this.resetLetterPosition(letterObj);
    }

    private checkAllSlotsFilled() {
        const allFilled = this.letterSlots.every((slot) => slot.getData("occupied"));
        this.answerSubmitBtn.setAlpha(allFilled ? 1 : 0.5);
        this.answerSubmitBtn.disableInteractive();
        if (allFilled) this.answerSubmitBtn.setInteractive({ useHandCursor: true });
    }

    private onDragLetter(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container, dragX: number, dragY: number) {
        if (gameObject.getData("locked")) return;
        if (gameObject.getData("permanent")) return;

        gameObject.setPosition(dragX, dragY);
    }

    // correct > move bus
    // incorrect > remove lives
    private validateWord() {
        let wrongAttempt = false;
        for (const slot of this.letterSlots) {
            const expected = slot.getData("expectedLetter");
            const letterObj = slot.getData("currentLetter");

            if (!letterObj) continue;
            const placedLetter = letterObj.getData("letter");
            if (placedLetter === expected) {
                // STAY LOCKED
                letterObj.setData("permanent", true);
            } else {
                wrongAttempt = true;
                // RESET LETTER
                letterObj.setData({
                    locked: false,
                    slot: null,
                });

                letterObj.setInteractive({ useHandCursor: true });
                this.input.setDraggable(letterObj);
                this.resetLetterPosition(letterObj);
                slot.setData({
                    occupied: false,
                    currentLetter: null,
                });
            }
        }

        if (wrongAttempt) {
            this.loseLife();
            this.disableButton(this.answerSubmitBtn);
        }

        // check full completion
        const completed = this.letterSlots.every((slot) => slot.getData("currentLetter") && slot.getData("currentLetter").getData("letter") === slot.getData("expectedLetter"));
        if (completed) {
            console.log("WORD COMPLETED!");
            // move bus / next level etc
            this.OnEachStepComplete();
        }
    }

    private resetLetterPosition(letterObj: Phaser.GameObjects.Container) {
        //? wrong DROP → SNAP BACK
        this.tweens.add({
            targets: letterObj,
            x: letterObj.getData("startX"),
            y: letterObj.getData("startY"),
            rotation: Phaser.Math.DegToRad(letterObj.getData("rotation")),
            duration: 500,
            ease: Phaser.Math.Easing.Expo.Out,
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
            // todo show gameover scene
        } else {
            console.log(`Lives left: ${this.currentLives}`);
        }
    }

    private resetLives() {
        this.currentLives = this.maxLives;
        this.lives.forEach((life) => {
            life.full.setVisible(true);
            life.empty.setVisible(false);
        });
    }

    private disableButton(button: Phaser.GameObjects.Image) {
        button.setAlpha(0.5);
        button.disableInteractive();
    }

    private incrementScore(addBonus: boolean = false) {
        this.score += Utils.corectAnswerPoint;
        if (addBonus) {
            this.score += Utils.correctAnswerBonus;
        }
        this.scoreText.setText(this.score.toString());
        // todo save the score for later use
    }

    private getWordScaleConfig(wordLength: number) {
        return Utils.WORD_SCALE_CONFIG[wordLength] ?? Utils.DEFAULT_WORD_SCALE_CONFIG;
    }

}
