import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { Tween } from '../../engine/display/tween/Tween'
import { Rect } from '../../engine/math/Rect'
import { camera } from '../../shared/Dependencies'
import { DebugConstants } from '../../utils/Constants'
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

        // this.check()
        this.checkMouseInBounds()
    }

    async show() {
        camera.stage.addChildAtLayer(this.boundingBox, CameraLayer.Overlay)

        await Tween.to(this.boundingBox, { alpha: 0.8, duration: 0.5, autoplay: true })
    }

    async hide() {
        this.boundingBox.alpha = 0

        camera.stage.removeFromLayer(this.boundingBox, CameraLayer.Overlay)
    }

    checkMouseInBounds() {
        const mouseX = Camera.Mouse.x
        const mouseInBounds = Rect.contains(this.boundingBox.getBoundingBox(), Camera.Mouse)

        if (mouseInBounds) {
            console.log('inbound')
        }
    }

    createBoundingBox() {
        const nodeSize = 4

        this.boundingBox = new Graphix()
        this.boundingBox.beginFill(0xffffff)
        this.boundingBox.drawRect(0, 0, nodeSize, nodeSize)
        this.boundingBox.endFill()
        this.boundingBox.alpha = 0

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
