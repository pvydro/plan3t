import { Dimension } from '../../engine/math/Dimension'
import { Flogger } from '../../service/Flogger'
import { SphericalHelper } from './SphericalHelper'
import { ISphericalPoint, SphericalPoint } from './SphericalPoint'

export enum SphericalBiome {
    CloningFacility = 'cloningfacility',
    Kepler = 'kepler'
}

export interface ISphericalData {
    points: ISphericalPoint[]
    biome: SphericalBiome
    dimension: Dimension
}

export interface PlainSphericalData {
    points: { r: number, g: number, b: number, a: number }[],
    biome: string,
    dimension: { width: number, height: number }
}

export class SphericalData implements ISphericalData {
    points: ISphericalPoint[]
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

            const leftPoint = this.getPointAt(point.x - 1, point.y) as SphericalPoint
            const rightPoint = this.getPointAt(point.x + 1, point.y) as SphericalPoint
            const topPoint = this.getPointAt(point.x, point.y - 1) as SphericalPoint
            const bottomPoint = this.getPointAt(point.x, point.y + 1) as SphericalPoint
            const topLeftPoint = this.getPointAt(point.x - 1, point.y - 1) as SphericalPoint
            const topRightPoint = this.getPointAt(point.x + 1, point.y - 1) as SphericalPoint
            const bottomLeftPoint = this.getPointAt(point.x - 1, point.y + 1) as SphericalPoint
            const bottomRightPoint = this.getPointAt(point.x + 1, point.y + 1) as SphericalPoint

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

    getPointAt(x: number, y: number): ISphericalPoint {
        let foundPoint = undefined

        for (var i in this.points) {
            const point = this.points[i]

            const isMatch = (point.x == x && point.y == y)

            if (isMatch) {
                foundPoint = point
            }
        }

        return foundPoint
    }

    toPlainFormat(): PlainSphericalData {
        const plainPoints = []

        for (var i in this.points) {
            const point = this.points[i]

            const plainPoint = {
                x: point.x,
                y: point.y,
                tileSolidity: point.tileSolidity,
                tileValue: {
                    r: point.tileValue.r,
                    g: point.tileValue.g,
                    b: point.tileValue.b,
                    a: point.tileValue.a
                },
            }
            
            plainPoints.push(plainPoint)
        }

        return {
            points: plainPoints,
            biome: this.biome.toString(),
            dimension: {
                width: this.dimension.width,
                height: this.dimension.height
            }
        }
    }
}
