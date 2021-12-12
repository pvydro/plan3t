import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { camera } from '../../shared/Dependencies'
import { IWeapon } from '../Weapon'
import { AttachmentNodeType } from './AttachmentNodes'

export interface AttachmentNodeConfig {
    type: AttachmentNodeType
    x: number
    y: number
}

export class AttachmentNode extends Container {
    type: AttachmentNodeType
    weapon: IWeapon
    graphic: Graphix
    boundingBox: Graphix

    constructor(options: AttachmentNodeConfig, weapon: IWeapon) {
        super()

        this.type = options.type
        this.weapon = weapon
        this.graphic = this.createNodeGraphic()
        this.addChild(this.graphic)

        this.createBoundingBox()
    }

    update() {
        const player = this.weapon.playerHolster.player

        if (player) {
            const playerProj = player.position
            const nodeXDistance = this.x * this.weapon.scale.x
            const nodeYDistance = this.y * this.weapon.scale.y
            const weaponOriginX = this.weapon.x + this.weapon.handleOffsetX
            const weaponOriginY = this.weapon.x + this.weapon.handleOffsetY
            console.log(this.weapon.rotation, nodeXDistance)

            const nodeXOffset = nodeXDistance * Math.cos(this.weapon.rotation)
            const nodeYOffset = -nodeYDistance * Math.sin(this.weapon.rotation)

            const nodeProj = {
                x: playerProj.x + this.weapon.x + nodeXDistance + nodeXOffset,
                y: playerProj.y + this.weapon.y + nodeYDistance + nodeYOffset
            }
            this.boundingBox.x = nodeProj.x
            this.boundingBox.y = nodeProj.y
        }
    }

    createBoundingBox() {
        this.boundingBox = new Graphix()
        this.boundingBox.beginFill(0xffffff)
        this.boundingBox.drawRect(0, 0, 6, 6)
        this.boundingBox.endFill()
        this.boundingBox.alpha = 0.5

        camera.stage.addChild(this.boundingBox)
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
}
