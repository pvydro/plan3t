import { IUIComponent } from '../../UIComponent'
import { Fonts } from '../../../asset/Fonts'
import { UIText } from '../../UIText'
import { Defaults } from '../../../utils/Defaults'

export interface IRespawnHeader extends IUIComponent {
    
}

export class RespawnHeader extends UIText implements IRespawnHeader {
    _isShown: boolean

    constructor() {
        super({
            text: 'YOU DIED',
            style: {
                fontFamily: Fonts.Font.family,
                fontSize: 64,
            }
        })

        this.anchor.set(0, 0)
        this.reposition()
    }

    update() {
        
    }

    reposition() {
        this.position.set(Defaults.UIEdgePadding, Defaults.UIEdgePadding)
    }

    demolish() {
        this.destroy()
    }
}
