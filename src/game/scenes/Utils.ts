export class Utils {

    public static CenterXY(game: Phaser.Game): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(
            game.scale.width * 0.5,
            game.scale.height * 0.5
        );
    }
}
