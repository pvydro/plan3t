import { IUIComponent, UIComponent } from '../UIComponent'

export interface ILoadingIcon extends IUIComponent {

}

export class LoadingIcon extends UIComponent implements ILoadingIcon {
    constructor() {
        super()
    }
}
