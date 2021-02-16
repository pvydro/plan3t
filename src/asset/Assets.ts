import * as PIXI from 'pixi.js'
import { SphericalBiome } from '../gamemap/spherical/SphericalData'
import { SphericalTileHelper, SphericalTileValues } from '../gamemap/spherical/tile/SphericalTileHelper'
import { Flogger } from '../service/Flogger'

export class Assets {
    private static _imagesStartLoading: boolean = false
    private static _imagesFinishedLoading: boolean = false

    static TILE_DIR = 'assets/image/gamemap/tiles/'
    static BASE_IMAGE_DIR: string = 'assets/image'

    private constructor() {}

    static async loadImages() {
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
                    try {
                        assets.push(Assets.get(key))
                    } catch (error) {
                        Flogger.warn('Failed to get asset for ' + key, 'error', error)
                    }
                })

                PIXI.Loader.shared.add(assets).load(() => {
                    Flogger.log('Assets', 'Finished loading images')

                    Assets._imagesFinishedLoading = true

                    resolve(true)
                })
            } catch (error) {
                Flogger.error('Failed to load images', 'error', error)
                
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
            const tileDir = Assets.TILE_DIR
            const totalFoliage = 10

            biomeKeys.forEach((biome: SphericalBiome) => {
                const biomeDir = tileDir + biome

                tileValues.forEach((value) => {
                    const tileUrl = SphericalTileHelper.getTilesheetFromColorData(value, biome)

                    tileAssets.push(Assets.get(tileUrl))
                })

                for (let i = 0; i < totalFoliage; i++) {
                    let foliageDir = biomeDir + '/' + 'foliage' + i

                    try {
                        tileAssets.push(Assets.get(foliageDir))
                    } catch (error) {
                        Flogger.warn('No foliage for ' + biome, 'i', i)
                    }

                }
            })

            PIXI.Loader.shared.add(tileAssets).load(() => {
                Flogger.log('Assets', 'Finished loading images')

                Assets._imagesFinishedLoading = true

                resolve(true)
            })
        })
    }

    static get(res: string): HTMLImageElement {
        return require('../../' + res + '.png')
    }

    static isImagesFinishedLoading() {
        return this._imagesFinishedLoading
    }
}

export class AssetUrls {

    private constructor() {}

    static PLAYER_IDLE = 'assets/image/player/body/body-idle'
    static PLAYER_HEAD_HUMAN_DEFAULT = 'assets/image/player/head/head-default'
    static PLAYER_HAND_HUMAN_DEFAULT = 'assets/image/player/hand/hand-default'
    static PLAYER_HEAD_HUMAN_ASTRO = 'assets/image/player/head/head-astro'

    // Enemy
    static ENEMY_FLYINGEYE_IDLE = 'assets/image/enemy/flyingeye/flyingeye'

    // Spherical/GameMap
    static SKY_DAWN = 'assets/image/gamemap/skies/dawn'
    static SPHERICAL_TEST = 'assets/image/gamemap/spherical/spherical_test'
    static SEMI_SPHERICAL_1 = 'assets/image/gamemap/spherical/semispherical_0'
    static SPHERICAL_SM_0 = 'assets/image/gamemap/spherical/spherical_sm_0'
    static TILE_TEST = Assets.TILE_DIR + 'cloningfacility/tile_0'

    // Projectiles
    static PROJECTILE_BULLET = 'assets/image/weapons/projectiles/bullet'

    // Particles
    static MUZZLE_FLASH_A_0 = 'assets/image/particles/muzzleflash/a/0'
    static MUZZLE_FLASH_A_1 = 'assets/image/particles/muzzleflash/a/1'
    static MUZZLE_FLASH_A_2 = 'assets/image/particles/muzzleflash/a/2'
    static MUZZLE_FLASH_A_3 = 'assets/image/particles/muzzleflash/a/3'

    static MUZZLE_FLASH_B_0 = 'assets/image/particles/muzzleflash/b/0'
    static MUZZLE_FLASH_B_1 = 'assets/image/particles/muzzleflash/b/1'
    static MUZZLE_FLASH_B_2 = 'assets/image/particles/muzzleflash/b/2'
    static MUZZLE_FLASH_B_3 = 'assets/image/particles/muzzleflash/b/3'
    
    static MUZZLE_FLASH_C_0 = 'assets/image/particles/muzzleflash/c/0'
    static MUZZLE_FLASH_C_1 = 'assets/image/particles/muzzleflash/c/1'
    static MUZZLE_FLASH_C_2 = 'assets/image/particles/muzzleflash/c/2'
    static MUZZLE_FLASH_C_3 = 'assets/image/particles/muzzleflash/c/3'
    
    static MUZZLE_FLASH_D_0 = 'assets/image/particles/muzzleflash/d/0'
    static MUZZLE_FLASH_D_1 = 'assets/image/particles/muzzleflash/d/1'
    static MUZZLE_FLASH_D_2 = 'assets/image/particles/muzzleflash/d/2'
    static MUZZLE_FLASH_D_3 = 'assets/image/particles/muzzleflash/d/3'

    // Lights
    static LIGHT_HARD_LG = 'assets/image/lights/lighthardlg'

    // Passive Creatures
    static PASSIVE_CREATURE_HORNET = 'assets/image/creature/passive/swamphornet/swamphornet'
    static LIGHT_VIGNETTE_BORDER = 'assets/image/lights/vignetteborder'

    // InGameHUD
    static HEALTH_BAR_BG = 'assets/image/ui/ingamehud/healthbarbg'
    static HEALTH_BAR_FILL = 'assets/image/ui/ingamehud/healthbarfill'
    static AMMO_STATUS_BG = 'assets/image/ui/ingamehud/ammostatusbg'
    static OVERHEAD_HEALTHB_BAR_BG = 'assets/image/ui/ingamehud/overheadhealthbar'

    // Tile decoration
}
