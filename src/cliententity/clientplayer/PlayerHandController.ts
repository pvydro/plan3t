import { Camera } from '../../camera/Camera'
import { InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'
import { Direction } from '../../math/Direction'
import { PlayerHand } from './PlayerHand'

export interface IPlayerHandController {
    update(clientControl: boolean)
}

export interface PlayerHandControllerOptions {
    playerHand: PlayerHand
}

export class PlayerHandController implements IPlayerHandController {
    playerHand: PlayerHand
    mousePos: PIXI.IPoint = new PIXI.Point(0, 0)
    targetRotation: number = 0
    mouseFollowDamping: number = 5

    constructor(options: PlayerHandControllerOptions) {
        this.playerHand = options.playerHand

        this.trackMousePosition()
    }

    update(clientControl: boolean) {
        if (clientControl) {
            this.followMouse()
        }
    }

    followMouse() {
        const direction = this.playerHand.player.direction
        const projectedPlayerPos = Camera.getInstance().viewport.toScreen(this.playerHand.player.position)
        const playerX = projectedPlayerPos.x
        const playerY = projectedPlayerPos.y

        const angle = Math.atan2(this.mousePos.y - playerY, this.mousePos.x - playerX)// * 180 / Math.PI
        const halfACircleInRadians = 3.14159

        this.targetRotation = direction === Direction.Right ? angle : angle - halfACircleInRadians
        this.playerHand.rotation = direction === Direction.Right ? angle : angle - halfACircleInRadians
    }

    trackMousePosition() {
        InputProcessor.on('mousemove', (event: MouseEvent) => {
            this.mousePos.x = event.clientX
            this.mousePos.y = event.clientY
        })
    }
}
