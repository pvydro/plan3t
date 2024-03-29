import { InputEvents, InputProcessor } from '../../../input/InputProcessor'
import { IUpdatable } from '../../../interface/IUpdatable'
import { Direction } from '../../../engine/math/Direction'
import { ClientPlayer } from '../ClientPlayer'
import { PlayerHead } from './PlayerHead'
import { Vector2 } from '../../../engine/math/Vector2'
import { PlayerBodyState, PlayerConsciousnessState } from '../ClientPlayerState'

export interface IPlayerHeadController extends IUpdatable {

}

export interface PlayerHeadControllerOptions {
    playerHead: PlayerHead
    player: ClientPlayer
}

export class PlayerHeadController implements IPlayerHeadController {
    _shouldRotateHeadWithMouseMove: boolean = true
    playerHead: PlayerHead
    _playerHeadRotationDamping: number = 10
    player: ClientPlayer
    mousePos: Vector2 = Vector2.Zero

    targetRotation: number = 0

    constructor(options: PlayerHeadControllerOptions) {
        this.playerHead = options.playerHead
        this.player = options.player

        this._shouldRotateHeadWithMouseMove = this.player.isClientPlayer

        if (this._shouldRotateHeadWithMouseMove) {
            this.trackMousePosition()
        }
    }

    update() {
        const direction = this.player.direction
        const headBobRotationDivisor = 35 // 20
        const headBobOffset = this.playerHead.headBobOffsetInterpoliation.interpolation
        let headBobRotation = ((headBobOffset + 2) / headBobRotationDivisor)

        if (this.player.consciousnessState === PlayerConsciousnessState.Dead) {
            this.rotateWithDeath()
            headBobRotation = 1
        } else if (this.player.bodyState === PlayerBodyState.Walking
        || this.player.bodyState === PlayerBodyState.Sprinting) {
            this.targetRotation = direction === Direction.Right ? 0.1 : -0.1
        } else if (this._shouldRotateHeadWithMouseMove) {
            this.rotateHeadWithMouseMove()
        } else {
            headBobRotation = 0
        }

        if (this.player.direction === Direction.Left) {
            headBobRotation *= -1
        }

        this.targetRotation += headBobRotation
        this.playerHead.rotation += (this.targetRotation - this.playerHead.rotation) / this.playerHeadRotationDamping
    }

    rotateHeadWithMouseMove() {
        if (this._shouldRotateHeadWithMouseMove) {

            const direction = this.player.direction
            const baseRotation = direction === Direction.Right
                ? -0.15 : 0.15

            const lookAtMouseDamping = 35
            const originY = this.player.y
            let distanceFromMouseY = direction === Direction.Right
                ? this.mousePos.y - originY : originY - this.mousePos.y
            const rotDistanceY = (distanceFromMouseY / lookAtMouseDamping)
            let rotationY = rotDistanceY
    
            rotationY *= 0.01
    
            this.targetRotation = (rotationY + baseRotation)
        } else {
            this.targetRotation = 0            
        }
    }

    rotateWithDeath() {
        if (this.player.yVel < 0) {
            this.targetRotation = -1.5
        } else {
            this.targetRotation = 1
        }
    }

    trackMousePosition() {
        InputProcessor.on(InputEvents.MouseMove, (event: MouseEvent) => {
            this.mousePos.x = event.clientX
            this.mousePos.y = event.clientY
        })
    }

    get playerHeadRotationDamping() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Dead) {
            // return 100
            if (this.player.yVel < 0) {
                // this.targetRotation = -2
                return 15
            } else {
                return 80
                // this.targetRotation = 1
            }
        } else {
            return this._playerHeadRotationDamping
        }
    }
}
