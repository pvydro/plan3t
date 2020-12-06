import { Camera } from '../../camera/Camera'
import { InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'
import { ClientPlayer } from './ClientPlayer'
import { PlayerHead } from './PlayerHead'

export interface IPlayerHeadController extends IUpdatable {

}

export interface PlayerHeadControllerOptions {
    playerHead: PlayerHead
    player: ClientPlayer
}

export class PlayerHeadController implements IPlayerHeadController {
    _shouldRotateHeadWithMouseMove: boolean = true
    playerHead: PlayerHead
    playerHeadRotationDamping: number = 20
    player: ClientPlayer
    mousePos: PIXI.IPoint = new PIXI.Point(0, 0)

    targetRotation: number

    constructor(options: PlayerHeadControllerOptions) {
        this.playerHead = options.playerHead
        this.player = options.player

        this.trackMousePosition()
    }

    update() {
        if (this._shouldRotateHeadWithMouseMove) this.rotateHeadWithMouseMove()

        // this.playerHead.rotation = this.targetRotation
        this.playerHead.rotation += (this.targetRotation - this.playerHead.rotation) / this.playerHeadRotationDamping
    }

    rotateHeadWithMouseMove() {
        const baseRotation = -0.15
        const lookAtMouseDamping = 35
        const originY = this.player.y
        const direction = this.player.direction
        let distanceFromMouseY = this.mousePos.y - originY
        const rotDistanceY = (distanceFromMouseY / lookAtMouseDamping) - 0.15

        let rotationY = direction === Direction.Right ? rotDistanceY : -rotDistanceY

        rotationY *= 0.01

        this.targetRotation = (rotationY + baseRotation)
    }

    trackMousePosition() {
        InputProcessor.on('mousemove', (event: MouseEvent) => {
            this.mousePos.x = event.clientX
            this.mousePos.y = event.clientY
        })
    }
}
