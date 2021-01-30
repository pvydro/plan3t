import { Container } from '../../engine/display/Container'
import { IUpdatable } from '../../interface/IUpdatable'
import { Crosshair } from './Crosshair'

export interface IInGameHUD extends IUpdatable {
    initializeHUD(): Promise<void>
}

export class InGameHUD extends Container implements IInGameHUD {
    crosshair: Crosshair

    constructor() {
        super()

        this.crosshair = Crosshair.getInstance()
    }

    async initializeHUD(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.crosshair = Crosshair.getInstance()
    
            this.addChild(this.crosshair)

            resolve()
        })
    }
    
    update(): void {
        this.crosshair.update()
    }
}
