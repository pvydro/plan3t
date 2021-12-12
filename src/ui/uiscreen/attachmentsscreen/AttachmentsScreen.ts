import { MotionBlurFilter } from 'pixi-filters'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { GameStateID } from '../../../manager/gamestatemanager/GameStateManager'
import { camera, gameMapMan, gameStateMan, inGameHUD } from '../../../shared/Dependencies'
import { WeaponState } from '../../../weapon/Weapon'
import { InGameScreenID } from '../../ingamemenu/InGameMenu'
import { IUIScreen, UIScreen } from '../UIScreen'

export interface IAttachmentsScreen extends IUIScreen {

}

export class AttachmentsScreen extends UIScreen implements IAttachmentsScreen {
    constructor() {
        super({
            filters: [],
            header: {
                text: 'Attachments'
            }
        })
    }

    async show() {
        camera.zoomer.setZoom(6)
        
        this.addKeyListeners()
        if (gameStateMan.currentStateID !== GameStateID.AttachmentsMenu) {
            const player = ClientPlayer.getInstance()

            player.frozen = true
            player.hand.hide()
            player.holster.setWeaponState(WeaponState.AttachmentsMode)

            this.applyFilters()
        }

        await super.show()
    }

    async hide() {
        const player = ClientPlayer.getInstance()

        player.frozen = false
        player.hand.show()
        player.holster.setWeaponState(WeaponState.Loaded)
        if (player.holster.currentWeapon) {
            player.holster.currentWeapon.scale.x = 1
            player.holster.currentWeapon.scale.y = 1
        }
        camera.zoomer.revertZoom()

        this.removeKeyListeners()
        this.resetFilters()

        await super.hide()
    }

    applyFilters() {
        gameMapMan.gameMap.filters = [
            new MotionBlurFilter([ 24, 0 ])
        ]
    }

    resetFilters() {
        gameMapMan.gameMap.filters = []
    }

    exit() {
        inGameHUD.closeMenuScreen(InGameScreenID.Attachments)
    }

    addKeyListeners() {
        InputProcessor.on(InputEvents.KeyDown, this.handleKeyPress.bind(this))
    }

    removeKeyListeners() {
        InputProcessor.off(InputEvents.KeyDown, this.handleKeyPress.bind(this))
    }

    handleKeyPress(ev: KeyboardEvent) {
        if (ev.key === 'Escape' || ev.key === 'Backspace') {
            this.exit()
        }
    }
}
