import { Container } from 'pixi.js'
import { WindowSize } from '../../../utils/Constants'
import { Graphix } from '../Graphix'

export interface IDarkener {

}

export interface DarkenerOptions {
    width?: number
    height?: number
    alpha?: number
}

export class Darkener extends Container implements IDarkener {
    constructor(options?: DarkenerOptions) {
        super()

        const op = {
            width: options && options.width ? options.width : WindowSize.width,
            height: options && options.height ? options.height : WindowSize.height,
            alpha: options && options.alpha ? options.alpha : 0.5
        }

        this.createRect(op)
    }

    createRect(options: DarkenerOptions) {
        const graphics = new Graphix()

        graphics.beginFill(0x1e1e1e)//000000)
        graphics.drawRect(0, 0, options.width, options.height)
        graphics.endFill()

        graphics.blendMode = PIXI.BLEND_MODES.SUBTRACT//.DARKEN

        this.addChild(graphics)

        this.alpha = options.alpha
    }
}
