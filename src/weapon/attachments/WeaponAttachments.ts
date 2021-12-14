import { Container, IContainer } from '../../engine/display/Container'
import { IUpdatable } from '../../interface/IUpdatable'
import { AttachmentsNodes } from './AttachmentNodes'
import { IWeapon, WeaponStats } from '../Weapon'
import { IWeaponConfigurator, WeaponConfigurator } from '../WeaponConfigurator'
import { WeaponAttachment } from './WeaponAttachment'

export interface WeaponAttachmentConfig {
    type: WeaponAttachmentType
    x: number
    y: number
}

export enum WeaponAttachmentType {
    Scope = 'scope',
    SubSight = 'subsight',
    Underbarrel = 'underbarrel',
    Grip = 'grip',
    Stock = 'stock'
}

export interface IWeaponAttachments extends IContainer, IUpdatable {
    attachmentConfigs: WeaponAttachmentConfig[]
    configure(stats: WeaponStats): void
}

export class WeaponAttachments extends Container implements IWeaponAttachments {
    weapon: IWeapon
    configurator: IWeaponConfigurator
    attachmentNodes: AttachmentsNodes
    attachmentConfigs: WeaponAttachmentConfig[]
    attachments: WeaponAttachment

    constructor(weapon: IWeapon) {
        super()

        this.weapon = weapon
        this.configurator = new WeaponConfigurator(this.weapon)
        this.attachmentNodes = new AttachmentsNodes(this.weapon)

        this.addChild(this.attachmentNodes)
    }

    update() {
        this.attachmentNodes.update()
        this.configurator.update()
    }

    configure(stats: WeaponStats) {
        if (stats.attachments) {
            this.attachmentConfigs = stats.attachments
            this.attachmentNodes.configureNodes(this.attachmentConfigs)

            stats.attachments.forEach((config: any) => {
            })
        } else {
            this.attachmentNodes.clearChildren()
        }
    }
}
