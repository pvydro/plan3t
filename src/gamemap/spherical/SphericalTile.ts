import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Container } from '../../engine/display/Container'
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

export class SphericalTile extends Container implements ISphericalTile {
    tileSprite: Sprite

    constructor() {
        super()

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.TILE_TEST))
        this.tileSprite = new Sprite({ texture })

        this.addChild(this.tileSprite)
    }

    demolish() {
        this.tileSprite.destroy()
        this.destroy()
    }
}
