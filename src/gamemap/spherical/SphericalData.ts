import { Dimension } from '../../engine/math/Dimension'
import { Flogger } from '../../service/Flogger'
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

            point.leftPoint = this.getPointAt(point.x - 1, point.y)
            point.rightPoint = this.getPointAt(point.x + 1, point.y)
            point.bottomPoint = this.getPointAt(point.x, point.y + 1)
            point.topPoint = this.getPointAt(point.x, point.y - 1)
        }
    }

    getPointAt(x: number, y: number): SphericalPoint | undefined {
        return this.points.find((point) => (point.x == x && point.y == y))
    }
}
