import { IUIComponent, UIComponent } from '../../../UIComponent'

export interface IWaveCounterComponent extends IUIComponent {

}


export class WaveCounterComponent extends UIComponent implements IWaveCounterComponent {
    constructor() {
        super()
    }
}
