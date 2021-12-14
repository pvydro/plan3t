import { Container, IContainer } from '../../engine/display/Container'
import { IUpdatable } from '../../interface/IUpdatable'
import { AttachmentsNodes } from './AttachmentNodes'
import { IWeapon, WeaponStats } from '../Weapon'
import { IWeaponConfigurator, WeaponConfigurator } from '../WeaponConfigurator'
import { WeaponAttachment, WeaponAttachmentChoice } from './WeaponAttachment'

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
    weapon: IWeapon
    attachmentConfigs: WeaponAttachmentConfig[]
    applyAttachments(choices: WeaponAttachmentChoice[]): void
    configure(stats: WeaponStats): void
    getConfigForType(type: WeaponAttachmentType): WeaponAttachmentConfig
}

export class WeaponAttachments extends Container implements IWeaponAttachments {
    weapon: IWeapon
    configurator: IWeaponConfigurator
    attachmentNodes: AttachmentsNodes
    attachmentConfigs: WeaponAttachmentConfig[] = []
    attachments: WeaponAttachment[] = []

    constructor(weapon: IWeapon) {
        super()

        this.weapon = weapon
        this.configurator = new WeaponConfigurator(this.weapon)
        this.attachmentNodes = new AttachmentsNodes(this.weapon)

        this.addChild(this.attachmentNodes)

        // this.applyAttachments([
        //     {
        //         name: WeaponAttachmentName.RedDot,
        //         type: WeaponAttachmentType.Scope
        //     },
        // ])
    }

    update() {
        this.attachmentNodes.update()
        this.configurator.update()
    }

    applyAttachments(choices: WeaponAttachmentChoice[]) {
        this.attachments = []

        choices.forEach((choice: WeaponAttachmentChoice) => {
            const config = this.getConfigForType(choice.type)
            console.log('config choice', choice.name)
            if (config) {
                const attachment = new WeaponAttachment(choice, this)
                this.attachments.push(attachment)
                this.weapon.addChild(attachment)
                // this.attachmentNodes.addAttachment(attachment)
            }
        })
    }

    configure(stats: WeaponStats) {
        if (stats.attachments) {
            this.attachmentConfigs = stats.attachments
            this.attachmentNodes.configureNodes(this.attachmentConfigs)
        } else {
            this.attachmentNodes.clearChildren()
        }
    }

    getConfigForType(type: WeaponAttachmentType) {
        return this.attachmentConfigs.find(config => config.type === type)
    }

    getAttachmentForType(type: WeaponAttachmentType) {
        return this.attachments.find(attachment => attachment.type === type)
    }
}
