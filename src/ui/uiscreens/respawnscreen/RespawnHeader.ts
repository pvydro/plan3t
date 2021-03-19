import { IUIComponent } from '../../UIComponent'
import { Fonts } from '../../../asset/Fonts'
import { UIConstants } from '../../../utils/Constants'
import { UIText } from '../../UIText'

export interface IRespawnHeader extends IUIComponent {
    
}

export class RespawnHeader extends UIText implements IRespawnHeader {
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

    update() {
        
    }

    reposition(addListener?: boolean) {
        this.position.set(UIConstants.HUDPadding, UIConstants.HUDPadding)
    }

    demolish() {
        this.destroy()
    }
}
