import * as PIXI from 'pixi.js'
import { Sprite } from '../../../engine/display/Sprite'
import { IDemolishable } from '../../../interface/IDemolishable'
import { SphericalTileFoliage } from './decoration/SphericalTileFoliage'
import { SphericalBiome, SphericalData } from '../SphericalData'
import { ISphericalPoint, SphericalPoint } from '../SphericalPoint'
import { ISphericalTileDarkener, SphericalTileDarkener } from './SphericalTileDarkener'
import { DebugConstants } from '../../../utils/Constants'

export interface SphericalTileColorData {
    r: number
    g: number
    b: number
    a: number
}

export interface ISphericalTile extends IDemolishable {

}

export interface SphericalTileOptions {
    texture: PIXI.Texture
    point: ISphericalPoint
    data: SphericalData
    biome: SphericalBiome
    canGrowFoliage?: boolean
}

export class SphericalTile extends Sprite implements ISphericalTile {
    point: ISphericalPoint
    data: SphericalData
    decorations: any[] = []
    biome: SphericalBiome
    darkener: ISphericalTileDarkener

    constructor(options: SphericalTileOptions) {
        super({ texture: options.texture })

        this.point = options.point
        this.data = options.data
        this.biome = options.biome
        
        if (options.canGrowFoliage) {
            this.applyRandomFoliage()
        }

        if (!DebugConstants.DisableDepthShadows) {
            this.darkener = new SphericalTileDarkener({ tile: this })
            this.darkener.calculateDepthBasedOnSurroundings()
            this.darkener.applyTint()
        }
    }

    demolish() {
        this.destroy()
    }

    applyRandomFoliage() {
        const shouldSpawnFoliage = (Math.random() > 0.4) // 60%

        if (shouldSpawnFoliage) {
            const foliage = new SphericalTileFoliage({ tile: this })
            foliage.anchor.set(0, 1)

            this.decorations.push(foliage)

            this.addChild(foliage)
        }
    }
}
