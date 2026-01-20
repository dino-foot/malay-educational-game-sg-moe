import { Scene } from "phaser";
import { Utils } from "./Utils";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 468, 32).setStrokeStyle(2, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(this.cameras.main.centerX - 468 / 2 + 10, this.cameras.main.centerY, 10, 20, 0x00ff00);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 454 * progress;
        });
    }

    preload() {
        Utils.LoadLocalFont("nunito", "assets/fonts/Nunito-VariableFont_wght.ttf");
        Utils.LoadLocalFont("nunito-bold", "assets/fonts/Nunito-Italic-VariableFont_wght.ttf");

        this.load.spineJson("boat-data", "assets/spine/boat.json");
        this.load.spineAtlas("boat-atlas", "assets/spine/boat.atlas");

        this.load.image("blue_light", "assets/menu/blue_light.png");
        this.load.image("green_light", "assets/menu/green_light.png");
        this.load.image("red_light", "assets/menu/red_light.png");
        this.load.image("yellow_light", "assets/menu/yellow_light.png");

        this.load.video("splashVideo", "assets/videos/splash_video.mp4");

        // menu/bas music
        this.load.audio("mainMenuMusic", "assets/sounds/no-wait-to-you.mp3");

        this.load.audio("busBgMusic", "assets/sounds/urban-street-city-music.mp3");
        this.load.audio("busRollForward", "assets/sounds/bus-idle-to-drive-off.mp3");

        this.load.audio("buttonClick", "assets/sounds/button-click.mp3");
        this.load.audio("buttonClick1", "assets/sounds/Click.wav");
        this.load.audio("correctAnswer", "assets/sounds/correct-answer.mp3");
        this.load.audio("wrongAnswer", "assets/sounds/wrong-answer.mp3");
        // kuasa
        this.load.audio("kuasaBgMusic", "assets/sounds/train-to-paris.mp3");
        this.load.audio("trainPassing", "assets/sounds/train-passing.mp3");
        // kayak
        this.load.audio("kayakBgMusic", "assets/sounds/by-the-sea.mp3");
        this.load.audio("paddleBoat", "assets/sounds/paddle-boat-on-waterwav.mp3");
        // this.load.audio('menuSelectButton', 'assets/sounds/menu-select-button.mp3');
        // Load the assets for the game - Replace with your own assets
        // this.load.setPath('assets');

        const basImageKeys = ["bus_stop",
            "sparkle",
            "checkmark",
            "ellipse",
            "flag",
            "green_tick",
            "grey_mark",
            "letter_placement", "letter", "paper", "road",
            "rect_green_btn", "rect_bus", "yellow-panel",
            "small_road", "bus-level-title-bg", "upper-bg",
            "empty_heart", "heart", "image_box", "bus",
            "score", "text-box"];

        basImageKeys.forEach((key) => {
            this.load.image(key, `assets/bas/${key}.png`);
        });

        const kayakImageKeys = ["boat_shadow",
            "kayak-bg",
            "omar_kayak", "pier_shadow",
            "jetty", "kayak_title",
            "kayak-sentence",
            "kayak_rnd_word",
            "kayak-lower-panel",
            "kayak-sentence"];

        kayakImageKeys.forEach((key) => {
            this.load.image(key, `assets/kayak/${key}.png`);
        });

        const kuasaImageKeys = ["beam", "black_screen", "brige_pole", "button_2", "island", "left_train", "mid_train", "right_train", "kuasa-level-title-bg", "train_bg", "train_line", "train_track", "train_question_panel"];

        kuasaImageKeys.forEach((key) => {
            this.load.image(key, `assets/kuasa/${key}.png`);
        });

        this.load.image("bas", "assets/menu/bas.png");
        this.load.image("battery_off", "assets/menu/battery_off.png");
        this.load.image("bar1", "assets/menu/bar1.png");
        this.load.image("bar2", "assets/menu/bar2.png");
        this.load.image("bar3", "assets/menu/bar3.png");

        this.load.image("glow", "assets/menu/glow.png");
        this.load.image("kampung", "assets/menu/kampung.png");
        this.load.image("kuasa", "assets/menu/kuasa.png");
        this.load.image("logo", "assets/menu/logo.png");
        this.load.image("omar", "assets/menu/omar.png");
        this.load.image("settings", "assets/menu/settings.png");
        this.load.image("bg", "assets/menu/background.png");
        this.load.image("back", "assets/menu/backBtn.png");

        const basLevelImageKeys = [
            "hinggap",
            "kenderaan",
            "menghalau",
            "menyesal",
            "menyewa",
            "panduan",
            "terbeliak",
            "terpinga-pinga",
            "teruja",
            "placeholder", // keep this at the end
        ];
        basLevelImageKeys.forEach((key) => {
            this.load.image(key, `assets/level_bas/${key}.png`);
        });

        const settingsImgKeys = ["checkmark-green", "close-btn", "music-fx", "setting-bg", "sound-fx", "voice-over", "settings-title"];

        settingsImgKeys.forEach((key) => {
            this.load.image(key, `assets/settings/${key}.png`);
        });

        const gameoverImgKeys = ["gameover", "back-to-menu", "score-title"];

        gameoverImgKeys.forEach((key) => {
            this.load.image(key, `assets/gameover/${key}.png`);
        });
    } // end

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("SplashScene");
    }
}
