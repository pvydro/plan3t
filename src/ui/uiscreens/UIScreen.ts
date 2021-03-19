import { UIConstants } from '../../utils/Constants'
import { IUIComponent, UIComponent, UIComponentOptions } from '../UIComponent'

export interface IUIScreen extends IUIComponent {
    applyScale(components?: any[]): void
}

export interface UIScreenOptions extends UIComponentOptions {

}

export class UIScreen extends UIComponent implements IUIScreen {
    constructor(options?: UIScreenOptions) {
        super(options)
    }

    applyScale(components?: any[]) {
        if (components !== undefined) {

            for (var i in components) {
                const scaledComponent = components[i]

                scaledComponent.scale.set(UIConstants.UIScale, UIConstants.UIScale)
            }
        }
    }
}
