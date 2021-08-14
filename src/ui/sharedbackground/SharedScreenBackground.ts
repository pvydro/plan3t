import { CRTFilter, GodrayFilter, KawaseBlurFilter } from 'pixi-filters'
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
        super({
            filters: [
                // new CRTFilter({
                //     curvature: 5,
                //     noise: 0.01,
                //     lineWidth: 5,
                //     lineContrast: 0.025,
                //     vignetting: 0.25
                // }),
                // new GodrayFilter({
                //     angle: -45,
                //     alpha: 1.0,
                //     lacunarity: 2.0,
                //     center: new PIXI.Point(100, -100),
                //     parallel: true,
                //     time: 0,
                //     gain: 0.5
                // })
            ]
        })

        this.backgroundSprite = new Sprite({ texture: PIXI.Texture.from(Assets.get(AssetUrls.SharedBackground2)) })
        this.backgroundSprite.scale.set(3, 3)
        this.backgroundSprite.filters = [
            new KawaseBlurFilter(8.5, 6)
        ]

        this.addChild(this.backgroundSprite)
    }
}
