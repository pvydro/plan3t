import { IUIComponent, UIComponent } from '../../../UIComponent'

export interface IWaveStats extends IUIComponent {

}

export class WaveStats extends UIComponent implements IWaveStats {
    static Instance: IWaveStats

    static getInstance(): IWaveStats {
        if (!this.Instance) {
            this.Instance = new WaveStats()
        }
        
        return this.Instance
    }

    private constructor() {
        super()


    }
    
    reposition(addListeners?: boolean) {
        super.reposition(addListeners)
    }
}
