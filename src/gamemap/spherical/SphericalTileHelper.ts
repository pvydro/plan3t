import { Assets, AssetUrls } from '../../asset/Assets'
import { ImageUtils } from '../../utils/ImageUtils'
import { IVector2 } from '../../engine/math/Vector2'
import { SphericalBiome, SphericalPoint } from './SphericalData'
import { SphericalTileColorData } from './SphericalTile'
import { Constants } from '../../utils/Constants'
import { SphericalHelper } from './SphericalHelper'
import { SphericalTileTextureCache } from './SphericalTileTextureCache'

export interface ISphericalTileHelper {

}

export class SphericalTileValues {
    public static CoreGrassTile: SphericalTileColorData = {
        r: 85, g: 163, b: 95, a: 1
    }
    public static CoreDirtTile: SphericalTileColorData = {
        r: 128, g: 85, b: 58, a: 1
    }
    public static CoreGroundTile: SphericalTileColorData = {
        r: 135, g: 135, b: 135, a: 1
    }
    public static CoreMantleTile: SphericalTileColorData = {
        r: 207, g: 106, b: 19, a: 1
    }
    public static CoreInfernoTile: SphericalTileColorData = {
        r: 227, g: 163, b: 0, a: 1
    }
}

export class SphericalTileHelper {


    private constructor() {}

    static matchColorDataToTileValue(colorData: { r: number, g: number, b: number }): SphericalTileColorData {
        const tileKeys = Object.values(SphericalTileValues)
        let chosenKey = SphericalTileValues.CoreGroundTile

        for (let i = 0; i < tileKeys.length - 1; i++) {
            const key = tileKeys[i]

            if (colorData.r == key.r
            && colorData.g == key.g
            && colorData.b == key.b) {
                chosenKey = key
            }
        }

        return chosenKey
    }

    static getTilesheetFromColorData(value: SphericalTileColorData, biome: SphericalBiome): string {
        const tileDir = Assets.TILE_DIR
        const biomeDir = tileDir + biome
        let dir = biomeDir + '/'

        switch (value) {
            case SphericalTileValues.CoreGrassTile:
                dir += 'grass'
                break
            case SphericalTileValues.CoreDirtTile:
                dir += 'dirt'
                break
            case SphericalTileValues.CoreGroundTile:
                dir += 'ground'
                break
            case SphericalTileValues.CoreMantleTile:
                dir += 'mantle'
                break
            case SphericalTileValues.CoreInfernoTile:
                dir += 'inferno'
                break
        }

        return dir
    }

    static getTilesheetCoordsFromPoint(point: SphericalPoint): IVector2 {
        let x = 1
        let y = 0

        if (point.rightPoint !== undefined
        && point.leftPoint !== undefined) {
            x = 1
        } else if (point.rightPoint !== undefined) {
            x = 0
        } else if (point.leftPoint !== undefined) {
            x = 2
        }

        if (point.topPoint !== undefined
        && point.bottomPoint !== undefined) {
            y = 1
        } else if (point.topPoint !== undefined) {
            y = 2
        } else if (point.bottomPoint !== undefined) {
            y = 0
        }

        return { x, y }
    }

    static async getTileTextureFromTilesheetCoords(tilesheetUrl: string, coords: IVector2): Promise<PIXI.Texture> {
        return new Promise((resolve, reject) => {
            SphericalTileTextureCache.getTile(tilesheetUrl, coords).then((tileURI: any) => {
                const tileTexture = PIXI.Texture.from(tileURI)
                resolve(tileTexture)
            })
        })
    }
}
