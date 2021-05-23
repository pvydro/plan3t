import { IUIComponent, UIComponent } from '../../UIComponent'

export interface IUIMusicPlayer extends IUIComponent {

}

export class UIMusicPlayer extends UIComponent implements IUIMusicPlayer {
    constructor() {
        super()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
    }
}
