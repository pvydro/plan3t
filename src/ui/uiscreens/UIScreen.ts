import { UIComponent, UIComponentOptions } from '../UIComponent'

export interface IUIScreen {
    intro(): Promise<void>
    outro(): Promise<void>
}

export interface UIScreenOptions extends UIComponentOptions {

}

export class UIScreen extends UIComponent implements IUIScreen {
    _isShown: boolean

    constructor(options: UIScreenOptions) {
        super(options)
    }

    intro(): Promise<void> {
        return new Promise((resolve) => {
            this._isShown = true
        })
    }

    outro(): Promise<void> {
        return new Promise((resolve) => {
            this._isShown = false
        })
    }

    get isShown() {
        return this._isShown
    }
}
