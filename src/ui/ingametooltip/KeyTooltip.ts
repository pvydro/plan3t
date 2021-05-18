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
import { Easing } from '../../engine/display/tween/TweenEasing'
import { TextStyles } from '../../engine/display/TextStyles'

export interface KeyTooltipOptions extends InGameTooltipOptions {
    
}

export interface IKeyTooltip extends InGameTooltip {
    
}

export class KeyTooltip extends InGameTooltip implements IKeyTooltip {
    animator: IAnimator
    keyText: TextSprite
    showAnimation: TweenLite
    hideAnimation: TweenLite
    usedAnimation: TweenLite
    originalY: number

    constructor(options: KeyTooltipOptions) {
        const texture = PIXI.Texture.from(Assets.get(AssetUrls.TooltipKey))
        const keyText = options.text.text
        const swipeAnim = PredefinedTweens.Swipe

        options.backgroundSprite = new Sprite({ texture })
        options.text = {
            text: keyText,
            align: TextSpriteAlign.Center,
            style: TextStyles.KeyTooltip
        }
        super(options)

        this.originalY = this.tooltipContainer.y
        this.tooltipContainer.y = swipeAnim.offset

        this.showAnimation = Tween.to(this.tooltipContainer, {
            y: this.originalY,
            duration: swipeAnim.duration,
            ease: swipeAnim.ease,
            alpha: 1,
        })
        this.hideAnimation = Tween.to(this.tooltipContainer, {
            y: this.originalY + swipeAnim.offset,
            duration: swipeAnim.duration,
            ease: swipeAnim.ease,
            alpha: 0
        })
        this.usedAnimation = Tween.to(this.tooltipContainer, {
            y: this.originalY - swipeAnim.offset,
            duration: 1,
            ease: Easing.EaseInQuint,
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
        await this.animator.play()
    }

    async hide() {
        this.animator.currentAnimation = this.hideAnimation
        await this.animator.play()
        this.alpha = 0
    }

    async used() {
        this.animator.currentAnimation = this.usedAnimation
        await this.animator.play()
        this.alpha = 0
    }
}
