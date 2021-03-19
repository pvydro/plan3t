import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface IBeamMeUpHeader extends IUIComponent {

}

export class BeamMeUpHeader extends UIComponent implements IBeamMeUpHeader {
    currentPlanetheader: UIText

    constructor() {
        super()

        this.currentPlanetheader = new UIText({
            text: 'Current Planet',
            uppercase: true
        })

        this.addChild(this.currentPlanetheader)

    }
}
