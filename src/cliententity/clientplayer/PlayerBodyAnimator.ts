import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'
import { IUpdatable } from '../../interface/IUpdatable'
import { PlayerEvents } from '../../model/events/Events'
import { IClientPlayer } from './ClientPlayer'
import { PlayerBodyState, PlayerConsciousnessState, PlayerLegsState } from './ClientPlayerState'
import { IPlayerBody } from './PlayerBody'

export interface IPlayerBodyAnimator extends IUpdatable {
    walkingSprite: AnimatedSprite
    jumpingSprite: AnimatedSprite
    dyingSprite: AnimatedSprite
}

export interface PlayerBodyAnimatorOptions {
    player: IClientPlayer
    playerBody: IPlayerBody
}

export class PlayerBodyAnimator implements IPlayerBodyAnimator {
    playerBody: IPlayerBody
    player: IClientPlayer
    walkingSprite: AnimatedSprite
    jumpingSprite: AnimatedSprite
    dyingSprite: AnimatedSprite
    _emittedLoopEvent: boolean = false

    constructor(options: PlayerBodyAnimatorOptions) {
        this.playerBody = options.playerBody
        this.player = options.player

        this.buildAnimatedSprites()
    }

    update() {
        const bodyState = this.player.bodyState
        const legsState = this.player.legsState
        const consciousnessState = this.player.consciousnessState

        if (consciousnessState === PlayerConsciousnessState.Dead) {
            
            if (this.playerBody.currentShown !== this.playerBody.animator.dyingSprite) {
                this.playerBody.showDyingSprite()
            }

        } else if (legsState === PlayerLegsState.Jumping) {

            if (this.playerBody.currentShown !== this.playerBody.animator.jumpingSprite) {
                this.playerBody.showJumpingSprite()
            }

        } else {
            switch (bodyState) {
                case PlayerBodyState.Idle:

                    this.playerBody.showIdleSprite()

                    break
                case PlayerBodyState.Sprinting:
                case PlayerBodyState.Walking:

                    this.playerBody.showWalkingSprite()

                    break
            }
        }
    }

    buildAnimatedSprites() {
        const walkingSheet = Spritesheets.get(SpritesheetUrls.PlayerBodyWalking)
        const jumpingSheet = Spritesheets.get(SpritesheetUrls.PlayerBodyJumping)
        const dyingSheet = Spritesheets.get(SpritesheetUrls.PlayerBodyDying)
        
        // Walking animation
        this.walkingSprite = new AnimatedSprite({
            sheet: walkingSheet.animations['tile'],
            animationSpeed: 0.25,
            loop: true
        })
        this.walkingSprite.anchor.set(0.5, 0.5)

        // Walking head bob emitter
        this.walkingSprite.onFrameChange = () => {
            if (this.walkingSprite.currentFrame == Math.floor(this.walkingSprite.totalFrames / 2) - 1
            || this.walkingSprite.currentFrame == this.walkingSprite.totalFrames - 1) {
                this.player.emitter.emit(PlayerEvents.PlayerWalkBounce)
            }
        }

        // Jumping animation
        this.jumpingSprite = new AnimatedSprite({
            sheet: jumpingSheet.animations['tile'],
            animationSpeed: 0.1,
            loop: false
        })
        this.jumpingSprite.anchor.set(0.5, 0.5)

        // Dying animation
        this.dyingSprite = new AnimatedSprite({
            sheet: dyingSheet.animations['tile'],
            animationSpeed: 0.2,
            loop: false
        })
        this.dyingSprite.anchor.set(0.5, 0.5)
    }
}
