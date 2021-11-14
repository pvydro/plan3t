import * as PIXI from 'pixi.js'
import { Darkener } from '../../engine/display/lighting/Darkener'
import { AttachmentsScreen } from '../uiscreen/attachmentsscreen/AttachmentsScreen'
import { BeamMeUpScreen } from '../uiscreen/beamemupscreen/BeamMeUpScreen'
import { RespawnScreen } from '../uiscreen/respawnscreen/RespawnScreen'
import { UIScreen } from '../uiscreen/UIScreen'
import { WaveRunnerOverScreen } from '../uiscreen/waverunneroverscreen/WaveRunnerOverScreen'
import { WaveRunnerScreen } from '../uiscreen/waverunnerscreen/WaveRunnerScreen'

export enum InGameScreenID {
    RespawnScreen,
    BeamMeUp,
    Attachments,
    WaveRunner,
    WaveRunnerOver
}

export interface IInGameMenu {
    currentScreenID: InGameScreenID
    showScreen(id: InGameScreenID): Promise<void>
    hideScreen(id: InGameScreenID): Promise<void>
}

export class InGameMenu extends UIScreen implements IInGameMenu {
    private static Instance: InGameMenu
    darkener: Darkener
    currentScreen: UIScreen
    currentScreenID: InGameScreenID

    constructor() {
        super({
            shouldFillWindow: true,
            filters: []
        })

        this.darkener = new Darkener({ blendMode: PIXI.BLEND_MODES.NORMAL, alpha: 0.9 })

        this.reposition(true)
    }

    async showScreen(id: InGameScreenID) {
        if (id === this.currentScreenID) return

        const screen = this.getScreenForID(id)

        this.currentScreenID = id
        this.currentScreen = screen
        this.currentScreen.applyScale()
        this.currentScreen.reposition()

        this.addChild(this.currentScreen)

        this.darkener.show()
        await this.currentScreen.show()
    }

    async hideScreen() {
        await this.currentScreen.hide()
        this.removeChild(this.currentScreen)

        this.currentScreen = undefined
        this.currentScreenID = undefined
    }

    forceHide() {
        this.darkener.forceHide()
        this.currentScreen.forceHide()
        this.removeChild(this.currentScreen)

        this.currentScreen = undefined
    }

    getScreenForID(id: InGameScreenID) {
        let screen: UIScreen

        switch (id) {
            case InGameScreenID.RespawnScreen:
                screen = new RespawnScreen()
                break
            default:
            case InGameScreenID.BeamMeUp:
                screen = new BeamMeUpScreen()
                break
            case InGameScreenID.Attachments:
                screen = new AttachmentsScreen()
                break
            case InGameScreenID.WaveRunner:
                screen = new WaveRunnerScreen()
                break
            case InGameScreenID.WaveRunnerOver:
                screen = new WaveRunnerOverScreen()
                break
        }

        return screen
    }
}
