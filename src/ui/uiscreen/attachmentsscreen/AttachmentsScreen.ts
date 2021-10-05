import { IUIScreen, UIScreen } from '../UIScreen'

export interface IAttachmentsScreen extends IUIScreen {

}

export class AttachmentsScreen extends UIScreen implements IAttachmentsScreen {
    constructor() {
        super({
            header: {
                text: 'Attachments'
            }
        })
    }
}
