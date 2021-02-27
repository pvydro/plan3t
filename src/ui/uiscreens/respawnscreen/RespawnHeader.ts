import { IUIComponent } from '../../UIComponent'
import { TextSprite } from '../../../engine/display/TextSprite'
import { Fonts } from '../../../asset/Fonts'
import { UIConstants } from '../../../utils/Constants'

export interface IRespawnHeader extends IUIComponent {
    
}

export class RespawnHeader extends TextSprite implements IRespawnHeader {
    _isShown: boolean

    constructor() {
        super({
            text: 'YOU DIED',
            fontFamily: Fonts.Font.family,
            fontSize: 64,
        })

        this.anchor.set(0, 0)
        this.reposition(true)
    }

    reposition(addListener?: boolean) {
        this.position.set(UIConstants.HUDPadding, UIConstants.HUDPadding)
    }

    forceHide() {
        this.alpha = 0
    }

    async show() {
        this._isShown = true
    }
    
    async hide() {
        this._isShown = false
    }

    get isShown() {
        return this._isShown
    }

    demolish() {
        this.destroy()
    }
}
