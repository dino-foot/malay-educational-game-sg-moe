import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {

        this.load.image('blue_light', 'assets/menu/blue_light.png');
        this.load.image('green_light', 'assets/menu/green_light.png');
        this.load.image('red_light', 'assets/menu/red_light.png');
        this.load.image('yellow_light', 'assets/menu/yellow_light.png');

        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        const basImageKeys = [
            'bus_stop',
            'checkmark',
            'city_bg',
            'ellipse',
            'flag',
            'green_tick',
            'grey_mark',
            'letter_placement',
            'letter',
            'paper',
            'road'
        ];

        basImageKeys.forEach(key => {
            this.load.image(key, `bas/${key}.png`);
        });

        const kayakImageKeys = [
            'boat_shadow',
            'far_city',
            'left_island',
            'omar_kayak',
            'pier_shadow',
            'pier',
            'right_island',
            'sky_noon',
            'sun_cast',
            'water_noon'
        ];

        kayakImageKeys.forEach(key => {
            this.load.image(key, `kayak/${key}.png`);
        });

        const kuasaImageKeys = [
            'beam',
            'black_screen',
            'brige_pole',
            'button_2',
            'city_scape',
            'island',
            'left_train',
            'mid_train',
            'ocean',
            'right_train',
            'sky',
            'sun',
            'train_track_back',
            'train_track_font'
        ];

        kuasaImageKeys.forEach(key => {
            this.load.image(key, `kuasa/${key}.png`);
        });


        this.load.image('bas', 'menu/bas.png');
        this.load.image('battery', 'menu/battery.png');
        this.load.image('glow', 'menu/glow.png');
        this.load.image('kampung', 'menu/kampung.png');
        this.load.image('kuasa', 'menu/kuasa.png');
        this.load.image('logo', 'menu/logo.png');
        this.load.image('omar', 'menu/omar.png');
        this.load.image('settings', 'menu/settings.png');
        this.load.image('bg', 'menu/background.png');
        this.load.image('back', 'menu/backBtn.png');

    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
