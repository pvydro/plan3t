import { Sprite } from '../../engine/display/Sprite'
import { IVector2 } from '../../engine/math/Vector2'
import { IUIComponent, UIComponent, UIComponentOptions } from '../UIComponent'

export enum TooltipType {
    Key
}

export interface IInGameTooltip extends IUIComponent {

}

export interface InGameTooltipOptions extends UIComponentOptions {
    type: TooltipType
    text?: string
    position?: IVector2
    targetToFollow?: IVector2
    backgroundSprite?: Sprite
}

export class InGameTooltip extends UIComponent implements IInGameTooltip {
    targetToFollow?: IVector2
    backgroundSprite?: Sprite

    constructor(options: InGameTooltipOptions) {
        super(options)

        if (options.targetToFollow !== undefined) {
            this.targetToFollow = options.targetToFollow

            this.position.set(this.targetToFollow.x, this.targetToFollow.y)
        }

        if (options.backgroundSprite !== undefined) {
            this.backgroundSprite = options.backgroundSprite
            
            this.addChild(this.backgroundSprite)
        }
    }

    update() {
        if (this.targetToFollow !== undefined) {

        }
    }
}
