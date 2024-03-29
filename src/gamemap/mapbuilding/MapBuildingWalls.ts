import { Assets } from '../../asset/Assets'
import { Container, IContainer } from '../../engine/display/Container'
import { RectGradient } from '../../engine/display/extra/RectGradient'
import { GradientOutline } from '../../engine/display/lighting/GradientOutline'
import { Sprite } from '../../engine/display/Sprite'
import { importantLog } from '../../service/Flogger'
import { getRandomIntBetween } from '../../utils/Math'
import { MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IMapBuildingWalls extends IContainer {

}

export interface MapBuildingWallsOptions {
    type: MapBuildingType
}

export class MapBuildingWalls extends Container implements IMapBuildingWalls {
    type: MapBuildingType
    wallSprites: Sprite[] = []
    leftGradient: RectGradient
    rightGradient: RectGradient
    outline: GradientOutline

    constructor(options: MapBuildingWallsOptions) {
        super()

        this.type = options.type
        this.constructWallTiles()
        this.outline = new GradientOutline({
            targetElement: this,
            gradientWidth: 32,
            // offsetWidth: 12,
            rayAlpha: 0.25
        })

        this.addChild(this.outline)
        // this.constructGradientEdges()
    }

    constructWallTiles() {
        const totalWalls = 10//5
        const totalVariations = MapBuildingHelper.getTotalWallTilesForType(this.type)
        let currentX = 0

        for (var i = 0; i < totalWalls; i++) {
            const randomSelection = getRandomIntBetween(1, totalVariations)
            const url = Assets.MapBuildingDir + `${this.type}/background/${randomSelection}`

            importantLog('MapBuildingWalls', 'Found wall tile URL', url)

            const texture = PIXI.Texture.from(Assets.get(url))
            const spr = new Sprite({ texture })

            spr.x = currentX
            currentX += spr.width

            this.wallSprites.push(spr)
            this.addChild(spr)
        }
    }

    // constructGradientEdges() {
    //     const gradientRect = rect(0, 0, 32, this.height)
    //     const overlapOffset = 1
    //     const gradientOptions = {
    //         definition: { rect: gradientRect, direction: FourWayDirection.Left },
    //         totalGradientRays: 5,
    //         rayAlpha: 0.15,
    //     }

    //     this.leftGradient = new RectGradient(gradientOptions)
    //     gradientOptions.definition.direction = FourWayDirection.Right
    //     this.rightGradient = new RectGradient(gradientOptions)
    //     this.rightGradient.x = this.width - this.rightGradient.width + overlapOffset
    //     this.leftGradient.x = -overlapOffset

    //     this.addChild(...[
    //         this.leftGradient,
    //         this.rightGradient
    //     ])
    // }
}
