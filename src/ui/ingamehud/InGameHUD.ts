import { AssetUrls } from '../../asset/Assets'
import { IClientPlayer } from '../../cliententity/clientplayer/ClientPlayer'
import { IUpdatable } from '../../interface/IUpdatable'
import { Flogger } from '../../service/Flogger'
import { UIConstants, WindowSize } from '../../utils/Constants'
import { UIButton, UIButtonType } from '../uibutton/UIButton'
import { UIComponent } from '../UIComponent'
import { UIContainer } from '../UIContainer'
import { RespawnScreen } from '../uiscreens/respawnscreen/RespawnScreen'
import { AmmoStatusComponent } from './ammostatus/AmmoStatusComponent'
import { Crosshair, CrosshairState } from './crosshair/Crosshair'
import { HealthBar } from './healthbar/HealthBar'
import { OverheadHealthBar } from './healthbar/OverheadHealthBar'

export interface IInGameHUD extends IUpdatable {
    initializeHUD(): Promise<void>
    requestRespawnScreen(): Promise<void>
}

export class InGameHUD extends UIContainer implements IInGameHUD {
    private static INSTANCE: InGameHUD
    _initialized: boolean = false
    hudContainer: UIContainer
    crosshair: Crosshair
    ammoStatus: AmmoStatusComponent
    healthBar: HealthBar
    queuedHealthBars: OverheadHealthBar[] = []
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
    }

    async initializeHUD(): Promise<void> {
        Flogger.log('InGameHUD', 'initializeHUD')

        return new Promise((resolve, reject) => {
            // this.addChild(this.healthBar)
            this.addChild(this.ammoStatus)
            this.addChild(this.respawnScreen)
            this.addChild(this.crosshair)

            this.queuedHealthBars = []
            this.respawnScreen.forceHide()
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
    }

    async requestRespawnScreen() {
        Flogger.color('white')
        Flogger.log('InGameHUD', 'requestRespawnScreen')
        
        this.crosshair.state = CrosshairState.Cursor
        await this.hideHUDComponents()
        await this.showRespawnScreen()
    }

    private async showRespawnScreen() {
        await this.respawnScreen.show()
    }

    private async hideHUDComponents() {
        await this.ammoStatus.hide()
    }

    private applyScale() {
        const toScale: UIComponent[] = [
            this.healthBar, this.ammoStatus,
            this.respawnScreen.respawnButton
        ]

        for (var i in toScale) {
            const scaledComponent = toScale[i]

            scaledComponent.scale.set(UIConstants.HUDScale, UIConstants.HUDScale)
        }
    }

    private applyPosition() {
        // Health bar
        this.healthBar.position.x = WindowSize.width - UIConstants.HUDPadding
        this.healthBar.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.healthBar.backgroundSprite.height * UIConstants.HUDScale)

        // Ammo status
        this.ammoStatus.position.x = UIConstants.HUDPadding
        this.ammoStatus.position.y = WindowSize.height - UIConstants.HUDPadding
        - (this.ammoStatus.backgroundSprite.height * UIConstants.HUDScale)
    }
}
