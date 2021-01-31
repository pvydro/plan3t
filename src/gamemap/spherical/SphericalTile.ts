import * as PIXI from 'pixi.js'
import { Sprite } from '../../engine/display/Sprite'
import { IDemolishable } from '../../interface/IDemolishable'
import { SphericalTileFoliage } from './decoration/SphericalTileFoliage'
import { SphericalBiome } from './SphericalData'

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
    biome: SphericalBiome
    canGrowFoliage?: boolean
}

export class SphericalTile extends Sprite implements ISphericalTile {
    decorations: any[] = []
    biome: SphericalBiome

    constructor(options: SphericalTileOptions) {
        super({ texture: options.texture })

        this.biome = options.biome

        if (options.canGrowFoliage) {
            this.applyRandomFoliage()
        }
    }

    demolish() {
        this.destroy()
    }

    applyRandomFoliage() {
        const shouldSpawnFoliage = (Math.random() > 0.4) // 60%

        if (shouldSpawnFoliage) {
            const foliage = new SphericalTileFoliage({ tile: this })
            foliage.anchor.y = 1

            this.decorations.push(foliage)

            this.addChild(foliage)
        }
    }
}
