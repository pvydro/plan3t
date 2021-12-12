import { Camera } from '../../../camera/Camera'
import { Direction } from '../../../engine/math/Direction'
import { PlayerHand } from './PlayerHand'
import { IVector2, Vector2 } from '../../../engine/math/Vector2'
import { PlayerConsciousnessState, PlayerLegsState } from '../ClientPlayerState'

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
    }

    update(clientControl: boolean) {
        if (this.player.frozen || this.player.consciousnessState !== PlayerConsciousnessState.Alive) {
            return
        }

        if (clientControl) {
            this.followMouse()
        
            const projectedPos = Camera.Mouse
            this.mousePos.x = projectedPos.x
            this.mousePos.y = projectedPos.y
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
        let recoilRotation = this.playerHand.equippedWeapon
            ? this.playerHand.equippedWeapon._currentRecoilOffset.y * direction : 0
        const projectedPlayerPos = this.playerHand.player.position
        const playerX = projectedPlayerPos.x + this.player.body.halfWidth
        const playerY = projectedPlayerPos.y
        const recoilRandomizer = this.playerHand.equippedWeapon ? this.playerHand.equippedWeapon.recoilRandomizer : 0
        const angle = (Math.atan2(this.mousePos.y - playerY, this.mousePos.x - playerX
            + this.player.body.halfWidth))
        const halfACircleInRadians = 3.14159
        
        recoilRotation *= recoilRandomizer

        this.targetRotation = direction === Direction.Right ? angle : angle - halfACircleInRadians
        this.playerHand.rotation = direction === Direction.Right ? angle : angle - halfACircleInRadians

        this.playerHand.rotation += recoilRotation
    }
    
    get player() {
        return this.playerHand.player
    }
}
