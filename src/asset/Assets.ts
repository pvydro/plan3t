export class AssetUrls {
    private constructor() {}

    public static BASE_IMAGE_DIR: string = 'assets/image'

    public static PLAYER_IDLE = 'assets/image/player/body/body-idle'
    public static PLAYER_HEAD_HUMAN_DEFAULT = 'assets/image/player/head/head-default'
    public static PLAYER_HAND_HUMAN_DEFAULT = 'assets/image/player/hand/hand-default'
    public static PLAYER_HEAD_HUMAN_ASTRO = 'assets/image/player/head/head-astro'

    // Enemy
    public static ENEMY_FLYINGEYE_IDLE = 'assets/image/enemy/flyingeye/flyingeye'

    // Spherical/GameMap
    public static SPHERICAL_TEST = 'assets/image/gamemap/spherical/spherical_test'
    public static TILE_DIR = 'assets/image/gamemap/tiles/'
    public static TILE_TEST = AssetUrls.TILE_DIR + 'cloningfacility/tile_0'
}

export class Assets {
    private constructor() {}

    public static get(res: string): HTMLImageElement {
        return require('../../' + res + '.png')
    }
}
