import { IRect } from '../../math/Rect'
import { Container } from '../Container'
import { Graphix } from '../Graphix'

export interface IRectGradient {
    configure(options: RectGradientOptions)
}

export interface RectGradientOptions {
    rect: IRect
    totalGradientRays?: number
}

export class RectGradient extends Container implements IRectGradient {
    totalGradientRays: number
    parentRect: IRect
    rayGraphics: Graphix[]

    constructor(options: RectGradientOptions) {
        super()

        this.configure(options)
    }

    configure(options: RectGradientOptions) {
        this.parentRect = options.rect ?? { x: 0, y: 0, width: 32, height: 16 }
        this.totalGradientRays = options.totalGradientRays ?? 5

        const rayWidth = this.parentRect.width
        const rayHeight = this.parentRect.height / this.totalGradientRays
        
        for (var i = 0; i < this.totalGradientRays; i++) {
            const newHeight = rayHeight * (i + 1)
            const rayGraphic = new Graphix()

            rayGraphic.beginFill(0xFFFFFF)
            rayGraphic.drawIRect({ x: 0, y: 0, width: rayWidth, height: newHeight })
            rayGraphic.endFill()

            this.rayGraphics.push(rayGraphic)
            this.addChild(rayGraphic)
        }
    }
}
