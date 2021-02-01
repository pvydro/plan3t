import { Camera } from '../../camera/Camera'
import { InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../engine/math/Direction'
import { ClientPlayer, PlayerBodyState } from './ClientPlayer'
import { PlayerHead } from './PlayerHead'
import { Vector2 } from '../../engine/math/Vector2'

export interface IPlayerHeadController extends IUpdatable {

}

export interface PlayerHeadControllerOptions {
    playerHead: PlayerHead
    player: ClientPlayer
}

export class PlayerHeadController implements IPlayerHeadController {
    _shouldRotateHeadWithMouseMove: boolean = true
    playerHead: PlayerHead
    playerHeadRotationDamping: number = 10
    player: ClientPlayer
    mousePos: Vector2 = Vector2.Zero

    targetRotation: number

    constructor(options: PlayerHeadControllerOptions) {
        this.playerHead = options.playerHead
        this.player = options.player

        this._shouldRotateHeadWithMouseMove = this.player.isClientPlayer
        this.trackMousePosition()
    }

    update() {
        const direction = this.player.direction

        if (this.player.bodyState === PlayerBodyState.Walking) {
            this.targetRotation = direction === Direction.Right ? 0.1 : -0.1
        } else {
            if (this._shouldRotateHeadWithMouseMove) {
                this.rotateHeadWithMouseMove()
            }
        }
        
        let headBobRotation = ((this.playerHead.headBobOffset + 2) / 20)//30

        if (this.player.direction === Direction.Left) {
            headBobRotation *= -1
        }

        this.targetRotation += headBobRotation

        // this.playerHead.rotation = this.targetRotation
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
    
            let rotationY = rotDistanceY//direction === Direction.Right ? rotDistanceY : -rotDistanceY
    
            rotationY *= 0.01
    
            this.targetRotation = (rotationY + baseRotation)
        } else {

            this.targetRotation = 0
            
        }
    }

    trackMousePosition() {
        InputProcessor.on('mousemove', (event: MouseEvent) => {
            this.mousePos.x = event.clientX
            this.mousePos.y = event.clientY
        })
    }
}
