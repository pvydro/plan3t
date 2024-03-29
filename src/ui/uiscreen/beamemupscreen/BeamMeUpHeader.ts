import { UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'

export interface IBeamMeUpHeader extends IUIComponent {

}

export class BeamMeUpHeader extends UIComponent implements IBeamMeUpHeader {
    currentPlanetIntroHeader: UIText
    currentPlanetText: UIText

    constructor() {
        super({
            borderOptions: {
                color: 0xFFFFFF,
                height: 96
            }
        })

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

        this.reposition()
    }

    forceHide() {
        this.alpha = 0
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        const topHeaderHeight = this.currentPlanetIntroHeader.textHeight
        const bottomHeaderMargin = UIDefaults.UIMargin
        const leftMargin = UIDefaults.UIEdgePadding
        const marginedElements = [
            this.currentPlanetIntroHeader,
            this.currentPlanetText,
        ]

        for (var i in marginedElements) {
            const marginTo = marginedElements[i]

            marginTo.x = leftMargin
        }

        this.currentPlanetText.position.y = topHeaderHeight + bottomHeaderMargin
        this.position.set(UIDefaults.UIEdgePadding, UIDefaults.UIEdgePadding)
    }
}
