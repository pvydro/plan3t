import { Container } from 'pixi.js'
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
            color: 0x000000,//0a0a0a,
            alpha: 1//0.8
        })

        // this.addChild(this.overlayDarkener)
    }
    
    update() {
        this.overlayDarkener.position.set(Camera.Zero.x, Camera.Zero.y)
    }
}
