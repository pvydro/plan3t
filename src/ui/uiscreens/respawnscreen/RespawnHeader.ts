import { IUIComponent } from '../../UIComponent'
import { Fonts } from '../../../asset/Fonts'
import { UIText } from '../../UIText'
import { UIDefaults } from '../../../utils/Defaults'

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
        this.position.set(UIDefaults.UIEdgePadding, UIDefaults.UIEdgePadding)
    }

    demolish() {
        this.destroy()
    }
}
