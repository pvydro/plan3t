import * as PIXI from 'pixi.js'
import { IUpdatable } from '../../interface/IUpdatable'
import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { IContainer, Container } from '../../engine/display/Container'
import { IClientPlayer } from './ClientPlayer'
import { IPlayerBodyAnimator, PlayerBodyAnimator } from './PlayerBodyAnimator'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { Direction } from '../../engine/math/Direction'
import { AnimatedSprite } from '../../engine/display/AnimatedSprite'

export interface IPlayerBody extends IContainer, IUpdatable {
    sprite: PIXI.Sprite
    currentShown?: PIXI.AnimatedSprite | Sprite
    animator: IPlayerBodyAnimator
    showRunningSprite(): void
    showJumpingSprite(): void
    showIdleSprite(): void
    showDyingSprite(): void
}

export interface PlayerBodyOptions {
    player: IClientPlayer
}

export class PlayerBody extends Container implements IPlayerBody {
    _sprite: Sprite
    _walkingSprite: AnimatedSprite
    _jumpingSprite: AnimatedSprite
    _dyingSprite: AnimatedSprite
    player: IClientPlayer
    animator: IPlayerBodyAnimator
    currentShown?: AnimatedSprite | Sprite
    currentDirection: Direction = Direction.Right

    constructor(options: PlayerBodyOptions) {
        super()

        this.player = options.player

        this.animator = new PlayerBodyAnimator({
            player: options.player,
            playerBody: this
        })

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_IDLE))
        this._sprite = new Sprite({ texture })
        this._sprite.anchor.set(0.5, 0.5)

        this._walkingSprite = this.animator.walkingSprite
        this._jumpingSprite = this.animator.jumpingSprite
        this._dyingSprite = this.animator.dyingSprite
        
        this.addChild(this.sprite)
        this.addChild(this._walkingSprite)
        this.addChild(this._jumpingSprite)
        this.addChild(this._dyingSprite)
    }

    update() {
        this.animator.update()
    }

    showRunningSprite() {
        if (this.currentShown !== this._walkingSprite) {
            this._walkingSprite.gotoAndStop(0)
            this.currentShown = this._walkingSprite
        }

        this.hideAllExcept(this._walkingSprite)
        this._walkingSprite.play()
    }

    showIdleSprite() {
        if (this.currentShown !== this._sprite) {
            this.currentShown = this._sprite
        }

        this.hideAllExcept(this._sprite)
    }

    showJumpingSprite() {
        if (this.currentShown !== this._jumpingSprite) {
            this._jumpingSprite.gotoAndPlay(0)
            this.currentShown = this._jumpingSprite
        } else {
            return
        }

        this.hideAllExcept(this._jumpingSprite)
    }

    showDyingSprite() {
        if (this.currentShown !== this._dyingSprite) {
            this.player.controller.forceTriggerJump()
            this._dyingSprite.gotoAndPlay(0)
            this.currentShown = this._dyingSprite
        } else {
            return
        }

        this.hideAllExcept(this._dyingSprite)
    }

    hideAllExcept(shownSprite: any) {
        const hideable = [
            this._sprite, this._walkingSprite, this._dyingSprite, this._jumpingSprite
        ]

        for (var i in hideable) {
            const hideElement = hideable[i]

            if (hideElement !== shownSprite) {
                hideElement.alpha = 0
            }
        }

        shownSprite.alpha = 1
    }

    get sprite() {
        return this._sprite
    }

    set sprite(value: any) {
        this._sprite = value
    }

    set direction(value: Direction) {
        if (this.currentDirection !== value) {
            this.flipAllSprites()
        }
        this.currentDirection = value
    }

    flipAllSprites() {
        this._sprite.scale.x *= -1
        this._walkingSprite.scale.x *= -1
        this._jumpingSprite.scale.x *= -1
    }
}
