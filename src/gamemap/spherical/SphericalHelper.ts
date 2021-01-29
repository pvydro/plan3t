import { IVector2 } from '../../engine/math/Vector2'
import { SphericalBiome, SphericalPoint } from './SphericalData'

export interface ISphericalHelper {

}

export class SphericalHelper implements ISphericalHelper {

    private constructor() {}

    static isPointSolid(point: SphericalPoint): boolean {
        return (point.tileDepth > 0)
    }

    // static async getTextureForPoint(point: SphericalPoint, biome: SphericalBiome): Promise<PIXI.Texture> {
    //     try {
    //         const tileData: SphericalTileColorData = SphericalTileHelper.matchColorDataToTileValue(point.tileValue)
    //         const tilesheetUrl: string = SphericalTileHelper.getTilesheetFromColorData(tileData, biome)
    //         const tileCoords: IVector2 = SphericalTileHelper.getTilesheetCoordsFromPoint(point)
    //         const tileTexture: PIXI.Texture = await SphericalTileHelper.getTileTextureFromTilesheetCoords(tilesheetUrl, tileCoords)

    //         return tileTexture
    //     } catch (error) {
    //         Flogger.error('SphericalHelper', 'Error getting texture for point', 'Error', error)
    //     }
    // }

    static getTileSizeForBiome(biome?: SphericalBiome): number {
        return SphericalHelper.getTileSize()
        // let tileSize = 16

        // switch (biome) {
        //     default:
        //         tileSize = 16
        // }

        // return tileSize
    }

    static getTileSize(): number {
        return 16
    }
}
