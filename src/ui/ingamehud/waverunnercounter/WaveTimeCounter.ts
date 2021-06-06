import { IUIComponent, UIComponent } from '../../UIComponent'

export interface IWaveTimeCounter extends IUIComponent {

}

export class WaveTimeCounter extends UIComponent {
    constructor() {
        super()
    }

    // TODO: Line over top of screen that decreases w/ wave time, new wave oncomplete
}
