import { Assets } from '../../asset/Assets'
import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { importantLog } from '../../service/Flogger'
import { getRandomIntBetween } from '../../utils/Utils'
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

    constructor(options: MapBuildingBackgroundOptions) {
        super()

        this.type = options.type
        this.constructBackgroundTiles()
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
}
