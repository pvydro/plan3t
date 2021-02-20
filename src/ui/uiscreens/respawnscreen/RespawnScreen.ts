import * as PIXI from 'pixi.js'
import { Darkener } from '../../../engine/display/lighting/Darkener'
import { IUIScreen, UIScreen } from '../UIScreen'
import { RespawnHeader } from './RespawnHeader'
import { IRespawnScreenAnimator, RespawnScreenAnimator } from './RespawnScreenAnimator'

export interface IRespawnScreen extends IUIScreen {

}

export class RespawnScreen extends UIScreen implements IRespawnScreen {
    darkener: Darkener
    respawnHeader: RespawnHeader
    animator: IRespawnScreenAnimator

    constructor() {
        super({})

        this.animator = new RespawnScreenAnimator({ screen: this })
        this.darkener = new Darkener({ blendMode: PIXI.BLEND_MODES.NORMAL, alpha: 0.9 })
        this.respawnHeader = new RespawnHeader()
        
        this.addChild(this.darkener)
        this.addChild(this.respawnHeader)
    }

    async show() {
        super.show()
        
        return this.animator.show()
    }
    
    async hide() {
        super.hide()
        
        return this.animator.hide()
    }

    forceHide() {
        this.respawnHeader.forceHide()
        this.darkener.forceHide()
    }
}
