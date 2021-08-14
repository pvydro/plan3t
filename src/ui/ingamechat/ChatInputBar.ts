import { IUIComponent, UIComponent } from '../UIComponent'

export interface IChatInputBar extends IUIComponent {

}

export class ChatInputBar extends UIComponent implements IChatInputBar {
    constructor() {
        super()
    }
}
