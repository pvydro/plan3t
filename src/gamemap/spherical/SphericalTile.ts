import * as PIXI from 'pixi.js'
import { Sprite } from '../../engine/display/Sprite'
import { IDemolishable } from '../../interface/IDemolishable'

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
}

export class SphericalTile extends Sprite implements ISphericalTile {
    // tileSprite: Sprite

    constructor(options: SphericalTileOptions) {
        super({ texture: options.texture })

        // this.addChild(this.tileSprite)
    }

    demolish() {
        // this.tileSprite.destroy()
        this.destroy()
    }
}
