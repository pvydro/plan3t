import { Camera } from '../../camera/Camera'
import { InputProcessor } from '../../input/InputProcessor'
import { Direction } from '../../engine/math/Direction'
import { PlayerHand } from './PlayerHand'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { PlayerLegsState } from './ClientPlayer'

export interface IPlayerHandController {
    update(clientControl: boolean)
}

export interface PlayerHandControllerOptions {
    playerHand: PlayerHand
}

export class PlayerHandController implements IPlayerHandController {
    playerHand: PlayerHand
    mousePos: IVector2 = Vector2.Zero
    targetRotation: number = 0
    mouseFollowDamping: number = 5
    horizontalOffset: number = 0
    verticalOffset: number = 0
    crouchOffsetDamping: number = 5

    constructor(options: PlayerHandControllerOptions) {
        this.playerHand = options.playerHand

        this.trackMousePosition()
    }

    update(clientControl: boolean) {
        if (clientControl) {
            this.followMouse()
        }
        this.followState()
    }

    followState() {
        let targetHorizontalOffset = 0
        let targetVerticalOffset = 0

        if (this.playerHand.player.legsState === PlayerLegsState.Crouched) {
            targetHorizontalOffset = 2.5
            targetVerticalOffset = 1
        } else {
            targetHorizontalOffset = 0
            targetVerticalOffset = 0
        }
        if (this.playerHand.player.direction === Direction.Left) {
            targetHorizontalOffset *= -1
        }

        this.horizontalOffset += (targetHorizontalOffset - this.horizontalOffset) / this.crouchOffsetDamping
        this.verticalOffset += (targetVerticalOffset - this.verticalOffset) / this.crouchOffsetDamping

        this.playerHand.x += this.horizontalOffset
        this.playerHand.y += this.verticalOffset
    }

    followMouse() {
        const direction = this.playerHand.player.direction
        let recoilRotation = this.playerHand.primaryWeapon._currentRecoilOffset.y * direction
        const projectedPlayerPos = Camera.getInstance().viewport.toScreen(this.playerHand.player.position)
        const playerX = projectedPlayerPos.x
        const playerY = projectedPlayerPos.y
        
        const angle = Math.atan2(this.mousePos.y - playerY, this.mousePos.x - playerX)
        const halfACircleInRadians = 3.14159
        
        recoilRotation *= this.playerHand.primaryWeapon.recoilRandomizer

        this.targetRotation = direction === Direction.Right ? angle : angle - halfACircleInRadians
        this.playerHand.rotation = direction === Direction.Right ? angle : angle - halfACircleInRadians

        this.playerHand.rotation += recoilRotation
    }

    trackMousePosition() {
        InputProcessor.on('mousemove', (event: MouseEvent) => {
            this.mousePos.x = event.clientX
            this.mousePos.y = event.clientY
        })
    }
}
