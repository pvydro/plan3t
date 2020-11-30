export class AssetUrls {
    private constructor() {}

    public static PLAYER_HEAD_ASTRO = 'assets/image/player/head-astro'
    public static ENEMY_FLYINGEYE_IDLE = 'assets/image/enemy/flyingeye/flyingeye'
}

export class Assets {
    public static get(res: string): HTMLImageElement {
        return require("../../" + res + '.png')
    }
}