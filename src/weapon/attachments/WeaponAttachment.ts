import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { WeaponHelper } from '../WeaponHelper'
import { WeaponAttachmentName } from './WeaponAttachmentNames'
import { IWeaponAttachments, WeaponAttachmentType } from './WeaponAttachments'

export interface WeaponAttachmentChoice {
    type: WeaponAttachmentType
    name: WeaponAttachmentName
}

export interface IWeaponAttachment extends IContainer {
}

export class WeaponAttachment extends Container implements IWeaponAttachment {
    attachments: IWeaponAttachments

    constructor(choice: WeaponAttachmentChoice, parent: IWeaponAttachments) {
        super()

        this.attachments = parent
        this.applyChoice(choice)
    }

    private applyChoice(choice: WeaponAttachmentChoice) {
        const config = this.attachments.getConfigForType(choice.type)
        const asset = WeaponHelper.getWeaponAttachmentAsset(choice)
        const sprite = new Sprite({ texture: PIXI.Texture.from(asset) })

        this.addChild(sprite)
        this.x = config.x
        this.y = config.y - sprite.height
    }
}