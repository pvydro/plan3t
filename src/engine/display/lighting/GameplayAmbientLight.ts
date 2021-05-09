import { Container } from 'pixi.js'
import { Camera } from '../../../camera/Camera'
import { IDemolishable } from '../../../interface/IDemolishable'
import { IUpdatable } from '../../../interface/IUpdatable'
import { GameWindow } from '../../../utils/Constants'
import { Darkener } from './Darkener'
import { Light } from './Light'

export interface IGameplayAmbientLight extends IUpdatable, IDemolishable {

}

export class GameplayAmbientLight extends Container implements IGameplayAmbientLight {
    overlayDarkener: Darkener
    overlayVignetteLight: Light

    constructor() {
        super()

        this.overlayDarkener = new Darkener({
            width: GameWindow.width,
            height: GameWindow.height,
            color: 0x000000,//0a0a0a,
            alpha: 1//0.8
        })

        this.addChild(this.overlayDarkener) // TODO: This is our suspect for black bg over map
    }
    
    update() {
        this.overlayDarkener.position.set(Camera.Zero.x, Camera.Zero.y)
    }

    demolish() {
        this.overlayDarkener.demolish()
        this.removeChild(this.overlayDarkener)
    }
}
