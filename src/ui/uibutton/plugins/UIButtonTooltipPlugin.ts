import { Animator, IAnimator } from '../../../engine/display/Animator'
import { TextSpriteOptions } from '../../../engine/display/TextSprite'
import { TextStyles } from '../../../engine/display/TextStyles'
import { FourWayDirection } from '../../../engine/math/Direction'
import { IVector2, Vector2 } from '../../../engine/math/Vector2'
import { AnimDefaults, UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { UIText } from '../../UIText'
import { IUIButton } from '../UIButton'
import { Tween } from '../../../engine/display/tween/Tween'
import { PredefinedTweens } from '../../../engine/display/tween/PredefinedTweens'

export interface IUIButtonTooltipPlugin extends IUIComponent {
    initialize(): void
}

export interface UIButtonToolipOptions extends TextSpriteOptions {
    xOffset?: number
    yOffset?: number
    side?: FourWayDirection
    showOnHover?: boolean
}

export class UIButtonTooltipPlugin extends UIComponent implements IUIButtonTooltipPlugin {
    button: IUIButton
    tooltipOptions: UIButtonToolipOptions
    textComponent?: UIText
    basePosition: IVector2 = new Vector2(0, 0)
    animator: IAnimator
    showAnimation?: TweenLite

    constructor(button: IUIButton, options: UIButtonToolipOptions) {
        super()

        this.button = button
        this.tooltipOptions = this.applyDefaults(options)
        this.animator = new Animator()
    }

    initialize() {
        this.textComponent = new UIText(this.tooltipOptions)
        this.addChild(this.textComponent)

        if (this.direction === FourWayDirection.Down || this.direction === FourWayDirection.Up) {
            this.basePosition.x = this.button.middleX - this.textComponent.halfTextWidth
        } else {
            this.basePosition.y = this.button.middleY - this.textComponent.halfTextHeight
        }

        const offset = this.tooltipOptions.showOnHover ? this.swipeTween.offset : 0
        
        switch (this.direction) {
            case FourWayDirection.Down:
                this.basePosition.y = this.button.bottom - this.textComponent.textHeight + UIDefaults.UIMargin - offset
                break
            case FourWayDirection.Up:
                this.basePosition.y = this.button.top - this.textComponent.textHeight - UIDefaults.UIMargin - offset
                break
            case FourWayDirection.Left:
                this.basePosition.x = this.button.left - this.textComponent.halfTextWidth - UIDefaults.UIMargin - offset
                break
            case FourWayDirection.Right:
                this.basePosition.x = this.button.right + UIDefaults.UIMargin - offset
                break
        }

        if (this.tooltipOptions.showOnHover) {
            const offsetX = FourWayDirection.isHorizontal(this.direction) ? this.swipeTween.offset / 2 : 0
            const offsetY = FourWayDirection.isVertical(this.direction) ? this.swipeTween.offset / 2 : 0

            this.textComponent.forceHide()

            this.showAnimation = Tween.to(this.textComponent, {
                alpha: 1,
                x: this.basePosition.x + offsetX,
                y: this.basePosition.y + offsetY,
                duration: AnimDefaults.duration,
            })

            this.button.extendedOnHover = () => {
                this.show()
            }
            this.button.extendedOnMouseOut = () => {
                this.hide()
            }
        }

        this.reposition()
    }

    async show() {
        super.show()
        
        if (this.showAnimation) {
            this.animator.currentAnimation = this.showAnimation
            this.animator.play()
        } else {
            this.alpha = 1
        }
    }

    async hide() {
        super.hide()

        if (this.showAnimation) {
            this.animator.currentAnimation = this.showAnimation
            this.animator.playInReverse(0)
        } else {
            this.alpha = 0
        }
    }

    reposition() {
        super.reposition()

        if (this.textComponent) {
            let newX = this.basePosition.x
            let newY = this.basePosition.y

            newX += this.xOffset
            newY += this.yOffset

            this.textComponent.position.set(newX, newY)
        }
    }

    private applyDefaults(options: UIButtonToolipOptions): UIButtonToolipOptions {
        options.style = options.style ?? TextStyles.UIButton.TooltipMedium
        options.side = options.side ?? FourWayDirection.Down

        return options
    }

    get direction() {
        return this.tooltipOptions.side
    }

    get xOffset() {
        return this.tooltipOptions.xOffset ?? 0
    }

    get yOffset() {
        return this.tooltipOptions.yOffset ?? 0
    }

    get swipeTween() {
        return PredefinedTweens.Swipe
    }
}
