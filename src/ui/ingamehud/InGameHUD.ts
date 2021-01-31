import { Container } from '../../engine/display/Container'
import { IUpdatable } from '../../interface/IUpdatable'
import { UIConstants, WindowSize } from '../../utils/Constants'
import { UIContainer } from '../UIContainer'
import { AmmoStatusComponent } from './ammostatus/AmmoStatusComponent'
import { Crosshair } from './Crosshair'
import { HealthBar } from './healthbar/HealthBar'

export interface IInGameHUD extends IUpdatable {
    initializeHUD(): Promise<void>
}

export class InGameHUD extends UIContainer implements IInGameHUD {
    hudContainer: UIContainer
    crosshair: Crosshair
    ammoStatus: AmmoStatusComponent
    healthBar: HealthBar

    constructor() {
        super({
            shouldFillWindow: true 
        })

        this.crosshair = Crosshair.getInstance()
        this.healthBar = new HealthBar()
        this.ammoStatus = new AmmoStatusComponent()
    }

    async initializeHUD(): Promise<void> {
        return new Promise((resolve, reject) => {
    
            this.addChild(this.healthBar)
            this.addChild(this.ammoStatus)
            this.addChild(this.crosshair)

            this.applyPosition()
            this.applyScale()

            resolve()
        })
    }

    private applyScale() {
        const toScale = [ this.healthBar, this.ammoStatus ]

        for (var i in toScale) {
            const scaledComponent = toScale[i]

            scaledComponent.scale.set(UIConstants.HUDScale, UIConstants.HUDScale)
        }
    }

    private applyPosition() {
        // Health bar
        this.healthBar.position.x = UIConstants.HUDPadding
        this.healthBar.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.healthBar.backgroundSprite.height * UIConstants.HUDScale)

        // Ammo status
        this.ammoStatus.position.x = WindowSize.width - UIConstants.HUDPadding
        - (this.ammoStatus.width / UIConstants.HUDScale)
        this.ammoStatus.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.ammoStatus.backgroundSprite.height * UIConstants.HUDScale)

    }
    
    update(): void {
        super.update()

        this.crosshair.update()
    }
}