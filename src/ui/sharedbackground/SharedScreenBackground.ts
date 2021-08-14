import { KawaseBlurFilter } from 'pixi-filters'
import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface ISharedScreenBackground extends IUIComponent {

}

export class SharedScreenBackground extends UIComponent implements ISharedScreenBackground {
    private static Instance: SharedScreenBackground
    backgroundSprite: Sprite

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new SharedScreenBackground()
        }

        return this.Instance
    }

    private constructor() {
        super()

        this.backgroundSprite = new Sprite({ texture: PIXI.Texture.from(Assets.get(AssetUrls.SharedBackground1)) })
        this.backgroundSprite.scale.set(3, 3)
        this.backgroundSprite.filters = [
            new KawaseBlurFilter(8.5, 6)
        ]

        this.addChild(this.backgroundSprite)
    }
}
