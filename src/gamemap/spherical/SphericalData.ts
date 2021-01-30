import { Dimension } from '../../engine/math/Dimension'
import { Flogger } from '../../service/Flogger'
import { SphericalHelper } from './SphericalHelper'
import { SphericalPoint } from './SphericalPoint'

export enum SphericalBiome {
    CloningFacility = 'cloningfacility',
    Kepler = 'kepler'
}

export interface ISphericalData {
    points: SphericalPoint[]
    biome: SphericalBiome
    dimension: Dimension
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
            const topLeftPoint = this.getPointAt(point.x - 1, point.y - 1)
            const topRightPoint = this.getPointAt(point.x + 1, point.y - 1)
            const bottomLeftPoint = this.getPointAt(point.x - 1, point.y + 1)
            const bottomRightPoint = this.getPointAt(point.x + 1, point.y + 1)

            point.leftPoint = SphericalHelper.isLeftPointSolid(point, this) ? leftPoint : undefined
            point.rightPoint = SphericalHelper.isRightPointSolid(point, this) ? rightPoint : undefined
            point.topPoint = SphericalHelper.isTopPointSolid(point, this) ? topPoint : undefined
            point.bottomPoint = SphericalHelper.isBottomPointSolid(point, this) ? bottomPoint : undefined
            point.topLeftPoint = SphericalHelper.isPointSolid(topLeftPoint) ? topLeftPoint : undefined
            point.topRightPoint = SphericalHelper.isPointSolid(topRightPoint) ? topRightPoint : undefined
            point.bottomLeftPoint = SphericalHelper.isPointSolid(bottomLeftPoint) ? bottomLeftPoint : undefined
            point.bottomRightPoint = SphericalHelper.isPointSolid(bottomRightPoint) ? bottomRightPoint : undefined
        }
    }

    getPointAt(x: number, y: number): SphericalPoint {
        return this.points.find((point) => (point.x == x && point.y == y))
    }
}
