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
        const backgroundTexture = MapBuildingHelper.getBackgroundAssetForType(options.type)
        const backgroundSprite = new Sprite({ texture: backgroundTexture })
        const floorTexture = MapBuildingHelper.getFloorAssetForType(options.type)
        const floorSprite = new Sprite({ texture: floorTexture })
        floorSprite.y = 138//142
        const collisionRects = this.buildCollisionRectsForFloor(floorSprite)
        
        tileLayer.addChild(backgroundSprite)
        tileLayer.addChild(floorSprite)
        
        backgroundSprite.x = 12//floorTexture.width / 2// - backgroundSprite.halfWidth
        // floorSprite.position.y = background.height - floorSprite.height

        return { tileLayer, collisionRects }
    }

    private buildCollisionRectsForFloor(floorSprite: ISprite): Rect[] {
        const groundRect = new Rect({
            x: 0, y: floorSprite.y,//250,
            width: 240,//floorSprite.width,
            height: 42
        })

        return [ groundRect ]
    }
}
