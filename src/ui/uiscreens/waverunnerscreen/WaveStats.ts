import { IUIComponent, UIComponent } from '../../UIComponent'

export interface IWaveStats extends IUIComponent {

}

export class WaveStats extends UIComponent implements IWaveStats {
    constructor() {
        super()
    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
    }
}
