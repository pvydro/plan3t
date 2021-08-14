import { UIComponent, IUIComponent } from '../../UIComponent'

export interface IHoloToast extends IUIComponent {

}

export class HoloToast extends UIComponent implements IHoloToast {
    constructor() {
        super()
    }
}
