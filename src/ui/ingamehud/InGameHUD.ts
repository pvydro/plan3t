import { Key } from 'ts-keycode-enum'
import { InputEvents, InputProcessor } from '../../input/InputProcessor'
import { IReposition } from '../../interface/IReposition'
import { IUpdatable } from '../../interface/IUpdatable'
import { log } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { AnimDefaults, TimeDefaults } from '../../utils/Defaults'
import { asyncTimeout, functionExists } from '../../utils/Utils'
import { IWave } from '../../waverunner/Wave'
import { InGameChat } from '../ingamechat/InGameChat'
import { IUIComponent, UIComponent } from '../UIComponent'
import { IUIComponentCreator, UIComponentCreator } from '../UIComponentCreator'
import { UIComponentType } from '../UIComponentFactory'
import { UIContainer } from '../UIContainer'
import { IUIScreen, UIScreen } from '../uiscreen/UIScreen'
import { Crosshair, CrosshairState } from './crosshair/Crosshair'
import { OverheadHealthBar } from './healthbar/OverheadHealthBar'
import { WaveRunnerCounter } from './waverunnercounter/WaveRunnerCounter'
import { InGameMenu, InGameScreenID } from '../ingamemenu/InGameMenu'

export interface IInGameHUD extends IUIScreen, IUpdatable {
    waveRunnerCounter?: WaveRunnerCounter
    crosshair: Crosshair
    menus: InGameMenu
    initializeHUD(): Promise<void>
    showHUDComponents(shouldShow?: boolean): Promise<void>
    addComponent(type: UIComponentType): UIComponent
    addComponentTemporarily(type: UIComponentType, hideHUD?: boolean, lifetime?: number): Promise<void>
    getComponent(type: UIComponentType): IUIComponent
    requestMenuScreen(id: InGameScreenID): Promise<void>
    closeMenuScreen(id: InGameScreenID): Promise<void>
    requestCrosshairState(state: CrosshairState): void
    loadWave(wave: IWave): void
    // requestRespawnScreen(): Promise<void>
    // closeRespawnScreen(): Promise<void>
}

export class InGameHUD extends UIScreen implements IInGameHUD {
    _initialized: boolean
    _waveUIInitialized: boolean
    hudContainer: UIContainer
    crosshair: Crosshair
    chat: InGameChat
    menus: InGameMenu
    queuedHealthBars: OverheadHealthBar[]
    creator: IUIComponentCreator

    constructor() {
        super()

        this._initialized = false
        this.queuedHealthBars = []

        this.menus = new InGameMenu()
        this.creator = new UIComponentCreator()
        this.crosshair = Crosshair.getInstance()

        this.addChild(this.menus)
        
        // Temp
        InputProcessor.on(InputEvents.KeyDown, (ev: KeyboardEvent) => {
            if (ev.which === Key.B) {
                this.requestMenuScreen(InGameScreenID.Attachments)
            }
        })
    }

    async initializeHUD(): Promise<void> {
        log('InGameHUD', 'initializeHUD')

        return new Promise((resolve) => {
            this.addChild(this.crosshair)

            this.addComponent(UIComponentType.HUDPauseButton)
            this.addComponent(UIComponentType.HUDAmmoStatus)
            this.addComponent(UIComponentType.InGameChat)

            this.queuedHealthBars = []
            this.reposition(true)
            this._initialized = true

            resolve()
        })
    }
    
    loadWave(wave: IWave) {
        log('InGameHUD', 'loadWave', wave)

        let waveRunnerCounter = this.getComponent(UIComponentType.HUDWaveCounter)

        if (waveRunnerCounter) {
            waveRunnerCounter.show()
        } else {
            waveRunnerCounter = this.addComponent(UIComponentType.HUDWaveCounter)
        }

        (waveRunnerCounter as WaveRunnerCounter).setWaveValue(wave)

        this.addComponentTemporarily(UIComponentType.NextWaveSplash, true)
    }

    update() {
        super.update()

        this.crosshair.update()

        for (const i in this.allComponents) {
            const component = this.allComponents[i]

            if (functionExists(component.update)) {
                component.update()
            }
        }
    }

    addComponent(type: UIComponentType) {
        const component = this.creator.getComponentForType(type)

        if (component) {
            if (!this.hasChild(component)) {
                this.addChild(component)
            }

            component.reposition(false)
            this.applyScale([ component ])
    
            if (typeof component.show === 'function') {
                component.show()
            }
        }

        return component
    }

    async removeComponent(type: UIComponentType) {
        const component = this.creator.getComponentForType(type)

        if (this.hasChild(component)) {
            this.removeChild(component)
        }

        this.creator.deleteComponentForType(type)
    }

    async addComponentTemporarily(type: UIComponentType, hideHUD: boolean = false, lifetime: number = 500) {
        if (hideHUD) {
            await this.showHUDComponents(false)
        }

        const component = await this.addComponent(type)

        await asyncTimeout(lifetime)
        await component.hide()

        this.removeComponent(type)

        await this.showHUDComponents(true)
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        for (const i in this.allComponents) {
            const component = this.allComponents[i]

            component.reposition(false)
        }

        this.y = GameWindow.y
    }

    requestCrosshairState(state: CrosshairState, delay?: number) {
        log('InGameHUD', 'requestCrosshairState', 'state', CrosshairState[state])

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
        log('InGameHUD', 'requestScreen', 'id', id)

        if (id === this.menus.currentScreenID) return

        await this.showHUDComponents(false)
        await this.menus.showScreen(id)

        this.requestCrosshairState(CrosshairState.Cursor, 250)
    }

    async closeMenuScreen(id: InGameScreenID) {
        log('InGameHUD', 'closeScreen', 'id', id)

        await this.menus.hideScreen()
        await this.showHUDComponents()

        this.requestCrosshairState(CrosshairState.Gameplay)
    }

    async showHUDComponents(shouldShow?: boolean) {
        for (const i in this.allComponents) {
            const component = this.allComponents[i]

            if (shouldShow !== false) {
                component.show()
            } else {
                component.hide()
            }

            await asyncTimeout(AnimDefaults.casecadeSpacing)
        }
    }

    applyScale(toScaleCustom?: UIComponent[]) {
        super.applyScale(toScaleCustom)
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
