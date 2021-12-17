import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'
import { IAttachmentsScreen } from './AttachmentsScreen'

export interface IAttachmentList extends IUIComponent {

}

export interface AttachmentListOptions {
    screen: IAttachmentsScreen
}

export class AttachmentList extends UIComponent implements IAttachmentList {
    screen: IAttachmentsScreen
    header: UIText

    constructor(options: AttachmentListOptions) {
        super()

        this.screen = options.screen
        this.header = new UIText({
            text: 'Available',
            uppercase: true
        })

        this.addChild(this.header)

        this.forceHide()
    }

    reposition(): void {
        super.reposition()
        
        this.x = this.screen.selectedAttachmentText.x
        this.y = this.screen.selectedAttachmentText.y
    }
}
