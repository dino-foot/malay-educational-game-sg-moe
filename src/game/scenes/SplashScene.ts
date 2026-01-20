import { Scene } from 'phaser';
import { Utils } from './Utils';

export class SplashScene extends Scene {
    constructor() {
        super('SplashScene');
    }

    create() {
        const video = this.add.video(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "splashVideo"
        );

        video.setOrigin(0.5);
        video.setScale(1.25);
        video.setDepth(1);
        video.setMute(true);

        // video.once('complete', () => {
        //     console.log('Video complete');
        //     this.scene.start('SplashScene');
        // });

        this.time.delayedCall(4000, () => {
            Utils.FadeToScene(this, 'CreditScene');
        });
        video.play(); // IMPORTANT
    }
}
