import { IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { UIConstants, WindowSize } from '../../utils/Constants'
import { UIComponent } from '../UIComponent'
import { UIContainer } from '../UIContainer'
import { AmmoStatusComponent } from './ammostatus/AmmoStatusComponent'
import { Crosshair } from './Crosshair'
import { HealthBar } from './healthbar/HealthBar'
import { OverheadHealthBar } from './healthbar/OverheadHealthBar'

export interface IInGameHUD extends IUpdatable {
    initializeHUD(): Promise<void>
}

export class InGameHUD extends UIContainer implements IInGameHUD {
    private static INSTANCE: InGameHUD
    _initialized: boolean = false
    hudContainer: UIContainer
    crosshair: Crosshair
    ammoStatus: AmmoStatusComponent
    healthBar: HealthBar
    queuedHealthBars: OverheadHealthBar[] = []
    overheadHealthBars: Map<string, OverheadHealthBar>

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
        this.overheadHealthBars = new Map()
    }

    async initializeHUD(): Promise<void> {
        Flogger.log('InGameHUD', 'initializeHUD')

        return new Promise((resolve, reject) => {
            this.addChild(this.healthBar)
            this.addChild(this.ammoStatus)
            this.addChild(this.crosshair)

            // Health bars that were initialized before parent initialization
            for (var i in this.queuedHealthBars) {
                this.addChild(this.queuedHealthBars[i])
            }

            this.queuedHealthBars = []
            this.applyScale()
            this.applyPosition()

            this._initialized = true

            window.onresize = () => {
                this.applyPosition()
            }

            resolve()
        })
    }
    
    update(): void {
        super.update()

        this.crosshair.update()
        this.overheadHealthBars.forEach((healthBar) => {
            healthBar.update()
        })
    }

    registerOverheadHealthBar(player: IClientPlayer) {
        Flogger.log('InGameHUD', 'registerOverheadHealthBar', 'sessionId', player.sessionId)

        const overheadHealthBar = new OverheadHealthBar({ player })

        this.overheadHealthBars.set(player.sessionId, overheadHealthBar)

        if (this._initialized) {
            this.hudContainer.addChild(overheadHealthBar)
        } else {
            this.queuedHealthBars.push(overheadHealthBar)
        }
    }

    removeOverheadHealthBar(player: IClientPlayer) {
        Flogger.log('InGameHUD', 'removeOverheadHealthBar', 'sessionId', player.sessionId)

        this.overheadHealthBars.delete(player.sessionId)
    }

    private applyScale() {
        const toScale: UIComponent[] = [ this.healthBar, this.ammoStatus ]

        this.overheadHealthBars.forEach((healthBar) => {
            toScale.push(healthBar)
        })

        for (let i in toScale) {
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
}
