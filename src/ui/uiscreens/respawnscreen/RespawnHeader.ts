import { IUIComponent, UIComponent } from '../../UIComponent'
import { Fonts } from '../../../asset/Fonts'
import { UIText } from '../../UIText'
import { UIDefaults } from '../../../utils/Defaults'
import { TextStyles } from '../../../engine/display/TextStyles'

export interface IRespawnHeader extends IUIComponent {
    
}

export class RespawnHeader extends UIComponent implements IRespawnHeader {
    _isShown: boolean

    constructor() {
        super()

        const text = new UIText({
            text: 'You died',
            style: TextStyles.Menu.HeaderBig,
            anchor: 0
        })
        
        this.addChild(text)
        this.reposition()
    }

    update() {
        
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
        
        this.position.set(UIDefaults.UIEdgePadding, UIDefaults.UIEdgePadding)
    }

    demolish() {
        this.destroy()
    }
}
