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
import { IUIComponentCreator, UIComponentCreator, UIComponentType } from '../UIComponentCreator'
import { UIComponentFactory } from '../UIComponentFactory'
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
    waveRunnerCounter?: WaveRunnerCounter
    initializeHUD(): Promise<void>
    // hideHUDComponents(): Promise<void>
    showHUDComponents(shouldShow?: boolean): Promise<void>
    requestMenuScreen(id: InGameScreenID): Promise<void>
    requestCrosshairState(state: CrosshairState): void
    loadWave(wave: IWave): void
    // requestRespawnScreen(): Promise<void>
    // closeRespawnScreen(): Promise<void>
}

export class InGameHUD extends UIScreen implements IInGameHUD {
    private static Instance: InGameHUD
    _initialized: boolean
    _waveUIInitialized: boolean
    hudContainer: UIContainer
    crosshair: Crosshair
    // ammoStatus: AmmoStatusComponent
    hotbar: HUDInventoryHotbar
    healthBar: HealthBar
    queuedHealthBars: OverheadHealthBar[]
    inventory: InGameInventory
    // pauseButton: PauseButton
    inGameMenu: InGameMenu
    waveRunnerCounter: WaveRunnerCounter
    creator: IUIComponentCreator

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

        this.creator = new UIComponentCreator()
        this.crosshair = Crosshair.getInstance()
        this.healthBar = new HealthBar()
        // this.ammoStatus = new AmmoStatusComponent()
        this.waveRunnerCounter = new WaveRunnerCounter()
        // this.pauseButton = new PauseButton()
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
            // this.addChild(this.ammoStatus)
            // this.addChild(this.hotbar)
            this.addChild(this.inGameMenu)
            this.addChild(this.crosshair)
            // this.addChild(this.pauseButton)
            this.addChild(this.waveRunnerCounter)

            this.addComponent(UIComponentType.HUDPauseButton)
            this.addComponent(UIComponentType.HUDAmmoStatus)

            this.queuedHealthBars = []
            this.inGameMenu.forceHide()
            // this.respawnScreen.forceHide()
            this.applyScale()
            this.reposition(true)
            this._initialized = true

            resolve()
        })
    }
    
    loadWave(wave: IWave) {
        Flogger.log('InGameHUD', 'loadWave')

        this.waveRunnerCounter.show()
    }


    update() {
        super.update()

        this.crosshair.update()

        for (const i in this.allComponents) {
            const component = this.allComponents[i]

            if (typeof component.update === 'function') {
                component.update()
            }
        }
        // this.ammoStatus.update()
        // this.inventory.update()
        // this.hotbar.update()
    }

    async addComponent(type: UIComponentType) {
        const component = this.creator.getComponentForType(type)

        
        if (component) {
            if (!this.hasChild(component)) {
                this.addChild(component)
            }

            component.reposition()
            this.applyScale([ component ])
    
            if (typeof component.show === 'function') {
                await component.show()
            }
        }
    }

    async removeComponent(type: UIComponentType) {
        const component = this.creator.getComponentForType(type)

        if (this.hasChild(component)) {
            this.removeChild(component)
        }

        this.creator.deleteComponentForType(type)
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        // this.hotbar.reposition(false)
        // this.ammoStatus.reposition(false)
        // this.pauseButton.reposition(false)
        this.waveRunnerCounter.reposition(false)

        for (const i in this.creator.allComponents) {
            const component = this.creator.allComponents[i]

            component.reposition(false)
        }

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

        await this.showHUDComponents(false)

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

    // async hideHUDComponents() {
    //     // await this.ammoStatus.hide()
    //     // await this.pauseButton.hide()
    //     // await this.hotbar.hide()

    //     for (const i in this.allComponents) {
    //         const component = this.allComponents[i]
    //     }

    //     if (this.waveRunnerCounter) {
    //         await this.waveRunnerCounter.hide()
    //     }
    // }

    async showHUDComponents(shouldShow?: boolean) {
        // await this.ammoStatus.show()
        // await this.pauseButton.show()
        // await this.hotbar.show()

        for (const i in this.allComponents) {
            const component = this.allComponents[i]

            if (shouldShow) {
                await component.show()
            } else {
                await component.hide()
            }
        }

        if (this.waveRunnerCounter) {
            await this.waveRunnerCounter.show()
        }
    }

    applyScale(toScaleCustom?: UIComponent[]) {
        const toScale: UIComponent[] = toScaleCustom ?? [
            this.healthBar, 
            // this.ammoStatus,
            // this.pauseButton,
            this.waveRunnerCounter
            // this.hotbar, this.inventory,
        ]

        this.inGameMenu.applyScale()

        super.applyScale(toScale)
    }

    getComponent(type: UIComponentType) {
        if (this.creator.componentExists(type)) {
            return this.creator.getComponentForType(type)
        } else {
            return undefined
        }
    }

    get allComponents() {
        return this.creator.allComponents
    }
}
