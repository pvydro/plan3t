import { Sprite } from '../../engine/display/Sprite'
import { IVector2 } from '../../engine/math/Vector2'
import { UIConstants } from '../../utils/Constants'
import { IUIComponent, UIComponent, UIComponentOptions } from '../UIComponent'

export enum TooltipType {
    Key
}

export interface IInGameTooltip extends IUIComponent {

}

export interface ITargetToFollow {
    x: number
    y: number
    width?: number
    height?: number
}

export interface TooltipFollowOptions {
    target: ITargetToFollow
    center?: boolean
    xOffset?: number
    yOffset?: number
}

export interface InGameTooltipOptions extends UIComponentOptions {
    type: TooltipType
    text?: string
    position?: IVector2
    targetToFollow?: TooltipFollowOptions
    backgroundSprite?: Sprite
}

export class InGameTooltip extends UIComponent implements IInGameTooltip {
    targetToFollow?: ITargetToFollow
    backgroundSprite?: Sprite
    shouldCenter: boolean
    xOffset: number = 0
    yOffset: number = 0

    constructor(options: InGameTooltipOptions) {
        super(options)

        if (options.targetToFollow !== undefined) {
            this.targetToFollow = options.targetToFollow.target
            this.shouldCenter = options.targetToFollow.center ?? false
            this.xOffset = options.targetToFollow.xOffset ?? 0
            this.yOffset = options.targetToFollow.yOffset ?? 0
        }

        if (options.backgroundSprite !== undefined) {
            this.backgroundSprite = options.backgroundSprite

            this.addChild(this.backgroundSprite)
        }
    }

    update() {
        if (this.targetToFollow !== undefined) {
            const targetWidth = this.targetToFollow.width ?? 0
            const backgroundWidth = this.backgroundSprite ? this.backgroundSprite.width : 0
            const backgroundHeight = this.backgroundSprite ? this.backgroundSprite.height : 0
            const newX = this.targetToFollow.x + (this.shouldCenter ? (targetWidth / 2) - (backgroundWidth / 2) : 0) + this.xOffset
            const newY = this.targetToFollow.y - backgroundHeight - UIConstants.TooltipMargin + this.yOffset

            this.position.set(newX, newY)
        }
    }
}
