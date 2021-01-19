import { Assets } from '../../asset/Assets'
import { Flogger } from '../../service/Flogger'
import { SphericalBiome, SphericalPoint } from './SphericalData'
import { SphericalTileColorData } from './SphericalTile'
import { SphericalTileHelper } from './SphericalTileHelper'
export interface ISphericalHelper {

}

export class SphericalHelper implements ISphericalHelper {

    private constructor() {}

    static isPointSolid(point: SphericalPoint): boolean {
        return (point.tileDepth > 0)
    }

    static getTextureForPoint(point: SphericalPoint, biome: SphericalBiome): PIXI.Texture {
        const tileData: SphericalTileColorData = SphericalTileHelper.matchColorDataToTileValue(point.tileValue)
        const tileUrl: string = SphericalTileHelper.getResourceForTileColorData(tileData, biome)

        try {
            const texture = PIXI.Texture.from(Assets.get(tileUrl))

            return texture
        } catch (error) {
            Flogger.error('SphericalHelper', 'Error getting texture for point', 'Error', error)
        }
    }

    static getTileSizeForBiome(biome?: SphericalBiome): number {
        let tileSize = 16

        switch (biome) {
            default:
                tileSize = 16
        }

        return tileSize
    }
}
