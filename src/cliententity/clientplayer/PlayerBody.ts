import * as PIXI from 'pixi.js'
import { IUpdatable } from '../../interface/IUpdatable'
import { Spritesheets, SpritesheetUrls } from '../../asset/Spritesheets'
import { IContainer, Container } from '../../engine/display/Container'
import { IClientPlayer } from './ClientPlayer'
import { IPlayerBodyAnimator, PlayerBodyAnimator } from './PlayerBodyAnimator'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Sprite } from '../../engine/display/Sprite'
import { Direction } from '../../math/Direction'

export interface IPlayerBody extends IContainer, IUpdatable {
    sprite: PIXI.Sprite
    showRunningSprite(): void
    showIdleSprite(): void
}

export interface PlayerBodyOptions {
    player: IClientPlayer
}

export class PlayerBody extends Container implements IPlayerBody {
    animator: IPlayerBodyAnimator
    _sprite: PIXI.Sprite
    _runningSprite: PIXI.AnimatedSprite
    currentShown?: any
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

        this._runningSprite = this.animator.runningSprite
        
        this.addChild(this.sprite)
        this.addChild(this._runningSprite)
    }

    update() {
        this.animator.update()
    }

    showRunningSprite() {
        if (this.currentShown !== this._runningSprite) {
            this._runningSprite.gotoAndStop(0)
            this.currentShown = this._runningSprite
        }

        this._sprite.alpha = 0
        this._runningSprite.alpha = 1
        this._runningSprite.play()
    }

    showIdleSprite() {
        if (this.currentShown !== this._sprite) {
            this.currentShown = this._sprite
        }

        this._sprite.alpha = 1
        this._runningSprite.alpha = 0
        this._runningSprite.stop()
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
        this._runningSprite.scale.x *= -1
    }
}
