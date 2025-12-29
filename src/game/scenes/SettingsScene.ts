import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    private panel!: Phaser.GameObjects.Container;
    private soundOn: boolean = true;
    private musicOn: boolean = true;

    constructor() {
        super({ key: "SettingsScene" });
    }

    create() {
        const { width, height } = this.scale;

        // Pause the game scene behind this
        // this.scene.pause("GameScene");

        // Dark overlay background
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6).setInteractive();

        // Settings panel
        const panelBg = this.add.rectangle(0, 0, 500, 400, 0xffffff).setStrokeStyle(4, 0xdddddd);

        const title = this.add
            .text(0, -160, "SETTINGS", {
                fontSize: "32px",
                color: "#000",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        const soundBtn = this.createToggleButton(0, -60, "Sound", this.soundOn, (value) => {
            this.soundOn = value;
            this.sound.mute = !value;
        });

        const musicBtn = this.createToggleButton(0, 20, "Music", this.musicOn, (value) => {
            this.musicOn = value;
            // hook your music manager here
        });

        const resumeBtn = this.createButton(0, 120, "RESUME", () => {
            this.close();
        });

        this.panel = this.add.container(width / 2, height / 2, [panelBg, title, soundBtn, musicBtn, resumeBtn]);

        // Simple pop-in animation
        this.panel.setScale(0.8);
        this.tweens.add({
            targets: this.panel,
            scale: 1,
            duration: 200,
            ease: "Back.Out",
        });
    }

    private createToggleButton(x: number, y: number, label: string, initialValue: boolean, callback: (value: boolean) => void): Phaser.GameObjects.Container {
        let value = initialValue;

        const text = this.add
            .text(0, 0, "", {
                fontSize: "24px",
                color: "#000",
            })
            .setOrigin(0.5);

        const updateText = () => {
            text.setText(`${label}: ${value ? "ON" : "OFF"}`);
        };

        updateText();

        const bg = this.add.rectangle(0, 0, 300, 50, 0xeaeaea).setStrokeStyle(2, 0xaaaaaa).setInteractive({ useHandCursor: true });

        bg.on("pointerdown", () => {
            value = !value;
            updateText();
            callback(value);
        });

        return this.add.container(x, y, [bg, text]);
    }

    private createButton(x: number, y: number, label: string, callback: () => void): Phaser.GameObjects.Container {
        const bg = this.add.rectangle(0, 0, 220, 50, 0x4caf50).setInteractive({ useHandCursor: true });

        const text = this.add
            .text(0, 0, label, {
                fontSize: "22px",
                color: "#fff",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        bg.on("pointerdown", callback);

        return this.add.container(x, y, [bg, text]);
    }

    private close() {
        this.tweens.add({
            targets: this.panel,
            scale: 0.8,
            alpha: 0,
            duration: 150,
            onComplete: () => {
                // this.scene.resume("GameScene");
                this.scene.stop();
            },
        });
    }
}
