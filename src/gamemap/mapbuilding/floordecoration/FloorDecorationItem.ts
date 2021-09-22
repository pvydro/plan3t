import { Assets } from '../../../asset/Assets'
import { Container, IContainer } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'

export interface IFloorDecorationItem extends IContainer {

}

export interface FloorDecorationItemOptions {
    itemID: string
}

export class FloorDecorationItem extends Container implements IFloorDecorationItem {
    sprite: Sprite

    constructor(options: FloorDecorationItemOptions) {
        super()

        const assetUrl = options.itemID // Temporary

        this.sprite = new Sprite({ texture: PIXI.Texture.from(Assets.get(assetUrl)) })
        this.sprite.anchor.set(0, 1)

        this.addChild(this.sprite)
    }
}
