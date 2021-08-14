import { Graphix } from '../../engine/display/Graphix'
import { UIDefaults } from '../../utils/Defaults'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface IChatHistoryBox extends IUIComponent {

}

export class ChatHistoryBox extends UIComponent implements IChatHistoryBox {
    backgroundGraphic: Graphix

    constructor() {
        super()

        const dimensions = UIDefaults.ChatboxDimensions

        this.backgroundGraphic = new Graphix()
        this.backgroundGraphic.beginFill(0x000000)
        this.backgroundGraphic.drawRect(0, 0, dimensions.width, dimensions.height)
        this.backgroundGraphic.endFill()
        this.backgroundGraphic.alpha = 0.25

        this.addChild(this.backgroundGraphic)
    }
}
