import * as PIXI from 'pixi.js'
import { AssetUrls } from '../../../asset/Assets'
import { Darkener } from '../../../engine/display/lighting/Darkener'
import { UIConstants, WindowSize } from '../../../utils/Constants'
import { UIButton, UIButtonType } from '../../uibutton/UIButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { RespawnButton } from './RespawnButton'
import { RespawnHeader } from './RespawnHeader'
import { IRespawnScreenAnimator, RespawnScreenAnimator } from './RespawnScreenAnimator'

export interface IRespawnScreen extends IUIScreen {

}

export class RespawnScreen extends UIScreen implements IRespawnScreen {
    darkener: Darkener
    respawnHeader: RespawnHeader
    respawnButton: UIButton
    animator: IRespawnScreenAnimator

    constructor() {
        super({})

        this.animator = new RespawnScreenAnimator({ screen: this })
        this.darkener = new Darkener({ blendMode: PIXI.BLEND_MODES.NORMAL, alpha: 0.9 })
        this.respawnHeader = new RespawnHeader()
        this.respawnButton = new RespawnButton()
        
        this.addChild(this.darkener)
        this.addChild(this.respawnHeader)
        this.addChild(this.respawnButton)
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
        this.animator.forceHide()
    }
}
