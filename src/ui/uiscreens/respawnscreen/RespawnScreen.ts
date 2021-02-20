import * as PIXI from 'pixi.js'
import { Darkener } from '../../../engine/display/lighting/Darkener'
import { UIScreen } from '../UIScreen'
import { RespawnHeader } from './RespawnHeader'

export interface IRespawnScreen {

}

export class RespawnScreen extends UIScreen implements IRespawnScreen {
    darkener: Darkener
    respawnHeader: RespawnHeader

    constructor() {
        super({

        })

        this.darkener = new Darkener({
            blendMode: PIXI.BLEND_MODES.NORMAL,
            alpha: 0.9
        })

        this.respawnHeader = new RespawnHeader()
        
        this.addChild(this.darkener)
        this.addChild(this.respawnHeader)
    }

    intro(): Promise<void> {
        return new Promise((resolve) => {
            this.darkener.alpha = 0.9

            resolve()
        })
    }

    outro(): Promise<void> {
        return new Promise((resolve) => {
            this.darkener.alpha = 0

            resolve()
        })
    }

    forceHide() {
        this.respawnHeader.forceHide()
        this.darkener.forceHide()
    }
}
