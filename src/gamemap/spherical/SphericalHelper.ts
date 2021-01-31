import { IVector2 } from '../../engine/math/Vector2'
import { SphericalBiome, SphericalData } from './SphericalData'
import { SphericalPoint } from './SphericalPoint'

export interface ISphericalHelper {

}

export class SphericalHelper implements ISphericalHelper {

    private constructor() {}

    static isPointSolid(point: SphericalPoint): boolean {
        return (point && point.tileSolidity > 0)
    }

    static isLeftPointSolid(point: SphericalPoint, data: SphericalData): boolean {
        return this.isAdjacentPointSolid(point, data, { x: -1, y: 0 })
    }

    static isRightPointSolid(point: SphericalPoint, data: SphericalData): boolean {
        return this.isAdjacentPointSolid(point, data, { x: 1, y: 0 })
    }

    static isTopPointSolid(point: SphericalPoint, data: SphericalData): boolean {
        return this.isAdjacentPointSolid(point, data, { x: 0, y: -1 })
    }

    static isBottomPointSolid(point: SphericalPoint, data: SphericalData): boolean {
        return this.isAdjacentPointSolid(point, data, { x: 0, y: 1 })
    }

    static isAdjacentPointSolid(point: SphericalPoint, data: SphericalData, offset: IVector2): boolean {
        let isSolid = false
        const adjacentPoint = data.getPointAt(point.x + offset.x, point.y + offset.y)

        if (this.isPointSolid(adjacentPoint)) {
            isSolid = true
        }

        return isSolid
    }

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
