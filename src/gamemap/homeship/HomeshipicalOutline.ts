import { rect } from '../../utils/Utils'
import { Container, IContainer } from '../../engine/display/Container'
import { IHomeshipical } from './Homeshipical'
import { SphericalHelper } from '../spherical/SphericalHelper'
import { RectGradient, RectGradientDefinition } from '../../engine/display/extra/RectGradient'
import { FourWayDirection } from '../../engine/math/Direction'

export interface IHomeshipicalOutline extends IContainer {
    initializeOutlineGradients(): void
}

export interface HomeshipicalOutlineOptions {
    homeship: IHomeshipical
}

export class HomeshipicalOutline extends Container implements IHomeshipicalOutline {
    homeship: IHomeshipical
    gradients: RectGradient[]

    constructor(options: HomeshipicalOutlineOptions) {
        super()

        this.homeship = options.homeship
        this.gradients = []
    }

    initializeOutlineGradients() {
        const tileSize = SphericalHelper.getTileSize()
        const sideHeight = this.homeship.height
        const topWidth = this.homeship.width
        const leftRect = rect(0, 0, tileSize, sideHeight)
        const rightRect = rect(topWidth - tileSize, 0, tileSize, sideHeight)
        const topRect = rect(0, 0, topWidth, tileSize)
        const bottomRect = rect(0, this.homeship.height - tileSize, topWidth, tileSize)
        const rects: RectGradientDefinition[] = [
            { rect: leftRect, direction: FourWayDirection.Left },
            { rect: rightRect, direction: FourWayDirection.Right },
            { rect: topRect, direction: FourWayDirection.Down },
            { rect: bottomRect, direction: FourWayDirection.Up }
        ]

        for (var i in rects) {
            const rect = rects[i]
            const gradient = new RectGradient({
                definition: rect
            })

            this.gradients.push(gradient)
            this.addChild(gradient)
        }
    }
}
