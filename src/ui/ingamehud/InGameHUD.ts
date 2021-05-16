import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { IReposition } from '../../interface/IReposition'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { TimeDefaults, UIDefaults } from '../../utils/Defaults'
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
import { PauseButton } from './pausebutton/PauseButton'

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
    pauseButton: PauseButton
    inGameMenu: InGameMenu

    static getInstance() {
        if (!this.Instance) {
            this.Instance = new InGameHUD()
        }

        return this.Instance
    }

    private constructor() {
        super({
            shouldFillWindow: true
        })

        this._initialized = false
        this.queuedHealthBars = []
        this.crosshair = Crosshair.getInstance()
        this.healthBar = new HealthBar()
        this.ammoStatus = new AmmoStatusComponent()
        this.hotbar = new HUDInventoryHotbar()
        this.inventory = new InGameInventory()
        this.pauseButton = new PauseButton()
        this.inGameMenu = InGameMenu.getInstance()

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
            // this.addChild(this.hotbar)
            this.addChild(this.inGameMenu)
            this.addChild(this.crosshair)
            this.addChild(this.pauseButton)

            this.queuedHealthBars = []
            // this.respawnScreen.forceHide()
            this.inGameMenu.forceHide()
            this.applyScale()
            this.reposition(true)
            this._initialized = true

            resolve()
        })
    }
    
    update() {
        super.update()

        this.crosshair.update()
        this.ammoStatus.update()
        // this.hotbar.update()
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
        this.pauseButton.reposition(false)

        this.y = GameWindow.y
    }

    requestCrosshairState(state: CrosshairState, delay?: number) {
        Flogger.log('InGameHUD', 'requestCrosshairState', 'state', CrosshairState[state])

        if (this.crosshair.state !== state) {
            if (state === CrosshairState.Gameplay || delay !== undefined) {
                const d = delay ?? TimeDefaults.CrosshairStateSwapDelay

                this.crosshair.setStateWithDelay(state, d)
            } else {
                this.crosshair.state = state
            }
        }
    }

    async requestMenuScreen(id: InGameScreenID) {
        Flogger.log('InGameHUD', 'requestScreen', 'id', id)

        await this.hideHUDComponents()
        if (this.inGameMenu) {
            await this.inGameMenu.showScreen(id)
        }

        this.requestCrosshairState(CrosshairState.Gameplay, 250)
    }

    async closeMenuScreen(id: InGameScreenID) {
        Flogger.log('InGameHUD', 'closeScreen', 'id', id)

        await this.inGameMenu.hideScreen(id)
        await this.showHUDComponents()

        this.requestCrosshairState(CrosshairState.Gameplay)
    }

    async hideHUDComponents() {
        await this.hotbar.hide()
        await this.ammoStatus.hide()
        await this.pauseButton.hide()
    }

    async showHUDComponents() {
        await this.hotbar.show()
        await this.ammoStatus.show()
        await this.pauseButton.show()
    }

    applyScale() {
        const toScale: UIComponent[] = [
            this.healthBar, this.ammoStatus,
            this.hotbar, this.inventory,
            this.pauseButton
        ]

        this.inGameMenu.applyScale()

        super.applyScale(toScale)
    }
}
