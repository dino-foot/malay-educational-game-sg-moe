export class SoundUtil {
    private static scene: Phaser.Scene;

    private static bgMusic?: Phaser.Sound.BaseSound;
    private static clickSfx?: Phaser.Sound.BaseSound;

    static musicEnabled = true;
    static sfxEnabled = true;
    static voiceOverEnabled = true;

    static sfxCache: Map<string, Phaser.Sound.BaseSound> = new Map()

    // 🔹 init once per scene
    static init(scene: Phaser.Scene) {
        this.scene = scene;

        if (!this.clickSfx) {
            this.clickSfx = scene.sound.add("buttonClick1", { volume: 1 });
        }

        // reset all the sfx
        this.stopSfx('trainPassing');
        this.stopSfx('paddleBoat');
        this.stopSfx('busRollForward');
        this.applySettings();
    }

    // 🔊 SFX
    static playClick() {
        if (!this.sfxEnabled || !this.clickSfx) return;
        this.clickSfx.play();
    }

    // 🎵 BG MUSIC
    static playBgMusic(key: string, volume = 0.35) {
        if (!this.musicEnabled) return;
        // 🔁 already playing this track
        if (this.bgMusic?.key === key && this.bgMusic.isPlaying) {
            return;
        }
        this.stopBg();
        this.bgMusic = this.scene.sound.add(key, {
            loop: true,
            volume,
        });
        this.bgMusic.play();
    }


    // GENERIC SFX PLAYER
    static playSfx(key: string, volume = 1) {
        if (!this.sfxEnabled) return;

        let sfx = this.sfxCache.get(key);
        if (!sfx) {
            sfx = this.scene.sound.add(key, { volume });
            this.sfxCache.set(key, sfx);
        }
        // prevent overlap spam
        if (sfx.isPlaying) {
            sfx.stop();
        }
        sfx.play();
        return sfx;
    }

    static playVO(key: string, volume = 1) {
        console.log('voice over >> ', this.voiceOverEnabled);

        if (!this.voiceOverEnabled) return;
        let sfx = this.sfxCache.get(key);
        if (!sfx) {
            sfx = this.scene.sound.add(key, { volume });
            this.sfxCache.set(key, sfx);
        }
        // prevent overlap spam
        if (sfx.isPlaying) {
            sfx.stop();
        }
        sfx.play();
        return sfx;
    }

    static stopAllSfx() {
        this.sfxCache.forEach((sfx) => {
            if (sfx.isPlaying) {
                sfx.stop();
            }
        });

        // Also stop the specific click sound if it's playing
        // if (this.clickSfx?.isPlaying) {
        //     this.clickSfx.stop();
        // }
    }

    static stopSfx(key: string, volume = 1) {
        if (!this.sfxEnabled) return;
        let sfx = this.sfxCache.get(key);
        if (!sfx) {
            sfx = this.scene.sound.add(key, { volume });
            this.sfxCache.set(key, sfx);
        }
        // prevent overlap spam
        if (sfx.isPlaying) {
            sfx.stop();
        }
    } // end 

    static stopBg() {
        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = undefined;
        }
    }

    // ⚙️ TOGGLES (CALLED FROM SETTINGS)
    static setMusicEnabled(enabled: boolean) {
        this.musicEnabled = enabled;
        localStorage.setItem("musicOn", String(enabled));

        if (!enabled) this.stopBg();
    }

    static setSfxEnabled(enabled: boolean) {
        this.sfxEnabled = enabled;
        localStorage.setItem("sfxOn", String(enabled));
    }

    static setVOEnabled(enabled: boolean) {
        this.voiceOverEnabled = enabled;
        localStorage.setItem("voOn", String(enabled));
    }

    // 🔁 Restore saved settings
    static loadSettings() {
        this.musicEnabled = localStorage.getItem("musicOn") !== "false";
        this.sfxEnabled = localStorage.getItem("sfxOn") !== "false";
        this.voiceOverEnabled = localStorage.getItem("voOn") !== "false";
    }

    static applySettings() {
        if (!this.musicEnabled) this.stopBg();
        if (!this.voiceOverEnabled) this.stopAllSfx();
    }
}
