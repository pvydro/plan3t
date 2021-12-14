import { Animator, IAnimator } from '../../engine/display/Animator'
import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Tween } from '../../engine/display/tween/Tween'
import { FourWayDirection as Direction } from '../../engine/math/Direction'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { Filters } from '../../utils/Filters'
import { getAnchorForDirection } from '../../utils/Math'
import { WeaponHelper } from '../WeaponHelper'
import { WeaponAttachmentName } from './WeaponAttachmentNames'
import { IWeaponAttachments, WeaponAttachmentSlot } from './WeaponAttachments'

export interface WeaponAttachmentChoice {
    slot: WeaponAttachmentSlot
    name: WeaponAttachmentName
}

export interface IWeaponAttachment extends IContainer {
    type: WeaponAttachmentSlot
    applyHoverEffects(): void
    revertHoverEffects(): void
}

export class WeaponAttachment extends Container implements IWeaponAttachment {
    basePosition: IVector2 = Vector2.Zero
    type: WeaponAttachmentSlot
    attachments: IWeaponAttachments
    direction: Direction = Direction.Up
    animator: IAnimator

    constructor(choice: WeaponAttachmentChoice, parent: IWeaponAttachments) {
        super()

        this.attachments = parent
        this.animator = new Animator()
        this.applyChoice(choice)
    }

    private applyChoice(choice: WeaponAttachmentChoice) {
        const config = this.attachments.getConfigForType(choice.slot)
        const asset = WeaponHelper.getWeaponAttachmentAsset(choice)
        const texture = PIXI.Texture.from(asset)
        const sprite = new Sprite({ texture })
        
        this.type = choice.slot
        this.direction = WeaponHelper.getDirectionForSlot(choice.slot)
        const anchor = getAnchorForDirection(this.direction)
        
        sprite.anchor.set(anchor.x, anchor.y)

        this.basePosition = {
            x: this.x = config.x,
            y: this.y = config.y// - sprite.height
        }
        
        this.addChild(sprite)
    }

    applyHoverEffects() {
        this.attachments.weapon.sprite.filters = [ Filters.getColorMatrixFilter({ brightness: 0.98 }) ]
        this.filters = [ Filters.getColorMatrixFilter({ brightness: 1.25 }) ]

        this.animator.currentAnimation = Tween.to(this, {
            y: this.hoverY
        })

        this.animator.play()
    }

    revertHoverEffects() {
        this.attachments.weapon.sprite.filters = []
        this.filters = []

        this.animator.currentAnimation = Tween.to(this, {
            y: this.basePosition.y
        })
        
        this.animator.play()
    }

    get hoverY() {
        let offsetY = 0

        if (this.direction === Direction.Up) {
            offsetY = -1
        } else if (this.direction === Direction.Down) {
            offsetY = 1
        }

        return this.basePosition.y + offsetY
    }
}