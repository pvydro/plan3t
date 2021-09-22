import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { Rect } from '../../engine/math/Rect'
import { MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IMapBuildingFloor extends IContainer {
    
}

export interface MapBuildingFloorOptions {
    type: MapBuildingType
}

export class MapBuildingFloor extends Container implements IMapBuildingFloor {
    floorSprite: Sprite
    // collisionRects: Rect[]

    constructor(options: MapBuildingFloorOptions) {
        super()

        const floorTexture = MapBuildingHelper.getFloorAssetForType(options.type)
        this.floorSprite = new Sprite({ texture: floorTexture })
        
        this.addChild(this.floorSprite)

        // this.collisionRects = this.buildCollisionRects()
    }

    // TODO: This positioning is broken
    // buildCollisionRects(): Rect[] {
    //     const groundRect = new Rect({
    //         x: 0, y: this.y + 20,//250,
    //         width: this.floorSprite.width,//240,//floorSprite.width,
    //         height: 42
    //     })

    //     return [ groundRect ]
    // }
}
