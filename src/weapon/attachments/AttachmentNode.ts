import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { Tween } from '../../engine/display/tween/Tween'
import { Rect } from '../../engine/math/Rect'
import { camera } from '../../shared/Dependencies'
import { DebugConstants } from '../../utils/Constants'
import { lerp } from '../../utils/Math'
import { IWeapon } from '../Weapon'
import { AttachmentNodeType } from './AttachmentNodes'

export interface AttachmentNodeConfig {
    type: AttachmentNodeType
    x: number
    y: number
}

export class AttachmentNode extends Container {
    isShown: boolean = false
    baseAlpha: number = 0.4
    type: AttachmentNodeType
    weapon: IWeapon
    graphic: Graphix
    boundingBox: Graphix
    currentAnimation?: TweenLite

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
        if (this.isShown) return

        this.isShown = true
        camera.stage.addChildAtLayer(this.boundingBox, CameraLayer.Overlay)

        await Tween.to(this.boundingBox, { alpha: this.baseAlpha, duration: 0.5, autoplay: true })
    }

    async hide() {
        if (!this.isShown) return

        this.isShown = false
        this.boundingBox.alpha = 0

        camera.stage.removeFromLayer(this.boundingBox, CameraLayer.Overlay)
    }

    hovered() {
        if (!this.isShown) return
        if (this.currentAnimation) this.currentAnimation.kill()

        this.boundingBox.alpha = lerp(this.boundingBox.alpha, 1, 0.1)

    }

    unhovered() {
        this.boundingBox.alpha = lerp(this.boundingBox.alpha, this.baseAlpha, 0.1)
    }

    checkMouseInBounds() {
        const mouseX = Camera.Mouse.x
        const mouseInBounds = Rect.contains(this.boundingBox.getBoundingBox(), Camera.Mouse)

        if (mouseInBounds) {
            this.hovered()
            console.log('inbound')
        } else {
            this.unhovered()
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
