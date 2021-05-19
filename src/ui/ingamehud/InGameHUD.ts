import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { IReposition } from '../../interface/IReposition'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { TimeDefaults, UIDefaults } from '../../utils/Defaults'
import { IWave } from '../../waverunner/Wave'
import { InGameInventory } from '../ingamemenu/ingameinventory/InGameInventory'
import { InGameMenu, InGameScreenID } from '../ingamemenu/InGameMenu'
import { UIComponent } from '../UIComponent'
import { UIContainer } from '../UIContainer'
import { UIScreen } from '../uiscreen/UIScreen'
import { AmmoStatusComponent } from './ammostatus/AmmoStatusComponent'
import { Crosshair, CrosshairState } from './crosshair/Crosshair'
import { HealthBar } from './healthbar/HealthBar'
import { OverheadHealthBar } from './healthbar/OverheadHealthBar'
import { HUDInventoryHotbar } from './inventoryhotbar/HUDInventoryHotbar'
import { PauseButton } from './pausebutton/PauseButton'
import { WaveRunnerCounter } from './waverunnercounter/WaveRunnerCounter'

export interface IInGameHUD extends IUpdatable, IReposition {
    initializeHUD(): Promise<void>
    hideHUDComponents(): Promise<void>
    // requestRespawnScreen(): Promise<void>
    // closeRespawnScreen(): Promise<void>
    requestMenuScreen(id: InGameScreenID): Promise<void>
    requestCrosshairState(state: CrosshairState): void
    loadWave(wave: IWave): void
}

export class InGameHUD extends UIScreen implements IInGameHUD {
    private static Instance: InGameHUD
    _initialized: boolean
    _waveUIInitialized: boolean
    hudContainer: UIContainer
    crosshair: Crosshair
    ammoStatus: AmmoStatusComponent
    hotbar: HUDInventoryHotbar
    healthBar: HealthBar
    queuedHealthBars: OverheadHealthBar[]
    inventory: InGameInventory
    pauseButton: PauseButton
    inGameMenu: InGameMenu
    waveRunnerCounter?: WaveRunnerCounter

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
        this.waveRunnerCounter = new WaveRunnerCounter()
        this.pauseButton = new PauseButton()
        this.inGameMenu = InGameMenu.getInstance()
        // this.hotbar = new HUDInventoryHotbar()
        // this.inventory = new InGameInventory()

        // Temp
        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.B) {
                this.requestMenuScreen(InGameScreenID.BeamMeUp)
            }
        })
    }

    async initializeHUD(): Promise<void> {
        Flogger.log('InGameHUD', 'initializeHUD')

        return new Promise((resolve) => {
            this.addChild(this.ammoStatus)
            // this.addChild(this.hotbar)
            this.addChild(this.inGameMenu)
            this.addChild(this.crosshair)
            this.addChild(this.pauseButton)

            this.queuedHealthBars = []
            this.inGameMenu.forceHide()
            // this.respawnScreen.forceHide()
            this.applyScale()
            this.reposition(true)
            this._initialized = true

            resolve()
        })
    }

    initializeWaveHUD() {
        Flogger.log('InGameHUD', 'initializeWaveHUD')

        if (!this._waveUIInitialized) {
            this._waveUIInitialized = true
            
            this.addChild(this.waveRunnerCounter)
        }

    }
    
    loadWave(wave: IWave) {
        Flogger.log('InGameHUD', 'loadWave')

        this.initializeWaveHUD()
    }


    update() {
        super.update()

        this.crosshair.update()
        this.ammoStatus.update()
        // this.inventory.update()
        // this.hotbar.update()
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        // this.hotbar.reposition(false)
        this.ammoStatus.reposition(false)
        this.pauseButton.reposition(false)
        this.waveRunnerCounter.reposition(false)
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
        await this.ammoStatus.hide()
        await this.pauseButton.hide()
        // await this.hotbar.hide()

        if (this.waveRunnerCounter) {
            await this.waveRunnerCounter.hide()
        }
    }

    async showHUDComponents() {
        await this.ammoStatus.show()
        await this.pauseButton.show()
        // await this.hotbar.show()

        if (this.waveRunnerCounter) {
            await this.waveRunnerCounter.show()
        }
    }

    applyScale() {
        const toScale: UIComponent[] = [
            this.healthBar, this.ammoStatus,
            this.pauseButton, this.waveRunnerCounter
            // this.hotbar, this.inventory,
        ]

        this.inGameMenu.applyScale()

        super.applyScale(toScale)
    }
}
