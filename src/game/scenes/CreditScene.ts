import { Scene } from "phaser";
import { Utils } from "./Utils";

export class CreditScene extends Scene {
    private creditsContainer!: Phaser.GameObjects.Container;

    constructor() {
        super("CreditScene");
    }

    create() {
        const cam = this.cameras.main;
        const centerX = cam.centerX;

        // Background
        this.add.rectangle(0, 0, cam.width, cam.height, 0x000000).setOrigin(0).setDepth(0);

        // Credits text
        const creditsText = `
© 2026 Curriculum Planning & Development Division
Ministry of Education, Singapore

All rights reserved

────────────────────────

Acknowledgements

The Ministry of Education wishes to thank the following
for permission to use copyright material:

────────────────────────

Audio

“No Wait To You”
by Fresh_Morning
Licensed via Pixabay
https://pixabay.com/music/smooth-jazz-no-wait-to-you-190-210152/

“Menu Select Button”
by VoiceBosch
Licensed via Pixabay
https://pixabay.com/sound-effects/search/menu%20select%20button/

“Urban Street City Music”
by BackgroundMusicForVideo
Licensed via Pixabay
https://pixabay.com/music/beats-urban-street-city-music-385623/

“Bus idle to drive off”
by rabbydaw (Freesound)
Licensed via Pixabay
https://pixabay.com/sound-effects/city-bus-idle-to-drive-off-65780/

“Correct”
by chrisiex1
Licensed via Pixabay
https://pixabay.com/sound-effects/film-special-effects-correct-156911/

“Wrong Answer”
by Universfield
Licensed via Pixabay
https://pixabay.com/sound-effects/film-special-effects-wrong-answer-129254/

“Train to Paris”
by MusicWorld
Licensed via Pixabay
https://pixabay.com/music/modern-classical-train-to-paris-234096/

“Train passing”
by AudioPapkin
Licensed via Pixabay
https://pixabay.com/sound-effects/film-special-effects-train-passing-298079/

“By the Sea”
by DJARTMUSIC
Licensed via Pixabay
https://pixabay.com/music/smooth-jazz-by-the-sea-254093/

“Paddle boat on water.wav”
by SpliceSound (Freesound)
Licensed via Pixabay
https://pixabay.com/sound-effects/nature-paddle-boat-on-waterwav-14861/
`;

        const text = this.add
            .text(centerX, 0, creditsText, {
                fontFamily: "Arial",
                fontSize: "20px",
                color: "#ffffff",
                align: "center",
                wordWrap: { width: cam.width * 0.85 },
            })
            .setOrigin(0.5, 0);

        this.creditsContainer = this.add.container(0, 0, [text]);

        // Scroll animation
        this.tweens.add({
            targets: this.creditsContainer,
            y: -(text.height + cam.height / 2),
            delay: 3000,
            duration: 25000, // 5e seconds
            ease: "Linear",
            // onComplete: () => {
            //     this.exitCredits();
            // },
        });

        this.time.delayedCall(10000, () => {
            this.exitCredits();
        });

        // Exit on pointer down
        this.input.once("pointerdown", () => {
            this.exitCredits();
        });

    }

    private exitCredits() {
        Utils.FadeToScene(this, "MainMenu");
    }
}
