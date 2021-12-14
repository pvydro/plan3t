import { AdjustmentFilter, AsciiFilter, BloomFilter, ColorOverlayFilter, CrossHatchFilter, GlitchFilter, MotionBlurFilter, PixelateFilter } from 'pixi-filters'
import { Fonts } from '../../../asset/Fonts'
import { ClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { TextSprite } from '../../../engine/display/TextSprite'
import { TextStyles } from '../../../engine/display/TextStyles'
import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { GameStateID } from '../../../manager/gamestatemanager/GameStateManager'
import { log } from '../../../service/Flogger'
import { camera, gameMapMan, gameStateMan, inGameHUD } from '../../../shared/Dependencies'
import { UIDefaults } from '../../../utils/Defaults'
import { AttachmentNode } from '../../../weapon/attachments/AttachmentNode'
import { WeaponState } from '../../../weapon/Weapon'
import { InGameScreenID } from '../../ingamemenu/InGameMenu'
import { UIText } from '../../UIText'
import { IUIScreen, UIScreen } from '../UIScreen'

export interface IAttachmentsScreen extends IUIScreen {
    setSelectedAttachment(attachmentNode: AttachmentNode): void
    resetSelectedAttachment(): void
}

export class AttachmentsScreen extends UIScreen implements IAttachmentsScreen {
    selectedAttachment?: AttachmentNode
    selectedAttachmentText: UIText

    constructor() {
        super({
            filters: [],
            header: {
                text: 'Attachments'
            }
        })
        this.selectedAttachmentText = new UIText({
            text: 'te',
            uppercase: true,
            style: {
                fontFamily: Fonts.FontDefault.fontFamily
            }
        })
        this.addChild(this.selectedAttachmentText)
        this.reposition(true)
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

    setSelectedAttachment(attachmentNode: AttachmentNode) {
        log('AttachmentsScreen', 'setSelectedAttachment', attachmentNode.slot, attachmentNode.attachment.name)

        this.selectedAttachmentText = new UIText({
            text: 'fuck you mother fucker',
            uppercase: true,
            style: {
                fontFamily: Fonts.FontDefault.fontFamily
            }
        })
            //attachmentNode.slot
        // this.screenHeader.text = 'what the fuck'//attachmentNode.slot
        // .setText(attachmentNode.slot)
    }

    resetSelectedAttachment() {
        this.selectedAttachmentText.setText('')
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

    reposition(addListeners: boolean) {
        super.reposition(addListeners)

        const margin = UIDefaults.UIMargin

        this.selectedAttachmentText.x = this.screenHeader.x
        this.selectedAttachmentText.y = this.screenHeader.y + this.screenHeader.height + margin
    }

    handleKeyPress(ev: KeyboardEvent) {
        if (ev.key === 'Escape' || ev.key === 'Backspace') {
            this.exit()
        }
    }
}
