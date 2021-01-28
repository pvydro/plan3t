import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Camera } from '../../../camera/Camera'
import { IUpdatable } from '../../../interface/IUpdatable'
import { WindowSize } from '../../../utils/Constants'
import { Darkener } from './Darkener'
import { Light } from './Light'

export interface IGameplayAmbientLight extends IUpdatable {

}

export class GameplayAmbientLight extends Container implements IGameplayAmbientLight {
    overlayDarkener: Darkener
    overlayVignetteLight: Light

    constructor() {
        super()

        this.overlayDarkener = new Darkener({
            width: WindowSize.width,
            height: WindowSize.height,
            alpha: 1//0.8
        })
        // this.overlayVignetteLight = new Light({
        //     texture: PIXI.Texture.from(Assets.get(AssetUrls.LIGHT_VIGNETTE_BORDER))
        // })
        // this.overlayVignetteLight.width = WindowSize.width
        // this.overlayVignetteLight.height = WindowSize.height
        // this.overlayVignetteLight.alpha = 0.3

        this.addChild(this.overlayDarkener)
        // this.addChild(this.overlayVignetteLight)
    }
    
    update() {
        this.overlayDarkener.position.set(Camera.Zero.x, Camera.Zero.y)
        // this.overlayVignetteLight.position.set(Camera.Zero.x, Camera.Zero.y)
    }
}
