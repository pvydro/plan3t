import { Container, IContainer } from '../../engine/display/Container'
import { IUpdatable } from '../../interface/IUpdatable'
import { AttachmentsNodes } from './AttachmentNodes'
import { AttachmentNodeConfig } from './AttachmentNode'
import { IWeapon, WeaponStats } from '../Weapon'
import { IWeaponConfigurator, WeaponConfigurator } from '../WeaponConfigurator'

export interface IWeaponAttachments extends IContainer, IUpdatable {
    attachmentConfigs: AttachmentNodeConfig[]
    configure(stats: WeaponStats): void
}

export class WeaponAttachments extends Container implements IWeaponAttachments {
    weapon: IWeapon
    configurator: IWeaponConfigurator
    attachmentNodes: AttachmentsNodes
    attachmentConfigs: AttachmentNodeConfig[]

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
        } else {
            this.attachmentNodes.clearChildren()
        }
    }
}
