import { Container } from '../../engine/display/Container'
import { IUpdatable } from '../../interface/IUpdatable'
import { UIConstants } from '../../utils/Constants'
import { Crosshair } from './Crosshair'
import { HealthBar } from './healthbar/HealthBar'

export interface IInGameHUD extends IUpdatable {
    initializeHUD(): Promise<void>
}

export class InGameHUD extends Container implements IInGameHUD {
    crosshair: Crosshair
    healthBar: HealthBar

    constructor() {
        super()

        this.crosshair = Crosshair.getInstance()
        this.healthBar = new HealthBar()
    }

    async initializeHUD(): Promise<void> {
        return new Promise((resolve, reject) => {
    
            this.addChild(this.crosshair)
            this.addChild(this.healthBar)

            this.healthBar.position.x = UIConstants.HUDPadding
            this.healthBar.position.y = UIConstants.HUDPadding

            this.applyScale()

            resolve()
        })
    }

    private applyScale() {
        this.healthBar.scale.set(UIConstants.HUDScale, UIConstants.HUDScale)
    }
    
    update(): void {
        this.crosshair.update()
    }
}
