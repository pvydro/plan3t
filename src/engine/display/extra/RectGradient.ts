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
    rayAlpha?: number
}

export class RectGradient extends Container implements IRectGradient {
    totalGradientRays: number
    parentRect: IRect
    rayGraphics: Graphix[]

    constructor(options: RectGradientOptions) {
        super()

        this.rayGraphics = []
        
        options.rayAlpha = options.rayAlpha ?? 0.1
        this.configure(options)
    }

    configure(options: RectGradientOptions) {
        this.parentRect = options.definition.rect ?? { x: 0, y: 0, width: 32, height: 16 }
        this.totalGradientRays = options.totalGradientRays ?? 5

        const direction = options.definition.direction
        const isHori = FourWayDirection.isHorizontal(direction)
        const rayWidth = isHori ? (this.parentRect.width / this.totalGradientRays) : this.parentRect.width
        const rayHeight = !isHori ? (this.parentRect.height / this.totalGradientRays) : this.parentRect.height
        
        for (var i = 0; i < this.totalGradientRays; i++) {
            const rayGraphic = new Graphix()
            const calculatedRayHeight = isHori ? rayHeight : rayHeight * (i + 1)
            const calculatedRayWidth = !isHori ? rayWidth : rayWidth * (i + 1)
            const offsetX = direction === FourWayDirection.Right ? this.parentRect.width - calculatedRayWidth : 0
            const offsetY = direction === FourWayDirection.Up ? this.parentRect.height - calculatedRayHeight : 0
            const rayRect = {
                x: this.parentRect.x + offsetX,
                y: this.parentRect.y + offsetY,
                width: calculatedRayWidth,
                height: calculatedRayHeight
            }
            
            rayGraphic.beginFill(0x000000)
            rayGraphic.drawIRect(rayRect)
            rayGraphic.endFill()
            rayGraphic.alpha = options.rayAlpha

            this.rayGraphics.push(rayGraphic)
            this.addChild(rayGraphic)
        }
    }
}
