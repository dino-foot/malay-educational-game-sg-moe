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
    roadMarksList: any[] = [];
    // imageBox: Phaser.GameObjects.Image;

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

        const road = this.add
            .image(x, y + 120, 'road')
            .setOrigin(0.5)
            .setScale(1);

        //? question box container
        this.questionContainer = this.add.container(0, 0).setDepth(10);
        Phaser.Display.Align.In.LeftCenter(this.questionContainer, road, -200, 10);

        const imageBox = this.add
            .image(0, 0, 'question_box')
            .setOrigin(0.5)
            .setScale(1);

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
        // level constracts here
        const levelData = BUS_LEVELS_DATA[1]; // get first level data
        const img = this.add.image(0, 0, levelData.imageKey).setOrigin(0.5).setScale(1.5).setDepth(11);
        Phaser.Display.Align.In.Center(img, this.questionContainer, 0, 0);

        const spacing = 135;
        const letters: Phaser.GameObjects.Container[] = [];

        for (let i = 0; i < levelData.correctWord.length; i++) {
            letters.push(
                this.add
                    .container(0, 0, [
                        this.add.image(0, 0, 'letter_placement').setOrigin(0.5).setScale(0.9)
                    ])
                    .setDepth(11)
            );
        }

        // ✅ FIXED CENTER CALCULATION
        const bounds = this.wordRects.getBounds();
        const centerX = bounds.centerX;
        const centerY = bounds.centerY;

        const halfWidth = ((letters.length - 1) * spacing) / 2;

        Phaser.Actions.PlaceOnLine(
            letters,
            new Phaser.Geom.Line(centerX - halfWidth - 80, centerY, centerX + halfWidth, centerY)
        );


    } // end logic

    private createMarker(x: number, y: number) {
        const container = this.add.container(x, y).setDepth(10);

        const grey = this.add.image(0, 0, 'grey_mark').setDepth(9);
        const flag = this.add.image(10, -70, 'flag').setVisible(false).setOrigin(0.5).setDepth(10);
        const tick = this.add.image(0, 0, 'green_tick').setVisible(false).setDepth(10);

        container.add([grey, flag, tick]);
        return { container, grey, flag, tick };
    }
}