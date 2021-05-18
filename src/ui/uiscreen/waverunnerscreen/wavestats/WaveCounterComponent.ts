import { IUIComponent, UIComponent } from '../../../UIComponent'

export interface IWaveCounterComponent extends IUIComponent {

}


export class WaveCounterComponent extends UIComponent implements IWaveCounterComponent {
    constructor() {
        super()
    }

    async show() {
        super.show()

        this.alpha = 1
    }

    async hide() {
        super.hide()

        this.alpha = 0
    }
}
