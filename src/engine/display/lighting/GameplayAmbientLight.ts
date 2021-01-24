import { Container } from 'pixi.js'
import { Camera } from '../../../camera/Camera'
import { IUpdatable } from '../../../interface/IUpdatable'
import { WindowSize } from '../../../utils/Constants'
import { Darkener } from './Darkener'

export interface IGameplayAmbientLight extends IUpdatable {

}

export class GameplayAmbientLight extends Container implements IGameplayAmbientLight {
    overlayDarkener: Darkener

    constructor() {
        super()

        this.overlayDarkener = new Darkener({
            width: WindowSize.width,
            height: WindowSize.height,
            alpha: 0.8
        })

        this.addChild(this.overlayDarkener)
    }
    
    update() {
        this.overlayDarkener.position.set(Camera.Zero.x, Camera.Zero.y)
    }
}
