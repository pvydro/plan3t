export class AssetUrls {
    private constructor() {}

    public static PLAYER_IDLE = 'assets/image/player/body/body_idle'
    public static PLAYER_HEAD_HUMAN_DEFAULT = 'assets/image/player/head/head-default'
    public static PLAYER_HAND_HUMAN_DEFAULT = 'assets/image/player/hand/hand-default'
    public static PLAYER_HEAD_HUMAN_ASTRO = 'assets/image/player/head/head-astro'
    public static ENEMY_FLYINGEYE_IDLE = 'assets/image/enemy/flyingeye/flyingeye'
}

export class Assets {
    private constructor() {}

    public static get(res: string): HTMLImageElement {
        return require("../../" + res + '.png')
    }
}
