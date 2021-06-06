import * as PIXI from 'pixi.js'
import { SphericalBiome } from '../gamemap/spherical/SphericalData'
import { SphericalTileHelper, SphericalTileValues } from '../gamemap/spherical/tile/SphericalTileHelper'
import { Flogger, importantLog } from '../service/Flogger'

export class Assets {
    private static _imagesStartedLoading: boolean = false
    private static _imagesFinishedLoading: boolean = false

    static BaseImageDir: string = 'assets/image'
    static TileDir = Assets.BaseImageDir + '/gamemap/tiles/'
    static MapBuildingDir = Assets.BaseImageDir + '/gamemap/mapbuilding/'

    private constructor() {

    }

    static async loadImages() {
        Flogger.log('Assets', 'loadImages')

        await Assets.loadAllTileImages()
        
        return new Promise((resolve, reject) => {
            if (Assets._imagesStartedLoading) {
                return
            }
            Assets._imagesStartedLoading = true

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
            if (Assets._imagesStartedLoading) {
                return
            }
            
            const biomeKeys = Object.values(SphericalBiome)
            // const mapBuildingKeys = Object.values(MapBuildingType) // TODO: This is breaking for some reason
            const mapBuildingKeys = [ 'dojo', 'castle' ]// MapBuildingHelper.getAllMapTypesInProperties() // TODO This needs to be dynamic & linked to {@link MapBuildingHelper}
            const tileValues = Object.values(SphericalTileValues)
            const tileAssets = []
            const totalFoliage = 10
            const totalTrees = 2

            biomeKeys.forEach((biome: SphericalBiome) => {
                const biomeDir = Assets.TileDir + biome

                tileValues.forEach((value) => {
                    const tileUrl = SphericalTileHelper.getTilesheetFromColorData(value, biome)

                    tileAssets.push(Assets.get(tileUrl))
                })

                for (let i = 0; i < totalFoliage; i++) {
                    const foliageDir = biomeDir + `/foliage${i}`

                    try {
                        tileAssets.push(Assets.get(foliageDir))
                    } catch (error) {
                        Flogger.warn(`No foliage for ${biome}${i}`)
                    }
                }

                for (let i = 0; i < totalTrees; i++) {
                    const treeDir = biomeDir + `/tree${i}`

                    try {
                        tileAssets.push(Assets.get(treeDir))
                    } catch (error) {
                        Flogger.warn(`No tree for ${biome}${i}`)
                    }

                }
            })

            mapBuildingKeys.forEach((mapBuilding: string) => {
                const buildingDir = Assets.MapBuildingDir + mapBuilding
                const platformDir = `${buildingDir}/platform`
                // const totalBackgroundSprites = MapBuildingHelper.getTotalBackgroundTilesForType(mapBuilding)

                for (let i = 0; i < 5; i++) {//totalBackgroundSprites; i++) {
                    const tileDir = `${buildingDir}/background/${i}`

                    importantLog('Assets', 'Loading backgroundtile', 'tileDir', tileDir)

                    try {
                        tileAssets.push(Assets.get(tileDir))
                    } catch (error) {
                        Flogger.warn(`No background tile for ${mapBuilding}`)
                    }
                }

                tileAssets.push(Assets.get(platformDir))
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
    private constructor() {

    }

    static PlayerIdle = 'assets/image/player/body/body-idle'
    static PlayerHeadHumanDefault = 'assets/image/player/head/head-default'
    static PlayerHandHumanDefault = 'assets/image/player/hand/hand-default'
    static PlayerHeadHumanAstro = 'assets/image/player/head/head-astro'

    // Enemy
    static EnemyFlyingEyeIdle = 'assets/image/enemy/flyingeye/flyingeye'
    static EnemySormIdle = 'assets/image/enemy/sorm/idle'
    static EnemyNenjIdle = 'assets/image/enemy/nenj/idle'

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
    static KillSkullParticle = 'assets/image/particles/killskull/killskull'

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
    static LightHardLg = 'assets/image/lights/lighthardlg'
    static LightVignetteBorder = 'assets/image/lights/vignetteborder'

    // Passive Creatures
    static PassiveCreatureHornet = 'assets/image/creature/swamphornet/swamphornet'
    static PassiveCreatureKoini = 'assets/image/creature/koini/koini_idle'

    // InGameHUD
    static HealthBarBg = 'assets/image/ui/ingamehud/healthbarbg'
    static HealthBarFill = 'assets/image/ui/ingamehud/healthbarfill'
    static AMMO_STATUS_BG = 'assets/image/ui/ingamehud/ammostatusbg'
    static OverheadHealthBarBg = 'assets/image/ui/ingamehud/overheadhealthbar'
    static OverheadHealthBarFill = 'assets/image/ui/ingamehud/overheadhealthbarfill'
    static HotbarBg = 'assets/image/ui/ingamehud/hotbar/hotbarbg'
    static PauseButton = 'assets/image/ui/ingamehud/pausebutton'

    // UI
    static ButtonRectDefault = 'assets/image/ui/generic/buttons/midbutton'
    static ButtonRectDefaultHovered = 'assets/image/ui/generic/buttons/midbuttonhovered'
    static ButtonMetalMd = 'assets/image/ui/generic/midbuttonmetal'
    static ButtonHoloLg = 'assets/image/ui/generic/holobuttonbg'
    static InGameInventoryTop = 'assets/image/ui/ingameinventory/container-top'
    static TooltipKey = 'assets/image/ui/ingamehud/tooltip/tooltip-key'
    static SharedBackground1 = 'assets/image/ui/sharedbackground/1' 

    // Homeship
    static Homeship = 'assets/image/gamemap/homeship/homeship_bg'
    static HomeshipModuleBeamMeUp = 'assets/image/gamemap/homeship/modules/beammeup'
}
