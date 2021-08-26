import { CRTFilter, GodrayFilter, KawaseBlurFilter } from 'pixi-filters'
import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Camera } from '../../camera/Camera'
import { PassiveHornet } from '../../creature/passivehornet/PassiveHornet'
import { Sprite } from '../../engine/display/Sprite'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { GameWindow } from '../../utils/Constants'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface ISharedScreenBackground extends IUIComponent {

}

export class SharedScreenBackground extends UIComponent implements ISharedScreenBackground {
    private static Instance: SharedScreenBackground
    backgroundSprite: Sprite
    backgroundOriginalPos: IVector2
    hornet: PassiveHornet

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
                new KawaseBlurFilter(8.5, 6),
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
        
        this.hornet = new PassiveHornet()
        this.backgroundSprite = new Sprite({ texture: PIXI.Texture.from(Assets.get(AssetUrls.SharedBackground2)) })

        this.hornet.scale.set(3, 3)
        this.backgroundSprite.scale.set(3.2, 3.2)
        this.backgroundOriginalPos = new Vector2(0, this.backgroundSprite.y - (this.backgroundSprite.height * 0.1))
        this.backgroundSprite.position.set(this.backgroundOriginalPos.x, this.backgroundOriginalPos.y)

        this.addChild(this.backgroundSprite)
        this.addChild(this.hornet)
    }

    update() {
        this.hornet.update()
        this.followMouse()
    }

    followMouse() {
        const mousePos = Camera.Mouse
        const center = new Vector2(GameWindow.fullWindowWidth / 2, GameWindow.fullWindowHeight / 2)
        const scaleDivisor = 3
        const distanceFromCenter = new Vector2(mousePos.x - center.x / scaleDivisor, mousePos.y - center.y / scaleDivisor)

        const translateX = distanceFromCenter.x / 2
        const translateY = distanceFromCenter.y / 2

        this.backgroundSprite.x += (translateX - this.backgroundSprite.x) / 25
        this.backgroundSprite.y += (translateY - this.backgroundSprite.y) / 25

        this.backgroundSprite.x += (this.backgroundOriginalPos.x - this.backgroundSprite.x) / 15
        this.backgroundSprite.y += (this.backgroundOriginalPos.y - this.backgroundSprite.y) / 15
    }
}
