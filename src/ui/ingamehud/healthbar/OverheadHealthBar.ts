import { Assets, AssetUrls } from '../../../asset/Assets'
import { IClientPlayer } from '../../../cliententity/clientplayer/ClientPlayer'
import { Sprite } from '../../../engine/display/Sprite'
import { Tween } from '../../../engine/display/tween/Tween'
import { Easing } from '../../../engine/display/tween/TweenEasing'
import { IUpdatable } from '../../../interface/IUpdatable'
import { UIComponent } from '../../UIComponent'

export interface IOverheadHealthBar extends IUpdatable {

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

    constructor(options: OverheadHealthBarOptions) {
        super()

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
    }

    update() {
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
        const shineAnimationTarget = this.fillSprite.overlayGraphic
        shineAnimationTarget.alpha = 0.75

        const shineAnimation = Tween.to(shineAnimationTarget, {
            duration: 0.5,
            ease: Easing.EaseOutCubic,
            alpha: 0
        })

        shineAnimation.play()
    }

    triggerShakeAnimation() {
        const target = this
        const ogX = this.x
        const shakeAmt = 2
        const duration = .05

        Tween.to(target, {
            repeat: 4,
            duration: duration,
            x: shakeAmt,
            yoyo: true,
            ease: Easing.EaseInOutQuad,
            onComplete() {
                Tween.to(target, {
                    x: ogX,
                    duration: duration * 2,
                }).play()
            }
        }).play()

    }
}
