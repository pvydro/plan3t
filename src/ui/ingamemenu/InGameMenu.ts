import { Darkener } from '../../engine/display/lighting/Darkener'
import { BeamMeUpScreen } from '../uiscreens/beamemupscreen/BeamMeUpScreen'
import { RespawnScreen } from '../uiscreens/respawnscreen/RespawnScreen'
import { IUIScreen, UIScreen } from '../uiscreens/UIScreen'
import { WaveRunnerScreen } from '../uiscreens/waverunnerscreen/WaveRunnerScreen'
import { InGameInventory } from './ingameinventory/InGameInventory'

export enum InGameScreenID {
    RespawnScreen,
    BeamMeUp
}

export interface IInGameMenu {
    showScreen(id: InGameScreenID): Promise<void>
    hideScreen(id: InGameScreenID): Promise<void>
    hideAllScreens(): Promise<void>
}

export class InGameMenu extends UIScreen implements IInGameMenu {
    private static Instance: InGameMenu
    darkener: Darkener
    respawnScreen: RespawnScreen
    beamMeUpScreen: BeamMeUpScreen
    waveRunnerScreen: WaveRunnerScreen
    inGameInventory: InGameInventory
    allScreens: IUIScreen[]

    static getInstance() {
        if (InGameMenu.Instance === undefined) {
            InGameMenu.Instance = new InGameMenu()
        }

        return InGameMenu.Instance
    }
    
    private constructor() {
        super({
            shouldFillWindow: true,
            filters: []
        })

        this.darkener = new Darkener({ blendMode: PIXI.BLEND_MODES.NORMAL, alpha: 0.9 })
        this.respawnScreen = new RespawnScreen()
        this.waveRunnerScreen = new WaveRunnerScreen()
        // this.beamMeUpScreen = new BeamMeUpScreen()
        // this.inGameInventory = new InGameInventory()

        this.addChild(this.darkener)
        this.addChild(this.respawnScreen)
        this.addChild(this.waveRunnerScreen)
        // this.addChild(this.beamMeUpScreen)
        // this.addChild(this.inGameInventory)

        this.allScreens = [
            this.respawnScreen,
            this.waveRunnerScreen,
            this.waveRunnerScreen
            // this.inGameInventory,
            // this.beamMeUpScreen
        ]

        this.reposition(true)
    }

    async showScreen(id: InGameScreenID) {
        const screen = this.getScreenForID(id)

        this.darkener.show()
        await screen.show()
    }

    async hideScreen(id: InGameScreenID) {
        const screen = this.getScreenForID(id)

        await screen.hide()
    }

    async hideAllScreens() {
        if (this.respawnScreen.isShown) {
            await this.respawnScreen.hide()
        }
    }

    applyScale() {
        for (const i in this.allScreens) {
            const screen = this.allScreens[i]
            screen.applyScale()
        }

        super.applyScale()
    }

    forceHide() {
        this.darkener.forceHide()

        for (const i in this.allScreens) {
            const screen = this.allScreens[i]
            
            screen.forceHide()
        }
    }

    getScreenForID(id: InGameScreenID) {
        let screen: IUIScreen

        switch (id) {
            case InGameScreenID.RespawnScreen:
                screen = this.respawnScreen
                break
            default:
            case InGameScreenID.BeamMeUp:
                screen = this.beamMeUpScreen
                break
        }

        return screen
    }

    reposition(addListeners?: boolean) {
        super.reposition(addListeners)

        for (const i in this.allScreens) {
            const screen = this.allScreens[i]

            screen.reposition(addListeners)
        }
    }
}
