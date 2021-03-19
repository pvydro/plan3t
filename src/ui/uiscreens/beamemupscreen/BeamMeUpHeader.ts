import { IUIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface IBeamMeUpHeader extends IUIComponent {

}

export class BeamMeUpHeader extends UIText implements IBeamMeUpHeader {
    constructor() {
        super({
            text: 'Current Planet',
        })
    }
}
