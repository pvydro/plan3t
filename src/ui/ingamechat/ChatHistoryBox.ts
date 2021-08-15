import { Graphix } from '../../engine/display/Graphix'
import { ChatService } from '../../service/chatservice/ChatService'
import { log } from '../../service/Flogger'
import { DebugConstants } from '../../utils/Constants'
import { UIDefaults } from '../../utils/Defaults'
import { IUIComponent, UIComponent } from '../UIComponent'
import { ChatHistoryText } from './ChatHistoryText'

export interface IChatHistoryBox extends IUIComponent {
    refreshChatText(): void
}

export class ChatHistoryBox extends UIComponent implements IChatHistoryBox {
    backgroundGraphic: Graphix
    chatText: ChatHistoryText

    constructor() {
        super()

        this.backgroundGraphic = this.constructBackground()
        this.chatText = new ChatHistoryText()

        this.addChild(this.backgroundGraphic)
        this.addChild(this.chatText)

        this.reposition()

        ChatService.onMessageChange((newMessage: string) => {
            log('ChatHistoryBox', 'onMessageChange')


        })
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

    refreshChatText() {
        log('ChatHistoryBox', 'refreshChatText')

        this.chatText.refreshChatText()
    }

    reposition() {
        this.chatText.y = this.height - this.chatText.height
    }
}
