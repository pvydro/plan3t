import { Assets, AssetUrls } from '../../../asset/Assets'
import { IClientPlayer, PlayerConsciousnessState } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { Tween } from '../../../engine/display/tween/Tween'
import { Easing } from '../../../engine/display/tween/TweenEasing'
import { IUpdatable } from '../../../interface/IUpdatable'
import { UIComponent } from '../../UIComponent'
import { ICanDie } from '../../../interface/ICanDie'
import { Flogger } from '../../../service/Flogger'
import { PredefinedTweens } from '../../../engine/display/tween/PredefinedTweens'

export interface IOverheadHealthBar extends IUpdatable, ICanDie {

}

export interface OverheadHealthBarOptions {
    player: IClientPlayer
}

export class OverheadHealthBar extends UIComponent implements IOverheadHealthBar {
    backgroundSprite: Sprite
    player: IClientPlayer
    fillSprite: Sprite
    fillSpriteWidth: number
    targetFillPercentage: number = 1
    fillPercentage: number = this.targetFillPercentage
    fillDivisor: number = 2
    dead: boolean = false

    deadDisappearAnimation: TweenLite
    shineAnimation: TweenLite
    shakeAnimation: TweenLite
    shakeAnimationAmount: number = 2

    constructor(options: OverheadHealthBarOptions) {
        super()
        const ogX = this.x
        const swipeUpAnim = PredefinedTweens.Swipe

        this.player = options.player

        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.OverheadHealthBarBg))
        this.backgroundSprite = new Sprite({
            texture: backgroundTexture
        })
        this.backgroundSprite.anchor.set(0.5, 0.5)

        const fillTexture = PIXI.Texture.from(Assets.get(AssetUrls.OverheadHealthBarFill))
        this.fillSprite = new Sprite({
            texture: fillTexture,
            includeOverlay: {
                color: 0xFFFFFF
            }
        })
        this.fillSprite.anchor.set(0, 0.5)
        this.fillSprite.x = -this.backgroundSprite.halfWidth + 3
        this.fillSpriteWidth = this.fillSprite.width

        this.addChild(this.backgroundSprite)
        this.addChild(this.fillSprite)

        this.position.y = -32

        // Dead disappear animation
        this.deadDisappearAnimation = Tween.to(this.backgroundSprite, {
            duration: swipeUpAnim.duration,
            ease: swipeUpAnim.ease,
            alpha: 0,
            y: this.backgroundSprite.y - swipeUpAnim.offset
        })

        // Hit shine animation
        this.shineAnimation = Tween.to(this.fillSprite.overlayGraphic, {
            duration: 0.5,
            ease: Easing.EaseOutCubic,
            alpha: 0
        })

        // Hit shake animation
        this.shakeAnimation = Tween.to(this, {
            repeat: 4,
            duration: .05,
            x: this.shakeAnimationAmount,
            yoyo: true,
            ease: Easing.EaseInOutQuad,
            onComplete() {
                Tween.to(this, {
                    x: ogX,
                    duration: 0.5 * 2,
                }).play()
            }
        }).play()

        this.hide({ delay: 1000 })
    }

    update() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Dead) {
            this.die()
        } else {
            this.resetDeadAnimation()
        }

        if (this.targetFillPercentage !== this.player.healthPercentage) {
            this.triggerHealthDrop()
        }

        if (this.fillPercentage !== this.targetFillPercentage) {
            this.fillPercentage += (this.targetFillPercentage - this.fillPercentage) / this.fillDivisor
    
            // Cap outat 0.01 breakpoint
            if (this.fillPercentage < this.targetFillPercentage + 0.01) this.fillPercentage = this.targetFillPercentage

            this.fillSprite.width = this.fillSpriteWidth * this.fillPercentage
        }
    }

    private triggerHealthDrop() {
        this.showFor(500)

        this.targetFillPercentage = this.player.healthPercentage

        this.triggerShineAnimation()
        this.triggerShakeAnimation()
    }

    private triggerShineAnimation() {
        this.fillSprite.overlayGraphic.alpha = 0.75

        this.shineAnimation.restart()
        this.shineAnimation.play()
    }

    triggerShakeAnimation() {
        this.shakeAnimation.restart()
        this.shakeAnimation.play()
    }
    
    die() {
        if (!this.dead) {
            this.dead = true
            this.deadDisappearAnimation.play()
        }
    }

    resetDeadAnimation() {
        if (!this.dead) return

        this.dead = false

        this.deadDisappearAnimation.restart()
        this.deadDisappearAnimation.pause()
    }
}
