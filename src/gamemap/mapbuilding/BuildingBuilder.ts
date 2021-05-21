import { Container } from '../../engine/display/Container'
import { ISprite, Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
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
        floorSprite.y = 180
        
        const collisionRects = this.buildCollisionRectsForFloor(floorSprite)
        // floorSprite.position.y = background.height - floorSprite.height

        tileLayer.addChild(floorSprite)

        return { tileLayer, collisionRects }
    }

    private buildCollisionRectsForFloor(floorSprite: ISprite): Rect[] {
        const groundRect = new Rect({
            x: 0, y: floorSprite.y,//250,
            width: floorSprite.width,
            height: 42
        })

        return [ groundRect ]
    }
}
