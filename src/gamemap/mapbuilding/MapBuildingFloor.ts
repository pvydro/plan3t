import { Container, IContainer } from '../../engine/display/Container'
import { Sprite } from '../../engine/display/Sprite'
import { FloorDecoration } from './floordecoration/FloorDecoration'
import { MapBuildingType } from './MapBuilding'
import { MapBuildingHelper } from './MapBuildingHelper'

export interface IMapBuildingFloor extends IContainer {
    
}

export interface MapBuildingFloorOptions {
    type: MapBuildingType
}

export class MapBuildingFloor extends Container implements IMapBuildingFloor {
    decoration: FloorDecoration
    floorSprites: Sprite[] = []
    totalFloors: number = 2

    constructor(options: MapBuildingFloorOptions) {
        super()

        const texture = MapBuildingHelper.getFloorAssetForType(options.type)

        for (var i = 0; i < this.totalFloors; i++) {
            const floorSprite = new Sprite({ texture })

            floorSprite.x = floorSprite.width * i

            this.addChild(floorSprite)
            this.floorSprites.push(floorSprite)
        }

        this.decoration = new FloorDecoration({ floor: this })

        this.addChild(this.decoration)
    }
}
