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
            "The Ministry of Education wishes to acknowledge the following\n" +
            "source for licensed content used in this production:",
            20,
            false,
            40
        );

        addText("Sound Effects by", 30, true);

        addText("BlenderTimer\nhttps://pixabay.com/users/blendertimer-9538909/", 18, false, 20);
        addText("freesound_community\nhttps://pixabay.com/users/freesound_community-46691455/", 18, false, 20);
        addText("DenielCZ\nhttps://pixabay.com/users/denielcz-50993549/", 18, false, 20);
        addText("Mrstokes302\nhttps://pixabay.com/users/mrstokes302-48032194/", 18, false, 20);
        addText("DRAGON-STUDIO\nhttps://pixabay.com/users/dragon-studio-38165424/", 18, false, 40);

        addText("Music by", 30, true);

        addText("DziiTen\nhttps://pixabay.com/users/dziiten-37030569/", 18, false, 40);

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
        Utils.FadeToScene(this, "MainMenu");
    }
}
