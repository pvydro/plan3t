import { rect } from '../../utils/Utils'
import { Container, IContainer } from '../../engine/display/Container'
import { IHomeshipical } from './Homeshipical'
import { SphericalHelper } from '../spherical/SphericalHelper'
import { RectGradient, RectGradientDefinition } from '../../engine/display/extra/RectGradient'
import { FourWayDirection } from '../../engine/math/Direction'
import { Graphix } from '../../engine/display/Graphix'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'

export interface IHomeshipicalOutline extends IContainer {
    initialize(): void
}

export interface HomeshipicalOutlineOptions {
    homeship: IHomeshipical
}

export class HomeshipicalOutline extends Container implements IHomeshipicalOutline {
    homeship: IHomeshipical
    gradients: RectGradient[]
    leftSideEdgeCover: Graphix
    topSideEdgeCover: Graphix

    constructor(options: HomeshipicalOutlineOptions) {
        super()

        this.homeship = options.homeship
        this.gradients = []
    }

    initialize() {
        this.initializeOutlineGradients()
        this.initializeEdgeCovers()
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


    initializeEdgeCovers() {
        const camera = Camera.getInstance()
        const edgeWidth = 256
        const bleedAmount = 128

        this.leftSideEdgeCover = this.getNewEdgeGraphics()
        this.topSideEdgeCover = this.getNewEdgeGraphics()
        this.leftSideEdgeCover.drawIRect({
            x: -edgeWidth,
            y: -bleedAmount, 
            width: edgeWidth,
            height: this.homeship.height + (bleedAmount * 2)
        }, true)
        this.topSideEdgeCover.drawIRect({
            x: -bleedAmount,
            y: -edgeWidth,
            width: this.homeship.width + (bleedAmount * 2),
            height: edgeWidth
        }, true)

        const edges = [
            this.leftSideEdgeCover,
            this.topSideEdgeCover
        ]

        for (var i in edges) {
            const edge = edges[i]

            camera.stage.addChildAtLayer(edge, CameraLayer.GameMapOverlay)
        }
            
    }

    removeEdgeCovers() {
        const camera = Camera.getInstance()

        camera.stage.removeFromLayer(this.leftSideEdgeCover, CameraLayer.GameMapOverlay)
    }

    getNewEdgeGraphics(): Graphix {
        const edgeColor = 0x000000
        const edge = new Graphix()

        edge.beginFill(edgeColor)

        return  edge
    }
}
