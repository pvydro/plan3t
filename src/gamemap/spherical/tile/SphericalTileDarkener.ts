import { ColorUtils } from '../../../utils/ColorUtils'
import { NumberUtils } from '../../../utils/NumberUtils'
import { SphericalHelper } from '../SphericalHelper'
import { SphericalPoint } from '../SphericalPoint'
import { SphericalTile } from './SphericalTile'

export interface ISphericalTileDarkener {
    applyTint(): void
    calculateDepthBasedOnSurroundings(): void
}

export interface SphericalTileDarkenerOptions {
    tile: SphericalTile
    darkness?: number
}

export class SphericalTileDarkener implements ISphericalTileDarkener {
    tile: SphericalTile
    darknessDepth: number = 0
    darknessTints: number[] = [
        0xededed, 
        // 0xdbdbdb,
        0xbababa,
        // 0xadadad,
        0x969696,
        0x858585,
        0x666666,
        // 0x333333,
        // 0x000000,
        // 0x2b2b2b
        // 0xe6e6e6, 
        // 0xdedede, 
        // 0xd6d6d6
    ]

    constructor(options: SphericalTileDarkenerOptions) {
        this.tile = options.tile
    }

    applyTint() {
        const darkness = this.darknessDepth
        let calculatedTint = this.darknessTints[darkness] ?? this.darknessTints[this.darknessTints.length]
         //(darkness * 0xcfcfcf)// 0.2

        if (darkness === 0) {
            calculatedTint = 0xFFFFFF
        }
        
        this.tile.tint = calculatedTint
    }

    async calculateDepthBasedOnSurroundings() {
        const data = this.tile.data
        const pointPos = { x: this.tile.point.x, y: this.tile.point.y }
        const maximumDepth = this.darknessTints.length - 1
        const depthBreakpoint = 0//1
        let currentDepth = 0

        for (let i = maximumDepth; i > 0; i--) {
            const newI = i + depthBreakpoint

            const topRightPoint = data.getPointAt(pointPos.x + newI, pointPos.y - newI) as SphericalPoint
            const topLeftPoint = data.getPointAt(pointPos.x - newI, pointPos.y - newI) as SphericalPoint
            const bottomRightPoint = data.getPointAt(pointPos.x + newI, pointPos.y + newI) as SphericalPoint
            const bottomLeftPoint = data.getPointAt(pointPos.x - newI, pointPos.y + newI) as SphericalPoint
            const leftPoint = data.getPointAt(pointPos.x - newI, pointPos.y) as SphericalPoint
            const rightPoint = data.getPointAt(pointPos.x + newI, pointPos.y) as SphericalPoint

            const solidOnTopRight = (topRightPoint !== undefined) && topRightPoint.isSolid()
            const solidOnTopLeft = (topLeftPoint !== undefined) && topLeftPoint.isSolid()
            const solidOnBottomRight = (bottomRightPoint !== undefined) && bottomRightPoint.isSolid()
            const solidOnBottomLeft = (bottomLeftPoint !== undefined) && bottomLeftPoint.isSolid()
            const solidOnLeft = (leftPoint !== undefined) && leftPoint.isSolid()
            const solidOnRight = (rightPoint !== undefined) && rightPoint.isSolid()

            if (solidOnTopRight && solidOnTopLeft
            && solidOnBottomRight && solidOnBottomLeft
            && solidOnRight && solidOnLeft) {
                currentDepth++
            }
        }

        if (currentDepth > maximumDepth) {
            currentDepth = maximumDepth
        }

        this.darknessDepth = currentDepth
    }
}
