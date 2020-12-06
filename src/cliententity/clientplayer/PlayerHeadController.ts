import { Camera } from '../../camera/Camera'
import { InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'
import { ClientPlayer, PlayerBodyState } from './ClientPlayer'
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
        const direction = this.player.direction

        if (this.player.bodyState === PlayerBodyState.Walking) {
            this.targetRotation = direction === Direction.Right ? 0.1 : -0.1
        } else {
            if (this._shouldRotateHeadWithMouseMove) this.rotateHeadWithMouseMove()
        }
        
        let headBobRotation = this.playerHead.headBobOffset / 30

        if (this.player.direction === Direction.Left) {
            headBobRotation *= -1
        }

        this.targetRotation += headBobRotation

        // this.playerHead.rotation = this.targetRotation
        this.playerHead.rotation += (this.targetRotation - this.playerHead.rotation) / this.playerHeadRotationDamping
    }

    rotateHeadWithMouseMove() {
        const direction = this.player.direction
        const baseRotation = direction === Direction.Right
            ? -0.15 : 0.15

        const lookAtMouseDamping = 35
        const originY = this.player.y
        let distanceFromMouseY = direction === Direction.Right
            ? this.mousePos.y - originY : originY - this.mousePos.y
        const rotDistanceY = (distanceFromMouseY / lookAtMouseDamping)

        let rotationY = rotDistanceY//direction === Direction.Right ? rotDistanceY : -rotDistanceY

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
