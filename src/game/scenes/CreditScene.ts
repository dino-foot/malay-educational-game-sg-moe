import { Scene } from "phaser";
import { Utils } from "./Utils";

export class CreditScene extends Scene {
    private creditsContainer!: Phaser.GameObjects.Container;
    private currentY = 0;

    constructor() {
        super("CreditScene");
    }

    create() {
        const cam = this.cameras.main;
        const centerX = cam.centerX;

        // Background
        this.add.rectangle(0, 0, cam.width, cam.height, 0x000000).setOrigin(0);

        this.creditsContainer = this.add.container(0, cam.height);

        // Helper to add text blocks
        const addText = (
            content: string,
            fontSize = 20,
            bold = false,
            spacing = 2
        ) => {
            const text = this.add.text(centerX, this.currentY, content, {
                fontFamily: 'nunito-semi-bold',
                fontSize: `${fontSize}px`,
                color: "#ffffff",
                align: "center",
                fontStyle: bold ? "bold" : "normal",
                wordWrap: { width: cam.width * 0.85 },
                lineSpacing: 6,
            }).setOrigin(0.5, 0);

            this.creditsContainer.add(text);
            this.currentY += text.height + spacing;
        };

        // ===== CONTENT (matches image) =====

        addText("© 2026 Curriculum Planning & Development Division");
        addText("Ministry of Education, Singapore", 20, false, 20);
        addText("All rights reserved", 20, false, 20);

        addText("Acknowledgements", 30, true);

        addText(
            "The Ministry of Education wishes to thank the following\n" +
            "for permission to use copyright material:",
            20,
            false,
            40
        );

        addText("Sound Effects by", 30, true);

        // addText("No Wait To You by Fresh_Morning \nhttps://pixabay.com/music/smooth-jazz-no-wait-to-you-190-210152/", 18, false, 24);
        addText("Menu Select Button by VoiceBosch\nhttps://pixabay.com/sound-effects/search/menu%20select%20button/", 18, false, 25);
        // addText("Urban Street City Music by BackgroundMusicForVideo\nhttps://pixabay.com/music/beats-urban-street-city-music-385623/", 18, false, 20);
        addText("Bus idle to drive off by rabbydaw (Freesound)\nhttps://pixabay.com/sound-effects/city-bus-idle-to-drive-off-65780/", 18, false, 25);
        addText("Correct by chrisiex1\nhttps://pixabay.com/sound-effects/film-special-effects-correct-156911/", 18, false, 25);
        addText("Wrong Answer by Universfield\nhttps://pixabay.com/sound-effects/film-special-effects-wrong-answer-129254/", 18, false, 25);
        addText("Train Passing By by kalsstockmedia\nhttps://pixabay.com/users/kalsstockmedia-13377274/", 18, false, 25);
        addText("Paddle boat on water by SpliceSound (Freesound)\nhttps://pixabay.com/sound-effects/nature-paddle-boat-on-waterwav-14861/", 18, false, 40);

        addText("Music by", 30, true);

        addText("Urban Street City Music by BackgroundMusicForVideo\nhttps://pixabay.com/music/beats-urban-street-city-music-385623/", 18, false, 25);
        addText("No Wait To You by Fresh_Morning\nhttps://pixabay.com/music/smooth-jazz-no-wait-to-you-190-210152/", 18, false, 25);
        addText("Train to Paris by MusicWorld\nhttps://pixabay.com/music/modern-classical-train-to-paris-234096/", 18, false, 25);
        addText("By the Sea by DJARTMUSIC\nhttps://pixabay.com/music/smooth-jazz-by-the-sea-254093/", 18, false, 40);

        // ===== SCROLL =====
        this.tweens.add({
            targets: this.creditsContainer,
            y: -(this.currentY + cam.height),
            duration: 30000,
            ease: "Linear",
            onComplete: () => this.exitCredits(),
        });

        // Exit on tap
        this.input.once("pointerdown", () => this.exitCredits());
    }

    private exitCredits() {
        this.registry.set('isFirstEntry', true);
        Utils.FadeToScene(this, "MainMenu");
    }
}
