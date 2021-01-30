import { Dimension } from '../../engine/math/Dimension'
import { Flogger } from '../../service/Flogger'
import { SphericalHelper } from './SphericalHelper'
export enum SphericalBiome {
    CloningFacility = 'cloningfacility',
    Kepler = 'kepler'
}

export interface ISphericalData {
    points: SphericalPoint[]
    biome: SphericalBiome
    dimension: Dimension
}

export interface SphericalPoint {
    x: number
    y: number
    tileValue: { r: number, g: number, b: number }
    tileDepth: number
    leftPoint?: SphericalPoint
    rightPoint?: SphericalPoint
    topPoint?: SphericalPoint
    bottomPoint?: SphericalPoint
}

export class SphericalData implements ISphericalData {
    points: SphericalPoint[]
    biome: SphericalBiome
    dimension: Dimension

    constructor(data: ISphericalData) {
        this.points = data.points
        this.biome = data.biome
        this.dimension = data.dimension

        this.parseAdjacentPoints()
    }

    private parseAdjacentPoints() {
        Flogger.log('SphericalData', 'parseAdjacentPoints')

        for (var i = 0; i < this.points.length; i++) {
            const point = this.points[i]

            const leftPoint = this.getPointAt(point.x - 1, point.y)
            const rightPoint = this.getPointAt(point.x + 1, point.y)
            const topPoint = this.getPointAt(point.x, point.y - 1)
            const bottomPoint = this.getPointAt(point.x, point.y + 1)

            point.leftPoint = SphericalHelper.isPointSolid(leftPoint) ? leftPoint : undefined
            point.rightPoint = SphericalHelper.isPointSolid(rightPoint) ? rightPoint : undefined
            point.topPoint = SphericalHelper.isPointSolid(topPoint) ? topPoint : undefined
            point.bottomPoint = SphericalHelper.isPointSolid(bottomPoint) ? bottomPoint : undefined
        }
    }

    getPointAt(x: number, y: number): SphericalPoint {
        return this.points.find((point) => (point.x == x && point.y == y))
    }
}
