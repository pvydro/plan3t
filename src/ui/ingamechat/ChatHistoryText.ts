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
            text: ChatService.messageLogAsString,
            style: TextStyles.InGameChat.Chat,
            align: TextSpriteAlign.Left
        })

        this.addChild(this.chatTextSprite)
    }

    refreshChatText() {
        log('ChatHistoryText', 'refreshChatText')

        this.chatTextSprite.text = ChatService.messageLogAsString
    }
}
