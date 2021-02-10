import * as PIXI from 'pixi.js'
import { IUpdatable } from '../../interface/IUpdatable'
import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { IContainer, Container } from '../../engine/display/Container'
import { IClientPlayer } from './ClientPlayer'
import { IPlayerBodyAnimator, PlayerBodyAnimator } from './PlayerBodyAnimator'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { Direction } from '../../engine/math/Direction'

export interface IPlayerBody extends IContainer, IUpdatable {
    sprite: PIXI.Sprite
    currentShown?: PIXI.AnimatedSprite | Sprite
    animator: IPlayerBodyAnimator
    showRunningSprite(): void
    showJumpingSprite(): void
    showIdleSprite(): void
}

export interface PlayerBodyOptions {
    player: IClientPlayer
}

export class PlayerBody extends Container implements IPlayerBody {
    animator: IPlayerBodyAnimator
    _sprite: Sprite
    _walkingSprite: PIXI.AnimatedSprite
    _jumpingSprite: PIXI.AnimatedSprite
    currentShown?: PIXI.AnimatedSprite | Sprite
    currentDirection: Direction = Direction.Right

    constructor(options: PlayerBodyOptions) {
        super()

        this.animator = new PlayerBodyAnimator({
            player: options.player,
            playerBody: this
        })

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_IDLE))
        this._sprite = new Sprite({ texture })
        this._sprite.anchor.set(0.5, 0.5)

        this._walkingSprite = this.animator.walkingSprite
        this._jumpingSprite = this.animator.jumpingSprite
        
        this.addChild(this.sprite)
        this.addChild(this._walkingSprite)
        this.addChild(this._jumpingSprite)
    }

    update() {
        this.animator.update()
    }

    showRunningSprite() {
        if (this.currentShown !== this._walkingSprite) {
            this._walkingSprite.gotoAndStop(0)
            this.currentShown = this._walkingSprite
        }

        this._sprite.alpha = 0
        this._jumpingSprite.alpha = 0
        this._walkingSprite.alpha = 1
        this._walkingSprite.play()
    }

    showIdleSprite() {
        if (this.currentShown !== this._sprite) {
            this.currentShown = this._sprite
        }

        this._sprite.alpha = 1
        this._walkingSprite.alpha = 0
        this._jumpingSprite.alpha = 0
        this._walkingSprite.stop()
    }

    showJumpingSprite() {
        if (this.currentShown !== this._jumpingSprite) {
            this._jumpingSprite.gotoAndPlay(0)
            this.currentShown = this._jumpingSprite
        } else {
            return
        }

        this._sprite.alpha = 0
        this._walkingSprite.alpha = 0
        this._jumpingSprite.alpha = 1
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
