import { TextSpriteOptions } from '../../../engine/display/TextSprite'
import { TextStyles } from '../../../engine/display/TextStyles'
import { FourWayDirection } from '../../../engine/math/Direction'
import { IVector2, Vector2 } from '../../../engine/math/Vector2'
import { UIDefaults } from '../../../utils/Defaults'
import { IUIComponent, UIComponent } from '../../UIComponent'
import { IUIContainer, UIContainer } from '../../UIContainer'
import { UIText } from '../../UIText'
import { IUIButton } from '../UIButton'

export interface IUIButtonTooltipPlugin extends IUIComponent {
    initialize(): void
}

export interface UIButtonToolipOptions extends TextSpriteOptions {
    xOffset?: number
    yOffset?: number
    side?: FourWayDirection
}

export class UIButtonTooltipPlugin extends UIComponent implements IUIButtonTooltipPlugin {
    button: IUIButton
    tooltipOptions: UIButtonToolipOptions
    textComponent?: UIText
    basePosition: IVector2 = new Vector2(0, 0)

    constructor(button: IUIButton, options: UIButtonToolipOptions) {
        super()

        this.button = button
        this.tooltipOptions = this.applyDefaults(options)
    }

    initialize() {
        this.textComponent = new UIText(this.tooltipOptions)
        this.addChild(this.textComponent)

        if (this.direction === FourWayDirection.Down || this.direction === FourWayDirection.Up) {
            this.basePosition.x = this.button.middleX - this.textComponent.halfTextWidth
        } else {
            this.basePosition.y = this.button.middleY - this.textComponent.halfTextHeight
        }
        
        switch (this.direction) {
            case FourWayDirection.Down:
                this.basePosition.y = this.button.bottom - this.textComponent.textHeight + UIDefaults.UIMargin
                break
            case FourWayDirection.Up:
                this.basePosition.y = this.button.top - this.textComponent.textHeight - UIDefaults.UIMargin
                break
            case FourWayDirection.Left:
                this.basePosition.x = this.button.left - this.textComponent.textWidth - UIDefaults.UIMargin
                break
            case FourWayDirection.Right:
                this.basePosition.x = this.button.right + UIDefaults.UIMargin
                break
        }

        this.reposition()
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
        options.style = options.style ?? TextStyles.UIButton.TooltipSmall
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
}
