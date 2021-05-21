import { Container } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { GameMapContainerBuilderResponse } from '../GameMapContainer'
import { MapBuildingOptions, MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IBuildingBuilder {
    buildBuilding(options: MapBuildingOptions): Promise<GameMapContainerBuilderResponse>
}

export class BuildingBuilder implements IBuildingBuilder {
    constructor() {

    }

    async buildBuilding(options: MapBuildingOptions): Promise<GameMapContainerBuilderResponse> {
        const tileLayer = new Container()
        // const background = MapBuilderHelper.getBackgroundAssetForType(options.type)
        const floorTexture = MapBuildingHelper.getFloorAssetForType(options.type)
        const floorSprite = new Sprite({ texture: floorTexture })

        floorSprite.position.y = 180
        // floorSprite.position.y = background.height - floorSprite.height

        tileLayer.addChild(floorSprite)

        return {
            tileLayer,
            collisionRects: []
        }
    }

    // private buildCollisionRectsFromBuilding
}
