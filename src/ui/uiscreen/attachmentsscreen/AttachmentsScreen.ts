import { AdjustmentFilter, AsciiFilter, BloomFilter, ColorOverlayFilter, CrossHatchFilter, GlitchFilter, MotionBlurFilter, PixelateFilter } from 'pixi-filters'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { GameStateID } from '../../../manager/gamestatemanager/GameStateManager'
import { camera, gameMapMan, gameStateMan, inGameHUD } from '../../../shared/Dependencies'
import { GameWindow } from '../../../utils/Constants'
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
        camera.stiffMode = true
        camera.extraYOffset = 32

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
        camera.stiffMode = false
        camera.extraYOffset = 0

        this.removeKeyListeners()
        this.resetFilters()

        await super.hide()
    }

    applyFilters() {
        const player = ClientPlayer.getInstance()
        const playerFilters = [
            new AsciiFilter(),
            new ColorOverlayFilter(0x5c5c5c),
        ]

        gameMapMan.gameMap.filters = [
            new AdjustmentFilter({ brightness: 0.8 }),
            new MotionBlurFilter([ 32, 0 ]), // 24
        ]

        player.body.filters = playerFilters
        player.head.filters = playerFilters
        player.playerBadge.filters = playerFilters
    }

    resetFilters() {
        const player = ClientPlayer.getInstance()

        gameMapMan.gameMap.filters = []
        player.body.filters = []
        player.head.filters = []
        player.playerBadge.filters = []
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
