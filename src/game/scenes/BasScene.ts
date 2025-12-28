import { Scene } from 'phaser';
import { Utils } from './Utils';
import { BUS_LEVELS_DATA } from '../BusLevelData';

export class BasScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    wordRects: Phaser.GameObjects.Image;
    bgAlignZone: Phaser.GameObjects.Zone;
    busTrack: Phaser.GameObjects.Image;
    answerSubmitBtn: Phaser.GameObjects.Image;
    questionContainer: Phaser.GameObjects.Container;
    wordsZone: Phaser.GameObjects.Zone; // scatter words here
    road: Phaser.GameObjects.Image;
    roadMarksList: any[] = [];
    letterSlots: Phaser.GameObjects.Container[] = [];
    bus: Phaser.GameObjects.Image;
    busSpeed: number = 1;
    totalSteps: number = 10;
    constructor() {
        super('BasScene');
    }

    create() {
        const { width, height } = this.cameras.main;
        const { x, y } = Utils.CenterXY(this.game);

        this.bgAlignZone = this.add.zone(x, y, width, height);

        // Background
        // this.background = this.add
        //     .image(x, y, 'paper')
        //     .setDepth(-1)
        //     .setOrigin(0.5).setDisplaySize(width, height);

        // Word Rects
        this.wordRects = this.add
            .image(x, y, 'rect_bus')
            .setOrigin(0.5)
            .setScale(1);
        Utils.AlignBottomCenter(this.wordRects, this.bgAlignZone, 0, 0);

        this.road = this.add
            .image(x, y + 120, 'road')
            .setOrigin(0.5)
            .setScale(1);

        //? question box container
        this.questionContainer = this.add.container(0, 0).setDepth(10);
        Phaser.Display.Align.In.LeftCenter(this.questionContainer, this.road, -180, 20);

        const imageBox = this.add
            .image(0, 0, 'question_box')
            .setOrigin(0.5)
            .setScale(0.9);

        this.questionContainer.add(imageBox);

        this.busTrack = this.add
            .image(x, y - 110, 'small_road')
            .setOrigin(0.5)
            .setDepth(2)
            .setDisplaySize(width, 239);

        const cityScape = this.add
            .image(x, y, 'upper-bg')
            .setOrigin(0.5)
            .setDisplaySize(width, 401)
            .setDepth(1);

        Utils.AlignTopCenter(cityScape, this.bgAlignZone, 0, 80);

        const sun = this.add
            .image(0, 0, 'sun')
            .setOrigin(0.5)
            .setDepth(2)
            .setScale(1);

        Utils.AlignTopRight(sun, this.bgAlignZone, -400, -50);

        // Set camera bounds to the size of the background image
        this.cameras.main.setBounds(0, 0, this.bgAlignZone.width, this.bgAlignZone.height);

        this.createHUD();
    }

    createHUD() {
        // HUD elements can be created here
        const backBtn = this.add
            .image(50, 50, 'back')
            .setOrigin(0.5)
            .setScale(0.7)
            .setDepth(10)
            .setInteractive({ useHandCursor: true });

        this.answerSubmitBtn = this.add
            .image(0, 0, 'rect_green_btn')
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(10)
            .setInteractive({ useHandCursor: true });

        Utils.MakeButton(this, this.answerSubmitBtn, () => {
            console.log(`submit correct answers`);
            // this.scene.start('MainMenu');
        });

        Phaser.Display.Align.In.BottomRight(this.answerSubmitBtn, this.bgAlignZone, -50, -20);

        for (let i = 0; i < 3; i++) {
            const heart = this.add
                .image(0, 0, 'heart')
                .setOrigin(0.5)
                .setScale(0.8)
                .setDepth(10);

            //todo track the list of hearts
            Phaser.Display.Align.In.TopLeft(heart, this.bgAlignZone, -100 - i * 60, -25);
        }

        //? grey marks on bus track
        for (let i = 0; i < 10; i++) {
            const mark = this.createMarker(0, 0);
            this.roadMarksList.push(mark);
            Phaser.Display.Align.In.LeftCenter(mark.container, this.busTrack, -280 + i * -115, 55);
        }

        this.gameplayLogic();
    }

    gameplayLogic() {

        const levelData = BUS_LEVELS_DATA[1];

        const spacing = 160;
        const slots: Phaser.GameObjects.Container[] = [];

        for (let i = 0; i < levelData.correctWord.length; i++) {

            const expectedLetter = levelData.correctWord[i];
            const img = this.add.image(0, 0, 'letter_placement')
                .setOrigin(0.5)
                .setScale(0.9);

            const slot = this.add.container(0, 0, [img])
                .setDepth(9)
                .setSize(90, 90)
                .setData({
                    expectedLetter,
                    occupied: false
                });

            slots.push(slot);
        }

        // position slots
        const { centerX, centerY } = this.wordRects.getBounds();
        const halfWidth = ((slots.length - 1) * spacing) / 2;

        Phaser.Actions.PlaceOnLine(
            slots,
            new Phaser.Geom.Line(centerX - halfWidth, centerY, centerX + halfWidth, centerY)
        );

        // ✅ bind slots to scene
        this.letterSlots = slots;

        // word drag zone
        const wordZone = this.add.zone(
            this.road.getBounds().centerX + 180,
            this.road.getBounds().centerY,
            this.road.width / 1.5,
            this.road.height - 70
        );

        Phaser.Display.Align.In.Center(wordZone, this.road);

        // create draggable letters
        this.createPatternWordSlots(levelData.correctWord, wordZone);

        // todo create bus


    }

    private OnEachStepComplete() {
        // Logic for each step in the game
    }

    private createMarker(x: number, y: number) {
        const container = this.add.container(x, y).setDepth(10);

        const grey = this.add.image(0, 0, 'grey_mark').setDepth(9);
        const flag = this.add.image(10, -70, 'flag').setVisible(false).setOrigin(0.5).setDepth(10);
        const tick = this.add.image(0, 0, 'green_tick').setVisible(false).setDepth(10);

        container.add([grey, flag, tick]);
        return { container, grey, flag, tick };
    }

    private createPatternWordSlots(
        word: string,
        zone: Phaser.GameObjects.Zone,
        slotSize: number = 100,
        spacing: number = 120
    ) {

        const letters = Phaser.Utils.Array.Shuffle(word.split(''));
        const center = zone.getCenter(new Phaser.Math.Vector2());

        const totalWidth = (letters.length - 1) * spacing;
        const startX = center.x - totalWidth / 2;

        for (let i = 0; i < letters.length; i++) {

            const x = startX + i * spacing;
            const y = center.y + (i % 2 === 0 ? -50 : 50);

            const bg = this.add.image(0, 0, 'letter')
                .setDisplaySize(slotSize, slotSize)
                .setOrigin(0.5);

            const text = this.add.text(0, 0, letters[i], {
                fontSize: '36px',
                color: '#000',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            const container = this.add.container(x, y, [bg, text])
                .setDepth(11)
                .setSize(slotSize, slotSize)
                .setInteractive({ useHandCursor: true });

            this.input.setDraggable(container);
            // store initial position
            container.setData({
                letter: letters[i],
                startX: x,
                startY: y,
                locked: false
            });

            container.setRotation(
                Phaser.Math.DegToRad(Phaser.Math.Between(-20, 20))
            );
        }

        // register drag events ONCE
        this.input.on('drag', this.onDragLetter, this);
        this.input.on('dragend', this.onDragEndLetter, this);
    }


    private onDragEndLetter(
        pointer: Phaser.Input.Pointer,
        letterObj: Phaser.GameObjects.Container
    ) {
        console.log('Drag Ended:', letterObj.getData('letter'));
        if (letterObj.getData('locked')) return;

        const letter = letterObj.getData('letter');

        for (const slot of this.letterSlots) {

            if (slot.getData('occupied')) continue;
            if (slot.getData('expectedLetter') !== letter) continue;

            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    letterObj.getBounds(),
                    slot.getBounds()
                )
            ) {
                //? ✅ SNAP
                letterObj.setPosition(slot.x, slot.y);
                letterObj.setData('locked', true);
                slot.setData('occupied', true);
                letterObj.disableInteractive();

                this.tweens.add({
                    targets: letterObj,
                    x: slot.x,
                    y: slot.y,
                    scale: 1.05,
                    rotation: 0,
                    duration: 300,
                    ease: Phaser.Math.Easing.Quartic.In,
                    onComplete: () => {
                        letterObj.rotation = 0;
                        const completed = this.letterSlots.every(slot => slot.getData('occupied'));
                        if (completed) {
                            console.log('WORD COMPLETE! / Proceed to next level!');
                        }
                    }
                });

                // console.log(`Placed letter '${letter}' correctly!`, letterObj);
                return;
            }
        }

        this.resetLetterPosition(letterObj);
    }


    private onDragLetter(
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Container,
        dragX: number,
        dragY: number
    ) {
        if (gameObject.getData('locked')) return;
        gameObject.setPosition(dragX, dragY);
    }


    private resetLetterPosition(letterObj: Phaser.GameObjects.Container) {
        //! WRONG DROP → SNAP BACK
        this.tweens.add({
            targets: letterObj,
            x: letterObj.getData('startX'),
            y: letterObj.getData('startY'),
            duration: 300,
            ease: 'Back.Out'
        });
    }


}