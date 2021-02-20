import * as PIXI from 'pixi.js'
import { AssetUrls } from '../../../asset/Assets'
import { Darkener } from '../../../engine/display/lighting/Darkener'
import { UIConstants, WindowSize } from '../../../utils/Constants'
import { UIButton, UIButtonType } from '../../uibutton/UIButton'
import { IUIScreen, UIScreen } from '../UIScreen'
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

        const padding = UIConstants.HUDPadding

        this.animator = new RespawnScreenAnimator({ screen: this })
        this.darkener = new Darkener({ blendMode: PIXI.BLEND_MODES.NORMAL, alpha: 0.9 })
        this.respawnHeader = new RespawnHeader()
        this.respawnButton = new UIButton({
            type: UIButtonType.Tap,
            anchor: { x: 1, y: 0 },
            background: {
                idle: AssetUrls.MID_BUTTON_METAL
            },
            onTrigger: () => {
                console.log('Respawn!')
            },
            onHover: () => {
                console.log('Hover...')
            },
            onMouseOut: () => {
                console.log('Mouse out!')
            },
            onRelease: () => {
                console.log('release.')
            }
        })
        this.respawnButton.x = WindowSize.width - padding
        this.respawnButton.y = 20
        
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
