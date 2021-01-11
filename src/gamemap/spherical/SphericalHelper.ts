import { Assets } from "../../asset/Assets";
import { Flogger } from "../../service/Flogger";
import { SphericalBiome, SphericalPoint } from "./SphericalData";

export interface ISphericalHelper {

}

export class SphericalHelper implements ISphericalHelper {

    private constructor() {}

    static isPointSolid(point: SphericalPoint): boolean {
        return (point.tileDepth > 0)
    }

    static getResourceForPoint(point: SphericalPoint, biome: SphericalBiome): string {
        let tileResource: string

        if (point.tileValue >= 0) {
            tileResource = Assets.TILE_DIR + biome + '/tile_0'
        }

        return tileResource
    }

    static getTextureForPoint(point: SphericalPoint, biome: SphericalBiome): PIXI.Texture {
        const textureResource = SphericalHelper.getResourceForPoint(point, biome)

        try {
            const texture = PIXI.Texture.from(Assets.get(textureResource))

            return texture
        } catch (error) {
            Flogger.error('SphericalHelper', 'Error getting texture for point', 'Error', error)
        }
    }

    static getTileSizeForBiome(biome?: SphericalBiome): number {
        let tileSize

        switch (biome) {
            case SphericalBiome.CloningFacility:
                tileSize = 16
                break
            default:
                tileSize = 16
        }

        return tileSize
    }
}
