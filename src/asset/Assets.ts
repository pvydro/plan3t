import * as PIXI from 'pixi.js'
import { SphericalBiome } from '../gamemap/spherical/SphericalData'
import { SphericalTileHelper, SphericalTileValues } from '../gamemap/spherical/tile/SphericalTileHelper'
import { Flogger } from '../service/Flogger'

export class Assets {
    private static _imagesStartLoading: boolean = false
    private static _imagesFinishedLoading: boolean = false

    static BaseImageDir: string = 'assets/image'
    static TileDir = Assets.BaseImageDir + '/gamemap/tiles/'

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
            const tileDir = Assets.TileDir
            const totalFoliage = 10
            const totalTrees = 2

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

                for (let i = 0; i < totalTrees; i++) {
                    let treeDir = biomeDir + '/' + 'tree' + i

                    try {
                        tileAssets.push(Assets.get(treeDir))
                    } catch (error) {
                        Flogger.warn('No tree for ' + biome, 'i', i)
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

    static PlayerIdle = 'assets/image/player/body/body-idle'
    static PlayerHeadHumanDefault = 'assets/image/player/head/head-default'
    static PlayerHandHumanDefault = 'assets/image/player/hand/hand-default'
    static PlayerHeadHumanAstro = 'assets/image/player/head/head-astro'

    // Enemy
    static EnemyFlyingEyeIdle = 'assets/image/enemy/flyingeye/flyingeye'
    static EnemySormIdle = 'assets/image/enemy/sorm/idle'

    // Spherical/GameMap
    static SkyDawn = 'assets/image/gamemap/sky/dawn'
    static SkyDay = 'assets/image/gamemap/sky/day'
    static SphericalTest = 'assets/image/gamemap/spherical/spherical_test'
    static SemiSpherical = 'assets/image/gamemap/spherical/semispherical_0'
    static SphericalSM = 'assets/image/gamemap/spherical/spherical_sm_0'
    static TileTest = Assets.TileDir + 'cloningfacility/tile_0'

    // Nature
    static BushTicberry = 'assets/image/gamemap/bush/bush_ticberry'
    static TreeDefault = 'assets/image/gamemap/trees/tree1'

    // Projectiles
    static ProjectileBullet = 'assets/image/weapons/projectiles/bullet'

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

    static SMALL_BLAST_0 = 'assets/image/particles/smallblast/smallblast_0'
    static SMALL_BLAST_1 = 'assets/image/particles/smallblast/smallblast_1'
    static SMALL_BLAST_2 = 'assets/image/particles/smallblast/smallblast_2'
    static SMALL_BLAST_3 = 'assets/image/particles/smallblast/smallblast_3'

    // Lights
    static LIGHT_HARD_LG = 'assets/image/lights/lighthardlg'
    static LIGHT_VIGNETTE_BORDER = 'assets/image/lights/vignetteborder'

    // Passive Creatures
    static PASSIVE_CREATURE_HORNET = 'assets/image/creature/swamphornet/swamphornet'
    static PASSIVE_CREATURE_KOINI = 'assets/image/creature/koini/koini_idle'

    // InGameHUD
    static HEALTH_BAR_BG = 'assets/image/ui/ingamehud/healthbarbg'
    static HEALTH_BAR_FILL = 'assets/image/ui/ingamehud/healthbarfill'
    static AMMO_STATUS_BG = 'assets/image/ui/ingamehud/ammostatusbg'
    static OVERHEAD_HEALTHB_BAR_BG = 'assets/image/ui/ingamehud/overheadhealthbar'
    static OVERHEAD_HEALTHB_BAR_FILL = 'assets/image/ui/ingamehud/overheadhealthbarfill'
    static HOTBAR_BG = 'assets/image/ui/ingamehud/hotbar/hotbarbg'

    // UI
    static MID_BUTTON_METAL = 'assets/image/ui/generic/midbuttonmetal'
    static HOLO_BUTTON_BG = 'assets/image/ui/generic/holobuttonbg'
    static IGI_TOP = 'assets/image/ui/ingameinventory/container-top'
    static TOOLTIP_KEY = 'assets/image/ui/ingamehud/tooltip/tooltip-key'

    // Homeship
    static HOME_SHIP = 'assets/image/gamemap/homeship/homeship_bg'
    static HSM_BEAM_ME_UP = 'assets/image/gamemap/homeship/modules/beammeup'
}
