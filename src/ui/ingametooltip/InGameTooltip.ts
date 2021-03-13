import { resolveModuleName } from 'typescript'
import { Sprite } from '../../engine/display/Sprite'
import { TextSprite, TextSpriteAlign, TextSpriteOptions } from '../../engine/display/TextSprite'
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
    text?: TextSpriteOptions
    position?: IVector2
    targetToFollow?: TooltipFollowOptions
    backgroundSprite?: Sprite
    hideByDefault?: boolean
}

export class InGameTooltip extends UIComponent implements IInGameTooltip {
    targetToFollow?: ITargetToFollow
    backgroundSprite?: Sprite
    textSprite?: TextSprite
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

        if (options.text !== undefined) {
            this.textSprite = new TextSprite(options.text)

            if (options.text.align === TextSpriteAlign.Center) {
                this.textSprite.position.x += (this.backgroundWidth / 2) - this.textSprite.halfTextWidth
            }

            this.addChild(this.textSprite)
        }

        if (options.hideByDefault === true) {
            this.alpha = 0
        }
    }

    update() {
        if (this.targetToFollow !== undefined) {
            const targetWidth = this.targetToFollow.width ?? 0
            const newX = this.targetToFollow.x
                + (this.shouldCenter ? (targetWidth / 2) - (this.backgroundWidth / 2)
                : 0) + this.xOffset
            const newY = this.targetToFollow.y
                - this.backgroundHeight - UIConstants.TooltipMargin + this.yOffset

            this.position.set(newX, newY)
        }
    }

    show(): Promise<void> {
        return new Promise((resolve) => {
            this.alpha = 1

            resolve()
        })
    }

    hide(): Promise<void> {
        return new Promise((resolve) => {
            this.alpha = 0

            resolve()
        })
    }

    get backgroundWidth() {
        return this.backgroundSprite ? this.backgroundSprite.width : 0
    }

    get backgroundHeight() {
        return this.backgroundSprite ? this.backgroundSprite.height : 0
    }
}
