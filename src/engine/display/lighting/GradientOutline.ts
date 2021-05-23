import { dimension, rect } from '../../../utils/Utils'
import { Dimension, IDimension } from '../../math/Dimension'
import { FourWayDirection } from '../../math/Direction'
import { Container, IContainer } from '../Container'
import { RectGradient, RectGradientDefinition } from '../extra/RectGradient'

export interface IGradientOutline extends IContainer {

}

export interface GradientOutlineOptions {
    targetDimension?: IDimension
    targetElement?: IContainer
    gradientWidth?: number
    offsetWidth?: number
    rayAlpha?: number
}

export class GradientOutline extends Container implements IGradientOutline {
    targetDimension: IDimension
    targetElement?: IContainer
    gradients: RectGradient[]
    gradientWidth: number
    offsetWidth: number
    rayAlpha: number

    constructor(options: GradientOutlineOptions) {
        super()

        this.gradients = []
        // this.targetElement = options.targetElement
        this.targetDimension = options.targetElement
            ? dimension(options.targetElement.width, options.targetElement.height)
            : (options.targetDimension ?? { width: 128, height: 128 })
        this.gradientWidth = options.gradientWidth ?? 16
        this.offsetWidth = options.offsetWidth ?? 0
        this.rayAlpha = options.rayAlpha ?? 0.25

        this.initializeOutlineGradients()
    }

    initializeOutlineGradients() {
        // const sideHeight = this.targetElement.height
        // const topWidth = this.targetElement.width
        const elementWidth = this.targetDimension.width// + this.offsetWidth
        const elementHeight = this.targetDimension.height
        const leftRect = rect(0 + this.offsetWidth, 0,
            this.gradientWidth, elementHeight)
        const rightRect = rect(elementWidth - this.gradientWidth// + (this.offsetWidth * 2)
            , 0,
            this.gradientWidth, elementHeight)
        const topRect = rect(0, 0, elementWidth, this.gradientWidth)
        const bottomRect = rect(0, elementHeight - this.gradientWidth, elementWidth, this.gradientWidth)
        const rects: RectGradientDefinition[] = [
            { rect: leftRect, direction: FourWayDirection.Left },
            { rect: rightRect, direction: FourWayDirection.Right },
            { rect: topRect, direction: FourWayDirection.Down },
            { rect: bottomRect, direction: FourWayDirection.Up }
        ]

        for (var i in rects) {
            const rect = rects[i]
            const gradient = new RectGradient({
                rayAlpha: this.rayAlpha,
                definition: rect
            })

            this.gradients.push(gradient)
            this.addChild(gradient)
        }
    }
}
