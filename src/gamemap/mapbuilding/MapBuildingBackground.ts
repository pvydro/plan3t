import { Assets } from '../../asset/Assets'
import { Container, IContainer } from '../../engine/display/Container'
import { RectGradient } from '../../engine/display/extra/RectGradient'
import { Sprite } from '../../engine/display/Sprite'
import { FourWayDirection } from '../../engine/math/Direction'
import { importantLog } from '../../service/Flogger'
import { getRandomIntBetween, rect } from '../../utils/Utils'
import { MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IMapBuildingBackground extends IContainer {

}

export interface MapBuildingBackgroundOptions {
    type: MapBuildingType
}

export class MapBuildingBackground extends Container {
    type: MapBuildingType
    backgroundSprites: Sprite[] = []
    leftGradient: RectGradient
    rightGradient: RectGradient

    constructor(options: MapBuildingBackgroundOptions) {
        super()

        this.type = options.type
        this.constructBackgroundTiles()
        this.constructGradientEdges()
    }

    constructBackgroundTiles() {
        const totalSprites = 5
        const totalVariations = MapBuildingHelper.getTotalBackgroundTilesForType(this.type)
        let currentX = 0

        for (var i = 0; i < totalSprites; i++) {
            const randomSelection = getRandomIntBetween(1, totalVariations)
            const url = Assets.MapBuildingDir + `${this.type}/background/${randomSelection}`

            importantLog('MapBuildingBackground', 'Found BackgroundTile URL', url)

            const texture = PIXI.Texture.from(Assets.get(url))
            const spr = new Sprite({ texture })

            spr.x = currentX
            currentX += spr.width

            this.backgroundSprites.push(spr)
            this.addChild(spr)
        }
    }

    constructGradientEdges() {
        const gradientRect = rect(0, 0, 32, this.height)
        const overlapOffset = 1
        const gradientOptions = {
            definition: { rect: gradientRect, direction: FourWayDirection.Left },
            totalGradientRays: 5,
            rayAlpha: 0.15,
        }

        this.leftGradient = new RectGradient(gradientOptions)
        gradientOptions.definition.direction = FourWayDirection.Right
        this.rightGradient = new RectGradient(gradientOptions)
        this.rightGradient.x = this.width - this.rightGradient.width + overlapOffset
        this.leftGradient.x = -overlapOffset

        this.addChild(...[
            this.leftGradient,
            this.rightGradient
        ])
    }
}
