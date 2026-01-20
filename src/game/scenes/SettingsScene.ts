import Phaser from "phaser";
import { Utils } from "./Utils";
import { SoundUtil } from "./SoundUtil";

export class SettingsScene extends Phaser.Scene {
    private soundOn: boolean = true;
    private musicOn: boolean = true;
    private voiceover: boolean = false;
    fromScene!: string;

    constructor() {
        super({ key: "SettingsMenu" });
    }

    init(data: { from: string }) {
        this.fromScene = data.from;
    }

    create() {
        SoundUtil.init(this);

        // sync UI with global state
        this.musicOn = SoundUtil.musicEnabled;
        this.soundOn = SoundUtil.sfxEnabled;

        const { x, y } = Utils.CenterXY(this.game);

        const darkBg = this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        // Settings panel background
        const panelBg = this.add.image(x, y, "setting-bg").setOrigin(0.5);
        panelBg.setDisplaySize(panelBg.width, panelBg.height + 80);

        const title = this.add.image(0, 0, "settings-title").setOrigin(0.5).setDepth(11);
        Phaser.Display.Align.In.TopCenter(title, panelBg, 0, -30);

        const musicContainer = this.add.container();
        const music = this.add.image(0, 0, "music-fx").setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true });
        const checkMark = this.add.image(0, 0, "checkmark-green").setOrigin(0.5).setDepth(12);
        musicContainer.setSize(music.width, music.height);
        musicContainer.add([music, checkMark]);
        Phaser.Display.Align.In.TopCenter(musicContainer, panelBg, 0, -150);
        Phaser.Display.Align.In.RightCenter(checkMark, music, 0, 0);

        const soundContainer = this.add.container();
        const sound = this.add.image(0, 0, "sound-fx").setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true });
        const checkMark1 = this.add.image(0, 0, "checkmark-green").setOrigin(0.5).setDepth(12);
        soundContainer.setSize(sound.width, sound.height);
        soundContainer.add([sound, checkMark1]);
        Phaser.Display.Align.In.TopCenter(soundContainer, panelBg, 0, -250);
        Phaser.Display.Align.In.RightCenter(checkMark1, sound, 0, 0);

        const voiceOverContainer = this.add.container();
        const voice = this.add.image(0, 0, "voice-over").setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true });
        const checkMark2 = this.add.image(0, 0, "checkmark-green").setOrigin(0.5).setDepth(12);
        voiceOverContainer.setSize(voice.width, voice.height);
        voiceOverContainer.add([voice, checkMark2]);
        Phaser.Display.Align.In.TopCenter(voiceOverContainer, panelBg, 0, -350);
        Phaser.Display.Align.In.RightCenter(checkMark2, voice, 0, 0);

        const closeBtn = this.add.image(0, 0, "close-btn").setOrigin(0.5).setDepth(12).setScale(0.9);
        Phaser.Display.Align.In.BottomCenter(closeBtn, panelBg, 0, 10);

        Utils.MakeButton(this, closeBtn, () => {
            SoundUtil.playClick();
            this.scene.stop(); //  stop ONLY SettingsMenu
            this.scene.resume(this.fromScene); // resume previous scene
            // this.scene.launch('MainMenu');
            // this.scene.sendToBack();
            // this.scene.pause();
        });

        checkMark.setVisible(this.musicOn);
        checkMark1.setVisible(this.soundOn);
        checkMark2.setVisible(this.voiceover);

        checkMark.setVisible(this.musicOn);
        checkMark1.setVisible(this.soundOn);

        music.on("pointerdown", () => {
            this.musicOn = this.toggleOption(this.musicOn, checkMark, "Music");
            SoundUtil.setMusicEnabled(this.musicOn);

            if (this.musicOn) {
                if (this.fromScene === "BasScene") {
                    SoundUtil.playBgMusic("busBgMusic");
                }
                else if (this.fromScene === "MainMenu") {
                    SoundUtil.playBgMusic("mainMenuMusic");
                }
                else if (this.fromScene === "KuasaScene") {
                    SoundUtil.playBgMusic("kuasaBgMusic");
                }
                else if (this.fromScene === "KayakScene") {
                    SoundUtil.playBgMusic("kayakBgMusic");
                }
            }

        });

        sound.on("pointerdown", () => {
            // this.soundOn = this.toggleOption(
            //     this.soundOn,
            //     checkMark1,
            //     "Sound FX"
            // );
            this.soundOn = this.toggleOption(this.soundOn, checkMark1, "Sound FX");
            SoundUtil.setSfxEnabled(this.soundOn);
        });

        voice.on("pointerdown", () => {
            this.voiceover = this.toggleOption(this.voiceover, checkMark2, "Voice Over");

            // TODO: Hook voice over system
        });
    }

    private toggleOption(currentValue: boolean, checkMark: Phaser.GameObjects.Image, label: string): boolean {
        const newValue = !currentValue;
        checkMark.setVisible(newValue);
        console.log(`[Settings] ${label}:`, newValue ? "ON" : "OFF");
        return newValue;
    }
}
