import { IUIMenu, UIMenu } from '../UIMenu'

export interface IPauseMenu extends IUIMenu {
    
}

export class PauseMenu extends UIMenu implements IPauseMenu {
    constructor() {
        super()
    }

    
}
