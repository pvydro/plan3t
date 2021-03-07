import { rect } from '../../../utils/Utils'
import { FourWayDirection } from '../../math/Direction'
import { IRect } from '../../math/Rect'
import { Container } from '../Container'
import { Graphix } from '../Graphix'

export interface IRectGradient {
    configure(options: RectGradientOptions)
}

export interface RectGradientDefinition {
    rect: IRect
    direction: FourWayDirection
}

export interface RectGradientOptions {
    definition: RectGradientDefinition
    totalGradientRays?: number
    direction?: FourWayDirection
}

export class RectGradient extends Container implements IRectGradient {
    totalGradientRays: number
    parentRect: IRect
    rayGraphics: Graphix[]

    constructor(options: RectGradientOptions) {
        super()

        this.rayGraphics = []

        this.configure(options)
    }

    configure(options: RectGradientOptions) {
        this.parentRect = options.definition.rect ?? { x: 0, y: 0, width: 32, height: 16 }
        this.totalGradientRays = options.totalGradientRays ?? 5

        const direction = options.direction ?? FourWayDirection.Down
        const rayWidth = FourWayDirection.isHorizontal(direction)
            ? this.parentRect.width / this.totalGradientRays : this.parentRect.width
        const rayHeight = FourWayDirection.isVertical(direction)
            ? this.parentRect.height / this.totalGradientRays : this.parentRect.height
        const rayAlpha = 0.1
        
        for (var i = 0; i < this.totalGradientRays; i++) {
            // const newHeight = rayHeight * (i + 1)
            const rayGraphic = new Graphix()
            const calculatedRayHeight = rayHeight * (i + 1)
            const rayRect = rect(0, 0, rayWidth, calculatedRayHeight)
            
            rayGraphic.beginFill(0x000000)
            // rayGraphic.drawIRect({ x: 0, y: 0, width: 16, height: 16 })
            rayGraphic.drawIRect(rayRect)
            rayGraphic.endFill()
            rayGraphic.alpha = rayAlpha

            this.rayGraphics.push(rayGraphic)
            this.addChild(rayGraphic)
        }
    }
}
