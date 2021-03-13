import * as PIXI from 'pixi.js'
import { Key } from 'ts-keycode-enum'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Fonts } from '../../asset/Fonts'
import { Sprite } from '../../engine/display/Sprite'
import { TextSprite, TextSpriteAlign } from '../../engine/display/TextSprite'
import { InGameTooltip, InGameTooltipOptions } from './InGameTooltip'
import { Animator, IAnimator } from '../../engine/display/Animator'
import { Tween } from '../../engine/display/tween/Tween'
import { PredefinedTweens } from '../../engine/display/tween/PredefinedTweens'

export interface KeyTooltipOptions extends InGameTooltipOptions {
}

export interface IKeyTooltip extends InGameTooltip {
}

export class KeyTooltip extends InGameTooltip implements IKeyTooltip {
    animator: IAnimator
    keyText: TextSprite
    showAnimation: TweenLite
    hideAnimation: TweenLite
    originalY: number

    constructor(options: KeyTooltipOptions) {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.TOOLTIP_KEY))
        const keyText = options.text.text
        const swipeUpAnim = PredefinedTweens.SwipeUp

        options.backgroundSprite = new Sprite({ texture })
        options.text = {
            text: keyText,
            fontSize: 12,
            fontFamily: Fonts.Font.family,
            align: TextSpriteAlign.Center
        }
        super(options)

        this.originalY = this.tooltipContainer.y
        this.tooltipContainer.y = swipeUpAnim.offsetY

        this.showAnimation = Tween.to(this.tooltipContainer, {
            y: this.originalY,
            duration: swipeUpAnim.duration,
            ease: swipeUpAnim.ease,
            alpha: 1,
        })

        this.hideAnimation = Tween.to(this.tooltipContainer, {
            y: this.originalY + swipeUpAnim.offsetY,
            duration: swipeUpAnim.duration,
            ease: swipeUpAnim.ease,
            alpha: 0
        })
        
        this.animator = new Animator()
    }

    update() {
        super.update()
    }

    async show() {
        this.animator.currentAnimation = this.showAnimation
        this.alpha = 1
        await this.animator.currentAnimation.play()
    }

    async hide() {
        this.animator.currentAnimation = this.hideAnimation
        await this.animator.currentAnimation.play()
        this.alpha = 0
    }
}
