import { IReposition } from '../../interface/IReposition'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { UIConstants, WindowSize } from '../../utils/Constants'
import { IInGameInventory, InGameInventory } from '../ingameinventory/InGameInventory'
import { UIComponent } from '../UIComponent'
import { UIContainer } from '../UIContainer'
import { RespawnScreen } from '../uiscreens/respawnscreen/RespawnScreen'
import { AmmoStatusComponent } from './ammostatus/AmmoStatusComponent'
import { Crosshair, CrosshairState } from './crosshair/Crosshair'
import { HealthBar } from './healthbar/HealthBar'
import { OverheadHealthBar } from './healthbar/OverheadHealthBar'
import { HUDInventoryHotbar } from './inventoryhotbar/HUDInventoryHotbar'

export interface IInGameHUD extends IUpdatable, IReposition {
    initializeHUD(): Promise<void>
    requestRespawnScreen(): Promise<void>
    closeRespawnScreen(): Promise<void>
    requestCrosshairState(state: CrosshairState): void
}

export class InGameHUD extends UIComponent implements IInGameHUD {
    private static INSTANCE: InGameHUD
    _initialized: boolean = false
    hudContainer: UIContainer
    crosshair: Crosshair
    ammoStatus: AmmoStatusComponent
    hotbar: HUDInventoryHotbar
    healthBar: HealthBar
    queuedHealthBars: OverheadHealthBar[] = []
    inventory: InGameInventory
    respawnScreen: RespawnScreen

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

        this.respawnScreen = new RespawnScreen()
        this.crosshair = Crosshair.getInstance()
        this.healthBar = new HealthBar()
        this.ammoStatus = new AmmoStatusComponent()
        this.hotbar = new HUDInventoryHotbar()
        this.inventory = new InGameInventory()
    }

    async initializeHUD(): Promise<void> {
        Flogger.log('InGameHUD', 'initializeHUD')

        return new Promise((resolve, reject) => {
            this.addChild(this.ammoStatus)
            this.addChild(this.hotbar)
            this.addChild(this.respawnScreen)
            this.addChild(this.crosshair)
            // this.addChild(this.inventory)

            this.queuedHealthBars = []
            this.respawnScreen.forceHide()
            this.applyScale()
            this.reposition(true)
            this._initialized = true

            resolve()
        })
    }
    
    update(): void {
        super.update()

        this.crosshair.update()
        this.ammoStatus.update()
        this.hotbar.update()
        this.inventory.update()
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        // Health bar
        this.healthBar.position.x = WindowSize.width - UIConstants.HUDPadding
        this.healthBar.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.healthBar.backgroundSprite.height * UIConstants.HUDScale)

        // Ammo status
        this.ammoStatus.position.x = UIConstants.HUDPadding
        this.ammoStatus.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.ammoStatus.backgroundSprite.height * UIConstants.HUDScale)
    }

    requestCrosshairState(state: CrosshairState) {
        Flogger.log('InGameHUD', 'requestCrosshairState', 'state', CrosshairState[state])

        if (this.crosshair.state !== state) {
            this.crosshair.state = state
        }
    }

    async requestRespawnScreen() {
        Flogger.log('InGameHUD', 'requestRespawnScreen')
        
        await this.hideHUDComponents()
        await this.respawnScreen.show()

        setTimeout(() => {
            this.crosshair.state = CrosshairState.Cursor
        }, 250)
    }

    async closeRespawnScreen() {
        Flogger.log('InGameHUD', 'closeRespawnScreen')

        await this.respawnScreen.hide()
        this.crosshair.state = CrosshairState.Gameplay
        await this.showHUDComponents()
    }

    private async hideHUDComponents() {
        await this.ammoStatus.hide()
    }

    private async showHUDComponents() {
        await this.ammoStatus.show()
    }

    private applyScale() {
        const toScale: UIComponent[] = [
            this.healthBar, this.ammoStatus,
            this.respawnScreen.respawnButton,
            this.hotbar,
            this.inventory
        ]

        for (var i in toScale) {
            const scaledComponent = toScale[i]

            scaledComponent.scale.set(UIConstants.HUDScale, UIConstants.HUDScale)
        }
    }
}
