import { IUIComponent } from '../../UIComponent'
import { TextSprite } from '../../../engine/display/TextSprite'
import { Fonts } from '../../../asset/Fonts'
import { UIConstants } from '../../../utils/Constants'

export interface IRespawnHeader extends IUIComponent {
    
}

export class RespawnHeader extends TextSprite implements IRespawnHeader {
    constructor() {
        super({
            text: 'YOU DIED',
            fontFamily: Fonts.Font.family,
            fontSize: 32,
        })

        this.anchor.set(0, 0)
        this.position.set(UIConstants.HUDPadding, UIConstants.HUDPadding)
    }

    forceHide() {
        this.alpha = 0
    }

    async show() {

    }
    
    async hide() {
        
    }
}
