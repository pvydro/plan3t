import { UIComponent, UIComponentOptions } from '../UIComponent'

export interface IUIScreen {
}

export interface UIScreenOptions extends UIComponentOptions {

}

export class UIScreen extends UIComponent implements IUIScreen {
    constructor(options: UIScreenOptions) {
        super(options)
    }
}
