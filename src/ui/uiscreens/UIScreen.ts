import { UIComponent, UIComponentOptions } from '../UIComponent'

export interface IUIScreen {
    intro(): Promise<void>
    outro(): Promise<void>
}

export interface UIScreenOptions extends UIComponentOptions {

}

export class UIScreen extends UIComponent implements IUIScreen {
    constructor(options: UIScreenOptions) {
        super(options)
    }

    intro(): Promise<void> {
        return new Promise((resolve) => {
            
        })
    }

    outro(): Promise<void> {
        return new Promise((resolve) => {
            
        })
    }
}
