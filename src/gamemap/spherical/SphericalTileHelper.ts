import { Assets } from '../../asset/Assets'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { SphericalBiome } from './SphericalData'
import { SphericalTileColorData } from './SphericalTile'
import { SphericalTileTextureCache } from './SphericalTileTextureCache'
import { Flogger } from '../../service/Flogger'
import { SphericalPoint } from './SphericalPoint'
import { SphericalTileCoordinator } from './SphericalTileCoordinator'
import { Spherical } from './Spherical'

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

    static matchColorDataToTileValue(colorData: SphericalTileColorData): SphericalTileColorData {
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
        let coords: IVector2 = Vector2.Zero

        coords = SphericalTileCoordinator.checkLeftAndRight(point, coords)
        coords = SphericalTileCoordinator.checkTopAndBottom(point, coords)
        coords = SphericalTileCoordinator.checkTopCorners(point, coords)
        coords = SphericalTileCoordinator.checkBottomCorners(point, coords)

        return coords
    }

    static async getTileTextureFromTilesheetCoords(tilesheetUrl: string, coords: IVector2): Promise<PIXI.Texture> {
        return new Promise((resolve, reject) => {
            SphericalTileTextureCache.getTile(tilesheetUrl, coords).then((tileURI: any) => {
                const tileTexture = PIXI.Texture.from(tileURI)
                resolve(tileTexture)
            }).catch((e) => {
                Flogger.error('SphericalTileHelper', 'Error getting tile', 'tilesheetUrl', tilesheetUrl, 'coords', coords)

                reject(e)
            })
        })
    }

    static canPointGrowFoliage(point: SphericalPoint): boolean {
        const isGrass: boolean = point.isEqualToPoint(SphericalTileValues.CoreGrassTile)//(point.tileValue == SphericalTileValues.CoreGrassTile)
        const hasAir: boolean = (point.topPoint === undefined || point.topPoint.tileDepth < 1)
        let canGrow = false

        if (isGrass && hasAir) {
            canGrow = true
        }

        return canGrow
    }
}
