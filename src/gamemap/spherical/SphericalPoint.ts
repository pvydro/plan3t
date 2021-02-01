import { SphericalTileColorData } from './tile/SphericalTile'

export interface ISphericalPoint {
    x: number
    y: number
    tileValue: SphericalTileColorData
    tileSolidity: number
    leftPoint?: SphericalPoint
    rightPoint?: SphericalPoint
    topPoint?: SphericalPoint
    bottomPoint?: SphericalPoint
    topLeftPoint?: SphericalPoint
    topRightPoint?: SphericalPoint
    bottomLeftPoint?: SphericalPoint
    bottomRightPoint?: SphericalPoint

    isEqualToPoint(point: ISphericalPoint | SphericalTileColorData): boolean
    isSolid(): boolean
}

export interface SphericalPointOptions {
    tileValue: SphericalTileColorData
    tileSolidity: number
    x: number
    y: number
}

export class SphericalPoint implements ISphericalPoint {
    x: number
    y: number
    tileValue: SphericalTileColorData
    tileSolidity: number
    leftPoint?: SphericalPoint
    rightPoint?: SphericalPoint
    topPoint?: SphericalPoint
    bottomPoint?: SphericalPoint
    topLeftPoint?: SphericalPoint
    topRightPoint?: SphericalPoint
    bottomLeftPoint?: SphericalPoint
    bottomRightPoint?: SphericalPoint

    constructor(options: SphericalPointOptions) {
        this.tileValue = options.tileValue
        this.tileSolidity = options.tileSolidity
        this.x = options.x
        this.y = options.y
    }

    isEqualToPoint(point: ISphericalPoint | SphericalTileColorData) {
        if (point === undefined) { return false }

        const tileValue = (point instanceof SphericalPoint)
            ? (point as ISphericalPoint).tileValue
            : point as SphericalTileColorData
        const comparedTileValue = this.tileValue

        return (tileValue.r === comparedTileValue.r
            && tileValue.g === comparedTileValue.g
            && tileValue.b === comparedTileValue.b)
    }

    isSolid() {
        return (this.tileValue.a === 255)
    }
}
