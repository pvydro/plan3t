import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { camera, inGameHUD } from '../../../shared/Dependencies'
import { InGameHUD } from '../../ingamehud/InGameHUD'
import { InGameScreenID } from '../../ingamemenu/InGameMenu'
import { IUIScreen, UIScreen } from '../UIScreen'

export interface IAttachmentsScreen extends IUIScreen {

}

export class AttachmentsScreen extends UIScreen implements IAttachmentsScreen {
    constructor() {
        super({
            filters: [],
            header: {
                text: 'Attachments'
            }
        })
    }

    async show() {
        camera.zoomer.setZoom(6)
        
        this.addKeyListeners()

        await super.show()
    }

    async hide() {
        camera.zoomer.revertZoom()

        this.removeKeyListeners()

        await super.hide()
    }

    exit() {
        inGameHUD.closeMenuScreen(InGameScreenID.Attachments)
    }

    addKeyListeners() {
        InputProcessor.on(InputEvents.KeyDown, this.handleKeyPress.bind(this))
    }

    removeKeyListeners() {
        InputProcessor.off(InputEvents.KeyDown, this.handleKeyPress.bind(this))
    }

    handleKeyPress(ev: KeyboardEvent) {
        if (ev.key === 'Escape' || ev.key === 'Backspace') {
            this.exit()
        }
    }
}
