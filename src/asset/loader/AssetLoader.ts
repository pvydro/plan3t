import * as PIXI from 'pixi.js'
import { SphericalBiome } from '../../gamemap/spherical/SphericalData'
import { SphericalTileHelper, SphericalTileValues } from '../../gamemap/spherical/tile/SphericalTileHelper'
import { Flogger, importantLog, log } from '../../service/Flogger'
import { Assets, AssetUrls } from '../Assets'

export interface IAssetLoader {

}

export class AssetLoader implements IAssetLoader {
    private static imagesStartedLoading: boolean = false
    private static imagesFinishedLoading: boolean = false
    private constructor() {}

    static async loadImages() {
        Flogger.log('Assets', 'loadImages')

        await this.loadAllDecorImages()
        await this.loadAllTileImages()
        
        return new Promise((resolve, reject) => {
            if (this.imagesStartedLoading || this.imagesFinishedLoading) {
                return
            }
            this.imagesStartedLoading = true

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

                    this.imagesFinishedLoading = true

                    resolve(true)
                })
            } catch (error) {
                Flogger.error('Failed to load images', 'error', error)
                
                reject(error)
            }
        })
    }

    private static async loadAllDecorImages() {
        log('AssetLoader', 'loadAllDecorImages')

        // return new Promise((resolve) => {
            const decorKeys = [
                // Temporary
                Assets.get('assets/image/gamemap/mapbuilding/dojo/decorations/solid_0'),
                Assets.get('assets/image/gamemap/mapbuilding/dojo/decorations/solid_1')
            ]

            PIXI.Loader.shared.add(decorKeys)//.load(() => {

        //     resolve(true)
        //     // })
        // })
    }

    private static async loadAllTileImages() {
        Flogger.log('AssetLoader', 'loadAllTileImages')

        return new Promise((resolve, reject) => {
            if (this.imagesStartedLoading) {
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

                this.imagesFinishedLoading = true

                resolve(true)
            })
        })
    }

}
