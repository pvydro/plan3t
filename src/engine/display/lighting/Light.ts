import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Sprite } from '../Sprite'

export interface ILight {

}

export interface LightOptions {
    texture?: any
}

export class Light extends Sprite implements ILight {
    constructor(options?: LightOptions) {
        const texture = (options && options.texture) ? options.texture : PIXI.Texture.from(Assets.get(AssetUrls.LIGHT_HARD_LG))
        super({ texture })

        this.blendMode = PIXI.BLEND_MODES.ADD//ADD
    }
}
