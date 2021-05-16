import { IUIButton, UIButton } from '../../uibutton/UIButton'
import { IUIScreen, UIScreen } from '../UIScreen'
import { RespawnButton } from './RespawnButton'
import { IRespawnHeader, RespawnHeader } from './RespawnHeader'
import { IRespawnScreenAnimator, RespawnScreenAnimator } from './RespawnScreenAnimator'

export interface IRespawnScreen extends IUIScreen {
    respawnHeader: IRespawnHeader
    respawnButton: IUIButton
}

export class RespawnScreen extends UIScreen implements IRespawnScreen {
    // darkener: Darkener
    respawnHeader: RespawnHeader
    respawnButton: UIButton
    animator: IRespawnScreenAnimator

    constructor() {
        super({
            filters: null
        })

        this.animator = new RespawnScreenAnimator({ screen: this })
        this.respawnHeader = new RespawnHeader()
        this.respawnButton = new RespawnButton()
        
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

    applyScale() {
        const toScale = [
            this.respawnHeader,
            this.respawnButton
        ]

        super.applyScale(toScale)
    }
}
