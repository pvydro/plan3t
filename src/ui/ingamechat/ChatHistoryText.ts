import { TextSprite, TextSpriteAlign } from '../../engine/display/TextSprite'
import { TextStyles } from '../../engine/display/TextStyles'
import { InGameChatService } from '../../service/InGameChatService'
import { IUIComponent, UIComponent } from '../UIComponent'

export interface IChatHistoryText extends IUIComponent {

}

export class ChatHistoryText extends UIComponent implements IChatHistoryText {
    chatTextSprite: TextSprite

    constructor() {
        super()

        this.chatTextSprite = new TextSprite({
            text: InGameChatService.messageLogAsString,
            style: TextStyles.InGameChat.Chat,
            align: TextSpriteAlign.Left
        })
        this.addChild(this.chatTextSprite)
    }
}
