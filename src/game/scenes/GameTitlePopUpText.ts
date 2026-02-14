import { Scene } from "phaser";
import { Utils } from "./Utils";

export class GameTitlePopupScene extends Scene {
    private myContainer!: Phaser.GameObjects.Container;
    private currentY = 0;

    constructor() {
        super("GameTitlePopupScene");
    }

    init() {

    }

    create() {
        const cam = this.cameras.main;
        const centerX = cam.centerX;

        // Background
        this.add.rectangle(0, 0, cam.width, cam.height, 0x000000).setOrigin(0);
        this.myContainer = this.add.container(0, cam.height);
    }
}