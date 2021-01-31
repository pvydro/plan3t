import { NumberUtils } from '../../../utils/NumberUtils'
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

    constructor(options: SphericalTileDarkenerOptions) {
        this.tile = options.tile
    }

    applyTint() {
        const darkness = this.darknessDepth
        let calculatedTint = (darkness * 0xcfcfcf)// 0.2

        if (darkness == 0) {
            calculatedTint = 0xffffff
        }

        this.tile.tint = calculatedTint
    }

    calculateDepthBasedOnSurroundings() {
        const maximumDepth = 4
        const currentDarkness = 0
        const depthTriggerBreakpoint = 2

        for (var x = maximumDepth; x--; x > 0) {

        }        
    }
}
