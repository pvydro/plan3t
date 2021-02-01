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
    private static INSTANCE: InGameHUD
    hudContainer: UIContainer
    crosshair: Crosshair
    ammoStatus: AmmoStatusComponent
    healthBar: HealthBar

    static getInstance() {
        if (!this.INSTANCE) {
            this.INSTANCE = new InGameHUD()
        }

        return this.INSTANCE
    }

    private constructor() {
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

            this.applyScale()
            this.applyPosition()

            window.onresize = () => {
                this.applyPosition()
            }

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
        this.healthBar.position.x = WindowSize.width - UIConstants.HUDPadding
        //UIConstants.HUDPadding
        this.healthBar.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.healthBar.backgroundSprite.height * UIConstants.HUDScale)

        // Ammo status
        this.ammoStatus.position.x = UIConstants.HUDPadding
        this.ammoStatus.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.ammoStatus.backgroundSprite.height * UIConstants.HUDScale)
    }
    
    update(): void {
        super.update()

        this.crosshair.update()
    }
}
