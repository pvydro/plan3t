import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Container } from '../Container'
import { Sprite } from '../Sprite'

export interface ILight {

}

export class Light extends Sprite implements ILight {
    constructor() {
        super({
            texture: PIXI.Texture.from(Assets.get(AssetUrls.LIGHT_PLAYER))
        })

        this.blendMode = PIXI.BLEND_MODES.ADD
    }
}
