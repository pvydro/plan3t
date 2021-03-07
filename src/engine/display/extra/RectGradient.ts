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

        const direction = options.definition.direction ?? FourWayDirection.Down
        const isHori = FourWayDirection.isHorizontal(direction)
        const rayWidth = isHori ? (this.parentRect.width / this.totalGradientRays)
            : this.parentRect.width
        const rayHeight = !isHori ? (this.parentRect.height / this.totalGradientRays)
            : this.parentRect.height
        const rayAlpha = 0.1
        
        for (var i = 0; i < this.totalGradientRays; i++) {
            const rayGraphic = new Graphix()
            const calculatedRayHeight = isHori ? rayHeight : rayHeight * (i + 1)
            const calculatedRayWidth = !isHori ? rayWidth : rayWidth * (i + 1)
            const offsetX = direction === FourWayDirection.Right ? this.parentRect.width - calculatedRayWidth : 0
            const rayRect = {
                x: this.parentRect.x + offsetX,
                y: this.parentRect.y, 
                width: calculatedRayWidth, 
                height: calculatedRayHeight
            }
            
            rayGraphic.beginFill(0x000000)
            rayGraphic.drawIRect(rayRect)
            rayGraphic.endFill()
            rayGraphic.alpha = rayAlpha

            this.rayGraphics.push(rayGraphic)
            this.addChild(rayGraphic)
        }
    }
}
