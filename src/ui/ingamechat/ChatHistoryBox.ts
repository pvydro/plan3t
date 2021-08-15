import { Graphix } from '../../engine/display/Graphix'
import { DebugConstants } from '../../utils/Constants'
import { UIDefaults } from '../../utils/Defaults'
import { IUIComponent, UIComponent } from '../UIComponent'
import { ChatHistoryText } from './ChatHistoryText'

export interface IChatHistoryBox extends IUIComponent {

}

export class ChatHistoryBox extends UIComponent implements IChatHistoryBox {
    backgroundGraphic: Graphix
    chatText: ChatHistoryText

    constructor() {
        super()

        this.backgroundGraphic = this.constructBackground()
        this.chatText = new ChatHistoryText()

        this.addChild(this.chatText)
        this.addChild(this.backgroundGraphic)
    }

    constructBackground() {
        const dimensions = UIDefaults.ChatboxDimensions
        const backgroundGraphic = new Graphix()

        backgroundGraphic.beginFill(DebugConstants.AlternateChatbox ? 0xFFF : 0x000000)
        backgroundGraphic.drawRect(0, 0, dimensions.width, dimensions.height)
        backgroundGraphic.endFill()
        backgroundGraphic.alpha = 0.25

        return backgroundGraphic
    }
}
