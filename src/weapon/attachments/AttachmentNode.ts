import { OutlineFilter } from 'pixi-filters'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { Tween } from '../../engine/display/tween/Tween'
import { Rect } from '../../engine/math/Rect'
import { camera, inGameHUD } from '../../shared/Dependencies'
import { InGameScreenID } from '../../ui/ingamemenu/InGameMenu'
import { AttachmentsScreen } from '../../ui/uiscreen/attachmentsscreen/AttachmentsScreen'
import { DebugConstants } from '../../utils/Constants'
import { lerp } from '../../utils/Math'
import { IWeapon } from '../Weapon'
import { IWeaponAttachment, WeaponAttachment } from './WeaponAttachment'
import { WeaponAttachmentName } from './WeaponAttachmentNames'
import { WeaponAttachmentConfig, WeaponAttachmentSlot } from './WeaponAttachments'

enum AttachmentNodeState {
    Idle,
    Hovered,
    Selected
}

export class AttachmentNode extends Container {
    _attachment?: IWeaponAttachment
    isShown: boolean = false
    baseAlpha: number = 0.4
    slot: WeaponAttachmentSlot
    weapon: IWeapon
    graphic: Graphix
    boundingBox: Graphix
    currentState: AttachmentNodeState = AttachmentNodeState.Idle
    currentAnimation?: TweenLite

    constructor(options: WeaponAttachmentConfig, weapon: IWeapon) {
        super()

        this.slot = options.type
        this.weapon = weapon

        if (DebugConstants.ShowAttachmentNodePoints) {
            this.graphic = this.createNodeGraphic()
            this.addChild(this.graphic)
        }

        this.createBoundingBox()
    }

    update() {
        const player = this.weapon.playerHolster.player

        if (player) {
            const playerProj = player.position
            const nodeXDistance = this.x * this.weapon.scale.x
            const nodeYDistance = this.y * this.weapon.scale.y
            const nodeYOffset = -(this.y * Math.sin(this.weapon.rotation)) * this.weapon.scale.y
            const nodeXOffset = (this.x * Math.cos(this.weapon.rotation))
            const weaponX = this.weapon.x + (this.weapon.handleOffsetX ?? 0)
            const weaponY = this.weapon.y + (this.weapon.handleOffsetY ?? 0)
            const nodeProj = {
                x: playerProj.x + weaponX + nodeXDistance + nodeXOffset - this.boundingBox.halfWidth,
                y: playerProj.y + weaponY + nodeYDistance + nodeYOffset + this.boundingBox.halfHeight
            }

            this.boundingBox.x = nodeProj.x
            this.boundingBox.y = nodeProj.y
        }

        this.checkMouseInBounds()

        switch (this.currentState) {
            case AttachmentNodeState.Idle:
                this.boundingBox.alpha = lerp(this.boundingBox.alpha, this.baseAlpha, 0.1)
                break
            case AttachmentNodeState.Hovered:
                this.boundingBox.alpha = lerp(this.boundingBox.alpha, 1, 0.1)
                break
            case AttachmentNodeState.Selected:
                break
        }
    }

    async show() {
        if (this.isShown) return

        this.isShown = true
        camera.stage.addChildAtLayer(this.boundingBox, CameraLayer.Overlay)

        await Tween.to(this.boundingBox, { alpha: this.baseAlpha, duration: 0.5, autoplay: true })
    }

    async hide() {
        if (!this.isShown) return

        this.isShown = false
        this.boundingBox.alpha = 0

        camera.stage.removeFromLayer(this.boundingBox, CameraLayer.Overlay)
    }

    hovered() {
        if (!this.isShown || this.currentState === AttachmentNodeState.Hovered) return

        this.currentState = AttachmentNodeState.Hovered
        if (this.currentAnimation) this.currentAnimation.kill()
        this.attachmentScreen.setSelectedAttachment(this)
        
        if (this.attachment) {
            this.attachment.applyHoverEffects()
        }
    }

    unhovered() {
        if (!this.isShown || this.currentState === AttachmentNodeState.Idle) return

        this.currentState = AttachmentNodeState.Idle

        if (this.attachment) {
            this.attachment.revertHoverEffects()
        }
    }

    checkMouseInBounds() {
        const mouseX = Camera.Mouse.x
        const mouseInBounds = Rect.contains(this.getClickHitBox(), Camera.Mouse)

        if (mouseInBounds) {
            this.hovered()
        } else {
            this.unhovered()
        }
    }

    createBoundingBox() {
        const nodeSize = 4

        this.boundingBox = new Graphix()
        this.boundingBox.beginFill(0xffffff)
        this.boundingBox.drawRect(0, 0, nodeSize, nodeSize)
        this.boundingBox.endFill()
        this.boundingBox.alpha = 0
        // this.boundingBox.filters = [ new OutlineFilter(10, 0xffffff) ]

        camera.stage.addChild(this.boundingBox)
    }

    getClickHitBox() {
        const clickboxPaddingMultiplier = 3
        const rect: Rect = this.boundingBox.getBoundingBox()

        rect.width *= clickboxPaddingMultiplier
        rect.height *= clickboxPaddingMultiplier

        rect.x -= rect.width / clickboxPaddingMultiplier
        rect.y -= rect.height / clickboxPaddingMultiplier

        return rect
    }

    createNodeGraphic(): Graphix {
        const graphic = new Graphix()
        const nodeSize = 1

        graphic.beginFill(0xffffff)
        graphic.drawRect(0, 0, nodeSize, nodeSize)
        graphic.endFill()

        // graphic.interactive = true
        // graphic.on('mouseenter', () => {
        //     console.log('%cTest', 'color: #ff0000; font-size: 600%')
        // })

        return graphic
    }

    destroy() {
        this.graphic.destroy()
        super.destroy()
    }

    get attachment() {
        if (!this._attachment) {
            this._attachment = this.weapon.getAttachmentForSlot(this.slot)
        }

        return this._attachment || undefined
    }

    get attachmentScreen() {
        return inGameHUD.menus.getScreenForID(InGameScreenID.Attachments) as AttachmentsScreen
    }
}
