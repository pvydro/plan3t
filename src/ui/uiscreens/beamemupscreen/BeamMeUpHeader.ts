import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface IBeamMeUpHeader extends IUIComponent {

}

export class BeamMeUpHeader extends UIComponent implements IBeamMeUpHeader {
    currentPlanetIntroHeader: UIText
    currentPlanetText: UIText

    constructor() {
        super()

        this.currentPlanetIntroHeader = new UIText({
            text: 'Current Planet',
            uppercase: true
        })
        this.currentPlanetText = new UIText({
            text: 'Kepler',
            uppercase: true
        })

        this.addChild(this.currentPlanetIntroHeader)
        this.addChild(this.currentPlanetText)
    }

    forceHide() {
        this.alpha = 0
    }
}
