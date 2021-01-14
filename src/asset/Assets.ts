import * as PIXI from 'pixi.js'
import { Flogger } from '../service/Flogger'

export class Assets {
    private static _imagesStartLoading: boolean = false
    private static _imagesFinishedLoading: boolean = false

    public static TILE_DIR = 'assets/image/gamemap/tiles/'
    public static BASE_IMAGE_DIR: string = 'assets/image'

    private constructor() {}

    public static async loadImages() {
        Flogger.log('Assets', 'loadImages')

        return new Promise((resolve, reject) => {
            if (Assets._imagesStartLoading) {
                return
            }
            Assets._imagesStartLoading = true

            try {
                const assetKeys = Object.values(AssetUrls)
                const assets = []
                
                assetKeys.forEach((key: string) => {
                    assets.push(Assets.get(key))
                })

                PIXI.Loader.shared.add(assets).load(() => {
                    Flogger.log('Assets', 'Finished loading images')

                    Assets._imagesFinishedLoading = true

                    resolve(true)
                })
            } catch (error) {
                Flogger.error('Failed to load images', 'Error', error)
                
                reject(error)
            }
        })
    }

    public static get(res: string): HTMLImageElement {
        return require('../../' + res + '.png')
    }

    public static isImagesFinishedLoading() {
        return this._imagesFinishedLoading
    }
}

export class AssetUrls {

    private constructor() {}

    public static PLAYER_IDLE = 'assets/image/player/body/body-idle'
    public static PLAYER_HEAD_HUMAN_DEFAULT = 'assets/image/player/head/head-default'
    public static PLAYER_HAND_HUMAN_DEFAULT = 'assets/image/player/hand/hand-default'
    public static PLAYER_HEAD_HUMAN_ASTRO = 'assets/image/player/head/head-astro'

    // Enemy
    public static ENEMY_FLYINGEYE_IDLE = 'assets/image/enemy/flyingeye/flyingeye'

    // Spherical/GameMap
    public static SPHERICAL_TEST = 'assets/image/gamemap/spherical/spherical_test'
    public static SEMI_SPHERICAL_1 = 'assets/image/gamemap/spherical/semispherical_0'
    public static TILE_TEST = Assets.TILE_DIR + 'cloningfacility/tile_0'

    // Projectiles
    public static PROJECTILE_BULLET = 'assets/image/weapons/projectiles/bullet'
}
