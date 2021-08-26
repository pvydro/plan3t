import { TextSprite, TextSpriteAlign } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { log } from '../../service/Flogger'
import { ChatService } from '../../service/chatservice/ChatService'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface IChatHistoryText extends IUIComponent {
    refreshChatText(): void
}

export class ChatHistoryText extends UIComponent implements IChatHistoryText {
    chatTextSprite: TextSprite

    constructor() {
        super()

        this.chatTextSprite = new TextSprite({
            text: '',
            style: TextStyles.InGameChat.Chat,
            align: TextSpriteAlign.Left
        })

        this.addChild(this.chatTextSprite)
        this.refreshChatText()
    }

    refreshChatText() {
        log('ChatHistoryText', 'refreshChatText')

        this.chatTextSprite.text = ChatService.messageLogAsString
        this.reposition()
    }

    reposition() {
        log('ChatHistoryText', 'reposition')

        this.chatTextSprite.y = -this.chatTextSprite.height
    }
}
