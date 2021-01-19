import * as PIXI from 'pixi.js'
import { SphericalBiome } from '../gamemap/spherical/SphericalData'
import { SphericalTileHelper, SphericalTileValues } from '../gamemap/spherical/SphericalTileHelper'
import { Flogger } from '../service/Flogger'

export class Assets {
    private static _imagesStartLoading: boolean = false
    private static _imagesFinishedLoading: boolean = false

    public static TILE_DIR = 'assets/image/gamemap/tiles/'
    public static BASE_IMAGE_DIR: string = 'assets/image'

    private constructor() {}

    public static async loadImages() {
        Flogger.log('Assets', 'loadImages')

        await Assets.loadAllTileImages()
        
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

    private static async loadAllTileImages() {
        Flogger.log('Assets', 'loadAllTileImages')

        return new Promise((resolve, reject) => {
            if (Assets._imagesStartLoading) {
                return
            }
            
            const biomeKeys = Object.values(SphericalBiome)
            const tileValues = Object.values(SphericalTileValues)
            const tileAssets = []

            console.log('biome', tileValues)

            biomeKeys.forEach((biome: SphericalBiome) => {
                tileValues.forEach((value) => {
                    const tileUrl = SphericalTileHelper.getResourceForTileColorData(value, biome)

                    tileAssets.push(Assets.get(tileUrl))
                })
            })

            PIXI.Loader.shared.add(tileAssets).load(() => {
                Flogger.log('Assets', 'Finished loading images')

                Assets._imagesFinishedLoading = true

                resolve(true)
            })
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
    public static SPHERICAL_SM_0 = 'assets/image/gamemap/spherical/spherical_sm_0'
    public static TILE_TEST = Assets.TILE_DIR + 'cloningfacility/tile_0'

    // public static TILE_KEPLER_GROUND_CORE = Assets.TILE_DIR + 'kepler/ground'
    // public static TILE_KEPLER_GRASS_CORE = Assets.TILE_DIR + 'kepler/tile_0'

    // Projectiles
    public static PROJECTILE_BULLET = 'assets/image/weapons/projectiles/bullet'

    // Particles
    public static MUZZLE_FLASH_A_0 = 'assets/image/particles/muzzleflash/a/0'
    public static MUZZLE_FLASH_A_1 = 'assets/image/particles/muzzleflash/a/1'
    public static MUZZLE_FLASH_A_2 = 'assets/image/particles/muzzleflash/a/2'
    public static MUZZLE_FLASH_A_3 = 'assets/image/particles/muzzleflash/a/3'

    public static MUZZLE_FLASH_B_0 = 'assets/image/particles/muzzleflash/b/0'
    public static MUZZLE_FLASH_B_1 = 'assets/image/particles/muzzleflash/b/1'
    public static MUZZLE_FLASH_B_2 = 'assets/image/particles/muzzleflash/b/2'
    public static MUZZLE_FLASH_B_3 = 'assets/image/particles/muzzleflash/b/3'
    
    public static MUZZLE_FLASH_C_0 = 'assets/image/particles/muzzleflash/c/0'
    public static MUZZLE_FLASH_C_1 = 'assets/image/particles/muzzleflash/c/1'
    public static MUZZLE_FLASH_C_2 = 'assets/image/particles/muzzleflash/c/2'
    public static MUZZLE_FLASH_C_3 = 'assets/image/particles/muzzleflash/c/3'
    
    public static MUZZLE_FLASH_D_0 = 'assets/image/particles/muzzleflash/d/0'
    public static MUZZLE_FLASH_D_1 = 'assets/image/particles/muzzleflash/d/1'
    public static MUZZLE_FLASH_D_2 = 'assets/image/particles/muzzleflash/d/2'
    public static MUZZLE_FLASH_D_3 = 'assets/image/particles/muzzleflash/d/3'
}
