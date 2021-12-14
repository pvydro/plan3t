import { Animator, IAnimator } from '../../engine/display/Animator'
import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Tween } from '../../engine/display/tween/Tween'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { WeaponHelper } from '../WeaponHelper'
import { WeaponAttachmentName } from './WeaponAttachmentNames'
import { IWeaponAttachments, WeaponAttachmentType } from './WeaponAttachments'

export interface WeaponAttachmentChoice {
    type: WeaponAttachmentType
    name: WeaponAttachmentName
}

export interface IWeaponAttachment extends IContainer {
    type: WeaponAttachmentType
    applyHoverEffects(): void
    revertHoverEffects(): void
}

export class WeaponAttachment extends Container implements IWeaponAttachment {
    basePosition: IVector2 = Vector2.Zero
    type: WeaponAttachmentType
    attachments: IWeaponAttachments
    animator: IAnimator

    constructor(choice: WeaponAttachmentChoice, parent: IWeaponAttachments) {
        super()

        this.attachments = parent
        this.animator = new Animator()
        this.applyChoice(choice)
    }

    private applyChoice(choice: WeaponAttachmentChoice) {
        const config = this.attachments.getConfigForType(choice.type)
        const asset = WeaponHelper.getWeaponAttachmentAsset(choice)
        const sprite = new Sprite({ texture: PIXI.Texture.from(asset) })

        this.type = choice.type
        this.basePosition = {
            x: this.x = config.x,
            y: this.y = config.y - sprite.height
        }
        
        this.addChild(sprite)
    }

    applyHoverEffects() {
        this.animator.currentAnimation = Tween.to(this, {
            y: this.hoverY
        })

        this.animator.play()
    }

    revertHoverEffects() {
        this.animator.currentAnimation = Tween.to(this, {
            y: this.basePosition.y
        })
        
        this.animator.play()
    }

    get hoverY() {
        return this.basePosition.y - 1
    }
}