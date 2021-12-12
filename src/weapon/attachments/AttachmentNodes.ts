import { Container, IContainer } from '../../engine/display/Container'
import { Tween } from '../../engine/display/tween/Tween'
import { IShowHide } from '../../interface/IShowHide'
import { camera } from '../../shared/Dependencies'
import { IWeapon } from '../Weapon'
import { AttachmentNode, AttachmentNodeConfig } from './AttachmentNode'

export interface IAttachmentNodes extends IContainer, IShowHide {
    configureNodes(attachments: AttachmentNodeConfig[]): void
}

export enum AttachmentNodeType {
    Scope = 'scope'
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
        if (this.nodes.length > 1) {
            for (var i in this.nodes) {
                const node = this.nodes[i]
                node.rotation = -this.weapon.rotation
            }
        }
    }

    async show() {
        await Tween.to(this, { alpha: 1, duration: 1.5, autoplay: true })
    }

    async hide() {
        await Tween.to(this, { alpha: 0, duration: 2, autoplay: true })
    }

    configureNodes(attachments: AttachmentNodeConfig[]) {
        this.clearChildren()
        this.destroyNodes()

        attachments.forEach((attachment: AttachmentNodeConfig) => {
            const node = new AttachmentNode(attachment)
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
