import { Container } from 'pixi.js'
import { IDemolishable } from '../../../interface/IDemolishable'
import { UIComponent } from '../../../ui/UIComponent'
import { GameWindow } from '../../../utils/Constants'
import { Graphix } from '../Graphix'

export interface IDarkener extends IDemolishable {

}

export interface DarkenerOptions {
    width?: number
    height?: number
    alpha?: number
    color?: number
    blendMode?: any
}

export class Darkener extends UIComponent implements IDarkener {
    graphics: Graphix

    constructor(options?: DarkenerOptions) {
        super()

        const op = {
            width: options && options.width ? options.width : GameWindow.width,
            height: options && options.height ? options.height : GameWindow.height,
            alpha: options && options.alpha ? options.alpha : 0.5,
            color: options && options.color ? options.color : 0x1e1e1e,
            blendMode: options && options.blendMode ? options.blendMode : PIXI.BLEND_MODES.SUBTRACT
        }

        this.alpha = options.alpha
        this.graphics = this.createRect(op)
        this.addChild(this.graphics)
    }

    createRect(options: DarkenerOptions): Graphix {
        const graphics = new Graphix()

        graphics.beginFill(options.color)
        graphics.drawRect(0, 0, options.width, options.height)
        graphics.endFill()

        graphics.blendMode = options.blendMode

        return graphics
    }

    forceHide() {
        this.alpha = 0

        super.forceHide()
    }

    demolish() {
        this.removeChild(this.graphics)
        this.graphics.demolish()
    }
}
