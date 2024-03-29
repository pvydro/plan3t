import { Container, IContainer } from '../../engine/display/Container'
import { Tween } from '../../engine/display/tween/Tween'
import { IShowHide } from '../../interface/IShowHide'
import { IWeapon, WeaponState } from '../Weapon'
import { AttachmentNode } from './AttachmentNode'
import { WeaponAttachmentConfig } from './WeaponAttachments'

export interface IAttachmentNodes extends IContainer, IShowHide {
    configureNodes(attachments: WeaponAttachmentConfig[]): void
}

export class AttachmentsNodes extends Container implements IAttachmentNodes {
    nodes: AttachmentNode[] = []
    weapon: IWeapon

    constructor(weapon: IWeapon) {
        super()

        this.weapon = weapon
        this.alpha = 0
    }

    update() {
        if (this.weapon.state === WeaponState.AttachmentsMode
        && this.nodes.length > 1) {
            for (var i in this.nodes) {
                const node = this.nodes[i]
                node.update()
                node.rotation = -this.weapon.rotation
            }
        }
    }

    async show() {
        Tween.to(this, { alpha: 1, duration: 0.5, autoplay: true })

        for (var i in this.nodes) {
            const node = this.nodes[i]
            await node.show()
        }
    }

    async hide() {
        for (var i in this.nodes) {
            const node = this.nodes[i]
            node.hide()
        }

        await Tween.to(this, { alpha: 0, duration: 2, autoplay: true })
    }

    configureNodes(attachments: WeaponAttachmentConfig[]) {
        this.clearChildren()
        this.destroyNodes()

        attachments.forEach((attachment: WeaponAttachmentConfig) => {
            const node = new AttachmentNode(attachment, this.weapon)
            node.x = attachment.x
            node.y = attachment.y

            this.nodes.push(node)
            this.addChild(node)
        })
    }

    destroyNodes() {
        if (this.nodes.length > 0) {
            this.nodes.forEach((node: AttachmentNode) => {
                node.destroy()
            })
        }

        this.nodes = []
    }
}
