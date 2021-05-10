import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { IReposition } from '../../interface/IReposition'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { UIDefaults } from '../../utils/Defaults'
import { InGameInventory } from '../ingamemenu/ingameinventory/InGameInventory'
import { InGameMenu, InGameScreenID } from '../ingamemenu/InGameMenu'
import { UIComponent } from '../UIComponent'
import { UIContainer } from '../UIContainer'
import { UIScreen } from '../uiscreens/UIScreen'
import { AmmoStatusComponent } from './ammostatus/AmmoStatusComponent'
import { Crosshair, CrosshairState } from './crosshair/Crosshair'
import { HealthBar } from './healthbar/HealthBar'
import { OverheadHealthBar } from './healthbar/OverheadHealthBar'
import { HUDInventoryHotbar } from './inventoryhotbar/HUDInventoryHotbar'

export interface IInGameHUD extends IUpdatable, IReposition {
    initializeHUD(): Promise<void>
    hideHUDComponents(): Promise<void>
    // requestRespawnScreen(): Promise<void>
    // closeRespawnScreen(): Promise<void>
    requestMenuScreen(id: InGameScreenID): Promise<void>
    requestCrosshairState(state: CrosshairState): void
}

export class InGameHUD extends UIScreen implements IInGameHUD {
    private static Instance: InGameHUD
    _initialized: boolean
    hudContainer: UIContainer
    crosshair: Crosshair
    ammoStatus: AmmoStatusComponent
    hotbar: HUDInventoryHotbar
    healthBar: HealthBar
    queuedHealthBars: OverheadHealthBar[]
    inventory: InGameInventory
    // respawnScreen: RespawnScreen
    inGameMenu: InGameMenu

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new InGameHUD()
        }

        return this.Instance
    }

    private constructor() {
        // const colorMatrixFilter = 
        // colorMatrixFilter.vintage(true)
        // colorMatrixFilter.polaroid(true)

        super({
            shouldFillWindow: true
        })

        // this.respawnScreen = new RespawnScreen()
        this._initialized = false
        this.queuedHealthBars = []
        this.crosshair = Crosshair.getInstance()
        this.healthBar = new HealthBar()
        this.ammoStatus = new AmmoStatusComponent()
        this.hotbar = new HUDInventoryHotbar()
        this.inventory = new InGameInventory()
        this.inGameMenu = InGameMenu.getInstance()
        this.reposition(true)

        // Temp
        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.B) {
                this.requestMenuScreen(InGameScreenID.BeamMeUp)
            }
        })
    }

    async initializeHUD(): Promise<void> {
        Flogger.log('InGameHUD', 'initializeHUD')

        return new Promise((resolve, reject) => {
            this.addChild(this.ammoStatus)
            this.addChild(this.hotbar)
            this.addChild(this.inGameMenu)
            this.addChild(this.crosshair)

            this.queuedHealthBars = []
            // this.respawnScreen.forceHide()
            this.inGameMenu.forceHide()
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

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        // Health bar
        // this.healthBar.position.x = GameWindow.width - UIDefaults.UIEdgePadding
        // this.healthBar.position.y = GameWindow.height - UIDefaults.UIEdgePadding
        // - (this.healthBar.backgroundSprite.height * UIDefaults.UIScale)

        // Ammo status
        // this.ammoStatus.position.x = 
        // this.ammoStatus.position.y = 

        this.hotbar.reposition(false)
        this.ammoStatus.reposition(false)

        this.y = GameWindow.y
    }

    requestCrosshairState(state: CrosshairState) {
        Flogger.log('InGameHUD', 'requestCrosshairState', 'state', CrosshairState[state])

        if (this.crosshair.state !== state) {
            this.crosshair.state = state
        }
    }

    async requestMenuScreen(id: InGameScreenID) {
        Flogger.log('InGameHUD', 'requestScreen', 'id', id)

        await this.hideHUDComponents()
        if (this.inGameMenu) {
            await this.inGameMenu.showScreen(id)
        }
        setTimeout(() => {
            this.crosshair.state = CrosshairState.Cursor
        }, 250)
    }

    async closeMenuScreen(id: InGameScreenID) {
        Flogger.log('InGameHUD', 'closeScreen', 'id', id)

        await this.inGameMenu.hideScreen(id)
        await this.showHUDComponents()

        this.crosshair.state = CrosshairState.Gameplay
    }

    async hideHUDComponents() {
        await this.hotbar.hide()
        await this.ammoStatus.hide()
    }

    async showHUDComponents() {
        await this.hotbar.show()
        await this.ammoStatus.show()
    }

    applyScale() {
        const toScale: UIComponent[] = [
            this.healthBar, this.ammoStatus,
            this.hotbar, this.inventory
        ]

        this.inGameMenu.applyScale()

        super.applyScale(toScale)
    }
}
