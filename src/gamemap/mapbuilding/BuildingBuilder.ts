import { Container } from '../../engine/display/Container'
import { ISprite, Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
import { GameMapContainerBuilderResponse } from '../GameMapContainer'
import { MapBuildingOptions, MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IBuildingBuilder {
    buildBuilding(options: MapBuildingOptions): Promise<BuildingBuilderResponse>
}

export interface BuildingBuilderResponse extends GameMapContainerBuilderResponse {
    floorSprite: ISprite
    backgroundSprite: ISprite
    // ceilingSprite: ISprite
}

export class BuildingBuilder implements IBuildingBuilder {
    constructor() {

    }

    async buildBuilding(options: MapBuildingOptions): Promise<BuildingBuilderResponse> {
        const tileLayer = new Container()
        const backgroundTexture = MapBuildingHelper.getBackgroundAssetForType(options.type)
        const backgroundSprite = new Sprite({ texture: PIXI.Texture.EMPTY })//backgroundTexture })
        const floorTexture = MapBuildingHelper.getFloorAssetForType(options.type)
        const floorSprite = new Sprite({ texture: floorTexture })
        floorSprite.y = 138//142
        const collisionRects = this.buildCollisionRectsForFloor(floorSprite)
        
        // tileLayer.addChild(backgroundSprite) TODO
        tileLayer.addChild(floorSprite)
        
        backgroundSprite.x = 12//floorTexture.width / 2// - backgroundSprite.halfWidth
        // floorSprite.position.y = background.height - floorSprite.height

        return { tileLayer, collisionRects, backgroundSprite, floorSprite }
    }

    private buildCollisionRectsForFloor(floorSprite: ISprite): Rect[] {
        const groundRect = new Rect({
            x: 0, y: floorSprite.y + 2,//250,
            width: floorSprite.width,//240,//floorSprite.width,
            height: 42
        })

        return [ groundRect ]
    }
}
