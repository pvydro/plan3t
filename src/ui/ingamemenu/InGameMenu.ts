import { Darkener } from '../../engine/display/lighting/Darkener'
import { UIComponent } from '../UIComponent'
import { RespawnScreen } from '../uiscreens/respawnscreen/RespawnScreen'
import { IUIScreen, UIScreen } from '../uiscreens/UIScreen'

export enum InGameScreenID {
    RespawnScreen
}

export interface IInGameMenu {
    showScreen(id: InGameScreenID): Promise<void>
    hideScreen(id: InGameScreenID): Promise<void>
    hideAllScreens(): Promise<void>
}

export class InGameMenu extends UIScreen implements IInGameMenu {
    private static INSTANCE: InGameMenu
    darkener: Darkener
    respawnScreen: RespawnScreen
    allScreens: IUIScreen[]

    static getInstance() {
        if (InGameMenu.INSTANCE === undefined) {
            InGameMenu.INSTANCE = new InGameMenu()
        }

        return InGameMenu.INSTANCE
    }
    
    private constructor() {
        super({
            shouldFillWindow: true
        })

        this.darkener = new Darkener({ blendMode: PIXI.BLEND_MODES.NORMAL, alpha: 0.9 })
        this.respawnScreen = new RespawnScreen()

        this.addChild(this.darkener)
        this.addChild(this.respawnScreen)

        this.allScreens = [
            this.respawnScreen
        ]
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
        this.respawnScreen.forceHide()
        this.darkener.forceHide()
    }

    getScreenForID(id: InGameScreenID) {
        let screen: IUIScreen

        switch (id) {
            case InGameScreenID.RespawnScreen:
                screen = this.respawnScreen
                break
        }

        return screen
    }
}
