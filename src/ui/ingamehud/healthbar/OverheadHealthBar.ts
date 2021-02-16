import { Assets, AssetUrls } from '../../../asset/Assets'
import { IClientPlayer, PlayerConsciousnessState } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { Tween } from '../../../engine/display/tween/Tween'
import { Easing } from '../../../engine/display/tween/TweenEasing'
import { IUpdatable } from '../../../interface/IUpdatable'
import { UIComponent } from '../../UIComponent'
import { ICanDie } from '../../../interface/ICanDie'
import { Flogger } from '../../../service/Flogger'

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

        this.player = options.player

        const backgroundTexture = PIXI.Texture.from(Assets.get(AssetUrls.OVERHEAD_HEALTHB_BAR_BG))
        this.backgroundSprite = new Sprite({
            texture: backgroundTexture
        })
        this.backgroundSprite.anchor.set(0.5, 0.5)

        const fillTexture = PIXI.Texture.from(Assets.get(AssetUrls.OVERHEAD_HEALTHB_BAR_FILL))
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
            y: this.backgroundSprite.y - 12,
            alpha: 0,
            duration: 1,
            ease: Easing.Power4EaseOut
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
    }

    update() {
        if (this.player.consciousnessState === PlayerConsciousnessState.Dead) {
            this.triggerDeadAnimation()
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
    
    triggerDeadAnimation() {
        if (!this.dead) {
            this.dead = true
            this.deadDisappearAnimation.play()
        }
    }
}
