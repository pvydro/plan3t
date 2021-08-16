import { Key } from 'ts-keycode-enum'
import { InputProcessor } from '../../input/InputProcessor'
import { log } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { UIDefaults } from '../../utils/Defaults'
import { IUIComponent, UIComponent } from '../UIComponent'
import { ChatHistoryBox } from './ChatHistoryBox'
import { ChatInputBar } from './ChatInputBar'

export interface IInGameChat extends IUIComponent {

}

export class InGameChat extends UIComponent implements IInGameChat {
    private static Instance: InGameChat
    chatHistoryBox: ChatHistoryBox
    chatInputBar: ChatInputBar

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new InGameChat()
        }

        return this.Instance
    }

    private constructor() {
        super()

        this.chatHistoryBox = new ChatHistoryBox()
        this.chatInputBar = new ChatInputBar()

        this.addChild(this.chatHistoryBox)
        this.addChild(this.chatInputBar)

        this.reposition(true)
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        this.x = GameWindow.fullWindowWidth - this.width - UIDefaults.UIEdgePadding
        this.y = GameWindow.height -(UIDefaults.UIEdgePadding * 3)

        this.chatInputBar.y = this.chatHistoryBox.height
        // GameWindow.fullWindowHeight
        //     - (UIDefaults.ChatboxDimensions.height * UIDefaults.UIScale)
        //     - UIDefaults.UIEdgePadding
    }

    applyListeners() {
        log('InGameChat', 'applyListeners')

        InputProcessor.on('keydown', (ev: KeyboardEvent) => {
            if (ev.which === Key.T) {
                this.enableFocus(true)
            } else if (ev.which === Key.Escape) {
                this.enableFocus(false)
            }
        })
    }

    enableFocus(shouldEnable: boolean) {
        log('InGameChat', 'enableFocus', 'shouldEnable', shouldEnable)

        this.chatInputBar.enableFocus(shouldEnable)
    }

}
