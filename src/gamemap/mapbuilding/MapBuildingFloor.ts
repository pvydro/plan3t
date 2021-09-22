import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IMapBuildingFloor extends IContainer {
    
}

export interface MapBuildingFloorOptions {
    type: MapBuildingType
}

export class MapBuildingFloor extends Container implements IMapBuildingFloor {
    floorSprite: Sprite

    constructor(options: MapBuildingFloorOptions) {
        super()

        const floorTexture = MapBuildingHelper.getFloorAssetForType(options.type)
        this.floorSprite = new Sprite({ texture: floorTexture })
        
        this.addChild(this.floorSprite)
    }
}
